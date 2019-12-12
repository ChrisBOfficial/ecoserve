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
        blocks: this.questions,
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

        },
        removeData: '',
        visualizations: [

        ]

      }
    },
    methods: {
        addVisualization: function(event){
            const{blockSelected, graphSelected} = this.newBlock

            //do something with the new graph 
            if (this.allBlocks.hasOwnProperty(blockSelected)){
                //not guarded for duplicates 
                if(!(this.allBlocks[blockSelected].indexOf([graphSelected, "option"]) >= 0)){
                    this.allBlocks[blockSelected].push([graphSelected, "option"])
                    this.visualizations.push(blockSelected + "-" + graphSelected)
                }
            }else {
                this.allBlocks[blockSelected] = []
                this.allBlocks[blockSelected].push([graphSelected, "option"])
                this.visualizations.push(blockSelected + "-" + graphSelected)
            }
            console.log(this.allBlocks)

            this.newBlock = {
                blockSelected: '',
                graphSelected: ''
            }
        },

        removeVisualization: function(event){
            const blockSelected = this.removeData.split("-")[0]
            const graphSelected = this.removeData.split("-")[1]
            console.log(blockSelected)
            for(var key in this.allBlocks){
                console.log(key)
                if(key == blockSelected){
                    var i;
                    for (i = 0; i < this.allBlocks[key].length; i++){
                        console.log(this.allBlocks[key][i][0])
                        if (this.allBlocks[blockSelected][i][0] == graphSelected){
                            this.allBlocks[blockSelected].pop(this.allBlocks[blockSelected][i])
                        }
                    }
                }
            }
            console.log(this.allBlocks)


            this.visualizations.pop(this.removeData)
            this.removeData = ''
        }
    }
}

</script>
