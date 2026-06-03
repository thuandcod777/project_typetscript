import e from "express";

export interface ILatLng {
    lat: number;
    lng: number;
}

export interface IGeoJsonPoint {
    type: "Point";
    coordinates: [number, number];
}

export class LatLng implements ILatLng {
    public readonly lat: number;
    public readonly lng: number;

    constructor(lat: number, lng: number) {
        if (!LatLng.isValid(lat, lng)) {
            throw new RangeError(`Invalid coordinates: Latitude (${lat}) must be between -90 and 90. Longtitude (${lng}) must be between -180 and 180.`);

        }
        this.lat = lat;
        this.lng = lng;
    }

    public static isValid(lat: number, lng: number): boolean {
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    }

    public static fromGeoJson(geoJson: IGeoJsonPoint): LatLng {
        const [lng, lat] = geoJson.coordinates;
        return new LatLng(lat, lng);
    }

    public toArray(): [number, number] {
        return [this.lat, this.lng];
    }

    public toGeoJson(): IGeoJsonPoint {
        return {
            type: "Point",
            coordinates: [this.lng, this.lat]
        };
    }

    public toString(): string {
        return `${this.lat.toFixed(6)},${this.lng.toFixed(6)}`;
    }
}

export interface IScopeJson {
    address: string;
    location: IGeoJsonPoint;
}

export class ScopeModel {
    readonly address: string;
    readonly latlng: LatLng;

    constructor({ address = "", latlng }: {
        address?: string, latlng: LatLng
    }) {
        this.address = address;
        this.latlng = latlng;
    }


    static fromJson(json: IScopeJson): ScopeModel {
        return new ScopeModel({
            address: json.address,
            latlng: LatLng.fromGeoJson(json.location)
        });
    }

}


export interface IScopeCollectionJson {
    _id: string;
    email: string;
    scopes: IScopeJson[];
}

export default class ScopeCollectionModel {
    readonly id: string;
    readonly email: string;
    readonly scopes: ScopeModel[];

    constructor({ id, email, scopes }: {
        id: string;
        email: string;
        scopes: ScopeModel[]
    }) {
        this.id = id;
        this.email = email;
        this.scopes = scopes;
    }

    public static fromJson(json: IScopeCollectionJson): ScopeCollectionModel {
        const scopes = json.scopes.map(item => ScopeModel.fromJson(item));

        return new ScopeCollectionModel({
            id: json._id,
            email: json.email,
            scopes: scopes
        });

    }
}
