# Sound2Score Quick Start Guide

## What You've Built

A **hybrid web application** that uses:
- **Python Backend** (Flask + librosa) for advanced pitch detection
- **JavaScript Frontend** for real-time audio capture and visualization
- **Automatic fallback** if backend is unavailable

## Running the Application

### Option 1: Full Stack (Recommended)

Run both backend and frontend for best pitch detection accuracy:

```bash
# Quick start (macOS/Linux)
./start.sh

# Or manually:
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python app.py

# Terminal 2 - Frontend
python3 server.py
```

Then open: http://localhost:8000

### Option 2: Frontend Only

Run without Python backend (uses JavaScript fallback):

```bash
python3 server.py
```

The app automatically detects if the backend is unavailable and uses JavaScript pitch detection instead.

## How It Works

### With Python Backend (Recommended)

```
Microphone → Web Audio API → JavaScript captures audio
                                     ↓
                              Sends to Python backend
                                     ↓
                   librosa PYIN algorithm (advanced)
                                     ↓
                              Returns pitch data
                                     ↓
                       VexFlow renders notation
```

**Advantages:**
- More accurate pitch detection
- Better handling of complex sounds
- Confidence scoring
- Professional-grade signal processing

### Without Backend (Fallback)

```
Microphone → Web Audio API → JavaScript autocorrelation
                                     ↓
                              Basic pitch detection
                                     ↓
                       VexFlow renders notation
```

**Advantages:**
- No Python installation needed
- Works on GitHub Pages
- Simpler deployment

## Testing

### Test the Backend

```bash
cd backend
source venv/bin/activate
python test_backend.py
```

You should see:
```
✓ Detected frequency: 440.00 Hz
✓ Detected note: A4
✓ Test PASSED: Frequency detection is accurate!
```

### Test the Full Application

1. Start both servers
2. Open browser console (F12)
3. Look for:
   - `🚀 Using Python backend for pitch detection` (backend available)
   - `📱 Using JavaScript fallback for pitch detection` (no backend)

## API Endpoints

The Python backend provides these REST API endpoints:

- `GET /api/health` - Check if backend is running
- `POST /api/detect-pitch` - Detect pitch from audio data
- `POST /api/analyze-chord` - Analyze multiple frequencies
- `POST /api/note-to-frequency` - Convert note to frequency

Example API call:
```javascript
const response = await fetch('http://localhost:5000/api/detect-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        audioData: [/* Float32Array */],
        sampleRate: 44100
    })
});
const result = await response.json();
// { success: true, pitch: { frequency: 440, note: 'A', octave: 4, ... } }
```

## Deployment Options

### 1. Local Development (Current Setup)
- Backend: localhost:5000
- Frontend: localhost:8000
- Best for development and testing

### 2. GitHub Pages (Frontend Only)
- Already deployed at: https://anadisorn.github.io/Sound2Score/
- Uses JavaScript fallback
- No Python backend needed

### 3. Full Production Deployment

**Backend Options:**
- **Heroku**: Free tier available
- **Railway**: Easy Python deployment
- **Render**: Free tier with auto-deploy from GitHub
- **Google Cloud Run**: Pay as you go

**Frontend:**
- Continue using GitHub Pages
- Update `apiClient.js` to point to production backend URL

Example for production:
```javascript
// In apiClient.js
constructor(baseURL = 'https://your-backend.herokuapp.com') {
    this.baseURL = baseURL;
    // ...
}
```

## Performance Comparison

| Feature | Python Backend | JavaScript Fallback |
|---------|---------------|---------------------|
| Accuracy | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Speed | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Complexity | Higher | Lower |
| Setup | Requires Python | Browser only |
| Deployment | Need server | Static hosting |
| Confidence Score | ✓ | ✗ |

## Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend can't connect to backend
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Check CORS is enabled (already configured in app.py)
3. Check firewall settings

### Poor pitch detection
1. Ensure backend is running (check browser console)
2. Position microphone closer to piano
3. Reduce background noise
4. Play notes clearly and hold them

## Next Steps

Now that you have the hybrid architecture working:

1. **Deploy the backend** to Heroku/Railway/Render
2. **Update apiClient.js** with production backend URL
3. **Add more features**:
   - Chord recognition
   - Rhythm detection
   - Recording and playback
   - MIDI keyboard support
   - Progress tracking

## Resources

- Flask documentation: https://flask.palletsprojects.com/
- librosa documentation: https://librosa.org/
- VexFlow documentation: https://github.com/0xfe/vexflow
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
