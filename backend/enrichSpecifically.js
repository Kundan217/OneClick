import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Vendor } from './models/Vendor.js';

dotenv.config();

// Helpers for variety
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDim = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

const enrichSpecifically = async () => {
    await connectDB();

    try {
        const products = await Product.find();

        for (const product of products) {
            let materials = "Premium Quality Material";
            let careInstructions = "Handle with care.";
            let specifications = [];
            let warranty = "Standard Warranty";

            const title = product.title;
            const lowerTitle = title.toLowerCase();

            // Handcrafted Ceramic Bowl
            if (lowerTitle.includes("bowl")) {
                const diameter = randomDim(14, 18);
                materials = `Stoneware Clay, ${pick(['Matte', 'Glossy', 'Satin'])} Glaze`;
                careInstructions = "Microwave and Dishwasher Safe.";
                specifications = [
                    `Diameter: ${diameter} cm`,
                    `Height: ${randomDim(6, 8)} cm`,
                    `Capacity: ${randomDim(500, 700)} ml`,
                    `Weight: ${randomDim(400, 500)}g`,
                    `Finish: ${pick(['Speckled Blue', 'Rustic White', 'Earthen Brown'])}`
                ];
                warranty = "Replacement for shipping breakage";
            }
            // Macrame Wall Hanging
            else if (lowerTitle.includes("macrame")) {
                materials = "Organic Cotton Cord, Natural Wood Dowel";
                careInstructions = "Spot clean only. Dust regularly.";
                specifications = [
                    `Width: ${randomDim(10, 14)} inches`,
                    `Length: ${randomDim(22, 28)} inches`,
                    `Knot Style: ${pick(['Square Knot', 'Spiral', 'Half-Hitch'])}`,
                    `Color: ${pick(['Natural Cream', 'Sage Green', 'Terracotta'])}`
                ];
                warranty = "6 Months against unraveling";
            }
            // Wooden Mandala Coasters
            else if (lowerTitle.includes("coasters")) {
                materials = `Solid ${pick(['Mango', 'Acacia', 'Teak'])} Wood`;
                careInstructions = "Wipe with damp cloth.";
                specifications = [
                    `Diameter: ${randomDim(3.5, 4.5)} inches`,
                    "Set of: 4 Coasters",
                    `Design: ${pick(['Floral Mandala', 'Geometric', 'Paisley'])}`,
                    "Thickness: 8mm"
                ];
                warranty = "1 Year on wood integrity";
            }
            // Brass Peacock Diya
            else if (lowerTitle.includes("diya") || lowerTitle.includes("brass")) {
                materials = "Solid Brass (High Copper Content)";
                careInstructions = "Polish with lemon/salt to restore shine.";
                specifications = [
                    `Height: ${randomFloat(7, 9)} inches`,
                    `Base Width: ${randomFloat(3, 4)} inches`,
                    `Weight: ${randomDim(800, 950)}g`,
                    "Type: Traditional Oil Lamp"
                ];
                warranty = "Lifetime material guarantee";
            }
            // Minimalist Ceramic Vase
            else if (lowerTitle.includes("vase")) {
                materials = "Ceramic";
                careInstructions = "Rinse with warm water.";
                specifications = [
                    `Height: ${randomDim(9, 12)} inches`,
                    `Opening: ${randomFloat(1.5, 2.5)} inches`,
                    `Style: ${pick(['Nordic', 'Modern', 'Boho'])}`,
                    `Color: ${pick(['Beige', 'Charcoal', 'White'])}`
                ];
                warranty = "Transit breakage cover";
            }
            // Geometric Handwoven Rug
            else if (lowerTitle.includes("rug")) {
                materials = "80% Wool, 20% Cotton";
                careInstructions = "Vacuum regularly. Professional clean annually.";
                specifications = [
                    `Size: ${pick(['4x6', '5x7', '3x5'])} ft`,
                    `Pile Height: ${randomFloat(0.4, 0.6)} inches`,
                    "Technique: Hand-tufted",
                    `Pattern: ${pick(['Geometric', 'Abstract', 'Tribal'])}`
                ];
                warranty = "1 Year weave warranty";
            }
            // Decorative Wall Mirror
            else if (lowerTitle.includes("mirror")) {
                materials = "Glass, Wood Frame";
                careInstructions = "Clean glass with vinegar solution.";
                specifications = [
                    `Total Diameter: ${randomDim(22, 26)} inches`,
                    `Mirror Diameter: ${randomDim(14, 18)} inches`,
                    `Frame Finish: ${pick(['Walnut', 'Oak', 'Distressed Gold'])}`,
                    "Mounting: D-Ring"
                ];
                warranty = "1 Year frame warranty";
            }
            // Terracotta Planter Set
            else if (lowerTitle.includes("planter")) {
                materials = "Natural Terracotta";
                careInstructions = "Rinse before use.";
                specifications = [
                    `Large Dia: ${randomDim(7, 9)} inches`,
                    `Medium Dia: ${randomDim(5, 6)} inches`,
                    `Small Dia: ${randomDim(3, 4)} inches`,
                    "Drainage: Yes"
                ];
                warranty = "Arrival guarantee only";
            }
            // Premium Leather Tote
            else if (lowerTitle.includes("tote")) {
                materials = "Full-grain Buffalo Leather";
                careInstructions = "Use leather conditioner monthly.";
                specifications = [
                    `Width: ${randomDim(13, 15)} inches`,
                    `Height: ${randomDim(10, 12)} inches`,
                    `Depth: ${randomDim(4, 6)} inches`,
                    `Strap Drop: ${randomDim(9, 11)} inches`,
                    "Hardware: Antique Brass"
                ];
                warranty = "3 Year Leather Warranty";
            }
            // Silk Paisley Scarf
            else if (lowerTitle.includes("scarf")) {
                materials = "100% Mulberry Silk";
                careInstructions = "Dry Clean Only.";
                specifications = [
                    `Length: ${randomDim(175, 185)} cm`,
                    `Width: ${randomDim(50, 60)} cm`,
                    `Weave: ${pick(['Satin', 'Twill', 'Chiffon'])}`,
                    "Print: Digital Paisley"
                ];
                warranty = "Defect-free guarantee";
            }
            // Handcrafted Leather Wallet
            else if (lowerTitle.includes("wallet")) {
                materials = "Vegetable Tanned Leather";
                careInstructions = "Wipe with dry cloth.";
                specifications = [
                    "Size: 4.5 x 3.5 inches",
                    `Slots: ${pick([4, 6, 8])}`,
                    "RFID Blocking: Yes",
                    `Color: ${pick(['Tan', 'Dark Brown', 'Black'])}`
                ];
                warranty = "2 Year Stitching Warranty";
            }
            // Organic Lavender Soap
            else if (lowerTitle.includes("soap")) {
                materials = "Saponified Coconut Oil, Shea Butter, Essential Oils";
                careInstructions = "Keep dry between uses.";
                specifications = [
                    `Net Weight: ${randomDim(120, 130)}g`,
                    "Process: Cold Process",
                    `Scent: ${pick(['Lavender', 'Lavender & Mint', 'Lavender & Oat'])}`
                ];
                warranty = "Shelf Life: 12 months";
            }
            // Aromatherapy Oil Set
            else if (lowerTitle.includes("oil")) {
                materials = "Pure Essential Oils";
                careInstructions = "Store in cool dark place.";
                specifications = [
                    "Volume: 10ml x 3",
                    "Grade: Therapeutic",
                    "Bottles: Amber Glass"
                ];
                warranty = "2 Years Shelf Life";
            }
            // Natural Body Butter
            else if (lowerTitle.includes("butter")) {
                materials = "Shea Butter, Cocoa Butter, Vitamin E";
                careInstructions = "Store below 25°C.";
                specifications = [
                    `Net Weight: ${randomDim(190, 210)}g`,
                    "Container: Recyclable Jar",
                    "Texture: Whipped"
                ];
                warranty = "6 Months after opening";
            }
            // Luxury Gift Hamper
            else if (lowerTitle.includes("hamper")) {
                materials = "Wicker Basket, Various Contents";
                careInstructions = "Refer to individual items.";
                specifications = [
                    `Contents: ${pick(['Soap & Candle', 'Chocolates & Tea', 'Spa Kit'])}`,
                    `Size: ${randomDim(10, 14)} inch basket`,
                    `Weight: ${randomFloat(1.2, 1.8)} kg`
                ];
                warranty = "N/A";
            }
            // Handpainted Photo Frame
            else if (lowerTitle.includes("frame")) {
                materials = "Pine Wood, Glass";
                careInstructions = "Dust with soft cloth.";
                specifications = [
                    "Fits: 5x7 photo",
                    `Outer Size: ${randomDim(7, 8)}x${randomDim(9, 10)} inches`,
                    `Style: ${pick(['Floral', 'Geometric', 'Abstract'])}`
                ];
                warranty = "1 Year Paint Warranty";
            }
            // Handwoven Jute Basket
            else if (lowerTitle.includes("basket")) {
                materials = "Natural Jute";
                careInstructions = "Spot clean.";
                specifications = [
                    `Diameter: ${randomDim(10, 14)} inches`,
                    `Height: ${randomDim(10, 14)} inches`,
                    `Weave: ${pick(['Tight', 'Loose', 'Braided'])}`
                ];
                warranty = "N/A";
            }
            // Decorative String Lights
            else if (lowerTitle.includes("lights")) {
                materials = "Copper Wire, LED";
                careInstructions = "Indoor use.";
                specifications = [
                    `Length: ${pick([5, 10])} Meters`,
                    `LED Count: ${pick([50, 100])}`,
                    `Power: ${pick(['Battery', 'USB', 'Plug-in'])}`
                ];
                warranty = "6 Months Warranty";
            }
            // Organic Rose Water Toner
            else if (lowerTitle.includes("rose") || lowerTitle.includes("toner")) {
                materials = "Steam Distilled Rose Water";
                careInstructions = "Refrigerate.";
                specifications = [
                    `Volume: ${pick([100, 200])} ml`,
                    "Bottle: Mist Spray",
                    "Alcohol Free: Yes"
                ];
                warranty = "12 Months Expiry";
            }
            // Handcrafted Copper Water Bottle
            else if (lowerTitle.includes("copper") || lowerTitle.includes("bottle")) {
                materials = "99.9% Pure Copper";
                careInstructions = "Clean with lemon/salt.";
                specifications = [
                    `Capacity: ${pick(['750ml', '1 Litre'])}`,
                    `Height: ${randomDim(9, 11)} inches`,
                    `Finish: ${pick(['Hammered', 'Matte', 'Printed'])}`
                ];
                warranty = "1 Year Leakproof";
            }

            product.materials = materials;
            product.careInstructions = careInstructions;
            product.specifications = specifications;
            product.warranty = warranty;

            await product.save();
            console.log(`✅ Refined Specific Enrichment: ${title}`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

enrichSpecifically();
