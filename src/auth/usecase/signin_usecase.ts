import IAuthRepository from "../domain/iauth_repository";
import IPasswordService from "../services/ipassword_service";

export default class SignInUseCase {
    constructor(private authRepository: IAuthRepository,
        private passwordService: IPasswordService) { }


    public async execute(name: string, email: string, auth_type: string, password: string): Promise<string> {
        /* const user=await this.authRepository.find(email);
        if (password === '' && user) return user.id

        if(!(await this.passwordService.compare(password,user.password))){
            return Promise.reject('Invalid email or password')
        }

        return user.id */

        if (auth_type === 'email') return this.emailLogin(email, password)

        return this.oauthLogin(email, name, auth_type)
    }

    private async emailLogin(email: string, password: string) {
        const user = await this.authRepository.find(email).catch((_) => null)

        if (!user || !(await this.passwordService.compare(password, user.password)))

            return Promise.reject('Invalid email or password')

        return user.id
    }


    private async oauthLogin(email: string, name: string, auth_type: string) {

        const user = await this.authRepository.find(email).catch((_) => null)

        if (user && user.type === 'email')
            return Promise.reject('Account already exists, log in with password')

        if (user) return user.id

        const userId = await this.authRepository.add(email, name, auth_type)

        return userId
    }

}