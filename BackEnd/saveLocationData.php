<?php
        session_start();
        require '../Login/include/db_connect.php';
          $user = $_SESSION['email'];
          $pid = $_SESSION['project_id'];

        
            $lName = $_POST['lName'];
            $rName = $_POST['rName'];
            $lng = $_POST['lng'];
            $lat = $_POST['lat'];
          
        
        

          if(isset($user))
           {
              $params = array();
              $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
              $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_Role IN ('Project Manager', 'Project Monitor') AND pro_usr_rel.Pro_ID = '$pid'",$params,$options);
              if( $stmt === false ) {
                   die( print_r( sqlsrv_errors(), true));
                   exit();
              }

              $row = sqlsrv_has_rows($stmt);
              if($row == false)
              {
            			$myresult= array(
            				'msg' => "No Permission."
        			       );
            			echo (json_encode($myresult));
            			exit();

              }
            $sql = "INSERT INTO locations ( [project_id],[locationName], [longitude], [latitude], [region], [status]) VALUES ('$pid','$lName','$lng','$lat','$rName','0%');";
            $res = sqlsrv_query( $conn, $sql );
            if( $res === false ) {
                if( ($errors = sqlsrv_errors() ) != null) {
                    foreach( $errors as $error ) {
                        echo "SQLSTATE: ".$error[ 'SQLSTATE']."<br />";
                        echo "code: ".$error[ 'code']."<br />";
                        echo "message: ".$error[ 'message']."<br />";
                    }
                }
            }
            else{
                $sql = "SELECT * FROM locations WHERE locationName = '$lName' AND project_id ='$pid';";
                $res = sqlsrv_query( $conn, $sql );
                $location =[];
                if($res){
                    while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
                        $location =$row;
                      }
                }
              $result = [];
              $result['msg'] = "Sucessfully Added";
              $result['data'] = $location;
              
              echo(json_encode($result));
            }
          }
    ?>
