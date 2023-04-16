import os
import tempfile
import flask
from flask import request
from flask_cors import CORS
import whisper
from transformers import pipeline

app = flask.Flask(__name__)
CORS(app)


@app.route('/transcribe', methods=['POST'])
def transcribe():
    if request.method == 'POST':
        temp_dir = tempfile.mkdtemp()
        save_path = os.path.join(temp_dir, 'temp.wav')
        wav_file = request.files['audio_data']
        wav_file.save(save_path)
        print("transcribing")
        pipe = pipeline(model="jayantkhannna1/whisper-small-en-medical-2.0.3",use_auth_token="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")
        result = pipe(save_path)["text"]
        return result
    else:
        return "This endpoint only processes POST wav blob"
