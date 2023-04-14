import React, { useState } from "react";
import Logo from "../../assets/logo.svg";
import Recorder from "../../assets/recording.svg";

const Home = () => {
  const [recording, setRecording] = useState("Start recording");
  const [show, setShow] = useState(false);
  const [transcription, setTranscription] = useState("");

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
            <p>Start recording whenever you feel like</p>
            <button onClick={handleRecording}>{recording}</button>
          </div>
        </div>
        {show && (
          <div className="home-page-content-transccribe">
            <p>Here’s your transcription:</p>
            <div className="transcribtion">{transcription}</div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Home;
