const DeliveryOption = ({ icon, title, time, price, isSelected }: any) => (
  <div className={`p-4 border-2 rounded-lg transition-all ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{time}</p>
      </div>
      <p className="ml-auto font-bold text-gray-900">{price}</p>
    </div>
  </div>
);

const DeliveryOptions = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Delivery & Pickup Options</h3>
      <div className="grid grid-cols-2 gap-4">
        <DeliveryOption icon="🚚" title="Home Delivery" time="2-4 days" price="₹50" isSelected={true} />
        <DeliveryOption icon="🏪" title="Store Pickup" time="Same day" price="Free" isSelected={false} />
      </div>
    </div>
  );
};

export default DeliveryOptions;
