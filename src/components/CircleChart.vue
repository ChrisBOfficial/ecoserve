<template>
  <div id="container" class="svg-container" align="center">
    <svg v-for="item in data" :width="svg_width" :height="svg_height">
            <g>
                <circle
                  v-for="value in values"
                  :key="value"
                  :cx="250"
                  :cy="250"
                  :r="value"
                  :stroke-width="1"
                  :stroke-opacity="1"
                  :stroke="tick"
                  :fill="fill"
                  :fill-opacity=".1"
                />
                <path
                  v-for="value in values"
                  :key="value"
                  :cx="250"
                  :cy="250"
                  :innerRadius="0"
                  :outerRadius="value"
                  :startAngle="0"
                  :endAngle="endAng"
                  :padAngle="0.01"
                  :padRadius="0"
                  :fill="fill"
                  :fill-opacity="1"
                />
                
            </g>
        </svg>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
import _ from "lodash"

const d3 = require('d3');
const d3Scale = require('d3-scale');

export default {
  props: {
    values: Array,
    title: String,
    data: Array,
    xKey: String
  },
  data: () => ({
    svg_width: 500,
    svg_height: 500,
    fill: "none",
    tick: "black"

  }),
  watch: {
    values: function(val){
      if (this.circleChart != null) this.circleChart.remove();
      this.renderChart(val);
      console.log(val);
    }
  },
  created: function() {
   
  },
  methods: {
    renderChart(issues_val){
      //chart will be drawn here
      const margin = 60;
      const svg_width = 1000;
      const svg_height = svg_width;
      const chart_width = 1000 - 2 * margin;
      const chart_height = 600 - 2 * margin;
      const innerRadius = 100;
      const outerRadius = 200;

      
/*
      var x = d3
        .scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing
        .domain(issues_val.map(s => s.values)); // The domain of the X axis is the list of impacts.

      var y = d3Scale
        .scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 10]); // Domain of Y is from 0 to the max seen in the data, _.maxBy(issues_val, "amount").values

      var ybis = d3Scale
        .scaleRadial()
        .range([innerRadius, 10])   // Domain will be defined later.  _.maxBy(issues_val, "amount").values
        .domain([0, 10]);
      
      this.circleChart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

      var upperBars = this.circleChart
        .selectAll("path")
        .data(issues_val)
        .enter()
        
      upperBars
        .append("path")
        .attr("fill", "#43bfc7")
        .attr("class", "yo")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d){ if(issues_val > 0) {
              return y(issues_val);
          }
            else {
              return y(0);
          }})
          .startAngle(function(d) { return x(issues_val); })
          .endAngle(function(d) { return x(issues_val) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))
      
      var lowerBars = this.circleChart
        .selectAll("path")
        .data(issues_val)
        .enter()
        
      lowerBars
        .attr("fill", "#ff2400")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius( function(d) { 
                return ybis(0) 
            })
          .outerRadius( function(d) {
            if (issues_val < 0) {
              return ybis(issues_val *-1);}
            else {
              return ybis(0);}
            
            }
          )
          .startAngle(function(d) { return x(issues_val); })
          .endAngle(function(d) { return x(issues_val) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius));
     */
    }
  },
  computed:{
     innerRadius(){
       return 150;
     },
     endAng(){
       return 0.25*Math.PI
     },
     outerRadius(){
       return 300;
     }
  }
}
</script>