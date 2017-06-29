$(document).ready(function(){
    
var flag = "SP";

var selected = "selected-sample";

$('input[type=radio][name=analysis]').change(function(e){
    
    if (this.value == "scatterplotanalysis"){
        flag = "SP";
        $( ".group-div" ).css('display','');
    }else{
        flag = "others";
        $( ".group-div" ).css('display','none');
        $( ".selectionbox" ).css('display','none');
        $( "selected-sample_div" ).css('display','');
    }
    
    issueWarning();
});
    
$("#groups").on('change',function(){
    selected = $("#groups option:selected").val();
    $( ".selectionbox" ).css('display','none');
    selected_div = selected+"_div"
    $( selected_div ).css('display','');
    
    updateFolder("#folders",selected);
}); 
    
$("#folders").on('change',function(){
   updateFolder("#folders",selected);
}); 
    
$("#subfolders").on('change',function(){
   updateFolder("#subfolders",selected);
}); 
    
$("#files").on('change',function(){
    updateFile(selected);
});

function updateFolder(folder,selected){
    
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
            $.each($(selected+" option"), function(){
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
        updateFolder("#subfolders",selected);
    }
 
}

function updateFile(selected) {
        
    
    $.each($("#files option:not(:selected)"), function(){
        var value = $(this).val();
        $(selected).find('[value="'+value+'"]').remove();
    });
    
    $.each($("#files option:selected"), function(){
        var value = $(this).val();
        if (!($(selected+' option[value="'+value+'"]').length>0)){
            $(selected).append($('<option>', { 
                value: $(this).val(),
                text : $(this).text() 
            }));
        }
    });
    
   
    issueWarning();

}

$('#delete-selected').click(function(){
    
    $.each($(selected+" option:selected"), function(){
        var value = $(this).val(); $('#files').find('[value="'+value+'"]').prop('selected',false);
        $('#files').selectpicker('refresh');
    });
    $(selected+' option:selected').remove();
    
    issueWarning();
    
});

$('#clear-all').click(function(){
    
    $('#files').selectpicker('deselectAll');
    $('#files').selectpicker('refresh');
    $(selected).empty();
    
    issueWarning();

});
    
function issueWarning(){
    
    if ($('#selected-sample').find('option').length > 6 && flag == "SP")
        document.getElementById('warning').innerHTML="<font color=\"red\">No more than 6 samples!";
    else
        document.getElementById('warning').innerHTML="";
}
    

});
