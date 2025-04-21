// src/components/InputArea.jsx
import React, { useState } from 'react';
import { Microphone } from '@radix-ui/react-icons';

const InputArea = ({ onSend, onRecord, recording, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 w-full">
      <textarea
        className="flex-grow p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={2}
        disabled={disabled}
      />
      <button
        onClick={onRecord}
        disabled={disabled}
        title={recording ? 'Stop Recording' : 'Start Recording'}
        className={`p-2 rounded-full text-white ${
          recording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        } disabled:opacity-50`}
      >
        {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
};

export default InputArea;
