

function parserHeatmap(){}   
function parse(drawHeatmap,onError,init,type,parameter,sessionid){
    
if(init == "all"){
        
        //RUN python script that calls R script to do PCA analysis
        jQuery.ajax({
            url: "./R/heatmap.py", 
            data: parameter,
            type: "POST",
            dataType: "html",    
            success: function () {

                //Retrieve files result from the python+R script runs and 
                var targeturl = './data/user_uploads/'+sessionid+'/heatmap/';
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
                      $('#heatmapfolders').empty();
                      $.each(data, function(i,filename) {
                        value = targeturl+filename;
                        text = filename.split(".")[0];
                        htmltext = htmltext+'<option value=\"'+value+'\">'+text+'</option>';

                    });

                    $("#heatmapfolders").html(htmltext);
                    $('#heatmapfolders').selectpicker('refresh');
                    $('#heatmapfolders').find('[value="./data/user_uploads/'+sessionid+'/heatmap/Apoptosis.html"]').prop('selected',true);
                    $('#heatmapfolders').selectpicker('refresh');
                  },
                    error: function(e){
                        console.log(e);
                    }
                });

                //Update the PCA plot by calling the functions upon changing folders
                $('#heatmapfolders').on('change',function(){
                    parse(drawHeatmap,onError,"folder",type);
                });
                
                //call the function to drawPCA
                drawHeatmap("./data/user_uploads/"+sessionid+"/heatmap/Apoptosis.html",init,type);
            },
            error: function(e){
                onError(e);
            }
        });
        
    }else{
        var url = $("#heatmapfolders option:selected").val();
        drawHeatmap(url,init,type);
    }


    
}

parserHeatmap.parse = parse;

module.exports = parserHeatmap;


