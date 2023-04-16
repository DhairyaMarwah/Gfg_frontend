import React, { useState, useEffect } from "react";
import Logo from "../../assets/logo.svg";
import Recorder from "../../assets/recording.svg";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MicRecorder from "mic-recorder-to-mp3";
import axios from "axios";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });
const Home = () => {
  const apiURL = "http://34.68.66.93/transcribe";

  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
    Mp3Recorder.start()
      .then(() => setIsRecording(true))
      .catch((e) => console.error(e));
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setAudioFile(blob);
        console.log(blobURL);
        setIsRecording(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
      },
      () => {
        console.log("Permission Denied");
        alert("Please allow microphone access to use this app");
      }
    );
  }, []);
  const [response, setResponse] = useState();
  const handleSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", audioFile, "audio.mp3");
    fetch(apiURL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResponse(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
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
          {loading ? (
            <p>Loading....</p>
          ) : (
            <div className="home-page-content-recorder-box">
              <img src={Recorder} alt="" />
              {listening ? (
                <>
                  <p>Stop recording whenever you feel like</p>
                  <button onClick={stopRecording}>{"Stop Recording"}</button>
                </>
              ) : (
                <>
                  <p>Start recording whenever you feel like</p>
                  <button onClick={startRecording}>{"Start Recording"}</button>
                </>
              )}
              <button onClick={resetTranscript}>{"Reset"}</button>
              <button onClick={handleSubmit}>{"Submit"}</button>
            </div>
          )}
        </div>
        <div className="home-page-content-transccribe">
          <p>Here’s your transcription:</p>
          {response ? (
            <div className="transcribtion">{transcript}</div>
          ) : (
            <div className="transcribtion">{response?.text}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
