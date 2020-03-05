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
                        <b-tab v-for="question in barChartData" :key="question._id" :title="question._id">
                            <h1>{{ question._id }}</h1>

                            <b-container>
                                <BarChart />
                            </b-container>
                        </b-tab>
                    </b-tabs>
                </b-tab>
                <b-button
                    v-if="!circularLoading"
                    @click="downloadZip"
                    style="max-width: 20%; background-color: darkseagreen; margin: 1rem 1rem;"
                >
                    Download Images
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
const d3 = Object.assign({}, require("d3"), require("d3-scale"));
const FileSaver = require("file-saver");
const JSZip = require("jszip");

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
            values: [20, 50, 60, 40, 30],
            speciesList: ["Roses", "Tulips", "Daisies", "Narcissuses", "Wallaby"],
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
            CircleChartData: [
                {
                    service: "Wild Food",
                    mean: -2.5526315789473686
                },
                {
                    service: "Forest Production",
                    mean: 2.8461538461538462
                },
                { service: "Pollination", mean: -2.717948717948718 },
                { service: "Ecological Integrity", mean: -1.4594594594594596 },
                { service: "Biodiversity", mean: -2 },
                { service: "Forage", mean: 1.6315789473684212 },
                { service: "Livestock", mean: -1.5135135135135131 },
                { service: "Water", mean: 1.4594594594594596 }
            ],
            circularLoading: true
        };
    },
    created() {
        window.scrollTo(0, 0);
    },
    mounted() {
        this.createGraph();
    },

    methods: {
        createGraph() {
            var svgContainer = d3
                .select(".circularGraph")
                .append()
                .append("svg")
                .attr("width", 200)
                .attr("height", 200);
            var circles = svgContainer
                .selectAll("circle")
                .data(this.tempData)
                .enter()
                .append("circle");
            var circleAttributes = circles
                .attr("cx", function(d) {
                    return d.x_axis;
                })
                .attr("cy", function(d) {
                    return d.y_axis;
                })
                .attr("r", function(d) {
                    return d.radius;
                })
                .style("fill", function(d) {
                    return d.color;
                });
        },

        downloadImage() {
            var vm = this;

            var width = 2400,
                height = 2700;

            return new Promise(resolve => {
                var svgElementNodes = d3.selectAll("svg")._groups[0];
                var svgElements = Array.from(svgElementNodes);

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
                    var format = "png";

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

                    canvas.width = width;
                    canvas.height = height;

                    return loadImage(options).then(image => {
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, width, height);
                        ctx.drawImage(image, 0, 0, width, height);
                        var fileName = this.extractContent(options) + ".png";

                        //save to zip file
                        canvas.toBlob(function(blob) {
                            //FileSaver.saveAs(blob, fileName); // FileSaver.js function
                            vm.circularZip.file(fileName, blob);
                        });
                    });
                };

                svgElements.forEach(depict);

                resolve();
            });
        },

        extractContent(s) {
            var span = document.createElement("span");
            span.innerHTML = s;
            console.log(span.textContent);
            return span.textContent || span.innerText;
        },

        async downloadZip() {
            var vm = this;
            const zip = await vm.downloadImage();
            //console.log(Object.keys(vm.circularZip.files).length)
            vm.circularZip.generateAsync({ type: "blob" }).then(function(content) {
                console.log("Downloading zip");
                FileSaver.saveAs(content, "CircularChart.zip");
            });
        }
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
</style>
