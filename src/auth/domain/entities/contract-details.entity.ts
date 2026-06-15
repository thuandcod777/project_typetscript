export interface IContractDetailsJSON {
    nameBrandA: string;
    nameBrandB: string;
    numberPhone: number;
    businessRegisterNumber: number;
    numberContract: number;
    nameProduct: string;
    typeWeight: string;
    typeProduct: string;
    addressStart: string;
    addressEnd: string;
    methodContract: string;
    methodDelivery: string;
    methodPayment: string;
}

export class ContractDetails {
    nameBrandA: string;
    nameBrandB: string;
    numberPhone: number;
    businessRegisterNumber: number;
    numberContract: number;
    nameProduct: string;
    typeWeight: string;
    typeProduct: string;
    addressStart: string;
    addressEnd: string;
    methodContract: string;
    methodDelivery: string;
    methodPayment: string;

    constructor({ nameBrandA = '', nameBrandB = '', numberPhone = 0, businessRegisterNumber = 0, numberContract = 0, nameProduct = '', typeWeight = '', typeProduct = '', addressStart = '', addressEnd = '', methodContract = '', methodDelivery = '', methodPayment = '' }: Partial<IContractDetailsJSON> = {}) {
        this.nameBrandA = nameBrandA;
        this.nameBrandB = nameBrandB;
        this.numberPhone = numberPhone;
        this.businessRegisterNumber = businessRegisterNumber;
        this.numberContract = numberContract;
        this.nameProduct = nameProduct;
        this.typeWeight = typeWeight;
        this.typeProduct = typeProduct;
        this.addressStart = addressStart;
        this.addressEnd = addressEnd;
        this.methodDelivery = methodDelivery;
        this.methodPayment = methodPayment;
        this.methodContract = methodContract;
    }

    static fromJson(json: ContractDetails): ContractDetails {
        return new ContractDetails({
            nameBrandA: json.nameBrandA,
            nameBrandB: json.nameBrandB,
            numberPhone: json.numberPhone,
            businessRegisterNumber: json.businessRegisterNumber,
            numberContract: json.numberContract,
            nameProduct: json.nameProduct,
            typeWeight: json.typeWeight,
            typeProduct: json.typeProduct,
            addressStart: json.addressStart,
            addressEnd: json.addressEnd,
            methodContract: json.methodContract,
            methodDelivery: json.methodDelivery,
            methodPayment: json.methodPayment,
        });
    }
}