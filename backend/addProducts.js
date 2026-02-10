import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Vendor } from './models/Vendor.js';

dotenv.config();

// Real products with unique images - 45 products across 6 categories
const products = [
    // Handmade Crafts (9 products)
    { title: 'Handcrafted Ceramic Bowl', price: 999, image: '/uploads/bowl.png', category: 'Handmade Crafts', description: 'A beautifully handcrafted ceramic bowl with intricate blue and white patterns, perfect for any kitchen.', countInStock: 10, rating: 4.5 },
    { title: 'Macrame Wall Hanging', price: 1499, image: '/uploads/macrame.png', category: 'Handmade Crafts', description: 'Elegant bohemian macrame wall hanging with intricate knots and tassels in natural cream cotton rope.', countInStock: 15, rating: 4.8 },
    { title: 'Wooden Mandala Coasters', price: 699, image: '/uploads/coasters.png', category: 'Handmade Crafts', description: 'Set of four handcrafted wooden coasters with beautiful carved mandala patterns.', countInStock: 20, rating: 4.6 },
    { title: 'Brass Peacock Diya', price: 1899, image: '/uploads/brass_lamp.png', category: 'Handmade Crafts', description: 'Ornate traditional Indian brass oil lamp with intricate peacock carvings and polished golden finish.', countInStock: 12, rating: 4.9 },
    { title: 'Handwoven Jute Basket', price: 899, image: '/uploads/jute_basket.jpg', category: 'Handmade Crafts', description: 'Eco-friendly handwoven jute storage basket with natural finish and sturdy handles.', countInStock: 18, rating: 4.5 },
    { title: 'Clay Pottery Dinner Set', price: 3499, image: '/uploads/pottery_set.jpg', category: 'Handmade Crafts', description: 'Complete 16-piece handmade clay pottery dinner set with rustic earthy tones.', countInStock: 8, rating: 4.7 },
    { title: 'Bamboo Wind Chimes', price: 799, image: '/uploads/wind_chimes.jpg', category: 'Handmade Crafts', description: 'Soothing bamboo wind chimes with natural wooden beads and melodious tones.', countInStock: 22, rating: 4.6 },
    { title: 'Handpainted Madhubani Art', price: 2499, image: '/uploads/madhubani.jpg', category: 'Handmade Crafts', description: 'Traditional Madhubani painting on canvas featuring vibrant folk art motifs.', countInStock: 10, rating: 4.8 },
    { title: 'Copper Water Bottle', price: 1299, image: '/uploads/copper_bottle.jpg', category: 'Handmade Crafts', description: 'Handcrafted pure copper water bottle with Ayurvedic health benefits and leak-proof cap.', countInStock: 25, rating: 4.7 },

    // Food & Drink (9 products)
    { title: 'Pure Organic Honey', price: 650, image: '/uploads/honey.png', category: 'Food & Drink', description: 'Pure golden organic honey with honeycomb, sourced from local beekeepers in the Western Ghats.', countInStock: 30, rating: 4.7 },
    { title: 'Artisanal Cheese Selection', price: 1250, image: '/uploads/cheese.png', category: 'Food & Drink', description: 'Premium selection of aged artisanal cheeses with herbs, perfect for cheese platters.', countInStock: 12, rating: 4.5 },
    { title: 'Premium Coffee Beans', price: 1200, image: '/uploads/coffee.png', category: 'Food & Drink', description: 'Freshly roasted dark roast gourmet coffee beans from Coorg plantations.', countInStock: 25, rating: 4.8 },
    { title: 'Indian Spice Collection', price: 899, image: '/uploads/spices.png', category: 'Food & Drink', description: 'Traditional Indian spice set including turmeric, cumin, cardamom, and cinnamon in elegant glass jars.', countInStock: 35, rating: 4.9 },
    { title: 'Organic Green Tea', price: 549, image: '/uploads/green_tea.jpg', category: 'Food & Drink', description: 'Premium Darjeeling green tea leaves with delicate flavor and antioxidant properties.', countInStock: 40, rating: 4.6 },
    { title: 'Handmade Dark Chocolate', price: 799, image: '/uploads/chocolate.jpg', category: 'Food & Drink', description: 'Artisanal 70% dark chocolate bars with sea salt and roasted almonds.', countInStock: 28, rating: 4.8 },
    { title: 'Cold Pressed Olive Oil', price: 1499, image: '/uploads/olive_oil.jpg', category: 'Food & Drink', description: 'Extra virgin cold pressed olive oil in premium glass bottle, perfect for cooking.', countInStock: 15, rating: 4.7 },
    { title: 'Organic Quinoa', price: 699, image: '/uploads/quinoa.jpg', category: 'Food & Drink', description: 'Premium quality organic white quinoa, protein-rich superfood for healthy meals.', countInStock: 32, rating: 4.5 },
    { title: 'Masala Chai Tea Blend', price: 449, image: '/uploads/chai.jpg', category: 'Food & Drink', description: 'Authentic Indian masala chai blend with cardamom, ginger, and premium black tea.', countInStock: 45, rating: 4.9 },

    // Home & Decor (9 products)
    { title: 'Minimalist Ceramic Vase', price: 1299, image: '/uploads/vase.png', category: 'Home & Decor', description: 'Elegant minimalist ceramic vase in soft beige with dried pampas grass for a calming aesthetic.', countInStock: 18, rating: 4.6 },
    { title: 'Geometric Handwoven Rug', price: 4500, image: '/uploads/rug.png', category: 'Home & Decor', description: 'Cozy handwoven rug with geometric patterns in warm terracotta and cream colors.', countInStock: 5, rating: 4.8 },
    { title: 'Decorative Wall Mirror', price: 2999, image: '/uploads/mirror.jpg', category: 'Home & Decor', description: 'Beautiful round wall mirror with handcrafted wooden frame featuring intricate carvings.', countInStock: 8, rating: 4.4 },
    { title: 'Terracotta Planter Set', price: 1599, image: '/uploads/planters.jpg', category: 'Home & Decor', description: 'Set of 3 handmade terracotta planters in different sizes, perfect for indoor plants.', countInStock: 15, rating: 4.7 },
    { title: 'Scented Candle Collection', price: 1199, image: '/uploads/candles.jpg', category: 'Home & Decor', description: 'Set of 4 luxury scented soy candles in vanilla, lavender, sandalwood, and rose.', countInStock: 20, rating: 4.8 },
    { title: 'Wooden Wall Clock', price: 1899, image: '/uploads/wall_clock.jpg', category: 'Home & Decor', description: 'Handcrafted wooden wall clock with silent movement and vintage design.', countInStock: 12, rating: 4.5 },
    { title: 'Bohemian Throw Pillows', price: 899, image: '/uploads/pillows.jpg', category: 'Home & Decor', description: 'Set of 2 colorful bohemian throw pillows with tassels and embroidered patterns.', countInStock: 25, rating: 4.6 },
    { title: 'Marble Serving Tray', price: 2299, image: '/uploads/serving_tray.jpg', category: 'Home & Decor', description: 'Elegant white marble serving tray with brass handles for entertaining guests.', countInStock: 10, rating: 4.7 },
    { title: 'Fairy String Lights', price: 699, image: '/uploads/string_lights.jpg', category: 'Home & Decor', description: 'Warm white LED fairy string lights for cozy ambiance, 10 meters long.', countInStock: 30, rating: 4.9 },

    // Fashion & Accessories (8 products)
    { title: 'Premium Leather Tote', price: 5999, image: '/uploads/tote_bag.png', category: 'Fashion & Accessories', description: 'Durable and stylish premium brown leather tote bag with elegant stitching for daily use.', countInStock: 8, rating: 4.9 },
    { title: 'Silk Paisley Scarf', price: 1599, image: '/uploads/scarf.png', category: 'Fashion & Accessories', description: 'Luxurious silk scarf with elegant paisley pattern in jewel tones of purple and gold.', countInStock: 25, rating: 4.7 },
    { title: 'Handcrafted Leather Wallet', price: 2499, image: '/uploads/wallet.jpg', category: 'Fashion & Accessories', description: 'Premium handstitched leather wallet with multiple card slots and coin pocket.', countInStock: 20, rating: 4.6 },
    { title: 'Silver Oxidized Earrings', price: 899, image: '/uploads/earrings.jpg', category: 'Fashion & Accessories', description: 'Traditional Indian oxidized silver jhumka earrings with intricate tribal designs.', countInStock: 30, rating: 4.8 },
    { title: 'Cotton Printed Stole', price: 799, image: '/uploads/stole.jpg', category: 'Fashion & Accessories', description: 'Lightweight cotton stole with block print patterns in vibrant colors.', countInStock: 35, rating: 4.5 },
    { title: 'Leather Belt', price: 1299, image: '/uploads/belt.jpg', category: 'Fashion & Accessories', description: 'Classic genuine leather belt with brass buckle, available in brown and black.', countInStock: 22, rating: 4.6 },
    { title: 'Beaded Bracelet Set', price: 649, image: '/uploads/bracelets.jpg', category: 'Fashion & Accessories', description: 'Set of 3 handmade beaded bracelets with natural stones and adjustable closure.', countInStock: 40, rating: 4.7 },
    { title: 'Designer Sunglasses', price: 1999, image: '/uploads/sunglasses.jpg', category: 'Fashion & Accessories', description: 'Trendy UV protection sunglasses with polarized lenses and metal frame.', countInStock: 18, rating: 4.8 },

    // Wellness & Beauty (6 products)
    { title: 'Organic Lavender Soap', price: 549, image: '/uploads/soap.jpg', category: 'Wellness & Beauty', description: 'Handmade organic soap with soothing lavender essential oils and dried flowers.', countInStock: 50, rating: 4.8 },
    { title: 'Aromatherapy Oil Set', price: 1100, image: '/uploads/essential_oils.jpg', category: 'Wellness & Beauty', description: 'Set of pure essential oils in amber bottles for aromatherapy and wellness rituals.', countInStock: 20, rating: 4.7 },
    { title: 'Natural Body Butter', price: 799, image: '/uploads/body_butter.jpg', category: 'Wellness & Beauty', description: 'Nourishing body butter made with shea butter, coconut oil, and natural herbs.', countInStock: 30, rating: 4.5 },
    { title: 'Herbal Face Mask', price: 649, image: '/uploads/face_mask.jpg', category: 'Wellness & Beauty', description: 'Natural clay and turmeric face mask for glowing skin, suitable for all skin types.', countInStock: 35, rating: 4.6 },
    { title: 'Rose Water Toner', price: 449, image: '/uploads/rose_water.jpg', category: 'Wellness & Beauty', description: 'Pure rose water facial toner with hydrating and refreshing properties.', countInStock: 42, rating: 4.7 },
    { title: 'Yoga Mat with Bag', price: 1899, image: '/uploads/yoga_mat.jpg', category: 'Wellness & Beauty', description: 'Premium non-slip yoga mat with alignment marks and carrying bag included.', countInStock: 15, rating: 4.8 },

    // Gifts & Collectibles (4 products)
    { title: 'Luxury Gift Hamper', price: 3500, image: '/uploads/gift_hamper.jpg', category: 'Gifts & Collectibles', description: 'Beautifully curated luxury gift hamper with artisanal treats and handmade items.', countInStock: 10, rating: 4.9 },
    { title: 'Handpainted Photo Frame', price: 1299, image: '/uploads/photo_frame.jpg', category: 'Gifts & Collectibles', description: 'Beautiful handpainted wooden photo frame with traditional Rajasthani artwork.', countInStock: 15, rating: 4.6 },
    { title: 'Personalized Name Plate', price: 999, image: '/uploads/name_plate.jpg', category: 'Gifts & Collectibles', description: 'Customizable wooden name plate with laser engraving for home or office.', countInStock: 20, rating: 4.7 },
    { title: 'Vintage Music Box', price: 1799, image: '/uploads/music_box.jpg', category: 'Gifts & Collectibles', description: 'Antique-style wooden music box with rotating ballerina and classic melody.', countInStock: 12, rating: 4.8 },
];

