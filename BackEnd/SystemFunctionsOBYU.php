<?php
session_start(); 

include_once '../login/include/_include.php';
$response = array();
$functionName = filter_input(INPUT_POST, 'functionName', FILTER_SANITIZE_STRING);

if (!$functionName) {
    $response['bool'] = false;
    $response['msg'] = "Invalid function";
    echo json_encode($response);
    exit();
}

switch ($functionName) {
    case 'getLicenseInfo': //view_project.php
        getLicenseInfo();
        break;
}

function getLicenseInfo(){
    $host = "https://ri.reveronconsulting.com/rilicenseserver/getLicenseInfo.php";
    $headers = array(
        'Content-Type: application/json'
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


