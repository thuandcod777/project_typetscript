import { Schema } from 'mongoose';

export interface IGeoJsonPoint {
    type: "Point",
    coordinates: [number, number];
}

export interface IScopeItem {
    is_scope: boolean;
    address: string;
    location: IGeoJsonPoint;
}

export interface IScopeCollection {
    scopes: IScopeItem[],
    is_success: boolean,
}

export const ScopeItemSchema = new Schema<IScopeItem>({
    is_scope: { type: Boolean, default: false },
    address: {
        type: String,
        default: "",
        trim: true
    },
    location: {
        type: {
            type: String, enum: ["Point"], required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function (coords: [number, number]) {
                    const [lng, lat] = coords;
                    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
                },
                message: "Invalid coordinates: Latitude must be [-90,90] and Longitude must be [-180,180]."
            }
        }
    }
}, { _id: false });

export const ScopeSchema = new Schema<IScopeCollection>({
    scopes: [ScopeItemSchema],
    is_success: { type: Boolean, default: false },
}, { timestamps: true });

ScopeSchema.index({ "scopes.location": "2dsphere" });