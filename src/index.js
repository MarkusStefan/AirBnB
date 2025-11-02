import * as d3 from "d3";

// configuration
const config = {
    width: 800,
    height: 600,
    margin: { top: 60, right: 40, bottom: 60, left: 80 }
};

// create sample visualization
function createSampleVisualization() {
    const vizContainer = d3.select("#viz");
    
    // clear existing content
    vizContainer.html("");
    
    // add title
    vizContainer.append("div")
        .attr("class", "chart-container")
        .html(`
            <h2 class="chart-title">D3.js Environment Ready!</h2>
            <p class="chart-description">Your D3.js setup is working. Below is a sample interactive visualization.</p>
        `);
    
    // create sample data
    const sampleData = Array.from({length: 20}, (_, i) => ({
        x: i,
        y: Math.random() * 100
    }));
    
    // create svg
    const svg = vizContainer.append("svg")
        .attr("width", config.width)
        .attr("height", config.height);
    
    // create scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(sampleData, d => d.x)])
        .range([config.margin.left, config.width - config.margin.right]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(sampleData, d => d.y)])
        .range([config.height - config.margin.bottom, config.margin.top]);
    
    // create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    // add x axis
    svg.append("g")
        .attr("transform", `translate(0, ${config.height - config.margin.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", config.width / 2)
        .attr("y", 40)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text("Sample X Axis");
    
    // add y axis
    svg.append("g")
        .attr("transform", `translate(${config.margin.left}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -config.height / 2)
        .attr("y", -50)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text("Sample Y Axis");
    
    // create tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");
    
    // add circles with animation
    svg.selectAll("circle")
        .data(sampleData)
        .join("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", config.height - config.margin.bottom)
        .attr("r", 0)
        .attr("fill", "#667eea")
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 8)
                .attr("opacity", 1);
            
            tooltip
                .style("opacity", 1)
                .html(`<strong>X:</strong> ${d.x}<br><strong>Y:</strong> ${d.y.toFixed(2)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 6)
                .attr("opacity", 0.7);
            
            tooltip.style("opacity", 0);
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 50)
        .attr("cy", d => yScale(d.y))
        .attr("r", 6);
    
    console.log("D3.js visualization created successfully!");
}

// initialize
createSampleVisualization();

// export for use in other modules
export { config, createSampleVisualization };