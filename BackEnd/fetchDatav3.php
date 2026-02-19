<?php
session_start();

$function_name = isset($_POST['function_name']) ? $_POST['function_name'] : NULL;
if (!NULL) {
    $functionNameString = str_replace('"', "", $function_name);
}

$response = array();
$functionName = filter_input(INPUT_POST, 'functionName', FILTER_SANITIZE_STRING);
$packageID = filter_input(INPUT_POST, 'packageID', FILTER_SANITIZE_STRING);
$isPackageChanged = filter_input(INPUT_POST, 'isPackageChanged', FILTER_SANITIZE_STRING);

if (isset($_POST['function_name'])) {
    $functionName = $functionNameString;
}

if (!$functionName) {
    $response['bool'] = false;
    $response['msg'] = "Invalid function";
    echo json_encode($response);
    exit();
}

if ($functionName == 'getAppLink') {  
    include_once dirname(__DIR__).'../Login/include/_include.php';
    include_once('../Backend/class/jogetLink.class.php');

    $response = getAppLink();
} else {
    include_once '../Dashboard/dashboard.class.php';
    global $dashObj;
    $dashObj = new RiDashboard('', true, 0);
    
    $JOGETLINKOBJ = $dashObj->jogetLinkObj;
    $api_username = $JOGETLINKOBJ->getAdminUserName();
    $api_password = $JOGETLINKOBJ->getAdminUserPassword();
    $jogetHostIP = $JOGETLINKOBJ->jogetHost;
}

switch ($functionName) {
    case 'getFilterData':
        $response = getFilterData();
        break;
    case 'getLayersData':
        $response = getLayersData();
        break;
    case 'getECWList':
        $response = getECWList($packageID, $isPackageChanged);
        break;
    case "uploadScreenshot":
        $response = uploadScreenshot();
        break;
    case "getReviewList";
        $response = getReviewList();
        break;
    case "getVideoCam";
        $response = getVideoCam();
        break;
    case "deleteVideoCam";
        $response = deleteVideoCam();
        break;
    case "addVideoCam";
        $response = addVideoCam();
        break;
    case "updateVideoCam";
        $response = updateVideoCam();
        break;
    case "getLandList";
        $response = getLandList();
        break;
    case "getPackageList";
        $response = getPackageList();
        break;
    case "getProjectLayerList";
        $response = getProjectLayerList();
        break;
    case "renameLayer";
        $response = renameLayer();
        break;
    case "switchDefaultDisplay";
        $response = switchDefaultDisplay();
        break;
    case "detachLayer";
        $response = detachLayer();
        break;
    case "getPWDirectories";
        $response = getPWDirectories();
        break;
    case "saveModelAssetData";
        $response = saveModelAssetData();
        break;
    case "deleteImagePinData";
        $response = deleteImagePinData();
        break;
    case "saveLocationData";
        $response = saveLocationData();
        break;
    case "deleteLocationData";
        $response = deleteLocationData();
        break;
    case "deleteModelAssetData";
        $response = deleteModelAssetData();
        break;
    case "saveProjectwiseFileData";
        $response = saveProjectwiseFileData();
        break;
    case "saveImagePinData";
        $response = saveImagePinData();
        break;
    case "updateImagePinData";
        $response = updateImagePinData();
        break;
    case "updateLayerInfo";
        $response = updateLayerInfo();
        break;
    case "getProjectWiseFolders";
        $response = getProjectWiseFolders();
        break;
    case "attachOrDetachLayer";
        $response = attachOrDetachLayer();
        break;
    case "docViewer";
        $response = docViewer();
        break;
    case "getConfigDetailsPWPBi";
        $response = getConfigDetailsPWPBi();
        break;
    case 'getProjectPackages':
        getProjectPackages();
        break;
    case 'fetchMetadata':
        fetchMetadata();
        break;
    case 'fetchAllDataPool':
        fetchAllDataPool();
        break;
    case 'saveGroupAerial';
        saveGroupAerial();
    break;
    case 'removeAerialGroup';
        removeAerialGroup();
    break;
    case 'getAllMetadataLayer';
        getAllMetadataLayer();
    break;
    case 'getAssetTypeDataList':
        $response = getAssetTypeDataList();
    break;
    case "getAgileData": 
        $response = getAgileData();
    break;
    case "getAssetInfo": 
        $elementId = filter_input(INPUT_POST, 'elementId');
        if (!empty($elementId )) {
            $response = getAssetInfo($elementId);
        }else{
            $response['bool'] = false;
            $response['msg'] = "elementId is not set or empty";
        }
    break;
    case 'saveIoTSensorData':
        saveIoTSensorData();
    break;
    case 'updateIoTSensorData':
        updateIoTSensorData();
    break;
    case 'getIoTSensorData':
        getIoTSensorData();
    break;
    case 'deleteIoTSensorData':
        deleteIoTSensorData();
    break;
    case 'getLayerId':
        $layerPath = filter_input(INPUT_POST, 'layerPath');
        $response = getLayerId($layerPath);
    break;
    case "getTrackAnimation";
        $response = getTrackAnimation();
    break;
    case "switchAnimation";
        $response = switchAnimation();
    break;
    case 'getAICDetailsById':
        $aicId = $_POST['AIC_Id'] ?? null;
        $response = getAICDetailsById($aicId);
    break;
}

echo json_encode($response, true);

function checkIfProjectAdmin() {
    global $CONN;
    $email = $_SESSION['email'];
    $pidnumber = $_SESSION['project_id'];

    $count = $CONN->fetchOne("SELECT count(*) FROM pro_usr_rel WHERE Pro_ID = :0  AND  Usr_ID IN (SELECT user_id from users WHERE user_email =:1) AND Pro_Role IN ('Project Manager', 'Senior Civil Engineer (Road Asset)', 'Assistant Director (Road Asset)', 'KKR', 'Civil Engineer (Road Asset)')", array($pidnumber, $email));

    if ($count) {
        return true;
    } else {
        return false;
    }
}

function getFilterData(){
    global $dashObj;

    $ret = array (
        'wpcPackageFilter' => $dashObj->WPCOptionsV3,
        'sectionFilter' => $dashObj->sectionOptions,
        'yearFilter' => $dashObj->yearOptions

    );
    
    return $ret;
}

