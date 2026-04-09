// sockets/socketHandler.js
import Notification from '../models/Notification.js'; 

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Naya user connect hua! Socket ID:", socket.id);

    // 1. Setup User (Abhishek/Mohit apne personal room mein aayenge)
    socket.on("setupUser", (userId) => {
      socket.join(userId);
      console.log(`👤 User joined personal room: ${userId}`);
    });

    // 2. Join Chat Room (Purane logic ke liye rakh lete hain, koi dikkat nahi)
    socket.on("joinChatRoom", (conversationId) => {
      socket.join(conversationId); 
    });

    // 3. 🚨 SEND MESSAGE LOGIC (ASLI FIX YAHAN HAI)
    socket.on("sendMessage", async (messageData) => {
      const { conversationId, receiverId, text, senderName, senderId } = messageData;

      // 🚨 GALTI THEEK KI: Ab message 'conversationId' mein nahi, 
      // seedha 'receiverId' (Abhishek ke personal room) mein jayega!
      io.to(receiverId).emit("receiveMessage", messageData);

      // Notification logic
      try {
        const savedNotif = await Notification.create({
          recipient: receiverId, 
          text: `💬 ${senderName}: ${text.substring(0, 20)}...`, 
          type: 'message'
        });

        // Abhishek ko Notification bhi bhejo
        io.to(receiverId).emit("newNotification", {
          id: savedNotif._id,
          conversationId: conversationId, 
          senderId: senderId,
          senderName: senderName,
          text: text.substring(0, 20),
          type: 'message',
          unread: true
        });

      } catch (error) {
        console.error("🔔 Notification Error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 User chala gaya:", socket.id);
    });
  });
};