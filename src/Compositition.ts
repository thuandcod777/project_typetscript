import { Mongoose } from 'mongoose'
import AuthRouter from './auth/data/entrypoint/auth_router'
import AuthRepository from './auth/data/repository/auth_repository'
import OrderRepository from './auth/data/repository/order_repository'
import BcryptPasswordService from './auth/data/services/bcrypt_password_service'
import JwtTokenService from './auth/data/services/jwt_token_service'

export default class CompositionRoot {
    private static client: Mongoose

    public static configure() {
        this.client = new Mongoose()

        const options = {
            autoIndex: true, // Don't build indexes
            /*  maxPoolSize: 10, // Maintain up to 10 socket connections */
            serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
            /*   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
              family: 4 // Use IPv4, skip trying IPv6  */
        };

        const connecionStr = encodeURI(process.env.MONGO_DB as string)
        this.client.connect(connecionStr, options /*  { connectTimeoutMS: 10000 } */
        ).then(() => console.log("Database connected!"))
            .catch(err => console.log(err));
    }

    public static authRouter() {
        const repository = new AuthRepository(this.client)
        const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string)
        const passwordService = new BcryptPasswordService()
        const repositoryOrder = new OrderRepository(this.client)
        return AuthRouter.configure(repository, tokenService, passwordService, repositoryOrder)
    }



}