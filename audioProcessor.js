class AudioProcessor {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.bufferLength = null;
        this.isListening = false;
    }

    async initialize() {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
                }
            });

            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 4096; // Larger FFT for better frequency resolution
            this.analyser.smoothingTimeConstant = 0.8;

            this.bufferLength = this.analyser.fftSize;
            this.dataArray = new Float32Array(this.bufferLength);

            // Connect microphone to analyser
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);

            this.isListening = true;
            return true;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please allow microphone access and try again.');
            return false;
        }
    }

    getTimeDomainData() {
        if (!this.analyser) return null;
        this.analyser.getFloatTimeDomainData(this.dataArray);
        return this.dataArray;
    }

    getFrequencyData() {
        if (!this.analyser) return null;
        const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(frequencyData);
        return frequencyData;
    }

    getSampleRate() {
        return this.audioContext ? this.audioContext.sampleRate : 44100;
    }

    stop() {
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.isListening = false;
    }
}
