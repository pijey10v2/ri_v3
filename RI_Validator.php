<?php
    session_start();
    

    if(!isset($_SESSION['email'])){
        session_destroy();
        header("Location: ../signin");
        exit();
    }

    //check if the license parameter can be found 
    include_once 'Login/app_properties.php';
    global $LICENSEPROPERTIES, $FILEINFO, $PHPCACERTPATH, $SYSTEM, $IS_DOWNSTREAM;
    $errorRedirectURL='';
    $hostFlag = false;
    if($SYSTEM == 'OBYU'){
        $errorRedirectURL = "/RI/licenseError.php";
        $hostFlag = true;
    }else if($SYSTEM == 'KKR'){
        if($IS_DOWNSTREAM){
            //maltimur
            $hostFlag = true;
            $errorRedirectURL = "/RIConstruct/licenseError.php";
        }else{
            //KKR
            $errorRedirectURL = "/RIConstruct/licenseError.php";
        }
    }
   

    if ($LICENSEPROPERTIES === false && $FILEINFO === false)
    {
        echo "License file corrupted.";
        return;
    }

    $expiryTimestamp = $FILEINFO['FILE_EXPIRY'];
    $secretKey = $LICENSEPROPERTIES['Key']['value'];
    $host = $_SERVER['HTTP_HOST'];  //give domain name
    $port = $_SERVER['SERVER_PORT'];    //443
    
    //-----Get Drive ID 
    function GetVolumeLabel($drive) 
    {
        if (preg_match('#Volume Serial Number is (.*)\n#i', shell_exec('dir '.$drive.':'), $m)) 
        {
            return ' ('.$m[1].')'; 
        } 
        else 
        { 
            echo "Internal error.";
            return;
        }
    }

    $directory = __DIR__;
    $driveLabel = $directory[0];
    $serial = str_replace("(","",str_replace(")","",GetVolumeLabel($driveLabel)));
    //-----

    $md5Key = md5(trim($host).':'.$port.':'.trim($expiryTimestamp).':'.trim($serial).':'.trim($secretKey));
    if($hostFlag){
        $payload = http_build_query(array('licenseKey' => $md5Key, 'clientPort' => $port, 'host' =>$host));
    }else{
        $payload = http_build_query(array('licenseKey' => $md5Key, 'clientPort' => $port));
    }
    
    //send curl to server to check for details validity and check expiry date.
    $host = "https://ri-server.azurewebsites.net/";
//for KKR the .pem file is different to cacert.pem. so need to give location for cacert.pem file for other curl functions (non joget  & non geo server requests)
    $certificate_location = $PHPCACERTPATH;
    $ch = curl_init($host);
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
        header('Location: '.$errorRedirectURL.'?error=connectionfailed');
    } else {
        $response = json_decode($return,true);
        if($response['bool'] == false){
            // redirect to somewhere else to contact Reveron
            header('Location: '.$errorRedirectURL.'?error='.$response['msg']);
        }
    }
    
 ?>