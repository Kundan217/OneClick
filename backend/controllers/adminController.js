import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';
import { Order } from '../models/Order.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        // 1. Total Users
        const totalUsers = await User.countDocuments({});

        // 2. Active Vendors
        const totalVendors = await Vendor.countDocuments({});

        // 3. Total Revenue
        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 4. Pending Vendor Requests
        const pendingRequests = await Vendor.countDocuments({ isApproved: false });

        res.json({
            totalUsers,
            totalVendors,
            totalRevenue,
            pendingRequests
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get system growth chart data (e.g., Monthly Sales)
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
    try {
        // Last 30 days revenue
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(dailyRevenue);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ... existing imports

// ... existing getAdminStats and getAdminAnalytics ...

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private/Admin
const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({}).populate('user', 'email');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update vendor status (Approve/Reject)
// @route   PUT /api/admin/vendors/:id/status
// @access  Private/Admin
const updateVendorStatus = async (req, res) => {
    try {
        const { status } = req.body; // status: 'approved' | 'rejected'
        const vendor = await Vendor.findById(req.params.id);

        if (vendor) {
            if (status === 'approved') {
                vendor.isApproved = true;
            } else if (status === 'rejected') {
                vendor.isApproved = false;
            }
            const updatedVendor = await vendor.save();
            res.json(updatedVendor);
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete vendor
// @route   DELETE /api/admin/vendors/:id
// @access  Private/Admin
const deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (vendor) {
            await vendor.deleteOne();
            // Optionally delete associated User/Products logic here if needed
            res.json({ message: 'Vendor removed' });
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export { getAdminStats, getAdminAnalytics, getVendors, updateVendorStatus, deleteVendor };
