const users = require('../models/users');
const { check, param, validationResult } = require('express-validator');

module.exports = app => {
    app.get('/users', (req, res) => {
        users.listUsers(res);
    })

    app.get('/users/:id',
        param('id')
            .isInt()
            .withMessage('Invalid ID format (integer).'),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            users.searchForId(id, res);
        })

    app.put('/users/:id', [
        param('id')
            .isInt()
            .withMessage('Invalid ID type (integer).'),
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
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            const user = req.body;
            users.updateUser(id, user, res);
        }])

    app.post('/users', [
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
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const user = req.body;
            users.createUser(user, res);
        }
    ])

    app.delete('/users/:id',
        param('id')
            .isInt()
            .withMessage('Invalid ID format (integer).'),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            users.deleteUser(id, res);
        })

    app.post('/login', [
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
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const user = req.body;
            users.loginUser(user, res);
        }
    ])
}
