var axios = require('axios');
var _ = require('underscore');
var d3 = require('d3');

function parserSP(){}

   
   
function parse(urls, errorcb, datacb,colorrange){
    
    var funcs = _.map(urls, axios.get);    
    
    axios
    .all(funcs)
    .then(axios.spread(function (){

        var data = [];

        _.each(arguments, function(res){
            if(! _.isArray(res.data)) errorcb(new Error('response is not an array'));
               
            data = data.concat(res.data);
        });

        data.sort(function(a,b) { return d3.ascending(a.gene, b.gene);});
        
        datacb(data,colorrange);

    }))
    .catch(function (res) {
        errorcb(res);
    });
    
    /*axios.get('./data/zzfiles/mito-genes.txt')
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
                res.data.sort(function(a,b) { return d3.ascending(a.gene, b.gene);});
                data = data.concat(res.data);
            });
           for (var k = 0; k < data.length; k++){
                if(mitomap[data[k].gene] === true){
                    newdata = newdata.concat(data[k]);
                }        
            }
            data.sort(function(a,b) { return d3.ascending(a.gene, b.gene);});
            datacb(data,colorrange);
        
        }))
        .catch(function (res) {
            errorcb(res);
        });
    });*/  
    
}

parserSP.parse = parse;

module.exports = parserSP;


