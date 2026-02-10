
import express from 'express';
import {
    getAdminStats,
    getAdminAnalytics,
    getVendors,
    updateVendorStatus,
    deleteVendor
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/analytics', protect, authorize('admin'), getAdminAnalytics);

router.route('/vendors')
    .get(protect, authorize('admin'), getVendors);

router.route('/vendors/:id')
    .delete(protect, authorize('admin'), deleteVendor);

router.route('/vendors/:id/status')
    .put(protect, authorize('admin'), updateVendorStatus);

export default router;
