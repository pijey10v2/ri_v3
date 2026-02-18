<?php
	session_start();
    require ('../login/include/db_connect.php');

    $pid = $_POST['project_id_number'];
    $sql = "SELECT parent_project_id_number FROM projects where project_id_number = '$pid'";
    $res = sqlsrv_query( $conn, $sql );
        if( $res === false ) {
            $uResult['msg'] = 'SQL Error!'; 
            echo(json_encode($uResult));
            exit();
        }
        else{
            $project = [];
            while ($row = sqlsrv_fetch_Array($res, SQLSRV_FETCH_ASSOC)) {
                $parentID = $row['parent_project_id_number'];
            };
            if($parentID == null){//overall project - get the children
                $sql = "SELECT project_id_number from projects where parent_project_id_number = '$pid'";
                $res = sqlsrv_query( $conn, $sql );
                if( $res === false ) {
                    $uResult['msg'] = 'SQL Error 1!'; 
                    echo(json_encode($uResult));
                    exit();
                }
                else{
                    $i = 0;
                    while ($row = sqlsrv_fetch_Array($res, SQLSRV_FETCH_ASSOC)) {
                        $project[$i] = $row;
                        $i++;
                    };
                    echo json_encode($project);
                    exit();
                }
            }else{//package project.. need to get parent and siblings
            $sql = "SELECT project_id_number from projects where project_id_number = '$parentID' union SELECT project_id_number from projects where parent_project_id_number ='$parentID' AND project_id_number != '$pid'";
            $res = sqlsrv_query( $conn, $sql );
            if( $res === false ) {
                $uResult['msg'] = 'SQL Error 2!'; 
                echo(json_encode($uResult));
                exit();
            }
            else{
                $i = 0;
                while ($row = sqlsrv_fetch_Array($res, SQLSRV_FETCH_ASSOC)) {
                    $project[$i] = $row;
                    $i++;
                };
                echo json_encode($project);
                exit();
            }
        }
    }
?>