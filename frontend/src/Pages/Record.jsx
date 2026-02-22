import RecordingWaveform from "../components/RecordingWaveform";
import WaveformVisualizer from "../components/WaveFormVisualizer";
import BreathingCircle from "../components/BreathingCircle";
import RecordButton from "../components/RecordButton";
import SubmitButton from "../components/SubmitButton";
import ResultsCard from "../components/ResultsCard";
import Loading from "../components/Loading";
import FloatingMic from "../components/Floating_Mic.jsx";
import UploadInput from "../components/UploadInput.jsx";
import DragDropUpload from "../components/DragDropUpload.jsx";
import useDecibelMeter from "../hooks/useDecibelMeter.js";
import { normalizeAudio } from "../utils/audioUtils.js";
import { useState } from "react";

export default function Record({ onNewResult }) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showDropZone, setShowDropZone] = useState(false);

  const db = useDecibelMeter(listening);

  const handleUpload = async (file) => {
    const normalizedFile = await normalizeAudio(file);
    setUploadedFile(normalizedFile);
    setListening(false);
    setResult(null);
    setShowDropZone(false); // hide again
  };

  const toggleListening = () => {
    setListening(!listening);
    setResult(null);
  };

const handleSubmit = () => {
  setListening(false);
  setLoading(true);
  setResult(null);

  setTimeout(() => {
    setLoading(false);

    if (uploadedFile) {
      const newResult = {
        label: "Uploaded File Analyzed",
        confidence: 88
      };
      setResult(newResult);
      onNewResult(newResult);
    } else {
      const newResult = {
        label: "Normal Breath Sound",
        confidence: 92
      };
      setResult(newResult);
      onNewResult(newResult);
    }
  }, 2000);
};

  return (
    <>
      <BreathingCircle recording={listening} db={db}>
        <FloatingMic listening={listening} onToggle={toggleListening} />
      </BreathingCircle>

      <UploadInput 
    onUpload={handleUpload}
    onClick={() => setShowDropZone(true)}
    onCancel={() => setShowDropZone(false)}
      />

      {showDropZone && (
        <DragDropUpload onUpload={handleUpload} />
      )}

      <RecordingWaveform listening={listening} />
      <WaveformVisualizer listening={listening} />

      <RecordButton listening={listening} onToggle={toggleListening} />
      <SubmitButton disabled={!listening && !uploadedFile} onSubmit={handleSubmit} />

      {loading && <Loading />}
      {result && !loading && <ResultsCard result={result} />}
    </>
  );
}