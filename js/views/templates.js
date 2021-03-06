var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["Templates"] = this["Templates"] || {};

this["Templates"]["heatmap"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"col-md-12\" style=\"margin-top:10px;\" align=\"center\">\n    Show Heatmap by Processes <select class=\"selectpicker\" id=\"heatmapfolders\" data-style=\"btn-default\" title=\"Pick process\" data-width=\"175px\">\n    </select>\n</div>\n<div id=\"heatmap\" class=\"col-md-12\"></div>";
},"useData":true});

this["Templates"]["main"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<!-- Page Content -->        \n<div class=\"container main\">\n        <div id=\"#wrapUp\" class=\"row\">\n            \n        <div class=\"col-md-2\">\n         <div class=\"row\">\n             \n             <!--Folders to select data -->\n             \n             <div class=\"col-md-12 title\" style=\"margin-top:20px;\" id=\"hihi\">\n              Data Sets\n             </div>\n              <div class=\"col-md-12\" style=\"margin-top:10px;\">\n            \n              <select class=\"selectpicker\" id=\"folders\" data-style=\"btn-default\" title=\"Pick dataset\" data-width=\"175px\" >\n                  <option value='./data/TCGA'>TCGA</option>\n                 <option value='./data/aneuploidy/'>Aneuploidy</option>\n                  <option value='./data/viral/'>Viral</option>\n                  <option value='./data/trisomy/'>Trisomy</option>\n                  <option value='./data/user_uploads/"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "/json/'>User Uploads</option>\n             </select>\n             </div>\n\n              <div class=\"col-md-12\" style=\"margin-top:10px;display:none\" id=\"subfolders-div\">\n              <select class=\"selectpicker\" id=\"subfolders\" data-style=\"btn-default\" title=\"Pick Cancer type\" data-width=\"175px\" >\n                 <option value='./data/TCGA/BRCA/'>BRCA</option>\n                  <!--<option value='./data/TCGA/HCC/'>HCC</option>-->\n                 <option value='./data/TCGA/LIHC/'>LIHC</option>\n                 <option value='./data/TCGA/LUAD/'>LUAD</option>\n                 <option value='./data/TCGA/PRAD/'>PRAD</option>\n                 <option value='./data/TCGA/THCA/'>THCA</option>\n             </select>\n             </div>\n\n              \n              <div class=\"col-md-12\" style=\"margin-top:10px;\">\n              <select class=\"selectpicker\" MULTIPLE id=\"files\" data-style=\"btn-default\" title=\"Pick samples\" data-width=\"175px\" data-actions-box=\"true\" data-selected-text-format=\"static\">\n             </select>\n             </div>\n        \n              <div class=\"col-md-12\" style=\"margin-top:10px\">\n             <form id=\"form1\">\n       <select name=\"file_list\" SIZE=\"4\" MULTIPLE id=\"selected-sample\" style=\"width: 175px;font-size: 14px\">\n             </select>\n             </form>\n              </div>\n             \n              <div class=\"col-md-12\" style=\"margin-top:10px;text-align:right\">\n              <button id = \"delete-selected\" class=\"btn btn-xs btn-default\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span> Remove</button>\n             <button id = \"clear-all\" class=\"btn btn-xs btn-danger\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span> Clear</button>\n              </div>\n              \n              <div class=\"col-md-12\" id=\"warning\" style=\"margin-top:10px\"></div>\n             \n             <!-- Select type of analysis -->\n             \n            <div class=\"col-md-12 title\" style=\"margin-top:10px;margin-bottom:10px;\">Analysis</div>\n             <div class=\"col-md-12 radio\" style=\"font-size:10px;margin:0px\">\n            <label><input type=\"radio\" name=\"analysis\" value=\"scatterplotanalysis\" checked=\"checked\">Mutations and Expressions</label>\n            </div>\n             <div class=\"col-md-12 radio\" style=\"font-size:10px;margin:0px\">\n            <label><input type=\"radio\" name=\"analysis\" value=\"pcanalysis\">Principal Components</label>\n            </div>\n             <div class=\"col-md-12 radio\" style=\"font-size:10px;margin:0px\">\n            <label><input type=\"radio\" name=\"analysis\" value=\"heatmapanalysis\">Heat Map</label>\n            </div>\n             \n             <div class=\"col-md-12\" style=\"margin-top:10px;text-align: center\">\n              <button id = \"compareButton\" class=\"btn btn-success\">Compare</button>\n             </div>\n             \n              <div class=\"col-md-12\"><hr></div>\n            </div>\n            <div class=\"row tip\" style=\"margin-top:0px;\"></div>\n        </div>\n        \n            <div class=\"col-md-10\">\n                <div id = \"svgs-all\" class=\"col-md-12\"></div>   \n            </div>\n        </div>\n</div>";
},"useData":true});

