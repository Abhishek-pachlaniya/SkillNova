// utils/notificationHelper.js
import Notification from '../models/Notification.js';

export const sendNotification = async (req, recipientId, text, type = 'system') => {
  try {
    // 1. Database mein save karo (Taaki user refresh kare tab bhi bell mein dikhe)
    const savedNotification = await Notification.create({
      recipient: recipientId,
      text: text,
      type: type
    });

    // 2. Sirf aur sirf us specific user ko real-time notification bhejo
    const io = req.app.get('socketio');
    if (io) {
      // 🚨 FIX: io.emit ki jagah io.to().emit lagaya hai
      io.to(recipientId.toString()).emit("newNotification", {
        _id: savedNotification._id,
        text: savedNotification.text,
        type: savedNotification.type,
        createdAt: savedNotification.createdAt,
        isRead: false
      });
    }
    return true;
  } catch (error) {
    console.error("🔔 Notification fail ho gayi:", error.message);
    return false;
  }
};