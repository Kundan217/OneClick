import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { Order } from '../models/Order.js';

// Helper: recalculate product rating using Bayesian Average
// Formula: bayesianRating = (C * m + Σratings) / (C + n)
//   C = average number of reviews across all products (confidence weight)
//   m = global mean rating across all reviews (prior)
//   n = number of reviews for this product
//   Σratings = sum of ratings for this product
const updateProductRating = async (productId) => {
    const productReviews = await Review.find({ product: productId });
    const n = productReviews.length;
    const sumRatings = productReviews.reduce((sum, r) => sum + r.rating, 0);

    // Calculate global priors from ALL reviews across ALL products
    const allReviews = await Review.find({});
    const totalReviews = allReviews.length;
    const globalMean = totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 3; // default prior: 3 stars (neutral)

    // C = average number of reviews per reviewed product
    const reviewedProducts = await Review.distinct('product');
    const C = reviewedProducts.length > 0
        ? totalReviews / reviewedProducts.length
        : 2; // minimum confidence weight of 2

    // Bayesian average
    const bayesianRating = n > 0
        ? (C * globalMean + sumRatings) / (C + n)
        : 0;

    await Product.findByIdAndUpdate(productId, {
        rating: Math.round(bayesianRating * 10) / 10,
        numReviews: n,
    });
};

// @desc    Create a review (only if purchased & delivered)
// @route   POST /api/reviews/:productId
// @access  Private/Customer
const createReview = async (req, res) => {
    try {
        const { rating, title, feedback } = req.body;
        const productId = req.params.productId;

        // Find customer profile
        const customer = await Customer.findOne({ user: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer profile not found' });
        }

        // Check if customer has a DELIVERED order containing this product
        const deliveredOrder = await Order.findOne({
            customer: customer._id,
            deliveryStatus: 'delivered',
            'orderItems.product': productId,
        });

        if (!deliveredOrder) {
            return res.status(403).json({
                message: 'Aap sirf wahi product review kar sakte ho jo aapne purchase kiya hai aur deliver ho chuka hai.'
            });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ product: productId, customer: customer._id });
        if (existingReview) {
            return res.status(400).json({ message: 'Aapne ye product pehle se review kar diya hai.' });
        }

        const review = await Review.create({
            product: productId,
            customer: customer._id,
            customerName: customer.name,
            rating: Number(rating),
            title: title || '',
            feedback,
        });

        await updateProductRating(productId);

        res.status(201).json(review);
    } catch (error) {
        console.error('Create Review Error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Aapne ye product pehle se review kar diya hai.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private/Customer
const deleteReview = async (req, res) => {
    try {
        const customer = await Customer.findOne({ user: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer profile not found' });
        }

        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.customer.toString() !== customer._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        const productId = review.product;
        await review.deleteOne();

        await updateProductRating(productId);

        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Check if customer can review a product
// @route   GET /api/reviews/:productId/can-review
// @access  Private/Customer
const canReview = async (req, res) => {
    try {
        const customer = await Customer.findOne({ user: req.user._id });
        if (!customer) {
            return res.json({ canReview: false, reason: 'no_profile' });
        }

        // Check delivered order
        const deliveredOrder = await Order.findOne({
            customer: customer._id,
            deliveryStatus: 'delivered',
            'orderItems.product': req.params.productId,
        });

        if (!deliveredOrder) {
            return res.json({ canReview: false, reason: 'not_purchased' });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ product: req.params.productId, customer: customer._id });
        if (existingReview) {
            return res.json({ canReview: false, reason: 'already_reviewed' });
        }

        return res.json({ canReview: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export { createReview, getProductReviews, deleteReview, canReview };
