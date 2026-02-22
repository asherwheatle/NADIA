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
    setShowDropZone(false);
  };

  const toggleListening = () => {
    setListening(!listening);
    setResult(null);
  };

  const handleReset = () => {
  setResult(null);
  setUploadedFile(null);
  window.recordedBlob = null;
  setShowDropZone(false);
  setListening(false);
  setLoading(false);
};

  // -----------------------------
  // REAL BACKEND SUBMIT FUNCTION
  // -----------------------------
const handleSubmit = async () => {
  setListening(false);
  setLoading(true);
  setResult(null);

  try {
    const formData = new FormData();

    // If user uploaded a file
    if (uploadedFile) {
      formData.append("file", uploadedFile, "uploaded_audio.wav");
    }

    // If user recorded audio
    if (!uploadedFile && window.recordedBlob) {
      formData.append("file", window.recordedBlob, "recorded_audio.wav");
    }

    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    const newResult = {
      label: data.label,
      confidence: data.confidence,
      image: data.image,
    };

    setResult(newResult);
    onNewResult(newResult);

  } catch (err) {
    console.error("Prediction error:", err);
  }

  setLoading(false);
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

      {showDropZone && <DragDropUpload onUpload={handleUpload} />}

      <RecordingWaveform listening={listening} />
      <WaveformVisualizer listening={listening} />

      <RecordButton listening={listening} onToggle={toggleListening} />
      <SubmitButton
        disabled={!listening && !uploadedFile}
        onSubmit={handleSubmit}
      />

      {loading && <Loading />}
      {result && !loading && (
        <ResultsCard 
          result={result}
          onReset={handleReset}
        />
        )}
    </>
  );
}