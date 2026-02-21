import RecordingWaveform from "../components/RecordingWaveform";
import WaveformVisualizer from "../components/WaveFormVisualizer";
import BreathingCircle from "../components/BreathingCircle";
import RecordButton from "../components/RecordButton";
import SubmitButton from "../components/SubmitButton";
import ResultsCard from "../components/ResultsCard";
import Loading from "../components/Loading";
import FloatingMic from "../components/Floating_Mic.jsx";
import { useState } from "react";

export default function Record() {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setResult({
      label: "Normal Breath Sound",
      confidence: 92
    });
  }, 2000);
};

return (
  <>
    <BreathingCircle recording={listening}>
      <FloatingMic listening={listening} onToggle={toggleListening} />
    </BreathingCircle>

    <RecordingWaveform listening={listening} />

    <WaveformVisualizer listening={listening} />

    <RecordButton listening={listening} onToggle={toggleListening} />
    <SubmitButton disabled={!listening} onSubmit={handleSubmit} />

    {loading && <Loading />}
    {result && !loading && <ResultsCard result={result} />}
  </>
);
}