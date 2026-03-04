<?php
//session started in joget.php
include_once '../login/include/_include.php';
include_once '../backend/joget.php';
include_once('class/jogetLink.class.php');
global $JOGETLINKOBJ;
$JOGETLINKOBJ = new JogetLink();
$jogetHostIP = $JOGETLINKOBJ->jogetHost;
$jogetAssetHostIP = $JOGETLINKOBJ->jogetAssetHost;
$jogetSupportHostIP = $JOGETLINKOBJ->jogetSupportHost;

$response = array();
$functionName = filter_input(INPUT_POST, 'functionName', FILTER_SANITIZE_STRING);

if (!$functionName) {
    $response['bool'] = false;
    $response['msg'] = "Invalid function";
    echo json_encode($response);
    exit();
}


switch ($functionName) {
    case 'viewUser': //view_user.php
        viewUser();
        break;
    case 'addUser': //adduser.php
        addUser();
        break;
    case 'updateUser':
        updateUser();
        break;
    case 'inactivateUser':
        inactivateUser();
        break;
    case 'reactivateUser':
        reactivateUser();
        break;
    case 'deleteUser':
        deleteUser();
        break;
    case 'updateTheme':
        updateTheme();
        break;
    case 'activeUsers':
        activeUsers();
        break;
    case 'updateUserProfile': //update for user themselves
        updateUserProfile();
        break;
    case 'getContractorsConsultantsOrg':
        getContractorsConsultantsOrg();
        break;
    case 'getAllUsers':
        getAllUsers();
        break;
    case 'adminProjectUser':
        $response = adminProjectUser();
        break;
    case 'adminUserTableRefresh':
        adminUserTableRefresh();
        break;
    case 'refreshDeleUserTableBody':
        refreshDelUserTableBody();
        break;
    case 'updateUserForgetPwd':
        updateUserForgetPwd();
        break;
    case 'updateUserProfileV3': //update for user themselves
        updateUserProfileV3();
        break;
    case 'getContractorsConsultantsUser':
        getContractorsConsultantsUser();
        break;

};
echo json_encode($response);

function updateUserProfileV3(){
    global $response;
    global $CONN;
    $userId = $_SESSION['email'];
    $uploads_dir = '../../Data/users/'.$userId;
    if (!file_exists($uploads_dir)) {
        $old = umask(0);
        mkdir($uploads_dir, 0777, true);
        umask($old);
    }
    if(isset($_FILES['userProfilePic']['tmp_name']) && $_FILES['userProfilePic']['tmp_name']){
        $name = $_FILES['userProfilePic']['name'];
        $tmp_name = $_FILES['userProfilePic']['tmp_name'];
        if(move_uploaded_file($tmp_name, "$uploads_dir/$name")){
            $ok = $CONN->execute("update users set profile_img = :0 where user_email =:1", array($name, $userId));
            $response['updatedProfileSrc'] = "$uploads_dir/$name";
            $_SESSION['profile_img'] = $name;
        }
    }
    if(isset($_FILES['userProfileHeader']['tmp_name']) && $_FILES['userProfileHeader']['tmp_name']){
        $name = $_FILES['userProfileHeader']['name'];
        $tmp_name = $_FILES['userProfileHeader']['tmp_name'];
        if(move_uploaded_file($tmp_name, "$uploads_dir/$name")){
            $ok = $CONN->execute("update users set profile_header = :0 where user_email =:1", array($name, $userId));
            $response['updatedHeaderSrc'] = "$uploads_dir/$name";
            $_SESSION['profile_header'] = $name;
        }
    }
    $fname = filter_input(INPUT_POST, 'fname', FILTER_SANITIZE_STRING);
    $lname = filter_input(INPUT_POST, 'lname', FILTER_SANITIZE_STRING);
    $country = filter_input(INPUT_POST, 'country', FILTER_SANITIZE_STRING);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
    $designation = filter_input(INPUT_POST, 'designation', FILTER_SANITIZE_STRING);

    _updateUserProfile($fname, $lname, $country, $phone, $password, $designation);
}

function updateUserForgetPwd(){
    global $response, $CONN;
    $user_email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $user_token = filter_input(INPUT_POST, 'token', FILTER_SANITIZE_STRING);
    $user_pwd = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
    // check token
    $usr = $CONN->fetchRow("select * from users where user_email = ? and token = ?", array($user_email, $user_token));
    if(!$usr) {
        $response['bool'] = false;
        $response['msg'] = "Invalid token";
        return;        
    }

    // update the password if okay
    $_SESSION['email'] = $usr['user_email'];
    $_POST['fname'] = $usr['user_firstname'];
    $_POST['lname'] = $usr['user_lastname'];
    $_POST['country'] = $usr['user_country'];
    $_POST['phone'] = $usr['phone'];
    $_POST['password'] = $user_pwd;

    $ok = _updateUserProfile($_POST['fname'], $_POST['lname'], $_POST['country'], $_POST['phone'], $_POST['password']);
    if($ok){
        // then update to null again the token
        $CONN->execute("update users set token = '' where user_email =? and token =?", array($user_email, $user_token));
        $response['bool'] = true;
        $response['msg'] = "";
    }
}

function viewUser(){
    global $response;
    global $CONN;

    $user_email = filter_input(INPUT_POST, 'usr_email', FILTER_VALIDATE_EMAIL);
    if (!$user_email) {
        $response['bool'] = false;
        $response['msg'] = "Invalid parameter";
        return $response;
    }

    $fetchUser = $CONN->fetchRow("SELECT u.user_id, u.user_firstname, u.user_lastname, u.user_email, u.user_type, o.orgName, u.user_country, u.user_phone, u.user_org, u.created_by, u.created_time, u.last_update, u.updated_by, u.last_login, u.support_user, u.profile_img, u.profile_header FROM users u, organization o WHERE user_email = :0 AND u.user_org = o.orgID ", array($user_email));
    $response['data'] = $fetchUser;
    $user_id = $fetchUser['user_id'];
    if (isset($_SESSION['project_id'])) {
        $project_id_number = $_SESSION['project_id'];
        $fetchRole = $CONN->fetchOne("SELECT Pro_Role FROM pro_usr_rel WHERE Usr_ID =:0 AND Pro_ID =:1", array($user_id, $project_id_number));
        $response['project_role'] = $fetchRole;
    }
    $response['user_projects'] = getUserProjects($user_id);
    return $response;
}

