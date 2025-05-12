import express from 'express';
import * as userController from '../contollers/userController.js';

const router = express.Router();

router.get('/', userController.getUsers);
// router.post('/', userController.createUser);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

export default router;