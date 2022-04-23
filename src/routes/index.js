import express from 'express';
import signin from './signin.js';
import users from './users.js';
import investments from './investments.js';
import stocks from './stocks.js';

const router = express.Router();

router.use('/signin', signin);
router.use('/users', users);
router.use('/investments', investments);
router.use('/stocks', stocks);

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

export default router;