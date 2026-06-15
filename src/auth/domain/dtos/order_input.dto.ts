export interface IOrderInputDTO {
    orderCode: string;
    statusDelivery: string;
    product: IProductInputDTO;
    addressTakeGoods: IAddressTakeGoodsInputDTO;
    addressDelivery: IAddressDeliveryInputDTO;
    payment: IPaymentInputDTO;
}

export interface IProductInputDTO {
    nameProduct: string;
    typeProduct: string;
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
    typePayment: string;
    stepPayment: number;
}


