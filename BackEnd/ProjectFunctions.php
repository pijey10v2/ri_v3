<?php
//session_start(); //session started in joget.php
//if no session system admin then return

include_once '../login/include/_include.php';
include_once 'joget.php';
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
    case 'viewProject': //view_project.php
        viewProject();
        break;
    case 'createProject':
        createProject();
        break;
    case 'updateProject':
        updateProject();
        break;
    case 'archiveProject':
        archiveProject();
        break;
    case 'recoverProject':
        recoverProject();
        break;
    case 'deleteProject': //deleteprojectpermanent.php
        deleteProject();
        break;
    case 'readProjectDetails': //readprojectdetails.php
        readProjectDetails();
        break;
    case 'viewProjectUsers': //for project admin
        $project_id_number = $_SESSION['project_id'];
        $response['project_users'] = viewProjectUsers($project_id_number);
        break;
    case 'getOrgUsers':
        getOrgUsers();
        break;
    case 'validateProjectDetails':
        $pid = filter_input(INPUT_POST, 'project_id', FILTER_SANITIZE_STRING);
        $pname = filter_input(INPUT_POST, 'project_name', FILTER_SANITIZE_STRING);
        $pidnumber = filter_input(INPUT_POST, 'project_id_number', FILTER_VALIDATE_INT);
        $validation = validateProjectDetails($pid, $pname, $pidnumber);
        if (!empty($validation)) { //name or id exists
            $response['bool'] = false;
            $response['msg'] = $validation;
        } else {
            $response['bool'] = true;
            $response['msg'] = "Validated";
        }
        break;
    case 'projectAdminUpdateUsers':
        projectAdminUpdateUsers();
        break;
    case 'getParentProjectIDs' : 
        getParentProjectIDList();
        break;
    case 'updateProjDetails':
        $response = updateProjectDetails();
        break;
    case 'refreshDeletProjectTableBody':
        refreshDeletProjectTableBody();
        break;
    case 'refreshProjecTableBody':
        refreshProjTableBody();
        break;
    case 'getProjectPackages':
        getProjectPackages();
        break;
}

echo json_encode($response);

function viewProject()
{
    global $response;
    global $CONN;
    $project_id_number = filter_input(INPUT_POST, 'project_id_number', FILTER_VALIDATE_INT);
    if (!$project_id_number) {
        $response['bool'] = false;
        $response['msg'] = "Invalid parameter";
        return $response;
    }

    $fetchProject = $CONN->fetchRow("SELECT * FROM projects WHERE project_id_number = :0", array($project_id_number));
    $response['data'] = $fetchProject;

    $response['project_users'] = viewProjectUsers($project_id_number);

    if (!$response['data']['parent_project_id_number']) {
        $response['app_list'] = getAppLink($project_id_number);
    } else {
        $response['app_list'] = null;
    }
    return $response;
}

function viewProjectUsers($project_id_number)
{
    global $CONN;
    $allMember = $CONN->fetchAll("SELECT * FROM pro_usr_rel left join users on pro_usr_rel.Usr_ID = users.user_id
		WHERE Pro_ID = :0 AND Pro_Role != 'non_Member' AND users.user_type != 'non_active' ORDER BY users.user_id", array($project_id_number));
    // get child project for each member - can be optimised
    foreach ($allMember as $key => $member) {
        $othProj = $CONN->fetchCol("select CONCAT(project_id, ' - ', project_name) from pro_usr_rel join projects on project_id_number  = pro_id where Usr_ID =:0 and parent_project_id_number =:1", array($member['Usr_ID'], $project_id_number));
        $allMember[$key]['child_projects'] = $othProj;
        $projGrp = $CONN->fetchCol("Select project_group from pro_usr_grp_rel where project_id = :0 and user_id =:1", array($project_id_number, $member['Usr_ID']));
        $allMember[$key]['project_group'] = $projGrp;
    }
    return $allMember;
}

function getAppLink($project_id_number)
{
    global $CONN;
    return $CONN->fetchRow("SELECT * from project_apps_process WHERE project_id = :0", array($project_id_number));
}

function createProject()
{ //newproject.php
    //NOTE: if parent project, then dont send parent_project_id_number in!
    global $response;
    global $CONN;
    global $SYSTEM;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }

    $email = $_SESSION['email'];
    $projectDetails = array(
        "project_id" => filter_input(INPUT_POST, 'projectid', FILTER_SANITIZE_STRING),
        "project_name" => filter_input(INPUT_POST, 'projectname', FILTER_SANITIZE_STRING),
        "project_owner" => filter_input(INPUT_POST, 'projectowner', FILTER_SANITIZE_STRING),
        "project_wpc_id" => filter_input(INPUT_POST, 'projectwpcid', FILTER_SANITIZE_STRING),
        "project_type" => filter_input(INPUT_POST, 'projecttype', FILTER_SANITIZE_STRING),
        "region" => filter_input(INPUT_POST, 'region', FILTER_SANITIZE_STRING),
        "latitude_1" => filter_input(INPUT_POST, 'lat1', FILTER_VALIDATE_FLOAT),
        "latitude_2" => filter_input(INPUT_POST, 'lat2', FILTER_VALIDATE_FLOAT),
        "longitude_1" => filter_input(INPUT_POST, 'long1', FILTER_VALIDATE_FLOAT),
        "longitude_2" => filter_input(INPUT_POST, 'long2', FILTER_VALIDATE_FLOAT),
        "industry" => filter_input(INPUT_POST, 'industry', FILTER_SANITIZE_STRING),
        "time_zone_text" => filter_input(INPUT_POST, 'timezonetext', FILTER_SANITIZE_STRING),
        "time_zone_value" => filter_input(INPUT_POST, 'timezoneval', FILTER_VALIDATE_INT),
        "location" => filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING),
        "start_date" => filter_input(INPUT_POST, 'startdate', FILTER_SANITIZE_STRING),
        "end_date" => filter_input(INPUT_POST, 'enddate', FILTER_SANITIZE_STRING),
        "duration" => filter_input(INPUT_POST, 'duration', FILTER_VALIDATE_INT),
        "parent_project_id_number" => filter_input(INPUT_POST, 'parentid', FILTER_VALIDATE_INT),
        "contractor_org_id" => filter_input(INPUT_POST, 'contractorOrg', FILTER_SANITIZE_STRING),
        "consultant_org_id" => filter_input(INPUT_POST, 'consultantOrg', FILTER_SANITIZE_STRING),
    );

    //check if pid and pname val exist
    if (empty($projectDetails['project_id']) || empty($projectDetails['project_name'])) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient data";
        return;
    }

    $colsToInsert = array();
    $varsToInsert = array();
    $valsToInsert = array();
    foreach ($projectDetails as $key => $cl) {
        if ($cl !== false || $cl !== null) {
            $colsToInsert[] = $key;
            $varsToInsert[] = ":" . $key;
            $valsToInsert[$key] = $cl;
        }
    }

    //validate project name and idName for uniqueness
    $validation = validateProjectDetails($projectDetails['project_id'], $projectDetails['project_name'], null);
    if (!empty($validation)) { //name or id exists
        $response['bool'] = false;
        $response['msg'] = $validation;
        return;
    }

    $icon_url = 'Images/RI_Icon.png';

    $insertSQL = "INSERT INTO projects (" . implode(" ,", $colsToInsert) . ",created_by, created_time, status) VALUES (" . implode(" ,", $varsToInsert) . ", '$email', GETDATE(), 'active')";
    $ok = $CONN->execute($insertSQL, $valsToInsert);

    if (!$ok) {
        $response['bool'] = false;
        $response['msg'] = "Unable to insert project due to SQL error :" . $CONN->errorMsg;
        return;
    }
    $insertedPID = $CONN->getLastInsertID();

    //get contractee ID
    $contracteeName = filter_input(INPUT_POST, 'contractee', FILTER_SANITIZE_STRING);
    if (!$contracteeName) { //contractee = null
        $contracteeId = "";
    } else {
        $getSql = "SELECT orgID FROM organization WHERE orgName=:0";
        $getOrgId = $CONN->fetchOne($getSql, array($contracteeName));
        if (!empty($getOrgId)) {
            $contracteeId = $getOrgId;
        } else {
            $contracteeId = "";
        }
    }

    $myproject = array(
        'project_id_number' => $insertedPID,
        'project_id' => $projectDetails['project_id'],
        'project_name' => $projectDetails['project_name'],
        'contractee' => $contracteeId,
         'id' => $projectDetails['project_id']
    );

    //get parent Project ID
    if ($projectDetails['parent_project_id_number']){ // its a child project - get the parent project ID
        $getProSql = "SELECT project_id FROM projects WHERE project_id_number=:0";
        $getProjectID = $CONN->fetchOne($getProSql, array($projectDetails['parent_project_id_number']));
    }
    if (!empty($getProjectID)){
        $myproject['parent_project_id'] = $getProjectID;
    };
    if (!empty($projectDetails['contractor_org_id'])){
        $myproject['contractor'] = $projectDetails['contractor_org_id'];
    };
    if (!empty($projectDetails['consultant_org_id'])){
        $myproject['consultant'] = $projectDetails['consultant_org_id'];
    };
    if (!empty($projectDetails['start_date'])){
        $myproject['start_date'] = $projectDetails['start_date'];
    };
    if (!empty($projectDetails['end_date'])){
        $myproject['end_date'] = $projectDetails['end_date'];
    };
    if (!empty($projectDetails['project_owner'])){
        $myproject['project_owner'] = $projectDetails['project_owner'];
    };
    if (!empty($projectDetails['project_wpc_id'])){
        $myproject['wpc'] = $projectDetails['project_wpc_id'];
    };
    if (!empty($projectDetails['location'])){
        $myproject['location'] = $projectDetails['location'];
    };
    $myproject['package_uuid'] = $insertedPID."_".$projectDetails['project_id']. "_" .$insertedPID;
  
    $myresp = '';
    // add project to joget first and then to database
    $joget_result = jogetProjectRegistration($myproject, $projectDetails['project_type']);
    $myresp = json_decode($joget_result);
    $response['joget_project_update'] = $myresp;
    if ($myresp == "") { //project was not created in joget so ..exit
        //delete the project in database
        $deleteSQL = "DELETE from projects WHERE project_id_number  = :0";
        $deleted = $CONN->execute($deleteSQL, array($insertedPID));
        if (!$deleted) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error:" . $CONN->errorMsg;
            return;
        }
        $response['msg'] = "Unable to create project in Joget. Please check the joget connection!";
        $response['bool'] = "close";
        return;
    } else {
        
        if (isset($myresp->status) && $myresp->status != true) { //project was not created in joget so ..exit
            //delete the project in database
            $deleteSQL = "DELETE from projects WHERE project_id_number  = :0";
            $deleted = $CONN->execute($deleteSQL, array($insertedPID));
            if (!$deleted) {
                $response['bool'] = false;
                $response['msg'] = "SQL Error:" . $CONN->errorMsg;
                return;
            }
            $response['msg'] = "Unable to create project in Joget. Please check the joget connection!";
            $response['bool'] = "close";
            return;
        }
    }

    //create project folder & upload project icon if exist
    $dir = "../../Data/Projects/" . $insertedPID;
    if (!file_exists($dir)) {
        mkdir($dir);
        $response['Dir'] = "The directory $dir was successfully created.";
    } else {
        $response['Dir'] = "The directory $dir exists.";
    }

    if (isset($_FILES['imgInp']) && !empty($_FILES['imgInp']['name'])) {
        $file_name = $_FILES['imgInp']['name'];
        $file_tmp = $_FILES['imgInp']['tmp_name'];
        move_uploaded_file($file_tmp, "../../Data/Projects/" . $insertedPID . "/" . $file_name);
        $icon_url = "Data/Projects/" . $insertedPID . "/" . $file_name;

        $updSql = "UPDATE projects SET icon_url = :0 WHERE project_id_number = :1";
        $ok = $CONN->execute($updSql, array($icon_url, $insertedPID));

        if (!$ok) {
            $response['bool'] = false;
            $response['msg'] = "Project is created but icon isn't stored successfully due to SQL error :" . $CONN->errorMsg;
            return;
        }
    }

    if (!$projectDetails['parent_project_id_number']) { //is parent project
        $appLinks = ProjectAppParams($insertedPID);
        $colsToInsert = array();
        $varsToInsert = array();
        $valsToInsert = array();
        foreach ($appLinks as $key => $cl) {
            if ($cl !== false || $cl !== null) {
                $colsToInsert[] = $key;
                $varsToInsert[] = ":" . $key;
                $valsToInsert[$key] = $cl;
            }
        }
        // insert into processs table
        $insertSQL = "INSERT INTO project_apps_process (" . implode(" ,", $colsToInsert) . ") VALUES (" . implode(" ,", $varsToInsert) . ")";
        $ok = $CONN->execute($insertSQL, $valsToInsert);

        if (!$ok) {
            $response['bool'] = false;
            $response['msg'] = "Unable to attach project apps due to SQL error :" . $CONN->errorMsg;
            return;
        }
    }
    //attach users to this project
    $response['project'] = $myresp;
    $response['msg'] = "Project created";
    if($SYSTEM == 'KKR'){
        if(createGeoserverWorkspace($projectDetails['project_id']) !== 201){
            $response['geoserver_creation_failed'] = "Workspace creation failed";
        }
    }
    return ProjectUsersUpdate($projectDetails['project_id'], $insertedPID, "Create", $projectDetails['project_type']);
}

