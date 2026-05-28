"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    id: String,
    email: { type: String, required: true },
    name: String,
    type: { type: String, required: true },
    password: String,
});