function getLayersData() {
    global $response, $CONN;
    $pid = $_SESSION['project_id'];

    $fetchGeoData = $CONN->fetchAll("SELECT 
    g.groupName, 
    g.groupView, 
    g.layerTitle,
    g.flagROS,
    g.groupID,
    p.meta_id,
    p.layerGroup, 
    p.Layer_ID, 
    p.Data_ID, 
    p.Layer_Name,
    p.Attached_Date,
    p.zindex, 
    p.Default_View, 
    p.show_metadata,
    p.subGroupName as subLayerTitle,
    p.subGroupID,
    d.Offset,
    d.X_Offset,
    d.Y_Offset,
    d.Data_URL, 
    d.Share, 
    d.Data_Type,
    d.Style,
    pr.project_id,
    MD.md_data_category
    FROM Project_Layers p
    JOIN Data_Pool d ON p.Data_ID = d.Data_ID 
    LEFT JOIN groupLayers g ON p.layerGroup = g.groupID
    LEFT JOIN projects pr ON d.Data_Owner = pr.project_name
    LEFT JOIN metadata MD ON p.meta_id = MD.md_meta_id
    WHERE p.Project_ID =:0 ORDER BY g.groupName ASC, d.Data_Type ASC", array($pid));
    $response['bool'] = true;
    $response['data'] = $fetchGeoData;
    return $response;
}

function getAllMetadataLayer(){
    global $response, $CONN;
    $pid = $_SESSION['project_id'];
    $metaId = ( !empty($_POST['metaId']) && $_POST['metaId'] != '')  ? $_POST['metaId'] : 'MD.md_meta_id' ; 
    $md_mission_id = ( !empty($_POST['md_mission_id']) && $_POST['md_mission_id'] != '')  ? $_POST['md_mission_id'] : '' ; 
    $mission_condition = $md_mission_id != '' ? "MD.md_mission_id LIKE '%$md_mission_id%' " : "1=1";
    
    $fetchGeoData = $CONN->fetchAll("SELECT 	
	MD.md_meta_id,
    MD.md_data_category,
    MD.md_mission_id,
    MD.md_date_created,
    MD.md_start_time,
    MD.md_end_time
    FROM metadata MD
    WHERE MD.md_meta_id = $metaId 
    and $mission_condition
    ORDER BY Modified_Date", array($metaId));
    $response['bool'] = true;
    $response['data'] = $fetchGeoData;
    return $response;
}

function getECWList($packageID, $isPackageChanged) {
    global $response, $CONN;
    $pro_id = $_SESSION['project_id'];
    //check parent or not
    //if parent, get packageIds
    if ($_SESSION['is_Parent'] == "isParent") {
        $aicList  = $CONN->fetchAll("SELECT 
        AerialImageCompare.AIC_Id, 
        AerialImageCompare.Project_Id, 
        AerialImageCompare.Package_Id, 
        AerialImageCompare.Image_Type, 
        AerialImageCompare.Image_Captured_Date,
        AerialImageCompare.Registered_By, 
        AerialImageCompare.Registered_Date, 
        AerialImageCompare.Image_URL, 
        AerialImageCompare.Routine_Id, 
        AerialImageCompare.Routine_Type,
        AerialImageCompare.Use_Name, 
        AerialImageCompare.Image_Group, 
        AerialImageCompare.Image_SubGroup, 
        projects.project_id,
        groupAerial.groupName,
        subgroupAerial.subGroupName
        FROM AerialImageCompare
        LEFT JOIN projects ON AerialImageCompare.Package_Id = projects.project_id_number 
        LEFT JOIN groupAerial ON AerialImageCompare.Image_Group = groupAerial.groupID
        LEFT JOIN subgroupAerial ON AerialImageCompare.Image_SubGroup = subgroupAerial.subGroupID
        WHERE Package_Id IN (SELECT project_id_number FROM projects WHERE parent_project_id_number =:0) 
        ORDER BY AerialImageCompare.Routine_Type ASC, groupAerial.groupName DESC, subgroupAerial.subGroupName DESC, AerialImageCompare.Use_Name DESC;", array($pro_id));
    }else{
        $aicList  = $CONN->fetchAll("SELECT * FROM AerialImageCompare a 
        LEFT JOIN groupAerial b ON a.Image_Group = b.groupID
        LEFT JOIN subgroupAerial c ON a.Image_SubGroup = c.subGroupID 
        WHERE Package_Id =:0 
        ORDER BY a.Routine_Type ASC, b.groupName DESC, c.subGroupName DESC, a.Use_Name DESC", array($pro_id));
    }

    // this condition to check if package being changed from the AIC compare dropdown, use packagedID instead of project_id
    if ($isPackageChanged == true) {
        $aicList  = $CONN->fetchAll("SELECT 
        a.AIC_Id, 
        a.Project_Id, 
        a.Package_Id, 
        a.Image_Type, 
        a.Image_Captured_Date,
        a.Registered_By, 
        a.Registered_Date, 
        a.Image_URL, 
        a.Routine_Id, 
        a.Routine_Type,
        a.Use_Name, 
        a.Image_Group, 
        a.Image_SubGroup, 
        projects.project_id,
        b.groupName,
        c.subGroupName 
        FROM AerialImageCompare a 
        LEFT JOIN projects ON a.Package_Id = projects.project_id_number 
        LEFT JOIN groupAerial b ON a.Image_Group = b.groupID
        LEFT JOIN subgroupAerial c ON a.Image_SubGroup = c.subGroupID 
        WHERE Package_Id =:0 
        ORDER BY a.Routine_Type ASC, b.groupName DESC, c.subGroupName DESC, a.Use_Name DESC", array($packageID));
    }

    //query using In packageId
    if ($aicList) {
        $response['bool'] = true;
        $response['data'] = $aicList;
    } else {
        $response['bool'] = false;
        $response['msg'] = 'No AIC Image Records Found';
    }
    return $response;
}

function uploadScreenshot(){
    global $response;
    $imageFName =    $_SESSION['firstname'] . "_" . $_SESSION['lastname'] . "_" . time(); 
    $pid = $_SESSION['project_id'];
    $img = $_POST['imgBase64'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $fileData = base64_decode($img);
    //saving
    if(file_put_contents("../../Data/Projects/".$pid."/".$imageFName.".png", $fileData)){
        $response['data'] = $imageFName;
    }else{
        $response['msg'] = 'Unable to upload the image'; 
    }
    return $response;
}

function getReviewList(){

    $url = filter_input(INPUT_POST, 'urlID', FILTER_SANITIZE_STRING);
    global $api_username, $api_password, $JOGETLINKOBJ;
    $host = $url;

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
        return $return;
    }
}

function getVideoCam() {
    global $response;
    global $CONN;

    $pid = $_POST['project_id'] ?? $_SESSION['project_id'] ?? null;
    $fetchVideoData = $CONN->fetchAll("SELECT * FROM videoPin WHERE projectID = :0", array($pid));
    if(!$fetchVideoData){
        $response['bool'] = false;
        $response['msg'] = "Video record not found";
    }
        $response['bool'] = true;
        $response['data'] = $fetchVideoData;
        
    return $response;
}

function deleteVideoCam(){
    global $response;
    global $CONN;
    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    
    $fetchVideoData = $CONN->fetchRow("SELECT * FROM videoPin WHERE videoPinID = :0", array($id));
    if(!$fetchVideoData){
        $response['bool'] = false;
        $response['msg'] = "Video record not found";
        return;
    }

    $oldVideo['vType'] =  $fetchVideoData['videoType']; 
    $oldVideo['vURL'] = $fetchVideoData['videoURL']; 

    $deleteSQL = $CONN->execute("DELETE FROM videoPin WHERE videoPinID = :0", array($id));
    if(!$deleteSQL){
        $response['bool'] = false;
        $response['msg'] = "SQL Error. Video record is not deleted.";
        return;
    }
    if ($oldVideo['vType'] == 0 && file_exists($oldVideo['vURL'])){
        if (unlink($oldVideo['vURL'])) {   
            $response['msg'] = "Delete successful";
            return $response;
        }
        else {
            $response['msg'] = "Delete failed, record isn't removed";
            return $response;
        }   
    } 
}

function addVideoCam(){
    global $response;
    global $CONN;

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $long = filter_input(INPUT_POST, 'longitude', FILTER_VALIDATE_FLOAT);
    $lat = filter_input(INPUT_POST, 'latitude', FILTER_VALIDATE_FLOAT);
    $height = filter_input(INPUT_POST, 'height', FILTER_VALIDATE_FLOAT);
    $videoType = filter_input(INPUT_POST, 'vType', FILTER_VALIDATE_INT);
    $videoURL = filter_input(INPUT_POST, 'vURL', FILTER_SANITIZE_STRING);
    // $videoURL = $_POST['vURL'];
    
    $email = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    if($videoType == 0){
        $videoPath = "Data/Projects/".$pid."/".$videoURL;
    }else{
        $videoPath = $videoURL;
    }

    $insertSQL = "INSERT INTO videoPin (projectID, videoPinName, longitude, latitude, height, videoURL, uploadedBy, uploadedDate, videoType) VALUES (:0, :1, :2, :3, :4, :5, :6, GETDATE(), :7)";
    $ok = $CONN->execute($insertSQL, array($pid, $name, $long, $lat, $height, $videoPath, $email, $videoType));

    if (!$ok) {
        $response['bool'] = false;
        $response['msg'] = "SQL Error!";
        return false;
    }else{
        $insertedId = $CONN->getLastInsertID();
        $fetchVideoData = $CONN->fetchRow("SELECT * FROM videoPin WHERE videoPinID = :0", array($insertedId));
        $response['data'] = $fetchVideoData;
        $response['bool'] = true;
        $response['msg'] = "Video successfully added!";
        return $response;
    }
}

function updateVideoCam(){
    global $response;
    global $CONN;
    $check = checkIfProjectAdmin();
    $oldVideo = [];
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };
    $email = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $height = filter_input(INPUT_POST, 'height', FILTER_VALIDATE_FLOAT);
    $videoType = filter_input(INPUT_POST, 'vType', FILTER_VALIDATE_INT);
    $videoURL = filter_input(INPUT_POST, 'vURL', FILTER_SANITIZE_STRING);
    
    $fetchVideoData = $CONN->fetchRow("SELECT * FROM videoPin WHERE videoPinID = :0", array($id));
    if(!$fetchVideoData){
        $response['bool'] = false;
        $response['msg'] = "Video record not found";
        return;
    }

    $oldVideo['vType'] =  $fetchVideoData['videoType']; 
    $oldVideo['vURL'] = $fetchVideoData['videoURL']; 
    if($videoURL == ""){    //update basic info only, video url doesnt change
        $videoPath = $oldVideo['vURL'];
        $updateSQL = "UPDATE videoPin SET videoPinName =:0, height =:1, uploadedBy =:2, uploadedDate = GETDATE() WHERE videoPinID = :3;";
        $updated = $CONN->execute($updateSQL, array($name, $height, $email, $id));
    }
    else if ($videoType == 1){ //update embeded video data  
        $videoPath = $videoURL;
        $updateSQL = "UPDATE videoPin SET videoPinName =:0, height =:1, videoURL =:2, uploadedBy =:3, uploadedDate = GETDATE(), videoType =:4 WHERE videoPinID = :5;";
        $updated = $CONN->execute($updateSQL, array($name, $height, $videoURL, $email, $videoType, $id));
        $removeFile = true;    
    }
    else{ //update info and video data (upload)
        $videoPath = "../../Data/Projects/".$pid."/".$videoURL;
        $updateSQL = "UPDATE videoPin SET videoPinName =:0, height =:1, videoURL =:2, uploadedBy =:3, uploadedDate = GETDATE(), videoType =:4 WHERE videoPinID = :5;";
        $updated = $CONN->execute($updateSQL, array($name, $height, $videoPath, $email, $videoType, $id));
        $removeFile = true;
    }
    if($updated){
        $response['bool'] = true;
        $response['msg'] = "Update successful";
        $response['videoPath'] = $videoPath;
        if ( isset($removeFile) && file_exists($oldVideo['vURL'])){
            if (unlink($oldVideo['vURL'])) {   
                $response['delete'] = "Delete successful";
                $response['videoPath'] = $videoPath;
            }
        } 
    }else{
        $response['bool'] = false;
        $response['msg'] = "SQL error. Video record cant be updated.";
    }

    return $response;
}

function getLandList(){
    global $api_username, $api_password, $JOGETLINKOBJ;
    if($_SESSION['is_Parent'] == "isParent"){
        return;
    }
    $listName = $_POST['list'];
    switch($listName){
        case "landRegistration":
            $host = $JOGETLINKOBJ->getLink('cons_json_datalist_LA');
        break;  
        case "landIssue":
            $host = $JOGETLINKOBJ->getLink('cons_json_datalist_LI');
        break;
        default:
        return;
    }
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );
    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        $return = $err;
    } else {
        $return = json_decode($return);
    }

    return $return;
}

function getPackageList() {
    global $response, $CONN;

    $sql = "SELECT project_id_number, project_id, project_name, parent_project_id_number FROM projects WHERE parent_project_id_number =:0";
    $sqlResults = $CONN->fetchAll($sql, array($_SESSION['project_id']));

    if ($sqlResults) {
        $response['bool'] = true;
        $response['data'] = $sqlResults;
    } else {
        $response['bool'] = false;
        $response['msg'] = 'No AIC Image Records Found';
    }
    return $response;
}

function getProjectLayerList(){
    global $response, $CONN;

    if (!isset($_SESSION['project_id'])) { 
        $response['bool'] = false;
        $response['msg'] = 'No project id found!'; 
    }

    $pid = $_SESSION['project_id'];

    $fetchGeoLayers = $CONN->fetchAll("SELECT PL.Data_ID, PL.Layer_ID, PL.show_metadata, PL.Layer_Name, PL.Default_View, PL.Animation, DP.Data_Type, DP.Added_Date, DP.Data_Owner,
    MD.md_mission_id, MD.md_date_created, MD.md_start_time, MD.md_end_time, MD.md_meta_id, MD.md_data_category, DP.Offset, DP.X_Offset, DP.Y_Offset
    FROM Project_Layers PL LEFT JOIN Data_Pool DP ON PL.Data_ID = DP.Data_ID 
    LEFT JOIN metadata MD ON PL.meta_id = MD.md_meta_id 
    WHERE Project_ID =:0", array($pid));

    if ($fetchGeoLayers) {
        $response['bool'] = true;
        $response['data'] = $fetchGeoLayers;
    } else {
        $response['bool'] = false;
        $response['msg'] = 'An error occured';
    }
    
    return $response;
}

function renameLayer() {
    global $response, $CONN;
    $pid = $_SESSION['project_id'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);
    $layerName = filter_input(INPUT_POST, 'layer_name', FILTER_SANITIZE_STRING);

    $check = $CONN->fetchOne("SELECT count(*) FROM Project_Layers WHERE Data_ID =:0 AND Project_ID =:1", array($dataId, $pid));
    if ($check != 1) {
        $response['bool'] = false;
        $response['msg'] = "No record found";
        return;
    }

    $renameLayer = $CONN->execute("UPDATE Project_Layers SET Layer_Name =:0 WHERE Data_ID =:1 AND Project_ID =:2", array($layerName, $dataId, $pid));
    if (!$renameLayer) {
        $response['bool'] = false;
        $response['msg'] = "SQL Error while updating project!";
        return false;
    }
    $response['bool'] = true;

    return $response;
}

function switchAnimation() {
    global $response, $CONN;
    $pid = $_SESSION['project_id'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $animationInput = filter_input(INPUT_POST, 'animation', FILTER_SANITIZE_STRING);
    $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);

    if ($animationInput == "Disable") {
        $animationView = 1;
    } else {
        $animationView = 0;
    }

    $updateDefDisplay = $CONN->execute("UPDATE Project_Layers SET Animation =:0  WHERE Data_ID = :1 AND Project_ID = :2", array($animationView, $dataId, $pid));

    if (!$updateDefDisplay) {
        $response['bool'] = false;
        $response['msg'] = "SQL Error while update record!";
        return false;
    }
    $response['bool'] = true;
    return $response;
}

function switchDefaultDisplay() {
    global $response, $CONN;
    $pid = $_SESSION['project_id'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $defViewInput = filter_input(INPUT_POST, 'defView', FILTER_SANITIZE_STRING);
    $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);

    if ($defViewInput == "ON") {
        $defView = 0;
    } else {
        $defView = 1;
    }

    $updateDefDisplay = $CONN->execute("UPDATE Project_Layers SET Default_View =:0  WHERE Data_ID = :1 AND Project_ID = :2", array($defView, $dataId, $pid));

    if (!$updateDefDisplay) {
        $response['bool'] = false;
        $response['msg'] = "SQL Error while update record!";
        return false;
    }

    $selectGroupId = $CONN->fetchOne("SELECT layerGroup FROM Project_Layers WHERE Data_ID =:0 AND Project_ID =:1", array($dataId, $pid));
    $resGroupId = $selectGroupId;

    if ($selectGroupId) {
        if ($defView == 0) {
            $lyrUpdate = $CONN->execute("UPDATE groupLayers SET groupView =:0 WHERE groupID =:1", array($defView, $selectGroupId));
            if (!$lyrUpdate) {
                $response['bool'] = false;
                $response['msg'] = "Unable to update group layer details due to error in sql, please try again!";
            }
            $response['bool'] = true;
            $response['groupOff'] = $resGroupId;
        } else {
            $selectLayerId = $CONN->fetchOne("SELECT Layer_ID FROM Project_Layers WHERE layerGroup =:0 AND Default_View = '0'", array($resGroupId));
            if (!$selectLayerId) {
                $lyrUpdate = $CONN->execute("UPDATE groupLayers SET groupView = '1' WHERE groupID =:0", array($selectGroupId));
                if (!$lyrUpdate) {
                    $response['bool'] = false;
                    $response['msg'] = "Unable to update group layer details due to error in sql, please try again!";
                }
                $response['bool'] = true;
                $response['groupOn'] = $resGroupId;
            }
        }
    }
    $response['bool'] = true;
    return $response;
}

function detachLayer() {
    global $response, $CONN;
    $pid = $_SESSION['project_id'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);

    $check = $CONN->fetchOne("SELECT count(*) FROM Project_Layers WHERE Data_ID =:0 AND Project_ID =:1", array($dataId, $pid));
    if ($check != 1) {
        $response['bool'] = false;
        $response['msg'] = "No record found";
        return;
    }

    $deleteLayer = $CONN->execute("DELETE FROM Project_Layers WHERE Data_ID =:0 AND Project_ID =:1", array($dataId, $pid));
    if (!$deleteLayer) {
        $response['bool'] = false;
        $response['msg'] = "SQL Error while retrieving records!";
        return false;
    }
    $response['bool'] = true;
    return $response;
}

// function for Project Wise
function getPWDirectories() {
    global $response, $CONN, $PHPCACERTPATH;

    $pid = $_SESSION['project_id'];
    $user = $_SESSION['email'];
    $uResult=[];

    if (!isset($_SESSION['PWurl']) && !isset($_SESSION['PWcreds'])) {
        
        $selectPWInfo = $CONN->fetchAll("SELECT url, userNamePassword FROM configPwPBi WHERE projectID =:0 AND type =:1", array($pid, 'PW'));
        if (!$selectPWInfo) {
            $uResult['data'] = false;
            $uResult['msg'] =  "Unable to get the config details for ProjectWise from the database. Please set them at Project Admin Page.";

            return $uResult;
        } else {
            foreach ($selectPWInfo as $PWInfo) {
                $my_url = $PWInfo['url'];
                $base64 = $PWInfo['userNamePassword'];
                $_SESSION['PWurl'] = $PWInfo['url'];
                $_SESSION['PWcreds'] = $PWInfo['userNamePassword'];
            }
        }
    } else {
        $my_url = $_SESSION['PWurl'];
        $base64 = $_SESSION['PWcreds'];
    }

    $auth = 'Authorization: Basic '.$base64;
    
    $my_header = [];
    $my_header[0] =$auth;
    $my_header[1] ='Mas-App-Guid: 9eb0d286-a1a2-4945-ad8f-0a54087ec080';
    $my_header[2] = 'Mas-Uuid: fd9831d0-ff01-4e32-9bca-bcccf7b399d6';

    $folder = [];
    if (isset($_POST['instanceID'])) {
        $id = $_POST['instanceID'];
        // $id = 'StandardDisplayItemTypes--PW_WSG.02.04-Project-08eed0f8--49dd--456b--8702--b95b23f7497b';
        $url = $my_url.'Navigation/NavNode/'.$id.'/NavNode';
        //?$filter=HasChildren+eq+true
        
        $resp = get_data($url, $my_header);
        if ($resp) {
            $m = sizeof($resp['instances']);
            $documents = [];
            $a = 0;
            for ($j=0; $j<$m; $j++) {
                $instanceId = $resp['instances'][$j]['instanceId'];
                $Children = $resp['instances'][$j]['properties']['HasChildren'];
                if ($Children) {
                    $folder[$a]['id']= $resp['instances'][$j]['instanceId'];
                    $folder[$a]['text'] = $resp['instances'][$j]['properties']['Label'];
                    $folder[$a]['parent'] = $id;
                    $folder[$a]['folder'] = true;
                } elseif ($resp['instances'][$j]['properties']['Key_ClassName'] == "Document" ) {
                    $folder[$a]['id']= $resp['instances'][$j]['properties']['Key_InstanceId'];
                    $folder[$a]['text'] = $resp['instances'][$j]['properties']['Label'];
                    $folder[$a]['parent'] = $id;
                    $folder[$a]['folder'] = false;
                    $folder[$a]['ClassName'] = "Document";
                } elseif ($resp['instances'][$j]['properties']['Key_ClassName'] == "LogicalSet" ) {
                    $folder[$a]['id']= $resp['instances'][$j]['properties']['Key_InstanceId'];
                    $folder[$a]['text'] = $resp['instances'][$j]['properties']['Label'];
                    $folder[$a]['parent'] = $id;
                    $folder[$a]['ClassName'] = "LogicalSet";
                };
                $a++;
            }
            $uResult['msg'] = "success";
            $uResult['data'] = $folder;
        };
        echo (json_encode($uResult));
        exit;
    } else {
        $uResult['msg'] = "No instance ID";
        echo (json_encode($uResult));
    }
}

function getProjectWiseFolders() {
    global $response, $CONN, $PHPCACERTPATH;

    $pid = $_SESSION['project_id'];
    $user = $_SESSION['email'];
    $uResult=[];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $selectPWInfo = $CONN->fetchAll("SELECT url, userNamePassword FROM configPwPBi WHERE projectID =:0 AND type =:1", array($pid, 'PW'));
    if (!$selectPWInfo) {
        $uResult['data'] = false;
        $uResult['msg'] =  "Unable to get the config details for ProjectWise from the database. Please set them at Project Admin Page.";

        return $uResult;
    } else {
        foreach ($selectPWInfo as $PWInfo) {
            $my_url = $PWInfo['url'];
            $base64 = $PWInfo['userNamePassword'];
        }
    }

    $auth = 'Authorization: Basic '.$base64;
    #echo $auth;
    $my_header = [];
    $my_header[0] =$auth;
    $my_header[1] ='Mas-App-Guid: 9eb0d286-a1a2-4945-ad8f-0a54087ec080';
    $my_header[2] = 'Mas-Uuid: fd9831d0-ff01-4e32-9bca-bcccf7b399d6';
    $folder = [];


    if (isset($_POST['instanceID'])) {
        $id = $_POST['instanceID'];
        // $id = 'StandardDisplayItemTypes--PW_WSG.02.04-Project-fe123ff7--dd4a--4005--bb5c--0927337b2d92';
        $url = $my_url.'Navigation/NavNode/'.$id.'/NavNode?$filter=HasChildren+eq+true';
        //?$filter=HasChildren+eq+true
        $resp = get_data($url, $my_header);
        $uResult['data'] = $resp;
        echo (json_encode($uResult));
        exit;
    } else {
        $response = get_data($my_url, $my_header);
        $uResult['root'] = $response['instances'][0];
    
        $url = $my_url.'Navigation/NavNode';
        $resp = get_data($url, $my_header);
        $uResult['data'] = $resp['instances'];	
    
        echo(json_encode($uResult));	
        exit;
    }
}

function get_data($my_url, $headers) {
    global $PHPCACERTPATH;
    $certificate_location = $PHPCACERTPATH;
    $ch = curl_init();
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => $my_url,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_SSL_VERIFYPEER => $certificate_location,
        CURLOPT_SSL_VERIFYHOST => $certificate_location
    ));
    try {
        $res = curl_exec($ch);
        curl_close($ch);
        $obj = json_decode($res, true);
        return($obj);
    } catch (Error $e) {
        // Handle error
        $response['msg'] = $e->getMessage(); // Call to a member function method() on string
        return false;
    }
}

function saveModelAssetData() {
    global $response, $CONN;
    $pid = $_SESSION['project_id'];
    $user = $_SESSION['email'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    if (isset($_POST['model'])) {
        $model = $_POST['model'];
        $x = $model['x'];
        $y = $model['y'];
        $z =$model['z'];
        if ($model['shape']=='radiobox') {
            $shape = 0;
        } else {
            $shape = 1;
        }
        $width = $model['width'];
        $length = $model['length'];
        $height = $model['height'];
        $head = isset($model['head']) ? $model['head'] : 0;
        $picth = isset($model['picth']) ? $model['picth'] : 0;
        $roll = isset($model['roll']) ? $model['roll'] : 0;
    };

    $modeldetails = $_POST['modelDetails'];
    $layer_id =$modeldetails['layer_id'];
    $bldOwner =$modeldetails['bldOwner'];
    $bldType = $modeldetails['bldType'];
    $assetID = $modeldetails['assetID'];
    $assetName = $modeldetails['assetName'];
    $assetSLA = $modeldetails['assetSLA'];

    if (isset($modeldetails['entityid'])) {
        $entityID = $modeldetails['entityid'];
    }

    if (isset($model)) {
        $sqlData = [
            'project_id' => $pid,
            'layer_id' => $layer_id,
            'AssetID' => $assetID,
            'AssetName' => $assetName,
            'X' => $x,
            'Y' => $y,
            'Z' => $z,
            'Shape' => $shape,
            'Width' => $width,
            'Length' => $length,
            'Height' => $height,
            'AssetSLA' => $assetSLA,
            'BuildingOwner' => $bldOwner,
            'BuildingType' => $bldType,
            'Head' => $head,
            'Pitch' => $picth,
            'Roll' => $roll
        ];
        $insertAssetDataSQL = "INSERT INTO Asset_data (project_id, layer_id, AssetID, AssetName, X, Y, Z, Shape, Width, Length, Height, AssetSLA, BuildingOwner, BuildingType, Head, Pitch, Roll) values (:project_id, :layer_id, :AssetID, :AssetName, :X, :Y, :Z, :Shape, :Width, :Length, :Height, :AssetSLA, :BuildingOwner, :BuildingType, :Head, :Pitch, :Roll)";
        $statement = $CONN->prepare($insertAssetDataSQL);
        $sqlResult = $statement->execute($sqlData);
        
        if (!$sqlResult) {
            $response['bool'] = false;
            $response['msg'] = 'SQL Error while insert record!';
            return false;
        } else {
            $fetchAssetData = $CONN->fetchAll("SELECT * FROM Asset_data WHERE project_id =:0 AND layer_id =:1 AND AssetID =:2", array($pid, $layer_id, $assetID));
            foreach ($fetchAssetData as $assetData) {
                $data = $assetData;
            }

            $response['bool'] = true;
            $response['msg'] = 'Successfully Added.';
            $response['data'] = $data;
            return $response;
        }
    } else {
        $updateAssetData = $CONN->execute("UPDATE Asset_data SET layer_id =:0, AssetID =:1, AssetName =:2, AssetSLA =:3, BuildingOwner =:4, BuildingType =:5 WHERE project_id =:6 AND EntityID =:7", array($layer_id, $assetID, $assetName, $assetSLA, $bldOwner, $bldType, $pid, $entityID));
        
        if(!$updateAssetData) {
            $response['bool'] = false;
            $response['msg'] = 'SQL Error while update record!';
            return false;
        } else {
            $response['bool'] = true;
            $response['msg'] = 'Successfully Updated.';
            return $response;
        }
    }
}

function deleteImagePinData() {
    global $response, $CONN;

    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    $uResult = array();

    if (!isset($_POST['imagePinID'])) {
        $response['bool'] = false;
        $response['msg'] = "No variable input!";
        return;
    }
   
    $id = $_POST['imagePinID'];
    $imagePinName = $_POST['imagePinName'];
    $headType = $_POST['headType'];
    
    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $fetchImageURL = $CONN->fetchOne("SELECT imageURL FROM earthPin WHERE imagePinID =:0 AND projectID =:1", array($id, $pid));

    if (!$fetchImageURL) {
        $response['bool'] = false;
        $response['msg'] = 'An error occured';
        return;
    } else {
        $URL = $fetchImageURL;
        if (file_exists('../../'.$URL) && $headType == 0) {
            if (unlink('../../'.$URL)) {
                $response['bool'] = true;
                $response['msg'] = "Delete successful";
            } else {
                $response['bool'] = false;
                $response['msg'] = "Delete failed, record isn't removed";
                return;
            }   
        }

        $deleteImagePin = $CONN->execute("DELETE FROM earthPin WHERE imagePinID =:0 AND projectID =:1", array($id, $pid));
        if (!$deleteImagePin) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error!";
            return false;
        } else {
            $response['bool'] = true;
            $response['msg'] = "Successfully Deleted!";
        }
    }
}

function saveLocationData() {
    global $response, $CONN;

    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $lName = $_POST['lName'];
    $rName = $_POST['rName'];
    $lng = $_POST['lng'];
    $lat = $_POST['lat'];
    $status = '0%';
    
    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $sqlData = [
        'project_id' => $pid,
        'locationName' => $lName,
        'longitude' => $lng,
        'latitude' => $lat,
        'region' => $rName,
        'status' => $status
    ];

    $insertLocationDataSQL = "INSERT INTO locations (project_id, locationName, longitude, latitude, region, status) VALUES (:project_id, :locationName, :longitude, :latitude, :region, :status)";
    $statement = $CONN->prepare($insertLocationDataSQL);
    $sqlResult = $statement->execute($sqlData);

    if (!$sqlResult) {
        $response['bool'] = false;
        $response['msg'] = 'SQL Error while insert record!';
        return false;
    } else {
        $fetchLocationData = $CONN->fetchAll("SELECT * FROM locations WHERE locationName =:0 AND project_id =:1", array($lName, $pid));
        if (!$fetchLocationData) {
            $response['bool'] = false;
            $response['msg'] = 'Unable to fetch record!';
            return false;
        } else {
            $data = [];
            foreach ($fetchLocationData as $locationData) {
                $data = $locationData;
            }
            $response['bool'] = true;
            $response['msg'] = "Sucessfully Added";
            $response['data'] = $data;

            return $response;
        }
    }
}

function deleteLocationData() {
    global $response, $CONN;

    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $locationid = $_POST['locationID'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };
    
    $deleteFileData = $CONN->execute("DELETE FROM fileData WHERE locationID =:0", array($locationid));
    if (!$deleteFileData) {
        $response['bool'] = false;
        $response['msg'] = "Unable to delete the file data associated with the location. Please contact the database admin.";
        return false;
    }

    $deleteLocation = $CONN->execute("DELETE FROM locations WHERE locationID =:0", array($locationid));
    if (!$deleteLocation) {
        $response['bool'] = false;
        $response['msg'] = "Unable to delete the the location. Please contact the database admin.";
        return false;
    } else {
        $response['bool'] = true;
        $response['msg'] = "Deleted the location and the files associated with it successfully!";
        $response['result'] = true;
        return $response;
    }
}

function deleteModelAssetData() {
    global $response, $CONN;

    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $entityid = $_POST['EntityID'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $deleteAssetData = $CONN->execute("DELETE FROM Asset_data WHERE EntityID =:0", array($entityid));
    if (!$deleteAssetData) {
        $response['bool'] = false;
        $response['msg'] = "Unable to delete the model asset data. Please contact the database admin.";
        return $response;
    } else {
        $response['bool'] = true;
        $response['msg'] = "Deleted the asset data successfully!";
        return $response;
    }
}

function saveProjectwiseFileData() {
    global $response, $CONN;
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $locationid = $_POST['lID'];
    $status = $_POST['status'];
    $id = $_POST['instanceId'];
    $path = $_POST['filePath'];
    $fileMethod = $_POST['fileMethod'];
   
    $myresult = [];

    $msg = "";

    if ($fileMethod == 'sp') {
        $sql = "UPDATE locations SET  status ='$status', sharepointPath = '$path', folderID = '$id' WHERE locationID = '$locationid'";
        $updateFileData = $CONN->execute("UPDATE locations SET status =:0, sharepointPath =:1, folderID =:2 WHERE locationID =:3", array($status, $path, $id, $locationid));
    } else {
        $sql = "UPDATE locations SET  status ='$status', projectwisePath = '$path', folderID = '$id' WHERE locationID = '$locationid'";
        $updateFileData = $CONN->execute("UPDATE locations SET status =:0, projectwisePath =:1, folderID =:2 WHERE locationID =:3", array($status, $path, $id, $locationid));
    }
    
    if (!$updateFileData) {
        $myresult['msg'] = "Unable to update the status and path to database.";
        $myresult['data'] = false;
        return $myresult;
        
    } else {
        $myresult['msg'] = "Updated the status and path to database.";
        $myresult['data'] = true;
        return $myresult;
    }
    
}

function saveImagePinData() {
    global $response, $CONN, $IS_DOWNSTREAM;
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $uResult = array();
    if (!isset($_POST)) {
        $response['msg'] = 'No variable input!'; 
        return $response;
    }
    $data = json_decode($_POST['fileInfo']);
    $name = $data->name;
    $long = $data->longitude;
    $lat = $data->latitude;
    $height = $data->height;
    $imageName = $data->imageName;
    $headImage = $data->initialHead;
    $headChoice = $data->choice;

    if(($long == NULL) || ($long == "")) {$long = "0.00";}
    if(($lat == NULL) || ($lat == "")) {$lat = "0.00";}
    if(($height == NULL) || ($height == "")) {$height = "0.00";}

    if ($headChoice == 1) {
        $clickX = $data->clickX;
    }

    if (!file_exists("../../Data/Projects/".$pid."/")) {
        mkdir("../../Data/Projects/".$pid."/", 0777, true);
    }

    if (isset($_FILES['imageFile']) && !empty($_FILES['imageFile']['name'])) {
        $imageFName = $_FILES['imageFile']['name'];
        $file_tmp =$_FILES['imageFile']['tmp_name']; 
        
        $destination = "../../Data/Projects/".$pid."/".$imageName;
        if($IS_DOWNSTREAM){
            if(move_uploaded_file($file_tmp, $destination)){
                shell_exec('icacls "' . $destination . '" /grant IIS_IUSRS:F');
            }else{
                $response['msg'] = "Files upload failed";
            }
        }else{
            move_uploaded_file($file_tmp, $destination);
        }
    } else {
        $response['msg'] = "Files is not attached";
    }
    
    $imageURL = "Data/Projects/".$pid."/".$imageName;
    
    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $sqlData = [
        'projectID' => $pid,
        'imagePinName' => $name,
        'longitude' => $long,
        'latitude' => $lat,
        'height' => $height,
        'imageURL' => $imageURL,
        'uploadedBy' => $user,
        'uploadedDate' => date("Y-m-d H:i:s", strtotime('now')),
        'initHeading' => ($headImage) ? $headImage : '',
        'initChoice' => ($headChoice) ? $headChoice : ''
    ];

    if ($headChoice == 1) {
        $sqlData['initClick'] = $clickX;
        $insertEarthImageSQL = "INSERT INTO earthPin (projectID, imagePinName, longitude, latitude, height, imageURL, uploadedBy, uploadedDate, initHeading, initChoice, initClick) VALUES (:projectID, :imagePinName, :longitude, :latitude, :height, :imageURL, :uploadedBy, :uploadedDate, :initHeading, :initChoice, :initClick)";
    } else {
        $insertEarthImageSQL = "INSERT INTO earthPin (projectID, imagePinName, longitude, latitude, height, imageURL, uploadedBy, uploadedDate, initHeading, initChoice) VALUES (:projectID, :imagePinName, :longitude, :latitude, :height, :imageURL, :uploadedBy, :uploadedDate, :initHeading, :initChoice)";
    }
    
    $statement = $CONN->prepare($insertEarthImageSQL);
    $sqlResult = $statement->execute($sqlData);

    if (!$sqlResult) {
        $response['bool'] = false;
        $response['msg'] = 'SQL Error while insert record!';
        return false;
    } else {
        $fetchEarthImage = $CONN->fetchAll("SELECT * from earthPin WHERE projectID =:0 AND imagePinName =:1 AND longitude =:2 AND latitude =:3", array($pid, $name, $long, $lat));
        if (!$fetchEarthImage) {
            $response['bool'] = false;
            $response['msg'] = 'Unable to fetch record!';
            return false;
        } else {
            $data = [];
            foreach ($fetchEarthImage as $earthImageData) {
                $response['data'] = $earthImageData;
            }
            $response['bool'] = true;
            $response['msg'] = "Sucessfully Added";
            $response['imageName'] = $imageFName;
            return $response;
        }
    }
}

function updateImagePinData() {
    global $response, $CONN;
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $uResult = array();
    if (!isset($_POST)) {
        $response['msg'] = 'No variable input!'; 
        return $response;
    }

    $data = json_decode($_POST['fileInfo']);
    $id = $data->id;
    $name = $data->name;
    $long = $data->longitude;
    $lat = $data->latitude;
    $height = $data->height;
    $imageName = $data->imageName;
    $headImage =$data->initialHead;
    $headChoice =$data->choice;
    $flagUpdateImage = true;
    $clickX = $data->clickX;
    $uploadedDate = date("Y-m-d H:i:s", strtotime('now'));

    if (!file_exists("../../Data/Projects/".$pid."/")) {
        mkdir("../../Data/Projects/".$pid."/", 0777, true);
    }

    if (isset($_FILES['imageFile']) && !empty($_FILES['imageFile']['name'])) {
        $imageFName = $_FILES['imageFile']['name'];
        $file_tmp = $_FILES['imageFile']['tmp_name'];
        move_uploaded_file($file_tmp, "../../Data/Projects/".$pid."/".$imageName);
        $imageURL = "Data/Projects/".$pid."/".$imageName;
    } else {
        $flagUpdateImage = false;
        $imageURL = $imageName;
    }

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    if ($flagUpdateImage) {
        $updateImageData = $CONN->execute("UPDATE earthPin SET imagePinName =:0, height =:1, imageURL =:2, uploadedBy =:3, uploadedDate =:4, initHeading =:5, initChoice =:6, initClick =:7 WHERE projectID =:8 AND imagePinID =:9", array($name, $height, $imageURL, $user, $uploadedDate, $headImage, $headChoice, $clickX, $pid, $id));
    } else {
        $updateImageData = $CONN->execute("UPDATE earthPin SET imagePinName =:0, height =:1, uploadedBy =:2, uploadedDate =:3, initHeading =:4, initChoice =:5, initClick =:6 WHERE projectID =:7 AND imagePinID =:8", array($name, $height, $user, $uploadedDate, $headImage, $headChoice, $clickX, $pid, $id));
    }

    if (!$updateImageData) {
        $myresult['msg'] = "Unable to update the status and path to database.";
        $myresult['imagePath'] = false;
        return $myresult;
        
    } else {
        $myresult['msg'] = "Successfully Updated!";
        $myresult['imagePath'] = $imageURL;
        $myresult['clickX'] = $clickX;
        return $myresult;
    }
}

function updateLayerInfo() {
    global $response, $CONN;
    $email = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    $check = checkIfProjectAdmin();
    $response['newMetaId'] = 'undefined';

    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $uResult = array();
    if (!isset($_POST)) {
        $response['msg'] = 'No variable input!'; 
        return $response;
    }

    $data = json_decode($_POST['LayerFileInfo']);
    $id = $data->layerID;
    $name = $data->layerName;
    $layerFileName = isset($data->layerFileName) ? $data->layerFileName : "";
    $layerDataType = isset($data->layerDataType) ? $data->layerDataType : "";
    $uploadedDate = date("Y-m-d H:i:s", strtotime('now'));
  
    $missionCycleId = $data->missionCycleId;
    $layerDate = $data->layerDate; 
    $layerStartTime = $data->layerStartTime;
    $layerEndTime = $data->layerEndTime;
    $metaId = $data->metaId;
    $projectLayerId = $data->projectLayerId;
    $updateLayerFile = isset($data->updateLayerFile) ? $data->updateLayerFile : "";
    $layerURL = $name;
    
    $showMetadataFlag = isset($data->showMetadataFlag) && $data->showMetadataFlag == 'true' ? 'true' : 'false';


    // Upload directory
    $kmlLocation = "../../Data/KML/";
    $shpLocation = "../../Data/Geoserver/Shapefile/";
    $b3dmLocation = "../../Data/3DTiles/";
    // $response['msg'] = $id;
    // return $response; 
    
    
    if($showMetadataFlag == 'false'){
        $updateProjectLayersSQL = $CONN->execute("UPDATE Project_Layers SET Modified_By=:0, Modified_Date=:1, show_metadata=:2 WHERE Layer_ID=:3", array($email, $uploadedDate, $showMetadataFlag, $projectLayerId));

        if (!$updateProjectLayersSQL) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while binding layer to project!";
            return false;
        } 
        $response['bool'] = true;
        $response['msg'] = "Successfully Hide Metadata!"; 
        return $response;
    }else if(!empty($metaId) && $metaId != "null" && $showMetadataFlag == 'true'){

        $updateProjectLayersSQL = $CONN->execute("UPDATE Project_Layers SET Modified_By=:0, Modified_Date=:1, meta_id=:2, show_metadata=:3 WHERE Layer_ID=:4", array($email, $uploadedDate, $metaId, $showMetadataFlag, $projectLayerId));

        if (!$updateProjectLayersSQL) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while binding layer to project!";
            return false;
        }
        
        $updateMetadataSQL = $CONN->execute("UPDATE metadata SET Modified_By=:0, Modified_Date=:1, md_mission_id=:2, md_date_created=:3, md_start_time=:4, md_end_time=:5  WHERE md_meta_id=:6", array($email, $uploadedDate, $missionCycleId, $layerDate, $layerStartTime, $layerEndTime, $metaId));
    
        if (!$updateMetadataSQL) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while binding layer to project!";
            return false;
        }

        $response['bool'] = true;
        $response['msg'] = "Successfully updated Project Layer and Metadata"; 
        return $response;
    }else if((empty($metaId) || $metaId == "null" || $metaId =='') && $showMetadataFlag == 'true'){ 
        $insertMetadataSQL = $CONN->execute("INSERT INTO metadata (Modified_By, Modified_Date, md_data_category, md_mission_id, md_date_created,  md_start_time, md_end_time) VALUES ('$email', '$uploadedDate', '1', '$missionCycleId', '$layerDate', '$layerStartTime', '$layerEndTime')");
        
        
        if (!$insertMetadataSQL) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while binding layer to project!";
            return false;
        }


        $metaId = $CONN->fetchOne("SELECT MAX(md_meta_id) FROM metadata");

        if($metaId == NULL){
            $metaId = '';
        }else{
            $metaId = $metaId;
        }
 
        $updateProjectLayersSQL = $CONN->execute("UPDATE Project_Layers SET Modified_By=:0, Modified_Date=:1, meta_id=:2, show_metadata=:3 WHERE Layer_ID=:4", array($email, $uploadedDate, $metaId, $showMetadataFlag, $projectLayerId));

        if (!$updateProjectLayersSQL) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while binding layer to project!";
            return false;
        }
        
        $response['bool'] = true;
        $response['msg'] = "Successfully updated Project Layer and Metadata"; 
        $response['newMetaId'] = $metaId; 
        return $response;
        
    }else{
        $response['bool'] = true;
        $response['msg'] = "Condition not met. Please contact admin."; 
        return $response;
    }

    
    if ($updateLayerFile){
        if($layerDataType == "KML"){
            $layerFName = $_FILES['layerFile']['name'];
            $path = $kmlLocation.$layerFName;
    
            $file_extension = pathinfo($path, PATHINFO_EXTENSION);
            $file_extension = strtolower($file_extension);
    
            $valid_ext = array("","kml","kmz");
    
            if(in_array($file_extension,$valid_ext)){
                // Upload file
                if(move_uploaded_file($_FILES['layerFile']['tmp_name'],$path)){
                    $layerURL = "../Data/KML/".$layerFName;
                } 
            }
        }else{
            // Count total files
            $countfiles = count($data->layerFile);
            $count = 0; 
            for($i=0;$i < $countfiles;$i++){
    
            if($layerDataType == "B3DM"){
                    $layerId = "layerFile".$i;
                    $layerFName = $_FILES[$layerId]['name'];
                    $path = $b3dmLocation.$name."/".$layerFName;
    
                    $file_extension = pathinfo($path, PATHINFO_EXTENSION);
                    $file_extension = strtolower($file_extension);
    
                    $valid_ext = array("","b3dm","json");
    
                    if(in_array($file_extension,$valid_ext)){
                        // Upload file
                        if(move_uploaded_file($_FILES[$layerId]['tmp_name'],$path)){
                            if($file_extension == 'json') { // catch largest json file 
                                $layerURL = "../Data/3DTiles/".$name."/".$layerFName;
                            }
                        }
                    }
                }else {
                    $layerId = "layerFile".$i;
                    $layerFName = $_FILES[$layerId]['name'];
                    $path = $shpLocation.$name."/".$layerFName;
    
                    $file_extension = pathinfo($path, PATHINFO_EXTENSION);
                    $file_extension = strtolower($file_extension);
    
                    $valid_ext = array("","shp","shx","dbf","sbn","sbx","fbn","fbx","ain","aih","atx","ixs","mxs","prj","xml","cpg");
    
                    if(in_array($file_extension,$valid_ext)){
                        // Upload file
                        if(move_uploaded_file($_FILES[$layerId]['tmp_name'],$path)){
                            if($file_extension == "shp"){
                                $lastIndex = explode(".",$layerFName);
                                $foldername = $lastIndex[0];
                                $layerURL = $foldername;
                            }
                        }
                    }
                }
            }
        }
            
        $updateLayerData = $CONN->execute("UPDATE Data_Pool SET Data_URL =:0, Modified_Date =:1, Modified_By =:2 WHERE Data_ID =:3", array($layerURL, $uploadedDate, $email, $id));
        
        if (!$updateLayerData) {
            $response['msg'] = "Unable to update the status and path to database.";
            $response['layerPath'] = false;
            return $response;
        } else {
            $updateLyrSQL = $CONN->execute("UPDATE Project_Layers SET Modified_By=:0, Modified_Date=:1 WHERE Data_ID=:2 AND Project_ID=:3", array($email, $uploadedDate, $id, $pid));
    
            if (!$updateLyrSQL) {
                $response['bool'] = false;
                $response['msg'] = "SQL Error while binding layer to project!";
                return false;
            }else{
                $response['bool'] = true;
                $response['msg'] = "Successfully Updated!";
                $response['layerPath'] = $layerURL;
                $response['layerName'] = $name;
                return $response;
            }
        }
    }else{
        $response['bool'] = true;
        $response['msg'] = "Successfully Updated!";
        $response['layerPath'] = $layerURL;
        $response['layerName'] = $name;
        return $response;
    }
    
    
}

