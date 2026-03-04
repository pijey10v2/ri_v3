<?php
session_start();
include_once('class/jogetLink.class.php');
global $api_username, $api_password, $jogetAssetHostIP, $JOGETLINKOBJ;


$JOGETLINKOBJ = new JogetLink();
$api_username = $JOGETLINKOBJ->getAdminUserName('asset');
$api_password = $JOGETLINKOBJ->getAdminUserPassword('asset');
$jogetHostIP = $JOGETLINKOBJ->jogetHost;


if (isset($_POST['functionName'])) {
    switch ($_POST['functionName']) {
        case "getListOfOmniClass":
            getListOfOmniClass();
            break;
       
    }
}

function getListOfOmniClass()
{
    global $api_username, $api_password, $JOGETLINKOBJ;
    
    $host = $JOGETLINKOBJ->getLink('fm_omni_class_datalist');
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

    if ($err) {
        echo $err;
    } else {
        $decodedText = html_entity_decode($return);
        echo $decodedText;
    }
}
