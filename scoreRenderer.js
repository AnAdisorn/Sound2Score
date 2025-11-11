class ScoreRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.vf = new Vex.Flow.Factory({
            renderer: { elementId: containerId, width: 800, height: 300 }
        });
        this.context = this.vf.context;
        this.detectedNotes = [];
        this.maxNotes = 16;
        this.currentStave = null;
        this.currentVoice = null;
        this.highlightedNoteIndex = -1;
    }

    initialize() {
        this.clear();
        this.renderEmptyStaff();
    }

    clear() {
        this.container.innerHTML = '';
        this.vf = new Vex.Flow.Factory({
            renderer: { elementId: this.container.id, width: 800, height: 300 }
        });
        this.context = this.vf.context;
        this.detectedNotes = [];
    }

    renderEmptyStaff() {
        // Create treble clef staff
        const stave = new Vex.Flow.Stave(10, 40, 760);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(this.context).draw();
    }

    addDetectedNote(noteName, octave) {
        // Convert to VexFlow format
        const vexNote = this.convertToVexNote(noteName, octave);

        // Add to detected notes array
        this.detectedNotes.push({
            keys: [vexNote],
            duration: 'q' // quarter note
        });

        // Keep only the last maxNotes
        if (this.detectedNotes.length > this.maxNotes) {
            this.detectedNotes.shift();
        }

        this.render();
    }

    convertToVexNote(noteName, octave) {
        let note = noteName.toLowerCase();

        // Handle sharps and flats
        if (noteName.includes('#')) {
            note = noteName[0].toLowerCase() + '#';
        } else if (noteName.includes('b')) {
            note = noteName[0].toLowerCase() + 'b';
        }

        return `${note}/${octave}`;
    }

    render() {
        this.clear();

        if (this.detectedNotes.length === 0) {
            this.renderEmptyStaff();
            return;
        }

        // Create treble clef staff
        const stave = new Vex.Flow.Stave(10, 40, 760);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(this.context).draw();

        // Create notes
        const notes = this.detectedNotes.map((noteData, index) => {
            const staveNote = new Vex.Flow.StaveNote({
                keys: noteData.keys,
                duration: noteData.duration,
                clef: 'treble'
            });

            // Add accidentals (sharps/flats) if needed
            noteData.keys.forEach((key, i) => {
                if (key.includes('#')) {
                    staveNote.addModifier(new Vex.Flow.Accidental('#'), i);
                } else if (key.includes('b')) {
                    staveNote.addModifier(new Vex.Flow.Accidental('b'), i);
                }
            });

            // Highlight the most recent note
            if (index === this.detectedNotes.length - 1) {
                staveNote.setStyle({ fillStyle: '#667eea', strokeStyle: '#667eea' });
            }

            return staveNote;
        });

        // Create voice and add notes
        const voice = new Vex.Flow.Voice({
            num_beats: this.detectedNotes.length,
            beat_value: 4
        });
        voice.setStrict(false);
        voice.addTickables(notes);

        // Format and draw
        const formatter = new Vex.Flow.Formatter();
        formatter.joinVoices([voice]).format([voice], 700);
        voice.draw(this.context, stave);
    }

    renderChord(chord) {
        this.clear();

        // Create treble clef staff
        const stave = new Vex.Flow.Stave(10, 40, 760);
        stave.addClef('treble');
        stave.setContext(this.context).draw();

        // Convert chord notes to VexFlow format
        const chordKeys = chord.notes.map(note =>
            this.convertToVexNote(note.name, note.octave)
        );

        // Create chord as a single stave note with multiple keys
        const chordNote = new Vex.Flow.StaveNote({
            keys: chordKeys,
            duration: 'w', // whole note
            clef: 'treble'
        });

        // Add accidentals if needed
        chord.notes.forEach((note, i) => {
            if (note.name.includes('#')) {
                chordNote.addModifier(new Vex.Flow.Accidental('#'), i);
            } else if (note.name.includes('b')) {
                chordNote.addModifier(new Vex.Flow.Accidental('b'), i);
            }
        });

        // Style the chord
        chordNote.setStyle({ fillStyle: '#764ba2', strokeStyle: '#764ba2' });

        // Create voice
        const voice = new Vex.Flow.Voice({ num_beats: 4, beat_value: 4 });
        voice.setStrict(false);
        voice.addTickables([chordNote]);

        // Format and draw
        const formatter = new Vex.Flow.Formatter();
        formatter.joinVoices([voice]).format([voice], 700);
        voice.draw(this.context, stave);

        return chordNote;
    }

    highlightMatchingNotes(matchedNotes) {
        // This would be used to show which notes in the target chord have been played correctly
        // For now, we'll use the feedback system in practice mode
    }
}
