<?php
session_start();
$response = array();
require_once('../login/include/db_connect.php');
require_once('../login/include/_include.php');
require_once('../login/app_properties.php');
include_once('class/jogetLink.class.php');
global  $SYSTEM;
global $JOGETLINKOBJ;
$JOGETLINKOBJ = new JogetLink();
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
    case 'saveSharedAicRoutine':
        saveSharedAicRoutine();
    break;
    case 'removeSharedAicRoutine':
        removeSharedAicRoutine();
    break;
    case 'getAicRoutinesToShare':
        getAicRoutinesToShare();
      break;
    case 'getProjectsUsingAIC':
        getProjectsUsingAIC();
    break;
}
echo json_encode($response);

function saveAicRoutine()
{
    global $conn;
    global $response;
    global $SYSTEM;

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
    if($SYSTEM == 'OBYU'){
        $imgfileName = $_POST['imgfileName'];
        $imgType = $_POST['imgType'];
    }else{
        $imgfileNameArray = explode(".",$_POST['imgfileName']); 
        $imgfileName = $imgfileNameArray[0];
        $imgType = $imgfileNameArray[1];
    }
    $routineId = $_POST['routineId'];
    $routineType = $_POST['routineType'];
    $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users LEFT JOIN pro_usr_rel ON users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$email' AND pro_usr_rel.Pro_Role IN('Project Manager', 'Project Monitor', 'Assistant Director (Road Asset)', 'Senior Civil Engineer (Road Asset)', 'KKR', 'Civil Engineer (Road Asset)') AND pro_usr_rel.Pro_ID ='$pro_id'");
  
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
            $sql = "INSERT INTO AerialImageCompare ([Project_Id], [Package_Id], [Image_Type], [Image_Captured_Date], [Registered_By], [Registered_Date], [Image_URL] , [Routine_Id], [Routine_Type], [Owner_Id], [Share]) OUTPUT INSERTED.AIC_Id  VALUES ('$pro_id','$packageId','$imgType','$capturedDate','$regBy',getDate() ,'$imgfileName', '$routineId', '$routineType', '$packageId', '0');";
        } else {
            $parentId = $_SESSION['is_Parent'];
            $sql = "INSERT INTO AerialImageCompare ([Project_Id], [Package_Id], [Image_Type], [Image_Captured_Date], [Registered_By], [Registered_Date], [Image_URL] , [Routine_Id], [Routine_Type], [Owner_Id], [Share]) OUTPUT INSERTED.AIC_Id   VALUES ('$parentId','$pro_id','$imgType','$capturedDate','$regBy',getDate() ,'$imgfileName', '$routineId', '$routineType', '$pro_id', '0');";
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
            while ($row1 = sqlsrv_fetch_Array($stmt2, SQLSRV_FETCH_ASSOC)) 
            {	
              $aicId = $row1['AIC_Id'];
            };
            $update = "UPDATE AerialImageCompare SET Owner_AIC_Id = '$aicId' where AIC_Id = '$aicId'";
            $updstm = sqlsrv_query($conn, $update);
            $response['msg'] = 'Success';
        }
    }
}

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
        $stmt = sqlsrv_query($conn, "SELECT AIC.AIC_Id, AIC.Image_Captured_Date,AIC.Image_Type,AIC.Image_URL, AIC.Package_Id, AIC.Project_Id, AIC.Image_Group, AIC.Owner_AIC_Id, Registered_By = (SELECT CONCAT(user_firstname, ' ', user_lastname) AS Name FROM users WHERE user_email = AIC.Registered_By),Owner_Project_Name = (SELECT d.project_name from projects d  where d.project_id_number = AIC.Owner_Id), Owner_Project_id = (SELECT d.project_id from projects d  where d.project_id_number = AIC.Owner_Id), AIC.Registered_Date, AIC.Routine_Type, P.project_name,p.project_id FROM AerialImageCompare AIC LEFT JOIN projects P ON AIC.Package_Id = P.project_id_number WHERE Routine_Id ='$routineId'");
    } else {
        $stmt = sqlsrv_query($conn, "SELECT AIC.AIC_Id, AIC.Image_Captured_Date,AIC.Image_Type,AIC.Image_URL, AIC.Package_Id, AIC.Project_Id, AIC.Image_Group, AIC.Owner_AIC_Id, Registered_By = (SELECT CONCAT(user_firstname, ' ', user_lastname) AS Name FROM users WHERE user_email = AIC.Registered_By), Owner_Project_Name = (SELECT d.project_name from projects d  where d.project_id_number = AIC.Owner_Id), Owner_Project_id = (SELECT d.project_id from projects d  where d.project_id_number = AIC.Owner_Id), AIC.Registered_Date, AIC.Routine_Type, P.project_name,p.project_id FROM AerialImageCompare AIC LEFT JOIN projects P ON AIC.Package_Id = P.project_id_number WHERE Routine_Id ='$routineId' AND Package_Id ='$pro_id'");
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
            $row['Owner_Project_Name'] = utf8_encode($row['Owner_Project_Name']);
            $row['project_name'] = utf8_encode($row['project_name']);
            $response['data'][$i] = $row;
            $i++;
        };
    }
}