function updateProject()
{ //updateProject.php
    global $response;
    global $CONN;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }
    $email = $_SESSION['email'];
    $projectDetails = array(
        "pidnumber" => filter_input(INPUT_POST, 'projectidnumber', FILTER_VALIDATE_INT),
        "project_name" => filter_input(INPUT_POST, 'projectname', FILTER_SANITIZE_STRING),
        "latitude_1" => filter_input(INPUT_POST, 'lat1', FILTER_VALIDATE_FLOAT),
        "latitude_2" => filter_input(INPUT_POST, 'lat2', FILTER_VALIDATE_FLOAT),
        "longitude_1" => filter_input(INPUT_POST, 'long1', FILTER_VALIDATE_FLOAT),
        "longitude_2" => filter_input(INPUT_POST, 'long2', FILTER_VALIDATE_FLOAT),
        "industry" => filter_input(INPUT_POST, 'industry', FILTER_SANITIZE_STRING),
        "time_zone_text" => filter_input(INPUT_POST, 'timezonetext', FILTER_SANITIZE_STRING),
        "time_zone_value" => filter_input(INPUT_POST, 'timezoneval', FILTER_VALIDATE_INT),
        "location" => filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING),
        "start_date" => filter_input(INPUT_POST, 'startdate', FILTER_SANITIZE_STRING),
        "end_date" => filter_input(INPUT_POST, 'enddate', FILTER_SANITIZE_STRING),
        "duration" => filter_input(INPUT_POST, 'duration', FILTER_VALIDATE_INT),
        "parent_project_id_number" => filter_input(INPUT_POST, 'parentid', FILTER_VALIDATE_INT),
        "contractor_org_id" => filter_input(INPUT_POST, 'contractorOrg', FILTER_SANITIZE_STRING),
        "consultant_org_id" => filter_input(INPUT_POST, 'consultantOrg', FILTER_SANITIZE_STRING),
        "region" => filter_input(INPUT_POST, 'region', FILTER_SANITIZE_STRING)
    );

    $checkSql = "SELECT project_id, project_type FROM projects WHERE project_id_number=:0";
    $projectExists = $CONN->fetchRow($checkSql, array($projectDetails['pidnumber']));
    if (empty($projectExists)) {
        $response['bool'] = false;
        $response['msg'] = "Project does not exist";
        return;
    }
    $project_id_name = $projectExists['project_id'];
    $project_type = $projectExists['project_type'];
    //validate project name and idName for uniqueness
    $validation = validateProjectDetails(null, $projectDetails['project_name'], $projectDetails['pidnumber']);
    if (!empty($validation)) { //name or id exists
        $response['bool'] = false;
        $response['msg'] = $validation;
        return;
    }

    $colsToUpdArr = array();
    $valsToUpdArr = array();
    foreach ($projectDetails as $key => $cl) {
        if ($key !== "project_id" && $key !== "pidnumber") {
            if ($cl !== false || $cl !== null) {
                $colsToUpdArr[] = $key . ' = :' . $key;
                $valsToUpdArr[$key] = $cl;
            }
        }
    }
    //upload image here
    if (isset($_FILES['imgInp']) && !empty($_FILES['imgInp']['name'])) {
        $file_name = $_FILES['imgInp']['name'];
        $file_tmp = $_FILES['imgInp']['tmp_name'];
        if (!file_exists("../../Data/Projects/" . $projectDetails['pidnumber'] . "/")) {
            mkdir("../../Data/Projects/" . $projectDetails['pidnumber'] . "/", 0777, true);
        }
        move_uploaded_file($file_tmp, "../../Data/Projects/" . $projectDetails['pidnumber'] . "/" . $file_name);
        $icon_url = "Data/Projects/" . $projectDetails['pidnumber'] . "/" . $file_name;
        $colsToUpdArr[] = 'icon_url = :icon_url';
        $valsToUpdArr['icon_url'] = $icon_url;
    }
    //get contractee ID
    $contracteeName = filter_input(INPUT_POST, 'contractee', FILTER_SANITIZE_STRING);
    if (!$contracteeName) { //contractee = null
        $contracteeId = "";
    }
    $getSql = "SELECT orgID FROM organization WHERE orgName=:0";
    $getOrgId = $CONN->fetchOne($getSql, array($contracteeName));
    if (!empty($getOrgId)) {
        $contracteeId = $getOrgId;
    }

    $myproject = array(
        'project_id_number' => $projectDetails['pidnumber'],
        'project_id' => $project_id_name,
        'project_name' => $projectDetails['project_name'],
        'contractee' => $contracteeId,
         'id' => $project_id_name
    );

    // no need to update parent project id right? cannot be changed anyways once project is created .
    // //get parent Project ID
    // if ($projectDetails['parent_project_id_number']){ // its a child project - get the parent project ID
    //     $getProSql = "SELECT project_id FROM projects WHERE project_id_number=:0";
    //     $getProjectID = $CONN->fetchOne($getProSql, array($projectDetails['parent_project_id_number']));
    // }
    // if (!empty($getProjectID)){
    //     $myproject['parent_project_id'] = $getProjectID;
    // };
    if (!empty($projectDetails['contractor_org_id'])){
        $myproject['contractor'] = $projectDetails['contractor_org_id'];
    };
    if (!empty($projectDetails['consultant_org_id'])){
        $myproject['consultant'] = $projectDetails['consultant_org_id'];
    };
    if (!empty($projectDetails['start_date'])){
        $myproject['start_date'] = $projectDetails['start_date'];
    };
    if (!empty($projectDetails['end_date'])){
        $myproject['end_date'] = $projectDetails['end_date'];
    };
    if (!empty($projectDetails['location'])){
        $myproject['location'] = $projectDetails['location'];
    };

    // update the project details to joget first
    $joget_result = jogetProjectRegistration($myproject, $project_type);
    $myresp = json_decode($joget_result);
    $response['joget_project_update'] = $myresp;
    if ($myresp == "") { //project was not updated in joget ..      so return
        $response['msg'] = "Unable to update project details  in Joget. Please check the joget connection!";
        $response['bool'] = "close";
        return;
    } else {
        if ($myresp->status && $myresp->status != true) { //project was not updated in joget .. so
            $response['msg'] = "Unable to update project details  in Joget. Please check the joget connection!";
            $response['bool'] = "close";
            return;
        }
    }
    $valsToUpdArr['updatedBy'] = $email;
    $valsToUpdArr['pidnumber'] = $projectDetails['pidnumber'];
  
    $updSql = "UPDATE projects SET " . implode(" ,", $colsToUpdArr) . " ,updated_by = :updatedBy, last_update = GETDATE() WHERE project_id_number =:pidnumber";

    $ok = $CONN->execute($updSql, $valsToUpdArr);

    if (!$ok) {
        $response['bool'] = false;
        $response['msg'] = "Unable to update project due to SQL error :" . $CONN->errorMsg;
        return $response;
    }

    if (!$projectDetails['parent_project_id_number']) { //is parent project
        $colsToUpsert = array();
        $varsToUpsert = array();
        $valsToUpsert = array();
        $appLinks = ProjectAppParams($projectDetails['pidnumber']);

        $checkSql = "SELECT * FROM project_apps_process WHERE project_id=:0";
        $checkRecord = $CONN->fetchOne($checkSql, array($projectDetails['pidnumber']));
        if (!empty($checkRecord)) { //UPDATE apps processes
            foreach ($appLinks as $key => $cl) {
                if ($key !== "project_id") {
                    $colsToUpsert[] = $key . ' = :' . $key;
                    $valsToUpsert[$key] = $cl;
                }
            }
            $valsToUpsert['project_id'] = $appLinks['project_id'];
            $appSql = "UPDATE project_apps_process SET " . implode(" ,", $colsToUpsert) . " WHERE project_id=:project_id";
        } else { //INSERT apps processes
            foreach ($appLinks as $key => $cl) {
                if ($cl !== false || $cl !== null) {
                    $colsToUpsert[] = $key;
                    $varsToUpsert[] = ":" . $key;
                    $valsToUpsert[$key] = $cl;
                }
            }
            //add in project id
            $appSql = "INSERT INTO project_apps_process (" . implode(" ,", $colsToUpsert) . ") VALUES (" . implode(" ,", $varsToUpsert) . ")";
        }

        $ok = $CONN->execute($appSql, $valsToUpsert);

        if (!$ok) {
            $response['bool'] = false;
            $response['msg'] = "Unable to attach project apps due to SQL error :" . $CONN->errorMsg;
            return;
        }
        //update industry & timezone values for all child projects
        $checkChildSql = "SELECT project_id_number FROM projects WHERE parent_project_id_number =:0";
        $checkChildRecords = $CONN->fetchAll($checkChildSql, array($projectDetails['pidnumber']));
        if (!empty($checkChildRecords)) { //UPDATE the timezone and industry values to the child projects
            $pidNums = [];
            foreach ($projectDetails as $key => $cl) {
                if ($key == "industry" || $key == "time_zone_text" || $key == "time_zone_value") {
                    if ($cl !== false || $cl !== null) {
                        $pkgColsToUpdArr[] = $key . ' = :' . $key;
                        $pkgValsToUpdArr[$key] = $cl;
                    }
                }
            }
            foreach ($checkChildRecords as $key => $pid) {
                $pkgValsToUpdArr['pidnumber'] = $pid['project_id_number'];
                $updateSql = "UPDATE projects SET " . implode(" ,", $pkgColsToUpdArr) . ", last_update = GETDATE() WHERE project_id_number =:pidnumber";
                $ok = $CONN->execute($updateSql, $pkgValsToUpdArr);
                if (!$ok) {
                    array_push($pidNums, $pkgValsToUpdArr['pidnumber']);
                }
            }
            if ($pidNums) {
                $response['packagesNotUpdated'] = $pidNums;
            } else {
                $response['packagesUpdated'] = $checkChildRecords;
            }

        }
    }
    //attach users to this project
    $response['project'] = $myresp;
    $response['msg'] = "Project updated";
    return ProjectUsersUpdate($project_id_name, $projectDetails['pidnumber'], "Update", $project_type);
}

