<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    require '../Login/include/_include.php';
    global $CONN;
    session_start();
    // get IRI data
    $id = $_SESSION['projectID'];
    $sql = "select  mlp_start_chg, mlp_end_chg, mlp_slow_roughness,mlp_fast_roughness,mlp_direction, mlp_data_date from asset_analysis_mlp  WHERE mlp_data_id = (Select max(mlp_data_id) from asset_analysis_mlp where mlp_package_id = '$id') and mlp_package_id = '$id' ORDER by mlp_start_chg"; 
      $res = sqlsrv_query($conn,$sql);
      if($res){
      }else{
        echo "SQL error!";
        exit();
      }
      $arr = [];
      while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
        //kml has Increase and Decrease not Increasing and Decreasing
        $dir = $row['mlp_direction'];
        $dir = substr($dir, 0, -3) . "e";
        if(strpos($row['mlp_start_chg'], ".") == 0){
          $row['mlp_start_chg'] = "0".$row['mlp_start_chg'];
        }
        $r = $row['mlp_start_chg'] /1000;
       
        $chg = "CH ". number_format($r, 3, '.', '');
        //$chg = "CH ".$row['mlp_start_chg'];
       $arr['data'][$dir][$chg]['Slow']['iri'] = $row['mlp_slow_roughness'];
       $arr['data'][$dir][$chg]['Fast']['iri'] = $row['mlp_fast_roughness'];
      }

    $legendRow = $CONN->fetchRow("select * from analysis_legend where al_category = 'iri_analysis'");
    $arr['legend']['good'] = (isset($legendRow['al_good'])) ? $legendRow['al_good'] : '2.5';
    $arr['legend']['fair'] = (isset($legendRow['al_fair'])) ? $legendRow['al_fair'] : '3.5';
    $arr['legend']['poor'] = (isset($legendRow['al_poor'])) ? $legendRow['al_poor'] : '4.5';
    
    echo json_encode($arr);
    
?>
