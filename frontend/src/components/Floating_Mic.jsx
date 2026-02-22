import { useEffect, useRef } from "react";

export default function FloatingMic({ listening, onToggle }) {
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

        // 🔥 Make the blob available globally
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
    // When listening becomes true → start recording
    if (listening) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [listening]);

  return (
    <div
      className={`mic-inside ${listening ? "recording" : ""}`}
      onClick={onToggle}
    >
      {listening ? "⏹" : "🎤"}
    </div>
  );
}