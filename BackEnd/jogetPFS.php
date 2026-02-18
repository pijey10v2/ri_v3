<?php
    session_start();
    include_once('class/jogetLink.class.php');
    global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;

    $financeLinkObj = new JogetLink();
    $JOGETLINKOBJ = new JogetLink();
    if($_SESSION['Project_type'] == "CONSTRUCT"){
        $api_username = $JOGETLINKOBJ->getAdminUserName();
        $api_password = $JOGETLINKOBJ->getAdminUserPassword();
        $jogetHostIP = $JOGETLINKOBJ->jogetHost;
    }else{
        $api_username = $JOGETLINKOBJ->getAdminUserName('asset');
        $api_password = $JOGETLINKOBJ->getAdminUserPassword('asset');
        $jogetHostIP = $JOGETLINKOBJ->jogetAssetHost;
    }

    if (isset($_POST['functionName'])) {
        switch ($_POST['functionName']) {
            case "getProjectDataList":
                getProjectDataList();
                break;
            case "getProjectDataListOBYU":
                getProjectDataListOBYU();
                break;
            case "getJogetNotifications":
                getJogetNotifications();//function to get notifications for contracts, claims and VOs (all 3 inbox)
                break;
            case "getContractDetails":
                getContractDetails();
                break;
            case "getContractApprovalFlowDetails":
                getContractApprovalFlowDetails();
                break;
            case "getContractApprovalFlowDetailsOBYU":
                getContractApprovalFlowDetailsOBYU();
                break;
            case "getClaimApprovalFlowDetails":
                getClaimApprovalFlowDetails();
                break;
            case "getClaimApprovalFlowDetailsOBYU":
                getClaimApprovalFlowDetailsOBYU();
                break;
            case "getClaimApprovalFlowDetailsPeriodic":
                getClaimApprovalFlowDetailsPeriodic();
                break;
            case "getVOApprovalFlowDetails":
                getVOApprovalFlowDetails();
                break;
            case "getVOApprovalFlowDetailsOBYU";
                getVOApprovalFlowDetailsOBYU();
                break;
        }
    }
    $result = [];
    function getProjectDataList(){
        global $api_username;
        global $api_password;
        global $jogetHostIP;
        $host = $jogetHostIP . "jw/web/json/data/list/pfs/projectList?d-8112713-fn_project_id=".  $_SESSION['projectID'];

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
            $result['msg'] =$err;
            echo(json_encode($result['msg']));
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $projectData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $projectData[$i] = $data;
                $i++;
            }
           echo json_encode($projectData);
      //  echo($decodedText);
        }

    }

    function getProjectDataListOBYU(){
        global $JOGETLINKOBJ;

        $host = $JOGETLINKOBJ->jogetAppLink['api']['finance_json_Project'];
        $api_username = $JOGETLINKOBJ->getAdminUserName();
        $api_password = $JOGETLINKOBJ->getAdminUserPassword();

        $headers = array(
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode("$api_username:$api_password")
        );

        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $return = curl_exec($ch);
        $err    = curl_error($ch);
        curl_close($ch);

        if ($err) {
            $result['msg'] =$err;
            echo(json_encode($result['msg']));
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $projectData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $projectData[$i] = $data;
                $i++;
            }
           echo json_encode($projectData);
        }

    }

    function getContractDataList(){
        global $api_username;
        global $api_password;
        global $jogetHostIP;
        $host = $jogetHostIP . "jw/web/json/data/list/pfs/contractList?d-5152114-fn_project_id=".  $_SESSION['projectID']."&d-5152114-fn_assign_to=". $_SESSION['email'];

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
            $result['msg'] =$err;
            return(json_encode($result['msg']));
        } else {
            $decodedText = html_entity_decode($return);
          return($decodedText);
        }

    }

    function getClaimDataList(){
        global $api_username;
        global $api_password;
        global $jogetHostIP;
        $host = $jogetHostIP . "jw/web/json/data/list/pfs/claimsList?d-2380059-fn_project_id=".  $_SESSION['projectID']."&d-2380059-fn_assign_to=". $_SESSION['email'];

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
            $result['msg'] =$err;
            return(json_encode($result['msg']));
        } else {
            $decodedText = html_entity_decode($return);
           return($decodedText);
        }

    }
    
    function getContractDetails(){ //function to get contract details to update the project info on the navbar
        global $api_username;
        global $api_password;
        global $jogetHostIP;
        $projectid = urlencode($_SESSION['projectID']);
        $host = $jogetHostIP . "jw/web/json/data/list/pfs/contractList?d-5152114-fn_project_id=".$projectid."&d-5152114-fn_status=complete";

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
            $result['msg'] =$err;
            echo(json_encode($result['msg']));
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $contractData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $contractData[$i] = $data;
                $i++;
            }
           echo json_encode($contractData);
           //echo($decodedText);
        }

    }

    function getJogetNotifications()
    {
            
        global $api_username;
        global $api_password;
        global $jogetHostIP;
      
        $appLists =  $_SESSION['appsLinks'];
        // echo $_SESSION['appsLinks'].'<br>';
    
        $appListsEncode = json_decode($appLists);
    
        $pfsApp =  $appListsEncode->financePackage_name;
        $processIdArray = explode('::', $pfsApp);
       
        $user = urlencode($_SESSION['email']);
        $projectid = urlencode($_SESSION['projectID']);
        $host = $jogetHostIP . "jw/web/json/data/list/pfs/generalInbox?start=0&rows=5&d-5171348-fn_c_project_id=".$projectid."&d-5171348-fn_c_assign_to=".$user; 
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
    
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $notificationData = [];
            $response =[];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['c_project_id']!= $_SESSION['projectID'] && $data['c_assign_to']!= $_SESSION['email']){
                    continue;
                }
                $notificationData[$i] = $data;
                $i++;
            }
            $response['data'] = $notificationData;
            $response['total_assignment'] = $data_arr['total'];
            echo json_encode($response);
         
         // echo json_encode($decodedText);
        }
    }

    function getContractApprovalFlowDetails(){
        global $api_username;
        global $api_password;
        global $jogetHostIP;
      
        $appLists =  $_SESSION['appsLinks'];
        // echo $_SESSION['appsLinks'].'<br>';
    
        $appListsEncode = json_decode($appLists);
    
        $pfsApp =  $appListsEncode->financePackage_name;
        $processIdArray = explode('::', $pfsApp);
       
        $user = urlencode($_SESSION['email']);
        $projectid = urlencode($_SESSION['projectID']);
        $host = $jogetHostIP . "jw/web/json/data/list/pfs/approvalFlowCheckList?d-2845235-fn_project_id=".$projectid;
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
    
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $contractApprovalData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $contractApprovalData[$i] = $data;
                $i++;
            }
           echo json_encode($contractApprovalData);
           //echo json_encode($decodedText);
        }

    }

    function getContractApprovalFlowDetailsOBYU(){
        global $JOGETLINKOBJ;
        $host = $JOGETLINKOBJ->jogetAppLink['api']['finance_json_ContractApprovalFlow'];
        $api_username = $JOGETLINKOBJ->getAdminUserName();
        $api_password = $JOGETLINKOBJ->getAdminUserPassword();

        $headers = array(
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode("$api_username:$api_password")
        );
    
        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $return = curl_exec($ch);
        $err    = curl_error($ch);
        curl_close($ch);
    
        if ($err) {
    
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $contractApprovalData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $contractApprovalData[$i] = $data;
                $i++;
            }
           echo json_encode($contractApprovalData);
        }

    }

    function getClaimApprovalFlowDetails(){
        global $api_username;
        global $api_password;
        global $jogetHostIP;
      
        $appLists =  $_SESSION['appsLinks'];
        // echo $_SESSION['appsLinks'].'<br>';
    
        $appListsEncode = json_decode($appLists);
    
        $pfsApp =  $appListsEncode->financePackage_name;
        $processIdArray = explode('::', $pfsApp);
       
        $user = urlencode($_SESSION['email']);
        $projectid = urlencode($_SESSION['projectID']);
        $host = $jogetHostIP . "jw/web/json/data/list/pfs/approvalFlowCheckClaimList?d-3470253-fn_project_id=".$projectid;
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
    
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $claimApprovalData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $claimApprovalData[$i] = $data;
                $i++;
            }
           echo json_encode($claimApprovalData);
           // echo json_encode($decodedText);
        }

    }

    function getClaimApprovalFlowDetailsPeriodic(){
        global $api_username;
        global $api_password;
        global $jogetHostIP;
      
        $appLists =  $_SESSION['appsLinks'];
        // echo $_SESSION['appsLinks'].'<br>';
    
        $appListsEncode = json_decode($appLists);
    
        $pfsApp =  $appListsEncode->financePackage_name;
        $processIdArray = explode('::', $pfsApp);
       
        $user = urlencode($_SESSION['email']);
        $projectid = urlencode($_SESSION['projectID']);
        $host = $jogetHostIP . "jw/web/json/data/list/pfs/approvalFlowCheckClaimPerList?d-1424332-fn_project_id=".$projectid;
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
    
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $claimApprovalData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $claimApprovalData[$i] = $data;
                $i++;
            }
           echo json_encode($claimApprovalData);
           // echo json_encode($decodedText);
        }

    }

    function getVOApprovalFlowDetails(){
        global $api_username;
        global $api_password;
        global $jogetHostIP;
      
        $appLists =  $_SESSION['appsLinks'];
        // echo $_SESSION['appsLinks'].'<br>';
    
        $appListsEncode = json_decode($appLists);
    
        $pfsApp =  $appListsEncode->financePackage_name;
        $processIdArray = explode('::', $pfsApp);
       
        $user = urlencode($_SESSION['email']);
        $projectid = urlencode($_SESSION['projectID']);
        $host = $jogetHostIP . "jw/web/json/data/list/pfs/approvalFlowCheckVOList?d-440924-fn_project_id=".$projectid;
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
    
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $voApprovalData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $voApprovalData[$i] = $data;
                $i++;
            }
           echo json_encode($voApprovalData);
          //  echo json_encode($decodedText);
        }

    }

    function getClaimApprovalFlowDetailsOBYU(){
        
        global $JOGETLINKOBJ;
        $host = $JOGETLINKOBJ->jogetAppLink['api']['finance_json_ClaimApprovalFlow'];
        $api_username = $JOGETLINKOBJ->getAdminUserName();
        $api_password = $JOGETLINKOBJ->getAdminUserPassword();

        $headers = array(
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode("$api_username:$api_password")
        );
    
        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $return = curl_exec($ch);
        $err    = curl_error($ch);
        curl_close($ch);
    
        if ($err) {
    
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $claimApprovalData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $claimApprovalData[$i] = $data;
                $i++;
            }
           echo json_encode($claimApprovalData);
        }

    }

    function getVOApprovalFlowDetailsOBYU(){
        global $JOGETLINKOBJ;
        $host = $JOGETLINKOBJ->jogetAppLink['api']['finance_json_VOApprovalFlow'];
        $api_username = $JOGETLINKOBJ->getAdminUserName();
        $api_password = $JOGETLINKOBJ->getAdminUserPassword();

        $headers = array(
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode("$api_username:$api_password")
        );
    
        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $return = curl_exec($ch);
        $err    = curl_error($ch);
        curl_close($ch);
    
        if ($err) {
    
        } else {
            $decodedText = html_entity_decode($return);
            $data_arr = json_decode($decodedText, true);
            $voApprovalData = [];
            $i=0;
            foreach($data_arr['data'] as $data ){
                if($data['project_id']!= $_SESSION['projectID']){
                    continue;
                }
                $voApprovalData[$i] = $data;
                $i++;
            }
           echo json_encode($voApprovalData);
        }

    }
?>