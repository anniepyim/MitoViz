var d3 = require('d3');
var colorbrewer = require('colorbrewer');

var SPmargin = {top: 20, right: 0, bottom: 30, left: 30},
    svgWidth = 900,
    svgHeight = 450,
    SPwidth = svgWidth - SPmargin.left - SPmargin.right, 
    SPheight = svgHeight - SPmargin.top - SPmargin.bottom;

var SPsvg;

var x = d3.scale.ordinal()
    .rangeRoundPoints([0, SPwidth], 1);

var y = d3.scale.linear()
    .range([SPheight, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var div = d3.select("#scatterplot").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var color = d3.scale.linear();
    //.interpolate(d3.interpolateHsl);

var mutatedcolor = "#6baed6";
var highlightcolor = "#f768a1";
var highlightradius = 6.5;

var clickEvent = {target: null, holdClick: false},
    tipTemplate = require('../views/templates').tooltip;

var SP = function (obj) {
    if (obj instanceof SP) return obj;
    if (!(this instanceof SP)) return new SP(obj);
    this.SPwrapped = obj;
};

SP.drawaxis = function () {

    SPsvg.append("g")
        .attr("id","x-axis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + SPheight + ")")
        .append("text")
        .attr("class", "label")
        .attr("x", SPwidth)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Sample");

    SPsvg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Log2 Fold change");

    SPsvg.append("rect")
        .attr("class", "SPrect")
        .attr("x", SPwidth - 250)
        .attr("width", 18)
        .attr("height", 18);

    SPsvg.append("text")
        .attr("class", "SPtitle")
        .attr("transform", "translate(" + (SPwidth - 220) + ",13)");

};

SP.update = function (jsondata, nfunc, ncolor,colorrange) {
    
    var mycolors = colorrange.split(',');
    
    var data = [];

    jsondata.forEach(function (d) {
        if (d.process == nfunc && !isNaN(parseFloat(d.log2)) && isFinite(d.log2)) {
            data.push(d);
        }
    });

    data.forEach(function (d) {
        d.log2 = +d.log2;
    });

    x.domain(data.map(function (d) {
        return d.sampleID;
    }));

    var ymin = Math.abs(d3.min(data, function (d) {
        return d.log2;
    }));
    var ymax = Math.abs(d3.max(data, function (d) {
        return d.log2;
    }));
    var yabs = Math.max(ymin, ymax);
    y.domain([yabs * -1, yabs]);
    //y.domain([-5,5])

    SPsvg.selectAll("text.SPtitle").text(nfunc);
    SPsvg.selectAll("rect.SPrect").style("fill", ncolor);

    SPsvg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);

    SPsvg.select(".x.axis")
        .call(xAxis);

    color.domain([yabs * -1, 0,yabs])
        .range([mycolors[0], mycolors[4],mycolors[8]]);

    var nodedata = data.map(function (d) {
        return {
            x: x(d.sampleID), 
            y: y(d.log2), 
            r: 3.5,
            log2: d.log2,
            pvalue: d.pvalue,
            sample: d.sampleID,
            process: d.process,
            gene_function: d.gene_function,
            gene: d.gene,
            mutation: d.mutation.split(',')
        };
    });

    var nodes = SPsvg.selectAll("circle.node")
        .data(nodedata);

    var norm = d3.random.normal(0, 1.5);
    var iterations = 0;

    function collide(node) {
        var r = node.r + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.r + quad.point.r;
                if (l < r)
                    node.x += norm();
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }

    while (iterations++ < 100) {
        var q = d3.geom.quadtree(nodedata);

        for (var i = 0; i < nodedata.length; i++)
            q.visit(collide(nodedata[i]));
    }

    nodes.transition()
        .duration(1000)
        .attr("r", function (d) {
            return d.mutation[0] !== ("NULL" || "") ? highlightradius : d.r;
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .style("fill", function (d) {
            return d.mutation[0] !== ("NULL" || "") ? mutatedcolor : color(d.log2);
        });

    nodes.enter().append("circle")
        .attr("class", "node")
        .attr("r", function (d) {
            return d.mutation[0] !== ("NULL" || "") ? highlightradius : d.r;
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .style("fill", function (d) {
            return d.mutation[0] !== ("NULL" || "") ? mutatedcolor : color(d.log2);
        })
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        /*.on("mouseover", function (d) {
            SP.mouseoverfunc(d, d.gene);
            SP.highlight(d, d.gene);
        })
        .on("mouseout", function (d) {
            SP.mouseoverfunc(d, ("NULL" || ""));
            SP.highlight(d, ("NULL" || ""));
        });*/
        .on('mouseover', SP.onMouseOverNode)
        .on('mouseout', SP.onMouseOut);

    nodes.exit()
        .transition(1000)
        .attr("r", 0)
        .remove();

};


SP.onMouseOut = function(node){
    
    if(clickEvent.holdClick) return;
    
    //Clear tooltip
    $('.tip').empty();
    
    highlight(("NULL" || ""));
};


SP.onMouseOverNode = function(node){
    
    if(clickEvent.holdClick) return;
    
    //Init tooltip if hover over gene
    if(!_.isUndefined(node.gene))
        $('.tip').append(tipTemplate(node));
    console.log(node);
    
    highlight(node.gene);

};

var highlight = function(target){
    
    SPsvg.selectAll("circle.node")
        .transition()
        .duration(500)
        .style("fill", function (d) {
            if (d.gene == target) {
                return highlightcolor;
            } else if (d.mutation[0] !== ("NULL" || "")) return mutatedcolor;
            else return color(d.log2);
        })
        .attr("r", function (d) {
            return d.gene == target ? highlightradius : d.mutation[0] !== ("NULL" || "") ? highlightradius : d.r;
        });
    
};

SP.init = function (jsondata,colorrange) {
    
    var resp = d3.select("#scatterplot")
        .append('div')
        .attr('class', 'svg-container'); //container class to make it responsive
    
    SPsvg = resp
    .append("svg")
    .attr("id", "scatterplotsvg")
    .attr('class', 'canvas svg-content-responsive')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', [0, 0, svgWidth, svgHeight].join(' '))
    .append("g")
    .attr("transform", "translate(" + SPmargin.left + "," + SPmargin.top + ")");
    
    SP.drawaxis();
    SP.update(jsondata, "Translation", "#8dd3c7",colorrange);
};

if (typeof define === "function" && define.amd) {
    define(SP);
} else if (typeof module === "object" && module.exports) {
    module.exports = SP;
} else {
    this.SP = SP;
}