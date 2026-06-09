import OrderModel, { AddressDeliveryModel, AddressTakeGoodsModel, PaymentModel, ProductModel } from "../../domain/order";
import FindOrderUsecase from "../../usecase/find_order_usecase";
import OrderUsecase from "../../usecase/order_usercase";
import { IAddressDelivery, IAddressTakeGoods, IOrder, IPayment, IProduct } from "../models/order_model";
import { Request, Response } from 'express';
import { z } from 'zod';
/* type RequestProduct = {
    nameProduct: string;
    typeProduct: string;
    amount: number;
    width: number;
    height: number;
    weight: number;
    length: number;
    index?: number;
}

type RequestAddress = {
    method?: string;
    address?: string;
    scope?: string;
    methodAddressTakeGoods?: string;
    addressAddressTakeGoods?: string;
    scopeAddressTakeGoods?: string;
    methodDelivery?: string;
    addressDelivery?: string;
    scopeDelivery?: string;
}

type RequestPayment = {
    typePayment: string;
    stepPayment: number;
}

type OrderRequestBody = {
    orderCode: string;
    statusDelivery: string;
    statusPickTime: boolean;
    product: RequestProduct;
    addressTakeGoods: RequestAddress;
    addressDelivery: RequestAddress;
    payment: RequestPayment;
} */

const OrderModelSchema = z.object({
    orderCode: z.string(),
    statusDelivery: z.string(),
    statusPickTime: z.boolean(),
    product: z.object({
        nameProduct: z.string(),
        typeProduct: z.string(),
        amount: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
        weight: z.number().positive(),
        length: z.number().positive()
    }),
    addressTakeGoods: z.object({
        method: z.string(),
        address: z.string(),
        scope: z.string()
    }),
    addressDelivery: z.object({
        method: z.string(),
        address: z.string(),
        scope: z.string()
    }),
    payment: z.object({
        typePayment: z.string(),
        stepPayment: z.number().int()
    })
})

type IOrderModel = z.infer<typeof OrderModelSchema>;

export default class OrderController {
    private readonly orderUsecase: OrderUsecase;
    private readonly findOrderUsecase: FindOrderUsecase;
    constructor(orderUseCase: OrderUsecase, findOrderUsecase: FindOrderUsecase) {
        this.orderUsecase = orderUseCase
        this.findOrderUsecase = findOrderUsecase
    }

    public async saveOrder(req: Request, res: Response) {
        try {
            /*  const { orderCode, statusDelivery, statusPickTime, product, addressTakeGoods, addressDelivery, payment } = req.body as OrderRequestBody;
 
             const normalizedProduct: RequestProduct = {
                 ...(product ?? {}),
                 index: product?.index ?? 0
             }
 
             const normalizedAddressTakeGoods = {
                 method: addressTakeGoods?.method || addressTakeGoods?.methodAddressTakeGoods || "",
                 address: addressTakeGoods?.address || addressTakeGoods?.addressAddressTakeGoods || "",
                 scope: addressTakeGoods?.scope || addressTakeGoods?.scopeAddressTakeGoods || ""
             }
 
             const normalizedAddressDelivery = {
                 method: addressDelivery?.method || addressDelivery?.methodDelivery || "",
                 address: addressDelivery?.address || addressDelivery?.addressDelivery || "",
                 scope: addressDelivery?.scope || addressDelivery?.scopeDelivery || ""
             }
 
             const missingFields: string[] = [];
             if (!orderCode) missingFields.push('orderCode');
             if (!statusDelivery) missingFields.push('statusDelivery');
             if (typeof statusPickTime !== 'boolean') missingFields.push('statusPickTime');
             if (!product) missingFields.push('product');
             if (!normalizedProduct.nameProduct) missingFields.push('product.nameProduct');
             if (!normalizedProduct.typeProduct) missingFields.push('product.typeProduct');
             if (normalizedProduct.amount === undefined || normalizedProduct.amount === null) missingFields.push('product.amount');
             if (normalizedProduct.width === undefined || normalizedProduct.width === null) missingFields.push('product.width');
             if (normalizedProduct.height === undefined || normalizedProduct.height === null) missingFields.push('product.height');
             if (normalizedProduct.weight === undefined || normalizedProduct.weight === null) missingFields.push('product.weight');
             if (normalizedProduct.length === undefined || normalizedProduct.length === null) missingFields.push('product.length');
             if (normalizedAddressTakeGoods.method === undefined || normalizedAddressTakeGoods.method === null || normalizedAddressTakeGoods.method === "") missingFields.push('addressTakeGoods.method');
             if (normalizedAddressTakeGoods.address === undefined || normalizedAddressTakeGoods.address === null || normalizedAddressTakeGoods.address === "") missingFields.push('addressTakeGoods.address');
             if (normalizedAddressTakeGoods.scope === undefined || normalizedAddressTakeGoods.scope === null || normalizedAddressTakeGoods.scope === "") missingFields.push('addressTakeGoods.scope');
             if (normalizedAddressDelivery.method === undefined || normalizedAddressDelivery.method === null || normalizedAddressDelivery.method === "") missingFields.push('addressDelivery.method');
             if (normalizedAddressDelivery.address === undefined || normalizedAddressDelivery.address === null || normalizedAddressDelivery.address === "") missingFields.push('addressDelivery.address');
             if (normalizedAddressDelivery.scope === undefined || normalizedAddressDelivery.scope === null || normalizedAddressDelivery.scope === "") missingFields.push('addressDelivery.scope');
             if (!payment) missingFields.push('payment');
             if (!payment?.typePayment) missingFields.push('payment.typePayment');
             if (payment?.stepPayment === undefined || payment?.stepPayment === null) missingFields.push('payment.stepPayment');
 
             if (missingFields.length) {
                 return res.status(400).json({
                     error: 'Missing required fields',
                     missingFields
                 })
             }
 
             const productModelData = new ProductModel(normalizedProduct);
 
             const addressTakeGoodsData = new AddressTakeGoodsModel(normalizedAddressTakeGoods);
 
             const addressDeliveryData = new AddressDeliveryModel(normalizedAddressDelivery);
 
             const paymentData = new PaymentModel(payment);
 
             const orderModelData = new OrderModel({
                 orderCode,
                 statusDelivery,
                 statusPickTime,
                 product: productModelData,
                 addressTakeGoods: addressTakeGoodsData,
                 addressDelivery: addressDeliveryData,
                 payment: paymentData
             }); */
            const safeModelData: IOrderModel = OrderModelSchema.parse(req.body);

            const productModelData = new ProductModel(safeModelData.product);
            const addressTakeGoodsData = new AddressTakeGoodsModel(safeModelData.addressTakeGoods);
            const addressDeliveryData = new AddressDeliveryModel(safeModelData.addressDelivery);
            const paymentData = new PaymentModel(safeModelData.payment);

            const orderModelData = new OrderModel({
                orderCode: safeModelData.orderCode,
                statusDelivery: safeModelData.statusDelivery,
                statusPickTime: safeModelData.statusPickTime,
                product: productModelData,
                addressTakeGoods: addressTakeGoodsData,
                addressDelivery: addressDeliveryData,
                payment: paymentData
            });

            const isSuccess = await this.orderUsecase.execute(orderModelData);

            return res.status(200).json({ isSuccess: isSuccess, status: "Đặt hàng thành công" });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }

    public async findOrder(req: Request, res: Response) {
        try {
            const { orderCode } = req.body;
            const isSuccess = await this.findOrderUsecase.execute(orderCode);
            return res.status(200).json({ isSuccess: true, status: " thành công" });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
}