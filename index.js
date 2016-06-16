//Libs
//var fetch = require('./js/fetch.js');
var d3 = require('d3');

//Modules
var colorpicker = require('./js/colorpicker.js');
var SP = require('./js/scatterplot.js');
var BC = require('./js/barchart.js');
var heatmap = require('./js/heatmap.js');
var parser = require('./js/parser.js');


function hideLoading() {
    d3.select('#loading').remove();
    d3.select('#compareButton').remove();
    d3.select('#cb').remove();
}

function onError(res) {
    hideLoading();
}

function onSuccess(data,colorrange) {
    hideLoading();
    SP.init(data,colorrange);
    BC.init(data,colorrange);
    heatmap.init(data,colorrange);
}

d3.select('#compareButton').on('click', compareData);

function compareData(){
         var arr = [];
         var names = document.getElementsByName('Sample');
        var colorrange = d3.select('#colorinput').property("value");
            for(var x = 0; x < names.length; x++){
                if(names[x].checked)
                {
                arr.push(names[x].value);
                }
            }
        parser.parse(arr, onError, onSuccess,colorrange);
}

colorpicker();

//fetch('', function(data){console.log(data);});
//SP.init();
//PC();