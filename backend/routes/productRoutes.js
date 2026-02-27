import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductRecommendations, getMyProducts } from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, authorize('vendor', 'admin'), createProduct);
router.route('/my').get(protect, authorize('vendor', 'admin'), getMyProducts);
router.route('/:id').get(getProductById).put(protect, authorize('vendor', 'admin'), updateProduct).delete(protect, authorize('vendor', 'admin'), deleteProduct);
router.route('/:id/recommendations').get(getProductRecommendations);

export default router;
