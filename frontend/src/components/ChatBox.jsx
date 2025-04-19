import React from 'react';

const ChatBox = ({ messages }) => {
  return (
    <div className="chat-box" style={{ padding: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
      {messages.map((msg, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          <strong>{msg.sender}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
