import express from 'express';
import * as authController from '../contollers/authController.js';

const router = express.Router();

router.post('/login', authController.login); // for logging in
router.post('/logout', authController.logout); // for logging out
router.post('/register', authController.register); // for user registration
router.post('/resetpassword', authController.resetPassword); // for password reset
// router.post('/updateprofile', authController.updateProfile); // for updating user profile


// In routes/auth.js
// router.post('/resetpassword', async (req, res) => {
//     const { email, newPassword } = req.body;
  
//     try {
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // You should hash the password before saving (e.g., using bcrypt)
//       user.password = newPassword; // Replace with hashed password
//       await user.save();
  
//       return res.status(200).json({ message: 'Password reset successfully' });
//     } catch (error) {
//       console.error('Password reset error:', error);
//       return res.status(500).json({ message: 'Server error' });
//     }
//   });
  

export default router;