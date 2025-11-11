"""
Advanced pitch detection using Python numerical libraries
"""
import numpy as np
import librosa
from scipy import signal


class PitchDetector:
    def __init__(self):
        self.A4_FREQUENCY = 440.0
        self.MIN_FREQUENCY = 27.5  # A0
        self.MAX_FREQUENCY = 4186.0  # C8
        self.note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    def detect_pitch(self, audio_data, sample_rate):
        """
        Detect pitch using multiple methods for better accuracy

        Args:
            audio_data: numpy array of audio samples
            sample_rate: sample rate of audio

        Returns:
            dict with frequency, note, octave, confidence
        """
        # Convert to numpy array if needed
        audio_data = np.array(audio_data, dtype=np.float32)

        # Check if signal is strong enough
        rms = np.sqrt(np.mean(audio_data**2))
        if rms < 0.01:
            return None

        # Method 1: YIN algorithm (via librosa's pyin)
        try:
            f0, voiced_flag, voiced_probs = librosa.pyin(
                audio_data,
                fmin=self.MIN_FREQUENCY,
                fmax=self.MAX_FREQUENCY,
                sr=sample_rate,
                frame_length=2048
            )

            # Get the most confident pitch
            if f0 is not None and len(f0) > 0:
                # Filter out NaN values
                valid_f0 = f0[~np.isnan(f0)]
                valid_probs = voiced_probs[~np.isnan(f0)]

                if len(valid_f0) > 0:
                    # Use the pitch with highest confidence
                    best_idx = np.argmax(valid_probs)
                    frequency = valid_f0[best_idx]
                    confidence = valid_probs[best_idx]

                    if frequency >= self.MIN_FREQUENCY and frequency <= self.MAX_FREQUENCY:
                        note_info = self.frequency_to_note(frequency)
                        note_info['confidence'] = float(confidence)
                        return note_info
        except Exception as e:
            print(f"PYIN failed: {e}, falling back to autocorrelation")

        # Method 2: Autocorrelation fallback
        frequency = self.autocorrelation_detect(audio_data, sample_rate)
        if frequency and frequency >= self.MIN_FREQUENCY and frequency <= self.MAX_FREQUENCY:
            note_info = self.frequency_to_note(frequency)
            note_info['confidence'] = 0.7  # Lower confidence for autocorrelation
            return note_info

        return None

    def autocorrelation_detect(self, audio_data, sample_rate):
        """
        Autocorrelation pitch detection (fallback method)
        """
        # Apply window to reduce edge effects
        windowed = audio_data * np.hanning(len(audio_data))

        # Compute autocorrelation
        correlation = np.correlate(windowed, windowed, mode='full')
        correlation = correlation[len(correlation)//2:]

        # Find the first peak after the zero lag
        # This corresponds to the fundamental frequency
        min_lag = int(sample_rate / self.MAX_FREQUENCY)
        max_lag = int(sample_rate / self.MIN_FREQUENCY)

        if max_lag >= len(correlation):
            max_lag = len(correlation) - 1

        # Find peaks in the valid range
        peaks, properties = signal.find_peaks(
            correlation[min_lag:max_lag],
            height=0.3 * np.max(correlation)
        )

        if len(peaks) > 0:
            # Get the first peak (fundamental frequency)
            best_peak = peaks[0] + min_lag
            frequency = sample_rate / best_peak
            return frequency

        return None

    def frequency_to_note(self, frequency):
        """
        Convert frequency to musical note

        Returns:
            dict with note name, octave, cents deviation, and MIDI number
        """
        # Calculate MIDI note number
        note_num = 12 * np.log2(frequency / self.A4_FREQUENCY) + 69
        midi_note = int(np.round(note_num))

        # Calculate octave and note name
        octave = (midi_note // 12) - 1
        note_index = midi_note % 12
        note_name = self.note_names[note_index]

        # Calculate cents deviation from perfect pitch
        cents = int((note_num - midi_note) * 100)

        return {
            'frequency': float(frequency),
            'note': note_name,
            'octave': int(octave),
            'fullNote': f"{note_name}{octave}",
            'cents': cents,
            'midiNote': int(midi_note)
        }

    def note_to_frequency(self, note_name, octave):
        """
        Convert note name and octave to frequency
        """
        note_index = self.note_names.index(note_name)
        midi_note = (octave + 1) * 12 + note_index
        frequency = self.A4_FREQUENCY * (2 ** ((midi_note - 69) / 12))
        return frequency
