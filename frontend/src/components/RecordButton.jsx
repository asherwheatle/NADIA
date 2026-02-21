export default function RecordButton({ listening, onToggle }) {
  return (
    <button className="btn btn-listen" onClick={onToggle}>
      {listening ? "Stop Listening" : "Start Listening"}
    </button>
  );
}