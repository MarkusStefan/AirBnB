import * as d3 from "d3";
import chicagoMap from "./data/chicago_neighborhoods.json";
import timeSeriesData from './data/chicago_timeseries.json';

// Configuration
const width = window.innerWidth;
const height = window.innerHeight;
const margin = { top: 0, right: 0, bottom: 0, left: 0 };

// Setup SVG
const svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#ffffff");

const g = svg.append("g");

// Projection
const projection = d3.geoMercator()
    .center([-87.65, 41.85])
    .scale(90000) // Zoomed in a bit more
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Color Scale
const colorScale = d3.scaleOrdinal()
    .domain(['HOMICIDE', 'BATTERY', 'ASSAULT', 'ROBBERY', 'BURGLARY'])
    .range(['#d32f2f', '#f57c00', '#fbc02d', '#1976d2', '#7b1fa2']);

// State
let activeCrimeTypes = new Set(['HOMICIDE', 'BATTERY', 'ASSAULT', 'ROBBERY', 'BURGLARY']);
let isPlaying = true;
let isDensityMode = false;
let currentIndex = 0;

async function init() {
    // 1. Draw Map
    console.log("Drawing map...");
    
    let features = [];
    if (chicagoMap.features) {
        features = chicagoMap.features;
    } else if (chicagoMap.default && chicagoMap.default.features) {
        features = chicagoMap.default.features;
    } else {
        // Fallback fetch if Parcel didn't bundle it as object
        try {
            const response = await fetch(new URL('./data/chicago_neighborhoods.json', import.meta.url));
            const json = await response.json();
            features = json.features;
        } catch (e) {
            console.error("Failed to load map", e);
        }
    }

    if (features.length > 0) {
        g.selectAll("path")
            .data(features)
            .join("path")
            .attr("d", path)
            .attr("fill", "#e0e0e0")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 1.5);
        console.log("Map drawn.");
    } else {
        console.error("No features to draw.");
    }

    // Zoom Behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);

    // 2. Prepare Data
    let data = timeSeriesData;
    if (timeSeriesData.default) data = timeSeriesData.default;
    
    const periods = data.periods;
    const crimes = data.crimes;
    
    // Setup Slider
    const slider = d3.select("#time-slider")
        .attr("max", periods.length - 1)
        .on("input", function() {
            currentIndex = +this.value;
            isPlaying = false;
            d3.select("#play-pause-btn").text("Play");
            renderFrame(currentIndex);
        });

    // Setup Play/Pause
    d3.select("#play-pause-btn").on("click", function() {
        isPlaying = !isPlaying;
        d3.select(this).text(isPlaying ? "Pause" : "Play");
        if (isPlaying) update();
    });

    // Setup Density Toggle
    d3.select("#density-toggle").on("change", function() {
        isDensityMode = this.checked;
        // Clear existing visualizations
        g.selectAll(".crime-dot").remove();
        g.selectAll(".density-path").remove();
        renderFrame(currentIndex);
    });
    
    // 3. Animation Loop
    const label = d3.select("#period-label");
    
    function renderFrame(index) {
        if (index >= periods.length) index = 0;
        
        const period = periods[index];
        const crimeData = crimes[index];
        
        label.text(period);
        slider.property("value", index);
        
        // Filter
        const points = crimeData.locations.filter(d => activeCrimeTypes.has(d.type));
        
        if (isDensityMode) {
            // Density Visualization
            g.selectAll(".crime-dot").remove(); // Clear pulsing dots
            g.selectAll(".crime-dot-static").remove(); // Clear static dots

            const densityData = d3.contourDensity()
                .x(d => projection([d.lon, d.lat])[0])
                .y(d => projection([d.lon, d.lat])[1])
                .size([width, height])
                .bandwidth(20) // Adjust for smoothness
                .thresholds(20)
                (points);

            const densityColor = d3.scaleSequential(d3.interpolateInferno)
                .domain([0, d3.max(densityData, d => d.value)]);

            g.selectAll(".density-path")
                .data(densityData)
                .join("path")
                .attr("class", "density-path")
                .attr("d", d3.geoPath())
                .attr("fill", d => densityColor(d.value))
                .attr("opacity", 0.6);
                
        } else {
            // Points Visualization
            g.selectAll(".density-path").remove(); // Clear density

            if (isPlaying) {
                // Pulse Animation Mode
                g.selectAll(".crime-dot-static").remove(); // Clear static dots

                const circles = g.selectAll(".crime-dot")
                    .data(points, (d, i) => index + "-" + i); // Unique key per frame
                
                circles.enter()
                    .append("circle")
                    .attr("class", "crime-dot")
                    .attr("cx", d => projection([d.lon, d.lat])[0])
                    .attr("cy", d => projection([d.lon, d.lat])[1])
                    .attr("r", 0)
                    .attr("fill", d => colorScale(d.type))
                    .attr("opacity", 0.8)
                    .transition()
                    .duration(500)
                    .attr("r", 4)
                    .transition()
                    .duration(1000)
                    .attr("r", 0)
                    .attr("opacity", 0)
                    .remove();
            } else {
                // Static Mode (Paused/Scrubbing)
                // Remove pulsing dots to avoid clutter
                g.selectAll(".crime-dot").remove();

                const staticCircles = g.selectAll(".crime-dot-static")
                    .data(points);

                staticCircles.join(
                    enter => enter.append("circle")
                        .attr("class", "crime-dot-static")
                        .attr("cx", d => projection([d.lon, d.lat])[0])
                        .attr("cy", d => projection([d.lon, d.lat])[1])
                        .attr("r", 4)
                        .attr("fill", d => colorScale(d.type))
                        .attr("opacity", 0.8),
                    update => update
                        .attr("cx", d => projection([d.lon, d.lat])[0])
                        .attr("cy", d => projection([d.lon, d.lat])[1])
                        .attr("fill", d => colorScale(d.type)),
                    exit => exit.remove()
                );
            }
        }
    }

    function update() {
        if (!isPlaying) return;
        
        if (currentIndex >= periods.length) currentIndex = 0;
        
        renderFrame(currentIndex);
        
        currentIndex++;
        setTimeout(() => requestAnimationFrame(update), 800); // Speed of animation
    }
    
    update();
    
    // Legend Interaction
    d3.selectAll(".crime-filter").on("click", function() {
        const type = d3.select(this).attr("data-type");
        const el = d3.select(this);
        if (activeCrimeTypes.has(type)) {
            activeCrimeTypes.delete(type);
            el.style("opacity", 0.3);
        } else {
            activeCrimeTypes.add(type);
            el.style("opacity", 1);
        }
        // Re-render current frame to reflect filter change immediately
        renderFrame(currentIndex > 0 ? currentIndex - 1 : 0);
    });
}

init();
