<template>
    <b-container>
        <b-row>
            <b-col>
                <b-form-select v-model="newBlock.blockSelected" :select-size="4">
                    <option v-for="block in blocks" v-bind:value="block" v-bind:key="block">
                        {{block.description}}
                    </option>
                </b-form-select>
                <br>
                <span>Selected: {{ newBlock.blockSelected }}</span>
            </b-col>
            <b-col>
                <b-form-select v-model="newBlock.graphSelected" :select-size="4">
                    <option v-for="graph in graphs" v-bind:value="graph.value" v-bind:key="graph.value">
                        {{graph.text}}
                    </option>
                </b-form-select>
                <br>
                <span>Selected: {{ newBlock.graphSelected }}</span>
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

export default {
  name: "VisualizationDashboard",
  props:['questions'],
  data() {
      return{
        graphs: [
            {text: 'Bullseyes', value:'bullseyes'},
            {text: 'Bar Chart', value: 'barChart'}
        ],
        //this will return as json for each project
        newBlock: {
            blockSelected: '',
            graphSelected: ''
        },
        allBlocks: {},
        removeData: '',
        visualizations: []
      }
    },
    computed: {
        blocks: function() {
            return this.$store.state.blocks;
        }
    },
    methods: {
        addVisualization: function(event) {
            const {blockSelected, graphSelected} = this.newBlock

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

            this.newBlock = {blockSelected: '', graphSelected: ''};
        },

        removeVisualization: function(event) {
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

            console.log(this.allBlocks);
            this.allBlocks[blockSelected] = this.allBlocks[blockSelected].filter(item => item[0] != graphSelected);
            console.log(this.allBlocks)

            /* this.visualizations.pop(this.removeData)
            this.removeData = ''*/


        }
    }
}

</script>
