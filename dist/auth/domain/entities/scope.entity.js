"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeCollection = exports.LatLng = void 0;
class LatLng {
    lat;
    lng;
    constructor(lat, lng) {
        if (!LatLng.isValid(lat, lng)) {
            throw new RangeError(`Invalid coordinates: Latitude (${lat}) must be between -90 and 90. Longtitude (${lng}) must be between -180 and 180.`);
        }
        this.lat = lat;
        this.lng = lng;
    }
    static isValid(lat, lng) {
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    }
    static fromGeoJson(geoJson) {
        const [lng, lat] = geoJson.coordinates;
        return new LatLng(lat, lng);
    }
    toArray() {
        return [this.lat, this.lng];
    }
    toGeoJson() {
        return {
            type: "Point",
            coordinates: [this.lng, this.lat]
        };
    }
    toString() {
        return `${this.lat.toFixed(6)},${this.lng.toFixed(6)}`;
    }
}
exports.LatLng = LatLng;
class ScopeCollection {
    is_scope;
    address;
    location;
    constructor({ is_scope = false, address = "", location }) {
        this.is_scope = is_scope;
        this.address = address;
        this.location = location;
    }
    static fromJson(json) {
        return new ScopeCollection({
            is_scope: json.is_scope,
            address: json.address,
            location: json.location
        });
    }
}
exports.ScopeCollection = ScopeCollection;
class Scope {
    scopes;
    is_success;
    constructor({ scopes = [], is_success = false }) {
        this.scopes = scopes;
        this.is_success = is_success;
    }
    static fromJson(json) {
        return new Scope({
            scopes: json.scopes.map(item => ScopeCollection.fromJson(item)),
            is_success: json.is_success,
        });
    }
}
exports.default = Scope;
