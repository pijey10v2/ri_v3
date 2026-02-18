<?php
    session_start();
    require ('../login/include/db_connect.php');
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

	$user = $_SESSION['email'];
	$pid = $_SESSION['project_id'];
	
    $uResult = array();
    if(!isset($_POST['URL']))
     {
        $uResult['error'] = 'No variable input!'; 
        echo(json_encode($uResult));
        exit();
    }
   
   $url = $_POST['URL'];
   if(isset($user)){
	    $params = array();
        $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
        $stmt = sqlsrv_query($conn, "SELECT * FROM pro_usr_rel WHERE Pro_ID='$pid' AND Pro_Role IN ('Project Manager', 'Project Monitor') AND Usr_ID IN (SELECT user_id from users where user_email ='$user')",$params,$options);
        if( $stmt === false ) {
             die( print_r( sqlsrv_errors(), true));
             exit();
        }
		
		$row = sqlsrv_has_rows($stmt);
        if($row == false)
        {
			$myresult['msg']= "No Permission to change the Config Details.";
			$myresult['data'] = "close";
			echo (json_encode($myresult));
			exit();
        }
		
		$sql = "UPDATE projects SET  pw_project_id = '$url' WHERE project_id_number = '$pid'";
		$res = sqlsrv_query( $conn, $sql );
		if( $res === false ) {
			$uResult['error'] = 'SQL Error!'; 
			echo(json_encode($uResult));
			exit();
		}
		else{
			$uResult['msg'] = 'Successfully Updated!'; 
			echo(json_encode($uResult));
			exit();
		}
	}else{
		$uResult['error'] = 'SQL Error!'; 
		echo(json_encode($uResult));
		exit();  
	}
?>