"""
Flask backend for Sound2Score
Provides advanced pitch detection using Python numerical libraries
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import base64
import struct
from pitch_detector import PitchDetector

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize pitch detector
pitch_detector = PitchDetector()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Sound2Score backend is running'
    })


@app.route('/api/detect-pitch', methods=['POST'])
def detect_pitch():
    """
    Detect pitch from audio data

    Expects JSON with:
    - audioData: array of float32 audio samples
    - sampleRate: sample rate (typically 44100 or 48000)
    """
    try:
        data = request.get_json()

        if not data or 'audioData' not in data or 'sampleRate' not in data:
            return jsonify({
                'error': 'Missing audioData or sampleRate'
            }), 400

        # Extract audio data and sample rate
        audio_data = np.array(data['audioData'], dtype=np.float32)
        sample_rate = int(data['sampleRate'])

        # Detect pitch
        result = pitch_detector.detect_pitch(audio_data, sample_rate)

        if result:
            return jsonify({
                'success': True,
                'pitch': result
            })
        else:
            return jsonify({
                'success': False,
                'pitch': None,
                'message': 'No pitch detected'
            })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500


@app.route('/api/analyze-chord', methods=['POST'])
def analyze_chord():
    """
    Analyze multiple frequencies to identify chords

    Expects JSON with:
    - frequencies: array of detected frequencies
    """
    try:
        data = request.get_json()

        if not data or 'frequencies' not in data:
            return jsonify({
                'error': 'Missing frequencies'
            }), 400

        frequencies = data['frequencies']

        # Convert frequencies to notes
        notes = []
        for freq in frequencies:
            if freq:
                note_info = pitch_detector.frequency_to_note(freq)
                notes.append(note_info)

        return jsonify({
            'success': True,
            'notes': notes
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500


@app.route('/api/note-to-frequency', methods=['POST'])
def note_to_frequency():
    """
    Convert note name and octave to frequency

    Expects JSON with:
    - note: note name (e.g., 'C', 'C#')
    - octave: octave number
    """
    try:
        data = request.get_json()

        if not data or 'note' not in data or 'octave' not in data:
            return jsonify({
                'error': 'Missing note or octave'
            }), 400

        note = data['note']
        octave = int(data['octave'])

        frequency = pitch_detector.note_to_frequency(note, octave)

        return jsonify({
            'success': True,
            'frequency': float(frequency)
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("=" * 50)
    print("Sound2Score Backend Server")
    print("=" * 50)
    print("Server running at: http://localhost:5000")
    print("API Endpoints:")
    print("  - GET  /api/health")
    print("  - POST /api/detect-pitch")
    print("  - POST /api/analyze-chord")
    print("  - POST /api/note-to-frequency")
    print("=" * 50)
    print()

    app.run(debug=True, host='0.0.0.0', port=5000)
