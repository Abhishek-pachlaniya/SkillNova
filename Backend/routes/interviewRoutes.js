import express from 'express';
const router = express.Router();
import {protect} from '../middleware/authMiddleware.js'; // Path check kar lena
import { sendRequest } from '../controllers/interviewController.js';

// POST request
router.post('/request-interview', protect, sendRequest);

export default router;