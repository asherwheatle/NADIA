import numpy as np
import librosa

def generate_spectrogram(y, sr):
    # Generate Mel spectrogram
    mel = librosa.feature.melspectrogram(
        y=y,
        sr=sr,
        n_fft=1024,
        hop_length=256,
        n_mels=128
    )

    # Convert to log scale
    mel_db = librosa.power_to_db(mel, ref=np.max)

    return mel_db