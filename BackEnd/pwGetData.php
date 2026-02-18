<?php
    include_once '../Demo/cafm_connect.php';
    $result = [];
    // Retrieve data from RI_MEP
    $sql = "SELECT * FROM RI_MEP";
    $stmt = sqlsrv_query( $conn, $sql);
    if( $stmt === false ) {
        die( print_r( sqlsrv_errors(), true));
    }

    //#####################################
    //assign data from sql retrieved to $data
    $i=0;
    while( $row1 = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
        $data1[$i]['NR'] = $row1['NR'];
        $data1[$i]['NAME'] = $row1['NAME'];
        $data1[$i]['Floor'] = $row1['Floor'];
        $data1[$i]['LAYOUTCODE'] = $row1['LAYOUTCODE'];
        $data1[$i]['InventoryID'] = $row1['InventoryID'];
        $data1[$i]['AssetName'] = $row1['AssetName'];
        $data1[$i]['QNTY'] = $row1['QNTY'];

        $i++;
    };

    //to count qty for MEP floor1  
    $i=0;
    $mepFloor1=0;
    $mepFloor2 =0;
    $mepELC_F1=0;
    $mepPLB_F1=0;
    $mepELC_F2=0;
    $mepPLB_F2=0;
   
    while(isset($data1[$i]['Floor']))
    {
        if ($data1[$i]['Floor']=='1')
            $mepFloor1++;
        if ($data1[$i]['Floor']=='2')
            $mepFloor2++;
        if((preg_match('#ELC#',$data1[$i]['InventoryID']) && ($data1[$i]['Floor'] == 1)))
            $mepELC_F1++;
        if((preg_match('#PLB#',$data1[$i]['InventoryID']) && ($data1[$i]['Floor'] == 1)))
            $mepPLB_F1++; 
        if((preg_match('#ELC#',$data1[$i]['InventoryID']) && ($data1[$i]['Floor'] == 2)))
            $mepELC_F2++;
        if((preg_match('#PLB#',$data1[$i]['InventoryID']) && ($data1[$i]['Floor'] == 2)))
            $mepPLB_F2++; 

        $i++;
    }

    //#####################################
    // Retrieve data from RI_CIVIL
    $sql = "SELECT * FROM RI_CIVIL";
    $stmt = sqlsrv_query( $conn, $sql);
    if( $stmt === false ) {
        die( print_r( sqlsrv_errors(), true));
    }

    //assign data from sql retrieved to $data
    $i=0;
    while( $row2 = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
        $data2[$i]['NR'] = $row2['NR'];
        $data2[$i]['NAME'] = $row2['NAME'];
        $data2[$i]['Floor'] = $row2['Floor'];
        $data2[$i]['LAYOUTCODE'] = $row2['LAYOUTCODE'];
        $data2[$i]['InventoryID'] = $row2['InventoryID'];
        $data2[$i]['AssetName'] = $row2['AssetName'];
        $data2[$i]['QNTY'] = $row2['QNTY'];
        $i++;
    };

    //to count qty for MEP floor1  
    $i=0;
    $civilFloor1=0;
    $civilFloor2 =0;
    $civilDR_F1 = 0;
    $civilDR_F2 = 0;
    while(isset($data2[$i]['Floor']))
    {
        if ($data2[$i]['Floor']=='1')
            $civilFloor1++;
        if ($data2[$i]['Floor']=='2')
            $civilFloor2++;
        if((preg_match('#DR#',$data2[$i]['InventoryID']) && ($data2[$i]['Floor'] == 1)))
            $civilDR_F1++; 
        if((preg_match('#DR#',$data2[$i]['InventoryID']) && ($data2[$i]['Floor'] == 2)))
            $civilDR_F2++;

        $i++;
    }

    $result['mepF1'] = $mepFloor1;
    $result['mepF2'] = $mepFloor2;
    $result['mepELC_F1'] = $mepELC_F1;
    $result['mepPLB_F1'] = $mepPLB_F1;
    $result['mepELC_F2'] = $mepELC_F2;
    $result['mepPLB_F2'] = $mepPLB_F2;
    $result['civilDR_F1'] =$civilDR_F1;
    $result['civilDR_F2'] =$civilDR_F2;
    $result['civilFloor1'] =$civilFloor1;
    $result['civilFloor2'] =$civilFloor2;
    echo json_encode($result);

?>