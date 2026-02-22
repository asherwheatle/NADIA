import { useState } from "react";
import IllnessInfoModal from "./IllnessInfoModal";

export default function ResultsCard({ result, onReset }) {
  const [showInfo, setShowInfo] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <>
      <div className="results-card">
        <h2>{result.label}</h2>
        <p><p>Confidence: {result.confidenceDisplay}</p></p>

        {result.image && (
          <>
            {!iframeLoaded && <div className="iframe-shimmer" />}

            <iframe
              src={result.image}
              className={`embedded-resource ${iframeLoaded ? "visible" : "hidden"}`}
              title={`${result.label} Resource`}
              onLoad={() => setIframeLoaded(true)}
            ></iframe>

            <h3 className="resource-preview-title">Resource Preview</h3>

            {/* BUTTON ROW */}
            <div className="resource-btn-row">
              <a
                href={result.image}
                target="_blank"
                rel="noopener noreferrer"
                className="view-full-resource-btn"
              >
                View Full Resource
              </a>

              <button
                className="more-info-btn"
                onClick={() => setShowInfo(true)}
              >
                More Information
              </button>
            </div>
          </>
        )}

        {/* RESET BUTTON */}
        <button className="reset-btn-floating" onClick={onReset}>
          Reset
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