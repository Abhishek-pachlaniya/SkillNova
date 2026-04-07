import express from 'express';
import { getUserProfile, updateProfile, getPublicProfile, getAllEngineers } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Profile Routes
router.get('/profile', protect, getUserProfile);

// 🚨 SAHI ORDER YE HAI (engineers wala UPAR, :id wala NEECHE) 🚨
router.get('/public/engineers', getAllEngineers); // 👈 YE UPAR
router.get('/public/:id', getPublicProfile);      // 👈 YE NEECHE

// ✅ Single Route for Update with Multer
router.put('/profile', protect, upload.single('avatar'), updateProfile);

export default router;