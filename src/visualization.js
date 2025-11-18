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

    // 2. Prepare Data
    let data = timeSeriesData;
    if (timeSeriesData.default) data = timeSeriesData.default;
    
    // Flatten data for easier animation? 
    // The current structure is by period. That's fine.
    
    const periods = data.periods;
    const crimes = data.crimes;
    
    // 3. Animation Loop
    let i = 0;
    const label = d3.select("#period-label");
    
    function update() {
        if (i >= periods.length) i = 0; // Loop
        
        const period = periods[i];
        const crimeData = crimes[i];
        
        label.text(period);
        
        // Filter
        const points = crimeData.locations.filter(d => activeCrimeTypes.has(d.type));
        
        // Draw Points
        const circles = g.selectAll(".crime-dot")
            .data(points, (d, index) => i + "-" + index); // Unique key per frame to ensure new dots
            
        // ENTER: New dots appear
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
            .remove(); // Remove after fading out
            
        // We don't keep old dots, we just let them flash and fade.
        // This creates a "pulse" of crime for that period.
        
        i++;
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
    });
}

init();
