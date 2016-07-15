<?php 
session_start();
/* Modifications made on 18th december 2014 */


$target_path = "../data/user_uploads/raw_files/";
$target_path = $target_path . basename( $_FILES['uploadedfile']['name']); 
//echo basename( $_FILES['uploadedfile']['name']);
$express = $_FILES['uploadedfile']['name'];
//echo $express;
 if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
    //echo "The file ".  basename( $_FILES['uploadedfile']['name'])." has been uploaded";
} else{
    echo "There was an error uploading the expression file, please try again!";
}
/* Modifications made on 18th december 2014 
/* rename ("/home/pkoti/mitomodel/www/uploads/$express", "/home/pkoti/mitomodel/www/uploads/new_exp_input.txt"); */
$id = session_id();
rename ("../data/user_uploads/raw_files/$express", "../data/user_uploads/raw_files/".$express."new_exp_input.txt");

$target_path = NULL;
$target_path = "../data/user_uploads/raw_files/";
$target_path = $target_path . basename( $_FILES['uploadfile']['name']); 
//echo basename( $_FILES['uploadfile']['name']);
$variant = $_FILES['uploadfile']['name'];
 if(move_uploaded_file($_FILES['uploadfile']['tmp_name'], $target_path)) {
    //echo "The file ".  basename( $_FILES['uploadfile']['name']). 
    " has been uploaded";
} else{
    //echo "There was an error uploading the variant file, please try again!";
}
/* rename ("/home/pkoti/mitomodel/www/uploads/$variant", "/home/pkoti/mitomodel/www/uploads/new_var_input.txt"); */
rename ("../data/user_uploads/raw_files/$variant", "../data/user_uploads/raw_files/".$express."new_var_input.txt");
//echo "done";
?>
