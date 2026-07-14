

export interface IGeoJsonPoint {
    type: 'Point';
    coordinates: [number, number];
}

export interface ILatLng {
    lat: number;
    lng: number;
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


export interface IScopeCollectionJson {
    is_scope: boolean;
    address: string;
    location: IGeoJsonPoint;
}

export class ScopeCollection {
    readonly is_scope: boolean;
    readonly address: string;
    readonly location: IGeoJsonPoint;

    constructor({ is_scope = false, address = "", location }: {
        is_scope?: boolean, address?: string, location: IGeoJsonPoint
    }) {
        this.is_scope = is_scope;
        this.address = address;
        this.location = location;
    }


    static fromJson(json: IScopeCollectionJson): ScopeCollection {
        return new ScopeCollection({
            is_scope: json.is_scope,
            address: json.address,
            location: json.location
        });
    }

}

export interface IScopeJSON {
    scopes: IScopeCollectionJson[];
    is_success: boolean;
    is_verify_scope: boolean;
}

export default class Scope {
    readonly scopes: ScopeCollection[];
    readonly is_success: boolean;
    readonly is_verify_scope: boolean;

    constructor({ scopes, is_success, is_verify_scope }: {
        scopes: ScopeCollection[],
        is_success: boolean,
        is_verify_scope: boolean
    } = { scopes: [], is_success: false, is_verify_scope: false }) {
        this.scopes = scopes;
        this.is_success = is_success;
        this.is_verify_scope = is_verify_scope;
    }

    public static fromJson(json: IScopeJSON): Scope {
        return new Scope({
            scopes: json.scopes.map(item => ScopeCollection.fromJson(item)),
            is_success: json.is_success,
            is_verify_scope: json.is_verify_scope
        });

    }
}