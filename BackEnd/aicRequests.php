<?php
session_start();
$response = array();
require('../login/include/db_connect.php');
require('../login/include/_include.php');
if (!isset($_SESSION['email'])) {
    $response['msg'] = 'Email not found';
    echo json_encode($response);
    exit();
}

if (!isset($_SESSION['project_id'])) {
    $response['msg'] = 'Project Id not found';
    echo json_encode($response);
    exit();
}

if (!isset($_SESSION['is_Parent'])) {
    $response['msg'] = 'Parent project details not found';
    echo json_encode($response);
    exit();
}

if (!isset($_POST['runFunction'])) {
    $response['msg'] = 'Invalid function requested';
    echo json_encode($response);
    exit();
}

switch ($_POST['runFunction']) {
    case 'saveAicRoutine':
        saveAicRoutine();
    break;
    case 'getAicRoutines':
        getAicRoutines();
    break;
    case 'getSpecificAicRoutine':
        getSpecificAicRoutine();
    break;
    case 'reviseAicImage':
        reviseAicImage();
    break;
    case 'updateAicDetails':
        updateAicDetails();
    break;
    case 'getRoutinesWithType':
        getRoutinesWithType();
    break;
    case 'getECWList':
        getECWList();
    break;
    
}
echo json_encode($response);

##############functions for admin.php
function getAicRoutines()
{
    global $conn;
    global $response;
    if (!isset($_POST['routineType'])) {
        $response['msg'] = 'Routine Type not available';
        return;
    }

    $routineType = $_POST['routineType'];
    $pro_id = $_SESSION['project_id'];

    if ($_SESSION['is_Parent'] == "isParent") { // is a overall project
        //retrieve all records with project_id
        $stmt = sqlsrv_query($conn, "SELECT * FROM AerialImageCompare WHERE Project_Id ='$pro_id' AND Routine_Type = '$routineType'");
    } else {    // is a package
        //retrieve all records with package_Id
        $stmt = sqlsrv_query($conn, "SELECT * FROM AerialImageCompare WHERE Package_Id ='$pro_id' AND Routine_Type = '$routineType'");
    }

    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
        return;
    }
    $row = sqlsrv_has_rows($stmt);
    if ($row == false) {
        $response['msg'] = 'No Aic record found';
        return;
    } else {
        $i = 0;
        while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
            $response['data'][$i] = $row;
            $i++;
        };
    }
}

function getSpecificAicRoutine()
{
    global $conn;
    global $response;
    if (!isset($_POST['routineId'])) {
        $response['msg'] = 'Routine Id not available';
        return;
    }

    $routineId = $_POST['routineId'];
    $pro_id = $_SESSION['project_id'];
    

    if ($_SESSION['is_Parent'] == "isParent") { // is a overall project
        //retrieve all records with project_id
        $stmt = sqlsrv_query($conn, "SELECT AIC.AIC_Id, AIC.Image_Captured_Date,AIC.Image_Type,AIC.Image_URL, AIC.Package_Id, AIC.Project_Id, AIC.Image_Group, Registered_By = (SELECT CONCAT(user_firstname, ' ', user_lastname) AS Name FROM users WHERE user_email = AIC.Registered_By), AIC.Registered_Date, AIC.Routine_Type, P.project_name,p.project_id FROM AerialImageCompare AIC LEFT JOIN projects P ON AIC.Package_Id = P.project_id_number WHERE Routine_Id ='$routineId'");
    } else {
        $stmt = sqlsrv_query($conn, "SELECT AIC.AIC_Id, AIC.Image_Captured_Date,AIC.Image_Type,AIC.Image_URL, AIC.Package_Id, AIC.Project_Id, AIC.Image_Group, Registered_By = (SELECT CONCAT(user_firstname, ' ', user_lastname) AS Name FROM users WHERE user_email = AIC.Registered_By), AIC.Registered_Date, AIC.Routine_Type, P.project_name,p.project_id FROM AerialImageCompare AIC LEFT JOIN projects P ON AIC.Package_Id = P.project_id_number WHERE Routine_Id ='$routineId' AND Package_Id ='$pro_id'");
    }
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
        return;
    }
    $row = sqlsrv_has_rows($stmt);
    if ($row == false) {
        $response['msg'] = 'No Aic record found';
        return;
    } else {
        $i = 0;
        while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
            $response['data'][$i] = $row;
            $i++;
        };
    }
}

