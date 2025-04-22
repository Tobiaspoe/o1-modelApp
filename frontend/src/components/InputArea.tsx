import React, { useState } from 'react';
import { sendTextToChat } from '../utils/api';

interface InputAreaProps {
  onSend: (text: string, sessionId: string) => void;
  sessionId: string;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, sessionId }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSend(input, sessionId);
        setInput('');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-4">
      <textarea
        className="w-full h-24 p-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none shadow-md"
        placeholder="Type your message here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <p className="text-sm text-gray-400 mt-1">Press Enter to send, Shift+Enter for newline</p>
    </div>
  );
};

export default InputArea;