function attachOrDetachLayer(){
    global $response;
    global $CONN;
    $email = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $data_attach = filter_input(INPUT_POST, 'val', FILTER_SANITIZE_STRING);
    $data_id     = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);
    $defaultView = filter_input(INPUT_POST, 'defaultView', FILTER_VALIDATE_BOOLEAN);
    $lyr_name    = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);

    $checkLayer = $CONN->fetchOne("SELECT * FROM Project_Layers WHERE Project_ID =:0 AND Data_ID =:1", array($pid, $data_id));  //check attached or not
    
    if($checkLayer){
        $checkAttached = true; 
    }else{
        $checkAttached = false;
    }

    $checkData = $CONN->fetchRow("SELECT Share, Data_Owner_PID FROM Data_Pool WHERE Data_ID =:0", array($data_id));   
    
    if($checkData['Share'] == true){    //data is shared

        if($data_attach == 'Attach' && $checkAttached === false){
            $execution = $CONN->execute("INSERT INTO Project_Layers ([Data_ID],[Layer_Name],[Project_ID],[zindex],[Default_View],[Attached_By],[Attached_Date]) VALUES (:0, :1, :2, '1', :3, :4, GETDATE())", array($data_id, $lyr_name, $pid, $defaultView, $email));
        }
        else if($data_attach == 'Detach' && $checkAttached === true){
            $execution = $CONN->execute("DELETE FROM Project_Layers WHERE Project_ID =:0 AND Data_ID =:1", array($pid, $data_id));
        }
        else{
            $response['bool'] = false;
            $response['msg'] = "Error";
            return false;
        }
        
        if($execution){
            $response['bool'] = true;
            $response['msg'] = "Successful";
            return $response;
        }else{
            $response['bool'] = false;
            $response['msg'] = "SQL execution failed";
            return false;
        }

    }else{  //not shared, need to check if it is project owner or not

        if($checkData['Data_Owner_PID'] == $pid){

            if($data_attach == 'Attach' && $checkAttached === false){
                $execution = $CONN->execute("INSERT INTO Project_Layers ([Data_ID],[Layer_Name],[Project_ID],[zindex],[Default_View],[Attached_By],[Attached_Date]) VALUES (:0, :1, :2, '1', :3, :4, GETDATE())", array($data_id, $lyr_name, $pid, $defaultView, $email));
            }
            else if($data_attach == 'Detach' && $checkAttached === true){
                $execution = $CONN->execute("DELETE FROM Project_Layers WHERE Data_ID =:0 AND Project_ID =:1", array($data_id, $pid));
            }
            else{
                $response['bool'] = false;
                $response['msg'] = "Error";
                return false;
            }
            
            if($execution){
                $response['bool'] = true;
                $response['msg'] = "Successful";
                return $response;
            }else{
                $response['bool'] = false;
                $response['msg'] = "SQL execution failed";
                return false;
            }

        }
        else{   //not owner, return
            $response['bool'] = false;
            $response['data'] = "Insufficient Credentials";
            return false;
        }
    }

    echo json_encode($response);
}
function docViewer() {
    global $PHPCACERTPATH;
    $constructLinkObj = new JogetLink();
    
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    include_once('sharePoint.func.php');
    
    $website_url = $constructLinkObj->riHost.'BackEnd/'; //This Variable is use for M.office and cad file at it use the url to be display
    
    
    if (isset($_SESSION['user_id'])) {
        $user_id =$_SESSION['user_id'].'user';
    } else {
        $uResult['msg'] = "invalid user. ";
        echo(json_encode($uResult));
        exit();
    }
    $folder = 'doc_temp'; // #demo. add variable for user session ID. Also used for directory of the file.

    // data from RI
    $uResult = [];
    $fileName = $_POST['fileName'];
    $fileUrl = $_POST['fileUrl'];
    
    if (isset($_POST['fileMethod']) &&  $_POST['fileMethod'] == 'sp') {
        //#######################################
        //This side handle SharePoint Doc Viewer
        include_once('../login/include/db_connect.php');
        //This is to create the user folder if not exist 
        $folder = 'doc_temp/sp';
        if (!file_exists($folder.'/'.$user_id)) {
            mkdir($folder.'/'.$user_id, 0777, true);
        }
        array_map('unlink', array_filter((array) glob($folder.'/'.$user_id."/*")));
        
        $pp_id = $_SESSION['project_id'];
        $sql = "SELECT * FROM configSP WHERE project_id = '$pp_id'";
        $stmt = sqlsrv_query($conn, $sql);
        if ($stmt === false) {
            die(print_r(sqlsrv_errors(), true));
        }
        while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
            $fileMethod = $_SESSION['file_method'];
            $spUrl = $row['url'].'/sites/'.$row['site_repo'];
            $spTenantId =  $row['tenant_id'];
            $spClientId =  $row['client_id'];
            $spClientSecret =  $row['client_secret'];
            $spSiteRepo =  $row['site_repo'];
        }
        $ret = array();
        $spInfo = array(
            'url' => $spUrl,
            'tenant_id' => $spTenantId,
            'client_id' => $spClientId,
            'client_secret' => $spClientSecret
        );
        $url = $spUrl;
        $output_spPath = $folder.'/'.$user_id.'/'.$fileName; // to set the file path in the server
        $fileName_exp = explode('.',$fileName);
        $file_extension = end($fileName_exp);
        $output_filename = getFile($spInfo, $fileUrl, $output_spPath );
       
    } else {
        //#######################################
        //This side handle ProjectWise Doc Viewer
        
        //This is to create the user folder if not exist 
        if (!file_exists($folder.'/'.$user_id)) {
            mkdir($folder.'/'.$user_id, 0777, true);
        }
        
        if (isset ($_POST['userName']) && isset($_POST['passWord'])) {
            $username = $_POST['userName'];
            $password = $_POST['passWord'];
            $_SESSION['pwUsername'] = $username;
            $_SESSION['pwPassword'] = $password;
        } else {
            if (isset($_SESSION['pwUsername']) && isset($_SESSION['pwPassword'])) {
                $username = $_SESSION['pwUsername'];
                $password = $_SESSION['pwPassword'];
            } else {
                $uResult['msg'] = "Need PW Credentials to view the file. Please provide them";
                echo(json_encode($uResult));
                exit();
            }
        }
        
        //filename ID
        $filename_arr = explode('/', $fileUrl);
        $count_of_elements = count($filename_arr);
        $file_name = $filename_arr[$count_of_elements - 2];
        
        //file extension
        $filename_arr = explode(".", $fileName);
        $count_of_elements = count($filename_arr);
        $file_extension = $filename_arr[$count_of_elements - 1];
        
        //This area is to check if the file is already exist in the temp folder
        //########################
        $match = 0;
        $files = glob($folder .'/'.$user_id. '/*');
        foreach ($files as $file) {
            //Make sure that this is a file and not a directory.
            if (is_file($file)) {
                if (preg_match( '#'.$file_name.'#', $file)) {
                    $match = 1;
                }
            }
        }
        //#########################
        
        $output_filename = $folder.'/'.$user_id.'/'.$file_name.'.'.$file_extension; // to set the file path in the server
        
        //Download the file if no match
        //##########################################
        if ($match == 0) {
            $certificate_location = $PHPCACERTPATH;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $fileUrl);
            curl_setopt($ch, CURLOPT_VERBOSE, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $certificate_location);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $certificate_location);
            curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
            curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            try {
                $result = curl_exec($ch);
                $check = json_decode($result,true);
                if ($check && isset($check['errorMessage'])) {
                    $uResult['msg'] = $check['errorMessage'];
                    echo(json_encode ($uResult));
                    exit;
                }
            }
            catch (Error $e) {
                // Handle error
                $uResult['msg'] = $e->getMessage();
                echo(json_encode($uResult));
            }
            
            curl_close($ch);
            // the following lines write the contents to a file in the same directory (provided permissions etc)
            $fp = fopen($output_filename, 'w');
            fwrite($fp, $result);
            fclose($fp);
        }
        //##########################################
    }
    
    $file_url = $website_url.$output_filename;
    $file_extension = strtolower($file_extension);
    $path  = "BackEnd/".$output_filename;
    
    $PPdocx_Ext = array ('docx', 'docm', 'dotm', 'dotx', 'doc', 'pptx', 'ppsx', 'ppt', 'pps', 'pptm', 'potm', 'ppam', 'potx', 'ppsm'); // docx and pptx limit 10mb
    $excel_Ext = array ('xlsx','xlsb', 'xls', 'xlsm'); // excel file limit 5 mb
    $imageView = array ('jpg', 'jpeg', 'png'); //filetype for image viewer
    
    if (in_array($file_extension, $PPdocx_Ext)) {
        if ((filesize($output_filename)/1000000) < 10) {
            $url = "https://view.officeapps.live.com/op/view.aspx?src=".$file_url;
            $uResult['fileurl'] = $url;
            $uResult['msg'] = "success";
            $uResult['type'] = "external";
            echo(json_encode($uResult));
        } else {
            // Check file is exists on given path.
            if(file_exists('../'.$path))
            {
                $uResult['msg'] = "download";
                $uResult['fileurl'] = $path;
                echo( json_encode($uResult));
                exit;
            }else {
                $uResult['msg'] = 'Unable to download the file';
                echo(json_encode($uResult));
            }
        } 
    } else if (in_array($file_extension, $excel_Ext)) {
        if ((filesize($output_filename)/1000000) < 5) {
            $url = "https://view.officeapps.live.com/op/view.aspx?src=".$file_url;
            $uResult['fileurl'] = $url;
            $uResult['msg'] = "success";
            $uResult['type'] = "external";
            echo(json_encode($uResult));
        } else {
            // Check file is exists on given path.
            if(file_exists('../'.$path))
            {
                $uResult['msg'] = "download";
                $uResult['fileurl'] = $path;
                echo( json_encode($uResult));
                exit;
            }else {
                $uResult['msg'] = 'Unable to download the file';
                echo(json_encode($uResult));
            
            }
        }
    } else if ($file_extension == 'pdf') {
        if ((filesize($output_filename)/1000000) < 20) {
            $url = "BackEnd/pdf_viewer.php?file_name=".$output_filename;
            $uResult['fileurl'] = $url;
            $uResult['msg'] = "success";
            echo(json_encode($uResult));
        } else {
            // Check file is exists on given path.
            if(file_exists('../'.$path))
            {
                $uResult['msg'] = "download";
                $uResult['fileurl'] = $path;
                echo( json_encode($uResult));
                exit;
            }else {
                $uResult['msg'] = 'Unable to download the file';
                echo(json_encode($uResult));
            
            }
        }
    } else if ($file_extension == 'dwg') {
        if ((filesize($output_filename)/1000000) < 30 ) {
            $url ="//sharecad.org/cadframe/load?url=".$file_url;
            $uResult['fileurl'] = $url;
            $uResult['msg'] = "success";
            echo(json_encode($uResult));
        } else {
            if(file_exists('../'.$path))
            {
                $uResult['msg'] = "download";
                $uResult['fileurl'] = $path;
                echo( json_encode($uResult));
                exit;
            }else {
                $uResult['msg'] = 'Unable to download the file';
                echo(json_encode($uResult));
            
            }
        }
    } else if ($file_extension == 'txt') {
        if ((filesize($output_filename)/1000000) < 10) {
            $url ="BackEnd/txt_viewer.php?file_name=".$output_filename;
            $uResult['fileurl'] = $url;
            $uResult['msg'] = "success";
            echo(json_encode($uResult));
        } else {
            // Check file is exists on given path.
            if(file_exists('../'.$path))
            {
                $uResult['msg'] = "download";
                $uResult['fileurl'] = $path;
                echo( json_encode($uResult));
                exit;
            }else {
                $uResult['msg'] = 'Unable to download the file';
                echo(json_encode($uResult));
            
            }
        }
    } else if (in_array($file_extension, $imageView)) {
        if ((filesize($output_filename)/1000000) < 10) {
            $url ="BackEnd/image_viewer.php?file_name=".$output_filename;
            $uResult['fileurl'] = $url;
            $uResult['msg'] = "success";
            echo(json_encode($uResult));
        } else {
            // Check file is exists on given path.
            if(file_exists('../'.$path))
            {
                $uResult['msg'] = "download";
                $uResult['fileurl'] = $path;
                echo( json_encode($uResult));
                exit;
            }else {
                $uResult['msg'] = 'Unable to download the file';
                echo(json_encode($uResult));
            
            }
        }
    } else {
        if(file_exists('../'.$path))
        {
            $uResult['msg'] = "download";
            $uResult['fileurl'] = $path;
            echo( json_encode($uResult));
            exit;
        }else {
            $uResult['msg'] = 'Unable to download the file';
            echo(json_encode($uResult));
            
        }
    }
    die;
}

