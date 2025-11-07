#!/bin/bash
# Simple HTTP server script for InTheAir-master portal
# This allows the games to run properly (required for CORS)

PORT=${1:-8000}

echo "🚀 Starting web server on port $PORT..."
echo ""
echo "📍 Server URL: http://localhost:$PORT/portal.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Change to the script's directory
cd "$(dirname "$0")"

# Start Python HTTP server
python3 -m http.server $PORT

