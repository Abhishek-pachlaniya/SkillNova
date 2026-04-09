import Conversation from '../models/Conversation.js';

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
// Naya function: Sirf wahi log dikhao jinse baat hui hai
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    // Un conversations ko dhundo jisme ye user participant hai
    const conversations = await Conversation.find({
      participants: { $in: [userId] }
    }).populate("participants", "name avatar title role"); // Samne wale ki info nikalne ke liye

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Conversations fetch nahi ho payi" });
  }
};