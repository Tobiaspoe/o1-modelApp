import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBox from './components/ChatBox';
import InputArea from './components/InputArea';
import MicRecorder from './components/MicRecorder';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState<string>(uuidv4());

  const handleNewMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  return (
    <div className="max-w-3xl mx-auto min-h-screen flex flex-col bg-white text-black">
      <h1 className="text-2xl font-bold text-center mt-6">💬 FinMatch Assistant</h1>
      <ChatBox messages={messages} />
      <InputArea onNewMessage={handleNewMessage} sessionId={sessionId} />
      <MicRecorder onNewMessage={handleNewMessage} sessionId={sessionId} />
    </div>
  );
};

export default App;
