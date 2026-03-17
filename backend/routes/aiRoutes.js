import express from 'express';
import { search } from '../controllers/aiController.js';

const router = express.Router();

// POST /api/ai/search — AI natural language product search
router.post('/search', search);

export default router;
