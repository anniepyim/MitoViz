<?php 
session_start();
//session_regenerate_id();
$new_sessionid = session_id();
//$organism = $_POST['organism'];
//switch ($organism)
//{
//	case 'Human': 
		include_once "human/uploading.php";
		include_once "human/./database.php";
		$id = $new_sessionid;
		header( "Location:../upload.html");
//	exit;
//	case 'Mouse':
//		include_once "mouse/mouse_uploading.php";
//		include_once "mouse/./mouse_database.php";
//		$id = $new_sessionid;
		//header( "Location:upload_mitomap/index.php?id=$new_sessionid");
//	exit;

//}
?>