this["Templates"]["pca"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"pca\" class=\"col-md-9\"></div>\n<div id=\"pcbarchart\" class=\"col-md-3\">\n    <div class=\"col-md-12 midtitle\" style=\"margin-top:20px;\">\n        Show PCA by Processes\n    </div>\n    <div class=\"col-md-12\" style=\"margin-top:10px;\">\n        <select class=\"selectpicker\" id=\"pcafolders\" data-style=\"btn-default\" title=\"Pick process\" data-width=\"175px\">\n        </select>\n    </div>\n</div>";
},"useData":true});

this["Templates"]["pcabarchart"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"panel panel-default pcbc\" id=\""
    + alias4(((helper = (helper = helpers.panelname || (depth0 != null ? depth0.panelname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"panelname","hash":{},"data":data}) : helper)))
    + "\" style=\"background:#b3ccff\">\n    <div class=\"minititle\" style=\"padding: 10px 10px;\">\n        <a data-toggle=\"collapse\" href=\"#"
    + alias4(((helper = (helper = helpers.collapse || (depth0 != null ? depth0.collapse : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"collapse","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n    </div>\n    <div id=\""
    + alias4(((helper = (helper = helpers.collapse || (depth0 != null ? depth0.collapse : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"collapse","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-collapse collapse-in\">\n        <div class=\"panel-body svg-container\" id=\""
    + alias4(((helper = (helper = helpers.svgname || (depth0 != null ? depth0.svgname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"svgname","hash":{},"data":data}) : helper)))
    + "\" style=\"padding :0px 0px; font-size:20px\"></div>\n    </div>\n</div>\n\n ";
},"useData":true});

this["Templates"]["pcabcframe"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"col-md-12\"><hr></div>\n<div class=\"col-md-12 midtitle\" style=\"margin-top:0px;margin-bottom:10px;\">\n    Color samples by\n</div>\n<div class=\"col-md-12\">\n        <div id=\"pcbcsvg\" class=\"panel-group\">\n    </div>\n</div>\n<div class = \"col-md-12\" id=\"criteriabutton\"></div>\n<div class = \"col-md-12\" id=\"pcbctext\" style=\"display:none\">\n</div>\n\n";
},"useData":true});

this["Templates"]["pcatext"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<input type=\"text\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.criteria || (depth0 != null ? depth0.criteria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"criteria","hash":{},"data":data}) : helper)))
    + "\">\n\n\n";
},"useData":true});

this["Templates"]["pcatooltip"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = "";

  stack1 = ((helper = (helper = helpers.attributes || (depth0 != null ? depth0.attributes : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"attributes","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.attributes) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"col-md-6 miniTitle\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"col-md-12 title\">"
    + alias4(((helper = (helper = helpers.sampleID || (depth0 != null ? depth0.sampleID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sampleID","hash":{},"data":data}) : helper)))
    + "</div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.attrexist : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<div class=\"col-md-12 miniTitle\">PC</div>\n\n\n<div class=\"col-md-12\" style=\"text-align:left;font-size:12px\">\n    PC1: "
    + alias4(((helper = (helper = helpers.PC1 || (depth0 != null ? depth0.PC1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"PC1","hash":{},"data":data}) : helper)))
    + "<br>\n    PC2: "
    + alias4(((helper = (helper = helpers.PC2 || (depth0 != null ? depth0.PC2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"PC2","hash":{},"data":data}) : helper)))
    + "<br>\n    PC3: "
    + alias4(((helper = (helper = helpers.PC3 || (depth0 != null ? depth0.PC3 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"PC3","hash":{},"data":data}) : helper)))
    + "\n</div>\n    \n";
},"useData":true});

this["Templates"]["scplot"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"scatterplot\" class=\"col-md-9\"></div>\n\n<div id=\"barchart\" class=\"col-md-3\"></div>\n\n<div id=\"heatmap\" class=\"col-md-12\"></div>\n<div class=\"col-md-12\">\n    Log2FC greater than: <input type=\"text\" id=\"up\" size=\"4\">\n    Log2FC smaller than: <input type=\"text\" id=\"down\" size=\"4\">\n    <button class=\"btn btn-default\"  onclick=\"saveTextAsFile()\" style=\"float: right;\"><strong>Download Data</strong></button>\n</div>";
},"useData":true});

this["Templates"]["tooltip"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "<br>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"col-md-12 title\">"
    + alias4(((helper = (helper = helpers.gene || (depth0 != null ? depth0.gene : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-12 process\">"
    + alias4(((helper = (helper = helpers.process || (depth0 != null ? depth0.process : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"process","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-12 function\">"
    + alias4(((helper = (helper = helpers.gene_function || (depth0 != null ? depth0.gene_function : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_function","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-6 miniTitle\">\n    Log2 FC\n</div>\n                \n<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers.log2 || (depth0 != null ? depth0.log2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"log2","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-6 miniTitle\">\n    Pvalue\n</div>\n                \n<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers.pvalue || (depth0 != null ? depth0.pvalue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pvalue","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-12 miniTitle\">\n    mutation\n</div>\n                \n<div class=\"col-md-12 mutation\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.mutation : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>\n";
},"useData":true});

if (typeof exports === 'object' && exports) {module.exports = this["Templates"];}