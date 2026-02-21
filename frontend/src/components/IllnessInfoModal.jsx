import illnessInfo from "../utils/illnessInfo";

export default function IllnessInfoModal({ label, onClose }) {
  const info = illnessInfo[label];

  if (!info) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{label}</h2>
        <p>{info.description}</p>

        {info.symptoms?.length > 0 && (
          <>
            <h3>Common Symptoms</h3>
            <ul>
              {info.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}

        <h3>Treatment</h3>
        <p>{info.treatment}</p>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}