import React, { useState, useRef } from 'react';
import Recorder from 'recorder-js';
import './MicRecorder.css';

interface MicRecorderProps {
  onAudioReady: (blob: Blob) => Promise<void>;
  isLoading: boolean;
}

const MicRecorder: React.FC<MicRecorderProps> = ({ onAudioReady, isLoading }) => {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<Recorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const recorder = new Recorder(audioContext, {
      // Optional: export with sample rate & bit depth compatible with Azure Speech
      // type: 'audio/wav', 
      // bitDepth: 16, 
      // sampleRate: 16000 
    });

    recorder.init(stream);
    recorder.start();

    audioContextRef.current = audioContext;
    recorderRef.current = recorder;
    streamRef.current = stream;

    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      const { blob } = await recorderRef.current.stop();
      await onAudioReady(blob);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    audioContextRef.current?.close();
    setIsRecording(false);
  };

  return (
    <div className="mic-recorder">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading}
        className={`mic-button ${isRecording ? 'recording' : ''}`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default MicRecorder;
