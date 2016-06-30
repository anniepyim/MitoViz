//Libs
//var fetch = require('./js/fetch.js');
var d3 = require('d3');

//Modules
var colorpicker = require('./js/colorpicker.js');
var SP = require('./js/scatterplot.js');
var BC = require('./js/barchart.js');
var heatmap = require('./js/heatmap.js');
var parser = require('./js/parser.js');
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

d3.select('#compareButton').on('click', compareData);

function compareData(){
        var select = document.getElementById('selected-sample');

        var arr = [];
        for (i = 0; i < select.options.length; i++) {
           arr[i] = select.options[i].value;
        }
        exist = !!document.getElementById("x-axis");
        var colorrange = d3.select('#colorinput').property("value");
        parser.parse(arr, onError, onSuccess,colorrange);
}



$("#navbar li").click(function(e){
    $("#navbar li").prop('class','');
    $(this).toggleClass('active');
    document.getElementById("barchart").remove();
});

