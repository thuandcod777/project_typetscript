import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

export const signupValidatorRules = () => {
    return [
        body('email', 'Invalid email').notEmpty().isEmail().normalizeEmail(),
        body('name', 'Name is required').notEmpty(),
        body('auth_type', 'Auth is required').notEmpty(),
        body('password', 'Password is required (min 5 character)').if(body('auth_type').equals('email')).notEmpty().isLength({ min: 5 })
    ]
}


export const signinValidatorRules = () => {
    return [
        body('email', 'Invalid email').not().isEmpty().isEmail().normalizeEmail(),
        body('name', 'Name is required').notEmpty().if(body('auth_type').not().equals('email')),
        body('auth_type', 'Auth is required').notEmpty(),
        body('password', 'Password is required (min 5 character)').notEmpty().if(body('auth_type').equals('email')).isLength({ min: 5 }),
    ]
}

export const validate = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }
    const extractedError: any = []

    errors.array({ onlyFirstError: true }).map((err) => extractedError.push({ [err.param]: err.msg }))

    return res.status(422).json({ error: extractedError })
}
