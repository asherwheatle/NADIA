export default function Loading() {
  return (
    <div className="loading-card">
      <h3>Analyzing your breath...</h3>

      <div className="loading-shimmer"></div>

      <div className="dot-loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}