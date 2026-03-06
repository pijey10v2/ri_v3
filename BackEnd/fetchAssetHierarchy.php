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

    $host = $JOGETLINKOBJ->getLink('omni_class_network_asset');

    $headers = [
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    ];

    $cookie = tempnam(sys_get_temp_dir(), 'cookie');

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);
    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $err = curl_error($ch);

    curl_close($ch);

    header('Content-Type: application/json');

    if ($err) {
        echo json_encode(["error"=>$err]);
    } else {
        echo $response;
    }
}
 