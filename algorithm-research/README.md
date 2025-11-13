# Pitch Detection Algorithm Research

This folder contains research, experiments, and audio samples for developing and improving pitch detection algorithms for Sound2Score.

## Folder Structure

```
algorithm-research/
├── samples/                   # Audio recordings
│   ├── piano/                 # General piano recordings
│   ├── chords/                # Chord recordings
│   └── single-notes/          # Individual note recordings
├── experiments/               # Python scripts for testing algorithms
├── notebooks/                 # Jupyter notebooks for analysis
├── results/                   # Analysis results and visualizations
└── README.md                  # This file
```

## Getting Started

### 1. Recording Audio Samples

Use the Sound2Score app to record audio samples:
1. Open the app at http://localhost:8080
2. Click "Start Listening"
3. Click "Start Recording"
4. Play piano notes/chords
5. Click "Stop Recording" to download the .webm file
6. Move downloaded files to the appropriate `samples/` subfolder

### 2. Setting Up Development Environment

```bash
cd algorithm-research
pip install -r requirements.txt
```

### 3. Running Experiments

#### Option A: Jupyter Notebook (Recommended)
```bash
jupyter notebook notebooks/pitch_analysis.ipynb
```

#### Option B: Python Scripts
```bash
python experiments/autocorrelation_test.py
```

## Algorithm Approaches to Explore

### Current Implementations
- **JavaScript (Frontend)**: Basic autocorrelation method
- **Python (Backend)**: YIN algorithm with spectral analysis

### Ideas to Test
1. **Time-Domain Methods**
   - Autocorrelation
   - Average Magnitude Difference Function (AMDF)
   - YIN algorithm improvements

2. **Frequency-Domain Methods**
   - FFT with harmonic product spectrum
   - Cepstrum analysis
   - Maximum likelihood estimation

3. **Hybrid Approaches**
   - Combine time and frequency domain
   - Machine learning models (if dataset is large enough)

4. **Polyphonic Detection**
   - Multiple pitch detection for chords
   - Harmonic analysis

## Performance Metrics

Track these metrics for each algorithm:
- **Accuracy**: How often the correct note is detected
- **Speed**: Processing time per sample
- **Robustness**: Performance with noise/harmonics
- **Latency**: Real-time feasibility

## Notes and Findings

Document your findings here as you experiment:

### [Date] - Initial Setup
- Created folder structure
- Ready to collect samples and test algorithms

---

## Resources

- [YIN Algorithm Paper](https://asa.scitation.org/doi/10.1121/1.1458024)
- [FFT Pitch Detection](https://en.wikipedia.org/wiki/Pitch_detection_algorithm)
- [librosa Documentation](https://librosa.org/)
- [aubio Documentation](https://aubio.org/)
