'use client';

import React, { useState, FormEvent } from 'react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
};

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF69B4] disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${
              !message.trim() || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white hover:from-[#FF1493] hover:to-[#FF1493] transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
            }`}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
} 