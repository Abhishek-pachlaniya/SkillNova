import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'engineer'], default: 'engineer' },
    avatar: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    bio: { type: String, maxLength: 500, default: '' },
    location: { type: String, default: '' },
    
    // Client specific
    company: { type: String, default: '' }, 

    // Engineer specific
    skills: [{ type: String, trim: true }], 
    experience: { type: String, default: '' }, 
    
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },

    appliedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    
    hourlyRate: { type: Number, default: 0 }, 
    completedProjects: { type: Number, default: 0 },
    
    // 👇 Yahan bracket theek se band ho gaya hai
    profileEmbedding: { 
        type: [Number], 
        default: [] 
    }, 

    // 👇 AUTH FIELDS ALAG SE HAIN (Root level par)
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    verificationToken: { 
        type: String 
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;