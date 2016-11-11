//Entry point for the app
//Require everything needed, all will be public

//jQuery = $ = require('jquery');
jjQuery = require('jquery');
Backbone = require('backbone');
//Backbone.$ = jQuery;
Backbone.$ = jjQuery;

Handlebars = require('handlebars');
_ = require('underscore');
d3 = require('d3');
require('d3-tip')(d3);

require('underscore'); // bootstrap

//Require the App so that it could called
App = require('./js/main');
