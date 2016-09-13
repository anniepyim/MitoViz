<?php 
session_start();
session_unset();
session_destroy();
//unset($_SESSION);
session_regenerate_id();
header( "Location:../upload.html");
?>
