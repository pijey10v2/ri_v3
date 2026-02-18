<?php
session_start();
if (isset($_POST['fromResetPwdFlag'])) {
    $_SESSION['noLogin'] = true;
}
include_once('class/jogetLink.class.php');
global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;
global $PHPCACERTPATH;


$JOGETLINKOBJ = new JogetLink();
$api_username = $JOGETLINKOBJ->getAdminUserName();
$api_password = $JOGETLINKOBJ->getAdminUserPassword();
$_SESSION['Package_Version'] = $JOGETLINKOBJ->jogetConstructVersion;
$jogetHostIP = $JOGETLINKOBJ->jogetHost;
$jogetAssetHostIP = $JOGETLINKOBJ->jogetAssetHost;
$asset_api_username = $JOGETLINKOBJ->getAdminUserName('asset');
$asset_api_password = $JOGETLINKOBJ->getAdminUserPassword('asset');

if (isset($_POST['functionName'])) {
    switch ($_POST['functionName']) {
        // case "getListofOrg":
        //     joget_getListofOrg();
        //     break;
        case "getListofDept":
            joget_getListofDept();
            break;
        case "initiateJogetProcess":
            initiateJogetProcess(); //#demoedit
            break;
        case "getJogetProcessRecords":
            getJogetProcessRecords();
            break;
        case "getListofPackages":
            $packageData =[];
            $packageData['construct'] = getListofPackages($jogetHostIP, $api_username, $api_password);
            $packageData['asset'] = getListofPackages($jogetAssetHostIP, $asset_api_username, $asset_api_password);
            echo json_encode($packageData);
            break;
        case "getCoordinate":
            getCoordinate(); //#demonoti
            break;
        case "getPendingProcessByUser":
            getPendingProcessByUser();
            break;
    }
}
//#demonoti
function getCoordinate()
{
    global $api_username;
    global $api_password;
    global $JOGETLINKOBJ;
    $processID = $_POST['processId'];

    $str_arr = explode("_", $processID);
    array_splice($str_arr, 0, 3);

    $after_arr = implode("_", $str_arr);
    $processName = $after_arr;

    $host = $JOGETLINKOBJ->getLink('cons_json_get_coordinate');

    $payload = array(
        'processId' => $processID,
        'processName' => $processName
    );
    $payload = json_encode($payload);
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        echo $err;
    } else {
        $decodedText = html_entity_decode($return);
        echo $decodedText;
    }
}

//initiate a constructs process and set workflow var (project)
function initiateJogetProcess() 
{
    if(empty($_POST['processName']) || $_SESSION['is_Parent'] == "isParent"){
        return;
    }else if(!isset($_SESSION['Package_Version']) || !isset($_SESSION['appsLinks'])){
        return;
    }

    $exploded = explode('_', $_POST['processName']); 
    $rawProcessName = $exploded[1];
    global $jogetHostIP;

    $api_username = $_SESSION['email'];
    $api_password = $_SESSION['password'];
    $appListsEncode = json_decode($_SESSION['appsLinks']);
    if(!$appListsEncode->{$_POST['processName']}){   //validate process
        return;
    }

    if(!$appListsEncode->constructPackage_name){
        return;
    }
    $packageName = explode('::', $appListsEncode->constructPackage_name);
    
    switch($rawProcessName){ 
        case "NCR":
             $processName = "ncr";
        break;
        case "WIR":
             $processName = "wir";
        break;
        case "RFI":
             $processName = "rfi";
        break;
        case "MOS":
             $processName = "ms";
        break;
        case "MS":
             $processName = "ma";
        break;
        case "IR":
             $processName = "inc";
        break;
        case "RS":
            $processName = "rs";
        break;
        case "SD":
            $processName = "sd";
        break;
        case "SDL":
            $processName = "sdl";
        break;
        case "RR":
            $processName = "rr";
        break;
        case "LI":
            $processName = "LI";
        break;
        case "LE":
            $processName = "LE";
        break;
        case "LR":
            $processName = "LR";
        break;
        default:
        return;
    }
    $arrGET = array(
        "var_Project" => $_SESSION['parent_project_id'],
        "var_Package" => $_SESSION['projectID'],
        "var_PackageName" => $_SESSION['project_name']
    );

    //Process Definition ID
    $processId = $packageName[0] . ":" . $_SESSION['Package_Version'] . ":" . $processName;      //crm:3:process1
    $host = $jogetHostIP . "jw/web/json/workflow/process/start/" . $processId."?".http_build_query($arrGET);
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );
    $payload = array();
    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);
    if ($err) {
        return $err;
    } else {
        echo $return;
    }
}

