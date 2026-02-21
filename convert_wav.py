import librosa
import numpy as np
import cv2
import matplotlib.pyplot as plt
import pandas as pd
import glob
import os
diagnosis_df = pd.read_csv(
    r"C:\VSCode\Hacklytics_2026\Data\2017_Database\Respiratory_Sound_Database\Respiratory_Sound_Database\patient_diagnosis.csv",
    header=None,
    names=["PatientID", "Diagnosis"]
)

icbhi_files = glob.glob(
    r"C:\VSCode\Hacklytics_2026\Data\2017_Database\Respiratory_Sound_Database\Respiratory_Sound_Database\audio_and_txt_files\*.wav"
)

second_files = glob.glob(
    r"C:\VSCode\Hacklytics_2026\Data\Lung_Sound_Database\Audio Files\*.wav"
)

wav_files = icbhi_files + second_files

os.makedirs("spectrograms", exist_ok=True)

for file_path in wav_files:
    audio, sr = librosa.load(file_path, sr=16000)

    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=sr,
        n_fft=1024,
        hop_length=256,
        n_mels=128
    )

    mel_db = librosa.power_to_db(mel, ref=np.max)
    mel_resized = cv2.resize(mel_db, (128, 128))

    base = os.path.basename(file_path).replace(".wav", "")
    plt.imsave(f"spectrograms/{base}.png", mel_resized, cmap="magma")

df = pd.DataFrame({"filename": [os.path.basename(f) for f in wav_files]})
df["filename"] = df["filename"].astype(str)

df_icbhi = df[df["filename"].str.count("_") >= 4].copy()
df_second = df[df["filename"].str.count("_") < 4].copy()

df_icbhi["PatientID"] = df_icbhi["filename"].str.split("_").str[0].astype(int)
df_icbhi["RecordingIndex"] = df_icbhi["filename"].str.split("_").str[1]
df_icbhi["ChestLocation"] = df_icbhi["filename"].str.split("_").str[2]
df_icbhi["AcquisitionMode"] = df_icbhi["filename"].str.split("_").str[3]
df_icbhi["Equipment"] = df_icbhi["filename"].str.split("_").str[4].str.replace(".wav", "")

# Merge diagnosis
df_icbhi = df_icbhi.merge(diagnosis_df, on="PatientID", how="left")

def parse_second_dataset(name):
    name = name.replace(".wav", "")
    rec_id, rest = name.split("_", 1)
    parts = [p.strip() for p in rest.split(",")]

    diagnosis = parts[0]
    sound_type = parts[1]
    location = parts[2]
    age = parts[3]
    gender = parts[4]

    return pd.Series([rec_id, diagnosis, sound_type, location, age, gender])

df_second[["RecordingID", "Diagnosis", "SoundType", "Location", "Age", "Gender"]] = \
    df_second["filename"].apply(parse_second_dataset)

full_df = pd.concat([df_icbhi, df_second], ignore_index=True)

demo_df = pd.read_csv(
    r"C:\VSCode\Hacklytics_2026\Data\2017_Database\demographic_info.txt",
    sep=r"\s+",
    header=None,
    usecols=[0,1,2,3],
    names=["PatientID", "Age", "Sex", "AdultBMI"]
)
full_df = full_df.merge(demo_df, on="PatientID", how="left")

print("Final dataset shape:", full_df.shape)
print(full_df.head())