# chicago airbnb & crime d3.js map visualization

## overview

interactive d3.js visualization showing the evolution of airbnb rentals and homicide crimes overlaid on a detailed chicago neighborhood map from 2018 to 2024. includes zoom, pan, and time-series animation capabilities.

## features

### 🗺️ geographic context
- **98 chicago neighborhoods** displayed with interactive boundaries
- **accurate projection** using d3.geoMercator centered on chicago
- **neighborhood labels** on hover showing area names
- **zoom capability** - scroll to zoom in/out (1x to 20x)
- **pan capability** - drag to move around the map
- **reset zoom button** - return to default view

### ✨ visualization elements
- **airbnb listings**: green dots (size varies with price $0-$10,000)
- **crime incidents**: red dots (homicides only, non-domestic)
- **smooth transitions**: points fade in/out as time progresses
- **interactive tooltips**: hover for detailed information
- **real-time statistics**: counts update with each time period

### 🎮 interactive controls
- **play/pause button**: animate through 73 monthly time periods
- **timeline scrubber**: click to jump to any period
- **zoom controls**: scroll wheel or pinch gesture
- **pan controls**: click and drag to move map
- **reset zoom**: button to return to original view

## file structure

```
src/
├── chicago-map.html       # main html file with structure
├── styles.css             # all styling and animations
├── visualization.js       # d3.js visualization logic
└── index.html            # simple demo (original)

data/
├── chicago_timeseries.json          # prepared time-series data (2.1 MB)
└── chicago_neighborhoods.geojson    # chicago neighborhood boundaries
```

## setup and run

### step 1: prepare data (run notebook cells)

in `main copy.ipynb`, run these cells:

1. **data preparation cell** - filters and processes data
2. **json export cell** - creates `data/chicago_timeseries.json`
3. **geojson download cell** - downloads chicago neighborhood boundaries

### step 2: start development server

**option a: using parcel (recommended)**
```bash
npm run dev
```
- automatically opens browser at http://localhost:1234
- includes hot reload for development
- bundles es6 modules automatically

**option b: using python server**
```bash
python3 -m http.server 8000
```
then navigate to http://localhost:8000/src/chicago-map.html

### step 3: explore the visualization

the page will load with:
- chicago neighborhood map as background
- initial time period: 2018-01
- all controls ready for interaction

## usage guide

### navigation
- **zoom in**: scroll up or pinch out
- **zoom out**: scroll down or pinch in
- **pan**: click and drag anywhere on map
- **reset**: click 🔍 button to reset zoom/pan

### time controls
- **play animation**: click ▶️ to start automatic progression
- **pause**: click ⏸️ to stop
- **jump to period**: click anywhere on timeline bar
- **observe stats**: watch counts update in real-time

### information
- **hover on neighborhood**: see neighborhood name
- **hover on green dot**: see airbnb listing details (price, type, location)
- **hover on red dot**: see crime incident details (type, description)

## data details

### dataset statistics
- **time range**: january 2018 to january 2024
- **time periods**: 73 months
- **airbnb listings**: 8,528 total across all periods
- **crime incidents**: 3,783 homicides (non-domestic)
- **neighborhoods**: 98 chicago neighborhoods

### data preparation
data is filtered and aggregated:
- airbnb: price ≤ $10,000, valid coordinates
- crimes: homicides only, non-domestic, valid coordinates
- geographic bounds: 41.6°-42.1°N, -87.95°--87.52°W

### file sizes
- `chicago_timeseries.json`: 2.1 MB
- `chicago_neighborhoods.geojson`: ~500 KB

## technical implementation

### technologies
- **d3.js v7**: data visualization, geographic projections
- **d3-geo**: mercator projection for chicago
- **topojson**: geographic data handling
- **parcel**: module bundler for es6
- **html5/css3**: modern web standards

### key d3 concepts used
- **geographic projection**: `d3.geoMercator()`
- **path generation**: `d3.geoPath()`
- **zoom behavior**: `d3.zoom()`
- **data binding**: `selectAll().data().join()`
- **transitions**: smooth enter/exit animations
- **event handling**: mouseover, click, zoom

### projection settings
```javascript
const projection = d3.geoMercator()
    .center([-87.65, 41.85])  // chicago center
    .scale(80000)              // zoom level
    .translate([width/2, height/2])
```

### zoom configuration
```javascript
const zoom = d3.zoom()
    .scaleExtent([1, 20])  // min/max zoom
    .on("zoom", (event) => {
        g.attr("transform", event.transform)
    })
```

## customization

### modify animation speed
in `visualization.js`, line ~225:
```javascript
setInterval(() => { ... }, 1000)  // change 1000 to desired ms
```

### adjust zoom limits
in `visualization.js`, line ~42:
```javascript
.scaleExtent([1, 20])  // change [min, max] zoom levels
```

### change colors
in `styles.css`:
```css
.airbnb-dot { background: #4CAF50; }  /* airbnb green */
.crime-dot { background: #F44336; }   /* crime red */
```

### modify point sizes
in `visualization.js`, line ~148:
```javascript
.attr("r", d => Math.min(3 + (d.price / 100), 8))
```

## development

### npm scripts
- `npm run dev`: start dev server with hot reload
- `npm run build`: create production build
- `npm start`: start dev server without opening browser
- `npm run dev:simple`: run original simple demo

### project structure
- **modular design**: separate html, css, js files
- **es6 modules**: using import/export
- **responsive**: adapts to window size
- **optimized**: efficient data binding and transitions

## troubleshooting

### map not loading
- check browser console for errors
- verify `data/chicago_neighborhoods.geojson` exists
- visualization will fallback to simplified boundary if needed

### data not appearing
- ensure `data/chicago_timeseries.json` exists
- run notebook cells to generate data
- check browser network tab for 404 errors

### port already in use
```bash
# kill process on port 1234
lsof -ti:1234 | xargs kill -9
# or use python server on different port
python3 -m http.server 8080
```

### zoom not working
- try refreshing the page
- check browser console for javascript errors
- ensure d3.js library loaded correctly

## performance notes

- **initial load**: ~1-2 seconds for data + map
- **animation**: 60 fps smooth transitions
- **zoom**: hardware-accelerated transforms
- **data points**: efficiently handles 12,000+ points
- **memory**: ~50-100 MB typical usage

## browser compatibility

- ✅ chrome/edge (recommended)
- ✅ firefox
- ✅ safari
- ⚠️ internet explorer (not supported)

## future enhancements

potential additions:
- [ ] heatmap overlay option
- [ ] filter by neighborhood
- [ ] export current view as image
- [ ] compare two time periods side-by-side
- [ ] add public transit lines
- [ ] include more crime types with toggle
- [ ] density clustering for overlapping points

## credits

- **data sources**: chicago data portal, inside airbnb
- **neighborhood boundaries**: blackmad/neighborhoods github
- **visualization**: d3.js by mike bostock
- **bundler**: parcel.js

---

**created**: november 2025  
**version**: 2.0 with chicago map integration  
**license**: isc
