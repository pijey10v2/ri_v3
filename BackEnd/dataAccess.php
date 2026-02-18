<?php
	session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
	require ('../login/include/db_connect.php');
		
	if( !isset($_SESSION['project_id']) && !isset($_SESSION['email'])){ $uResult['error'] = 'Invalid credentials!'; }
	
	$email = $_SESSION['email'];
	$pro_id = $_SESSION['project_id'];
    $uResult = array();
	$data_access= $_POST['access'];
	$data_id = $_POST['data_id'];

        $params = array();
        $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
        $stmt = sqlsrv_query($conn, "SELECT * FROM Data_Pool WHERE Data_Owner_PID = '$pro_id' AND Data_ID ='$data_id'",$params,$options);
        if( $stmt === false ) {
             die( print_r( sqlsrv_errors(), true));
             exit();
        }
		$row = sqlsrv_has_rows($stmt);
        if($row == false)
        {
         $myresult= array(
			'data' => "No Permission"
			);
			echo (json_encode($myresult));
            exit();
		}
		
		$sql = "UPDATE Data_Pool SET Share ='$data_access' WHERE Data_ID ='$data_id';";
		
		$result = sqlsrv_query($conn,$sql);
		if($result === false){
			$myresult= array(
			'data' => "Unable to update the project"
			);
			echo (json_encode($myresult));
			exit();
		}
		else {
			$myresult= array(
			'data' => "Update successful"
			);
			echo (json_encode($myresult));
			exit();
		}
?>