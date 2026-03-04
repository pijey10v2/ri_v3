<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include_once 'lib/SimpleXLSX.php';
include_once('../../Backend/class/jogetLink.class.php');
global $api_username, $api_password, $jogetAssetHostIP, $JOGETLINKOBJ;


$JOGETLINKOBJ = new JogetLink();
$api_username = $JOGETLINKOBJ->getAdminUserName('asset');
$api_password = $JOGETLINKOBJ->getAdminUserPassword('asset');
$jogetHostIP = $JOGETLINKOBJ->jogetAssetHost;

$function_name = isset($_POST['function_name']) ? $_POST['function_name'] : NULL;
if (!NULL) {
    $functionNameString = str_replace('"', "", $function_name);
}

$response = array();
$functionName = filter_input(INPUT_POST, 'functionName', FILTER_SANITIZE_STRING);

if (isset($_POST['function_name'])) {
    $functionName = $functionNameString;
}

if (!$functionName) {
    $response['bool'] = false;
    $response['msg'] = "Invalid function";
    echo json_encode($response);
    exit();
}

switch ($functionName) {
    case 'getCSVAssetData':
        $file = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_STRING);
        $response = getCSVAssetData($file);
        break;
    case 'getFMAssetColumns':
        $response = getFMAssetColumns();
        break;
    case "addAssetTableData":
        $data = $_POST['mappings'];
        $url = $_POST['url'];
        $response = addAssetTableData($data, $url);
        break;
}

echo json_encode($response);

function getCSVAssetData($file){
    $file_path = "../".$file;
  
    if(file_exists($file_path)){

        $xlsx = SimpleXLSX::parse($file_path);
        $rows = $xlsx->rows();
        
        if(count($rows) > 0){
            return $rows[0];
        }

        return [];

    } else {
        die('File does not exist: ' . $file_path);
    }
}

function getFMAssetColumns()
{
    global $api_username, $api_password, $JOGETLINKOBJ;

    // $api_username = 'admin';
    // $api_password = 'admin';
    $curl = curl_init();

    $host = $JOGETLINKOBJ->getLink('fm_asset_data_mapping_list');
    // $host = 'http://localhost:8080/jw/web/json/data/list/RV_AMS/list_mappingAssetData';
    
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password"),
    );
    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if (!$err && $return) {
        $result = json_decode($return, true);
        if(isset($result['data'][0])){
            $keys = array_keys($result['data'][0]);
            return $keys;
            // $order = ['id', 'roomtag', 'part_of'];
            // usort($keys, function ($a, $b) use ($order) {
            //     $aIndex = array_search($a, $order);
            //     $bIndex = array_search($b, $order);
            //     return $aIndex - $bIndex;
            // });
        }
    }
    return [];
}

function addAssetTableData($mappings, $url)
{ 
    if(!empty($url)){
        $file_path = "../".$url;

        $csvData = array();
        if (file_exists($file_path)) {

            $xlsx = SimpleXLSX::parse($file_path);
            $rows = $xlsx->rows();
           
            if(count($rows) > 0){
                foreach($rows as $rkey=>$row){
                    if($rkey == 0){
                        $columns = $row;
                    }else{
                        $dataRow = [];
                        foreach($columns as $key=>$col){
                            $dataRow[$col] = $row[$key];
                        }
                        $csvData[] = $dataRow;
                    }
                }
            }
        }
    }

    if(empty($csvData)){
        return ['result' => 0, 'msg' => 'No data found'];
    }

    $withUnit = array('gross_area', 'net_area', 'usable_height');

    $api_data = [];
    $index = 0;
    foreach($csvData as $key=>$loop){
        $rowData = [];
        foreach($loop as $key=>$csv){
            foreach($mappings as $mkey=>$mapp){
                if($mapp == $key){
                    if(in_array($mkey, $withUnit)){
                        $value = explode(' ', $csv);
                        if(isset($value[0])){
                            $rowData[$mkey] = $value[0];
                        }
                        if(isset($value[1])){
                            $rowData[$mkey.'_unit'] = $value[1];
                        }
                    }else{
                        $rowData[$mkey] = $csv;
                    }
                }
            }
        }
        $api_data[$index] = $rowData;
        $index++;
    }

    foreach($api_data as $param){
        if(!isset($param['id'])){
            return ['result' => 0, 'msg' => 'ID not mapped'];
        }
        $result = saveAssetDatatoJoget($param, $param['id']);
        if($result != true){
            return ['result' => 0, 'msg' => $result];
        }
    }

    return ['result' => 1, 'msg' => 'Saved Successfully'];
}

function saveAssetDatatoJoget($csvData, $id)
{
    global $api_username, $api_password, $JOGETLINKOBJ;
    // $api_username = 'admin';
    // $api_password = 'admin';

    $csvData = array_merge($csvData, ['j_username' => $api_username, 'j_password' => $api_password]);
    
    $params = http_build_query($csvData);
   
    $curl = curl_init();

    $host = 'https://joget.reveronconsulting.com/jw/web/json/data/form/store/RV_AMS/fmAssetDataForm/'.$id;
    // $host = 'http://localhost:8080/jw/web/json/data/form/store/RV_AMS/fmAssetDataForm/'.$id;
    
    $headers = array(
        'Content-Type: application/x-www-form-urlencoded'
    );
    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);
    
    if (!$err) {
        return true;
    }
    return $err;
}

?>