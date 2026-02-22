import { useState } from "react";
import UploadBox from "../components/UploadBox.jsx";
import SubmitButton from "../components/SubmitButton.jsx";
import Loading from "../components/Loading.jsx";
import ResultsCard from "../components/ResultsCard.jsx";
import { normalizeAudio } from "../utils/audioUtils.js";

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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // -----------------------------
  // FILE UPLOAD HANDLER
  // -----------------------------
  const handleUpload = async (file) => {
    setProgress(10);

    const normalizedFile = await normalizeAudio(file);
    setProgress(60);

    setUploadedFile({
      original: file,
      normalized: normalizedFile,
    });

    setProgress(100);

    setTimeout(() => {
      setProgress(0);
    }, 500);

    setResult(null);
  };

  // -----------------------------
  // REPLACE FILE
  // -----------------------------
  const handleReplace = () => {
    setUploadedFile(null);
    setProgress(0);
    setResult(null);
  };

  // -----------------------------
  // SUBMIT TO BACKEND
  // -----------------------------
  const handleSubmit = async () => {
  if (!uploadedFile) return;

  setLoading(true);
  setResult(null);
  setProgress(80);

  try {
    const formData = new FormData();
    formData.append("file", uploadedFile.normalized, "uploaded_audio.wav");

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

  // ⭐ Mark submit as complete
  setProgress(100);

  // ⭐ Hide bar after a moment
  setTimeout(() => {
    setProgress(0);
  }, 500);

  setLoading(false);
};

  // -----------------------------
  // RESET
  // -----------------------------
  const handleReset = () => {
    setResult(null);
    setUploadedFile(null);
    setProgress(0);
    setLoading(false);
  };

  return (
    <>
      <UploadBox
        onUpload={handleUpload}
        onReplace={handleReplace}
        file={uploadedFile}
        progress={progress}
      />

      <SubmitButton
        disabled={!uploadedFile}
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

