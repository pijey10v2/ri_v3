<?php
session_start();
require("../login/include/db_connect.php");

$pid = $_SESSION['project_id'];

$sql = "SELECT pw_project_id FROM projects WHERE project_id_number = '$pid'";
$stmt = sqlsrv_query($conn, $sql);
if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}

while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
    $pwid = $row['pw_project_id'] ;
}


$data['pwid'] = $pwid;
echo json_encode($data);
