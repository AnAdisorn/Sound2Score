// Main application controller
class Sound2ScoreApp {
    constructor() {
        this.audioProcessor = new AudioProcessor();
        this.pitchDetector = new PitchDetector();
        this.scoreRenderer = new ScoreRenderer('scoreContainer');
        this.practiceMode = new PracticeMode(this.scoreRenderer, this.pitchDetector);

        this.isListening = false;
        this.animationFrameId = null;
        this.currentMode = 'freePlay'; // 'freePlay' or 'practice'
        this.lastDetectedNote = null;
        this.noteDebounceTime = 300; // ms
        this.lastNoteTime = 0;

        this.initializeUI();
    }

    initializeUI() {
        // Initialize score renderer
        this.scoreRenderer.initialize();

        // Button event listeners
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());

        // Mode selector
        document.getElementById('freePlayBtn').addEventListener('click', () => this.switchMode('freePlay'));
        document.getElementById('practiceBtn').addEventListener('click', () => this.switchMode('practice'));

        // Practice mode buttons
        document.getElementById('nextChordBtn').addEventListener('click', () => this.nextChord());
    }

    async start() {
        const success = await this.audioProcessor.initialize();

        if (success) {
            this.isListening = true;
            this.updateStatus('Listening... Play some notes!', '#4caf50');

            // Update button states
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;

            // Start detection loop
            this.detectLoop();
        }
    }

    stop() {
        this.isListening = false;
        this.audioProcessor.stop();

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.updateStatus('Stopped', '#999');

        // Update button states
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;

        // Clear display
        document.getElementById('currentNote').textContent = '-';
        document.getElementById('frequency').textContent = '-';
    }

    detectLoop() {
        if (!this.isListening) return;

        const buffer = this.audioProcessor.getTimeDomainData();
        const sampleRate = this.audioProcessor.getSampleRate();

        if (buffer) {
            const pitchData = this.pitchDetector.detectPitch(buffer, sampleRate);

            if (pitchData) {
                this.handleDetectedPitch(pitchData);
            } else {
                // No pitch detected
                document.getElementById('currentNote').textContent = '-';
                document.getElementById('frequency').textContent = '-';
            }
        }

        // Continue loop
        this.animationFrameId = requestAnimationFrame(() => this.detectLoop());
    }

    handleDetectedPitch(pitchData) {
        // Update display
        document.getElementById('currentNote').textContent = pitchData.fullNote;
        document.getElementById('frequency').textContent = pitchData.frequency.toFixed(2);

        // Debounce note detection to avoid adding the same note multiple times
        const currentTime = Date.now();
        const noteChanged = this.lastDetectedNote !== pitchData.fullNote;

        if (noteChanged || (currentTime - this.lastNoteTime) > this.noteDebounceTime) {
            this.lastDetectedNote = pitchData.fullNote;
            this.lastNoteTime = currentTime;

            if (this.currentMode === 'freePlay') {
                // Add note to score in free play mode
                this.scoreRenderer.addDetectedNote(pitchData.note, pitchData.octave);
            } else if (this.currentMode === 'practice') {
                // Check note in practice mode
                this.practiceMode.checkNote(pitchData);
            }
        }
    }

    switchMode(mode) {
        this.currentMode = mode;

        // Update button styles
        const freePlayBtn = document.getElementById('freePlayBtn');
        const practiceBtn = document.getElementById('practiceBtn');

        if (mode === 'freePlay') {
            freePlayBtn.classList.add('active');
            practiceBtn.classList.remove('active');

            // Hide practice mode UI
            document.getElementById('practiceMode').style.display = 'none';

            // Reset and show score
            this.scoreRenderer.initialize();
            this.practiceMode.deactivate();
        } else {
            practiceBtn.classList.add('active');
            freePlayBtn.classList.remove('active');

            // Show practice mode UI
            document.getElementById('practiceMode').style.display = 'block';

            // Activate practice mode
            this.practiceMode.activate();
        }
    }

    nextChord() {
        this.practiceMode.reset();
        const chord = this.practiceMode.generateRandomChord();
        this.practiceMode.displayChord(chord);
    }

    updateStatus(message, color) {
        const statusText = document.getElementById('statusText');
        statusText.textContent = message;
        statusText.style.color = color;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new Sound2ScoreApp();
    console.log('Sound2Score initialized successfully!');
});
