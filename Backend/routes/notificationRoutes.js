import express from 'express';
import { getNotifications, markAllAsRead,getUnreadNotificationCount } from '../controllers/notificationController.js';
const router = express.Router();
router.get('/', getNotifications);
router.put('/read', markAllAsRead);
router.get('/unread-count', protect, getUnreadNotificationCount);
export default router;