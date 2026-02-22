import { useEffect, useState } from "react";

export default function Visualizer({ listening, db }) {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!listening) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLevel(0);
      return;
    }

    const interval = setInterval(() => {
      const normalized = Math.min(Math.max(db, 0), 100);
      setLevel(normalized);
    }, 100);

    return () => clearInterval(interval);
  }, [listening, db]);

  return (
    <div className="visualizer-container">
      <div
        className="visualizer-fill"
        style={{ width: `${level}%` }}
      />
    </div>
  );
}