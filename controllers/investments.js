const investments = require('../models/investments');
const { check, param, validationResult } = require('express-validator');

module.exports = app => {
    app.get('/investments', (req, res) => {
        investments.listInvestment(res);
    })

    app.get('/investments/:id',
        param('id')
            .isInt()
            .withMessage('Invalid ID type (integer).'),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            investments.searchForId(id, res);
        })

    app.put('/investments/:id', [
        param('id')
            .isInt()
            .withMessage('Invalid ID type (integer).'),            
        check('period')
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
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            const investment = req.body;
            investments.updateInvestment(id, investment, res);
        }])

    app.post('/investments',
        check('period')
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
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const investment = req.body;
            investments.createInvestment(investment, res);
        })

    app.delete('/investments/:id',
        param('id')
            .isInt()
            .withMessage('Invalid ID type (integer).'),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            investments.deleteInvestment(id, res);
        })
}
