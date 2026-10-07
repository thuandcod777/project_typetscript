"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const auth_router_1 = __importDefault(require("./auth/presentation/http/auth/auth_router"));
const auth_repository_1 = __importDefault(require("./auth/data/repository/auth_repository"));
const order_router_1 = __importDefault(require("./auth/presentation/http/order/order_router"));
const order_repository_1 = __importDefault(require("./auth/data/repository/order_repository"));
const scope_router_1 = __importDefault(require("./auth/presentation/http/scope/scope_router"));
const redis_1 = require("redis");
const brand_repository_1 = __importDefault(require("./auth/data/repository/brand_repository"));
const brand_router_1 = __importDefault(require("./auth/presentation/http/brand/brand_router"));
const pick_time_router_1 = __importDefault(require("./auth/presentation/http/pick_time/pick_time_router"));
const pick_time_repository_1 = __importDefault(require("./auth/data/repository/pick_time_repository"));
const contract_repository_1 = __importDefault(require("./auth/data/repository/contract_repository"));
const contract_router_1 = __importDefault(require("./auth/presentation/http/contract/contract_router"));
const scope_repository_1 = __importDefault(require("./auth/data/repository/scope_repository"));
class CompositionRoot {
    static client;
    static redisClient;
    static async configure() {
        this.client = new mongoose_1.Mongoose();
        const options = {
            autoIndex: true, // Don't build indexes
            /*  maxPoolSize: 10, // Maintain up to 10 socket connections */
            serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
            /*   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
              family: 4 // Use IPv4, skip trying IPv6  */
        };
        const connecionStr = encodeURI(process.env.MONGO_DB);
        this.client.connect(connecionStr, options /*  { connectTimeoutMS: 10000 } */).then(() => console.log("Database connected!")).catch(err => console.log(err));
        this.redisClient = (0, redis_1.createClient)({ url: 'redis://localhost:6379' });
        this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
        try {
            await this.redisClient.connect();
            console.log("Redis connected successfully!");
        }
        catch (err) {
            console.error("Redis connection failed:", err);
        }
    }
    static authRouter() {
        const authRepository = new auth_repository_1.default(this.client);
        const contractRepository = new contract_repository_1.default(this.client);
        return auth_router_1.default.configure(authRepository, contractRepository);
    }
    static orderRouter() {
        const authRepository = new auth_repository_1.default(this.client);
        const orderRepository = new order_repository_1.default(this.client);
        return order_router_1.default.configure(authRepository, orderRepository);
    }
    static scopeRouter() {
        const repository = new scope_repository_1.default(this.client);
        return scope_router_1.default.configure(repository);
    }
    static pickTimeRouter() {
        const repository = new pick_time_repository_1.default(this.client);
        return pick_time_router_1.default.configure(repository);
    }
    static brandRouter() {
        const repository = new brand_repository_1.default(this.client);
        return brand_router_1.default.configure(repository);
    }
    static contractRouter() {
        const authRepository = new auth_repository_1.default(this.client);
        const contractRepository = new contract_repository_1.default(this.client);
        return contract_router_1.default.configure(authRepository, contractRepository);
    }
}
exports.default = CompositionRoot;
