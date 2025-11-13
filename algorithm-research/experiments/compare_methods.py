#!/usr/bin/env python3
"""
Compare different pitch detection methods on audio samples

Usage:
    python compare_methods.py path/to/audio.webm
"""

import sys
import numpy as np
import librosa
import matplotlib.pyplot as plt
from pathlib import Path


def autocorrelation_pitch(audio_buffer, sample_rate, min_freq=27.5, max_freq=4186):
    """Autocorrelation-based pitch detection"""
    rms = np.sqrt(np.mean(audio_buffer ** 2))
    if rms < 0.01:
        return None

    size = len(audio_buffer)
    correlation = np.correlate(audio_buffer, audio_buffer, mode='full')
    correlation = correlation[size-1:]
    correlation = correlation / correlation[0]

    min_period = int(sample_rate / max_freq)
    max_period = int(sample_rate / min_freq)

    peak_idx = np.argmax(correlation[min_period:max_period]) + min_period

    if correlation[peak_idx] > 0.5:
        return sample_rate / peak_idx
    return None


def yin_pitch(audio_buffer, sample_rate, threshold=0.1):
    """YIN algorithm for pitch detection"""
    buffer_size = len(audio_buffer)
    half_size = buffer_size // 2

    diff = np.zeros(half_size)
    for tau in range(1, half_size):
        for i in range(half_size):
            diff[tau] += (audio_buffer[i] - audio_buffer[i + tau]) ** 2

    cmnd = np.zeros(half_size)
    cmnd[0] = 1
    running_sum = 0
    for tau in range(1, half_size):
        running_sum += diff[tau]
        cmnd[tau] = diff[tau] / (running_sum / tau)

    tau = 1
    while tau < half_size:
        if cmnd[tau] < threshold:
            while tau + 1 < half_size and cmnd[tau + 1] < cmnd[tau]:
                tau += 1
            return sample_rate / tau
        tau += 1

    return None


def hps_pitch(audio_buffer, sample_rate, num_harmonics=5):
    """Harmonic Product Spectrum method"""
    from scipy.fft import fft, fftfreq

    fft_data = np.abs(fft(audio_buffer))
    freqs = fftfreq(len(audio_buffer), 1/sample_rate)

    positive_freqs = freqs[:len(freqs)//2]
    positive_fft = fft_data[:len(fft_data)//2]

    hps = positive_fft.copy()
    for h in range(2, num_harmonics + 1):
        decimated = positive_fft[::h]
        hps[:len(decimated)] *= decimated

    peak_idx = np.argmax(hps)
    frequency = positive_freqs[peak_idx]

    if 27.5 < frequency < 4186:
        return frequency
    return None


def analyze_audio(audio_path):
    """Analyze audio file with all methods"""
    print(f"\nAnalyzing: {audio_path}")
    print("=" * 60)

    # Load audio
    y, sr = librosa.load(audio_path, sr=None)
    print(f"Sample rate: {sr} Hz")
    print(f"Duration: {len(y) / sr:.2f} seconds")

    # Analyze in frames
    frame_size = 4096
    hop_length = 2048

    results = {
        'autocorrelation': [],
        'yin': [],
        'hps': [],
        'times': []
    }

    print("\nProcessing frames...")
    for i in range(0, len(y) - frame_size, hop_length):
        frame = y[i:i+frame_size]
        time = i / sr

        results['times'].append(time)
        results['autocorrelation'].append(autocorrelation_pitch(frame, sr))
        results['yin'].append(yin_pitch(frame, sr))
        results['hps'].append(hps_pitch(frame, sr))

    # Print statistics
    print("\nMethod Statistics:")
    print("-" * 60)
    for method in ['autocorrelation', 'yin', 'hps']:
        valid = [f for f in results[method] if f is not None]
        detection_rate = len(valid) / len(results[method]) * 100

        if valid:
            avg_freq = np.mean(valid)
            std_freq = np.std(valid)
            avg_note = librosa.hz_to_note(avg_freq)
            print(f"{method.upper():15s}: {detection_rate:5.1f}% detection | "
                  f"Avg: {avg_freq:6.1f} Hz ({avg_note}) | Std: {std_freq:5.1f} Hz")
        else:
            print(f"{method.upper():15s}: {detection_rate:5.1f}% detection | No valid detections")

    # Plot results
    fig, ax = plt.subplots(figsize=(14, 6))

    for method in ['autocorrelation', 'yin', 'hps']:
        freqs = [f if f else np.nan for f in results[method]]
        ax.plot(results['times'], freqs, label=method.upper(),
                marker='o', markersize=3, alpha=0.7)

    ax.set_xlabel('Time (s)')
    ax.set_ylabel('Frequency (Hz)')
    ax.set_title(f'Pitch Detection Comparison: {Path(audio_path).name}')
    ax.legend()
    ax.grid(True, alpha=0.3)

    plt.tight_layout()

    # Save plot
    output_path = Path('../results') / f"comparison_{Path(audio_path).stem}.png"
    output_path.parent.mkdir(exist_ok=True)
    plt.savefig(output_path, dpi=150)
    print(f"\nPlot saved to: {output_path}")

    plt.show()


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python compare_methods.py <audio_file>")
        print("\nSearching for audio files in samples folder...")

        samples_dir = Path('../samples')
        audio_files = (list(samples_dir.rglob('*.webm')) +
                      list(samples_dir.rglob('*.wav')) +
                      list(samples_dir.rglob('*.mp3')))

        if audio_files:
            print("\nAvailable files:")
            for i, f in enumerate(audio_files):
                print(f"  {i+1}. {f.relative_to(samples_dir)}")
            print("\nRun: python compare_methods.py path/to/audio/file")
        else:
            print("\nNo audio files found in samples folder.")
            print("Please record some using the Sound2Score app!")
        sys.exit(1)

    audio_path = sys.argv[1]
    if not Path(audio_path).exists():
        print(f"Error: File not found: {audio_path}")
        sys.exit(1)

    analyze_audio(audio_path)
