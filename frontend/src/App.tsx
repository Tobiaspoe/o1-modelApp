import React, { useState } from 'react';
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

    const userMessage: Message = { sender: 'user', text, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    try {
      const response = await sendTextToChat(text, sessionId);
      const botMessage: Message = { sender: 'bot', text: response, timestamp: new Date().toLocaleTimeString() };
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
      <h1 className="text-3xl font-bold text-center my-6">FinMatch Chat</h1>
      <ChatBox messages={messages} />
      <div className="fixed bottom-4 w-full max-w-4xl mx-auto left-0 right-0 px-4">
        <InputArea onSend={handleSendText} isLoading={isLoading} />
        <MicRecorder onAudioReady={handleAudioBlob} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
