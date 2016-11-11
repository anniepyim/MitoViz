//Libs
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


var vis = {};
/*var vis = function (obj) {
    if (obj instanceof vis) return obj;
    if (!(this instanceof vis)) return new vis(obj);
    this.viswrapped = obj;
};*/

//The button that starts the analysis, either SP or PCA
d3.select('#compareButton').on('click', function(){
    var analysis = document.querySelector('input[name = "analysis"]:checked').value;
    if (analysis == "scatterplotanalysis") vis.spcompareData();
    else pcacompareData();
});


function hideLoading() {
    d3.select('#loading').remove();
    d3.select('#cb').remove();
}

//Function that might be called by other func if something went wrong
function onError(res) {
    document.getElementById('warning').innerHTML="<font color=\"red\">"+res;
    throw new Error("Something went badly wrong!");
}

//Function that calls parser to get data and then drawSP to draw the SP
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
};

function drawSP(data,colorrange) {
    
    //Remove everything on the svgs-all div
    //Calls renderscplot that render div for SP, BC, and heatmap within svgs-all
    var el = document.getElementById( 'svgs-all' );
    while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
    mainframe.setElement('#svgs-all').renderscplot();
    hideLoading();
    
    //Init SP, BC and heatmap that will draw things within the div for each of them respectively
    SP.init(data,colorrange);
    BC.init(data,colorrange);
    heatmap.init(data,colorrange);
}

function pcacompareData(){
    
    var sametype = true;
    var type;
    var count=1;
    
    $("#selected-sample option").each(function(i){
        if (count === 1) type = $(this).val().split("/")[2];
        else if ($(this).val().split("/")[2] != type) sametype = false;
        count = count+1;
    });
    
    
    if (sametype === false) onError("Please select samples from the same project");
    else if ($('#selected-sample').find('option').length < 3) onError("Please add at least 3 samples");
    else{
        //Remove everything on svgs-all div and render the div for PCA plot and the side bar, ie the one for folders
        var el = document.getElementById( 'svgs-all' );
        while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
        mainframe.setElement('#svgs-all').renderpca();
        
        
        //Render the div for barchart
        if (type == "TCGA") 
        mainframe.setElement('#pcbarchart').renderpcabc();
 
        
        //Controls the css of pcbarchart
        /*$('.pcbc').on({
            'click': function(){
                $('.pcbc').css('background','white');
                $(this).css('background','#b3ccff');
            },
            'mouseenter': function(){$(this).css('border','1px solid #6699ff')},
            'mouseleave': function(){$(this).css('border','')}
        })*/ 
        
        //Update the PCA plot by calling the functions upon clicking the buttons or changing folders
        $('#filterbutton').on('click', pcaupdateData);
        $('#pcafolders').on('change',pcaupdatefolder);
        
        
        //Run PCA by calling a python script that calls R
        var samples = document.getElementById('selected-sample');
    
        for (var i = 0; i < samples.options.length; i++) { 
            samples.options[i].selected = true; 
        } 
            
        jQuery.ajax({
            url: type == "TCGA" ? "./R/tcga.py" : "./R/other.py",  // or just tcga.py
            data: $("#selected-sample").serialize(),
            type: "POST",
            dataType: "json",    
            success: function (result) {
                //alert(result);
                pcPlot.init();
                drawPCA(result);
            },
            error: function(e){
                console.log(e);
            }
        });
        
        //Retrieve files result from the python+R script runs
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

function drawPCA(data){
    d3.selectAll(".pcbcchild").remove();
    
    var cat;
    var element = document.getElementsByClassName('pcbc');
    if (!!element[0]){
        for (var e in element) if (element.hasOwnProperty(e)){
            if (element[e].style.background=="rgb(179, 204, 255)") {
            cat = (element[e].id == "grouppanel") ? 'cancer type' : (element[e].id == "genderpanel") ? 'gender' : (element[e].id == "stagepanel") ? 'stage' :(element[e].id == "vitalpanel") ? 'vital': 'neg3';
            }
        }
    }else cat = 'cancer type';
    
    var prdata = PCdata.init(data,cat);
    pcPlot.deletedots();
    pcPlot.adddots(prdata);

    //if (!!element[0]){
        PCBC.draw(prdata,"cancer type","groupbarchart","#grouptitle","grouppanel");        PCBC.draw(prdata,"gender","genderbarchart","#gendertitle","genderpanel");
        PCBC.draw(prdata,"stage","stagebarchart","#stagetitle","stagepanel");
        PCBC.draw(prdata,"vital","vitalbarchart","#vitaltitle","vitalpanel");
        //PCBC.draw(prdata,"neg3","#neg3barchart","#neg3title","neg3panel");   
    //}
        $('.pcbc').css('background','white');
    
        $('.pcbc').on({
        'click': function(){
            $('.pcbc').css('background','white');
            $(this).css('background','#b3ccff');
        },
        'mouseenter': function(){$(this).css('border','1px solid #6699ff')},
        'mouseleave': function(){$(this).css('border','')}
        })
        

}

function pcaupdateData(){
    
    var process = $("#pcafolders option:selected").val();
    
    jQuery.ajax({
        url: process,  // or just tcga.py
        dataType: "json",    
        success: function (result) {
            drawPCA(result);
        },
        error: function(e){
            console.log(e);
        }
    });

}

function pcaupdatefolder(){
    
    var process = $("#pcafolders option:selected").val();
    
        console.log(process);
    
    jQuery.ajax({
        url: process,  // or just tcga.py
        dataType: "json",    
        success: function (result) {
            d3.select("#pcacanvas").remove();
            pcPlot.init();
            drawPCA(result);
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