import { useRef } from "react";

export default function UploadInput({ onUpload, onClick, onCancel }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    onClick(); // show drop zone
    inputRef.current.value = ""; // reset so cancel can be detected
  };

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      onCancel(); // user clicked cancel
      return;
    }

    onUpload(file);
  };

  return (
    <div className="upload-container">
      <label className="upload-label interactive" onClick={handleClick}>
        Upload Audio/Video
        <input
          ref={inputRef}
          type="file"
          accept="audio/wav, audio/mpeg, video/mp4, video/quicktime"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}