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
   [http://localhost:8000/d3_chicago_viz/index.html](http://localhost:8000/d3_chicago_viz/index.html)


## Adjustments / Customization
- sliders & other functionality should be in `app.js`
- webpage for deployment is in `index.html` and consist of a sidebar for controls and main area for visualization
- styles are in `style.css` and can be found within `app.js` and `index.html`

## Features
- **Chicago City Map**: Shows Chicago neighborhoods
- **Time Slider**: Navigate through time periods
- **Play/Pause**: Animation of timeseries
- **Crime Filters**: Toggle specific crime types
- **Toggle View Mode**: Switch between Scatter plot and Density map
- **Opacity**: Adjust the opacity of the visualization layers to adjust visibility




## Data
Simply run `data.ipynb` to download and prepare the data for the visualization. The processed data will be saved in the `data/` folder.


## Vizz Details
**Data Variables**
- `crime_cols = ['Date', 'Primary Type', 'Latitude', 'Longitude']`

**Type of Visualization**
- *Geospatial Time Series Chart*: Displays crime incidents over time (aggr. quarterly) on a city map of Chicago

**Visual Encodings**
- **Position ($x, y$)**: Latitude and Longitude of crime incidents on the Chicago map
- **Shape**: 
   - **Scatters**:Each crime incident is represented as a circle on the map, positioned based on its latitude and longitude
   - **Density Map**: Smooth heatmap (contour) overlay showing *concentration* of crime incidents in the given period
- **Color**: Different colors represent different types of crimes
- **Opacity**: Adjustable opacity for better visibility of layers

**Visual Elements**
- **Marks**: Circles for crime incidents - can be selected or deselected based on crime type
- **Axes**: Time slider (hidden dimension) for navigating through different quarters from 2001Q1 to 2024Q1
- **Scales**: 
   - **Spatial**: Geographic scale for mapping latitude and longitude to screen coordinates (coords omitted for simplicity)
   - **Categorial**: Color scale for different crime types
   - **Channels**: Position (x, y), Color, Opacity