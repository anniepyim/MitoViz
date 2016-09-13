<?php 
session_start();
/* Modifications made on 18th december 2014 */

$id = session_id();
$target_path = "../data/user_uploads/".$id."/raw/";
$samplename = $_POST['samplename'];

if (!is_dir($target_path)){
    mkdir($target_path, 0777, true);
}

$target_pathnew = $target_path . basename( $_FILES['expfile1']['name']); 

$express = $_FILES['expfile1']['name'];
 if(move_uploaded_file($_FILES['expfile1']['tmp_name'], $target_pathnew)) {
     //echo "The file ".  basename( $_FILES['expfile1']['name']). " has been uploaded";
} else{
    echo "There was an error uploading the expression file, please try again!";
}

rename ($target_pathnew, $target_path.$samplename."_exp.txt");

$target_pathnew = $target_path . basename( $_FILES['mutfile1']['name']); 

$variant = $_FILES['mutfile1']['name'];
if(move_uploaded_file($_FILES['mutfile1']['tmp_name'], $target_pathnew)) {
    //echo "The file ".  basename( $_FILES['mutfile1']['name']). " has been uploaded";
} else{
    echo "There was an error uploading the variant file, please try again!";
}

rename ($target_pathnew, $target_path.$samplename."_var.txt");
//echo "done";
?>
