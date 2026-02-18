<?php
session_start();
include_once('class/jogetLink.class.php');
global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;


$JOGETLINKOBJ = new JogetLink();
$api_username = $JOGETLINKOBJ->getAdminUserName();
$api_password = $JOGETLINKOBJ->getAdminUserPassword();
$_SESSION['Package_Version'] = $JOGETLINKOBJ->jogetConstructVersion;
$jogetHostIP = $JOGETLINKOBJ->jogetHost;

if (!isset($conn)) {
    require '../login/include/db_connect.php';
}

if (isset($_POST['functionName'])) {
    switch ($_POST['functionName']) {
        case "getListOfNotification":
            getListOfNotification(); //#demonoti
            break;
        case "initiateBumiProcess":
            initiateBumiProcess(); //#demonoti
            break;
        case "getBumiRecord":
            getBumiRecord();
            break;
        case "getLandList":
            getLandList();
            break;
    }
}

function getListOfNotification()
{
    global $api_username, $api_password, $JOGETLINKOBJ;
    
    $host = $JOGETLINKOBJ->getLink('cons_json_datalist_inbox');
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password"),
    );
    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if (!$err) {
        $decodedText = html_entity_decode($return);
        echo $decodedText;
    }
}


function getLandList()
{
    global $api_username, $api_password, $JOGETLINKOBJ;
    if($_SESSION['is_Parent'] == "isParent"){
        return;
    }
    $listName = $_POST['list'];
    switch($listName){
        case "landRegistration":
            $host = $JOGETLINKOBJ->getLink('cons_json_datalist_LR');
        break;  
        case "landIssue":
            $host = $JOGETLINKOBJ->getLink('cons_json_datalist_LI');
        break;
        default:
        return;
    }
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );
    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        echo $err;
    } else {
        $decodedText = html_entity_decode($return);
        echo $decodedText;
    }
}

function getBumiRecord(){
    {
        global $api_username, $api_password, $JOGETLINKOBJ;
        if ($_SESSION['is_Parent'] !== "isParent") {
            return;
        }
    
        $fileName =  rawurlencode($_POST['fileName']);
        $WPCNo = $_POST['WPCNo'];
        $host = $JOGETLINKOBJ->getLink('cons_json_datalist_BUMI', array($fileName, $WPCNo));

        $headers = array(
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode("$api_username:$api_password")
        );
        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $return = curl_exec($ch);
        $err    = curl_error($ch);
        curl_close($ch);
    
        if ($err) {
            echo $err;
        } else {
            $decodedText = html_entity_decode($return);
            echo $decodedText;
        }
    }
}

function initiateBumiProcess() 
{
    global $jogetHostIP;
    $api_username = $_SESSION['email'];
    $api_password = $_SESSION['password'];
 
    if ($_SESSION['is_Parent'] !== "isParent") {
        return;
    }
    if(empty($_POST['processName']) && !isset($_SESSION['Package_Version'])){
        return;
    }
    
    $appListsEncode = json_decode($_SESSION['appsLinks']);
    if(!$appListsEncode->constructPackage_name){
        return;
    }
    $packageName = explode('::', $appListsEncode->constructPackage_name);
    
    $processId = $packageName[0] . ":" . $_SESSION['Package_Version'] . ":bp";      //crm:3:process1
    $host = $jogetHostIP . "jw/web/json/workflow/process/start/" . $processId;
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
        return $err;
    } else {
        echo $return;
    }
}
