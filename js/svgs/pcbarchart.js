var d3 = require('d3');
var pcPlot = require('./pcPlot.js');

var colorgroup = d3.scale.ordinal().range(["#ff004d","#ffff66","#a4ff52","#0067c6","#7d71e5"]),
    colorstage = d3.scale.ordinal().range(["#a4ff52","#ffff66","#da5802","#ff004d","#a7a5a5"]),
    colorgender = d3.scale.ordinal().range(["#ff0074","#52a4ff"]);

var PCBC = function (obj) {
    if (obj instanceof PCBC) return obj;
    if (!(this instanceof PCBC)) return new PCBC(obj);
    this.PCBCwrapped = obj;
};

PCBC.draw = function (cat) {
    
    d3.tsv("data/final.tsv", function (indata){
        
        var svgname = (cat == "cancer type") ? "groupbarchart" : (cat == "gender") ? "genderbarchart" : "stagebarchart",
            color = (cat == "cancer type") ? colorgroup : (cat == "gender") ? colorgender : colorstage,
            prdata = indata.map(function(d){
                return{
                    sampleID: d.sampleID,
                    pc1: +d.pc1,
                    pc2: +d.pc2,
                    pc3: +d.pc3,
                    group: d.group,
                    gender: d.gender,
                    stage: d.stage,
                    category: (cat == "cancer type") ? d.group : (cat == "gender") ? d.gender : d.stage
                };
            });
        
        prdata.sort(function(a,b) { return d3.ascending(a.category, b.category);});
        
        prdata.forEach(function (d) {
                d.color= color(d.category);
            });
        
        var data = d3.nest()
                .key(function (d) {
                    return d.category;
                })
                .entries(prdata);

        data.forEach(function (d) {
                d.count = d.values.length;
            });
        
        
        var BARmargin = {top: 20, right: 20, bottom: 30, left: 10},
        svgWidth = 300,
        barH = 40,
        BARwidth = svgWidth - BARmargin.left - BARmargin.right,
        BARheight = data.length * barH ,
        svgHeight = BARheight + BARmargin.top + BARmargin.bottom;

        // create svg for bar chart.

        var resp = d3.select("#pcbcsvg")
            .append('div')
            .attr("id", svgname)
            .attr('class', 'svg-container pcbc') //container class to make it responsive
            .style("font-size", "20px");
        
        // create div for title
        
        resp.append('div')
            .attr('class','col-md-12 minititle')
            .style('margin-top','10px')
            .on({
                "mouseover": function(){
                    document.getElementById(svgname).style.borderRadius="15px";
                    document.getElementById(svgname).style.border="1px solid #6699ff";},
                "mouseout":  function(){document.getElementById(svgname).style.border="";},  
                "click": function(){
                    click(prdata);
                    changeBackground(svgname);
                    }
                })
            .append('text')
            .text(cat);

        var BARsvg = resp
            .append("svg")
            .attr('class', 'canvas svg-content-responsive')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', [0, 0, svgWidth, svgHeight].join(' '))
            .append("g")
            .attr("transform", "translate(" + BARmargin.left + "," + BARmargin.top + ")");
        
        
        BARsvg.append("rect")
            .attr({"class": "overlay" , "width": BARwidth , "height": BARheight})
            .style("fill","transparent")
            .on({
                "mouseover": function(){
                    document.getElementById(svgname).style.borderRadius="15px";
                    document.getElementById(svgname).style.border="1px solid #6699ff";},
                "mouseout":  function(){document.getElementById(svgname).style.border="";},  
                "click": function(){
                    click(prdata);
                    changeBackground(svgname);
                    }
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
                return color(d.key);
            })
          .on("click", function(d){
                click(d.values);
                changeBackground(svgname);
            });

        bar.append("text")
          .attr("x", 0)
          .attr("y", barH / 2)
          .attr("dy", ".35em")
          .text(function(d) { return d.key+" ("+d.count+")"; })
          .on("click", function(d){
                click(d.values);
                changeBackground(svgname);
            });
        
        
    if (!document.getElementById("pcacanvas")) pcPlot.init(prdata);
        
    });
    
    
    function click(d) {
            pcPlot.deletedots();
            pcPlot.adddots(d);
            
            
    }
    
    function changeBackground(svgname){
        var element = document.getElementsByClassName('pcbc');
        for (var e in element) if (element.hasOwnProperty(e)) element[e].style.background="white";
        document.getElementById(svgname).style.borderRadius="15px";
        document.getElementById(svgname).style.background="#b3ccff";
    }
    

};

PCBC.init = function (cat) {
    PCBC.draw(cat);
};

module.exports = PCBC;