<?php 
session_start();
/* Modifications made on 18th december 2014 */


$target_path = "../data/user_uploads/raw_files/";
$target_path = $target_path . basename( $_FILES['expfile1']['name']); 
//echo basename( $_FILES['expfile1']['name']);
$express = $_FILES['expfile1']['name'];
 if(move_uploaded_file($_FILES['expfile1']['tmp_name'], $target_path)) {
    //echo "The file ".  basename( $_FILES['expfile1']['name'])." has been uploaded";
} else{
    echo "There was an error uploading the expression file, please try again!";
}
/* Modifications made on 18th december 2014 
/* rename ("/home/pkoti/mitomodel/www/uploads/$express", "/home/pkoti/mitomodel/www/uploads/new_exp_input.txt"); */

$id = session_id();
rename ("../data/user_uploads/raw_files/$express", "../data/user_uploads/raw_files/".$id."_exp.txt");

$target_path = NULL;
$target_path = "../data/user_uploads/raw_files/";
$target_path = $target_path . basename( $_FILES['mutfile1']['name']); 
//echo basename( $_FILES['mutfile1']['name']);
$variant = $_FILES['mutfile1']['name'];
 if(move_uploaded_file($_FILES['mutfile1']['tmp_name'], $target_path)) {
    //echo "The file ".  basename( $_FILES['mutfile1']['name']). " has been uploaded";
} else{
    //echo "There was an error uploading the variant file, please try again!";
}
/* rename ("/home/pkoti/mitomodel/www/uploads/$variant", "/home/pkoti/mitomodel/www/uploads/new_var_input.txt"); */
rename ("../data/user_uploads/raw_files/$variant", "../data/user_uploads/raw_files/".$id."_var.txt");
//echo "done";
?>
