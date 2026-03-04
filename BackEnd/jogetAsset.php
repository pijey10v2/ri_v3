<?php


session_start();
include_once('class/jogetLink.class.php');
global $api_username, $api_password, $jogetAssetHostIP, $JOGETLINKOBJ;


$JOGETLINKOBJ = new JogetLink();
$api_username = $JOGETLINKOBJ->getAdminUserName('asset');
$api_password = $JOGETLINKOBJ->getAdminUserPassword('asset');
$jogetHostIP = $JOGETLINKOBJ->jogetAssetHost;

// if (!isset($conn)) {
//     require '../login/include/db_connect.php';
// }

if (isset($_POST['functionName'])) {
    switch ($_POST['functionName']) {
        case "getListOfAssetNotification":
            getListOfAssetNotification(); //for Asset Inbox
            break;
        case "addAssetTableData":
            $data = $_POST['mappings'];
            $url = $_POST['url'];
            addAssetTableData($data, $url);
            break;
        case "getFMAssetColumns":
            getFMAssetColumns(); //for Asset Inbox
            break;
       
    }
}

function getListOfAssetNotification()
{
    global $api_username, $api_password, $JOGETLINKOBJ;
    
    $host = $JOGETLINKOBJ->getLink('asset_json_datalist_notifications');
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


