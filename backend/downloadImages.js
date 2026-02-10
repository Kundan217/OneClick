import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Free placeholder image URLs from Unsplash (royalty-free)
const imageUrls = {
    // Handmade Crafts
    'jute_basket.jpg': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    'pottery_set.jpg': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',
    'wind_chimes.jpg': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
    'madhubani.jpg': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    'copper_bottle.jpg': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',

    // Food & Drink
    'green_tea.jpg': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80',
    'chocolate.jpg': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80',
    'olive_oil.jpg': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
    'quinoa.jpg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    'chai.jpg': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',

    // Home & Decor
    'candles.jpg': 'https://images.unsplash.com/photo-1602874801006-e24aa9f5e04a?w=800&q=80',
    'wall_clock.jpg': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80',
    'pillows.jpg': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
    'serving_tray.jpg': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
    'string_lights.jpg': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',

    // Fashion & Accessories
    'earrings.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    'stole.jpg': 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
    'belt.jpg': 'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=800&q=80',
    'bracelets.jpg': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'sunglasses.jpg': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',

    // Wellness & Beauty
    'face_mask.jpg': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
    'rose_water.jpg': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    'yoga_mat.jpg': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',

    // Gifts & Collectibles
    'name_plate.jpg': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
    'music_box.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
};

const uploadsDir = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to download image
const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(uploadsDir, filename);

        // Check if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`✓ ${filename} already exists, skipping...`);
            resolve();
            return;
        }

        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filepath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`✓ Downloaded: ${filename}`);
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(filepath, () => { }); // Delete partial file
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

// Download all images
const downloadAllImages = async () => {
    console.log('Starting image downloads...\n');

    let successCount = 0;
    let failCount = 0;

    for (const [filename, url] of Object.entries(imageUrls)) {
        try {
            await downloadImage(url, filename);
            successCount++;
        } catch (error) {
            console.error(`✗ Failed to download ${filename}:`, error.message);
            failCount++;
        }
    }

    console.log(`\n✅ Download complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
    console.log(`   Total: ${Object.keys(imageUrls).length}`);
};

downloadAllImages();
