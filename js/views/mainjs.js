var addSelectInpKeyPress;

$(document).ready(function(){
    
var flag = "SP";

var selected = "#selected-sample";

$('input[type=radio][name=analysis]').change(function(e){
    
    if (this.value == "scatterplotanalysis"){
        flag = "SP";
        $( ".group-div" ).css('display','');
    }else{
        flag = "others";
        $( ".group-div" ).css('display','none');
        //$( ".selectionbox" ).css('display','none');
        //$( "selected-sample_div" ).css('display','');
    }
    
    issueWarning();
});
    
$("#groups").on('change',function(){
    updateGroups();
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

function updateGroups(){
    
    selected = "#"+$("#groups option:selected").val();
    if (selected == "#") selected = "#selected-sample";
    
    $( ".selectionbox" ).css('display','none');
    selected_div = selected+"_div"
    $( selected_div ).css('display','');
    
    updateFolder("#folders",selected);

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


function addSelectItem(t,ev)
{
    ev.stopPropagation();

    var oplength = $('#groups > option').length - 3;

    if (oplength > 6){
        ev.preventDefault();
        $( "#groupwarning" ).fadeIn( 300 ).delay( 400 ).fadeOut( 300 );
        return;
    }
    var txt=$(t).prev().val().replace(/[^a-z0-9]/gi,"");
    if ($.trim(txt)=='') return;
    
    //Add option to list
    var p=$(t).closest('.bootstrap-select').prev();
    var o=$('option', p).eq(-3);
    o.before( $("<option>", { "selected": true, "text": txt, "value": txt}) );
    p.selectpicker('refresh');
    

    //Add select box
    var divid = txt+"_div"
    $("#selected-sample_div").after($("<div>", { "class": "col-md-12 selectionbox", "style": "margin-top:10px", "id": divid}));
    document.getElementById(divid).innerHTML="<form><select name='file_list' SIZE='4' class='group_selection selectionlist' MULTIPLE id='"+txt+"' style='width: 175px;font-size: 14px'></select></form>"
    
    updateGroups();
    
}
 
addSelectInpKeyPress = function(t,ev)
{
   ev.stopPropagation();
 
   // do not allow pipe character
   if (ev.which==124) ev.preventDefault();
    
    if (ev.which==32) ev.preventDefault();
 
   // enter character adds the option
   if (ev.which==13)
   {
      ev.preventDefault();
      addSelectItem($(t).next(),ev);
   }
}


$("#removegroup").click(function(){
    

    selected = $("#groups option:selected").val();
    $('#groups').find('[value="'+selected+'"]').remove();
    selected = "#"+selected;
    $('#groups').selectpicker('refresh');
    
    selected_div = selected+"_div"
    $(selected_div).remove();
    
    updateGroups();
})
    
});


    
