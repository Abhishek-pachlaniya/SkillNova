import express from 'express';
import { 
    registerUser, 
    loginUser, 
    verifyEmail, 
    forgotPassword, 
    resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

// Authentication Routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Email Verification Route
router.get('/verify-email/:token', verifyEmail);

// Password Management Routes
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;