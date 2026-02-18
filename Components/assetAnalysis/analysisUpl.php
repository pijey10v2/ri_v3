<?php
if (session_status() == PHP_SESSION_NONE) session_start();
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

function showTable($columnArr, $data, $title){
    $class = ($title == '') ? 'dataStoringOne' : 'dataStoringTwo';
    $html = '<div class="columnM"><h4>'.$title.'</h4>';
    $html .= '<div class="tableContainer '.$class.' scrollbar-inner"><table><tr>';
    foreach ($columnArr as $th => $tr) {
        $html .= '<th>'.$th.'</th>';
    }
    $html .= '</tr>';
    foreach ($data as $value) {
        $html .= '<tr>';
        foreach ($columnArr as $th2 => $td) {
            $html .= '<td>'.$value[$td].'</td>';
        }
        $html .= '</tr>';
    }
    $html .='</table></div></div>';
    echo $html;
}

function uploadFWD($xlsx, $dataDate, $direction, $lane){
    global $CONN;
    $currDateId = date("Ymd");
    $packageId = $_SESSION['projectID'];
    // read the file
    $delOk = $CONN->execute("delete from asset_analysis_fwd where fwd_data_date =:0 and fwd_direction=:1 and fwd_lane=:2 and fwd_package_id=:3", array($dataDate, $direction, $lane, $packageId));
    foreach ( $xlsx->rows() as $r => $row ) {
        if ( $r === 0 || $r === 1 ) {
            // ignore 2 header
            continue;
        }
        $updVal = array(
            "fwd_chainage" => $row[0],
            "fwd_stress" => ($row[1]) ? $row[1] : 0,
            "fwd_load" => ($row[2]) ? $row[2] : 0,
            "fwd_d1" => ($row[3]) ? $row[3] : 0,
            "fwd_d2" => ($row[4]) ? $row[4] : 0,
            "fwd_d3" => ($row[5]) ? $row[5] : 0,
            "fwd_d4" => ($row[6]) ? $row[6] : 0,
            "fwd_d5" => ($row[7]) ? $row[7] : 0,
            "fwd_d6" => ($row[8]) ? $row[8] : 0,
            "fwd_d7" => ($row[9]) ? $row[9] : 0,
            "fwd_asphalt_temp" => ($row[11]) ? $row[11] : 0,
            "fwd_surface_temp" => ($row[12]) ? $row[12] : 0,
            "fwd_air_temp" => ($row[13]) ? $row[13] : 0,
            'fwd_data_date' => $dataDate,
            'fwd_direction' => $direction,
            'fwd_lane' => $lane,
            'fwd_package_id' => $packageId
        );    

        $updVal['fwd_addedBy'] = $_SESSION["email"]; 
        $updVal['fwd_addedDate'] = date(DATE_ATOM,time()); 
        $updVal['fwd_data_id'] = $currDateId;  
 
        $insSql = "insert into asset_analysis_fwd (fwd_data_date, fwd_direction, fwd_lane, fwd_addedBy, fwd_addedDate, fwd_chainage, fwd_stress, fwd_load, fwd_d1, fwd_d2, fwd_d3, fwd_d4, fwd_d5, fwd_d6, fwd_d7, fwd_asphalt_temp, fwd_surface_temp, fwd_air_temp, fwd_data_id, fwd_package_id) values (:fwd_data_date, :fwd_direction, :fwd_lane, :fwd_addedBy, :fwd_addedDate, :fwd_chainage, :fwd_stress, :fwd_load, :fwd_d1, :fwd_d2, :fwd_d3, :fwd_d4, :fwd_d5, :fwd_d6, :fwd_d7, :fwd_asphalt_temp, :fwd_surface_temp, :fwd_air_temp, :fwd_data_id, :fwd_package_id)";
        $insOk = $CONN->execute($insSql, $updVal);

        if (!$insOk){
            $ret['status'] = 'error'; 
            $ret['errorMessage'] = "SQL Error!"; 
        }else{
            $ret['status'] = 'success'; 
        }
    }

    $uploadedFwdData = $CONN->fetchAll("select * from asset_analysis_fwd where fwd_data_date =:0 and fwd_direction=:1 and fwd_lane=:2 and fwd_package_id=:3", array($dataDate, $direction, $lane, $packageId));
    $headerColumnArr = array(
        'Chainage' => 'fwd_chainage',
        'Stress' => 'fwd_stress',
        'Load' => 'fwd_load',
        'D1' => 'fwd_d1',
        'D2' => 'fwd_d2',
        'D3' => 'fwd_d3',
        'D4' => 'fwd_d4',
        'D5' => 'fwd_d5',
        'D6' => 'fwd_d6',
        'D7' => 'fwd_d7',
        'Asphalt' => 'fwd_asphalt_temp',
        'Surface' => 'fwd_surface_temp',
        'Air' => 'fwd_air_temp'
    );
    showTable($headerColumnArr, $uploadedFwdData, '');
}

