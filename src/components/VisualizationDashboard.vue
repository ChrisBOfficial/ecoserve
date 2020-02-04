<template>
    <b-container>
        <b-row>
            <b-col>
                <b-form-select v-model="blockSelected" :select-size="4">
                    <option v-for="block in blocks" v-bind:value="block" v-bind:key="block.id">
                        {{block.description}}
                    </option>
                </b-form-select>
                <br>
                <span>Selected: {{ blockSelected }}</span>
            </b-col>
            <b-col>
                <b-form-select v-model="graphSelected" :select-size="4">
                    <option v-for="graph in graphs" v-bind:value="graph.value" v-bind:key="graph.value">
                        {{graph.text}}
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
            <b-form-select v-model="removeData" :select-size="4">
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
  data() {
      return {
        allBlocks: {},
        graphs: [
            {text: 'Bullseyes', value:'bullseyes'},
            {text: 'Bar Chart', value: 'barChart'}
        ],
        blockSelected: '',
        graphSelected: '',
        visualizations: [],
        removeData: ''
      }
    },
    computed: {
        ...mapState({
            surveys: state => state.surveys.surveys,
            survey: state => state.surveys.survey,
            blocks: state => state.surveys.blocks,
            projectBlocks: state => state.surveys.projectBlocks
        })
    },
    methods: {
        ...mapActions({
            loadSurveys: 'surveys/loadSurveys',
            loadSurvey: 'surveys/loadSurvey',
            saveProjectBlocks: 'surveys/saveProjectBlocks'
        }),
        addVisualization: function() {
            const blockSelected = this.blockSelected;
            const graphSelected = this.graphSelected;

            //do something with the new graph 
            /* if (this.allBlocks.hasOwnProperty(blockSelected)){
                //not guarded for duplicates 
                if(!(this.allBlocks[blockSelected].indexOf([graphSelected, "option"]) >= 0)){
                    this.allBlocks[blockSelected].push([graphSelected, "option"])
                    this.visualizations.push(blockSelected + "-" + graphSelected)
                }
            } else {
                this.allBlocks[blockSelected] = []
                this.allBlocks[blockSelected].push([graphSelected, "option"])
                this.visualizations.push(blockSelected + " - " + graphSelected)
            } */

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
            this.visualizations.splice(this.visualizations.indexOf(this.removeData), 1);
            const blockSelected = this.removeData.split("-")[0].trimEnd();
            const graphSelected = this.removeData.split("-")[1].trimStart();
            /* for(var key in this.allBlocks) {
                if(key == blockSelected.id) {
                    var i;
                    for (i = 0; i < this.allBlocks[key].length; i++) {
                        if (this.allBlocks[blockSelected.id][i][0] == graphSelected) {
                            this.allBlocks[blockSelected.id].pop(this.allBlocks[blockSelected.id][i])
                        }
                    }
                }
            }*/

            
            this.allBlocks[blockSelected] = this.allBlocks[blockSelected].filter(item => item[0] != graphSelected);

            this.saveProjectBlocks(this.allBlocks);
            /* this.visualizations.pop(this.removeData)
            this.removeData = ''*/
        }
    }
}

</script>