function getListofPackages( $jogetHostIP, $api_username,  $api_password )
{
   

    $host = $jogetHostIP . "jw/web/json/workflow/package/list"; // change link to api
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        echo $err;
    } else {
        $decodedText = html_entity_decode($return);
        $data_arr = json_decode($decodedText, true);
        $i = 0;
        foreach ($data_arr['data'] as $details) {
            $data[$i]['packageId'] = $details['packageId'];
            $data[$i]['packageName'] = $details['packageName'];
            $i++;
        }
       return($data);
    }
}

//adds new user to the joget (jehan PFS version)
function jogetUserRegistration( $joget, $firstName, $lastName, $email,  $password,  $orgId, $orgName, $orgDesc ="") //PFS
{
   
    $payload = array(
        'userName' => $email,
        'password' => $password,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'userStatus' => "active",
        'orgId' => $orgId,
        'orgName'=> $orgName,
        'orgDesc' => $orgDesc
 
    );
    global $PHPCACERTPATH;
    $certificate_location = $PHPCACERTPATH;
   
   // global $jogetHostIP;
    $host              = $joget."jw/web/json/plugin/org.joget.custom.webservices.UserRegistrationApi/service?";
    $payload = json_encode($payload);

    $headers = array(
        'Content-Type: application/json',
        'API_KEY: 90c1491d-1ecd-4642-a8fd-855babcce15a'
        //'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// need this for KKR server as the php.ini points to another cert other than cacert.pem
    if($joget == "https://jogetk.reveronconsulting.com/"){

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $certificate_location);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $certificate_location);
        
    }
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return $err;
    } else {
        return $return;
    }
}

//updates user password, name and status (jehan PFS version)
function jogetUserUpdate( $joget, $firstName , $lastName, $email, $password ="", $userStatus ="") //PFS
{
    global $PHPCACERTPATH;
    $certificate_location = $PHPCACERTPATH;
    $payload = array();
    $payload['userName'] = $email;
    $payload['email'] = $email;
    $payload['firstName'] = $firstName;
    $payload['lastName'] = $lastName;
      
    if($userStatus !=""){
        $payload['userStatus'] = $userStatus;
    };
    if($password != ""){
        $payload['password'] = $password;
    };
   
   
    $host              = $joget."jw/web/json/plugin/org.joget.custom.webservices.UserRegistrationApi/service?";
    $payload = json_encode($payload);

    $headers = array(
        'Content-Type: application/json',
        'API_KEY: 90c1491d-1ecd-4642-a8fd-855babcce15a'
        //'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// need this for KKR server as the php.ini points to another cert other than cacert.pem
    if($joget == "https://jogetk.reveronconsulting.com/"){

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $certificate_location);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $certificate_location);
        
    }

    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return $err;
    } else {
        return $return;
    }
}

//to deactivate, activate and remove users from joget (jehan PFS version)
function jogetUserInactivateActivateDelete( $joget, $userList) //PFS
{
    global $api_username;
    global $api_password;
    global $PHPCACERTPATH;
    $certificate_location = $PHPCACERTPATH;
   
    $payload = array();
    $payload['users'] = $userList;
   
    
    $host = $joget."jw/web/json/plugin/org.joget.custom.webservices.UsersModifyApi/service";
    $payload = json_encode($payload);

    $headers = array(
        'Content-Type: application/json',
        'API_KEY: 90c1491d-1ecd-4642-a8fd-855babcce15a'
        //'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // need this for KKR server as the php.ini points to another cert other than cacert.pem
    if($joget == "https://jogetk.reveronconsulting.com/"){

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $certificate_location);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $certificate_location);
        
    }
    
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return $err;
    } else {
        return $return;
    }
}

