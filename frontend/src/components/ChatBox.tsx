import React from 'react';
import { Message } from '../index';
import './Chatbox.css';

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  return (
    <div className="chat-box-wrapper">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            <div className="message-bubble">{msg.text}</div>
            {msg.timestamp && <span className="timestamp">{msg.timestamp}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
