// 🚨 TERA messageRoutes.js AISA HONA CHAHIYE
import express from 'express';
import { sendMessage, getMessages,markAsRead } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadChatAttachment } from '../config/cloudinary.js';
const router = express.Router();


router.get('/:chatId', protect, getMessages); // <-- Ye wala zaroori tha!
router.put('/mark-read/:chatId', protect, markAsRead);
router.post('/send', protect, uploadChatAttachment.single('file'), sendMessage);
export default router;