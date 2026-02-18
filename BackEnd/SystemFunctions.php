<?php
session_start(); //session started in joget.php

include_once '../login/include/_include.php';
include_once ('../Login/app_properties.php');
global $PHPCACERTPATH;
global $IS_DOWNSTREAM;
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
    global $IS_DOWNSTREAM;
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
        if ($IS_DOWNSTREAM){
            echo $return;
        }else{
            //for KKR license info 
            $return_decoded = json_decode($return, true);

            if (json_last_error() === JSON_ERROR_NONE){ 
                $license_info = getLicenseInfoKKR();
                $return_decoded['data'][0]['PurchaseDate'] = $license_info['lic_start'];
                $return_decoded['data'][0]['ExpiryDate'] = $license_info['lic_end'];  
                $return_decoded['data'][0]['LicenseDuration'] = $license_info['lic_duration'];
                $return_decoded['data'][0]['LicenseType'] = $license_info['lic_type'];
                $return = json_encode($return_decoded, JSON_PRETTY_PRINT);
            } 
            echo $return;
        }
       
    }
}


function getLicenseInfoKKR(){
    global $response_db;
    global $CONN; 

    $owner = 'KKR';
     
    $fetchData = $CONN->fetchAll("SELECT * FROM lic_info where lic_owner = '$owner' ");
    if(!$fetchData){
        $response_db['bool'] = false;
        $response_db['msg'] = " record not found";
        return;
    }
 
    return $fetchData[0];
}