var d3 = require('d3');
var colorbrewer = require('colorbrewer');

colordata = d3.entries(colorbrewer); 
    
var data = [];

colordata.forEach(function (d) {
    if (d.key == "PRGn" || d.key == "PiYG" || d.key == "RdBu" || d.key == "RdYlGn") {
        data.push(d);
    }
});    

d3.select("#color-picker")
  .selectAll(".palette")
    .data(data)
  .enter().append("span")
    .attr("class", "palette")
    .attr("title", function(d) { return d.key; })
    .on("click", function(d) { d3.select("#colorinput").property("value", d.value[d3.keys(d.value).map(Number).sort(d3.descending)[2]]); })
  .selectAll(".swatch")
    .data(function(d) { return d.value[d3.keys(d.value).map(Number).sort(d3.descending)[2]]; })
  .enter().append("span")
    .attr("class", "swatch")
    .style("background-color", function(d) { return d; });