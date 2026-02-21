export default function ResultsCard({ result }) {
  if (!result) return null;

  return (
    <div className="glass-card">
      <h2>Analysis Result</h2>
      <p><strong>Prediction:</strong> {result.label}</p>
      <p><strong>Confidence:</strong> {result.confidence}%</p>
    </div>
  );
} 
