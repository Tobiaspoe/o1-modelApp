import React, { useState } from 'react';
import { sendTextToChat } from '../utils/api';

interface InputAreaProps {
  onNewMessage: (role: 'user' | 'assistant', content: string) => void;
  sessionId: string;
}

const InputArea: React.FC<InputAreaProps> = ({ onNewMessage, sessionId }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    onNewMessage('user', userText);
    setInput('');
    setLoading(true);
    try {
      const res = await sendTextToChat(userText, sessionId);
      onNewMessage('assistant', res.response);
    } catch (err) {
      console.error('❌ Chat error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 flex gap-2">
      <input
        className="flex-1 border border-gray-300 rounded-xl p-2"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        disabled={loading}
      />
      <button
        className="bg-blue-600 text-white rounded-xl px-4 py-2"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default InputArea;
