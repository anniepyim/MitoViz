<?php 
session_start();

$id = session_id();
$compare = $_GET['compare'];

if($compare){
    $jsarray =implode(",", $compare);
}

?>
<html>
    <head>
        <title>MitoXplorer - Analysis</title>
        <meta charset=utf-8>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="./css/style.css" rel="stylesheet" >
        <script src="http://code.jquery.com/jquery-1.12.4.min.js"></script>
        <script src="./js/bootstrap.min.js"></script>
        <script src="./js/bootstrap-select.js"></script>
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
                    <a class="navbar-brand" href="./index.html">MitoXplorer</a>
                </div>
                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">Database
                            <span class="caret"></span></a>
                            <ul class="dropdown-menu" id="ddm">
                                <li><a href="./data/tcga.html">TCGA</a></li>
                                <li><a href="./data/aneuploidy.html">Aneuploidy</a></li>
                                <li><a href="./data/viral.html">Viral</a></li>
                                <li><a href="./data/trisomy.html">Trisomy</a></li> 
                                <li><a href="./data/user_uploads.php">User Uploads</a></li> 
                            </ul>
                          </li>
                        <li>
                            <a href="./upload.html">Upload</a>
                        </li>
                        <li class="active">
                            <a href="#">Analysis</a>
                        </li>
                        <li>
                            <a href="./contact.html">Contact</a>
                        </li>
                    </ul>
                </div>
                <!-- /.navbar-collapse -->
            </div>
            <!-- /.container -->
        </nav>
        <!-- Page Content -->
        <div class = "container" id="content">
        </div>
        <script data-my_var_1="<?php echo $jsarray; ?>" data-id="<?php echo $id; ?>" src="./js/Test.js"></script>
        <script>   
            App.init();
        </script>
        
    </body>
</html>