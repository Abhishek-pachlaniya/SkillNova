import Notification from '../models/Notification.js';

// Ye function 4 chize lega: request, jisko bhejna hai uski ID, message, aur type
export const sendNotification = async (req, recipientId, text, type = 'system') => {
  try {
    // 1. Database mein save karo (Offline walo ke liye)
    const savedNotification = await Notification.create({
      recipient: recipientId,
      text: text,
      type: type
    });

    // 2. Tijori se Walkie-Talkie nikalo aur Live bhej do (Online walo ke liye)
    const io = req.app.get('socketio');
    if (io) {
      // Asli app mein io.to(recipientId).emit hota hai, abhi testing ke liye open emit kar rahe hain
      io.emit("newNotification", {
        id: savedNotification._id,
        text: savedNotification.text,
        time: "Just now",
        unread: true
      });
    }
    return true;
  } catch (error) {
    console.error("🔔 Notification fail ho gayi:", error.message);
    return false;
  }
};