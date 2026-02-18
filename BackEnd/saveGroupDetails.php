<?php
        session_start();
        require '../Login/include/db_connect.php';
        require 'joget.php';
         $user = $_SESSION['email'];
         $id = $_POST['id'];
         $name = $_POST['name'];
         $desc = $_POST['desc'];
         $orgid = $_POST['orgID'];
        
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
            $sql = "SELECT * FROM orgGroups WHERE groupID = '$id'";
            $res = sqlsrv_query( $conn, $sql );
            $res_row = sqlsrv_has_rows($res);
		    if($res_row==false){
                //checking for unique orgID
                $sql = "insert into orgGroups([groupID], [groupName], [groupDescription], [organizationID]) values('$id', '$name', '$desc', '$orgid')";
               
                $res = sqlsrv_query( $conn, $sql );
                if($res ===false){
                    $myresult['msg'] = "Unable to add the group to database due to error in sql";
                    echo (json_encode($myresult));
                    exit();
                }else{
                 
                    $myresult['msg'] = "success";
                    echo (json_encode($myresult));
                    joget_Group($id, $name, $desc, $orgid);
                    exit();
                }
            }else{
              $myresult['msg'] = "Need unique value for group ID";
              $myresult['data'] = "open";
              echo(json_encode($myresult));
            }
          }
    ?>
