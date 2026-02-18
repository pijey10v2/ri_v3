<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    session_start();
    $schID = $_POST['schID'];
    $id = $_SESSION['project_id'];
     $sql = "SELECT * FROM Project_Schedule WHERE Pro_ID = '$id' AND Sch_ID = '$schID'"; 
      $res = sqlsrv_query($conn,$sql);
      if($res){
      }else{
        echo "SQL error!";
        exit();
      }
      $arr = [];
      $rvArr = [];
      while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
        $arr = $row;
      }
      if($arr['Revision'] == true){
        $name = $arr['Name'];
        $sql = "SELECT * FROM Project_Schedule WHERE Pro_ID = '$id' AND Name = '$name' ORDER BY Sch_Ver ASC"; 
        $res = sqlsrv_query($conn,$sql);
        if(!$res){
          echo "SQL error!";
          exit();
        }
        while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
          $rvArr[] = $row;
        }
      }
      $return_value['data'] = $arr;
      $return_value['revision'] = $rvArr;
      $return_json = json_encode($return_value);
      echo $return_json;
?>
