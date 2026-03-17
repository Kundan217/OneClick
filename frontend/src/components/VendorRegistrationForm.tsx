import { useState } from 'react';

const VendorRegistrationForm = ({ setView, setVerificationEmail }: { setView: (view: string) => void, setVerificationEmail?: (email: string) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vendorName: '',
    ownerName: '',
    mobile: '',
    email: '',
    password: '',
    address: '',
    city: '',
    // New optional fields
    gstin: '',
    pincode: '',
    state: '',
    bankAccount: '',
    ifscCode: '',
    termsAgreed: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const nextStep = () => {
    setError('');
    // Validation before moving to next step
    if (step === 1) {
      if (!formData.mobile || !formData.email || !formData.password) {
        setError('Please fill in all mandatory fields (Mobile, Email, Password).');
        return;
      }
    } else if (step === 3) {
      if (!formData.address || !formData.city) {
        setError('Please fill in mandatory address fields (Address, City).');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 5) return;
    
    if (!formData.vendorName || !formData.ownerName) {
      setError('Please provide Store Name and Owner Name.');
      return;
    }

    if (!formData.termsAgreed) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      // Create payload adhering to the backend schema
      // Exclude frontend-only fields like 'termsAgreed' and 'pincode'/'state' if we map them differently later
      const payload = {
        vendorName: formData.vendorName,
        ownerName: formData.ownerName,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        // Optional fields - backend saves these if defined in Schema
        bankAccount: formData.bankAccount,
        ifscCode: formData.ifscCode,
        role: 'vendor'
        // gstin, pincode, state are kept in frontend state but might need schema updates if meant to be saved.
        // For now, sending them doesn't break if Schema allows strict: false or ignores them.
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      setSuccess('Vendor registration successful! Please verify your email.');
      if (data.requiresOtp && data.email && setVerificationEmail) {
        setVerificationEmail(data.email);
        setTimeout(() => setView('otp'), 3000);
      } else {
        setTimeout(() => setView('login'), 3000);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to OneClick Sellers</h2>
      <p className="text-gray-500 mb-6">Create your account to start selling.</p>

      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full bg-gray-200 -translate-y-1/2"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i}
             </div>
             <span className={`text-[10px] mt-1 hidden sm:block ${step >= i ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
               {i === 1 && 'Account'}
               {i === 2 && 'GST'}
               {i === 3 && 'Pickup'}
               {i === 4 && 'Bank'}
               {i === 5 && 'Supplier'}
             </span>
          </div>
        ))}
      </div>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Step 1: Mobile number & Email Id. */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">1. Mobile number & Email Id</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input name="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                <button type="button" className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg border font-medium whitespace-nowrap hidden">Send OTP</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID <span className="text-red-500">*</span></label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email ID" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Set Password <span className="text-red-500">*</span></label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Set Password" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <p className="text-xs text-gray-500 mt-2">Password needs to be a minimum of 8 characters.</p>
            </div>
          </div>
        )}

        {/* Step 2: GSTIN Verification */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
             <h3 className="text-lg font-semibold text-gray-700 mb-4">2. GSTIN Verification</h3>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter GSTIN (Optional)</label>
              <div className="flex gap-2">
                <input name="gstin" value={formData.gstin} onChange={handleChange} placeholder="Enter GSTIN" className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <button type="button" className="bg-gray-100 text-blue-600 px-6 py-3 rounded-lg border border-blue-200 font-medium whitespace-nowrap">Verify</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pickup Address */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
             <h3 className="text-lg font-semibold text-gray-700 mb-4">3. Pickup Address</h3>
             <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex gap-3 text-sm text-orange-800 mb-4">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <p>Products will be picked up from this location for delivery.</p>
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room/Floor/Building Number & Street <span className="text-red-500">*</span></label>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Complete Address" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3" required />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                   <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
          </div>
        )}

        {/* Step 4: Bank Details */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
             <h3 className="text-lg font-semibold text-gray-700 mb-4">4. Bank Details (Optional)</h3>
             <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex gap-3 text-sm text-orange-800 mb-4">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <p>Bank account should be in the name of your registered business or trade name.</p>
             </div>
             
             <div>
                <input name="bankAccount" value={formData.bankAccount} onChange={handleChange} placeholder="Account Number" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
             </div>
             <div>
                <input name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <p className="text-sm text-blue-600 cursor-pointer hover:underline mb-2">Don't remember IFSC Code? Find IFSC Code</p>
          </div>
        )}

        {/* Step 5: Supplier Details */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in">
             <h3 className="text-lg font-semibold text-gray-700 mb-4">5. Supplier Details</h3>
             <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex gap-3 text-sm text-orange-800 mb-4">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <p>"Store Name" is visible on the Reseller app with your listed products.</p>
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name <span className="text-red-500">*</span></label>
                <input name="vendorName" value={formData.vendorName} onChange={handleChange} placeholder="Eg. Business Name, Trade Name" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3" required />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name <span className="text-red-500">*</span></label>
                <input name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Your Full Name" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4" required />
             </div>

             <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input name="termsAgreed" type="checkbox" checked={formData.termsAgreed} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" required />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="termsAgreed" className="font-medium text-gray-700">I agree to comply with OneClick Supplier Terms & Conditions <span className="text-red-500">*</span></label>
                </div>
              </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 pt-4 border-t">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold">
              Previous
            </button>
          )}
          
          {step < 5 ? (
            <button type="button" onClick={nextStep} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Continue
            </button>
          ) : (
             <button type="submit" disabled={!formData.termsAgreed} className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${formData.termsAgreed ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
               Submit Registration
             </button>
          )}
        </div>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        Already a member? 
        <button onClick={() => setView('login')} className="font-semibold text-blue-600 hover:underline ml-1">Login here</button>
      </p>
    </div>
  );
};

export default VendorRegistrationForm;

