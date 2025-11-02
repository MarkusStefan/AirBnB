#!/bin/bash

echo "🚀 Starting Chicago AirBnB & Crime Visualization"
echo ""

# check if data exists
if [ ! -f "src/data/chicago_timeseries.json" ]; then
    echo "⚠️  Data files not found in src/data/"
    echo "   Running sync script..."
    ./sync-data.sh
    echo ""
fi

# start python http server
echo "📊 Starting server at http://localhost:8000"
echo "🌐 Opening http://localhost:8000/src/chicago-map.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# open browser (works on macOS, Linux, and Windows Git Bash)
if command -v open &> /dev/null; then
    open "http://localhost:8000/src/chicago-map.html"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:8000/src/chicago-map.html"
elif command -v start &> /dev/null; then
    start "http://localhost:8000/src/chicago-map.html"
fi

# start server
python3 -m http.server 8000
