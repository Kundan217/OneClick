import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { Vendor } from './models/Vendor.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});

// Define Port
const PORT = process.env.PORT || 5000;

import fs from 'fs';

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
      console.log('Created uploads directory');
    }

    // Ensure geospatial index exists for the Vendor model
    await Vendor.createIndexes();
    console.log('Vendor geospatial index ensured.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