function getUserProjects($user_id){
    global $CONN;
    $allProjects = $CONN->fetchAll("SELECT project_name, Pro_Role, Pro_ID, added_by, added_time FROM pro_usr_rel LEFT JOIN projects ON pro_usr_rel.Pro_ID = projects.project_id_number
		WHERE pro_usr_rel.Usr_ID = :0 AND projects.status = 'active' AND  pro_usr_rel.Pro_Role != 'non_Member' ORDER By added_time DESC", array($user_id));
    return $allProjects;
}

function addUser(){
    global $response;
    global $CONN;
    global $jogetAssetHostIP;
    global $jogetHostIP;
    global $jogetSupportHostIP;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }

    $email = $_SESSION['email'];
    $userDetails = array(
        "user_firstname" => filter_input(INPUT_POST, 'fname', FILTER_SANITIZE_STRING),
        "user_lastname" => filter_input(INPUT_POST, 'lname', FILTER_SANITIZE_STRING),
        "user_email" => filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL),
        "user_org" => filter_input(INPUT_POST, 'orgid', FILTER_SANITIZE_STRING),
        "user_country" => filter_input(INPUT_POST, 'country', FILTER_SANITIZE_STRING),
        "user_type" => filter_input(INPUT_POST, 'usertype', FILTER_SANITIZE_STRING),
        "user_password" => filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING),
        "user_phone" => filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING),
        "user_designation" => filter_input(INPUT_POST, 'designation', FILTER_SANITIZE_STRING),

        //add code for support user
        "support_user" => filter_input(INPUT_POST, 'supuser', FILTER_VALIDATE_BOOLEAN),
    );

    $orgDetails = array(
        "orgID" => filter_input(INPUT_POST, 'orgid', FILTER_SANITIZE_STRING),
        "orgName" => filter_input(INPUT_POST, 'orgname', FILTER_SANITIZE_STRING),
        "orgDescription" => filter_input(INPUT_POST, 'orgdesc', FILTER_SANITIZE_STRING),
        "orgType" => filter_input(INPUT_POST, 'orgtype', FILTER_SANITIZE_STRING),
        "Constructs" => filter_input(INPUT_POST, 'orgConstructs', FILTER_VALIDATE_BOOLEAN),
 
    );
    //check if email, firstname, lastname and password val exist
    if (empty($userDetails['user_email']) || empty($userDetails['user_firstname']) || empty($userDetails['user_lastname']) || empty($userDetails['user_password'])) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient data";
        return;
    }

    //check if text has special character ' in it. if so need to add one more to get saved in database. Sanitizer changes it to &#39;
    $pos = strpos($userDetails['user_firstname'], "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($userDetails['user_firstname'], 0, $pos) . $str_to_insert . substr($userDetails['user_firstname'], $pos + 5);
        $userDetails['user_firstname'] = $name;
    }
    $pos = strpos($userDetails['user_lastname'], "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($userDetails['user_lastname'], 0, $pos) . $str_to_insert . substr($userDetails['user_lastname'], $pos + 5);
        $userDetails['user_lastname'] = $name;
    }
    $pos = strpos($userDetails['user_country'], "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($userDetails['user_country'], 0, $pos) . $str_to_insert . substr($userDetails['user_country'], $pos + 5);
        $userDetails['user_country'] = $name;
    } 
    $pos = strpos($userDetails['user_designation'], "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($userDetails['user_designation'], 0, $pos) . $str_to_insert . substr($userDetails['user_designation'], $pos + 5);
        $userDetails['user_designation'] = $name;
    }

    if ((!preg_match("/^[ a-zA-z'.]*$/", $userDetails['user_firstname'])) || (!preg_match("/^[ a-zA-z'.]*$/", $userDetails['user_lastname']))) {
        $response['msg'] = "Invalid Name. Only alphabets, space and ' are allowed. No other special characters are allowed";
        $response['data'] = "open";
        $response['fname'] = $userDetails['user_firstname'];
        return;
    }

    $validation = validateUserEmail($userDetails['user_email']);
    $response['validation'] = $validation;
    if (!empty($validation)) { //name or id exists
        $response['bool'] = false;
        $response['msg'] = $validation;
        return;
    }

    if($userDetails['support_user'] == true){
        $jogetSup = "true";
    }else{
        $jogetSup = "false";
    }
    $validation = validateUserEmail($userDetails['user_email']);
    $response['validation'] = $validation;
    if (!empty($validation)) { //name or id exists
        $response['bool'] = false;
        $response['msg'] = $validation['userEmail'];
        return;
    }
   

    if (!empty($orgDetails['orgtype'])) { //new organization
        $resp = jogetUserRegistration( $jogetHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $userDetails['user_email'], $jogetSup, $userDetails['user_password'], $userDetails['user_designation'], $orgDetails['orgID'], $orgDetails['orgName'], $orgDetails['orgDescription'] );
        if($userDetails['support_user'] == true){
            $resp2 = jogetUserRegistration($jogetSupportHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $userDetails['user_email'], $jogetSup, $userDetails['user_password'], $userDetails['user_designation'], $orgDetails['orgID'], $orgDetails['orgName'], $orgDetails['orgDescription'] );
            $response['support'] = $resp2;
        }
    } else {
        $resp = jogetUserRegistration($jogetHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $userDetails['user_email'], $jogetSup, $userDetails['user_password'], $userDetails['user_designation'], $orgDetails['orgID'], $orgDetails['orgName']);
        if($userDetails['support_user'] == true){
            $resp2 = jogetUserRegistration($jogetSupportHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $userDetails['user_email'], $jogetSup, $userDetails['user_password'], $userDetails['user_designation'], $orgDetails['orgID'], $orgDetails['orgName'] );
            $response['support'] = $resp2;
        }
    }
    $myresp = json_decode($resp);
    if ($myresp == "") { //user was not created in one of the joget. so exit
        $response['bool'] = false;
        $response['msg'] = "Unable to add the user to the system. Please check the connection.";
        $response['data'] = "close";
        return;
    } else {
        if ($myresp->message != "User Created") { //user was not created in jogetk. so exit
            $response['bool'] = false;
            $response['msg'] = $myresp->message ;
            $response['msg1'] = $myresp1->message ;
            $response['data'] = "open";
            return $response;
        } else { // add the user to DB now
            if($userDetails['support_user'] ){
                $myresp2 = json_decode($resp2);
                $response['msg2'] = $myresp2->message ;
            }
            if (!empty($orgDetails['orgType'])) {
                //check if the org ID exists already??
                $fetchOrg = $CONN->fetchRow("SELECT * FROM organization WHERE orgID = :0", array($orgDetails['orgID']));
                if (!$fetchOrg) {
                    // create new org record first
                    $orgDetails['orgType'] = trim($orgDetails['orgType']);
                    $colsToInsert = array();
                    $varsToInsert = array();
                    $valsToInsert = array();
                    foreach ($orgDetails as $key => $cl) {
                        if ($cl !== false || $cl !== null) {
                            $colsToInsert[] = $key;
                            $varsToInsert[] = ":" . $key;
                            $valsToInsert[$key] = $cl;
                        }
                    }

                    $insertSQL = "INSERT INTO organization (" . implode(" ,", $colsToInsert) . ") VALUES (" . implode(" ,", $varsToInsert) . ")";
                    $ok = $CONN->execute($insertSQL, $valsToInsert);
                    if (!$ok) {
                        $response['bool'] = false;
                        $response['msg'] = "User added but Unable to add the organization due to error in sql :" . $CONN->errorMsg;
                        $response['data'] = "close";
                        return;
                    }
                }
            }

            //hash password for security
            $userDetails['user_password'] = password_hash($userDetails['user_password'], PASSWORD_DEFAULT);
            $colsToInsertUser = array();
            $varsToInsertUser = array();
            $valsToInsertUser = array();
            foreach ($userDetails as $key => $cl) {
                if ($cl !== false || $cl !== null) {
                    $colsToInsertUser[] = $key;
                    $varsToInsertUser[] = ":" . $key;
                    $valsToInsertUser[$key] = $cl;
                }
            }
            $insertUserSQL = "INSERT INTO users (" . implode(" ,", $colsToInsertUser) . ",created_by, created_time, ui_pref) VALUES (" . implode(" ,", $varsToInsertUser) . ", '$email', GETDATE(), 'ri_v3')";
            $okUser = $CONN->execute($insertUserSQL, $valsToInsertUser);

            if (!$okUser) {
                $response['bool'] = false;
                $response['msg'] = "Unable to insert user due to SQL error :" . $CONN->errorMsg;
                return;
            }
            $response['msg'] = "User is successfully created in the system";
            $response['data'] = "close";
            $response['joget'] = $resp;
        }
    }
}


