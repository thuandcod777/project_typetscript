export default interface IOrderRepository {
    saveOrder(namePerson: string, nameProduct: string, numberProduct: number, orderDate: Date): Promise<string>
}