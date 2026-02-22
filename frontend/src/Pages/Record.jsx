import RecordingWaveform from "../components/RecordingWaveform.jsx";
import WaveformVisualizer from "../components/WaveFormVisualizer.jsx";
import BreathingCircle from "../components/BreathingCircle.jsx";
import RecordButton from "../components/RecordButton.jsx";
import SubmitButton from "../components/SubmitButton.jsx";
import ResultsCard from "../components/ResultsCard.jsx";
import Loading from "../components/Loading.jsx";
import FloatingMic from "../components/Floating_Mic.jsx";
import UploadInput from "../components/UploadInput.jsx";
import DragDropUpload from "../components/DragDropUpload.jsx";
import useDecibelMeter from "../hooks/useDecibelMeter.js";
import { normalizeAudio } from "../utils/audioUtils.js";
import { useState } from "react";

function formatHistoryEntry(result) {
  const raw = result.confidence;

  if (isNaN(raw)) {
    return {
      ...result,
      confidenceDisplay: "Invalid Attempt",
    };
  }

  const percent = Math.floor(raw * 100);

  return {
    ...result,
    confidenceDisplay: `${percent}%`,
  };
}

export default function Record({ onNewResult }) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showDropZone, setShowDropZone] = useState(false);
  const [savedAnimation, setSavedAnimation] = useState(false);

  const db = useDecibelMeter(listening);

  // -----------------------------
  // MICROPHONE RECORDING LOGIC
  // -----------------------------
  let mediaRecorder;
  let chunks = [];

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    // eslint-disable-next-line react-hooks/immutability
    mediaRecorder = new MediaRecorder(stream);
    chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      window.recordedBlob = blob;

      // Trigger "Recording Saved" animation
      setSavedAnimation(true);
      setTimeout(() => setSavedAnimation(false), 1200);
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  // -----------------------------
  // FILE UPLOAD HANDLER
  // -----------------------------
  const handleUpload = async (file) => {
    const normalizedFile = await normalizeAudio(file);
    setUploadedFile(normalizedFile);
    setListening(false);
    setResult(null);
    setShowDropZone(false);
  };

  // -----------------------------
  // LISTENING TOGGLE
  // -----------------------------
  const toggleListening = () => {
    if (!listening) {
      startRecording();
    } else {
      stopRecording();
    }

    setListening(!listening);
    setResult(null);
  };

  // -----------------------------
  // RESET
  // -----------------------------
  const handleReset = () => {
    setResult(null);
    setUploadedFile(null);
    window.recordedBlob = null;
    setShowDropZone(false);
    setListening(false);
    setLoading(false);
  };

  // -----------------------------
  // SUBMIT TO BACKEND
  // -----------------------------
  const handleSubmit = async () => {
    setListening(false);
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();

      if (uploadedFile) {
        formData.append("file", uploadedFile, "uploaded_audio.wav");
      }

      if (!uploadedFile && window.recordedBlob) {
        formData.append("file", window.recordedBlob, "recorded_audio.webm");
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

      const formatted = formatHistoryEntry(newResult);
      setResult(formatted);
      onNewResult(formatted);

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

      {/* RECORDING SAVED BADGE */}
      {savedAnimation && (
        <div className="recording-saved-badge">
          Recording Saved
        </div>
      )}

      <UploadInput
        onUpload={handleUpload}
        onClick={() => setShowDropZone(true)}
        onCancel={() => setShowDropZone(false)}
      />

      {showDropZone && <DragDropUpload onUpload={handleUpload} />}

      <WaveformVisualizer listening={listening} db={db} />

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