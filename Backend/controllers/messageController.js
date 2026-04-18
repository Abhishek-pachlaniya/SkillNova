import Message from '../models/Message.js';

// 1. Message Bhejne ke liye (Jo tere paas pehle se hai)
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, receiverId } = req.body;
    
    // 1. Basic message data banaya
    let messageData = {
      conversationId,
      sender: req.user._id,
      text: text || "" // Agar sirf file bhej raha hai, toh text khali rahega
    };

    // 2. 🔥 YAHAN KHELA HAI: Agar Multer ne koi file upload ki hai, toh uska data add karo
    if (req.file) {
      messageData.attachment = {
          url: req.file.path,             // Cloudinary ka direct link
          fileType: req.file.mimetype,    // File ka type (image/pdf)
          fileName: req.file.originalname // Asli file ka naam
      };
    }

    // 3. Database mein save karo
    const newMessage = new Message(messageData);
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

export const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      { conversationId: chatId, sender: { $ne: userId }, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ msg: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking messages as read" });
  }
};