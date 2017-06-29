//Libs
var d3 = require('d3');

//Modules
//var colorpicker = require('./js/colorpicker.js');
var SP = require('../svgs/scatterplot.js');
var BC = require('../svgs/barchart.js');
var heatmap = require('../svgs/heatmap.js');
var PCdata = require('../svgs/pcdata.js');
var pcPlot = require('../svgs/pcPlot.js');
var PCBC = require('../svgs/pcbarchart.js');
//var parserSP = require('./parserSP.js');
var parserPCA = require('./parserPCA.js');
var parserHeatmap = require('./parserHeatmap.js');
var mainframe = require('./mainframe.js');
mainframe = new mainframe();

//SC and Heatmap
//color scheme for SC plot and heatmap
var sccolor = "#d73027,#f46d43,#fdae61,#fee08b,#ffffbf,#d9ef8b,#a6d96a,#66bd63,#1a9850";

var vis = {};

//Function that calls parser to get data and then drawSP to draw the SP
vis.spcompareData = function(){
    
    var select, arr, json;
    
    //Get arrays selected samples from groups
    json = {};
    var element = document.getElementsByClassName('group_selection');
    for (i=0; i<element.length; i++){
        
        select = document.getElementById(element[i].id);
        var selectionLength = select.options.length;
        
        if (selectionLength > 0){
            
            arr = [];
            
            for (j = 0; j < selectionLength; j++) {
                arr[j] = select.options[j].value;
            }
            json[element[i].id] = arr;
        }  
        
    }
    
    //Get arrays of selected samples if group's not defined  
    if (jQuery.isEmptyObject(json)){
        
        select = document.getElementById('selected-sample');

        json = [];
        for (i = 0; i < select.options.length; i++) {
           json[i] = select.options[i].value;
        }
            
        if (json.length === 0) onError(new Error('Add samples!'));
        if (json.length > 6) onError(new Error('No more than 6 samples!'));
        
    }
        
    jQuery.ajax({
        url: "./R/SP.py", 
        data: JSON.stringify(json),
        type: "POST",
        dataType: "json",    
        success: function (data) {
            drawSP(data,sccolor);
        },
        error: function(e){
            onError(e);
        }
    });

};

function drawSP(data,sccolor) {
    
    //Remove everything on the svgs-all div
    //Calls renderscplot that render div for SP, BC, and heatmap within svgs-all
    var el = document.getElementById( 'svgs-all' );
    while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
    mainframe.setElement('#svgs-all').renderscplot();
    hideLoading();
    
    //Init SP, BC and heatmap that will draw things within the div for each of them respectively
    SP.init(data,sccolor);
    BC.init(data,sccolor);
    heatmap.init(data,sccolor);
}

function pcacompareData(){
    
    var this_js_script = $('script[src*=App_compare]');
    var sessionid = this_js_script.attr('session-id');
    
    var sametype = true,
        init = "all",
        count=1,
        type;

    //Check the type of selected samples
    $("#selected-sample option").each(function(i){
        if (count === 1) type = $(this).val().split("/")[2];
        else if ($(this).val().split("/")[2] != type) sametype = false;
        count = count+1;
    });
    
    //Check for error
    if (sametype === false) onError(new Error("Please select samples from the same project"));
    if ($('#selected-sample').find('option').length < 3) onError(new Error("Please add at least 3 samples"));

    //Get samples
    var samples = document.getElementById('selected-sample');

    for (var i = 0; i < samples.options.length; i++) { 
        samples.options[i].selected = true; 
    } 

    var parameter = $("#selected-sample").serialize() + '&filetype=' + type +'&sessionid='+ sessionid;
    
    //Remove everything on svgs-all div and render the div for PCA plot and the side bar, ie the one for folders
    //This has to be down before the parser since the parser will get info for files and update the folders
    var el = document.getElementById( 'svgs-all' );
    while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
    mainframe.setElement('#svgs-all').renderpca();

    //Pass to parser
    parserPCA.parse(drawPCA,onError,init,type,parameter,sessionid);
    

}

