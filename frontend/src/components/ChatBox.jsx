// src/components/ChatBox.jsx
import React from 'react';

const ChatBox = ({ messages, loading }) => {
  return (
    <div style={{
      padding: '1rem',
      maxHeight: '400px',
      overflowY: 'auto',
      border: '1px solid #ccc',
      marginTop: '1rem',
      background: 'rgba(0,0,0,0.05)',
      borderRadius: '8px'
    }}>
      {messages.map((msg, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          <strong>{msg.sender}:</strong> {msg.text}
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{msg.timestamp}</div>
        </div>
      ))}
      {loading && (
        <div><em>Bot is thinking...</em></div>
      )}
    </div>
  );
};

export default ChatBox;