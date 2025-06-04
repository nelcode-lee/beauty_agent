import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type BookingFlowProps = {
  onComplete: (booking: {
    service: string;
    dateTime: string;
    price: string;
    duration: string;
  }) => void;
  onCancel: () => void;
  selectedService?: {
    name: string;
    duration: string;
    price: string;
  };
};

export default function BookingFlow({ onComplete, onCancel, selectedService }: BookingFlowProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    if (!selectedDate) return [];
    
    const slots = [];
    const start = new Date(selectedDate);
    start.setHours(9, 0, 0); // 9 AM
    const end = new Date(selectedDate);
    end.setHours(18, 0, 0); // 6 PM

    while (start < end) {
      // Skip lunch break (12:00 - 12:30)
      if (start.getHours() !== 12 || start.getMinutes() !== 0) {
        slots.push(new Date(start));
      }
      start.setMinutes(start.getMinutes() + 30);
    }
    return slots;
  };

  const handleSubmit = () => {
    if (!selectedTime || !selectedService) return;

    const formattedDateTime = selectedTime.toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    onComplete({
      service: selectedService.name,
      dateTime: formattedDateTime,
      price: selectedService.price,
      duration: selectedService.duration
    });
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-pink-100 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#FF1493]">Book Your Appointment</h2>
            {selectedService && (
              <p className="text-gray-600 mt-1">
                {selectedService.name} ({selectedService.duration} • {selectedService.price})
              </p>
            )}
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Date Selection */}
          <div className="bg-white rounded-lg p-6 border border-pink-100 shadow-sm">
            <h3 className="text-lg font-medium text-[#FF1493] mb-4">1. Select Date</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
              inline
              minDate={new Date()}
              calendarClassName="w-full"
              dayClassName={date => 
                "hover:bg-pink-100 rounded-full w-10 h-10 mx-auto flex items-center justify-center"
              }
            />
          </div>

          {/* Time Selection */}
          <div className="bg-white rounded-lg p-6 border border-pink-100 shadow-sm">
            <h3 className="text-lg font-medium text-[#FF1493] mb-4">
              2. Select Time
              {selectedDate && (
                <span className="block text-sm font-normal text-gray-600 mt-1">
                  {selectedDate.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </span>
              )}
            </h3>

            {!selectedDate ? (
              <div className="text-gray-500 text-center py-8">
                Please select a date first
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time.toISOString()}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg text-center transition-all duration-200
                      ${selectedTime?.getTime() === time.getTime()
                        ? 'bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white shadow-lg'
                        : 'border border-pink-200 hover:border-[#FF69B4] hover:bg-pink-50'
                      }`}
                  >
                    {time.toLocaleTimeString('en-GB', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary and Actions */}
        <div className="mt-8 border-t border-pink-100 pt-6">
          {selectedTime && (
            <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <h3 className="text-lg font-medium text-[#FF1493] mb-2">Appointment Summary</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Service:</span>{' '}
                  {selectedService?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Date:</span>{' '}
                  {selectedTime.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Time:</span>{' '}
                  {selectedTime.toLocaleTimeString('en-GB', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Duration:</span>{' '}
                  {selectedService?.duration}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Price:</span>{' '}
                  {selectedService?.price}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-[#FFB6C1] rounded-lg font-medium text-[#FF1493] hover:bg-[#FFF5F7] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedTime}
              className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200
                ${selectedTime 
                  ? 'bg-gradient-to-r from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF1493] transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 