import express from 'express';
import { getUserProfile, updateProfile, getPublicProfile } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Profile Routes
router.get('/profile', protect, getUserProfile);
router.get('/public/:id', getPublicProfile);

// ✅ Single Route for Update with Multer
router.put('/profile', protect, upload.single('avatar'), updateProfile);

export default router;