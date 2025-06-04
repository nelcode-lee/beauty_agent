'use client';

import React, { useState } from 'react';

export type UserDetails = {
  name: string;
  email: string;
  phone: string;
};

type UserDetailsFormProps = {
  onSubmit: (details: UserDetails) => void;
  onCancel: () => void;
};

export default function UserDetailsForm({ onSubmit, onCancel }: UserDetailsFormProps) {
  const [details, setDetails] = useState<UserDetails>({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Partial<UserDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<UserDetails> = {};
    
    if (!details.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!details.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!details.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+44|0)\d{10}$/.test(details.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid UK phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(details);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-[#F3F0F7] rounded-2xl max-w-md w-full shadow-xl mx-4 my-8">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#1A1A1A]">Complete Booking</h2>
            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                placeholder="Enter your full name"
                className={`w-full p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-base
                  ${errors.name 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-[#8B7BF7] focus:ring-purple-100'
                  }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={details.email}
                onChange={(e) => setDetails({ ...details, email: e.target.value })}
                placeholder="Enter your email address"
                className={`w-full p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-base
                  ${errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-[#8B7BF7] focus:ring-purple-100'
                  }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={details.phone}
                onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                placeholder="Enter your UK phone number"
                className={`w-full p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-base
                  ${errors.phone 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-[#8B7BF7] focus:ring-purple-100'
                  }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Format: 07123456789 or +447123456789
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] px-8 py-4 bg-[#8B7BF7] text-white font-medium rounded-lg hover:bg-[#7A68F6] transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                Complete Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 