<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    session_start();

    $response = array();

    if (!isset($_POST['functionName'])) {
        echo json_encode($response['msg'] = 'No function called');
        exit();
    }

    if (!isset($_SESSION['email'])) {
        echo json_encode($response['msg'] = 'No credentials');
        exit();
    }


        $pid = $_SESSION['project_id'];
        $user = $_SESSION['email'];


        switch ($_POST['functionName']) {
          case "getSpecificConfig":
      
            $sql = "SELECT DISTINCT userName, userNamePassword, url FROM configPwPBi WHERE projectID = '$pid' AND type = 'PBI'";
            $res = sqlsrv_query($conn, $sql);
            if (!$res) {
                echo "SQL error!";
                exit();
            }
            while ($row = sqlsrv_fetch_array($res, SQLSRV_FETCH_ASSOC)) {
              $response['data'] = $row;
            }
            
            $_SESSION['pbi_userName'] = $response['data']['userName'];
            $_SESSION['pbi_userPass'] = $response['data']['userNamePassword'];
            $return_json = json_encode($response['data']['url']);
            echo $return_json;
          break;

          case "getConfigDetails":  
            $params = array();
            $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
            $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_ID = $pid AND pro_usr_rel.Pro_Role IN ('Project Manager', 'Project Monitor') ", $params, $options);
            if ($stmt === false) {
                die(print_r(sqlsrv_errors(), true));
                exit();
            }
            $row = sqlsrv_has_rows($stmt);
            if ($row == false) {
                $uResult['msg'] =  "No Permission.";
                echo(json_encode($uResult));
                exit();
            }
            $sql = "SELECT configID, projectID,type, userName, url FROM configPwPBi WHERE projectID = '$pid'";
            $res = sqlsrv_query($conn, $sql);
            if ($res) {
            } else {
                echo "SQL error!";
                exit();
            }
            $arr = [];
            while ($row = sqlsrv_fetch_array($res, SQLSRV_FETCH_ASSOC)) {
                $arr[] = $row;
            }
            $response['data'] = $arr;
            $return_json = json_encode($response);
            echo $return_json;
          break;
      
    }
