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
    // eslint-disable-next-line no-unused-vars
    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const sampleRate = audioContext.sampleRate;
    const binSize = sampleRate / analyser.fftSize;

    // Speech band: 60 Hz → 6000 Hz
    const startBin = Math.floor(60 / binSize);
    const endBin = Math.floor(6000 / binSize);

    let rafId;

    const update = () => {
      analyser.getByteFrequencyData(dataArray);

      const speechBins = dataArray.slice(startBin, endBin);
      const peak = Math.max(...speechBins);

      // Normalize 0–255 → 0–100
      const normalized = (peak / 255) * 100;

      // Smooth
      setLevel((prev) => prev * 0.6 + normalized * 0.4);

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