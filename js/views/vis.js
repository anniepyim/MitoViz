//Libs
var d3 = require('d3');

//Modules
//var colorpicker = require('./js/colorpicker.js');
var SP = require('../svgs/scatterplot.js');
var BC = require('../svgs/barchart.js');
var heatmap = require('../svgs/heatmap.js');
var PCdata = require('../svgs/pcdata.js');
var PCBC = require('../svgs/pcbarchart.js');
var parserSP = require('./parserSP.js');
var parserPCA = require('./parserPCA.js');
var mainframe = require('./mainframe.js');
mainframe = new mainframe();


//color scheme for SC plot and heatmap
var sccolor = "#d73027,#f46d43,#fdae61,#fee08b,#ffffbf,#d9ef8b,#a6d96a,#66bd63,#1a9850";

//color samples by these attributes, max 5
var attrTCGA = ['group','stage','gender','vital'];
var attrANEU = ['cellline','type'];

//color scheme for each attributes on PC plot and associated barcharts
var pccolorTCGA = {};
pccolorTCGA[attrTCGA[0]] = d3.scale.ordinal().range(["#ff004d","#ffff66","#a4ff52","#0067c6","#7d71e5"]);
pccolorTCGA[attrTCGA[1]] = d3.scale.ordinal().range(["#a4ff52","#ffff66","#ff751a","#ff004d","#a7a5a5"]);
pccolorTCGA[attrTCGA[2]] = d3.scale.ordinal().range(["#ff0074","#52a4ff"]);
pccolorTCGA[attrTCGA[3]]= d3.scale.ordinal().range(["#33ff88","#a10000","#a7a5a5"]);
pccolorTCGA[attrTCGA[4]]= d3.scale.ordinal().range(["#e6114c","#03a9f4","#a7a5a5"]);

//color scheme for each attributes on PC plot and associated barcharts
var pccolorANEU = {};
pccolorANEU[attrANEU[0]] = d3.scale.ordinal().range(["#ff0074","#52a4ff","#a7a5a5"]);
pccolorANEU[attrANEU[1]] = d3.scale.ordinal().range(["#a4ff52","#ffff66","#ff751a","#ff004d","#a7a5a5"]);

var vis = {};

//Function that calls parser to get data and then drawSP to draw the SP
vis.spcompareData = function(arr){
    //Get arrays of selected samples
    var select = document.getElementById('selected-sample');
    if (arr === undefined){
        arr = [];
        for (i = 0; i < select.options.length; i++) {
           arr[i] = select.options[i].value;
        } 
    }
    
    //Check for error
    if (arr.length === 0) onError(new Error('Add samples!'));
    if (arr.length > 6) onError(new Error('No more than 6 samples!'));
    //if (colorrange === "") errorcb(new Error('Pick color!'));
    
    //var sccolor = d3.select('#colorinput').property("value");
    parserSP.parse(arr, onError, drawSP,sccolor);
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
    
    var sametype = true,
        init = true,
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

    var parameter = $("#selected-sample").serialize() + '&filetype=' + type;

    //Pass to parser
    parserPCA.parse(drawPCA,onError,init,type,parameter);
    

}

function drawPCA(data,init,type){
    
    var attr,
        pccolor;
    
    //Define parameters for attr and colors
    if (type == "TCGA"){
        attr = attrTCGA;
        pccolor = pccolorTCGA;

    } else if (type == "aneuploidy"){  
        attr = attrANEU;
        pccolor = pccolorANEU;
    }
    else {type = 'other';}
    
    //Initiate PCA by rendering the PCA and Barcharts divs, and PCA folders
    if (init === true){
        
        //Remove everything on svgs-all div and render the div for PCA plot and the side bar, ie the one for folders
        var el = document.getElementById( 'svgs-all' );
        while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
        mainframe.setElement('#svgs-all').renderpca();
        
        //Retrieve files result from the python+R script runs and 
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
          },
            error: function(e){
                console.log(e);
            }
        });
        
        //Update the PCA plot by calling the functions upon clicking the buttons or changing folders
        $('#pcafolders').on('change',function(){parserPCA.parse(drawPCA,onError,false,type);});
    }
    
    //Check which panel is selected if exist
    var element = document.getElementsByClassName('pcbc');
    var thiscat;
    if (attr !== undefined) {thiscat = attr[0];}
    for (var e in element) if (element.hasOwnProperty(e)){
        if (element[e].style.background=="rgb(179, 204, 255)") {
            thiscat = element[e].id.slice(0, -5);
        }
    }
    
    //PROCESS data and DRAW PCA dots
    var prdata = PCdata.init(data,attr,pccolor,thiscat);
    
    //Use processed data to draw BARCHART
    if (init === true){
        
        //Render the div for barchart and the SVG
        mainframe.setElement('#pcbarchart').renderpcabc();

        for (i=0; i<attr.length; i++){
            var cat = attr[i],
                color = pccolor[cat],
                barchartname = cat + 'barchart',
                panelname = cat + 'panel';

            PCBC.draw(prdata,color,attr,cat,barchartname,panelname);
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
    
}

function hideLoading() {
    d3.select('#loading').remove();
    d3.select('#cb').remove();
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
    else pcacompareData();
});

/*function pcaupdateData(attr,pccolor){
    
    var process = $("#pcafolders option:selected").val();
    
    jQuery.ajax({
        url: process,  // or just tcga.py
        dataType: "json",    
        success: function (result) {
            drawPCA(result,attr,pccolor);
        },
        error: function(e){
            console.log(e);
        }
    });

}*/

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