function projectAdminUpdateUsers()
{
    global $response;
    global $CONN;
    if (!$_SESSION['project_role'] == "Project Manager"  ||  !$_SESSION['project_role'] == "Project Monitor" ) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }

    $pidnumber = $_SESSION['project_id'];
    $pid = $_SESSION['projectID'];
    $ptype = $_SESSION['Project_type'];
    return ProjectUsersUpdate($pid, $pidnumber, "Update", $ptype );
}

function archiveProject()
{ //deleteproject.php
    global $response;
    global $CONN;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }
    $projectidnumber = json_decode($_POST['project_id_number']);
    foreach ($projectidnumber as $pid) {
        if (!filter_var($pid, FILTER_VALIDATE_INT)) {
            $response['bool'] = false;
            $response['msg'] = "Invalid parameter";
            return;
        }
    }

    $idsStr = implode(', ', $projectidnumber);

    // archive projects in joget first ..need project_id info to archive from joget
    $updatedProjects = [];
    $jogetresult = [];
    $unUpdatedProjects = [];
    $updatedProjectIDs = [];
    $fetchedProjectIds = $CONN->fetchAll("SELECT project_id, project_id_number, project_type FROM projects WHERE project_id_number IN ($idsStr)");
    $operation = "archive";
    foreach ($fetchedProjectIds as $key => $pid) {
        $jogetresult[$key] = jogetProjectCleanUpService($operation, $pid['project_id'], $pid['project_type']);
        $joget_response = json_decode($jogetresult[$key]);
        if ($joget_response->message == "Cleanup Completed") {
            array_push($updatedProjects, $pid['project_id_number']);
            array_push($updatedProjectIDs, $pid['project_id']);
        } else {
            array_push($unUpdatedProjects, $pid['project_id']);
        }
    }

    if ($updatedProjects) {
        $pidStr = implode(', ', $updatedProjects);

        $updSql = "UPDATE projects SET status='archive', updated_by =:0, last_update = GETDATE() WHERE
			 			project_id_number IN ($pidStr)";
        $updated = $CONN->execute($updSql, array($_SESSION['email']));
        if (!$updated) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error:" . $CONN->errorMsg;
            return $response;
        }
    }
    if ($unUpdatedProjects) {
        $message = "";
        if ($updatedProjects) {
            $message = "Some project/projects were archived successfully.<br>";
            $message = $message . implode(', ', $updatedProjectIDs) . "<br> <br>";
        }
        $message = $message . "The following projects were not able to be archived as they have running processes. <br>";
        $message = $message . implode(',', $unUpdatedProjects);
        $response['bool'] = true;
        $response['msg'] = $message;
        $response['upprojects'] = $updatedProjects;
        $response['unprojects'] = $unUpdatedProjects;
        $response['joget'] = $jogetresult;
        return $response;

    }

    $response['bool'] = true;
    $response['msg'] = "Project/Projects successfully deactivated";
    $response['projects'] = $updatedProjects;
    $response['joget'] = $jogetresult;
    return $response;
}

