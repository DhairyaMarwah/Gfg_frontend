import React, { useRef, useState, useEffect } from "react";
 
function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();

        setIsRecording(true);

        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
          setAudioBlob(event.data);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    console.log(audioBlob);
    const bloburl = URL.createObjectURL(audioBlob);
    console.log(bloburl);
    audioRef.current.src = bloburl; // set the src attribute of the audio element
  };

  return (
    <>
      <div>
        <button onClick={handleStartRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={handleStopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
        <button onClick={handleSubmit} disabled={!audioBlob}>
          Submit
        </button>
        <audio ref={audioRef} controls /> 
      </div>
    </>
  );
}


export default App;
