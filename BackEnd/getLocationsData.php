<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    $id = $_POST['project_id'];
    if(isset($id)){
      $sql = "SELECT * FROM locations WHERE project_id =$id;";
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

      $return_value['locations'] = $arr;
      /*$file = [];
      foreach($arr as $value){
          $locationid = $value['locationID'];
          $sql = "SELECT * FROM fileData WHERE locationID =$locationid;";
          $res = sqlsrv_query($conn,$sql);
          if($res){
          }else{
            echo "Error occured";
            exit();
          }
          
          while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
             $file[] = $row;
         }

      }
      $return_value['filedata'] = $file;*/
      $return_json = json_encode($return_value);
      echo $return_json;
    }
?>