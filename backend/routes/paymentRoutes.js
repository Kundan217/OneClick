import express from 'express';
import { createOrder, verifySignature } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifySignature);

export default router;
