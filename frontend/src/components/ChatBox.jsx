// src/components/ChatBox.jsx
import React from 'react';
import { LoaderCircle } from 'lucide-react';

const ChatBox = ({ messages, loading, darkMode }) => {
  return (
    <div
      className={`p-4 rounded-lg max-h-[60vh] overflow-y-auto border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
      }`}
    >
      <div className="flex flex-col gap-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`rounded-lg p-3 text-sm ${
              msg.sender === 'User'
                ? darkMode
                  ? 'bg-yellow-600 text-white'
                  : 'bg-yellow-200 text-black'
                : darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            <div className="font-semibold">
              {msg.sender} <span className="text-xs font-normal">({msg.timestamp})</span>
            </div>
            <div className="mt-1">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
            <LoaderCircle className="animate-spin w-5 h-5" />
            Generating response...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
