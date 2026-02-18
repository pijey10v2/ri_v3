<?php
header('Content-Type: application/json');
require_once("../login/include/db_connect.php");
$response = array();

if (!isset($_POST['user_ids'])) {
    $response['error'] = 'No variable input!';
}

if (!isset($response['error'])) {
    $user_IDs = json_decode($_POST['user_ids']);
    
    $user_info =[];
    $j =0;
    foreach($user_IDs as $user_id){
        // query user's projects
        $id = $user_id->id;
        $sql = "SELECT project_name, Pro_Role FROM pro_usr_rel left join projects on pro_usr_rel.Pro_ID = projects.project_id_number
				WHERE pro_usr_rel.Usr_ID = '$id' AND projects.status = 'active' AND  pro_usr_rel.Pro_Role != 'non_Member'";
        $stmt = sqlsrv_query($conn, $sql);

        if ($stmt === false) {
            die(print_r(sqlsrv_errors(), true));
        }
        $project = [];
        $i = 0;
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $project[$i]['project_name'] = $row['project_name'];
            $project[$i]['role'] = $row['Pro_Role'];
            $i++;
        };
        sqlsrv_free_stmt($stmt);
        $user_info[$j]['user_name'] = $user_id->name;
        $user_info[$j]['project_info'] = $project;
        $j++;
    }
   
    $response['user_projects'] = $user_info;
   
}
echo json_encode($response);
