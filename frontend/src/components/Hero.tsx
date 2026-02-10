

const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-red-50 text-center py-20">
      <h1 className="text-5xl font-bold text-gray-800">Discover Local Treasures</h1>
      <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">Handcrafted goods, artisanal foods, and unique finds from your local community.</p>
      <button
        onClick={scrollToProducts}
        className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors cursor-pointer"
      >
        Start Shopping
      </button>
    </div>
  );
};

export default Hero;
