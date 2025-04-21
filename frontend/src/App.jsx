// src/App.jsx
import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import InputArea from './components/InputArea';

const BACKEND_URL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const addMessage = (sender, text) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, { sender, text, timestamp }]);
  };

  const simulateStreaming = async (text) => {
    const words = text.split(' ');
    let streamed = '';
    for (let word of words) {
      streamed += word + ' ';
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: streamed.trim(),
        };
        return updated;
      });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    setLoading(false);
  };

  const handleSendText = async (inputText) => {
    addMessage('User', inputText);
    setMessages(prev => [...prev, { sender: 'Bot', text: '', timestamp: '' }]);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText }),
      });
      const data = await res.json();
      await simulateStreaming(data.response);
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: 'Something went wrong.',
        };
        return updated;
      });
      setLoading(false);
    }
  };

  const handleSendAudio = async (textFromAudio) => {
    addMessage('User', textFromAudio);
    setMessages(prev => [...prev, { sender: 'Bot', text: '', timestamp: '' }]);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: textFromAudio }),
      });
      const data = await res.json();
      await simulateStreaming(data.response);
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: 'Something went wrong.',
        };
        return updated;
      });
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''} style={{
      background: darkMode ? '#121212' : '#f4f4f4',
      color: darkMode ? '#f4f4f4' : '#121212',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>

      <h1>Finmatcho1-fzulg</h1>
      <ChatBox messages={messages} loading={loading} />
      <InputArea onSendText={handleSendText} onSendAudio={handleSendAudio} />
    </div>
  );
}

export default App;