function validateUserEmail($userEmail){ // to validate if the email already exists or not
    global $CONN;
    $return = array();
    if ($userEmail != null) {
        $checkEmailSql = "SELECT * FROM users WHERE user_email=:0";
        $userEmailExists = $CONN->fetchOne($checkEmailSql, array($userEmail));
        if (!empty($userEmailExists)) {
            $return['userEmail'] = "Email exists. Please change the details to proceed.";
        }
    } else {
        $return['userEmail'] = "User Email is null. Please change the details to proceed.";
    }
    return $return;
}

function updateUser(){
    global $response;
    global $CONN;
    global $jogetAssetHostIP;
    global $jogetHostIP;
    global $jogetSupportHostIP;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }

    $email = $_SESSION['email'];
    $userDetails = array(
        "user_id" => filter_input(INPUT_POST, 'userid', FILTER_VALIDATE_INT),
        "user_firstname" => filter_input(INPUT_POST, 'fname', FILTER_SANITIZE_STRING),
        "user_lastname" => filter_input(INPUT_POST, 'lname', FILTER_SANITIZE_STRING),
        "user_country" => filter_input(INPUT_POST, 'country', FILTER_SANITIZE_STRING),
        "user_type" => filter_input(INPUT_POST, 'usertype', FILTER_SANITIZE_STRING),
        "support_user" => filter_input(INPUT_POST, 'supuser', FILTER_VALIDATE_BOOLEAN),
        "user_phone" => filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING),
        "user_designation" => filter_input(INPUT_POST, 'designation', FILTER_SANITIZE_STRING)
    );
    if (isset($_POST['password'])) {
        $userDetails['user_password'] = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
    }
    if (isset($_POST['supuserChange'])) {
        $support_user_change = filter_input(INPUT_POST, 'supuserChange', FILTER_VALIDATE_BOOLEAN);
    }
    //check if email, firstname, lastname and password val exist
    if (empty($userDetails['user_firstname']) || empty($userDetails['user_lastname'])) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient data";
        return;
    }
    if($userDetails['support_user'] == true){
        $jogetSup = "true";
    }else{
        $jogetSup = "false";
    }
    //check if text has special character ' in it. if so need to add one more to get saved in database. Sanitizer changes it to &#39;
    $pos = strpos($userDetails['user_firstname'], "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($userDetails['user_firstname'], 0, $pos) . $str_to_insert . substr($userDetails['user_firstname'], $pos + 5);
        $userDetails['user_firstname'] = $name;
    }
    $pos = strpos($userDetails['user_lastname'], "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($userDetails['user_lastname'], 0, $pos) . $str_to_insert . substr($userDetails['user_lastname'], $pos + 5);
        $userDetails['user_lastname'] = $name;
    }

    $pos = strpos($userDetails['user_country'], "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($userDetails['user_country'], 0, $pos) . $str_to_insert . substr($userDetails['user_country'], $pos + 5);
        $userDetails['user_country'] = $name;
    }

    if ((!preg_match("/^[ a-zA-z'.]*$/", $userDetails['user_firstname'])) || (!preg_match("/^[ a-zA-z'.]*$/", $userDetails['user_lastname']))) {
        $response['msg'] = "Invalid Name. Only alphabets, space and ' are allowed. No other special characters are allowed";
        $response['data'] = "open";
        $response['fname'] = $userDetails['user_firstname'];
        return;
    }
    //check if userID retrieved is an existing user
    //need the email to update user in joget
    $fetchUserEmail = $CONN->fetchOne("SELECT user_email FROM users WHERE user_id = :0", array($userDetails['user_id']));
    if (!$fetchUserEmail) {
        $response['msg'] = "User does not exist.";
        $response['data'] = "close";
        return;
    }
   $userList = [];
   $resp ="";
   $resp2 = "";
    if (!empty($userDetails['user_password'])) {
        $resp = jogetUserUpdate($jogetHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $fetchUserEmail, $jogetSup, $userDetails['user_designation'], $userDetails['user_password']);
        if(isset($support_user_change) && $support_user_change == true){ //either added or removed as support user
            if($userDetails['support_user'] == true){// user has been added as support user - add to support joget
                    //get user email,  org id , name , description from db to pass to add the user
                    $usr = $CONN->fetchRow("select u.user_org as orgID, u.user_email as user_email,  o.orgName as orgName, o.orgDescription as orgDescription from users u, organization o where user_id = ? and u.user_org = o.orgID", array($userDetails['user_id']));
                    $resp2 = jogetUserRegistration($jogetSupportHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $usr['user_email'], $jogetSup, $userDetails['user_password'], $userDetails['user_designation'], $usr['orgID'], $usr['orgName'], $usr['orgDescription'] );
                    
            }else{
                //remove user from support joget if the joget is not the same as construct or asset
                array_push($userList, (object) [
                    'userName' => $fetchUserEmail,
                    'status' => 'remove',
                ]);
                $resp2 = jogetUserInactivateActivateDelete($jogetSupportHostIP, $userList);
                    
            }

        }else{// there is no change - user has not been added or removed. check if support user then update the details to support joget
            if($userDetails['support_user'] == true){// user is a support user . so update the details
                    $resp2 = jogetUserUpdate($jogetSupportHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $fetchUserEmail, $jogetSup, $userDetails['user_designation'], $userDetails['user_password']);
            }

        }
    } else {
        if(isset($support_user_change) && $support_user_change == true){ //either added or removed as support user
            if($userDetails['support_user'] == true){// if user is added to support need to give password so nothing to do here
                // if( $jogetAssetHostIP != $jogetSupportHostIP && $jogetSupportHostIP != $jogetHostIP){ //support joget is not the same as construct or asset joget
                //     //get user email,  org id , name , description from db to pass to add the user
                //     $usr = $CONN->fetchRow("select u.user_org as orgID, u.user_email as user_email,  o.orgName as orgName o.orgDescription as orgDescription from users u, organization o where user_id = ? and u.user_org = o.orgID", array($userDetails['user_id']));
                //     $resp2 = jogetUserRegistration($jogetSupportHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $usr['user_email'], $userDetails['user_password'], $usr['orgID'], $usr['orgName'], $usr['orgDescription'] );
                // }
            }else{
                //remove user from support joget if the joget is not the same as construct or asset
                array_push($userList, (object) [
                    'userName' => $fetchUserEmail,
                    'status' => 'remove',
                ]);
                if(sizeof($userList) > 0){
                    $response['userlist'] = $userList;
                }else{
                    $response['userlist'] = "no users in list";
                }
                $resp2 = jogetUserInactivateActivateDelete($jogetSupportHostIP, $userList);
                   
            }

        }else{// there is no change - user has not been added or removed. check if support user then update the details to support joget
            if($userDetails['support_user'] == true){// user is a support user . so update the details
                  
                    $resp2 = jogetUserUpdate($jogetSupportHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $fetchUserEmail, $jogetSup, $userDetails['user_designation']);
                   
                
            }

        }
        $resp = jogetUserUpdate($jogetHostIP, $userDetails['user_firstname'], $userDetails['user_lastname'], $fetchUserEmail, $jogetSup, $userDetails['user_designation']);
    }
    $myresp = json_decode($resp);
    if ($myresp == "") { //user was not updated in joget. so exit
        $response['msg'] = "Unable to update the user to the joget system. please check the joget connection.";
        $response['data'] = "close";
        return;
    } else {
        if ($myresp->message != "User Updated" ) { //user was not updated in one or both jogets. so exit
            $response['msg'] = $myresp->message . " User not updated";
            $response['msg1'] = $myresp1->message .
            $response['data'] = "close";
            return;
        } else { 
            if(isset($support_user_change) && $support_user_change || $userDetails['support_user'] ) {
                    $myresp2 = json_decode($resp2);
                    $response['support_user'] = $myresp2;
                    $response['user_list'] = $userList;
                    // if ($myresp2->message != "User Updated" ||$myresp2 == ""){
                     
                    //     $response['msg'] = $myresp->message ;
                    //     $response['msg1'] = $myresp1->message ;
                    //     $response['msg2'] = $myresp2->message ;
                    //     $response['data'] = "close";
                        
                    //     return;
                    // }
            }
            
            
            // update the user to DB now
            if (!empty($userDetails['user_password'])) {
                $userDetails['user_password'] = password_hash($userDetails['user_password'], PASSWORD_DEFAULT);
            }

            $colsToUpdArr = array();
            $valsToUpdArr = array();
            foreach ($userDetails as $key => $cl) {
                if ($key !== "user_id") {
                    if ($cl !== false || $cl !== null) {
                        $colsToUpdArr[] = $key . ' = :' . $key;
                        $valsToUpdArr[$key] = $cl;
                    }
                }
            }
            $valsToUpdArr['user_id'] = $userDetails['user_id'];
            $valsToUpdArr['updatedBy'] = $email;
            // $response['cols'] = $colsToUpdArr;
            // $response['value'] = $valsToUpdArr;
            $updSql = "UPDATE users SET " . implode(" ,", $colsToUpdArr) . ",updated_by =:updatedBy, last_update = GETDATE() WHERE user_id =:user_id";
            $ok = $CONN->execute($updSql, $valsToUpdArr);

            if (!$ok) {
                $response['bool'] = false;
                $response['msg'] = "User updated to joget system but unable to update user to database due to SQL error :" . $CONN->errorMsg;
                return $response;
            }
            if ($email == $fetchUserEmail) { // changing logged in users details
                if (!empty($userDetails['user_password'])) {
                    session_destroy();
                    $response['msg'] = "User was updated to the system successfully. Current session is destroyed due to change in password. please relogin.";
                    $response['data'] = "close";
                    $response['joget'] = $resp;
                    return;
                }

                $_SESSION['firstname'] = $userDetails['user_firstname'];
                $_SESSION['lastname'] = $userDetails['user_lastname'];
                $response['msg'] =  "User was updated to the system successfully";
                $response['data'] = "update fname";
                $response['joget'] = $resp;
                return;
            }
            $response['msg'] = "User was updated to the system successfully";
            $response['data'] = "close";
            $response['joget'] = $resp;
            return;
        }
    }
}

