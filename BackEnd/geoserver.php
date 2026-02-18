<?php
session_start();
include_once '../login/include/_include.php';
include_once('class/jogetLink.class.php');
global $JOGETLINKOBJ;
$JOGETLINKOBJ = new JogetLink();
$response = array();
$functionName = filter_input(INPUT_POST, 'functionName', FILTER_SANITIZE_STRING);
$geoserverUrl = $JOGETLINKOBJ->geoServerHost."/geoserver/rest/";

// if (!$functionName) {
//     $response['bool'] = false;
//     $response['msg'] = "Invalid function";
//     echo json_encode($response);
//     exit();
// }
getListOfStyles();
// switch ($functionName) {
//     case 'getListOfStyles': 
//         getListOfStyles();
//     break;
//     // case 'updateVideoCam':
//     //     updateVideoCam();
//     // break;
// };
echo json_encode($response);


function getListOfStyles(){
    global $geoserverUrl;
    global $response;
    global $JOGETLINKOBJ;
    $geoUser = $JOGETLINKOBJ->getAdminUserName('geoServer');
    $geoPwd = $JOGETLINKOBJ->getAdminUserPassword('geoServer');
    $url = $geoserverUrl."styles";
    $ch = curl_init();
    $headers       = array(
        'Content-Type:application/json',
        'Authorization: Basic ' . base64_encode("$geoUser:$geoPwd"),
    );
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $data     = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if($httpCode === 200){
        $response['data'] = json_decode($data)->styles->style;
    }else{
        return false;
    }
}
