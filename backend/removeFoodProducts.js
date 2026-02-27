import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';

dotenv.config();

const removeFoodProducts = async () => {
    await connectDB();

    try {
        const categoryName = 'Food & Drink';
        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            console.log(`Category '${categoryName}' not found.`);
            process.exit();
        }

        // Delete products in this category
        const deletedProducts = await Product.deleteMany({ category: category._id });
        console.log(`✅ Deleted ${deletedProducts.deletedCount} products from '${categoryName}'.`);

        // Delete the category itself
        await Category.findByIdAndDelete(category._id);
        console.log(`✅ Deleted category '${categoryName}'.`);

        process.exit();
    } catch (error) {
        console.error('Error deleting data:', error);
        process.exit(1);
    }
};

removeFoodProducts();
