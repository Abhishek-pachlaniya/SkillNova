import express from 'express';

import { getUserProfile, updateUserProfile } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes setup
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;