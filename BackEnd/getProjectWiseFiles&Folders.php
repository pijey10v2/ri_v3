<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    include_once ('../Login/app_properties.php');
    global $PHPCACERTPATH;

    session_start();

    function get_data($my_url, $headers){
        global $PHPCACERTPATH;
        $certificate_location = $PHPCACERTPATH;
        $ch = curl_init();
         curl_setopt_array($ch, array(
          CURLOPT_RETURNTRANSFER => 1,
          CURLOPT_URL => $my_url,
          CURLOPT_HTTPHEADER => $headers,
          CURLOPT_SSL_VERIFYPEER => $certificate_location,
          CURLOPT_SSL_VERIFYHOST => $certificate_location
          )
        );
        try{
            $res = curl_exec($ch);
            curl_close($ch);
            $obj = json_decode($res, true);
           return($obj);
        }
        catch (Error $e) {
           // Handle error
           $uResult['msg'] = $e->getMessage(); // Call to a member function method() on string
           return false;
        }
    }
   
    $pid = $_SESSION['project_id'];
  //  $user = $_SESSION['email'];
    $uResult=[];
    if(!isset($_SESSION['PWurl']) && !isset($_SESSION['PWcreds'])){
        
      $sql = "SELECT  url, userNamePassword FROM configPwPBi WHERE projectID = '$pid' AND type ='PW'";
      $res = sqlsrv_query($conn,$sql);
      if($res=== false){
        die( print_r( sqlsrv_errors(), true));
        exit();
      }else{
        $row = sqlsrv_has_rows($res);
        if($row == false){
          $uResult['data'] = false;
          $uResult['msg'] =  "Unable to get the config details for ProjectWise from the database. Please set them at Project Admin Page.";
          echo (json_encode($uResult));
          exit();
        }
      }
     
      while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
        $my_url = $row['url'];
        $base64 = $row['userNamePassword'];
        $_SESSION['PWurl'] = $row['url'];
        $_SESSION['PWcreds'] = $row['userNamePassword'];
      };
    }else{
        $my_url = $_SESSION['PWurl'];
        $base64 = $_SESSION['PWcreds'];
    }

    $auth = 'Authorization: Basic '.$base64;
    #echo $auth;
    $my_header = [];
    $my_header[0] =$auth;
    $my_header[1] ='Mas-App-Guid: 9eb0d286-a1a2-4945-ad8f-0a54087ec080';
    $my_header[2] = 'Mas-Uuid: fd9831d0-ff01-4e32-9bca-bcccf7b399d6';
    
    $folder = [];
    if(isset($_POST['instanceID'])){
        $id = $_POST['instanceID'];
        $url = $my_url.'Navigation/NavNode/'.$id.'/NavNode';
        //?$filter=HasChildren+eq+true
        $resp = get_data($url, $my_header);
        if($resp){
            $m = sizeof($resp['instances']);
            $documents = [];
            $a = 0;
            for($j=0; $j<$m; $j++){
                $instanceId = $resp['instances'][$j]['instanceId'];
                $Children = $resp['instances'][$j]['properties']['HasChildren'];
                if($Children){
                    $folder[$a]['id']= $resp['instances'][$j]['instanceId'];
                    $folder[$a]['text'] = $resp['instances'][$j]['properties']['Label'];
                    $folder[$a]['parent'] = $id;
                    $folder[$a]['folder'] = true;
                }elseif($resp['instances'][$j]['properties']['Key_ClassName'] == "Document" ){
                    $folder[$a]['id']= $resp['instances'][$j]['properties']['Key_InstanceId'];
                    $folder[$a]['text'] = $resp['instances'][$j]['properties']['Label'];
                    $folder[$a]['parent'] = $id;
                    $folder[$a]['folder'] = false;
                    $folder[$a]['ClassName'] = "Document";
                }elseif($resp['instances'][$j]['properties']['Key_ClassName'] == "LogicalSet" ){
                  $folder[$a]['id']= $resp['instances'][$j]['properties']['Key_InstanceId'];
                  $folder[$a]['text'] = $resp['instances'][$j]['properties']['Label'];
                  $folder[$a]['parent'] = $id;
                  $folder[$a]['ClassName'] = "LogicalSet";
              };
                $a++;
            }
            $uResult['msg'] = "success";
            $uResult['data'] = $folder;
        };
        echo (json_encode($uResult));
        exit;
    }else{
        
        $uResult['msg'] = "No instance ID";
        echo (json_encode($uResult));
    }
?>