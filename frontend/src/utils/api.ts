const BACKEND_URL = import.meta.env.VITE_API_URL;

export const sendTextToChat = async (text: string, sessionId: string) => {
  const res = await fetch(`${BACKEND_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: text, sessionId }),
  });
  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`);
  }
  return await res.json();
};

export const sendAudioToTranscribe = async (audioBlob: Blob, sessionId: string) => {
  const formData = new FormData();
  formData.append('file', audioBlob);
  formData.append('sessionId', sessionId);

  const res = await fetch(`${BACKEND_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Transcription request failed: ${res.status}`);
  }
  return await res.json();
};
