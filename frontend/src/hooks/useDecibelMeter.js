import { useEffect, useState } from "react";

export default function useDecibelMeter(stream, listening) {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!stream || !listening) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLevel(0);
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;

    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    let rafId;

    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      const peak = Math.max(...dataArray);
      const normalized = (peak / 255) * 100;

      setLevel(normalized);
      rafId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(rafId);
      audioContext.close();
    };
  }, [stream, listening]);

  return level;
}