<template>
    <div :id="this.ind" class="svg-container" align="center">
        <h3>{{ title + " " + ind }}</h3>
        <svg v-if="redrawToggle === true" :width="svgWidth" :height="svgHeight">
            <g>
                <rect
                    v-for="item in data"
                    :class="item[conf]"
                    :key="item[xKey]"
                    :x="xScale(item[xKey])"
                    :y="yScale(0)"
                    :width="xScale.bandwidth()"
                    :height="0"
                ></rect>
            </g>
        </svg>
    </div>
</template>

<script>
import { scaleLinear, scaleBand } from "d3-scale";
import { max, min } from "d3-array";
import { selectAll } from "d3-selection";
import { transition } from "d3-transition";
const d3 = Object.assign(
    {},
    require("d3"),
    require("d3-scale"),
    require("d3-array"),
    require("d3-selection"),
    require("d3-transition")
);

export default {
    name: "BarChart",
    props: {
        title: String,
        conf: String,
        xKey: String,
        yKey: String,
        data: Array,
        ind: Number
    },
    mounted() {
        var elementID = this.ind;
        console.log(elementID);
        this.svgWidth = document.getElementById(elementID).offsetWidth * 0.75;
        this.AddResizeListener();
        this.AnimateLoad();
    },
    data: () => ({
        svgWidth: 0,
        redrawToggle: true,
        title: String,
        conf: String,
        xKey: String,
        yKey: String,
        data: Array,
        ind: Number
    }),
    methods: {
        AnimateLoad() {
            selectAll("rect")
                .data(this.data)
                .transition()
                .delay((d, i) => {
                    return i * 150;
                })
                .duration(1000)
                .attr("y", d => {
                    return this.yScale(d[this.yKey]);
                })
                .attr("height", d => {
                    return this.svgHeight - this.yScale(d[this.yKey]);
                });
            console.log(this.data);
            console.log(this.ind);
        },
        AddResizeListener() {
            // redraw the chart 300ms after the window has been resized
            window.addEventListener("resize", () => {
                this.$data.redrawToggle = false;
                setTimeout(() => {
                    this.$data.redrawToggle = true;
                    var elementID = this.ind;

                    this.$data.svgWidth = document.getElementById(elementID).offsetWidth * 0.75;
                    this.AnimateLoad();
                }, 300);
            });
        }
    },
    computed: {
        dataMax() {
            return max(this.data, d => {
                return d[this.yKey];
            });
        },
        dataMin() {
            return min(this.data, d => {
                return d[this.yKey];
            });
        },
        xScale() {
            return scaleBand()
                .rangeRound([0, this.svgWidth])
                .padding(0.1)
                .domain(
                    this.data.map(d => {
                        return d[this.xKey];
                    })
                );
        },
        yScale() {
            return scaleLinear()
                .rangeRound([this.svgHeight, 0])
                .domain([this.dataMin > 0 ? 0 : this.dataMin, this.dataMax]);
        },
        svgHeight() {
            return this.svgWidth / 1.61803398875; // golden ratio
        }
    }
};
</script>

<style scoped>
.none {
    fill: red;
    transition: r 0.2s ease-in-out;
}

.none:hover {
    fill: darkolivegreen;
}
.low {
    fill: black;
    transition: r 0.2s ease-in-out;
}

.low:hover {
    fill: palevioletred;
}
.moderate {
    fill: green;
    transition: r 0.2s ease-in-out;
}

.moderate:hover {
    fill: blueviolet;
}
.high {
    fill: steelblue;
    transition: r 0.2s ease-in-out;
}

.high:hover {
    fill: turquoise;
}
.extreme {
    fill: lightseagreen;
    transition: r 0.2s ease-in-out;
}

.extreme:hover {
    fill: midnightblue;
}
.svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 1%;
    vertical-align: top;
    overflow: hidden;
}
</style>
