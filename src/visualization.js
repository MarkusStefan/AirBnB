// D3 is loaded globally via CDN script tag in HTML
// no need to import

// Import data directly to ensure Parcel bundles it correctly
import geoData from './data/chicago_neighborhoods.geojson';
import timeSeriesData from './data/chicago_timeseries.json';

// configuration
const config = {
    width: window.innerWidth,
    height: window.innerHeight - 120,
    margin: { top: 20, right: 20, bottom: 20, left: 20 }
};

// Define color scale for crime types
const crimeColorScale = d3.scaleOrdinal()
    .domain(['HOMICIDE', 'BATTERY', 'ASSAULT', 'ROBBERY', 'BURGLARY'])
    .range(['#d32f2f', '#f57c00', '#fbc02d', '#1976d2', '#7b1fa2']);

// state
let currentPeriodIndex = 0;
let isPlaying = false;
let animationInterval = null;
let data = null;
let zoom = null;
let globalColorScale = null;
let activeCrimeTypes = new Set(['HOMICIDE', 'BATTERY', 'ASSAULT', 'ROBBERY', 'BURGLARY']);

// create svg
const svg = d3.select("#map")
    .attr("width", config.width)
    .attr("height", config.height);

// create container for zoom/pan
const g = svg.append("g");

// create layers
const mapLayer = g.append("g").attr("class", "map-layer");
const crimeLayer = g.append("g").attr("class", "crime-layer");
// const airbnbLayer = g.append("g").attr("class", "airbnb-layer"); // Removed

// setup projection for Chicago
const projection = d3.geoMercator()
    .center([-87.65, 41.85])
    .scale(80000)
    .translate([config.width / 2, config.height / 2]);

const path = d3.geoPath().projection(projection);

// setup zoom behavior
zoom = d3.zoom()
    .scaleExtent([1, 20])
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
    });

svg.call(zoom);

// tooltip
const tooltip = d3.select("#tooltip");

// load Chicago neighborhood boundaries from GeoJSON
async function loadChicagoMap() {
    try {
        let features = null;
        
        // Handle Parcel behavior: it might return a URL (string) or the JSON object
        // When using type="module", Parcel usually bundles JSON as an object if imported directly
        // But sometimes it might be a URL if configured as a static asset
        
        if (typeof geoData === 'string') {
            console.log("Loading map from URL:", geoData);
            const response = await fetch(geoData);
            if (!response.ok) throw new Error('Failed to fetch map data');
            const json = await response.json();
            features = json.features;
        } else if (geoData && (geoData.features || geoData.type === 'FeatureCollection')) {
            console.log("Loading map from imported object");
            features = geoData.features;
        } else if (geoData && geoData.default) {
             // Handle ES module default export if wrapped
             console.log("Loading map from default export");
             features = geoData.default.features;
        } else {
            console.log("Unknown geoData format:", geoData);
            throw new Error("Invalid GeoJSON data structure");
        }

        if (!features) throw new Error("No features found in map data");

        // draw neighborhoods
        const neighborhoods = mapLayer.selectAll("path")
            .data(features)
            .join("path")
            .attr("class", "neighborhood")
            .attr("d", path);
            
        neighborhoods.on("mouseover", function(event, d) {
                d3.select(this).attr("class", "neighborhood hover");
                if (d.properties && d.properties.name) {
                    tooltip.style("display", "block")
                        .html(`<strong>${d.properties.name}</strong>`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px");
                }
            })
            .on("mouseout", function() {
                d3.select(this).attr("class", "neighborhood");
                tooltip.style("display", "none");
            });
        
        console.log(`✅ Chicago map loaded with ${features.length} neighborhoods`);
    } catch (error) {
        console.error("Error loading map:", error);
        console.log("⚠️ Could not load detailed neighborhood map, using simplified boundary");
        drawSimplifiedChicago();
    }
}

// fallback: draw simplified Chicago boundary
function drawSimplifiedChicago() {
    const chicagoBounds = {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [[
                [-87.94, 41.64],
                [-87.52, 41.64],
                [-87.52, 42.02],
                [-87.94, 42.02],
                [-87.94, 41.64]
            ]]
        }
    };
    
    mapLayer.append("path")
        .datum(chicagoBounds)
        .attr("class", "neighborhood")
        .attr("d", path)
        .style("fill", "#f0f0f0")
        .style("stroke", "#ccc")
        .style("stroke-width", "2px");
}

