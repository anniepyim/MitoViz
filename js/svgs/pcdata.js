var d3 = require('d3');
//var PCBC = require('./pcbarchart.js');
//var pcPlot = require('./pcPlot.js');

var colorgroup = d3.scale.ordinal().range(["#ff004d","#ffff66","#a4ff52","#0067c6","#7d71e5"]),
    colorstage = d3.scale.ordinal().range(["#a4ff52","#ffff66","#da5802","#ff004d","#a7a5a5"]),
    colorgender = d3.scale.ordinal().range(["#ff0074","#52a4ff"]);

var PCdata = function (obj) {
    if (obj instanceof PCdata) return obj;
    if (!(this instanceof PCdata)) return new PCdata(obj);
    this.PCdatawrapped = obj;
};

/*PCdata.init = function () {
    
    d3.tsv("data/final.tsv", function (indata){

        var prdata = indata.map(function(d){
                return{
                    sampleID: d.sampleID,
                    pc1: +d.pc1,
                    pc2: +d.pc2,
                    pc3: +d.pc3,
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

        
        pcPlot.init(prdata);
        PCBC.draw(prdata,"cancer type","#groupbarchart","#grouptitle","grouppanel");
        PCBC.draw(prdata,"gender","#genderbarchart","#gendertitle","genderpanel");
        PCBC.draw(prdata,"stage","#stagebarchart","#stagetitle","stagepanel");
        
        //d3.select button trigger pcdata.update
        //feed prdata,group
        //change style of bcs
        
        

        

    });
    
};

PCdata.update = function(indata,cat){
    
    crit = document.getElementById('criteria').value.split(",").pop();
    
    newdata=[]
    alert("f");
    
    //for (c in crit) console.log(c);
    
    indata.forEach(function (d) {
        for (c in crit){
            console.log(c);
            if (indata.group == c || indata.gender == c  || indata.stage == c ) newdata.push(d);
        }
    });
    
    console.log(newdata)
    //get criteria for pushing
    //set color to feed cat
    //update pcPlot
};*/

PCdata.alert = function(){
    alert("PCdata");
};

//SP.alert();

//PCBC.alert();

//PCdata.alert();
if (typeof define === "function" && define.amd) {
    define(PCdata);
} else if (typeof module === "object" && module.exports) {
    module.exports = PCdata;
} else {
    this.PCdata = PCdata;
}