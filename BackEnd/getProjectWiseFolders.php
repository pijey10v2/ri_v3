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
      $res = curl_exec($ch);
      curl_close($ch);
      if($res){
           $obj = json_decode($res, true);
       return( $obj);
      }
      else{
         //  return('Error:"'.curl_strerror($ch).'" - code: '.curl_errno($ch));
          return(false);
      };
      
  }
   
    $pid = $_SESSION['project_id'];
    $user = $_SESSION['email'];
    $uResult=[];
    if(isset($user)){
      $params = array();
      $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
      $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_ID = $pid AND pro_usr_rel.Pro_Role IN ('Project Manager', 'Project Monitor') ",$params,$options);
      if( $stmt === false ) {
          die( print_r( sqlsrv_errors(), true));
          exit();
      }
      $row = sqlsrv_has_rows($stmt);
      if($row == false){
          $uResult['msg'] =  "No Permission.";
          echo (json_encode($uResult));
          exit();
      }
     
   
    
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
      };

      $auth = 'Authorization: Basic '.$base64;
      #echo $auth;
      $my_header = [];
      $my_header[0] =$auth;
      $my_header[1] ='Mas-App-Guid: 9eb0d286-a1a2-4945-ad8f-0a54087ec080';
      $my_header[2] = 'Mas-Uuid: fd9831d0-ff01-4e32-9bca-bcccf7b399d6';
      $folder = [];
    

    if(isset($_POST['instanceID'])){
        $id = $_POST['instanceID'];
        $url = $my_url.'Navigation/NavNode/'.$id.'/NavNode?$filter=HasChildren+eq+true';
        //?$filter=HasChildren+eq+true
        $resp = get_data($url, $my_header);
        $uResult['data'] = $resp;
        echo (json_encode($uResult));
       
        exit;
      }else{
       
        $response = get_data($my_url,$my_header);
        $uResult['root'] = $response['instances'][0];
       
        $url = $my_url.'Navigation/NavNode';
        $resp = get_data($url, $my_header);
        $uResult['data'] = $resp['instances'];	
      
        echo(json_encode($uResult));	
        exit;
      }
    }
?>