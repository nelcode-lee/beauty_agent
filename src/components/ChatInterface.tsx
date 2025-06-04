'use client';

import { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickPrompts from './QuickPrompts';
import DateTimePicker from './DateTimePicker';
import { getChatResponse, type ChatMessage as ApiChatMessage } from '@/lib/api';
import BookingConfirmation from './BookingConfirmation';
import UserDetailsForm, { type UserDetails } from './UserDetailsForm';
import BookingFlow from './BookingFlow';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

type ServiceCategory = {
  id: string;
  text: string;
  description: string;
  specificServices: SpecificService[];
};

type SpecificService = {
  id: string;
  name: string;
  duration: string;
  price: string;
};

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'hair',
    text: '💇‍♀️ Hair Services',
    description: 'Cuts, Colour, Styling',
    specificServices: [
      { id: 'haircut', name: 'Haircut & Styling', duration: '60 min', price: '£45' },
      { id: 'color', name: 'Hair Colour', duration: '120 min', price: '£85' },
      { id: 'highlights', name: 'Highlights', duration: '150 min', price: '£120' },
      { id: 'treatment', name: 'Hair Treatment', duration: '45 min', price: '£35' }
    ]
  },
  {
    id: 'nails',
    text: '💅 Nail Care',
    description: 'Manicure, Pedicure, Nail Art',
    specificServices: [
      { id: 'manicure', name: 'Classic Manicure', duration: '30 min', price: '£25' },
      { id: 'pedicure', name: 'Luxury Pedicure', duration: '45 min', price: '£35' },
      { id: 'gel', name: 'Gel Polish', duration: '60 min', price: '£40' },
      { id: 'nailart', name: 'Nail Art Design', duration: '45 min', price: '£30' }
    ]
  },
  {
    id: 'facial',
    text: '✨ Face & Skin',
    description: 'Facials, Treatments',
    specificServices: [
      { id: 'facial', name: 'Classic Facial', duration: '60 min', price: '£65' },
      { id: 'deepclean', name: 'Deep Cleansing Facial', duration: '75 min', price: '£75' },
      { id: 'antiaging', name: 'Anti-Ageing Treatment', duration: '90 min', price: '£95' },
      { id: 'microderm', name: 'Microdermabrasion', duration: '45 min', price: '£70' }
    ]
  },
  {
    id: 'makeup',
    text: '💄 Makeup',
    description: 'Full Makeup, Special Occasion',
    specificServices: [
      { id: 'natural', name: 'Natural Makeup', duration: '45 min', price: '£45' },
      { id: 'evening', name: 'Evening Makeup', duration: '60 min', price: '£65' },
      { id: 'bridal', name: 'Bridal Makeup', duration: '90 min', price: '£120' },
      { id: 'lesson', name: 'Makeup Tutorial', duration: '60 min', price: '£55' }
    ]
  }
];

const INITIAL_MESSAGE = `Welcome! Which service would you like to book?

💇‍♀️ Hair
💅 Nails
✨ Face & Skin
💄 Makeup`;

type ChatInterfaceProps = {
  initialBooking: {
    service: {
      name: string;
      duration: string;
      price: string;
    };
    dateTime: Date;
  };
  onNewBooking: () => void;
};

type BookingDetails = {
  service: string;
  dateTime: string;
  price: string;
  duration: string;
} | null;

