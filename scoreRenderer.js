class ScoreRenderer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.renderer = null;
        this.context = null;
        this.detectedNotes = [];
        this.maxNotes = 16;
        this.currentStave = null;
        this.currentVoice = null;
        this.highlightedNoteIndex = -1;

        // Initialize VexFlow renderer
        this.initRenderer();
    }

    initRenderer() {
        try {
            console.log('[ScoreRenderer] Initializing renderer...');
            console.log('[ScoreRenderer] Vex available:', typeof Vex !== 'undefined');
            console.log('[ScoreRenderer] Vex.Flow available:', typeof Vex !== 'undefined' && typeof Vex.Flow !== 'undefined');

            if (typeof Vex === 'undefined' || typeof Vex.Flow === 'undefined') {
                console.error('[ScoreRenderer] VexFlow not loaded!');
                this.container.innerHTML = '<p style="color: red; padding: 20px;">Error: VexFlow library not loaded. Please refresh the page.</p>';
                return;
            }

            const { Renderer } = Vex.Flow;

            // Clear container
            this.container.innerHTML = '';

            // Create renderer
            console.log('[ScoreRenderer] Creating SVG renderer...');
            this.renderer = new Renderer(this.container, Renderer.Backends.SVG);
            this.renderer.resize(800, 300);
            this.context = this.renderer.getContext();
            this.context.setFont('Arial', 10);
            console.log('[ScoreRenderer] Renderer initialized successfully');
        } catch (error) {
            console.error('[ScoreRenderer] Error in initRenderer:', error);
            this.container.innerHTML = '<p style="color: red; padding: 20px;">Error initializing score renderer: ' + error.message + '</p>';
        }
    }

    initialize() {
        this.clear();
        this.renderEmptyStaff();
    }

    clear() {
        this.detectedNotes = [];
        this.initRenderer();
    }

    renderEmptyStaff() {
        try {
            const { Stave } = Vex.Flow;
            // Create treble clef staff
            const stave = new Stave(10, 40, 760);
            stave.addClef('treble').addTimeSignature('4/4');
            stave.setContext(this.context).draw();
        } catch (error) {
            console.error('Error rendering empty staff:', error);
        }
    }

    addDetectedNote(noteName, octave) {
        try {
            console.log(`[ScoreRenderer] Adding note: ${noteName}${octave}`);

            // Convert to VexFlow format
            const vexNote = this.convertToVexNote(noteName, octave);
            console.log(`[ScoreRenderer] Converted to VexFlow format: ${vexNote}`);

            // Add to detected notes array
            this.detectedNotes.push({
                keys: [vexNote],
                duration: 'q' // quarter note
            });

            // Keep only the last maxNotes
            if (this.detectedNotes.length > this.maxNotes) {
                this.detectedNotes.shift();
            }

            console.log(`[ScoreRenderer] Total notes: ${this.detectedNotes.length}`);
            this.render();
        } catch (error) {
            console.error('[ScoreRenderer] Error adding note:', error);
        }
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

        try {
            const { Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

            // Create treble clef staff
            const stave = new Stave(10, 40, 760);
            stave.addClef('treble').addTimeSignature('4/4');
            stave.setContext(this.context).draw();

            // Create notes
            const notes = this.detectedNotes.map((noteData, index) => {
                const staveNote = new StaveNote({
                    keys: noteData.keys,
                    duration: noteData.duration,
                    clef: 'treble'
                });

                // Add accidentals (sharps/flats) if needed
                noteData.keys.forEach((key, i) => {
                    if (key.includes('#')) {
                        staveNote.addModifier(new Accidental('#'), i);
                    } else if (key.includes('b')) {
                        staveNote.addModifier(new Accidental('b'), i);
                    }
                });

                // Highlight the most recent note
                if (index === this.detectedNotes.length - 1) {
                    staveNote.setStyle({ fillStyle: '#667eea', strokeStyle: '#667eea' });
                }

                return staveNote;
            });

            // Create voice and add notes
            const voice = new Voice({
                num_beats: this.detectedNotes.length,
                beat_value: 4
            });
            voice.setStrict(false);
            voice.addTickables(notes);

            // Format and draw
            const formatter = new Formatter();
            formatter.joinVoices([voice]).format([voice], 700);
            voice.draw(this.context, stave);
        } catch (error) {
            console.error('Error rendering notes:', error);
            this.renderEmptyStaff();
        }
    }

    renderChord(chord) {
        this.clear();

        try {
            const { Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

            // Create treble clef staff
            const stave = new Stave(10, 40, 760);
            stave.addClef('treble');
            stave.setContext(this.context).draw();

            // Convert chord notes to VexFlow format
            const chordKeys = chord.notes.map(note =>
                this.convertToVexNote(note.name, note.octave)
            );

            // Sort keys from lowest to highest (required by VexFlow)
            chordKeys.sort();

            // Create chord as a single stave note with multiple keys
            const chordNote = new StaveNote({
                keys: chordKeys,
                duration: 'w', // whole note
                clef: 'treble'
            });

            // Add accidentals if needed
            chord.notes.forEach((note, i) => {
                if (note.name.includes('#')) {
                    chordNote.addModifier(new Accidental('#'), i);
                } else if (note.name.includes('b')) {
                    chordNote.addModifier(new Accidental('b'), i);
                }
            });

            // Style the chord
            chordNote.setStyle({ fillStyle: '#764ba2', strokeStyle: '#764ba2' });

            // Create voice
            const voice = new Voice({ num_beats: 4, beat_value: 4 });
            voice.setStrict(false);
            voice.addTickables([chordNote]);

            // Format and draw
            const formatter = new Formatter();
            formatter.joinVoices([voice]).format([voice], 700);
            voice.draw(this.context, stave);

            return chordNote;
        } catch (error) {
            console.error('Error rendering chord:', error);
            this.renderEmptyStaff();
            return null;
        }
    }

    highlightMatchingNotes(matchedNotes) {
        // This would be used to show which notes in the target chord have been played correctly
        // For now, we'll use the feedback system in practice mode
    }
}
