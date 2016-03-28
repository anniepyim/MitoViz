var d3 = require('d3');
var colorbrewer = require('colorbrewer');

var div = d3.select("#heatmap").append("div")
    .attr("class", "heatmaptooltip")
    .style("opacity", 0);

var heatmap = function (obj) {
    if (obj instanceof heatmap) return obj;
    if (!(this instanceof heatmap)) return new heatmap(obj);
    this.heatmapwrapped = obj;
};

heatmap.processData = function (jsondata, nfunc) {

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
            sample: samplemap[d.sample]
            , gene: genemap[d.gene]
            , value: d.value
            , samplename: d.sample
            , genename: d.gene
            , func: d.func
            , mutation: d.mutation
        });
    });

    heatmap.draw(outdata, samplelist, genelist);
};

heatmap.draw = function (jsondata, samplelist, genelist) {

    console.log(jsondata);

    jsondata.forEach(function (d) {
        d.sample = +d.sample;
        d.gene = +d.gene;
        d.value = +d.value;
    });

    var margin = {
            top: 60
            , right: 0
            , bottom: 100
            , left: 100
        }
        , width = 1400 - margin.left - margin.right
        , height = 430 - margin.top - margin.bottom
        , gridheight = height / samplelist.length
        , gridwidth = width / genelist.length
        , legendElementWidth = width / 9
        , colors = colorbrewer.RdYlGn[9];
    //datasets = ["data.tsv", "data2.tsv"];

    var svg = d3.select("#heatmap").append("svg")
        .attr("id", "heatmapsvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

    var rowSortOrder = false;
    var colSortOrder = false;
    var row_number = samplelist.length;
    var col_number = genelist.length;
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
            return d.sample + ':' + d.gene;
        });

    //cells.append("title");

    cells.enter().append("rect")
        .attr("x", function (d) {
            return (d.gene - 1) * gridwidth;
        })
        .attr("y", function (d) {
            return (d.sample - 1) * gridheight;
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", function (d) {
            return "cell cr" + (d.sample - 1) + " cc" + (d.gene - 1);
        })
        .attr("width", gridwidth)
        .attr("height", gridheight)
        .style("fill", colors[4])
        .on("mouseover", function (d) {
            heatmap.mouseoverfunc(d, d.genename);
        })
        .on("mouseout", function (d) {
            heatmap.mouseoverfunc(d, "NULL");
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
        .attr("y", height + 15)
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
        .attr("y", height + 50);

    legend.exit().remove();

    function sortbylabel(rORc, i, sortOrder) {

        console.log("called");
        var t = svg.transition().duration(3000);
        var log2r = [];
        var sorted; // sorted is zero-based index
        d3.selectAll(".c" + rORc + i)
            .filter(function (ce) {
                log2r.push(ce.value);
            });
        console.log(log2r);
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
                    return sorted.indexOf(d.gene - 1) * gridwidth;
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
                    return sorted.indexOf(d.sample - 1) * gridheight;
                });
            t.selectAll(".rowLabel")
                .attr("y", function (d, i) {
                    return sorted.indexOf(i) * gridheight;
                });
        }
    }

};

heatmap.mouseoverfunc = function (d, ingene) {

    if (ingene == "NULL") {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    } else {
        var muts = d.mutation.split("|");
        var muttext = "<br>";
        for (i = 0; i < muts.length; i++) {
            muttext += muts[i] + "<br>";
        }
        tooltipheight = (53 + muts.length * 13).toString() + "px";
        div.transition()
            .duration(200)
            .style("opacity", 0.9)
            .style("height", tooltipheight);
        div.html("Gene: " + d.genename + "<br>" +
                "Function: " + d.func + "<br>" +
                "Log2 Fold Change: " + d.value + "<br>" +
                "Mutation: " + muttext)
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 10) + "px");
    }
};



heatmap.init = function (jsondata) {
    heatmap.processData(jsondata, "Apoptosis");
};

if (typeof define === "function" && define.amd) {
    define(heatmap);
} else if (typeof module === "object" && module.exports) {
    module.exports = heatmap;
} else {
    this.heatmap = heatmap;
}