function drawPCA(data,init,type){
    
    d3.json("main_files/color.json", function(error,pccolor) {
        var attr = [],
            thiscat,
            prdata;

        //I. DEFINE parameters for attr, colors, and which particular attr, ie cat is selected
        //Define pccolor
        
        pccolor = pccolor[type];
        
        for (var key in pccolor){
            pccolor[key] = d3.scale.ordinal().range(pccolor[key]);
            attr.push(key);
        }

        //Define this cat
        var element = document.getElementsByClassName('pcbc');
        if (attr !== undefined) {thiscat = attr[0];}
        for (i=0;i<element.length;i++){
            if (element[i].style.background.substring(0,18)=="rgb(179, 204, 255)") {
                thiscat = element[i].id.slice(0, -5);
            }
        }    

        //II. PROCESS data for PCA and barcharts
        prdata = PCdata.init(data,attr,pccolor,thiscat);


        //IIIa. INITIATE PCA upon new analysis or changing folders
        if (init == "all" || init == "folder") {
            d3.select("#pcacanvas").remove();
            pcPlot.init();
        }

        //IIIb. DRAW PCA dots
        pcPlot.deletedots();
        pcPlot.adddots(prdata,attr);

        //IV. DRAW BARCHART with processed data if its a new analysis
        if (init == "all"){

            //Render the div for barchart and the SVG
            mainframe.setElement('#pcbarchart').renderpcabc();

            var clicking = function(){parserPCA.parse(drawPCA,onError,"update",type);};

            for (key in pccolor){
                var color = pccolor[key],
                    barchartname = key + 'barchart',
                    panelname = key + 'panel';

                PCBC.draw(prdata,color,key,barchartname,panelname);

                var d3panelname = '#'+panelname;

                d3.select(d3panelname)
                    .on({"click": clicking});
            }

            //JQuery that controls the behaviour of Barchart
            $('.pcbc').css('background','white');

            $('.pcbc').on({
            'click': function(){
                $('.pcbc').css('background','white');
                $(this).css('background','#b3ccff');
            },
            'mouseenter': function(){$(this).css('border','1px solid #6699ff');},
            'mouseleave': function(){$(this).css('border','');}
            }) ;     

            //Set the default panel - the one that will be painted on PC plot to be the first attr
            var defaultpanel = '#' +attr[0]+'panel';
            $(defaultpanel).css('background','#b3ccff');

        }
    
    });
    
}

function heatmapcompareData(){
    
    var this_js_script = $('script[src*=App_compare]');
    var sessionid = this_js_script.attr('session-id');
    
    var sametype = true,
        init = "all",
        count=1,
        type;

    //Check the type of selected samples
    $("#selected-sample option").each(function(i){
        if (count === 1) type = $(this).val().split("/")[2];
        else if ($(this).val().split("/")[2] != type) sametype = false;
        count = count+1;
    });
    
    //Check for error
   // if (type != "TCGA") onError(new Error("Please select samples only from the TCGA project"));
    if ($('#selected-sample').find('option').length < 3) onError(new Error("Please add at least 3 samples"));
    if (sametype === false) onError(new Error("Please select samples from the same project"));

    //Get samples
    var samples = document.getElementById('selected-sample');

    for (var i = 0; i < samples.options.length; i++) { 
        samples.options[i].selected = true; 
    } 

    var parameter = $("#selected-sample").serialize() + '&filetype=' + type + '&sessionid='+ sessionid;
    
    //Remove everything on svgs-all div and render the div for PCA plot and the side bar, ie the one for folders
    //This has to be down before the parser since the parser will get info for files and update the folders
    var el = document.getElementById( 'svgs-all' );
    while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
    mainframe.setElement('#svgs-all').renderheatmap();
    
    var parent = document.getElementById('heatmap'); 
    var div = document.createElement('div');
    div.setAttribute("align", "center");
    div.innerHTML ='<img id="loading" src="./img/loading.gif">';
    parent.appendChild(div);
    
    //Pass to parser
    parserHeatmap.parse(drawHeatmap,onError,init,type,parameter,sessionid);
    

}

function drawHeatmap(url,init,type){
    hideLoading();
    var parent = document.getElementById('heatmap');
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }   
    var div = document.createElement('div');
    div.innerHTML ='<iframe src="'+url+'" frameborder="0" height="100%" width="100%"></iframe>';
    parent.appendChild(div);
}

function hideLoading() {
    d3.select('#loading').remove();
}

//Function that might be called by other func if something went wrong
function onError(res) {
    document.getElementById('warning').innerHTML="<font color=\"red\">"+res;
    throw new Error("Something went badly wrong!");
}

//The button that starts the analysis, either SP or PCA
d3.select('#compareButton').on('click', function(){
    var analysis = document.querySelector('input[name = "analysis"]:checked').value;
    if (analysis == "scatterplotanalysis") vis.spcompareData();
    else if (analysis == "pcanalysis") pcacompareData();
    else heatmapcompareData();
});


/*function removeCriteria(attr){
    
    for(i=0; i<attr.length; i++){
        var cat = attr[i],
            criteria = cat + 'criteria';
        document.getElementById(criteria).value = "";
    }
    
    var buttons = document.getElementById('criteriabutton');
    while (buttons.hasChildNodes()) {
    buttons.removeChild(buttons.lastChild);
    }
    
}*/


module.exports = vis;