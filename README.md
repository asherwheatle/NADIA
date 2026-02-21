# notadoctor

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

Once your data is organized, run the conversion script:

```bash
python convert_wav.py
```

### What the Script Does

1. **Loads all WAV files** from both datasets
2. **Generates 128×128 Mel spectrograms** using:
   - Sample rate: 16kHz
   - FFT size: 1024
   - Hop length: 256
   - Mel bands: 128
3. **Merges metadata** from multiple sources:
   - Patient/Recording ID
   - Age
   - Gender/Sex
   - Diagnosis
4. **Saves spectrograms** to `spectrograms/` folder with normalized filenames

### Output Format

Spectrograms are saved with the following filename structure:

```
{ID}_{Age}_{Gender}_{Diagnosis}.png
```

**Example filenames:**
```
101_45_M_COPD.png
102_67_F_Healthy.png
103_52_M_Asthma.png
```

This normalized naming convention makes it easy to:
- Identify patient metadata from filenames
- Organize and filter spectrograms by demographics and diagnosis
- Use filenames directly for machine learning labels

## Output Structure

```
spectrograms/
    101_45_M_COPD.png
    101_52_F_Healthy.png
    102_67_M_Asthma.png
    ...
    (5000+ total spectrograms)
```

## Expected Output

After successful execution, you should see:
- A `spectrograms/` directory containing ~5000+ PNG files
- Console output showing the final dataset shape and preview

**Example console output:**
```
Final dataset shape: (5000+, 5)
      ID Age Gender      Diagnosis           filepath
0    101  45      M        COPD/Asthma  Data/...101_1b1...
1    102  67      F        Healthy      Data/...102_1b2...
...
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

- **Large dataset**: The full spectrogram dataset (~5000+ images) is not stored on GitHub due to size constraints
- **Reproducibility**: Running `convert_wav.py` ensures every user can reproduce the exact same dataset
- **Metadata normalization**: All filenames follow a consistent format for easy integration with ML pipelines
- **Relative paths**: The script uses relative paths, so it works on any machine with the same directory structure
- **Processing time**: Generating all spectrograms typically takes 10-30 minutes depending on your hardware

