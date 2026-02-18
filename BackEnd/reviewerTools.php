<?php
session_start();

include_once('class/jogetLink.class.php');
global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;

$JOGETLINKOBJ = new JogetLink();
$api_username = $JOGETLINKOBJ->getAdminUserName();
$api_password = $JOGETLINKOBJ->getAdminUserPassword();
$jogetHostIP = $JOGETLINKOBJ->jogetHost;

if (!isset($conn)) {
    require('../login/include/db_connect.php');
}

$response = array();
if (isset($_POST['functionName'])) {
    switch ($_POST['functionName']) {
        case "initiateMarkupProcess":
            initiateMarkupProcess();
            break;
        case "uploadScreenshot":
            uploadScreenshot();
            break;
        case "getAllReviews":
            getAllReviews();
            break;
    }
}

function initiateMarkupProcess() 
{
    global $jogetHostIP;
    global $response;
    $api_username = $_SESSION['email'];
    $api_password = $_SESSION['password'];

    $processId = "RI_Markup:1:markup_Process"; //crm:3:process1
    $host = $jogetHostIP . "jw/web/json/workflow/process/start/" . $processId."?var_Project="."dummy"."&var_Package=".$_SESSION['projectID']."&var_PackageID=".$_SESSION['project_id'];
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );
    $payload = array();
    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);
    if ($err) {
        $response = $err;
        echo json_encode($response);
    } else {
        echo $return;
    }
}

function uploadScreenshot(){
    global $response;
    $imageFName =    $_SESSION['firstname'] . "_" . $_SESSION['lastname'] . "_" . time(); 
    $pid = $_SESSION['project_id'];
    $img = $_POST['imgBase64'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $fileData = base64_decode($img);
    //saving
    if(file_put_contents("../../Data/Projects/".$pid."/".$imageFName.".png", $fileData)){
        $response['data'] = $imageFName;
    }else{
        $response['msg'] = 'Unable to upload the image'; 
    }
    echo json_encode($response);
}
