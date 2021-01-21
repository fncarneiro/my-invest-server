const login = require('../models/login');
const { check, validationResult } = require('express-validator');

exports.postLogin = [
    check('email')
        .exists()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Invalid Email format (email@domain.com).')
        .toLowerCase(),
    check('password')
        .exists()
        .withMessage('Password is required.')
        .isLength({ min: 8 })
        .withMessage('Password must have min 8 characters.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.body;
        login.loginUser(user, res);
    }]

