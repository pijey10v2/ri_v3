<?php
  header('Content-Type: application/json');
  header('Access-Control-Methods: POST');
    include_once 'cafm_connect.php';
    $assetID = $_POST['assetID'];
    //echo(json_encode($assetID));
     // Retrieve data from RI_MEP
    // $id_nums = implode(", ",$assetID);
    //echo(json_encode($assetID));
    $sql = "(select * from RI_MEP_ASSETS WHERE AssetID IN ($assetID)) UNION (select * from RI_CIVIL_ASSETS WHERE AssetID IN ($assetID)) ";
     $stmt = sqlsrv_query( $conn, $sql);
     if( $stmt === false ) {
         die( print_r( sqlsrv_errors(), true));
     }

     $i=0;
     $uResult = [];
     $data = [];
     while( $row1 = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
       $data[$i] = $row1;
         $i++;
     };
     echo(json_encode($data));
 
?>