function reviseAicImage()
{
    global $conn;
    global $response;
    global $SYSTEM;
    global $JOGETLINKOBJ;
    
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

    $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$email' AND pro_usr_rel.Pro_Role IN('Project Manager', 'Project Monitor') AND pro_usr_rel.Pro_ID ='$pro_id'");
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
        return;
    }
    $row = sqlsrv_has_rows($stmt);
    if ($row == false) {
        $response['msg'] = 'No Permission';
        return;
    }

    // user is admin
    $aicId = $_POST['AicId'];
    if($SYSTEM == 'OBYU'){
        $imgfileName = $_POST['imgfileName'];
        $imgType = $_POST['imgType'];
        $stmt2 = sqlsrv_query($conn, "UPDATE AerialImageCompare SET Image_Type = '$imgType', Image_URL = '$imgfileName' WHERE AIC_Id ='$aicId';");
    }else{
        $imgfileNameArray = explode(".",$_POST['imgfileName']); 
        $imgfileName = $imgfileNameArray[0];
        $imgType = $imgfileNameArray[1];
        //KKR - update image to all packages sharing the same image and owner id.
        // need to publish in geo server the new image for the shared packages
        //get owner project ID first as revise can be done in parent project also
        $owner_project_id ="";
        $oldImageName ="";
        $oldImageType ="";
        $project_list = [];
        if ($_SESSION['is_Parent'] == "isParent") { // get the package name first
            $st1 = sqlsrv_query($conn, "SELECT b.project_id  from AerialImageCompare a, projects b  where b.project_id_number = a.Package_Id and a.AIC_Id ='$aicId'");
            $row = sqlsrv_has_rows($st1);
            if ($row == false) {
                $response['msg'] = 'No project details found for the AIC Image';
                return;
            } else {
                $i = 0;
                while ($row = sqlsrv_fetch_Array($st1, SQLSRV_FETCH_ASSOC)) {
                    $owner_project_id = $row['project_id'];
                    $i++;
                };
            }
        }else{
            $owner_project_id = $_SESSION['projectID']; // current project_id
        }

        $getallProjects = sqlsrv_query($conn, "SELECT b.project_id , a.Image_URL, a.Image_Type from AerialImageCompare a, projects b where b.project_id_number = a.Package_Id and a.Owner_AIC_Id = '$aicId' and b.project_id != '$owner_project_id'");
        $row1= sqlsrv_has_rows($getallProjects);
            if ($row1 == false) {
                $response['msg1'] = 'No other Projects share the AIC Image';
            } else {
                $i = 0;
                while ($row1 = sqlsrv_fetch_Array($getallProjects, SQLSRV_FETCH_ASSOC)) {
                    $project_list[$i] = $row1['project_id'];
                    $oldImageName = $row1['Image_URL'];
                    $oldImageType = $row1['Image_Type'];
                    $i++;
                };
                // unpublish old image and publish new one
                $list_project = implode(",", $project_list);
                $oldFileNameFull = $oldImageName.".".$oldImageType;
                $fileNameFull = $imgfileName.".".$imgType;
                $fileType = "AIC";
                $url  = $JOGETLINKOBJ->geoServerHost."/JavaBridge/geodataupload/geoServerFileTransfer.php";
                
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $data          = array(
                    "pwd" => base64_encode ("ReveronITDepartment2021+"),
                    "fileName" => $fileNameFull,
                    "projectId" => $owner_project_id,
                    "fileType" => $fileType,
                    "sharedProjects" => $list_project,
                    "oldFileName" => $oldFileNameFull,
                    "task" => "revise"
                );
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0); 
                curl_setopt($ch, CURLOPT_TIMEOUT, 1000); //timeout in seconds
                $head = curl_exec($ch);
                curl_close($ch);
                $response['f_msg'] = $head;

            }

        $stmt2 = sqlsrv_query($conn, "UPDATE AerialImageCompare SET Image_Type = '$imgType', Image_URL = '$imgfileName' WHERE Owner_AIC_Id ='$aicId';");

    }
   
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

