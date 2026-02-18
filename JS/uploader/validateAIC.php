<?php
	session_start();
	$imgName = $_POST["fileName"];
	if ($_SESSION['is_Parent'] == "isParent") {
        $projectFolder = $_POST["packageId"];
    } else {
        $projectFolder = $_SESSION['project_id'];
   }
	$fileExist = array();

	//check if the file already existed
	$imgDir = "../../Data/Projects/".$projectFolder."/AIC/".$imgName;
	if (file_exists($imgDir)) {
		$fileExist['data'] = true;
	} 
	else{
		$fileExist['data'] = false;
	}	
	echo json_encode($fileExist);
?>