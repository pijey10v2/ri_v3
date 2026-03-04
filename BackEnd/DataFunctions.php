<?php
    session_start();
    include_once '../login/include/_include.php';
    include_once('class/jogetLink.class.php');
    global $JOGETLINKOBJ;
    $JOGETLINKOBJ = new JogetLink();

    $response = array();
    $functionName = filter_input(INPUT_POST, 'functionName', FILTER_SANITIZE_STRING);

    if (!$functionName) {
        $response['bool'] = false;
        $response['msg'] = "Invalid function";
        echo json_encode($response);
        exit();
    }
    switch ($functionName) {
        case 'addVideoCam': //saveVideoData.php
            addVideoCam();
        break;
        case 'updateVideoCam':
            updateVideoCam();
        break;
        case 'deleteVideoCam':
            deleteVideoCam();
        break;
        case 'getVideoCam':
            getVideoCam();
        break;
        case 'addGeoData':
            addGeoData();
        break;
        case 'getGeoData':
            getGeoData();
        break;
        case 'deleteGeodata':
            deleteGeodata();
        break;
        case 'getProjectLayerList':
            getProjectLayerList();
        break;
        case 'switchDefaultDisplay':
            switchDefaultDisplay();
        break;
        case 'attachOrDetachLayer':
            attachOrDetachLayer();
        break;
        case 'detachLayer':
            detachLayer();
        break;
        case 'renameLayer':
            renameLayer();
        break;
        case 'saveLayerGroup':
            saveLayerGroup();
        break;
        case 'getCompleteGeoData':
            getCompleteGeoData();
        break;
        case 'getShpStyle':
            getShpStyle();
        break;
        case 'createSLDFile':
            createSLDFile();
        break;
        case 'attachShpStyle':
            attachShpStyle();
        break;
        case 'parseShpStyle':
            parseShpStyle();
        break;
        case 'removeLayerGroup':
            removeLayerGroup();
        break;
        case 'updateECWName';
            updateECWName();
        break;
        case 'fetchMetadata';
            fetchMetadata();
        break;
        case 'saveGroupAerial';
            saveGroupAerial();
        break;
        case 'removeAerialGroup';
            removeAerialGroup();
        break;
        
    };
    echo json_encode($response);
    
    function checkIfProjectAdmin(){
        global $CONN;
        $email = $_SESSION['email'];
        $pidnumber = $_SESSION['project_id'];
       // $role = ['Project Manager' , 'Project Monitor'] ;
        $count = $CONN->fetchOne("SELECT count(*) FROM pro_usr_rel WHERE Pro_ID = :0  AND  Usr_ID IN (SELECT user_id from users WHERE user_email =:1) AND Pro_Role IN ('Project Manager', 'Project Monitor', 'Land Officer', 'Assistant Director (Road Asset)', 'Senior Civil Engineer (Road Asset)')", array($pidnumber, $email));
        if($count == 1){
            return true;
        }else{
            return false;
        }
    }
    
    //-----------------------Video Camera / Live Video -----------------
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
            $videoPath = "Data/Projects/".$pid."/".$videoURL;
            $updateSQL = "UPDATE videoPin SET videoPinName =:0, height =:1, videoURL =:2, uploadedBy =:3, uploadedDate = GETDATE(), videoType =:4 WHERE videoPinID = :5;";
            $updated = $CONN->execute($updateSQL, array($name, $height, $videoPath, $email, $videoType, $id));
            $removeFile = true;
        }
        if($updated){
            $response['bool'] = true;
            $response['msg'] = "Update successful";
            $response['videoPath'] = $videoPath;
            if ( isset($removeFile) && file_exists('../'.$oldVideo['vURL'])){
                if (unlink('../'.$oldVideo['vURL'])) {   
                    $response['delete'] = "Delete successful";
                    $response['videoPath'] = $videoPath;
                }
            } 
        }else{
            $response['bool'] = false;
            $response['msg'] = "SQL error. Video record cant be updated.";
        }
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
        if ($oldVideo['vType'] == 0 && file_exists('../'.$oldVideo['vURL'])){
            if (unlink('../'.$oldVideo['vURL'])) {   
                $response['msg'] = "Delete successful";
            }
            else {
                $response['msg'] = "Delete failed, record isn't removed";
            }   
        } 
    }

    function getVideoCam() {
        global $response;
        global $CONN;
    
        $pid = $_SESSION['project_id'];
        $fetchVideoData = $CONN->fetchAll("SELECT * FROM videoPin WHERE projectID = :0", array($pid));
        if(!$fetchVideoData){
            $response['bool'] = false;
            $response['msg'] = "Video record not found";
            return;
        }

        $response['bool'] = true;
        $response['data'] = $fetchVideoData;
    }

    //------------------------GeoData-----------------------
    function addGeoData(){
        global $response;
        global $CONN;
        $check = checkIfProjectAdmin();
        if (!$check) {
            $response['bool'] = false;
            $response['msg'] = "Insufficient privileges";
            return;
        };

        $lyr_name = filter_input(INPUT_POST, 'lyr_name', FILTER_SANITIZE_STRING);
        $url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_STRING);
        $dataType = filter_input(INPUT_POST, 'dataType', FILTER_SANITIZE_STRING);
        $defaultView = filter_input(INPUT_POST, 'defaultView', FILTER_VALIDATE_BOOLEAN);
        $share = filter_input(INPUT_POST, 'share', FILTER_VALIDATE_BOOLEAN);

        $pro_id = $_SESSION['project_id'];
        $pro_name = $_SESSION['project_name'];
        $email = $_SESSION['email'];
        
        //add record to Data_Pool
        $insertSQL = "INSERT INTO Data_Pool ([Data_Name], [Data_URL], [Data_Owner], [Data_Owner_PID], [Share], [Data_Type], [Added_Date], [Added_By], [Offset], [X_Offset], [Y_Offset]) VALUES (:0, :1, :2, :3, :4, :5, GETDATE(), :6, :7, :8 ,:9)";
        $inserted = $CONN->execute($insertSQL, array($lyr_name, $url, $pro_name, $pro_id, $share, $dataType, $email, '0', '0', '0'));
        
        if (!$inserted) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while adding data record!";
            return false;
        }else{
            //add record to Project_Layers
            $insertedId = $CONN->getLastInsertID();
            $addLyrSQL = "INSERT INTO Project_Layers ([Data_ID], [Layer_Name], [Attached_Date], [zindex], [Default_View],[Project_ID],[Attached_By]) VALUES (:0, :1, GETDATE(), :2 , :3, :4, :5)";
            $addedLyr = $CONN->execute($addLyrSQL, array($insertedId, $lyr_name, 1, $defaultView, $pro_id, $email));

            if (!$addedLyr) {
                $response['bool'] = false;
                $response['msg'] = "SQL Error while binding layer to project!";
                return false;
            }else{
                $response['bool'] = true;
                $response['msg'] = "Success";
            }
        }
    }    

    function deleteGeodata(){   //not complete
        global $response;
        global $CONN;
        $pid = $_SESSION['project_id'];
        $projectIdName = $_SESSION['projectID'];
        $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);

        $getData = $CONN->fetchRow("SELECT * FROM Data_Pool WHERE Data_Owner_PID =:0  AND Data_ID =:1", array($pid, $dataId));
        if(!$getData){  // not owner 
            $response['bool'] = false;
            $response['msg'] = "No data found";
            return;
        }

        $URL = $getData['Data_URL'];
        $Data_Type = $getData['Data_Type'];
        $Data_Name = $getData['Data_Name'];
        if($Data_Type == "KML"){
            $url_exp = explode("/", $URL);
            $dir = $_SERVER['DOCUMENT_ROOT']."\Data\KML\\".$url_exp[3];
            $dirTempFile = dirname(__DIR__).'\JS\uploader\kml_raw\\'.$url_exp[3];

            if (file_exists($dir)){
                if (unlink($dir)) {   
                    $response['delete'] = "Delete successful";
                } else {
                    $response['delete'] = "Delete failed";
                }   
            } else {
                $response['delete'] = "File not found";
            }

            if(file_exists($dirTempFile)){
                if (unlink($dirTempFile)) {   
                    $response['deleteTemp'] = "Delete successful";
                } else {
                    $response['deleteTemp'] = "Delete failed";
                }
            }
            
        }else if ($Data_Type == "B3DM"){
            $url_exp = explode("/", $URL);
            $dir = $_SERVER['DOCUMENT_ROOT']."\Data\3DTiles\\".$url_exp[3];
            if (is_dir($dir)) {
                $objects = scandir($dir);
                // remove the content
                foreach ($objects as $object) {
                      if ($object != "." && $object != "..") {
                        if (filetype($dir."\\".$object) == "dir"){
                            rmdir($dir."\\".$object); //remove subfolders
                        } 
                        else {
                            unlink($dir."\\".$object);
                        }
                    }
                }
                //remove the folder
                if (filetype($dir."\\".$url_exp[3]) == "dir") {
                    rmdir($dir."\\".$url_exp[3]); 
                    $response['delete'] = "Delete successful";
                }
                else{
                    $response['delete'] = "Delete failed";
                }
            }else{
                $response['delete'] = "Folder not found";
            }
        }else if($Data_Type == "SHP"){
            $dir = $_SERVER['DOCUMENT_ROOT']."\Data\Geoserver\Shapefile";
            if (is_dir($dir."\\".$Data_Name)) {
                $objects = scandir($dir."\\".$Data_Name);   //get contents of the folder
                foreach ($objects as $object) {
                    if ($object != "." && $object != "..") {
                        if (is_dir($dir."\\".$object)){
                            rmdir($dir."\\".$Data_Name."\\".$object); //remove subfolders
                        } 
                        else {
                            unlink($dir."\\".$Data_Name."\\".$object);
                        }
                    }
                }
                //remove the folder
                if (filetype($dir."\\".$Data_Name) == "dir") {
                    rmdir($dir."\\".$Data_Name); 
                    $response['delete'] = "Delete successful";
                }
                else{
                    $response['delete'] = "Delete failed";
                }
            }else{
                $response['delete'] = "Folder not found";
            }

            //rest api for delete record on geoserver
            $response['geoserver'] =  removeDataStore($projectIdName, str_replace("%20","-",$URL));
        }
        $deleteSQL = $CONN->execute("DELETE FROM Data_Pool WHERE Data_ID =:0", array($dataId));
        if (!$deleteSQL) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while deleting record!";
            return false;
        }
        $response['bool'] = true;
        $response['msg'] = "Update successful";
     
    }

    function removeDataStore($workspace, $datastore){
        global $JOGETLINKOBJ;
        $geoUser = $JOGETLINKOBJ->getAdminUserName('geoServer');
        $geoPwd = $JOGETLINKOBJ->getAdminUserPassword('geoServer');
        
        //geoserver rest api 
        $url           = $JOGETLINKOBJ->geoServerHost."/geoserver/rest/workspaces/".$workspace."/datastores/".$datastore."/?recurse=true";
        $headers       = array(
            'Content-Type:application/xml',
            'Authorization: Basic ' . base64_encode("$geoUser:$geoPwd"),
        );
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $head     = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if($httpCode === 200){
            return true;
        }else{
            return false;
        }
    }

    function getGeoData(){
        global $response;
        global $CONN;
        $pid = $_SESSION['project_id'];

        $fetchGeoData = $CONN->fetchAll("SELECT 
        g.groupName, 
        g.groupView, 
        p.meta_id,
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
        WHERE p.Project_ID =:0 ORDER BY layerGroup ASC", array($pid));
        $response['bool'] = true;
        $response['data'] = $fetchGeoData;
    }

    function getProjectLayerList(){
        global $response;
        global $CONN;
        if(!isset($_SESSION['project_id'])) { 
            $response['bool'] = false;
            $response['msg'] = 'No project id found!'; 
        }
        $pid = $_SESSION['project_id'];

        $fetchGeoLayers = $CONN->fetchAll("SELECT PL.Data_ID, PL.Layer_Name, PL.Default_View,DP.Data_Type, DP.Added_Date, DP.Data_Owner
        FROM Project_Layers PL LEFT JOIN Data_Pool DP ON PL.Data_ID = DP.Data_ID 
        WHERE Project_ID =:0", array($pid));

        $response['bool'] = true;
        $response['data'] = $fetchGeoLayers;
    }

    function attachOrDetachLayer(){
        global $response;
        global $CONN;
        $email = $_SESSION['email'];
        $pid = $_SESSION['project_id'];

        $data_attach = filter_input(INPUT_POST, 'val', FILTER_SANITIZE_STRING);
        $data_id = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);
        $defaultView = filter_input(INPUT_POST, 'defaultView', FILTER_VALIDATE_BOOLEAN);
        $lyr_name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);

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
                return;
            }
            
            if($execution){
                $response['bool'] = true;
                $response['msg'] = "Successful";
            }else{
                $response['bool'] = false;
                $response['msg'] = "SQL execution failed";
            }
        }else{  //not shared, need to check if it is project owner or not
            if($checkData['Data_Owner_PID'] === $pid){
                if($data_attach == 'Attach' && $checkAttached === false){
                    $execution = $CONN->execute("INSERT INTO Project_Layers ([Data_ID],[Layer_Name],[Project_ID],[zindex],[Default_View],[Attached_By],[Attached_Date]) VALUES (:0, :1, :2, '1', :3, :4, GETDATE())", array($data_id, $lyr_name, $pid, $defaultView, $email));
                }
                else if($data_attach == 'Detach' && $checkAttached === true){
                    $execution = $CONN->execute("DELETE FROM Project_Layers WHERE Data_ID =:0 AND Project_ID =:1", array($data_id, $pid));
                }
                else{
                    $response['bool'] = false;
                    $response['msg'] = "Error";
                    return;
                }
                if($execution){
                    $response['bool'] = true;
                    $response['msg'] = "Successful";
                }else{
                    $response['bool'] = false;
                    $response['msg'] = "SQL execution failed";
                }
            }
            else{   //not owner, return
                $response['bool'] = false;
                $response['data'] = "Insufficient Credentials";
                return;
            }
        }
    }

    function saveLayerGroup(){
        global $response;
        global $CONN;
        $projectID = $_SESSION['project_id'];
        $layerID = filter_input(INPUT_POST, 'layerID', FILTER_VALIDATE_INT);

        $check = checkIfProjectAdmin();
        if (!$check) {
            $response['bool'] = false;
            $response['msg'] = "Insufficient privileges";
            return;
        };

        $groupName = filter_input(INPUT_POST, 'groupName', FILTER_SANITIZE_STRING);
        $defDisplay = filter_input(INPUT_POST, 'defaultDisplay', FILTER_SANITIZE_STRING);
        $groupID = filter_input(INPUT_POST, 'groupID', FILTER_VALIDATE_INT);
        $typeFunc = filter_input(INPUT_POST, 'typeFunc', FILTER_SANITIZE_STRING);
        $layerTitle = filter_input(INPUT_POST, 'layerTitle', FILTER_SANITIZE_STRING);
        $flagROS = ($typeFunc == "newGrpStud") ? "1" : "0";

        function checkGroupName($projectID, $groupName, $groupID){
            global $response;
            global $CONN;

            if($groupID){
                $check = $CONN->fetchOne("SELECT groupName FROM groupLayers WHERE projectID =:0 AND groupName =:1 AND groupID !=:2 ", array($projectID, $groupName, $groupID));
            }
            else{
                $check = $CONN->fetchOne("SELECT groupName FROM groupLayers WHERE projectID =:0 AND groupName =:1", array($projectID, $groupName));
            }
            if($check){
                $response['bool'] = false;
                $response['msg'] = "Group name exist, please enter a new group name.";
                return false;
            }
        }

        if($typeFunc){
            if($defDisplay == "true"){
                $defDisplay = 1;
            }
            else if ($defDisplay == "false"){
                $defDisplay = 0;
            }

            if(checkGroupName($projectID, $groupName, $groupID) === false){
                return;
            }

            $insertSQL = "INSERT INTO groupLayers ([groupName],[groupView],[projectID],[layerTitle], [flagROS]) VALUES (:0, :1, :2, :3, :4)";
            $inserted = $CONN->execute($insertSQL, array($groupName, $defDisplay, $projectID, $layerTitle, $flagROS));
            if (!$inserted) {
                $response['bool'] = false;
                $response['msg'] = "SQL Error while adding data record!";
                return false;
            }
            else{
                $groupID = $CONN->getLastInsertID();   
            }

            //update layer that already have group
            $lyrUpdate = $CONN->execute("UPDATE Project_Layers SET layerGroup =:0, Default_View =:1 WHERE Layer_ID =:2", array($groupID, $defDisplay, $layerID));
            if (!$lyrUpdate) {
                $response['bool'] = false;
                $response['msg'] = "Unable to update layer details due to error in sql, please try again!";
                return;
            }
            $response['bool'] = true;
            $response['msg'] = "New group is created successfully.";
        
        }
        else{
            if ($defDisplay == "true"){
                $defDisplay = 1;
            }
            else if ($defDisplay == "false"){
                $defDisplay = 0;
            }

            if($groupID && $groupName){ //edit group record
                if(checkGroupName($projectID, $groupName, $groupID) === false){
                    return;
                }
                $updateGroup = $CONN->execute("UPDATE groupLayers SET groupName =:0, groupView =:1 WHERE projectID =:2 AND groupID =:3", array($groupName, $defDisplay, $projectID, $groupID));
                if (!$updateGroup) {
                    $response['bool'] = false;
                    $response['msg'] = "Unable to update group details due to error in sql, please try again!";
                    return;
                }
            }
            //update same default view for same group
            $groupLyrUpdate = $CONN->execute("UPDATE Project_Layers SET Default_View =:0 WHERE layerGroup =:1", array($defDisplay, $groupID));
            if (!$groupLyrUpdate) {
                $response['bool'] = false;
                $response['msg'] = "Unable to update project layer details due to error in sql, please try again!";
                return;
            }

            //update layer that already have group
            $lyrUpdate = $CONN->execute("UPDATE Project_Layers SET layerGroup =:0 WHERE Layer_ID =:1", array($groupID, $layerID));
            if (!$lyrUpdate) {
                $response['bool'] = false;
                $response['msg'] = "Unable to update layer details due to error in sql, please try again!";
                return;
            }
            $response['bool'] = true;
            $response['msg'] = "Record is updated successfully.";

        }
    }

    function removeLayerGroup(){
        global $response;
        global $CONN;
        $layerId = filter_input(INPUT_POST, 'layerId', FILTER_VALIDATE_INT);

        $check = checkIfProjectAdmin();
        if (!$check) {
            $response['bool'] = false;
            $response['msg'] = "Insufficient privileges";
            return;
        };

        if ($layerId){
            $updateGroupForLayer = $CONN->execute("UPDATE Project_Layers SET layerGroup = NULL WHERE Layer_ID =:0", array($layerId));
            if (!$updateGroupForLayer) {
                $response['bool'] = false;
                $response['msg'] = "Unable to remove group layer due to error in sql, please try again!";
                return;
            }
            $response['bool'] = true;
            $response['msg'] = "Remove group layer is success";
        }
    }

    function getCompleteGeoData(){      //used in project admin
        global $response;
        global $CONN;
        $project_id = $_SESSION['project_id'];
        $projectOwner = $_SESSION['project_owner'];
        

        $check = checkIfProjectAdmin();
        if (!$check) {
            $response['bool'] = false;
            $response['msg'] = "Insufficient privileges";
            return;
        };

        $fetchGeoData = $CONN->fetchAll("SELECT 
            DP.Added_By, 
            DP.Added_Date, 
            DP.Data_ID, 
            DP.Data_Name, 
            DP.Data_Type, 
            DP.Data_URL, 
            DP.Offset,
            DP.X_Offset,
            DP.Y_Offset, 
            DP.Share, 
            DP.Style, 
            PL.Default_View, 
            PL.Layer_ID, 
            PL.Layer_Name,
            PL.layerGroup, 
            PL.Project_ID, 
            PL.zindex,
            PL.Attached_By,
            PL.Attached_Date,
            p.project_name as Data_Owner, 
            p.project_id_number as Data_Owner_PID, 
            p.project_id as Data_Owner_ID , 
            Frequency = (SELECT DISTINCT COUNT(Data_ID) FROM Project_Layers WHERE Data_ID = DP.Data_ID) 
            FROM Data_Pool DP
            INNER JOIN projects p ON p.project_id_number = DP.Data_Owner_PID AND p.project_owner = :0
            LEFT JOIN Project_Layers PL ON PL.Data_ID = DP.Data_ID AND PL.Project_ID =:1
            ORDER BY PL.Attached_Date DESC", array($projectOwner, $project_id));
        $response['bool'] = true;
        $response['data'] = $fetchGeoData;
    }

    // --------------layer management in index
    function detachLayer(){    //detachLayer.php
        global $response;
        global $CONN;
        $pid = $_SESSION['project_id'];

        $check = checkIfProjectAdmin();
        if (!$check) {
            $response['bool'] = false;
            $response['msg'] = "Insufficient privileges";
            return;
        };

        $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);

        $check = $CONN->fetchOne("SELECT count(*) FROM Project_Layers WHERE Data_ID =:0 AND Project_ID =:1", array($dataId, $pid));
        if($check != 1){
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
    }

    function renameLayer(){    //layerRename.php
        global $response;
        global $CONN;
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
        if($check != 1){
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
    }

    function switchDefaultDisplay(){    //switchDefDisplay.php
        global $response;
        global $CONN;
        $pid = $_SESSION['project_id'];

        $check = checkIfProjectAdmin();
        if (!$check) {
            $response['bool'] = false;
            $response['msg'] = "Insufficient privileges";
            return;
        };

        $defViewInput = filter_input(INPUT_POST, 'defView', FILTER_SANITIZE_STRING);
        $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);

        if($defViewInput == "ON"){
            $defView = 0;
        }
        else{
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

        if ($selectGroupId){
            if($defView == 0){
                $lyrUpdate = $CONN->execute("UPDATE groupLayers SET groupView =:0 WHERE groupID =:1", array($defView, $selectGroupId));
                if (!$lyrUpdate) {
                    $response['bool'] = false;
                    $response['msg'] = "Unable to update group layer details due to error in sql, please try again!";
                    return;
                }
                $response['bool'] = true;
                $response['groupOff'] = $resGroupId;
                return;
            }
            else{
                $selectLayerId = $CONN->fetchOne("SELECT Layer_ID FROM Project_Layers WHERE layerGroup =:0 AND Default_View = '0'", array($resGroupId));
                if(!$selectLayerId){
                    $lyrUpdate = $CONN->execute("UPDATE groupLayers SET groupView = '1' WHERE groupID =:0", array($selectGroupId));
                    if (!$lyrUpdate) {
                        $response['bool'] = false;
                        $response['msg'] = "Unable to update group layer details due to error in sql, please try again!";
                        return;
                    }
                    $response['bool'] = true;
                    $response['groupOn'] = $resGroupId;
                    return;
                }

            }
        }
        $response['bool'] = true;
    }

    function getShpStyle(){
        global $response;
        global $CONN;
        global $JOGETLINKOBJ;
        $geoUser = $JOGETLINKOBJ->getAdminUserName('geoServer');
        $geoPwd = $JOGETLINKOBJ->getAdminUserPassword('geoServer');

        $project_id = $_SESSION['project_id'];

        $check = checkIfProjectAdmin();
        if (!$check) {
            $response['bool'] = false;
            $response['msg'] = "Insufficient privileges";
            return;
        };

        $url = $JOGETLINKOBJ->geoServerHost."/geoserver/rest/styles.json";
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $headers = array(
            "Authorization: Basic " . base64_encode("$geoUser:$geoPwd"),
        );

        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        $resp = curl_exec($curl);
        curl_close($curl);
        $response['data'] = json_decode($resp)->styles->style;
        // $fetchGeoData = $CONN->fetchAll("SELECT DISTINCT Style FROM Data_Pool WHERE Data_Type='SHP' AND Style != 'NULL'");
        // $response['data'] = $fetchGeoData;
    }

    function createSLDFile(){
        global $response;
        global $CONN;
        global $JOGETLINKOBJ;

        $styleName = filter_input(INPUT_POST, 'styleName', FILTER_SANITIZE_STRING);
        $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);
        $editFlag = filter_input(INPUT_POST, 'editFlag', FILTER_VALIDATE_BOOLEAN);

        if(!$styleName || !$dataId){
            $response['bool'] = false;
            $response['msg'] = "Parameters not found";
            return;
        }

        $url = $JOGETLINKOBJ->geoServerHost."/JavaBridge/geodataupload/styleCreated.php";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $data = $_POST;
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        $head = curl_exec($ch);
        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
            $ret["status"] = "Error";
            $ret["msg"] = $error_msg;
            echo json_encode ($ret);
            die();
        }
        curl_close($ch);
        $head = json_decode($head, true);
        if (isset ($head['bool']) && $head['bool'] == true){
            //associate to layer 
            $dataUpdate = $CONN->execute("UPDATE Data_Pool SET Style =:0 WHERE Data_ID =:1", array($styleName, $dataId));
            if (!$dataUpdate) {
                $response['bool'] = false;
                $response['msg'] = "Unable to update layer details due to error in sql, please try again!";
                return;
            }
            $response['bool'] = true;
            $response['msg'] = "Update successfully.";
        }
        else{
            $response['bool'] = false;
            $response['msg'] = "Update unsuccessfull, geoserver style error.";
        }
        
    }

    function attachShpStyle(){
        global $response;
        global $CONN;
        $styleName = filter_input(INPUT_POST, 'styleName', FILTER_SANITIZE_STRING);
        $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);

        if(!$styleName || !$dataId){
            $response['bool'] = false;
            $response['msg'] = "Parameters not found";
            return;
        }
        $dataUpdate = $CONN->execute("UPDATE Data_Pool SET Style =:0 WHERE Data_ID =:1", array($styleName, $dataId));
        if (!$dataUpdate) {
            $response['bool'] = false;
            $response['msg'] = "Unable to update layer details due to error in sql, please try again!";
            return;
        }
        $response['bool'] = true;
        $response['msg'] = "Update successfully.";
    }

    function parseShpStyle(){
        global $response;
        global $JOGETLINKOBJ;
        $geoUser = $JOGETLINKOBJ->getAdminUserName('geoServer');
        $geoPwd = $JOGETLINKOBJ->getAdminUserPassword('geoServer');

        $styleNameInput = filter_input(INPUT_POST, 'styleName', FILTER_SANITIZE_STRING);
        $styleName = $styleNameInput.".sld";
        $url  = $JOGETLINKOBJ->geoServerHost."/geoserver/rest/styles/".rawurlencode($styleName);
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $headers = array(
            'Content-Type:application/vnd.ogc.sld+xml',
            "Authorization: Basic " . base64_encode("$geoUser:$geoPwd"),
        );

        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        $resp = curl_exec($curl);
        $xml = new SimpleXMLElement($resp);

        foreach($xml->children() as $node) {
            $featureTypeStyle = $node->UserStyle->FeatureTypeStyle->Rule;
            foreach($featureTypeStyle->children() as $key => $featureType) {
                if($key === "PointSymbolizer"){
                    $response['pointImg'] = (string) $featureType->Graphic->ExternalGraphic->OnlineResource->attributes("xlink",TRUE)->href;
                }else if ($key === "LineSymbolizer"){
                    foreach($featureType->Stroke->CssParameter as $cssParam){
                        if($cssParam->attributes() == "stroke"){
                            $response['lineColor'] = (string) $cssParam;
                        }
                        if($cssParam->attributes() == "stroke-width"){
                            $response['lineWidth'] = (string) $cssParam;
                        }
                    }
                }else if ($key === "PolygonSymbolizer"){
                    foreach($featureType->Fill->CssParameter as $cssParam){
                        if($cssParam->attributes() == "fill"){
                            $response['fillPolygon'] = (string) $cssParam;
                        }
                        if($cssParam->attributes() == "fill-opacity"){
                            $response['fillOpacity'] = (string) $cssParam;
                        }
                    }
                    foreach($featureType->Stroke->CssParameter as $cssParam){
                        if($cssParam->attributes() == "stroke"){
                            $response['outLineColor'] = (string) $cssParam;
                        }
                        if($cssParam->attributes() == "stroke-width"){
                            $response['outLineWidth'] = (string) $cssParam;
                        }
                    }
                }
            }
        }
        curl_close($curl);
    }

    function updateECWName(){
        global $response;
        global $CONN;
        $pid = $_SESSION['project_id'];

        $check = checkIfProjectAdmin();
        if (!$check) {
            $response['bool'] = false;
            $response['msg'] = "Insufficient privileges";
            return;
        };

        $dataId = filter_input(INPUT_POST, 'data_id', FILTER_VALIDATE_INT);
        $setName = filter_input(INPUT_POST, 'set_name', FILTER_SANITIZE_STRING);

        $sql = $CONN->execute("UPDATE AerialImageCompare SET Use_Name =:0 WHERE AIC_Id =:1 AND Package_Id =:2", array($setName, $dataId, $pid));
        if (!$sql) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error while updating details!";
            return false;
        }
        $response['bool'] = true;
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

            $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup = NULL WHERE AIC_Id =:1", array($groupID, $aicID));
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
            $inserted2 = $CONN->execute($insertSQL2, array($subgroupID, $subgroupName, $projectID));   
            if (!$inserted2) {
                $response['bool'] = false;
                $response['msg'] = "SQL Error while adding subgroup data record!";
                return false;
            }

            //UPDATE DATA WITH GROUP AND SUBGROUP ID
            $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup =:1 WHERE AIC_Id =:2", array($groupID, $subgroupID, $aicID));
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

            $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup =:1 WHERE AIC_Id =:2", array($groupID, $subgroupID, $aicID));
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
            $aerialUpdate = $CONN->execute("UPDATE AerialImageCompare SET Image_Group =:0, Image_SubGroup =:1 WHERE AIC_Id =:2", array($groupID, $subgroupID, $aicID));
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