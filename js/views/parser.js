var axios = require('axios');
var _ = require('underscore');

function parser(){}

   
   
function parse(urls, errorcb, datacb,colorrange){
    
    var funcs = _.map(urls, axios.get);
    
    if (urls.length === 0) errorcb(new Error('Add samples!'));
    if (urls.length > 6) errorcb(new Error('No more than 6 samples!'));
    if (colorrange === "") errorcb(new Error('Pick color!'));
    
    axios.get('./data/mito-genes.txt')
    .then(function(response){
        var mito = [];
        mito = mito.concat(response.data.split("\n"));
        
        var mitomap = {};
        for(var i = 0; i < mito.length; i++){
            mitomap[mito[i]] = true;
        }
        
        axios
        .all(funcs)
        .then(axios.spread(function (){
            
            var data = [];
            var newdata = [];
            _.each(arguments, function(res){
                if(! _.isArray(res.data)) errorcb(new Error('response is not an array'));
                                
                for(var i = 0; i < mito.length; i++){
                    if(mitomap[mito[i]] === true){
                        var ifExist = false;

                        for(var j = 0; j < res.data.length; j++){
                            if (res.data[j].gene == mito[i]){
                                ifExist = true;
                                break;
                            }
                        }
                        mitomap[mito[i]] = ifExist;
                    }
                }                
                data = data.concat(res.data);
            });
            //console.log(data);
           for (var k = 0; k < data.length; k++){
                if(mitomap[data[k].gene] === true){
                    newdata = newdata.concat(data[k]);
                }        
            }
            datacb(newdata,colorrange);
        
        }))
        .catch(function (res) {
            errorcb(res);
        });
    });  
    
}

parser.parse = parse;

module.exports = parser;


