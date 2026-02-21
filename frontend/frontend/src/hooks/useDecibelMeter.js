import { useEffect, useState } from "react";

export default function useDecibelMeter(listening) {
  const [db, setDb] = useState(0);

  useEffect(() => {
    if (!listening) return;

    let audioContext;
    let analyser;
    let source;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContext = new AudioContext();
      source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);

      const update = () => {
        analyser.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }

        const rms = Math.sqrt(sum / dataArray.length);
        const decibels = 20 * Math.log10(rms || 0.00001);

        setDb(Math.max(-60, decibels)); // clamp to avoid -Infinity
        requestAnimationFrame(update);
      };

      update();
    });

    return () => {
      if (audioContext) audioContext.close();
    };
  }, [listening]);

  return db;
}