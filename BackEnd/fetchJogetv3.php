<?php
session_start();
include_once('class/jogetLink.class.php');
global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;

$JOGETLINKOBJ = new JogetLink();
$api_username = $JOGETLINKOBJ->getAdminUserName();
$api_password = $JOGETLINKOBJ->getAdminUserPassword();
$jogetHostIP = $JOGETLINKOBJ->jogetHost;

if (isset($_POST['functionName'])) {
    switch ($_POST['functionName']) {
        case "getProjectInfo":
            $ret = getProjectInfo();
            echo json_encode($ret); 
            break;
    }
}

function getProjectInfo(){
    global $api_username, $api_password, $jogetHost, $JOGETLINKOBJ;
    $host = $JOGETLINKOBJ->jogetAppLink['api']['document_json_project_info_list'];

    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);
    if ($err) {

    } else {
        // $decodedText = html_entity_decode($return);
        return json_decode($return, true);
    }  

}