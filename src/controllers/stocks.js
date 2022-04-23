import * as stocks from '../models/stocks.js';
import { check, param, validationResult } from 'express-validator';

export const listStocks = [
    (req, res, next) => {
        stocks.listStocks(res);
    }];

export const getStock = [
    param('id')
        .isInt()
        .withMessage('Invalid ID format (integer).'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = parseInt(req.params.id);
        stocks.getStock(id, res);
    }];

export const putStock = [
    param('id')
        .isInt()
        .withMessage('Invalid ID type (integer).'),
    check(['stock_name', 'id_investment', 'by_amount', 'by_price'])
        .exists()
        .withMessage('Field is required.'),
    check('stock_name')
        .isLength(5, 10)
        .withMessage('Stock Name must have 5 characters minimum.')
        .toUpperCase(),
    check(['by_amount', 'sell_amount', 'id_investment'])
        .isInt({ min: 0, max: 999999999 })
        .withMessage('Invalid value type (positive integer).'),
    check(['by_price', 'by_tax', 'target_profit', 'sell_profit', 'sell_tax'])
        .isFloat({ min: 0.0, max: 9999999999.99 })
        .withMessage('Invalid value type (positive decimal(12,2).'),
    check('note')
        .isLength({ min: 0, max: 200 })
        .withMessage('Note must have 200 characters max.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = parseInt(req.params.id);
        const stock = req.body;
        stocks.updateStock(id, stock, res);
    }];

export const postStock = [
    check(['stock_name', 'id_investment', 'by_amount', 'by_price'])
        .exists()
        .withMessage('Field is required.'),
    check('stock_name')
        .isLength({ min: 5, max: 10 })
        .withMessage('Stock Name must have from 5 to 10 characters.')
        .toUpperCase(),
    check(['id_investment', 'by_amount', 'sell_amount'])
        .isInt({ min: 0, max: 999999999 })
        .withMessage('Invalid value type (positive integer).'),
    check(['by_price', 'by_tax', 'target_profit', 'sell_profit', 'sell_tax'])
        .isFloat({ min: 0.0, max: 9999999999.99 })
        .withMessage('Invalid value type (positive decimal(10,2).'),
    check('note')
        .isLength({ min: 0, max: 200 })
        .withMessage('Note must have 200 characters max.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const stock = req.body;
        stocks.createStock(stock, res);
    }];

export const deleteStock = [
    param('id')
        .isInt()
        .withMessage('Invalid ID format (integer).'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = parseInt(req.params.id);
        stocks.deleteStock(id, res);
    }];

