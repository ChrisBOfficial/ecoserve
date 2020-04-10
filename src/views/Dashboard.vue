<template>
    <div>
        <Header />
        <div style="min-height:100vh;">
            <b-tabs content-class="mt-2" style="padding: 140px 2rem 0vh 2rem;" pills align="center">
                <b-tab title="Circular Charts" active>
                    <CircularChart ref="circularRef" :blockOrdering="blockOrdering" :loading="circularLoading" :bcagg="barchartAggregate"/>
                </b-tab>
                <b-tab title="Bar Charts">
                    <b-tabs pills card vertical>
                        <b-tab v-for="question in barchartAggregate" :key="question._id" :title="question.service">
                            <h1 style="margin-left: 5rem;">{{ question.service }}</h1>

                            <b-container>
                                <BarChart
                                    :ref="question._id"
                                    :aggregate-data="question"
                                    :bardomain="getBarDomain(barchartAggregate)"
                                />
                            </b-container>
                        </b-tab>
                    </b-tabs>
                </b-tab>
                <b-tab disabled>
                    <div
                        v-for="question in barchartAggregate"
                        :key="question._id"
                        :title="question.service"
                        class="barChartName"
                    >
                        <h3>{{ question.service }}</h3>

                        <BarChart
                            :ref="question._id"
                            :aggregate-data="question"
                            :bardomain="getBarDomain(barchartAggregate)"
                        />
                    </div>
                </b-tab>
                <div v-if="staticView">
                    <b-button
                        @click="downloadZip"
                        style="max-width: 20%; background-color: darkseagreen; margin: 1rem 1rem;"
                    >
                        Download ZIP
                    </b-button>
                    <b-button
                        @click="downloadJSON"
                        style="max-width: 20%; background-color: darkseagreen; margin: 1rem 1rem;"
                    >
                        Download Data
                    </b-button>
                    <div @click="sharePage" class="btn btn-outline btn-xl">Share this page</div>
                </div>
            </b-tabs>
        </div>

        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BarChart from "@/components/BarChart.vue";
import CircularChart from "@/components/CircularChart.vue";
import { mapState, mapActions } from "vuex";

const d3 = Object.assign({}, require("d3"), require("d3-scale"));
const FileSaver = require("file-saver");
const JSZip = require("jszip");
const io = require("socket.io-client");

const exportSettings = {
    default: {
        directory: "Default",
        height: 2700,
        width: 2400
    },
    barChart: {
        directory: "Bar Graphs",
        height: 400,
        width: 800
    },
    circleChart: {
        directory: "Circle Graphs",
        height: 410,
        width: 410
    }
};

