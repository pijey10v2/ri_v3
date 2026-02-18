<?php
//check license module
include_once 'app_properties.php';
global $LICENSEPROPERTIES;
if($LICENSEPROPERTIES['homepage']['value'] === 'false') header("Location: ../signin.php");;


if(isset($_SESSION['created'])&&(time() - $_SESSION['created'] >= 60*60*24)&&!isset($_SESSION['email'])){
  session_destroy();
  header("Location: ../signin.php");
  exit();
}


?>
