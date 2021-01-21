const stocks = require('../models/stocks');
const { check, param, validationResult } = require('express-validator');


module.exports = {
    listStocks:[
        (req, res, next) => {
            stocks.listStocks(res);
        }],

    getStock: [
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
        }],

    putStock: [
        param('id')
            .isInt()
            .withMessage('Invalid ID type (integer).'),
        check('stock_name')
            .isLength(5, 10)
            .withMessage('Stock Name must have 5 characters minimum.')
            .toUpperCase(),
        check(['by_amount', 'sell_amount', 'id_investment'])
            .isInt({ min: 0, max: 999999999 })
            .withMessage('Invalid value type (integer).'),
        check(['by_price', 'by_tax', 'target_profit', 'sell_profit', 'sell_tax'])
            .isFloat({ min: 0.0, max: 9999999999.99 })
            .withMessage('Invalid value type (decimal(12,2).'),
        check('note') // nao funciona
            .isLength(0, 200)
            .withMessage('Note must have 200 characters max.'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            const stock = req.body;
            stocks.updateStock(id, stock, res);
        }],

    postStock: [
        check('stock_name')
            .isLength({ min: 5, max: 10 })
            .withMessage('Stock Name must have from 5 to 10 characters.')
            .toUpperCase(),
        check(['id_investment', 'by_amount', 'sell_amount'])
            .isInt({ min: 0, max: 999999999 })
            .withMessage('Invalid value type (integer).'),
        check(['by_price', 'by_tax', 'target_profit', 'sell_profit', 'sell_tax'])
            .isFloat({ min: 0.0, max: 9999999999.99 })
            .withMessage('Invalid value type (decimal(10,2).'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const stock = req.body;
            stocks.createStock(stock, res);
        }],

    deleteStock: [
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
        }]
}
