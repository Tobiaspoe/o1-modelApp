import sounddevice as sd
import soundfile as sf

# Settings
filename = "test.wav"
duration = 5  # seconds
samplerate = 44100  # CD-quality audio

print("🎙️ Recording... Speak now.")
audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype='int16')
sd.wait()
sf.write(filename, audio, samplerate)
print(f"✅ Saved recording to {filename}")
