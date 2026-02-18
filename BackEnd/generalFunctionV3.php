<?php
    session_start();
    include_once '../login/include/_include.php';

    $response = array();
    $functionName = filter_input(INPUT_POST, 'functionName', FILTER_SANITIZE_STRING);

    if (!$functionName) {
        $response['bool'] = false;
        $response['msg'] = "Invalid function";
        echo json_encode($response);
        exit();
    }

    switch ($functionName) {
        case 'saveRangeSetting';
            saveRangeSetting();
        break;
    };

    function saveRangeSetting(){
        global $response;
        global $CONN;
    
        $projectOwner = $_SESSION['project_owner_dashboard'];
        $red = filter_input(INPUT_POST, 'red', FILTER_SANITIZE_STRING);
        $yellow = filter_input(INPUT_POST, 'yellow', FILTER_SANITIZE_STRING);
        $green = filter_input(INPUT_POST, 'green', FILTER_SANITIZE_STRING);
    
        $checkOwner = "SELECT project_owner FROM range_setting WHERE project_owner=:0";
    
        $ownerExist = $CONN->fetchRow($checkOwner, array($projectOwner)); 
    
        if (empty($ownerExist)) {
            $stmnt = "INSERT INTO range_setting (project_owner, red, yellow, green) VALUES (:0, :1, :2, :3);";
            $runSQL = $CONN->execute($stmnt, array($projectOwner, $red, $yellow, $green));  
        }else{
            $stmnt = "UPDATE range_setting SET red =:0, yellow =:1, green =:2 WHERE project_owner = :3;";
            $runSQL = $CONN->execute($stmnt, array($red, $yellow, $green, $projectOwner));  
        }        
    
        if (!$runSQL) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error!";
            return;
        }else{
            $response['bool'] = true;
            $response['msg'] = "success";
            return;
        }
    
    }