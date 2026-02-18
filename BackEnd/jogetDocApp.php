<?php
session_start();
include_once('class/jogetLink.class.php');
global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;

$JOGETLINKOBJ = new JogetLink();
$api_username = $JOGETLINKOBJ->getAdminUserName();
$api_password = $JOGETLINKOBJ->getAdminUserPassword();
$jogetHostIP = $JOGETLINKOBJ->jogetHost;

function getJogetDocNotifications(){
    global $api_username;
    global $api_password;
    global $JOGETLINKOBJ;
  
    $user = $_SESSION['email'];
    $host = $JOGETLINKOBJ->getLink('doc_json_corr_notification');
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {

    } else {
        $decodedText = html_entity_decode($return);
        echo $decodedText;
    }
}


function getJogetCorrDocInfo(){
    global $api_username;
    global $api_password;
    global $jogetHostIP;
    $host = $jogetHostIP . "jw/web/json/data/list/document_mgmt/doc_correspondence_list_api?d-2230121-fn_Project=".$_SESSION['projectID']; 
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {

    } else {
        // $decodedText = html_entity_decode($return);
        return json_decode($return, true);
    }  
}

function getJogetRegDocInfo(){
    global $api_username;
    global $api_password;
    global $jogetHostIP;
    $host = $jogetHostIP . "jw/web/json/data/list/document_mgmt/list_document?d-2584378-fn_Project=".$_SESSION['projectID']; 

    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);
    if ($err) {

    } else {
        // $decodedText = html_entity_decode($return);
        return json_decode($return, true);
    }  
}

function getDocInfo(){
    $allCorrDoc =  getJogetCorrDocInfo();
    $corrRet = $statusRet = $incomingDoc = $outGoingDoc = $corrStatusDoc = $regSubType = array();

    if (isset($allCorrDoc['data'])) {
        foreach ($allCorrDoc['data'] as $doc) {
           // populate status doc
         $corrStatusDoc[$doc['doc_status']][] = $doc;
            if ($doc['doc_subtype'] == "Incoming") {
               $incomingDoc[]= $doc;
            }else if ($doc['doc_subtype'] == "Outgoing"){
             $outGoingDoc[] = $doc;
            }
        }
    }
    $corrRet = array(
        'total' =>(isset($allCorrDoc['total'])) ? $allCorrDoc['total'] : 0,
        'Incoming' => $incomingDoc,
        'Outgoing' => $outGoingDoc,
        'Status' => $corrStatusDoc
    );

    $allRegDoc =  getJogetRegDocInfo();
    if ($allRegDoc['data']) {
        foreach ($allRegDoc['data'] as $doc) {
            $regSubType[$doc['doc_type']][] = $doc;
        }
    }
    $allRegDoc =  getJogetCorrDocInfo();

    $ret = array(
        'registerDoc' => $regSubType,
        'corrDoc' => $corrRet
    );
    return $ret;
}

//initiate a document process and set workflow var (project)
function initiateDocJogetProcess() 
{
    global $jogetHostIP;

    if(!isset($_POST['processName']) || empty($_POST['processName']) || $_SESSION['is_Parent'] == "isParent") return;
    if(!isset($_SESSION['appsLinks'])) return;

    $docPackageVersion = 'latest';
    $processName = '';

    switch ($_POST['processName']) {
        case 'app_DR':
        $processName = "document_register";
            break;
    }

    if (!$processName) return;

    $api_username = $_SESSION['email'];
    $api_password = $_SESSION['password'];
    $appListsEncode = json_decode($_SESSION['appsLinks']);
    if(!$appListsEncode->documentPackage_name) return;
    $packageName = explode('::', $appListsEncode->documentPackage_name);

    $processId = $packageName[0] . ":" . $docPackageVersion . ":" . $processName;      //crm:3:process1
    $host = $jogetHostIP . "jw/web/json/workflow/process/start/" . $processId."?var_Project=".$_SESSION['projectID'];
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
    $ret = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return $err;
    } else {
        return $ret;
    }
}

if (isset($_POST['functionName'])) {
    switch ($_POST['functionName']) {
        case "getJogetDocNotifications":
            getJogetDocNotifications();//function to get notifications 
            break;
        case "getDocInfo":
            $ret = getDocInfo();
            echo json_encode($ret); 
            break;
        case "initiateDocJogetProcess":
            $ret = initiateDocJogetProcess();
            echo $ret; 
            break;
    }
}