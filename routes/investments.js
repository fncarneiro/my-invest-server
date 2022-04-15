const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const investmentsController = require('../controllers/investments');

router.get('/', auth.optional, investmentsController.listInvestments);

router.get('/:id', auth.optional, investmentsController.getInvestment);

router.put('/:id', auth.mandatory, investmentsController.putInvestment);

router.post('/', auth.mandatory, investmentsController.postInvestment);

router.delete('/:id', auth.mandatory, investmentsController.deleteInvestment);

module.exports = router;