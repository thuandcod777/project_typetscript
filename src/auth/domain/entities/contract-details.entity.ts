
export interface IContractDetailsJSON {
    number_contract: string;
    name_client_a: string;
    name_business_owner_b: string;
    name_enterprise_a: string;
    name_enterprise_b: string;
    business_register_number_a: string;
    business_register_number_b: string;
    name_product: string;
    type_weight: string;
    type_product: string;
    pickup_location: string;
    delivery_location: string;
    method_contract: string;
    method_delivery: string;
    method_payment: string;
}

export class ContractDetails {
    number_contract: string;
    name_client_a: string;
    name_business_owner_b: string;
    name_enterprise_a: string;
    name_enterprise_b: string;
    business_register_number_a: string;
    business_register_number_b: string;
    name_product: string;
    type_weight: string;
    type_product: string;
    pickup_location: string;
    delivery_location: string;
    method_contract: string;
    method_delivery: string;
    method_payment: string;

    constructor({ number_contract = '', name_client_a = '', name_business_owner_b = '', name_enterprise_a = '', name_enterprise_b = '', business_register_number_a = "", business_register_number_b = "", name_product = '', type_weight = '', type_product = '', pickup_location = '', delivery_location = '', method_contract = '', method_delivery = '', method_payment = '' }: Partial<IContractDetailsJSON> = {}) {
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

    static fromJson(json: ContractDetails): ContractDetails {
        return new ContractDetails({
            number_contract: json.number_contract,
            name_client_a: json.name_client_a,
            name_business_owner_b: json.name_business_owner_b,
            name_enterprise_a: json.name_enterprise_a,
            name_enterprise_b: json.name_enterprise_b,
            business_register_number_a: json.business_register_number_a,
            business_register_number_b: json.business_register_number_b,
            name_product: json.name_product,
            type_weight: json.type_weight,
            type_product: json.type_product,
            pickup_location: json.pickup_location,
            delivery_location: json.delivery_location,
            method_contract: json.method_contract,
            method_delivery: json.method_delivery,
            method_payment: json.method_payment,
        });
    }
}