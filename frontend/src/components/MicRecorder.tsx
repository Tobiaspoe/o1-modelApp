import React, { useState, useRef } from 'react';

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
    <div className="flex justify-center mt-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading}
        className={`px-6 py-3 rounded-full font-semibold transition ${
          isRecording
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-green-600 text-white hover:bg-green-700'
        } disabled:opacity-50`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default MicRecorder;
