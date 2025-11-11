# Sound2Score - Interactive Piano Practice Tool

An interactive web application that detects piano sounds in real-time and displays them as musical notation. Practice your piano skills with instant visual feedback!

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

## How to Use

### Getting Started

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, or Safari)
2. Click "Start Listening" button
3. Allow microphone access when prompted
4. Start playing your piano!

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

- **Web Audio API** - Captures audio from microphone
- **VexFlow** - Renders musical notation
- **Custom Pitch Detection** - Autocorrelation algorithm for pitch detection
- **Vanilla JavaScript** - No framework dependencies

### How It Works

1. **Audio Capture**: Uses Web Audio API to access microphone input
2. **Signal Processing**: Analyzes time-domain audio data using FFT (Fast Fourier Transform)
3. **Pitch Detection**: Implements autocorrelation algorithm to identify fundamental frequency
4. **Note Conversion**: Maps frequency to musical notes using equal temperament tuning (A4 = 440 Hz)
5. **Visualization**: Renders notes on staff using VexFlow library

### Browser Requirements

- Modern browser with Web Audio API support
- Microphone access permission
- HTTPS connection (required for microphone access)

## Files Structure

```
Sound2Score/
├── index.html          # Main HTML file
├── styles.css          # Styling and layout
├── app.js              # Main application controller
├── audioProcessor.js   # Web Audio API handling
├── pitchDetection.js   # Pitch detection algorithm
├── scoreRenderer.js    # VexFlow integration
└── practiceMode.js     # Practice mode logic
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
