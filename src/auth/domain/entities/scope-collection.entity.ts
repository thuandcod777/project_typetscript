

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


export interface IScopeCollectionJson {
    isScope: boolean;
    address: string;
    location: IGeoJsonPoint;
}

export class ScopeCollection {
    readonly isScope: boolean;
    readonly address: string;
    readonly latlng: LatLng;

    constructor({ isScope = false, address = "", latlng }: {
        isScope?: boolean, address?: string, latlng: LatLng
    }) {
        this.isScope = isScope;
        this.address = address;
        this.latlng = latlng;
    }


    static fromJson(json: IScopeCollectionJson): ScopeCollection {
        return new ScopeCollection({
            isScope: json.isScope,
            address: json.address,
            latlng: LatLng.fromGeoJson(json.location)
        });
    }

}