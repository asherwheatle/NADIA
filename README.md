# notadoctor

## Project Overview

A full-stack application for respiratory sound analysis and X-ray classification using deep learning. This repository includes audio processing pipelines, model inference, and a web-based frontend.

## Dependencies

### System Requirements
- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **npm** or **yarn**: For JavaScript dependency management

### Python Dependencies

#### Core Audio Processing (for local spectrogram generation)
```bash
pip install librosa numpy opencv-python matplotlib pandas
```

#### Machine Learning & Model Inference
```bash
pip install torch torchvision
```

#### Backend API
```bash
pip install fastapi python-multipart uvicorn
```

#### Image Processing & APIs
```bash
pip install pillow python-dotenv google-generativeai
```

#### Full Python Installation
```bash
pip install librosa numpy opencv-python matplotlib pandas torch torchvision fastapi python-multipart uvicorn pillow python-dotenv google-generativeai
```

### Frontend Dependencies (Node.js)
- **React** 19.2.0
- **React DOM** 19.2.0
- **React Router** 7.13.0
- **Vite** 7.3.1 (build tool)
- **ESLint** 9.39.1

Install with:
```bash
cd frontend
npm install
```

### Backend Dependencies (Node.js)
- **Express** 5.2.1
- **CORS** 2.8.6
- **Multer** 2.0.2 (file uploads)
- **Axios** 1.13.5 (HTTP client)

Install with:
```bash
cd backend/node
npm install
```

### Environment Variables
Create a `.env` file in the root directory for the X-ray analyzer:
```
GOOGLE_API_KEY=your_gemini_api_key_here
```

## Running the Application Locally

