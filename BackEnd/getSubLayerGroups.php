<?php
   session_start();
   header('Access-Control-Allow-Origin: *');
   header('Content-Type: application/json');
   header('Access-Control-Methods: POST');
   header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
   require ('../login/include/db_connect.php');
   $arr = [];
   $projectID = $_SESSION['project_id'];
   $groupID = $_POST['groupID'];
   $sql = "SELECT DISTINCT subGroupID, subGroupName FROM Project_Layers WHERE Project_ID = '$projectID' AND layerGroup = '$groupID'";
   $stmt = sqlsrv_query( $conn, $sql);
					
   while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
    $arr[] = $row;
  }
  sqlsrv_free_stmt( $stmt);
  echo(json_encode($arr));
  
 ?>