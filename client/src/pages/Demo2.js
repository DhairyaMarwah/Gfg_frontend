import React, { useState, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

function App() {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState([]);

  const handleStart = () => {
    setIsRecording(true);
    setTranscription('');
    setChunks([]);
    recognition.start();
  };

  const handleStop = () => {
    setIsRecording(false);
    recognition.stop();
  };

const handleTranscribe = () => {
  const apiUrl = 'https://36a2-2401-4900-1c23-45a0-c965-6c45-94e0-3d68.ngrok-free.app/transcribe';

  // Create a new Blob object from the chunks array
  const audioBlob = new Blob(chunks, { type: 'audio/webm' });
  console.log(URL.createObjectURL(audioBlob));

  // Create a new FormData object
  const formData = new FormData();

  // Append the recorded audio as a file to the FormData object
  formData.append('audio', audioBlob, 'recording.webm');

  // Send the FormData object to the API endpoint
  fetch(apiUrl, {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(json => {
      const transcription = json.transcription;
      setTranscription(transcription);
    })
    .catch(error => console.error(error));
};



  useEffect(() => {
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscription = '';
      let finalTranscription = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscription += transcript + ' ';
        } else {
          interimTranscription += transcript;
        }
      }

      setTranscription(finalTranscription);
      setChunks(prevChunks => [...prevChunks, ...event.results]);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };

    return () => {
      recognition.abort();
    };
  }, []);

  return (
    <div>
      <h1>Speech-to-Text Demo</h1>
      {isRecording ? (
        <button onClick={handleStop}>Stop Recording</button>
      ) : (
        <button onClick={handleStart}>Start Recording</button>
      )}
      <button onClick={handleTranscribe}>Transcribe</button>
      <p>{transcription}</p>
    </div>
  );
}

export default App;