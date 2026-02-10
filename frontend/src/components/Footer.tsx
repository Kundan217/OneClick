const Footer = () => {
  return (
    <footer className="bg-orange-500 text-white text-center py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold">Join Our Community of Makers</h2>
        <p className="text-lg mt-4 max-w-xl mx-auto">Sign up for our newsletter to get the latest news, updates, and special offers.</p>
        <div className="mt-8 flex justify-center">
          <input type="email" placeholder="Your email address" className="px-4 py-3 w-full max-w-sm rounded-l-full text-gray-800 focus:outline-none" />
          <button className="bg-gray-800 text-white px-6 py-3 rounded-r-full font-semibold hover:bg-gray-700 transition-colors">Subscribe</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
