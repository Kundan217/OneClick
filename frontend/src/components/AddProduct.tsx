import { useState, useEffect } from 'react';

interface Category {
  _id: string;
  name: string;
}

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories', { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0]._id);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed');
      }

      setImage(data.image);
      setUploading(false);
    } catch (error: any) {
      setError(error.message);
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = userInfo.token;

    if (!token) {
      setError('You must be logged in to add a product.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          price: Number(price),
          discount: Number(discount),
          countInStock: Number(stock),
          category,
          description,
          image
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      setSuccess('Product added successfully!');
      setTitle('');
      setPrice('');
      setDiscount('');
      setStock('');
      setDescription('');
      setImage('');
      setCategory(categories.length > 0 ? categories[0]._id : '');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
          <span className="bg-blue-100 p-3 rounded-xl">📦</span>
          <span>Add New Product</span>
        </h2>
        <p className="text-gray-600 mt-2">Fill in the details to add a new product to your store</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center space-x-3">
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-center space-x-3">
          <span className="text-xl">✅</span>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <span>📝</span>
                <span>Basic Information</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={4}
                    placeholder="Describe your product..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <span>💰</span>
                <span>Pricing & Stock</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="discount"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="space-y-6">
            {/* Image Upload Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <span>🖼️</span>
                <span>Product Image</span>
              </h3>

              {/* Image Preview */}
              <div className="mb-4">
                {image ? (
                  <div className="relative">
                    <img
                      src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                    <span className="text-4xl mb-2">📷</span>
                    <span className="text-gray-500 text-sm">No image selected</span>
                  </div>
                )}
              </div>

              {/* Upload Options */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="text-center text-gray-500 text-sm">or</div>

                <label className="block">
                  <div className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 border-dashed rounded-xl text-center cursor-pointer hover:bg-blue-100 transition-colors">
                    <span className="text-blue-600 font-medium">
                      {uploading ? '⏳ Uploading...' : '📁 Choose File'}
                    </span>
                  </div>
                  <input
                    type="file"
                    onChange={uploadFileHandler}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <span>💡</span>
                <span>Quick Tips</span>
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Use high quality images</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Add detailed descriptions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Set competitive pricing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Keep stock updated</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setTitle(''); setPrice(''); setDiscount(''); setStock('');
              setDescription(''); setImage('');
            }}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <span>Add Product</span>
            <span>🚀</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

