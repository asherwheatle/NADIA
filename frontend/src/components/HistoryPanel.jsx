import { useState } from "react";

export default function HistoryPanel({ history, setHistory }) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Delete a single entry
  const deleteEntry = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="glass-card history-panel">
        <h3>History</h3>

        {/* Clear History Button */}
        <button 
          className="clear-history-btn"
          onClick={() => setShowConfirm(true)}
        >
          Clear History
        </button>

        {history.length === 0 && <p>No previous results yet.</p>}

        <ul className="history-list">
          {history.map((item, index) => (
            <li key={index} className="history-item interactive">
              <div className="history-text">
                <strong>{item.label}</strong>
                <span>{item.confidence}%</span>
              </div>

              {/* Individual delete button */}
              <button 
                className="delete-entry-btn"
                onClick={() => deleteEntry(index)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box glass-card">
            <p>Are you sure you want to clear all history?</p>

            <div className="confirm-actions">
              <button 
                className="confirm-btn"
                onClick={() => {
                  setHistory([]);
                  setShowConfirm(false);
                }}
              >
                Yes, clear it
              </button>

              <button 
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}