function getConfigDetailsPWPBi() {
    global $response, $CONN;
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $fetchPWConfig = $CONN->fetchAll("SELECT configID, projectID, type, userName, url FROM configPwPBi WHERE projectID =:0", array($pid));
    if (!$fetchPWConfig) {
        $response['bool'] = false;
        $response['msg'] = 'Unable to fetch record!';
        return false;
    } else {
        $data = [];
        foreach ($fetchPWConfig as $pw_config) {
            $data[] = $pw_config;
        }
        $response['bool'] = true;
        $response['msg'] = "Config Fetched";
        $response['data'] = $data;
        return $response;
    }
}

function getAppLink() {
    global $response, $CONN;
    global $SYSTEM, $IS_DOWNSTREAM;
    $user_id = $_SESSION['user_id'];

    $parentProject_id = filter_input(INPUT_POST, 'project_id_number', FILTER_SANITIZE_STRING);
    $package_id = filter_input(INPUT_POST, 'package_id', FILTER_SANITIZE_STRING);
    $project_owner = filter_input(INPUT_POST, 'projectOwner', FILTER_SANITIZE_STRING);
    $project_phase = filter_input(INPUT_POST, 'projectPhase', FILTER_SANITIZE_STRING);

    $fetchProject =  $CONN->fetchRow("SELECT * from project_apps_process WHERE project_id = :0", array($parentProject_id));

    $fetchProjectRole = $CONN->fetchRow("SELECT Pro_Role from pro_usr_rel WHERE Usr_ID = :0 AND Pro_ID =:1", array($user_id, $package_id));

    if($SYSTEM == 'OBYU'){
        $fetchProjectDetails = $CONN->fetchRow("SELECT project_id, parent_project_id_number, project_name, project_owner, owner_org_id, Project_type, project_wpc_id, latitude_1, latitude_2, longitude_1, longitude_2 from projects WHERE project_id_number = :0", array($package_id));
        if($fetchProjectDetails['parent_project_id_number'] != null){

            $_SESSION['parent_project_id'] =   $CONN->fetchOne("SELECT project_id from projects WHERE project_id_number = :0", array($fetchProjectDetails['parent_project_id_number']));
        }
    }else{
        $fetchProjectDetails = $CONN->fetchRow("SELECT project_id, project_name, project_owner, Project_type, project_wpc_id, latitude_1, latitude_2, longitude_1, longitude_2, location as loc, project_phase, wpc_abbr from projects WHERE project_id_number = :0", array($package_id));
    }

    $fetchParentProjectDetails = $CONN->fetchRow("SELECT project_id from projects WHERE project_id_number = :0", array($parentProject_id));

    $fetchUserDetails = $CONN->fetchRow("SELECT user_email, user_org from users WHERE user_id = :0", array($user_id));

    $project_owner = ($SYSTEM == 'OBYU') ? $fetchProjectDetails['owner_org_id'] : $fetchProjectDetails['project_owner'];

    if($project_owner == 'SSLR2'){
        if($IS_DOWNSTREAM){
            $access_control = json_decode(file_get_contents("access\accessControl_SSLR2_DOWNSTREAM.json"), true);
        }else{
            $access_control = json_decode(file_get_contents("access\accessControl_SSLR2.json"), true);
        }
    }else{
        $access_control = json_decode(file_get_contents("access\accessControl_".$project_owner.".json"), true);
    }

    $_SESSION['project_owner'] = ($SYSTEM == 'OBYU') ? $fetchProjectDetails['owner_org_id'] : $fetchProjectDetails['project_owner'];

    $latitude1 = ((float)$fetchProjectDetails['latitude_1'] == 0) ? NULL : $fetchProjectDetails['latitude_1'];
    $latitude2 = ((float)$fetchProjectDetails['latitude_2'] == 0) ? NULL : $fetchProjectDetails['latitude_2'];
    $longitude1 = ((float)$fetchProjectDetails['longitude_1'] == 0) ? NULL : $fetchProjectDetails['longitude_1'];
    $longitude2 = ((float)$fetchProjectDetails['longitude_2'] == 0) ? NULL : $fetchProjectDetails['longitude_2'];

    $_SESSION['projectID'] = $fetchProjectDetails['project_id'] ;
    $_SESSION['project_name'] = $fetchProjectDetails['project_name'] ;
    $_SESSION['project_phase'] = $fetchProjectDetails['project_phase'] ;
    $_SESSION['wpc_abbr'] = $fetchProjectDetails['wpc_abbr'] ;
    $_SESSION['location'] = ($SYSTEM == 'KKR') ? $fetchProjectDetails['loc'] : "";
    
    $data['currUserEmail'] = $fetchUserDetails['user_email'];
    $data['currUserOrg'] = $fetchUserDetails['user_org'];
    $data['currPackageId'] = $fetchProjectDetails['project_id'] ;
    $data['currProjectId'] = $fetchParentProjectDetails['project_id'];
    $data['currUserRole'] = $fetchProjectRole['Pro_Role'];
    $data['currPackageName'] = $fetchProjectDetails['project_name'];
    $data['currProjectOwner'] = ($SYSTEM == 'OBYU') ? $fetchProjectDetails['owner_org_id'] : $fetchProjectDetails['project_owner'];
    $data['currWPCId'] = $fetchProjectDetails['project_wpc_id'];
    $data['project_type'] = $fetchProjectDetails['Project_type'];
    $data['project_phase'] = $fetchProjectDetails['project_phase'];
    $data['wpc_abbr'] = $fetchProjectDetails['wpc_abbr'];

    $data['pid'] = $package_id;
    $data['currPackageUuid'] = $package_id."_". $fetchProjectDetails['project_id']. "_" . $package_id;

    if($SYSTEM == 'KKR'){
        $getPreloadAccess = preloadAccessKKR($fetchProject, $project_owner, $fetchUserDetails['user_org'], $fetchProjectRole['Pro_Role'], $fetchProjectDetails['Project_type'], $project_phase);
    }else{
        $getPreloadAccess = preloadAccessOBYU($fetchProject, $project_owner, $fetchUserDetails['user_org'], $fetchProjectRole['Pro_Role']);
    }

    $getpreloadJogetLink = preloadJogetLink($fetchProject, $fetchProjectDetails['Project_type'], $data);
    $getpreloadLocationData = preloadLocationData($package_id);

    if($latitude1 == NULL && $latitude2 == NULL && $longitude1 == NULL && $longitude2 == NULL){
        $getHomeLocation = "";
    }else{
        $getHomeLocation = [ $latitude1, $latitude2, $longitude1, $longitude2];
    }

    if (!$fetchProject) {
        $response['bool'] = false;
        $response['msg'] = 'Unable to fetch record!';
        return $response;
    } else {
        $response['project_data'] = $fetchProject;
        $response['getPreloadAccess'] = $getPreloadAccess;
        $response['jogetApp_link'] = $getpreloadJogetLink;
        $response['fetchGeoData'] = $getpreloadLocationData;
        $response['getHomeLoc'] = $getHomeLocation;
        $response['otherDetails'] = $data;

        return $response;
    }
}

