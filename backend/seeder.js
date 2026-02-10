import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Vendor } from './models/Vendor.js';
import { User } from './models/User.js';

dotenv.config();

// Mock data - 20 products across 6 categories with real images
const mockProducts = [
  // Handmade Crafts (4 products)
  { title: 'Handcrafted Ceramic Bowl', price: 999, image: '/uploads/bowl.png', category: 'Handmade Crafts', description: 'A beautifully handcrafted ceramic bowl with intricate blue and white patterns, perfect for any kitchen.', countInStock: 10, rating: 4.5 },
  { title: 'Macrame Wall Hanging', price: 1499, image: '/uploads/macrame.png', category: 'Handmade Crafts', description: 'Elegant bohemian macrame wall hanging with intricate knots and tassels in natural cream cotton rope.', countInStock: 15, rating: 4.8 },
  { title: 'Wooden Mandala Coasters', price: 699, image: '/uploads/coasters.png', category: 'Handmade Crafts', description: 'Set of four handcrafted wooden coasters with beautiful carved mandala patterns.', countInStock: 20, rating: 4.6 },
  { title: 'Brass Peacock Diya', price: 1899, image: '/uploads/brass_lamp.png', category: 'Handmade Crafts', description: 'Ornate traditional Indian brass oil lamp with intricate peacock carvings and polished golden finish.', countInStock: 12, rating: 4.9 },

  // Food & Drink (4 products)
  { title: 'Pure Organic Honey', price: 650, image: '/uploads/honey.png', category: 'Food & Drink', description: 'Pure golden organic honey with honeycomb, sourced from local beekeepers in the Western Ghats.', countInStock: 30, rating: 4.7 },
  { title: 'Artisanal Cheese Selection', price: 1250, image: '/uploads/cheese.png', category: 'Food & Drink', description: 'Premium selection of aged artisanal cheeses with herbs, perfect for cheese platters.', countInStock: 12, rating: 4.5 },
  { title: 'Premium Coffee Beans', price: 1200, image: '/uploads/coffee.png', category: 'Food & Drink', description: 'Freshly roasted dark roast gourmet coffee beans from Coorg plantations.', countInStock: 25, rating: 4.8 },
  { title: 'Indian Spice Collection', price: 899, image: '/uploads/spices.png', category: 'Food & Drink', description: 'Traditional Indian spice set including turmeric, cumin, cardamom, and cinnamon in elegant glass jars.', countInStock: 35, rating: 4.9 },

  // Home & Decor (4 products)
  { title: 'Minimalist Ceramic Vase', price: 1299, image: '/uploads/vase.png', category: 'Home & Decor', description: 'Elegant minimalist ceramic vase in soft beige with dried pampas grass for a calming aesthetic.', countInStock: 18, rating: 4.6 },
  { title: 'Geometric Handwoven Rug', price: 4500, image: '/uploads/rug.png', category: 'Home & Decor', description: 'Cozy handwoven rug with geometric patterns in warm terracotta and cream colors.', countInStock: 5, rating: 4.8 },
  { title: 'Decorative Wall Mirror', price: 2999, image: '/uploads/mirror.jpg', category: 'Home & Decor', description: 'Beautiful round wall mirror with handcrafted wooden frame featuring intricate carvings.', countInStock: 8, rating: 4.4 },
  { title: 'Terracotta Planter Set', price: 1599, image: '/uploads/planters.jpg', category: 'Home & Decor', description: 'Set of 3 handmade terracotta planters in different sizes, perfect for indoor plants.', countInStock: 15, rating: 4.7 },

  // Fashion & Accessories (3 products)
  { title: 'Premium Leather Tote', price: 5999, image: '/uploads/tote_bag.png', category: 'Fashion & Accessories', description: 'Durable and stylish premium brown leather tote bag with elegant stitching for daily use.', countInStock: 8, rating: 4.9 },
  { title: 'Silk Paisley Scarf', price: 1599, image: '/uploads/scarf.png', category: 'Fashion & Accessories', description: 'Luxurious silk scarf with elegant paisley pattern in jewel tones of purple and gold.', countInStock: 25, rating: 4.7 },
  { title: 'Handcrafted Leather Wallet', price: 2499, image: '/uploads/wallet.jpg', category: 'Fashion & Accessories', description: 'Premium handstitched leather wallet with multiple card slots and coin pocket.', countInStock: 20, rating: 4.6 },

  // Wellness & Beauty (3 products)
  { title: 'Organic Lavender Soap', price: 549, image: '/uploads/soap.jpg', category: 'Wellness & Beauty', description: 'Handmade organic soap with soothing lavender essential oils and dried flowers.', countInStock: 50, rating: 4.8 },
  { title: 'Aromatherapy Oil Set', price: 1100, image: '/uploads/essential_oils.jpg', category: 'Wellness & Beauty', description: 'Set of pure essential oils in amber bottles for aromatherapy and wellness rituals.', countInStock: 20, rating: 4.7 },
  { title: 'Natural Body Butter', price: 799, image: '/uploads/body_butter.jpg', category: 'Wellness & Beauty', description: 'Nourishing body butter made with shea butter, coconut oil, and natural herbs.', countInStock: 30, rating: 4.5 },

  // Gifts & Collectibles (2 products)
  { title: 'Luxury Gift Hamper', price: 3500, image: '/uploads/gift_hamper.jpg', category: 'Gifts & Collectibles', description: 'Beautifully curated luxury gift hamper with artisanal treats and handmade items.', countInStock: 10, rating: 4.9 },
  { title: 'Handpainted Photo Frame', price: 1299, image: '/uploads/photo_frame.jpg', category: 'Gifts & Collectibles', description: 'Beautiful handpainted wooden photo frame with traditional Rajasthani artwork.', countInStock: 15, rating: 4.6 },
];

