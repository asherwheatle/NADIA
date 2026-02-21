export default function BreathingCircle({ children, recording }) {
  return (
    <div className={`breath-circle ${recording ? "recording" : ""}`}>
      {children}
    </div>
  );
}