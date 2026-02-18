<?php
//V3 FILE
session_start();
include_once('class/jogetLink.class.php');
global $api_username, $api_password, $jogetHost, $jogetSupportHost, $JOGETLINKOBJ;

$JOGETLINKOBJ = new JogetLink();

$api_username = $JOGETLINKOBJ->getAdminUserName();
$api_password = $JOGETLINKOBJ->getAdminUserPassword();
//$_SESSION['Package_Version'] = $JOGETLINKOBJ->construct_package_ver;
$jogetHost = $JOGETLINKOBJ->jogetHost;
$jogetSupportHost = $JOGETLINKOBJ->jogetSupportHost;

if (isset($_POST['functionName'])) {
    switch ($_POST['functionName']) {
        case "getListofOrg":
            joget_getListofOrg();
            break;
        case "getListofDept":
            joget_getListofDept();
            break;
        case "getListEditDept":
            getListEditDept(); //#demoedit
            break;
        case "initiateJogetProcess":
            initiateJogetProcess(); //#demoedit
            break;
        case "getJogetProcessRecords":
            getJogetProcessRecords();
            break;
        case "getListofPackages":
            $packageData['construct'] = getListofPackages();
            break;
        case "getCoordinate":
            getCoordinate(); //#demonoti
            break;
        case "getContractDetailsUTSB":
            getContractDetailsUTSB();
            break;
        // case "getJogetLatestPackageVersion":
        //     getJogetLatestPackage();
        // break;
    }
}

// check if user already exists in joget support
function userExists($email) {
    global $PHPCACERTPATH;
    global $jogetSupportHost;
    global $JOGETSUPPORTADMINUSER, $JOGETSUPPORTADMINPWD;
    $certificate_location = $PHPCACERTPATH;

    $host = $jogetSupportHost."jw/web/json/data/list/sysSuppApp/list_user_directory?j_username=".$JOGETSUPPORTADMINUSER."&j_password=".$JOGETSUPPORTADMINPWD."&rows=9999&email=".$email;

    $headers = array(
        'Content-Type: application/json',
        'API_KEY: 90c1491d-1ecd-4642-a8fd-855babcce15a'
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    // curl_setopt($ch, CURLOPT_CAINFO, $certificate_location);
    
    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return false;
    }

    $result = json_decode($response, true);
    if (isset($result['data']) && is_array($result['data'])) {
        foreach ($result['data'] as $user) {
            if (
                isset($user['email']) &&
                strtolower(trim($user['email'])) === strtolower(trim($email))
            ) {
                return true;
            }
        }
    }

    return false;
}

//#demonoti
function getCoordinate()
{
    global $api_username;
    global $api_password;
    global $jogetHost;
    $processID = $_POST['processId'];

    $str_arr = explode("_", $processID);
    $num = count($str_arr);
    $processNameStr = $str_arr[$num - 1];
    $processName = ""; 
    switch($processNameStr){
        case "MS":
            $processName = "MS";
        break;
        case "MOS":
            $processName = "MOS";
        break;
        case "RFI":
            $processName = "RFI";
        break;
        case "IR":
            $processName = "IR";
        break;
        case "WIR":
            $processName = "WIR";
        break;
        case "NCR":
            $processName = "NCR";
        break;
        case "RS":
            $processName = "RS";
        break;
        case "PTW":
            $processName = "PTW";
        break;
        case "CAR":
            $processName = "CAR";
        break;
        default:
            echo json_encode("This record contains error");
        return;
    }
    $host = $jogetHost . "jw/web/json/plugin/JogetConstructsAPIs.GetConstructsProcessData/service"; // change link to api
   
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
    global $jogetHost;

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
             $processName = "NCR";
        break;
        case "WIR":
             $processName = "WIR";
        break;
        case "RFI":
             $processName = "RFI";
        break;
        case "MOS":
             $processName = "MOS";
        break;
        case "MS":
             $processName = "MS";
        break;
        case "IR":
             $processName = "IR";
        break;
        case "RS":
            $processName = "RS";
        break;
        case "SD":
            $processName = "SD";
        break;
        case "SDL":
            $processName = "SDL";
        break;
        case "DR":
            $processName = "DM";
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

    $processId = $packageName[0] . ":" . $_SESSION['Package_Version'] . ":" . $processName;      //crm:3:process1
    $host = $jogetHost . "jw/web/json/workflow/process/start/" . $processId."?var_Project=".$_SESSION['projectID'];
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

function getListofPackages()
{
    global $api_username;
    global $api_password;
    global $jogetHost;
    $host = $jogetHost . "jw/web/json/console/app/list"; // change link to api
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
        echo $err;
    } else {
        $decodedText = html_entity_decode($return);
        $data_arr = json_decode($decodedText, true);
        $i = 0;
        foreach ($data_arr['data'] as $details) {
            $data[$i]['packageId'] = $details['id'];
            $data[$i]['packageName'] = $details['name'];
            $i++;
        }
        echo json_encode($data);
    }
}

