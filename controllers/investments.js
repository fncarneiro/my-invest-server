const investments = require('../models/investments');
const { check, param, validationResult } = require('express-validator');

module.exports = {
    listInvestments: [
        (req, res, next) => {
            investments.listInvestment(res);
        }],

    getInvestment: [
        param('id')
            .isInt()
            .withMessage('Invalid ID type (integer).'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            investments.getInvestment(id, res);
        }],

    putInvestment: [
        param('id')
            .isInt()
            .withMessage('Invalid ID type (integer).'),
        check('period')
            .exists()
            .withMessage('Period (yyyy-mm-dd) is required.')
            .isISO8601()
            .withMessage('Invalid Period format (yyyy-mm-dd).')
            .isDate({ format: 'yyyy-mm-dd', strictMode: true })
            .withMessage('Invalid date (yyyy-mm-dd).')
            .toDate()
            .custom((period) => {
                const today = new Date();
                if (period > today) {
                    throw new Error('Period must be iqual or less today.');
                }

                return true;
            }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            const investment = req.body;
            investments.updateInvestment(id, investment, res);
        }],

    postInvestment: [
        check('period')
            .exists()
            .withMessage('Period (yyyy-mm-dd) is required.')
            .isISO8601()
            .withMessage('Invalid Period format (yyyy-mm-dd).')
            .isDate({ format: 'yyyy-mm-dd', strictMode: true })
            .withMessage('Invalid date (yyyy-mm-dd).')
            .toDate()
            .custom((period) => {
                const today = new Date();
                if (period > today) {
                    throw new Error('Period must be iqual or less today.');
                }
                return true;
            }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const investment = req.body;
            investments.createInvestment(investment, res);
        }],

    deleteInvestment: [
        param('id')
            .isInt()
            .withMessage('Invalid ID type (integer).'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            investments.deleteInvestment(id, res);
        }]
}