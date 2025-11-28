import * as d3 from "d3";

// State management
const state = {
    currentTimeIndex: 0,
    selectedCrimeTypes: new Set(),
    opacity: 0.35,
    viewMode: 'scatter', // 'scatter' or 'density'
    isPlaying: false,
    data: null,
    geoData: null,
    timer: null
};

// Configuration
const width = 800;
const height = 600;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

// Selectors
const mapContainer = d3.select("#map-container");
const timeSlider = d3.select("#time-slider");
const opacitySlider = d3.select("#opacity-slider");
const playPauseBtn = d3.select("#play-pause-btn");
const dateDisplay = d3.select("#date-display");
const crimeFiltersContainer = d3.select("#crime-type-filters");

// init SVG
const svg = mapContainer.append("svg")
    // usiong 95% scaling to not cut off edges of the chicago map
    .attr("width", "95%")
    .attr("height", "95%")
    .attr("viewBox", `0 0 ${width} ${height}`);

const gMap = svg.append("g");
const gData = svg.append("g");

// projection: Mercator centered on Chicago
// Mercator is a good general-purpose projection
const projection = d3.geoMercator()
    .scale(1)
    .translate([0, 0]);

const path = d3.geoPath().projection(projection);

// Color scales
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

async function init() {
    try {
        // loading the crime data + chicago geo data
        // Using simple relative paths which resolve relative to the HTML file location
        const [geoData, timeData] = await Promise.all([
            d3.json('../data/chicago_neighborhoods.geojson'),
            d3.json('../data/chicago_timeseries.json')
        ]);

        state.geoData = geoData;
        state.data = timeData.crimes; // store array of frames directly

        // init the chicago map map
        setupMap();

        // init controls (slicer, toggles, slider...)
        setupControls();

        // Initial Render
        update();

    } catch (error) {
        console.error("Error loading data:\t", error);
        mapContainer.append("div").text("Error loading data. Check log-console.");
    }
}

function setupMap() {
    // fit projection to features
    projection.fitSize([width, height], state.geoData);

    // draw Chicago districts
    gMap.selectAll("path")
        .data(state.geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#eee")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1);
}

function setupControls() {
    // 1. Crime Types
    // Extract all unique crime types from the first few frames (or all if possible, but let's assume consistency)
    // We'll scan the first frame to get types, or ideally we'd have a list. 
    // Let's scan the first 10 frames to be safe or just the first one.
    const allTypes = new Set();
    // Check if data is loaded
    if (state.data && state.data.length > 0) {
        // Check the first few frames
        const limit = Math.min(state.data.length, 5);
        for (let i = 0; i < limit; i++) {
            const frame = state.data[i];
            if (frame.locations) {
                frame.locations.forEach(c => allTypes.add(c.type));
            }
        }
    }
    
    const sortedTypes = Array.from(allTypes).sort();
    
    // get selected types (+ select all per default)
    sortedTypes.forEach(t => state.selectedCrimeTypes.add(t));

    // create checkboxes to select crime types
    sortedTypes.forEach(type => {
        const label = crimeFiltersContainer.append("label");
        label.append("input")
            .attr("type", "checkbox")
            .attr("value", type)
            .property("checked", true)
            .on("change", function() {
                if (this.checked) {
                    state.selectedCrimeTypes.add(type);
                } else {
                    state.selectedCrimeTypes.delete(type);
                }
                update();
            });
        label.append("span").text(` ${type}`);
        
        // add color indicator
        label.append("span")
            .style("display", "inline-block")
            .style("width", "10px")
            .style("height", "10px")
            .style("background-color", colorScale(type))
            .style("margin-left", "5px")
            .style("border-radius", "50%");
    });

    // 2. Time Slider
    timeSlider
        .attr("max", state.data.length - 1)
        .on("input", function() {
            state.currentTimeIndex = +this.value;
            update();
        });

    // 3. Opacity Slider
    opacitySlider.on("input", function() {
        state.opacity = +this.value;
        update();
    });

    // 4. View Mode
    d3.selectAll("input[name='view-mode']").on("change", function() {
        state.viewMode = this.value;
        update();
    });

    // 5. Play/Pause
    playPauseBtn.on("click", togglePlay);
}

function togglePlay() {
    state.isPlaying = !state.isPlaying;
    playPauseBtn.text(state.isPlaying ? "Pause" : "Play");

    if (state.isPlaying) {
        state.timer = d3.interval(() => {
            state.currentTimeIndex = (state.currentTimeIndex + 1) % state.data.length;
            timeSlider.property("value", state.currentTimeIndex);
            update();
        }, 800); // 800ms per frame
    } else {
        if (state.timer) state.timer.stop();
    }
}

function update() {
    if (!state.data || !state.data[state.currentTimeIndex]) return;

    const currentFrame = state.data[state.currentTimeIndex];
    dateDisplay.text(currentFrame.period || `Frame ${state.currentTimeIndex}`);

    // Filter crimes
    const filteredCrimes = (currentFrame.locations || []).filter(d => state.selectedCrimeTypes.has(d.type));

    // Clear previous
    gData.selectAll("*").remove();

    if (state.viewMode === 'scatter') {
        renderScatter(filteredCrimes);
    } else {
        renderDensity(filteredCrimes);
    }
}

function renderScatter(crimes) {
    gData.selectAll("circle")
        .data(crimes)
        .enter()
        .append("circle")
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("r", 3)
        .attr("fill", d => colorScale(d.type))
        .attr("opacity", state.opacity);
}

function renderDensity(crimes) {
    // Prepare data for contourDensity
    const densityData = crimes.map(d => {
        const coords = projection([d.lon, d.lat]);
        return { x: coords[0], y: coords[1] };
    });

    const density = d3.contourDensity()
        .x(d => d.x)
        .y(d => d.y)
        .size([width, height])
        .bandwidth(20) // Adjust for smoothness
        .thresholds(20)
        (densityData);

    const densityColor = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, d3.max(density, d => d.value)]);

    gData.selectAll("path")
        .data(density)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("fill", d => densityColor(d.value))
        .attr("opacity", state.opacity);
}


init();