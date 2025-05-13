import express from 'express';
import * as authController from '../contollers/authController.js';

const router = express.Router();

router.post('/login', authController.login); // for logging in
router.post('/logout', authController.logout); // for logging out
router.post('/register', authController.register); // for user registration
router.post('/resetpassword', authController.resetPassword); // for password reset

// ✅ NEW: Google Login Route
router.post('/google-login', authController.googleLogin);

export default router;
