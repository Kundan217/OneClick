import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { type Product } from '../types';
import Navbar from '../components/Navbar';
import PaymentOptions from '../components/PaymentOptions';
import DeliveryOptions from '../components/DeliveryOptions';
import VendorDetails from '../components/VendorDetails';
import ProductInfo from '../components/ProductInfo';
import Footer from '../components/Footer';
import PreBooking from '../components/PreBooking';
import RelatedProducts from '../components/RelatedProducts';
import ReviewSection from '../components/ReviewSection';
import ReportIssueModal from '../components/ReportIssueModal';

const API_URL = import.meta.env.VITE_API_URL || '';

const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreBooking, setShowPreBooking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handlePreBook = async (slot: string, notes: string) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) {
      alert('Please login to pre-book this product.');
      navigate('/auth');
      return;
    }

    const address = prompt('Enter your delivery address:');
    if (!address) return;

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: [{
            product: product!._id,
            vendor: product!.vendor?._id,
            quantity: 1,
            price: product!.price,
          }],
          totalPrice: product!.price,
          address,
          isPreBooked: true,
          preBookSlot: slot,
          preBookNotes: notes,
        }),
      });

      if (response.ok) {
        alert('✅ Pre-booking successful! The vendor will be notified.');
        setShowPreBooking(false);
      } else {
        const data = await response.json();
        alert(`❌ Pre-booking failed: ${data.message}`);
      }
    } catch (err) {
      alert('❌ Error creating pre-booking. Please try again.');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct({ ...data, name: data.title, id: data._id });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center py-12">Loading product details...</p>;
  if (error) return <p className="text-center py-12 text-red-500">{error}</p>;
  if (!product) return <p className="text-center py-12">Product not found.</p>;

  return (
    <div className="bg-gray-50 font-sans">
      <Navbar
        onSearch={(query) => navigate(`/customer?keyword=${query}`)}
        onLocationSearch={() => { }}
        onGeoLocationSearch={() => { }}
      />
      <div className="container mx-auto px-6 py-12">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <img src={getImageUrl(product.image)} alt={product.name} className="w-full rounded-2xl shadow-lg" />

          <div className="space-y-6">
            <p className="text-purple-600 font-semibold">
              {typeof product.category === 'object' ? product.category.name : product.category}
            </p>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-700 text-lg">{product.description}</p>
            <p className="text-5xl font-extrabold text-gray-900">₹{product.price}</p>

            {/* Vendor/Shopkeeper Info */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-2">Sold By</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                  {product.vendor?.vendorName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{product.vendor?.vendorName}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{product.vendor?.ownerName}</span> • {product.vendor?.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex border-t border-b py-4">
               <button 
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center text-red-500 hover:text-red-700 font-medium transition-colors"
               >
                 <span className="mr-2">⚠️</span> Report an Issue
               </button>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={() => addToCart(product)} className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-colors">Add to Cart</button>
              <button
                onClick={() => setShowPreBooking(!showPreBooking)}
                className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-colors ${showPreBooking ? 'bg-red-500 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              >
                {showPreBooking ? 'Cancel Pre-Book' : 'Pre-Book'}
              </button>
            </div>

            {showPreBooking && (
              <div className="mt-6 animate-fade-in-up">
                <PreBooking onPreBook={handlePreBook} />
              </div>
            )}

            {showReportModal && (
               <ReportIssueModal productId={product._id} onClose={() => setShowReportModal(false)} />
            )}

            <PaymentOptions productPrice={product.price} />
            <DeliveryOptions />
          </div>
        </div>

        {/* Detailed Info Section */}
        <div className="mt-16 space-y-12">
          <VendorDetails vendor={product.vendor} />
          <ProductInfo product={product} />
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product._id} />

        {/* Related Products Recommendation */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
          <RelatedProducts
            category={typeof product.category === 'object' ? product.category.name : product.category}
            currentProductId={product._id}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
