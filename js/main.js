var App = {};

//Get data i.e. files to be analyzed, session id, that have to be provided when the script is called on the website
var this_js_script = $('script[src*=App_compare]');
var files = this_js_script.attr('files');
if (files) files = files.split(',');
var id = this_js_script.attr('session-id');

App.init = function(options){ 
    
    //Require and render the mainframe
    //ie the folders for selection, therefore need to provide session id as an argument to render the folder for user upload
    //also the div for svgs, which is still empty
    //var mainframe = require('./views/mainframe.js');
    //App.mainframe = new mainframe();
    //App.mainframe.setElement('#content').render(id);
    
    //Require mainjs.js, which controls the behaviours of the selection folders
    //var dataSelect = require('./views/mainjs.js');
    
    //Require vis.js, which is the entry point for vis tool
    var vis = require("./views/vis.js");
    //If files are already provided, vis can start
    if (files) vis.spcompareData(files);
    
};

//Export as App so it could be App.init could be called
module.exports = App;