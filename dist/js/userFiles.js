// ANIMAL TEMPLATE
 
// sets variable source to the animalTemplate id in index.html
var source = document.getElementById("userFilesTemplate").innerHTML;
 
// Handlebars compiles the above source into a template
var template = Handlebars.compile(source);

var this_js_script = $('script[src*=userFiles]');
var id = this_js_script.attr('data-userid');
var targeturl = id;
console.log(id);

$(document).ready(function(){

    $.ajax({
        type: "POST",
        url: "../php/getdirectory.php",
        dataType: "json",
        data: { folderurl : targeturl },
      success: function(data){
          var newdata = new Object();
          newdata.files = [];
          newdata.containfiles = true;
          $.each(data, function(i,filename) { 
            var file = new Object();
            file.url = targeturl+filename;
            file.name = filename.split(".")[0];
            file.mitomodel = targeturl+file.name;
            newdata.files.push(file);

        });
          
          // data is passed to above template
          var output = template(newdata);
          
          // HTML element with id "animalList" is set to the output above
          document.getElementById("userfiles").innerHTML = output;
          
          
            $(".database").click(function(){
                var $checkbox = $(this).find(".comparecheckbox");
                $checkbox.prop('checked', !$checkbox.prop('checked'));
                var $glyok = $(this).find(".glyphicon-ok");
                if($checkbox.prop('checked')){
                    $(this).css('background-color','#a3f379');
                    $glyok.css('display','block');
                }
                else{
                    $(this).css('background-color', 'white');
                    $glyok.css('display','none');
                }
                if ($('input[type=checkbox]:checked').length > 6) {
                    $checkbox.prop('checked', false);
                    $(this).css('background-color', 'white');
                    $glyok.css('display','none');
                    $( "#warning1" ).fadeIn( 300 ).delay( 400 ).fadeOut( 300 );
                }
            });
    
          
      },
        error:function(e){
            var newdata = new Object();
            newdata.containfiles = false;
            var output = template(newdata);
            
          
          // HTML element with id "animalList" is set to the output above
          document.getElementById("userfiles").innerHTML = output;
            console.log(e);
        }
    });
    

    

    $("form").submit(function (e) {
        if ($('input[type=checkbox]:checked').length == 0){
            e.preventDefault();
            $( "#warning2" ).fadeIn( 300 ).delay( 400 ).fadeOut( 300 );
        }
        if ($('input[type=checkbox]:checked').length > 6){
            e.preventDefault();
            $( "#warning1" ).fadeIn( 300 ).delay( 400 ).fadeOut( 300 );
        } 
    });
});