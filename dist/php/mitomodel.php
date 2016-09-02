<?php
$id = $_GET['id'];
?>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title></title>

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
        
        <!-- Vis CSS -->
        <link href='../css/App.css' rel='stylesheet' type='text/css'>
        <link href="../css/style.css" rel="stylesheet">
        <script src="http://code.jquery.com/jquery-1.12.4.min.js"></script>
        <script src="../js/bootstrap.min.js"></script>
        
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
                            <ul class="dropdown-menu">
                                <li><a href="../database/tcga.html">TCGA</a></li>
                                <li><a href="../database/aneuploidy.html">Aneuploidy</a></li>
                                <li><a href="../database/viral.html">Viral</a></li>
                                <li><a href="../database/trisomy.html">Trisomy</a></li> 
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
    </body>
    <!-- App Script  -->
    <script data-my_var_1="<?php echo $id; ?>" data-my_var_2="../data/links.json" src="../js/App.js"></script>
    <script>
        
        
        
        App.init({});
    </script>
</html>
<?php
$id = NULL;
?>