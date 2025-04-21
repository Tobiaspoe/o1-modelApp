import React, { useState } from 'react';
import { SendHorizonal, Mic, MicOff } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string) => void;
  recording: boolean;
  onMicClick: () => void; // 👈 correct name
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, onMicClick, recording }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex items-center space-x-2 p-4 bg-white border-t border-gray-200">
      <input
        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        title="Send"
      >
        <SendHorizonal className="w-5 h-5" />
      </button>
      <button
        onClick={onMicClick}
        className={`p-2 rounded-full ${recording ? 'bg-red-500' : 'bg-gray-200'} hover:opacity-80 transition`}
        title="Toggle Mic"
      >
        {recording ? <MicOff className="text-white w-5 h-5" /> : <Mic className="w-5 h-5 text-black" />}
      </button>
    </div>
  );
};

export default InputArea;
