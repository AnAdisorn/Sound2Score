#!/bin/bash

echo "Sound2Score Backend Setup"
echo "========================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "Starting Flask backend server..."
echo "Backend will be available at: http://localhost:5000"
echo ""

# Run the Flask app
python app.py
