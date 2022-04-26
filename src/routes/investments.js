import express from 'express';
import { optional, mandatory } from '../middlewares/auth.js';
import * as investmentsController from '../controllers/investments.js';

const router = express.Router();

router.route('/')
    .get(optional, investmentsController.listInvestments)

    .put(optional, investmentsController.putInvestment)

    .post(optional, investmentsController.postInvestment)

    .delete(optional, investmentsController.deleteInvestment);

router.get('/:id', optional, investmentsController.getInvestment);

export default router;