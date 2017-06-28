$(document).ready(function(){
    
var flag = "SP";

$('input[type=radio][name=analysis]').change(function(e){
    
    if (this.value == "scatterplotanalysis"){
        flag = "SP";
    }else if (this.value == "heatmapanalysis"){
        flag = "heatmap";
    }else{
        flag = "others";
    }
    
    issueWarning();
    /*if ($(this).text() == "Don't click me"){
        alert("It's good to be curious, but I mean, really, I told you nothing would happen. So let's just back to business")
    }*/
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
        
        var targeturl = $(folder+" option:selected").val();
        var folderurl = '.'+targeturl;
        var htmltext = "",
            value = "",
            text = "";

        $.ajax({
            type: "POST",
            url: "./php/getdirectory.php",
            dataType: "json",
            data: { folderurl : folderurl },
          success: function(data){
              $('#files').empty();
              $.each(data, function(i,filename) {
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
          },
            error:function(e){
                console.log(e);
            }
        });

        $('#selectallcb').prop('checked', false);
        
        if ($("#folders option:selected").text() != "TCGA"){
            document.getElementById("subfolders-div").style.display="none";
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
        if (!($('#selected-sample option[value="'+value+'"]').length>0)){
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
    
    if ($('#selected-sample').find('option').length > 6 && flag == "SP")
        document.getElementById('warning').innerHTML="<font color=\"red\">No more than 6 samples!";
    //else if ($('#selected-sample').find('option').length > 55 && flag == "heatmap")
    //    document.getElementById('warning').innerHTML="<font color=\"red\">No more than 50 samples!";
    else
        document.getElementById('warning').innerHTML="";
}
    

});
