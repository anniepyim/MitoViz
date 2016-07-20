<?php
$filenameArray = array();
$handle = opendir(dirname(realpath(__FILE__)).'/data/viral');
    while($file = readdir($handle)){
        if($file !== '.' && $file !== '..'){
            array_push($filenameArray, "/data/viral/$file");
        }
    }

echo json_encode($filenameArray);
?>  