function recoverProject()
{ //recoverproject.php
    global $response;
    global $CONN;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }
    $projectidnumber = json_decode($_POST['project_id_number']);
    foreach ($projectidnumber as $pid) {
        if (!filter_var($pid, FILTER_VALIDATE_INT)) {
            $response['bool'] = false;
            $response['msg'] = "Invalid parameter";
            return;
        }
    }

    $idsStr = implode(', ', $projectidnumber);

    // restore projects in joget first..need project_id info to restore from joget
    $joget_result = [];
    $updatedProjects = [];
    $unUpdatedProjects = [];
    $fetchedProjectIds = $CONN->fetchAll("SELECT project_id, project_id_number, project_type FROM projects WHERE project_id_number IN ($idsStr)");

    foreach ($fetchedProjectIds as $key => $pid) {
        $joget_result[$key] = jogetProjectCleanUpService("restore", $pid['project_id'], $pid['project_type']);
        $joget_response = json_decode($joget_result[$key]);
        if ($joget_response->message == "Cleanup Completed") {
            array_push($updatedProjects, $pid['project_id_number']);
        } else {
            array_push($unUpdatedProjects, $pid['project_id']);
        }
    }
    if ($updatedProjects) {
        $pidStr = implode(', ', $updatedProjects);
        //update parent projects first
        $parentUpdSQL = "UPDATE projects SET status='active', updated_by =:0, last_update = GETDATE() WHERE
			project_id_number IN ($pidStr) AND  parent_project_id_number IS NULL";
        $parentUpdated = $CONN->execute($parentUpdSQL, array($_SESSION['email']));
        $parent_projects = $CONN->lastRowCount();
        if (!$parentUpdated) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error:" . $CONN->errorMsg;
            return $response;
        }

        $childUpdSQL = "UPDATE projects SET status='active', updated_by =:0, last_update = GETDATE() WHERE
					project_id_number IN ($pidStr) AND parent_project_id_number IN (SELECT project_id_number
					FROM projects WHERE STATUS = 'active')";
        $childUpdated = $CONN->execute($childUpdSQL, array($_SESSION['email']));
        $package_projects = $CONN->lastRowCount();

        $response['joget'] = $joget_result;
        $response['projects'] = $updatedProjects;
        $response['unprojects'] = $unUpdatedProjects;
        if (!$childUpdated) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error:" . $CONN->errorMsg;
            return;
        } else if ($parent_projects + $package_projects != sizeof($projectidnumber)) {
            $response['count'] = $package_projects;
            $response['bool'] = true;
            $response['message'] = "Some package projects have not been recovered as the parent project is archived or deleted or it has not been updated in joget system.";
        } else {
            $response['bool'] = true;
            $response['message'] = "Project successfully recovered.";
        }
        return $response;
    }
    $message = "Unable to recover some projects. <br>";
    $message = $message . implode(', ', $unUpdatedProjects);
    $response['joget'] = $joget_result;
    $response['projects'] = $updatedProjects;
    $response['unprojects'] = $unUpdatedProjects;
    $response['bool'] = true;
    $response['message'] = $message;

}

function deleteProject()
{
    global $response;
    global $CONN;
    global $SYSTEM;

    if (!$_SESSION['isSysadmin']) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    }
    $projectidnumber = json_decode($_POST['project_id_number']);
    foreach ($projectidnumber as $pid) {
        if (!filter_var($pid, FILTER_VALIDATE_INT)) {
            $response['bool'] = false;
            $response['msg'] = "Invalid parameter";
            return;
        }
    }

    $idsStr = implode(', ', $projectidnumber);

    //fetch the project_ids to delete projects from joget.. need project_id info to delete from joget
    $joget_result = [];
    $deletedProjects = [];
    $unDeletedProjects = [];
    $geoServerProjects =[];
    $fetchedProjectIds = $CONN->fetchAll("SELECT project_id, project_id_number, project_type FROM projects WHERE project_id_number IN ($idsStr)");

    foreach ($fetchedProjectIds as $key => $pid) {
        $joget_result[$key] = jogetProjectCleanUpService("delete", $pid['project_id'], $pid['project_type']);
        $joget_response = json_decode($joget_result[$key]);
        if ($joget_response->message == "Cleanup Completed") {
            array_push($deletedProjects, $pid['project_id_number']);
        } else {
            array_push($unDeletedProjects, $pid['project_id']);
        }

        if($SYSTEM == 'KKR'){
            $geoserver_response = deleteGeoserverWorkspace($pid['project_id']);
            if($geoserver_response !== 200 ){
                array_push($geoServerProjects , $pid['project_id']);
            }
        }
    }

    if($SYSTEM == 'KKR'){
        $response['geoserver_delete_failed'] =$geoServerProjects;
    }
    if ($deletedProjects) {
        $pidStr = implode(', ', $deletedProjects);
        //delete project and associated records in other tables as defined in db rules
        $deleteSQL = "DELETE from projects WHERE project_id_number IN ($pidStr)";
        $deleted = $CONN->execute($deleteSQL);
        if (!$deleted) {
            $response['bool'] = false;
            $response['msg'] = "SQL Error:" . $CONN->errorMsg;
            return $response;
        }

        //remove files on server
        foreach ($deletedProjects as $pid) {
            $dir = "../../Data/Projects/" . $pid;
            if (is_dir($dir)) {
                $objects = scandir($dir);
                // remove the content
                foreach ($objects as $object) {
                    if ($object != "." && $object != "..") {
                        if (filetype($dir . "/" . $object) == "dir") {
                            rmdir($dir . "/" . $object); //remove subfolders
                        } else {
                            unlink($dir . "/" . $object); //remove files
                        }
                    }
                }
                //remove the folder
                if (filetype($dir) == "dir") {
                    rmdir($dir);
                }
            }
        }
        $message = "Project/projects successfully deleted from database <br>";
        if ($unDeletedProjects) {
            $message = $message . "But unable to delete some projects as they have running process. <br>";
            $message = $message . implode(', ', $unDeletedProjects);
        }

        $response['message'] = $message;
        $response['joget'] = $joget_result;
        $response['projects'] = $fetchedProjectIds;
        $response['deletedProjects'] = $deletedProjects;
        return;
    }
    $message = "Unable to delete some projects as they have running process. <br>";
    $message = $message . implode(', ', $unDeletedProjects);
    $response['message'] = $message;
    $response['joget'] = $joget_result;
    $response['projects'] = $fetchedProjectIds;
    $response['deletedProjects'] = $deletedProjects;
}

