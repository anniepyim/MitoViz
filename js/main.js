var d3 = require('d3');


//Public members
var App = {};

var this_js_script = $('script[src*=Test]');
var my_var_1 = this_js_script.attr('data-my_var_1');
if (my_var_1) my_var_1 = my_var_1.split(',');
//end
var id = this_js_script.attr('data-id');

App.init = function(options){ 
    
    //Views
    var mainframe = require('./views/mainframe.js');
    App.mainframe = new mainframe();
    App.mainframe.setElement('#content').render(id);
    
    //var NavBar = require('./views/navBar');
    
    App.views = {};
    //App.views.vis = require('./views/process.vis.js');
    
    //App.views.main = new Main();
    //App.views.main.setElement('body').render();
    
    //App.views.navBar = new NavBar();
    //App.views.navBar.setElement('#navbar').render();
    
    //App.views.vis.selector('#vis');
    
    
    /*d3.json('../data/mouse-21.3.json', function(error, nodes) {
        if (error) return console.warn(error);
        
        d3.json('../data/links.json', function(error, links) {
            if (error) return console.warn(error);
            
            App.views.vis.init(nodes, links);
        });
        
    });*/
    

    var dataSelect = require('./views/mainjs.js');
    var vis = require("./views/vis.js");
    if (my_var_1) vis.spcompareData(my_var_1);
    
    
};

module.exports = App;