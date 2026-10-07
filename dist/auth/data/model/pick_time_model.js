"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickTimeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PickTimeSchema = new mongoose_1.Schema({
    name_sender: { type: String, trim: true, required: true },
    number_phone: { type: String, trim: true, required: true },
    license: { type: String, trim: true, required: true },
    pick_time: { type: String, trim: true, required: true },
    status_pick_time: { type: String, enum: ['pending', 'completed', 'cancel'], default: 'pending', required: true },
}, { _id: true, timestamps: true });
