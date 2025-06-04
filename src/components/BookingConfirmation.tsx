'use client';

import { useState } from 'react';

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: {
    service: string;
    dateTime: string;
    price: string;
    duration: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
}

export default function BookingConfirmation({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails
}: BookingConfirmationProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-[#FFF5F7] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#FF1493]">Confirm Your Booking</h2>
          
          {/* Booking Details */}
          <div className="space-y-3 mb-6">
            <div className="bg-white p-4 rounded-lg border border-[#FFB6C1] shadow-sm">
              <h3 className="font-medium mb-2 text-[#FF1493]">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-[#FF69B4]">Service:</span> {bookingDetails.service}</p>
                <p><span className="text-[#FF69B4]">Date & Time:</span> {bookingDetails.dateTime}</p>
                <p><span className="text-[#FF69B4]">Duration:</span> {bookingDetails.duration}</p>
                <p><span className="text-[#FF69B4]">Price:</span> {bookingDetails.price}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#FFB6C1] shadow-sm">
              <h3 className="font-medium mb-2 text-[#FF1493]">Customer Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-[#FF69B4]">Name:</span> {bookingDetails.customerName}</p>
                <p><span className="text-[#FF69B4]">Email:</span> {bookingDetails.customerEmail}</p>
                <p><span className="text-[#FF69B4]">Phone:</span> {bookingDetails.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg border border-[#FFB6C1] shadow-sm mb-4">
              <h3 className="font-medium mb-2 text-[#FF1493]">Terms & Conditions</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• 24-hour cancellation notice required</p>
                <p>• Late arrivals may result in reduced service time</p>
                <p>• Full payment required for no-shows</p>
                <p>• Prices may vary based on hair length/thickness</p>
              </div>
            </div>
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#FFB6C1] text-[#FF69B4] focus:ring-[#FF69B4]"
              />
              <span className="text-sm text-gray-600">
                I agree to the terms and conditions, including the cancellation policy and payment terms.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              disabled={!termsAccepted}
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-white text-center
                transition-all duration-200
                ${termsAccepted
                  ? 'bg-gradient-to-r from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF1493] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              Confirm Booking
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg font-medium border border-[#FFB6C1] 
                       hover:bg-[#FFF5F7] text-[#FF1493] text-center transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 