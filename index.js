//Libs
//var fetch = require('./js/fetch.js');
var d3 = require('d3');

//Modules
var SP = require('./js/scatterplot.js');
var PC = require('./js/piechart.js');
var parser = require('./js/parser.js');

function hideLoading(){ 
    d3.select('#loading').remove();
}

function onError(res){
    hideLoading();
}

function onSuccess(data){
    //console.log(data);
    hideLoading();
    SP.init(data);
    PC.init(data);
    
}

parser.parse(['./data/HCT11683-3.json', './data/HCT11683-4.json'], onError, onSuccess);


//fetch('', function(data){console.log(data);});
//SP.init();
//PC();
