const users = require('../models/users');
const { check, validationResult } = require('express-validator');

module.exports = {

    listUsers: [
        (req, res, next) => {
            users.listUsers(res);
        }],

    getUser: [
        check('email')
            .exists()
            .withMessage('Email is required.')
            .isEmail()
            .withMessage('Invalid Email format (email@domain.com).'),           
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const email = req.params.email;            
            users.getUser(email, res);
        }],

    putUser: [
        check('email')
            .exists()
            .withMessage('Email is required.')
            .isEmail()
            .withMessage('Invalid Email format (email@domain.com).'),            
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
            users.updateUser(user, res);
        }],

    postUser: [
        check('email')
            .exists()
            .withMessage('Email is required.')
            .isEmail()
            .withMessage('Invalid Email format (email@domain.com).'),            
        check('password')
            .exists()
            .withMessage('Password is required.')
            .isLength({ min: 8 })
            .withMessage('Password must have min 8 characters.'),
        check('permission_level')
            .isInt()
            .withMessage('Invalid Permission Level type (integer).'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const user = req.body;
            users.createUser(user, res);
        }],

    deleteUser: [
        check('email')
            .exists()
            .withMessage('Email is required.')
            .isEmail()
            .withMessage('Invalid Email format (email@domain.com).'),            
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const email = req.body.email;
            users.deleteUser(email, res);
        }]
}