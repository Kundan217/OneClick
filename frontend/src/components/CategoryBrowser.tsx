import CategoryCard from './CategoryCard';

const categories = [
  { name: 'Handmade Crafts', description: 'Expertly crafted', icon: '🎨', color: 'bg-orange-400' },
  { name: 'Food & Drink', description: 'Locally sourced', icon: '🍎', color: 'bg-sky-400' },
  { name: 'Home & Decor', description: 'Unique pieces', icon: '🏠', color: 'bg-pink-400' },
  { name: 'Fashion & Accessories', description: 'Stylish finds', icon: '👗', color: 'bg-purple-400' },
  { name: 'Wellness & Beauty', description: 'Natural products', icon: '🌿', color: 'bg-teal-400' },
  { name: 'Gifts & Collectibles', description: 'For every occasion', icon: '🎁', color: 'bg-yellow-400' },
];

const CategoryBrowser = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBrowser;
