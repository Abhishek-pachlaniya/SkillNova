import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  // Is chat mein kaun-kaun hai? (Sirf 2 log: Client aur Engineer)
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  // Kis project ke baare mein baat ho rahi hai? (Optional, par achha feature hai)
  project: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Project' 
  }
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);