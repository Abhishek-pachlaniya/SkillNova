import express from 'express';
import { getNotifications, markAllAsRead } from '../controllers/notificationController.js';
// Tera jo bhi login check karne wala middleware hai, usko import kar lena
// import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Agar middleware hai toh aise lagana: router.get('/', protect, getNotifications);
// Abhi ke liye bina middleware ke rakh rahe hain (testing ke liye)
router.get('/', getNotifications);
router.put('/read', markAllAsRead);

export default router;