function uploadRMT($xlsx, $dataDate, $direction, $lane){
    global $CONN;
    $currDateId = date("Ymd");
    $packageId = $_SESSION['projectID'];
    // read the file
    $delOk = $CONN->execute("delete from asset_analysis_rmt where rmt_data_date =:0 and rmt_direction=:1 and rmt_lane=:2 and rmt_package_id=:3", array($dataDate, $direction, $lane, $packageId));
    foreach ( $xlsx->rows() as $r => $row ) {
        if ( $r === 0 || $r === 1 ) {
            // ignore 2 header
            continue;
        }
        $updVal = array(
            'rmt_data_id' => $currDateId,
            'rmt_addedBy' => $_SESSION["email"],
            'rmt_addedDate' => date(DATE_ATOM,time()),
            'rmt_chainage' => $row['0'],
            'rmt_top_surfarce_h1' =>  $row['1'] ? $row['1'] : 0,
            'rmt_base_layer_h2' =>  $row['2'] ? $row['2'] : 0,
            'rmt_sub_base_layer_h3' =>  $row['3'] ? $row['3'] : 0,
            'rmt_asphalt_e1' =>  $row['4'] ? $row['4'] : 0,
            'rmt_base_layer_e2' =>  $row['5'] ? $row['5'] : 0,
            'rmt_sub_base_layer_e3' =>  $row['6'] ? $row['6'] : 0,
            'rmt_subgrade_es' => $row['7'] ? $row['7'] : 0,
            'rmt_data_date' => $dataDate,
            'rmt_direction' => $direction,
            'rmt_lane' => $lane,
            'rmt_package_id' => $packageId,
        );    
 
        $insSql = "insert into asset_analysis_rmt (rmt_data_date, rmt_direction, rmt_lane, rmt_data_id, rmt_addedBy, rmt_addedDate, rmt_chainage, rmt_top_surfarce_h1, rmt_base_layer_h2, rmt_sub_base_layer_h3, rmt_asphalt_e1, rmt_base_layer_e2, rmt_sub_base_layer_e3, rmt_subgrade_es, rmt_package_id) values (:rmt_data_date, :rmt_direction, :rmt_lane, :rmt_data_id, :rmt_addedBy, :rmt_addedDate, :rmt_chainage, :rmt_top_surfarce_h1, :rmt_base_layer_h2, :rmt_sub_base_layer_h3, :rmt_asphalt_e1, :rmt_base_layer_e2, :rmt_sub_base_layer_e3, :rmt_subgrade_es, :rmt_package_id)";
        $insOk = $CONN->execute($insSql, $updVal);
        if (!$insOk){
            $ret['status'] = 'error'; 
            $ret['errorMessage'] = "SQL Error!"; 
        }else{
            $ret['status'] = 'success'; 
        }
    }
    $uploadedMlpData = $CONN->fetchAll("select * from asset_analysis_rmt where rmt_data_date =:0 and rmt_direction=:1 and rmt_lane=:2 and rmt_package_id =:3", array($dataDate, $direction, $lane, $packageId));
    $headerColumnArr = array(
        'Chainage' => 'rmt_chainage',
        'Thickness (mm) <br/>Top Surface (h1)' => 'rmt_top_surfarce_h1',
        'Thickness (mm) <br/>Base Layer (h2)' => 'rmt_base_layer_h2',
        'Thickness (mm) <br/>Sub-Base Layer (h3)' => 'rmt_sub_base_layer_h3',
        'Resilient Modulus (Mpa) <br/>Asphalt (E1)' => 'rmt_asphalt_e1',
        'Resilient Modulus (Mpa) <br/>Base Layer (E2)' => 'rmt_base_layer_e2',
        'Resilient Modulus (Mpa) <br/>Sub-base Layer (E3)' => 'rmt_sub_base_layer_e3',
        'Resilient Modulus (Mpa) <br/>Subgrade (Es)' => 'rmt_subgrade_es'
    );
    showTable($headerColumnArr, $uploadedMlpData, '');
}

