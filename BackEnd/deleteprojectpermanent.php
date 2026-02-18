<?php
	 // session_start();	
      header('Access-Control-Allow-Origin: *');
      header('Content-Type: application/json');
      header('Access-Control-Methods: POST');
      header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
      require ('../login/include/db_connect.php');
      require('joget.php'); // session start is in joget.php
   
	 $email = $_SESSION['email'];
	 $projectidnumber = json_decode($_POST['project_id_number']);

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
    if($row == false)
    {
      $msg['message'] ="No Permission";
      echo json_encode($msg);
      exit();
    }
    $sql = "SELECT * FROM projects WHERE";
    if (sizeof($projectidnumber) != 1)
    {
      $id_nums = implode(", ", $projectidnumber);
      $sql =  $sql." project_id_number IN ($id_nums)";
    }else {
      $id_nums =$projectidnumber[0];
      $sql = $sql." project_id_number='$id_nums'";
    }
    $result = sqlsrv_query($conn,$sql);
    $res_row = sqlsrv_has_rows($result);
    if($res_row == false)
    {
      $msg['message'] ="Project does not exist";
      echo json_encode($msg);
            exit();
    } 

    $id_nums = implode(", ", $projectidnumber);
    //fetch the project_ids to delete projects from joget.. need project_id info to delete from joget
    $project_id_list = [];
    $joget_result =[];
    $sql = "SELECT project_id from projects where project_id_number IN($id_nums)";
    $result = sqlsrv_query($conn,$sql);
    if($result==false){
      $error = sqlsrv_errors();
      $msg['message'] = $error['message'] . " " . $error['code'];
      echo json_encode($msg);
      exit();
    }else{
      $i=0;
      while ($row = sqlsrv_fetch_Array($result, SQLSRV_FETCH_ASSOC)) {
        $project_id_list[$i] = $row['project_id'];
        $i++;
      };
      $i=0;
      $operation = "delete";
      foreach($project_id_list as $pid){
        $joget_result[$i]= jogetProjectCleanUpService($operation, $pid);
        $i++;
      }
    };


    //deleting  the user-project rel records
    $sql = "DELETE from pro_usr_rel WHERE Pro_ID IN($id_nums)";
    if(sqlsrv_query($conn,$sql)==false)
      {
        $error = sqlsrv_errors();
        $msg['message'] = $error['message'] . " " . $error['code'];
        echo json_encode($msg);
        exit();
    }

    // deleting the layer info asscociated with the projects
    $sql = "DELETE from Project_Layers WHERE Project_ID IN ($id_nums)";
    if(sqlsrv_query($conn,$sql)==false)
    {
      $error = sqlsrv_errors();
      $msg['message'] = $error['message'] . " " . $error['code'];
      echo json_encode($msg);
      exit();
    }

    //deleting the location data associated with the projects
    $sql = "DELETE from locations WHERE project_id IN($id_nums)";
    if(sqlsrv_query($conn,$sql)==false)
    {
      $error = sqlsrv_errors();
      $msg['message'] = $error['message'] . " " . $error['code'];
      echo json_encode($msg);
      exit();
    }

      //deleting all the vidopins  associated with the projects. the video will be deleted when the project directory is deleted;
    $sql = "DELETE from videoPin WHERE projectID IN ($id_nums)";
    if(sqlsrv_query($conn,$sql)==false)
    {
      $error = sqlsrv_errors();
      $msg['message'] = $error['message'] . " " . $error['code'];
      echo json_encode($msg);
      exit();
    }

    //deleting all the asset data associated with the projects
    $sql = "DELETE from Asset_data WHERE project_id IN ($id_nums)";
    if(sqlsrv_query($conn,$sql)==false)
    {
      $error = sqlsrv_errors();
      $msg['message'] = $error['message'] . " " . $error['code'];
      echo json_encode($msg);
      exit();
    }

    //deleting the PW config details and PowerBi dashboard URL details
    $sql = "DELETE from configPwPBi WHERE projectId IN ($id_nums)";
    if(sqlsrv_query($conn,$sql)==false)
    {
      $error = sqlsrv_errors();
      $msg['message'] = $error['message'] . " " . $error['code'];
      echo json_encode($msg);
      exit();
    }

    //deleting all the schedules associated with the project. the schedule data will be deleted when the project directory is deleted.
    $sql = "DELETE from Project_Schedule WHERE Pro_ID IN($id_nums)";
    if(sqlsrv_query($conn,$sql)==false)
    {
      $error = sqlsrv_errors();
      $msg['message'] = $error['message'] . " " . $error['code'];
      echo json_encode($msg);
      exit();
    }

    //deleting all the app links associated with the project.
    $sql = "DELETE from project_apps_process WHERE project_id IN($id_nums)";
    if(sqlsrv_query($conn,$sql)==false)
    {
      $error = sqlsrv_errors();
      $msg['message'] = $error['message'] . " " . $error['code'];
      echo json_encode($msg);
      exit();
    }
    $sql = "DELETE from projects WHERE  project_id_number IN ($id_nums)";
    
    if(sqlsrv_query($conn,$sql)==false)
    {
      $error = sqlsrv_errors();
      $msg['message'] = $error['message'] . " " . $error['code'];
      echo json_encode($msg);
      exit();
    }

    foreach($projectidnumber as $pid){
      $dir = "../Data/Projects/".$pid;
      if (is_dir($dir)) {
        $objects = scandir($dir);
        // remove the content
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
              if (filetype($dir."/".$object) == "dir"){
                rmdir($dir."/".$object); //remove subfolders
              } 
              else {
                unlink($dir."/".$object); //remove files
              }
            }
        }
        //remove the folder
        if (filetype($dir) == "dir") {
            rmdir($dir); 
          }
          $myresult= array(
            'delete' => "Folder deleted"
          );  
      }
    }
    
    
    $msg['message'] = "Project/projects successfully deleted from database";
    $msg['joget'] = $joget_result;
    echo json_encode($msg);
    exit();
  }
?>
