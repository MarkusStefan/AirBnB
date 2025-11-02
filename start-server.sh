#!/bin/bash
# Start simple HTTP server for D3 visualization
# No bundler needed - serves files directly

echo "🚀 Starting HTTP server on port 8000..."
echo "📊 Open: http://localhost:8000/src/chicago-map.html"
echo "Press Ctrl+C to stop"
echo ""

python3 -m http.server 8000
