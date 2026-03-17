import { ProductIssue } from '../models/ProductIssue.js';
import { Product } from '../models/Product.js';
import { Vendor } from '../models/Vendor.js';

// @desc    Report an issue with a product
// @route   POST /api/issues
// @access  Private
const reportIssue = async (req, res) => {
  try {
    const { productId, subject, description } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const issue = new ProductIssue({
      product: productId,
      reportedBy: req.user._id,
      vendor: product.vendor,
      subject,
      description,
      imageUrl,
    });

    const createdIssue = await issue.save();
    res.status(201).json(createdIssue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all issues for the logged-in vendor
// @route   GET /api/issues/vendor
// @access  Private/Vendor
const getVendorIssues = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const issues = await ProductIssue.find({ vendor: vendor._id })
      .populate('product', 'title image')
      .populate('reportedBy', 'email')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all platform issues
// @route   GET /api/issues/admin
// @access  Private/Admin
const getAdminIssues = async (req, res) => {
  try {
    const issues = await ProductIssue.find({})
      .populate('product', 'title image')
      .populate('vendor', 'vendorName email')
      .populate('reportedBy', 'email')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id
// @access  Private (Vendor/Admin)
const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Resolved' or 'Dismissed'
    const issue = await ProductIssue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify ownership or admin role
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (issue.vendor.toString() !== vendor._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    issue.status = status || issue.status;
    const updatedIssue = await issue.save();

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { reportIssue, getVendorIssues, getAdminIssues, updateIssueStatus };