function validateProjectDetails($pIdName, $pName, $pidnumber)
{ //to validate if project name & idName already exists
    global $CONN;
    $return = array();
    if ($pIdName != null) {
        $checkNameSql = "SELECT * FROM projects WHERE project_id=:0";
        $projectNameExists = $CONN->fetchOne($checkNameSql, array($pIdName));
        if (!empty($projectNameExists)) {
            $return['pIdName'] = "Project ID exists. Please change the details to proceed.";
        }
    }
    if ($pName != null) {
        $checkNameSql = "SELECT * FROM projects WHERE project_name=:0 AND project_id_number!=:1";
        $projectNameExists = $CONN->fetchOne($checkNameSql, array($pName, $pidnumber));
        if (!empty($projectNameExists)) {
            $return['pName'] = "Project name exists. Please change the details to proceed.";
        }
    }
    return $return;
}

function getAssociatedProjects()
{ //projectSiblings.php
    global $response;
    global $CONN;

    $project_id_number = filter_input(INPUT_POST, 'project_id_number', FILTER_VALIDATE_INT);

    if (!$project_id_number) {
        $response['bool'] = false;
        $response['msg'] = "Invalid parameter";
        return;
    }

    $getSql = "SELECT parent_project_id_number FROM projects WHERE project_id_number=:0";
    $parentId = $CONN->fetchOne($getSql, array($project_id_number));
    if (empty($parentId)) {
        $response['bool'] = false;
        $response['msg'] = "Project does not exist";
        return;
    }

    $data = [];
    if ($parentId == null) { //overall project - get the children
        $response['data'] = $CONN->fetchAll("SELECT project_id_number FROM projects WHERE parent_project_id_number =:0", array($parentId));
        return $response;
    } else { //package project.. need to get parent and siblings
        $response['data'] = $CONN->fetchAll("SELECT project_id_number FROM projects WHERE parent_project_id_number = :0 ", array($parentID), "SELECT project_id_number FROM projects WHERE project_id_number = :0 ", array($parentId));
        return $response;
    }
}

function assignUserToProject($proId, $userId, $userEmail, $userRole)
{
    global $CONN;
    $return = array();
    $insertSQL = "INSERT INTO pro_usr_rel (Pro_ID, Usr_ID, Pro_Role, added_by, added_time) VALUES (:0, :1, :2, :3, GETDATE())";
    $ok = $CONN->execute($insertSQL, array($proId, $userId, $userRole, $_SESSION['email']));

    if (!$ok) {
        return false;
    }

    return true;

}

function unAssignUserToProject($proId, $userId, $userEmail, $userRole)
{
    global $CONN;
    $return = array();
    $deleteSQL = "DELETE from pro_usr_rel WHERE Pro_ID = :0 AND Usr_ID = :1";
    $ok = $CONN->execute($deleteSQL, array($proId, $userId));

    if (!$ok) {
        return false;
    }

    return true;

}

function assignUserToProjectGroup($proId, $userId, $userEmail, $userGroup)
{
    global $CONN;
    $return = array();
    $insertSQL = "INSERT INTO pro_usr_grp_rel (project_id, user_id, project_group, added_by, added_time) VALUES (:0, :1, :2, :3, GETDATE())";
    $ok = $CONN->execute($insertSQL, array($proId, $userId, $userGroup, $_SESSION['email']));

    if (!$ok) {
        return false;
    }

    return true;

}

function unAssignUserToProjectGroup($proId, $userId, $userEmail, $userGroup)
{
    global $CONN;
    $return = array();
    $deleteSQL = "DELETE from pro_usr_grp_rel WHERE project_id = :0 AND user_id = :1 AND project_group =:2";
    $ok = $CONN->execute($deleteSQL, array($proId, $userId, $userGroup));

    if (!$ok) {
        return false;
    }

    return true;

}