function inactivateUser(){
    global $response;
    global $CONN;
    global $jogetAssetHostIP;
    global $jogetHostIP;
    global $jogetSupportHostIP;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }

    $email = $_SESSION['email'];
    $userid = json_decode($_POST['user_id']);
    foreach ($userid as $uid) {
        if (!filter_var($uid, FILTER_VALIDATE_INT)) {
            $response['bool'] = false;
            $response['msg'] = "Invalid parameter";
            return;
        }
    }
    $idsStr = implode(', ', $userid);
    $userList = [];
    $userSupportList = [];
    $jogetUserUpdateList = [];
    $fetchUserEmails = $CONN->fetchAll("SELECT user_email, support_user FROM users WHERE user_id IN ($idsStr) AND user_email !=:0", array($email));
    $response['fetchedemails'] = $fetchUserEmails;
    foreach ($fetchUserEmails as $key => $uemail) {
        array_push($userList, (object) [
            'userName' => $uemail['user_email'],
            'status' => 'inactive',
        ]);
        if($uemail['support_user'] == 1){
            array_push($userSupportList, (object) [
                'userName' => $uemail['user_email'],
                'status' => 'inactive',
            ]);

        }
    }
    $response['count'] = sizeof($userSupportList);

    //update joget users first..and then update the DB
    $updatedUsers = [];
    $unUpdatedUsers = [];
    $response['users'] = $userList;
    $result = jogetUserInactivateActivateDelete($jogetHostIP, $userList);
    $result2 = jogetUserInactivateActivateDelete($jogetSupportHostIP, $userSupportList);
    $myresp2 = json_decode($result2);
    $response['resp2'] = $myresp2;

    $myresp = json_decode($result);
    if ($myresp == "") { //user/users were not de activated .. so exit
        $response['msg'] = "Unable to archive the user/users in the joget system. please check the joget connection.";
        $response['data'] = "close";
        return;
    } else {
        if(sizeof($userSupportList)>0) {
            if ($myresp2 == ""){
                $response['msg'] = "Unable to archive the user/users in the support joget system. please check the joget connection.";
                $response['data'] = "close";
                
                return;
            }
        }
        $users = $myresp->users;
        foreach ($users as $user) {
            if ($user->userStatus == true) {
                array_push($jogetUserUpdateList, $user->userName);
            } else {
                array_push($unUpdatedUsers, $user->userName);
            }
        }
        if (!empty($jogetUserUpdateList)) {
            $id_emails = implode("','", $jogetUserUpdateList);
            // $updSql = "UPDATE users SET user_type='non_active', updated_by =:0, last_update = GETDATE() WHERE user_email IN ('$id_emails') ";
            $updated = $CONN->fetchAll("UPDATE users SET user_type='non_active', updated_by =:0, last_update = GETDATE() OUTPUT inserted.user_id WHERE user_email IN ('$id_emails') ", array($_SESSION['email']));
            if (!$updated) {
                $response['bool'] = false;
                $response['msg'] = "SQL Error:" . $CONN->errorMsg;
                return $response;
            }
            $response['updated'] = $updated;
            $userIDs = [];
            foreach ($updated as $user) {
                array_push($userIDs, $user['user_id']);
            }

            // call function to remove project from Joget. Param userid Array
            // also handled deletion of project in RI within the same function
            $project_removed = removeAssociateProjects($userid);
        }

    }
    if (!empty($unUpdatedUsers)) {
        $mystring = "Unable to inactivate this/these User/Users  : <br>" . implode('<br>', $unUpdatedUsers);
        $response['msg'] = $mystring;
        $response['jogetMsg'] = $myresp;
        return;
    }

    $response['msg'] = "User/Users successfully deactivated";
    $response['jogetMsg'] = $myresp;
    return;

}

