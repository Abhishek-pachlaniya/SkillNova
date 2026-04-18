// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String },
  // 🔥 YE HAI NAYA ATTACHMENT FIELD
    attachment: {
        url: { type: String },       // Cloudinary ka URL
        fileType: { type: String },  // 'image/png', 'application/pdf', etc.
        fileName: { type: String }   // Asli file ka naam (e.g. resume.pdf)
    },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);