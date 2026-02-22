import { useEffect, useRef } from "react";

export default function RecordButton({ listening, onToggle }) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        // 🔥 Make the blob globally accessible
        window.recordedBlob = blob;

        chunksRef.current = [];
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  };

    useEffect(() => {
    if (listening) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [listening]);
  
  return (
    <button className="btn btn-listen" onClick={onToggle}>
      {listening ? "Stop Listening" : "Start Listening"}
    </button>
  );
}