function reactivateUser(){
    global $response;
    global $CONN;
    global $jogetAssetHostIP;
    global $jogetHostIP;
    global $jogetSupportHostIP;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }

    $email = $_SESSION['email'];
    $userid = json_decode($_POST['user_id']);
    foreach ($userid as $uid) {
        if (!filter_var($uid, FILTER_VALIDATE_INT)) {
            $response['bool'] = false;
            $response['msg'] = "Invalid parameter";
            return;
        }
    }
    $idsStr = implode(', ', $userid);
    $userList = [];
    $userSupportList = [];
    $jogetUserUpdateList = [];
    $fetchUserEmails = $CONN->fetchAll("SELECT user_email , support_user FROM users WHERE user_id IN ($idsStr)");
    foreach ($fetchUserEmails as $key => $uemail) {
        array_push($userList, (object) [
            'userName' => $uemail['user_email'],
            'status' => 'active',
        ]);

        if($uemail['support_user']  == 1){
            array_push($userSupportList, (object) [
                'userName' => $uemail['user_email'],
                'status' => 'active',
            ]);

        }
    }

    //update joget users first..and then update the DB
    $updatedUsers = [];
    $unUpdatedUsers = [];
    $result = jogetUserInactivateActivateDelete( $jogetHostIP, $userList);
    $result2 = jogetUserInactivateActivateDelete( $jogetSupportHostIP, $userSupportList);
    $myresp2 = json_decode($result2);

    $myresp = json_decode($result);
    if ($myresp == "") { //user/users were not de activated .. so exit
        $response['msg'] = "Unable to recover the user/users in the joget system. please check the joget connection.";
        $response['data'] = "close";
        return;
    } else {

        if(sizeof($userSupportList)>0) {
            if ($myresp2 == ""){
                $response['msg'] = "Unable to recover the user/users in the support joget system. please check the joget connection.";
                $response['data'] = "close";
                
                return;
            }
        }
        $users = $myresp->users;
        foreach ($users as $user) {
            if ($user->userStatus == true) {
                array_push($jogetUserUpdateList, $user->userName);
            } else {
                array_push($unUpdatedUsers, $user->userName);
            }
        }
        if (!empty($jogetUserUpdateList)) {
            $id_emails = implode("','", $jogetUserUpdateList);
            $updSql = "UPDATE users SET user_type = 'user', updated_by =:0, last_update = GETDATE() WHERE user_email IN ('$id_emails') ";
            $updated = $CONN->execute($updSql, array($_SESSION['email']));
            if (!$updated) {
                $response['bool'] = false;
                $response['msg'] = "SQL Error:" . $CONN->errorMsg;
                return $response;
            }
        }
    }
    if (!empty($unUpdatedUsers)) {
        $mystring = implode(',', $unUpdatedUsers) . ": Unable to activate this/these User/Users in joget system";
        $response['msg'] = $mystring;
        $response['jogetMsg'] = $myresp;
        return;
    }
    $response['msg'] = "User/Users successfully recovered/activated";
    $response['jogetMsg'] = $myresp;
    return;

}

