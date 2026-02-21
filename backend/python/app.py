from fastapi import FastAPI, Request
import numpy as np
import librosa
import io
from utils.preprocess import preprocess_audio
from utils.spectrogram import generate_spectrogram
import pickle

app = FastAPI()

model = pickle.load(open("model/model.pkl", "rb"))

@app.post("/predict")
async def predict(request: Request):
    audio_bytes = await request.body()

    y, sr = librosa.load(io.BytesIO(audio_bytes), sr=16000)

    y = preprocess_audio(y)
    spec = generate_spectrogram(y, sr)

    pred = model.predict([spec.flatten()])[0]
    confidence = np.max(model.predict_proba([spec.flatten()]))

ILLNESS_IMAGES = {
    "Pneumonia": "https://anchor-food-65846067.figma.site",
    "Bronchiectasis": "https://lair-jargon-00047927.figma.site",
    "Asthma": "https://rule-words-92500686.figma.site",
    "Bronchiolitis": "https://salsa-tape-36789843.figma.site",
    "Bronchitis": "https://public-froze-21642272.figma.site",
    "COPD": "https://elude-rabid-52202986.figma.site",
    "Heart failure": "https://gem-excel-72755474.figma.site",
    "Lung fibrosis": "https://spider-strata-90890651.figma.site",
    "Pleural effusion": "https://mix-quake-37136294.figma.site"
}


return {
        "label": str(pred),
        "confidence": float(confidence),
        "image": ILLNESS_IMAGES.get(str(pred))
    }