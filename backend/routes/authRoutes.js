import express from 'express';
import * as productController from '../contollers/productController.js';
import * as authController from '../contollers/authController.js';

const router = express.Router();

router.get('/login/', authController.login); // for logging in
router.get('/logout/', authController.logout); // for logging out
router.get('/register/', authController.register); // for user registration

export default router;