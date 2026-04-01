import express from 'express';
import { 
    createProject, 
    getAllProjects, 
    getProjectById, 
    updateProject, 
    deleteProject,
    getMyProjects
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// Basic Routes
router.route('/')
    .post(protect, createProject)
    .get(protect, getAllProjects);
router.get('/my-projects', protect, getMyProjects);
// ID Specific Routes
router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, updateProject)
    .delete(protect, deleteProject);
// projectRoutes.js
export default router;