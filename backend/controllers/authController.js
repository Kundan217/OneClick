import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
import { Vendor } from '../models/Vendor.js';
import { generateToken } from '../utils/generateToken.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { email, password, role, ...profileData } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      role,
    });

    if (user) {
      // Create a profile based on the role
      if (role === 'customer') {
        await Customer.create({ user: user._id, email, ...profileData });
      } else if (role === 'vendor') {
        const vendorData = { ...profileData, user: user._id, email };
        // Ensure location has coordinates if not provided
        if (!vendorData.location || !vendorData.location.coordinates) {
          vendorData.location = {
            type: 'Point',
            coordinates: [0, 0] // Default coordinates
          };
        }
        await Vendor.create(vendorData);
      }

      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'An unexpected server error occurred during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      let profileData = {};
      if (user.role === 'customer') {
        const customer = await Customer.findOne({ user: user._id });
        if (customer) {
          profileData = {
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            country: customer.country
          };
        }
      } else if (user.role === 'vendor') {
        const vendor = await Vendor.findOne({ user: user._id });
        if (vendor) {
          profileData = {
            ownerName: vendor.ownerName,
            vendorName: vendor.vendorName,
            mobile: vendor.mobile,
            address: vendor.address,
            city: vendor.city,
            storeDescription: vendor.storeDescription,
            bankAccount: vendor.bankAccount,
            ifscCode: vendor.ifscCode
          };
        }
      }

      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        ...profileData,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    await PasswordResetToken.create({
      user: user._id,
      token: resetToken,
    });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      await PasswordResetToken.deleteOne({ token: resetToken });
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const resetToken = await PasswordResetToken.findOne({ token: req.params.resettoken });

    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Get user and set new password
    const user = await User.findById(resetToken.user);
    user.password = req.body.password;
    await user.save();

    // Delete the token
    await resetToken.deleteOne();

    res.status(200).json({ success: true, data: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {


    let profileData = {};
    if (user.role === 'customer') {
      const customer = await Customer.findOne({ user: user._id });
      if (customer) {
        profileData = {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          country: customer.country
        };
      }
    } else if (user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: user._id });
      if (vendor) {
        profileData = {
          ownerName: vendor.ownerName,
          vendorName: vendor.vendorName,
          mobile: vendor.mobile,
          address: vendor.address,
          city: vendor.city,
          storeDescription: vendor.storeDescription,
          bankAccount: vendor.bankAccount,
          ifscCode: vendor.ifscCode
        };
      }
    }

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      ...profileData
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    let profileData = {};

    if (user.role === 'customer') {
      const customer = await Customer.findOne({ user: user._id });
      if (customer) {
        customer.name = req.body.name || customer.name;
        customer.phone = req.body.phone || customer.phone;
        customer.address = req.body.address || customer.address;
        customer.country = req.body.country || customer.country;
        const updatedCustomer = await customer.save();
        profileData = {
          name: updatedCustomer.name,
          phone: updatedCustomer.phone,
          address: updatedCustomer.address,
          country: updatedCustomer.country
        };
      }
    } else if (user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: user._id });
      if (vendor) {
        vendor.ownerName = req.body.ownerName || vendor.ownerName;
        vendor.vendorName = req.body.vendorName || vendor.vendorName;
        vendor.mobile = req.body.mobile || vendor.mobile;
        vendor.address = req.body.address || vendor.address;
        vendor.city = req.body.city || vendor.city;
        vendor.storeDescription = req.body.storeDescription || vendor.storeDescription;
        vendor.bankAccount = req.body.bankAccount || vendor.bankAccount;
        vendor.ifscCode = req.body.ifscCode || vendor.ifscCode;

        const updatedVendor = await vendor.save();
        profileData = {
          ownerName: updatedVendor.ownerName,
          vendorName: updatedVendor.vendorName,
          mobile: updatedVendor.mobile,
          address: updatedVendor.address,
          city: updatedVendor.city,
          storeDescription: updatedVendor.storeDescription,
          bankAccount: updatedVendor.bankAccount,
          ifscCode: updatedVendor.ifscCode
        };
      }
    }

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id, updatedUser.role),
      ...profileData
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser
};
