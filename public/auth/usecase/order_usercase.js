"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class OrderUsecase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    execute(namePerson, nameProduct, numberProduct, orderDate) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const orderId = yield this.orderRepository.saveOrder(namePerson, nameProduct, numberProduct, orderDate);
            return orderId;
        });
    }
}
exports.default = OrderUsecase;
