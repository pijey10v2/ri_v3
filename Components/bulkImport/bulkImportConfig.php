<?php

if (session_status() == PHP_SESSION_NONE) session_start();

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

include '../../BackEnd/class/PHPExcel/IOFactory.php';

$html = "";
$proj_owner = $_SESSION['project_owner'];
$config_directory = dirname(__FILE__).'/../../Templates/bulkImport/Config/';    
$directory = dirname(__FILE__).'/../../Templates/bulkImport/'; 

$fileSuffix = "_config_".(($proj_owner == 'JKR_SARAWAK') ? 'sarawak' : 'sabah').".xlsx";
$filePrefix = "construct_";

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
$column_name_checkbox_html = "";
//processing each processes
foreach($processes as $process_name){ 
     
    $process_name = trim($process_name);
    $process_name_dropdown_html .= '<option value="'.$process_name.'">'.$process_name.'</option>';
    $column_name_checkbox_html .= '<div id="'.$process_name.'_checkbox" class = "construct_checkbox" style="display:none;">';

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
            $column_name_checkbox_html .= '
            <label class="container" style=""><a style="color: red">*</a>'. $rowData[4][0][$key] .'
                <input type="checkbox" checked="checked"  onclick="return false;" id="'.$rowData[3][0][$key].'" name="project" value="'.$rowData[3][0][$key].'"><span class="checkmark" for="project"></span>
            </label>
            <br>';
        }else if($rowData[1][0][$key] == "show"){
            $column_name_checkbox_html .= '
            <label class="container" style="">'. $rowData[4][0][$key] .'
                <input type="checkbox" checked="checked" id="'.$rowData[3][0][$key].'" name="project" value="'.$rowData[3][0][$key].'"><span class="checkmark" for="project"></span>
            </label>
            <br>';
        }else if($rowData[1][0][$key] == "hide"){
            $column_name_checkbox_html .= '
            <label class="container" style="">'. $rowData[4][0][$key] .'
                <input type="checkbox" id="'.$rowData[3][0][$key].'" name="project" value="'.$rowData[3][0][$key].'"><span class="checkmark" for="project"></span>
            </label>
            <br>';
        }
        $counter++;
    }
    $column_name_checkbox_html .= '</div>'; 
}


$html = '
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
    <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
    <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>      
    <link rel="stylesheet" href="../../JS/JsLibrary/jquery-confirm.min.css">
    <script src="../../JS/JsLibrary/jquery-confirm.min.js"></script>
    <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
    <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
    <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
    <script src = "../../JS/scrollBarCollapse.js"></script> 
</head>
<body class="defaultBody">
    <div class="bulkDownloadBody">
        <div class="scrollbar-inner" style="overflow:auto">
            <table>
            <tr>
                <th>Process</th>
                <th>Columns</th>
            </tr>
            <tr>
                <td style="vertical-align: top">
                    <select name="process_name" id="process_name">
                    <option value="">Please Select..</option>
                    '.$process_name_dropdown_html.'
                    </select>
                </td>
                <td style="width: 50%">
                    '.$column_name_checkbox_html.'
                </td>
            </tr>
            </table>
        </div>
        <div class="bottom">
            <button id="save_button" style="display:none; margin-right: 20px" type="button" onclick="saveImportConfig()">Save Setting</button>
                
            <a id="download_template"  style="display:none;"  href="./Templates/Document_Template.xlsx" download=""><button id="download_button" type="button" >Download Template</button></a>
        </div>
        
        <script src = "../../JS/bulkImportConfig.js"></script>
    </div>

</body>
</html>';

echo $html;
?>

<style type="text/css">
    .defaultBody{
        background-color: transparent !important;
    }
    /* The container */
    .container {
    display:inline-flex;
    position: relative;
    padding: 5px 0 5px 35px;
    margin-bottom: 7px;
    cursor: pointer;
    font-size: 12px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    }

    /* Hide the browser's default checkbox */
    .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 4px;
    box-shadow: 0 1px 1.5px 1px rgb(0 0 0 / 26%);
    }

    /* On mouse-over, add a grey background color */
    .container:hover input ~ .checkmark {
    background-color: #ccc;
    border-radius: 4px;
    box-shadow: 0 1px 1.5px 1px rgb(0 0 0 / 26%);
    }

    /* When the checkbox is checked, add a background color */
    .container input:checked ~ .checkmark {
    background-color: #575b60c2;
    border-radius: 4px;
    box-shadow: 0 1px 1.5px 1px rgb(0 0 0 / 26%);
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    }

    /* Show the checkmark when checked */
    .container input:checked ~ .checkmark:after {
    display: block;
    }

    /* Style the checkmark/indicator */
    .container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    }
</style>