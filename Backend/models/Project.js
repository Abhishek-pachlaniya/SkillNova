import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String], // e.g., ["React", "Node.js", "AI"]
    budget: { type: Number, required: true },
    deadline: { type: Date },
    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['open', 'in-progress', 'completed'], 
        default: 'open' 
    },
    // ✅ YAHAN CHANGE KIYA HAI: Ab har applicant ka apna status hoga
    // models/Project.js mein applicants array ko aisa kar de:
applicants: [
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        proposalText: { type: String }, // 👈 NAYA: Proposal save karne ke liye
        bidAmount: { type: Number },    // 👈 NAYA: Bid amount save karne ke liye
        status: { 
            type: String, 
            enum: ['pending', 'interviewing', 'hired', 'rejected'], 
            default: 'pending' 
        },
        appliedAt: { 
            type: Date, 
            default: Date.now 
        }
    }
]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;