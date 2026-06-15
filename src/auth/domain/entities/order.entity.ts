import { PickTime } from "./pick_time.entity";

interface IProductJSON {
    name_product: string;
    type_product: string;
    amount: string | number; // Đề phòng API trả về string như code gốc int.parse()
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

interface IOrderJSON {
    orderCode: string;
    status_delivery: string;
    status_pick_time: boolean;
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
    readonly userId: string;
    readonly orderCode: string;
    readonly statusDelivery: string;
    readonly statusPickTime: PickTime | null;
    readonly product: Product;
    readonly addressTakeGoods: AddressTakeGoods;
    readonly addressDelivery: AddressDelivery;
    readonly payment: Payment;

    constructor({
        userId = "",
        orderCode = "",
        statusDelivery = "Confirm",
        statusPickTime = null,
        product,
        addressTakeGoods,
        addressDelivery,
        payment }: {
            userId?: string,
            orderCode?: string;
            statusDelivery?: string;
            statusPickTime?: PickTime | null;
            product: Product;
            addressTakeGoods: AddressTakeGoods;
            addressDelivery: AddressDelivery;
            payment: Payment;
        }) {
        this.userId = userId;
        this.orderCode = orderCode;
        this.statusDelivery = statusDelivery;
        this.statusPickTime = statusPickTime;
        this.product = product;
        this.addressTakeGoods = addressTakeGoods;
        this.addressDelivery = addressDelivery;
        this.payment = payment;
    }

    static fromJson(json: any): Order {
        return new Order({
            userId: json.userId,
            orderCode: json.orderCode,
            statusDelivery: json.statusDelivery,
            statusPickTime: json.statusPickTime ? PickTime.fromJson(json.statusPickTime) : null,
            product: Product.fromJson(json.product),
            addressTakeGoods: AddressTakeGoods.fromJson(json.addressTakeGoods),
            addressDelivery: AddressDelivery.fromJson(json.addressDelivery),
            payment: Payment.fromJson(json.payment),
        });
    }
}

