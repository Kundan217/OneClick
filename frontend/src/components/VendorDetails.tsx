import React from 'react';
import { type Product } from '../types';

interface VendorDetailsProps {
  vendor: Product['vendor'];
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor }) => {
  if (!vendor) return null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Local Recognition */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🏆</span> Local Recognition
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center space-x-3 bg-white/60 p-2 rounded-lg backdrop-blur-sm">
            <span className="text-xl">🛍️</span>
            <p><strong>15+ shoppers</strong> from {vendor.city} bought this recently</p>
          </li>
          <li className="flex items-center space-x-3 bg-white/60 p-2 rounded-lg backdrop-blur-sm">
            <span className="text-xl">⚡️</span>
            <p>Known for <strong>fast delivery</strong> in {vendor.city}</p>
          </li>
          <li className="flex items-center space-x-3 bg-white/60 p-2 rounded-lg backdrop-blur-sm">
            <span className="text-xl">⭐</span>
            <p><strong>{vendor.vendorName}</strong> is a top-rated local seller</p>
          </li>
        </ul>
      </div>

      {/* About the Maker */}
      <div>
        <div className="flex items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">About the Maker</h2>
          <div className="h-1 flex-grow bg-gray-100 ml-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-xl text-gray-800 flex items-center mb-3">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">📖</span>
                Our Story
              </h4>
              <p className="text-gray-600 leading-relaxed text-lg">
                {vendor.story || `${vendor.vendorName} has been serving customres in ${vendor.city} with dedication. Creating quality products with passion and traditional expertise.`}
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                <span className="text-xl mr-2">✨</span> Specialty
              </h5>
              <p className="text-gray-800 font-medium text-lg">
                {vendor.specialty || "Handpicked quality items."}
              </p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium mr-3">Verified Seller</span>
                <span>Since 2024</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform opacity-20 group-hover:opacity-30"></div>
            <div className="relative z-10 bg-white p-2 rounded-2xl h-full shadow-lg overflow-hidden">
              <img
                src={vendor.workshopImage || "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800"}
                alt={`${vendor.vendorName} Workshop`}
                className="w-full h-64 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-sm border border-white/50 text-center">
                  <p className="font-bold text-gray-800">📍 Native to {vendor.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
