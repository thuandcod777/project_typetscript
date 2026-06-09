

interface IBookJSON {
    bookCode: string;
    name: string;
    numberPhone: Number;
    address: string;
    nameProduct: string;
    amount: number;
    type: string;
    status: string;
}

export class BookModel {
    bookCode: string;
    name: string;
    numberPhone: Number;
    address: string;
    nameProduct: string;
    amount: number;
    type: string;
    status: string;

    constructor({ bookCode = "", name = "", numberPhone = 0, address = "", nameProduct = "", amount = 0, type = "", status = "" }: Partial<IBookJSON> = {}) {
        this.bookCode = bookCode;
        this.name = name;
        this.numberPhone = numberPhone;
        this.address = address;
        this.nameProduct = nameProduct;
        this.amount = amount;
        this.type = type;
        this.status = status;
    }

    static fromJson(json: IBookJSON): BookModel {
        return new BookModel({
            bookCode: json.bookCode,
            name: json.name,
            numberPhone: json.numberPhone,
            address: json.address,
            nameProduct: json.nameProduct,
            amount: json.amount,
            type: json.type,
            status: json.status,
        });
    }
}


export class ProductModel {
    name: string;
    amount: number;
    type: string;


    constructor(name: string = '', amount: number = 0, type: string = '',) {
        this.name = name;
        this.amount = amount;
        this.type = type;

    }

    // Chuyển đổi dữ liệu JSON từ Database/Mongoose thành Object Class
    static fromJson(json: any): ProductModel {
        if (!json) return new ProductModel();
        return new ProductModel(
            json.name || '',
            json.amount || 0,
            json.type || '',

        );
    }

    // Chuyển đổi ngược từ Object Class sang JSON để lưu vào Database hoặc gửi API
    toJson() {
        return {
            name: this.name,
            amount: this.amount,
            type: this.type
        };
    }
}

export class BrandModel {
    nameBrand: string;
    product: ProductModel[];


    // Định nghĩa constructor nhận tham số truyền vào với giá trị mặc định
    constructor(nameBrand: string = '', product: ProductModel[] = []) {
        this.nameBrand = nameBrand;
        this.product = product;
    }

    // Chuyển đổi dữ liệu JSON từ Mongoose thành Object BrandModel
    static fromJson(json: any): BrandModel {
        if (!json) return new BrandModel();

        // Ánh xạ danh sách sản phẩm (Mongoose dùng trường 'productOfBrand' như bạn định nghĩa lúc trước)
        const productData = json.product || [];
        const productList = productData.map((item: any) => ProductModel.fromJson(item));

        return new BrandModel(
            json.nameBrand || '',
            productList,

        );
    }

    // Chuyển đổi từ Object Class sang JSON
    toJson() {
        return {
            nameBrand: this.nameBrand,
            product: this.product.map(p => p.toJson()) // Map mảng sản phẩm về dạng JSON thô
        };
    }
}
