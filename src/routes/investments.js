import express from 'express';
import { optional, mandatory } from '../middlewares/auth.js';
import * as investmentsController from '../controllers/investments.js';

const router = express.Router();

router.get('/', optional, investmentsController.listInvestments);

router.get('/:id', optional, investmentsController.getInvestment);

router.put('/:id', mandatory, investmentsController.putInvestment);

router.post('/', mandatory, investmentsController.postInvestment);

router.delete('/:id', mandatory, investmentsController.deleteInvestment);

export default router;