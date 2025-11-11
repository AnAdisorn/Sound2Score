#!/bin/bash

echo "Starting Sound2Score Application"
echo "================================="
echo ""

# Start backend in background
echo "Starting Python backend..."
cd backend
./run.sh &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Start frontend server
echo ""
echo "Starting frontend server..."
python3 server.py

# Cleanup: kill backend when frontend stops
trap "kill $BACKEND_PID" EXIT
