import * as investments from '../models/investments.js';
import { check, param, validationResult } from 'express-validator';

export const listInvestments = (req, res, next) => {
    investments.listInvestment(res);
};

export const getInvestment = [
    param('id')
        .isInt()
        .withMessage('Invalid ID type (integer).')
        .toInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        investments.getInvestment(id, res);
    }];

export const putInvestment = [
    check('id_investment')
        .exists()
        .withMessage('Investment Id is required.')
        .isInt()
        .withMessage('Invalid Investment Id type (integer).')
        .toInt(),
    check('period')
        .exists()
        .withMessage('Period is required.')
        .isDate()
        .withMessage('Invalid Period type (date yyyy-mm-dd).')
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const investment = req.body;
        investments.updateInvestment(investment, res);
    }];

export const postInvestment = [
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
    check('id_user')
        .exists()
        .withMessage('User Id is required.')
        .isInt()
        .withMessage('Invalid User Id type (integer).')
        .toInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const investment = req.body;
        investments.createInvestment(investment, res);
    }];

export const deleteInvestment = [
    check('id_investment')
        .exists()
        .withMessage('Investment Id is required.')
        .isInt()
        .withMessage('Invalid ID type (integer).')
        .toInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const investment = req.body;
        investments.deleteInvestment(investment, res);
    }];
