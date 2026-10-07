"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractDetails = void 0;
class ContractDetails {
    number_contract;
    name_client_a;
    name_business_owner_b;
    name_enterprise_a;
    name_enterprise_b;
    business_register_number_a;
    business_register_number_b;
    name_product;
    type_weight;
    type_product;
    pickup_location;
    delivery_location;
    method_contract;
    method_delivery;
    method_payment;
    constructor({ number_contract = '', name_client_a = '', name_business_owner_b = '', name_enterprise_a = '', name_enterprise_b = '', business_register_number_a = "", business_register_number_b = "", name_product = '', type_weight = '', type_product = '', pickup_location = '', delivery_location = '', method_contract = '', method_delivery = '', method_payment = '' } = {}) {
        this.number_contract = number_contract;
        this.name_client_a = name_client_a;
        this.name_business_owner_b = name_business_owner_b;
        this.name_enterprise_a = name_enterprise_a;
        this.name_enterprise_b = name_enterprise_b;
        this.business_register_number_a = business_register_number_a;
        this.business_register_number_b = business_register_number_b;
        this.name_product = name_product;
        this.type_weight = type_weight;
        this.type_product = type_product;
        this.pickup_location = pickup_location;
        this.delivery_location = delivery_location;
        this.method_contract = method_contract;
        this.method_delivery = method_delivery;
        this.method_payment = method_payment;
    }
    static fromJson(json) {
        return new ContractDetails(json);
    }
}
exports.ContractDetails = ContractDetails;
