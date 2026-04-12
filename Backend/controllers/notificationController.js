// Saare imports top par
import Notification from '../models/Notification.js';

// 1. User ki saari notifications mangwana
export const getNotifications = async (req, res) => {
  try {
    // req.user._id tere auth token se aayega
    const notifications = await Notification.find({ recipient: req.user._id })
                                          .sort({ createdAt: -1 }); // Nayi pehle
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Notifications laane mein error aaya", error: error.message });
  }
};

// 2. Unread notifications ka count lana
export const getUnreadNotificationCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ 
            recipient: req.user._id, // 💡 TIP: Maine yahan 'user' ko 'recipient' kar diya hai taaki baaki functions ke saath match kare
            isRead: false 
        });

        res.status(200).json({ count });
    } catch (error) {
        console.error("Count Error:", error);
        res.status(500).json({ message: "Count fetch failed" });
    }
};

// 3. Sabko read mark karna
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false }, 
      { isRead: true }
    );
    res.status(200).json({ message: "Sab read mark ho gaya!" });
  } catch (error) {
    res.status(500).json({ message: "Update karne mein error aaya", error: error.message });
  }
};