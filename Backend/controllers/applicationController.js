import Application from '../models/Application.js';
import Project from '../models/Project.js';

export const applyToProject = async (req, res) => {
    try {
        const { projectId, proposal, bidAmount } = req.body;

        // 1. Check karo ki banda Engineer hai ya nahi
        if (req.user.role !== 'engineer') {
            return res.status(403).json({ message: 'Only engineers can apply to projects' });
        }

        // 2. Check karo ki kya usne pehle hi apply kar rakha hai?
        const alreadyApplied = await Application.findOne({ 
            project: projectId, 
            engineer: req.user._id 
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied to this project' });
        }

        // 3. Save Application
        const application = await Application.create({
            project: projectId,
            engineer: req.user._id,
            proposal,
            bidAmount
        });

        res.status(201).json({ message: 'Applied successfully!', application });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
export const getProjectApplications = async (req, res) => {
    try {
        // Sirf wahi applications laao jo is project ke liye hain
        // Aur Engineer ka naam aur email bhi populate karo
        const applications = await Application.find({ project: req.params.projectId })
            .populate('engineer', 'name email');
            
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// applicationController.js mein ye add kar:
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};