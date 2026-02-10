const VendorDetails = () => {
  return (
    <div className="space-y-8">
      {/* Local Recognition */}
      <div className="bg-red-50 p-6 rounded-lg">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Local Recognition</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center space-x-3">
            <span>🏆</span>
            <p><strong>19 shoppers</strong> from Koramangala bought this last week</p>
          </li>
          <li className="flex items-center space-x-3">
            <span>⚡️</span>
            <p>Fastest delivery among leather shops in your area</p>
          </li>
          <li className="flex items-center space-x-3">
            <span>⭐</span>
            <p><strong>Local Leather Works</strong> is a trusted local seller</p>
          </li>
        </ul>
      </div>

      {/* About the Maker */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Maker</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-xl text-gray-800">Our Story</h4>
            <p className="text-gray-600 mt-2">Local Leather Works creates bespoke leather goods using traditional techniques and premium materials.</p>
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-gray-700">Specialty</p>
              <p className="text-gray-600">Full-grain leather craftsmanship</p>
              <p className="text-xs text-gray-500 mt-1">Established 2017</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xl text-gray-800">Workshop</h4>
            <img src="/images/vendor_workshop.png" alt="Workshop" className="w-full h-48 object-cover rounded-lg mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
