// create svg element
var circle_svg = d3.select("#circle").append("svg").attr("width", 200).attr("height", 200)
var rect_svg = d3.select("#rect").append("svg").attr("width", 800).attr("height", 200)

// Add the path using this helper function
circle_svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 50)
    .attr('stroke', 'black')
    .attr('fill', '#69a3b2');

rect_svg.append('rect')
    .attr('x', 10)
    .attr('y', 120)
    .attr('width', 600)
    .attr('height', 40)
    .attr('stroke', 'black')
    .attr('fill', '#69a3b2');
