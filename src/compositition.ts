import { Mongoose } from 'mongoose'
import AuthRouter from './auth/presentation/http/auth/auth_router'
import AuthRepository from './auth/data/repository/auth_repository'
import BcryptPasswordService from './auth/data/services/bcrypt_password_service'
import JwtTokenService from './auth/data/services/jwt_token_service'
import OrderRouter from './auth/presentation/http/order/order_router';
import OrderRepository from './auth/data/repository/order_repository';
import ScopeRouter from './auth/presentation/http/scope/scope_router';
import { RedisRepository } from './auth/data/repository/redis_repository';
import { createClient, RedisClientType } from "redis";
import BrandRespoitory from './auth/data/repository/brand_repository';
import BrandRouter from './auth/presentation/http/brand/brand_router';
import PickTimeRouter from './auth/presentation/http/pick_time/pick_time_router';
import PickTimeRepository from './auth/data/repository/pick_time_repository';
import ContractRepository from './auth/data/repository/contract_repository';
import ContractRouter from './auth/presentation/http/contract/contract_router';
import ScopeRepository from './auth/data/repository/scope_repository';

export default class CompositionRoot {
    private static client: Mongoose;
    private static redisClient: RedisClientType;

    public static async configure() {
        this.client = new Mongoose();

        const options = {
            autoIndex: true, // Don't build indexes
            /*  maxPoolSize: 10, // Maintain up to 10 socket connections */
            serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
            /*   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
              family: 4 // Use IPv4, skip trying IPv6  */
        };

        const connecionStr = encodeURI(process.env.MONGO_DB as string);
        this.client.connect(connecionStr, options /*  { connectTimeoutMS: 10000 } */
        ).then(() => console.log("Database connected!")).catch(err => console.log(err));

        this.redisClient = createClient({ url: 'redis://localhost:6379' });

        this.redisClient.on('error', (err) => console.log('Redis Client Error', err));

        try {
            await this.redisClient.connect();
            console.log("Redis connected successfully!");
        } catch (err) {
            console.error("Redis connection failed:", err);
        }
    }

    public static authRouter() {
        const authRepository = new AuthRepository(this.client);
        const contractRepository = new ContractRepository(this.client);
        return AuthRouter.configure(authRepository, contractRepository);
    }


    public static orderRouter() {
        const authRepository = new AuthRepository(this.client);
        const orderRepository = new OrderRepository(this.client);

        return OrderRouter.configure(authRepository, orderRepository);
    }

    public static scopeRouter() {
        const repository = new ScopeRepository(this.client);

        return ScopeRouter.configure(repository);
    }

    public static pickTimeRouter() {
        const repository = new PickTimeRepository(this.client);
        return PickTimeRouter.configure(repository);
    }

    public static brandRouter() {
        const repository = new BrandRespoitory(this.client);
        return BrandRouter.configure(repository);
    }

    public static contractRouter() {
        const authRepository = new AuthRepository(this.client);
        const contractRepository = new ContractRepository(this.client);
        return ContractRouter.configure(authRepository, contractRepository);
    }
}