export default function ChatInterface({ initialBooking, onNewBooking }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingDetails>({
    service: initialBooking.service.name,
    dateTime: initialBooking.dateTime.toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }),
    price: initialBooking.service.price,
    duration: initialBooking.service.duration
  });
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [tempDateTime, setTempDateTime] = useState<Date | null>(null);
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedService, setSelectedService] = useState<SpecificService | null>(null);
  
  // Initialize business hours
  const initializeBusinessHours = () => {
    const now = new Date();
    
    const min = new Date(now);
    min.setHours(9, 0, 0);
    
    const max = new Date(now);
    max.setHours(18, 0, 0);
    
    const lunch1 = new Date(now);
    lunch1.setHours(12, 0, 0);
    
    const lunch2 = new Date(now);
    lunch2.setHours(12, 30, 0);
    
    return { min, max, lunch1, lunch2 };
  };

  const { min: minTime, max: maxTime, lunch1: lunchBreakStart, lunch2: lunchBreakEnd } = initializeBusinessHours();

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: '1',
        content: `Great! You've selected ${initialBooking.service.name} for ${initialBooking.dateTime.toLocaleString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })}. Please provide your contact details to complete the booking.`,
        role: 'assistant',
        timestamp: new Date(),
      },
    ]);
  }, [initialBooking]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const recentMessages = messages.slice(-3);
      const apiMessages: ApiChatMessage[] = recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      apiMessages.push({ role: 'user', content: message });

      const response = await getChatResponse(apiMessages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "Sorry, please try again.",
          role: 'assistant',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateTimeSelect = (date: Date) => {
    setSelectedDateTime(date);
    setShowDatePicker(false);
    
    const formattedDate = date.toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    // Update current booking with the selected date/time
    if (currentBooking) {
      setCurrentBooking({
        ...currentBooking,
        dateTime: formattedDate
      });
    }

    handleSendMessage(`I'd like to book for ${formattedDate}`);
    // Show user details form after date selection
    setShowUserDetailsForm(true);
  };

  const handleUserDetailsSubmit = (details: UserDetails) => {
    setUserDetails(details);
    setShowUserDetailsForm(false);
    setShowBookingConfirmation(true);
  };

  const handleCategorySelect = async (category: ServiceCategory) => {
    setSelectedCategory(category);
    const message = `I'm interested in ${category.text}`;
    await handleSendMessage(message);
  };

  const handleSpecificServiceSelect = async (service: SpecificService) => {
    setSelectedService(service);
    setShowBookingFlow(true);
  };

  const handleBookingComplete = async (booking: {
    service: string;
    dateTime: string;
    price: string;
    duration: string;
  }) => {
    setCurrentBooking(booking);
    setShowBookingFlow(false);
    
    // Send message to chat
    const message = `I would like to book a ${booking.service} for ${booking.dateTime}`;
    await handleSendMessage(message);
    
    // Show user details form
    setShowUserDetailsForm(true);
  };

  const handleBookingConfirm = async () => {
    if (!currentBooking || !userDetails) return;
    
    const confirmationMessage = `Booking confirmed!\n\nService: ${currentBooking.service}\nDate & Time: ${currentBooking.dateTime}\nDuration: ${currentBooking.duration}\nPrice: ${currentBooking.price}\n\nContact Details:\nName: ${userDetails.name}\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}`;
    
    await handleSendMessage(confirmationMessage);
    setShowBookingConfirmation(false);
    setCurrentBooking(null);
    setUserDetails(null);
  };

  return (
    <div className="min-h-screen bg-[#F3F0F7]">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">MY REVOLUTION</h1>
            <div className="mt-4 relative">
              <input
                type="search"
                placeholder="What are you looking for?"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                🔍
              </span>
            </div>
          </div>
          <button
            onClick={onNewBooking}
            className="bg-[#8B7BF7] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7A68F6] transition-all duration-200"
          >
            New Booking
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">UPCOMING BOOKINGS</h2>
            <button className="text-[#8B7BF7] font-medium">See all</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 bg-[#F8F7FC] p-4 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              </div>
              <div className="flex-grow">
                <p className="font-medium text-[#1A1A1A]">{initialBooking.service.name}</p>
                <p className="text-sm text-gray-500">
                  {initialBooking.dateTime.toLocaleString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">•••</button>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex space-x-3 mb-6">
          <button className="px-4 py-2 rounded-full bg-[#8B7BF7] text-white font-medium">
            🏠 Salon
          </button>
          <button className="px-4 py-2 rounded-full bg-white text-gray-700 font-medium border border-gray-200">
            🚗 Mobile
          </button>
          <button className="px-4 py-2 rounded-full bg-white text-gray-700 font-medium border border-gray-200">
            ⚡ Instant book
          </button>
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center p-4">
                <div className="animate-spin h-6 w-6 border-2 border-[#8B7BF7] rounded-full border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Forms and Modals */}
        {showUserDetailsForm && (
          <UserDetailsForm
            onSubmit={handleUserDetailsSubmit}
            onCancel={onNewBooking}
          />
        )}

        {showBookingConfirmation && currentBooking && userDetails && (
          <BookingConfirmation
            isOpen={showBookingConfirmation}
            onClose={() => {
              setShowBookingConfirmation(false);
              setShowUserDetailsForm(true);
            }}
            onConfirm={handleBookingConfirm}
            bookingDetails={{
              ...currentBooking,
              customerName: userDetails.name,
              customerEmail: userDetails.email,
              customerPhone: userDetails.phone
            }}
          />
        )}

        {/* Chat Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
} 