function deleteUser(){
    global $response;
    global $CONN;
    global $jogetAssetHostIP;
    global $jogetHostIP;
    global $jogetSupportHostIP;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }

    $email = $_SESSION['email'];
    $userid = json_decode($_POST['user_id']);
    foreach ($userid as $uid) {
        if (!filter_var($uid, FILTER_VALIDATE_INT)) {
            $response['bool'] = false;
            $response['msg'] = "Invalid parameter";
            return;
        }
    }
    $idsStr = implode(', ', $userid);
    $userList = [];
    $userSupportList = [];
    $jogetUserUpdateList = [];
    $fetchUserEmails = $CONN->fetchAll("SELECT user_email, support_user FROM users WHERE user_id IN ($idsStr) AND user_email !=:0", array($email));
    foreach ($fetchUserEmails as $key => $uemail) {
        array_push($userList, (object) [
            'userName' => $uemail['user_email'],
            'status' => 'remove',
        ]);

        if($uemail['support_user'] == 1){
            array_push($userSupportList, (object) [
                'userName' => $uemail['user_email'],
                'status' => 'remove',
            ]);

        }
    }

    //update joget users first and then our database
    $updatedUsers = [];
    $unUpdatedUsers = [];
    $result = jogetUserInactivateActivateDelete($jogetHostIP, $userList);
    $result2 = jogetUserInactivateActivateDelete( $jogetSupportHostIP, $userSupportList);
    $myresp2 = json_decode($result2);

    $myresp = json_decode($result);
    if ($myresp == "") { //user/users were not deleted in joget .. so exit
        $response['msg'] = "Unable to delete the user/users in the joget system. please check the joget connection.";
        $response['data'] = "close";
        return;
    } else {
        if(sizeof($userSupportList)>0) {
            if( $jogetAssetHostIP != $jogetSupportHostIP && $jogetSupportHostIP != $jogetHostIP){
                if ($myresp2 == ""){
                    $response['msg'] = "Unable to delete the user/users in the support joget system. please check the joget connection.";
                    $response['data'] = "close";
                    
                    return;
                }
            }
        }

        $users = $myresp->users;
        foreach ($users as $user) {
            if ($user->userStatus == true) {
                array_push($jogetUserUpdateList, $user->userName);
            } else {
                array_push($unUpdatedUsers, $user->userName);
            }
        }
        if (!empty($jogetUserUpdateList)) {
            $id_emails = implode("','", $jogetUserUpdateList);
            $deleteUsers = $CONN->fetchAll("SELECT user_id FROM users WHERE user_email IN ('$id_emails')");
            $deleteSql = "DELETE from users WHERE  user_email IN ('$id_emails')"; // check if current user is not included in this list is done when checking for valid users above
            $deleted = $CONN->execute($deleteSql);
            if (!$deleted) {
                $response['msg'] = "User/users removed from joget system. But unable to delete from the database due to SQL error!" . $CONN->errorMsg;
                $response['data'] = "close";
                return;
            }
            $response['deleted'] = $deleted;
            $response['deletedUsers'] = $deleteUsers;
            $userIDs = [];
            foreach ($deleteUsers as $user) {
                array_push($userIDs, $user['user_id']);
            }

            $id_nums = implode(",", $userIDs);
            $response['idnums'] = $id_nums;
            $deleteRelSql = "DELETE from pro_usr_rel WHERE Usr_ID IN($id_nums)"; // check if current user is not included in this list is done when checking for valid users above
            $deletedRel = $CONN->execute($deleteRelSql);
            if (!$deletedRel) {
                $response['msg'] = "User/users removed from joget system. But unable to delete from the database due to SQL error!" . $CONN->errorMsg;
                $response['data'] = "close";
                return;
            }
        }
    }
    if (!empty($unUpdatedUsers)) {
        $mystring = implode(',', $unUpdatedUsers) . ": Unable to delete this/these User/Users as they are part of the approval workflow";
        $response['msg'] = $mystring;
        $response['jogetMsg'] = $myresp;
        return;
    }

    $response['msg'] = "User/users successfully deleted from the system";
    $response['jogetMsg'] = $myresp;
    return;
}

// called on OnClickExportUsers
function activeUsers(){
    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }
    global $CONN;
    global $response;

    $getSql = $CONN->fetchAll("SELECT user_firstname, user_lastname, user_email, user_org, user_country , user_type, user_phone FROM users WHERE user_type!= 'non_active' ORDER BY user_id");
    $response['data'] = $getSql;
}

function updateUserProfile(){
    $fname = filter_input(INPUT_POST, 'fname', FILTER_SANITIZE_STRING);
    $lname = filter_input(INPUT_POST, 'lname', FILTER_SANITIZE_STRING);
    $country = filter_input(INPUT_POST, 'country', FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $designation = filter_input(INPUT_POST, 'designation', FILTER_SANITIZE_STRING);

    _updateUserProfile($fname, $lname, $country, $phone, $password, $designation);
}

function _updateUserProfile($fname, $lname, $country, $phone, $password, $designation){
    if (!isset($_SESSION['email'])) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient parameter";
        return $response;
    }
    global $response;
    global $CONN;
    global $jogetAssetHostIP;
    global $jogetHostIP;
    global $jogetSupportHostIP;
    $email = $_SESSION['email'];
    $support_user =  $CONN->fetchOne("SELECT support_user FROM users WHERE user_email =:0", array($email));
    if($support_user == true){
        $jogetSup = "true";
    }else{
        $jogetSup = "false";
    }
    //check if text has special character ' in it. if so need to add one more to get saved in database. Sanitizer changes it to &#39;
    $pos = strpos($fname, "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($fname, 0, $pos) . $str_to_insert . substr($fname, $pos + 5);
        $fname = $name;
    }
    $pos = strpos($lname, "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($lname, 0, $pos) . $str_to_insert . substr($lname, $pos + 5);
        $lname = $name;
    }
    $pos = strpos($country, "&#39;", 0);
    if ($pos) {
        $str_to_insert = "'";
        $name = substr($country, 0, $pos) . $str_to_insert . substr($country, $pos + 5);
        $country = $name;
    }

    if ((!preg_match("/^[ a-zA-z'.]*$/", $fname)) || (!preg_match("/^[ a-zA-z'.]*$/", $lname))) {
        $response['msg'] = "Invalid Name. Only alphabets, space and ' are allowed. No other special characters are allowed";
        $response['data'] = "open";
        $response['fname'] = $fname;
        return;
    }

    if (isset($_POST['password'])) {
        $resp = jogetUserUpdate($jogetHostIP, $fname, $lname, $email, $jogetSup, $designation, $password);
        //check if the user is support user first
        
        if($support_user){
            $resp2 = jogetUserUpdate($jogetSupportHostIP, $fname, $lname, $email, $jogetSup, $designation, $password);
            $myresp2 = json_decode($resp2);
            if ($myresp2 == "" ) { //user was not updated in joget. so exit
                $response['msg'] = "Unable to update to the joget system. please check the joget connection.";
                $response['data'] = "close";
                return;
            }
        }
        $myresp = json_decode($resp);
        if ($myresp == "") { //user was not updated in joget. so exit
            $response['msg'] = "Unable to update to the joget system. please check the joget connection.";
            $response['data'] = "close";
            return;
        } else {
            $password = password_hash($password, PASSWORD_DEFAULT);

            if (isset($_POST['bentleyusername']) && isset($_POST['bentleypassword'])) {
                $bentleyusername = filter_input(INPUT_POST, 'bentleyusername', FILTER_SANITIZE_STRING);
                $bentleypassword = base64_encode($_POST['bentleypassword']);
                $updSql = "UPDATE users SET user_firstname = :0, user_lastname = :1, user_country =:2, user_password = :3,updated_by = :4,
                last_update =GETDATE(), bentley_username = :5, bentley_password = :6, user_phone =:7, user_designation =:8 WHERE user_email= :9";
                $ok = $CONN->execute($updSql, array($fname, $lname, $country, $password, $email, $bentleyusername, $bentleypassword, $phone, $designation, $email));
            } else {
                $updSql = "UPDATE users SET user_firstname = :0, user_lastname = :1, user_country =:2, user_password = :3,updated_by = :4,
                last_update =GETDATE(), user_phone =:5, user_designation =:6 WHERE user_email= :7";
                $ok = $CONN->execute($updSql, array($fname, $lname, $country, $password, $email, $phone, $designation, $email));
            }

            if (!$ok) {
                $response['bool'] = false;
                $response['msg'] = "User's profile update failed due to SQL error :" . $CONN->errorMsg;
                return $response;
            } else {
                $response['bool'] = true;
                $response['msg'] = "User was updated to the system successfully. Current session is destroyed due to change in password. please relogin.";
                session_destroy(); // password is changed for the logged in user . redirect to login page in js
            }
        }
    } else {
        $resp = jogetUserUpdate($jogetHostIP, $fname, $lname, $email, $jogetSup, $designation);
        //check if the user is support user first
        $support_user =  $CONN->fetchOne("SELECT support_user FROM users WHERE user_email =:0", array($email));
        if($support_user){
            $resp2 = jogetUserUpdate($jogetSupportHostIP, $fname, $lname, $email, $jogetSup, $designation);
            $myresp2 = json_decode($resp2);
            if ($myresp2 == "" ) { //user was not updated in joget. so exit
                $response['msg'] = "Unable to update to the joget system. please check the joget connection.";
                $response['data'] = "close";
                return;
            }
        }
        $myresp = json_decode($resp);
        if ($myresp == "") { //user was not updated in joget. so exit
            $response['msg'] = "Unable to update to the joget system. please check the joget connection.";
            $response['data'] = "close";
            return;
        } else {
            if (isset($_POST['bentleyusername']) && isset($_POST['bentleypassword'])) {
                $bentleyusername = filter_input(INPUT_POST, 'bentleyusername', FILTER_SANITIZE_STRING);
                $bentleypassword = base64_encode($_POST['bentleypassword']);
                $updSql = "UPDATE users SET user_firstname = :0, user_lastname = :1, user_country =:2,updated_by = :3,
                    last_update =GETDATE(), bentley_username = :4, bentley_password = :5, user_phone =:6, user_designation =:7 WHERE user_email= :8";
                $ok = $CONN->execute($updSql, array($fname, $lname, $country, $email, $bentleyusername, $bentleypassword, $phone, $designation, $email));
            } else {

                $updSql = "UPDATE users SET user_firstname = :0, user_lastname = :1, user_country =:2, updated_by = :3,
                    last_update =GETDATE(), user_phone =:4, user_designation =:5 WHERE user_email= :6";
                $ok = $CONN->execute($updSql, array($fname, $lname, $country, $email, $phone, $designation, $email));
            }

            if (!$ok) {
                $response['bool'] = false;
                $response['msg'] = "User's profile update failed due to SQL error :" . $CONN->errorMsg;
                return $response;
            } else {
                $response['bool'] = true;
                $response['msg'] = "User's details has been updated";
            }
        }
    }
    if (isset($_POST['fname'])) {
        $_SESSION['firstname'] = $fname;
    }

    if (isset($_POST['lname'])) {
        $_SESSION['lastname'] = $lname;
    }

    if (isset($_SESSION['bentley_username']) && isset($_POST['bentleyusername'])) {
        $_SESSION['bentley_username'] = $bentleyusername;
    }

    if (isset($_SESSION['bentley_password']) && isset($_POST['bentleypassword'])) {
        $_SESSION['bentley_password'] = $bentleypassword;
    }
    return true;
}

