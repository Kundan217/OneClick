import express from 'express';
import { getVendorSales, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, authorize('vendor'), getAllOrders);
router.route('/sales').get(protect, authorize('vendor'), getVendorSales);
router.route('/:id').put(protect, authorize('vendor'), updateOrderStatus);

export default router;