function saveAicRoutine()
{
    global $conn;
    global $response;
    $email = $_SESSION['email'];
    $pro_id = $_SESSION['project_id'];

    if (!isset($_POST['startDate'])) {
        $response['msg'] = 'Start Date not available';
        return;
    }
    if (!isset($_POST['endDate'])) {
        $response['msg'] = 'End Date not available';
        return;
    }
    if (!isset($_POST['regDate'])) {
        $response['msg'] = 'Register Date not available';
        return;
    }
    if (!isset($_POST['regBy'])) {
        $response['msg'] = 'Registrar not available';
        return;
    }
    if (!isset($_POST['capturedDate'])) {
        $response['msg'] = 'Image Captured Date not available';
        return;
    }
    if ($_SESSION['is_Parent'] == "isParent" && !isset($_POST['packageId'])) {
        $response['msg'] = 'Package Id not available';
        return;
    }
    if (!isset($_POST['imgfileName'])) {
        $response['msg'] = 'Image URL not available';
        return;
    }
    if (!isset($_POST['routineId'])) {
        $response['msg'] = 'Routine Id not available';
        return;
    }
    if (!isset($_POST['routineType'])) {
        $response['msg'] = 'Routine type not available';
        return;
    }
    
    $startDate = $_POST['startDate'];
    $endDate = $_POST['endDate'];
    $regDate = $_POST['regDate'];
    $regBy = $_POST['regBy'];
    $capturedDate = $_POST['capturedDate'];
    if (isset($_POST['packageId'])) {
        $packageId = $_POST['packageId'];
    }
    $imgfileNameArray = explode(".",$_POST['imgfileName']); 
    $imgfileName = $imgfileNameArray[0];
    $imgType = $imgfileNameArray[1];
    $routineId = $_POST['routineId'];
    $routineType = $_POST['routineType'];
    $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users LEFT JOIN pro_usr_rel ON users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$email' AND pro_usr_rel.Pro_Role IN('Project Manager', 'Project Monitor') AND pro_usr_rel.Pro_ID ='$pro_id'");
  
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
        return;
    }
    $row = sqlsrv_has_rows($stmt);
    if ($row == false) {
        $response['pro'] =  $pro_id;
        $response['email'] =  $email;
        $response['msg'] = 'No Permission';
        return;
    } else {  //is admin of project

        if ($_SESSION['is_Parent'] == "isParent") {
            $sql = "INSERT INTO AerialImageCompare ([Project_Id], [Package_Id], [Image_Type], [Image_Captured_Date], [Registered_By], [Registered_Date], [Image_URL] , [Routine_Id], [Routine_Type]) VALUES ('$pro_id','$packageId','$imgType','$capturedDate','$regBy',getDate() ,'$imgfileName', '$routineId', '$routineType');";
        } else {
            $parentId = $_SESSION['is_Parent'];
            $sql = "INSERT INTO AerialImageCompare ([Project_Id], [Package_Id], [Image_Type], [Image_Captured_Date], [Registered_By], [Registered_Date], [Image_URL] , [Routine_Id], [Routine_Type]) VALUES ('$parentId','$pro_id','$imgType','$capturedDate','$regBy',getDate() ,'$imgfileName', '$routineId', '$routineType');";
        }

        $stmt2 = sqlsrv_query($conn, $sql);
        if ($stmt2 === false) {  //error
            if (($errors = sqlsrv_errors()) != null) {
                $response['msg'] = 'Sql error';
                $response['sql'] = $sql;
                $response['error'] = $errors;
                return;
            }
        } else {
            $response['msg'] = 'Success';
        }
    }
}

