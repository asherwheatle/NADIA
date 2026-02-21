export default function FloatingMic({ listening, onToggle }) {
  return (
    <div
      className={`mic-inside ${listening ? "recording" : ""}`}
      onClick={onToggle}
    >
      {listening ? "⏹" : "🎤"}
    </div>
  );
}