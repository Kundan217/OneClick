import express from 'express';
import { createReview, getProductReviews, deleteReview, canReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:productId')
    .get(getProductReviews)
    .post(protect, createReview);

router.route('/:productId/can-review')
    .get(protect, canReview);

router.route('/:id/delete')
    .delete(protect, deleteReview);

export default router;
