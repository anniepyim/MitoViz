//Libs
//var fetch = require('./js/fetch.js');
var d3 = require('d3');

//Modules
//var colorpicker = require('./js/colorpicker.js');
var SP = require('../svgs/scatterplot.js');
var BC = require('../svgs/barchart.js');
var heatmap = require('../svgs/heatmap.js');
//var pcPlot = require('../svgs/pcPlot.js');
var dataSelect = require('./dataselect.js');
var parser = require('./parser.js');
var exist = false;

function hideLoading() {
    d3.select('#loading').remove();
    d3.select('#cb').remove();
}

function onError(res) {
    alert(res);
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

//d3.select('#compareButton').on('click', compareData);

function compareData(){
        //var select = document.getElementById('selected-sample');
        var arr = ['./data/human-21.3.json','./data/mouse-21.3.json'];
        /*var arr = [];
        for (i = 0; i < select.options.length; i++) {
           arr[i] = select.options[i].value;
        }*/
        exist = !!document.getElementById("x-axis");
        
        var colorrange = "#d73027,#f46d43,#fdae61,#fee08b,#ffffbf,#d9ef8b,#a6d96a,#66bd63,#1a9850";
        //var colorrange = d3.select('#colorinput').property("value");
        parser.parse(arr, onError, onSuccess,colorrange);
}



$("#navbar li").click(function(e){
    $("#navbar li").prop('class','');
    $(this).toggleClass('active');
    
    if ($(this).text() == "PCA"){
        document.getElementById("scatterplot").style.display="none";
        document.getElementById("barchart").style.display="none";
        document.getElementById("heatmap").style.display="none";
        document.getElementById("pca").style.display="";
    }
    
    if ($(this).text() == "Scatter plot"){
        document.getElementById("scatterplot").style.display="";
        document.getElementById("barchart").style.display="";
        document.getElementById("heatmap").style.display="";
        document.getElementById("pca").style.display="none";
    }
});

//pcPlot.init();
compareData();

var vis = function(){};

module.exports = vis;