export const sendTextToBackend = async (text) => {
    const res = await fetch("https://scaling-acorn-976rg745rxr6h75v9-8000.app.github.dev/chat", {
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
  
    const res = await fetch("https://scaling-acorn-976rg745rxr6h75v9-8000.app.github.dev/transcribe", {
      method: 'POST',
      body: formData,
    });
  
    const data = await res.json();
    return data.transcript; // fix: not 'transcription'
  };
  