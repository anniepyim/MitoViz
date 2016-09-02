var d3 = require('d3');
var colorbrewer = require('colorbrewer');
var SP = require('./scatterplot.js');
var heatmap = require('./heatmap.js');
require('../views/html2canvas.min.js')


//var color = d3.scale.category20();

var color = d3.scale.ordinal()
    .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#f781bf", "#fbb4ae", "#b3cde3", "#ffed6f", "#decbe4", "#fed9a6"]);

var BC = function (obj) {
    if (obj instanceof BC) return obj;
    if (!(this instanceof BC)) return new BC(obj);
    this.BCwrapped = obj;
};

var newdata,sampledata;

BC.draw = function (jsondata,colorrange) {
    
    var BARmargin = {top: 20, right: 0, bottom: 30, left: 0},
    svgHeight = 450,
    svgWidth = 300,
    BARwidth = svgWidth - BARmargin.left - BARmargin.right,
    BARheight = svgHeight - BARmargin.top - BARmargin.bottom;

    // create svg for bar chart.
    
    var resp = d3.select("#barchart")
        .append('div')
        .attr("id", "barchartsvg")
        .attr('class', 'svg-container'); //container class to make it responsive
    

    var BARsvg = resp
        .append("svg")
        .attr('class', 'canvas svg-content-responsive')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', [0, 0, svgWidth, svgHeight].join(' '))
        .append("g")
        .attr("transform", "translate(" + BARmargin.left + "," + BARmargin.top + ")");
        
    var barH = BARheight/17;
    
    newdata=[];
    
    jsondata.forEach(function (d) {
        if (!isNaN(parseFloat(d.log2)) && isFinite(d.log2))  newdata.push(d);
    });
    
    
    var data = d3.nest()
        .key(function (d) {
            return d.process;
        })
        .entries(newdata);
    
    sampledata = d3.nest()
        .key(function (d) {
            return d.sampleID;
        })
        .entries(jsondata);

    data.forEach(function (d) {
        d.process = d.key;
        d.count = d.values.length/sampledata.length;
    });
    
    data.sort(function(a,b) { return +b.count - +a.count; });
    
    var xmax = Math.abs(d3.max(data, function (d) {
        return d.count;
    }));
    
    var x = d3.scale.linear()
    .range([0, BARwidth])
    .domain([0,xmax]);

  var bar = BARsvg.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barH + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.count); })
      .attr("height", barH - 1)
      .style("fill", function (d) {
            return color(d.process);
        })
      .on("click", click);
    
    bar.append("text")
      .attr("x", 0)
      .attr("y", barH / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.process+" ("+d.count+")"; })
      .on("click", click);
    
    function click(d) {
        SP.update(jsondata, d.process, color(d.process),colorrange);
        d3.select("#heatmapsvg").remove();
        heatmap.processData(jsondata, d.process,colorrange);
    }
    

};

BC.init = function (jsondata,colorrange) {
    BC.draw(jsondata,colorrange);
};

saveTextAsFile = function(){
    try{
    var result = "";
    sampledata.forEach(function(dp){
        var key = dp.key;
        var upgenes = [], downgenes = [], mutation=[];
        newdata.forEach(function(d){
            if (d.sampleID == key){
                if (d.log2 >= 1.5) upgenes.push(d);
                if (d.log2 <= -1.5) downgenes.push(d);
                if (d.mutation !== "") mutation.push (d);
            }
        });
        result += "Results for " + key + "\n";
        result += "----------------------------\n\n";
        result += "UP-REGULATED GENES:\n\n";
        result += "GENE NAME\tCHROMOSOME\tPROCESS\tLOG2FOLD\tP-VALUE\n";
        upgenes.forEach(function(d){
            result += d.gene+"\t"+d.chr+"\t"+d.process+"\t"+d.log2+"\t"+d.pvalue+"\n";
        });
        result += "----------------------------\n\n";
        result += "DOWN-REGULATED GENES:\n\n";
        result += "GENE NAME\tCHROMOSOME\tPROCESS\tLOG2FOLD\tP-VALUE\n";
        downgenes.forEach(function(d){
            result += d.gene+"\t"+d.chr+"\t"+d.process+"\t"+d.log2+"\t"+d.pvalue+"\n";
        });
        result += "----------------------------\n\n";
        result += "MUTATED GENES:\n\n";
        result += "GENE NAME\tCHROMOSOME\tPROCESS\tVARIANT DESCRIPTION\n";
        mutation.forEach(function(d){
            result += d.gene+"\t"+d.chr+"\t"+d.process+"\t"+d.mutation+"\n";
        });
        result += "----------------------------\n";
        result += "----------------------------\n\n";
        
    });
    var textToWrite = result;
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		var fileNameToSaveAs = "Mito_variants.txt";
		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		window.URL = window.URL || window.webkitURL;
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		document.body.appendChild(downloadLink);
		downloadLink.click();
    }
    catch(err){
        alert("Please select samples!");
    }
};

	function destroyClickedElement(event)
	{
		// remove the link from the DOM
    		document.body.removeChild(event.target);
	}


	saveAsSvg = function()
 	{
 	
		var svg = d3.selectAll('#heatmapsvg');
        	var html ='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="'+svg.attr('width')+'" height="'+svg.attr('height')+'">' +svg.node().innerHTML +'</svg>';
    		var blob = new Blob([html], { type: "image/svg+xml;charset=utf-8" });
		var domUrl = self.URL || self.webkitURL || self;
            	var blobUrl = domUrl.createObjectURL(blob);
		var l = document.createElement("a");
        	l.download = 'Mito_network.svg';
		window.URL = window.URL || window.webkitURL;
		l.href = window.URL.createObjectURL(blob);
		document.body.appendChild(l);
        	l.click();
      
    /*html2canvas($('#barchartsvg'), 
    {
      onrendered: function (canvas) {
        var a = document.createElement('a');
        // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = 'somefilename.jpg';
        a.click();
      }
    });*/
	
	}



module.exports = BC;