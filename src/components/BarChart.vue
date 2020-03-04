<template>
  <svg width="800" height="800"></svg>
</template>

<script>
const d3 = Object.assign(
    {},
    require("d3"),
    require("d3-scale"),
    require("d3-array"),
    require("d3-selection"),
    require("d3-axis"),
    require("d3-transition")
);
export default {
  mounted: function() {
    var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    var svg = d3.select(this.$el);
    //var width = +svg.attr('width');
    //var height = +svg.attr('height');
    var data = [
            {"plant": "Canada Thistle", "mean": -4.5526315789473686, "conf": 4, "bottom": -4, "top": -3},
			{"plant": "leafy_spurge", "mean":2.8461538461538462, "conf": 2, "bottom": -2, "top": -1},
			{"plant":"musk_thistle", "mean":-2.717948717948718, "conf": 1},
			{"plant":"plumeless_thistle","mean":-1.4594594594594596, "conf": 0, "bottom": 1, "top": 2},
			{"plant":"sericea_lespedeza","mean":-2, "conf": -1, "bottom": -2.5, "top": -.33},
			{"plant":"spotted_diffuse_knapweed","mean":1.6315789473684212, "conf": -2, "bottom": 2, "top": 2.5},
			{"plant":"russian_olive","mean":-1.5135135135135131, "conf": -4, "bottom": -1, "top": 0},
			{"plant":"scotch_thistle","mean":-1.4594594594594596, "conf": 3, "bottom": 1.33, "top": 3.54},
			{"plant":"eastern_redcedar","mean":3.0526315789473686, "conf": -3, "bottom": -4, "top": 3},
            {"plant":"smooth_brome","mean":-2.189189189189189, "conf": 20, "bottom": 0, "top": 2} 	
            ];
    var x = d3.scaleBand()
      .rangeRound([0, width]).padding(0.1)
      .domain(data.map(d => d.plant));
    var y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([-(d3.max(data, d => Math.abs(d.mean))), d3.max(data, d =>  Math.abs(d.mean))]) //-(d3.max(data, d => Math.abs(d.mean))), d3.max(data, d =>  Math.abs(d.mean))
    var xAxis = d3.axisBottom(x)

    var yAxis = d3.axisLeft(y).ticks(11);

    function addRectsWithName(elem, name) {
    
  // add axis
  elem.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+ y(0) + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .style("fill", "black")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "translate(0,"+ (y(d3.min(data, d => d.mean))- y(0)) +") rotate(-45)" ); //y(d3.min(data, d => d.mean))/2

  elem.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 3)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("meanuency");
      
      elem
        .append('text')
        .text(name)
        .attr('x', width / 2)
        .attr('y', 5)
        .attr('text-anchor', 'middle');
      elem.selectAll('rect')
        .data(data)
        .enter()
          .append('rect')
          // We add attr here
          .attr("fill", (d) => {
              if (d.conf > 2){
                  return "#333BFF";
              }
              else if ((d.conf <= 2) && (d.conf > 0)){
                  return "#FFC300";
              }
              else if ((d.conf <= 0 ) && (d.conf > -2)){
                  return "#FF5733";
              }
              else {
                  return "#C70039";
              }
          })
          .attr('stroke', (d) => {
              if (d.conf > 2){
                  return "blue";
              }
              else if ((d.conf <= 2) && (d.conf > 0)){
                  return "orange";
              }
              else if ((d.conf <= 0 ) && (d.conf > -2)){
                  return "red";
              }
              else {
                  return "black";
              }
          })
          .attr('x', d => x(d.plant))
          .attr('class', d => d.plant)
          .attr('y', (d) => (d.mean <= 0) ? y(0) : y(d.mean))
          .attr('width', x.bandwidth())
          .transition()
                .delay((d, i) => {
                    return i * 150;
                })
                .duration(1000)
          .attr('height', (d) => (d.mean <= 0) ? y(d.mean) - y(0) : y(0) - y(d.mean))
        
    elem.selectAll('rect2')
        .data(data)
        .enter()
        .append('rect')
          // We add attr here
          .attr('fill', "grey")
          .attr('stroke',"black")
          .attr('fill-opacity', .5)
          .attr('x', d => x(d.plant)+2)
          .attr('class', d => d.plant)
          .attr('y', (d) => y(d.top))
          .attr('width', (x.bandwidth()-4))
          .transition()
                .delay((d, i) => {
                    return i * 150;
                })
                .duration(1000)
          .attr('height', (d) => y(d.bottom) - y(d.top))

    }

  svg
      .append('g')
      .attr('id', 'bars-style')
      .attr('transform', `translate(40, 20)`)
      .call(addRectsWithName, '')

  }
}
</script>

<style>
    .bar{
      fill: steelblue;
    }
    .bar:hover{
      fill: brown;
    }
      .axis {
        font: 10px sans-serif;
      }
  
      .axis path,
      .axis line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
      }
</style>



