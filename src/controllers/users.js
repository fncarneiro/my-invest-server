import * as users from '../models/users.js';
import { check, validationResult } from 'express-validator';

export const listUsers = [
    (req, res, next) => {
        users.listUsers(res);
    }];

export const getUser = [
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
    }];

export const putUser = [
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
    check('new_password')
        .exists()
        .withMessage('New password is required.')
        .isLength({ min: 8 })
        .withMessage('New password must have min 8 characters.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.body;
        users.updateUser(user, res);
    }];

export const postUser = [
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
        users.createUser(user, res);
    }];

export const deleteUser = [
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
        const permissionLevel = req.user.permission_level;
        users.deleteUser(email, permissionLevel, res);
    }];