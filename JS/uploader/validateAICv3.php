<?php
    include_once './../../Login/include/_include.php';
	global $SYSTEM;
	session_start();
	
	$imgName = $_POST["fileName"];
	if ($_SESSION['is_Parent'] == "isParent") {
        $projectFolder = $_POST["packageId"];
    } else {
        $projectFolder = $_SESSION['project_id'];
   }
	$fileExist = array();

	if($SYSTEM == 'OBYU'){
		$dir = "../../../Data/AIC/";
	}else{
		$dir = "../../../Data/Geoserver/AIC/";
	}

	//check if the file already existed
	$imgDir = $dir.$imgName;
	if (file_exists($imgDir)) {
		$fileExist['data'] = true;
	} 
	else{
		$fileExist['data'] = false;
	}	
	echo json_encode($fileExist);
?>