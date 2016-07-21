$(document).ready(function(){

$("#navbar li").click(function(e){
    $("#navbar li").prop('class','');
    $(this).toggleClass('active');
    
    if ($(this).text() == "PCA"){
        document.getElementById("scatterplot").style.display="none";
        document.getElementById("barchart").style.display="none";
        document.getElementById("heatmap").style.display="none";
        document.getElementById("spbdiv").style.display="none";
        document.getElementById("pca").style.display="";
        document.getElementById("pcbarchart").style.display="";
        document.getElementById("pcabdiv").style.display="";
        
    }
    
    if ($(this).text() == "Scatter plot"){
        document.getElementById("scatterplot").style.display="";
        document.getElementById("barchart").style.display="";
        document.getElementById("heatmap").style.display="";
        document.getElementById("spbdiv").style.display="";
        document.getElementById("pca").style.display="none";
        document.getElementById("pcbarchart").style.display="none";
        document.getElementById("pcabdiv").style.display="none";
    }
});

    
$("#folders").on('change',function(){
   updateFolder("#folders");
}); 
    
$("#subfolders").on('change',function(){
   updateFolder("#subfolders");
}); 
    
$("#files").on('change',function(){
    updateFile();
});

function updateFolder(folder){
    
    if ($(folder+" option:selected").text() != "TCGA"){
        
        var targeturl = $(folder+" option:selected").val()
        var folderurl = targeturl.split(".")[1];
        var htmltext = "",
            value = "",
            text = "";

        $.ajax({
            type: "POST",
            url: "getdirectory.php",
            dataType: "json",
            data: { folderurl : folderurl },
          success: function(data){
              $('#files').empty();
              $.each(data, function(i,filename) {
                console.log(filename);
                value = targeturl+filename;
                text = filename.split(".")[0];
                htmltext = htmltext+'<option value=\"'+value+'\">'+text+'</option>';

            });
              
            $("#files").html(htmltext);
            $('#files').selectpicker('refresh');
            $.each($("#selected-sample option"), function(){
                var value = $(this).val();
                $('#files').find('[value="'+value+'"]').prop('selected',true);
                $('#files').selectpicker('refresh');
            });
          }
        });

        $('#selectallcb').prop('checked', false);
        
        if ($("#folders option:selected").text() != "TCGA"){
            document.getElementById("subfolders-div").style.display="none"
        }
        
    }else{
        document.getElementById("subfolders-div").style.display="";
        updateFolder("#subfolders");
    }
 
}

function updateFile() {
        
    
    $.each($("#files option:not(:selected)"), function(){
        var value = $(this).val();
        $('#selected-sample').find('[value="'+value+'"]').remove();
    });
    
    $.each($("#files option:selected"), function(){
        var value = $(this).val();
        if (!$('#selected-sample option[value="'+value+'"]').length>0){
            $('#selected-sample').append($('<option>', { 
                value: $(this).val(),
                text : $(this).text() 
            }));
        }
    });
    
   
    issueWarning();

}

$('#delete-selected').click(function(){
    
    $.each($("#selected-sample option:selected"), function(){
        var value = $(this).val(); $('#files').find('[value="'+value+'"]').prop('selected',false);
        $('#files').selectpicker('refresh');
    });
    $('#selected-sample option:selected').remove();
    
    issueWarning();
    
});

$('#clear-all').click(function(){
    
    $('#files').selectpicker('deselectAll');
    $('#files').selectpicker('refresh');
    $('#selected-sample').empty();
    
    issueWarning();

});
    
function issueWarning(){
    if ($('#selected-sample').find('option').length > 6)
        document.getElementById('warning').innerHTML="<font color=\"red\">No more than 6 samples!";
    else
        document.getElementById('warning').innerHTML="";
}
    
});




