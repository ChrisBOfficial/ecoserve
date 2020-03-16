<template>
    <div>
        <Header />
        <div style="min-height:100vh;">
            <b-tabs content-class="mt-2" style="padding: 15vh 3vh 0vh 3vh;">
                <b-tab title="Circular Charts" active>
                    <CircularChart ref="circularRef" v-on:done-loading="circularLoading = false" />
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
                <b-tab title="disable" >
                    <div v-for="question in barchartAggregate" :key="question._id" :title="question._id">
                        <h3> {{ question._id }} </h3>
                        <b-container>
                            <BarChart :ref="question._id" :aggregate-data="question"/>
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
            circularZip: new JSZip(),
            barChartData: [
                {
                    _id: "QID23",
                    data: [
                        { subquestion: "8", confidence: "low", mean: 0, se: 0.39999999999999997 },
                        { subquestion: "4", confidence: "high", mean: -0.20000000000000018, se: 0.3346640106136302 },
                        { subquestion: "3", confidence: "high", mean: -0.40000000000000036, se: 0.35777087639996635 },
                        { subquestion: "5", confidence: "high", mean: -1, se: 0.28284271247461895 },
                        {
                            subquestion: "2",
                            confidence: "moderate",
                            mean: -0.7999999999999998,
                            se: 0.17888543819998315
                        },
                        { subquestion: "1", confidence: "high", mean: 0, se: 0.39999999999999997 },
                        { subquestion: "7", confidence: "high", mean: -1.5999999999999996, se: 0.5366563145999494 },
                        { subquestion: "6", confidence: "high", mean: -1.2000000000000002, se: 0.17888543819998318 },
                        { subquestion: "9", confidence: "low", mean: -3.6, se: 0.4560701700396551 }
                    ]
                },
                {
                    _id: "QID25",
                    data: [
                        { subquestion: "6", confidence: "none", mean: 0.20000000000000018, se: 0.17888543819998315 },
                        { subquestion: "1", confidence: "high", mean: 2, se: 0.39999999999999997 },
                        { subquestion: "8", confidence: "high", mean: 1, se: 0.28284271247461895 },
                        {
                            subquestion: "5",
                            confidence: "extreme",
                            mean: -0.20000000000000018,
                            se: 0.33466401061363016
                        },
                        { subquestion: "2", confidence: "extreme", mean: 0.20000000000000018, se: 0.3346640106136302 },
                        { subquestion: "4", confidence: "high", mean: 0.7999999999999998, se: 0.17888543819998315 },
                        { subquestion: "9", confidence: "moderate", mean: -2.8, se: 0.4381780460041329 },
                        { subquestion: "7", confidence: "high", mean: -0.40000000000000036, se: 0.3577708763999663 },
                        { subquestion: "3", confidence: "high", mean: 1.2000000000000002, se: 0.3346640106136301 }
                    ]
                },
                {
                    _id: "QID28",
                    data: [
                        { subquestion: "2", confidence: "none", mean: -5, se: 0 },
                        { subquestion: "5", confidence: "low", mean: -4, se: 0 },
                        { subquestion: "7", confidence: "low", mean: -5, se: 0 },
                        { subquestion: "3", confidence: "none", mean: -4, se: 0 },
                        { subquestion: "4", confidence: "low", mean: -2, se: 0 },
                        { subquestion: "8", confidence: "none", mean: -3, se: 0 },
                        { subquestion: "6", confidence: "none", mean: -1, se: 0 }
                    ]
                },
                {
                    _id: "QID21",
                    data: [
                        { subquestion: "9", confidence: "high", mean: -2.2, se: 0.6572670690061995 },
                        { subquestion: "6", confidence: "high", mean: -0.20000000000000018, se: 0.17888543819998318 },
                        { subquestion: "3", confidence: "high", mean: -0.666666666666667, se: 0.45133546692422 },
                        { subquestion: "8", confidence: "high", mean: -0.20000000000000018, se: 0.17888543819998318 },
                        { subquestion: "2", confidence: "high", mean: 0, se: 0 },
                        { subquestion: "4", confidence: "high", mean: -0.20000000000000018, se: 0.17888543819998318 },
                        { subquestion: "7", confidence: "high", mean: -1.2000000000000002, se: 0.33466401061363016 },
                        { subquestion: "5", confidence: "high", mean: 0, se: 0 },
                        { subquestion: "1", confidence: "high", mean: -0.20000000000000018, se: 0.17888543819998318 }
                    ]
                },
                {
                    _id: "QID19",
                    data: [
                        { subquestion: "7", confidence: "moderate", mean: -2.6, se: 0.4560701700396552 },
                        { subquestion: "4", confidence: "high", mean: -1.2000000000000002, se: 0.17888543819998318 },
                        { subquestion: "1", confidence: "high", mean: -1.2000000000000002, se: 0.17888543819998318 },
                        { subquestion: "8", confidence: "high", mean: -1.2000000000000002, se: 0.17888543819998318 },
                        { subquestion: "6", confidence: "high", mean: -1, se: 0 },
                        { subquestion: "9", confidence: "low", mean: -4, se: 0.39999999999999997 },
                        { subquestion: "3", confidence: "high", mean: -1.2000000000000002, se: 0.17888543819998318 },
                        { subquestion: "2", confidence: "high", mean: -1.333333333333333, se: 0.3849001794597505 },
                        { subquestion: "5", confidence: "high", mean: -1.2000000000000002, se: 0.3346640106136301 }
                    ]
                },
                {
                    _id: "QID6",
                    data: [
                        { subquestion: "8", confidence: "low", mean: -1.5714285714285712, se: 0.6342967456293899 },
                        { subquestion: "5", confidence: "high", mean: -1.4285714285714288, se: 0.5663035479800655 },
                        { subquestion: "2", confidence: "high", mean: -1.4285714285714288, se: 0.4889448388045281 },
                        { subquestion: "3", confidence: "moderate", mean: -1.2857142857142856, se: 0.4386568420449934 },
                        { subquestion: "6", confidence: "high", mean: -0.14285714285714324, se: 0.42515646236734 },
                        { subquestion: "4", confidence: "high", mean: -0.375, se: 0.246062746062869 },
                        { subquestion: "9", confidence: "low", mean: -2.875, se: 0.9259707743768159 },
                        { subquestion: "1", confidence: "moderate", mean: -1.125, se: 0.32775276505317236 },
                        { subquestion: "7", confidence: "moderate", mean: -2.111111111111111, se: 0.3989010968247781 }
                    ]
                },
                {
                    _id: "QID20",
                    data: [
                        { subquestion: "3", confidence: "moderate", mean: -0.5999999999999996, se: 0.4560701700396551 },
                        { subquestion: "5", confidence: "high", mean: -1.2000000000000002, se: 0.33466401061363016 },
                        { subquestion: "8", confidence: "high", mean: -0.40000000000000036, se: 0.3577708763999664 },
                        { subquestion: "4", confidence: "high", mean: -0.40000000000000036, se: 0.3577708763999664 },
                        { subquestion: "7", confidence: "high", mean: -0.40000000000000036, se: 0.779743547584717 },
                        { subquestion: "1", confidence: "high", mean: -0.20000000000000018, se: 0.3346640106136302 },
                        { subquestion: "6", confidence: "high", mean: -1.166666666666667, se: 0.36641405439647007 },
                        { subquestion: "2", confidence: "high", mean: -0.40000000000000036, se: 0.3577708763999663 },
                        { subquestion: "9", confidence: "moderate", mean: 0, se: 1.131370849898476 }
                    ]
                },
                {
                    _id: "QID24",
                    data: [
                        { subquestion: "3", confidence: "low", mean: -0.5999999999999996, se: 0.21908902300206645 },
                        { subquestion: "6", confidence: "high", mean: -0.5999999999999996, se: 0.4560701700396552 },
                        { subquestion: "2", confidence: "high", mean: -0.7999999999999998, se: 0.17888543819998315 },
                        { subquestion: "7", confidence: "moderate", mean: -1.7999999999999998, se: 0.5932958789676531 },
                        { subquestion: "4", confidence: "high", mean: -0.5999999999999996, se: 0.21908902300206645 },
                        { subquestion: "5", confidence: "high", mean: -1, se: 0.48989794855663554 },
                        { subquestion: "8", confidence: "high", mean: -0.40000000000000036, se: 0.35777087639996635 },
                        { subquestion: "1", confidence: "high", mean: -0.40000000000000036, se: 0.35777087639996635 },
                        { subquestion: "9", confidence: "low", mean: -4, se: 0.39999999999999997 }
                    ]
                },
                {
                    _id: "QID22",
                    data: [
                        { subquestion: "9", confidence: "none", mean: 2.8000000000000007, se: 0.6572670690061994 },
                        { subquestion: "4", confidence: "moderate", mean: 0, se: 0 },
                        { subquestion: "8", confidence: "moderate", mean: 0, se: 0 },
                        { subquestion: "7", confidence: "moderate", mean: 1.4000000000000004, se: 0.9633275663033836 },
                        { subquestion: "1", confidence: "high", mean: 0, se: 0 },
                        { subquestion: "5", confidence: "moderate", mean: 0, se: 0 },
                        { subquestion: "6", confidence: "high", mean: -0.5, se: 0.4564354645876385 },
                        { subquestion: "3", confidence: "moderate", mean: 0, se: 0 },
                        { subquestion: "2", confidence: "moderate", mean: 0, se: 0 }
                    ]
                }
            ],
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
            var vm = this;


            //Dimension for circular chart
            var width_c = 2400,
                height_c = 2700;

            //Dimension for bar chart
            var width_b = 4200,
                height_b = 2200;

            return new Promise(resolve => {
                var svgElementNodes = d3.selectAll("svg")._groups[0];
                //console.log(d3.selectAll("svg"))
                var svgElements = Array.from(svgElementNodes);
                var svgLabels = document.getElementsByClassName("chartName");
                var numGraphs = 0;
                var classType = new Array();

                for (var i = 0; i < svgElementNodes.length; i++){
                    classType.push(svgElementNodes[i].className["baseVal"]);
                }
                console.log(classType);

                var serializer = new XMLSerializer();

                //Formatting each elements in svgElements array
                svgElements.forEach(function(element, index) {
                    var svgString = serializer.serializeToString(this[index]);
                    svgString = svgString.replace(/(\w+)?:?xlink=/g, "xmlns:xlink="); // Fix root xlink without namespace
                    svgString = svgString.replace(/NS\d+:href/g, "xlink:href"); // Safari NS namespace fix

                    this[index] = svgString;
                }, svgElements);

                //Async image loading using Promise
                const loadImage = svgString => {
                    var imgsrc = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

                    return new Promise((resolve, reject) => {
                        var image = new Image();
                        image.onload = () => resolve(image);
                        image.onerror = () => reject(new Error("load image fail"));
                        image.src = imgsrc;
                    });
                };

                //Function to draw image
                const depict = options => {
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");

                    //temp solution 
                    if (classType[numGraphs] == "barChart"){
                        canvas.width = width_b;
                        canvas.height = height_b;
                    } else{
                        canvas.width = width_c;
                        canvas.height = height_c;
                    }

                    return loadImage(options).then(image => {
                        ctx.fillStyle = "white";
                        //temp solution 
                        if (classType[numGraphs] == "barChart"){
                            ctx.fillRect(0, 0, width_b, height_b);
                            ctx.drawImage(image, 0, 0, width_b, height_b);
                        }else{             
                            ctx.fillRect(0, 0, width_c, height_c);
                            ctx.drawImage(image, 0, 0, width_c, height_c);
                        }

                        var fileName = "";
                        try {
                            fileName = svgLabels[numGraphs].textContent.toString() + ".png";
                        } catch (err) {
                            fileName = "BarChart.png";
                        }
                        numGraphs += 1;

                        //save to zip file
                        canvas.toBlob(function(blob) {
                            vm.circularZip.file(fileName, blob);
                        });
                    });
                };

                svgElements.forEach(depict);

                resolve();
            });
        },
        async downloadZip() {
            var vm = this;
            const zip = await vm.downloadImage();
            vm.circularZip.generateAsync({ type: "blob" }).then(function(content) {
                console.log("Downloading zip");
                FileSaver.saveAs(content, "CircularChart.zip");
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
