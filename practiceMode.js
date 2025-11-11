class PracticeMode {
    constructor(scoreRenderer, pitchDetector) {
        this.scoreRenderer = scoreRenderer;
        this.pitchDetector = pitchDetector;
        this.currentChord = null;
        this.detectedNotes = new Set();
        this.isActive = false;
        this.checkInterval = null;

        // Common piano chords with different inversions
        this.chordDatabase = {
            'C Major': [
                { name: 'C', octave: 4 },
                { name: 'E', octave: 4 },
                { name: 'G', octave: 4 }
            ],
            'D Minor': [
                { name: 'D', octave: 4 },
                { name: 'F', octave: 4 },
                { name: 'A', octave: 4 }
            ],
            'E Minor': [
                { name: 'E', octave: 4 },
                { name: 'G', octave: 4 },
                { name: 'B', octave: 4 }
            ],
            'F Major': [
                { name: 'F', octave: 4 },
                { name: 'A', octave: 4 },
                { name: 'C', octave: 5 }
            ],
            'G Major': [
                { name: 'G', octave: 4 },
                { name: 'B', octave: 4 },
                { name: 'D', octave: 5 }
            ],
            'A Minor': [
                { name: 'A', octave: 4 },
                { name: 'C', octave: 5 },
                { name: 'E', octave: 5 }
            ],
            'B Diminished': [
                { name: 'B', octave: 4 },
                { name: 'D', octave: 5 },
                { name: 'F', octave: 5 }
            ],
            'C7': [
                { name: 'C', octave: 4 },
                { name: 'E', octave: 4 },
                { name: 'G', octave: 4 },
                { name: 'A#', octave: 4 }
            ],
            'Am7': [
                { name: 'A', octave: 4 },
                { name: 'C', octave: 5 },
                { name: 'E', octave: 5 },
                { name: 'G', octave: 5 }
            ],
            'Dm7': [
                { name: 'D', octave: 4 },
                { name: 'F', octave: 4 },
                { name: 'A', octave: 4 },
                { name: 'C', octave: 5 }
            ]
        };
    }

    generateRandomChord() {
        const chordNames = Object.keys(this.chordDatabase);
        const randomIndex = Math.floor(Math.random() * chordNames.length);
        const chordName = chordNames[randomIndex];

        this.currentChord = {
            name: chordName,
            notes: this.chordDatabase[chordName]
        };

        this.detectedNotes.clear();
        return this.currentChord;
    }

    displayChord(chord) {
        // Render the chord on the score
        this.scoreRenderer.renderChord(chord);

        // Update the UI
        const targetChordDiv = document.getElementById('targetChord');
        const noteNames = chord.notes.map(n => `${n.name}${n.octave}`).join(', ');
        targetChordDiv.innerHTML = `
            <h4>${chord.name}</h4>
            <p>Play these notes: ${noteNames}</p>
        `;
    }

    checkNote(detectedNote) {
        if (!this.currentChord) return;

        // Normalize the detected note for comparison
        const normalizedNote = `${detectedNote.note}${detectedNote.octave}`;

        // Check if this note is part of the target chord
        const isCorrect = this.currentChord.notes.some(note =>
            note.name === detectedNote.note && note.octave === detectedNote.octave
        );

        if (isCorrect) {
            this.detectedNotes.add(normalizedNote);
            this.updateProgress();
        }
    }

    updateProgress() {
        const feedbackDiv = document.getElementById('feedback');
        const totalNotes = this.currentChord.notes.length;
        const detectedCount = this.detectedNotes.size;

        if (detectedCount === totalNotes) {
            // All notes detected
            feedbackDiv.className = 'feedback correct';
            feedbackDiv.textContent = `Perfect! You played all ${totalNotes} notes correctly!`;
            feedbackDiv.style.display = 'block';
        } else {
            // Partial progress
            feedbackDiv.className = 'feedback';
            feedbackDiv.style.background = '#ffa726';
            feedbackDiv.style.color = 'white';
            feedbackDiv.textContent = `Progress: ${detectedCount}/${totalNotes} notes detected`;
            feedbackDiv.style.display = 'block';
        }
    }

    reset() {
        this.detectedNotes.clear();
        const feedbackDiv = document.getElementById('feedback');
        feedbackDiv.style.display = 'none';
        feedbackDiv.textContent = '';
    }

    activate() {
        this.isActive = true;
        this.reset();
        const chord = this.generateRandomChord();
        this.displayChord(chord);
    }

    deactivate() {
        this.isActive = false;
        this.reset();
    }
}
