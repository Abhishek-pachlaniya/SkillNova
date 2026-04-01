import mongoose from 'mongoose'; // 👈 Ye line add karo!

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
    
    hourlyRate: { type: Number, default: 0 }, 
    completedProjects: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User; // 👈 Ye export ab kaam karega