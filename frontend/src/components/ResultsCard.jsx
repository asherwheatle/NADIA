import { useState } from "react";
import IllnessInfoModal from "./IllnessInfoModal";

export default function ResultsCard({ result }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="results-card">
        <h2>{result.label}</h2>
        <p>Confidence: {Math.round(result.confidence * 100)}%</p>

        {result.image && (
          <img
            src={result.image}
            alt={result.label}
            className="result-illness-image"
          />
        )}

        <button className="more-info-btn" onClick={() => setShowInfo(true)}>
          More Information
        </button>

        {showInfo && (
          <IllnessInfoModal
            label={result.label}
            onClose={() => setShowInfo(false)}
          />
        )}
      </div>

      <p className="disclaimer">
        This result is meant to guide awareness, not replace medical care.
        If you have concerns about your health, please speak with a licensed healthcare provider.
      </p>
    </>
  );
}