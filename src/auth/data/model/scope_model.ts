import { Schema, model, Document } from 'mongoose';
import { required } from 'zod/mini';
import { validate } from '../helper/validator';
import { IGeoJsonPoint } from '../../domain/entities/scope-collection.entity';

export interface IScopeCollection extends Document {
    is_success: boolean,
    scopes: {
        is_scope: boolean;
        address: string;
        location: IGeoJsonPoint;
    }[]
}

export const ScopeSchema = new Schema<IScopeCollection>({
    is_success: { type: Boolean, default: false },
    scopes: [{
        is_scope: { type: Boolean, default: true },
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
    }]
}, { timestamps: true });

ScopeSchema.index({ "scopes.location": "2dsphere" });