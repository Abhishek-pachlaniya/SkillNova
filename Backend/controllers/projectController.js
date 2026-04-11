import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can post projects' });
        }
        const { title, description, tags, skills, budget, deadline } = req.body;
        const project = await Project.create({
            title,
            description,
            tags: tags || skills,
            budget,
            deadline,
            clientId: req.user._id
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: "Project creation failed", error: error.message });
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('clientId', 'name email').lean();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('clientId', 'name email')
            .populate('applicants.user', 'name email avatar skills'); 

        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update" });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.clientId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await project.deleteOne();
        res.json({ message: 'Project removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ clientId: req.user._id }).lean(); 
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

export const getEngineerProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    // Applied projects dhoondo
    const projects = await Project.find({ applications: userId }).lean();

    const projectsWithStatus = projects.map(project => {
      // Is project mein current engineer ka status dhoondo
      const myApp = project.applicants.find(
        app => app.user.toString() === userId.toString()
      );
      return {
        ...project,
        // Yahan 'hired' ya 'accepted' dono check honge frontend par
        myStatus: myApp ? myApp.status : 'pending' 
      };
    });

    res.json(projectsWithStatus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

export const applyToProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { proposalText, bidAmount } = req.body;
        const userId = req.user._id;

        if (req.user.role !== 'engineer') {
            return res.status(403).json({ message: 'Only engineers can apply' });
        }

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.applications.includes(userId)) {
            return res.status(400).json({ message: "Already applied!" });
        }

        await Project.findByIdAndUpdate(projectId, {
            $push: { 
                applicants: { user: userId, proposalText, bidAmount, status: 'pending' },
                applications: userId 
            }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { appliedProjects: projectId }
        });

        res.status(200).json({ message: "Application saved successfully! 🚀" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};