function preloadAccessKKR($apps_link, $project_owner, $user_org, $project_role, $project_type, $project_phase) {
    global $IS_DOWNSTREAM;
    
    $accessArr = array();
    $controlArr = array();
    $compareArr = array();
    $setupArr = array();
    $updateArr = array();

    $appListsEncode = isset($apps_link) ? $apps_link : [];
    $addOwner = ($project_owner) ? $project_owner : "";

    if ($appListsEncode) {
        if(!isset($appListsEncode['constructPackage_name'])){
            return;
        }
        
        $skipArr = ['project_id', 'constructPackage_name', 'financePackage_name', 'documentPackage_name'];
        foreach ($appListsEncode as $k => $v) {
            if (in_array($k, $skipArr)) continue;

            if($project_type == 'ASSET'){
                $oriName = explode('_', $k);
                if(isset($oriName[2])){
                    $accessArr[$oriName[2]] = $v;
                }
            }else{
                $oriName = explode('_', $k);
                $accessArr[$oriName[1]] = $v;

            }
        }
    }

    if($project_type == 'CONSTRUCT'){

        if($project_owner == 'JKR_SABAH'){
            if($project_phase == '1B'){
                $linkFile = dirname(__FILE__)."\access\accessControl_".$addOwner."_1B.json";
            }else{
                $linkFile = dirname(__FILE__)."\access\accessControl_".$addOwner.".json";
            }
        }else if($project_owner == 'SSLR2'){
            if($IS_DOWNSTREAM){
                $linkFile = dirname(__FILE__)."\access\accessControl_SSLR2_DOWNSTREAM.json";
            }else{
                $linkFile = dirname(__FILE__)."\access\accessControl_SSLR2.json";
            }
        }else{
            $linkFile = dirname(__FILE__)."\access\accessControl_".$addOwner.".json";
        }

        if(file_exists($linkFile)){
            $access_control = json_decode(file_get_contents($linkFile), true);
        }
        else{
            $access_control = json_decode(file_get_contents("../BackEnd/accessControl.json"), true);
        }
    }else{
        $linkFile = dirname(__FILE__)."\access\accessControlAsset_".$addOwner.".json";

        if(file_exists($linkFile)){
            $access_control = json_decode(file_get_contents($linkFile), true);
        }
        else{
            $access_control = json_decode(file_get_contents("../BackEnd/accessControlAsset.json"), true);
        }
    }
    
    $roleUser = isset($project_role) ? $project_role : 'noRole';

    if($project_type == 'CONSTRUCT'){
        if (isset($access_control[$roleUser]['Construct'])) {
            foreach ($access_control[$roleUser]['Construct'] as $key => $val) {
                $controlArr[$key] = $val;
            }
        }
    }else{
        if (isset($access_control[$roleUser]['Asset'])) {
            foreach ($access_control[$roleUser]['Asset'] as $key => $val) {
                $controlArr[$key] = $val;
            }
        }
    } 
    
    if ($accessArr && $controlArr) {
        $assetMainMenu = array('RM','PM','EW','RFI','NCP','PAU');
        $assetMenuRM = array('RM','PM','EW','RFI','NCP','PAU','RI','AM','WP','WA','WI','DR','NOD','IVR','BRG','CVT','DRG','PAVE','RF','SLP');
        $assetMenuPM = array('RM','PM','EW','RFI','NCP','PAU','WO','WB');
        $assetMenuEW = array('RM','PM','EW','RFI','NCP','PAU','NOE','GAR','WDR');
        $assetMenu = array('RM','PM','EW','RI','AM','WP','WA','WI','DR','NOD','IVR','WO','WB','NOE','GAR','WDR','RFI','NCP','PAU','BRG','CVT','DRG','PAVE','RF','SLP');

        if($project_type == 'CONSTRUCT'){
            foreach ($accessArr as $index => $true) {
                if ($true == "1") {
                    foreach ($controlArr as $index2 => $true2) {
                        if ($index == $index2) {
                            if ($true2['create']) {
                                $compareArr[$index]['ORG'][$true2['org']] = true;
                            } else {
                                $compareArr[$index] = false;
                            }
    
                            if (isset($true2['update']) && $true2['update']) {
                                $updateArr[$index]['Manage'] = true;
                            }
                        }
    
                        if ($index2 == 'SETUP') {
                            $setupArr = $true2;
                        } else {
                            $setupArr = false;
                        }
                    }
                } else {
                    $compareArr[$index] = false;
                }
            }
        }else{
            foreach ($accessArr as $index => $true) {
                if($true == "1"){
                    if(strtoupper($index) == 'RM'){
                        foreach ($controlArr as $index2 => $true2) {
                            if(in_array($index2, $assetMenuRM)){
                                if($true2['create']){
                                    $compareArr[$index2] = true;
                                }
                                else{
                                    $compareArr[$index2] = false;
                                }
                            }
                        }
                    }else if(strtoupper($index) == 'PM'){
                        foreach ($controlArr as $index2 => $true2) {
                            if(in_array($index2, $assetMenuPM)){
                                if($true2['create']){
                                    $compareArr[$index2] = true;
                                }
                                else{
                                    $compareArr[$index2] = false;
                                }
                            }
                        }
                    }else if(strtoupper($index) == 'EW'){
                        foreach ($controlArr as $index2 => $true2) {
                            if(in_array($index2, $assetMenuEW)){
                                if($true2['create']){
                                    $compareArr[$index2] = true;
                                }
                                else{
                                    $compareArr[$index2] = false;
                                }
                            }
                        }
                    }else{
                        foreach ($controlArr as $index2 => $true2) {
                            if(in_array($index2, $assetMainMenu)){
                                if($true2['create']){
                                    $compareArr[$index2] = true;
                                }
                                else{
                                    $compareArr[$index2] = false;
                                }
                            }
                        }
                    }
                }else{
                    $compareArr[$index2] = false;
                }
            }

            foreach ($controlArr as $index2 => $true2) {
                if(in_array($index2, $assetMenu)){
                    if(isset($true2['update']) && $true2['update']){
                        $updateArr[$index2]['Manage'] = true;
                    }
                }
            }
        }

        //FOR BUMI, PROJECT SCHEDULE UPLOAD & MONTHLY ATTACHMENT UPLOAD
        foreach ($controlArr as $index2 => $true2) {
            if ($index2 == 'BR') {
                if ($true2['create']) {
                    $compareArr[$index2]['ORG'][$true2['org']] = true;
                } else {
                    $compareArr[$index2] = false;
                }
            }
            if ($index2 == 'PSU') {
                if ($true2['create']) {
                    $compareArr[$index2]['ORG'][$true2['org']] = true;
                } else {
                    $compareArr[$index2] = false;
                }
            }
            if($index2 == 'MAU'){
                if($true2['create']){
                    $compareArr[$index2]['ORG'][$true2['org']] = true;
                }
                else{
                    $compareArr[$index2] = false;
                }

                if(isset($true2['update']) && $true2['update']){
                    $updateArr[$index2]['Manage'] = true;
                }
            }
        }
    }

    $allAccess['compareArr'] = $compareArr;
    $allAccess['setupArr'] = $setupArr;
    $allAccess['updateArr'] = $updateArr;

    return $allAccess;
}

