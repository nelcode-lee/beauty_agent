'use client';

import { useState } from 'react';
import ServiceBooking from '@/components/ServiceBooking';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    service: { name: string; duration: string; price: string };
    dateTime: Date;
  } | null>(null);

  const handleBookingComplete = (booking: {
    service: { name: string; duration: string; price: string };
    dateTime: Date;
  }) => {
    setBookingDetails(booking);
    setShowChat(true);
  };

  return (
    <main className="min-h-screen bg-[#F3F0F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showChat ? (
          <ServiceBooking onComplete={handleBookingComplete} />
        ) : (
          <ChatInterface 
            initialBooking={bookingDetails!}
            onNewBooking={() => {
              setShowChat(false);
              setBookingDetails(null);
            }}
          />
        )}
      </div>
    </main>
  );
}
