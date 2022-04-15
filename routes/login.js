const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

router.post('/', loginController.postLogin);

module.exports = router;