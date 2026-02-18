<?php
include 'vendor/autoload.php';
require 'kml_filter.php';
include_once('../../BackEnd/class/jogetLink.class.php');
global $JOGETLINKOBJ;
$JOGETLINKOBJ = new JogetLink();
use Dilab\Network\SimpleRequest;
use Dilab\Network\SimpleResponse;
use Dilab\Resumable;
$foldername = $_GET["foldername"];
$dataType   = $_GET["dataType"];

if ($dataType == 'KML') {
    $request  = new SimpleRequest();
    $response = new SimpleResponse();

    $resumable    = new Resumable($request, $response);
    $extension    = $resumable->getExtension();
    $originalName = $resumable->getOriginalFilename();
    if ($extension == "" || $extension == "kml" or $extension == "kmz") {
        $resumable->tempFolder   = 'tmps';
        $resumable->uploadFolder = 'kml_raw';
        $resumable->process();
    } else {
        echo "Illegal file format found!";
        exit;
    }

    if (true === $resumable->isUploadComplete()) {
        // true when the final file has been uploaded and chunks reunited.
        echo "Done";
        if ($extension == "kml") {
            kml_filter($originalName);
        } else if ($extension == "kmz") {
            $file = "kml_raw/" . $originalName;
            if (!copy($file, '../../../Data/KML/' . $originalName)) {
                echo "failed to copy $originalName";
            }
        }
    }
}else if ($dataType == 'XML') {
    $request  = new SimpleRequest();
    $response = new SimpleResponse();

    $dir      = "../../../Data/Others/PLC/";
    $resumable    = new Resumable($request, $response);
    $extension    = $resumable->getExtension();
    $originalName = $resumable->getOriginalFilename();

    if ($extension == "" || $extension == "xml") {
        $resumable->tempFolder   = 'tmps';
        $resumable->uploadFolder = $dir;
        $resumable->process();
    } else {
        echo "Illegal file format found!";
        exit;
    }

    if (true === $resumable->isUploadComplete()) {
        echo "Done";
    }
} else if ($dataType == 'SHP') {
    $request      = new SimpleRequest();
    $response     = new SimpleResponse();
	// $dir      = "../../../Data/Geoserver/" . $_SESSION['project_id'] . "/" . $foldername;
	$dir      = "../../../Data/Geoserver/Shapefile/" . $foldername;
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
        echo "The directory $dir was successfully created.";
    } else {
        echo "The directory $dir exists.";
    }
    $resumable    = new Resumable($request, $response);
    $originalName = $resumable->getOriginalFilename();
   
    $fileNameOnly =  str_replace(" ","-",$resumable->getOriginalFilename(Resumable::WITHOUT_EXTENSION));
    $extension    = $resumable->getExtension();
    if ($extension == "" || $extension == "shp" || $extension == "shx" || $extension == "dbf" || $extension == "sbn" ||
	 	$extension == "sbx" || $extension == "fbn" || $extension == "fbx" || $extension == "ain" || $extension == "aih" ||
		$extension == "atx" || $extension == "ixs" || $extension == "mxs" || $extension == "prj" || $extension == "xml" || 
		$extension == "cpg") {
		$resumable->tempFolder   = 'tmps';
		$resumable->uploadFolder = $dir;
        $resumable->process();
    } else {
        echo "Illegal file format found!";
        exit;
    }

	if (true === $resumable->isUploadComplete()) {
        // true when the final file has been uploaded and chunks reunited.
        //transfer all files to geo server
        $projectId = $_SESSION['projectID'];
        $fileType = "Shapefile";
        //The name of the field for the uploaded file.
        $uploadFileName = $originalName;
        $filePath       = "../../../Data/Geoserver/Shapefile/".$foldername."/".$originalName;
        $url            = $JOGETLINKOBJ->geoServerHost."/JavaBridge/geodataupload/fileTransfer.php";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        //If the function curl_file_create exists
        if(function_exists('curl_file_create')){
            //Use the recommended way, creating a CURLFile object.
            $filePath = curl_file_create($filePath);
        } else{
            //Otherwise, do it the old way.
            //Get the canonicalized pathname of our file and prepend, the @ character.
            $filePath = '@' . realpath($filePath);
            //Turn off SAFE UPLOAD so that it accepts files, starting with an @
            curl_setopt($ch, CURLOPT_SAFE_UPLOAD, false);
        }

        $data          = array(
            "pwd" => base64_encode ("ReveronITDepartment2021+"),
            "file" => $filePath,
            "fileName" => $uploadFileName,
            "projectId" => $projectId,
            "fileType" => $fileType,
            "folderName" => $foldername
        );
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $head = curl_exec($ch);
        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
            $ret["status"] = "Error";
            $ret["msg"] = $error_msg;
            echo json_encode ($ret);
            die();
        }
        curl_close($ch);
        echo $head;
    }
} else {
    //b3dm
    $request  = new SimpleRequest();
    $response = new SimpleResponse();
    $dir      = "../../../Data/3DTiles/" . $foldername;
    if (!file_exists($dir)) {
        mkdir($dir);
        echo "The directory $dir was successfully created.";
    } else {
        echo "The directory $dir exists.";
    }
    $resumable = new Resumable($request, $response);
    $extension = $resumable->getExtension();
    echo $extension;

    if ($extension == "" || $extension == "cmpt" or $extension == "b3dm" or $extension == "json") {
        $resumable->tempFolder   = 'tmps';
        $resumable->uploadFolder = $dir;
        $resumable->process();
    } else {
        echo "Illegal file format found!";
        exit;
    }

    if (true === $resumable->isUploadComplete()) {
        // true when the final file has been uploaded and chunks reunited.
        echo "Done";
    }

}
