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
var mainframe = require('./mainframe.js');


mainframe = new mainframe();

var vis = function (obj) {
    if (obj instanceof vis) return obj;
    if (!(this instanceof vis)) return new vis(obj);
    this.viswrapped = obj;
};

function hideLoading() {
    d3.select('#loading').remove();
    d3.select('#cb').remove();
}

function onError(res) {
    document.getElementById('warning').innerHTML="<font color=\"red\">"+res;
    throw new Error("Something went badly wrong!");
}

function drawSP(data,colorrange) {
    var el = document.getElementById( 'svgs-all' );
    while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
    mainframe.setElement('#svgs-all').renderscplot();
    hideLoading();
    SP.init(data,colorrange);
    BC.init(data,colorrange);
    heatmap.init(data,colorrange);
}

function redrawPCA(data){
    d3.selectAll(".pcbcchild").remove();
    
    var cat;
    var element = document.getElementsByClassName('pcbc');
    for (var e in element) if (element.hasOwnProperty(e)){
        if (element[e].style.background=="rgb(179, 204, 255)") {
            cat = (element[e].id == "grouppanel") ? 'cancer type' : (element[e].id == "genderpanel") ? 'gender' : (element[e].id == "stagepanel") ? 'stage' :(element[e].id == "vitalpanel") ? 'vital': 'neg3';
        }
    }
    
    var prdata = PCdata.init(data,cat);
    pcPlot.deletedots();
    pcPlot.adddots(prdata);
    PCBC.draw(prdata,"cancer type","#groupbarchart","#grouptitle","grouppanel");
    PCBC.draw(prdata,"gender","#genderbarchart","#gendertitle","genderpanel");
    PCBC.draw(prdata,"stage","#stagebarchart","#stagetitle","stagepanel");
    PCBC.draw(prdata,"vital","#vitalbarchart","#vitaltitle","vitalpanel");
    PCBC.draw(prdata,"neg3","#neg3barchart","#neg3title","neg3panel");
}


d3.select('#compareButton').on('click', function(){
    var analysis = document.querySelector('input[name = "analysis"]:checked').value;
    if (analysis == "scatterplotanalysis") vis.spcompareData();
    else pcacompareData();
});



vis.spcompareData = function(arr){
    var select = document.getElementById('selected-sample');
    if (arr === undefined){
        arr = [];
        for (i = 0; i < select.options.length; i++) {
           arr[i] = select.options[i].value;
        } 
    }
    
    var colorrange = "#d73027,#f46d43,#fdae61,#fee08b,#ffffbf,#d9ef8b,#a6d96a,#66bd63,#1a9850";
    //var colorrange = d3.select('#colorinput').property("value");
    parser.parse(arr, onError, drawSP,colorrange);
}

function pcacompareData(){
    
    var el = document.getElementById( 'svgs-all' );
    while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
    mainframe.setElement('#svgs-all').renderpca();
    mainframe.setElement('#pcbarchart').renderpcabc();
    
    d3.select('#filterbutton').on("click", pcaupdateData);
    $('#pcafolders').on('change',pcaupdatefolder);
    
    var tcga = true;
    
    $("#selected-sample option").each(function(i){
        if (!$(this).val().includes("TCGA")) tcga = false;
    });
    
    if (tcga === false) onError("Sorry! Only TCGA samples are allowed");
    else if ($('#selected-sample').find('option').length < 3) onError("Please add at least 3 samples");
    else{
        
        var samples = document.getElementById('selected-sample');
    
        for (var i = 0; i < samples.options.length; i++) { 
            samples.options[i].selected = true; 
        } 

        jQuery.ajax({
            url: "./R/test.py",  // or just test.py
            data: $("#selected-sample").serialize(),
            type: "POST",
            dataType: "json",    
            success: function (result) {
                pcPlot.init();
                redrawPCA(result);
            },
            error: function(e){
                console.log(e);
            }
        });

        var targeturl = './data/PCA/';
        var folderurl = '.'+targeturl;
        var htmltext = "",
        value = "",
        text = "";

        jQuery.ajax({
            type: "POST",
            url: "./php/getdirectory.php",
            dataType: "json",
            data: { folderurl : folderurl },
          success: function(data){
              $('#pcafolders').empty();
              $.each(data, function(i,filename) {
                value = targeturl+filename;
                text = filename.split("-pca")[0];
                htmltext = htmltext+'<option value=\"'+value+'\">'+text+'</option>';

            });

            $("#pcafolders").html(htmltext);
            $('#pcafolders').selectpicker('refresh');
            $('#pcafolders').find('[value="./data/PCA/All Processes-pca.json"]').prop('selected',true);
            $('#pcafolders').selectpicker('refresh');
          }
        });
    }

}

function pcaupdateData(){
    
    var process = $("#pcafolders option:selected").val();
    
    jQuery.ajax({
        url: process,  // or just test.py
        dataType: "json",    
        success: function (result) {
            redrawPCA(result);
        },
        error: function(e){
            console.log(e);
        }
    });

}

function pcaupdatefolder(){
    
    var process = $("#pcafolders option:selected").val();
    
    jQuery.ajax({
        url: process,  // or just test.py
        dataType: "json",    
        success: function (result) {
            d3.select("#pcacanvas").remove();
            pcPlot.init();
            redrawPCA(result);
        },
        error: function(e){
            console.log(e);
        }
    });
}

function removeCriteria(){
    
    document.getElementById('criteriagroup').value = "";
    document.getElementById('criteriagender').value = "";
    document.getElementById('criteriastage').value = "";
    document.getElementById('criteriavital').value = "";
    document.getElementById('criterianeg3').value = "";
    
    var buttons = document.getElementById('criteriabutton');
    while (buttons.hasChildNodes()) {
    buttons.removeChild(buttons.lastChild);
    }
    
}

module.exports = vis;