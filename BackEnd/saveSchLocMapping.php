<?php
    session_start();
    require '../Login/include/db_connect.php';
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    $data = json_decode($_POST['array']);
   // echo( json_encode($data));
    $myresult =[];
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
            $myresult['msg'] = "No Permission.";
            echo (json_encode($myresult));
            exit();

        }
        $sql = "SELECT * from Project_SchLoc_Mapping where projectID ='$pid'";
        $res = sqlsrv_query( $conn, $sql );
        if( $res === false ) {
            die( print_r( sqlsrv_errors(), true));
            $myresult['msg'] = "SQL Error. Unable to check if previous mapping exists for this project";
            echo (json_encode($myresult));
            exit();
        }
      
        $resultCheck = sqlsrv_has_rows($res);
        if($resultCheck === true){ // delete the current entries to update the new ones
            $sql = "DELETE from Project_SchLoc_Mapping where ProjectID ='$pid'";
            $res = sqlsrv_query( $conn, $sql );
            if( $res === false ) {
                die( print_r( sqlsrv_errors(), true));
                $myresult['msg'] = "SQL Error. Unable to delete old mapping entries";
                echo (json_encode($myresult));
                exit();
            }
        }
        for($i=0; $i<count($data); $i++){
            $schName = $data[$i]->schName;
            $locName = $data[$i]->locName;
            $sql = "INSERT into Project_SchLoc_Mapping([projectID],[scheduleTaskName],[mappedLocName]) values('$pid', '$schName', '$locName')";
            $res = sqlsrv_query( $conn, $sql );
            if( $res === false ) {
                die( print_r( sqlsrv_errors(), true));
                $myresult['msg'] = "SQL Error. Unable to add the mapping entries";
                echo (json_encode($myresult));
                exit();
            }
        }
        $myresult['msg'] = "Mapping entries updated Succesfully";
        echo (json_encode($myresult));
        exit();
    }
?>