function ProjectUsersUpdate($project_id, $pidnumber, $functionType, $projectType)
{
    global $response;
    global $CONN;

    $users = json_decode($_POST['users']);
    
    $idEmails = [];
    $proUsers = [];

    //check validity of data
    foreach ($users as $user) {
        if (!filter_var($user->user_id, FILTER_VALIDATE_INT)) {
            $response['bool'] = false;
            $response['msg'] = "Invalid user parameter";
            array_push($idEmails, $user->user_email);
            return $response;
            continue;
        }
        if (!filter_var($user->user_role, FILTER_SANITIZE_STRING)) {
            $response['bool'] = false;
            $response['msg'] = "Please ensure role for each user is assigned.";
            array_push($idEmails, $user->user_email);
            return $response;
            continue;
        }
        if (!filter_var($user->user_email, FILTER_VALIDATE_EMAIL)) {
            $response['bool'] = false;
            $response['msg'] = "Invalid user parameter1";
            array_push($idEmails, $user->user_email);
            return $response;
            continue;
        }
        $userId = $user->user_id;
        $userRole = $user->user_role;
        $userEmail = $user->user_email;

        if ($functionType === "Create") {
            $attachUser = assignUserToProject($pidnumber, $userId, $userEmail, $userRole);
            if (isset($attachUser)) {
                if ($attachUser == false) {
                    array_push($idEmails, $user->user_email);
                    continue;
                } else {
                    array_push($proUsers, (object) [
                        'action' => "create",
                        'userName' => $userEmail,
                        'userRole' => $userRole,
                    ]);
                }
            }
        } else {
            //check if user already existed

            if (!filter_var($user->user_old_role, FILTER_SANITIZE_STRING)) {
                $response['bool'] = false;
                $response['msg'] = "Invalid user parameter2";
                array_push($idEmails, $user->user_email);
                return $response;
                continue;
            }
            $user_old_role = $user->user_old_role;

            if ($user_old_role != "noOldRole") { //then need to remove from database
                $detachUser = unAssignUserToProject($pidnumber, $userId, $userEmail, $user_old_role);
                if (isset($detachUser)) {
                    if ($detachUser == false) {
                        array_push($idEmails, (object) [
                            'user' => $userEmail,
                            'msg' => "Unable to update database",
                        ]);
                        continue;
                    } else {
                        array_push($proUsers, (object) [
                            'action' => "delete",
                            'userName' => $userEmail,
                            'userRole' => $user_old_role,
                        ]);
                    }
                }
            }
            if ($userRole!= "noRole"){
                $attachUser = assignUserToProject($pidnumber, $userId, $userEmail, $userRole);
                if (isset($attachUser)) {
                    if ($attachUser == false) {
                        array_push($idEmails, (object) [
                            'user' => $userEmail,
                            'msg' => "Unable to update database",
                        ]);
                        continue;
                    } else {
                        array_push($proUsers, (object) [
                            'action' => "create",
                            'userName' => $userEmail,
                            'userRole' => $userRole,
                        ]);
                    }
                }
            }
        }
    }
    if(isset($_POST['userGroup'])){ 
        $groupUsers = json_decode($_POST['userGroup']);
        //check validity of data for group users( MA Committe - tech committe etc)
        foreach ($groupUsers as $groupuser) {
            if (!filter_var($groupuser->user_id, FILTER_VALIDATE_INT)) {
                $response['bool'] = false;
                $response['msg'] = "Invalid user parameter";
                array_push($idEmails, $ugroupuserser->user_email);
                return $response;
                continue;
            }
            if (!filter_var($groupuser->user_group, FILTER_SANITIZE_STRING)) {
                $response['bool'] = false;
                $response['msg'] = "Please ensure role for each user is assigned.";
                array_push($idEmails, $groupuser->user_email);
                return $response;
                continue;
            }
            if (!filter_var($groupuser->user_email, FILTER_VALIDATE_EMAIL)) {
                $response['bool'] = false;
                $response['msg'] = "Invalid user parameter1";
                array_push($idEmails, $usgroupuserer->user_email);
                return $response;
                continue;
            }
        
            $groupUserId = $groupuser->user_id;
            $groupRole = $groupuser->user_group;
            $groupUserEmail = $groupuser->user_email;
        

            if ($functionType === "Create") {
                $newGroupRoles = explode(",", $groupRole);
                foreach($newGroupRoles as $newgroup){
                    $attachUser = assignUserToProjectGroup($pidnumber, $groupUserId, $groupUserEmail, $newgroup);
                    if (isset($attachUser)) {
                        if ($attachUser == false) {
                            array_push($idEmails, $groupuser->user_email);
                            continue;
                        } else {
                            array_push($proUsers, (object) [
                                'action' => "create",
                                'userName' => $groupUserEmail,
                                'userRole' => $newgroup,
                            ]);
                        }
                    }
                }
        
            } else { //update project

                if (!filter_var($groupuser->user_old_group, FILTER_SANITIZE_STRING)) {
                    $response['bool'] = false;
                    $response['msg'] = "Invalid user parameter2";
                    array_push($idEmails, $groupuser->user_email);
                    return $response;
                    continue;
                }
                $userOldGroup = $groupuser->user_old_group;
                if ($userOldGroup != "noOldGroup") { //then need to remove from database
                    $oldGroupRoles = explode(",",$userOldGroup );
                    foreach ($oldGroupRoles as $oldgroup) {
                        $detachUser = unAssignUserToProjectGroup($pidnumber, $groupUserId, $groupUserEmail, $oldgroup);
                        if (isset($detachUser)) {
                            if ($detachUser == false) {
                                array_push($idEmails, (object) [
                                    'user' => $groupUserEmail,
                                    'msg' => "Unable to update database",
                                ]);
                                continue;
                            } else {
                                array_push($proUsers, (object) [
                                    'action' => "delete",
                                    'userName' => $groupUserEmail,
                                    'userRole' => $oldgroup,
                                ]);
                            }
                        }
                    } 
                }
                if ($groupRole != "noGroup") { //    create the new group roles
                    $newGroupRoles = explode(",", $groupRole);
                    foreach($newGroupRoles as $newgroup){
                        $attachUser = assignUserToProjectGroup($pidnumber, $groupUserId, $groupUserEmail, $newgroup);
                        if (isset($attachUser)) {
                            if ($attachUser == false) {
                                array_push($idEmails, $groupuser->user_email);
                                continue;
                            } else {
                                array_push($proUsers, (object) [
                                    'action' => "create",
                                    'userName' => $groupUserEmail,
                                    'userRole' => $newgroup,
                                ]);
                            }
                        }
                    }
                }
            }
        }
    }
    if ($proUsers) { //check if we got records to add
        $jog_pro_usr_result = jogetUserProjectAssign($project_id, $proUsers, $projectType);
        $usersUpdated = json_decode($jog_pro_usr_result); // check for ""
        $groupRoles = array("MA Committee", "Technical Reviewer");
        if ($usersUpdated == "") { //all users have not been updated in joget .. so need to remove it from db
            foreach ($proUsers as $user) {
                $user_email = $user->userName;
                $getSql = "SELECT user_id from users WHERE user_email = :0";
                $getUserID = $CONN->fetchOne($getSql, array($user_email));
                if ($user->action == "create") {
                    if (in_array($user->userRole, $groupRoles)){
                        $detachUser = unAssignUserToProjectGroup($pidnumber, $getUserID, $user_email, $user->userRole);
                    }else{
                        $detachUser = unAssignUserToProject($pidnumber, $getUserID, $user_email, $user->userRole);
                    }
                } else if ($user->action == "delete") {
                    if (in_array($user->userRole, $groupRoles)){
                        $attachUser = assignUserToProjectGroup($pidnumber, $getUserID, $user_email, $user->userRole);
                    }else{   
                        $attachUser = assignUserToProject($pidnumber, $getUserID, $user_email, $user->userRole);
                    }
                }
                array_push($idEmails, (object) [
                    'user' => $user_email,
                    'msg' => "Unable to update joget",
                ]);
            }
        } else {
            $usersUpdated = $usersUpdated->users;
            foreach ($usersUpdated as $user) {
                if ($user->message != "User Updated") { //user role has not been updated in joget
                    $user_email = $user->userName;
                    $getSql = "SELECT user_id from users WHERE user_email = :0";
                    $getUserID = $CONN->fetchOne($getSql, array($user_email));
                    $key = array_search($user_email, array_column($proUsers, 'userName'));
                    if ($proUsers[$key]->action == "create") {
                        if (in_array($proUsers[$key]->userRole, $groupRoles)){
                            $detachUser = unAssignUserToProjectGroup($pidnumber, $getUserID, $user_email, $proUsers[$key]->userRole);
                        }else{
                            $detachUser = unAssignUserToProject($pidnumber, $getUserID, $user_email, $user->userRole);
                        }
                    } else if ($proUsers[$key]->action == "delete") {
                        if (in_array($proUsers[$key]->userRole, $groupRoles)){
                            $attachUser = assignUserToProjectGroup($pidnumber, $getUserID, $user_email, $proUsers[$key]->userRole);
                        }else{
                            $attachUser = assignUserToProject($pidnumber, $getUserID, $user_email, $proUsers[$key]->userRole);
                        }
                    }
                    array_push($idEmails, (object) [
                        'user' => $user_email,
                        'msg' => $user->message,
                    ]);
                }
            }
        }

    }
    if (!$idEmails) {
        $response['bool'] = true;
        $response['usrs_msg'] = "Users updated";
        $response['data'] = "close";
        $response['payload'] = $proUsers;
        if ($proUsers) { //check if we have added records to joget
            $response['users'] = $jog_pro_usr_result;
        }
    } else {
        $msg = "Unable to attach/detach some users to/from the project.";
        foreach ($idEmails as $user) {
            $msg = $msg . " " . $user->user . ":-" . $user->msg;
        }
        $response['bool'] = false;
        $response['msg'] = $msg;
        $response['data'] = "close";
        $response['idEmails'] = $idEmails;
        $response['users'] = $usersUpdated;
        $response['id'] = $getUserID;
    }
    return $response;
}

function getOrgUsers()
{
    global $response;
    global $CONN;
    $orgID = filter_input(INPUT_POST, 'orgID', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);

    if (!$orgID) {
        $response['bool'] = false;
        $response['msg'] = "Invalid parameter";
        echo json_encode($response);
        exit();
    }

    $tempArr = [];
    foreach($orgID as $key => $orgId){
        $fetchUsers = $CONN->fetchAll("SELECT * FROM users INNER JOIN organization ON users.user_org = organization.orgID WHERE user_org = :0 AND user_type != 'non_active'", array($orgId));
        $tempArr = array_merge($tempArr, $fetchUsers);
 
    }
    $response['org_users'] = $tempArr;
    return;
}

