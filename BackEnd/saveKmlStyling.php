<?php
session_start();
$response = array();
if (!isset($_POST['kmlUrl'])) {
    $response['error'] = "File url not available";
    echo json_encode($response);
    exit();
}
  
$filePath = "../".$_POST['kmlUrl'];
$stylePosition  = $_POST['stylePosition'];

$kml_file = simplexml_load_file($filePath);
$namespaces = $kml_file->getNamespaces(true);

if (!isset($namespaces[""])) {
    $response['error'] = 'KML namespace unavailable';
    echo json_encode($response);
    exit();
}

$kml_file->registerXPathNamespace("default", $namespaces[""]);

//change value for style tag with id value / position under document
if (isset($_POST['icon'])) {
    $iconIdXpath = $kml_file->xpath("//default:IconStyle");
    foreach ($iconIdXpath as $iconStyle) {
        if ($iconStyle->Icon->href && $_POST['iconHref']) {
            $iconStyle->Icon->href = $_POST['iconHref'];
        }
        if (!isset($_POST['iconStyle']) || $_POST['iconStyle'] == "false") {
            if($iconStyle[0]->color){
                $colorNode = $iconStyle->color ="";
            }
        }
        elseif (!$iconStyle->color && isset ($_POST['iconColor'])) {
            $color = color_kml_swap($_POST['iconColor']);
            if (isset($_POST['iconOpac']) && $_POST['iconOpac']) {
                $opacity = opacity_dechex($_POST['iconOpac']);
                $color = $opacity.$color;
            }
            $iconStyle->addChild("color", $color);
        } elseif ($iconStyle->color && isset ($_POST['iconColor'])) {
            $color = color_kml_swap($_POST['iconColor']);
            if (isset($_POST['iconOpac']) && $_POST['iconOpac']) {
                $opacity = opacity_dechex($_POST['iconOpac']);
                $color = $opacity.$color;
            }
            $iconStyle->color = $color;
        }
    }
}

if (isset($_POST['line'])) {
    $lineIdXpath = $kml_file->xpath("//default:LineStyle");
    foreach ($lineIdXpath as $lineStyle) {
        if ($lineStyle->color && $_POST['lineColor']) {
            $color = color_kml_swap($_POST['lineColor']);
            $lineStyle->color = "ff".$color;
        }
        elseif (!$lineStyle->color && $_POST['lineColor']) {
            $color = color_kml_swap($_POST['lineColor']);
            if(!$lineStyle->color){
                $lineStyle->addChild("color","ff".$color);
            }
        }
        if ($lineStyle->width && $_POST['lineWidth']) {
            $lineStyle->width = $_POST['lineWidth'];
        }
        elseif (!$lineStyle->width && $_POST['lineWidth']) {
            $lineStyle->addChild('width', $_POST['lineWidth']);
        }
    }
}

if (isset($_POST['polygon'])) {
    $polygonIdXpath = $kml_file->xpath("//default:PolyStyle/..");
    foreach ($polygonIdXpath as $polygonStyle) {

        if ($_POST['polygonFill'] == "false" && !$polygonStyle->PolyStyle->fill){
            $polygonStyle->PolyStyle->addChild("fill",0);
        }
        elseif ($_POST['polygonFill'] == "false" && $polygonStyle->PolyStyle->fill){
            $polygonStyle->PolyStyle->fill = 0;
        }
        elseif ($_POST['polygonFill'] == "true" && !$polygonStyle->PolyStyle->fill){
            $polygonStyle->PolyStyle->addChild("fill",1);
        }
        elseif ($_POST['polygonFill'] == "true" && $polygonStyle->PolyStyle->fill){
            $polygonStyle->PolyStyle->fill = 1;
        }

        if ($polygonStyle->PolyStyle->color && $_POST['polygonColor']) {
            $color = color_kml_swap($_POST['polygonColor']);
            if ($_POST['polygonOpac']) {
                $opacity = opacity_dechex($_POST['polygonOpac']);
                $color = $opacity.$color;
            }

            $polygonStyle->PolyStyle->color = $color;
        }
        elseif (!$polygonStyle->PolyStyle->color && $_POST['polygonColor']) {
            $color = color_kml_swap($_POST['polygonColor']);
            if ($_POST['polygonOpac']) {
                $opacity = opacity_dechex($_POST['polygonOpac']);
                $color = $opacity.$color;
            }
            $polygonStyle->PolyStyle->addChild("color", $color);
        }


        
        if($_POST['outlineBoolean'] == "false" && !$polygonStyle->PolyStyle->outline){
            $polygonStyle->PolyStyle->addChild("outline",0);
        }
        else if($_POST['outlineBoolean'] == "false" && $polygonStyle->PolyStyle->outline){
            $polygonStyle->PolyStyle->outline = 0;
        }
        else if($_POST['outlineColor']){
            if(!$polygonStyle->PolyStyle->outline){
                $polygonStyle->PolyStyle->addChild("outline",1);
            }else{
                $polygonStyle->PolyStyle->outline = 1;
            }
            $color = color_kml_swap($_POST['outlineColor']);
            if(!$polygonStyle->LineStyle){
                $polygonStyle->addChild("LineStyle");
            }
            if( $polygonStyle->LineStyle->color){
                $polygonStyle->LineStyle->color = "ff".$color;
            }
            else{
                $polygonStyle->LineStyle->addChild("color","ff".$color);
            }
        }
    }
}