const importData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await Vendor.deleteMany();
    await User.deleteMany();

    console.log('Data cleared...');

    // Create Admin User
    await User.create({
      email: 'sumitkumawat@gmail.com',
      password: 'Sumit@123',
      role: 'admin',
    });
    console.log('Admin user created (sumitkumawat@gmail.com / Sumit@123)');

    // Create Indian Vendors
    const vendorUsers = await User.create([
      { email: 'jaipur@example.com', password: 'password123', role: 'vendor' },
      { email: 'kerala@example.com', password: 'password123', role: 'vendor' },
      { email: 'mumbai@example.com', password: 'password123', role: 'vendor' },
      { email: 'delhi@example.com', password: 'password123', role: 'vendor' },
      { email: 'bangalore@example.com', password: 'password123', role: 'vendor' },
    ]);

    const vendors = await Vendor.create([
      {
        user: vendorUsers[0]._id,
        vendorName: 'Jaipur Royal Crafts',
        ownerName: 'Rajesh Sharma',
        mobile: '9876543210',
        email: 'jaipur@example.com',
        address: 'Johari Bazaar',
        city: 'Jaipur',
        isApproved: true,
        location: { type: 'Point', coordinates: [75.8186, 26.9154] }
      },
      {
        user: vendorUsers[1]._id,
        vendorName: 'Kerala Spice Garden',
        ownerName: 'Lakshmi Nair',
        mobile: '9876543211',
        email: 'kerala@example.com',
        address: 'Fort Kochi',
        city: 'Kochi',
        isApproved: true,
        location: { type: 'Point', coordinates: [76.2673, 9.9312] }
      },
      {
        user: vendorUsers[2]._id,
        vendorName: 'Mumbai Fashion Hub',
        ownerName: 'Suresh Patil',
        mobile: '9876543212',
        email: 'mumbai@example.com',
        address: 'Colaba Causeway',
        city: 'Mumbai',
        isApproved: true,
        location: { type: 'Point', coordinates: [72.8258, 18.9220] }
      },
      {
        user: vendorUsers[3]._id,
        vendorName: 'Delhi Decor & Gifts',
        ownerName: 'Amit Verma',
        mobile: '9876543213',
        email: 'delhi@example.com',
        address: 'Dilli Haat',
        city: 'New Delhi',
        isApproved: true,
        location: { type: 'Point', coordinates: [77.2090, 28.6139] }
      },
      {
        user: vendorUsers[4]._id,
        vendorName: 'Bangalore Organic Studio',
        ownerName: 'Priya Reddy',
        mobile: '9876543214',
        email: 'bangalore@example.com',
        address: 'Indiranagar',
        city: 'Bangalore',
        isApproved: true,
        location: { type: 'Point', coordinates: [77.6412, 12.9719] }
      }
    ]);

    // Helper to get vendor by index
    const v = (index) => vendors[index]._id;

    // Create categories and map them
    const categories = [...new Set(mockProducts.map(p => p.category))];
    const createdCategories = await Category.insertMany(categories.map(name => ({ name })));

    const categoryMap = createdCategories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});

    // Assign products to specific vendors based on "vibe"
    const productsToInsert = mockProducts.map(p => {
      let vendorId;
      // Assign vendors based on category or specific items for realism
      if (['Handmade Crafts'].includes(p.category)) vendorId = v(0); // Jaipur (Crafts)
      else if (['Food & Drink'].includes(p.category)) vendorId = v(1); // Kerala (Spices/Food)
      else if (['Wellness & Beauty'].includes(p.category)) vendorId = v(4); // Bangalore (Organic/Wellness)
      else if (['Fashion & Accessories'].includes(p.category)) vendorId = v(2); // Mumbai (Fashion)
      else if (['Home & Decor', 'Gifts & Collectibles'].includes(p.category)) vendorId = v(3); // Delhi (Decor/Gifts)
      else vendorId = v(3); // Delhi (General fallback)

      // Overrides for specific feeling
      if (p.title.includes('Coffee')) vendorId = v(1); // Kerala/South India for coffee
      if (p.title.includes('Rug')) vendorId = v(0); // Jaipur for rugs
      if (p.title.includes('Honey')) vendorId = v(4); // Bangalore for organic stuff

      return {
        ...p,
        slug: p.title.toLowerCase().replace(/ /g, '-'),
        vendor: vendorId,
        category: categoryMap[p.category],
      };
    });

    await Product.insertMany(productsToInsert);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await Vendor.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
