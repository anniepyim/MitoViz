var d3 = require('d3');
var colorbrewer = require('colorbrewer');

var SP = require('./scatterplot.js');

var div = d3.select("#heatmap").append("div")
    .attr("class", "heatmaptooltip")
    .style("opacity", 0);

var heatmap = function (obj) {
    if (obj instanceof heatmap) return obj;
    if (!(this instanceof heatmap)) return new heatmap(obj);
    this.heatmapwrapped = obj;
};

heatmap.processData = function (jsondata, nfunc,colorrange) {

    var newdata = [];

    jsondata.forEach(function (d) {
        if (d.func == nfunc && !isNaN(parseFloat(d.value)) && isFinite(d.value)) {
            newdata.push(d);
        }
    });

    //create map for gene and sample data
    var genedata = d3.nest()
        .key(function (d) {
            return d.gene;
        })
        .entries(newdata);

    var sampledata = d3.nest()
        .key(function (d) {
            return d.sample;
        })
        .entries(newdata);

    var id = 1;
    var genemap = {};
    var genelist = [];
    genedata.forEach(function (d) {
        genemap[d.key] = id;
        genelist.push(d.key);
        id += 1;
    });

    id = 1;
    var samplemap = {};
    var samplelist = [];
    sampledata.forEach(function (d) {
        samplemap[d.key] = id;
        samplelist.push(d.key);
        id += 1;
    });

    outdata = [];

    newdata.forEach(function (d) {
        outdata.push({
            rowidx: samplemap[d.sample], 
            colidx: genemap[d.gene], 
            value: d.value, 
            sample: d.sample, 
            gene: d.gene, 
            func: d.func, 
            mutation: d.mutation
        });
    });

    heatmap.draw(outdata, samplelist, genelist,colorrange);
};

