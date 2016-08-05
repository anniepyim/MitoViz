//Libs
//var fetch = require('./js/fetch.js');
var d3 = require('d3');

//Modules
//var colorpicker = require('./js/colorpicker.js');
var SP = require('../svgs/scatterplot.js');
var BC = require('../svgs/barchart.js');
var heatmap = require('../svgs/heatmap.js');
var pcPlot = require('../svgs/pcPlot.js');
var PCdata = require('../svgs/pcdata.js');
var PCBC = require('../svgs/pcbarchart.js');
var parser = require('./parser.js');
var parser2 = require('./parser2.js');
//var exist = false;

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

function onSuccess2(data){
    
    var prdata = PCdata.init(data);
    pcPlot.init(prdata);
    PCBC.draw(prdata,"cancer type","#groupbarchart","#grouptitle","grouppanel");
    PCBC.draw(prdata,"gender","#genderbarchart","#gendertitle","genderpanel");
    PCBC.draw(prdata,"stage","#stagebarchart","#stagetitle","stagepanel");
    
}

function onSuccess3(data){
    
    var cat;
    var prdata = PCdata.init(data);
    var element = document.getElementsByClassName('pcbc');
    for (var e in element) if (element.hasOwnProperty(e)){
        console.log(element[e].style.background);
        if (element[e].style.background=="rgb(179, 204, 255)") {
            cat = (element[e].id == "grouppanel") ? 'cancer type' : (element[e].id == "genderpanel") ? 'gender' : 'stage';
        }
    }
    PCdata.update(prdata,cat);
    
}

d3.select('#spcompareButton').on('click', spcompareData);
d3.select('#pcacompareButton').on('click', pcacompareData);
d3.select('#filterbutton').on("click", pcaupdateData);


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
    var select = document.getElementById('selected-sample');
    var url = "test.py?";
    for (i = 0; i < select.options.length; i++) {
       url = url+"file_list="+select.options[i].value;
        if (i < select.options.length-1) url=url+"&";
    }
    console.log(url);
    
    jQuery.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        success: function (result) {
            alert(result);
            parser2.parse("data/PCA/All Processes-pca.json", onError, onSuccess2);
        }
    });
    
    
}

function pcaupdateData(){
    parser2.parse('data/PCA/final.json', onError, onSuccess3);
}

function removeCriteria(){
    
    var index;
    
    criteriagroup = document.getElementById('criteriagroup').value.split(",");
    criteriagender = document.getElementById('criteriagender').value.split(",");
    criteriastage = document.getElementById('criteriastage').value.split(",");
    
    var index = criteriagroup.indexOf(this.textContent);
    if (index > -1) criteriagroup.splice(index, 1);
    var index = criteriagender.indexOf(this.textContent);
    if (index > -1) criteriagender.splice(index, 1);
    var index = criteriastage.indexOf(this.textContent);
    if (index > -1) criteriastage.splice(index, 1);
    
    console.log(criteriagroup);
    console.log(criteriagender);
    console.log(criteriastage);
    
    this.parentNode.removeChild(this);
    
}

var vis = function(){};

module.exports = vis;