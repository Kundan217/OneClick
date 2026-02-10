import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
    unique: true,
  },
  shopLogo: {
    type: String,
  },
  ownerName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere',
    },
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  storeDescription: {
    type: String,
  },
  bankAccount: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
}, { timestamps: true });

vendorSchema.index({ location: '2dsphere' });

const Vendor = mongoose.model('Vendor', vendorSchema);

export { Vendor };
