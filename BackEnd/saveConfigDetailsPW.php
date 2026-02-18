<?php
    session_start();
    require ('../login/include/db_connect.php');
    include_once ('../Login/app_properties.php');
    global $PHPCACERTPATH;
    
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    $uResult = array();
    if( !isset($_POST['username']) || !isset($_POST['password']) || !isset($_POST['URL']))
     {
        $uResult['error'] = 'No variable input!'; 
        echo(json_encode($uResult));
        exit();
    }
   
   $username = $_POST['username'];
   $password = $_POST['password'];
   $url = $_POST['URL'];
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
        $string_data = $username.":".$password;
        $base64 = base64_encode($string_data);
        $auth = 'Authorization: Basic '.$base64;
        #echo $auth;
        $my_header = [];
        $my_header[0] =$auth;
        $my_header[1] ='Mas-App-Guid: 9eb0d286-a1a2-4945-ad8f-0a54087ec080';
        $my_header[2] = 'Mas-Uuid: fd9831d0-ff01-4e32-9bca-bcccf7b399d6';
        $my_url = $url.'Navigation/NavNode';
        $ch = curl_init();
        $certificate_location = $PHPCACERTPATH;
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $my_url,
            CURLOPT_HTTPHEADER => $my_header,
            CURLOPT_SSL_VERIFYPEER => $certificate_location,
            CURLOPT_SSL_VERIFYHOST => $certificate_location,
           )
        );
        $res = curl_exec($ch);
        curl_close($ch);
        if(!$res){
            $uResult['msg'] =  "Connection to ProjectWise Database failed with the given database and user password. Please Check.";
            echo (json_encode($uResult));
            exit();
        }
        $obj = json_decode($res, true);
        $uResult['curl'] = $obj;
       // echo(json_encode($uResult));

        $sql = "SELECT * from configPwPBi WHERE projectID ='$pid' AND type ='PW'";
        $res = sqlsrv_query( $conn, $sql );
        if ($res != false) {
            $rows = sqlsrv_has_rows( $res );
            if ($rows === true){
                $sql = "UPDATE configPwPBi SET userName = '$username', userNamePassword = '$base64', url = '$url', updatedby = '$user', updatedDate = GETDATE() WHERE projectID = '$pid' AND type ='PW'";
                $res = sqlsrv_query( $conn, $sql );
                if( $res === false ) {
                    $uResult['error'] = 'SQL Error!'; 
                    echo(json_encode($uResult));
                    exit();
                }
                else{
                    $uResult['msg'] = 'Successfully Updated!'; 
                    echo(json_encode($uResult));
                    exit();
                }
            }else {
                $sql = "INSERT INTO configPwPBi([projectID],[type],[userName],[userNamePassword],[url],[updatedBy],[updatedDate]) values('$pid','PW','$username','$base64','$url','$user',GETDATE())";
                $res = sqlsrv_query( $conn, $sql );
                if( $res === false ) {
                    $uResult['error'] = 'SQL Error!'; 
                    echo(json_encode($uResult));
                    exit();
                }
                else{
                    $uResult['msg'] = 'Successfully Added!'; 
                    echo(json_encode($uResult));
                    exit();
                }
             }
        }else{
            $uResult['error'] = 'SQL Error!'; 
            echo(json_encode($uResult));
            exit();
        }
      //  echo $res;
    }
?>