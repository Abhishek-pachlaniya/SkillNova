// sockets/socketHandler.js
import Notification from '../models/Notification.js'; 
import Message from '../models/Message.js'; 
import User from '../models/User.js';

let onlineUsers = {}; // ⚡ Users track karne ke liye global object

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket Connected:", socket.id);

    // 1. SETUP USER: Status Online & Identification
    socket.on("setupUser", async (userId) => {
      if(!userId) return;
      const uId = String(userId);
      socket.join(uId);
      socket.userId = uId; // Disconnect ke liye identification
      
      onlineUsers[uId] = socket.id;

      await User.findByIdAndUpdate(uId, { isOnline: true });
      
      // ⚡ Sabko update bhejo
      io.emit("getOnlineUsers", Object.keys(onlineUsers));
      io.emit("userStatusUpdate", { userId: uId, isOnline: true }); 
      
      console.log(`👤 User Online: ${uId}`);
    });

    socket.on("joinChatRoom", (conversationId) => {
      socket.join(String(conversationId));
    });

    socket.on("leaveChatRoom", (conversationId) => {
      socket.leave(String(conversationId));
    });

    // 2. ⚡ SEND MESSAGE: Double-Echo aur Delivery Fix
    socket.on("sendMessage", async (messageData) => {
      const { conversationId, receiverId, _id, senderName, text } = messageData;
      const cId = String(conversationId);
      const rId = String(receiverId);

      try {
        // Check karo: Kya receiver abhi is chat room mein active hai?
        const room = io.sockets.adapter.rooms.get(cId);
        const isReceiverInRoom = room && room.size > 1;

        if (isReceiverInRoom) {
          // ✅ Case A: Dono chat room mein hain
          await Message.findByIdAndUpdate(_id, { isRead: true });
          
          // ⚡ socket.to() sirf room ke BAAKI logo (receiver) ko bhejega
          // Isse double-message (echo) nahi hoga
          socket.to(cId).emit("receiveMessage", { ...messageData, isRead: true });
          
          console.log(`✅ Message delivered & read in room: ${cId}`);
        } else {
          // ❌ Case B: Receiver chat ke bahar hai ya offline hai
          
          // Sidebar update ke liye uske personal room mein bhejo
          io.to(rId).emit("receiveMessage", { ...messageData, isRead: false });

          // Notification create karo
          const savedNotif = await Notification.create({
            recipient: receiverId, 
            text: `💬 ${senderName}: ${text.substring(0, 30)}...`,
            type: 'message'
          });

          io.to(rId).emit("newNotification", { 
            _id: savedNotif._id, 
            conversationId: cId, 
            text: savedNotif.text, 
            type: 'message',
            isRead: false,
            createdAt: new Date()
          });
          
          console.log(`📩 Message sent to personal room (Offline/Other page): ${rId}`);
        }
      } catch (error) {
        console.error("❌ Socket Error:", error.message);
      }
    });

    // 3. DISCONNECT: Status Offline & Cleanup
    socket.on("disconnect", async () => {
      if (socket.userId) {
        delete onlineUsers[socket.userId];
        
        const lastSeen = new Date();
        await User.findByIdAndUpdate(socket.userId, { 
          isOnline: false, 
          lastSeen: lastSeen 
        });

        // Updated status broadcast karo
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
        io.emit("userStatusUpdate", { userId: socket.userId, isOnline: false, lastSeen });
        
        console.log(`🔴 User Offline: ${socket.userId}`);
      }
    });
  });
};