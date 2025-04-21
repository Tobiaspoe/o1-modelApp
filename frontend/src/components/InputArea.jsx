import React, { useState } from 'react';
import MicRecorder from './MicRecorder';

const InputArea = ({ onSendText, onSendAudio, isLoading }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendText(input);
    setInput('');
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
  };

  const handleAudio = async (audioBlob) => {
    console.log('🎙️ Audio recording complete. Blob:', audioBlob);

    // Convert WebM to WAV
    const webmToWav = async (webmBlob) => {
      const arrayBuffer = await webmBlob.arrayBuffer();
      const audioCtx = new AudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const wavBuffer = audioBufferToWav(audioBuffer);
      return new Blob([wavBuffer], { type: 'audio/wav' });
    };

    const audioBufferToWav = (buffer) => {
      const numOfChan = buffer.numberOfChannels;
      const length = buffer.length * numOfChan * 2 + 44;
      const bufferView = new DataView(new ArrayBuffer(length));
      let offset = 0;

      const writeString = (s) => {
        for (let i = 0; i < s.length; i++) {
          bufferView.setUint8(offset + i, s.charCodeAt(i));
        }
        offset += s.length;
      };

      const write16 = (val) => {
        bufferView.setUint16(offset, val, true);
        offset += 2;
      };

      const write32 = (val) => {
        bufferView.setUint32(offset, val, true);
        offset += 4;
      };

      writeString('RIFF');
      write32(length - 8);
      writeString('WAVE');
      writeString('fmt ');
      write32(16);
      write16(1);
      write16(numOfChan);
      write32(buffer.sampleRate);
      write32(buffer.sampleRate * numOfChan * 2);
      write16(numOfChan * 2);
      write16(16);
      writeString('data');
      write32(length - offset - 4);

      const channels = [];
      for (let i = 0; i < numOfChan; i++) {
        channels.push(buffer.getChannelData(i));
      }

      for (let i = 0; i < buffer.length; i++) {
        for (let j = 0; j < numOfChan; j++) {
          let sample = Math.max(-1, Math.min(1, channels[j][i]));
          sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
          bufferView.setInt16(offset, sample, true);
          offset += 2;
        }
      }

      return bufferView.buffer;
    };

    try {
      const wavBlob = await webmToWav(audioBlob);
      console.log('🔁 Converted to WAV. Blob:', wavBlob);

      const formData = new FormData();
      formData.append('file', wavBlob, 'recording.wav');

      console.log('📤 Sending audio to backend for transcription...');
      console.log("🔧 API Base URL:", import.meta.env.VITE_API_BASE);

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('✅ Transcription response received:', data);

      const text = data.transcript;
      if (text) {
        onSendAudio(text);
      } else {
        console.warn('⚠️ No transcript returned from backend.');
      }
    } catch (err) {
      console.error('❌ Audio transcription failed:', err);
    }
  };

  return (
    <div className="input-area p-4 flex gap-2 items-center">
      <form onSubmit={handleSubmit} className="flex-grow flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
      <MicRecorder
        onRecordingStart={handleRecordingStart}
        onRecordingStop={handleRecordingStop}
        onAudioComplete={handleAudio}
        isRecording={isRecording}
      />
    </div>
  );
};

export default InputArea;
