<?php
if (session_status() == PHP_SESSION_NONE) session_start();
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

function showTable($columnArr, $data, $title){
    $class = ($title == '') ? 'dataStoringOne' : 'dataStoringTwo';
    $html = '<div class="columnM">';
    $html .= '<center><div class="tableContainer '.$class.'">'.$title.'<table><tr></center>';
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
    <form class="filterContainer fullWidth flexColumn alignBaseline" method="post" enctype="multipart/form-data">
        <div class="contentContainer flexColumn">
            <div class="flex">
                <label class="label" for="direction" required="required">Direction</label><div class="separator">:</div>
                <select name="direction" id="direction">
                    <option val="increasing">Increasing</option>
                    <option val="decreasing">Decreasing</option>
                </select>
            </div>
            <div class="flex marginBottom">
                <label class="label" for="lane" required="required">Lane</label><div class="separator">:</div>
                <select name="lane" id="lane">
                    <option val="fast">Fast</option>
                    <option val="slow">Slow</option>
                </select>
            </div>
        </div>

        <div class="contentContainer flexColumn">
            <div class="flex">
                <input type="hidden" name="assetUpload" value="'.$upload.'">
                <label class="label" for="data_date" required="required">Data Date</label><div class="separator">:</div>
                <input class="date" type="date" name="data_date" id="data_date" data-type="'.$upload.'">

                <button class="button round disabled" type="button" title="Upload" id="'.$upload.'" onclick="uploadFileButtonPavement(this, event)"><i class="fa-solid fa-upload"></i></button>
                <input type="submit" value="upload" name="submit" id="upload'.$upload.'" style="display:none;">
            </div>
            <div class="flex marginBottom">
                <label class="label">File Upload</label><div class="separator">:</div>
                <button class="button" type="button" data-file="file" onclick="addFileButtonPavement(this, event)">
                    <span aria-hidden="true">Choose file</span>
                </button>
                <input type="file" name="file" id="file" style="display:none">
                <div class="textEllipsis" id="namefile"></div>
            </div>
        </div>

    </form>
    <div class="bodyContainer upload">
        <div class="tableContainer oneTable" style="overflow: hidden">
';

switch ($upload) {
    case 'assetRMT':
        $title = 'Resilient Modulus Table (RM)';
        $fileTemplate = (file_exists('../../../Templates/asset/RMT_sample_data.xlsx')) ? '<div class="sampleTitle">Sample : <a href="../../../Templates/asset/RMT_sample_data.xlsx" download>RMT_sample_data.xlsx</a></div>' : '';
        break;
    case 'assetFWD':
        $title = 'Falling Weight Deflectometer (FWD)';
        $fileTemplate = (file_exists('../../../Templates/asset/FWD_sample_data.xlsx')) ? '<div class="sampleTitle">Sample : <a href="../../../Templates/asset/FWD_sample_data.xlsx" download>FWD_sample_data.xlsx</a></div>' : '';
        break;
    case 'assetMLP':
        $fileTemplate = (file_exists('../../../Templates/asset/MLP_sample_data.xlsx')) ? '<div class="sampleTitle">Sample : <a href="../../../Templates/asset/MLP_sample_data.xlsx" download>MLP_sample_data.xlsx</a></div>' : '';
        $title = 'Multi-level Profiler (MLP)';
        $page = '
            <h5>Note : <i>Please Upload data for Increasing Lanes first or Upload data for both Increasing and Decreasing Lanes at the same time.</i></h5>
            <form class="filterContainer fullWidth flexColumn alignBaseline" method="post" enctype="multipart/form-data">
                <div class="contentContainer flexColumn">
                    <div class="flex">
                        <label class="label" for="file_increasing" required="required">Increasing</label><div class="separator">:</div>
                        <button class="button" type="button" data-file="file_increasing" onclick="addFileButtonPavement(this, event)">
                            <span aria-hidden="true">Choose file</span> 
                        </button>
                        <input type="file" name="file_increasing" id="file_increasing" style="display:none;">
                        <div class="textEllipsis" id="namefile_increasing"></div>
                    </div>
                    <div class="flex marginBottom">
                        <label class="label" for="file_decreasing" required="required">Decreasing</label><div class="separator">:</div>
                        <button class="button" type="button" data-file="file_decreasing" onclick="addFileButtonPavement(this, event)">
                            <span aria-hidden="true">Choose file</span> 
                        </button>
                        <input type="file" name="file_decreasing" id="file_decreasing" style="display:none;">
                        <div class="textEllipsis" id="namefile_decreasing"></div>
                    </div>
                </div>
                <div class="contentContainer flexColumn">
                    <div class="flex">
                        <input type="hidden" name="assetUpload" value="'.$upload.'">
                        <label class="label" for="data_date" required="required">Data Date</label><div class="separator">:</div>
                        <input class="date" type="date" name="data_date" id="data_date" data-type="'.$upload.'">

                        <button class="button round disabled" type="button" title="Upload" id="'.$upload.'" onclick="uploadFileButtonPavement(this, event)"><i class="fa-solid fa-upload"></i></button>
                        <input type="submit" value="upload" name="submit" id="upload'.$upload.'" style="display:none;">
                    </div>

                    <div class="flex marginBottom dummyContainer" style="visibility:hidden">
                        <label class="label" for="" required="required">File Upload</label>
                    </div>
                </div>
            </form>
            <div class="bodyContainer upload">
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
            <link rel="stylesheet" href="../../../CSS/V3/home.css">
            <link rel="stylesheet" href="../../../CSS/V3/Wizard.css">
            <link rel="stylesheet" href="../../../CSS/'.$theme.'/RVguiStyle.css">  
            <script src="../../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
            <script type="text/javascript" src="../../../JS/fontawesome.js"></script>
            <link rel="stylesheet" href="../../../JS/JsLibrary/jquery-confirm.min.css">
            <script src="../../../JS/JsLibrary/jquery-confirm.min.js"></script>
        </head>
        <body style="background: transparent" class='.$themeClass.'>
            <div class="assetContainer">
        ';
        echo $fileTemplate;
        echo $page;

if(isset($_POST['assetUpload']) && isset($_FILES)){
    include_once './../../../JS/uploader/lib/SimpleXLSX.php';
    include_once './../../../Login/include/_include.php';

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
                die('<div class="titleEmpty">Cannot parse XLSX file</div>');
            }

            break;
        case 'assetRMT':
            $direction = $_POST['direction'];
            $lane = $_POST['lane'];
            $filePath = $_FILES['file']['tmp_name'];
            if($xlsx = SimpleXLSX::parse($filePath)){
                uploadRMT($xlsx, $dataDate, $direction, $lane);
            }else{
                die('<div class="titleEmpty">Cannot parse XLSX file</div>');
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
    function addFileButtonPavement (e, event){
        var fileType = $(e).data("file");
        $(`#${fileType}`).trigger('click');

        $(`#${fileType}`).change(function() {
            $(`#name${fileType}`).text($(`#${fileType}`)[0].files[0].name);
        });

        event.preventDefault();
    }

    function uploadFileButtonPavement (e, event){
        var pavementType = $(e).attr("id");
        $(`#upload${pavementType}`).trigger('click');

        event.preventDefault();
    }

    $('#data_date').change(function(){
        var selVal = $(this).val();
        var pavementType = $(this).data("type");

        if(selVal){
            $(`#${pavementType}`).removeClass('disabled');
        }else{
            $(`#${pavementType}`).addClass('disabled');
        }
    })
    $('body').removeClass().addClass(localStorage.themeJoget)
</script>
