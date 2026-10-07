"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = exports.ProductBrand = exports.Booking = void 0;
class Booking {
    brandId;
    bookCode;
    name;
    numberPhone;
    address;
    nameProduct;
    amount;
    type;
    status;
    constructor({ brandId = "", bookCode = "", name = "", numberPhone = "", address = "", nameProduct = "", amount = 0, type = "", status = "" } = {}) {
        this.brandId = brandId;
        this.bookCode = bookCode;
        this.name = name;
        this.numberPhone = numberPhone;
        this.address = address;
        this.nameProduct = nameProduct;
        this.amount = amount;
        this.type = type;
        this.status = status;
    }
    static fromJson(json) {
        return new Booking({
            brandId: json.brandId,
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
exports.Booking = Booking;
class ProductBrand {
    name;
    amount;
    type;
    description;
    constructor(name = '', amount = 0, type = '', description = '') {
        this.name = name;
        this.amount = amount;
        this.type = type;
        this.description = description;
    }
    // Chuyển đổi dữ liệu JSON từ Database/Mongoose thành Object Class
    static fromJson(json) {
        if (!json)
            return new ProductBrand();
        return new ProductBrand(json.name || '', json.amount || 0, json.type || '', json.description || '');
    }
    // Chuyển đổi ngược từ Object Class sang JSON để lưu vào Database hoặc gửi API
    toJson() {
        return {
            name: this.name,
            amount: this.amount,
            type: this.type,
            description: this.description
        };
    }
}
exports.ProductBrand = ProductBrand;
class Brand {
    nameBrand;
    product;
    // Định nghĩa constructor nhận tham số truyền vào với giá trị mặc định
    constructor(nameBrand = '', product = []) {
        this.nameBrand = nameBrand;
        this.product = product;
    }
    // Chuyển đổi dữ liệu JSON từ Mongoose thành Object BrandModel
    static fromJson(json) {
        if (!json)
            return new Brand();
        // Ánh xạ danh sách sản phẩm (Mongoose dùng trường 'productOfBrand' như bạn định nghĩa lúc trước)
        const productData = json.product || [];
        const productList = productData.map((item) => ProductBrand.fromJson(item));
        return new Brand(json.nameBrand || '', productList);
    }
    // Chuyển đổi từ Object Class sang JSON
    toJson() {
        return {
            nameBrand: this.nameBrand,
            product: this.product.map(p => p.toJson()) // Map mảng sản phẩm về dạng JSON thô
        };
    }
}
exports.Brand = Brand;
