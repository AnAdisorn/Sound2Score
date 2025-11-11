/**
 * API Client for communicating with Python backend
 */
class APIClient {
    constructor(baseURL = 'http://localhost:5000') {
        this.baseURL = baseURL;
        this.isOnline = false;
        this.checkConnection();
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.isOnline = true;
                console.log('✓ Connected to Python backend');
                return true;
            }
        } catch (error) {
            this.isOnline = false;
            console.warn('⚠ Python backend not available, using fallback JavaScript detection');
            return false;
        }
    }

    async detectPitch(audioData, sampleRate) {
        if (!this.isOnline) {
            await this.checkConnection();
            if (!this.isOnline) {
                return null; // Will trigger fallback
            }
        }

        try {
            // Convert Float32Array to regular array for JSON
            const audioArray = Array.from(audioData);

            const response = await fetch(`${this.baseURL}/api/detect-pitch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    audioData: audioArray,
                    sampleRate: sampleRate
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.pitch) {
                return result.pitch;
            }

            return null;
        } catch (error) {
            console.error('Error calling backend API:', error);
            this.isOnline = false;
            return null; // Will trigger fallback
        }
    }

    async analyzeChord(frequencies) {
        if (!this.isOnline) {
            return null;
        }

        try {
            const response = await fetch(`${this.baseURL}/api/analyze-chord`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    frequencies: frequencies
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.notes || null;
        } catch (error) {
            console.error('Error analyzing chord:', error);
            return null;
        }
    }

    async noteToFrequency(note, octave) {
        if (!this.isOnline) {
            return null;
        }

        try {
            const response = await fetch(`${this.baseURL}/api/note-to-frequency`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    note: note,
                    octave: octave
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.frequency || null;
        } catch (error) {
            console.error('Error converting note to frequency:', error);
            return null;
        }
    }

    getStatus() {
        return {
            online: this.isOnline,
            backend: this.isOnline ? 'Python (Advanced)' : 'JavaScript (Fallback)'
        };
    }
}
