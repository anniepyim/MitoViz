<?php
if(isset($_POST['folderurl']))
{
    $uid = $_POST['folderurl'];

    $filenameArray = array();
    $handle = opendir(dirname(realpath(__FILE__)).$uid);
    while($file = readdir($handle)){
        if($file !== '.' && $file !== '..' && $file !== '.DS_Store'){
            array_push($filenameArray, $file);
        }
    }
    
    echo json_encode($filenameArray);
}

//
?>  