//adds a new project to joget (jehan PFS version)
function jogetProjectRegistration( $projectDetails, $projectType){
    $payload =  $projectDetails;
    
    global $jogetHostIP;
    global $jogetAssetHostIP;
    if($projectType == 'CONSTRUCT') $joget = $jogetHostIP;
    else $joget = $jogetAssetHostIP;

    $host              = $joget."jw/web/json/plugin/org.joget.custom.webservices.GenericCUAPI/service?formId=projectForm";
    
    $payload = json_encode($payload);
    $headers = array(
        'Content-Type: application/json',
        'API_KEY: 90c1491d-1ecd-4642-a8fd-855babcce15a'
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return $err;
    } else {
        return $return;
    }
}

//add/update/delete users to a project (jehan PFS version)
function jogetUserProjectAssign($pid , $users, $projectType){
    global $jogetHostIP;
    global $jogetAssetHostIP;
    if($projectType == 'CONSTRUCT') $joget = $jogetHostIP;
    else $joget = $jogetAssetHostIP;

    $host = $joget."jw/web/json/plugin/org.joget.custom.webservices.UserProjectAssignAPI/service";
    $payload = array(
        'projectId' => $pid,
        'users' => $users,
    );
    $payload = json_encode($payload);

    $headers = array(
        'Content-Type: application/json',
        'API_KEY: 90c1491d-1ecd-4642-a8fd-855babcce15a'
        //'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );
    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return $err;
    } else {
        return $return;
    }
}

//delete a project from joget(jehan PFS version)
function jogetProjectCleanUpService($operation, $project_id, $projectType){
   
    global $jogetHostIP;
    global $jogetAssetHostIP;
    if($projectType == 'CONSTRUCT') $joget = $jogetHostIP;
    else $joget = $jogetAssetHostIP;

    $host = $joget."jw/web/json/plugin/org.joget.custom.webservices.PFSCleanupAPI/service";
    $payload = array(
        'operation' => $operation,
        'projectId' => $project_id
    );
    $payload = json_encode($payload);
    $headers = array(
        'Content-Type: application/json',
        'API_KEY: 90c1491d-1ecd-4642-a8fd-855babcce15a'
    );
    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return $err;
    } else {
        return $return;
    }
}

function getJogetProcessRecords()
{
    global $api_username, $api_password, $jogetHostIP, $JOGETLINKOBJ;
    if($_SESSION['is_Parent'] == "isParent"){
        return;
    }
  //  $appListsEncode = json_decode($_SESSION['appsLinks']);
    // if(!$appListsEncode->constructPackage_name){
    //     return;
    // }
    //$processIdArray = explode('::', $appListsEncode->constructPackage_name);

    $processNameArr = array("NOI","NCR","WIR","DCR","RFI","MOS","MS","IR","RS","PBC", "SP");

    $processName = $_POST['processName'];

    if (in_array($processName, $processNameArr)) $host = $JOGETLINKOBJ->getLink('cons_json_datalist_'.$processName);
    if (!$host) return;

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
        echo $err;
    } else {
        echo $return;
    }
}

function getPendingProcessByUser() {
    $user_name = filter_input(INPUT_POST, 'userData', FILTER_SANITIZE_STRING);


    $construct_url = 'pendingProcessByUser?d-1714888-fn_ResourceId='.$user_name;
    $pfs_url = 'pendingProcessByUser?d-1714888-fn_c_assign_to='.$user_name;
    $document_url = 'pendingProcessByUser?d-1714888-fn_to='.$user_name;

    $construct_process = getDatalist($construct_url, 'ri_construct');
    $pfs_process = getDatalist($pfs_url, 'pfs');
    $document_process = getDatalist($document_url, 'document_mgmt');
    
    $data = array();

    if (isset($construct_process) && $construct_process['data']) {
        $data['construct'] = $construct_process['data'];
    }

    if (isset($pfs_process) && $pfs_process['data']) {
        $data['pfs'] = $pfs_process['data'];
    }

    if (isset($document_process) && $document_process['data']) {
        $data['document'] = $document_process['data'];
    }
    
    echo json_encode($data);
}

function getDatalist($dataListUrl, $app, $row = 0)
{
    global $jogetHostIP, $api_username, $api_password;
    $url = $jogetHostIP ."jw/web/json/data/list/".$app.'/'.$dataListUrl.'&rows='.(($row != 0) ? $row : '90000');
    
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return false;
    } else {
        return json_decode($return, true);
    }	
}
?>
