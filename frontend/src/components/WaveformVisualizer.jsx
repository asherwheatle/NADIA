import { useEffect, useState } from "react";

export default function WaveformVisualizer({ listening, db }) {
  const [levels, setLevels] = useState(new Array(12).fill(5));

  useEffect(() => {
    if (!listening) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLevels(new Array(12).fill(5));
      return;
    }

    const interval = setInterval(() => {
      // BOOST the db signal (this is the key)
      const boosted = Math.min(db * 1.8, 100); // increase sensitivity

      // Add dynamic variation per bar
      setLevels(() =>
        new Array(12).fill(0).map((_, i) => {
          const barVariance = (Math.sin(Date.now() / 120 + i) * 8); // organic movement
          const randomWiggle = Math.random() * 10 - 5;

          const height = boosted + barVariance + randomWiggle;

          return Math.max(5, Math.min(100, height));
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [listening, db]);

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