"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.AddressDelivery = exports.AddressTakeGoods = exports.Product = void 0;
const pick_time_entity_1 = require("./pick-time.entity");
class Product {
    name_product;
    type_product;
    amount;
    width;
    height;
    weight;
    length;
    constructor({ name_product = "", type_product = "Select Type Product", amount = 0, width = 0, height = 0, weight = 0, length = 0 } = {}) {
        this.name_product = name_product;
        this.type_product = type_product;
        this.amount = amount;
        this.width = width;
        this.height = height;
        this.weight = weight;
        this.length = length;
    }
    static fromJson(json) {
        return new Product({
            name_product: json.name_product,
            type_product: json.type_product,
            // Chuyển đổi sang number đề phòng trường hợp nhận vào kiểu string giống int.parse() trong Dart
            amount: typeof json.amount === 'string' ? parseInt(json.amount, 10) : json.amount,
            width: typeof json.width === 'string' ? parseInt(json.width, 10) : json.width,
            height: typeof json.height === 'string' ? parseInt(json.height, 10) : json.height,
            weight: typeof json.weight === 'string' ? parseInt(json.weight, 10) : json.weight,
            length: typeof json.length === 'string' ? parseInt(json.length, 10) : json.length,
        });
    }
    toMap() {
        return {
            "name_product": this.name_product,
            "type_product": this.type_product,
            "amount": this.amount,
            "width": this.width,
            "height": this.height,
            "length": this.length,
            "weight": this.weight,
        };
    }
}
exports.Product = Product;
class AddressTakeGoods {
    method;
    address;
    scope;
    constructor({ method = "", address = "", scope = "Select Scope" } = {}) {
        this.method = method;
        this.address = address;
        this.scope = scope;
    }
    static fromJson(json) {
        return new AddressTakeGoods({
            method: json.method,
            address: json.address,
            scope: json.scope,
        });
    }
    toMap() {
        return { "method": this.method, "address": this.address, "scope": this.scope };
    }
}
exports.AddressTakeGoods = AddressTakeGoods;
class AddressDelivery {
    method;
    address;
    scope;
    constructor({ method = "", address = "", scope = "Select Scope" } = {}) {
        this.method = method;
        this.address = address;
        this.scope = scope;
    }
    static fromJson(json) {
        return new AddressDelivery({
            method: json.method,
            address: json.address,
            scope: json.scope,
        });
    }
    toMap() {
        return { "method": this.method, "address": this.address, "scope": this.scope };
    }
}
exports.AddressDelivery = AddressDelivery;
class Payment {
    type_payment;
    step_payment;
    constructor({ type_payment = "", step_payment = 0 } = {}) {
        this.type_payment = type_payment;
        this.step_payment = step_payment;
    }
    static fromJson(json) {
        return new Payment({
            type_payment: json.type_payment,
            step_payment: json.step_payment,
        });
    }
    toMap() {
        return { "type_payment": this.type_payment, "step_payment": this.step_payment };
    }
}
exports.Payment = Payment;
class Order {
    user_id;
    order_code;
    status_delivery;
    status_schedule;
    product;
    address_take_goods;
    address_delivery;
    payment;
    constructor({ user_id = null, order_code = "", status_delivery = "Confirm", status_schedule = null, product, address_take_goods, address_delivery, payment }) {
        this.user_id = user_id;
        this.order_code = order_code;
        this.status_delivery = status_delivery;
        this.status_schedule = status_schedule;
        this.product = product;
        this.address_take_goods = address_take_goods;
        this.address_delivery = address_delivery;
        this.payment = payment;
    }
    static fromJson(json) {
        return new Order({
            user_id: json.user_id ?? null,
            order_code: json.order_code,
            status_delivery: json.status_delivery,
            status_schedule: json.status_schedule ? pick_time_entity_1.PickTime.fromJson(json.status_schedule) : null,
            product: Product.fromJson(json.product),
            address_take_goods: AddressTakeGoods.fromJson(json.address_take_goods),
            address_delivery: AddressDelivery.fromJson(json.address_delivery),
            payment: Payment.fromJson(json.payment),
        });
    }
}
exports.default = Order;
