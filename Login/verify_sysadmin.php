<?php
session_start();
//check license module
include_once 'app_properties.php';
global $LICENSEPROPERTIES;
if($LICENSEPROPERTIES['systemadmin']['value'] === 'false') header("Location: login/postlogin");;

if(!isset($_SESSION['email'])){
  session_destroy();
  header("Location: signin");
  exit();
}
else if(!isset($_SESSION['isSysadmin'])){
  header("Location: login/postlogin");
  exit();
}
?>
