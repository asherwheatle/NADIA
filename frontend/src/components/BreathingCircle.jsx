export default function BreathingCircle({ children, recording, db }) {
  const intensity = Math.min(1, Math.abs(db) / 60);

  return (
    <div
      className={`breath-circle ${recording ? "recording" : ""}`}
      style={{
        boxShadow: recording
          ? `0 0 ${35 + intensity * 40}px rgba(255,80,80,${0.4 + intensity * 0.4})`
          : `0 0 ${35 + intensity * 20}px rgba(255,255,255,${0.25 + intensity * 0.2})`,
        transform: `scale(${0.85 + intensity * 0.15})`
      }}
    >
      {children}
    </div>
  );
}