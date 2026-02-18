<?php
	session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
	require ('../login/include/db_connect.php');

    $uResult = array();
	$function_name = isset($_POST['function_name']) ? $_POST['function_name'] : NULL;
	
	if($function_name == 'multipleLayerUpdate'){
		$uResult = multipleLayerElevationUpdate();
	}else{
		$uResult = layerElevationUpdate();
	}

	if(!isset($_SESSION['email'])){ $uResult['error'] = 'Invalid credentials!'; }

	echo (json_encode($uResult));
	exit();

	function layerElevationUpdate()
	{
		$offset = $_POST['offset'];
		$xOffset = $_POST['xOffset'];
		$yOffset = $_POST['yOffset'];
		$data_id = $_POST['data_id'];

		return saveElevation($offset, $xOffset, $yOffset, $data_id);
	}

	function multipleLayerElevationUpdate()
	{
		global $conn;

		$offset = $_POST['offset'];
		$xOffset = $_POST['xOffset'];
		$yOffset = $_POST['yOffset'];
		$multiple_layers = $_POST['multiple_layers'];
		$pro_id = $_SESSION['project_id'];

		foreach($multiple_layers as $key=>$layer_id)
		{
			// calculate adjustments
			$sql = "SELECT Offset, X_Offset, Y_Offset  FROM Data_Pool WHERE Data_Owner_PID = '$pro_id' AND Data_ID ='$layer_id'";
			$stmt = sqlsrv_query($conn, $sql);
			if ($stmt === false) {
				die(print_r(sqlsrv_errors(), true));
			}
			$row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC);
			
			$newHeight = $row['Offset'] + $offset;
			$newxOffset = $row['X_Offset'] + $xOffset;
			$newyOffset = $row['Y_Offset'] + $yOffset;

			$res = saveElevation($newHeight, $newxOffset, $newyOffset, $layer_id);
			if(!$res['result']){
				return $res;
			}
		}

		return  array(
			'data' => "Update successful",
		);
	}

	function saveElevation($offset, $xOffset, $yOffset, $data_id)
	{
		global $conn;

		$pro_id = $_SESSION['project_id'];

        $params = array();
        $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
        $stmt = sqlsrv_query($conn, "SELECT * FROM Data_Pool WHERE Data_Owner_PID = '$pro_id' AND  Data_ID ='$data_id'",$params,$options);

        if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));
            exit();
		}
		$row = sqlsrv_has_rows($stmt);
        if($row == false)
        {
         	$myresult= array(
					'data' => "No Permission",
					'result' => false
				);
			return $myresult;
		}
		
		$sql = "UPDATE Data_Pool SET Offset = ROUND('$offset', 3), X_Offset = ROUND('$xOffset', 3), Y_Offset = ROUND('$yOffset', 3) WHERE Data_ID ='$data_id'";
		$result = sqlsrv_query($conn,$sql);

		if($result === false){
			$myresult= array(
				'data' => "Unable to update the data's offset",
				'result' => false
			);
		}
		else {
			$myresult= array(
				'data' => "Update successful",
				'result' => true
			);
		}
		return $myresult;

	}

?>