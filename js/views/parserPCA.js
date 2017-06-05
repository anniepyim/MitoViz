

function parserPCA(){}

   
   
function parse(drawPCA,onError,init,type,parameter,sessionid){
    
    if(init == "all"){
        
        //RUN python script that calls R script to do PCA analysis
        jQuery.ajax({
            url: "./R/PCA.py", 
            data: parameter,
            type: "POST",
            dataType: "json",    
            success: function (result) {

                //Retrieve files result from the python+R script runs and 
                var targeturl = './data/PCA/'+sessionid+'/';
                var folderurl = '.'+targeturl;
                var htmltext = "",
                value = "",
                text = "";

                jQuery.ajax({
                    type: "POST",
                    url: "./php/getdirectory.php",
                    dataType: "json",
                    data: { folderurl : folderurl },
                  success: function(data){
                      $('#pcafolders').empty();
                      $.each(data, function(i,filename) {
                        value = targeturl+filename;
                        text = filename.split("-pca")[0];
                        htmltext = htmltext+'<option value=\"'+value+'\">'+text+'</option>';

                    });

                    $("#pcafolders").html(htmltext);
                    $('#pcafolders').selectpicker('refresh');
                    $('#pcafolders').find('[value="./data/PCA/'+sessionid+'/All Processes-pca.json"]').prop('selected',true);
                    $('#pcafolders').selectpicker('refresh');
                  },
                    error: function(e){
                        console.log(e);
                    }
                });

                //Update the PCA plot by calling the functions upon changing folders
                $('#pcafolders').on('change',function(){
                    parse(drawPCA,onError,"folder",type);
                });
                
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