function preloadAccessOBYU($apps_link, $project_owner, $user_org, $project_role) {
    $accessArr = array();
    $controlArr = array();
    $compareArr = array();
    $setupArr = array();
    $updateArr = array();

    $appListsEncode = isset($apps_link) ? $apps_link : [];
    $addOwner = ($project_owner) ? $project_owner : "";
    $userOrganization = ($user_org) ? $user_org : "";

    if ($appListsEncode) {
        if(!isset($appListsEncode['constructPackage_name'])){
            return;
        }
        
        $skipArr = ['project_id', 'constructPackage_name', 'financePackage_name', 'documentPackage_name'];
        foreach ($appListsEncode as $k => $v) {
            if (in_array($k, $skipArr)) continue;
            $oriName = explode('_', $k);
            $accessArr[$oriName[1]] = $v;
        }
    }

    $linkFile = dirname(__FILE__)."\access\accessControl_".$addOwner.".json";

    if(file_exists($linkFile)){
        $access_control = json_decode(file_get_contents($linkFile), true);
    }
    else{
        $access_control = json_decode(file_get_contents("../BackEnd/accessControl.json"), true);
    }

    $roleUser = isset($project_role) ? $project_role : 'noRole';

    if($userOrganization == 'KACC' || $userOrganization == 'MRSB'){
        if (isset($access_control[$roleUser]['Construct'])) {
            foreach ($access_control[$roleUser]['Construct'] as $key => $val) {
                $controlArr[$key] = $val;
            }
        }
    }
    
    if ($accessArr && $controlArr) {

        foreach ($accessArr as $index => $true) {
            if ($true == "1") {
                foreach ($controlArr as $index2 => $true2) {
                    if ($index == $index2) {
                        if ($true2['create']) {
                            $compareArr[$index]['ORG'][$true2['org']] = true;
                        } else {
                            $compareArr[$index] = false;
                        }

                        if (isset($true2['update']) && $true2['update']) {
                            $updateArr[$index]['Manage'] = true;
                        }
                    }

                    if ($index2 == 'SETUP') {
                        $setupArr = $true2;
                    } else {
                        $setupArr = false;
                    }
                }
            } else {
                $compareArr[$index] = false;
            }
        }

        //FOR BUMI, PROJECT SCHEDULE UPLOAD & MONTHLY ATTACHMENT UPLOAD
        foreach ($controlArr as $index2 => $true2) {
            if ($index2 == 'BR') {
                if ($true2['create']) {
                    $compareArr[$index2]['ORG'][$true2['org']] = true;
                } else {
                    $compareArr[$index2] = false;
                }
            }
            if ($index2 == 'PSU') {
                if ($true2['create']) {
                    $compareArr[$index2]['ORG'][$true2['org']] = true;
                } else {
                    $compareArr[$index2] = false;
                }
            }
            if($index2 == 'MAU'){
                if($true2['create']){
                    $compareArr[$index2]['ORG'][$true2['org']] = true;
                }
                else{
                    $compareArr[$index2] = false;
                }

                if(isset($true2['update']) && $true2['update']){
                    $updateArr[$index2]['Manage'] = true;
                }
            }
        }
    }

    $allAccess['compareArr'] = $compareArr;
    $allAccess['setupArr'] = $setupArr;
    $allAccess['updateArr'] = $updateArr;

    return $allAccess;
}

function preloadJogetLink($fetchProject, $Project_type, $project_details) {
    global $SYSTEM;
    $constructApp = '';
    $assetApp = '';
    $documentApp = '';
    $financeApp = '';
    $jogetURL = array();
    
    $_SESSION['Project_type'] = $Project_type;

    $appListsEncode = isset($fetchProject) ? $fetchProject : [];
    if ($appListsEncode) {
        $constructpackageInfoArr = explode('::', $appListsEncode['constructPackage_name']);

        if($SYSTEM == 'OBYU'){
                $constructApp = $constructpackageInfoArr[0];
                $_SESSION['appsLinks'] = $constructApp;
        }else{
            if($Project_type == "CONSTRUCT") {
                $constructApp = $constructpackageInfoArr[0];
                $_SESSION['appsLinks'] = $constructApp;
            }else{
                $assetApp = $constructpackageInfoArr[0];
                $_SESSION['appsLinks'] = $assetApp;
            }
        }
    }

    if ($constructApp) {
        $jogetlink = new JogetLink();
        $jogetlink->constructApp = $constructApp;

        $jogetlink->currProjectOwner = (isset($project_details['currProjectOwner'])) ? $project_details['currProjectOwner'] : '';
        $jogetlink->currUserRole = (isset($project_details['currUserRole'])) ? $project_details['currUserRole'] : '';
        $jogetlink->currUserEmail = (isset($project_details['currUserEmail'])) ? $project_details['currUserEmail'] : '';
	    $jogetlink->currUserOrg = (isset($project_details['currUserOrg'])) ? $project_details['currUserOrg'] : '';
		$jogetlink->currPackageId = (isset($project_details['currPackageId'])) ? $project_details['currPackageId'] : '';
		$jogetlink->currProjectId = (isset($project_details['currProjectId'])) ? $project_details['currProjectId'] : '';
		$jogetlink->currPackageName = (isset($project_details['currPackageName'])) ? $project_details['currPackageName'] : '';
		$jogetlink->currWPCId = (isset($project_details['currWPCId'])) ? $project_details['currWPCId'] : "";
		$jogetlink->pid = isset($project_details['pid']) ? $project_details['pid'] : '';
		$jogetlink->currPackageUuid = isset($project_details['currPackageUuid']) ? $project_details['currPackageUuid'] : '';

        $jogetURL = $jogetlink->preloadURL();
    }

    if ($assetApp) {
        $jogetlink = new JogetLink();
        $jogetlink->assetApp = $assetApp;

        $jogetlink->currProjectOwner = (isset($project_details['currProjectOwner'])) ? $project_details['currProjectOwner'] : '';
        $jogetlink->currUserRole = (isset($project_details['currUserRole'])) ? $project_details['currUserRole'] : '';
        $jogetlink->currUserEmail = (isset($project_details['currUserEmail'])) ? $project_details['currUserEmail'] : '';
	    $jogetlink->currUserOrg = (isset($project_details['currUserOrg'])) ? $project_details['currUserOrg'] : '';
		$jogetlink->currPackageId = (isset($project_details['currPackageId'])) ? $project_details['currPackageId'] : '';
		$jogetlink->currProjectId = (isset($project_details['currProjectId'])) ? $project_details['currProjectId'] : '';
		$jogetlink->currPackageName = (isset($project_details['currPackageName'])) ? $project_details['currPackageName'] : '';
		$jogetlink->currWPCId = (isset($project_details['currWPCId'])) ? $project_details['currWPCId'] : "";
		$jogetlink->pid = isset($project_details['pid']) ? $project_details['pid'] : '';
		$jogetlink->currPackageUuid = isset($project_details['currPackageUuid']) ? $project_details['currPackageUuid'] : '';

        $jogetURL = $jogetlink->preloadURL();
    }

    return $jogetURL;
}

