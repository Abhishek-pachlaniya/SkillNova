import express from 'express';
import { 
    createProject, 
    getAllProjects, 
    getProjectById, 
    updateProject, 
    deleteProject,
    getMyProjects,
    getEngineerProjects,
    applyToProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Static Routes
router.get('/my-projects', protect, getMyProjects);
router.get('/my-applied', protect, getEngineerProjects); 

// Base Routes
router.route('/')
    .post(protect, createProject)
    .get(protect, getAllProjects);

// Dynamic ID Routes
router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

// Apply Route
router.post('/:projectId/apply', protect, applyToProject);

export default router;