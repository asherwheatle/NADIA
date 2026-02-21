import { useEffect, useState } from "react";

export default function WaveformVisualizer({ listening }) {
  const [levels, setLevels] = useState(new Array(12).fill(5));

  useEffect(() => {
    let mounted = true;

    if (!listening) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLevels(new Array(12).fill(5));
      return;
    }

    const interval = setInterval(() => {
      if (mounted) {
        setLevels(levels =>
          levels.map(() => Math.floor(Math.random() * 80) + 10)
        );
      }
    }, 120);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [listening]);

  return (
    <div className="waveform-container">
      {levels.map((h, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}