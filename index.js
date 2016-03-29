//Libs
//var fetch = require('./js/fetch.js');
var d3 = require('d3');

//Modules
var SP = require('./js/scatterplot.js');
var PC = require('./js/piechart.js');
var heatmap = require('./js/heatmap.js');
var parser = require('./js/parser.js');

function hideLoading() {
    d3.select('#loading').remove();
}

function onError(res) {
    hideLoading();
}

function onSuccess(data) {
    //console.log(data);
    hideLoading();
    SP.init(data);
    PC.init(data);
    heatmap.init(data);
}

parser.parse(['./data/116833.json', './data/116834.json', './data/11654.json','./data/RPE1H2B-213.json','./data/RPE153-123.json'], onError, onSuccess);


//fetch('', function(data){console.log(data);});
//SP.init();
//PC();