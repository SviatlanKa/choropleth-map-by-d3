import * as d3 from 'd3';
import * as topojson from 'topojson';
import './style.css';

const url_education = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
const url_counties = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
const width = 1000;
const height = 600;

d3.select("body")
    .append("div")
    .attr("id", "main")
    .append("span")
    .attr("id", "title")
    .text("United States Educational Attainment")
    .append("br");

d3.select("#main")
    .append("span")
    .attr("id", "description")
    .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");

const chart = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#main")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

const path = d3.geoPath();

d3.json(url_counties).then(topology => {
    let map = topojson.feature(topology, topology.objects.counties);

    chart.append("g")
        .attr("class", "county")
        .selectAll("path")
        .data(map.features)
        .enter()
        .append("path")
        .attr("d", path);

    chart.append("path")
        .attr("class", "state-borders")
        .attr("d", path.mesh(topology, topology.objects.states, (a, b) => a !== b))
})