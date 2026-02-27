import { type Product } from '../types';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-100">
      {/* Materials & Care */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-2xl font-bold shadow-sm">
              ✨
            </div>
            <h3 className="font-bold text-2xl text-gray-900">Materials & Care</h3>
          </div>

          <div className="space-y-8 text-gray-700">
            <div>
              <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Materials</p>
              <p className="text-lg font-medium text-gray-900 leading-relaxed">{product.materials || "Premium sustainable materials"}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Care Instructions</p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed">
                {product.careInstructions || "Wipe clean with a soft, dry cloth. Keep away from direct heat and water."}
              </div>
            </div>

            {product.warranty && (
              <div className="flex items-start bg-orange-50 p-4 rounded-xl border border-orange-100">
                <span className="text-2xl mr-3">🛡️</span>
                <div>
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-1">Warranty Protection</p>
                  <p className="text-orange-900 font-medium">{product.warranty}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-2xl font-bold shadow-sm">
              📏
            </div>
            <h3 className="font-bold text-2xl text-gray-900">Specifications</h3>
          </div>

          {product.specifications && product.specifications.length > 0 ? (
            <ul className="space-y-4">
              {product.specifications.map((spec, index) => (
                <li key={index} className="flex items-start group/item">
                  <span className="w-2 h-2 mt-2.5 mr-4 bg-blue-200 rounded-full group-hover/item:bg-blue-500 transition-colors"></span>
                  <span className="text-gray-700 text-lg group-hover/item:text-gray-900 transition-colors">{spec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
              <p className="text-gray-400 italic">No specific details available for this product.</p>
            </div>
          )}

          {/* Added Description Section if short */}
          {product.description && product.description.length < 100 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Description</p>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
