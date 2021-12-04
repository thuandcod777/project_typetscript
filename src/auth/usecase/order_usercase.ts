import IOrderRepository from "../domain/iorder_repository";


export default class OrderUsecase {
    constructor(private orderRepository: IOrderRepository) { }

    public async execute(namePerson: string, nameProduct: string, numberProduct: number, orderDate: Date): Promise<string> {
        /* const user = await this.authRepository.find(email).catch((_) => null);

        if (user) return Promise.reject('User already exists')

        let passwordHash

        if (password) {
            passwordHash = await this.passwordService.hash(password)
        } else {
            passwordHash = undefined
        } */

        /*  if(user) return Promise.reject('User ready exists')
*/
        const orderId = await this.orderRepository.saveOrder(namePerson, nameProduct, numberProduct, orderDate)

        return orderId
    }

}