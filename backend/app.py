import os
import uuid
import aiofiles
import requests
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow frontend & localhost
origins = [
    "http://localhost:5173",  # local dev
    "https://lemon-wave-07946280f.6.azurestaticapps.net"  # deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # <- updated to allow cookies/headers
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure environment variables
AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_DEPLOYMENT_NAME")
AZURE_API_VERSION = os.getenv("AZURE_API_VERSION")

class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat_with_o1(body: ChatRequest):
    headers = {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_KEY,
    }

    endpoint = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_DEPLOYMENT_NAME}/chat/completions?api-version={AZURE_API_VERSION}"

    payload = {
        "messages": [
            {"role": "system", "content": """Hallo!"""},
            {"role": "user", "content": body.prompt}
        ]
    }

    response = requests.post(endpoint, headers=headers, json=payload)

    if response.status_code == 200:
        result = response.json()
        reply = result["choices"][0]["message"]["content"]
        return {"response": reply}
    elif response.status_code == 401:
        return JSONResponse(status_code=401, content={"error": "Unauthorized. Check your Azure API key and endpoint."})
    else:
        return JSONResponse(status_code=500, content={"error": "Chat failed", "details": response.text})

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    temp_filename = f"temp_{uuid.uuid4()}.webm"
    async with aiofiles.open(temp_filename, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    url = f"https://{AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1"
    headers = {
        "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        "Content-Type": "audio/wav",
        "Accept": "application/json"
    }
    params = {"language": "en-US"}

    with open(temp_filename, "rb") as audio_file:
        response = requests.post(url, headers=headers, params=params, data=audio_file)

    os.remove(temp_filename)

    if response.status_code == 200:
        transcript = response.json().get("DisplayText", "")

        chat_headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_OPENAI_KEY,
        }
        chat_endpoint = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_DEPLOYMENT_NAME}/chat/completions?api-version={AZURE_API_VERSION}"
        payload = {
            "messages": [
                {"role": "system", "content": """Hallo!"""},
                {"role": "user", "content": transcript}
            ]
        }
        chat_response = requests.post(chat_endpoint, headers=chat_headers, json=payload)

        if chat_response.status_code == 200:
            reply = chat_response.json()["choices"][0]["message"]["content"]
            return {
                "transcript": transcript,
                "response": reply
            }
        else:
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Transcription succeeded but chat failed",
                    "transcript": transcript,
                    "chat_error": chat_response.text
                }
            )
    else:
        return JSONResponse(
            status_code=500,
            content={"error": "Transcription failed", "details": response.text}
        )
