from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io
import numpy as np
import torch
import torch.nn as nn
import torchvision.models as models
import librosa

from utils.preprocess import preprocess_audio
from utils.spectrogram import generate_spectrogram

# ---------------------------------------------------------
# FastAPI + CORS
# ---------------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Config
# ---------------------------------------------------------
DEVICE = torch.device("cpu")
NUM_CLASSES = 12

CLASSES = [
    "Asthma", "Heart Failure", "COPD", "Pneumonia",
    "Pleural Effusion", "Lung Fibrosis", "Bronchitis",
    "Bronchiectasis", "Bronchiolitis", "URTI", "Normal", "None",
]

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

ILLNESS_IMAGES = {
    "Asthma": "https://rule-words-92500686.figma.site",
    "Heart Failure": "https://gem-excel-72755474.figma.site",
    "COPD": "https://elude-rabid-52202986.figma.site",
    "Pneumonia": "https://anchor-food-65846067.figma.site",
    "Pleural Effusion": "https://mix-quake-37136294.figma.site",
    "Lung Fibrosis": "https://spider-strata-90890651.figma.site",
    "Bronchitis": "https://public-froze-21642272.figma.site",
    "Bronchiectasis": "https://lair-jargon-00047927.figma.site",
    "Bronchiolitis": "https://salsa-tape-36789843.figma.site",
}

# ---------------------------------------------------------
# Model definitions
# ---------------------------------------------------------
class MetadataWeightNet(nn.Module):
    def __init__(self, meta_dim=2, num_classes=NUM_CLASSES):
        super().__init__()
        self.importance = nn.Sequential(
            nn.Linear(meta_dim, 16),
            nn.ReLU(),
            nn.Linear(16, meta_dim),
            nn.Softmax(dim=-1),
        )
        self.projection = nn.Linear(meta_dim, num_classes)

    def forward(self, metadata):
        weights = self.importance(metadata)
        self.last_weights = weights
        weighted = metadata * weights
        return self.projection(weighted)


class PulmoScanModel(nn.Module):
    def __init__(self, num_classes=NUM_CLASSES):
        super().__init__()
        self.cnn = models.efficientnet_b0(weights=None)
        self.cnn.classifier = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(1280, num_classes),
        )
        self.meta = MetadataWeightNet(meta_dim=2, num_classes=num_classes)

    def forward(self, x, metadata):
        cnn_logits = self.cnn(x)
        meta_logits = self.meta(metadata)
        return cnn_logits + meta_logits


# ---------------------------------------------------------
# Load weights
# ---------------------------------------------------------
model = PulmoScanModel().to(DEVICE)

cnn_state = torch.load("model/Trained_Weights.pth", map_location=DEVICE)
meta_state = torch.load("model/metadata_weights.pth", map_location=DEVICE)

model.cnn.load_state_dict(cnn_state)
model.meta.load_state_dict(meta_state)

model.eval()

# ---------------------------------------------------------
# Spectrogram → Tensor
# ---------------------------------------------------------
def spec_to_tensor(spec: np.ndarray) -> torch.Tensor:
    # Min-max normalize
    spec = (spec - spec.min()) / (spec.max() - spec.min() + 1e-8)

    # Resize/pad to 224x224
    target_h, target_w = 224, 224
    h, w = spec.shape
    padded = np.zeros((max(h, target_h), max(w, target_w)), dtype=np.float32)
    padded[:h, :w] = spec
    spec = padded[:target_h, :target_w]

    # Duplicate to 3 channels
    spec_3ch = np.stack([spec, spec, spec], axis=0)

    # ImageNet normalization
    mean = np.array(IMAGENET_MEAN).reshape(3, 1, 1)
    std = np.array(IMAGENET_STD).reshape(3, 1, 1)
    spec_3ch = (spec_3ch - mean) / std

    tensor = torch.from_numpy(spec_3ch).float().unsqueeze(0)
    return tensor.to(DEVICE)

# ---------------------------------------------------------
# Prediction endpoint
# ---------------------------------------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    audio_bytes = await file.read()

    # Load audio
    y, sr = librosa.load(io.BytesIO(audio_bytes), sr=16000)

    # Preprocess + spectrogram
    y = preprocess_audio(y)
    spec = generate_spectrogram(y, sr)

    # Convert to tensor
    x = spec_to_tensor(spec)

    # Neutral metadata (age=0.5, gender=0.5)
    metadata = torch.tensor([[0.5, 0.5]], dtype=torch.float32).to(DEVICE)

    with torch.no_grad():
        logits = model(x, metadata)
        probs = torch.sigmoid(logits).cpu().numpy()[0]

    # Pick top class
    top_idx = int(np.argmax(probs))
    top_label = CLASSES[top_idx]
    top_conf = float(probs[top_idx])

    return {
        "label": top_label,
        "confidence": top_conf,
        "image": ILLNESS_IMAGES.get(top_label),
    }