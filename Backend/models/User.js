import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['client', 'engineer'], 
        default: 'engineer' 
    },
    
    avatar: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    bio: { type: String, maxLength: 500 },
    skills: [{ type: String, trim: true }], // Array of skills
    experience: { type: String }, // e.g. "2+ years"
    location: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    websiteUrl: { type: String },
    hourlyRate: { type: Number, default: 0 }, // Barter value calculation ke liye
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;