function updateAicDetails()
{
    global $conn;
    global $response;
    if (!isset($_POST['AicId'])) {
        $response['msg'] = 'AIC Id not available';
        return;
    }
    $email = $_SESSION['email'];
    $pro_id = $_SESSION['project_id']; 
    
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
    }
    $aicId = $_POST['AicId'];
    $sql = "";
    if (isset($_POST['Image_Captured_Date'])) {
        $imgCapturedDate = $_POST['Image_Captured_Date'];
        //fetch Image url and owner id to update all records shared
        $sql = "UPDATE AerialImageCompare SET Image_Captured_Date = '$imgCapturedDate' where Owner_AIC_Id ='$aicId';";
    }

    if(isset($_POST['access'])){
        $access = $_POST['access'];
        $sql = "UPDATE AerialImageCompare SET Share = '$access' WHERE AIC_Id ='$aicId';";
       
    }
   //is admin of project
       
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

function saveSharedAicRoutine()
{
    global $conn;
    global $response;
    global $SYSTEM;
    global $JOGETLINKOBJ;

    $email = $_SESSION['email'];
    $pro_id = $_SESSION['project_id'];

   
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
    if (!isset($_POST['imgType'])) {
        $response['msg'] = 'Image Type not available';
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

    if (!isset($_POST['owner'])) {
        $response['msg'] = 'Owner project details not available';
        return;
    }
    if (!isset($_POST['ownerProjectId'])) {
        $response['msg'] = 'Owner project details not available';
        return;
    }
    if (!isset($_POST['ownerAicId'])) {
        $response['msg'] = 'Owner project details not available';
        return;
    }
   
    
    $capturedDate = $_POST['capturedDate'];
    if (isset($_POST['packageId'])) {
        $packageId = $_POST['packageId'];
    }
    
    $imgfileName = $_POST['imgfileName'];
    $imgType = $_POST['imgType'];
    $owner = $_POST['owner'];
    $owner_project_id = $_POST['ownerProjectId'];
    $owner_aic_id = $_POST['ownerAicId'];
    $routineId = $_POST['routineId'];
    $routineType = $_POST['routineType'];
    $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users LEFT JOIN pro_usr_rel ON users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$email' AND pro_usr_rel.Pro_Role IN('Project Manager', 'Project Monitor', 'Assistant Director (Road Asset)', 'Senior Civil Engineer (Road Asset)', 'KKR', 'Civil Engineer (Road Asset)') AND pro_usr_rel.Pro_ID ='$pro_id'");
  
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
        if($SYSTEM == 'KKR'){
           
            //need to publish in geo server first
            if ($_SESSION['is_Parent'] == "isParent") {
                $projectId = $packageId;
            } else {
                $projectId = $_SESSION['projectID'];
            }
            $fileNameFull = $imgfileName.".".$imgType;
            // true when the final file has been uploaded and chunks reunited.
            //transfer all files to geo server
            $fileType = "AIC";
            //$filePath       = "../../../Data/Geoserver/AIC/".$fileNameFull;
            $url            = $JOGETLINKOBJ->geoServerHost."/JavaBridge/geodataupload/geoServerFileTransfer.php";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            // //If the function curl_file_create exists
            // if(function_exists('curl_file_create')){
            //     //Use the recommended way, creating a CURLFile object.
            //     $filePath = curl_file_create($filePath);
            // } else{
            //     //Otherwise, do it the old way.
            //     //Get the canonicalized pathname of our file and prepend the @ character.
            //     $filePath = '@' . realpath($filePath);
            //     //Turn off SAFE UPLOAD so that it accepts files, starting with an @
            //     curl_setopt($ch, CURLOPT_SAFE_UPLOAD, false);
            // }
            $data          = array(
                "pwd" => base64_encode ("ReveronITDepartment2021+"),
                "fileName" => $fileNameFull,
                "projectId" => $projectId,
                "fileType" => $fileType,
                'projectOwner' => $owner,
                'task' => "publish"
            );
            $response['data'] = $data;
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0); 
            curl_setopt($ch, CURLOPT_TIMEOUT, 1000); //timeout in seconds
            $head = curl_exec($ch);
            curl_close($ch);
        
            $response['head'] = $head;
        }

        if ($_SESSION['is_Parent'] == "isParent") {
            $sql = "INSERT INTO AerialImageCompare ([Project_Id], [Package_Id], [Image_Type], [Image_Captured_Date], [Registered_By], [Registered_Date], [Image_URL] , [Routine_Id], [Routine_Type], [Owner_Id], [Share], [Owner_AIC_Id]) VALUES ('$pro_id','$packageId','$imgType','$capturedDate','$email',getDate() ,'$imgfileName', '$routineId', '$routineType', '$owner_project_id', '0', '$owner_aic_id');";
        } else {
            $parentId = $_SESSION['is_Parent'];
            $sql = "INSERT INTO AerialImageCompare ([Project_Id], [Package_Id], [Image_Type], [Image_Captured_Date], [Registered_By], [Registered_Date], [Image_URL] , [Routine_Id], [Routine_Type], [Owner_Id], [Share], [Owner_AIC_Id]) VALUES ('$parentId','$pro_id','$imgType','$capturedDate','$email',getDate() ,'$imgfileName', '$routineId', '$routineType','$owner_project_id', '0', '$owner_aic_id');";
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

function removeSharedAicRoutine(){
    global $conn;
    global $response;
    global $SYSTEM;
    global $JOGETLINKOBJ;

    $email = $_SESSION['email'];
    $pro_id = $_SESSION['project_id'];
    if (!isset($_POST['imgfileName']) && !isset($_POST['imgType']) && !isset($_POST['owner'])) {
        $response['msg'] = 'Image URL not available';
        return;
    }
    //check if you have permission
    $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users LEFT JOIN pro_usr_rel ON users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$email' AND pro_usr_rel.Pro_Role IN('Project Manager', 'Project Monitor', 'Assistant Director (Road Asset)', 'Senior Civil Engineer (Road Asset)', 'KKR', 'Civil Engineer (Road Asset)') AND pro_usr_rel.Pro_ID ='$pro_id'");
  
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
        if ($_SESSION['is_Parent'] != "isParent") {
            
            $projectId = $_SESSION['projectID'];
        }
        $imgfileName = $_POST['imgfileName'];
        $imgType = $_POST['imgType'];
        $owner_aic_id = $_POST['ownerAicId'];
        if($SYSTEM == 'KKR'){
             //need to publish in geo server first
            
            $fileNameFull = $imgfileName.".".$imgType;
            // true when the final file has been uploaded and chunks reunited.
            //transfer all files to geo server
            $fileType = "AIC";
           // $filePath       = "../../../Data/Geoserver/AIC/".$fileNameFull;
            $url            = $JOGETLINKOBJ->geoServerHost."/JavaBridge/geodataupload/geoServerFileTransfer.php";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            // //If the function curl_file_create exists
            // if(function_exists('curl_file_create')){
            //     //Use the recommended way, creating a CURLFile object.
            //     $filePath = curl_file_create($filePath);
            // } else{
            //     //Otherwise, do it the old way.
            //     //Get the canonicalized pathname of our file and prepend the @ character.
            //     $filePath = '@' . realpath($filePath);
            //     //Turn off SAFE UPLOAD so that it accepts files, starting with an @
            //     curl_setopt($ch, CURLOPT_SAFE_UPLOAD, false);
            // }
            $data          = array(
                "pwd" => base64_encode ("ReveronITDepartment2021+"),
                "fileName" => $fileNameFull,
                "projectId" => $projectId,
                "fileType" => $fileType,
                "task" => "remove"
            );
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0); 
            curl_setopt($ch, CURLOPT_TIMEOUT, 1000); //timeout in seconds
            $head = curl_exec($ch);
            curl_close($ch);
        
            // if (curl_errno($ch)) {
            //     $error_msg = curl_error($ch);
            //     $response["status"] = "Error";
            //     $response["msg"] = $error_msg;
            //     return;
            // }
            $response['f_msg'] = $head;
        }

        $sql = "DELETE FROM AerialImageCompare where Package_Id = '$pro_id' and Image_URL = '$imgfileName' and Owner_AIC_Id ='$owner_aic_id'";
        $stmt2 = sqlsrv_query($conn, $sql);
        if ($stmt2 === false) {  //error
            if (($errors = sqlsrv_errors()) != null) {
                $response['msg'] = 'Sql error';
                $response['sql'] = $sql;
                $response['error'] = $errors;
                return;
            }
        } else {
            $response['msg'] = 'AIC Image detached';
        }
    }
}


