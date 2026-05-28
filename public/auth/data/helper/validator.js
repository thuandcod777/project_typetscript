"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.signinValidatorRules = exports.signupValidatorRules = void 0;
const express_validator_1 = require("express-validator");
const signupValidatorRules = () => {
    return [
        (0, express_validator_1.body)('email', 'Invalid email').notEmpty().isEmail().normalizeEmail(),
        (0, express_validator_1.body)('name', 'Name is required').notEmpty(),
        (0, express_validator_1.body)('auth_type', 'Auth is required').notEmpty(),
        (0, express_validator_1.body)('password', 'Password is required (min 5 character)').if((0, express_validator_1.body)('auth_type').equals('email')).notEmpty().isLength({ min: 5 })
    ];
};
exports.signupValidatorRules = signupValidatorRules;
const signinValidatorRules = () => {
    return [
        (0, express_validator_1.body)('email', 'Invalid email').not().isEmpty().isEmail().normalizeEmail(),
        (0, express_validator_1.body)('name', 'Name is required').notEmpty().if((0, express_validator_1.body)('auth_type').not().equals('email')),
        (0, express_validator_1.body)('auth_type', 'Auth is required').notEmpty(),
        (0, express_validator_1.body)('password', 'Password is required (min 5 character)').notEmpty().if((0, express_validator_1.body)('auth_type').equals('email')).isLength({ min: 5 }),
    ];
};
exports.signinValidatorRules = signinValidatorRules;
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedError = [];
    errors.array({ onlyFirstError: true }).map((err) => extractedError.push({ [err.param]: err.msg }));
    return res.status(422).json({ error: extractedError });
};
exports.validate = validate;
