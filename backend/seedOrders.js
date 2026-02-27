import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { Order } from './models/Order.js';
import { Product } from './models/Product.js';
import { User } from './models/User.js';
import { Vendor } from './models/Vendor.js';

import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

const seedOrders = async () => {
    try {
        await connectDB();

        // 1. Get a Customer (or create a dummy one if needed, but seeder.js creates users)
        // seeder.js creates 'sumitkumawat@gmail.com' (admin) and vendor users.
        // Let's use the admin user as the "customer" for these orders, or find any user.
        const customer = await User.findOne({ email: 'sumitkumawat@gmail.com' });

        if (!customer) {
            console.log('Customer not found. Please run "npm run data:import" first or ensure users exist.');
            process.exit(1);
        }

        // 2. Get Vendors
        const vendors = await Vendor.find({});
        if (vendors.length === 0) {
            console.log('No vendors found.');
            process.exit(1);
        }

        console.log(`Found ${vendors.length} vendors. Creating orders for them...`);

        const orders = [];

        // 3. For each vendor, create an order
        for (const vendor of vendors) {
            // Find products for this vendor
            const products = await Product.find({ vendor: vendor._id });

            if (products.length === 0) {
                console.log(`No products for vendor ${vendor.vendorName}, skipping.`);
                continue;
            }

            // Create an order with 1-2 random products from this vendor
            const orderItems = [];
            const numItems = Math.floor(Math.random() * 2) + 1; // 1 or 2 items

            let itemsPrice = 0;

            for (let i = 0; i < numItems; i++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const qty = Math.floor(Math.random() * 3) + 1; // 1-3 qty

                orderItems.push({
                    product: product._id,
                    vendor: vendor._id,
                    quantity: qty,
                    price: product.price
                });
                itemsPrice += product.price * qty;
            }

            const shippingPrice = 50; // Flat rate
            const taxPrice = itemsPrice * 0.18; // 18% GST
            const totalPrice = itemsPrice + shippingPrice + taxPrice;

            orders.push({
                customer: customer._id,
                orderItems,
                totalPrice: Math.round(totalPrice),
                address: '123 Test St, Demo City, 12345',
                paymentStatus: 'paid',
                deliveryStatus: 'pending'
            });
        }

        if (orders.length > 0) {
            await Order.insertMany(orders);
            console.log(`Successfully created ${orders.length} orders!`);
        } else {
            console.log('No orders created (maybe no products/vendors).');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedOrders();
