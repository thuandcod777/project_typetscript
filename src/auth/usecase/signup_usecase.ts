import IAuthRepository from "../domain/iauth_repository";
import IPasswordService from "../services/ipassword_service";

export default class SignUpUsecase {
    constructor(private authRepository: IAuthRepository,
        private passwordService: IPasswordService) { }

    public async execute(email: string, name: string, type: string, password: string): Promise<string> {
        const user = await this.authRepository.find(email).catch((_) => null);

        if (user) return Promise.reject('User already exists')

        let passwordHash

        if (password) {
            passwordHash = await this.passwordService.hash(password)
        } else {
            passwordHash = undefined
        }

        /*  if(user) return Promise.reject('User ready exists')
*/
        const userId = await this.authRepository.add(email, name, type, passwordHash)

        return userId
    }

}