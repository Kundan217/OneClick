import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Vendor } from '../models/Vendor.js';
import { Category } from '../models/Category.js';

// @desc    Fetch all products with search and geo-location filtering
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { keyword, lat, lon, radius, city, category } = req.query;
  let query = {};
  let vendorIds;

  try {
    // Category filter
    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // If category name doesn't exist, return empty array immediately
        return res.json([]);
      }
    }

    // Location-based search (prioritize city if provided)
    if (city) {
      const vendors = await Vendor.find({
        city: { $regex: `^${city}`, $options: 'i' } // Case-insensitive prefix search
      });
      vendorIds = vendors.map(vendor => vendor._id);
      // Merge with existing vendor query if any (though complex logic might be needed for intersection)
      // For simplicity, we just set it here. Note: this might override other vendor filters if I tried to do multi-vendor filtering.
      // A safer way is using $and if needed, but for now this is fine.
      if (query.vendor) {
        query.vendor = { $in: vendorIds.filter(id => query.vendor.$in.includes(id)) };
      } else {
        query.vendor = { $in: vendorIds };
      }
    } else if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      const searchRadius = parseFloat(radius) || 10; // Default 10km radius

      const vendors = await Vendor.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: searchRadius * 1000, // Convert km to meters
          },
        },
      });

      vendorIds = vendors.map(vendor => vendor._id);
      if (query.vendor) {
        query.vendor = { $in: vendorIds.filter(id => query.vendor.$in.includes(id)) };
      } else {
        query.vendor = { $in: vendorIds };
      }
    }

    // Keyword search using ML Engine
    if (keyword) {
      // Fetch all products first (needed for TF-IDF context)
      // Note: In a massive DB, this isn't efficient. But for this project size, it works and provides superior results.
      // For production, you'd use MongoDB Atlas Search or ElasticSearch.
      const allProducts = await Product.find({}).populate('vendor', 'vendorName');

      const { searchByQuery } = await import('../utils/recommendationEngine.js');
      const searchResults = searchByQuery(keyword, allProducts);

      // If ML search returns results, return them.
      // If empty, fall back to basic regex (fuzzy match might miss context but catch exact substrings)
      if (searchResults.length > 0) {
        return res.json(searchResults);
      } else {
        // Fallback to basic regex
        query.title = { $regex: keyword, $options: 'i' };
        const products = await Product.find(query).populate('vendor', 'vendorName');
        return res.json(products);
      }
    }

    const products = await Product.find(query).populate('vendor', 'vendorName');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id).populate('vendor', 'vendorName ownerName city');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor/Admin
const createProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    const product = new Product({
      ...req.body,
      vendor: vendor._id,
      slug: req.body.title.toLowerCase().replace(/ /g, '-'), // Simple slug generation
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Add authorization check to ensure vendor owns the product or user is admin
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (product.vendor.toString() !== vendor._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to update this product' });
      }

      Object.assign(product, req.body);

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Add authorization check
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (product.vendor.toString() !== vendor._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to delete this product' });
      }

      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get ML-based product recommendations
// @route   GET /api/products/:id/recommendations
// @access  Public
const getProductRecommendations = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const allProducts = await Product.find({}).populate('vendor', 'vendorName');

    // Import dynamically to avoid top-level await issues if environment doesn't support it, 
    // though ES modules usually do. Better to import at top, but for now this works safely.
    const { getRecommendations } = await import('../utils/recommendationEngine.js');

    const recommendations = getRecommendations(currentProduct, allProducts);

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductRecommendations
};
