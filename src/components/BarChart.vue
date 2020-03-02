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
            {"plant": "Canada Thistle", "mean": -4.5526315789473686},
			{"plant": "leafy_spurge", "mean":2.8461538461538462},
			{"plant":"musk_thistle", "mean":-2.717948717948718},
			{"plant":"plumeless_thistle","mean":-1.4594594594594596},
			{"plant":"sericea_lespedeza","mean":-2},
			{"plant":"spotted_diffuse_knapweed","mean":1.6315789473684212},
			{"plant":"russian_olive","mean":-1.5135135135135131},
			{"plant":"scotch_thistle","mean":-1.4594594594594596},
			{"plant":"eastern_redcedar","mean":3.0526315789473686},
            {"plant":"smooth_brome","mean":-2.189189189189189} 	
            ];
    var x = d3.scaleBand()
      .rangeRound([0, width]).padding(0.1)
      .domain(data.map(d => d.plant));
    var y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([d3.min(data, d => d.mean), d3.max(data, d => d.mean)])
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
      .attr("transform", "translate(0,"+ y(d3.min(data, d => d.mean)) +") rotate(-45)" );

  elem.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
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
    }
  svg
      .append('g')
      .attr('id', 'bars-style')
      .attr('transform', `translate(40, 20)`)
      .call(addRectsWithName, 'Demo Data (Not Live)');

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



