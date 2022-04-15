const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const stocksController = require('../controllers/stocks');

router.get('/stocks', auth.optional, stocksController.listStocks);

router.get('/stocks/:id', auth.optional, stocksController.getStock);

router.put('/stocks/:id', auth.mandatory, stocksController.putStock);

router.post('/stocks', auth.mandatory, stocksController.postStock);

router.delete('/stocks/:id', auth.mandatory, stocksController.deleteStock);

module.exports = router;
