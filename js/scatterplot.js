var d3 = require('d3');
var colorbrewer = require('colorbrewer');

var SPmargin = {top: 20, right: 20, bottom: 30, left: 80}, 
    SPwidth = 1000 - SPmargin.left - SPmargin.right, 
    SPheight = 400 - SPmargin.top - SPmargin.bottom;

var SPsvg = d3.select("#scatterplot").append("svg")
    .attr("id", "scatterplotsvg")
    .attr("width", SPwidth + SPmargin.left + SPmargin.right)
    .attr("height", SPheight + SPmargin.top + SPmargin.bottom)
    .append("g")
    .attr("transform", "translate(" + SPmargin.left + "," + SPmargin.top + ")");

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
        .attr("x", SPwidth - 180)
        .attr("width", 18)
        .attr("height", 18);

    SPsvg.append("text")
        .attr("class", "SPtitle")
        .attr("transform", "translate(" + (SPwidth - 155) + ",13)");

};

SP.update = function (jsondata, nfunc, ncolor,colorrange) {
    
    var mycolors = colorrange.split(',');
    
    var data = [];

    jsondata.forEach(function (d) {
        if (d.func == nfunc && !isNaN(parseFloat(d.value)) && isFinite(d.value)) {
            data.push(d);
        }
    });

    data.forEach(function (d) {
        d.value = +d.value;
    });

    x.domain(data.map(function (d) {
        return d.sample;
    }));

    var ymin = Math.abs(d3.min(data, function (d) {
        return d.value;
    }));
    var ymax = Math.abs(d3.max(data, function (d) {
        return d.value;
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
            x: x(d.sample), 
            y: y(d.value), 
            r: 3.5,
            value: d.value,
            sample: d.sample,
            func: d.func,
            gene: d.gene,
            mutation: d.mutation
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
            return d.mutation !== "NULL" ? highlightradius : d.r;
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .style("fill", function (d) {
            return d.mutation !== "NULL" ? mutatedcolor : color(d.value);
        });

    nodes.enter().append("circle")
        .attr("class", "node")
        .attr("r", function (d) {
            return d.mutation !== "NULL" ? highlightradius : d.r;
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .style("fill", function (d) {
            return d.mutation !== "NULL" ? mutatedcolor : color(d.value);
        })
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .on("mouseover", function (d) {
            SP.mouseoverfunc(d, d.gene);
            SP.highlight(d, d.gene);
        })
        .on("mouseout", function (d) {
            SP.mouseoverfunc(d, "NULL");
            SP.highlight(d, "NULL");
        });

    nodes.exit()
        .transition(1000)
        .attr("r", 0)
        .remove();

};

SP.mouseoverfunc = function (d, ingene) {

    if (ingene == "NULL") {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    } else {
        var muts = d.mutation.split(",");
        var muttext = "<br>";
        for (i = 0; i < muts.length; i++) {
            muttext += muts[i] + "<br>";
        }
        tooltipheight = (58 + muts.length * 15).toString() + "px";
        div.transition()
            .duration(200)
            .style("opacity", 0.9)
            .style("height", tooltipheight);
        div.html("Gene: " + d.gene + "<br>" +
                "Function: " + d.func + "<br>" +
                "Log2 Fold Change: " + d.value + "<br>" +
                "Mutation: " + muttext)
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 10) + "px");
    }



};

SP.highlight = function(d, ingene){
        /*var targetgene;
    var targetfunc;
    var targetlog2;
    var targetmut;
    var targetx;
    var targety;*/
    SPsvg.selectAll("circle.node")
        .transition()
        .duration(500)
        .style("fill", function (d) {
            if (d.gene == ingene) {
                /*if (d.sample != insample && (d.sample == "8/3 clone 3" || d.sample == "8/3 clone 4")){
                    targetgene = d.gene;
                    targetfunc = d.func;
                    targetlog2 = d.value;
                    targetmut = d.mutation;
                    targetx = d.x;
                    targety = d.y;
                }*/
                return highlightcolor;
            } else if (d.mutation !== "NULL") return mutatedcolor;
            else return color(d.value);
        })
        .attr("r", function (d) {
            return d.gene == ingene ? highlightradius : d.mutation !== "NULL" ? highlightradius : d.r;
        });

    /*if (ingene != "NULL"){
        var muts = targetmut.split("|");
        var muttext = "<br>";
        for (i = 0; i < muts.length; i++) { 
            muttext += muts[i] + "<br>";
        }
        tooltipheight = (53+muts.length*13).toString()+"px";
        div2.transition()        
          .duration(200)      
          .style("opacity", 0.9)
          .style("height", tooltipheight);
        div2.html("Gene: " + targetgene + "<br>" +
             "Function: " + targetfunc + "<br>"+
             "Log2 Fold Change: " + targetlog2 + "<br>" +
             "Mutation: " + muttext)  
            .style("left", (targetx+55).toString() + "px")     
            .style("top", (targety+15).toString() + "px");

    }else{
        div2.transition()        
            .duration(500)      
            .style("opacity", 0);  
    }*/
};

SP.init = function (jsondata,colorrange) {
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