function preloadLocationData($package_id) {
    global $CONN;
    $fetchGeoData = $CONN->fetchAll("SELECT 
        g.groupName, 
        g.groupView, 
        p.layerGroup, 
        p.Layer_ID, 
        p.Data_ID, 
        p.Layer_Name, 
        p.zindex, 
        p.Default_View, 
        d.Offset,
        d.X_Offset,
        d.Y_Offset, 
        d.Data_URL, 
        d.Share, 
        d.Data_Type,
        d.Style,
        pr.project_id
    FROM Project_Layers p
    JOIN Data_Pool d ON p.Data_ID = d.Data_ID 
    LEFT JOIN groupLayers g ON p.layerGroup = g.groupID
    LEFT JOIN projects pr ON d.Data_Owner = pr.project_name
    WHERE p.Project_ID =:0 ORDER BY layerGroup ASC", array($package_id));

    return $fetchGeoData;
}

function getProjectPackages(){
    global $response;
    global $CONN;
    global $SYSTEM;
    $parentProjectID = $_SESSION['project_id'];

    //check if this is a parent project,
    if ($_SESSION['is_Parent'] !== "isParent") {
        return;
    }

    if($SYSTEM == 'OBYU'){
        $response = $CONN->fetchAll("SELECT CONCAT(project_id_number, '_', project_id, '_', project_id_number) as package_uuid_bumi, project_id as pid, project_name as pname, project_wpc_id as wpc_id from projects WHERE parent_project_id_number =:0", array($parentProjectID));
    }else{
  
		$project_phase_clause = '';
		if($_SESSION['user_org'] == 'pmc_1b' || $_SESSION['project_role'] == 'Head of Finance' || $_SESSION['project_role'] == 'Finance Head'){
            //HOF and FH only can create for 1B
			$project_phase_clause = " AND project_phase = '1B' ";
		}else if($_SESSION['user_org'] == 'HSSI'){
			$project_phase_clause = " AND  (project_phase != '1B' OR project_phase IS  NULL) ";
		}

        $response = $CONN->fetchAll("SELECT CONCAT(project_id_number, '_', project_id, '_', project_id_number) as package_uuid_bumi, project_id as pid, project_name as pname, project_wpc_id as wpc_id from projects WHERE parent_project_id_number =:0 $project_phase_clause ORDER BY project_name ASC", array($parentProjectID));

    }
    

}

function fetchMetadata (){
    global $CONN, $response;
    $metadataID = filter_input(INPUT_POST, 'metaid', FILTER_VALIDATE_INT);      
    $metaData = $CONN->fetchRow("select * from metadata where md_meta_id = :0", array($metadataID));
    if($metaData){
        $metaData['md_date_created'] = date("d/m/Y", strtotime($metaData['md_date_created']));
        $response['bool'] = true;
        $response['data'] = $metaData;
    }else{
        $response['bool'] = false;
        $response['msg'] = "Error fetch metadata";
    }
}

function fetchAllDataPool(){
    global $response;
    $package_id = filter_input(INPUT_POST, 'package_id', FILTER_SANITIZE_STRING);
    $getpreloadLocationData = preloadLocationData($package_id);
    
    $response = $getpreloadLocationData;
    return $response;
}

function saveGroupAerial (){

    global $response;
    global $CONN;
    $projectID = $_SESSION['project_id'];      

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $groupName = filter_input(INPUT_POST, 'groupName', FILTER_SANITIZE_STRING);
    $groupID = filter_input(INPUT_POST, 'groupID', FILTER_VALIDATE_INT);
    $subgroupName = filter_input(INPUT_POST, 'subgroupName', FILTER_SANITIZE_STRING);
    $subgroupID = filter_input(INPUT_POST, 'subgroupID', FILTER_VALIDATE_INT);
    $typeFunc = filter_input(INPUT_POST, 'typeFunc', FILTER_SANITIZE_STRING);
    $aicID = filter_input(INPUT_POST, 'dataID', FILTER_SANITIZE_STRING);

    function checkGroupName($projectID, $name, $id){
        global $response;
        global $CONN;

        if($id){
            $check = $CONN->fetchOne("SELECT groupName FROM groupAerial WHERE projectID =:0 AND groupName =:1 AND groupID !=:2 ", array($projectID, $name, $id));
        }
        else{
            $check = $CONN->fetchOne("SELECT groupName FROM groupAerial WHERE projectID =:0 AND groupName =:1", array($projectID, $name));
        }

        if($check){
            $response['bool'] = false;
            $response['msg'] = "Group name exist, please enter a new group name.";
            return false;
        }

    }

    function checkSubGroupName($projectID, $name, $id){
        global $response;
        global $CONN;

        if($id){
            $check = $CONN->fetchOne("SELECT subGroupName FROM subGroupAerial WHERE projectID =:0 AND subGroupName =:1 AND subGroupID !=:2 ", array($projectID, $name, $id));
        }
        else{
            $check = $CONN->fetchOne("SELECT subGroupName FROM subGroupAerial WHERE projectID =:0 AND subGroupName =:1", array($projectID, $name));
        }

        if($check){
            $response['bool'] = false;
            $response['msg'] = "Subgroup name exist, please enter a new group name.";
            return false;
        }

    }

    function newGroupAndNoSubgroup($aicID, $projectID, $groupName, $groupID){
        global $response;
        global $CONN;

        if(checkGroupName($projectID, $groupName, $groupID) === false){
            return;
        }

        //getLastInsertID not working -> do select max for groupid
        $grpId = $CONN->fetchOne("SELECT MAX(groupID) + 1 FROM groupAerial");

        if($grpId == NULL){
            $grpId = 1;
        }else{
            $grpId = $grpId;
        }

        //INSERT INTO GROUP FIRST
        $insertSQL = "INSERT INTO groupAerial ([groupID],[groupName],[projectID]) VALUES (:0, :1, :2)";
        $inserted = $CONN->execute($insertSQL, array($grpId, $groupName, $projectID));   

        if (!$inserted) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while adding data record!";
            return false;
        }

        $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup = NULL WHERE AIC_Id =:1", array($grpId, $aicID));
        if (!$aerialUpdate) {
            $response['bool'] = false;
            $response['msg'] = "Unable to update aerial group details due to error in sql, please try again!";
            return;
        }
        $response['bool'] = true;
        $response['msg'] = "newGroupAndNoSubgroup";
    }

    function newGroupAndNewSubgroup($aicID, $projectID, $groupName, $groupID, $subgroupName, $subgroupID){
        global $response;
        global $CONN;
   
        if(checkGroupName($projectID, $groupName, $groupID) === false){
            return;
        }

        if(checkSubGroupName($projectID, $subgroupName, $subgroupID) === false){
            return;
        }

        //getLastInsertID not working -> do select max for groupid
        $grpId = $CONN->fetchOne("SELECT MAX(groupID) + 1 FROM groupAerial");
        $subgrpId = $CONN->fetchOne("SELECT MAX(subGroupID) + 1 FROM subGroupAerial");

        if($grpId == NULL){
            $grpId = 1;
        }else{
            $grpId = $grpId;
        }

        if($subgrpId == NULL){
            $subgrpId = 1;
        }else{
            $subgrpId = $subgrpId;
        }

        //INSERT INTO GROUP FIRST
        $insertSQL = "INSERT INTO groupAerial ([groupID],[groupName],[projectID]) VALUES (:0, :1, :2)";
        $inserted = $CONN->execute($insertSQL, array($grpId, $groupName, $projectID));   
        if (!$inserted) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while adding group data record!";
            return false;
        }

        //INSERT INTO SUBGROUP SECOND
        $insertSQL2 = "INSERT INTO subGroupAerial ([subGroupID],[subGroupName],[projectID]) VALUES (:0, :1, :2)";
        $inserted2 = $CONN->execute($insertSQL2, array($subgrpId, $subgroupName, $projectID));   
        if (!$inserted2) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while adding subgroup data record!";
            return false;
        }

        //UPDATE DATA WITH GROUP AND SUBGROUP ID
        $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup =:1 WHERE AIC_Id =:2", array($grpId, $subgrpId, $aicID));
        if (!$aerialUpdate) {
            $response['bool'] = false;
            $response['msg'] = "Unable to update aerial group details due to error in sql, please try again!";
            return;
        }
        $response['bool'] = true;
        $response['msg'] = "newGroupAndNewSubgroup";
    }

    function newGroupAndOldSubgroup($aicID, $projectID, $groupName, $groupID, $subgroupName, $subgroupID){
        global $response;
        global $CONN;

        if(checkGroupName($projectID, $groupName, $groupID) === false){
            return;
        }

        //getLastInsertID not working -> do select max for groupid
        $grpId = $CONN->fetchOne("SELECT MAX(groupID) + 1 FROM groupAerial");

        if($grpId == NULL){
            $grpId = 1;
        }else{
            $grpId = $grpId;
        }

        //INSERT INTO GROUP FIRST
        $insertSQL = "INSERT INTO groupAerial ([groupID],[groupName],[projectID]) VALUES (:0, :1, :2)";
        $inserted = $CONN->execute($insertSQL, array($grpId, $groupName, $projectID));   

        if (!$inserted) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while adding data record!";
            return false;
        }

        $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup =:1 WHERE AIC_Id =:2", array($grpId, $subgroupID, $aicID));
        if (!$aerialUpdate) {
            $response['bool'] = false;
            $response['msg'] = "Unable to update aerial group details due to error in sql, please try again!";
            return;
        }
        $response['bool'] = true;
        $response['msg'] = "newGroupAndOldSubgroup";
    }

    function oldGroupAndNoSubgroup($aicID, $projectID, $groupName, $groupID){
        global $response;
        global $CONN;

        $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup = NULL WHERE AIC_Id =:1", array($groupID, $aicID));
        if (!$aerialUpdate) {
            $response['bool'] = false;
            $response['msg'] = "Unable to update aerial group details due to error in sql, please try again!";
            return;
        }
        $response['bool'] = true;
        $response['msg'] = "oldGroupAndNoSubgroup";
    }

    function oldGroupAndNewSubGroup($aicID, $projectID, $groupName, $groupID, $subgroupName, $subgroupID){
        global $response;
        global $CONN;

        if(checkSubGroupName($projectID, $subgroupName, $subgroupID) === false){
            return;
        }

        //getLastInsertID not working -> do select max for groupid
        $subgrpId = $CONN->fetchOne("SELECT MAX(subGroupID) + 1 FROM subGroupAerial");
        if($subgrpId == NULL){
            $subgrpId = 1;
        }else{
            $subgrpId = $subgrpId;
        }

        //INSERT INTO SUBGROUP SECOND
        $insertSQL2 = "INSERT INTO subGroupAerial ([subGroupID],[subGroupName],[projectID]) VALUES (:0, :1, :2)";
        $inserted2 = $CONN->execute($insertSQL2, array($subgrpId, $subgroupName, $projectID));   
        if (!$inserted2) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while adding subgroup data record!";
            return false;
        }

        //UPDATE DATA WITH GROUP AND SUBGROUP ID
        $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup =:1 WHERE AIC_Id =:2", array($groupID, $subgrpId, $aicID));
        if (!$aerialUpdate) {
            $response['bool'] = false;
            $response['msg'] = "Unable to update aerial group details due to error in sql, please try again!";
            return;
        }
        $response['bool'] = true;
        $response['msg'] = "oldGroupAndNewSubGroup";
    }

    if($typeFunc){
        switch ($typeFunc) {
            case 'newGroupAndNoSubgroup':
                newGroupAndNoSubgroup($aicID, $projectID, $groupName, $groupID);
                break;
            case 'newGroupAndNewSubgroup':
                newGroupAndNewSubgroup($aicID, $projectID, $groupName, $groupID, $subgroupName, $subgroupID);
                break;
            case 'newGroupAndOldSubgroup':
                newGroupAndOldSubgroup($aicID, $projectID, $groupName, $groupID, $subgroupName, $subgroupID);
                break;
            case 'oldGroupAndNoSubgroup':
                oldGroupAndNoSubgroup($aicID, $projectID, $groupName, $groupID);
                break;
            case 'oldGroupAndNewSubGroup':
                oldGroupAndNewSubGroup($aicID, $projectID, $groupName, $groupID, $subgroupName, $subgroupID);
                break;
        }

    }else{
        //UPDATE DATA WITH GROUP AND SUBGROUP ID
        $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup =:1 WHERE AIC_Id =:2", array($groupID, $subgroupID, $aicID));
        if (!$aerialUpdate) {
            $response['bool'] = false;
            $response['msg'] = "Unable to update aerial group details due to error in sql, please try again!";
            return;
        }
        $response['bool'] = true;
        $response['msg'] = "Success update.";

    }
}

function removeAerialGroup(){
    global $response;
    global $CONN;
    $aicID = filter_input(INPUT_POST, 'aicID', FILTER_VALIDATE_INT);

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    if ($aicID){
        $updateGrpAerial = $CONN->execute("UPDATE AerialImageCompare SET Image_Group = NULL, Image_SubGroup = NULL WHERE AIC_Id =:0", array($aicID));
        if (!$updateGrpAerial) {
            $response['bool'] = false;
            $response['msg'] = "Unable to remove group aerial due to error in sql, please try again!";
            return;
        }
        $response['bool'] = true;
        $response['msg'] = "Remove group aerial is success";
    }
}

