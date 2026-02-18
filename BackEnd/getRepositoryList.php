<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    include_once ('../Login/app_properties.php');
    global $PHPCACERTPATH;

    session_start();

    function get_data($my_url){
        global $PHPCACERTPATH;
        $certificate_location = $PHPCACERTPATH;
        $ch = curl_init();
        curl_setopt_array($ch, array(
          CURLOPT_RETURNTRANSFER => 1,
          CURLOPT_URL => $my_url,
         // CURLOPT_HTTPHEADER => $headers,
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
           return('Error:"'.curl_strerror($ch).'" - code: '.curl_errno($ch));
          //return($res);
      };
      
  }
  $pid = $_SESSION['project_id'];
  $user = $_SESSION['email'];
  if(isset($user)){
    $params = array();
    $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
    $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_ID = $pid AND pro_usr_rel.Pro_Role IN ('Project Manager', 'Project Monitor')",$params,$options);
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
    $my_url =$_POST['url'];
    $my_url = $my_url."v2.5/Repositories";
    $resp = get_data($my_url);
    echo(json_encode($resp));	
    }
?>