function uploadMLP($xlsx, $direction, $dataDate){
    global $CONN;
    $currDateId = date("Ymd");
    $packageId = $_SESSION['projectID'];
    // read the file
    $delOk = $CONN->execute("delete from asset_analysis_mlp where mlp_data_date =:0 and mlp_direction =:1 and mlp_package_id =:2", array($dataDate, $direction, $packageId));
    foreach ( $xlsx->rows() as $r => $row ) {
        if ( $r === 0 || $r === 1 ) {
            // ignore 2 header
            continue;
        }
        $updVal = array(
            'mlp_direction' => $direction,
            'mlp_data_date' => $dataDate,
            'mlp_data_id' => $currDateId,
            'mlp_addedBy' => $_SESSION["email"],
            'mlp_addedDate' => date(DATE_ATOM,time()),
            'mlp_start_chg' => $row['0'],
            'mlp_end_chg' => $row['1'],
            'mlp_slow_all_cracks' => $row['2'] ? $row['2'] : 0,
            'mlp_slow_roughness' => $row['3'] ? $row['3'] : 0,
            'mlp_slow_rutting' => $row['4'] ? $row['4'] : 0,
            'mlp_fast_all_cracks' => $row['5'] ? $row['5'] : 0,
            'mlp_fast_roughness' =>  $row['6'] ? $row['6'] : 0,
            'mlp_fast_rutting' => $row['7'] ? $row['7'] : 0,
            'mlp_package_id' => $packageId
        );    
 
        $insSql = "insert into asset_analysis_mlp (mlp_direction, mlp_data_date, mlp_data_id, mlp_addedBy, mlp_addedDate, mlp_start_chg, mlp_end_chg, mlp_slow_all_cracks, mlp_slow_roughness, mlp_slow_rutting, mlp_fast_all_cracks, mlp_fast_roughness, mlp_fast_rutting, mlp_package_id) values (:mlp_direction, :mlp_data_date, :mlp_data_id, :mlp_addedBy, :mlp_addedDate, :mlp_start_chg, :mlp_end_chg, :mlp_slow_all_cracks, :mlp_slow_roughness, :mlp_slow_rutting, :mlp_fast_all_cracks, :mlp_fast_roughness, :mlp_fast_rutting, :mlp_package_id)";
        $insOk = $CONN->execute($insSql, $updVal);
        if (!$insOk){
            $ret['status'] = 'error'; 
            $ret['errorMessage'] = "SQL Error!"; 
        }else{
            $ret['status'] = 'success'; 
        }

    }
    $uploadedMlpData = $CONN->fetchAll("select * from asset_analysis_mlp where mlp_data_date =:0 and mlp_direction =:1 and mlp_package_id=:2", array($dataDate, $direction, $packageId));
    $headerColumnArr = array(
        'Start Chainage' => 'mlp_start_chg',
        'End Chainage' => 'mlp_end_chg',
        '(Slow Lane) <br/>All Cracks (%)' => 'mlp_slow_all_cracks',
        '(Slow Lane) <br/>Roughness (m/km)' => 'mlp_slow_roughness',
        '(Slow Lane) <br/>Rutting (mm)' => 'mlp_slow_rutting',
        '(Fast Lane) <br/>All Cracks (%)' => 'mlp_fast_all_cracks',
        '(Fast Lane) <br/>Roughness (m/km)' => 'mlp_fast_roughness',
        '(Fast Lane) <br/>Rutting (mm)' => 'mlp_fast_rutting'
    );
    showTable($headerColumnArr, $uploadedMlpData, $direction);
}

if(!isset($_GET['upload'])) die('error');
$upload = $_GET['upload'];
$fileTemplate = '';
$page = '
    <form class="filterContainer fullWidth flexColumn" method="post" enctype="multipart/form-data">
        <div class="columnTop marginBottom">
            <input type="hidden" name="assetUpload" value="'.$upload.'">
            <label for="data_date" required="required">Data Date:</label>
            <input type="date" name="data_date" id="data_date">
        </div>
        <div class="columnTop">
            <div class="filter three">
                <label for="direction" required="required">Direction:</label>
                <select name="direction" id="direction">
                    <option val="increasing">Increasing</option>
                    <option val="decreasing">Decreasing</option>
                </select>
            </div>
            <div class="filter three">
                <label for="lane" required="required">Lane:</label>
                <select name="lane" id="lane">
                    <option val="fast">Fast</option>
                    <option val="slow">Slow</option>
                </select>
            </div>
            <div class="filter three justifyEnd">
                <input type="file" name="file" id="file">
                <input type="submit" value="Upload" name="submit" disabled="disabled">
            </div>
        </div>
    </form>
    <div class="bodyContainer">
        <div class="tableContainer oneTable" style="overflow: hidden">
';

