var circle_svg = d3.select("#circle").append("svg").attr("width", 200).attr("height", 200)
var rect_svg = d3.select("#rect").append("svg").attr("width", 800).attr("height", 200)
var segment_svg = d3.select("#segment").append("svg").attr("width", 800).attr("height", 200)
var text_svg = d3.select("#text").append("svg").attr("width", 800).attr("height", 200)

var data = [{x: 0, y: 20}, {x: 150, y: 150}, {x: 300, y: 100}, {x: 450, y: 20}, {x: 600, y: 130}]
var line_svg = d3.select("#line").append("svg").attr("width", 800).attr("height", 200)
var curve_svg = d3.select("#curve").append("svg").attr("width", 800).attr("height", 200)
var area_svg = d3.select("#area").append("svg").attr("width", 800).attr("height", 200)
var arc_svg = d3.select("#arc").append("svg").attr("width", 1000).attr("height", 400)

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

segment_svg.append('line')
    .attr('x1', 10)
    .attr('y1', 10)
    .attr('x2', 700)
    .attr('y2', 100)
    .attr('stroke', 'red')

text_svg.append('text')
    .attr('x', 100)
    .attr('y', 50)
    .attr('stroke', 'green')
    .style("font-size", 19)
    .text("This is the second sentence")

var lineFunc = d3.line()
    .x(function(d) { return d.x })
    .y(function(d) { return d.y })

line_svg.append('path')
    .attr('d', lineFunc(data))
    .attr('stroke', 'black')
    .attr('fill', 'none');

var curveFunc = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return d.x })
    .y(function(d) { return d.y })

curve_svg.append('path')
    .attr('d', curveFunc(data))
    .attr('stroke', 'black')
    .attr('fill', 'none');

var areaFunc = d3.area()
    .x(function(d) { return d.x })
    .y1(function(d) { return d.y })
    .y0(200)

area_svg.append('path')
    .attr('d', areaFunc(data))
    .attr('stroke', 'black')
    .attr('fill', '#69b3a2');

arc_svg.append("path")
    .attr("transform", "translate(400,200)")
    .attr("d", d3.arc()
        .innerRadius(100)
        .outerRadius(150)
        .startAngle(3.14)
        .endAngle(6.28))
    .attr('stroke', 'black')
    .stroke('fill', '#69b3a2');

