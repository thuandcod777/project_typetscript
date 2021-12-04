import IPasswordService from "../../services/ipassword_service";
import bcrypt from 'bcrypt'

export default class BcryptPasswordService implements IPasswordService {

    constructor(private readonly saltRound: number = 10) { }

    hash(password: string): Promise<string> {

        return bcrypt.hash(password, this.saltRound)
    }
    compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

}