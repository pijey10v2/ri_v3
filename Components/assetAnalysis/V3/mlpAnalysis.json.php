<?php
if (session_status() == PHP_SESSION_NONE) session_start();
include_once './../../../Login/include/_include.php';
global $CONN;

function getAllDateOptions(){
    global $CONN;
    $packageID = $_SESSION['projectID'];
    // get all date option
    $dataDateOpt = $CONN->fetchCol("select distinct(mlp_data_date) from asset_analysis_mlp where mlp_data_date <> '' and mlp_data_date is not null and mlp_package_id =:0 order by mlp_data_date desc", array($packageID));
    return $dataDateOpt;
}

function getAllChainageOption(){
    global $CONN;
    $packageID = $_SESSION['projectID'];
    // get the latest chainage drop down
    $chainageOpt = $CONN->fetchCol("select distinct convert(float, chgOpts) from (
        select distinct (mlp.mlp_start_chg) as chgOpts from asset_analysis_mlp mlp where mlp.mlp_package_id =:0 union
        select distinct (mlp2.mlp_end_chg) as chgOpts from asset_analysis_mlp mlp2 where mlp2.mlp_package_id =:1) aa order by convert(float, chgOpts) asc", array($packageID, $packageID));
    return $chainageOpt;
}

function genConditionCriteriaClass($val, $type){
    global $IRI_GOOD, $IRI_FAIR, $IRI_POOR;
    $className = '';
    switch ($type) {
        case 'iri':
            if($val === '-') $className = '';
            else if($val < $IRI_GOOD) $className = 'green';
            else if($val <= $IRI_FAIR) $className = 'yellow';
            else if ($val <= $IRI_POOR) $className = 'orange';
            else $className = 'red';
            break;
        case 'rutting':
            if($val === '-') $className = '';
            else if($val < 10) $className = 'green';
            else if($val <= 15) $className = 'yellow';
            else if ($val <= 25) $className = 'orange';
            else $className = 'red';
            break;
        case 'crack':
            if($val === '-') $className = '';
            else if($val < 5.1) $className = 'green'; // check why zero is not green
            else if($val <= 10.1) $className = 'yellow';
            else if ($val <= 15.1) $className = 'orange';
            else $className = 'red';
            break;
    }
    return $className;
}

function getData($data, $idx){
    return array_key_exists($idx,$data) ? (float) $data[$idx] : '-';
}

function fetchLegendSetup(){
    global $CONN;
    global $IRI_GOOD, $IRI_FAIR, $IRI_POOR;
    $legendRow = $CONN->fetchRow("select * from analysis_legend where al_category = 'iri_analysis'");
    $IRI_GOOD = (isset($legendRow['al_good'])) ? $legendRow['al_good'] : '2.5';
    $IRI_FAIR = (isset($legendRow['al_fair'])) ? $legendRow['al_fair'] : '3.5';
    $IRI_POOR = (isset($legendRow['al_poor'])) ? $legendRow['al_poor'] : '4.5';
    return;
}

function getMLPTableHTML($date){
    global $CONN;
    fetchLegendSetup();
    $packageID = $_SESSION['projectID'];
    // get latest record from based on data date
    $mlpDataInc = $CONN->fetchAll("select convert(float, mlp_start_chg) as start_chg, convert(float, mlp_end_chg) as end_chg,  asset_analysis_mlp.* from asset_analysis_mlp where mlp_data_date= :0 and mlp_package_id=:1", array($date, $packageID));
    // group the data by the chainage
    $mlpChgData = array();
    foreach ($mlpDataInc as $chgVal) {
        $z = ($chgVal['mlp_direction'] == 'Increasing') ? 'inc' : 'desc';
        foreach ($chgVal as $k => $v) {
            $mlpChgData[number_format((float)$chgVal['start_chg'], 3).'-'.number_format((float)$chgVal['end_chg'], 3)][$z.'_'.$k] = $v; 
        }
    }
    $tdHTML = '';
    foreach ($mlpChgData as $key => $data) {
        $tdHTML .= '                                
        <tr class="chainageSearch" data-min="'.$data['inc_start_chg'].'" data-max="'.$data['inc_end_chg'].'">
            <td class="'.genConditionCriteriaClass(getData($data, 'inc_mlp_slow_roughness'), 'iri').'" scope="col">'.getData($data, 'inc_mlp_slow_roughness').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'inc_mlp_slow_rutting'), 'rutting').'" scope="col">'.getData($data, 'inc_mlp_slow_rutting').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'inc_mlp_slow_all_cracks'), 'crack').'" scope="col">'.getData($data, 'inc_mlp_slow_all_cracks').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'inc_mlp_fast_roughness'), 'iri').'" scope="col">'.getData($data, 'inc_mlp_fast_roughness').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'inc_mlp_fast_rutting'), 'rutting').'" scope="col">'.getData($data, 'inc_mlp_fast_rutting').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'inc_mlp_fast_all_cracks'), 'crack').'" scope="col">'.getData($data, 'inc_mlp_fast_all_cracks').'</td>
            <td scope="col">'.getData($data, 'inc_start_chg').'</td>
            <td scope="col">'.getData($data, 'inc_end_chg').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'desc_mlp_slow_roughness'), 'iri').'" scope="col">'.getData($data, 'desc_mlp_slow_roughness').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'desc_mlp_slow_rutting'), 'rutting').'" scope="col">'.getData($data, 'desc_mlp_slow_rutting').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'desc_mlp_slow_all_cracks'), 'crack').'" scope="col">'.getData($data, 'desc_mlp_slow_all_cracks').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'desc_mlp_fast_roughness'), 'iri').'" scope="col">'.getData($data, 'desc_mlp_fast_roughness').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'desc_mlp_fast_rutting'), 'rutting').'" scope="col">'.getData($data, 'desc_mlp_fast_rutting').'</td>
            <td class="'.genConditionCriteriaClass(getData($data, 'desc_mlp_fast_all_cracks'), 'crack').'" scope="col">'.getData($data, 'desc_mlp_fast_all_cracks').'</td>
        <tr>';
    }
    return $tdHTML;
}

if(!isset($_POST['func'])) die('error');
$ret = array();
switch ($_POST['func']) {
    case 'firstLoad':
        $packageID = $_SESSION['projectID'];
        // load the latest record
        $latestMlpDataDate = $CONN->fetchOne('select max(mlp_data_date) from asset_analysis_mlp where mlp_package_id=:0', array($packageID));
        $ret['dateTitle'] = $latestMlpDataDate;
        $ret['mlpDataHTML'] = getMLPTableHTML($latestMlpDataDate);
        $ret['dateOpt'] = getAllDateOptions();
        $ret['chgOpt'] = getAllChainageOption();
        break;
    case 'fetchData':
        // load the latest record
        $packageID = $_SESSION['projectID'];
        $selDate = $_POST['date'];
        $latestMlpDataDate = ($selDate) ? $selDate : $CONN->fetchOne('select max(mlp_data_date) from asset_analysis_mlp where mlp_package_id=:0', array($packageID));
        $ret['dateTitle'] = $selDate;
        $ret['mlpDataHTML'] = getMLPTableHTML($latestMlpDataDate);
        break;
}

echo json_encode($ret);
