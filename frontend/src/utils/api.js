const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const sendTextToBackend = async (text) => {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: text }),
  });

  const data = await res.json();
  return data.response;
};

export const sendAudioToBackend = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');

  const res = await fetch(`${API_BASE}/transcribe`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.transcript;
};
