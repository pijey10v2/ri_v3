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
    

        $sql = "DELETE from configPwPBi WHERE projectID ='$pid' AND type ='PW'";
        $res = sqlsrv_query( $conn, $sql );
        if ($res) {
            $uResult['msg'] = 'Successfully cleared the config details of ProjectWise for this project!'; 
            echo(json_encode($uResult));
            exit();
        }else{
            $uResult['error'] = 'SQL Error! Unable to Clear the config details for ProjectWise.'; 
            echo(json_encode($uResult));
            exit();
        }
  
    }
?>