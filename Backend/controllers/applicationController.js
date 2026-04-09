import Application from '../models/Application.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { sendNotification } from '../utils/notificationHelper.js';

export const applyToProject = async (req, res) => {
    try {
        const { projectId, proposal, bidAmount } = req.body;
        if (req.user.role !== 'engineer') {
            return res.status(403).json({ message: 'Only engineers can apply' });
        }

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const alreadyApplied = await Application.findOne({ project: projectId, engineer: req.user._id });
        if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });

        const application = await Application.create({
            project: projectId,
            engineer: req.user._id,
            proposal,
            bidAmount
        });

        await Project.findByIdAndUpdate(projectId, {
            $push: { 
                applicants: { user: req.user._id, proposalText: proposal, bidAmount, status: 'pending' },
                applications: req.user._id 
            }
        });

        await User.findByIdAndUpdate(req.user._id, { $push: { appliedProjects: projectId } });

        await sendNotification(req, project.clientId, "New applicant for your project", "project");

        res.status(201).json({ message: 'Applied!', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectApplications = async (req, res) => {
    try {
        const applications = await Application.find({ project: req.params.projectId })
            .populate('engineer', 'name email skills bio location experience avatar');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        const application = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
        if (!application) return res.status(404).json({ message: "Application not found!" });

        await Project.updateOne(
            { _id: application.project, "applicants.user": application.engineer },
            { $set: { "applicants.$.status": status } }
        );

        const alertMessage = status === 'hired' 
            ? "🎉 Badhai ho! Client ne aapko is project ke liye HIRE kar liya hai." 
            : "Application status updated.";

        await sendNotification(req, application.engineer, alertMessage, "project");

        res.json({ success: true, application });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

export const getApplicantsByProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate({
            path: 'applicants.user',
            select: 'name email skills bio location experience avatar'
        });
        if (!project) return res.status(404).json({ message: "Project not found!" });
        res.json(project.applicants || []);
    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message });
    }
};

export const hireEngineerByIDs = async (req, res) => {
    try {
        const { projectId, engineerId, status } = req.body;

        await Project.updateOne(
            { _id: projectId, "applicants.user": engineerId },
            { $set: { "applicants.$.status": status } }
        );

        const application = await Application.findOneAndUpdate(
            { project: projectId, engineer: engineerId },
            { status },
            { new: true }
        );

        const alertMessage = status === 'hired' 
            ? "🎉 Badhai ho! Client ne aapko hire kar liya hai." 
            : "Application status updated.";

        await sendNotification(req, engineerId, alertMessage, "project");

        res.json({ success: true, message: "Engineer hired!" });
    } catch (error) {
        res.status(500).json({ message: "Hiring failed!", error: error.message });
    }
};