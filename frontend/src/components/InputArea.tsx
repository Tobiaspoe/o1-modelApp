import React, { useState } from 'react';
import './InputArea.css';

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
    <div className="input-area">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder={isLoading ? 'Loading...' : 'Type a message...'}
      />
      <button
        onClick={() => {
          onSend(input);
          setInput('');
        }}
        disabled={isLoading || input.trim() === ''}
      >
        {isLoading ? '...' : 'Send'}
      </button>
    </div>
  );
};

export default InputArea;
