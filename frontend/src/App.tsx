import React, { useState } from 'react';
import './App.css';
import ChatBox from './components/ChatBox';
import InputArea from './components/InputArea';
import MicRecorder from './components/MicRecorder';
import { sendTextToChat, sendAudioToTranscribe } from './utils/api';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './index';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState<string>(uuidv4());
  const [isLoading, setIsLoading] = useState(false);

  const handleSendText = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    try {
      const response = await sendTextToChat(text, sessionId);
      const botMessage: Message = {
        sender: 'bot',
        text: typeof response === 'string' ? response : response?.response || '[Invalid response]',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('❌ Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioBlob = async (blob: Blob) => {
    setIsLoading(true);
    try {
      const transcription = await sendAudioToTranscribe(blob, sessionId);
      if (transcription) {
        await handleSendText(transcription);
      }
    } catch (error) {
      console.error('❌ Transcription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <main>
        <div className="chat-box-container">
          <ChatBox messages={messages} />
        </div>
      </main>

      <footer>
        <div className="input-mic-container">
          <InputArea onSend={handleSendText} isLoading={isLoading} />
          <MicRecorder onAudioReady={handleAudioBlob} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
