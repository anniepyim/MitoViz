var d3 = require('d3');
var colorbrewer = require('colorbrewer');
var SP = require('./scatterplot.js');
var heatmap = require('./heatmap.js');

var BARmargin = {top: 20, right: 20, bottom: 30, left: 10}, 
    BARwidth = 400,
    BARheight = 400;

// create svg for bar chart.


var BARsvg = d3.select("#barchart").append("svg")
    .attr("id", "barchartsvg")
    .attr("width", BARwidth + BARmargin.left + BARmargin.right)
    .attr("height", BARheight + BARmargin.top + BARmargin.bottom)
    .append("g")
    .attr("transform", "translate(" + BARmargin.left + "," + BARmargin.top + ")"),
    barH = 20;

//var color = d3.scale.category20();

var color = d3.scale.ordinal()
    .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#f781bf", "#fbb4ae", "#b3cde3", "#ffed6f", "#decbe4", "#fed9a6"]);

var BC = function (obj) {
    if (obj instanceof BC) return obj;
    if (!(this instanceof BC)) return new BC(obj);
    this.BCwrapped = obj;
};

BC.draw = function (jsondata,colorrange) {
    
    var data = d3.nest()
        .key(function (d) {
            return d.func;
        })
        .entries(jsondata);

    data.forEach(function (d) {
        d.func = d.key;
        d.count = d.values.length;
    });
    
    var xmax = Math.abs(d3.max(data, function (d) {
        return d.count;
    }));
    
    var x = d3.scale.linear()
    .range([0, BARwidth])
    .domain([0,xmax]);

  var bar = BARsvg.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barH + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.count); })
      .attr("height", barH - 1)
      .style("fill", function (d) {
            return color(d.func);
        })
      .on("click", click);
    
    bar.append("text")
      .attr("x", 0)
      .attr("y", barH / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.func+" ("+d.count+")"; })
      .on("click", click);
    
    console.log(data);
    
    function click(d) {
        SP.update(jsondata, d.func, color(d.func),colorrange);
        d3.select("#heatmapsvg").remove();
        heatmap.processData(jsondata, d.func,colorrange);
    }
    

};

BC.init = function (jsondata,colorrange) {
    BC.draw(jsondata,colorrange);
};

module.exports = BC;