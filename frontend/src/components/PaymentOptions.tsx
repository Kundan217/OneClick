import { useState } from 'react';

const PaymentOption = ({ title, description, payNow, atPickup, isSelected, onClick }: any) => (
  <div
    onClick={onClick}
    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
    <h3 className="font-bold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
    <div className="flex justify-between items-center mt-4 text-sm">
      <span className="text-gray-500">Pay Now:</span>
      <span className="font-bold text-gray-900">₹{payNow}</span>
    </div>
    <div className="p-4 border-2 border-gray-200 rounded-lg opacity-60 cursor-not-allowed">
      <span className="block text-sm text-gray-500">Pay on Pickup</span>
      <span className="font-bold text-gray-900">₹{atPickup}</span>
    </div>
  </div>
);

const PaymentOptions = ({ productPrice }: { productPrice: number }) => {
  const [selectedOption, setSelectedOption] = useState('full');

  const options = {
    full: {
      title: 'Pay Full Now',
      description: 'Complete payment upfront',
      payNow: productPrice,
      atPickup: 0,
    },
    advance: {
      title: 'Pay Advance',
      description: 'Pay 30% now, rest at pickup',
      payNow: (productPrice * 0.3).toFixed(2),
      atPickup: (productPrice * 0.7).toFixed(2),
    },
    reserve: {
      title: 'Reserve Without Payment',
      description: 'Pay ₹0 now, full amount at pickup',
      payNow: 0,
      atPickup: productPrice,
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Mode</h3>
      <div className="grid grid-cols-3 gap-4">
        <PaymentOption {...options.full} isSelected={selectedOption === 'full'} onClick={() => setSelectedOption('full')} />
        <PaymentOption {...options.advance} isSelected={selectedOption === 'advance'} onClick={() => setSelectedOption('advance')} />
        <PaymentOption {...options.reserve} isSelected={selectedOption === 'reserve'} onClick={() => setSelectedOption('reserve')} />
      </div>
    </div>
  );
};

export default PaymentOptions;
