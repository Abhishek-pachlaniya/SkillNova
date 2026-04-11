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
import Notification from '../models/Notification.js'; // Apna model import kar lena

export const getUnreadNotificationCount = async (req, res) => {
    try {
        // 🚨 Note: Apne schema ke hisaab se field check kar lena. 
        // Main maan ke chal raha hoon tere model mein 'user' aur 'isRead'/status field hai.
        const count = await Notification.countDocuments({ 
            user: req.user._id, 
            isRead: false // Agar tu unread dikhana chahta hai, warna is line ko hata dena total ke liye
        });

        res.status(200).json({ count });
    } catch (error) {
        console.error("Count Error:", error);
        res.status(500).json({ message: "Count fetch failed" });
    }
};
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