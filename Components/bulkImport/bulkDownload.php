<?php
session_start();
include_once dirname(__DIR__).'/../BackEnd/class/jogetExport.class.php';
$jogetImportObj = new jogetExport();

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '  
<html>
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
      <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
      <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
      <link rel="stylesheet" href="../../JS/JsLibrary/jquery-confirm.min.css">
      <script src="../../JS/JsLibrary/jquery-confirm.min.js"></script>
  </head>'.
  $jogetImportObj->render().
'</html>' ;

echo $html;

?>

<style>
    .defaultBody{
        background-color: #e4e4e4 !important;
    }

    button {
      cursor:pointer;
    }
</style>