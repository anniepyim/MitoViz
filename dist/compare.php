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
        <script src="../js/mainjs.js"></script>
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
        </div>
        <script files="<?php echo $jsarray; ?>" session-id="<?php echo $id; ?>" src="./js/App_compare.js"></script>
        
        <script>   
            App.init();
        </script>
        
    </body>
</html>