function reviseAicImage()
{
    global $conn;
    global $response;
    if (!isset($_POST['AicId'])) {
        $response['msg'] = 'AIC Id not available';
        return;
    }
    if (!isset($_POST['imgfileName'])) {
        $response['msg'] = 'Image URL not available';
        return;
    }
    $email = $_SESSION['email'];
    $pro_id = $_SESSION['project_id'];
    $imgfileNameArray = explode(".",$_POST['imgfileName']); 
    $imgfileName = $imgfileNameArray[0];
    $imgType = $imgfileNameArray[1];
    $aicId = $_POST['AicId'];

    $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$email' AND pro_usr_rel.Pro_Role IN('Project Manager', 'Project Monitor') AND pro_usr_rel.Pro_ID ='$pro_id'");
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
        return;
    }
    $row = sqlsrv_has_rows($stmt);
    if ($row == false) {
        $response['msg'] = 'No Permission';
        return;
    } else {    //is admin of project
        $stmt2 = sqlsrv_query($conn, "UPDATE AerialImageCompare SET Image_Type = '$imgType', Image_URL = '$imgfileName' WHERE AIC_Id ='$aicId';");
        if ($stmt2 === false) {  //error
            if (($errors = sqlsrv_errors()) != null) {
                $response['msg'] = 'Sql error';
                return;
            }
        } else {
            $response['msg'] = 'Success';
            $response['aicId'] = $aicId;
            $response['fileName'] = $imgfileName;
        }
    }
}

function updateAicDetails()
{
    global $conn;
    global $response;
    if (!isset($_POST['AicId'])) {
        $response['msg'] = 'AIC Id not available';
        return;
    }
    if (!isset($_POST['Image_Captured_Date'])) {
        $response['msg'] = 'Image Captured Date not available';
        return;
    }
    $email = $_SESSION['email'];
    $pro_id = $_SESSION['project_id'];
    $aicId = $_POST['AicId'];
    $imgCapturedDate = $_POST['Image_Captured_Date'];

    $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$email' AND pro_usr_rel.Pro_Role IN ('Project Manager', 'Project Monitor') AND pro_usr_rel.Pro_ID ='$pro_id'");
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
        return;
    }
    $row = sqlsrv_has_rows($stmt);
    if ($row == false) {
        $response['pro'] =  $pro_id;
        $response['email'] =  $email;
        $response['msg'] = 'No Permission';
        return;
    } else {    //is admin of project
        $sql = "UPDATE AerialImageCompare SET Image_Captured_Date = '$imgCapturedDate' WHERE AIC_Id ='$aicId';";
        $stmt2 = sqlsrv_query($conn, $sql);
        if ($stmt2 === false) {  //error
            if (($errors = sqlsrv_errors()) != null) {
                $response['msg'] = 'Sql error';
                return;
            }
        } else {
            $response['sql'] =  $sql;
            $response['msg'] = 'Success';
        }
    }
}

##############functions for index.php
function getRoutinesWithType()
{
    global $conn;
    global $response;
    if (!isset($_POST['routineType'])) {
        $response['msg'] = 'Routine type not available';
        return;
    }
    if ($_SESSION['is_Parent'] == "isParent" && !isset($_POST['packageId'])) {
        $response['msg'] = 'Package Id not available';
        return;
    }
    $routineType = $_POST['routineType'];
    $email = $_SESSION['email'];
    $pro_id = $_SESSION['project_id'];

    if ($_SESSION['is_Parent'] == "isParent") {
        $packageId = $_POST['packageId'];
        $sql = "SELECT * FROM AerialImageCompare WHERE Package_Id ='$packageId' AND Routine_Type ='$routineType'";
    }
    else{
        $sql = "SELECT * FROM AerialImageCompare WHERE Package_Id ='$pro_id' AND Routine_Type ='$routineType'";
    }
    $stmt = sqlsrv_query($conn, $sql);
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
        return;
    }
    $row = sqlsrv_has_rows($stmt);
    if ($row == false) {
        $response['msg'] = 'No Aic record found';
        return;
    } else {
        $i = 0;
        while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
            $response['data'][$i] = $row;
            $i++;
        };
    }
}

################## experimenting function for listing layer list and display on cesium
function getECWList()
{
    global $CONN;
    global $response;
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
        ORDER BY a.Routine_Type ASC, b.groupName DESC, c.subGroupName DESC, a.Use_Name DESC;", array($pro_id));
    }
    
    //query using In packageId
    if($aicList){
        $response['bool'] = true;
        $response['data'] = $aicList;
    }else{
        $response['bool'] = false;
        $response['msg'] = 'No AIC Image Records Found';
    }
}


