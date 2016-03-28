var d3 = require('d3');
var colorbrewer = require('colorbrewer');
var SP = require('./scatterplot.js');
var heatmap = require('./heatmap.js');

var PIEmargin = {
        top: 20
        , right: 20
        , bottom: 30
        , left: 10
    }
    , pieDim = {
        w: 250
        , h: 250
        , rpadding: 200
    }
    , pieDimr = Math.min(pieDim.w, pieDim.h) / 2;

// create svg for pie chart.


var PIEsvg = d3.select("#piechart").append("svg")
    .attr("width", pieDim.w + pieDim.rpadding)
    .attr("height", 400)
    .append("g")
    .attr("transform", "translate(" + PIEmargin.left + "," + PIEmargin.top + ")");

//var color = d3.scale.category20();

var color = d3.scale.ordinal()
    .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#f781bf", "#fbb4ae", "#b3cde3", "#ffed6f", "#decbe4", "#fed9a6"]);

var PC = function (obj) {
    if (obj instanceof PC) return obj;
    if (!(this instanceof PC)) return new PC(obj);
    this.PCwrapped = obj;
};

PC.draw = function (jsondata) {

    // create function to draw the arcs of the pie slices.
    var arc = d3.svg.arc().outerRadius(pieDimr - 10).innerRadius(0);

    // create a function to compute the pie slice angles.
    var pie = d3.layout.pie().sort(null).value(function (d) {
        return d.count;
    });

    var data = d3.nest()
        .key(function (d) {
            return d.func;
        })
        .entries(jsondata);

    data.forEach(function (d) {
        d.func = d.key;
        d.count = d.values.length;
    });

    var g = PIEsvg.append("g")
        .attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")")
        .selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.func);
        })
        .on("mouseover", mouseover);

    var legend = PIEsvg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", pieDim.w + 10)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", pieDim.w + 32)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) {
            return d;
        });

    function mouseover(d) {
        SP.update(jsondata, d.data.func, color(d.data.func));
        d3.select("#heatmapsvg").remove();
        heatmap.processData(jsondata, d.data.func);
    }

};

PC.init = function (jsondata) {
    PC.draw(jsondata);
};

module.exports = PC;