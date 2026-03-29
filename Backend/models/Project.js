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
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;