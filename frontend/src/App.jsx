// src/App.jsx
import React, { useState } from 'react'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [transcript, setTranscript] = useState('')

  const handleChat = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/chat`,
        new URLSearchParams({ prompt }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      setResponse(res.data.response)
    } catch (err) {
      console.error(err)
      setResponse('Something went wrong.')
    }
  }

  const handleTranscribe = async () => {
    if (!audioFile) return

    const formData = new FormData()
    formData.append('file', audioFile)

    try {
      const res = await axios.post(`${BACKEND_URL}/transcribe`, formData)
      setTranscript(res.data.transcript)
    } catch (err) {
      console.error(err)
      setTranscript('Transcription failed.')
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>FastAPI + Vite Chat</h1>

      <div>
        <h2>Chat</h2>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Say something..."
        />
        <button onClick={handleChat}>Send</button>
        <p><strong>Response:</strong> {response}</p>
      </div>

      <hr />

      <div>
        <h2>Transcribe</h2>
        <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
        <button onClick={handleTranscribe}>Upload and Transcribe</button>
        <p><strong>Transcript:</strong> {transcript}</p>
      </div>
    </div>
  )
}

export default App
