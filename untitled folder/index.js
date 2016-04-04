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
    d3.select('#compareButton').remove();
    d3.select('#cb').remove();
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


d3.select('#compareButton').on('click', compareData);

function compareData(){
         var arr = [];
         var names = document.getElementsByName('Sample');
            for(var x = 0; x < names.length; x++){
                if(names[x].checked)
                {
                arr.push(names[x].value);
                }
            }
        parser.parse(arr, onError, onSuccess);
}





//fetch('', function(data){console.log(data);});
//SP.init();
//PC();