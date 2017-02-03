//Entry point for the app
//Require everything needed, all will be public

jQuery = require('jquery');
Backbone = require('backbone');
Backbone.$ = jQuery;

Handlebars = require('handlebars');
_ = require('underscore');
d3 = require('d3');

//require('underscore'); // bootstrap

//Require the App so that it could called
App = require('./js/main');
