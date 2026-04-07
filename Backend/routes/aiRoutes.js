// routes/aiRoutes.js
import express from 'express';
import { generateProfileEmbedding, searchEngineers } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Engineer apni profile index karega
router.post('/index-profile', protect, generateProfileEmbedding);

// Client AI se search karega (Isme protect hata sakte ho agar public rakhna hai, warna laga rehne do)
router.post('/search', protect, searchEngineers);

export default router;