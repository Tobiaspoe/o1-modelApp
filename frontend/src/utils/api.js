const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Sends the user's text input to the /chat endpoint
export const sendTextToBackend = async (text) => {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: text }),
    });

    if (!res.ok) {
      throw new Error(`Chat request failed: ${res.status}`);
    }

    const data = await res.json();
    return data.response;
  } catch (error) {
    console.error("❌ Chat error:", error);
    throw error;
  }
};

// Sends an audio blob to the /transcribe endpoint for transcription
export const sendAudioToBackend = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    const res = await fetch(`${API_BASE}/transcribe`, {
      method: 'POST',
      body: formData,
      // No need for headers — browser handles multipart boundaries automatically
    });

    if (!res.ok) {
      throw new Error(`Transcription request failed: ${res.status}`);
    }

    const data = await res.json();
    return data.transcript;
  } catch (error) {
    console.error("❌ Audio transcription error:", error);
    throw error;
  }
};
