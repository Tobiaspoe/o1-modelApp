import React, { useState } from 'react';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-md px-4 py-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="flex-grow bg-transparent focus:outline-none text-base placeholder-gray-400 dark:placeholder-gray-500 px-2 py-2"
        placeholder={isLoading ? 'Loading...' : 'Type a message...'}
      />
      <button
        onClick={() => {
          onSend(input);
          setInput('');
        }}
        disabled={isLoading}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
};

export default InputArea;
