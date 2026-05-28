"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const auth_router_1 = __importDefault(require("./auth/data/entrypoint/auth_router"));
const auth_repository_1 = __importDefault(require("./auth/data/repository/auth_repository"));
const order_repository_1 = __importDefault(require("./auth/data/repository/order_repository"));
const bcrypt_password_service_1 = __importDefault(require("./auth/data/services/bcrypt_password_service"));
const jwt_token_service_1 = __importDefault(require("./auth/data/services/jwt_token_service"));
const users_router_1 = __importDefault(require("./users/data/entrypoint/users_router"));
const users_repository_1 = __importDefault(require("./users/data/repository/users_repository"));
class CompositionRoot {
    static configure() {
        this.client = new mongoose_1.Mongoose();
        const options = {
            autoIndex: true,
            /*  maxPoolSize: 10, // Maintain up to 10 socket connections */
            serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
            /*   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
              family: 4 // Use IPv4, skip trying IPv6  */
        };
        const connecionStr = encodeURI(process.env.MONGO_DB);
        this.client.connect(connecionStr, options /*  { connectTimeoutMS: 10000 } */).then(() => console.log("Database connected!"))
            .catch(err => console.log(err));
    }
    static authRouter() {
        const repository = new auth_repository_1.default(this.client);
        const tokenService = new jwt_token_service_1.default(process.env.PRIVATE_KEY);
        const passwordService = new bcrypt_password_service_1.default();
        const repositoryOrder = new order_repository_1.default(this.client);
        return auth_router_1.default.configure(repository, tokenService, passwordService, repositoryOrder);
    }
    static getAllUserRouter() {
        const repository = new users_repository_1.default(this.client);
        return users_router_1.default.configure(repository);
    }
}
exports.default = CompositionRoot;
