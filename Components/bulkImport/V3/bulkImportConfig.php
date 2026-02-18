<?php

if (session_status() == PHP_SESSION_NONE) session_start();

$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

include '../../../BackEnd/class/PHPExcel/IOFactory.php';

$html = "";
$owner = "";
$proj_owner = $_SESSION['project_owner'];
$process_name = $_GET['processName'];
$hidelist = "";
if($proj_owner == 'MRSB'){
    $config_directory = dirname(__FILE__).'/../../../Templates/'.$proj_owner.'/Config/';    
    $directory = dirname(__FILE__).'/../../../Templates/'; 

    $fileSuffix = "_config.xlsx";
    $filePrefix = "construct_";
}else if($proj_owner == "KACC"){
    $config_directory = dirname(__FILE__).'/../../../Templates/'.$proj_owner.'/Config/';    
    $directory = dirname(__FILE__).'/../../../Templates/'; 

    $fileSuffix = "_config.xlsx";
    $filePrefix = "construct_";
    $hidelist = "display:none";
}else{
    $config_directory = dirname(__FILE__).'/../../../Templates/bulkImport/Config/';    
    $directory = dirname(__FILE__).'/../../../Templates/bulkImport/'; 

    if($proj_owner == 'JKR_SARAWAK'){
        $owner = 'sarawak';
    }else if($proj_owner == 'JKR_SABAH'){
        $owner = 'sabah';
    }else if($proj_owner == 'SSLR2'){
        $owner = 'sslr';
    }

    $fileSuffix = "_config_".$owner.".xlsx";
    $filePrefix = "construct_";
}
$processes = array();
foreach(glob($config_directory.'*.*') as $file) {
    if (strpos($file, $fileSuffix) !== false && strpos($file, '$') === false ) {
        $file_name = basename($file);
        $file_name = str_replace($fileSuffix,"",$file_name); 
        $file_name = str_replace($filePrefix,"",$file_name);
        array_push($processes, $file_name); 
    } 
} 

// echo "<br><br>";
$process_name_dropdown_html = "";
$column_name_process_html = "";
$column_name_checkbox_html = "";
//processing each processes
    $process_name = $process_name;
    
    $process_name_dropdown_html .= '<select name="process_name" id="process_name" hidden="">
                                            <option value="'.$process_name.'">'.$process_name.'</option>
                                        </select>';
    $column_name_process_html .= '<div class="customCheckbox">
                                    <div id="'.$process_name.'_checkbox" class = "construct_checkbox">';

    $inputFileName = $config_directory.$filePrefix.$process_name.$fileSuffix;
    //  Read Excel 
    try {
        if (!file_exists($inputFileName)) {
            var_dump($inputFileName);
            exit("Your file doesn't exist");
        }
        $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        $objPHPExcel = $objReader->load($inputFileName);
        $objPHPExcel_template = $objReader->load($inputFileName);
    } catch(Exception $e) {
        die('Error loading file "'.pathinfo($inputFileName,PATHINFO_BASENAME).'": '.$e->getMessage());
    }
 
    //  Get worksheet dimensions
    $sheet = $objPHPExcel->getSheet(0);
    $highestRow = $sheet->getHighestRow(); 
    $highestColumn = $sheet->getHighestColumn();

    //  Loop through each row of the worksheet in turn 
    for ($row = 0; $row < 5; $row++){  
        $rowCol = $row + 1;
        $rowData[$row] = $sheet->rangeToArray('A' . $rowCol . ':' . $highestColumn . $rowCol,
                                        NULL,
                                        TRUE,
                                        FALSE); 
    }  
    $highestColumnNumber = count($rowData[3][0]); 

    // Loop through each column to set value of visibility
    $counter = 0;
    
    for($key = 0; $key < $highestColumnNumber ; $key++  ){
        if($rowData[0][0][$key] == "*") {
            $column_name_checkbox_html .= $column_name_process_html.'<label class="container" style=""><a style="color: red">*</a>'. $rowData[4][0][$key] .'
                <input type="checkbox" checked="checked"  onclick="return false;" id="'.$rowData[3][0][$key].'" name="project" value="'.$rowData[3][0][$key].'"><span class="checkmark" for="project"></span>
            </label>
            </div>
            </div>';
        }else if(($rowData[1][0][$key] == "show") || ($rowData[1][0][$key] == "Show")){
            $column_name_checkbox_html .= $column_name_process_html.'<label class="container" style="">'. $rowData[4][0][$key] .'
                <input type="checkbox" checked="checked" id="'.$rowData[3][0][$key].'" name="project" value="'.$rowData[3][0][$key].'"><span class="checkmark" for="project"></span>
            </label>
            </div>
            </div>';
        }else if($rowData[1][0][$key] == "hide"){
            $column_name_checkbox_html .= $column_name_process_html.'<label class="container" style="">'. $rowData[4][0][$key] .'
                <input type="checkbox" id="'.$rowData[3][0][$key].'" name="project" value="'.$rowData[3][0][$key].'"><span class="checkmark" for="project"></span>
                </label>
            </div>
            </div>';
        }
        else{
            $column_name_checkbox_html .= '';
        }
        $counter++;
    }
    // $column_name_checkbox_html .= '</div>'; 

$html = '
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="stylesheet" href="../../../CSS/v3/Navbar.css">
    <link rel="stylesheet" href="../../../CSS/v3/home.css">
    <script src="../../../JS/JsLibrary/jquery-3.5.1.js"></script>      
    <link rel="stylesheet" href="../../../JS/JsLibrary/jquery-confirm.min.css">
    <script src="../../../JS/JsLibrary/jquery-confirm.min.js"></script>
    <link rel="stylesheet" href="../../../CSS/jquery.scrollbar.css">
    <link rel="stylesheet" href="../../../CSS/scrollBarCollapse.css">
    <script src="../../../JS/JsLibrary/jquery.scrollbar.js"></script>
    <script src = "../../../JS/scrollBarCollapse.js"></script> 
</head>
<body class="defaultBody '.$themeClass.'">
    <div class="bulkDownloadBody" style="'.$hidelist.'">
        <div class="title">List Items :</div>
        <div class="gridListContainer" style="overflow:auto">
            '.$process_name_dropdown_html.'
            '.$column_name_checkbox_html.'
        </div>
        <script src = "../../../JS/bulkImportConfigv3.js"></script>
    </div>

</body>
</html>';

echo $html;
?>

<style type="text/css">
    .defaultBody{
        background-color: transparent !important;
    }
</style>