const addProductsToDatabase = async () => {
    await connectDB();

    try {
        // First, clear existing products
        await Product.deleteMany();
        console.log('Existing products cleared...');

        // Get all vendors
        const vendors = await Vendor.find({});
        if (vendors.length === 0) {
            console.error('No vendors found! Please run the seeder first to create vendors.');
            process.exit(1);
        }

        // Create category map
        const categories = await Category.find({});
        if (categories.length === 0) {
            console.error('No categories found! Please run the seeder first to create categories.');
            process.exit(1);
        }

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.name] = cat._id;
            return acc;
        }, {});

        // Helper function to get vendor by index
        const getVendor = (index) => vendors[index % vendors.length]._id;

        // Map products with proper vendor and category assignments
        const productsToInsert = products.map((p, index) => {
            let vendorId;

            // Assign vendors based on category for realism
            if (p.category === 'Handmade Crafts') vendorId = getVendor(0); // Jaipur
            else if (p.category === 'Food & Drink') vendorId = getVendor(1); // Kerala
            else if (p.category === 'Wellness & Beauty') vendorId = getVendor(4); // Bangalore
            else if (p.category === 'Fashion & Accessories') vendorId = getVendor(2); // Mumbai
            else vendorId = getVendor(3); // Delhi (Home & Decor, Gifts)

            // Special overrides
            if (p.title.includes('Coffee')) vendorId = getVendor(1);
            if (p.title.includes('Rug')) vendorId = getVendor(0);
            if (p.title.includes('Honey')) vendorId = getVendor(4);

            return {
                ...p,
                slug: p.title.toLowerCase().replace(/ /g, '-') + '-' + Date.now() + index,
                vendor: vendorId,
                category: categoryMap[p.category],
            };
        });

        // Insert all products
        const insertedProducts = await Product.insertMany(productsToInsert);

        console.log(`\n✅ Successfully added ${insertedProducts.length} products to database!\n`);
        console.log('Products added:');
        insertedProducts.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.title} - ${p.image}`);
        });

        process.exit();
    } catch (error) {
        console.error('Error adding products:', error);
        process.exit(1);
    }
};

addProductsToDatabase();
