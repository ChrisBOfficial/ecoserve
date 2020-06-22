<template>
    <div>
        <Header />
        <div id="dashboardContainer">
            <b-tabs content-class="mt-2" style="padding: 140px 2rem 0vh 2rem;" pills align="center">
                <b-tab active>
                    <template v-slot:title>About</template>
                    <div style="margin: 50px auto;">
                        <h4 style="text-align: center;">{{ projectName }}</h4>
                        <h5 v-if="this.$route.query.view !== 'static'" style="text-align: center;">
                            {{ project.description }}
                        </h5>

                        <p v-if="this.$route.query.view !== 'static'" style="margin-top: 30px; text-align: center;">
                            <strong>Survey link: </strong>{{ surveyLink }}
                        </p>
                    </div>
                </b-tab>
                <b-tab title="Flower diagrams">
                    <CircularChart ref="circularRef" :loading="circularLoading" />
                </b-tab>
                <b-tab title="Bar charts">
                    <b-tabs pills card vertical>
                        <b-tab v-for="question in barchartAggregate" :key="question._id" :title="question.service">
                            <h1 style="margin-left: 5rem;">{{ question.service }}</h1>

                            <BarChart
                                :ref="question._id"
                                :aggregate-data="question"
                                :bardomain="getBarDomain(question)"
                                :legendLabel="legendLabel"
                            />
                            <h3 class="axisText">{{ axisLabel }}</h3>
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

                        <BarChart :ref="question._id" :aggregate-data="question" :bardomain="getBarDomain(question)" />
                    </div>
                </b-tab>
            </b-tabs>
        </div>
        <div v-if="liveView">
            <b-button @click="downloadZip" style="max-width: 20%; background-color: darkseagreen; margin: 1rem 1rem;">
                {{ downloadText }}
            </b-button>
            <b-button @click="downloadCSV" style="max-width: 20%; background-color: darkseagreen; margin: 1rem 1rem;">
                Download Data
            </b-button>
            <b-form-input
                v-model.trim="axisLabel"
                placeholder="Enter y-axis label"
                style="max-width: 15%;"
            ></b-form-input>
            <b-form-input
                v-model.trim="legendLabel"
                placeholder="Enter the legend's label"
                style="margin-left: 20px; max-width: 15%;"
            ></b-form-input>
            <div @click="sharePage" class="btn btn-outline btn-xl">Share this page</div>
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
        directory: "Bar charts",
        height: 3500,
        width: 7000
    },
    circleChart: {
        directory: "Flower diagrams",
        height: 6080,
        width: 5280
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
            axisLabel: "",
            legendLabel: "",
            zipFile: new JSZip(),
            downloadText: "DOWNLOAD ZIP",
            circularLoading: true,
            socket: {},
            lastUpdate: 0,
            projectName: String,
            surveyId: String,
            surveyLink: String
        };
    },
    computed: {
        ...mapState({
            socketUrl: state => state.responses.url,
            project: state => state.projects.project,
            barchartAggregate: function(state) {
                // Sort categories alphabetically and remove categories according to project settings
                let sortedAggregate = state.responses.barchartAggregate.sort((a, b) =>
                    a.service > b.service ? 1 : b.service > a.service ? -1 : 0
                );
                let prunedData = [];
                for (let service of sortedAggregate) {
                    for (let block of this.project.blocks) {
                        if (service.service === block.title && block.visuals.includes("Bar Chart")) {
                            prunedData.push(service);
                        }
                    }
                }
                return prunedData;
            }
        }),
        liveView: function() {
            return !this.circularLoading && this.$route.query.view !== "static";
        }
    },
    created() {
        window.scrollTo(0, 0);
        this.projectName = this.$route.query.id.split("+")[0];
        this.surveyId = this.$route.query.id.split("+")[1];
        this.surveyLink =
            "https://" +
            window.axios.defaults.headers["q-data-center"].substring(0, 3) +
            ".qualtrics.com/jfe/form/" +
            this.surveyId;
    },
    mounted() {
        this.loadProject(this.$route.query.id).then(() => {
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
                    if (Date.now() - this.lastUpdate >= 250) {
                        console.log("Updating...");
                        this.loadData();
                        this.lastUpdate = Date.now();
                    }
                }.bind(this)
            );
        }
    },
    destroyed() {
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

                d3.selectAll(".circleChart").remove();
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
            this.downloadText = "LOADING...";
            document.body.style.cursor = "wait";
            await this.generateZipFile();
            const content = await this.zipFile.generateAsync({ type: "blob" });
            FileSaver.saveAs(content, "Charts.zip");
            document.body.style.cursor = "auto";
            this.downloadText = "DOWNLOAD ZIP";
        },
        getBarDomain(question) {
            let data = question.c;
            let id = question._id;
            let m = 0;
            for (let i = 0; i < data.length; i++) {
                if (data[i].QID == id) {
                    m = data[i].re;
                }
            }
            return m;
        },
        showToast() {
            this.$bvToast.toast("Bad data in survey response, manually re-fetching", {
                toaster: "b-toaster-bottom-right",
                variant: "warning",
                solid: true,
                noCloseButton: true
            });
            this.loadData();
        },
        JSONtoCSV() {
            const questions = this.barchartAggregate;
            let header = ["id", "service", "group_mean", "subquestion", "mean", "se", "confidence_num", "confidence"];
            let row = [];
            let formatted = [];
            formatted.push(header);
            for (let q = 0; q < questions.length; q++) {
                let data = questions[q].data;
                for (let d = 0; d < data.length; d++) {
                    row.push(
                        questions[q]._id,
                        questions[q].service,
                        questions[q].group_mean,
                        data[d].subquestion,
                        data[d].mean,
                        data[d].se,
                        data[d].confidence_num,
                        data[d].confidence
                    );
                    formatted.push(row);
                    row = [];
                }
            }
            return formatted;
        },
        async downloadCSV() {
            let formatted = this.JSONtoCSV();
            const csv = formatted
                .map(row =>
                    row
                        .map(item => (typeof item === "string" && item.indexOf(",") >= 0 ? `"${item}"` : String(item)))
                        .join(",")
                )
                .join("\n");
            // Format the CSV string
            const data = encodeURI("data:text/csv;charset=utf-8," + csv);
            const link = document.createElement("a");
            link.setAttribute("href", data);
            link.setAttribute("download", "export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
            let linkText = document.createElement("textArea");
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

@media (max-height: 746px) {
    #dashboardContainer {
        min-height: 746px;
    }
}

@media (min-height: 746px) {
    #dashboardContainer {
        min-height: 100vh;
    }
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

.axisText {
    font-size: 18px;
    transform: rotate(-90deg);
    margin-top: -280px;
    margin-left: 10px;
    transform-origin: top left;
}
</style>
