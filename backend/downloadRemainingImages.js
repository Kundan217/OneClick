import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Alternative URLs for failed images
const imageUrls = {
    'candles.jpg': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
    'belt.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
};

const uploadsDir = path.join(__dirname, 'uploads');

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(uploadsDir, filename);

        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filepath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`✓ Downloaded: ${filename}`);
                resolve();
            });

            fileStream.on('error', reject);
        }).on('error', reject);
    });
};

const downloadAllImages = async () => {
    console.log('Downloading remaining images...\n');

    for (const [filename, url] of Object.entries(imageUrls)) {
        try {
            await downloadImage(url, filename);
        } catch (error) {
            console.error(`✗ Failed: ${filename}`, error.message);
        }
    }

    console.log('\n✅ Done!');
};

downloadAllImages();
