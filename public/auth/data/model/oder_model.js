"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = void 0;
const mongoose_1 = require("mongoose");
exports.OrderSchema = new mongoose_1.Schema({
    namePerson: { type: String, required: true },
    nameProduct: { type: String, required: true },
    numberProduct: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
});
