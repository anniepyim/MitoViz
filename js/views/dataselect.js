$(".selectpicker").on('change',function(){
    myFunction();
});

function myFunction() {
   $('#selected-sample').empty();
    $.each($(".selectpicker option:selected"), function(){
        $('#selected-sample').append($('<option>', { 
            value: $(this).val(),
            text : $(this).text() 
        }));
    });

    if ($('#selected-sample').find('option').length === 0){
        $('#selected-sample').append($('<option>', { 
            text : 'Add samples...'
        }));
    }
}

$('#delete-selected').click(function(){


    $.each($("#selected-sample option:selected"), function(){
        var value = $(this).val();
        //alert('[value='+value+']');
        $('.selectpicker').find('[value="'+value+'"]').prop('selected',false);
        $('.selectpicker').selectpicker('refresh');
    });

    $('#selected-sample option:selected').remove();

    if ($('#selected-sample').find('option').length === 0){
        $('#selected-sample').append($('<option>', { 
            text : 'Add samples...'
        }));
    }
});

$('#clear-all').click(function(){
    $('#selected-sample').empty();
    $('#selected-sample').append($('<option>', { 
            text : 'Add samples...'
        }));
    $('.selectpicker').selectpicker('deselectAll');
    $('.selectpicker').selectpicker('refresh');
});