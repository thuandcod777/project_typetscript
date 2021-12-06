import IGetuserRepository from "../../domain/igetuser_repository";
import { Request, Response } from "express"

export default class UsersController {
    private readonly repository: IGetuserRepository

    constructor(repository: IGetuserRepository) {
        this.repository = repository
    }


    public async getUsers(req: Request, res: Response) {
        try {
            /*   const { email } = req.body */
            return this.repository
                .getUser()
                .then((users) =>
                    res.status(200).json({
                        data: users,
                    })
                )
                .catch((err: Error) => res.status(404).json({ error: err }))
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }
}