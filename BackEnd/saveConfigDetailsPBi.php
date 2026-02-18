<?php
    session_start();
    require ('../login/include/db_connect.php');
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    $uResult = array();
    if(!isset($_POST['URL']) || !isset($_POST['userName']) || !isset($_POST['password']))
     {
        $uResult['error'] = 'No variable input!'; 
        echo(json_encode($uResult));
        exit();
    }
   
   $url = $_POST['URL'];
   $userName = $_POST['userName'];
   $password = base64_encode($_POST['password']); //enoding password only to save in userPassword column in DB

   if(isset($user)){
        $params = array();
        $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
        $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_ID = $pid AND pro_usr_rel.Pro_Role IN ('Project Manager' , 'Project Monitor') ",$params,$options);
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
       
        $sql = "SELECT * from configPwPBi WHERE projectID ='$pid' AND type ='PBI'";
        $res = sqlsrv_query( $conn, $sql );
        if ($res) {
            $rows = sqlsrv_has_rows( $res );
            if ($rows === true){
                $sql = "UPDATE configPwPBi SET  url = '$url', userName = '$userName', userNamePassword = '$password', updatedby = '$user', updatedDate = GETDATE() WHERE projectID = '$pid' AND type ='PBI'";
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
                $sql = "INSERT INTO configPwPBi([projectID],[type],[url],[userName],[userNamePassword],[updatedBy],[updatedDate]) VALUES ('$pid','PBI','$url','$userName', '$password','$user',GETDATE())";
                $res = sqlsrv_query( $conn, $sql );
                if( $res === false ) {
                    $uResult['error'] = $sql;//'SQL Error!'; 
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
  
    }
?>