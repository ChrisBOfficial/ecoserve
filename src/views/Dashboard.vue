<template>
    <div>
        <Header />
        <div style="min-height:100vh;">
            <b-tabs content-class="mt-2" style="padding: 15vh 3vh 0vh 3vh;" pills align="center">
                <b-tab title="Circular Charts" active>
                    <CircularChart ref="circularRef" :blockOrdering="blockOrdering" :loading="circularLoading" />
                </b-tab>
                <b-tab title="Bar Graphs" lazy>
                    <b-tabs pills card vertical lazy>
                        <b-tab v-for="question in barchartAggregate" :key="question._id" :title="question.service">
                            <h1>{{ question.service }}</h1>

                            <b-container>
                                <BarChart :ref="question._id" :aggregate-data="question" :hidden="false" />
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

                        <BarChart :ref="question._id" :aggregate-data="question" :hidden="true" />
                    </div>
                </b-tab>
                <b-button
                    v-if="!circularLoading"
                    @click="downloadZip"
                    style="max-width: 20%; background-color: darkseagreen; margin: 1rem 1rem;"
                >
                    Download ZIP
                </b-button>
                <b-button
                    v-if="!circularLoading"
                    @click="downloadJSON"
                    style="max-width: 20%; background-color: darkseagreen; margin: 1rem 1rem;"
                >
                    Download Data
                </b-button>
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
        directory: "Bar Graph",
        height: 2200,
        width: 4200
    },
    circleChart: {
        directory: "Circle Graph",
        height: 2700,
        width: 2400
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
            surveyId: "",
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
                state.responses.barchartAggregate.sort((a, b) => (a._id > b._id ? 1 : b._id > a._id ? -1 : 0))
        })
    },
    created() {
        window.scrollTo(0, 0);
        window.onbeforeunload = () => true;
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

        //* Handle survey updates
        this.createHook(this.surveyId);
        this.lastUpdate = Date.now();
        this.socket = io(this.socketUrl);
        this.socket.on(
            this.surveyId,
            function() {
                if (Date.now() - this.lastUpdate >= 500) {
                    console.log("Response received");
                    this.loadData();
                    this.lastUpdate = Date.now();
                }
            }.bind(this)
        );

        // Refresh data every 60 seconds to grab any residual responses
        // this.intervalId = setInterval(
        //     function() {
        //         console.log("INTERVAL");
        //         this.loadData();
        //     }.bind(this),
        //     30000
        // );
    },
    destroyed() {
        clearInterval(this.intervalId);
        this.socket.close();
        window.onbeforeunload = null;
    },
    methods: {
        ...mapActions({
            createHook: "responses/createHook",
            getAggregate: "responses/getAggregateData",
            loadProject: "projects/loadProject"
        }),
        async loadData() {
            try {
                await this.getAggregate({ id: this.surveyId, pipeline: "barchart" });
                await this.getAggregate({ id: this.surveyId, pipeline: "circlechart" });
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
            FileSaver.saveAs(content, "Chart.zip");
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
        },
        async downloadJSON() {
            await this.generateZipFile();

            let exportObj = [];
            const questions = this.barchartAggregate;

            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 4));
            let jsonElement = document.createElement("a");

            jsonElement.setAttribute("href", dataStr);
            jsonElement.setAttribute("download", "summarized.json");
            document.body.appendChild(jsonElement);
            jsonElement.click();
            jsonElement.remove();
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
</style>
