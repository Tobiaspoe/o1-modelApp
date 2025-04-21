import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import InputArea from './components/InputArea';
import useMicRecorder from './components/MicRecorder';
import { sendAudioToBackend, sendTextToBackend } from './utils/api';

const App: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot'; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [...prev, { text, sender, timestamp }]);
  };

  const handleSendText = async (text: string) => {
    addMessage(text, 'user');
    setLoading(true);
    try {
      const response = await sendTextToBackend(text);
      addMessage(response, 'bot');
    } catch (err) {
      addMessage('Sorry, something went wrong.', 'bot');
    } finally {
      setLoading(false);
    }
  };

  const handleAudioStop = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const transcript = await sendAudioToBackend(audioBlob);
      addMessage(transcript, 'user');
      const response = await sendTextToBackend(transcript);
      addMessage(response, 'bot');
    } catch (err) {
      addMessage('Audio processing failed.', 'bot');
    } finally {
      setLoading(false);
    }
  };

  const { recording, toggleRecording } = useMicRecorder(handleAudioStop);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">FinMatch Assistant</h1>
      <ChatBox messages={messages} loading={loading} />
      <InputArea onSend={handleSendText} recording={recording} onMicClick={toggleRecording} />
    </div>
  );
};

export default App;
