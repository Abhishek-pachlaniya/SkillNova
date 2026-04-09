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

// 2. Saari notifications ko "Read" (padh liya) mark karna
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