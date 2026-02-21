import librosa
import numpy as np
import cv2
import matplotlib.pyplot as plt
import pandas as pd
import glob
import os

# ── Augmentation functions ──────────────────────────────────────────────

def add_white_noise(audio, noise_factor=0.005):
    noise = np.random.randn(len(audio))
    return audio + noise_factor * noise

def time_shift(audio, shift_max_fraction=0.2):
    shift = int(len(audio) * np.random.uniform(-shift_max_fraction, shift_max_fraction))
    return np.roll(audio, shift)

def pitch_shift(audio, sr, n_steps=None):
    if n_steps is None:
        n_steps = np.random.uniform(-3, 3)
    return librosa.effects.pitch_shift(y=audio, sr=sr, n_steps=n_steps)

def time_stretch(audio, rate=None):
    if rate is None:
        rate = np.random.uniform(0.8, 1.3)
    return librosa.effects.time_stretch(y=audio, rate=rate)

# ── Spectrogram helper (same params as convert_wav.py) ──────────────────

def make_spectrogram(audio, sr):
    mel = librosa.feature.melspectrogram(
        y=audio, sr=sr, n_fft=1024, hop_length=256, n_mels=128
    )
    mel_db = librosa.power_to_db(mel, ref=np.max)
    return cv2.resize(mel_db, (128, 128))

# ── Build the same dataframe as convert_wav.py ──────────────────────────

diagnosis_df = pd.read_csv(
    r"Data/2017_Database/Respiratory_Sound_Database/Respiratory_Sound_Database/patient_diagnosis.csv",
    header=None,
    names=["PatientID", "Diagnosis"],
)

icbhi_files = glob.glob(
    r"Data/2017_Database/Respiratory_Sound_Database/Respiratory_Sound_Database/audio_and_txt_files/*.wav"
)
second_files = glob.glob(r"Data/Lung_Sound_Database/Audio Files/*.wav")
wav_files = icbhi_files + second_files

df = pd.DataFrame({"filename": [os.path.basename(f) for f in wav_files], "filepath": wav_files})
df["filename"] = df["filename"].astype(str)

df_icbhi = df[df["filename"].str.count("_") >= 4].copy()
df_second = df[df["filename"].str.count("_") < 4].copy()

df_icbhi["PatientID"] = df_icbhi["filename"].str.split("_").str[0].astype(int)
df_icbhi["RecordingIndex"] = df_icbhi["filename"].str.split("_").str[1]
df_icbhi["ChestLocation"] = df_icbhi["filename"].str.split("_").str[2]
df_icbhi["AcquisitionMode"] = df_icbhi["filename"].str.split("_").str[3]
df_icbhi["Equipment"] = df_icbhi["filename"].str.split("_").str[4].str.replace(".wav", "")

df_icbhi = df_icbhi.merge(diagnosis_df, on="PatientID", how="left")

demo_df = pd.read_csv(
    r"Data/2017_Database/demographic_info.txt",
    sep=r"\s+",
    header=None,
    usecols=[0, 1, 2, 3],
    names=["PatientID", "Age", "Sex", "AdultBMI"],
)
df_icbhi = df_icbhi.merge(demo_df, on="PatientID", how="left")
df_icbhi = df_icbhi.rename(columns={"PatientID": "ID", "Sex": "Gender"})
df_icbhi = df_icbhi[["ID", "Age", "Gender", "Diagnosis", "filepath"]]


def parse_second_dataset(name):
    name = name.replace(".wav", "")
    rec_id, rest = name.split("_", 1)
    parts = [p.strip() for p in rest.split(",")]
    return pd.Series([rec_id, parts[0], parts[1], parts[2], parts[3], parts[4]])


df_second[["RecordingID", "Diagnosis", "SoundType", "Location", "Age", "Gender"]] = (
    df_second["filename"].apply(parse_second_dataset)
)
df_second = df_second.rename(columns={"RecordingID": "ID"})
df_second = df_second[["ID", "Age", "Gender", "Diagnosis", "filepath"]]

full_df = pd.concat([df_icbhi, df_second], ignore_index=True)

# ── Augmentation pipeline ───────────────────────────────────────────────

AUGMENTATIONS = {
    "noise": lambda audio, sr: add_white_noise(audio),
    "timeshift": lambda audio, sr: time_shift(audio),
    "pitchshift": lambda audio, sr: pitch_shift(audio, sr),
    "timestretch": lambda audio, sr: time_stretch(audio),
}

os.makedirs("spectrograms", exist_ok=True)

total = len(full_df) * len(AUGMENTATIONS)
count = 0

for idx, row in full_df.iterrows():
    file_path = row["filepath"]
    record_id = str(row["ID"]).replace(".", "_")
    age = str(row["Age"]).replace(".", "_") if pd.notna(row["Age"]) else "unknown"
    gender = str(row["Gender"]).replace(".", "_") if pd.notna(row["Gender"]) else "unknown"
    diagnosis = (
        str(row["Diagnosis"]).replace("/", "_").replace(" ", "_").replace(".", "_")
        if pd.notna(row["Diagnosis"])
        else "unknown"
    )

    audio, sr = librosa.load(file_path, sr=16000)

    for aug_name, aug_fn in AUGMENTATIONS.items():
        augmented = aug_fn(audio, sr)
        mel_resized = make_spectrogram(augmented, sr)

        out_name = f"spectrograms/{record_id}_{age}_{gender}_{diagnosis}_{aug_name}.png"
        plt.imsave(out_name, mel_resized, cmap="magma")

        count += 1
        if count % 50 == 0:
            print(f"Progress: {count}/{total} augmented spectrograms saved")

print(f"Done. Generated {count} augmented spectrograms from {len(full_df)} original samples.")
