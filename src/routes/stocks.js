import express from 'express';
import { optional, mandatory } from '../middlewares/auth.js';
import * as stocksController from '../controllers/stocks.js';

const router = express.Router();

router.get('/stocks', optional, stocksController.listStocks);

router.get('/stocks/:id', optional, stocksController.getStock);

router.put('/stocks/:id', mandatory, stocksController.putStock);

router.post('/stocks', mandatory, stocksController.postStock);

router.delete('/stocks/:id', mandatory, stocksController.deleteStock);

export default router;
