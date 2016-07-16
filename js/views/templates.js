var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["Templates"] = this["Templates"] || {};

this["Templates"]["main"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<!-- Page Content -->        <div class=\"container main\">\n        <div id=\"#wrapUp\" class=\"row\">\n            \n        <div class=\"col-md-2\">\n        	<div class=\"row\">\n            	<div class=\"col-md-12 title\" style=\"margin-top:20px;\">\n	            Data Sets\n	            </div>\n	            <div class=\"col-md-12\" style=\"margin-top:10px;\">\n	            <select class=\"selectpicker\" id=\"folders\" data-style=\"btn-default\" id=\"selection1\" title=\"Pick dataset\" data-width=\"175px\" >\n	                <option value='./data/TCGA'>TCGA</option>\n	                <option value=\"./data/aneuploidy\">Aneuploidy</option>\n	                <option value='./data/viral'>Viral</option>\n	                <option value='./data/trisomy'>Trisomy</option>\n	                <option value='./data/user_uploads/json_files'>User Uploads</option>\n	            </select> \n	            </div>\n	           \n	            <div class=\"col-md-12\" style=\"margin-top:10px;\">\n	            <select class=\"selectpicker\" MULTIPLE id=\"files\" data-style=\"btn-default\" id=\"selection1\" title=\"Pick samples\" data-width=\"175px\" data-actions-box=\"true\" data-selected-text-format=\"static\">\n	            </select> \n	            </div>\n\n	            <div class=\"col-md-12\" style=\"margin-top:10px\">\n	            <select SIZE=\"6\" MULTIPLE id=\"selected-sample\" style=\"width: 175px;font-size: 14px\">\n	            </select>\n	            </div>\n	            \n	            <div class=\"col-md-12\" style=\"margin-top:10px;text-align:right\">\n	            <button id = \"delete-selected\" class=\"btn btn-xs btn-default\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span> Remove</button>\n	            <button id = \"clear-all\" class=\"btn btn-xs btn-danger\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span> Clear</button>\n	            </div>\n	            \n	            <div class=\"col-md-12\" id=\"warning\" style=\"margin-top:10px\"></div>\n	    \n	            <div class=\"col-md-12\" style=\"margin-top:20px;text-align: center\">\n	            <button id = \"compareButton\" class=\"btn btn-success\">compare</button>\n	            </div>\n            	<div class=\"col-md-12\"><hr></div>\n            </div>\n            <div class=\"row tip\" style=\"margin-top:20px;\"></div>\n        </div>\n        \n        <div class=\"col-md-10\">\n            <div id = \"nav_bar\">\n                <ul class=\"nav nav-tabs\" id = \"navbar\" >\n                  <li class=\"active\"><a href=\"#\">Scatter plot</a></li>\n                  <li><a href=\"#\">PCA</a></li>\n                  <li><a href=\"#\">Don't click me</a></li>\n                </ul>\n            </div>\n            <div id = \"svgs-all\">\n                <div id=\"scatterplot\" class=\"col-md-9\"></div>\n                <div id=\"pca\" class=\"col-md-9\" style=\"display:none\">\n<canvas id=\"pcacanvas\"></canvas>\n</div>\n                <div id=\"barchart\" class=\"col-md-3\"></div>\n                <div id=\"heatmap\" class=\"col-md-12\"></div>\n            </div>\n            \n        </div>\n        </div>\n        </div>";
},"useData":true});

/*this["Templates"]["result"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"list-group-item\"><span class=\"title\">"
    + alias4(((helper = (helper = helpers.Name || (depth0 != null ? depth0.Name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Name","hash":{},"data":data}) : helper)))
    + "</span><br><span>"
    + alias4(((helper = (helper = helpers.Process || (depth0 != null ? depth0.Process : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Process","hash":{},"data":data}) : helper)))
    + "</span></li>";
},"useData":true});*/

this["Templates"]["tooltip"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

    var mutationtext=alias4(((helper = (helper = helpers["mutation"] || (depth0 != null ? depth0["mutation"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mutation","hash":{},"data":data}) : helper))).split(',');
    
    var mutationhtml="";
    
    for(i = 0; i < mutationtext.length; i++){
        mutationhtml=mutationhtml+mutationtext[i]+"<br>";
    }

  return "<div class=\"col-md-12 title\">"
    + alias4(((helper = (helper = helpers.gene || (depth0 != null ? depth0.gene : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-12 process\">"
    + alias4(((helper = (helper = helpers.process || (depth0 != null ? depth0.process : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"process","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-12 function\">"
    + alias4(((helper = (helper = helpers.gene_function || (depth0 != null ? depth0.gene_function : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_function","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-6 miniTitle\">\n    Log2 FC\n</div>\n                \n<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers.log2 || (depth0 != null ? depth0.log2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"log2","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-6 miniTitle\">\n    Pvalue\n</div>\n                \n<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers["pvalue"] || (depth0 != null ? depth0["pvalue"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pvalue","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-12 miniTitle\">\n    mutation\n</div>\n                \n<div class=\"col-md-12 mutation\">"
    + mutationhtml
    + "</div>";
},"useData":true});

this["Templates"]["pcatooltip"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"col-md-12 title\">"
    + alias4(((helper = (helper = helpers.sampleID || (depth0 != null ? depth0.sampleID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sampleID","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-6 miniTitle\">\n    Group\n</div>\n                \n<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers["group"] || (depth0 != null ? depth0["group"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"group","hash":{},"data":data}) : helper)))
    //+ "</div>\n\n<div class=\"col-md-6 miniTitle\">\n    Stage\n</div>\n                \n<div class=\"col-md-6 info\">"
    //+ alias4(((helper = (helper = helpers.stage || (depth0 != null ? depth0.stage : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"stage","hash":{},"data":data}) : helper)))
    //+ "</div>\n\n<div class=\"col-md-6 miniTitle\">\n    Gender\n</div>\n                \n<div class=\"col-md-6 info\">"
    //+ alias4(((helper = (helper = helpers.gender || (depth0 != null ? depth0.gender : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gender","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-12 miniTitle\">\n    PC\n</div>\n                \n<div class=\"col-md-12\" style=\"text-align:left;font-size:12px\">PC1: "
    + alias4(((helper = (helper = helpers.pc1 || (depth0 != null ? depth0.pc1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pc1","hash":{},"data":data}) : helper)))
    + "<br>PC2: "
    + alias4(((helper = (helper = helpers.pc2 || (depth0 != null ? depth0.pc2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pc2","hash":{},"data":data}) : helper)))
    + "<br>PC3: "
    + alias4(((helper = (helper = helpers.pc3 || (depth0 != null ? depth0.pc3 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pc3","hash":{},"data":data}) : helper)))
    + "</div>";
},"useData":true});

if (typeof exports === 'object' && exports) {module.exports = this["Templates"];}