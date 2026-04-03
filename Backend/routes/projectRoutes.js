import express from 'express';
import { 
    createProject, 
    getAllProjects, 
    getProjectById, 
    updateProject, 
    deleteProject,
    getMyProjects,
    getEngineerProjects,
    applyForProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Basic & Static Routes (Hamesha /:id se upar rakho)
router.route('/')
    .post(protect, createProject)
    .get(protect, getAllProjects);

router.get('/my-projects', protect, getMyProjects);
router.get('/my-applied', protect, getEngineerProjects); 

// 2. Action Routes (Apply karne ke liye POST aur Project ID zaroori hai)
router.post('/:id/apply', protect, applyForProject); 

// 3. ID Specific Routes (Hamesha sabse last mein rakho)
router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

export default router;