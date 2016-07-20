//Libs
//var fetch = require('./js/fetch.js');
var d3 = require('d3');

//Modules
//var colorpicker = require('./js/colorpicker.js');
var SP = require('../svgs/scatterplot.js');
var BC = require('../svgs/barchart.js');
var heatmap = require('../svgs/heatmap.js');
//var pcPlot = require('../svgs/pcPlot.js');
var PCBC = require('../svgs/pcbarchart.js');
var parser = require('./parser.js');
var exist = false;

function hideLoading() {
    d3.select('#loading').remove();
    d3.select('#cb').remove();
}

function onError(res) {
    document.getElementById('warning').innerHTML="<font color=\"red\">"+res;
    throw new Error("Something went badly wrong!");
}

function onSuccess(data,colorrange) {
    hideLoading();
    if (exist === false){
        SP.init(data,colorrange);
        BC.init(data,colorrange);
        heatmap.init(data,colorrange);
    }
    else{
        SP.update(data, "Apoptosis", "#b3de69",colorrange);
        d3.select("#barchartsvg").remove();
        BC.init(data,colorrange);
        d3.select("#heatmapsvg").remove();
        heatmap.processData(data, "Apoptosis",colorrange);
    }
}

d3.select('#spcompareButton').on('click', spcompareData);
d3.select('#pcacompareButton').on('click', pcacompareData);

function spcompareData(){
        var select = document.getElementById('selected-sample');
        var arr = [];
        for (i = 0; i < select.options.length; i++) {
           arr[i] = select.options[i].value;
        }
        exist = !!document.getElementById("x-axis");
        
        var colorrange = "#d73027,#f46d43,#fdae61,#fee08b,#ffffbf,#d9ef8b,#a6d96a,#66bd63,#1a9850";
        //var colorrange = d3.select('#colorinput').property("value");
        parser.parse(arr, onError, onSuccess,colorrange);
}

function pcacompareData(){
    
        exist = !!document.getElementById("genderbarchart");
        
        if (exist === false){
            PCBC.init("gender");
            PCBC.init("stage");
            PCBC.init("cancer type");   
        }
}



var vis = function(){};

module.exports = vis;