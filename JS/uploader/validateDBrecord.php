<?php
        require '../../login/include/db_connect.php';
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json');
        header('Access-Control-Methods: POST');
        header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
          //POST REQUEST FOLLOW THE VARIABLES BELOW:
         session_start();
          $layerName =  json_decode($_POST['LayerArray']);
		  $dataType = $_POST['dataType'];
		  $ionURL = $_POST['ionURL'];
		  $LayerExist = array();
		  $layerResult = array();
          if(isset($_SESSION['email']) && isset($_SESSION['project_id']))
			{
				$pro_id = $_SESSION['project_id'];
				$user = $_SESSION['email'];
				$params = array();
				$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
				$stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE pro_usr_rel.Pro_ID='$pro_id' AND users.user_email='$user' AND pro_usr_rel.Pro_Role IN ('Project Manager', 'Project Monitor') ",$params,$options);
				if( $stmt === false ) {
					die( print_r( sqlsrv_errors(), true));
					exit();
				}
				$row = sqlsrv_has_rows($stmt);
				if($row == false)
				{
				// 	$myresult= array(
				// 		'msg' => "No Permission."
				//    );
				// 	echo (json_encode($myresult));
				// 	exit();
				}
				foreach($layerName as $layer){
					$sql = sqlsrv_query($conn, "SELECT Data_Name FROM Data_Pool WHERE Data_Name = '$layer'",$params,$options);
					$row2 = sqlsrv_has_rows($sql);
					if ($row2 == true) {
						$layerResult['result'] = true;
						array_push($LayerExist,$layer);
					} 
				}
				if($dataType == "ION"){
					$sql = sqlsrv_query($conn, "SELECT * FROM Data_Pool WHERE Data_URL = '$ionURL'",$params,$options);
					$row2 = sqlsrv_has_rows($sql);
					if ($row2 == true) {
						$layerResult['IonURL'] = true;
					} 
				}
				$layerResult['LayerArr'] = $LayerExist; 
				echo json_encode($layerResult);
          }
    ?>
