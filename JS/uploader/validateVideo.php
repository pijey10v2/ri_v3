<?php
	session_start();
	$videoName = $_POST["fileName"];
	$projectFolder = $_SESSION['project_id'];
	$fileExist = array();
	$dir = "../../Data/Projects/".$projectFolder."/".$videoName;
	if (file_exists($dir)) {
		$fileExist['data'] = true;
	} 
	else{
		$fileExist['data'] = false;
	}	
	echo json_encode($fileExist);
?>