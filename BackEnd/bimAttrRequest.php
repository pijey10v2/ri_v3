<?php
    include("class/jogetLink.class.php");
    require('../login/include/_include.php');
    global $CONN, $api_username, $api_password, $JOGETLINKOBJ;

    // to retrive data id based on url
    $dataId = $CONN->fetchOne('select Data_ID from Data_Pool where Data_URL =:0', array($_POST['url']));

    $JOGETLINKOBJ = new JogetLink();
    $api_username = $JOGETLINKOBJ->getAdminUserName('asset');
    $api_password = $JOGETLINKOBJ->getAdminUserPassword('asset');
    $joget = $JOGETLINKOBJ->jogetAssetHost;

    if(!isset($_POST['element_id'])){
        echo json_encode("Ref id not available");
        exit();
    }

    if($_SESSION['Project_type'] == "FM"){
        $host = $joget."jw/web/json/data/list/RV_AMS/list_assetData?d-7749631-fn_id=".$_POST['element_id'];
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
        
        if (!$err) {
            if(isset($return['data']) && empty($return['data'])){
                echo json_encode(['data' => null]);
                exit;
            }
            $decodedText = html_entity_decode($return);
            echo $decodedText;
        }
        else{
            $response['bool'] = false;
            $response['msg'] = "Empty Data";
            echo json_encode($response);
        }
    }else{
        //road
        if($_POST['url'] == "road"){ 
            $host = $joget."jw/web/json/data/list/ri_asset/list_networkSite?d-3183790-fn_c_site_name=".$_POST['element_id']."&d-3183790-fn_c_package_uuid=".$_POST['package_uuid'];
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
            
            if (!$err) {
                $decodedText = html_entity_decode($return);
                echo $decodedText;
            }
            else{
                $response['bool'] = false;
                $response['msg'] = "Empty Data";
                echo json_encode($response);
            }
            
        }else{

            $host = $joget."jw/web/json/data/list/ri_asset/list_assetDatalistId?d-3987032-fn_element_id=".$_POST['element_id']."&d-3987032-fn_data_id=".$dataId."&d-3987032-fn_package_uuid=".$JOGETLINKOBJ->currPackageUuid;
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
        
            $return = json_decode($return,true);

            if(isset($return["data"][0]['datalist_id'])){
                $datalist_id = $return["data"][0]['datalist_id'];
                $host = $joget."jw/web/json/data/list/ri_asset/".$datalist_id.$_POST['element_id'];
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
        
                if (!$err) {
                    $decodedText = html_entity_decode($return);
                    echo $decodedText;
                }else{
                    echo $err;
                }
        
            }
            else{
                $response['bool'] = false;
                $response['msg'] = "Empty Data";
                echo json_encode($response);
            }
            
        }
    }

    // if everything seems fine (paths and reference ids), but still getting 500 error, check attribute json files for redundant data (with same id)

?>
