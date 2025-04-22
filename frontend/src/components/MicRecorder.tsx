import React from 'react';
import { useState, useRef } from 'react';
import { sendAudioToTranscribe } from '../utils/api';

interface MicRecorderProps {
  onNewMessage: (role: 'user' | 'assistant', content: string) => void;
  sessionId: string;
}

const MicRecorder: React.FC<MicRecorderProps> = ({ onNewMessage, sessionId }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      onNewMessage('user', '[🎤 Voice message]');
      try {
        const res = await sendAudioToTranscribe(audioBlob, sessionId);
        onNewMessage('user', res.transcript);
        onNewMessage('assistant', res.response);
      } catch (err) {
        console.error('❌ Audio transcription error:', err);
      }
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const toggleRecording = () => {
    recording ? stopRecording() : startRecording();
  };

  return (
    <div className="p-4">
      <button
        onClick={toggleRecording}
        className={`rounded-full px-6 py-3 ${
          recording ? 'bg-red-500' : 'bg-green-500'
        } text-white`}
      >
        {recording ? 'Stop' : '🎙️ Record'}
      </button>
    </div>
  );
};

export default MicRecorder;
