import express from 'express';
import { startOrGetConversation,getConversations } from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js'; // Tera login check karne wala middleware

const router = express.Router();

// POST request aayegi jab button dabega
router.post('/', protect, startOrGetConversation);
router.get('/', protect, getConversations);
export default router;