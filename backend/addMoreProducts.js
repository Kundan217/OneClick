import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Vendor } from './models/Vendor.js';

dotenv.config();

const addMoreProducts = async () => {
  await connectDB();

  try {
    // Get existing categories and vendors
    const categories = await Category.find();
    const vendors = await Vendor.find();

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});

    const vendorMap = vendors.reduce((acc, v) => {
      acc[v.vendorName] = v._id;
      return acc;
    }, {});

    const newProducts = [
      {
        title: 'Handwoven Jute Basket',
        slug: 'handwoven-jute-basket',
        description: 'Eco-friendly handwoven jute storage basket, perfect for organizing your home with a rustic touch.',
        price: 899,
        discount: 10,
        image: '/uploads/jute_basket.jpg',
        availability: true,
        isNew: true,
        rating: 4.5,
        countInStock: 22,
        category: categoryMap['Handmade Crafts'],
        vendor: vendorMap['Jaipur Royal Crafts'],
      },
      {
        title: 'Premium Green Tea Collection',
        slug: 'premium-green-tea-collection',
        description: 'Assorted premium green tea leaves from Darjeeling gardens, packed fresh with natural antioxidants.',
        price: 750,
        discount: 5,
        image: '/uploads/green_tea.jpg',
        availability: true,
        isNew: true,
        rating: 4.6,
        countInStock: 40,
        category: categoryMap['Food & Drink'],
        vendor: vendorMap['Kerala Spice Garden'],
      },
      {
        title: 'Decorative String Lights',
        slug: 'decorative-string-lights',
        description: 'Warm white fairy string lights with copper wire, ideal for bedroom and festive home decoration.',
        price: 499,
        discount: 15,
        image: '/uploads/string_lights.jpg',
        availability: true,
        isNew: true,
        rating: 4.4,
        countInStock: 35,
        category: categoryMap['Home & Decor'],
        vendor: vendorMap['Delhi Decor & Gifts'],
      },
      {
        title: 'Organic Rose Water Toner',
        slug: 'organic-rose-water-toner',
        description: 'Pure steam-distilled organic rose water facial toner for glowing and hydrated skin.',
        price: 399,
        discount: 0,
        image: '/uploads/rose_water.jpg',
        availability: true,
        isNew: true,
        rating: 4.7,
        countInStock: 45,
        category: categoryMap['Wellness & Beauty'],
        vendor: vendorMap['Bangalore Organic Studio'],
      },
      {
        title: 'Handcrafted Copper Water Bottle',
        slug: 'handcrafted-copper-water-bottle',
        description: 'Traditional Ayurvedic copper water bottle with hammered finish, promotes healthy drinking habits.',
        price: 1299,
        discount: 8,
        image: '/uploads/copper_bottle.jpg',
        availability: true,
        isNew: true,
        rating: 4.8,
        countInStock: 18,
        category: categoryMap['Gifts & Collectibles'],
        vendor: vendorMap['Jaipur Royal Crafts'],
      },
    ];

    const inserted = await Product.insertMany(newProducts);
    console.log(`✅ ${inserted.length} new products added successfully!`);

    const totalProducts = await Product.countDocuments();
    console.log(`📦 Total products in database: ${totalProducts}`);

    process.exit();
  } catch (error) {
    console.error('Error adding products:', error);
    process.exit(1);
  }
};

addMoreProducts();