$filePathArry = explode("/", $_POST['kmlUrl']);    
$fileName = $filePathArry[count($filePathArry) - 1];
$fileNameArry = explode(".",$fileName);
$versionText = $fileNameArry[count($fileNameArry)-2];
if (strpos($versionText, 'Style_v') !== false) { //contain version
   $verTextArr = explode("v",$versionText);  
   $versionAdd = (int) $verTextArr[1] + 1;
   $verTextArr[1] = sprintf("%03d", $versionAdd);  //new version number
   $newVerText = implode('v',$verTextArr);
   $fileNameArry[count($fileNameArry)-2] = $newVerText;
   $newFileName = implode('.',$fileNameArry);
   $filePathArry[count($filePathArry) - 1] =  $newFileName;
   $newFilePath = implode('/', $filePathArry);
}else{  //no previous version, assign version
    $verText = "Style_v001";
    array_splice( $fileNameArry, count($fileNameArry)-1, 0, $verText );
    $newFileName = implode('.',$fileNameArry);
    $filePathArry[count($filePathArry) - 1] =  $newFileName;
    $newFilePath = implode('/', $filePathArry);
}

if($kml_file->asXml('../'.$newFilePath)){
    require ('../login/include/db_connect.php');
    $p_id_number = $_SESSION['project_id'];
    $data_id = $_POST['recordId'];

    $stmt = sqlsrv_query($conn, "SELECT * FROM Data_Pool WHERE Data_Owner_PID = '$p_id_number' AND Data_ID ='$data_id'");
    if( $stmt === false ) {
    	die( print_r( sqlsrv_errors(), true));
        exit();
    }
	$row = sqlsrv_has_rows($stmt);
	if($row == true) //is the owner of this layer
    {
        $data_id = $_POST['recordId'];
        $sql = "UPDATE Data_Pool SET Data_URL ='$newFilePath' WHERE Data_ID ='$data_id';";
        $result = sqlsrv_query($conn,$sql);
		if($result === false){
			$response['message'] = "Unable to update the layer's name";
		}
		else {
            $response['message'] = "Update successful";
            $response['newPath'] = $newFilePath;
            if (file_exists($filePath)){
                if (unlink($filePath)) {   
                    $response['message'] = "Delete successful";
                } else {
                   $response['message'] = "Delete failed";
                }   
            } else {
                $response['message'] = "Delete failed, file not found";
            }
		}
    }else{
        $response['message'] = "Update failed";
    }
};

echo json_encode($response);
exit();

function color_kml_swap($color_code)
{
    if (strlen($color_code)==8) {
        $color_code = substr($color_code, 2);
    } //remove the first 2 char(opacity)
    $color_arr = str_split($color_code, 2);
    $color_code = $color_arr[2].$color_arr[1].$color_arr[0];
    return strtolower($color_code);
}

function opacity_dechex($opacity)
{
    $opacityCode = ($opacity / 100) * 255;
    $opacity_hex = dechex($opacityCode);
    return $opacity_hex;
}
