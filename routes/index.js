const express = require('express');
const router = express.Router();
const login = require('./login');
const users = require('./users');
const investments = require('./investments');
const stocks = require('./stocks');

router.use('/login', login);
router.use('/users', users);
router.use('/investments', investments);
router.use('/stocks', stocks);

const port = process.env.PORT || 3000;

router.use((req, res, next) => {
    const error = new Error('Route not found.');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        error: error.message
    });
});

module.exports = router;