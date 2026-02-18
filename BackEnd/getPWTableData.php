<?php
    include_once '../Demo/cafm_connect.php';
   
    // Retrieve data from RI_MEP
    $sql = "(select * from RI_MEP ) UNION (select * from RI_CIVIL)  ORDER BY Floor";
    $stmt = sqlsrv_query( $conn, $sql);
    if( $stmt === false ) {
        die( print_r( sqlsrv_errors(), true));
    }

    //#####################################
    //assign data from sql retrieved to $data
    $i=0;
    $uResult = [];
    $data = [];
    while( $row1 = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
      $data[$i] = $row1;
        $i++;
    };

     // Retrieve data from RI_MEP
     $sql = "(select * from RI_MEP WHERE Floor ='1' ) UNION (select * from RI_CIVIL WHERE Floor ='1')";
     $stmt = sqlsrv_query( $conn, $sql);
     if( $stmt === false ) {
         die( print_r( sqlsrv_errors(), true));
     }
 
     //#####################################
     //assign data from sql retrieved to $data
     $i=0;
     $data1 = [];
     while( $row1 = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
       $data1[$i] = $row1;
         $i++;
     };
 
     $sql = "(select * from RI_MEP WHERE Floor ='2' ) UNION (select * from RI_CIVIL WHERE Floor ='2')";
     $stmt = sqlsrv_query( $conn, $sql);
     if( $stmt === false ) {
         die( print_r( sqlsrv_errors(), true));
     }
 
     //#####################################
     //assign data from sql retrieved to $data
     $i=0;
     $data2 = [];
     while( $row1 = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
       $data2[$i] = $row1;
         $i++;
     };
 
     $uResult['page1'] = $data;
     $uResult['page2'] = $data1;
     $uResult['page3'] = $data2;
   
    echo json_encode($uResult);

?>