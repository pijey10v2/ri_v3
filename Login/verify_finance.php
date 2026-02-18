<?php
session_start();
//check license module
include_once 'app_properties.php';
global $LICENSEPROPERTIES;
if($LICENSEPROPERTIES['PFS']['value'] === 'false') header("Location: login/postlogin");

if(!isset($_SESSION['email'])){ //if no session email then not logged in user. return to sign in

  session_destroy();
  header("Location: signin");
  exit();
}else if(!isset($_SESSION['project_id'])){ //if no project is selected return to postlogin
  header("Location: login/postlogin");
  exit();
}

?>