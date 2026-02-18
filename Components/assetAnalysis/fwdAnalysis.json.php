<?php
if (session_status() == PHP_SESSION_NONE) session_start();
include_once './../../Login/include/_include.php';
global $CONN;

function getAllDateOptions(){
    global $CONN;
    $packageID = $_SESSION['projectID'];
    // get all date option
    $dataDateOpt = $CONN->fetchCol("select distinct(fwd_data_date) from asset_analysis_fwd where fwd_data_date <> '' and fwd_data_date is not null and fwd_package_id=:0 order by fwd_data_date desc", array($packageID));
    return $dataDateOpt;
}

function getAllChainageOption(){
    global $CONN;
    $packageID = $_SESSION['projectID'];
    // get the latest chainage drop down
    $chainageOpt = $CONN->fetchCol("select distinct convert(float, fwd_chainage) from asset_analysis_fwd fwd where fwd_package_id=:0 order by convert(float, fwd_chainage) asc", array($packageID));
    return $chainageOpt;
}

function getData($data, $idx){
    return array_key_exists($idx,$data) ? $data[$idx] : '-';
}

function custom_array_merge($array1, $array2) {
    $result = $array1;
        foreach ($array2 as $key_2 => $value_2) {
            if(array_key_exists($key_2,$result)){
                $result[$key_2] = array_merge($result[$key_2],$value_2);
            }else{
                $result[$key_2] = $value_2;
            }
        }
    return $result;
}

function getFWDTableHTML($fwdDate, $rmtDate){
    global $CONN;
    $packageID = $_SESSION['projectID'];
    
    // FWD - get latest record from based on data date
    $mlpDataInc = $CONN->fetchAll("select * from asset_analysis_fwd where fwd_data_date= :0 and fwd_package_id =:1", array($fwdDate, $packageID));
    // FWD - group the data by the chainage
    $fwdChgData = array();
    foreach ($mlpDataInc as $chgVal) {
        $d = ($chgVal['fwd_direction'] == 'Increasing') ? 'inc' : 'desc';
        $l = strtolower($chgVal['fwd_lane']);
        foreach ($chgVal as $k => $v) {
            $fwdChgData[(string) $chgVal['fwd_chainage']][$d.'_'.$l.'_'.$k] = $v; 
        }
    }

    // RMT - get latest record from based on data date
    $rmtDataInc = $CONN->fetchAll("select * from asset_analysis_rmt where rmt_data_date= :0 and rmt_package_id =:1", array($rmtDate, $packageID));
    // RMT - group the data by the chainage 
    $fwdAllData = array();
    foreach ($rmtDataInc as $chgVal2) {
        if(!isset($fwdAllData[(string) $chgVal2['rmt_chainage']])) $fwdAllData[(string) $chgVal2['rmt_chainage']] = [];
        $d = ($chgVal2['rmt_direction'] == 'Increasing') ? 'inc' : 'desc';
        $l = strtolower($chgVal2['rmt_lane']);
        $chgVal2['e2_calc'] = ($chgVal2['rmt_base_layer_e2']) ? round($chgVal2['rmt_base_layer_e2'] / $chgVal2['rmt_subgrade_es'],2) : 0;
        $chgVal2['e3_calc'] = ($chgVal2['rmt_sub_base_layer_e3']) ? round($chgVal2['rmt_sub_base_layer_e3'] / $chgVal2['rmt_subgrade_es'],2) : 0;
        foreach ($chgVal2 as $k => $v) {
            $fwdAllData[(string) $chgVal2['rmt_chainage']][$d.'_'.$l.'_'.$k] = $v; 
        }
    }
    $combinedArr = custom_array_merge($fwdChgData, $fwdAllData);

    $tdHTML = '';
    foreach ($combinedArr as $chg => $data) {
        $tdHTML .= '                                
        <tr class="calcTr">
            <td>'.$chg.'</td>
            <td>'.getData($data, 'inc_slow_fwd_d1').'</td>
            <td>'.getData($data, 'inc_slow_rmt_asphalt_e1').'</td>
            <td>'.getData($data, 'inc_slow_e2_calc').'</td>
            <td>'.getData($data, 'inc_slow_e3_calc').'</td>
            <td>'.getData($data, 'inc_slow_rmt_subgrade_es').'</td>
            <td>'.getData($data, 'inc_fast_fwd_d1').'</td>
            <td>'.getData($data, 'inc_fast_rmt_asphalt_e1').'</td>
            <td>'.getData($data, 'inc_fast_e2_calc').'</td>
            <td>'.getData($data, 'inc_fast_e3_calc').'</td>
            <td>'.getData($data, 'inc_fast_rmt_subgrade_es').'</td>
            <td>'.getData($data, 'desc_slow_fwd_d1').'</td>
            <td>'.getData($data, 'desc_slow_rmt_asphalt_e1').'</td>
            <td>'.getData($data, 'desc_slow_e2_calc').'</td>
            <td>'.getData($data, 'desc_slow_e3_calc').'</td>
            <td>'.getData($data, 'desc_slow_rmt_subgrade_es').'</td>
            <td>'.getData($data, 'desc_fast_fwd_d1').'</td>
            <td>'.getData($data, 'desc_fast_rmt_asphalt_e1').'</td>
            <td>'.getData($data, 'desc_fast_e2_calc').'</td>
            <td>'.getData($data, 'desc_fast_e3_calc').'</td>
            <td>'.getData($data, 'desc_fast_rmt_subgrade_es').'</td>        
        <tr>';
    }
    // add another tr at the end
    $tdHTML .='<tr></tr>';
    return $tdHTML;
}


if(!isset($_POST['func'])) die('error');
$ret = array();
switch ($_POST['func']) {
    case 'firstLoad':
        $packageID = $_SESSION['projectID'];
        // load the latest record
        $fwdDate = $CONN->fetchOne('select max(fwd_data_date) from asset_analysis_fwd where fwd_package_id =:0', array($packageID));
        $rmtDate = $CONN->fetchOne('select max(rmt_data_date) from asset_analysis_rmt where rmt_package_id =:0', array($packageID));
        $ret['dateTitleHTML'] = 'FWD Date : '.(($fwdDate) ? date('d-m-Y',strtotime($fwdDate)) : '').' | RM Date : '.(($rmtDate) ? date('d-m-Y',strtotime($rmtDate)) : '');
        $ret['fwdDataHTML'] = getFWDTableHTML($fwdDate, $rmtDate);
        $ret['dateOpt'] = getAllDateOptions();
        $ret['chgOpt'] = getAllChainageOption();
        break;
    case 'fetchData':
        $packageID = $_SESSION['projectID'];
        $selDate = $_POST['date'];
        $fwdDate = ($selDate) ? $selDate : $CONN->fetchOne('select max(fwd_data_date) from asset_analysis_fwd where fwd_package_id =:0', array($packageID));
        $rmtDate = ($selDate) ? $selDate : $CONN->fetchOne('select max(rmt_data_date) from asset_analysis_rmt where rmt_package_id =:0', array($packageID));
        $ret['dateTitleHTML'] = 'FWD Date : '.date('d-m-Y',strtotime($fwdDate)).' | RM Date : '.date('d-m-Y',strtotime($rmtDate));
        $ret['fwdDataHTML'] = getFWDTableHTML($fwdDate,$rmtDate);
        break;
}

echo json_encode($ret);
