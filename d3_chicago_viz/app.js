import * as d3 from "d3";

// state mngmnt
const state = {
    currentTimeIndex: 0,
    endTimeIndex: 0,
    isRangeMode: false,
    selectedCrimeTypes: new Set(),
    opacity: 0.5,
    viewMode: 'scatter', // 'scatter' or 'density'
    isPlaying: false,
    data: null,
    geoData: null,
    timer: null
};

// config
const scale = 110; // scaling factor for SVG size ==> kinda replaced by zoom slider
const width = 800;
const height = 600;
const svgWidth = width;
const svgHeight = height;
const smoothness = 5; // for density map - higher values = smoother
const thresholds = 20; // for density map - number of contour levels --> more = smoother contours
const frameDuration = 800; // ms per frame when playing
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

// selectors
const mapContainer = d3.select("#map-container");
const timeSlider = d3.select("#time-slider");
const timeSliderEnd = d3.select("#time-slider-end");
const rangeModeCheck = d3.select("#range-mode-check");
const endTimeContainer = d3.select("#end-time-container");
const opacitySlider = d3.select("#opacity-slider");
const zoomSlider = d3.select("#zoom-slider");
const playPauseButton = d3.select("#play-pause-btn");
const dateDisplay = d3.select("#date-display");
const crimeFiltersContainer = d3.select("#crime-type-filters");

// init SVG
const svg = mapContainer.append("svg")
    // usiong 95% scaling to not cut off edges of the chicago map
    .attr("width", `${scale}%`)
    .attr("height", `${scale}%`)
    .attr("viewBox", `0 0 ${width} ${height}`);

const gMap = svg.append("g");
const gData = svg.append("g");

// zoom range
const zoom = d3.zoom()
    .scaleExtent([0.5, 8])
    .on("zoom", (event) => {
        gMap.attr("transform", event.transform);
        gData.attr("transform", event.transform);
        zoomSlider.property("value", event.transform.k);
    });

svg.call(zoom);

// projection: Mercator centered on Chicago
// Mercator is a good general-purpose projection
const projection = d3.geoMercator()
    .scale(1)
    .translate([0, 0]);

const path = d3.geoPath().projection(projection);

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

async function init() {
    try {
        // loading the crime data + chicago geo data
        const [geoData, timeData] = await Promise.all([
            d3.json('../data/chicago_neighborhoods.geojson'),
            d3.json('../data/chicago_timeseries.json')
        ]);

        state.geoData = geoData;
        state.data = timeData.crimes; // store array of frames directly

        // console.log for debugging
        // log subsets of data to verify loading
        console.log("Geo Data:\t", state.geoData);
        console.log("Time Data Sample:\t", state.data.slice(0, 5));

        // init the chicago map map
        setupMap();

        // init controls (slicer, toggles, slider...)
        setupControls();

        // innit ender
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
        .attr("fill", "#eee") // background color for districts
        .attr("stroke", "#ccc") // district borders
        .attr("stroke-width", 1);
}

function setupControls() {
    const allTypes = new Set();
    // check whether data is loaded
    if (state.data && state.data.length > 0) {
        // check initial  frames
        const limit = Math.min(state.data.length, 5);
        for (let i = 0; i < limit; i++) {
            const frame = state.data[i];
            if (frame.locations) {
                frame.locations.forEach(c => allTypes.add(c.type));
            }
        }
    }
    
    const sortedTypes = Array.from(allTypes).sort(); // contains all unique crime types extracted from first few rows
    
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
        
        // color indicator
        label.append("span")
            .style("display", "inline-block")
            .style("width", "10px")
            .style("height", "10px")
            .style("background-color", colorScale(type))
            .style("margin-left", "5px")
            .style("border-radius", "50%");
    });
    
    timeSlider
        .attr("max", state.data.length - 1)
        .on("input", function() {
            state.currentTimeIndex = +this.value;
            update();
        });

    timeSliderEnd
        .attr("max", state.data.length - 1)
        .attr("value", state.currentTimeIndex)
        .on("input", function() {
            state.endTimeIndex = +this.value;
            update();
        });

    rangeModeCheck.on("change", function() {
        state.isRangeMode = this.checked;
        endTimeContainer.style("display", state.isRangeMode ? "block" : "none");
        
        if (state.isRangeMode) {
            // Sync end index to slider value
            state.endTimeIndex = +timeSliderEnd.property("value");
            
            // Disable play in range mode
            if (state.isPlaying) togglePlay();
            playPauseButton.property("disabled", true);
        } else {
            playPauseButton.property("disabled", false);
        }
        update();
    });

    opacitySlider.on("input", function() {
        state.opacity = +this.value;
        update();
    });

    zoomSlider.on("input", function() {
        svg.transition().duration(510).call(zoom.scaleTo, +this.value);
    });

    d3.selectAll("input[name='view-mode']").on("change", function() {
        state.viewMode = this.value;
        update();
    });

    
    playPauseButton.on("click", togglePlay);
}

function togglePlay() {
    state.isPlaying = !state.isPlaying;
    playPauseButton.text(state.isPlaying ? "Pause" : "Play");

    if (state.isPlaying) {
        state.timer = d3.interval(() => {
            state.currentTimeIndex = (state.currentTimeIndex + 1) % state.data.length;
            timeSlider.property("value", state.currentTimeIndex);
            update();
        }, frameDuration);
    } else {
        if (state.timer) state.timer.stop();
    }
}

function update() {
    if (!state.data || !state.data[state.currentTimeIndex]) return;

    let crimesToRender = [];
    let displayLabel = "";

    if (state.isRangeMode) {
        const start = Math.min(state.currentTimeIndex, state.endTimeIndex);
        const end = Math.max(state.currentTimeIndex, state.endTimeIndex);
        
        // Aggregate data from all frames in range
        for (let i = start; i <= end; i++) {
            if (state.data[i] && state.data[i].locations) {
                crimesToRender = crimesToRender.concat(state.data[i].locations);
            }
        }

        const startLabel = state.data[start].period || start;
        const endLabel = state.data[end].period || end;
        displayLabel = `${startLabel} - ${endLabel}`;
    } else {
        const currentFrame = state.data[state.currentTimeIndex];
        crimesToRender = currentFrame.locations || [];
        displayLabel = currentFrame.period || `Frame ${state.currentTimeIndex}`;
    }

    dateDisplay.text(displayLabel);

    // filter crimes according to selected types
    const filteredCrimes = crimesToRender.filter(d => state.selectedCrimeTypes.has(d.type));
    // clear
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
        .bandwidth(smoothness)
        .thresholds(thresholds)
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