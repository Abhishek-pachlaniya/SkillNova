import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
export const startOrGetConversation = async (req, res) => {
  try {
    const senderId = req.user._id; 
    const { receiverId } = req.body; 

    // 1. Check karo kya pehle se room hai? Aur usme naam/photo POPULATE karo
    let chat = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("participants", "name avatar role"); // 🚨 NAYA: Naam aur photo sath lao

    // 2. Agar nahi hai, toh naya banao
    if (!chat) {
      chat = await Conversation.create({
        participants: [senderId, receiverId]
      });
      // Banane ke baad usme bhi naam/photo bharo
      chat = await chat.populate("participants", "name avatar role");
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error in Conversation Controller:", error);
    res.status(500).json({ message: "Server Error: Chat room nahi ban paya" });
  }
};


export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      participants: { $in: [userId] }
    }).populate("participants", "name avatar title role").lean(); // .lean() use karo modification ke liye

    // ⚡ Har conversation ke liye unread count nikalo
    const conversationsWithCounts = await Promise.all(conversations.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        sender: { $ne: userId }, // Maine nahi bheja, samne wale ne bheja
        isRead: false
      });
      return { ...conv, unreadCount };
    }));

    res.status(200).json(conversationsWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Conversations fetch nahi ho payi" });
  }
};