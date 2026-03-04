<?php
session_start(); //session started in joget.php

include_once '../login/include/_include.php';
include_once ('../Login/app_properties.php');
global $PHPCACERTPATH;

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
    global $PHPCACERTPATH;
    $host = "https://ri.reveronconsulting.com/rilicenseserver/getLicenseInfo.php";
    $headers = array(
        'Content-Type: application/json'
    );
    $payload = array();
    $ch = curl_init($host);
    $certificate_location = $PHPCACERTPATH;
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $certificate_location);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $certificate_location);
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


