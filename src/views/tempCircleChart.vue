<template>
    <body></body>
</template>

<script>
import { mapState } from "vuex";
var d3 = Object.assign({}, require("d3"), require("d3-scale"));

export default {
    computed: {
        ...mapState({
            data: state => state.responses.dummy,
            data2: state => state.responses.dummy2
        })
    },
    mounted: function() {
        // let avrg = this.avg(this.data);
        let grid = d3
            .select("body")
            .append("div")
            .attr("id", "grid")
            .attr("class", "grid");
        let chars = grid
            .selectAll("div")
            .data(this.data.Species)
            .enter()
            .append("div")
            .attr("class", "char");
        chars.style(
            "fill",
            function(d) {
                this.circleLead(d.label, this.$el);
            }.bind(this)
        );
        /* let content = chars.append("div").attr("class", "charContent");
        content.append("h2").text(function(d, i) {
            return d.label;
        });

        chars.classed("size1", true);

        chars.on(
            "click",
            function(d, i) {
                if (this.className.split(" ").indexOf("open") > -1) {
                    d3.select(this).classed("open", false);
                } else {
                    let gridColumns = window.getComputedStyle(this.parentElement).gridTemplateColumns.split(" ");
                    let gridRows = window.getComputedStyle(this.parentElement).gridTemplateRows.split(" ");
                    let numColumns = gridColumns.length;
                    let numRows = gridRows.length;
                    let xPosInGrid =
                        this.getBoundingClientRect().left - this.parentElement.getBoundingClientRect().left;
                    let yPosInGrid = this.getBoundingClientRect().top - this.parentElement.getBoundingClientRect().top;
                    let gridRowHeight =
                        parseFloat(gridRows[0]) + parseFloat(window.getComputedStyle(this.parentElement).gridRowGap);
                    let gridColumnWidth =
                        parseFloat(gridColumns[0]) +
                        parseFloat(window.getComputedStyle(this.parentElement).gridColumnGap);
                    let thisRow = Math.round(yPosInGrid / gridRowHeight) + 1;
                    let thisColumn = Math.round(xPosInGrid / gridColumnWidth) + 1;
                    let thisPortrait = this.getElementsByClassName("portrait")[0];
                    if (thisPortrait) thisPortrait.setAttribute("src", thisPortrait.getAttribute("data-src"));
                    chars.classed("open", false);
                    chars.style("grid-row-start", "auto");
                    chars.style("grid-column-start", "auto");
                    d3.select(this).classed("open", true);
                    let divWidth = parseFloat(window.getComputedStyle(this).gridColumnEnd.split(" ")[1]);
                    let divHeight = parseFloat(window.getComputedStyle(this).gridRowEnd.split(" ")[1]);
                    if (thisRow + divHeight > numRows) thisRow = 1 + numRows - divHeight;
                    if (thisColumn + divWidth > numColumns) thisColumn = 1 + numColumns - divWidth;
                    d3.select(this).style("grid-row-start", thisRow);
                    d3.select(this).style("grid-column-start", thisColumn);
                }
            }.bind(this)
        );

        let details = content.append("div").attr("class", "details");
        let bio = details.append("div").attr("class", "bio");
        bio.append("h3").text(function(d, i) {
            return d.label;
        });
        bio.filter(function(d) {
            return d.services.length > 0;
        })
            .append("h4")
            .text("Services: ");
        bio.filter(function(d) {
            return d.services.length > 0;
        })
            .append("span")
            .text(function(d, i) {
                return d.services;
            });
        bio.filter(function(d) {
            return d.impact.length > 0;
        })
            .append("h4")
            .text("Mean: ");
        bio.filter(function(d) {
            return d.impact.length > 0;
        })
            .append("span")
            .text(function(d, i) {
                return d.impact;
            });

        let imageHolder = details.append("div").attr("class", "imageHolder");
        imageHolder
            .filter(function(d) {
                return d.confidence.length > 0;
            })
            .append("h4")
            .text("Confidence: ");
        imageHolder
            .filter(function(d) {
                return d.confidence.length > 0;
            })
            .append("span")
            .text(function(d, i) {
                return d.confidence;
            }); */
    },
    methods: {
        avg: function(data) {
            var values = 0;
            var total = 0;
            var holder = 0;
            console.log(data);
            data.forEach(d => {
                holder = data[d].meanl;
                values = values + holder;
                total = ++total;
            });
            return values / total;
        },
        circleChart: function(results, location) {
            // set the dimensions of the canvas
            let margin = { top: 0, right: 0, bottom: 0, left: 0 },
                width = 324 - margin.left - margin.right,
                height = 324 - margin.top - margin.bottom,
                innerRadius = 81,
                outerRadius = 148.5; // the outerRadius goes from the middle of the SVG area to the border, hard coded the radius
            let numTicks = 11; //needs one more than 10 (20% chunks) to get the 0% line
            let sdat = [];

            for (let i = 0; i <= numTicks; i++) {
                sdat[i] = (outerRadius / numTicks) * i;
            }

            // add the SVG element
            //var correctedlocation = "#"
            // correctedlocation = correctedlocation.concat(location)
            let svg = d3
                .select(location)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

            // X scale: common for 2 data series
            let x = d3
                .scaleBand()
                .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
                .align(0) // This does nothing
                .domain(
                    results.map(function(d) {
                        return d.service;
                    })
                ); // The domain of the X axis is the list of impacts.

            // Y scale outer variable
            let y = d3
                .scaleRadial()
                .range([innerRadius, outerRadius]) // Domain will be define later.
                .domain([0, 10]); // Domain of Y is from 0 to the max seen in the data

            // Second barplot Scales
            let ybis = d3
                .scaleRadial()
                .range([innerRadius, 10]) // Domain will be defined later.
                .domain([0, 10]);

            // Add the bars
            svg.append("g")
                .selectAll("path")
                .data(results)
                .enter()
                .append("path")
                .attr("fill", "#43bfc7")
                .attr("class", "yo")
                .attr(
                    "d",
                    d3
                        .arc() // imagine your doing a part of a donut plot
                        .innerRadius(innerRadius)
                        .outerRadius(function(d) {
                            if (d.mean > 0) {
                                return y(d.mean);
                            } else {
                                return y(0);
                            }
                        })
                        .startAngle(function(d) {
                            return x(d.service);
                        })
                        .endAngle(function(d) {
                            return x(d.service) + x.bandwidth();
                        })
                        .padAngle(0.01)
                        .padRadius(innerRadius)
                );

            svg.append("g")
                .selectAll("g")
                .data(results)
                .enter()
                .append("g")
                .attr("text-anchor", function(d) {
                    return (x(d.service) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start";
                })
                .attr("transform", function(d) {
                    if (d.mean < 0) {
                        return (
                            "rotate(" +
                            (((x(d.service) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
                            ")" +
                            "translate(" +
                            (y(0) + 10) +
                            ",0)"
                        );
                    } else {
                        return (
                            "rotate(" +
                            (((x(d.service) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
                            ")" +
                            "translate(" +
                            (y(d.mean) + 10) +
                            ",0)"
                        );
                    }
                })
                .append("text")
                .text(function(d) {
                    return d.service;
                })
                .attr("transform", function(d) {
                    return (x(d.service) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
                        ? "rotate(180)"
                        : "rotate(0)";
                })
                .style("font-size", "11px")
                .attr("alignment-baseline", "middle");

            // Add the second series
            svg.append("g")
                .selectAll("path")
                .data(results)
                .enter()
                .append("path")
                .attr("fill", "#ff2400")
                .attr(
                    "d",
                    d3
                        .arc() // imagine your doing a part of a donut plot
                        .innerRadius(function(d) {
                            return ybis(0);
                        })
                        .outerRadius(function(d) {
                            if (d.mean < 0) {
                                return ybis(d.mean * -1);
                            } else {
                                return ybis(0);
                            }
                        })
                        .startAngle(function(d) {
                            return x(d.service);
                        })
                        .endAngle(function(d) {
                            return x(d.service) + x.bandwidth();
                        })
                        .padAngle(0.01)
                        .padRadius(innerRadius)
                );

            // Adding tick marks
            let circleAxes, i;
            svg.selectAll(".circle-ticks").remove();

            circleAxes = svg
                .selectAll(".circle-ticks")
                .data(sdat)
                .enter()
                .append("svg:g")
                .attr("class", "circle-ticks");

            // radial tick lines
            circleAxes
                .append("svg:circle")
                .attr("r", String)
                .attr("class", "circle")
                .style("stroke", "#CCC")
                .style("opacity", 0.5)
                .style("fill", "none");
        },
        circleLead: function(species, location) {
            this.data2.forEach(
                function(d) {
                    if (d.type == species) {
                        this.circleChart(d.values, location);
                    }
                }.bind(this)
            );
        }
    }
};
</script>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Trirong:100,200";
body {
    font-family: "Trirong", georgia, times, serif;
    font-weight: 200;
    font-size: 18px;
}

body,
a {
    color: #808080;
}

.grid {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    grid-auto-rows: 60px;
    grid-auto-flow: dense;
}

.size1 {
    grid-column-end: span 4; /*<!--Changes the starting size of the blocks-->*/
    grid-row-end: span 4;
}

.size1 h2 {
    font-size: 100%;
}

.char {
    border-radius: 3px;
    padding: 0.5em;
    background-color: #ffffff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
}
.charContent {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.5em;
    margin: auto;
}
.char h2 {
    display: inline-block;
    background-color: rgba(28, 28, 28, 1);
    font-size: 60%;
    line-height: auto;
    color: rgba(210, 210, 210, 1);
    padding: 3px 8px 3px 8px;
}

.open {
    grid-column-end: span 8; /*<!--Changes the size of the popup-->*/
    grid-row-end: span 8;
}

.char h3 {
    font-size: 130%;
    color: rgba(210, 210, 210, 1);
    margin-top: 2px;
    margin-bottom: 6px;
}
.char h4 {
    font-size: 80%;
    color: rgba(202, 173, 45, 1);
    margin-top: 2px;
    margin-bottom: 2px;
}
.details {
    display: none;
    line-height: 80%;
}
.details .bio {
    font-size: 80%;
    padding: 10px;
    text-align: left;
}
.details span {
    font-size: 100%;
    color: rgba(210, 210, 210, 1);
}
.details .imageHolder {
    font-size: 80%;
    padding: 10px;
    text-align: left;
}
.portrait {
    max-height: 100%;
    margin: 0 -200%;
}
.bioLink {
    margin-top: 20px;
}
.bioLink a {
    color: rgba(202, 173, 45, 1);
}

.imageHolder {
    position: relative;
    float: left;
    height: 100%;
    max-width: 450px;
    overflow: hidden;
}

.open .details {
    display: block;
    height: 100%;
}
.open .charContent {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(28, 28, 28, 0.8);
}
.open .charContent h2 {
    display: none;
}

.bar {
    fill: steelblue;
}

.bar:hover {
    fill: brown;
}

.axis {
    font: 10px sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}
</style>
