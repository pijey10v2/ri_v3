<?php

include("class/jogetLink.class.php");
require('../login/include/_include.php');

$kmlDetails = array();
 if (!isset($_GET['data_id'])) {
     echo json_encode($kmlDetails['error'] = "File url not available");
     exit();
 }

$file_name = "../../Data/KML/Div_Culvert_Kuching.kml";

$kml_file = simplexml_load_file($file_name);
$namespaces = $kml_file->getNamespaces(true);

if (!isset($namespaces[""])) {
    echo json_encode($kmlDetails['error'] = "KML namespace unavailable");
    exit();
}

$kml_file->registerXPathNamespace("default", $namespaces[""]);
$placemarkXpath = "//default:Placemark";
$dataXpath = "//default:Placemark//default:ExtendedData";
$numberPlacemark = count($kml_file->xpath($placemarkXpath));
$attributeXpath = $kml_file->xpath($dataXpath)[0];
$attributeList = array();

$i = 0;
foreach($attributeXpath->Data as $dataName){ 
    $attributeList[$i] = $dataName["name"];
    $i++;
}

// menuAnimation.css was removed, please add when merging 
echo '<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes">
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <title>Reveron Insights</title>
        
        <link rel ="stylesheet" href ="CSS/tooltip1.css" type ="text/css" />
        <link href="JS/RICore/Widgets/widgets.css" rel="stylesheet"> 
        <link rel="stylesheet" href="CSS/kbd.css">
        <link rel="stylesheet" href="JS/JsLibrary/jquery-confirm.min.css">
        
        <script src="JS/JsLibrary/jquery-3.5.1.js"></script>
        <script src="JS/JsLibrary/jquery-ui.js"></script>
        <script type = "text/javascript" src="JS/JsLibrary/Sortable.min.js"></script>
        <script src="JS/RICore/Cesium.js"></script>
        <script src="JS/JsLibrary/jquery-confirm.min.js"></script>
        <script src="JS/resizeable.js"></script>

        <!-- multi select  -->
        <link href="CSS/selectize.default.css" rel="stylesheet" />
        <script src="JS/JsLibrary/selectize.js"></script>

    </head>
    <body>
        <form class="formContent" id="newprojectForm">
            <div class="column1">
                <label class="required">Name</label>
            </div>
            <div class="column2">
                <select type="text" id="jogetPackage" ">
                    <option value=""></option>
                </select>
            </div>
            <div class="column1">
                <label class="required">Layer</label>
            </div>
            <div class="column2">
                <select type="text" id="jogetPackage" ">
                    <option value=""></option>
                </select>
            </div>';
 