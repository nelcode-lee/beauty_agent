'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  onConfirm: (date: Date) => void;
  minTime?: Date;
  maxTime?: Date;
  excludeTimes?: Date[];
  instantBook?: boolean;
}

export default function DateTimePicker({
  selectedDate,
  onChange,
  onConfirm,
  minTime,
  maxTime,
  excludeTimes,
  instantBook = false
}: DateTimePickerProps) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(instantBook ? new Date() : null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  // Generate available time slots
  const generateTimeSlots = () => {
    if (!selectedDay) return [];
    
    const slots = [];
    const now = new Date();
    const start = new Date(selectedDay);
    
    // For instant bookings, start from the next available 30-minute slot
    if (instantBook) {
      const currentMinutes = now.getMinutes();
      const nextSlotMinutes = Math.ceil(currentMinutes / 30) * 30;
      start.setHours(now.getHours());
      start.setMinutes(nextSlotMinutes);
      
      // If we're at the end of the hour, move to the next hour
      if (nextSlotMinutes === 60) {
        start.setHours(start.getHours() + 1);
        start.setMinutes(0);
      }
    } else {
      start.setHours(9, 0, 0); // 9 AM
    }

    const end = new Date(selectedDay);
    end.setHours(18, 0, 0); // 6 PM

    while (start < end) {
      // Skip lunch break (12:00 - 12:30)
      if (start.getHours() !== 12 || start.getMinutes() !== 0) {
        // For instant bookings, only include future times
        if (!instantBook || start > now) {
          slots.push(new Date(start));
        }
      }
      start.setMinutes(start.getMinutes() + 30);
    }
    return slots;
  };

  const handleDateSelect = (date: Date | null) => {
    if (instantBook) return; // Disable date selection for instant bookings
    setSelectedDay(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: Date) => {
    const newDateTime = new Date(selectedDay!);
    newDateTime.setHours(time.getHours());
    newDateTime.setMinutes(time.getMinutes());
    setSelectedTime(newDateTime);
    onChange(newDateTime);
  };

  const handleSubmit = () => {
    if (selectedTime) {
      onConfirm(selectedTime);
    }
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full shadow-xl relative overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">
            {instantBook ? "Available Today" : "Book Your Appointment"}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection - Hide for instant bookings */}
            {!instantBook && (
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">1. Select Date</h3>
                <DatePicker
                  selected={selectedDay}
                  onChange={handleDateSelect}
                  inline
                  minDate={new Date()}
                  calendarClassName="!w-full"
                  dayClassName={date => 
                    date.getTime() === selectedDay?.getTime()
                      ? "!bg-[#8B7BF7] !text-white hover:!bg-[#7A68F6]"
                      : "hover:!bg-[#F3F0F7] !rounded-full !w-10 !h-10 !mx-auto flex items-center justify-center"
                  }
                />
              </div>
            )}

            {/* Time Selection */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                {instantBook ? "Available Time Slots" : "2. Select Time"}
                {selectedDay && (
                  <span className="block text-sm font-normal text-gray-500 mt-1">
                    {selectedDay.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </span>
                )}
              </h3>

              {!selectedDay ? (
                <div className="text-gray-500 text-center py-8">
                  Please select a date first
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time.toISOString()}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 rounded-lg text-center transition-all duration-200
                        ${selectedTime?.getTime() === time.getTime()
                          ? 'bg-[#8B7BF7] text-white shadow-md'
                          : 'border border-gray-100 hover:border-[#8B7BF7] hover:bg-[#F3F0F7]'
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
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No available time slots
                </div>
              )}
            </div>
          </div>

          {/* Summary and Actions */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            {selectedTime && (
              <div className="mb-4 p-4 bg-[#F3F0F7] rounded-lg">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Appointment Summary</h3>
                <div className="space-y-2">
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
                    <span className="font-medium">Duration:</span> 60 minutes
                  </p>
                </div>
              </div>
            )}

            <div className="sticky bottom-0 bg-white pt-4 pb-2 flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:border-[#8B7BF7] hover:text-[#8B7BF7] transition-all duration-200"
                onClick={() => onChange(null)}
              >
                Cancel
              </button>
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200
                  ${selectedTime 
                    ? 'bg-[#8B7BF7] hover:bg-[#7A68F6] transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 cursor-not-allowed'
                  }`}
                onClick={handleSubmit}
                disabled={!selectedTime}
              >
                {selectedTime ? (instantBook ? 'Book Now' : 'Confirm Booking') : 'Select Time'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 