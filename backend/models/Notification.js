import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['order_update', 'system', 'promo'],
    default: 'system',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    enum: ['Order', 'ProductIssue', 'Product'],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export { Notification };
