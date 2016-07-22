var axios = require('axios');
var _ = require('underscore');
var d3 = require('d3');

var colorgroup = d3.scale.ordinal().range(["#ff004d","#ffff66","#a4ff52","#0067c6","#7d71e5"]),
    colorstage = d3.scale.ordinal().range(["#a4ff52","#ffff66","#da5802","#ff004d","#a7a5a5"]),
    colorgender = d3.scale.ordinal().range(["#ff0074","#52a4ff"]);

function parser2(){}
   
function parse(urls, errorcb, datacb){
    
    axios.get(urls)
    .then(function(response){
        datacb(response.data);
        
    })
    .catch(function (res) {
            errorcb(res);
    });
    
    
}

parser2.parse = parse;

module.exports = parser2;


