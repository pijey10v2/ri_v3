<?php
session_start();
include '../../../Backend/class/PHPExcel/IOFactory.php';

$process = $_POST['process'];
$columns = $_POST['columns'];
$ret ["success"] = true;

$proj_owner = $_SESSION['project_owner'];
$owner = "";

if($proj_owner == 'MRSB'){
    $fileSuffix = "_config.xlsx";
    $filePrefix = "construct_";
    $config_directory = dirname(__FILE__)."/../../../Templates/MRSB/Config/";
    $directory = dirname(__FILE__).'/../../../Templates/'.$proj_owner.'/';    
}else if($proj_owner == 'KACC'){
    $fileSuffix = "_config.xlsx";
    $filePrefix = "construct_";
    $config_directory = dirname(__FILE__)."/../../../Templates/KACC/Config/";
    $directory = dirname(__FILE__).'/../../../Templates/'.$proj_owner.'/';    
}else{

    if($proj_owner == 'JKR_SARAWAK'){
        $owner = 'sarawak';
    }else if($proj_owner == 'JKR_SABAH'){
        $owner = 'sabah';
    }else if($proj_owner == 'SSLR2'){
        $owner = 'sslr';
    }

    $fileSuffix = "_config_".$owner.".xlsx";
    $filePrefix = "construct_";
    $config_directory = dirname(__FILE__).'/../../../Templates/bulkImport/Config/';
    $directory = dirname(__FILE__).'/../../../Templates/bulkImport/'.$proj_owner.'/';
}

$inputFileName = $config_directory.$filePrefix.$process.$fileSuffix;
//  Read Excel 
try {
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
$highestColumnNumber = count($columns);   

//  Loop through each row of the worksheet in turn 
for ($row = 0; $row < $highestRow; $row++){  
    $rowCol = $row + 1;
    $rowData[$row] = $sheet->rangeToArray('A' . $rowCol . ':' . $highestColumn . $rowCol,
                                    NULL,
                                    TRUE,
                                    FALSE); 
}  

// Loop through each column to set value of visibility
foreach ($columns as $key => $column) { 
    for ($i = 0; $i < $highestColumnNumber; $i++){ 
        if($key == $rowData[3][0][$i]){
            getColumnLetter($i); 
            if($column == "true"){
                $value = "show";
                $objPHPExcel_template->getActiveSheet()->getColumnDimension(getColumnLetter($i))->setVisible(true);
            }else{ 
                $value = "hide";
                $objPHPExcel_template->getActiveSheet()->getColumnDimension(getColumnLetter($i))->setVisible(false); 
            }
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($i, 2, $value);
        } 
    } 
}

//Saving Configuration file
$filename = $config_directory.$filePrefix.$process.$fileSuffix;
$objWriter = new PHPExcel_Writer_Excel2007($objPHPExcel);
$objWriter->save($filename);

//Saving New Template file
$objPHPExcel_template->getActiveSheet()->removeRow(1,4);
$objPHPExcel_template->getActiveSheet()->setTitle($process);
$filename_template = $directory.$filePrefix.$process.'_template.xlsx';
$objWriter_template = new PHPExcel_Writer_Excel2007($objPHPExcel_template);
if(!file_exists($directory)) mkdir($directory);
$objWriter_template->save($filename_template);

echo json_encode($ret);

function getColumnLetter( $number ){
    $prefix = '';
    $suffix = '';
    $prefNum = intval( $number/26 );
    if( $number > 25 ){
        $prefix = getColumnLetter( $prefNum - 1 );
    }
    $suffix = chr( fmod( $number, 26 )+65 );
    return $prefix.$suffix;
}