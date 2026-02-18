<?php
//needed for license
include_once 'app_properties.php';
global $PRODUCTION_FLAG;
if ($PRODUCTION_FLAG) {
  require_once "../RI_Validator.php";
}
if (session_status() == PHP_SESSION_NONE) session_start();
if(!isset($_SESSION['email'])){
  session_destroy();
  header("Location: ../signin");
  exit();
}
?>
