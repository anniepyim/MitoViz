var d3 = require('d3');
var pcPlot = require('./pcPlot.js');

var colorgroup = d3.scale.ordinal().range(["#ff004d","#ffff66","#a4ff52","#0067c6","#7d71e5"]),
    colorstage = d3.scale.ordinal().range(["#a4ff52","#ffff66","#da5802","#ff004d","#a7a5a5"]),
    colorgender = d3.scale.ordinal().range(["#ff0074","#52a4ff"]);

var PCdata = function (obj) {
    if (obj instanceof PCdata) return obj;
    if (!(this instanceof PCdata)) return new PCdata(obj);
    this.PCdatawrapped = obj;
};

PCdata.init = function (indata) {

    var xmax = d3.max(indata, function (d) {return d.pc1;}),
        xmin = d3.min(indata, function (d) {return d.pc1;}),
        zmax = d3.max(indata, function (d) {return d.pc2;}),
        zmin = d3.min(indata, function (d) {return d.pc2;}),
        ymax = d3.max(indata, function (d) {return d.pc3;}),
        ymin = d3.min(indata, function (d) {return d.pc3;});

    var xDom = (xmax-xmin)*0.1,
        yDom = (ymax-ymin)*0.1,
        zDom = (zmax-zmin)*0.1;

    var xScale = d3.scale.linear()
                  .domain([xmin-xDom,xmax+xDom])
                  .range([-100,100]);
    var yScale = d3.scale.linear()
                  .domain([ymin-yDom,ymax+yDom])
                  .range([-100,100]);                  
    var zScale = d3.scale.linear()
                  .domain([zmin-zDom,zmax+zDom])
                  .range([-100,100]);
    
        var prdata = indata.map(function(d){
                return{
                    sampleID: d.sampleID,
                    pc1: xScale(d.pc1),
                    pc2: zScale(d.pc2),
                    pc3: yScale(d.pc3),
                    group: d.group,
                    gender: d.gender,
                    stage: d.stage,
                };
            });
        
        prdata.sort(function(a,b) { return d3.ascending(a.group, b.group);});
        
        prdata.forEach(function (d) {
                d.color= colorgroup(d.group);
                d.groupcolor = colorgroup(d.group);
            });
        
        prdata.sort(function(a,b) { return d3.ascending(a.gender, b.gender);});
        
        prdata.forEach(function (d) {
                d.gendercolor = colorgender(d.gender);
            });
        
        prdata.sort(function(a,b) { return d3.ascending(a.stage, b.stage);});
        
        prdata.forEach(function (d) {
                d.stagecolor = colorstage(d.stage);
            });
        
    return prdata
};

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

PCdata.update = function(indata,cat){
    
    criteriagroup = document.getElementById('criteriagroup').value.split(",");
    criteriagroup.pop();
    criteriagender = document.getElementById('criteriagender').value.split(",");
    criteriagender.pop();
    criteriastage = document.getElementById('criteriastage').value.split(",");
    criteriastage.pop();
    
    newdata=[]
    
    if (criteriagroup.length == 0 && criteriagender.length == 0 && criteriastage.length == 0) newdata = indata;
    else{
        indata.forEach(function (d) {
            if ((contains.call(criteriagroup,d.group) || criteriagroup.length == 0) && (contains.call(criteriagender,d.gender) || criteriagender.length == 0) && (contains.call(criteriastage,d.stage) || criteriastage.length == 0)) newdata.push(d);
        });   
    }
    
    newdata.forEach(function (d) {
        d.color = (cat == "cancer type") ? d.groupcolor : (cat == "gender") ? d.gendercolor : d.stagecolor
    });
    
    pcPlot.deletedots();
    pcPlot.adddots(newdata);
    
};

PCdata.alert = function(){
    alert("PCdata");
};


//PCBC.alert();

//PCdata.alert();
if (typeof define === "function" && define.amd) {
    define(PCdata);
} else if (typeof module === "object" && module.exports) {
    module.exports = PCdata;
} else {
    this.PCdata = PCdata;
}