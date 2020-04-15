<template>
    <div />
</template>

<script>
import { mapState } from "vuex";
const d3 = Object.assign(
    {},
    require("d3"),
    require("d3-scale"),
    require("d3-array"),
    require("d3-selection"),
    require("d3-axis"),
    require("d3-transition")
);

export default {
    props: ["aggregateData", "bardomain"],
    computed: {
        ...mapState({
            project: state => state.projects.project
        })
    },
    methods: {
        makeChart() {
            let margin = { top: 20, right: 20, bottom: 50, left: 70 };
            let width = 650 - margin.left - margin.right;
            let height = 325 - margin.top - margin.bottom;
            let svg = d3
                .select(this.$el)
                .append("svg")
                .attr("class", "barChart")
                .attr("height", 400)
                .attr("width", 800);

            let data = this.aggregateData.data.sort((a, b) =>
                a.subquestion > b.subquestion ? 1 : b.subquestion > a.subquestion ? -1 : 0
            );

            let x = d3
                .scaleBand()
                .rangeRound([0, width])
                .padding(0.1)
                .domain(data.map(d => d.subquestion));
            let y = d3
                .scaleLinear()
                .rangeRound([height, 0])
                .domain([-this.bardomain, this.bardomain]);
            //-(d3.max(data, d => Math.abs(d.mean))), d3.max(data, d =>  Math.abs(d.mean))
            let xAxis = d3.axisBottom(x);
            let yAxis = d3.axisLeft(y).ticks(11);

            function addRectsWithName(elem, vm) {
                //* Add X axis
                elem.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + y(0) + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .style("fill", "black")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "translate(0, 133) rotate(-45)");

                //* Add Y axis
                elem.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 3)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end");

                //* Add rectangles
                elem.selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
                    // We add attr here
                    .attr("fill", d => {
                        if (d.confidence_num > 2) {
                            return "#333BFF";
                        } else if (d.confidence_num <= 2 && d.confidence_num > 0) {
                            return "#FFC300";
                        } else if (d.confidence_num <= 0 && d.confidence_num > -2) {
                            return "#FF5733";
                        } else if (d.confidence_num <= -2) {
                            return "#C70039";
                        } else {
                            return "green";
                        }
                    })
                    .attr("x", d => x(d.subquestion))
                    .attr("class", d => d.subquestion)
                    .attr("y", d => (d.mean <= 0 ? y(0) : y(d.mean)))
                    .attr("width", x.bandwidth())
                    .transition()
                    .delay((d, i) => {
                        return i * 100;
                    })
                    .duration(1000)
                    .attr("height", d => (d.mean <= 0 ? y(d.mean) - y(0) : y(0) - y(d.mean)));

                //* Add overlays
                if (vm.project.comparisonData.length > 0) {
                    let comparisonData = {};
                    for (const data of vm.project.comparisonData) {
                        if (data.questionName === vm.aggregateData.service) {
                            comparisonData = data.data;
                            break;
                        }
                    }

                    elem.selectAll("rect2")
                        .data(comparisonData)
                        .enter()
                        .append("rect")
                        .attr("fill", "grey")
                        .attr("stroke", "black")
                        .attr("fill-opacity", 0.35)
                        .attr("x", d => x(d.subname) + 10)
                        .attr("class", d => d.subname)
                        .attr("y", d => y(d.max))
                        .attr("width", x.bandwidth() - 20)
                        .transition()
                        .delay((d, i) => {
                            return i * 150;
                        })
                        .duration(1000)
                        .attr("height", d => y(d.min) - y(d.max));
                }
            }

            svg.append("g")
                .attr("id", "bars-style")
                .attr("transform", "translate(80, 20)")
                .call(addRectsWithName, this);

            // LEGEND
            let keys = ["None", "Low", "Moderate", "High", "Extreme"]
            let color = d3.scaleOrdinal()
                .domain(keys)
                .range(["#333BFF", "#FFC300", "#FF5733", "#C70039", "green"]);
            let legend = "Confidence";
            let size = 20
            svg.selectAll("mytitle")
                .data(legend)
                .enter()
                .append("text")
                .attr("x", width +120)
                .attr("y", 75)
                .style("fill", "black")
                .text(legend)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
            // Add one dot in the legend for each name.
            svg.selectAll("mydots")
                .data(keys)
                .enter()
                .append("rect")
                .attr("x", width +120)
                .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 first dot, 25 distance
                .attr("width", size)
                .attr("height", size)
                .style("fill", function(d){ return color(d)})
            // Add one label in the legend for each name.
            svg.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", width +120+ size*1.2)
                .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 first dot, 25 distance
                .style("fill", function(d){ return color(d)})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

        }
    }
};
</script>

<style>
.axis {
    font: 16px sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}
</style>
