export class Contact {
    name_enterprise: string;
    name_client: string;
    email: string;
    address: string;
    number_phone: string;
    name_product: string;
    amount: number;
    type: string;
    workday: string;

    constructor({ name_enterprise = '',
        name_client = '',
        email = '',
        address = '',
        number_phone = '',
        name_product = '',
        amount = 0,
        type = '',
        workday = '' }: Partial<Contact> = {}) {
        this.name_enterprise = name_enterprise;
        this.name_client = name_client;
        this.email = email;
        this.address = address;
        this.name_product = name_product;
        this.number_phone = number_phone;
        this.amount = amount;
        this.type = type;
        this.workday = name_enterprise;
    }
}