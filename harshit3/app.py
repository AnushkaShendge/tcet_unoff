import os
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

# Set your Eleven Labs API Key

ELEVEN_LABS_API_KEY = "sk_7c8bb967b07b7ed54579a0c6b6a269e888c6f49242898503"
HEADERS = {"xi-api-key": ELEVEN_LABS_API_KEY}

# Storage for voice IDs (In production, store in a database)
voice_database = {}


@app.route('/clone-voice', methods=['POST'])
def clone_voice():
    """
    Clone a user's voice by uploading an audio sample.
    Returns a unique `voice_id`.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    user_id = request.form.get("user_id")  # Associate the voice with a user

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    files = {"files": (file.filename, file.stream, file.mimetype)}
    data = {"name": f"Voice_{user_id}"}

    response = requests.post(
        "https://api.elevenlabs.io/v1/voices/add",
        headers=HEADERS,
        data=data,
        files=files
    )

    if response.status_code != 200:
        return jsonify({"error": response.json()}), 500

    voice_id = response.json().get("voice_id")
    voice_database[user_id] = voice_id  # Store in memory (Use DB in production)

    return jsonify({"message": "Voice cloned successfully", "voice_id": voice_id})


@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    """
    Converts input text into speech using a cloned voice.
    Requires `user_id` to retrieve the stored `voice_id`.
    """
    data = request.json
    user_id = data.get("user_id")
    text = data.get("text")

    if not user_id or not text:
        return jsonify({"error": "User ID and text are required"}), 400

    voice_id = voice_database.get(user_id)
    if not voice_id:
        return jsonify({"error": "Voice not found. Clone voice first."}), 404

    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    tts_data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}
    }

    response = requests.post(tts_url, headers={**HEADERS, "Content-Type": "application/json"}, json=tts_data)

    if response.status_code != 200:
        return jsonify({"error": response.json()}), 500

    audio_path = f"static/audio_{user_id}.mp3"
    with open(audio_path, "wb") as f:
        f.write(response.content)

    return jsonify({"message": "Speech generated successfully", "audio_url": f"/{audio_path}"})


if __name__ == '__main__':
    os.makedirs("static", exist_ok=True)  # Ensure 'static' directory exists
    app.run(debug=True,port=6002)
