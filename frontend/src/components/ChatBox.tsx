import React from 'react';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
};

interface ChatBoxProps {
  messages: Message[];
  loading: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4 h-[60vh] overflow-y-auto space-y-2 border border-gray-100">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-xl max-w-[80%] ${
            msg.sender === 'user'
              ? 'bg-blue-100 text-right ml-auto'
              : 'bg-gray-100 text-left mr-auto'
          }`}
        >
          <p className="text-sm mb-1">{msg.text}</p>
          <p className="text-[10px] text-gray-500">{msg.timestamp}</p>
        </div>
      ))}
      {loading && (
        <div className="text-center text-sm text-gray-400 mt-4">Thinking...</div>
      )}
    </div>
  );
};

export default ChatBox;
