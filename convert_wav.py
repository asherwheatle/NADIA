import librosa
import numpy as np
import cv2
import matplotlib.pyplot as plt
import pandas as pd
import glob
import os

diagnosis_df = pd.read_csv(
    r"Data/2017_Database/Respiratory_Sound_Database/Respiratory_Sound_Database/patient_diagnosis.csv",
    header=None,
    names=["PatientID", "Diagnosis"]
)

icbhi_files = glob.glob(
    r"Data/2017_Database/Respiratory_Sound_Database/Respiratory_Sound_Database/audio_and_txt_files/*.wav"
)

second_files = glob.glob(
    r"Data/Lung_Sound_Database/Audio Files/*.wav"
)

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

# Merge diagnosis
df_icbhi = df_icbhi.merge(diagnosis_df, on="PatientID", how="left")

# Merge with demographic info
demo_df = pd.read_csv(
    r"Data/2017_Database/demographic_info.txt",
    sep=r"\s+",
    header=None,
    usecols=[0,1,2,3],
    names=["PatientID", "Age", "Sex", "AdultBMI"]
)
df_icbhi = df_icbhi.merge(demo_df, on="PatientID", how="left")

# Standardize column names for df_icbhi
df_icbhi = df_icbhi.rename(columns={"PatientID": "ID", "Sex": "Gender"})
df_icbhi = df_icbhi[["ID", "Age", "Gender", "Diagnosis", "filepath"]]

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

# Standardize column names for df_second
df_second = df_second.rename(columns={"RecordingID": "ID"})
df_second = df_second[["ID", "Age", "Gender", "Diagnosis", "filepath"]]

full_df = pd.concat([df_icbhi, df_second], ignore_index=True)

# Create spectrograms with all metadata in filename
os.makedirs("spectrograms", exist_ok=True)

for idx, row in full_df.iterrows():
    file_path = row["filepath"]
    record_id = str(row["ID"]).replace(".", "_")
    age = str(row["Age"]).replace(".", "_") if pd.notna(row["Age"]) else "unknown"
    gender = str(row["Gender"]).replace(".", "_") if pd.notna(row["Gender"]) else "unknown"
    diagnosis = str(row["Diagnosis"]).replace("/", "_").replace(" ", "_").replace(".", "_") if pd.notna(row["Diagnosis"]) else "unknown"
    
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

    spectrogram_name = f"spectrograms/{record_id}_{age}_{gender}_{diagnosis}.png"
    plt.imsave(spectrogram_name, mel_resized, cmap="magma")

print("Final dataset shape:", full_df.shape)
print(full_df.head())