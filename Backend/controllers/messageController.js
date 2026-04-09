import Message from '../models/Message.js';

// 1. Message Bhejne ke liye (Jo tere paas pehle se hai)
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, receiverId } = req.body;
    
    const newMessage = new Message({
      conversationId,
      sender: req.user._id,
      text
    });
    
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ MESSAGE SAVE ERROR:", error); 
    res.status(500).json({ message: "Message send nahi hua" });
  }
};

// ==========================================
// 🚨 2. NAYA: Purane Messages fetch karne ke liye
// ==========================================
export const getMessages = async (req, res) => {
  try {
    // URL se chatId nikal rahe hain (e.g., /api/messages/12345xyz)
    const { chatId } = req.params;
    
    // DB mein wo saare messages dhundo jinka conversationId is chatId se match kare
    const messages = await Message.find({ conversationId: chatId });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ FETCH MESSAGES ERROR:", error);
    res.status(500).json({ message: "Messages fetch nahi hue bhai!" });
  }
};