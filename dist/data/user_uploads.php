<?php 
session_start();

$id = session_id();
?>
<html lang="en">

<head>
    <title>MitoXplorer - Aneuploidy</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="../css/style.css" rel="stylesheet" >
    <link href="../css/database.css" rel="stylesheet" >
    
    <script src="http://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/handlebars-v4.0.5.js"></script>

   
</head>

<body>
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
            <div class="container">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="../index.html">MitoXplorer</a>
                </div>
                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class="dropdown" class="active">
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">Database
                            <span class="caret"></span></a>
                            <ul class="dropdown-menu" id="ddm">
                                <li><a href="./tcga.html">TCGA</a></li>
                                <li><a href="./aneuploidy.html">Aneuploidy</a></li>
                                <li><a href="./viral.html">Viral</a></li>
                                <li><a href="./trisomy.html">Trisomy</a></li><li><a href="#">User Uploads</a></li> 
                            </ul>
                          </li>
                        <li>
                            <a href="../upload.html">Upload</a>
                        </li>
                        <li>
                            <a href="../compare.php">Analysis</a>
                        </li>
                        <li>
                            <a href="../contact.html">Contact</a>
                        </li>
                    </ul>
                </div>
                <!-- /.navbar-collapse -->
            </div>
            <!-- /.container -->
        </nav>
<div class="container">
    <div class="jumbotron" style="margin-top:20px;font-size:10px">

					<h1>User uploads </h1>
				
    </div>
    <form name = "compareform" action="../compare.php" method="get">
        <div class = "col-md-12" style="margin-top:10px;text-align: center;font-size:16px">Click on individual samples to visualize their expression and mutation profile<br><br>
        Or select up to 6 samples with checkboxes for comparative analysis <br><br>           

        <input id="readygo" type="submit" class="btn btn-success" value="Go!">
        <div><hr></div>
        <div class="row" id="userfiles">
        </div><br><br>
            
        </div>
    </form>
</div>
    
    <script id="userFilesTemplate" type="text/x-handlebars-template">
    
    <div class="row">
        {{#if containfiles}}
        {{#files}}
        <div class="col-sm-6 col-md-4">
            <div class="database thumbnail">
                <div class="caption">
                <span class="glyphicon glyphicon-ok" aria-hidden="true" style="float: left; color:white;display:none"></span>
                    <a href="../mitomodel.php?id={{mitomodel}}"><span class="glyphicon glyphicon-eye-open" aria-hidden="true" style="float: right"></span></a>
                    <h3>{{name}}</h3>
                </div>
                <input  class="comparecheckbox" type="checkbox" name="compare[]" value="./data/{{url}}">    
            </div>
        </div>
        {{/files}}
        {{else}}
        <div class = "col-md-12" style="margin-top:10px;text-align: center;font-size:16px">
        Upload files to visualize data!
        </div>
    {{/if}}
    </div>
    
    </script>
    

    <!-- RENDER TEMPLATE AFTER EVERYTHING ELSE LOADED -->
    
    <script data-userid="<?php echo '../data/user_uploads/'.$id.'/json/'; ?>" src="../js/userFiles.js"></script>
    
</body>

</html>
