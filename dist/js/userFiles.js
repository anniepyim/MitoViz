// ANIMAL TEMPLATE
 
// sets variable source to the animalTemplate id in index.html
var source = document.getElementById("userFilesTemplate").innerHTML;
 
// Handlebars compiles the above source into a template
var template = Handlebars.compile(source);

var this_js_script = $('script[src*=userFiles]');
var id = this_js_script.attr('data-userid');
var targeturl = '../data/user_uploads/'+id+'/json/'
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
          $.each(data, function(i,filename) { 
            var file = new Object();
            file.url = targeturl+filename;
            file.name = filename.split(".")[0];
            file.mitomodel = targeturl+file.name;
            newdata.files.push(file);

        });
          console.log(newdata);
          
          // data is passed to above template
          var output = template(newdata);
          
          // HTML element with id "animalList" is set to the output above
          document.getElementById("userfiles").innerHTML = output;
      },
        error:function(e){
            console.log(e);
        }
    });
    

    $('input[type=checkbox]').on('change', function (e) {
    if ($('input[type=checkbox]:checked').length > 6) {
        $(this).prop('checked', false);
        document.getElementById('warning').innerHTML="<font color=\"red\">Please select 6 samples at most!";
    }
    else
        document.getElementById('warning').innerHTML="";
    });

    $("form").submit(function (e) {
        if ($('input[type=checkbox]:checked').length == 0){
            e.preventDefault();
            document.getElementById('warning').innerHTML="<font color=\"red\">Please select samples!";
        } 
    });
});