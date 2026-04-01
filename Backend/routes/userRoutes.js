import express from 'express';

import { getUserProfile, updateProfile, getPublicProfile} from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// Routes setup
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.get('/public/:id', getPublicProfile);
export default router;