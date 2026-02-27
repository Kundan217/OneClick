import { Order } from '../models/Order.js';
import { Vendor } from '../models/Vendor.js';
import { Customer } from '../models/Customer.js';

// @desc    Create a new order (regular or pre-booked)
// @route   POST /api/orders
// @access  Private/Customer
const createOrder = async (req, res) => {
  try {
    const { orderItems, address, totalPrice, isPreBooked, preBookSlot, preBookNotes } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Look up Customer profile from the logged-in user
    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found. Please complete your registration.' });
    }

    const order = new Order({
      customer: customer._id,
      orderItems,
      totalPrice,
      address,
      isPreBooked: isPreBooked || false,
      preBookSlot: preBookSlot || '',
      preBookNotes: preBookNotes || '',
    });

    const createdOrder = await order.save();

    const populatedOrder = await Order.findById(createdOrder._id)
      .populate('orderItems.product', 'title image price')
      .populate('customer', 'name email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Vendor
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('orderItems.product', 'title image price')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Vendor
const updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get vendor sales data for the last 30 days
// @route   GET /api/orders/sales
// @access  Private/Vendor
const getVendorSales = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.vendor': vendor._id } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { createOrder, getVendorSales, getAllOrders, updateOrderStatus };

