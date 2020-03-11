<template>
    <b-container>
        <b-row>
            <b-col>
                <b-form-select v-model="blockSelected" :select-size="5">
                    <option v-for="block in blocks" v-bind:value="block" v-bind:key="block.id">
                        {{ block.description }}
                    </option>
                </b-form-select>
                <br />
            </b-col>
            <b-col>
                <b-form-select v-model="graphSelected" :select-size="5">
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

        <b-row align-h="center">
                <b-col class="col-4">
                    <b-button @click="downloadJSON" style="background-color:DarkSeaGreen;">Download Empty File</b-button>
                </b-col>
        </b-row>

        <b-row align-h="center">
            <b-col class="col-4">
                <label>File
                    <input type="file" id="file" ref="file" v-on:change="uploadJSON"/>
                </label>
                <button v-on:click="submitFile">Submit</button>
            </b-col>
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
            graphs: ["Bullseyes", "Bar Chart"],
            blockSelected: "",
            graphSelected: "",
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
            const blockSelected = this.blockSelected;
            const graphSelected = this.graphSelected;
            if (blockSelected === "" || graphSelected === "") {
                return;
            }

            let present = false;
            for (let block of this.allBlocks) {
                if (block.title === blockSelected.description) {
                    present = true;
                    // Check if the visualization is already added
                    if (!block.visuals.includes(graphSelected)) {
                        block.visuals.push(graphSelected);
                        this.visualizations.push(blockSelected.description + " - " + graphSelected);
                    }
                }
            }
            if (!present) {
                this.allBlocks.push({ title: blockSelected.description, visuals: [graphSelected] });
                this.visualizations.push(blockSelected.description + " - " + graphSelected);
            }

            this.saveProjectBlocks(this.allBlocks);
            this.blockSelected = "";
            this.graphSelected = "";
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
        },
        uploadJSON(){
            this.file = this.$refs.file.files[0]
            console.log(this.file)
        },
        submitFile(){
            const vm = this
            var reader = new FileReader()
            reader.readAsText(vm.file)
            reader.onload = function(e){
                console.log("Load successfully")
                vm.comparisonData = reader.result
                console.log(vm.comparisonData)
                console.log(e)
            }
            reader.onerror = function(e){
                console.log("Error")
                console.log(e)
            }

            //for(var i = 0; i < vm.file.length; i++){
            //   console.log(reader.readAsText(file[i]))
            //}
        },
        downloadJSON() {
            let exportObj = [];
            const sq = this.survey.questions;
            const l1 = Object.keys(sq);
            for (let i in l1){
                let l3 = sq[l1[i]]['subQuestions'];
                let tt = [];
                let qn = sq[l1[i]]['questionName'];
                for (let key in l3){
                    let ot = {subname: l3[key]['description'], max: 0, min: 0};
                    tt.push(ot);
                }
                let bt = {questionName: qn, data: tt};
                exportObj.push(bt);
            }
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj))
            var jsonElement = document.createElement('a')
            jsonElement.setAttribute("href", dataStr)
            jsonElement.setAttribute("download", "comparison.json")
            document.body.appendChild(jsonElement)
            jsonElement.click()
            jsonElement.remove()
        }

    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
</style>
