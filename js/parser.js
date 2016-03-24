var axios = require('axios');
var _ = require('underscore');

function parser(){}

   
   
function parse(urls, errorcb, datacb){
    
    var funcs = _.map(urls, axios.get);
    
    //var data = [];
    axios
        .all(funcs)
        .then(axios.spread(function (){
            
            var data = [];
            _.each(arguments, function(res){
                if(! _.isArray(res.data)) errorcb(new Error('response is not an array'));
                data = data.concat(res.data);
            });
            datacb(data);
        }))
        .catch(function (res) {
            errorcb(res);
        });
    
    //return data;
}

parser.parse = parse;

module.exports = parser;


