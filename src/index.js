import * as d3 from 'd3';
import * as topojson from 'topojson';
import './style.css';

const url_education = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
const url_counties = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
const width = 1000;
const height = 600;
const myColor = [
    '#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'
];

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
    d3.json(url_education).then(data => {
        const educationData = data.map(item => item);
        const minValue = d3.min(educationData, d => d.bachelorsOrHigher);
        const maxValue = d3.max(educationData, d => d.bachelorsOrHigher);

        const counties = topojson.feature(topology, topology.objects.counties);

        const states = topojson.feature(topology, topology.objects.states);

        const findObject = (id, key) => educationData.find(item => item["fips"] === id)[key];

        const colorScale = d3.scaleQuantize()
            .domain([minValue, maxValue])
            .range(myColor);

        chart.append("g")
            .selectAll("path")
            .data(counties.features)
            .enter()
            .append("path")
            .attr("class", "county")
            .attr("d", path)
            .attr("data-fips", d => findObject(d.id, "fips"))
            .attr("data-education", d => findObject(d.id, "bachelorsOrHigher"))
            .attr("fill", d => colorScale(findObject(d.id, "bachelorsOrHigher")))
            .on("mouseover", d => {
            tooltip.transition()
                .duration(300)
                .style("opacity", .7);
            tooltip.html(`<span>${findObject(d.id, "area_name")}, ${findObject(d.id, "state")}: ${findObject(d.id, "bachelorsOrHigher")}%</span>`)
                .style("left", d3.event.pageX + 15 + "px")
                .style("top", d3.event.pageY + "px")
                .attr("data-education", findObject(d.id, "bachelorsOrHigher"));
            console.log(d3.event.pageX, d3.event.pageY)
            })
            .on("mouseout", d => {
                tooltip.transition()
                    .duration(250)
                    .style("opacity", 0)
            });


        chart.append("g")
            .selectAll("path")
            .data(states.features)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", path);
    });
});