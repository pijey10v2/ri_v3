<?php
set_time_limit(0);
error_reporting(E_ALL);

ini_set("display_errors", 1);
dirname (__FILE__);

include 'vendor/autoload.php';
include_once('../../BackEnd/class/jogetLink.class.php');
global $JOGETLINKOBJ;
$JOGETLINKOBJ = new JogetLink();
use Dilab\Network\SimpleRequest;
use Dilab\Network\SimpleResponse;
use Dilab\Resumable;

$request  = new SimpleRequest();
$response = new SimpleResponse();

$resumable = new Resumable($request, $response);
$extension = $resumable->getExtension();
$fileNameFull = $resumable->getOriginalFilename();
$fileNameArray = explode(".", $fileNameFull);
$fileName = $fileNameArray[0];

$resumable->tempFolder   = 'AIC_Temp';
$resumable->uploadFolder = "../../../Data/Geoserver/AIC";
$resumable->process();

if (true === $resumable->isUploadComplete()) {
    if ($_SESSION['is_Parent'] == "isParent") {
        $projectId = $_GET["packageId"];
    } else {
        $projectId = $_SESSION['projectID'];
    }

    // true when the final file has been uploaded and chunks reunited.
    //transfer all files to geo server
    $fileType = "AIC";
    $filePath       = "../../../Data/Geoserver/AIC/".$fileNameFull;
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
        //Get the canonicalized pathname of our file and prepend the @ character.
        $filePath = '@' . realpath($filePath);
        //Turn off SAFE UPLOAD so that it accepts files, starting with an @
        curl_setopt($ch, CURLOPT_SAFE_UPLOAD, false);
    }
    $data          = array(
        "pwd" => base64_encode ("ReveronITDepartment2021+"),
        "file" => $filePath,
        "fileName" => $fileNameFull,
        "projectId" => $projectId,
        "fileType" => $fileType
    );
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0); 
    curl_setopt($ch, CURLOPT_TIMEOUT, 1000); //timeout in seconds
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

