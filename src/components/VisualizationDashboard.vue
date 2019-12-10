<template>
    <b-container>
        <b-row>
            <b-col>
                <b-form-select v-model="newBlock.blockSelected" :select-size="4">
                    <option v-for="block in blocks" v-bind:value="block.value" v-bind:key="block.value">
                        {{block.text}}
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
            <button v-on:click="addvisualization" style="background-color:DarkSeaGreen;">ADD VISUALIZATION</button>
        </b-row>
        <b-row class="align-items-center">
            <b-form-select>
            </b-form-select>
            <button v-on:click="removevisualization" style="background-color:DarkSeaGreen;"> REMOVE VISUALIZATION </button>
        </b-row>
    </b-container>
</template>

<script>

export default {
  name: "VisualizationDashboard",
  data() {
      return{
        blocks: [
            { text: 'Block 1', value: 'block1' },
            { text: 'Block 2', value: 'block2' },
            { text: 'Block 3', value: 'block3' }
        ],
        graphs: [
            {text: 'Bullseyes', value:'bullseyes'},
            {text: 'Bar Chart', value: 'barChart'}
        ],
        //this will return as json for each project
        newBlock:{
            blockSelected: '',
            graphSelected: ''
        },
        allBlocks:{

        }
      }
  },
  methods: {
        addvisualization: function(event){
            const{blockSelected, graphSelected} = this.newBlock

            //do something with the new graph 
            if (this.allBlocks.hasOwnProperty(blockSelected)){
                //not guarded for duplicates 
                if(!(this.allBlocks[blockSelected].indexOf([graphSelected, "option"]) >= 0)){
                    this.allBlocks[blockSelected].push([graphSelected, "option"])
                }
            }else {
                this.allBlocks[blockSelected] = []
                this.allBlocks[blockSelected].push([graphSelected, "option"])
            }
            console.log(this.allBlocks)

            this.newBlock = {
                blockSelected: '',
                graphSelected: ''
            }
        },

        removevisualization: function(event){

        }
  }
}


</script>