function ProjectAppParams($pidnumber)
{
    $appLinks = array(
        'project_id' => $pidnumber,
        'constructPackage_name' => filter_input(INPUT_POST, 'constructPackage_name', FILTER_SANITIZE_STRING),
        'app_NOI' => filter_input(INPUT_POST, 'app_NOI', FILTER_SANITIZE_STRING),
        'app_NCR' => filter_input(INPUT_POST, 'app_NCR', FILTER_SANITIZE_STRING),
        'app_WIR' => filter_input(INPUT_POST, 'app_WIR', FILTER_SANITIZE_STRING),
        'app_MOS' => filter_input(INPUT_POST, 'app_MOS', FILTER_SANITIZE_STRING),
        'app_MS' => filter_input(INPUT_POST, 'app_MS', FILTER_SANITIZE_STRING),
        'app_SD' => filter_input(INPUT_POST, 'app_SD', FILTER_SANITIZE_STRING),
        'app_IR' => filter_input(INPUT_POST, 'app_IR', FILTER_SANITIZE_STRING),
        'app_SDL' => filter_input(INPUT_POST, 'app_SDL', FILTER_SANITIZE_STRING),
        'app_DCR' => filter_input(INPUT_POST, 'app_DCR', FILTER_SANITIZE_STRING),
        'app_RFI' => filter_input(INPUT_POST, 'app_RFI', FILTER_SANITIZE_STRING),
        'app_RS' => filter_input(INPUT_POST, 'app_RS', FILTER_SANITIZE_STRING),
        'app_SA' => filter_input(INPUT_POST, 'app_SA', FILTER_SANITIZE_STRING), //safety activities
        'app_SMH' => filter_input(INPUT_POST, 'app_SMH', FILTER_SANITIZE_STRING), // Total Man Hours
        'app_RR' => filter_input(INPUT_POST, 'app_RR', FILTER_SANITIZE_STRING), // Risk Register
        'app_PBC' => filter_input(INPUT_POST, 'app_PBC', FILTER_SANITIZE_STRING),
        'app_LS' => filter_input(INPUT_POST, 'app_LS', FILTER_SANITIZE_STRING),
        'app_DA' => filter_input(INPUT_POST, 'app_DA', FILTER_SANITIZE_STRING),
        'app_PU' => filter_input(INPUT_POST, 'app_PU', FILTER_SANITIZE_STRING),
        'app_RSDL' => filter_input(INPUT_POST, 'app_RSDL', FILTER_SANITIZE_STRING),
        'financePackage_name' => filter_input(INPUT_POST, 'financePackage_name', FILTER_SANITIZE_STRING),
        'app_CP' => filter_input(INPUT_POST, 'app_CP', FILTER_SANITIZE_STRING),
        'app_IC' => filter_input(INPUT_POST, 'app_IC', FILTER_SANITIZE_STRING),
        'app_VO' => filter_input(INPUT_POST, 'app_VO', FILTER_SANITIZE_STRING),
        'app_LR' => filter_input(INPUT_POST, 'app_LR', FILTER_SANITIZE_STRING),
        'app_LI' => filter_input(INPUT_POST, 'app_LI', FILTER_SANITIZE_STRING),
        'app_LE' => filter_input(INPUT_POST, 'app_LE', FILTER_SANITIZE_STRING),
        'documentPackage_name' => filter_input(INPUT_POST, 'documentPackage_name', FILTER_SANITIZE_STRING),
        'app_DR' => filter_input(INPUT_POST, 'app_DR', FILTER_SANITIZE_STRING), // Document Register
        'app_CORR' => filter_input(INPUT_POST, 'app_CORR', FILTER_SANITIZE_STRING), // Document Correspondance
        // for asset
        'app_asset_insp' => filter_input(INPUT_POST, 'app_asset_insp', FILTER_SANITIZE_STRING),
        'app_asset_assess' => filter_input(INPUT_POST, 'app_asset_assess', FILTER_SANITIZE_STRING),
        'app_asset_rm' => filter_input(INPUT_POST, 'app_asset_rm', FILTER_SANITIZE_STRING),
        'app_asset_pm' => filter_input(INPUT_POST, 'app_asset_pm', FILTER_SANITIZE_STRING),
        'app_asset_ew' => filter_input(INPUT_POST, 'app_asset_ew', FILTER_SANITIZE_STRING),
        'app_asset_rfi' => filter_input(INPUT_POST, 'app_asset_rfi', FILTER_SANITIZE_STRING),
        'app_asset_ncp' => filter_input(INPUT_POST, 'app_asset_ncp', FILTER_SANITIZE_STRING),
        'app_asset_pca' => filter_input(INPUT_POST, 'app_asset_pca', FILTER_SANITIZE_STRING),
        'app_asset_setup' => filter_input(INPUT_POST, 'app_asset_setup', FILTER_SANITIZE_STRING)
    );
    return $appLinks;
}

function updateProjectDetails(){

    global $response;
    global $CONN;

    $check = checkIfProjectAdmin();
    
    if (!$check) {
        $response['bool'] = false;
        $response['msg'] = "Insufficient privileges";
        return;
    };

    $email = $_SESSION['email'];
    $myresult =[];
    $pidnumber = $_SESSION['project_id']; //projectidnumber
    $projectDetails = array(
        "project_name" => filter_input(INPUT_POST, 'projectname', FILTER_SANITIZE_STRING),
        "industry" => filter_input(INPUT_POST, 'industry', FILTER_SANITIZE_STRING),
        "time_zone_text" => filter_input(INPUT_POST, 'timezonetext', FILTER_SANITIZE_STRING),
        "time_zone_value" => filter_input(INPUT_POST, 'timezoneval', FILTER_VALIDATE_INT),
        "start_date" => filter_input(INPUT_POST, 'startdate', FILTER_SANITIZE_STRING),
        "end_date" => filter_input(INPUT_POST, 'enddate', FILTER_SANITIZE_STRING),
        "duration" => filter_input(INPUT_POST, 'duration', FILTER_VALIDATE_INT),
        "location" => filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING),
        "latitude_1" => filter_input(INPUT_POST, 'lat1', FILTER_VALIDATE_FLOAT),
        "latitude_2" => filter_input(INPUT_POST, 'lat2', FILTER_VALIDATE_FLOAT),
        "longitude_1" => filter_input(INPUT_POST, 'long1', FILTER_VALIDATE_FLOAT),
        "longitude_2" => filter_input(INPUT_POST, 'long2', FILTER_VALIDATE_FLOAT),
    );
 
    $checkSql = "SELECT project_id, parent_project_id_number, project_type FROM projects WHERE project_id_number=:0";

    $projectExists = $CONN->fetchRow($checkSql, array($pidnumber));
    if (empty($projectExists)) {
        $response['bool'] = false;
        $response['msg'] = "Project does not exist";
        return;
    }
    $project_id_name = $projectExists["project_id"];
    $parent_project_id_number = $projectExists["parent_project_id_number"];
    $project_type = $projectExists["project_type"];

    //validate project name and idName for uniqueness
    $validation = validateProjectDetails(null, $projectDetails['project_name'], $pidnumber);
    if (!empty($validation)) { //name or id exists
        $response['bool'] = false;
        $response['msg'] = $validation;
        return;
    }
 
    $colsToUpdArr = array();
    $valsToUpdArr = array();
    foreach ($projectDetails as $key => $cl) {
        if ($key !== "project_id" && $key !== "pidnumber") {
            if ($cl !== false || $cl !== null) {
                $colsToUpdArr[] = $key . ' = :' . $key;
                $valsToUpdArr[$key] = $cl;
            }
        }
    }
    //upload image here
    if (isset($_FILES['imgInp']) && !empty($_FILES['imgInp']['name'])) {
        $file_name = $_FILES['imgInp']['name'];
        $file_tmp = $_FILES['imgInp']['tmp_name'];
        if (!file_exists("../../Data/Projects/" . $pidnumber . "/")) {
            mkdir("../../Data/Projects/" . $pidnumber . "/", 0777, true);
        }
        move_uploaded_file($file_tmp, "../../Data/Projects/" . $pidnumber . "/" . $file_name);
        $icon_url = "Data/Projects/" . $pidnumber . "/" . $file_name;
        $_SESSION['icon_url'] = $icon_url;
        $myresult['newIcon'] = $icon_url;
        $colsToUpdArr[] = 'icon_url = :icon_url';
        $valsToUpdArr['icon_url'] = $icon_url;
    }

    $myproject = array(
        'project_id_number' => $pidnumber,
        'project_id' => $project_id_name,
        'project_name' => $projectDetails['project_name'],
        'id' => $project_id_name
    );

  
    if (!empty($projectDetails['start_date'])){
        $myproject['start_date'] = $projectDetails['start_date'];
    };
    if (!empty($projectDetails['end_date'])){
        $myproject['end_date'] = $projectDetails['end_date'];
    };
     // update the project details to joget first
     $joget_result = jogetProjectRegistration($myproject, $project_type);
     $myresp = json_decode($joget_result);
     $response['joget_project_update'] = $myresp;
     if ($myresp == "") { //project was not updated in joget ..      so return
         $response['msg'] = "Unable to update project details  in Joget. Please check the joget connection!";
         $response['bool'] = "close";
         return;
     } else {
         if ($myresp->status && $myresp->status != true) { //project was not updated in joget .. so
             $response['msg'] = "Unable to update project details  in Joget. Please check the joget connection!";
             $response['bool'] = "close";
             return;
         }
     }

    $valsToUpdArr['updatedBy'] = $email;
    $valsToUpdArr['pidnumber'] = $pidnumber;
  
    $updSql = "UPDATE projects SET " . implode(" ,", $colsToUpdArr) . " ,updated_by = :updatedBy, last_update = GETDATE() WHERE project_id_number =:pidnumber";

    $ok = $CONN->execute($updSql, $valsToUpdArr);

    if (!$ok) {
        $response['bool'] = false;
        $response['msg'] = "Unable to update project due to SQL error :" . $CONN->errorMsg;
        return $response;
    }

    if (!$parent_project_id_number) { //is parent project
        
        //update industry & timezone values for all child projects
        $checkChildSql = "SELECT project_id_number FROM projects WHERE parent_project_id_number =:0";
        $checkChildRecords = $CONN->fetchAll($checkChildSql, array($pidnumber));
        if (!empty($checkChildRecords)) { //UPDATE the timezone and industry values to the child projects
            $pidNums = [];
            foreach ($projectDetails as $key => $cl) {
                if ($key == "industry" || $key == "time_zone_text" || $key == "time_zone_value") {
                    if ($cl !== false || $cl !== null) {
                        $pkgColsToUpdArr[] = $key . ' = :' . $key;
                        $pkgValsToUpdArr[$key] = $cl;
                    }
                }
            }
            foreach ($checkChildRecords as $key => $pid) {
                $pkgValsToUpdArr['pidnumber'] = $pid['project_id_number'];
                $updateSql = "UPDATE projects SET " . implode(" ,", $pkgColsToUpdArr) . ", last_update = GETDATE() WHERE project_id_number =:pidnumber";
                $ok = $CONN->execute($updateSql, $pkgValsToUpdArr);
                if (!$ok) {
                    array_push($pidNums, $pkgValsToUpdArr['pidnumber']);
                }
            }
            if ($pidNums) {
                $response['packagesNotUpdated'] = $pidNums;
            } else {
                $response['packagesUpdated'] = $checkChildRecords;
            }

        }
    }

    $myresult['data'] =  "Updated project details successfully";

    if ($_SESSION['project_name'] !== $projectDetails["project_name"]){
        $_SESSION['project_name'] = $projectDetails["project_name"];
    }  	  	
    if ($_SESSION['industry'] !== $projectDetails["industry"]){
        $_SESSION['industry'] = $projectDetails["industry"];
    }  	
    if ($_SESSION['location'] !== $projectDetails["location"]){
        $_SESSION['location'] = $projectDetails["location"];
    }  	
    if ($_SESSION['time_zone_text'] !== $projectDetails["time_zone_text"]){
        $_SESSION['time_zone_text'] = $projectDetails["time_zone_text"];
    }  	
    $psdate = date_create($projectDetails["start_date"]);
    if ($_SESSION['start_date'] !== $psdate){
        $_SESSION['start_date'] = date_format($psdate, "d/m/Y");
    }  
    $pedate = date_create($projectDetails["end_date"]);
    if ($_SESSION['end_date'] !== $pedate){
        $_SESSION['end_date'] = date_format($pedate, "d/m/Y");
    }
    if ( $_SESSION['projectDuration'] !== $projectDetails["duration"]){
        $_SESSION['projectDuration'] = $projectDetails["duration"];
    }
   
    return $myresult;
}

