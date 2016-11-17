

function parserPCA(){}

   
   
function parse(drawPCA,onError,init,type,parameter){
    
    if(init === true){
        
        //RUN python script that calls R script to do PCA analysis
        jQuery.ajax({
            url: "./R/PCA.py", 
            data: parameter,
            type: "POST",
            dataType: "json",    
            success: function (result) {                
                //call the function to drawPCA
                drawPCA(result,init,type);
            },
            error: function(e){
                onError(e);
            }
        });
        
    }else{
        var process = $("#pcafolders option:selected").val();

        jQuery.ajax({
            url: process,  // or just tcga.py
            dataType: "json",    
            success: function (result) {
                d3.select("#pcacanvas").remove();
                drawPCA(result,init,type);
            },
            error: function(e){
                console.log(e);
            }
        });
    }
    

    
}

parserPCA.parse = parse;

module.exports = parserPCA;