function getAssetTypeDataList() {
    global $JOGETLINKOBJ;

    $useLink = 'fm_json_datalist_asset_type';
    $projType = 'asset';

    $api_username = $JOGETLINKOBJ->getAdminUserName($projType);
    $api_password = $JOGETLINKOBJ->getAdminUserPassword($projType);
    $host = $JOGETLINKOBJ->getLink($useLink);

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

    $assetTypeArr = array();

    if (!$err) {
        $decodedText = html_entity_decode($return);
        $assetTypeArr = json_decode($decodedText, true);
    }

    return $assetTypeArr;
}

function getAgileData(){
    $json_str = getCSVAssetList();  
    if ($json_str === null) {
        $response['bool'] = false;
        $response['msg'] = "JSON string error";
        return;
    }
    else{
        $response['bool'] = true;
        $response['data'] = $json_str;
    }
    return $response;
}

function getCSVAssetList(){
    $current_directory = __DIR__;

    $file_path = $current_directory . '/../../Data/Others/PLC/EquipmentsFirstFloor_Combined.json';

    if (file_exists($file_path)) {
        $content = file_get_contents($file_path);
        $resArr = json_decode($content, true);
        if ($resArr) return $resArr;
        else return null;
    } else {
        die('File does not exist: ' . $file_path);
    }
}

function getAgileAssetList(){
    $current_directory = __DIR__;

    $file_path = $current_directory . '/../../Data/Others/PLC/Agile.json';

    if (file_exists($file_path)) {
        $content = file_get_contents($file_path);
        $resArr = json_decode($content, true);
        if ($resArr) return $resArr;
        else return null;
    } else {
        die('File does not exist: ' . $file_path);
    }
}

function getAssetInfo($eleId){
   // loop through asset array to find the asset based on ElementID
   $csvArr = getCSVAssetList(); 
   foreach ($csvArr as  $asset) {
        if (isset($asset['ElementId']) && $asset['ElementId'] == $eleId) {
            $asset['Coordinate'] = getCoordinateBasedOnName($asset['Item']);
            $response['CSV']['bool'] = true;
            $response['CSV']['data'] = $asset;
        }
    }
    
    $agileArr = getAgileAssetList(); 
    foreach ($agileArr as  $asset) {
        if (isset($asset['ElementID']) && $asset['ElementID'] == $eleId) {
            $response['Agile']['bool'] = true;
            $response['Agile']['data'] = $asset;
        }
    }
    return $response;
}

  // for demo purpose, get coordinate based on Asset Name
function getCoordinateBasedOnName($name){
    $coordinate = array(
        "M_Meter_Gas_MEPcontent_Unspecified G2.5 (2301077)" => array(
        'long' => 101.739565,
        'lat' =>   2.962253,
        'alt' => 5.6
        ),
        "MEC_MEQ_SWC_AHUR08CAV AHUR08CAV (2137126)" => array(
        'long' => 101.739092,
        'lat' => 2.962284,
        'alt' => 5.603
        ),
        "MEC_MEQ_SWC_AHUR08CAV AHUR08CAV (4066587)" => array(
        'long' => 101.741152,
        'lat' => 2.961823,
        'alt' => 5.6
        ),
        "MEC_MEQ_SWC_AHUR08CAV AHUR08CAV (4647929)" => array(
        'long' => 101.741235,
        'lat' => 2.961471,
        'alt' => 5.601
        ),
        "MEC_MEQ_SWC_AHUR08CAV AHUR08CAV (4648137)" => array(
        'long' => 101.739099,
        'lat' => 2.96216,
        'alt' => 5.601
        ),
        "MEC_MEQ_SWC_AHUR30CAV AHUR30CAV (3699761)" => array(
        'long' => 101.740445,
        'lat' => 2.961748,
        'alt' => 6.4
        ),
        "MEC_MEQ_SWC_AHUR30CAV AHUR30CAV (4540125)" => array(
        'long' => 101.741336,
        'lat' => 2.962024,
        'alt' => 6.401
        ),
        "MEC_MEQ_SWC_AHUR30CAV AHUR30CAV (4540268)" => array(
        'long' => 101.740217,
        'lat' => 2.962337,
        'alt' => 6.393
        ),
        "MEC_MEQ_SWC_AHUR40CAV AHUR40CAV (4534423)" => array(
        'long' => 101.739758,
        'lat' => 2.962227,
        'alt' => 6.8
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 179 LPS (4167963)" => array(
        'long' => 101.739267,
        'lat' => 2.962209,
        'alt' => 7.759
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 179 LPS (4168003)" => array(
        'long' => 101.739311,
        'lat' => 2.962223,
        'alt' => 7.769
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 179 LPS (4611264)" => array(
        'long' => 101.73994,
        'lat' => 2.962517,
        'alt' => 8.173
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 179 LPS (4611571)" => array(
        'long' => 101.739982,
        'lat' => 2.962492,
        'alt' => 8.173
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 179 LPS (4611942)" => array(
        'long' => 101.740005,
        'lat' => 2.962489,
        'alt' => 8.173
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 179 LPS (4805800)" => array(
        'long' => 101.741847,
        'lat' => 2.962056,
        'alt' => 8.198
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 179 LPS (4806372)" => array(
        'long' => 101.741898,
        'lat' => 2.962041,
        'alt' => 8.198
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 216 LPS (4613175)" => array(
        'long' => 101.741,
        'lat' => 2.962087,
        'alt' => 8.154
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 216 LPS (4614073)" => array(
        'long' => 101.741049,
        'lat' => 2.96208,
        'alt' => 8.154
        ),
        "MEC_MEQ_SWC_Centrifugal Fan - Inline - Direct Drive 216 LPS (4614327)" => array(
        'long' => 101.741072,
        'lat' => 2.962085,
        'alt' => 8.148
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4901272)" => array(
        'long' => 101.739042,
        'lat' => 2.962225,
        'alt' => 5.702
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4901273)" => array(
        'long' => 101.739044,
        'lat' => 2.96222,
        'alt' => 5.702
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4901274)" => array(
        'long' => 101.739047,
        'lat' => 2.962216,
        'alt' => 5.702
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4901275)" => array(
        'long' => 101.739049,
        'lat' => 2.962211,
        'alt' => 5.702
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4901276)" => array(
        'long' => 101.739066,
        'lat' => 2.962177,
        'alt' => 5.702
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4901323)" => array(
        'long' => 101.740193,
        'lat' => 2.962331,
        'alt' => 5.7
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4902162)" => array(
        'long' => 101.741302,
        'lat' => 2.962018,
        'alt' => 5.7
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4968148)" => array(
        'long' => 101.739113,
        'lat' => 2.962176,
        'alt' => 5.702
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4968306)" => array(
        'long' => 101.73976,
        'lat' => 2.962281,
        'alt' => 5.7
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4968345)" => array(
        'long' => 101.740471,
        'lat' => 2.96175,
        'alt' => 5.68
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4968404)" => array(
        'long' => 101.741153,
        'lat' => 2.961859,
        'alt' => 5.7
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (4968478)" => array(
        'long' => 101.741216,
        'lat' => 2.961465,
        'alt' => 5.701
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (8054356)" => array(
        'long' => 101.740193,
        'lat' => 2.962323,
        'alt' => 5.7
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (8054362)" => array(
        'long' => 101.740198,
        'lat' => 2.96232,
        'alt' => 5.7
        ),
        "MEC_DCF_SWC_Single Phase Panel - 120V MCB - Surface 100A (8054363)" => array(
        'long' => 101.740204,
        'lat' => 2.962317,
        'alt' => 5.7
        ),
    );
    return (isset($coordinate[$name])) ? $coordinate[$name] : false;  
}


function saveIoTSensorData(){
    global $CONN, $response;
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };
    if (!isset($_POST)) {
        $response['msg'] = 'No variable input!'; 
        return $response;
    }
    $sensorDetails = array(
        "iot_id" => $_POST['id'],
        "iot_name" => $_POST['name'],
        "iot_type" => $_POST['type'],
       
    );
    if(isset($_POST['elementID'])) 
    $sensorDetails['element_id'] = $_POST['elementID'];
    if(isset($_POST['longitude'])) 
    $sensorDetails['longitude'] = $_POST['longitude'];
    if(isset($_POST['latitude'])) 
    $sensorDetails['latitude'] = $_POST['latitude'];
    if(isset($_POST['height'])) 
    $sensorDetails['height'] = $_POST['height'];
    if(isset($_POST['red'])) 
    $sensorDetails['red'] = $_POST['red'];
    if(isset($_POST['yellow'])) 
    $sensorDetails['yellow'] = $_POST['yellow'];
    if(isset($_POST['green'])) 
    $sensorDetails['green'] = $_POST['green'];
    $colsToInsert = array();
    $varsToInsert = array();
    $valsToInsert = array();
    foreach ($sensorDetails as $key => $cl) {
        if ($cl !== false || $cl !== null) {
            $colsToInsert[] = $key;
            $varsToInsert[] = ":" . $key;
            $valsToInsert[$key] = $cl;
        }
    }

    $insertSQL = "INSERT INTO iot_asset (" . implode(" ,", $colsToInsert) . ",created_by, created_time) VALUES (" . implode(" ,", $varsToInsert) . ", '$user', GETDATE())";
   
    $statement = $CONN->prepare($insertSQL);
    $sqlResult = $statement->execute($sensorDetails);
   
    if (!$sqlResult) {
        $response['bool'] = false;
        $response['msg'] = 'SQL Error while insert record!';
        return false;
    } else {
        
        $response['bool'] = true;
        $response['msg'] = "Sucessfully Added";
        return $response;
       
    }
}

function updateIoTSensorData(){
     global $CONN, $response;
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };
    
    if (!isset($_POST)) {
        $response['msg'] = 'No variable input!'; 
        return $response;
    }
    
    $iot_id = $_POST['id'];
    $iot_name = $_POST['name'];
    $iot_type = $_POST['type'];
    $red = $_POST['red'];
    $yellow = $_POST['yellow'];
    $green = $_POST['green'];
    $id = $_POST['db_id'];
    if(isset($_POST['elementID'])){
        $element_id = $_POST['elementID'];
        $longitude = $_POST['longitude'];
        $latitude = $_POST['latitude'];
        $height =$_POST['height'];
        $updateSQL = "UPDATE iot_asset SET iot_id = '$iot_id', iot_name = '$iot_name', iot_type ='$iot_type', red = '$red', yellow ='$yellow', green ='$green', element_id ='$element_id',longitude ='$longitude',latitude ='$latitude', height ='$height' where id ='$id'";
    }else{
        $updateSQL = "UPDATE iot_asset SET iot_id = '$iot_id', iot_name = '$iot_name', iot_type ='$iot_type', red = '$red', yellow ='$yellow', green ='$green' where id ='$id'";
    }
    $updated = $CONN->execute( $updateSQL);
    if (!$updated) {
        $response['bool'] = false;
        $response['msg'] = 'SQL Error while updating record!';
        return false;
    } else {
        
        $response['bool'] = true;
        $response['msg'] = "Sucessfully update";
        return $response;
       
    }
   
}

function getIoTSensorData(){
    global $response;
    global $CONN;

   
    $iotData = $CONN->fetchAll("SELECT * FROM iot_asset order by id asc");
    if(!$iotData){
        $response['bool'] = false;
        $response['msg'] = "IoT data not found";
    }
        $response['bool'] = true;
        $response['data'] = $iotData;
        
    return $response;
   
}

function deleteIoTSensorData(){
    global $CONN, $response;
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

    $check = checkIfProjectAdmin();
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };
    if (!isset($_POST)) {
        $response['msg'] = 'No variable input!'; 
        return $response;
    }
    $id = $_POST['id'];
    $deleteSQL = $CONN->execute("DELETE FROM iot_asset WHERE id = :0", array($id));
    if(!$deleteSQL){
        $response['bool'] = false;
        $response['msg'] = "SQL Error. IoT sensor has not been deleted.";
        return;
    }else{
        $response['bool'] = false;
        $response['msg'] = "Iot sensor has been deleted";
    }
}

function getLayerId($layer_path) {
    global $CONN;

    $pidnumber = $_SESSION['project_id'];

    $layerData = $CONN->fetchAll("SELECT 
       d.Data_ID,
       p.Layer_ID,
       d.Data_Name
    FROM Project_Layers p
    JOIN Data_Pool d ON p.Data_ID = d.Data_ID 
    WHERE p.Project_ID =:0 AND d.Data_URL =:1", array($pidnumber, $layer_path));

    $response['bool'] = true;
    $response['data'] = $layerData;

    return $response;
}

function getTrackAnimation() {
    global $response;
    global $CONN;

    $pid = $_SESSION['project_id'];
    $fetchVideoData = $CONN->fetchAll("SELECT 
        p.Layer_ID,
        p.Data_ID,
        p.Layer_name,
        p.Default_View,
        p.Project_ID,
        p.Animation,
        d.Data_URL,
        d.Data_Type
     FROM Project_Layers p JOIN Data_Pool d ON p.Data_ID = d.Data_ID  WHERE project_ID = :0 AND Animation = 1", array($pid));
    if(!$fetchVideoData){
        $response['bool'] = false;
        $response['msg'] = "No Track Animation Registered";
    }
        $response['bool'] = true;
        $response['data'] = $fetchVideoData;
        
    return $response;
}

function getAICDetailsById($aicId) {
    global $response, $CONN;

    $aicDetails = $CONN->fetchAll(
        "SELECT 
            a.AIC_Id, 
            a.Project_Id, 
            a.Package_Id, 
            a.Image_Type, 
            a.Image_Captured_Date,
            a.Registered_By, 
            a.Registered_Date, 
            a.Image_URL, 
            a.Routine_Id, 
            a.Routine_Type,
            a.Use_Name, 
            a.Image_Group, 
            a.Image_SubGroup, 
            p.project_id,
            g.groupName,
            sg.subGroupName
        FROM AerialImageCompare a
        LEFT JOIN projects p ON a.Package_Id = p.project_id_number
        LEFT JOIN groupAerial g ON a.Image_Group = g.groupID
        LEFT JOIN subgroupAerial sg ON a.Image_SubGroup = sg.subGroupID
        WHERE a.AIC_Id = :0",
        array($aicId)
    );

    if ($aicDetails) {
        $response['bool'] = true;
        $response['data'] = $aicDetails[0];
    } else {
        $response['bool'] = false;
        $response['msg'] = 'No AIC record found for the given ID';
    }

    return $response;
}

?>