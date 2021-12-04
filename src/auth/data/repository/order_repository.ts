import IAuthRepository from "../../domain/iauth_repository";
import User from "../../domain/user";
import { Mongoose } from "mongoose";
import { UserModel, UserSchema } from "../model/user_model";
import { OrderModel, OrderSchema } from "../model/oder_model";
import IOrderRepository from "../../domain/iorder_repository";

export default class OrderRepository implements IOrderRepository {

    constructor(private readonly client: Mongoose) { }

    public async saveOrder(namePerson: string, nameProduct: string, numberProduct: number, orderDate: Date): Promise<string> {
        const billorder = this.client.model<OrderModel>('Order', OrderSchema)

        const saveBill = await billorder.create({
            namePerson: namePerson,
            nameProduct: nameProduct,
            numberProduct: numberProduct,
            orderDate: orderDate,
        })

        saveBill.save()

        return saveBill.id
    }

}