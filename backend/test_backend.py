"""
Quick test script for the backend
"""
import numpy as np
from pitch_detector import PitchDetector

def test_pitch_detection():
    print("Testing pitch detection backend...")
    print("=" * 50)

    detector = PitchDetector()

    # Generate a test tone at A4 (440 Hz)
    sample_rate = 44100
    duration = 0.5  # seconds
    frequency = 440.0  # A4

    t = np.linspace(0, duration, int(sample_rate * duration))
    audio_data = np.sin(2 * np.pi * frequency * t).astype(np.float32)

    # Add some amplitude
    audio_data *= 0.5

    print(f"Test: Generating sine wave at {frequency} Hz")
    result = detector.detect_pitch(audio_data, sample_rate)

    if result:
        print(f"✓ Detected frequency: {result['frequency']:.2f} Hz")
        print(f"✓ Detected note: {result['fullNote']}")
        print(f"✓ MIDI note: {result['midiNote']}")
        print(f"✓ Cents deviation: {result['cents']}")
        if 'confidence' in result:
            print(f"✓ Confidence: {result['confidence']:.2f}")

        # Check if detection is close to expected
        if abs(result['frequency'] - frequency) < 5:
            print("\n✓ Test PASSED: Frequency detection is accurate!")
        else:
            print(f"\n✗ Test FAILED: Expected {frequency} Hz, got {result['frequency']:.2f} Hz")
    else:
        print("✗ Test FAILED: No pitch detected")

    print("=" * 50)

if __name__ == '__main__':
    test_pitch_detection()
