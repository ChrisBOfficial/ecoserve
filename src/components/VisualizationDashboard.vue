<template>
    <b-container>
        <b-row>
            <b-col>
                <select v-model="blockSelected">
                    <option v-for="block in blocks" v-bind:value="block.value" v-bind:key="block.value">
                        {{block.text}}
                    </option>
                </select>
                <br>
                <span>Selected: {{ blockSelected }}</span>
            </b-col>
                <select v-model="graphSelected">
                    <option v-for="graph in graphs" v-bind:value="graph.value" v-bind:key="graph.value">
                        {{graph.text}}
                    </option>
                </select>
                <br>
                <span>Selected: {{ graphSelected }}</span>
            <b-col>
            </b-col>
        <b-row>
    </b-container>
</template>

<script>

new Vue({
  el: '...',
  data: {
    blockSelected: 'A',
    blocks: [
      { text: 'Block 1', value: 'B1' },
      { text: 'Block 2', value: 'B2' },
      { text: 'Block 3', value: 'B3' }
    ],
    graphSelected: 'A',
    graphs: [
        {text: 'Bullseyes', value:'bullseyes'},
        {text: 'Bar Chart', value: 'bar'}
    ]
  }
})


</script>
