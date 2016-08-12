var d3 = require('d3');
//var pcPlot = require('./pcPlot.js');
var PCdata = require('./pcdata.js');

var colorgroup = d3.scale.ordinal().range(["#ff004d","#ffff66","#a4ff52","#0067c6","#7d71e5"]),
    colorstage = d3.scale.ordinal().range(["#a4ff52","#ffff66","#da5802","#ff004d","#a7a5a5"]),
    colorgender = d3.scale.ordinal().range(["#ff0074","#52a4ff"]),
    colorvital = d3.scale.ordinal().range(["#33ff88","#a10000","#a7a5a5"]),
    colorneg3 = d3.scale.ordinal().range(["#e6114c","#03a9f4","#a7a5a5"]);

var PCBC = function (obj) {
    if (obj instanceof PCBC) return obj;
    if (!(this instanceof PCBC)) return new PCBC(obj);
    this.PCBCwrapped = obj;
};

PCBC.draw = function (indata,cat,svgname,titlename,panelname) {
        
        var criteria = (cat == "cancer type") ? 'criteriagroup' : (cat == "gender") ? 'criteriagender' : (cat == "stage") ? 'criteriastage' : (cat == "vital") ? 'criteriavital' : 'criterianeg3';
        
        var prdata = indata.map(function(d){
                return{
                    sampleID: d.sampleID,
                    pc1: +d.pc1,
                    pc2: +d.pc2,
                    pc3: +d.pc3,
                    group: d.group,
                    gender: d.gender,
                    stage: d.stage,
                    vital: d.vital,
                    neg3: d.neg3,
                    color: (cat == "cancer type") ? d.groupcolor : (cat == "gender") ? d.gendercolor : (cat == "stage") ? d.stagecolor : (cat == "vital") ? d.vitalcolor : d.neg3color,
                    category: (cat == "cancer type") ? d.group : (cat == "gender") ? d.gender : (cat == "stage") ? d.stage : (cat == "vital") ? d.vital : d.neg3
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
    
        var color = (cat == "cancer type") ? colorgroup : (cat == "gender") ? colorgender : (cat == "stage") ? colorstage : (cat == "vital") ? colorvital : colorneg3;
        
        
        var BARmargin = {top: 15, right: 20, bottom: 15, left: 10},
        svgWidth = 300,
        barH = 40,
        BARwidth = svgWidth - BARmargin.left - BARmargin.right,
        BARheight = data.length * barH ,
        svgHeight = BARheight + BARmargin.top + BARmargin.bottom;

        var BARsvg = d3.select(svgname)//= resp
            .append("svg")
            .attr('class', 'canvas svg-content-responsive pcbcchild')
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
                    PCdata.update(indata,cat);
                    changeBackground(panelname);
                    }
                });
        
        d3.select(titlename)
            .on({
                    "mouseover": function(){
                        document.getElementById(panelname).style.border="1px solid #6699ff";},
                    "mouseout":  function(){document.getElementById(panelname).style.border="";},  
                    "click": function(){
                        PCdata.update(indata,cat);
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
                addCriteria(criteria,d.key);
            });

        bar.append("text")
          .attr("x", 0)
          .attr("y", barH / 2)
          .attr("dy", ".35em")
          .text(function(d) { return d.key+" ("+d.count+")"; })
          .on("click", function(d){
                addCriteria(criteria,d.key);
            });
    

    
    function changeBackground(panelname){
        var element = document.getElementsByClassName('pcbc');
        for (var e in element) if (element.hasOwnProperty(e)) element[e].style.background="white";
        document.getElementById(panelname).style.background="#b3ccff";
    }
    
    var contains = function(needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;

        if(!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1, index = -1;

                for(i = 0; i < this.length; i++) {
                    var item = this[i];

                    if((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(this, needle) > -1;
    };
    
    function addCriteria(criteria,key){
        
        var text = document.getElementById(criteria);
        crit = text.value.split(",");
        crit.pop();
        
        if (!contains.call(crit,key)){
            text.value = (text.value + key+",");

            var button = document.createElement("button");
            button.className = "btn btn-xs btn-default criteriabut";
            var textnode = document.createTextNode(key);
            button.appendChild(textnode);
            var gly = document.createElement("span");
            gly.className = "glyphicon glyphicon-trash";
            button.appendChild(gly);
            button.onclick = function(e){
                var array = document.getElementById(criteria).value.split(",");
                var index = array.indexOf(key);
                if (index > -1) {array.splice(index, 1);};
                document.getElementById(criteria).value = array.toString();
                this.parentNode.removeChild(this)
            }
            document.getElementById("criteriabutton").appendChild(button);   
        }
    }

};


if (typeof define === "function" && define.amd) {
    define(PCBC);
} else if (typeof module === "object" && module.exports) {
    module.exports = PCBC;
} else {
    this.PCBC = PCBC;
}