<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    session_start();
    // get list of schedules uploaded for this project
    $id = $_SESSION['project_id'];
     $sql = "SELECT Sch_ID, Sch_Date, Name, Sch_Ver, URL FROM Project_Schedule WHERE Pro_ID = '$id' ORDER by Sch_Ver Desc"; 
      $res = sqlsrv_query($conn,$sql);
      if($res){
      }else{
        echo "SQL error!";
        exit();
      }
      $arr = [];
      while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
        $arr[] = $row;
      }
      $return_value['data'] = $arr;

      // get schedule mappings for this project
      $sql = "SELECT scheduleTaskName as schName, mappedLocName as locName FROM Project_SchLoc_Mapping WHERE projectID = '$id'"; 
      $res = sqlsrv_query($conn,$sql);
      if($res){
      }else{
        echo "SQL error!";
        exit();
      }
      $myarr = [];
      while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
        $myarr[] = $row;
      }
      $return_value['mapping'] = $myarr;

      $return_json = json_encode($return_value);
      echo $return_json;
?>
