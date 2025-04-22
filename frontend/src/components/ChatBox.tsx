import React from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string;
}

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-4 pb-24">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4 max-h-[70vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-base max-w-[80%] whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
            {msg.timestamp && (
              <span className="text-xs text-gray-400 mt-1">
                {msg.timestamp}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
