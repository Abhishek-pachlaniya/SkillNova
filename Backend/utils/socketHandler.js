// sockets/socketHandler.js
import Notification from '../models/Notification.js'; 
import Message from '../models/Message.js'; // 👈 Naya Import: Message update karne ke liye
import User from '../models/User.js';
let onlineUsers = {};
export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Naya user connect hua! Socket ID:", socket.id);
    // 2. 🆕 Join Specific Chat Room (Active Chat Logic)
    socket.on("joinChatRoom", (conversationId) => {
      socket.join(conversationId);
      console.log(`💬 User joined chat room: ${conversationId}`);
    });

    // 3. 🆕 Leave Chat Room (Jab user chat band kare)
    socket.on("leaveChatRoom", (conversationId) => {
      socket.leave(conversationId);
      console.log(`🚪 User left chat room: ${conversationId}`);
    });

    // 4. SEND MESSAGE LOGIC (Refined)
    socket.on("sendMessage", async (messageData) => {
      const { conversationId, receiverId, text, senderName, senderId, _id } = messageData;

      // ⚡ Check karo: Kya receiver abhi is chat room mein active hai?
      const room = io.sockets.adapter.rooms.get(conversationId);
      const isReceiverInRoom = room && room.size > 1; // 1 se zyada matlab dono wahi hain

      try {
        if (isReceiverInRoom) {
          // ✅ Case A: Receiver chat khol kar baitha hai
          // Database mein message ko 'Read' mark karo turant
          await Message.findByIdAndUpdate(_id, { isRead: true });
          
          // Seedha room mein message bhejo (count badhane ki zarurat nahi)
          io.to(conversationId).emit("receiveMessage", { ...messageData, isRead: true });
        } else {
          // ❌ Case B: Receiver kisi aur page par hai ya offline hai
          
          // 1. Receiver ke personal room mein message bhejo (Sidebar update ke liye)
          io.to(receiverId).emit("receiveMessage", { ...messageData, isRead: false });

          // 2. Notification save karo (Notification Bell ke liye)
          const savedNotif = await Notification.create({
            recipient: receiverId, 
            text: `💬 ${senderName}: ${text.substring(0, 30)}...`,
            type: 'message'
          });

          // 3. Receiver ko count update karne ke liye event bhejo
          io.to(receiverId).emit("newNotification", {
            _id: savedNotif._id,
            conversationId: conversationId, 
            senderId: senderId,
            text: savedNotif.text,
            type: 'message',
            isRead: false,
            createdAt: new Date()
          });
        }
      } catch (error) {
        console.error("❌ Socket Error:", error.message);
      }
    });
    //online offline setup ;
    socket.on("setupUser", async (userId) => {
      if(!userId)return
      socket.join(userId);
      socket.userId = userId;
      console.log(`👤 User online: ${userId}`);
      onlineUsers[userId] = socket.id;
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("getOnlineUsers", Object.keys(onlineUsers));
      io.emit("userStatusUpdate", { userId, isOnline: true }); 
    });
    //offline setup 
    socket.on("disconnect", async () => {
      if (socket.userId) {
        delete onlineUsers[socket.userId];
        const lastSeen = new Date();
        await User.findByIdAndUpdate(socket.userId, { 
          isOnline: false, 
          lastSeen: lastSeen 
        });
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
        io.emit("userStatusUpdate", { userId: socket.userId, isOnline: false, lastSeen });
      }
    });
  
    socket.on("disconnect", () => {
      console.log("🔴 User chala gaya:", socket.id);
    });
  });
};