// D3 is loaded globally via CDN script tag in HTML
// no need to import

// configuration
const config = {
    width: window.innerWidth,
    height: window.innerHeight - 120,
    margin: { top: 20, right: 20, bottom: 20, left: 20 }
};

// state
let currentPeriodIndex = 0;
let isPlaying = false;
let animationInterval = null;
let data = null;
let zoom = null;

// create svg
const svg = d3.select("#map")
    .attr("width", config.width)
    .attr("height", config.height);

// create container for zoom/pan
const g = svg.append("g");

// create layers
const mapLayer = g.append("g").attr("class", "map-layer");
const crimeLayer = g.append("g").attr("class", "crime-layer");
const airbnbLayer = g.append("g").attr("class", "airbnb-layer");

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
        // load from relative path
        const response = await fetch('./data/chicago_neighborhoods.geojson');
        if (!response.ok) throw new Error('Could not load neighborhood map');
        const geoData = await response.json();
        
        // draw neighborhoods
        mapLayer.selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("class", "neighborhood")
            .attr("d", path)
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "rgba(140, 160, 190, 0.6)");
                if (d.properties && d.properties.name) {
                    tooltip.style("display", "block")
                        .html(`<strong>${d.properties.name}</strong>`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px");
                }
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "rgba(100, 120, 150, 0.3)");
                tooltip.style("display", "none");
            });
        
        console.log("✅ Chicago map loaded with neighborhoods");
    } catch (error) {
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
        .style("fill", "rgba(100, 120, 150, 0.2)")
        .style("stroke", "rgba(255, 255, 255, 0.5)")
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

    const airbnbPeriod = data.airbnb[periodIndex];
    const crimePeriod = data.crimes[periodIndex];

    d3.select("#airbnb-count").text(airbnbPeriod.count);
    d3.select("#crime-count").text(crimePeriod.count);

    // prepare data for density visualization
    const airbnbPoints = airbnbPeriod.locations.map(d => ({
        x: projection([d.lon, d.lat])[0],
        y: projection([d.lon, d.lat])[1],
        data: d
    }));

    const crimePoints = crimePeriod.locations.map(d => ({
        x: projection([d.lon, d.lat])[0],
        y: projection([d.lon, d.lat])[1],
        data: d
    }));

    // create density contours for crimes
    const densityData = d3.contourDensity()
        .x(d => d.x)
        .y(d => d.y)
        .size([config.width, config.height])
        .bandwidth(20)
        .thresholds(15)
        (crimePoints);

    // color scale for crime density
    const colorScale = d3.scaleSequential(d3.interpolateReds)
        .domain([0, d3.max(densityData, d => d.value)]);

    // update crime density contours
    const contours = crimeLayer
        .selectAll(".crime-contour")
        .data(densityData);

    contours.exit()
        .transition()
        .duration(300)
        .style("opacity", 0)
        .remove();

    contours.enter()
        .append("path")
        .attr("class", "crime-contour")
        .attr("d", d3.geoPath())
        .attr("fill", d => colorScale(d.value))
        .attr("stroke", "none")
        .style("opacity", 0)
        .merge(contours)
        .transition()
        .duration(500)
        .attr("d", d3.geoPath())
        .attr("fill", d => colorScale(d.value))
        .style("opacity", 0.4);

    // update airbnb points as hexbins for better density visualization
    const hexbinGenerator = d3.hexbin()
        .x(d => d.x)
        .y(d => d.y)
        .radius(15)
        .extent([[0, 0], [config.width, config.height]]);

    const hexbins = hexbinGenerator(airbnbPoints);

    // color scale for airbnb density
    const airbnbColorScale = d3.scaleSequential(d3.interpolateGreens)
        .domain([0, d3.max(hexbins, d => d.length)]);

    // update airbnb hexbins
    const hexagons = airbnbLayer
        .selectAll(".airbnb-hex")
        .data(hexbins);

    hexagons.exit()
        .transition()
        .duration(300)
        .style("opacity", 0)
        .remove();

    hexagons.enter()
        .append("path")
        .attr("class", "airbnb-hex")
        .attr("d", hexbinGenerator.hexagon())
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .attr("fill", d => airbnbColorScale(d.length))
        .attr("stroke", "#2E7D32")
        .attr("stroke-width", 0.5)
        .style("opacity", 0)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(150)
                .style("stroke-width", 2)
                .style("opacity", 0.9);
            
            const avgPrice = d3.mean(d, p => p.data.price);
            tooltip.style("display", "block")
                .html(`
                    <strong>AirBnB Cluster</strong><br>
                    Listings: ${d.length}<br>
                    Avg Price: $${avgPrice.toFixed(0)}
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(150)
                .style("stroke-width", 0.5)
                .style("opacity", 0.6);
            
            tooltip.style("display", "none");
        })
        .merge(hexagons)
        .transition()
        .duration(500)
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .attr("fill", d => airbnbColorScale(d.length))
        .style("opacity", 0.6);
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
        
        // load timeseries data from relative path
        data = await d3.json('./data/chicago_timeseries.json');
        
        // hide loading, show UI
        d3.select("#loading").style("display", "none");
        d3.select("#legend").style("display", "block");
        d3.select("#stats").style("display", "block");
        d3.select("#controls").style("display", "flex");

        // setup controls
        setupControls();

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
