import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Order } from './models/Order.js';
import { Product } from './models/Product.js';
import { Customer } from './models/Customer.js';
import { Vendor } from './models/Vendor.js';
import { User } from './models/User.js';

dotenv.config();

const createSampleOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete existing orders
        await Order.deleteMany({});
        console.log('Cleared existing orders');

        // Get products
        const products = await Product.find().limit(5);
        if (products.length === 0) {
            console.log('No products found!');
            process.exit(1);
        }

        // Get vendor
        let vendor = await Vendor.findOne();
        if (!vendor) {
            // Create vendor if not exists
            const vendorUser = await User.findOne({ role: 'vendor' });
            if (vendorUser) {
                vendor = await Vendor.create({
                    user: vendorUser._id,
                    businessName: 'Test Store',
                    description: 'Test vendor store'
                });
            } else {
                console.log('No vendor user found!');
                process.exit(1);
            }
        }
        console.log('Using vendor:', vendor._id);

        // Get or create a customer
        let customer = await Customer.findOne();
        if (!customer) {
            const customerUser = await User.findOne({ role: 'customer' });
            if (customerUser) {
                customer = await Customer.create({
                    user: customerUser._id,
                    name: 'Test Customer',
                    email: 'customer@test.com',
                    phone: '9876543210'
                });
            } else {
                // Create a customer user first
                const newUser = await User.create({
                    name: 'Test Customer',
                    email: 'testcustomer@test.com',
                    password: 'password123',
                    role: 'customer'
                });
                customer = await Customer.create({
                    user: newUser._id,
                    name: 'Test Customer',
                    email: 'testcustomer@test.com',
                    phone: '9876543210'
                });
            }
            console.log('Created test customer');
        }

        // Create 3 sample orders with CORRECT vendor ID
        const orders = [
            {
                customer: customer._id,
                orderItems: [
                    {
                        product: products[0]._id,
                        vendor: vendor._id,
                        quantity: 2,
                        price: products[0].price
                    },
                    {
                        product: products[1]?._id || products[0]._id,
                        vendor: vendor._id,
                        quantity: 1,
                        price: products[1]?.price || products[0].price
                    }
                ],
                totalPrice: (products[0].price * 2) + (products[1]?.price || products[0].price),
                paymentStatus: 'paid',
                deliveryStatus: 'delivered',
                address: '123 Main Street, Mumbai, Maharashtra 400001'
            },
            {
                customer: customer._id,
                orderItems: [
                    {
                        product: products[2]?._id || products[0]._id,
                        vendor: vendor._id,
                        quantity: 3,
                        price: products[2]?.price || products[0].price
                    }
                ],
                totalPrice: (products[2]?.price || products[0].price) * 3,
                paymentStatus: 'paid',
                deliveryStatus: 'shipped',
                address: '456 Park Avenue, Delhi 110001'
            },
            {
                customer: customer._id,
                orderItems: [
                    {
                        product: products[3]?._id || products[0]._id,
                        vendor: vendor._id,
                        quantity: 1,
                        price: products[3]?.price || products[0].price
                    },
                    {
                        product: products[4]?._id || products[0]._id,
                        vendor: vendor._id,
                        quantity: 2,
                        price: products[4]?.price || products[0].price
                    }
                ],
                totalPrice: (products[3]?.price || products[0].price) + ((products[4]?.price || products[0].price) * 2),
                paymentStatus: 'pending',
                deliveryStatus: 'pending',
                address: '789 Lake View Road, Bangalore 560001'
            }
        ];

        // Insert orders
        const createdOrders = await Order.insertMany(orders);
        console.log(`✅ Created ${createdOrders.length} sample orders!`);

        createdOrders.forEach((order, i) => {
            console.log(`Order ${i + 1}: ₹${order.totalPrice} - ${order.deliveryStatus} - ${order.paymentStatus}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createSampleOrders();
