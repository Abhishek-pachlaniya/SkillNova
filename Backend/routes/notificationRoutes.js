// routes/notificationRoutes.js
import express from 'express';
import { 
    getNotifications, 
    markAllAsRead, 
    getUnreadNotificationCount 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();


router.get('/', protect, getNotifications); 
router.put('/read', protect, markAllAsRead);
router.get('/unread-count', protect, getUnreadNotificationCount);

export default router;