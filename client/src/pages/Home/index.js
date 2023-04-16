import React, { useState,useEffect } from "react";
import Logo from "../../assets/logo.svg";
import Recorder from "../../assets/recording.svg";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicRecorder from 'mic-recorder-to-mp3';
import axios from "axios";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const Home = () => {

  const [isRecording, setIsRecording] = useState(false);
  const [audioFile,setAudioFile] = useState(null);
  const [loading,setLoading] =  useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startRecording = () => {
   SpeechRecognition.startListening({ continuous: true });
    Mp3Recorder.start()
        .then(() => setIsRecording(true))
        .catch((e) => console.error(e));
  }

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    Mp3Recorder.stop()
    .getMp3()
    .then(([buffer, blob]) => {
      const blobURL = URL.createObjectURL(blob);
      setAudioFile(blob)
      console.log(blobURL);
      setIsRecording(false);
    })
    .catch((e) => console.log(e));
  }

  const submitTranscript = () => {
    const url = `/transcribe`
    setLoading(true);
    axios.post(url, {
      aduio : audioFile
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => setLoading(false));
  }

  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log('Permission Granted');
      },
      () => {
        console.log('Permission Denied');
        alert("Please allow microphone access to use this app");
      },
    );
  }, []);
  

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
              ) :(<div className="home-page-content-recorder-box">
                <img src={Recorder} alt="" />
                {listening ? (
                  <>
                    <p>Stop recording whenever you feel like</p>
                    <button onClick={stopRecording}>{'Stop Recording'}</button>
                  </>
                ) : (
                  <>
                    <p>Start recording whenever you feel like</p>
                    <button onClick={startRecording}>{'Start Recording'}</button>
                  </>
                )}
                <button onClick={resetTranscript}>{'Reset'}</button>
                <button onClick={resetTranscript}>{'Submit'}</button>
              </div>)}
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
