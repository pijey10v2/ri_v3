<?php
//session_start();
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
  require ('../login/include/db_connect.php');
  require ('joget.php'); //session already started in joget.php

	$email = $_SESSION['email'];
	$user_id = json_decode($_POST['user_id']);

	$msg = array();
	if(isset($_SESSION['email'])){
    $params = array();
    $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
    $stmt = sqlsrv_query($conn, "SELECT * FROM users WHERE user_email='$email' AND user_type='system_admin'",$params,$options);
    if( $stmt === false ) {
      die( print_r( sqlsrv_errors(), true));
      exit();
    }
    $row = sqlsrv_has_rows($stmt);
    if($row == false){
      $msg['message'] ="No Permission";
      echo json_encode($msg);
        exit();
    }
    $sql = "SELECT * FROM users WHERE";
    if (sizeof($user_id) != 1){
      $id_nums = implode(", ", $user_id);
      $sql =  $sql." user_id IN ($id_nums)";
    }else {
      $id_nums =$user_id[0];
      $sql = $sql." user_id='$id_nums'";
    }
    $result = sqlsrv_query($conn,$sql);
    $res_row = sqlsrv_has_rows($result);
    if($res_row == false){
      $msg['message'] ="User does not exist";
      echo json_encode($msg);
          exit();
    }
    $userList =[];
    $jogetUserUpdateList =[];
    while ($row = sqlsrv_fetch_Array($result, SQLSRV_FETCH_ASSOC)) 
    {
      array_push($userList, (object)[
        'userName' => $row['user_email'],
        'status' => 'active'
      ]);
    };
    //update joget users first before updating the database
    $unUpdatedUsers =[];
    $result = jogetUserInactivateActivateDelete($userList); 
    $myresp = json_decode($result);
    if($myresp == ""){ //user/users were not activated .. so exit
      $response['msg'] = "Unable to recover the user/users in the joget system. please check the joget connection.";
      $response['data'] = "close";
      echo (json_encode($response));
      exit();
    }else{
     
      $users=$myresp->users;
      foreach($users as $user){
        if($user->userStatus == true){
          array_push($jogetUserUpdateList, $user->userName);
        }else{
          array_push($unUpdatedUsers, $user->userName);
        }
      }
    }

    if(!empty($jogetUserUpdateList)){
      $id_emails = implode("','", $jogetUserUpdateList);
      $sql = "UPDATE users SET user_type='user', updated_by ='$email', last_update = GETDATE() WHERE  user_email IN ('$id_emails')";
    
      if(sqlsrv_query($conn,$sql)==false){
        $msg['message'] = "Unable to update the users in database due to SQL error. Users recovered in Joget system.";
        echo json_encode($msg);
        exit();
      }
    }
   
    if(!empty($unUpdatedUsers)){
      $mystring = implode(',',$unUpdatedUsers).": Unable to activate this/these User/Users in joget system";
      $msg['message'] = $mystring;
      $msg['jogetMsg'] = $myresp;
      echo json_encode($msg);
      exit();
    }
    $msg['message'] = "User/Users successfully recovered";
    $msg['jogetMsg'] = $myresp;
    echo json_encode($msg);
    exit();
	}
?>
