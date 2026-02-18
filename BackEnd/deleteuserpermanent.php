<?php
//session_start();	
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
  require ('../login/include/db_connect.php');
  require ('joget.php'); //session starting in joget.php
   
  $email = $_SESSION['email'];
  $user_id = json_decode($_POST['user_id']);
  $msg = array();

  if(isset($email)){
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
      $sql =  $sql." user_id IN ($id_nums) AND user_email != '$email'";
    }else {
			$id_nums =$user_id[0];
      $sql = $sql." user_id ='$id_nums' AND user_email != '$email'";
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
        'status' => 'remove'
      ]);
    };
    //update joget users first and then our database
    $updatedUsers =[];
    $unUpdatedUsers =[];
    $result = jogetUserInactivateActivateDelete($userList); 
    $myresp = json_decode($result);
    if($myresp == ""){ //user/users were not deleted in joget .. so exit
      $response['msg'] = "Unable to delete the user/users in the joget system. please check the joget connection.";
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
   
		
      $sql = "DELETE from users OUTPUT deleted.user_id WHERE  user_email IN ('$id_emails')"; // check if current user is not included in this list is done when checking for valid users above
      $result = sqlsrv_query($conn,$sql);
      if($result == false){
        //$error = sqlsrv_errors();
        $msg['message'] = "User/users removed from joget system. But unable to delete from the database due to SQL error!";
        echo json_encode($msg);
        exit();
      }
      
      while ($row = sqlsrv_fetch_Array($result, SQLSRV_FETCH_ASSOC)){
        array_push($updatedUsers, $row['user_id']);
      }
      $id_nums = implode(",",$updatedUsers);
      $sql = "DELETE from pro_usr_rel WHERE Usr_ID IN($id_nums)"; // check if current user is not included in this list is done when checking for valid users above
      if(sqlsrv_query($conn,$sql)==false){
        //$error = sqlsrv_errors();
        $msg['message'] = "User/users removed from joget system. But unable to delete from the database due to SQL error!";
        echo json_encode($msg);
        exit();
      }
    }
    if(!empty($unUpdatedUsers)){
      $mystring = implode(',',$unUpdatedUsers).": Unable to delete this/these User/Users as they are part of the approval workflow";
      $msg['message'] = $mystring;
      $msg['jogetMsg'] = $myresp;
      echo json_encode($msg);
      exit();
    }
   
    $msg['message'] = "User/users successfully deleted from the system";
    $msg['jogetMsg'] = $myresp;
    $msg['sql'] = $sql;
    echo json_encode($msg);
    exit();
  }
?>

