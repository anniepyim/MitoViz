var d3 = require('d3');
var pcPlot = require('./pcPlot.js');
var PCdata = require('./pcdata.js');

var colorgroup = d3.scale.ordinal().range(["#ff004d","#ffff66","#a4ff52","#0067c6","#7d71e5"]),
    colorstage = d3.scale.ordinal().range(["#a4ff52","#ffff66","#da5802","#ff004d","#a7a5a5"]),
    colorgender = d3.scale.ordinal().range(["#ff0074","#52a4ff"]);

var PCBC = function (obj) {
    if (obj instanceof PCBC) return obj;
    if (!(this instanceof PCBC)) return new PCBC(obj);
    this.PCBCwrapped = obj;
};

/*PCBC.draw = function (indata,cat,svgname,titlename,panelname) {
        
        var prdata = indata.map(function(d){
                return{
                    sampleID: d.sampleID,
                    pc1: +d.pc1,
                    pc2: +d.pc2,
                    pc3: +d.pc3,
                    group: d.group,
                    gender: d.gender,
                    stage: d.stage,
                    color: (cat == "cancer type") ? d.groupcolor : (cat == "gender") ? d.gendercolor : d.stagecolor,
                    category: (cat == "cancer type") ? d.group : (cat == "gender") ? d.gender : d.stage
                };
            });
        
        prdata.sort(function(a,b) { return d3.ascending(a.category, b.category);});
        
        var data = d3.nest()
                .key(function (d) {
                    return d.category;
                })
                .entries(prdata);

        data.forEach(function (d) {
                d.count = d.values.length;
            });
    
        var color = (cat == "cancer type") ? colorgroup : (cat == "gender") ? colorgender : colorstage;
        
        
        var BARmargin = {top: 15, right: 20, bottom: 15, left: 10},
        svgWidth = 300,
        barH = 40,
        BARwidth = svgWidth - BARmargin.left - BARmargin.right,
        BARheight = data.length * barH ,
        svgHeight = BARheight + BARmargin.top + BARmargin.bottom;

        var BARsvg = d3.select(svgname)//= resp
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
                    document.getElementById(panelname).style.border="1px solid #6699ff";},
                "mouseout":  function(){document.getElementById(panelname).style.border="";},  
                "click": function(){
                    click(prdata);
                    changeBackground(panelname);
                    }
                    //trigger PCdata.update, feed indata and cat
                });
        
        d3.select(titlename)
            .on({
                    "mouseover": function(){
                        document.getElementById(panelname).style.border="1px solid #6699ff";},
                    "mouseout":  function(){document.getElementById(panelname).style.border="";},  
                    "click": function(){
                        click(prdata);
                        changeBackground(panelname);
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
                changeBackground(panelname);
                    var text = document.getElementById('criteria');
    text.value = (text.value + d.key+",");
            });

        bar.append("text")
          .attr("x", 0)
          .attr("y", barH / 2)
          .attr("dy", ".35em")
          .text(function(d) { return d.key+" ("+d.count+")"; })
          .on("click", function(d){
                click(d.values);
                changeBackground(panelname);
                var text = document.getElementById('criteria');
    text.value = (text.value + d.key+",");
            });
    
            var button = document.getElementById('filterbutton')
        button.addEventListener("click", PCdata.update(prdata,"cancer type"));
    
    function click(d) {
            pcPlot.deletedots();
            pcPlot.adddots(d);
            
            
    }
    
    function changeBackground(panelname){
        var element = document.getElementsByClassName('pcbc');
        for (var e in element) if (element.hasOwnProperty(e)) element[e].style.background="white";
        document.getElementById(panelname).style.background="#b3ccff";
    }

};*/



PCBC.alert = function(){
    alert("PCBC");
};

pcPlot.alert();
PCdata.alert();

//SP.alert();

//fds.alert();
//PCdata.alert();

if (typeof define === "function" && define.amd) {
    define(PCBC);
} else if (typeof module === "object" && module.exports) {
    module.exports = PCBC;
} else {
    this.PCBC = PCBC;
}