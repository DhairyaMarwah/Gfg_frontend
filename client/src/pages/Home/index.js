import React, { useState } from "react";
import Logo from "../../assets/logo.svg";
import Recorder from "../../assets/recording.svg";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const Home = () => {
  const [recording, setRecording] = useState("Start recording");
  const [show, setShow] = useState(false);
  const [transcription, setTranscription] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleRecording = async () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
      setShow(true);
    };

    recognition.onend = () => {
      setRecording("Start recording");
    };

    setRecording("Recording...");
  };

  

  return (
    <div className="home-page">
      <div className="navbar-wrap">
        <div className="navbar">
          <img src={Logo} alt="" />
        </div>
      </div>
      <div className="home-page-content">
        <div className="home-page-content-recorder">
          <h1>Verbanote Voice Transcriber</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur. Nunc libero amet in at lacus
            leo dolor. Pulvinar suscipit porttitor sapien dictumst est.{" "}
          </p>
          <div className="home-page-content-recorder-box">
            <img src={Recorder} alt="" />
            {listening ? (
              <>
                <p>Stop recording whenever you feel like</p>
                <button onClick={SpeechRecognition.stopListening}>{'Stop Recording'}</button>
              </>
            ) : (
              <>
                <p>Start recording whenever you feel like</p>
                <button onClick={SpeechRecognition.startListening}>{'Start Recording'}</button>
              </>
            )}
          </div>
        </div>
          <div className="home-page-content-transccribe">
            <p>Here’s your transcription:</p>
            <div className="transcribtion">{transcript}</div>
          </div>
      </div>
    </div>
  );
};


export default Home;
