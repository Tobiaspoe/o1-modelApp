import React, { useState } from 'react';
import MicRecorder from './MicRecorder';

const InputArea = ({ onSendText, onSendAudio }) => {
  const [input, setInput] = useState('');

  const handleTextSend = () => {
    if (input.trim()) {
      onSendText(input);
      setInput('');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      <input
        type="text"
        placeholder="Type your message"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleTextSend()}
        style={{ flexGrow: 1, padding: '0.5rem' }}
      />
      <button onClick={handleTextSend}>Send</button>
      <MicRecorder onRecordingComplete={onSendAudio} />
    </div>
  );
};

export default InputArea;
