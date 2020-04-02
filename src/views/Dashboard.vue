<template>
    <div>
        <Header />
        <div style="min-height:100vh;">
            <b-tabs content-class="mt-2" style="padding: 15vh 3vh 0vh 3vh;">
                <b-tab title="Circular Charts" active>
                    <CircularChart ref="circularRef" @done-loading="circularLoading = false" />
                </b-tab>
                <b-tab title="Bar Graphs" lazy>
                    <b-tabs vertical lazy>
                        <b-tab v-for="question in barchartAggregate" :key="question._id" :title="question._id">
                            <h1>{{ question._id }}</h1>

                            <b-container>
                                <BarChart :ref="question._id" :aggregate-data="question" />
                            </b-container>
                        </b-tab>
                    </b-tabs>
                </b-tab>
                <b-tab title="Full Bar Graphs">
                    <div
                        v-for="question in barchartAggregate"
                        :key="question._id"
                        :title="question._id"
                        class="barChartName"
                    >
                        <h3>{{ question._id }}</h3>
                        <b-container>
                            <BarChart :ref="question._id" :aggregate-data="question" />
                        </b-container>
                    </div>
                </b-tab>
                <b-button
                    v-if="!circularLoading"
                    @click="downloadZip"
                    style="max-width: 20%; background-color: darkseagreen; margin: 1rem 1rem;"
                >
                    Download ZIP
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
            intervalId: Number
        };
    },
    computed: {
        ...mapState({
            socketUrl: state => state.responses.url,
            barchartAggregate: state =>
                // Sort categories alphabetically
                state.responses.barchartAggregate.sort((a, b) => (a._id > b._id ? 1 : b._id > a._id ? -1 : 0))
        })
    },
    created() {
        window.scrollTo(0, 0);
    },
    mounted() {
        this.surveyId = this.$route.query.id.split("+")[1];
        this.getAggregate({ id: this.surveyId, pipeline: "barchart" });

        //* Handle survey updates
        this.createHook(this.surveyId);
        this.lastUpdate = Date.now();
        this.socket = io(this.socketUrl, { transports: ["polling"] });
        this.socket.on(
            this.surveyId,
            function() {
                if (Date.now() - this.lastUpdate >= 500) {
                    console.log("Response received");
                    this.getAggregate({ id: this.surveyId, pipeline: "circlechart" })
                        .then(() => {
                            console.log("Calling circular chart method");
                            this.$refs.circularRef.makeCharts();
                        })
                        .catch(() => {
                            this.showToast();
                        });
                    this.getAggregate({ id: this.surveyId, pipeline: "barchart" })
                        .then(() => {
                            for (const ref in this.$refs) {
                                if (ref !== "circularRef") {
                                    console.log("Calling barchart method");
                                    this.$refs[ref].makeChart();
                                }
                            }
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
            getAggregate: "responses/getAggregateData"
        }),
        downloadImage() {
            let vm = this;

            //Dimension for circular chart
            let width_c = 2400,
                height_c = 2700;

            //Dimension for bar chart
            let width_b = 4200,
                height_b = 2200;

            return new Promise(resolve => {
                let svgElementNodes = d3.selectAll("svg")._groups[0];
                let svgElements = Array.from(svgElementNodes);
                //console.log(svgElements);
                let svgLabelCircular = document.getElementsByClassName("chartName");
                let svgLabelBar = document.getElementsByClassName("barChartName");
                //console.log(svgLabelBar);

                let svgLabels = new Array();
                for (let i = 0; i < svgLabelCircular.length; i++) {
                    svgLabels.push(svgLabelCircular[i].textContent);
                }
                for (let i = 0; i < svgLabelBar.length; i++) {
                    svgLabels.push(svgLabelBar[i].title);
                }
                console.log(svgLabels);
                let numGraphs = 0;
                let classType = new Array();

                for (let i = 0; i < svgElementNodes.length; i++) {
                    //console.log(svgElementNodes[i].className["baseVal"])
                    classType.push(svgElementNodes[i].className["baseVal"]);
                }
                console.log(classType);

                let serializer = new XMLSerializer();

                //Formatting each elements in svgElements array
                svgElements.forEach(function(element, index) {
                    let svgString = serializer.serializeToString(this[index]);
                    svgString = svgString.replace(/(\w+)?:?xlink=/g, "xmlns:xlink="); // Fix root xlink without namespace
                    svgString = svgString.replace(/NS\d+:href/g, "xlink:href"); // Safari NS namespace fix

                    this[index] = svgString;
                }, svgElements);

                //Async image loading using Promise
                const loadImage = svgString => {
                    let imgsrc = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

                    return new Promise((resolve, reject) => {
                        let image = new Image();
                        console.log("Loading Image");
                        image.onload = () => resolve(image);
                        image.onerror = () => reject(new Error("load image fail"));
                        image.src = imgsrc;
                    });
                };

                //Function to draw image
                const depict = options => {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");

                    //temp solution
                    if (classType[numGraphs] == "barChart") {
                        canvas.width = width_b;
                        canvas.height = height_b;
                    } else {
                        canvas.width = width_c;
                        canvas.height = height_c;
                    }

                    return loadImage(options).then(image => {
                        ctx.fillStyle = "white";
                        //temp solution
                        if (classType[numGraphs] == "barChart") {
                            ctx.fillRect(0, 0, width_b, height_b);
                            ctx.drawImage(image, 0, 0, width_b, height_b);
                        } else {
                            ctx.fillRect(0, 0, width_c, height_c);
                            ctx.drawImage(image, 0, 0, width_c, height_c);
                        }

                        let fileName = svgLabels[numGraphs].toString() + ".png";
                        let folder;
                        if (classType[numGraphs] == "barChart") {
                            folder = "Bar Graph";
                        } else if (classType[numGraphs] == "circleChart") {
                            folder = "Circle Graph";
                        }

                        numGraphs += 1;

                        //save to zip file
                        canvas.toBlob(function(blob) {
                            console.log("Save to zip");
                            console.log("Folder: ", folder);
                            vm.zipFile.folder(folder).file(fileName, blob);
                            //console.log(vm.circularZip);
                        });
                    });
                };

                svgElements.forEach(depict);

                resolve();
            });
        },
        async downloadZip() {
            let vm = this;
            await vm.downloadImage();
            vm.zipFile.generateAsync({ type: "blob" }).then(function(content) {
                console.log("Downloading zip");
                FileSaver.saveAs(content, "Chart.zip");
            });
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
@import "../assets/grayscale.css";
</style>
