import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes (300 seconds)
  },
});

// Middleware to hash OTP before saving
otpTokenSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
});

// Method to verify OTP
otpTokenSchema.methods.matchOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

const OtpToken = mongoose.model('OtpToken', otpTokenSchema);

export { OtpToken };
