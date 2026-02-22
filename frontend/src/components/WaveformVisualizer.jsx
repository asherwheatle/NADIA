import { useEffect, useState } from "react";

export default function WaveformVisualizer({ listening, db }) {
  const [height, setHeight] = useState(5);

  useEffect(() => {
    if (!listening) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeight(5);
      return;
    }

    const interval = setInterval(() => {
      setHeight(db);
    }, 100);

    return () => clearInterval(interval);
  }, [listening, db]);

  return (
    <div className="waveform-container">
      <div className="wave-bar" style={{ height: `${height}%` }} />
    </div>
  );
}