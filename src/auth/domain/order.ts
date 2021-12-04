export default class Order {
    constructor(public readonly id: string,
        public readonly namePerson: string,
        public readonly nameProduct: string,
        public readonly numberProduct: string,
        public readonly orderDate: string,
    ) { }
}