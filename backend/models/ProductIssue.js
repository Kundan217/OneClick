import mongoose from 'mongoose';

const productIssueSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved', 'Dismissed'],
    default: 'Pending',
  },
}, { timestamps: true });

const ProductIssue = mongoose.model('ProductIssue', productIssueSchema);

export { ProductIssue };
