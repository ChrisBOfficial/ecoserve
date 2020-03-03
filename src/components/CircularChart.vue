<template>
    <body>
        <Loading v-if="loading" />
    </body>
</template>

<script>
import Loading from "@/components/Loading.vue";
import { mapState, mapActions } from "vuex";
const io = require("socket.io-client");
const d3 = Object.assign({}, require("d3"), require("d3-scale"), require("d3-selection"));

export default {
    name: "CircularChart",
    components: {
        Loading
    },
    data() {
        return {
            socket: {},
            lastUpdate: 0,
            surveyId: "",
            intervalId: Number,
            loading: false,
            blockOrdering: {}
        };
    },
    computed: {
        ...mapState({
            circleAggregate: state => state.responses.circleAggregate,
            socketUrl: state => state.responses.url,
            project: state => state.projects.project
        })
    },
    mounted() {
        this.surveyId = this.$route.query.id.split("+")[1];
        this.loadProject(this.$route.query.id).then(() => {
            // Determine service order according to project settings
            for (let i = 0; i < this.project.blocks.length; i++) {
                this.blockOrdering[this.project.blocks[i].title] = i;
            }
            this.loading = true;
            this.getAggregate({ id: this.surveyId, pipeline: "circlechart" }).then(() => {
                this.loading = false;
                this.makeCharts();
            });
        });

        this.createHook(this.surveyId);
        this.lastUpdate = Date.now();
        this.socket = io(this.socketUrl, { transports: ["polling"] });
        this.socket.on(
            this.surveyId,
            function() {
                if (Date.now() - this.lastUpdate >= 500) {
                    this.getAggregate({ id: this.surveyId, pipeline: "circlechart" })
                        .then(() => {
                            console.log("Response received");
                            this.makeCharts();
                        })
                        .catch(() => {
                            this.showToast();
                        });
                    this.lastUpdate = Date.now();
                }
            }.bind(this)
        );

        // Refresh data every 60 seconds to grab any residual responses
        /* this.intervalId = setInterval(
            function() {
                console.log("INTERVAL");
                this.getAggregate({ id: this.surveyId, pipeline: "circlechart" }).catch(err => {
                    throw new Error(err);
                });
            }.bind(this),
            30000
        ); */
    },
    destroyed() {
        clearInterval(this.intervalId);
        this.socket.close();
    },
    methods: {
        ...mapActions({
            createHook: "responses/createHook",
            getAggregate: "responses/getAggregateData",
            loadProject: "projects/loadProject"
        }),
        circleChart(data, location) {
            let category = data.type;
            let results = data.values;
            // Sort services according to project settings
            results.sort((a, b) => {
                return this.blockOrdering[a.service] - this.blockOrdering[b.service];
            });

            // Set dimensions
            let margin = { top: 0, right: 0, bottom: 40, left: 0 },
                width = 360,
                height = 360,
                innerRadius = 90,
                outerRadius = 165;
            let numTicks = 11; //needs one more than 10 (20% chunks) to get the 0% line
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
                .on("click", function() {
                    let svg = d3.select(this);
                    let label = svg.select(".nutritionLabel");

                    // Only add nutrition label if none are present
                    if (label.empty()) {
                        svg.append("g")  
                        /*
                        svg.append("rect")
                            .attr("class", "nutritionLabel")
                            .attr("width", "100%")
                            .attr("height", "100%")
                            .attr("fill", "white")
                            .attr("stroke", "black")
                            .attr("stroke-width", 5);
                        svg.selectAll('rect')
                        .data(data)
                        .enter("rect")
                        */
                    
                    let thead = svg.append( "thead" );
                    let tbody = svg.append( "tbody" );
                             

                // append the header row
                thead.append( "tr" )
                    .selectAll( "tr" )
                    .data( data )
                    .enter()
                    .append( "th" )
                    .text( function ( data ) { return d.service; } );

                // create a row for each object in the data
                var rows = tbody.selectAll( "tr" )
                    .data( data )
                    .enter()
                    .append( "tr" );

                // create a cell in each row for each column
                var cells = rows.selectAll( "td" )
                    .data( function ( row ) {
                        return columns.map( function ( column ) {
                            return { column: column, mean: row[column] };
                        } );
                    } )
                    .enter()
                    .append( "td" )
                    .attr( "style", "font-family: 'Lato'" )
                    .attr("style", "padding: 2px;")
                        .html( function ( d ) {
                            return d.mean;
                        })
                        // Re-add highlight
                        svg.select(".selectedHighlight").remove();
                        svg.append("rect")
                            .attr("class", "selectedHighlight")
                            .attr("width", "100%")
                            .attr("height", "100%")
                            .attr("fill", "gray")
                            .attr("opacity", 0.04);
                    } else {
                        label.remove();
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
                .attr("fill", "#43bfc7")
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
                .attr("alignment-baseline", "middle");

            //! Used to calculate text width for centering labels, not intended to be rendered
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
                .attr("transform", "translate(" + textWidth / -2 + "," + (height / 2 + 20) + ")")
                .style("font-size", "0.9rem")
                .style("font-weight", 800)
                .style("font-family", "Nunito");
        },
        makeCharts() {
            // Sort aggregate data alphabetically by category, and remove categories according to project settings
            const sortedData = this.circleAggregate.sort((a, b) => a.type.localeCompare(b.type));
            for (let [i, data] of sortedData.entries()) {
                // Abandon hope all ye who enter here
                for (let j = 0; j < data.values.length; j++) {
                    if (!this.project.blocks.some(e => e.title === data.values[j].service)) {
                        sortedData[i].values.splice(j, 1);
                        j--;
                    } else {
                        for (const block of this.project.blocks) {
                            if (block.title === data.values[j].service && !block.visuals.includes("Bullseyes")) {
                                sortedData[i].values.splice(j, 1);
                                j--;
                            }
                        }
                    }
                }
            }

            d3.selectAll("svg").remove();
            let grid = d3
                .select("body")
                .append("div")
                .attr("id", "grid")
                .attr("class", "grid");
            let chars = grid
                .selectAll("div")
                .data(sortedData)
                .enter()
                .append("div")
                .attr("class", "char");
            chars.style(
                "fill",
                function(d) {
                    this.circleChart(d, this.$el);
                }.bind(this)
            );
        },
        showToast() {
            this.$bvToast.toast("Bad data in survey response, will manually re-fetch in 30 seconds", {
                title: "Warning",
                toaster: "b-toaster-bottom-right",
                variant: "danger",
                solid: true,
                autoHideDelay: 5000,
                noCloseButton: true
            });
        }
    }
};
</script>

<style scoped>
body {
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
