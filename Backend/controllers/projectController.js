import Project from '../models/Project.js';

// @desc    Create a new project
// @route   POST /api/projects
export const createProject = async (req, res) => {
    try {
        const { title, description, tags, budget, deadline } = req.body;

        // Ensure user is a client (optional check if you want)
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can post projects' });
        }

        const project = await Project.create({
            title,
            description,
            tags,
            budget,
            deadline,
            clientId: req.user._id // Middleware se aa raha hai
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all projects
// @route   GET /api/projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('clientId', 'name email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Single Project by ID
// @route   GET /api/projects/:id
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('clientId', 'name email');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Check karo ki wahi client update kar raha hai jisne banaya tha
        if (project.clientId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to update this project' });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // Jo bhi fields aayi hain unhe update kar do
            { new: true } // Updated document wapas chahiye
        );

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
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