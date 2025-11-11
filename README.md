# Sound2Score - Interactive Piano Practice Tool

An interactive web application that detects piano sounds in real-time and displays them as musical notation. Practice your piano skills with instant visual feedback!

**New:** Now powered by Python backend with advanced pitch detection using librosa and numpy for superior accuracy!

## Features

### 1. Free Play Mode
- Real-time pitch detection from your piano or keyboard
- Automatic conversion to musical notation
- Visual display of detected notes on a staff
- Frequency display in Hz
- Supports full piano range (A0 to C8)

### 2. Practice Mode
- Random chord generation for practice
- Visual chord display on musical staff
- Real-time feedback as you play
- Progress tracking (shows how many notes you've played correctly)
- Success notification when all notes are played
- 10 different chords including:
  - Major chords (C, F, G)
  - Minor chords (Dm, Em, Am)
  - Seventh chords (C7, Am7, Dm7)
  - Diminished chords (Bdim)

## Architecture

Sound2Score uses a **hybrid architecture**:
- **Python Backend**: Advanced pitch detection using librosa, numpy, and scipy
- **JavaScript Frontend**: Real-time audio capture and music notation rendering
- **Automatic Fallback**: Works without backend using JavaScript-only detection

## Installation & Setup

### Quick Start (Recommended)

**macOS/Linux:**
```bash
./start.sh
```

**Windows:**
```bash
cd backend
run.bat
# Then in another terminal:
python server.py
```

This will:
1. Install Python dependencies in a virtual environment
2. Start the Flask backend on port 5000
3. Start the frontend server on port 8000
4. Open your browser automatically

### Manual Setup

#### 1. Backend Setup (Python)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will run on `http://localhost:5000`

#### 2. Frontend Setup

In a new terminal:
```bash
python3 server.py
```

The frontend will run on `http://localhost:8000` and open automatically.

### Frontend-Only Mode

The app works without the Python backend using JavaScript fallback:

```bash
python3 server.py
```

The app will detect that the backend is unavailable and use JavaScript-based pitch detection.

## How to Use

### Getting Started

1. Start both backend and frontend servers (or just frontend for fallback mode)
2. Open your browser to `http://localhost:8000`
3. Click "Start Listening" button
4. Allow microphone access when prompted
5. Start playing your piano!

### Free Play Mode

1. Select "Free Play" mode (default)
2. Click "Start Listening"
3. Play notes on your piano
4. Watch as notes appear on the staff in real-time
5. The most recent note is highlighted in purple

### Practice Mode

1. Click "Practice Mode" button
2. Click "Start Listening"
3. A random chord will be displayed on the staff
4. Play all the notes in the chord
5. Watch your progress as notes are detected
6. When all notes are played correctly, you'll see a success message
7. Click "Next Chord" to generate a new challenge

## Technical Details

### Technologies Used

**Backend (Python):**
- **Flask** - REST API server
- **librosa** - Advanced audio analysis and pitch detection (PYIN algorithm)
- **numpy** - Numerical computations
- **scipy** - Signal processing
- **Flask-CORS** - Cross-origin resource sharing

**Frontend (JavaScript):**
- **Web Audio API** - Captures audio from microphone
- **VexFlow** - Renders musical notation
- **Custom Pitch Detection** - Autocorrelation algorithm (fallback)
- **Vanilla JavaScript** - No framework dependencies

### How It Works

**With Python Backend (Recommended):**
1. **Audio Capture**: Web Audio API captures microphone input
2. **Data Transfer**: JavaScript sends audio buffer to Python backend via REST API
3. **Advanced Processing**: Python uses librosa's PYIN algorithm for superior pitch detection
4. **Note Conversion**: Frequency mapped to musical notes (A4 = 440 Hz)
5. **Visualization**: Results sent back to frontend and rendered with VexFlow

**Fallback Mode (No Backend):**
1. **Audio Capture**: Web Audio API captures microphone input
2. **JavaScript Processing**: Autocorrelation algorithm in browser
3. **Note Conversion**: Basic frequency to note mapping
4. **Visualization**: Rendered with VexFlow

### Why Python Backend?

- **Better Accuracy**: Librosa's PYIN algorithm is more accurate than autocorrelation
- **Superior Signal Processing**: numpy and scipy provide professional-grade DSP
- **Confidence Scoring**: Backend provides confidence levels for detected pitches
- **Future Extensibility**: Easy to add advanced features like chord recognition, rhythm analysis

### Browser Requirements

- Modern browser with Web Audio API support
- Microphone access permission
- HTTPS connection (required for microphone access)

## Files Structure

```
Sound2Score/
├── backend/                    # Python backend
│   ├── app.py                 # Flask REST API server
│   ├── pitch_detector.py      # Advanced pitch detection (librosa)
│   ├── requirements.txt       # Python dependencies
│   ├── run.sh                 # Backend startup script (Unix)
│   └── run.bat                # Backend startup script (Windows)
├── index.html                 # Main HTML file
├── styles.css                 # Styling and layout
├── app.js                     # Main application controller
├── audioProcessor.js          # Web Audio API handling
├── apiClient.js               # Backend API communication
├── pitchDetection.js          # Pitch detection (fallback)
├── scoreRenderer.js           # VexFlow integration
├── practiceMode.js            # Practice mode logic
├── server.py                  # Frontend development server
├── start.sh                   # Quick start script
└── README.md                  # This file
```

## Tips for Best Results

1. **Microphone Placement**: Position your microphone close to the piano for better detection
2. **Reduce Background Noise**: Minimize ambient noise for more accurate pitch detection
3. **Play Clearly**: Play notes distinctly and hold them for at least 0.3 seconds
4. **Acoustic Pianos**: Works best with acoustic pianos or good quality digital pianos
5. **One Note at a Time (Free Play)**: For best results in free play mode, play one note at a time
6. **Chord Practice**: In practice mode, you can play chord notes together or one at a time

## Future Enhancements

Potential features for future development:

- [ ] Record and playback functionality
- [ ] Custom chord creation
- [ ] Difficulty levels (beginner, intermediate, advanced)
- [ ] Score export to PDF or MIDI
- [ ] Support for bass clef
- [ ] Rhythm detection and timing feedback
- [ ] Multi-voice support
- [ ] Progress tracking and statistics
- [ ] Custom practice exercises
- [ ] Integration with MIDI keyboards

## Troubleshooting

### Microphone Not Working
- Ensure microphone permissions are granted
- Check if your browser supports Web Audio API
- Try using HTTPS (required for microphone access)

### Notes Not Detected
- Check microphone volume levels
- Reduce background noise
- Ensure you're playing within the supported range (A0-C8)
- Hold notes longer (at least 0.3 seconds)

### Incorrect Notes Detected
- Adjust microphone sensitivity
- Move microphone closer to sound source
- Play notes more distinctly
- Check for ambient noise interference

## Credits

Built with:
- [VexFlow](https://github.com/0xfe/vexflow) - Music notation rendering
- Web Audio API - Audio processing
- Custom autocorrelation algorithm for pitch detection

## License

This project is open source and available for educational purposes.
