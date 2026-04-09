import express from 'express';
const router = express.Router();
import { 
    applyToProject, 
    getProjectApplications, 
    updateApplicationStatus, 
    getApplicantsByProject,
    hireEngineerByIDs
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/apply', protect, applyToProject);
router.get('/project/:projectId', protect, getProjectApplications);
router.get('/project-applicants/:id', protect, getApplicantsByProject);
router.put('/:id/status', protect, updateApplicationStatus);
router.put('/hire-engineer', protect, hireEngineerByIDs);

export default router;