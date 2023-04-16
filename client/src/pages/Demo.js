import React, {useState} from "react";
import speechToTextUtils from "../utility_transcribe";


const App = ({classes}) => {
  const [transcribedData, setTranscribedData] = useState([]);
  const [interimTranscribedData, setInterimTranscribedData] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  const supportedLanguages = {'en-US': 'English', 'de-DE': 'German', 'fr-FR': 'French', 'es-ES': 'Spanish'}

  function flushInterimData() {
    if (interimTranscribedData !== '') {
      setInterimTranscribedData('')
      setTranscribedData(oldData => [...oldData, interimTranscribedData])
    }
  }

  function handleDataReceived(data, isFinal) {
    if (isFinal) {
      setInterimTranscribedData('')
      setTranscribedData(oldData => [...oldData, data])
    } else {
      setInterimTranscribedData(data)
    }
  }

  function getTranscriptionConfig() {
    return {
      audio: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: selectedLanguage,
      },
      interimResults: true
    }
  }

  function onStart() {
    setTranscribedData([])
    setIsRecording(true)

    speechToTextUtils.initRecording(
      getTranscriptionConfig(),
      handleDataReceived,
      (error) => {
        console.error('Error when transcribing', error);
        setIsRecording(false)
        // No further action needed, as stream already closes itself on error
      });
  }

  function onStop() {
    setIsRecording(false)
    flushInterimData() // A safety net if Google's Speech API doesn't work as expected, i.e. always sends the final result
    speechToTextUtils.stopRecording();
  }

  console.log(transcribedData);

  return (
    <div >
      <div >

          Your Transcription App <span role="img" aria-label="microphone-emoji">🎤</span>
      </div>
      <div >
        {/* <SettingsSections possibleLanguages={supportedLanguages} selectedLanguage={selectedLanguage}
                          onLanguageChanged={setSelectedLanguage}/> */}
      </div>
      <div >
        {!isRecording && <button onClick={onStart} variant="primary">Start transcribing</button>}
        {isRecording && <button onClick={onStop} variant="danger">Stop</button>}
      </div>
      <div>
        {/* <TranscribeOutput transcribedText={transcribedData} interimTranscribedText={interimTranscribedData}/> */}
      </div>
    </div>
  );
}

export default App;
