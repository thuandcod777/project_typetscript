"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeSchema = exports.ScopeItemSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ScopeItemSchema = new mongoose_1.Schema({
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
                validator: function (coords) {
                    const [lng, lat] = coords;
                    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
                },
                message: "Invalid coordinates: Latitude must be [-90,90] and Longitude must be [-180,180]."
            }
        }
    }
}, { _id: false });
exports.ScopeSchema = new mongoose_1.Schema({
    scopes: [exports.ScopeItemSchema],
    is_success: { type: Boolean, default: false },
}, { timestamps: true });
exports.ScopeSchema.index({ "scopes.location": "2dsphere" });
