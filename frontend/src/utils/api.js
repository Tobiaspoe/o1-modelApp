export const sendTextToBackend = async (text) => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ prompt: text }),
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
    return data.transcript; // fix: not 'transcription'
  };
  