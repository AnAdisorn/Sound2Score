class PitchDetector {
    constructor() {
        // Piano key frequencies (A0 to C8)
        this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.A4_FREQUENCY = 440;
        this.MIN_FREQUENCY = 27.5; // A0
        this.MAX_FREQUENCY = 4186; // C8
    }

    // Autocorrelation pitch detection algorithm
    detectPitch(buffer, sampleRate) {
        if (!buffer || buffer.length === 0) return null;

        // Calculate RMS to check if there's enough signal
        const rms = this.calculateRMS(buffer);
        if (rms < 0.01) return null; // Too quiet

        const frequency = this.autoCorrelate(buffer, sampleRate);

        if (frequency && frequency >= this.MIN_FREQUENCY && frequency <= this.MAX_FREQUENCY) {
            const note = this.frequencyToNote(frequency);
            return {
                frequency: frequency,
                note: note.name,
                octave: note.octave,
                cents: note.cents,
                fullNote: `${note.name}${note.octave}`
            };
        }

        return null;
    }

    calculateRMS(buffer) {
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
            sum += buffer[i] * buffer[i];
        }
        return Math.sqrt(sum / buffer.length);
    }

    autoCorrelate(buffer, sampleRate) {
        const SIZE = buffer.length;
        const MAX_SAMPLES = Math.floor(SIZE / 2);
        let best_offset = -1;
        let best_correlation = 0;
        let rms = 0;
        let foundGoodCorrelation = false;

        // Calculate RMS
        for (let i = 0; i < SIZE; i++) {
            const val = buffer[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);

        if (rms < 0.01) return -1; // Not enough signal

        // Find the best correlation
        let lastCorrelation = 1;
        for (let offset = 1; offset < MAX_SAMPLES; offset++) {
            let correlation = 0;

            for (let i = 0; i < MAX_SAMPLES; i++) {
                correlation += Math.abs(buffer[i] - buffer[i + offset]);
            }

            correlation = 1 - (correlation / MAX_SAMPLES);

            if (correlation > 0.9 && correlation > lastCorrelation) {
                foundGoodCorrelation = true;
                if (correlation > best_correlation) {
                    best_correlation = correlation;
                    best_offset = offset;
                }
            }
            lastCorrelation = correlation;
        }

        if (foundGoodCorrelation && best_offset > 0) {
            const frequency = sampleRate / best_offset;
            return frequency;
        }

        return -1;
    }

    frequencyToNote(frequency) {
        const noteNum = 12 * (Math.log(frequency / this.A4_FREQUENCY) / Math.log(2));
        const noteIndex = Math.round(noteNum) + 69; // A4 is MIDI note 69

        const octave = Math.floor(noteIndex / 12) - 1;
        const noteName = this.noteNames[noteIndex % 12];

        // Calculate cents deviation from perfect pitch
        const cents = Math.floor((noteNum - Math.round(noteNum)) * 100);

        return {
            name: noteName,
            octave: octave,
            cents: cents,
            midiNote: noteIndex
        };
    }

    noteToFrequency(noteName, octave) {
        const noteIndex = this.noteNames.indexOf(noteName);
        if (noteIndex === -1) return null;

        const midiNote = (octave + 1) * 12 + noteIndex;
        const frequency = this.A4_FREQUENCY * Math.pow(2, (midiNote - 69) / 12);

        return frequency;
    }

    // Convert note to VexFlow format
    noteToVexFlow(noteName, octave) {
        // VexFlow uses lowercase for note names and adds accidentals
        let vexNote = noteName.toLowerCase();

        // Handle sharps (VexFlow uses 'n' for natural, '#' for sharp, 'b' for flat)
        if (noteName.includes('#')) {
            vexNote = noteName[0].toLowerCase() + '#';
        }

        return `${vexNote}/${octave}`;
    }
}
