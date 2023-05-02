import os
import tempfile
import flask
from flask import request
from flask_cors import CORS
import whisper
import openai
import os
from dotenv import load_dotenv
load_dotenv()
from transformers import pipeline

app = flask.Flask(__name__)
CORS(app)


@app.route('/transcribe', methods=['POST'])
def transcribe():
    if request.method == 'POST':
        print("transcribing")
        temp_dir = tempfile.mkdtemp()
        save_path = os.path.join(temp_dir, 'temp.wav')
        wav_file = request.files['audio']
        wav_file.save(save_path)
        pipe = pipeline(model=os.environ["MODEL"],use_auth_token=os.environ["HUGGINGFACE_API_KEY"])
        result = pipe(save_path)["text"]
        # get corrected text from openai
        print(result)
        question = "Correct the following text and correct any words that may be wrong: \n" + result +" \n\nCorrected text:"
        openai.api_key = "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"
        response = openai.ChatCompletion.create(
                model='gpt-3.5-turbo',
                messages=[
                    {"role": "user", "content": question},
                ],
                n=1
        )
        print(response.choices[0]['message']["content"])
        answer = response.choices[0]['message']["content"]
        return answer
    else:
        return "This endpoint only processes POST wav blob"
