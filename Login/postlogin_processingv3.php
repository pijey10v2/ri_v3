<?php
    require('include/_include.php');
    ini_set('max_execution_time', '300');
    set_time_limit(300);
    session_start();
    include_once('../Backend/class/jogetLink.class.php');
    include_once('../Backend/class/accessControl.class.php');

    global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ, $SYSTEM, $IS_DOWNSTREAM;

    $JOGETLINKOBJ = new JogetLink();
    $api_username = $JOGETLINKOBJ->getAdminUserName();
    $api_password = $JOGETLINKOBJ->getAdminUserPassword();
    $jogetHostIP = $JOGETLINKOBJ->jogetHost;

    function checkIfCorrectAppSet($app_id, $app){
        global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;
        $ret = array();
        $processIdArray = explode('::', $app_id ?? "");
        $host = $jogetHostIP . "jw/web/json/workflow/process/list?packageId=".$processIdArray[0];
        $headers = array(
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode("$api_username:$api_password")
        );

        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $return = curl_exec($ch);
        $err    = curl_error($ch);
        curl_close($ch);

        if ($err) {
            return false;
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $flag = false;
            if(isset($data_arr['data'])){
                $i=0;
                $data =$data_arr['data'];
                while($i< sizeof($data) && !$flag){
                    if($data[$i]['packageId'] == $processIdArray[0] && $data[$i]['packageName'] == $processIdArray[1]){
                        if($app == 'finance'){
                            if($data[$i]['name'] == "Claim Process" || $data[$i]['name'] == "VO Process") {
                                $flag = true;
                                break;
                            }
                        }elseif($app == 'document'){
                            if($data[$i]['name'] == "Document") {
                                $flag = true;
                                break;
                            }                
                        }
                    }
                    $i++;
                }
            }
        }
        return $flag;
    }

    function checkAdminAccess($role){
        $adminAccessRoles = ['Project Manager', 'Planning Engineer', 'Project Monitor', 'Project Director', "Senior Civil Engineer (Road Asset)", "Assistant Director (Road Asset)", "KKR", "Civil Engineer (Road Asset)", "SMO Representative", "PMO Representative"];
        if($_SESSION['user_org'] == "UTSB") array_push($adminAccessRoles, "Construction Engineer");
    
        // can handle asset project here also
        return in_array($role, $adminAccessRoles);
    }
    
    function getSession(){
        global $CONN;
        global $SYSTEM;

        $ret = array();
        $appSet = array();
        $appsRights = array();

        $projectId = filter_input(INPUT_POST, 'idProject', FILTER_VALIDATE_INT);
        $pageOpen = filter_input(INPUT_POST, 'pageOpen', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $email = $_SESSION['email'];
        $userId = $_SESSION['user_id'];
        $_SESSION['project_list']  = $_SESSION['project_list'];
        $_SESSION['project_id'] = $projectId; //project_id_number
        $appSet["myConstruct"] = false;
        $appSet["myAsset"] = false;
        $appSet["myDocument"] = false;
        $appSet["myFinance"] = false;
        $appSet["myTask"] = false;
        $_SESSION['ui_pref'] = $_SESSION['ui_pref'];

        $sql = "SELECT p.duration as duration, 
            p.start_date as pstartdate, 
            p.end_date as penddate, 
            p.warranty_end_date as pwarrantyenddate,
            p.project_name as pname, 
            p.project_id as pid, 
            p.project_owner as powner, 
            p.project_wpc_id as pwpcid, 
            p.project_id_number as pnumber, 
            p.industry as ind, 
            p.time_zone_text as timet, 
            p.time_zone_value as timev, 
            p.location as loc, 
            p.longitude_1 as long1,
            p.longitude_2 as long2,
            p.latitude_1 as lat1, 
            p.latitude_2 as lat2, 
            p.icon_url as icon, 
            p.created_by as created_by, 
            p.created_time as created_time, 
            p.updated_by as updated_by, 
            p.last_update as last_update,
            p.parent_project_id_number as is_Parent, 
            p.file_method as file_method,
            p.file_method as file_method,
            p.Project_type as Project_type,
            p.owner_org_id as ownerId,
            p.project_phase as project_phase,
            p.wpc_abbr as wpc_abbr,
            r.Pro_Role as Pro_Role,
            r.last_access as last_access
			FROM projects p, pro_usr_rel r 
            WHERE p.project_id_number=:0 
            AND p.project_id_number = r.Pro_ID 
            AND r.Usr_ID =:1";

        $resSql = $CONN->fetchRow($sql, array($projectId, $userId));
        if($resSql){
            $_SESSION['signed_In_Email'] = $email;
            $_SESSION['project_id_number'] = $resSql['pnumber'];
            $_SESSION['project_name'] = $resSql['pname'];
            $_SESSION['projectID'] = $resSql['pid'];
            $_SESSION['longitude_1'] = $resSql['long1'];
            $_SESSION['longitude_2'] = $resSql['long2'];
            $_SESSION['latitude_1'] = $resSql['lat1'];
            $_SESSION['latitude_2'] = $resSql['lat2'];
            $_SESSION['project_role'] = $resSql['Pro_Role'];
            $_SESSION['project_owner'] = $resSql['powner'];
            $_SESSION['icon_url'] = $resSql['icon'];
            $_SESSION['file_method'] = trim($resSql['file_method']);
            $_SESSION['created_by'] = $resSql['created_by'];
            $_SESSION['last_access'] = new DateTime($resSql['last_access'] ?? "");

            if($_SESSION['ui_pref'] == "ri_v3"){
                $_SESSION['prefix_loc'] = "../";
            }
            else{
                $_SESSION['prefix_loc'] = "";
            }

            if (is_null($resSql['is_Parent'])) {
                $_SESSION['is_Parent'] = "isParent";
            } else {
                $_SESSION['is_Parent'] = $resSql['is_Parent'];
            };
            if (is_null($resSql['ind'])) {
                $_SESSION['industry'] = "Undefined";
            } else {
                $_SESSION['industry'] = $resSql['ind'];
            };
            if (is_null($resSql['timet'])) {
                $_SESSION['time_zone_text'] = "Undefined";
            } else {
                $_SESSION['time_zone_text'] = $resSql['timet'];
            };
            if (is_null($resSql['timev'])) {
                $_SESSION['time_zone_value'] = "";
            } else {
                $_SESSION['time_zone_value'] = $resSql['timev'];
            };
            if (is_null($resSql['loc'])) {
                $_SESSION['location'] = "Undefined";
            } else {
                $_SESSION['location'] = $resSql['loc'];
            };
            if (is_null($resSql['pstartdate'])) {
                $_SESSION['start_date']  = null;
            } else {
                $_SESSION['start_date'] = (new DateTime($resSql['pstartdate']))->format("d/m/Y");
                
            };
            if (is_null($resSql['penddate'])) {
                $_SESSION['end_date'] = null;
            } else {
                $_SESSION['end_date'] = (new DateTime($resSql['penddate']))->format("d/m/Y");
            };
            if($SYSTEM == 'KKR'){
                if (is_null($resSql['pwarrantyenddate'])) {
                    $_SESSION['warranty_end_date'] = null;
                } else {
                    $_SESSION['warranty_end_date'] =  (new DateTime($resSql['pwarrantyenddate']))->format("d/m/Y");
                };
            }
            if (!is_null($resSql['duration'])) {
                $_SESSION['projectDuration'] = $resSql['duration'];
            }
            if (is_null($resSql['created_time'])) {
                $_SESSION['created_time'] = null;
            } else {
                $_SESSION['created_time'] = (new DateTime($resSql['created_time']))->format("d/m/Y"); 
            };
            if (is_null($resSql['updated_by'])) {
                $_SESSION['updated_by'] = "";
            } else {
                $_SESSION['updated_by'] = $resSql['updated_by'];
            };
            if (is_null($resSql['last_update'])) {
                $_SESSION['last_update'] = "";
            } else {
                $_SESSION['last_update'] = (new DateTime($resSql['last_update']))->format("d/m/Y");
            };
            if(!is_null($resSql['pwpcid'])){
                $_SESSION['wpc_id'] = $resSql['pwpcid'];
            }else{
                $_SESSION['wpc_id'] = "";
            };
            $_SESSION['project_owner'] = ($resSql['powner']) ? $resSql['powner'] : $resSql['ownerId']; //KKR : OBYU
            $_SESSION['Project_type'] = $resSql['Project_type'];
            $_SESSION['project_phase'] = $resSql['project_phase'];
            $_SESSION['wpc_abbr'] = $resSql['wpc_abbr'];

            if($SYSTEM == 'OBYU'){
                $access_control = json_decode(file_get_contents("../BackEnd/accessControl_OBYU.json"), true);
            }else{
                if($_SESSION['Project_type'] == 'CONSTRUCT'){
                    $access_control = json_decode(file_get_contents("../BackEnd/accessControl.json"), true);
                }else if($_SESSION['Project_type'] == 'ASSET'){
                    $access_control = json_decode(file_get_contents("../BackEnd/accessControlAsset.json"), true);
                }else if($_SESSION['Project_type'] == 'FM'){
                    $access_control = json_decode(file_get_contents("../BackEnd/access/accessControlFM.json"), true);
                }
            }

            if (isset($access_control[$resSql['Pro_Role']])) {
                //check and set UI elements based on rights
                if (isset($access_control[$resSql['Pro_Role']]["Project_Document"])) {
                    $_SESSION['Doc_Rights'] = $access_control[$resSql['Pro_Role']]["Project_Document"];
                    $appsRights['Doc_Rights'] = $_SESSION['Doc_Rights'];
                }
                if (isset($access_control[$resSql['Pro_Role']]["PFS"])) {
                    $_SESSION['PFS_Rights'] = $access_control[$resSql['Pro_Role']]["PFS"];
                    $appsRights['PFS_Rights'] = $_SESSION['PFS_Rights'];
                }
                if (isset($access_control[$resSql['Pro_Role']]["Asset"])) {
                    $_SESSION['Asset_Rights'] = $access_control[$resSql['Pro_Role']]["Asset"];
                    $appsRights['Asset_Rights'] = $_SESSION['Asset_Rights'];
                }
                if (isset($access_control[$resSql['Pro_Role']]["FM"])) {
                    $_SESSION['FM_Rights'] = $access_control[$resSql['Pro_Role']]["FM"];
                    $appsRights['FM_Rights'] = $_SESSION['FM_Rights'];
                }
            }

            if(checkAdminAccess($_SESSION['project_role']) && !in_array($_SESSION['projectID'], ['eLibrary', 'projectInformation'])){
                $appSet["myAdmin"] = true;
            }
            else{
                $appSet["myAdmin"] = false;
            }
            
            if(isset($access_control[$resSql['Pro_Role']]["Project_Admin"])){
                $appsRights['Admin_Rights'] = $access_control[$resSql['Pro_Role']]["Project_Admin"];
            }

            $_SESSION['apps_right'] = $appsRights;
        }

        // Link for Project Apps
        $check = false;
        $appsLinks = array();
        if ($_SESSION['is_Parent'] == "isParent") {
            $sql2 = "SELECT * FROM project_apps_process WHERE project_id =:0";
            $resSql = $CONN->fetchRow($sql2, array($projectId));
        }else{
            $sql2 = "SELECT * FROM project_apps_process WHERE project_id =:0";
            $resSql = $CONN->fetchRow($sql2, array($_SESSION['is_Parent']));
        }
        $appsRights['Construct_Apps_Rights'] = $resSql;
        $_SESSION['apps_right'] = $appsRights; // adding back Construct_Apps_Rights array to session array

        if($resSql){
            $appsLinks = $resSql;
            $appSet["myConstruct"] = false;
            $appSet["myTask"] = false;

            if (strpos($appsLinks['constructPackage_name'] ?? '', 'ri_asset') !== false) {
                $appSet["myAsset"] = true;
            }

            $financeFlag = ($appsLinks['financePackage_name'] != null) ? true : false;
            $documentFlag = ($appsLinks['documentPackage_name'] != null) ? true : false;

            $flagObyuFinance = true;
            if($_SESSION['project_role'] == 'Planning Engineer' && $_SESSION['project_owner'] != 'KACC'){
                $flagObyuFinance = false;
            }
            
            if ($_SESSION['is_Parent'] != "isParent") {

                if (isset($access_control[$_SESSION['project_role']])) {
                    //check and set access based on role for left button
                    if (isset($access_control[$_SESSION['project_role']]["Project_Document"])) {
                        $appSet["myDocument"] = ($documentFlag) ? true : false;
                    }
                    if (isset($access_control[$_SESSION['project_role']]["PFS"])) {
                        $appSet["myFinance"] = ($financeFlag) ? true : false;
                    }
                }

                if(!$flagObyuFinance){
                    $appSet["myFinance"] = false;
                }

                if($appSet["myDocument"] || $appSet["myFinance"] || $appSet["myAsset"]){
                    $appSet["myTask"] = true;
                }
            }else{
                if(isset($appSet["myAsset"]) && $appSet["myAsset"]){
                    if (isset($access_control[$_SESSION['project_role']])) {
                        //check and set access based on role for left button
                        if (isset($access_control[$_SESSION['project_role']]["PFS"])) {
                            $appSet["myFinance"] = ($financeFlag) ? true : false;
                            $appSet["myTask"] = $appSet["myFinance"] ? true : false;
                        }
                    }
                }

                if (isset($appsRights['FM_Rights'])) {
                    $appSet["myTask"] = true;
                }
            }

            $_SESSION['app_finance_set'] = $financeFlag;
            $_SESSION['app_doc_set'] = $documentFlag;
            $_SESSION['apps_access'] = $appSet;

            if($pageOpen == 'myFinance'){
                if($financeFlag == false){
                    $ret['error'] = 'The app set for finance is not correct.  Please contact the System Admin';
                    return $ret;
                }
            }
            if($pageOpen == 'myDocument'){
                if($documentFlag == false){
                    $ret['error'] = 'The app set for document is not correct.  Please contact the System Admin';
                    return $ret;
                }
            }

            $_SESSION['appsLinks'] = json_encode($appsLinks);
            $_SESSION['appsOtherLink'] = $appsLinks;

        }

        //List Project Admin
        if ($_SESSION['Project_type'] == "ASSET"){
            $adminRolesClause = "r.Pro_Role IN ('Assistant Director (Road Asset)', 'Senior Civil Engineer (Road Asset)', 'Civil Engineer (Road Asset)')";
        }else{
            $adminRolesClause = "r.Pro_Role = 'Project Manager'";
        }
        $sql = "SELECT u.user_email as email from  users u, pro_usr_rel r where u.user_id = r.Usr_ID AND r.Pro_ID =:0 AND $adminRolesClause";
        $resPm = $CONN->fetchAll($sql, array($projectId));
        $admin = array();
        $i =0;
        if($resPm){
            foreach ($resPm as $pmData) {
                $admin[$i] = $pmData['email'];
                $i++;
            }
            $_SESSION['Admin Users'] = $admin;
        }

        //List EOT
        $sql = "SELECT * FROM EOT WHERE Pro_ID =:0 ORDER BY Update_Date ASC";
        $resEot = $CONN->fetchAll($sql, array($projectId));
        if ($resEot) {
            $EOT = array();
            $i = 0;
            foreach ($resEot as $eotData) {
                $object = (object) ['duration' => $eotData['EOT'], 'docURL' => $eotData['Doc_URL'], 'updateDate' => date_format($eotData['Update_Date'], "d/m/Y")];
                array_push($EOT, $object);
                $_SESSION['New_End_Date'] =  date_format($eotData['New_End_Date'], "d/m/Y");
                $i++;
            }
            $_SESSION['EOT'] = $EOT;
        }

        $project_phase_clause = '';
		if($_SESSION['user_org'] == 'pmc_1b'){
			$project_phase_clause = " AND project_phase = '1B' ";
		}else if($_SESSION['user_org'] == 'HSSI'){
			$project_phase_clause = " AND  (project_phase != '1B' OR project_phase IS  NULL) ";
		}

        // get child project infomation
		$res_fetch_proPhase = $CONN->fetchAll("select * from projects where parent_project_id_number = :0 and status = 'active' $project_phase_clause", array($projectId));
		foreach ($res_fetch_proPhase as $key => $val) {
			$val['package_uuid'] = $val['project_id_number']."_". $val['project_id']. "_" . $val['project_id_number'];
			$res_fetch_proPhase[$key] = $val;

			$packageUuids[] =  $val['package_uuid'] ;
			
		} 
        
		if (isset($packageUuids) && count($packageUuids) > 0) {
			$inPackageUuid = implode('","', $packageUuids) ; 
			$_SESSION['inPackageUuid'] = $inPackageUuid;
		} else {
			$_SESSION['inPackageUuid'] = '';
		}
  

        //Parent Project ID (overall project ID) need to send to joget
        if ($_SESSION['is_Parent'] != "isParent") {
            $sql3 = "SELECT project_id, project_name FROM projects WHERE project_id_number =:0";
            $resSql = $CONN->fetchRow($sql3, array($_SESSION['is_Parent']));

            if($resSql){
                $_SESSION['parent_project_id'] = $resSql['project_id'];
                $_SESSION['parent_project_name'] = $resSql['project_name'];
            }
        }
        if ($_SESSION['is_Parent'] == "isParent") {
            $_SESSION['parent_project_name'] = $_SESSION['project_name'];
        }

        $_SESSION['joget_auth64'] = base64_encode($_SESSION['password']);
        
        $jogetlink = new JogetLink();
        $_SESSION['jogetAppLink'] = $jogetlink->jogetAppLink;

        $ACCESSCONTROLOBJ = new accessControl();
        $_SESSION['fullAccess'] = $ACCESSCONTROLOBJ->getControlArray();
        $_SESSION['setupAccess'] = $ACCESSCONTROLOBJ->getSetupArray();
        $_SESSION['manageAccess'] = $ACCESSCONTROLOBJ->getManageArray();
        $_SESSION['bulkArpprovalAccess'] = $ACCESSCONTROLOBJ->getBulkArpprovalArray();
        
        $session_data = $_SESSION;
        unset($session_data['password']); 
        unset($session_data['joget_auth64']); 
        return $session_data;
    }

    function setLastAccess(){
        //Update dateTime user enter project
        global $CONN;
        if(isset($_SESSION['project_id_number'])){
            $projId = $_SESSION['project_id_number'];
            $userId = $_SESSION['user_id'];
            $currDate = date('Y-m-d H:i:s');
            $currDateObj = new DateTime();
            
            $sql = "UPDATE pro_usr_rel SET last_access = :0 where (Usr_ID = :1 AND Pro_ID = :2)";
            $lastLogin = $CONN->execute($sql, array($currDate, $userId, $projId));

            if(!$lastLogin){
                return false;
            }

            return ([$projId]);
        }
    }

    function setThemeMode($mode = 'light'){
        global $CONN;
        $_SESSION['theme_mode'] = $mode;
        $userId = $_SESSION['user_id'];
        $ok = $CONN->execute('update users set theme_mode =:0 where user_id = :1', array($mode, $userId));
        if(!$ok){
            return false;
        }
        return true;
    }

    function getThemeMode(){
        global $CONN, $PRODUCTION_FLAG;
        $userId = $_SESSION['user_id'];
        $ok = $CONN->fetchOne('select theme_mode from users where user_id = :0', array($userId));
        $return = array($ok, $PRODUCTION_FLAG);

        if(!$return){
            return false;
        }
        return $return;
    }

    function setUIPreference($ui){
        global $CONN;
        $_SESSION['ui_pref'] = $ui;
        $userId = $_SESSION['user_id'];
        $ok = $CONN->execute('update users set ui_pref =:0 where user_id = :1', array($ui, $userId));
        if(!$ok){
            return false;
        }
        return true;
    }

    function addToFavourite($proj){
        global $CONN;
        $userId = $_SESSION['user_id'];
        if (isset($_SESSION['fav_proj']) && !empty($_SESSION['fav_proj'])) {
            $myArr = explode(',',$_SESSION['fav_proj'] ?? "");
        } else {
            $myArr = array();
        }
        
        
        if (in_array($proj, $myArr, TRUE)){
            if (($key = array_search($proj, $myArr)) !== false) {
                unset($myArr[$key]);
            };
        }else{
            array_push($myArr, $proj);
        }
        
        $newArr = $myArr;
        $string = implode(",", $myArr);

        $update = $CONN->execute('update users set fav_proj =:0 where user_id = :1', array($string, $userId));

        if(!$update){
            return false;
        }

        $_SESSION['fav_proj'] = $string;
        return true;
    }

    function getFav(){
        global $CONN;
        $userId = $_SESSION['user_id'];
        $getArr = $CONN->fetchOne('select fav_proj from users where user_id = :0', array($userId));
        $getArr = explode(",", $getArr ?? "");
        return $getArr;
    }

    function fetchAllPendingTask($useLink, $projType = 'joget', $dateFrom='', $dateTo=''){
        global $JOGETLINKOBJ, $SYSTEM;

        $api_username = $JOGETLINKOBJ->getAdminUserName($projType);
        $api_password = $JOGETLINKOBJ->getAdminUserPassword($projType);

        $host = $JOGETLINKOBJ->getLink($useLink).'&rows=99999';

        if($SYSTEM == 'KKR' && !empty($dateFrom) && !empty($dateTo)){            
            $param = [$dateFrom, $dateTo];
            foreach($param as $key=>$p){
                $host = preg_replace('/'.preg_quote('{?}').'/', $p, $host,  1);
            }
        }

        $headers = array(
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode("$api_username:$api_password"),
        );
        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

        $return = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);
        
        if (!$err) {
            $decodedText = html_entity_decode($return);
            return $return;
        }
    }

    function updateCorrTaskArrOBYU($arr){
        $retTotal = array('total' => $arr['total']);
        $ret = array('data' => []);
        if(isset($arr['data'])){
            foreach ($arr['data'] as $k => $v) {
                $v['corr_act_user.acknowledge_flag'] = '1';
                $v['corr_act_user.action'] = $v['action'];
                $v['corr_act_user.id'] = $v['corr_act_user_id'];
                $ret['data'][] = $v;
            }
        }
        $ret = array_merge($retTotal,$ret);
        return $ret;
    }

    function getAllTaskList(){
        global $SYSTEM;

        $datef = filter_input(INPUT_POST, 'dateFrom');
        $datet = filter_input(INPUT_POST, 'dateTo');

        $dateFrom = date('Y-m-d', strtotime($datef));
        $dateTo = date('Y-m-d', strtotime($datet .'+ 1 day'));

        $pendingTask = array();
        $constructArr = array();
        $docArr = array();
        $financeArr = array();
        $assetArr = array();
        $financeAssetArr = array();
        $dataFmArr = array();
        $dataMarkupArr = array();
        $dataRfiArr = array();

        $dataConstruct = fetchAllPendingTask('cons_json_datalist_task', 'joget', $dateFrom, $dateTo);
        if($dataConstruct){
            $constructArr = json_decode($dataConstruct, true);
        }
        
        $dataDocument = fetchAllPendingTask('doc_json_datalist_task', 'joget', $dateFrom, $dateTo);
        if($dataDocument){
            $docArr = json_decode($dataDocument, true);
            if ($SYSTEM == 'OBYU') $docArr = updateCorrTaskArrOBYU($docArr);
        }
        
        $dataFinance = fetchAllPendingTask('finance_json_datalist_task', 'joget', $dateFrom, $dateTo);
        if($dataFinance){
            $financeArr = json_decode($dataFinance, true);
        }

        $dataAsset = fetchAllPendingTask('asset_json_datalist_task','asset', $dateFrom, $dateTo);
        if($dataAsset){
            $assetArr = json_decode($dataAsset, true);
        }

        $dataFinanceAsset = fetchAllPendingTask('finance_asset_json_notifications', 'asset', $dateFrom, $dateTo);
        if($dataAsset){
            $financeAssetArr = json_decode($dataFinanceAsset, true);
        }

        $dataFm = fetchAllPendingTask('fm_json_notifications', 'asset', $dateFrom, $dateTo);
        if($dataFm){
            $dataFmArr = json_decode($dataFm, true);
        }

        $dataMarkup = fetchAllPendingTask('markup_json_datalist_task', 'joget', $dateFrom, $dateTo);
        if($dataMarkup){
            $dataMarkupArr = json_decode($dataMarkup, true);
        }

        $dataRfi = fetchAllPendingTask('rfi_edit_json_datalist_task', 'joget', $dateFrom, $dateTo);
        if($dataRfi){
            $dataRfiArr = json_decode($dataRfi, true);
        }

        // get total of all assignments
        $totalAssignments = 0;
        if ($datef != '' &&  $datef != ''){
            $dataConstruct_count = fetchAllPendingTask('cons_json_datalist_task_count', 'joget');
            if($dataConstruct_count){
                $constructArr_count = json_decode($dataConstruct_count, true);
                if(isset($constructArr_count['data'][0]['assignments'])){
                    $totalAssignments += $constructArr_count['data'][0]['assignments'];
                }
            }
    
            $dataDocument_count = fetchAllPendingTask('doc_json_datalist_task_count', 'joget');
            if($dataDocument_count){
                $docArr_count = json_decode($dataDocument_count, true);
                if(isset($docArr_count['data'][0]['assignments'])){
                    $totalAssignments += $docArr_count['data'][0]['assignments'];
                }
            }
       
            $dataAsset_count = fetchAllPendingTask('asset_json_datalist_task_count','asset');
            if($dataAsset_count){
                $assetArr_count = json_decode($dataAsset_count, true);
                if(isset($assetArr_count['data'][0]['assignments'])){
                    $totalAssignments += $assetArr_count['data'][0]['assignments'];
                }
            }
    
            $dataFinance_count = fetchAllPendingTask('finance_json_datalist_task_count','asset');
            if($dataFinance_count){
                $financeArr_count = json_decode($dataFinance_count, true);
                if(isset($financeArr_count['data'][0]['assignments'])){
                    $totalAssignments += $financeArr_count['data'][0]['assignments'];
                }
            }
    
            $dataAssetFinance_count = fetchAllPendingTask('finance_asset_json_notifications_count','asset');
            if($dataAssetFinance_count){
                $financeAssetArr_count = json_decode($dataAssetFinance_count, true);
                if(isset($financeAssetArr_count['data'][0]['assignments'])){
                    $totalAssignments += $financeAssetArr_count['data'][0]['assignments'];
                }
            }
            
            // fm assignment or task
            $dataFM_count = fetchAllPendingTask('fm_json_notifications_count','asset');
            if($dataFM_count){
                $dataFMArr_count = json_decode($dataFM_count, true);
                if(isset($dataFMArr_count['data'][0]['assignments'])){
                    $totalAssignments += $dataFMArr_count['data'][0]['assignments'];
                }
            }
    
            $dataMarkup_count = fetchAllPendingTask('markup_json_datalist_task_count', 'joget');
            if($dataMarkup_count){
                $markupArr_count = json_decode($dataMarkup_count, true);
                if(isset($markupArr_count['data'][0]['assignments'])){
                    $totalAssignments += $markupArr_count['data'][0]['assignments'];
                }
    
            }
    
            $dataRfi_count = fetchAllPendingTask('rfi_edit_json_datalist_task_count', 'joget');
            if($dataRfi_count){
                $rfiArr_count = json_decode($dataRfi_count, true);
                if(isset($rfiArr_count['data'][0]['assignments'])){
                    $totalAssignments += $rfiArr_count['data'][0]['assignments'];
                }
    
            }
        }
        
        
        $pendingTask = array(
            'noti_construct'=> (isset($constructArr['data'])) ? $constructArr['data'] : [],
            'noti_doc'=> (isset($docArr['data'])) ? $docArr['data'] : [],
            'noti_finance'=> (isset($financeArr['data'])) ? $financeArr['data'] : [],
            'noti_asset'=> (isset($assetArr['data'])) ? $assetArr['data'] : [],
            'noti_finance_asset'=> (isset($financeAssetArr['data'])) ? $financeAssetArr['data'] : [],
            'noti_fm' => (isset($dataFmArr['data'])) ? $dataFmArr['data'] : [],
            'noti_markup' => (isset($dataMarkupArr['data'])) ? $dataMarkupArr['data'] : [],
            'noti_rfi' => (isset($dataRfiArr['data'])) ? $dataRfiArr['data'] : [],
            'noti_all_count' => $totalAssignments
        );
        return $pendingTask;
    }
    function getAllTaskListSSLR_DS(){
        global $SYSTEM;

        $datef = filter_input(INPUT_POST, 'dateFrom');
        $datet = filter_input(INPUT_POST, 'dateTo');

        $dateFrom = date('Y-m-d', strtotime($datef));
        $dateTo = date('Y-m-d', strtotime($datet .'+ 1 day'));

        $pendingTask = array();
        $financeArr = array();

        
        $dataFinance = fetchAllPendingTask('finance_json_datalist_task', 'joget', $dateFrom, $dateTo);
        if($dataFinance){
            $financeArr = json_decode($dataFinance, true);
        }
        
        // get total of all assignments
        $totalAssignments = 0;
         
        $dataFinance_count = fetchAllPendingTask('finance_json_datalist_task_count','asset');
        if($dataFinance_count){
            $financeArr_count = json_decode($dataFinance_count, true);
            if(isset($financeArr_count['data'][0]['assignments'])){
                $totalAssignments += $financeArr_count['data'][0]['assignments'];
            }
        }
 
        
        $pendingTask = array( 
            'noti_finance'=> (isset($financeArr['data'])) ? $financeArr['data'] : [], 
            'noti_all_count' => $totalAssignments
        );
        return $pendingTask;
    }

    function getTaskListBasedProject(){
        global $SYSTEM;
        $pendingTask = array();
        $constructArr = array();
        $docArr = array();
        $financeArr = array();
        $assetArr = array();
        $financeAssetArr = array();
        $dataFMArr = array();
        $dataMarkupArr = array();
        $dataRfiArr = array();

        $dataConstruct = fetchAllPendingTask('cons_json_datalist_inboxv3');
        if($dataConstruct){
            $constructArr['data'] = json_decode($dataConstruct, true);
        }
        else{
            $constructArr['data'] = false;
        }
        
        $dataDocument = fetchAllPendingTask('doc_json_corr_notification');
        if($dataDocument){
            $docArr['data'] = json_decode($dataDocument, true);
            if ($SYSTEM == 'OBYU') $docArr['data'] = updateCorrTaskArrOBYU($docArr['data']);
        }
        else{
            $docArr['data'] = false;
        }

        $dataFinance = fetchAllPendingTask('finance_json_Notificationsv3');
        if($dataFinance){
            $financeArr['data'] = json_decode($dataFinance, true);
        }
        else{
            $financeArr['data'] = false;
        }

        $dataAsset = fetchAllPendingTask('asset_json_datalist_notificationsv3', 'asset');
        if($dataAsset){
            $assetArr['data'] = json_decode($dataAsset, true);
        }
        else{
            $assetArr['data'] = false;
        }

        $dataFinanceAsset = fetchAllPendingTask('finance_asset_json_notifications_package', 'asset');
        if($dataFinanceAsset){
            $financeAssetArr['data'] = json_decode($dataFinanceAsset, true);
        }
        else{
            $financeAssetArr['data'] = false;
        }

        $dataFM = fetchAllPendingTask('fm_json_notifications_package', 'asset');
        if($dataFM){
            $dataFMArr['data'] = json_decode($dataFM, true);
        }
        else{
            $dataFMArr['data'] = false;
        }

        $dataMarkup = fetchAllPendingTask('markup_json_notification_package');
        if($dataMarkup){
            $dataMarkupArr['data'] = json_decode($dataMarkup, true);
        }else{
            $dataMarkupArr['data'] = false;
        }

        $dataRfi = fetchAllPendingTask('rfi_closed_json_datalist_inbox');
        if($dataRfi){
            $dataRfiArr['data'] = json_decode($dataRfi, true);
        }else{
            $dataRfiArr['data'] = false;
        }
        
        $pendingTask = array(
            'noti_construct'=> (isset($constructArr['data'])) ? $constructArr['data'] : [],
            'noti_doc'=> (isset($docArr['data'])) ? $docArr['data'] : [],
            'noti_finance'=> (isset($financeArr['data'])) ? $financeArr['data'] : [],
            'noti_asset'=> (isset($assetArr['data'])) ? $assetArr['data'] : [],
            'noti_finance_asset'=> (isset($financeAssetArr['data'])) ? $financeAssetArr['data'] : [],
            'noti_fm' => (isset($dataFMArr['data'])) ? $dataFMArr['data'] : [],
            'noti_markup' => (isset($dataMarkupArr['data'])) ? $dataMarkupArr['data'] : [],
            'noti_rfi' => (isset($dataRfiArr['data'])) ? $dataRfiArr['data'] : []
        );
        return $pendingTask;
    }

    function getUserOrg(){
        global $CONN;
        $return = array();
        $userId = $_SESSION['user_id'];

        // checking joget active login session
        $username = $_SESSION['email'];
        $password = $_SESSION['password'];

        $temp_encrypted_pwd = base64_encode($password);
        $reverse_enc_pwd = strrev($temp_encrypted_pwd);
        $encrypted_pwd = base64_encode($reverse_enc_pwd);

        $proj_owner_sbh = isset($_SESSION['proj_owner_sbh']) ? $_SESSION['proj_owner_sbh'] : '';
        $proj_owner_swk = isset($_SESSION['proj_owner_swk']) ? $_SESSION['proj_owner_swk'] : '';

        $ok = $CONN->fetchOne('select a.user_org from users a left join organization b on a.user_org = b.orgID where a.user_id = :0', array($userId));
        $return = array($ok, $proj_owner_sbh, $proj_owner_swk, $username, $encrypted_pwd);

        if(!$ok){
            return false;
        }

        return $return;
    }

    function saveViewPref(){
        global $response;
        global $CONN;
        $user_email = $_SESSION['email'];
        $view_pref = $_POST['viewVal'];
    
        $updateSQL = "UPDATE users SET view_pref = '$view_pref' WHERE user_email = '$user_email'";
        $updated = $CONN->execute($updateSQL);
    
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

    function getViewPref(){
        global $CONN;
        $userEmail = $_SESSION['email'];
        $getVal = $CONN->fetchOne('select view_pref from users where user_email = :0', array($userEmail));
        $getVal = array($getVal);
        return $getVal;
    }
    
    if (isset($_POST['functionName'])) {
        switch ($_POST['functionName']) {
            case "getSession":
                $result = getSession(); //set session
                echo json_encode($result);
                break;
            case "setThemeMode":
                $mode = filter_input(INPUT_POST, 'mode', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
                $result = setThemeMode($mode);
                echo json_encode($result);
                break;
            case "getThemeMode":
                $result = getThemeMode();
                echo json_encode($result);
                break;
            case "addToFav":
                $proj = filter_input(INPUT_POST, 'projId', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
                $result = addToFavourite($proj);
                echo json_encode($result);
            break;
            case "setLastAccess":
                $result = setLastAccess();
                echo json_encode($result);
            break;
            case "getFav":
                $result = getFav();
                echo json_encode($result, true);
            break;
            case "setUIPreference":
                $ui = filter_input(INPUT_POST, 'uipref', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
                $result = setUIPreference($ui);
                echo json_encode($result);
                break;
            case "getAllTaskList":
                $result = getAllTaskList();
                echo json_encode($result);
                break;
            case "getTaskListBasedProject":
                $result = getTaskListBasedProject();
                echo json_encode($result);
                break;
            case "getUserOrg":
                $result = getUserOrg();
                echo json_encode($result);
                break;
            case 'saveViewPref':
                $result = saveViewPref();
                echo json_encode($result);
            break;
            case 'getViewPref':
                $result = getViewPref();
                echo json_encode($result);
            break;
        }
    }