heatmap.draw = function (jsondata, samplelist, genelist,colorrange) {

    var mycolors = colorrange.split(',');
    
    jsondata.forEach(function (d) {
        d.rowidx = +d.rowidx;
        d.colidx = +d.colidx;
        d.value = +d.value;
    });

    
    var HMmargin = {top: 60, right: 0, bottom: 100, left: 80}, 
        HMwidth = 1300 - HMmargin.left - HMmargin.right, 
        HMheight = 430 - HMmargin.top - HMmargin.bottom,
        gridheight = HMheight / samplelist.length, 
        gridwidth = HMwidth / genelist.length, 
        legendElementWidth = HMwidth / 9,
        colors = colorrange.split(',');

    var svg = d3.select("#heatmap").append("svg")
        .attr("id", "heatmapsvg")
        .attr("width", HMwidth + HMmargin.left + HMmargin.right)
        .attr("height", HMheight + HMmargin.top + HMmargin.bottom)
        .append("g")
        .attr("transform", "translate(" + HMmargin.left + "," + HMmargin.top + ")");
    
    var rowSortOrder = false,
        colSortOrder = false,
        row_number = samplelist.length,
        col_number = genelist.length;
    
    var ymin = Math.abs(d3.min(jsondata, function (d) {
        return d.value;
    }));
    var ymax = Math.abs(d3.max(jsondata, function (d) {
        return d.value;
    }));
    var yabs = Math.max(ymin, ymax);

    var colorScale = d3.scale.quantile()
        .domain([yabs * -1, 0, yabs])
        .range(colors);

    var rowLabels = svg.append("g").selectAll(".rowLabel")
        .data(samplelist)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * gridheight;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridheight / 1.5 + ")")
        .attr("class", function (d, i) {
            return "rowLabel r" + i;
        })
        .on("mouseover", function (d) {
            d3.select(this).classed("text-hover", true);
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("text-hover", false);
        })
        .on("click", function (d, i) {
            rowSortOrder = !rowSortOrder;
            sortbylabel("r", i, rowSortOrder); //d3.select("#order").property("selectedIndex", 4).node().focus();
        });

    var colLabels = svg.append("g").selectAll(".colLabel")
        .data(genelist)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * gridwidth;
        })
        .style("text-anchor", "left")
        .attr("transform", "translate(" + gridwidth / 2 + ", -6 ) rotate (-90)")
        .attr("class", function (d, i) {
            return "colLabel c" + i;
        })
        .on("mouseover", function (d) {
            d3.select(this).classed("text-hover", true);
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("text-hover", false);
        })
        .on("click", function (d, i) {
            colSortOrder = !colSortOrder;
            sortbylabel("c", i, colSortOrder); //d3.select("#order").property("selectedIndex", 4).node().focus();
        });

    var cells = svg.append("g").selectAll(".cell")
        .data(jsondata, function (d) {
            return d.rowidx + ':' + d.colidx;
        });

    //cells.append("title");

    cells.enter().append("rect")
        .attr("x", function (d) {
            return (d.colidx - 1) * gridwidth;
        })
        .attr("y", function (d) {
            return (d.rowidx - 1) * gridheight;
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", function (d) {
            return "cell cr" + (d.rowidx - 1) + " cc" + (d.colidx - 1);
        })
        .attr("width", gridwidth)
        .attr("height", gridheight)
        .style("fill", colors[4])
        .on("mouseover", function (d) {
            heatmap.mouseoverfunc(d, d.gene);
            SP.highlight(d,d.gene);
        })
        .on("mouseout", function (d) {
            heatmap.mouseoverfunc(d, "NULL");
            SP.highlight(d,"NULL");
        });

    cells.transition().duration(1000)
        .style("fill", function (d) {
            return colorScale(d.value);
        });

    cells.select("title").text(function (d) {
        return d.value;
    });

    cells.exit().remove();

    var legend = svg.append("g").selectAll(".legend")
        .data([Math.round(yabs * 10) / 10 * -1, 0, 0, 0, 0, 0, 0, 0, Math.round(yabs * 10) / 10]);

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", function (d, i) {
            return legendElementWidth * i;
        })
        .attr("y", HMheight + 15)
        .attr("width", legendElementWidth)
        .attr("height", 20)
        .style("fill", function (d, i) {
            return colors[i];
        });

    legend.append("text")
        .attr("class", "mono")
        .text(function (d, i) {
            return (i === 0 || i === 4 || i === 8) ? d : "";
        })
        .attr("x", function (d, i) {
            return legendElementWidth * i + legendElementWidth / 2;
        })
        .attr("y", HMheight + 50);

    legend.exit().remove();

    function sortbylabel(rORc, i, sortOrder) {

        var t = svg.transition().duration(3000);
        var log2r = [];
        var sorted; // sorted is zero-based index
        d3.selectAll(".c" + rORc + i)
            .filter(function (ce) {
                log2r.push(ce.value);
            });
        if (rORc == "r") { // sort log2ratio of a gene
            sorted = d3.range(col_number).sort(function (a, b) {
                if (sortOrder) {
                    return log2r[b] - log2r[a];
                } else {
                    return log2r[a] - log2r[b];
                }
            });
            t.selectAll(".cell")
                .attr("x", function (d) {
                    return sorted.indexOf(d.colidx - 1) * gridwidth;
                });
            t.selectAll(".colLabel")
                .attr("y", function (d, i) {
                    return sorted.indexOf(i) * gridwidth;
                });
        } else { // sort log2ratio of a contrast
            sorted = d3.range(row_number).sort(function (a, b) {
                if (sortOrder) {
                    return log2r[b] - log2r[a];
                } else {
                    return log2r[a] - log2r[b];
                }
            });
            t.selectAll(".cell")
                .attr("y", function (d) {
                    return sorted.indexOf(d.rowidx - 1) * gridheight;
                });
            t.selectAll(".rowLabel")
                .attr("y", function (d, i) {
                    return sorted.indexOf(i) * gridheight;
                });
        }
        console.log(sorted);
    }

};

heatmap.mouseoverfunc = function (d, ingene) {

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
        tooltipheight = (53 + muts.length * 13).toString() + "px";
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



heatmap.init = function (jsondata,colorrange) {
    heatmap.processData(jsondata, "Apoptosis",colorrange);
};

if (typeof define === "function" && define.amd) {
    define(heatmap);
} else if (typeof module === "object" && module.exports) {
    module.exports = heatmap;
} else {
    this.heatmap = heatmap;
}