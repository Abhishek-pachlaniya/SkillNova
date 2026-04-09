// 🚨 TERA messageRoutes.js AISA HONA CHAHIYE
import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages); // <-- Ye wala zaroori tha!

export default router;