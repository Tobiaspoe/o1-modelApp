from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import openai
import os
import aiofiles
import uuid
import requests

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Use the actual frontend URL instead of "*" for better security
frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")  # Optional: set this in .env

# ✅ CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://wonderful-coast-022701d03.6.azurestaticapps.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Azure env variables
AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_DEPLOYMENT_NAME")
AZURE_API_VERSION = os.getenv("AZURE_API_VERSION")


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    temp_filename = f"temp_{uuid.uuid4()}.wav"
    async with aiofiles.open(temp_filename, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    url = f"https://{AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1"
    headers = {
        "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        "Content-Type": "audio/wav",
        "Accept": "application/json"
    }
    params = {
        "language": "en-US"
    }

    with open(temp_filename, "rb") as audio_file:
        response = requests.post(url, headers=headers, params=params, data=audio_file)

    os.remove(temp_filename)

    if response.status_code == 200:
        text = response.json().get("DisplayText", "")
        return {"transcript": text}
    else:
        return JSONResponse(status_code=500, content={"error": "Transcription failed", "details": response.text})


@app.post("/chat")
async def chat_with_o1(prompt: str = Form(...)):
    headers = {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_KEY,
    }

    endpoint = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_DEPLOYMENT_NAME}/chat/completions?api-version={AZURE_API_VERSION}"

    payload = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post(endpoint, headers=headers, json=payload)

    # Debug logging
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)

    if response.status_code == 200:
        result = response.json()
        reply = result["choices"][0]["message"]["content"]
        return {"response": reply}
    elif response.status_code == 401:
        return JSONResponse(status_code=401, content={"error": "Unauthorized. Check your Azure API key and endpoint."})
    else:
        return JSONResponse(status_code=500, content={"error": "Chat failed", "details": response.text})
