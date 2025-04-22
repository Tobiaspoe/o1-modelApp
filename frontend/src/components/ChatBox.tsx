import React from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  return (
    <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-xl max-w-[80%] ${
            msg.role === 'user' ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-gray-200 text-black self-start mr-auto'
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
