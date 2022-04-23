import express from 'express';
import { optional, mandatory } from '../middlewares/auth.js';
import * as usersController from '../controllers/users.js';

const router = express.Router();

router.route('/')
    .get(mandatory, usersController.listUsers)

    .put(mandatory, usersController.putUser)

    .post(optional, usersController.postUser)

    .delete(mandatory, usersController.deleteUser);

router.get('/:email', mandatory, usersController.getUser);

export default router;
