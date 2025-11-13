#!/usr/bin/env python3
"""
Simple HTTP server for Sound2Score application
Run with: python3 server.py
Then open: http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
from pathlib import Path

PORT = 8080
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Sound2Score Server")
        print(f"==================")
        print(f"Server running at: http://localhost:{PORT}")
        print(f"Press Ctrl+C to stop the server")
        print()
        print("Opening browser...")

        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
