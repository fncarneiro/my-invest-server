const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const usersController = require('../controllers/users');

router.route('/')
    .get(auth.mandatory, usersController.listUsers)

    .put(auth.mandatory, usersController.putUser)

    .post(auth.optional, usersController.postUser)

    .delete(auth.mandatory, usersController.deleteUser);

router.get('/:email', auth.mandatory, usersController.getUser);

module.exports = router;
