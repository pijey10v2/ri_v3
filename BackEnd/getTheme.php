<?php
require_once("../login/include/db_connect.php");
session_start();
    $uResult = array();
    if( !isset($_SESSION['email']) ) {
		$uResult['error'] = 'No variable input!'; 
		}
	
    if( !isset($uResult['error']) ) {
		$usr_email = $_SESSION['email'];
		$sql = "SELECT theme_preference FROM users WHERE user_email = '$usr_email'";
		$stmt = sqlsrv_query( $conn, $sql);
		
		if( $stmt === false) {
			die( print_r( sqlsrv_errors(), true) );
			}
						
		while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
			$uResult['theme'] = $row['theme_preference'];	
		}
	
    }
    echo json_encode($uResult);
?>