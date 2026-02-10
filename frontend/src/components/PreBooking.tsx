import React, { useState } from 'react';

interface PreBookingProps {
    onPreBook?: (slot: string, notes: string) => void;
}

const PreBooking: React.FC<PreBookingProps> = ({ onPreBook }) => {
    const [selectedSlot, setSelectedSlot] = useState<string>('morning');
    const [notes, setNotes] = useState('');

    const slots = [
        {
            id: 'morning',
            title: 'Morning',
            time: '9:00 AM - 12:00 PM',
            capacity: '12/15 slots available',
            status: 'available',
        },
        {
            id: 'afternoon',
            title: 'Afternoon',
            time: '1:00 PM - 5:00 PM',
            capacity: '8/15 slots available',
            status: 'available',
        },
        {
            id: 'evening',
            title: 'Evening',
            time: '5:00 PM - 8:00 PM',
            capacity: 'Fully Booked',
            status: 'full',
        },
        {
            id: 'next_day',
            title: 'Next Day Morning',
            time: '9:00 AM - 12:00 PM',
            capacity: '20/25 slots available',
            status: 'available',
        },
    ];

    const handlePreBook = () => {
        if (onPreBook) {
            onPreBook(selectedSlot, notes);
        } else {
            alert(`Pre-booked for ${selectedSlot} with notes: ${notes}`);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Pickup/Delivery Time Slot</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {slots.map((slot) => {
                    const isSelected = selectedSlot === slot.id;
                    const isFull = slot.status === 'full';

                    return (
                        <div
                            key={slot.id}
                            onClick={() => !isFull && setSelectedSlot(slot.id)}
                            className={`
                relative p-4 rounded-xl border-2 transition-all cursor-pointer
                ${isFull ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' :
                                    isSelected ? 'bg-red-50 border-red-500 shadow-sm' : 'bg-white border-gray-200 hover:border-red-200'}
              `}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <svg className={`w-4 h-4 ${isSelected ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{slot.title}</span>
                            </div>

                            <div className="text-sm text-gray-500 mb-3">{slot.time}</div>

                            <div className="flex justify-between items-center text-xs">
                                <span className={`${isFull ? 'text-gray-400' : 'text-green-600'}`}>{slot.capacity}</span>
                                {isFull && <span className="text-red-500 font-semibold">Full</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Custom Notes (Optional)</label>
                <p className="text-xs text-gray-500 mb-3">Add any special requests, measurements, colors, dates, or instructions for this pre-booking.</p>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Custom message for cake, Measurements: 32-34-36, Preferred color: Navy blue"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-gray-50 text-gray-700 placeholder-gray-400 text-sm resize-none"
                    rows={4}
                    maxLength={500}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{notes.length}/500 characters</div>
            </div>

            <button
                onClick={handlePreBook}
                className="w-full bg-[#E85D45] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#d64d36] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Pre-Book Now
            </button>
        </div>
    );
};

export default PreBooking;
