$(document).ready(function(){

$("#navbar li").click(function(e){
    $("#navbar li").prop('class','');
    $(this).toggleClass('active');
    
    if ($(this).text() == "PCA"){
        document.getElementById("scatterplot").style.display="none";
        document.getElementById("barchart").style.display="none";
        document.getElementById("heatmap").style.display="none";
        document.getElementById("pca").style.display="";
    }
    
    if ($(this).text() == "Scatter plot"){
        document.getElementById("scatterplot").style.display="";
        document.getElementById("barchart").style.display="";
        document.getElementById("heatmap").style.display="";
        document.getElementById("pca").style.display="none";
    }
});    
    
$("#folders").on('change',function(){
   updateFolder();
});    
    
$("#files").on('change',function(){
    updateFile();
});

function updateFolder(){
     
    var targeturl = $("#folders option:selected").val();
    var htmltext = "",
        value = "",
        text = "";
    
    $.ajax({
      url: targeturl,
      success: function(data){
          $('#files').empty();
          $(data).find("a:contains(.json)").each(function(){             
            value = targeturl+"/"+$(this).attr("href");
            text = $(this).attr("href").split(".")[0];
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




