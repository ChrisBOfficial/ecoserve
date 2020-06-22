<template>
    <b-container>
        <b-row>
            <b-col>
                <h5>Survey blocks</h5>
                <b-form-select v-model="blocksSelected" multiple :select-size="5">
                    <option v-for="block in blocks" v-bind:value="block" v-bind:key="block.id">
                        {{ block.description }}
                    </option>
                </b-form-select>
                <br />
            </b-col>
            <b-col>
                <h5>Visualizations</h5>
                <b-form-select v-model="graphsSelected" multiple :select-size="5">
                    <option v-for="graph in graphs" v-bind:value="graph" v-bind:key="graph">
                        {{ graph }}
                    </option>
                </b-form-select>
            </b-col>
        </b-row>
        <br />
        <b-row class="align-items-center">
            <b-button v-on:click="addVisualization" style="background-color:DarkSeaGreen;">ADD VISUALIZATION</b-button>
        </b-row>
        <br />
        <b-row class="align-items-center">
            <b-form-select v-model="removeData" :select-size="visualizationBoxSize">
                <option v-for="visualization in visualizations" v-bind:value="visualization" v-bind:key="visualization">
                    {{ visualization }}
                </option>
            </b-form-select>
        </b-row>
        <br />
        <b-row class="align-items-center">
            <b-button v-on:click="removeVisualization" style="background-color:DarkSeaGreen;">
                REMOVE VISUALIZATION
            </b-button>
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    name: "VisualizationDashboard",
    props: {
        existingVisualizations: {
            type: Array,
            default: function() {
                return [];
            }
        },
        existingBlocks: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data() {
        return {
            allBlocks: [],
            graphs: ["Flower diagrams", "Bar Chart"],
            blocksSelected: [],
            graphsSelected: [],
            visualizations: this.existingVisualizations,
            removeData: ""
        };
    },
    computed: {
        ...mapState({
            surveys: state => state.surveys.surveys,
            survey: state => state.surveys.survey,
            blocks: state => state.surveys.blocks,
            projectBlocks: state => state.projects.projectBlocks
        }),
        visualizationBoxSize: function() {
            return this.visualizations.length >= 2 ? this.visualizations.length : 2;
        }
    },
    methods: {
        ...mapActions({
            loadSurveys: "surveys/loadSurveys",
            loadSurvey: "surveys/loadSurvey",
            saveProjectBlocks: "projects/saveProjectBlocks"
        }),
        addVisualization() {
            // Use pre-existing blocks if empty
            if (this.allBlocks.length === 0) {
                this.allBlocks = this.existingBlocks;
            }
            const blocksSelected = this.blocksSelected;
            const graphsSelected = this.graphsSelected;
            if (blocksSelected.length == 0 || graphsSelected.length == 0) {
                return;
            }

            for (let singleBlock of blocksSelected) {
                for (let singleGraph of graphsSelected) {
                    let present = false;
                    for (let block of this.allBlocks) {
                        if (block.title === singleBlock.description) {
                            present = true;
                            // Check if the visualization is already added
                            if (!block.visuals.includes(singleGraph)) {
                                block.visuals.push(singleGraph);
                                this.visualizations.push(singleBlock.description + " - " + singleGraph);
                            }
                        }
                    }
                    if (!present) {
                        this.allBlocks.push({ title: singleBlock.description, visuals: [singleGraph] });
                        this.visualizations.push(singleBlock.description + " - " + singleGraph);
                    }
                }
            }

            this.saveProjectBlocks(this.allBlocks);
            this.blocksSelected = [];
            this.graphsSelected = [];
        },
        removeVisualization() {
            // Use pre-existing blocks if empty
            if (this.allBlocks.length === 0) {
                this.allBlocks = this.existingBlocks;
            }
            this.visualizations.splice(this.visualizations.indexOf(this.removeData), 1);
            const blockSelected = this.removeData.split("-")[0].trimEnd();
            const graphSelected = this.removeData.split("-")[1].trimStart();
            if (blockSelected === "" || graphSelected === "") {
                return;
            }

            for (let [i, block] of this.allBlocks.entries()) {
                if (block.title === blockSelected && block.visuals.includes(graphSelected)) {
                    if (block.visuals.length == 1) {
                        this.allBlocks.splice(i, 1);
                        break;
                    } else if (block.visuals.length > 1) {
                        block.visuals.splice(block.visuals.indexOf(graphSelected), 1);
                        break;
                    }
                }
            }

            this.saveProjectBlocks(this.allBlocks);
            this.removeData = "";
        }
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
</style>
