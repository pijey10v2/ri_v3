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
    if( !isset($_POST['imagePinID']))
     {
        $uResult['error'] = 'No variable input!'; 
        echo(json_encode($uResult));
        exit();
    }
   
    $id = $_POST['imagePinID'];
    $imagePinName = $_POST['imagePinName'];
    $headType = $_POST['headType'];
    
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

        $stmt1 = sqlsrv_query($conn, "SELECT imageURL FROM earthPin WHERE imagePinID = '$id' AND projectID ='$pid'",$params,$options);
		if( $stmt1 === false ) {
			die( print_r( sqlsrv_errors(), true));
			exit();
		}
		while( $row = sqlsrv_fetch_array( $stmt1, SQLSRV_FETCH_ASSOC) ) {
            $URL = $row['imageURL'];
            if (file_exists('../'.$URL) && $headType == 0){
                if (unlink('../'.$URL)) {   
                    $uResult= array(
                        'msg' => "Delete successful"
                        );
                }
                else {
                    $uResult= array(
                        'msg' => "Delete failed, record isn't removed"
                        );
                        echo '../'.$URL;
                    echo(json_encode($uResult));
                    exit();
                }   
            } 
        }
        $sql = "DELETE FROM earthPin WHERE imagePinID = '$id' AND projectID = '$pid';";
        $res = sqlsrv_query( $conn, $sql );
        if( $res === false ) {
            $uResult['error'] = 'SQL Error!'; 
            echo(json_encode($uResult));
            exit();
        }
        else{
            $uResult['msg'] = 'Successfully Deleted!'; 
            echo(json_encode($uResult));
            exit();
        }
       
    }
?>