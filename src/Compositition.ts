import { Mongoose } from 'mongoose'
import AuthRouter from './auth/data/entrypoint/auth_router'
import AuthRepository from './auth/data/repository/auth_repository'
import BcryptPasswordService from './auth/data/services/bcrypt_password_service'
import JwtTokenService from './auth/data/services/jwt_token_service'
import UsersRouter from './users/data/entrypoint/users_router'
import UsersRepository from './users/data/repository/users_repository'
import OrderRouter from './orders/data/entrypoint/order_router';
import OrderRepository from './orders/data/repository/order_repository';
import ScopeRepository from './scope/data/repository/scope_repository';
import ScopeRouter from './scope/data/entrypoint/scope_router';
import { RedisRepository } from './auth/data/repository/redis_repository';
import { createClient, RedisClientType } from "redis";

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
        const repository = new AuthRepository(this.client);
        const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string);
        const redisService = new RedisRepository(this.redisClient);
        return AuthRouter.configure(repository, redisService, tokenService);
    }

    public static getAllUserRouter() {
        const repository = new UsersRepository(this.client);

        return UsersRouter.configure(repository);
    }

    public static orderRouter() {
        const repository = new OrderRepository(this.client);

        return OrderRouter.configure(repository);
    }

    public static scopeRouter() {
        const repository = new ScopeRepository(this.client);

        return ScopeRouter.configure(repository);
    }
}