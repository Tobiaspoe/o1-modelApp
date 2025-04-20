import React, { useState, useRef } from 'react';

const MicRecorder = ({ onAudioComplete, isRecording, onRecordingStart, onRecordingStop }) => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunks = useRef([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });

        if (onAudioComplete && typeof onAudioComplete === 'function') {
          console.log('🎙️ Audio recording complete. Blob:', blob);
          onAudioComplete(blob);
        } else {
          console.warn('onAudioComplete is not a function or missing.');
        }

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorderRef.current.start();
      if (onRecordingStart) onRecordingStart();

      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (onRecordingStop) onRecordingStop();
    clearInterval(timerRef.current);
    setElapsedTime(0);
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          backgroundColor: isRecording ? '#e74c3c' : '#2ecc71',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
        }}
      >
        {isRecording ? 'Stop 🎙️' : 'Record 🎤'}
      </button>
      {isRecording && <span style={{ fontFamily: 'monospace' }}>⏱ {formatTime(elapsedTime)}</span>}
    </div>
  );
};

export default MicRecorder;
