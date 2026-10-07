"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.PaymentSchema = exports.AddressDeliverySchema = exports.AddressTakeGoodsSchema = exports.ProductSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const pick_time_model_1 = require("./pick_time_model");
exports.ProductSchema = new mongoose_1.Schema({
    name_product: { type: String, trim: true, required: true },
    type_product: { type: String, trim: true, required: true },
    amount: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    length: { type: Number, required: true },
    index: { type: Number, default: 0, required: true }
}, { _id: false });
exports.AddressTakeGoodsSchema = new mongoose_1.Schema({
    method: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    scope: { type: String, trim: true, required: true }
}, { _id: false });
exports.AddressDeliverySchema = new mongoose_1.Schema({
    method: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    scope: { type: String, trim: true, required: true }
}, { _id: false });
exports.PaymentSchema = new mongoose_1.Schema({
    type_payment: { type: String, trim: true, required: true },
    step_payment: { type: Number, required: true }
}, { _id: false });
exports.OrderSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    order_code: { type: String, trim: true, required: true, unique: true },
    status_delivery: { type: String, default: "Confirm" },
    status_schedule: { type: pick_time_model_1.PickTimeSchema, default: null },
    product: { type: exports.ProductSchema, required: true },
    address_take_goods: { type: exports.AddressTakeGoodsSchema, required: true },
    address_delivery: { type: exports.AddressDeliverySchema, required: true },
    payment: { type: exports.PaymentSchema, required: true }
}, { _id: true, timestamps: true });
