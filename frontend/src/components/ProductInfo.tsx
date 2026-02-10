const ProductInfo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Materials & Care */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Materials & Care</h3>
        <div className="text-gray-700 space-y-2">
          <p><strong>Materials:</strong> Full-grain leather, Brass hardware</p>
          <p><strong>Care Instructions:</strong> Use leather conditioner monthly. Keep away from water.</p>
          <p><strong>Warranty:</strong> <span className="text-orange-500 font-semibold">5-year leather guarantee</span></p>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Specifications</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Material: Full-grain leather</li>
          <li>Dimensions: 10" x 8" x 3"</li>
          <li>Adjustable strap</li>
          <li>Multiple pockets</li>
          <li>Handcrafted</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;
