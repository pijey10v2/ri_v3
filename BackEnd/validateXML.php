<?php
session_start();
$pid = $_SESSION['project_id'];
//this php is to validate existing file/folder in server
	if(isset($_POST['name']))
	{
		$name =$_POST['name'];
		$fileResult = array();
		$dir = "../../Data/Projects/".$pid."/".$name;
		if (file_exists($dir)) {
			$fileResult['result'] = true;
		} 
	}
	else{
		$fileResult['error'] = "No para found";
	}
	echo json_encode($fileResult);
?>