const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

// Response shape from the /chat endpoint
interface ChatResponse {
  response: string;
}

// Response shape from the /transcribe endpoint
interface TranscribeResponse {
  transcript: string;
}

// Sends the user's text input to the /chat endpoint
export const sendTextToBackend = async (text: string): Promise<string> => {
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

    const data: ChatResponse = await res.json();
    return data.response;
  } catch (error) {
    console.error("❌ Chat error:", error);
    throw error;
  }
};

// Sends an audio blob to the /transcribe endpoint for transcription
export const sendAudioToBackend = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    const res = await fetch(`${API_BASE}/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Transcription request failed: ${res.status}`);
    }

    const data: TranscribeResponse = await res.json();
    return data.transcript;
  } catch (error) {
    console.error("❌ Audio transcription error:", error);
    throw error;
  }
};
