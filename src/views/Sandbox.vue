<template>
    <svg width='500' height='500'>
        <g
            class='flower'
            v-for='flower in flowers'
            :key='flower.name'
            :style="{
                transform: `translate(${flower.amount}px, ${flower.amount}px)`   
            }"
        >
            <circle
                class='flower__circle'
                :r='flower.amount'
                :fill='flower.color'
            />

            <text class='flower__label'>
                {{ flower.name }}
            </text>
        </g>
    </svg>
</template>

<script>
const d3 = require('d3');

export default {
    data: function () {
        return {
            flowers: [
                {
                    name: 'Roses',
                    amount: 25,
                    color: '#cc2936'
                },
                {
                    name: 'Tulips',
                    amount: 40,
                    color: '#f2c640'
                },
                {
                    name: 'Daisies',
                    amount: 15,
                    color: '#2a93d4'
                },
                {
                    name: 'Narcissus',
                    amount: 9,
                    color: '#F7AD0A'
                }
            ]
        }
    }
}
</script>
