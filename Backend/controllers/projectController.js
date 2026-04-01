import Project from '../models/Project.js';

// @desc    Create a new project (Merge Version)
// @route   POST /api/projects
export const createProject = async (req, res) => {
    try {
        // Frontend se aane waali saari possible fields
        const { title, description, tags, skills, budget, deadline } = req.body;

        // 1. Security Check: Sirf 'client' hi post kar sake
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Forbidden: Only clients can post projects' });
        }

        // 2. Project Creation
        // Note: 'tags' aur 'skills' dono rakhe hain taaki frontend se jo bhi aaye handle ho jaye
        const project = await Project.create({
            title,
            description,
            tags: tags || skills, // Agar tags nahi toh skills use kar lo
            budget,
            deadline,
            clientId: req.user._id // Middleware (protect) se aa raha hai
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: "Project creation failed", error: error.message });
    }
};

// @desc    Get all projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('clientId', 'name email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Single Project by ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('clientId', 'name email');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/// projectController.js mein update function
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params; // Project ID
        const userId = req.user._id; // Logged-in User ID (from auth middleware)

        // 1. Pehle project dhundo
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ msg: "Project nahi mila!" });
        }

        // 2. 🔥 CHECK: Kya ye wahi user hai jisne project banaya tha?
        // Hum check kar rahe hain ki Project ki 'client' field aur logged-in user ki ID match karti hai ya nahi
        if (project.client.toString() !== userId.toString()) {
            return res.status(403).json({ 
                msg: "Bhai, ye tera project nahi hai! Tu ise update nahi kar sakta. 😂" 
            });
        }

        // 3. Agar owner hai, tabhi update hone do
        const updatedProject = await Project.findByIdAndUpdate(
            id, 
            { $set: req.body }, 
            { new: true }
        );

        res.json(updatedProject);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// @desc    Delete a project
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
        // req.user._id humein 'protect' middleware se mil raha hai
        const projects = await Project.find({ clientId: req.user._id }); 
        
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching your projects', 
            error: error.message 
        });
    }
};