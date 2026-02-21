export default function RecordingWaveform({ listening }) {
  if (!listening) return null;

  return (
    <div className="recording-waveform">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="recording-bar"></div>
      ))}
    </div>
  );
}