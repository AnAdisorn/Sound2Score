class AudioProcessor {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.bufferLength = null;
        this.isListening = false;

        // Recording functionality
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.stream = null;
    }

    async initialize() {
        try {
            // Request microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({
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
            this.microphone = this.audioContext.createMediaStreamSource(this.stream);
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

    startRecording() {
        if (!this.stream) {
            console.error('No audio stream available. Please initialize first.');
            return false;
        }

        if (this.isRecording) {
            console.warn('Recording already in progress');
            return false;
        }

        try {
            // Reset audio chunks
            this.audioChunks = [];

            // Create MediaRecorder with the stream
            const options = { mimeType: 'audio/webm' };
            this.mediaRecorder = new MediaRecorder(this.stream, options);

            // Handle data available event
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            // Handle recording stop event
            this.mediaRecorder.onstop = () => {
                console.log('Recording stopped, chunks collected:', this.audioChunks.length);
            };

            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;
            console.log('Recording started');
            return true;
        } catch (error) {
            console.error('Error starting recording:', error);
            return false;
        }
    }

    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) {
            console.warn('No recording in progress');
            return null;
        }

        return new Promise((resolve) => {
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.isRecording = false;
                console.log('Recording stopped, blob size:', audioBlob.size, 'bytes');
                resolve(audioBlob);
            };

            this.mediaRecorder.stop();
        });
    }

    downloadRecording(audioBlob, filename = 'piano-sample.webm') {
        if (!audioBlob) {
            console.error('No audio blob to download');
            return;
        }

        // Create a download link
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        console.log('Download initiated:', filename);
    }
}
