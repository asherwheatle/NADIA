import {useEffect, useState} from 'react';


export default function Visualizer({ listening }) {
  const [level, setLevel] = useState(0);

useEffect(() => {
  let mounted = true;

  if (!listening) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLevel(0);
    return;
  }

  const interval = setInterval(() => {
    if (mounted) {
      setLevel(Math.floor(Math.random() * 70) + 10);
    }
  }, 100);

  return () => {
    mounted = false;
    clearInterval(interval);
  };
}, [listening]);

  return (
    <div className="visualizer-container">
      <div
        className="visualizer-fill"
        style={{ width: `${level}%` }}
      />
    </div>
  );
}