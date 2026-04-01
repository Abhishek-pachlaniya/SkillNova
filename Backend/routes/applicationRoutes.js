import express from 'express';
const router = express.Router();
import { applyToProject, getProjectApplications } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { updateApplicationStatus } from '../controllers/applicationController.js';

router.post('/apply', protect, applyToProject);
router.get('/project/:projectId', protect, getProjectApplications);
router.put('/:id/status', protect, updateApplicationStatus);
export default router;