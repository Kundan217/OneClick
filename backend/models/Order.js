import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  orderItems: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingTimeline: [
    {
      status: { type: String, required: true },
      message: { type: String, required: true },
      location: { type: String },
      timestamp: { type: Date, default: Date.now },
    }
  ],
  address: {
    type: String,
    required: true,
  },
  isPreBooked: {
    type: Boolean,
    default: false,
  },
  preBookSlot: {
    type: String,
    default: '',
  },
  preBookNotes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export { Order };
