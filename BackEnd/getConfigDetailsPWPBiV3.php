<?php
    header('Content-Type: application/json');
    include_once '../login/include/_include.php';
    require '../Login/include/db_connect.php';
    session_start();
    global $CONN;

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
            global $CONN;
            //$sql = "SELECT DISTINCT userName, userNamePassword, url FROM configPwPBi WHERE projectID = '$pid' AND type = 'PBI'";
            $res = $CONN->fetchRow("SELECT DISTINCT userName, userNamePassword, url FROM configPwPBi WHERE projectID = :0 AND type = 'PBI'", array($pid));
            if (!$res) {
                $res = null;
                echo json_encode($res);
                exit();
            } else {
                $_SESSION['pbi_userName'] = $res['userName'];
                $_SESSION['pbi_userPass'] = $res['userNamePassword'];
                $return_json = json_encode($res['url']);
                echo $return_json;      
            }

            
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
