<?php
session_start();
include_once dirname(__DIR__).'/../../BackEnd/class/jogetExport.class.php';
$jogetImportObj = new jogetExport();

$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '  
<html>
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link rel="stylesheet" href="../../../CSS/v3/home.css">
      <link rel="stylesheet" href="../../../CSS/v3/wizard.css">
      <script src="../../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
      <link rel="stylesheet" href="../../../JS/JsLibrary/jquery-confirm.min.css">
      <script src="../../../JS/JsLibrary/jquery-confirm.min.js"></script>
  </head>
  <body class="'.$themeClass.'" style="background: var(--surface)">
    <div></div>'.
  $jogetImportObj->render().
'
  </body>
</html>' ;

echo $html;

?>