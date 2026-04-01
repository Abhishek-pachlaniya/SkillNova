import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    engineer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    proposal: { type: String, required: true },
    bidAmount: { type: Number },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);