//adds new user to the joget (jehan PFS version)
function jogetUserRegistration( $firstName, $lastName, $email, $supportUser, $password,  $orgId, $orgName, $orgDesc ="", $type = "") //PFS
{
    global $jogetHost, $jogetSupportHost, $PHPCACERTPATH;
    $certificate_location = $PHPCACERTPATH;
    $isSupportHost = false;
    $host              = $jogetHost."jw/web/json/plugin/org.joget.custom.webservices.UserRegistrationApi/service?";

    $payload = array(
        'userName' => $email,
        'password' => $password,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'userStatus' => "active",
        'orgId' => $orgId,
        'orgName'=> $orgName,
        'orgDesc' => $orgDesc,
        'designation' => ""
 
    );

    $payload = json_encode($payload);

    $headers = array(
        'Content-Type: application/json',
        'API_KEY: 90c1491d-1ecd-4642-a8fd-855babcce15a'
        //'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $type = strtoupper(trim($type));
    $isSupportHost = ($type === "SUPPORT");

    if($isSupportHost){
        $host              = $jogetSupportHost."jw/web/json/plugin/org.joget.custom.webservices.UserRegistrationApi/service?";

        if(userExists($email)){
            echo "User already exists. Continuing...";
        }else{
            $ch = curl_init($host);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            // need this for KKR server as the php.ini points to another cert other than cacert.pem
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $certificate_location);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $certificate_location);
            $return = curl_exec($ch);
            $err    = curl_error($ch);
            curl_close($ch);

            if ($err) {
                return $err;
            } else {
                return $return;
            }
        }
    }else{
        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $return = curl_exec($ch);
        $err    = curl_error($ch);
        curl_close($ch);

        if ($err) {
            return $err;
        } else {
            return $return;
        }
    }

    
}

//updates user password, name and status (jehan PFS version)
function jogetUserUpdate( $firstName , $lastName, $email, $supportUser, $password ="", $userStatus ="", $type = "") //PFS
{
   
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
   
    global $jogetHost, $jogetSupportHost;
    $host              = $jogetHost."jw/web/json/plugin/org.joget.custom.webservices.UserRegistrationApi/service?";
    if ($type == "SUPPORT") {
        $host              = $jogetSupportHost."jw/web/json/plugin/org.joget.custom.webservices.UserRegistrationApi/service?";
    }
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
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
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
function jogetUserInactivateActivateDelete( $userList, $type = "") //PFS
{
    global $api_username;
    global $api_password;
   
    $payload = array();
    $payload['users'] = $userList;
   
    global $jogetHost, $jogetSupportHost;
    $host = $jogetHost."jw/web/json/plugin/org.joget.custom.webservices.UsersModifyApi/service";
    if ($type == "SUPPORT") {
        $host              = $jogetSupportHost."jw/web/json/plugin/org.joget.custom.webservices.UsersModifyApi/service";
    }
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
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
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
function jogetProjectRegistration( $projectDetails){
    $payload = $projectDetails;
    
    global $jogetHost;
    $host              = $jogetHost."jw/web/json/plugin/org.joget.custom.webservices.GenericCUAPI/service?formId=projectForm";
    
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
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
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
function jogetUserProjectAssign($pid , $users){
    global $jogetHost;
    $host = $jogetHost."jw/web/json/plugin/org.joget.custom.webservices.UserProjectAssignAPI/service";
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
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
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
function jogetProjectCleanUpService($operation, $project_id){
    global $api_username;
    global $api_password;
    global $jogetHost;
    $host = $jogetHost."jw/web/json/plugin/org.joget.custom.webservices.PFSCleanupAPI/service";
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
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
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
    global $api_username, $api_password, $jogetHost, $JOGETLINKOBJ;
    if($_SESSION['is_Parent'] == "isParent"){
        return;
    }
    
    // load all the link for construct api    
    $JOGETLINKOBJ->getLink('construct');

    $processName = $_POST['processName'];
    $processNameArr = array("NCR","WIR","RFI","MOS","MS","IR", "SD", "SDL", "PTW", "CAR", "NOI"); // to cross check with defined url in jogetLink Class

    if (in_array($processName, $processNameArr) && isset($JOGETLINKOBJ->jogetAppLink['api']['construct_json_'.$processName])) {
        $host = $JOGETLINKOBJ->jogetAppLink['api']['construct_json_'.$processName];
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
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err) {
        echo $err;
    } else {
        echo $return;
    }
}

function getContractDetailsUTSB(){
    global $api_username;
    global $api_password;
    global $jogetHost;
    $host = $jogetHost . "jw/web/json/data/list/doc/list_utsbProjectInfo?d-7284774-fn_package_id=".$_SESSION['projectID'];
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
       echo $return;
    }
}
