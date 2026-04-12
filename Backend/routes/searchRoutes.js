import express from 'express';
import { globalSearch } from '../controllers/searchController.js';
import { protect } from '../middleware/authMiddleware.js'; // Tumhara auth middleware

const router = express.Router();

router.get('/', protect, globalSearch);

export default router;