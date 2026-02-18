<?php
        session_start();
        require '../Login/include/db_connect.php';
   
          $user = $_SESSION['email'];
          $pid = $_SESSION['project_id'];

          $locationid = $_POST['locationID'];
          $myresult =[];
 
          if(isset($user))
           {
                $params = array();
                $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
                $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_Role IN ('Project Manager' , 'Project Monitor') AND pro_usr_rel.Pro_ID = '$pid'",$params,$options);
                if( $stmt === false ) {
                    die( print_r( sqlsrv_errors(), true));
                    exit();
                }

                $row = sqlsrv_has_rows($stmt);
                if($row == false)
                {
                    $myresult['msg'] = "No Permission.";
                    $myresult['result'] = false;
                    echo (json_encode($myresult));
                    exit();

                }

                $sql = "DELETE FROM fileData WHERE locationID = '$locationid'";
                $res = sqlsrv_query( $conn, $sql );
                if( $res == false){
                    $myresult['msg'] = "Unable to delete the file data associated with the location. Please contact the database admin. ";
                    $myresult['result'] = false;
                    echo (json_encode($myresult));
                    exit();
                }
                $sql = "DELETE FROM locations WHERE locationID = '$locationid'";
                $res = sqlsrv_query( $conn, $sql );
                if( $res == false){
                    $myresult['msg'] = "Unable to delete the the location. Please contact the database admin. ";
                    $myresult['result'] = false;
                    echo (json_encode($myresult));
                    exit();
                }
                $myresult['msg'] = "Deleted the location and the files associated with it successfully! ";
                $myresult['result'] = true;
                echo (json_encode($myresult));
                exit();

           }
?>