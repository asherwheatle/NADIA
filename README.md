# notadoctor

# Rebuilding the Full Spectrogram Dataset Locally

This repository includes the full pipeline used to convert `.wav` respiratory audio recordings into 128×128 Mel spectrograms.  
Because GitHub limits large binary uploads, only a subset of PNG spectrograms is stored in the repository.  
To generate **all spectrograms (1,256 total)** on your own machine, run the script below.

## Requirements

Install the required Python packages:

```bash
pip install librosa numpy opencv-python matplotlib pandas
```

## Generate All Spectrograms

Run the conversion script:

```bash
python convert_wav.py
```

This script will:

- Load all `.wav` files from both datasets  
- Generate 128×128 Mel spectrograms  
- Save them into the `spectrograms/` directory  
- Build a unified metadata table containing:
  - PatientID  
  - Diagnosis  
  - Recording metadata (location, equipment, acquisition mode)  
  - Demographics (Age, Sex, Adult BMI)  
  - Second‑dataset metadata (sound type, location, age, gender)

After running the script, you will have the complete spectrogram dataset locally.

## Output Structure

```
spectrograms/
    101_1b1_Al_sc_Meditron.png
    101_1b1_Ar_mc_LittC2SE.png
    ...
metadata.csv
```

## Notes

- The full dataset is not stored on GitHub due to file size limits.  
- Running `convert_wav.py` ensures every user can reproduce the complete dataset.  
- All metadata is automatically merged and included in the final output.