function checkIfProjectAdmin(){
    global $CONN;
    $email = $_SESSION['email'];
    $pidnumber = $_SESSION['project_id'];
    // $role = ["'Project Manager'", "'Senior Civil Engineer (Road Asset)'", "'Assistant Director (Road Asset)'"];

    $count = $CONN->fetchOne("SELECT count(*) FROM pro_usr_rel WHERE Pro_ID = :0  AND  Usr_ID IN (SELECT user_id from users WHERE user_email =:1) AND Pro_Role IN ('Project Manager', 'Senior Civil Engineer (Road Asset)', 'Assistant Director (Road Asset)')", array($pidnumber, $email));

    if($count == 1){
        return true;
    }else{
        return false;
    }

}

function refreshDeletProjectTableBody(){
    global $response;
    global $CONN;

    $refSql = "SELECT project_id_number, project_id, project_name, industry, time_zone_text, location, parent_project_id_number, Frequency = (SELECT DISTINCT COUNT(Rel_ID) FROM pro_usr_rel WHERE projects.project_id_number = pro_usr_rel.Pro_ID) FROM projects WHERE status ='archive' ORDER BY project_id_number";
    $refreshProject = $CONN->fetchAll($refSql);
    $response = $refreshProject;
    return $response;
}

function refreshProjTableBody(){
    global $response;
    global $CONN;
    $filterType = filter_input(INPUT_POST, 'filter', FILTER_SANITIZE_STRING);

    switch ($filterType) {
        case 'NoUserAccess':
            $sqlWhere = "and 1=0"; // TBC
            break;
        case 'NoDuration':
            $sqlWhere = "and ISNULL(duration,'') = ''";
            break;
        case 'NoLocation':
           //  $sqlWhere = "and ISNULL(location,'') = ''";
            $sqlWhere = "and longitude_1 + longitude_2 + latitude_1 + latitude_2 = 0";
            break;
        case 'NoUser':
            $sqlWhere = "and project_id_number not in (select pro_id from pro_usr_rel)";
            break;
        case 'NoAdminUser':
            $sqlWhere = "and project_id_number not in (select pro_id from pro_usr_rel where pro_role IN ('Project Manager', 'Project Monitor')";
            break;
        case 'FinishInTwoMonth':
            $sqlWhere = "and end_date BETWEEN GETDATE() and DATEADD(month, 2, GETDATE())";
            break;
        default:
            $sqlWhere = '';
            break;
    };

    $selectSql = "SELECT project_id_number, project_type, project_id, project_name,industry,location, parent_project_id_number,
    Frequency = (SELECT DISTINCT COUNT(Rel_ID) FROM pro_usr_rel LEFT JOIN users ON pro_usr_rel.Usr_ID = users.user_id WHERE 
	projects.project_id_number = pro_usr_rel.Pro_ID AND pro_usr_rel.Pro_Role != 'non_Member' AND users.user_type != 'non_active') 
    FROM projects WHERE status !='archive' $sqlWhere ORDER BY project_id_number";
    $resultProject = $CONN->fetchAll($selectSql);

    $response = $resultProject;
    return $response;
}

function getParentProjectIDList(){
    global $response;
    global $CONN;

    $response = $CONN->fetchAll("SELECT project_id_number, project_id, project_name, project_owner, industry, time_zone_text, time_zone_value, project_type, region from projects WHERE status !='archive' AND 
    parent_project_id_number IS NULL ORDER BY project_id_number", array());
}

function getProjectPackages(){
    global $response;
    global $CONN;
    $parentProjectID = $_SESSION['project_id'];

    //check if this is a parent project,
    if ($_SESSION['is_Parent'] !== "isParent") {
        return;
    }

    //get and return list
    $response = $CONN->fetchAll("SELECT CONCAT(project_id_number, '_', project_id, '_', project_id_number) as package_uuid_bumi, project_id as pid, project_name as pname, project_wpc_id as wpc_id from projects WHERE parent_project_id_number =:0", array($parentProjectID));
}

function createGeoserverWorkspace($workspaceName){
    global $JOGETLINKOBJ;
    $geoUser = $JOGETLINKOBJ->getAdminUserName('geoServer');
    $geoPwd = $JOGETLINKOBJ->getAdminUserPassword('geoServer');

    $data          = "<workspace><name>" . $workspaceName . "</name></workspace>";
    $url           = $JOGETLINKOBJ->geoServerHost."/geoserver/rest/workspaces";
    $headers       = array(
        'Content-Type:application/xml',
        'Authorization: Basic ' . base64_encode("$geoUser:$geoPwd"),
    );
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $head     = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $httpCode;
}

function deleteGeoserverWorkspace($workspaceName){
    global $JOGETLINKOBJ;
    $geoUser = $JOGETLINKOBJ->getAdminUserName('geoServer');
    $geoPwd = $JOGETLINKOBJ->getAdminUserPassword('geoServer');

    $url           = $JOGETLINKOBJ->geoServerHost."/geoserver/rest/workspaces/".$workspaceName;
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
    return $httpCode;
    
}
?>
