import React, { useState, useRef } from 'react';
import './MicRecorder.css';

interface MicRecorderProps {
  onAudioReady: (blob: Blob) => Promise<void>;
  isLoading: boolean;
}

const MicRecorder: React.FC<MicRecorderProps> = ({ onAudioReady, isLoading }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      await onAudioReady(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="mic-recorder">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading}
        className={isRecording ? 'recording' : 'idle'}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default MicRecorder;
