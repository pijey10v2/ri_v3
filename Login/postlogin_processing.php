<?php
    require('include/db_connect.php');
    session_start();
    include_once('../Backend/class/jogetLink.class.php');
    global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;

    $JOGETLINKOBJ = new JogetLink();
    $api_username = $JOGETLINKOBJ->getAdminUserName();
    $api_password = $JOGETLINKOBJ->getAdminUserPassword();
    $jogetHostIP = $JOGETLINKOBJ->jogetHost;
    $jogetAssetHostIP = $JOGETLINKOBJ->jogetAssetHost;
    $asset_api_username = $JOGETLINKOBJ->getAdminUserName('asset');
    $asset_api_password = $JOGETLINKOBJ->getAdminUserPassword('asset');

    function checkIfCorrectAppSetForFinance($app_id){
        $processIdArray = explode('::', $app_id);
        global $jogetAssetHostIP,$asset_api_username, $asset_api_password,  $jogetHostIP, $api_username, $api_password;
        if($_SESSION['Project_type'] == "ASSET"){
            $host = $jogetAssetHostIP . "jw/web/json/workflow/process/list?packageId=".$processIdArray[0];
            $headers = array(
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode("$asset_api_username:$asset_api_password")
            );
        }else{
            $host = $jogetHostIP . "jw/web/json/workflow/process/list?packageId=".$processIdArray[0];

            $headers = array(
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode("$api_username:$api_password")
            );
        }
       
        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $return = curl_exec($ch);
        $err    = curl_error($ch);
        curl_close($ch);

        if ($err) {
           echo ($err);
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $data =$data_arr['data'];
            $i=0;
            $financeFlag = false;
           
            while($i< sizeof($data) && !$financeFlag){
                if($data[$i]['packageId'] == $processIdArray[0] ){
                    if($data[$i]['name'] == "Claim Process" || $data[$i]['name'] == "VO Process")
                    $financeFlag = true;
                    
                }
                $i++;
            }
          return($financeFlag);
        }

    }

    function checkIfCorrectAppSetForDocumentRegistration($app_id){
        global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;

        $processIdArray = explode('::', $app_id);
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
           echo ($err);
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $data =$data_arr['data'];
            $i=0;
            $docFlag = false;
            while($i< sizeof($data) && !$docFlag){
                if($data[$i]['packageId'] == $processIdArray[0] && $data[$i]['packageName'] == $processIdArray[1]){
                    if($data[$i]['name'] == "Document" )
                    $docFlag = true;
                    
                }
                $i++;
            }
          return($docFlag);
        }

    }

    if (isset($_POST['projectid']) && isset($_SESSION['email'])) {
        if ($_POST['projectid'] == 'SystemAdmin') {
            header('Location:Loading.php?page=systemadmin');
            exit;
        } else {
            $_SESSION['project_id'] = $_POST['projectid']; //project_id_number
            if(isset($_POST['buttonclicked'])){
                $_SESSION['page'] = $_POST['buttonclicked'];
            }else{
                $_SESSION['page'] = "index";
            }

            //$access_control = json_decode(file_get_contents("../BackEnd/accessControl.json"), true);
            $projectid = $_POST['projectid'];
            $sql = "SELECT p.duration as duration, p.start_date as pstartdate, p.end_date as penddate, p.project_name as pname, p.project_id as pid, p.project_owner as powner, p.project_wpc_id as pwpcid, p.project_id_number as pnumber,  p.industry as ind, p.time_zone_text as timet, 
			p.time_zone_value as timev, p.location as loc, p.longitude_1 as long1,p.longitude_2 as long2, p.latitude_1 as lat1, p.latitude_2 as lat2, p.icon_url as icon, p.created_by as created_by, 
			p.created_time as created_time, p.updated_by as updated_by, p.last_update as last_update, p.parent_project_id_number as is_Parent, p.file_method as file_method, p.Project_type as Project_type, r.Pro_Role as Pro_Role
			FROM projects p, pro_usr_rel r WHERE p.project_id_number=".$_POST['projectid']." AND p.project_id_number = r.Pro_ID AND r.Usr_ID =".$_SESSION['user_id'] ;

            $result	= sqlsrv_query($conn, $sql);
            while ($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
                $_SESSION['project_id_number'] = $row['pnumber'];
                $_SESSION['project_name'] = $row['pname'];
                $_SESSION['projectID'] = $row['pid'];
                $_SESSION['longitude_1'] = $row['long1'];
                $_SESSION['longitude_2'] = $row['long2'];
                $_SESSION['latitude_1'] = $row['lat1'];
                $_SESSION['latitude_2'] = $row['lat2'];
                $_SESSION['project_role'] = $row['Pro_Role'];
                $_SESSION['Project_type'] = $row['Project_type'];

                if($_SESSION['ui_pref'] == "ri_v3"){
                    $_SESSION['prefix_loc'] = "../";
                }
                else{
                    $_SESSION['prefix_loc'] = "";
                }

                if($_SESSION['Project_type'] == 'CONSTRUCT'){
                    $access_control = json_decode(file_get_contents("../BackEnd/accessControl.json"), true);
                }else{
                    $access_control = json_decode(file_get_contents("../BackEnd/accessControlAsset.json"), true);
                }
                
                if ($access_control[$row['Pro_Role']]) {
                    //check and set UI elements based on rights
                    if (isset($access_control[$row['Pro_Role']]["Construct"])) {
                        $_SESSION['Construct_Rights'] = $access_control[$row['Pro_Role']]["Construct"];
                    }
                    if (isset($access_control[$row['Pro_Role']]["Project_Document"])) {
                        $_SESSION['Doc_Rights'] = $access_control[$row['Pro_Role']]["Project_Document"];
                    }
                    if (isset($access_control[$row['Pro_Role']]["PFS"])) {
                    $_SESSION['PFS_Rights'] = $access_control[$row['Pro_Role']]["PFS"];
                    }
                    if (isset($access_control[$row['Pro_Role']]["Asset"])) {
                        $_SESSION['Asset_Rights'] = $access_control[$row['Pro_Role']]["Asset"];
                    }
                }
                $_SESSION['icon_url'] = $row['icon'];
                $_SESSION['file_method'] = trim($row['file_method']);
                $_SESSION['created_by'] = $row['created_by'];
                if (is_null($row['is_Parent'])) {
                    $_SESSION['is_Parent'] = "isParent";
                } else {
                    $_SESSION['is_Parent'] = $row['is_Parent'];
                };
                if (is_null($row['ind'])) {
                    $_SESSION['industry'] = "Undefined";
                } else {
                    $_SESSION['industry'] = $row['ind'];
                };
                if (is_null($row['timet'])) {
                    $_SESSION['time_zone_text'] = "Undefined";
                } else {
                    $_SESSION['time_zone_text'] = $row['timet'];
                };
                if (is_null($row['timev'])) {
                    $_SESSION['time_zone_value'] = "";
                } else {
                    $_SESSION['time_zone_value'] = $row['timev'];
                };
                if (is_null($row['loc'])) {
                    $_SESSION['location'] = "Undefined";
                } else {
                    $_SESSION['location'] = $row['loc'];
                };
                if (is_null($row['pstartdate'])) {
                    $_SESSION['start_date']  = null;
                } else {
                    $_SESSION['start_date'] = date_format($row['pstartdate'], "d/m/Y");
                };
                if (is_null($row['penddate'])) {
                    $_SESSION['end_date'] = null;
                } else {
                    $_SESSION['end_date'] = date_format($row['penddate'], "d/m/Y");
                };
                if (!is_null($row['duration'])) {
                    $_SESSION['projectDuration'] = $row['duration'];
                }
                if (is_null($row['created_time'])) {
                    $_SESSION['created_time'] = null;
                } else {
                    $_SESSION['created_time'] = "(".date_format($row['created_time'], "d/m/Y") .")"; 
                };
                if (is_null($row['updated_by'])) {
                    $_SESSION['updated_by'] = "";
                } else {
                    $_SESSION['updated_by'] = $row['updated_by'];
                };
                if (is_null($row['last_update'])) {
                    $_SESSION['last_update'] = "";
                } else {
                    $_SESSION['last_update'] = "(".date_format($row['last_update'], "d/m/Y") .")";
                };
                if(!is_null($row['pwpcid'])){
                    $_SESSION['wpc_id'] = $row['pwpcid'];
                }else{
                    $_SESSION['wpc_id'] = "";
                };
                $_SESSION['project_owner'] = $row['powner'];
            }
            //project admins list
            $sql = "SELECT u.user_email as email from  users u, pro_usr_rel r where u.user_id = r.Usr_ID AND r.Pro_ID =".$_POST['projectid']."AND r.Pro_Role IN ('Project Manager', 'Project Monitor')";
            $result	= sqlsrv_query($conn, $sql);
            $admin = array();
            $i =0;
            while ($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
                $admin[$i] = $row['email'];
                $i++;
            }
            $_SESSION['Project Manager'] = $admin;
            //EOTs list
            $sql1 = "SELECT * FROM EOT WHERE Pro_ID =".$_POST['projectid']."ORDER BY Update_Date ASC";
            $result1	= sqlsrv_query($conn, $sql1);
            $resultCheck = sqlsrv_has_rows($result1);
            if ($resultCheck) {
                $EOT = array();
                $i = 0;
                while ($row = sqlsrv_fetch_array($result1, SQLSRV_FETCH_ASSOC)) {
                    $object = (object) ['duration' => $row['EOT'], 'docURL' => $row['Doc_URL'], 'updateDate' => date_format($row['Update_Date'], "d/m/Y")];
                    array_push($EOT, $object);
                    $_SESSION['New_End_Date'] =  date_format($row['New_End_Date'], "d/m/Y");
                    $i++;
                }
                $_SESSION['EOT'] = $EOT;
            }
           
            // PROJECT APPS LINK
           
            $appLink_PFS = false;
            $app_doc = false;
            $appsLinks = array();
            if ($_SESSION['is_Parent'] == "isParent") {
                $sql2 = "SELECT * FROM project_apps_process WHERE project_id =".$_SESSION['project_id'];
            }else{
                $sql2 = "SELECT * FROM project_apps_process WHERE project_id =".$_SESSION['is_Parent'];
            }
           
            $result2	= sqlsrv_query($conn, $sql2);
            while ($row2 = sqlsrv_fetch_array($result2, SQLSRV_FETCH_ASSOC)) {
                $appsLinks = $row2;
            };
            if($appsLinks){
                if($appsLinks['financePackage_name'] != null){
                    $appLink_PFS = true;
                };
                if($appsLinks['app_DR'] != null){
                    $app_doc = true;
                }
                $_SESSION['appsLinks'] = json_encode($appsLinks);
            }
            //Parent Project ID (overall project ID) needed to send to joget
            if ($_SESSION['is_Parent'] != "isParent") {
                $sql3 = "SELECT project_id FROM projects WHERE project_id_number =".$_SESSION['is_Parent'];
                $result3    = sqlsrv_query($conn, $sql3);
                while ($row3 = sqlsrv_fetch_array($result3, SQLSRV_FETCH_ASSOC)) {
                   $_SESSION['parent_project_id'] = $row3['project_id'];
                };
            }
            
            if($_SESSION['page']== "finance"){
                if($appLink_PFS){
                   $check= checkIfCorrectAppSetForFinance($appsLinks['financePackage_name']);
                   if($check){
                    if (isset($_POST['urlparam'])) {
                        header('Location:jogetuilogin.php?page='.$_SESSION['page'].'&'.$_POST['urlparam']);
                    }else{
                        header('Location:jogetuilogin.php?page='.$_SESSION['page']);
                    }
                   }else{
                        header('Location:postlogin.php?app=notpfs');
                    }
                }else{
                    header('Location:postlogin.php?app=pfs');
                }
            }else if($_SESSION['page']== "doc"){
                if($app_doc){
                    $check = checkIfCorrectAppSetForDocumentRegistration($appsLinks['documentPackage_name']);
                    if($check){
                        if (isset($_POST['urlparam'])) {
                            $url = parse_url($_POST['urlparam']);
                            parse_str($url['path'], $urlParam);
                            if(!isset($urlParam['u'])){
                                header('Location:postlogin.php?app=notUserLink');
                            }
                            else{
                                $linkEmail = $urlParam['u'];
                                $checkEmail = base64_encode(base64_encode($_SESSION['email']));
                                if ($linkEmail == $checkEmail){
                                    header('Location:jogetuilogin.php?page='.$_SESSION['page'].'&'.$_POST['urlparam']);
                                }
                                else{
                                    header('Location:postlogin.php?app=notUserLink');
                                }
                            }
                        }else{
                            header('Location:jogetuilogin.php?page='.$_SESSION['page']);
                        }
                    }else{
                        header('Location:postlogin.php?app=notdoc');
                    }
                  
                }else{
                    header('Location:postlogin.php?app=doc'); 
                }
            }else if($_SESSION['page']== "index"){
                if (isset($_POST['urlparam'])) {
                    header('Location:jogetuilogin.php?page='.$_SESSION['page'].'&'.$_POST['urlparam']);
                }else{
                    header('Location:jogetuilogin.php?page='.$_SESSION['page']);
                }
            }else if($_SESSION['page']== "homepage"){
                if (isset($_POST['urlparam'])) {
                    header('Location:jogetuilogin.php?page='.$_SESSION['page'].'&'.$_POST['urlparam']);
                }else{
                    header('Location:jogetuilogin.php?page='.$_SESSION['page']);
                }
            }else{
                header('Location:jogetuilogin.php?page='.$_SESSION['page']);
            } 
           
        }
    } else {
        session_destroy();
        header('Location:../');
    }
