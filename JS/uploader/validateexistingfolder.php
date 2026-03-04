<?php
session_start();
//this php is to validate existing file/folder in server
	$fileArray = json_decode($_POST["fileArray"]);
	$dataType = $_POST["dataType"];
	$folderResult = array();
	$kmlExist = array();
	$xmlExist = array();
	if($dataType == "B3DM"){	//this is b3dm
		$dir = "../../../Data/3DTiles/".$fileArray[0];
		if (file_exists($dir)) {
			$folderResult['result'] = true;
		} 
		else{
			$folderResult['result'] = false;
		}
	}else if($dataType == "XML"){
		foreach($fileArray as $xmlfile){
			$dir = "../../../Data/Others/PLC/".$xmlfile;
			if (file_exists($dir)) {
				$folderResult['result'] = true;
				array_push($xmlExist,$xmlfile);
			} 
		}
	$folderResult['kmlarray'] = $xmlExist;
	}
	else{
		foreach($fileArray as $kmlfile){
			$dir = "../../../Data/KML/".$kmlfile;
			if (file_exists($dir)) {
				$folderResult['result'] = true;
				array_push($kmlExist,$kmlfile);
			} 
		}
	$folderResult['kmlarray'] = $kmlExist;
	}
	echo json_encode($folderResult);
?>