<template>
    <div>
        <h4>Plant stuff</h4>
        <pie :data="names"/>
        <br>
        <button v-if="canAddName" v-on:click="addName">Add a name</button>
    </div>
</template>

<script>
var _ = require('lodash')
import pie from '@/components/pie.vue'

const NAMES = [
    { name: 'Plant1', value: 2502 },
    { name: 'Plant2', value: 2005 },
    { name: 'Plant3', value: 1968 },
    { name: 'Plant4', value: 1863 },
    { name: 'Plant5', value: 1810 },
    { name: 'Plant6', value: 1637 },
    { name: 'Plant7', value: 1592 },
    { name: 'Plant8', value: 1572 },
    { name: 'Plant9', value: 1433 },
    { name: 'Plant10', value: 1403 }
]

export default {
    components: {
        pie: pie
    },
    data: function() {
        return {
            names: _.take(NAMES, 3)
        }
    },
    computed: {
        canAddName: function() {
            return this.names.length < NAMES.length;
        }
    },
    methods: {
        addName: function() {
            this.names.push(NAMES[this.names.length]);
        }
    }
}
</script>
