export interface IOrderInputDTO {
    email: string;
    order_code: string;
    status_delivery: string;
    product: IProductInputDTO;
    address_take_goods: IAddressTakeGoodsInputDTO;
    address_delivery: IAddressDeliveryInputDTO;
    payment: IPaymentInputDTO;
}

export interface IProductInputDTO {
    name_product: string;
    type_product: string;
    amount: number;
    width: number;
    height: number;
    weight: number;
    length: number;
}

export interface IAddressTakeGoodsInputDTO {
    method: string;
    address: string;
    scope: string;
}

export interface IAddressDeliveryInputDTO {
    method: string;
    address: string;
    scope: string;
}

export interface IPaymentInputDTO {
    type_payment: string;
    step_payment: number;
}