function getContractorsConsultantsOrg(){
    global $response;
    global $CONN;

    $sql = "SELECT * from organization WHERE orgType IN ('consultant', 'contractor', 'DBC')";

    $fetchUsers = $CONN->fetchAll($sql);
    $response = $fetchUsers;
}

function getContractorsConsultantsUser(){
    global $response;
    global $CONN;
    $project_id = filter_input(INPUT_POST, 'project_id', FILTER_SANITIZE_STRING);

    if($project_id !== 'None'){
        $fetchParentId = $CONN->fetchRow("SELECT parent_project_id_number FROM projects WHERE project_id_number = :0", array($project_id));
        if (!$fetchParentId) {
            die(print_r(sqlsrv_errors(), true));
        } else if ($fetchParentId['parent_project_id_number'] !== null) {
            $project_id = $fetchParentId['parent_project_id_number'];
        }

        $sql = "SELECT u.user_id, u.user_email, u.user_firstname, u.user_lastname, o.orgName, u.user_country, u.user_type, u.support_user, o.orgType,
        r.Pro_ID FROM users u , organization o ,  pro_usr_rel r WHERE user_type != 'non_active' AND r.Pro_ID = '$project_id' AND u.user_org = o.orgID AND
        u.user_id = r.Usr_ID AND o.orgType = 'owner' ORDER By user_id";
    }else{
        $sql = "SELECT u.user_id, u.user_email, u.user_firstname, u.user_lastname, o.orgName, u.user_type, u.user_country, o.orgType FROM 
                users u , organization o WHERE user_type != 'non_active' AND u.user_org = o.orgID  ORDER By user_id";
    }

    $fetchUsers = $CONN->fetchAll($sql);
    return $response = $fetchUsers;
}

