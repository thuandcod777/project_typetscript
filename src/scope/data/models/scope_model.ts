import { Schema, model, Document } from 'mongoose';
import { IGeoJsonPoint } from '../../domain/scope';
import { required } from 'zod/mini';
import { validate } from '../../../auth/data/helper/validator';

export interface IScopeCollection extends Document {
    email: string;
    scopes: {
        address: string;
        location: IGeoJsonPoint;
    }
}

export const IScopeSchema = new Schema<IScopeCollection>({
    email: { type: String, required: true, trim: true },
    scopes: [{
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

IScopeSchema.index({ "scopes.location": "2dsphere" });