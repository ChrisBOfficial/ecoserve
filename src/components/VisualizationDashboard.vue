<template>
    <b-container>
        <b-row>
            <b-col>
                <b-form-select v-model="blockSelected" :select-size="5">
                    <option v-for="block in blocks" v-bind:value="block" v-bind:key="block.id">
                        {{block.description}}
                    </option>
                </b-form-select>
                <br>
                <span>Selected: {{ blockSelected }}</span>
            </b-col>
            <b-col>
                <b-form-select v-model="graphSelected" :select-size="5">
                    <option v-for="graph in graphs" v-bind:value="graph" v-bind:key="graph">
                        {{graph}}
                    </option>
                </b-form-select>
                <br>
                <span>Selected: {{ graphSelected }}</span>
            </b-col>
        </b-row>
        <b-row class="align-items-center">
            <button v-on:click="addVisualization" style="background-color:DarkSeaGreen;">ADD VISUALIZATION</button>
        </b-row>
        <b-row class="align-items-center">
            <b-form-select v-model="removeData" :select-size="visualizationBoxSize">
                <option v-for="visualization in visualizations" v-bind:value="visualization" v-bind:key="visualization">
                    {{visualization}}
                </option>
            </b-form-select>
            <br>
            <span>Selected: {{ removeData }}</span>

            <button v-on:click="removeVisualization" style="background-color:DarkSeaGreen;"> REMOVE VISUALIZATION </button>
        </b-row>
    </b-container>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
  name: "VisualizationDashboard",
  props: {
      existingVisualizations: {
          type: Array,
          default: function() { return [] }
      },
      existingBlocks: {
          type: Object,
          default: function() { return {} }
      }
  },
  data() {
      return {
        allBlocks: {},
        graphs: [
            'Bullseyes',
            'Bar Chart'
        ],
        blockSelected: '',
        graphSelected: '',
        visualizations: this.existingVisualizations,
        removeData: ''
      }
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
            loadSurveys: 'surveys/loadSurveys',
            loadSurvey: 'surveys/loadSurvey',
            saveProjectBlocks: 'projects/saveProjectBlocks'
        }),
        //add functionality to make sure that there is both information 
        //on both column before we can add new visualization. No 
        //undefined data.
        addVisualization: function() {
            // Use pre-existing blocks if empty
            if (Object.entries(this.allBlocks).length === 0) {
                this.allBlocks = this.existingBlocks;
            }
            const blockSelected = this.blockSelected;
            const graphSelected = this.graphSelected;
            if(blockSelected == 'undefined' || graphSelected == 'undefined'){
                return;
            }

            // eslint-disable-next-line no-prototype-builtins
            if (this.allBlocks.hasOwnProperty(blockSelected.description)) {
                var contained = false;
                for (let item of this.allBlocks[blockSelected.description]) {
                    if (item[0] == graphSelected && item[1] == "option") {
                        contained = true;
                    }
                }
                if (!contained) {
                    this.allBlocks[blockSelected.description].push([graphSelected, "option"]);
                    this.visualizations.push(blockSelected.description + " - " + graphSelected);
                }
            } else {
                this.allBlocks[blockSelected.description] = [[graphSelected, "option"]];
                this.visualizations.push(blockSelected.description + " - " + graphSelected);
            }

            this.saveProjectBlocks(this.allBlocks);
            this.blockSelected = '';
            this.graphSelected = '';
        },
        removeVisualization: function() {
            // Use pre-existing blocks if empty
            if (Object.entries(this.allBlocks).length === 0) {
                this.allBlocks = this.existingBlocks;
            }
            this.visualizations.splice(this.visualizations.indexOf(this.removeData), 1);
            const blockSelected = this.removeData.split("-")[0].trimEnd();
            const graphSelected = this.removeData.split("-")[1].trimStart();

            if (this.allBlocks[blockSelected].length == 1) {
                delete this.allBlocks[blockSelected];
            } else {
                for (var block of this.allBlocks[blockSelected]) {
                    if (block[0] == graphSelected) {
                        this.allBlocks[blockSelected].splice(this.allBlocks[blockSelected].indexOf(block), 1);
                    }
                }
            }

            this.saveProjectBlocks(this.allBlocks);
            this.removeData = '';
        }
    }
}

</script>
