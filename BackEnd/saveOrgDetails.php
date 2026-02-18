<?php
        session_start();
        require '../Login/include/db_connect.php';
        require 'joget.php';
         $user = $_SESSION['email'];
         $id = $_POST['orgID'];
         $name = $_POST['orgName'];
         $desc = $_POST['orgDesc'];
         $type = $_POST['orgType'];
        
        if(isset($user))
           {
              $params = array();
              $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
              $stmt = sqlsrv_query($conn, "SELECT * FROM users WHERE user_email='$user' AND user_type='system_admin'",$params,$options);
              if( $stmt === false ) {
                   die( print_r( sqlsrv_errors(), true));
                   exit();
              }
              $myresult =[];
              $row = sqlsrv_has_rows($stmt);
              if($row == false)
              {
            			$myresult['msg'] = "No Permission.";
        			  	echo (json_encode($myresult));
            			exit();

              }
            $sql = "SELECT * FROM organization WHERE orgID = '$id'";
            $res = sqlsrv_query( $conn, $sql );
            $res_row = sqlsrv_has_rows($res);
		    if($res_row==false){
                //checking for unique orgID
                $sql = "INSERT INTO organization ([orgID], [orgName], [orgDescription], [orgType]) values('$id', '$name', '$desc', '$type')";
                $res = sqlsrv_query( $conn, $sql );
                if($res ===false){
                    $myresult['msg'] = "Unable to add the organaization to database due to error in sql";
                    echo (json_encode($myresult));
                    exit();
                }else{
                     //registering with joget
                    if(isset($_POST['parentID'])){
                       $myresult['joget'] = joget_Org($id, $name, $desc, $_POST['parentID']);
                    }else{
                       $myresult['joget'] = joget_Org($id, $name, $desc);
                    }
                    $myresult['msg'] = "success";
                    echo (json_encode($myresult));
                    exit();
                }
            }else{
              $myresult['msg'] = "Need unique value for Organization ID";
              $myresult['data'] = "open";
              echo(json_encode($myresult));
            }
          }
    ?>
