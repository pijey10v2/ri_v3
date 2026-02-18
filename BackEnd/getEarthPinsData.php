<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    $id = $_POST['project_id'];
    if(isset($id)){
      $sql = "SELECT * FROM earthPin WHERE projectID =$id;";
      $res = sqlsrv_query($conn,$sql);
      if($res){
      }else{
        echo "Error occured";
        exit();
      }
      $arr = [];
      while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
        $arr[] = $row;
      }

     // $return_value['videoPins'] = $arr;
     echo(json_encode($arr));
    
    }
?>