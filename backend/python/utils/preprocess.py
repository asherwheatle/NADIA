import numpy as np
import librosa

def preprocess_audio(y):
    # Remove leading/trailing silence
    y, _ = librosa.effects.trim(y, top_db=20)

    # Normalize volume
    if np.max(np.abs(y)) > 0:
        y = y / np.max(np.abs(y))

    # Optional: pad or clip to fixed length (e.g., 3 seconds)
    target_length = 3 * 16000  # 3 seconds at 16kHz
    if len(y) < target_length:
        y = np.pad(y, (0, target_length - len(y)))
    else:
        y = y[:target_length]

    return y