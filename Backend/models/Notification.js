import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Jisko notification bhejna hai (Client ya Engineer)
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Notification mein kya likha hai
  text: { 
    type: String, 
    required: true 
  },
  // Padh liya ya nahi (Blue dot dikhane ke liye)
  isRead: { 
    type: Boolean, 
    default: false 
  },
  // Kis type ka alert hai
  type: {
    type: String,
    enum: ['message', 'project', 'system'],
    default: 'system'
  }
}, { timestamps: true }); // timestamps apne aap 'time' nikaal lega

export default mongoose.model('Notification', notificationSchema);