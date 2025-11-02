# chicago airbnb & crime interactive visualization

## overview

this project creates an astonishing interactive d3.js visualization showing the evolution of airbnb rentals and homicide crimes in chicago from 2018 to 2024.

## what was created

### 1. data preparation (notebook cells)

two new cells were added to `main copy.ipynb`:

- **cell 1**: prepares and filters airbnb and crime data
  - filters airbnb listings by price and location
  - filters crimes to homicides only (non-domestic)
  - creates year-month time periods for both datasets
  
- **cell 2**: exports data to json format
  - aggregates data by time period
  - creates `data/chicago_timeseries.json` with 73 time periods
  - includes 8,528 airbnb listings and 3,783 crime incidents

### 2. interactive visualization

`chicago_visualization.html` features:

**visual elements:**
- ✨ **animated timeline**: shows monthly progression from 2018-2024
- 🎮 **interactive controls**: play/pause button and clickable timeline
- 📊 **real-time statistics**: counts update as you navigate through time
- 🗺️ **geographic map**: chicago boundary with accurate coordinates
- 🎨 **color coding**:
  - green dots: airbnb listings (size varies with price)
  - red dots: homicide incidents
- 🖱️ **hover tooltips**: detailed information on mouseover

**technical features:**
- smooth d3.js transitions for entering/exiting points
- glassmorphism ui design with modern gradients
- responsive sizing based on viewport
- optimized rendering with data binding

## how to use

### step 1: prepare data

run the two new cells at the end of `main copy.ipynb`:

1. first cell: prepares the data
2. second cell: exports to `data/chicago_timeseries.json`

### step 2: start local server

```bash
cd /Users/markus/GitHub/VIZZ/AirBnB
python3 -m http.server 8000
```

or use node:

```bash
npx http-server -p 8000
```

### step 3: view visualization

open your browser to:
```
http://localhost:8000/chicago_visualization.html
```

## controls

- **▶️ play button**: starts automatic animation through time periods
- **⏸️ pause button**: stops the animation
- **timeline bar**: click anywhere to jump to a specific time period
- **hover on dots**: see detailed information about listings or crimes

## data insights

- **time range**: january 2018 to january 2024 (73 months)
- **airbnb listings**: 8,528 total
- **crime incidents**: 3,783 homicides (non-domestic)
- **geographic bounds**: 
  - latitude: 41.6° to 42.1°
  - longitude: -87.95° to -87.52°

## technology stack

- **d3.js v7**: data visualization and dom manipulation
- **python/pandas**: data wrangling and preparation
- **json**: data interchange format
- **html/css**: modern glassmorphism design
- **http server**: local development server

## file structure

```
/Users/markus/GitHub/VIZZ/AirBnB/
├── main copy.ipynb                   # notebook with data preparation cells
├── chicago_visualization.html        # interactive visualization
├── data/
│   └── chicago_timeseries.json      # prepared time-series data
└── D3_VISUALIZATION_README.md       # this file
```

## customization

you can modify the visualization by editing `chicago_visualization.html`:

- **animation speed**: change `1000` in the setInterval (line ~419)
- **colors**: modify the css color variables
- **point sizes**: adjust the radius calculations in updateVisualization
- **time period**: filter different date ranges in the notebook

## notes

- the visualization uses homicides only to keep the data focused
- airbnb data is from september 2023 snapshot
- point sizes for airbnb scale with listing price
- smooth transitions create engaging storytelling effect

---

**created**: november 2025  
**data source**: chicago data portal, inside airbnb  
**visualization**: d3.js interactive timeline
