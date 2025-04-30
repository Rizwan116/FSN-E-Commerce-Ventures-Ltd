import express from 'express';
import * as authController from '../contollers/authController.js';

const router = express.Router();

router.post('/login/', authController.login); // for logging in
router.post('/logout/', authController.logout); // for logging out
router.post('/register/', authController.register); // for user registration

export default router;