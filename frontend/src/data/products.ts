export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  // Handmade Crafts
  { id: 1, name: 'Handcrafted Bowl', price: 45, image: 'https://via.placeholder.com/300/FFDDC1/8B5E34?text=Bowl', category: 'Handmade Crafts', description: 'A beautifully handcrafted ceramic bowl, perfect for any kitchen.' },
  { id: 3, name: 'Macrame Wall Hanging', price: 60, image: 'https://via.placeholder.com/300/F0E68C/8B5E34?text=Macrame', category: 'Handmade Crafts', description: 'Elegant macrame wall hanging to add a bohemian touch to your decor.' },
  { id: 13, name: 'Wooden Coasters', price: 22, image: 'https://via.placeholder.com/300/CD853F/FFFFFF?text=Coasters', category: 'Handmade Crafts', description: 'Set of four handcrafted wooden coasters.' },

  // Food & Drink
  { id: 2, name: 'Organic Honey', price: 20, image: 'https://via.placeholder.com/300/FFC300/C70039?text=Honey', category: 'Food & Drink', description: 'Pure, unprocessed organic honey from local beekeepers.' },
  { id: 7, name: 'Artisanal Cheese', price: 35, image: 'https://via.placeholder.com/300/FFD700/DAA520?text=Cheese', category: 'Food & Drink', description: 'A selection of fine artisanal cheeses, aged to perfection.' },
  { id: 14, name: 'Gourmet Coffee Beans', price: 28, image: 'https://via.placeholder.com/300/6B4F4B/FFFFFF?text=Coffee', category: 'Food & Drink', description: 'Freshly roasted gourmet coffee beans from a local roaster.' },

  // Home & Decor
  { id: 8, name: 'Scented Soy Candle', price: 25, image: 'https://via.placeholder.com/300/E6E6FA/333333?text=Candle', category: 'Home & Decor', description: 'A hand-poured soy candle with a relaxing lavender scent.' },
  { id: 9, name: 'Ceramic Planter', price: 40, image: 'https://via.placeholder.com/300/90EE90/2E8B57?text=Planter', category: 'Home & Decor', description: 'A stylish ceramic planter for your favorite indoor plants.' },
  { id: 15, name: 'Linen Throw Pillow', price: 50, image: 'https://via.placeholder.com/300/FAF0E6/333333?text=Pillow', category: 'Home & Decor', description: 'A comfortable and stylish linen throw pillow.' },

  // Fashion & Accessories
  { id: 4, name: 'Leather Crossbody Bag', price: 89, image: 'https://via.placeholder.com/300/D2B48C/8B4513?text=Bag', category: 'Fashion & Accessories', description: 'A timeless leather crossbody bag, perfect for any occasion.' },
  { id: 10, name: 'Silver Necklace', price: 120, image: 'https://via.placeholder.com/300/C0C0C0/4A4A4A?text=Necklace', category: 'Fashion & Accessories', description: 'A delicate silver necklace with a unique, handcrafted pendant.' },
  { id: 16, name: 'Beaded Bracelet', price: 30, image: 'https://via.placeholder.com/300/4682B4/FFFFFF?text=Bracelet', category: 'Fashion & Accessories', description: 'A beautiful beaded bracelet, handmade by a local artisan.' },

  // Wellness & Beauty
  { id: 5, name: 'Natural Soap Set', price: 25, image: 'https://via.placeholder.com/300/F5DEB3/8B4513?text=Soap', category: 'Wellness & Beauty', description: 'A set of all-natural, handmade soaps with essential oils.' },
  { id: 11, name: 'Herbal Tea Blend', price: 15, image: 'https://via.placeholder.com/300/D8BFD8/4B0082?text=Tea', category: 'Wellness & Beauty', description: 'A calming blend of herbal teas to help you relax and unwind.' },
  { id: 17, name: 'Essential Oil Diffuser', price: 55, image: 'https://via.placeholder.com/300/FFFFFF/333333?text=Diffuser', category: 'Wellness & Beauty', description: 'An ultrasonic essential oil diffuser to create a calming atmosphere.' },

  // Gifts & Collectibles
  { id: 6, name: 'Vintage Record Crate', price: 75, image: 'https://via.placeholder.com/300/DEB887/8B4513?text=Crate', category: 'Gifts & Collectibles', description: 'A rustic wooden crate for storing your favorite vinyl records.' },
  { id: 12, name: 'Custom Portrait', price: 150, image: 'https://via.placeholder.com/300/ADD8E6/4682B4?text=Portrait', category: 'Gifts & Collectibles', description: 'A custom-painted portrait from a talented local artist.' },
  { id: 18, name: 'Enamel Pin Set', price: 18, image: 'https://via.placeholder.com/300/FF6347/FFFFFF?text=Pins', category: 'Gifts & Collectibles', description: 'A set of three unique and stylish enamel pins.' },
];