switch ($upload) {
    case 'assetRMT':
        $title = 'Resilient Modulus Table (RM)';
        $fileTemplate = (file_exists('../../Templates/asset/RMT_sample_data.xlsx')) ? 'Sample : <a href="../../Templates/asset/RMT_sample_data.xlsx" download>RMT_sample_data.xlsx</a>' : '';
        break;
    case 'assetFWD':
        $title = 'Falling Weight Deflectometer (FWD)';
        $fileTemplate = (file_exists('../../Templates/asset/FWD_sample_data.xlsx')) ? 'Sample : <a href="../../Templates/asset/FWD_sample_data.xlsx" download>FWD_sample_data.xlsx</a>' : '';
        break;
    case 'assetMLP':
        $fileTemplate = (file_exists('../../Templates/asset/MLP_sample_data.xlsx')) ? 'Sample : <a href="../../Templates/asset/MLP_sample_data.xlsx" download>MLP_sample_data.xlsx</a>' : '';
        $title = 'Multi-level Profiler (MLP)';
        $page = '
            <form class="filterContainer fullWidth flexColumn" method="post" enctype="multipart/form-data">
                <div class="columnTop marginBottom">
                    <div style="margin-right: 10px">
                        <input type="hidden" name="assetUpload" value="'.$upload.'">
                        <label for="data_date" required="required">Data Date:</label>
                        <input type="date" name="data_date" id="data_date">
                    </div>
                    <input type="submit" value="Upload" name="submit" disabled="disabled">
                </div>
                <div class="columnTop justifyBetween">
                    <div class="filter">
                        <label for="file_increasing" required="required">Increasing:&nbsp</label>
                        <input type="file" name="file_increasing" id="file_increasing">
                    </div>
                    <div class="filter">
                        <label for="file_decreasing" required="required">Decreasing:&nbsp</label>
                        <input type="file" name="file_decreasing" id="file_decreasing">
                    </div>
                </div>
            </form>
            <div class="bodyContainer">
                <div class="tableContainer twoTable">
        ';
        break;    
}
echo '
    <!DOCTYPE html>
    <html lang="en" class="gr__127_0_0_1">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <link rel="stylesheet" href="../../CSS/V3/home.css">
            <link rel="stylesheet" href="../../CSS/V3/Wizard.css">
            <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
            <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
            <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
            <link rel="stylesheet" href="../../JS/JsLibrary/jquery-confirm.min.css">
            <script src="../../JS/JsLibrary/jquery-confirm.min.js"></script>
            <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
            <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
            <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
            <script src = "../../JS/scrollBarCollapse.js"></script> 
        </head>
        <body>
            <div class="assetContainer">
        ';

        echo'
            <h3 class="title">'.$title.'</h3>
            ';
        echo $fileTemplate;
        echo $page;

if(isset($_POST['assetUpload']) && isset($_FILES)){
    include_once './../../JS/uploader/lib/SimpleXLSX.php';
    include_once './../../Login/include/_include.php';

    $assetUpload = $_POST['assetUpload'];
    $dataDate = $_POST['data_date'];
    switch ($assetUpload) {
        case 'assetFWD':
            $direction = $_POST['direction'];
            $lane = $_POST['lane'];
            $filePath = $_FILES['file']['tmp_name'];

            if($xlsx = SimpleXLSX::parse($filePath)){
                uploadFWD($xlsx, $dataDate, $direction, $lane);
            }else{
                die('Cannot parse XLSX file');
            }

            break;
        case 'assetRMT':
            $direction = $_POST['direction'];
            $lane = $_POST['lane'];
            $filePath = $_FILES['file']['tmp_name'];
            if($xlsx = SimpleXLSX::parse($filePath)){
                uploadRMT($xlsx, $dataDate, $direction, $lane);
            }else{
                die('Cannot parse XLSX file');
            }
            break;
        case 'assetMLP':
            $filePathInc = $_FILES['file_increasing']['tmp_name'];
            $filePathDesc = $_FILES['file_decreasing']['tmp_name'];
            if($xlsx = SimpleXLSX::parse($filePathInc)){
                uploadMLP($xlsx, 'Increasing', $dataDate);
            }
            if($xlsx2 = SimpleXLSX::parse($filePathDesc)){
                uploadMLP($xlsx2, 'Decreasing', $dataDate);
            }
            break;
    }
}

echo'
                </div>
            </div>
        </body>
    </html>';

?>
<script>
    $('#data_date').change(function(){
        var selVal = $(this).val();
        if(selVal){
            $('input[name="submit"]').removeAttr('disabled');
        }else{
            $('input[name="submit"]').attr('disabled', 'disabled');
        }
    })
</script>
