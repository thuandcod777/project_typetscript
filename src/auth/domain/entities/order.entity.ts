import { PickTime, IPickTimeJSON } from "./pick-time.entity";

interface IProductJSON {
    name_product: string;
    type_product: string;
    amount: string | number;
    width: string | number;
    height: string | number;
    weight: string | number;
    length: string | number;
}

interface IAddressJSON {
    method: string;
    address: string;
    scope: string;
}

interface IPaymentJSON {
    type_payment: string;
    step_payment: number;
}

export interface IOrderJSON {
    user_id: string;
    order_code: string;
    status_delivery: string;
    status_pick_time: IPickTimeJSON | null;
    product: IProductJSON;
    address_take_goods: IAddressJSON;
    address_delivery: IAddressJSON;
    payment: IPaymentJSON;
}


export class Product {
    nameProduct: string;
    typeProduct: string;
    amount: number;
    width: number;
    height: number;
    weight: number;
    length: number;
    index: number;

    constructor({ nameProduct = "", typeProduct = "Select Type Product", amount = 0, width = 0, height = 0, weight = 0, length = 0, index = 0 }: Partial<Product> = {}) {
        this.nameProduct = nameProduct;
        this.typeProduct = typeProduct;
        this.amount = amount;
        this.width = width;
        this.height = height;
        this.weight = weight;
        this.length = length;
        this.index = index;
    }

    static fromJson(json: IProductJSON): Product {
        return new Product({
            nameProduct: json.name_product,
            typeProduct: json.type_product,
            // Chuyển đổi sang number đề phòng trường hợp nhận vào kiểu string giống int.parse() trong Dart
            amount: typeof json.amount === 'string' ? parseInt(json.amount, 10) : json.amount,
            width: typeof json.width === 'string' ? parseInt(json.width, 10) : json.width,
            height: typeof json.height === 'string' ? parseInt(json.height, 10) : json.height,
            weight: typeof json.weight === 'string' ? parseInt(json.weight, 10) : json.weight,
            length: typeof json.length === 'string' ? parseInt(json.length, 10) : json.length,
        });
    }

    toMap(): Record<string, any> {
        return {
            "name_product": this.nameProduct,
            "type_product": this.typeProduct,
            "amount": this.amount,
            "width": this.width,
            "height": this.height,
            "length": this.length,
            "weight": this.weight,
        };
    }
}

export class AddressTakeGoods {
    method: string;
    address: string;
    scope: string;

    constructor({ method = "", address = "", scope = "Select Scope" }: Partial<AddressTakeGoods> = {}) {
        this.method = method;
        this.address = address;
        this.scope = scope;
    }

    static fromJson(json: IAddressJSON): AddressTakeGoods {
        return new AddressTakeGoods({
            method: json.method,
            address: json.address,
            scope: json.scope,
        });
    }

    toMap(): Record<string, any> {
        return { "method": this.method, "address": this.address, "scope": this.scope };
    }
}

export class AddressDelivery {
    method: string;
    address: string;
    scope: string;

    constructor({ method = "", address = "", scope = "Select Scope" }: Partial<AddressDelivery> = {}) {
        this.method = method;
        this.address = address;
        this.scope = scope;
    }

    static fromJson(json: IAddressJSON): AddressDelivery {
        return new AddressDelivery({
            method: json.method,
            address: json.address,
            scope: json.scope,
        });
    }

    toMap(): Record<string, any> {
        return { "method": this.method, "address": this.address, "scope": this.scope };
    }
}

export class Payment {
    typePayment: string;
    stepPayment: number;

    constructor({ typePayment = "", stepPayment = 0 }: Partial<Payment> = {}) {
        this.typePayment = typePayment;
        this.stepPayment = stepPayment;
    }

    static fromJson(json: IPaymentJSON): Payment {
        return new Payment({
            typePayment: json.type_payment,
            stepPayment: json.step_payment,
        });
    }

    toMap(): Record<string, any> {
        return { "type_payment": this.typePayment, "step_payment": this.stepPayment };
    }
}

export default class Order {
    readonly user_id: string;
    readonly order_code: string;
    readonly status_delivery: string;
    readonly status_pick_time: PickTime | null;
    readonly product: Product;
    readonly address_take_goods: AddressTakeGoods;
    readonly address_delivery: AddressDelivery;
    readonly payment: Payment;

    constructor({
        user_id = "",
        order_code = "",
        status_delivery = "Confirm",
        status_pick_time = null,
        product,
        address_take_goods,
        address_delivery,
        payment }: {
            user_id?: string,
            order_code?: string;
            status_delivery?: string;
            status_pick_time?: PickTime | null;
            product: Product;
            address_take_goods: AddressTakeGoods;
            address_delivery: AddressDelivery;
            payment: Payment;
        }) {
        this.user_id = user_id;
        this.order_code = order_code;
        this.status_delivery = status_delivery;
        this.status_pick_time = status_pick_time;
        this.product = product;
        this.address_take_goods = address_take_goods;
        this.address_delivery = address_delivery;
        this.payment = payment;
    }

    static fromJson(json: IOrderJSON): Order {
        return new Order({
            user_id: json.user_id,
            order_code: json.order_code,
            status_delivery: json.status_delivery,
            status_pick_time: json.status_pick_time ? PickTime.fromJson(json.status_pick_time) : null,
            product: Product.fromJson(json.product),
            address_take_goods: AddressTakeGoods.fromJson(json.address_take_goods),
            address_delivery: AddressDelivery.fromJson(json.address_delivery),
            payment: Payment.fromJson(json.payment),
        });
    }
}