// update visualization for a given period with density visualization
function updateVisualization(periodIndex) {
    currentPeriodIndex = periodIndex;
    const period = data.periods[periodIndex];
    
    // update UI
    d3.select("#period-label").text(period);
    const progress = (periodIndex / (data.periods.length - 1)) * 100;
    d3.select("#timeline-progress").style("width", `${progress}%`);

    const crimePeriod = data.crimes[periodIndex];

    // --- CRIME SCATTERS ---
    
    // Project coordinates and filter
    const crimePointsData = crimePeriod.locations
        .filter(d => activeCrimeTypes.has(d.type))
        .map(d => ({
            ...d,
            x: projection([d.lon, d.lat])[0],
            y: projection([d.lon, d.lat])[1]
        }));

    d3.select("#crime-count").text(crimePointsData.length);

    // Bind data
    const crimeCircles = crimeLayer.selectAll(".crime-dot")
        .data(crimePointsData, (d, i) => i); // Use index as key for simple transition

    // Exit
    crimeCircles.exit()
        .transition().duration(200)
        .attr("r", 0)
        .attr("opacity", 0)
        .remove();

    // Enter
    const crimeEnter = crimeCircles.enter()
        .append("circle")
        .attr("class", "crime-dot")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 0)
        .attr("fill", d => crimeColorScale(d.type))
        .attr("opacity", 0.7);

    // Update (and Enter transition)
    crimeEnter.merge(crimeCircles)
        .transition().duration(500)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 3) // Small radius for scatter
        .attr("fill", d => crimeColorScale(d.type));

    // Add tooltips to new points
    crimeEnter.on("mouseover", function(event, d) {
        d3.select(this).attr("r", 6).attr("stroke", "white");
        tooltip.style("display", "block")
            .html(`<strong>${d.type}</strong><br>Lat: ${d.lat.toFixed(3)}<br>Lon: ${d.lon.toFixed(3)}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    }).on("mouseout", function() {
        d3.select(this).attr("r", 3).attr("stroke", "none");
        tooltip.style("display", "none");
    });
}

// setup legend interactions
function setupLegendInteractions() {
    d3.selectAll(".crime-filter").on("click", function() {
        const type = d3.select(this).attr("data-type");
        const element = d3.select(this);
        
        if (activeCrimeTypes.has(type)) {
            activeCrimeTypes.delete(type);
            element.style("opacity", 0.3);
        } else {
            activeCrimeTypes.add(type);
            element.style("opacity", 1);
        }
        
        updateVisualization(currentPeriodIndex);
    });
}

// setup controls
function setupControls() {
    const playBtn = d3.select("#play-btn");
    
    playBtn.on("click", function() {
        isPlaying = !isPlaying;
        playBtn.text(isPlaying ? "⏸️" : "▶️");
        
        if (isPlaying) {
            animationInterval = setInterval(() => {
                currentPeriodIndex++;
                if (currentPeriodIndex >= data.periods.length) {
                    currentPeriodIndex = 0;
                }
                updateVisualization(currentPeriodIndex);
            }, 1000);
        } else {
            clearInterval(animationInterval);
        }
    });

    // timeline interaction
    d3.select("#timeline").on("click", function(event) {
        const rect = this.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percent = x / rect.width;
        const periodIndex = Math.floor(percent * data.periods.length);
        updateVisualization(Math.max(0, Math.min(periodIndex, data.periods.length - 1)));
    });

    // reset zoom button
    d3.select("#reset-zoom").on("click", function() {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    });
}

// load data and initialize
async function initialize() {
    try {
        // load Chicago map
        await loadChicagoMap();
        
        // Handle Parcel behavior for timeseries data
        if (typeof timeSeriesData === 'string') {
            console.log("Loading timeseries from URL:", timeSeriesData);
            data = await d3.json(timeSeriesData);
        } else if (timeSeriesData && timeSeriesData.default) {
             console.log("Loading timeseries from default export");
             data = timeSeriesData.default;
        } else {
            console.log("Loading timeseries from imported object");
            data = timeSeriesData;
        }
        
        // hide loading, show UI
        d3.select("#loading").style("display", "none");
        d3.select("#legend").style("display", "block");
        d3.select("#stats").style("display", "block");
        d3.select("#controls").style("display", "flex");

        // setup controls
        setupControls();
        setupLegendInteractions();

        // initialize with first period
        updateVisualization(0);
        
        console.log("✅ Visualization loaded successfully!");
        console.log(`Periods: ${data.periods.length}`);
        console.log(`Range: ${data.periods[0]} to ${data.periods[data.periods.length - 1]}`);
    } catch (error) {
        console.error("Error loading data:", error);
        d3.select("#loading").html(`
            <div style="color: #F44336;">
                ❌ Error loading data<br>
                <small>${error.message}</small><br>
                <small>Make sure to run the notebook cells to generate data/chicago_timeseries.json</small>
            </div>
        `);
    }
}

// handle window resize
window.addEventListener('resize', () => {
    location.reload();
});

// start the application
initialize();
