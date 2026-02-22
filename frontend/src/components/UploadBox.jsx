import { useRef, useState } from "react";

export default function UploadBox({ onUpload, onReplace, file, progress }) {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ⭐ If file exists → show file info + replace button + progress bar
  if (file && file.original) {
    const original = file.original;

    return (
      <div className="uploaded-file-box">
        <p className="file-name">{original.name}</p>
        <p className="file-size">{formatSize(original.size)}</p>

        {/* Progress Bar */}
        {progress > 0 && progress < 100 && (
          <div className="progress-container">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Replace File Button */}
        <button className="replace-btn" onClick={onReplace}>
          Replace File
        </button>
      </div>
    );
  }

  // ⭐ No file yet → show upload box
  const handleFile = (file) => {
    if (file) onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      className={`upload-box ${dragging ? "dragging" : ""}`}
      onClick={() => fileInputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
      }}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="audio/*,video/*"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <p>Click to Upload Audio/Video</p>
    </div>
  );
}