<?php
header('Content-Type: application/json');
require_once("../login/include/db_connect.php");
session_start();
    $uResult = array();
	$eachRow = array();
	$tableD = array();
	$data_id = $_POST['data_id'];
	$counter = 0;
	if( !isset($_SESSION['email'])) { $uResult['error'] = 'No email found!';}

    if( !isset($uResult['error']) ) {
		$sql = "SELECT * FROM Data_Pool
				WHERE Data_ID ='$data_id'";

		$stmt = sqlsrv_query( $conn, $sql);
		
		if( $stmt === false) {
			die( print_r( sqlsrv_errors(), true) );
			}
						
		while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
			$uResult['Data_Owner'] = $row['Data_Owner'];
			$uResult['Data_Name'] = $row['Data_Name'];
			$uResult['Data_Type'] = $row['Data_Type'];
			$uResult['Added_Date'] = $row['Added_Date'];
		}
		sqlsrv_free_stmt( $stmt);

		$sql1 = "SELECT PL.Layer_Name,p.project_name,p.project_id,PL.Attached_By FROM Project_Layers PL
		LEFT JOIN projects p ON PL.Project_ID = p.project_id_number 
		WHERE PL.Data_ID ='$data_id'";

		$stmt1 = sqlsrv_query( $conn, $sql1);
		
		if( $stmt === false) {
			die( print_r( sqlsrv_errors(), true) );
			}
						
		while( $row = sqlsrv_fetch_array( $stmt1, SQLSRV_FETCH_ASSOC) ) {
			$tableD['Layer_Name'] = $row['Layer_Name'];
			$tableD['Project_Name'] = $row['project_name'];
			$tableD['Project_ID'] = $row['project_id'];
			$tableD['Attached_By'] = $row['Attached_By'];
			$eachRow[$counter] = $tableD;
			$counter++;
		}
		$uResult['table'] = json_encode($eachRow);
		echo json_encode($uResult);
	}

?>