###############to get the AIC list to share with other projects based on same owner Sabah /Sarawak and in the project time line
function getAicRoutinesToShare(){
    global $conn;
    global $response;
    $pro_owner = $_SESSION['project_owner'];

    //retrieve all records with package_Id
    $stmt = sqlsrv_query($conn, "select a.AIC_Id, a.Package_Id, a.Image_Type, a.Image_Captured_Date, a.Image_URL, a.Routine_Id, a.Routine_Type, a.Owner_Id, a.Share, Frequency = (SELECT COUNT(*) FROM dbo.AerialImageCompare c WHERE c.Owner_AIC_Id = a.AIC_ID), b.project_name as Owner_Name, b.project_id as Owner_Project_Id from dbo.AerialImageCompare a, projects b  where a.AIC_Id = a.Owner_AIC_Id and a.Package_Id = b.project_id_number and b.project_owner ='$pro_owner' order by b.project_name ");


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

        $pro_id = $_SESSION['project_id'];

        if ($_SESSION['is_Parent'] != "isParent") { 
           //retrieve all records with package_Id
            $stmt1 = sqlsrv_query($conn, "SELECT Owner_AIC_Id FROM AerialImageCompare WHERE Package_Id ='$pro_id' ");
               
            $i = 0;
            $myAICs = [];
            while ($row = sqlsrv_fetch_Array($stmt1, SQLSRV_FETCH_ASSOC)) {
                array_push($myAICs, $row['Owner_AIC_Id']); 
                $i++;
            };
            $response['myAICs'] = $myAICs;
        }
    }

}

function getProjectsUsingAIC(){
    global $conn;
    global $response;
    if(!isset($_POST['fileName']) && !isset($_POST['onwerId'])){
        $response['msg'] = 'Image URL / owner details not available';
        return;
    }
    $imgFileName = $_POST['fileName'];
    $owner_aic_id = $_POST['onwerAicId'];
   
    $stmt = sqlsrv_query($conn, "select a.Package_Id, b.project_name, b.project_id, a.Registered_By  from dbo.AerialImageCompare a, projects b  where  a.Package_Id = b.project_id_number and a.Owner_AIC_Id = '$owner_aic_id' and a.Image_URL = '$imgFileName' order by b.project_name;");
   

    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
        return;
    }
    $row = sqlsrv_has_rows($stmt);
    if ($row == false) {
        $response['msg'] = 'No records found';
        return;
    } else {
        $i = 0;
        while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
            $response['data'][$i] = $row;
            $i++;
        };
    }
}