function getAllUsers(){
    global $response;
    global $CONN;
    $project_id = filter_input(INPUT_POST, 'project_id', FILTER_SANITIZE_STRING);

    if ($project_id !== 'None') {
        $fetchParentId = $CONN->fetchRow("SELECT parent_project_id_number FROM projects WHERE project_id_number = :0", array($project_id));
        if (!$fetchParentId) {
            die(print_r(sqlsrv_errors(), true));
        } else if ($fetchParentId['parent_project_id_number'] !== null) {
            $project_id = $fetchParentId['parent_project_id_number'];
        }

        $fetchUserList = $CONN->fetchAll("SELECT u.user_id, u.user_email, u.user_firstname, u.user_lastname, o.orgName, u.user_country, u.user_type, u.support_user, o.orgType, r.org_sub_type,
        r.Pro_ID FROM users u , organization o ,  pro_usr_rel r WHERE user_type != 'non_active' AND r.Pro_ID = :0 AND u.user_org = o.orgID AND
        u.user_id = r.Usr_ID AND (o.orgType = 'owner' OR o.orgType = 'DBC') ORDER By user_id", array($project_id));
    } else {
        $fetchUserList = $CONN->fetchAll("SELECT u.user_id, u.user_email, u.user_firstname, u.user_lastname, o.orgName, u.user_country, u.user_type, u.support_user, o.orgType FROM
        users u , organization o WHERE user_type != 'non_active' AND u.user_org = o.orgID ORDER By user_id", array());
    }

    return $response = $fetchUserList;
}

function adminProjectUser(){
    global $response;
    global $CONN;

    $pid = $_SESSION['project_id'];

    $selSql = "SELECT user_id, user_email, user_firstname, user_lastname, orgName, user_country FROM users u LEFT JOIN 
                pro_usr_rel p ON u.user_id = p.Usr_ID WHERE p.Pro_ID = :0 AND p.Pro_Role != 'non_Member' AND u.user_type != 'non_active' ORDER BY u.user_id";
    $userDetails = $CONN->fetchRow($selSql, array($pid));
    if (empty($userDetails)) {
        $response['bool'] = false;
        $response['msg'] = "User does not exist";
        return;
    }

    echo "<pre>";
    print_r ($selSql);
    echo "</pre>";

    die("dead");

    $response['data'] = $userDetails;
    return $response;
    
}

function adminUserTableRefresh (){
    global $response;
    global $CONN;
    global $SYSTEM;

    $pid = $_SESSION['project_id'];

    $checkSql = "SELECT parent_project_id_number FROM projects WHERE project_id_number = :0";
    $resultCheck = $CONN->fetchRow($checkSql, array($pid));
    $parent_project_id_number = $resultCheck["parent_project_id_number"];
    $otherSql = '';
    
    if ($parent_project_id_number){

        $userSql = "SELECT u.user_id, u.user_email, u.user_firstname, o.orgType , o.orgName FROM users u, organization o,  pro_usr_rel r WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'owner' AND r.Pro_ID = ".$CONN->quote($parent_project_id_number)." AND u.user_id = r.Usr_ID AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = ".$CONN->quote($pid)." AND Pro_Role!= 'non_Member') union
        (SELECT u.user_id, u.user_email, u.user_firstname , o.orgType , o.orgName  FROM users u, organization o , projects p WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'contractor' AND p.contractor_org_id = o.orgID and p.project_id_number = ".$CONN->quote($pid)." AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = ".$CONN->quote($pid)." AND Pro_Role!= 'non_Member'))union
        (SELECT u.user_id , u.user_email , u.user_firstname , o.orgType , o.orgName  FROM users u, organization o , projects p WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'consultant' AND p.consultant_org_id = o.orgID and p.project_id_number = ".$CONN->quote($pid)." AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = ".$CONN->quote($pid)." AND Pro_Role!= 'non_Member'))";

        $selectSQL = $CONN->fetchAll($userSql);
        
    }
    else{
        $userSql = "SELECT u.user_id, u.user_email, u.user_firstname , o.orgType , o.orgName  FROM users u, organization o  WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'owner' AND   u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = ".$CONN->quote($pid)." AND Pro_Role!= 'non_Member') union
        (SELECT u.user_id , u.user_email, u.user_firstname , o.orgType , o.orgName FROM users u, organization o , projects p WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'contractor' AND p.contractor_org_id = o.orgID and p.project_id_number = ".$CONN->quote($pid)." AND p.contractor_org_id != NULL AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = ".$CONN->quote($pid)." AND Pro_Role!= 'non_Member'))union
        (SELECT u.user_id , u.user_email , u.user_firstname, o.orgType , o.orgName  FROM users u, organization o , projects p WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'consultant' AND p.consultant_org_id = o.orgID and p.project_id_number = ".$CONN->quote($pid)." AND p.consultant_org_id != NULL AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = ".$CONN->quote($pid)." AND Pro_Role!= 'non_Member'))";
        $selectSQL = $CONN->fetchAll($userSql);
    }
    $otherSql = "SELECT u.user_id, u.user_email, u.user_firstname, p.Pro_Role, o.orgName, o.orgType FROM users u, pro_usr_rel p, organization o WHERE u.user_id = p.Usr_ID AND p.Pro_ID = :0 AND p.Pro_Role != 'non_Member' AND u.user_org = o.orgID  ORDER BY o.orgID, u.user_id";
    
    $detailsUser = $selectSQL;

    $nextsSelectSQL = $CONN->fetchAll($otherSql, array($pid));
    $detailsNextUser = $nextsSelectSQL;

    $response['users'] = $detailsUser;
    $response['projectUsers'] = $detailsNextUser;
}

function refreshDelUserTableBody (){
    global $response;
    global $CONN;

    $refSql = "SELECT u.user_id, u.user_email, u.user_firstname, u.user_lastname, o.orgName, u.user_country, u.user_type, u.support_user, o.orgType FROM users u , organization o WHERE user_type = 'non_active' AND u.user_org = o.orgID  ORDER By user_id";
    $refreshProject = $CONN->fetchAll($refSql);
    $response = $refreshProject;
    return $response;
}

function removeAssociateProjects($userids_array) {
    global $CONN;

    $response = false;
    $proUsers = [];
    $userids_str = implode(', ', $userids_array);

    if (isset($userids_array) && count($userids_array) > 0) {
        // to get only group by project id
        $getProjectSQL = "SELECT project_id, project_type
        FROM pro_usr_rel 
        INNER JOIN projects ON pro_usr_rel.Pro_ID = projects.project_id_number 
        INNER JOIN users ON users.user_id = pro_usr_rel.Usr_ID 
        WHERE pro_usr_rel.Usr_ID IN ($userids_str) AND projects.status = 'active' AND  pro_usr_rel.Pro_Role != 'non_Member'
        GROUP BY project_id, project_type
        ORDER BY project_id;";
        $getProjectSQL_results = $CONN->fetchAll($getProjectSQL);
        
        if (empty($getProjectSQL_results)) {
            return $response;
        } else {
            foreach ($getProjectSQL_results as $project) {
                $proUsers = [];
                $project_id = $project['project_id'];
                
                // get user email and user role by each project id
                $projectSQLbyUser = "SELECT project_id, Pro_Role, user_email, user_id, project_id_number
                FROM pro_usr_rel 
                INNER JOIN projects ON pro_usr_rel.Pro_ID = projects.project_id_number 
                INNER JOIN users ON users.user_id = pro_usr_rel.Usr_ID 
                WHERE pro_usr_rel.Usr_ID IN ($userids_str) AND projects.status = 'active' AND  pro_usr_rel.Pro_Role != 'non_Member' AND project_id = '$project_id' 
                ORDER BY project_id;";
                $projectSQLbyUser_result = $CONN->fetchAll($projectSQLbyUser);
                
                if (empty($projectSQLbyUser_result)) {
                    return $response;
                } else {
                    foreach ($projectSQLbyUser_result as $project_detail) {
                        array_push($proUsers, (object) [
                            'action' => "delete",
                            'userName' => $project_detail['user_email'],
                            'userRole' => $project_detail['Pro_Role'],
                        ]);
                    }
                }
    
                $jogetResponse = jogetUserProjectAssign($project['project_id'], $proUsers, $project['project_type']);
                $response_array = json_decode($jogetResponse, 1);

                foreach ($response_array['users'] as $value) {
                    if ($value['userStatus'] == true) {
                        $response = true;
                        $user_email = $value['userName'];
                        
                        // get user id based on user email from joget response
                        $userSQL = "SELECT user_id FROM users WHERE user_email = '$user_email'";
                        $project_id_number = $project_detail['project_id_number'];
                        
                        // delete project and users relation by using user id and project id number
                        $deletesql = "DELETE from pro_usr_rel WHERE Usr_ID = ($userSQL) AND Pro_ID = '$project_id_number'";
                        $deleted = $CONN->execute($deletesql);
                    } else {
                        $response = false;
                    }
                }
            }
        }
    } else {
        error_log('removeAssociateProjects:: user id(s) empty. Unable to remove project(s)');
        return $response;
    }
}