### Prerequisites
Ensure all dependencies are installed (see [Dependencies](#dependencies) section above).

### 1. Set Up Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\Activate.ps1

# Activate on macOS/Linux
source venv/bin/activate
```

### 2. Install Python Dependencies

```bash
pip install librosa numpy opencv-python matplotlib pandas torch torchvision fastapi python-multipart uvicorn pillow python-dotenv google-generativeai
```

### 3. Start the Python Backend (FastAPI)

In a terminal (with virtual environment activated):

```bash
cd backend/python
uvicorn app:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### 4. Start the Node.js Backend (Express)

In a separate terminal:

```bash
cd backend/node
npm install  # if not already installed
npm start    # or node server.js
```

The server will run on `http://localhost:5000` (or the port specified in `server.js`)

### 5. Start the Frontend (React/Vite)

In a separate terminal:

```bash
cd frontend
npm install  # if not already installed
npm run dev
```

The dev server will launch at `http://localhost:5173` (or another available port)

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### 3-Terminal Setup

For optimal local development, keep all three servers running simultaneously:

| Terminal 1 | Terminal 2 | Terminal 3 |
|-----------|-----------|-----------|
| `cd backend/python` | `cd backend/node` | `cd frontend` |
| `uvicorn app:app --reload --port 8000` | `npm start` | `npm run dev` |
| FastAPI (http://localhost:8000) | Express (http://localhost:5000) | React (http://localhost:5173) |

### Troubleshooting

- **Port already in use**: Change the port number in the startup commands or kill the process using the port
- **Module not found errors**: Ensure virtual environment is activated and all pip packages are installed
- **CORS errors**: Check that the backend middleware allows requests from `http://localhost:5173`
- **API connection issues**: Verify the frontend is configured to hit `http://localhost:8000` or `http://localhost:5000` (depending on endpoint)

# Rebuilding the Full Spectrogram Dataset Locally

This repository includes the full pipeline used to convert `.wav` respiratory audio recordings into 128×128 Mel spectrograms with normalized metadata.  
Because GitHub limits large binary uploads, the spectrogram files are not stored in the repository.  
To generate **all spectrograms** (~5000+) on your own machine, follow the guide below.

## Prerequisites

### 1. Install Python Dependencies

Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\Activate.ps1

# Activate on macOS/Linux
source venv/bin/activate
```

Install the required packages:

```bash
pip install librosa numpy opencv-python matplotlib pandas
```

### 2. Download the Datasets

This project uses two respiratory sound datasets. You must download them separately:

#### Dataset 1: ICBHI 2017 Respiratory Sound Database
- **Source**: https://bhichallenge.med.auth.gr/
- **Contents**: 
  - `Respiratory_Sound_Database/audio_and_txt_files/` (WAV files)
  - `patient_diagnosis.csv` (diagnosis labels)
  - `demographic_info.txt` (age, sex, BMI)

#### Dataset 2: Lung Sound Database (Second Dataset)
- Download the Lung Sound Database with audio files
- **Expected directory**: `Data/Lung_Sound_Database/Audio Files/`

### 3. Organize Your Data Structure

Create the following directory structure in your project root:

```
notadoctor/
├── Data/
│   ├── 2017_Database/
│   │   ├── Respiratory_Sound_Database/
│   │   │   ├── Respiratory_Sound_Database/
│   │   │   │   ├── audio_and_txt_files/
│   │   │   │   │   ├── 101_1b1_Al_sc_Meditron.wav
│   │   │   │   │   ├── ... (more WAV files)
│   │   │   │   └── patient_diagnosis.csv
│   │   │   └── demographic_info.txt
│   │   └── demographic_info.txt
│   └── Lung_Sound_Database/
│       └── Audio Files/
│           ├── audio_file_1.wav
│           ├── ... (more WAV files)
├── convert_wav.py
└── README.md
```

## Generate All Spectrograms

This project uses a two-step pipeline to generate the complete spectrogram dataset:

### Step 1: Generate Original Spectrograms

Run the base conversion script:

```bash
python convert_wav.py
```

This creates ~1000 original spectrograms from the raw WAV files and merges all metadata:
- Patient/Recording ID
- Age
- Gender/Sex
- Diagnosis

**Output format**: `{ID}_{Age}_{Gender}_{Diagnosis}.png`

### Step 2: Generate Augmented Spectrograms

Run the augmentation script:

```bash
python augment_audio.py
```

This applies 4 audio augmentation techniques to each original audio file and creates additional spectrograms:
- **White noise**: Adds random noise to simulate background noise
- **Time shift**: Randomly shifts the audio in time
- **Pitch shift**: Randomly changes the pitch by ±3 semitones
- **Time stretch**: Randomly stretches/compresses the audio tempo

**Output format**: `{ID}_{Age}_{Gender}_{Diagnosis}_{augmentation_type}.png`

**Example augmented filenames:**
```
101_45_M_COPD_noise.png
101_45_M_COPD_timeshift.png
101_45_M_COPD_pitchshift.png
101_45_M_COPD_timestretch.png
```

### Total Dataset Size

- **Original spectrograms**: ~1000
- **Augmented spectrograms**: ~4000 (1000 original × 4 augmentation techniques)
- **Total**: ~5000+ spectrograms

The augmented dataset is ideal for training more robust machine learning models with better generalization.

## Output Structure

```
spectrograms/
    # Original spectrograms
    101_45_M_COPD.png
    101_52_F_Healthy.png
    102_67_M_Asthma.png
    
    # Augmented versions (4 per original)
    101_45_M_COPD_noise.png
    101_45_M_COPD_timeshift.png
    101_45_M_COPD_pitchshift.png
    101_45_M_COPD_timestretch.png
    ...
    (5000+ total spectrograms)
```

## Expected Output

After running both scripts, you should see:
- A `spectrograms/` directory containing ~5000+ PNG files
- Console output from both `convert_wav.py` and `augment_audio.py`

**Example console output from convert_wav.py:**
```
Final dataset shape: (1000, 5)
      ID Age Gender      Diagnosis           filepath
0    101  45      M        COPD/Asthma  Data/...101_1b1...
1    102  67      F        Healthy      Data/...102_1b2...
...
```

**Example console output from augment_audio.py:**
```
Progress: 50/4000 augmented spectrograms saved
Progress: 100/4000 augmented spectrograms saved
...
Done. Generated 4000 augmented spectrograms from 1000 original samples.
```

## Troubleshooting

### Missing Data Files Error
- **Error**: `FileNotFoundError` for CSV or WAV files
- **Solution**: Double-check your `Data/` folder structure matches the paths in the script

### Demographic Data Not Found
- **Error**: Many rows with `Age=NaN` or `Gender=NaN`
- **Solution**: Ensure `demographic_info.txt` is in `Data/2017_Database/`

### Out of Memory
- The script processes files sequentially, so memory usage is low
- If you encounter issues, ensure at least 4GB RAM is available

### Missing Diagnosis Data
- Some patients may not have diagnosis data
- These will be labeled as "unknown" in the filename

## File Format Details

### Spectrogram Specifications
- **Size**: 128×128 pixels
- **Colormap**: Magma (perceptually uniform)
- **Normalization**: Power-to-dB conversion (log scale)

### Metadata Columns
- `ID`: Patient ID (int)
- `Age`: Patient age in years (int or float)
- `Gender`: M (Male), F (Female), or unknown
- `Diagnosis`: Disease classification or Healthy
- `filepath`: Original WAV file path

## Notes

- **Two-step pipeline**: Run `convert_wav.py` first, then `augment_audio.py` to generate the full 5000+ spectrogram dataset
- **Large dataset**: The full spectrogram dataset (~5000+ images) is not stored on GitHub due to size constraints
- **Data augmentation**: The augmentation script creates 4 variations of each original spectrogram for better ML model training
- **Reproducibility**: Running both scripts ensures every user can reproduce the exact same dataset
- **Metadata normalization**: All filenames follow a consistent format for easy integration with ML pipelines
- **Relative paths**: The scripts use relative paths, so they work on any machine with the same directory structure
- **Processing time**: Generating all original spectrograms takes ~10-30 minutes; augmentation adds another ~20-60 minutes depending on your hardware

