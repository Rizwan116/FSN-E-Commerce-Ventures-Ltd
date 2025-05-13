import { sql_queries } from '../sql_queries.js';
import { pgClient } from '../postgres_db.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^.{6,}$/;

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client("1096684727945-n3vqh5t3j8hg3dppt4bdjlph6jaq3v8f.apps.googleusercontent.com");

export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const result = await pgClient.query(sql_queries.createUserQuery, [
            firstName,
            lastName,
            email,
            password,
            phone || null // Allow phone to be null
        ]);

        const user = result.rows[0];
        res.status(200).json({
            success: true,
            message: 'User registered successfully',
            userId: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstname,
            lastName: user.lastname,
            profile_image: user.profile_image,
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.code === '23505') { // PostgreSQL unique violation error code
            return res.status(409).json({
                success: false,
                message: 'Email/Phone already exists',
                error: error.message
            });
        }

        
        res.status(500).json({
            success: false,
            message: 'Error during registration',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: '❗ Enter a valid email' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, message: '❗ Password must be at least 6 characters' });
    }

    try {
        const result = await pgClient.query(sql_queries.checkUserQuery, [email, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.status(200).json({
                success: true,
                message: 'Login successful',
                userId: user.id,
                email: user.email,
                phone: user.phone,
                firstName: user.firstname,
                lastName: user.lastname,
                profile_image: user.profile_image,
            });
        } else {
            res.status(401).json({ success: false, message: '❌ Invalid email or password' });
        }
    } catch (err) {
        console.error('Error connecting to the database', err.stack);
        return res.status(500).json({ success: false, message: 'Error connecting to the database' });
    }
}

export const resetPassword = async (req, res) => {
    const { email, password, newPassword } = req.body;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: '❗ Enter a valid email' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, message: '❗ Password must be at least 6 characters' });
    }

    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ success: false, message: '❗ New Password must be at least 6 characters' });
    }
    try {
        // const result = await pgClient.query(sql_queries.checkUserQuery, [email, password]);
        // if (result.rows.length > 0) {
            const result = await pgClient.query(sql_queries.resetPasswordQuery, [newPassword, email, password]);
            if (result.rows.length > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Password reset successfully',
                    userId: result.rows[0].id,
                });
            } else {
                res.status(400).json({ success: false, message: '❌ User not found' });
            }
        // } else {
        //     res.status(404).json({ success: false, message: '❌ Invalid email or password' });
        // }
    } catch (err) {
        console.error('Error connecting to the database', err.stack);
        return res.status(500).json({ success: false, message: 'Error connecting to the database', error: err.message });
    }
}

export const logout = async (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        success: true,
        message: `Logout successfully`,
    });
}


export const googleLogin = async (req, res) => {
  const { email, firstName, lastName, profileImage } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({ success: false, message: 'Missing Google user data' });
  }

  try {
    // Check if the user already exists
    const checkResult = await pgClient.query(sql_queries.getUserByEmailQuery, [email]);

    let user;
    if (checkResult.rows.length > 0) {
      user = checkResult.rows[0];
    } else {
      // Insert new user into DB if not exists
     const insertResult = await pgClient.query(sql_queries.createGoogleUserQuery, [firstName, lastName, email, profileImage]);
      user = insertResult.rows[0];
    }

    // Optionally generate a dummy token
    const token = `google-token-${user.id}`;

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname || "",
        phone: user.phone,
        profile_image: profileImage || user.profile_image,
      },
      token
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