export default {
    name: "dashboard",
    components: {
        CircularChart,
        Header,
        Footer,
        BarChart
    },
    data() {
        return {
            zipFile: new JSZip(),
            circularLoading: true,
            socket: {},
            lastUpdate: 0,
            surveyId: String,
            blockOrdering: {},
            intervalId: Number
        };
    },
    computed: {
        ...mapState({
            socketUrl: state => state.responses.url,
            project: state => state.projects.project,
            barchartAggregate: state =>
                // Sort categories alphabetically
                state.responses.barchartAggregate.sort((a, b) =>
                    a.service > b.service ? 1 : b.service > a.service ? -1 : 0
                )
        }),
        staticView: function() {
            return !this.circularLoading && this.$route.query.view !== "static";
        }
    },
    created() {
        window.scrollTo(0, 0);
    },
    mounted() {
        this.surveyId = this.$route.query.id.split("+")[1];
        this.loadProject(this.$route.query.id).then(() => {
            // Determine service order according to project settings
            for (let i = 0; i < this.project.blocks.length; i++) {
                this.blockOrdering[this.project.blocks[i].title] = i;
            }
            this.loadData();
        });

        if (this.$route.query.view !== "static") {
            //* Handle survey updates
            this.createHook(this.surveyId);
            this.lastUpdate = Date.now();
            this.socket = io(this.socketUrl);
            this.socket.on(
                this.surveyId,
                function() {
                    console.log("Response received");
                    if (Date.now() - this.lastUpdate >= 500) {
                        console.log("Updating...");
                        this.loadData();
                        this.lastUpdate = Date.now();
                    }
                }.bind(this)
            );

            //* Refresh data every 30 seconds to grab any residual responses
            // if (process.env.NODE_ENV === "production") {
            //     this.intervalId = setInterval(
            //         function() {
            //             console.log("INTERVAL");
            //             this.loadData();
            //         }.bind(this),
            //         30000
            //     );
            // }
        }
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
        async loadData() {
            try {
                await this.getAggregate({ id: this.surveyId, pipeline: "barchart", mode: this.$route.query.view });
                await this.getAggregate({ id: this.surveyId, pipeline: "circlechart", mode: this.$route.query.view });
                this.circularLoading = false;

                this.$refs.circularRef.makeCharts();
                d3.selectAll(".barChart").remove();
                for (const ref in this.$refs) {
                    if (ref !== "circularRef" && this.$refs[ref].length > 0) {
                        this.$refs[ref][0].makeChart();
                    }
                }
            } catch (_) {
                this.showToast();
            }
        },
        // Add images to the zip file
        async addImageToZipFile(image, type, name) {
            const vm = this;

            type = Object.prototype.hasOwnProperty.call(exportSettings, type) ? type : "default";
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.height = exportSettings[type].height;
            canvas.width = exportSettings[type].width;

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, exportSettings[type].width, exportSettings[type].height);
            ctx.drawImage(image, 0, 0, exportSettings[type].width, exportSettings[type].height);

            const blob = await vm.canvasToBlob(canvas);
            vm.zipFile.folder(exportSettings[type].directory).file(`${name}.png`, blob);
        },
        // Convert canvas element to blob
        canvasToBlob(canvas) {
            return new Promise(resolve => {
                canvas.toBlob(blob => resolve(blob));
            });
        },
        // Get chart data for d3 svgs
        getSvgChartData() {
            const charts = [];

            const svgs = [];
            d3.selectAll("svg")._groups.forEach(group => {
                group.forEach(element => {
                    svgs.push(element);
                });
            });

            const serializer = new XMLSerializer();
            svgs.forEach(svg => {
                const chart = {};

                if (svg.classList.contains("circleChart")) {
                    chart.type = "circleChart";
                    chart.name = svg.querySelector("text.circularChartName").textContent;
                } else if (svg.classList.contains("barChart")) {
                    chart.type = "barChart";
                    chart.name = svg.closest(".barChartName, .tab-pane").querySelector("h1, h3").textContent;
                }

                const serialized = serializer
                    .serializeToString(svg)
                    .replace(/(\w+)?:?xlink=/g, "xmlns:xlink=")
                    .replace(/NS\d+:href/g, "xlink:href");
                chart.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(serialized)))}`;
                charts.push(chart);
            });

            return charts;
        },
        // Load an image
        loadImage(src) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error("load image failed"));
                image.src = src;
            });
        },
        // Generate zip file
        async generateZipFile() {
            const vm = this;

            const charts = vm.getSvgChartData();
            const process = charts.map(chart => {
                return vm.loadImage(chart.src).then(async image => {
                    await vm.addImageToZipFile(image, chart.type, chart.name);
                });
            });

            return Promise.all(process);
        },
        // Download the zip file
        async downloadZip() {
            await this.generateZipFile();
            const content = await this.zipFile.generateAsync({ type: "blob" });
            FileSaver.saveAs(content, "Charts.zip");
        },
        getBarDomain(data) {
            let max = 0;
            let projectData = this.project.comparisonData;
            for (let i = 0; i < data.length; i++) {
                if (Math.abs(data[i].group_mean) > max) {
                    max = Math.abs(data[i].group_mean);
                }
            }
            for (let j = 0; j < projectData.length; j++) {
                for (let k = 0; k < projectData[j].data.length; k++) {
                    if (Math.abs(projectData[j].data[k].max) > max) {
                        max = Math.abs(projectData[j].data[k].max);
                    }
                }
            }
            return Math.ceil(max);
        },
        showToast() {
            this.$bvToast.toast("Bad data in survey response, will manually re-fetch in 30 seconds", {
                toaster: "b-toaster-bottom-right",
                variant: "warning",
                solid: true,
                noCloseButton: true
            });
        },
        async downloadJSON() {
            const questions = this.barchartAggregate;

            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 4));
            let jsonElement = document.createElement("a");

            jsonElement.setAttribute("href", dataStr);
            jsonElement.setAttribute("download", "summarized.json");
            document.body.appendChild(jsonElement);
            jsonElement.click();
            jsonElement.remove();
        },
        sharePage() {
            this.$bvToast.toast("URL copied to clipboard!", {
                toaster: "b-toaster-bottom-right",
                variant: "info",
                solid: true,
                noCloseButton: true,
                autoHideDelay: 1250,
                noHoverPause: true
            });
            var linkText = document.createElement("textArea");
            linkText.value = window.location.href.slice(0, -4) + "static";

            // Avoid scrolling to bottom
            linkText.style.top = "0";
            linkText.style.left = "0";
            linkText.style.position = "fixed";

            document.body.appendChild(linkText);
            linkText.focus();
            linkText.select();
            document.execCommand("copy");

            document.body.removeChild(linkText);
        }
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";

::v-deep .nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
    background-color: darkseagreen !important;
}

.btn-outline {
    color: black;
    border: 1px solid;
    border-color: lightgray;
    float: right;
    margin: 22px 1rem 0 0;
}

.btn-outline:hover,
.btn-outline:active {
    color: white;
    border-color: darkseagreen;
    background-color: darkseagreen;
}

.btn {
    border-radius: 300px;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.btn-xl {
    font-size: 11px;
    padding: 15px 45px;
}
</style>
