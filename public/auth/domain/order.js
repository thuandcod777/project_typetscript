"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Order {
    constructor(id, namePerson, nameProduct, numberProduct, orderDate) {
        this.id = id;
        this.namePerson = namePerson;
        this.nameProduct = nameProduct;
        this.numberProduct = numberProduct;
        this.orderDate = orderDate;
    }
}
exports.default = Order;
