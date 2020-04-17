<template>
    <body>
        <Loading v-if="loading" />
    </body>
</template>

<script>
import Loading from "@/components/Loading.vue";
import { mapState } from "vuex";
import { event as currentEvent } from "d3-selection";
const d3 = Object.assign({}, require("d3"), require("d3-scale"), require("d3-selection"));

let tooltipDiv;

export default {
    name: "CircularChart",
    props: ["loading"],
    components: {
        Loading
    },
    computed: {
        ...mapState({
            circleAggregate: state => state.responses.circleAggregate,
            barchartAggregate: state => state.responses.barchartAggregate,
            project: state => state.projects.project
        })
    },
    mounted() {
        tooltipDiv = d3
            .select(this.$el)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    },
    methods: {
        circleChart(data, location) {
            let category = data.type;
            let results = data.values;
            // Sort services according to project settings
            results.sort((a, b) => {
                return a.service > b.service ? 1 : b.service > a.service ? -1 : 0;
            });

            // Set dimensions
            let margin = { top: 10, right: 10, bottom: 30, left: 10 },
                width = 310,
                height = 310,
                innerRadius = 76,
                outerRadius = 140;
            let numTicks = 11;
            let sdat = [];

            for (let i = 0; i <= numTicks; i++) {
                sdat[i] = (outerRadius / numTicks) * i;
            }

            // X scale
            let x = d3
                .scaleBand()
                .range([0, 2 * Math.PI])
                .domain(
                    results.map(function(d) {
                        return d.service;
                    })
                ); // The domain of the X axis is the list of services

            // Y scale
            let y = d3
                .scaleRadial()
                .range([innerRadius, outerRadius])
                .domain([0, 10]); // Domain of Y is from 0 to the max seen in the data

            // Second barplot Scales
            let ybis = d3
                .scaleRadial()
                .range([innerRadius, 10])
                .domain([0, 10]);

            let bca = this.barchartAggregate;
            //* Add the SVG element
            let svg = d3
                .select(location)
                .append("svg")
                .attr("class", "circleChart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                //* Add and remove the nutrition label
                .on("click", function() {
                    let svg = d3.select(this);
                    let label = svg.select(".nutritionLabel");

                    if (label.empty()) {
                        svg.append("rect")
                            .attr("class", "nutritionLabel")
                            .attr("width", "100%")
                            .attr("height", "100%")
                            .attr("fill", "white");
                        svg.selectAll("rect")
                            .data(data)
                            .enter("rect");

                        let columnTitles = ["Service", "Impact", "Confidence", "Comparative_Impact"];
                        let colorMap = {
                            Similar: "black",
                            Worse: "darkRed",
                            Better: "darkGreen",
                            Much_worse: "red",
                            Much_better: "lightGreen"
                        };
                        let rowData = [];
                        for (let i in data.values) {
                            let row = { Service: data.values[i].service };
                            const index = bca.map(e => e.service).indexOf(data.values[i].service);
                            let questionId = bca[index]._id;
                            let choices = bca[index].c;
                            let choice = [];
                            for (let j = 0; j < choices.length; j++) {
                                if (choices[j].QID == questionId) {
                                    choice = choices[j].impactText;
                                }
                            }
                            //Impact: data.values[i].mean.toPrecision(2)
                            let impactNum = data.values[i].mean.toPrecision(2);
                            let impactText = "";
                            for (let k = 0; k < choice.length - 1; k++) {
                                if (impactNum >= parseFloat(choice[k][0]) && impactNum < parseFloat(choice[k + 1][0])) {
                                    impactText = choice[k][1].concat(", ", impactNum.toString());
                                    break;
                                } else {
                                    impactText = choice[choice.length - 1][1].concat(", ", impactNum.toString());
                                }
                            }
                            row.Impact = impactText;
                            let comparator = bca[index].group_mean;
                            let group_mean = (comparator * data.values.length - impactNum) / (data.values.length - 1);

                            let ratio = Math.abs(group_mean - impactNum) / group_mean;
                            let vsval;
                            if (ratio < 0.2) {
                                vsval = "Similar";
                            } else if (ratio >= 0.2 && ratio < 0.4) {
                                if (impactNum < group_mean) {
                                    vsval = "Worse";
                                } else if (impactNum > group_mean) {
                                    vsval = "Better";
                                }
                            } else if (ratio >= 0.4) {
                                if (impactNum < group_mean) {
                                    vsval = "Much worse";
                                } else if (impactNum > group_mean) {
                                    vsval = "Much better";
                                }
                            }
                            row.Comparative_Impact = vsval;

                            let bca1 = bca[index].data;
                            const index2 = bca1.map(e => e.subquestion).indexOf(data.type);
                            row.Confidence = bca1[index2].confidence;
                            rowData.push(row);
                        }

                        let table = svg
                            .append("svg:foreignObject")
                            .attr("width", "100%")
                            .attr("height", "100%")
                            .attr("class", "nutritionTable")
                            .append("xhtml:body")
                            .append("table")
                            .attr("width", "100%")
                            .attr("class", "table-bordered")
                            .style("margin-top", (450 - (rowData.length + 1) * 28) / 2 + "px");
                        let thead = table.append("thead");
                        let tbody = table.append("tbody");

                        // append the header row
                        thead
                            .append("tr")
                            .selectAll("th")
                            .data(columnTitles)
                            .enter()
                            .append("th")
                            .text(d => {
                                return d.replace("_", " ");
                            });

                        // create a row for each object in the data
                        var rows = tbody
                            .selectAll("tr")
                            .data(rowData)
                            .enter()
                            .append("tr");
                        // create a cell in each row for each column
                        rows.selectAll("td")
                            .data(function(rowData) {
                                return columnTitles.map(function(column) {
                                    return { column: column, value: rowData[column] };
                                });
                            })
                            .enter()
                            .append("td")
                            .text(function(d) {
                                return d.value;
                            })
                            .style("color", function(d) {
                                return colorMap[d.value.replace(" ", "_")];
                            });
                        svg.attr("height", 505).attr("width", 490);
                    } else {
                        label.remove();
                        svg.select(".nutritionTable").remove();
                        svg.attr("height", 350).attr("width", 330);
                    }
                })
                .append("g")
                .attr("class", "circleContainer")
                .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

            //* Add the positive bars
            svg.append("g")
                .attr("class", "positiveBars")
                .selectAll("path")
                .data(results)
                .enter()
                .append("path")
                .attr("fill", "#397429")
                .attr(
                    "d",
                    d3
                        .arc()
                        .innerRadius(innerRadius)
                        .outerRadius(function(d) {
                            if (d.mean > 0) {
                                let scaler = bca[0].c[1].re;
                                let adjustedMean = (d.mean / scaler) * 10;
                                return y(adjustedMean);
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
                )
                .on("mouseover", function(d) {
                    tooltipDiv
                        .html(d.service)
                        .style("opacity", 0.9)
                        .style("left", currentEvent.pageX + "px")
                        .style("top", currentEvent.pageY - 28 + "px");
                })
                .on("mouseout", function() {
                    tooltipDiv.style("opacity", 0);
                });

            //* Add the negative bars
            svg.append("g")
                .attr("class", "negativeBars")
                .selectAll("path")
                .data(results)
                .enter()
                .append("path")
                .attr("fill", "#ff2400")
                .attr(
                    "d",
                    d3
                        .arc()
                        .innerRadius(function() {
                            return ybis(0);
                        })
                        .outerRadius(function(d) {
                            if (d.mean < 0) {
                                let scaler = bca[0].c[1].re;
                                let adjustedMean = (d.mean / scaler) * 10 * -1;
                                return ybis(adjustedMean);
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
                )
                .on("mouseover", function(d) {
                    tooltipDiv
                        .html(d.service)
                        .style("opacity", 0.9)
                        .style("left", currentEvent.pageX + "px")
                        .style("top", currentEvent.pageY - 28 + "px");
                })
                .on("mouseout", function() {
                    tooltipDiv.style("opacity", 0);
                });

            svg.selectAll(".circle-tick").remove(); // Makes ticks visible within bars
            //* Add tick marks
            let circleAxes = svg
                .selectAll(".circle-tick")
                .data(sdat)
                .enter()
                .append("svg:g")
                .attr("class", "circle-tick");

            //* Add radial tick lines
            circleAxes
                .append("svg:circle")
                .attr("r", String)
                .attr("class", "circle")
                .style("stroke", "white")
                .style("opacity", 0.65)
                .style("fill", "none");
            circleAxes
                .append("svg:circle")
                .attr("r", (outerRadius / numTicks) * 1)
                .attr("class", "circle")
                .style("opacity", 0.65)
                .style("fill", "white");

            //! Used to calculate text width for centering labels, not actually rendered
            let textWidth = 0;
            svg.append("text")
                .text(category)
                .attr("opacity", 0.0)
                .style("font-size", "0.9rem")
                .style("font-weight", 800)
                .style("font-family", "Nunito")
                .each(function() {
                    textWidth = this.getComputedTextLength();
                    this.remove();
                });

            //* Add the chart label
            svg.append("text")
                .text(category)
                .attr("transform", "translate(" + textWidth / -2 + "," + height / 2 + ")")
                .attr("class", "circularChartName")
                .style("font-size", "0.9rem")
                .style("font-weight", 800)
                .style("font-family", "Nunito");
        },
        makeCharts() {
            // Sort aggregate data alphabetically by category and remove categories according to project settings
            const sortedData = this.circleAggregate.sort((a, b) => a.type.localeCompare(b.type));
            // Asymptotically efficient code is for suckers
            let prunedData = [];
            for (let dataObj of sortedData) {
                let newObj = { _id: dataObj._id, type: dataObj.type, values: [] };
                for (let serviceObj of dataObj.values) {
                    for (let block of this.project.blocks) {
                        if (serviceObj.service === block.title && block.visuals.includes("Flower diagrams")) {
                            newObj.values.push(serviceObj);
                        }
                    }
                }
                prunedData.push(newObj);
            }

            d3.selectAll(".circleChart").remove();
            let grid = d3.select("body");
            let chars = grid.selectAll("div").data(prunedData);
            chars.style(
                "fill",
                function(d) {
                    this.circleChart(d, this.$el);
                }.bind(this)
            );
        }
    }
};
</script>

<style scoped>
::v-deep div.tooltip {
    position: absolute;
    text-align: center;
    padding: 2px;
    font: 18px;
    font-family: Nunito;
    background: lightgray;
    pointer-events: none;
}
</style>
