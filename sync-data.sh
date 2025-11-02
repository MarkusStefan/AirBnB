#!/bin/bash

# sync data from data/ to src/data/ for parcel bundler

echo "🔄 syncing data files..."

# create src/data if it doesn't exist
mkdir -p src/data

# copy json files
if [ -f "data/chicago_timeseries.json" ]; then
    cp data/chicago_timeseries.json src/data/
    echo "✅ chicago_timeseries.json synced"
else
    echo "⚠️  chicago_timeseries.json not found - run notebook cells first"
fi

# copy geojson files
if [ -f "data/chicago_neighborhoods.geojson" ]; then
    cp data/chicago_neighborhoods.geojson src/data/
    echo "✅ chicago_neighborhoods.geojson synced"
else
    echo "⚠️  chicago_neighborhoods.geojson not found - run notebook cell to download"
fi

echo "✅ data sync complete!"
