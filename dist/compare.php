<?php 
if (isset($_COOKIE['mitoviz_user_upload'])) { 
        session_id($_COOKIE['mitoviz_user_upload']);
}

session_start();

$id = session_id();
setcookie('mitoviz_user_upload',$id,time() + (86400 * 7));

$PCA_path = "data/user_uploads/".$id."/PCA/";
if (!is_dir($PCA_path)){
    mkdir($PCA_path, 0777, true);
}

$heatmap_path = "data/user_uploads/".$id."/heatmap/";
if (!is_dir($heatmap_path)){
    mkdir($heatmap_path, 0777, true);
}

$compare = $_GET['compare'];

if($compare){
    $jsarray =implode(",", $compare);

}
?>
<html lang="en">
    <head>
        <title>MitoXplorer - Analysis</title>
        <meta charset=utf-8>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <link href="./css/bootstrap-select.min.css" rel="stylesheet" >
        <link href="./css/bootstrap.css" rel="stylesheet" >
        <link href="./css/style.css" rel="stylesheet" >
        <script src="./js/jquery-1.12.4.min.js"></script>
        <script src="./js/bootstrap.min.js"></script>
        <script src="./js/bootstrap-select.js"></script>
        <script src="./js/mainjs.js"></script>
        <link rel="icon" type="image/png" href="img/logos/favicon.png">
    </head>
    
    <body>
    <nav id="mainNav" class="navbar navbar-default navbar-custom navbar-fixed-top">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header page-scroll">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span> Menu <i class="fa fa-bars"></i>
                </button>
                <a class="navbar-brand page-scroll" href="index.php">MitoXplorer</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li class="hidden">
                        <a href="index.php"></a>
                    </li>
                    <li>
                        <a href="index.php#about">About</a>
                    </li>
                    <li>
                        <a href="index.php#database">Database</a>
                    </li>
                    <li>
                        <a href="index.php#analysis">Analysis</a>
                    </li>
                    <li>
                        <a href="index.php#download">Download</a>
                    </li>
                    <li>
                        <a href="index.php#contact">Contact</a>
                    </li>

                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container-fluid -->
    </nav>
        <!-- Page Content -->
<br>
        <div class = "container" id="content">
<!-- Page Content -->        
<div class="container main">
        <div id="#wrapUp" class="row">
            
        <div class="col-md-2">
         <div class="row">
             
            <!-- Select type of analysis -->
             
            <div class="col-md-12 title" style="margin-top:10px;margin-bottom:10px;">Pick Analysis</div>
             <div class="col-md-12 radio" style="font-size:10px;margin:0px">
            <label><input type="radio" name="analysis" value="scatterplotanalysis" checked="checked">Mutations and Expressions</label>
            </div>
             <div class="col-md-12 radio" style="font-size:10px;margin:0px">
            <label><input type="radio" name="analysis" value="pcanalysis">Principal Components</label>
            </div>
             <div class="col-md-12 radio" style="font-size:10px;margin:0px">
            <label><input type="radio" name="analysis" value="heatmapanalysis">Heat Map</label>
            </div>
             
             <!--Grouping for Mutation analysis -->
            <div class="col-md-12 title group-div" style="margin-top:20px;display:">Define Groups</div>
            <div class="col-md-12 group-div" style="margin-top:10px;display:">
              <select class="selectpicker" id="groups" data-style="btn-default" title="Create Groups" data-width="175px">
                  <option class="divider" data-divider="true"></option>
                <option class="additem" data-content="<input type=text onKeyDown='event.stopPropagation();' onKeyPress='addSelectInpKeyPress(this,event)' onClick='event.stopPropagation()' placeholder='Add item'>"></option> 
                <!--<span class='glyphicon glyphicon-plus addnewicon' onClick='addSelectItem(this,event,1)'></span>-->
             </select>
             </div>
             
            <!--button to remove group -->
             
             <div class="col-md-12 group-div" style="margin-top:10px;text-align:left">
              <button id = "removegroup" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove Selected Group</button>
              </div>
             
             <!--Folders to select data -->
             
             <div class="col-md-12 title" style="margin-top:20px;" id="hihi">
              Pick Data
             </div>
              <div class="col-md-12" style="margin-top:10px;">
            
              <select class="selectpicker" id="folders" data-style="btn-default" title="Pick dataset" data-width="175px" >
                  <option value='./data/TCGA'>TCGA</option>
                 <option value='./data/aneuploidy/'>Aneuploidy</option>
                  <option value='./data/viral/'>Viral</option>
                  <option value='./data/trisomy/'>Trisomy</option>
                  <option value='./data/adrien/'>Adrien</option>
                  <option value='./data/user_uploads/<?php echo $id; ?>/json/'>User Uploads</option>
             </select>
             </div>

              <div class="col-md-12" style="margin-top:10px;display:none" id="subfolders-div">
              <select class="selectpicker" id="subfolders" data-style="btn-default" title="Pick Cancer type" data-width="175px" >
                 <option value='./data/TCGA/BRCA/'>BRCA</option>
                  <!--<option value='./data/TCGA/HCC/'>HCC</option>-->
                 <option value='./data/TCGA/KIRC/'>KIRC</option>
																	<option value='./data/TCGA/LIHC/'>LIHC</option>
                 <option value='./data/TCGA/LUAD/'>LUAD</option>
                 <option value='./data/TCGA/PRAD/'>PRAD</option>
                 <option value='./data/TCGA/THCA/'>THCA</option>
             </select>
             </div>
             
              <div class="col-md-12" style="margin-top:10px;">
              <select class="selectpicker" MULTIPLE id="files" data-style="btn-default" title="Pick samples" data-width="175px" data-actions-box="true" data-selected-text-format="static">
             </select>
             </div>
             
            <!--box to store selected data --> 
        
              <div class="col-md-12 selectionbox" style="margin-top:10px" id="selected-sample_div">
             <form id="form1">
       <select name="file_list" SIZE="4" class="selectionlist" MULTIPLE id="selected-sample" style="width: 175px;font-size: 14px">
             </select>
             </form>
              </div>
             
                         
             <!--buttons to edit selected data --> 
             
              <div class="col-md-12" style="margin-top:10px;text-align:left">
              <button id = "delete-selected" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove</button>
             <button id = "clear-all" class="btn btn-xs btn-danger"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Clear</button>
              </div>
              
             <!--warning area --> 
             
              <div class="col-md-12" id="warning" style="margin-top:10px"></div>
            <div style="display:none" class="col-md-12" id="groupwarning" style="margin-top:10px"><font color = "red">No more than 6 groups!</font></div>
             
             
             <!--the GO button --> 
             
             <div class="col-md-12" style="margin-top:10px;text-align: center">
              <button id = "compareButton" class="btn btn-success">Compare</button>
             </div>
             
              <div class="col-md-12"><hr></div>
            </div>
            <div class="row tip" style="margin-top:0px;"></div>
        </div>
        
            <div class="col-md-10">
                <div id = "svgs-all" class="col-md-12"></div>   
            </div>
        </div>
</div>
        </div>
        <script files="<?php echo $jsarray; ?>" session-id="<?php echo $id; ?>" src="./js/App_compare.min.js"></script>
        
        <script>   
            App.init();
        </script>
        
    </body>
</html>