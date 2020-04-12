<template>
    <body>
        <Loading v-if="loading" />
    </body>
</template>

<script>
import Loading from "@/components/Loading.vue";
import { mapState } from "vuex";
const d3 = Object.assign({}, require("d3"), require("d3-scale"), require("d3-selection"));

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
    methods: {
        wrap(text, width) {
            text.each(function() {
                let text = d3.select(this),
                    words = text
                        .text()
                        .split(/\s+/)
                        .reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    x = text.attr("x"),
                    y = text.attr("y"),
                    dy = 0,
                    tspan = text
                        .text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
                while ((word = words.pop())) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text
                            .append("tspan")
                            .attr("x", -x)
                            .attr("y", -y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
                    }
                }
            });
        },
        circleChart(data, location) {
            let category = data.type;
            let results = data.values;
            // Sort services according to project settings
            results.sort((a, b) => {
                return a.service > b.service ? 1 : b.service > a.service ? -1 : 0;
            });

            // Set dimensions
            let margin = { top: 45, right: 45, bottom: 100, left: 45 },
                width = 360,
                height = 360,
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
                // Gray highlight to hint clickability
                .on("mouseover", function() {
                    let svg = d3.select(this);
                    if (svg.select(".selectedHighlight").empty()) {
                        svg.append("rect")
                            .attr("class", "selectedHighlight")
                            .attr("width", "100%")
                            .attr("height", "100%")
                            .attr("fill", "gray")
                            .attr("opacity", 0.04);
                    }
                })
                .on("mouseleave", function() {
                    d3.selectAll(".selectedHighlight").remove();
                })
                //* Add and remove the nutrition label
                .on("click", function() {
                    d3.selectAll(".selectedHighlight").remove();
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

                        let columnTitles = ["Service", "Impact", "Confidence", "Vs_Peers"];
                        let colorMap = {
                            Similar: "black",
                            Worse: "darkRed",
                            Better: "darkGreen",
                            Much_worse: "red",
                            Much_better: "lightGreen"
                        };
                        let rowData = [];
                        for (let i in data.values) {
                            let row = { Service: data.values[i].service, Impact: data.values[i].mean.toPrecision(2) };
                            const index = bca.map(e => e.service).indexOf(data.values[i].service);

                            let comparator = bca[index].group_mean;
                            let group_mean = (comparator * data.values.length - row.Impact) / (data.values.length - 1);

                            let ratio = Math.abs(group_mean - row.Impact) / group_mean;
                            let vsval;
                            if (ratio < 0.2) {
                                vsval = "Similar";
                            } else if (ratio >= 0.2 && ratio < 0.4) {
                                if (row.Impact < group_mean) {
                                    vsval = "Worse";
                                } else if (row.Impact > group_mean) {
                                    vsval = "Better";
                                }
                            } else if (ratio >= 0.4) {
                                if (row.Impact < group_mean) {
                                    vsval = "Much worse";
                                } else if (row.Impact > group_mean) {
                                    vsval = "Much better";
                                }
                            }
                            row.Vs_Peers = vsval;

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
                            .attr("class", "table-bordered");
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
                    } else {
                        label.remove();
                        svg.select(".nutritionTable").remove();
                    }
                    svg.append("rect")
                        .attr("class", "selectedHighlight")
                        .attr("width", "100%")
                        .attr("height", "100%")
                        .attr("fill", "gray")
                        .attr("opacity", 0.04);
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
                .attr("class", "yo")
                .attr(
                    "d",
                    d3
                        .arc()
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
                .style("stroke", "#CCC")
                .style("opacity", 0.65)
                .style("fill", "none");
            circleAxes
                .append("svg:circle")
                .attr("r", (outerRadius / numTicks) * 1)
                .attr("class", "circle")
                .style("stroke", "#CCC")
                .style("opacity", 0.65)
                .style("fill", "grey");

            //* Add the radial labels
            svg.append("g")
                .attr("class", "labels")
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
                .style("font-size", "0.85rem")
                .style("font-weight", 500)
                .style("font-family", "Nunito")
                .attr("alignment-baseline", "middle")
                .call(this.wrap, 80);

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
                .attr("transform", "translate(" + textWidth / -2 + "," + (height / 2 + 80) + ")")
                .attr("class", "circularChartName")
                .style("font-size", "0.9rem")
                .style("font-weight", 800)
                .style("font-family", "Nunito");
        },
        makeCharts() {
            // Sort aggregate data alphabetically by category, and remove categories according to project settings
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
