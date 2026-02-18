<?php
    if (session_status() == PHP_SESSION_NONE) session_start();
    require ('../login/include/db_connect.php');
    global $SYSTEM;

    if($SYSTEM == 'OBYU'){
        $sql = "SELECT orgID, orgName, orgType from organization ORDER BY orgName ASC";
    }else{
        $sql = "SELECT orgID, orgName from organization ORDER BY orgName ASC";
    }
    
    $stmt = sqlsrv_query( $conn, $sql);
    if( $stmt === false ) {
        die( print_r( sqlsrv_errors(), true));
    }
    $i=0;
	$data = array();
    while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) 
    {
      $data[$i] = $row;
	  $i++;
    };
	echo json_encode($data);
?>