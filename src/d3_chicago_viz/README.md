# Chicago Crime Vizz
Crime evolution in Chicago districts over time.
- quarterly data from 2001Q1 to 2024Q1
- data source: https://data.cityofchicago.org/api/views/6zsd-gptz/rows.csv?accessType=DOWNLOAD

## How to Run
1. Open a terminal in the root of the repository (`AirBnB/`).
2. Run the following command to start a local Python server:
```bash
python -m http.server 8000
```

3. Open web browser; navigate to:
   [http://localhost:8000/src/d3_chicago_viz/index.html](http://localhost:8000/src/d3_chicago_viz/index.html)

## Features
- **Chicago City Map**: Shows Chicago neighborhoods
- **Time Slider**: Navigate through time periods
- **Play/Pause**: Animation of timeseries
- **Crime Filters**: Toggle specific crime types
- **Toggle View Mode**: Switch between Scatter plot and Density map
- **Opacity**: Adjust the opacity of the visualization layers to adjust visibility