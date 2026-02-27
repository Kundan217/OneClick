import express from 'express';
import { createOrder, getVendorSales, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('customer'), createOrder)
    .get(protect, authorize('vendor'), getAllOrders);
router.route('/sales').get(protect, authorize('vendor'), getVendorSales);
router.route('/:id').put(protect, authorize('vendor'), updateOrderStatus);

export default router;

