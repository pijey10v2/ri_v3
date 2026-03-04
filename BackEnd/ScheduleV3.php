<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    require '../Login/include/_include.php';
    session_start();

    

    $functionName = '';
    if (isset($_POST['function_name'])) {
        $functionName =  $_POST['function_name'];
    }

    $response = [];
    switch ($functionName) {
        case 'getScheduleTaskNames':
            $response = getScheduleTaskNames();
            break;
        case 'saveSchedule':
            $response = saveSchedule();
            break;
        case 'getScheduleDetails':
            $response = getScheduleDetails();
            break;
    }
    echo json_encode($response, true);


    function getScheduleTaskNames(){
        if(!isset($_POST['url'])){
            $myresult['error'] = "No Url is given to parse the schedule file. Please check";
            return $myresult;
        }
        $url = "../../".$_POST['url'];
        if(!file_exists($url)){
            $myresult['error'] = ' File not found';
            return $myresult;
        }
        $sch_file = simplexml_load_file($url); 
        $namespaces = $sch_file->getNamespaces(true);

        if (!isset($namespaces[""])) {
            $myresult['error'] = ' namespace unavailable';
            return $myresult;
        }
        $sch_file->registerXPathNamespace("default", $namespaces[""]);
        $folderXpath = "//default:Tasks";
        $taskMark = "//default:Project//default:Task";
        $number = "//default:Project//default:Task//default:OutlineNumber";
        $myCount = count($sch_file->xpath($number));
    
        $taskData = [];
        $myresult =[];
        $i=0;
        if($myCount >0){
            foreach($sch_file->xpath($taskMark) as $item){
                $taskData[$i]['name'] = trim($item->Name, "\n\t");
                $taskData[$i]['outlineNumber'] = trim($item->OutlineNumber, "\n\t");
                $taskData[$i]['outlineLevel'] = trim($item->OutlineLevel, "\n\t");
                
                $i++;
            };
            $myresult['oNumber'] = "number";
        }else{
            foreach($sch_file->xpath($taskMark) as $item){
                $taskData[$i]['name'] = trim($item->Name, "\n\t");
                $taskData[$i]['outlineLevel'] = trim($item->OutlineLevel, "\n\t");
                
                $i++;
            };
            $myresult['oNumber'] = null;
        }
    
        $myresult['data'] = $taskData;
        return $myresult;
    }
    
    function saveSchedule(){
        global $conn;
        global $CONN;
        global $SYSTEM;

        $projID = $_SESSION['projectID'];
        $user = $_SESSION['email'];
        $pid = $_SESSION['project_id'];
        $start = $_POST['scheduleStart'];
        $rvNumber = $_POST['revisionnumber'];
        $rvReason = $_POST['revisionreason'];
        $rvRemarks = $_POST['revisionremarks'];
        $name = $_POST['scheduleName'];
        $type = $_POST['scheduleType'];
        $myresult = array();
        $finActual = 0;
        $phyActual = 0;
        if(isset($_FILES['xmlInp']) && !empty( $_FILES['xmlInp']['name'] )){
            
            if(isset($_POST['rename'])){
                $file_name = $_POST['rename'];
            }
            else{
                $file_name = $_FILES['xmlInp']['name'];
            }
            $file_tmp = $_FILES['xmlInp']['tmp_name'];
            $xmlObj = simplexml_load_file($file_tmp);
            $namespaces = $xmlObj->getNamespaces(true);

            if (!isset($namespaces[""])) { 
                $myresult['msg'] = 'File is invalid. (namespace unavailable)';
                return $myresult;
            }
            if (!file_exists("../../Data/Projects/".$pid)) {
                mkdir("../../Data/Projects/".$pid, 0777, true);
            }

            if(move_uploaded_file($file_tmp,"../../Data/Projects/".$pid."/".$file_name)){
                $XML_url = "Data/Projects/".$pid."/".$file_name;
                if($rvNumber ==""){ //new project schedule with no revision 
                    $sql = "INSERT INTO Project_Schedule ([Name],[Sch_Ver],[URL],[Pro_ID],[Upload_Date],[Uploaded_By],[Sch_Date],[scheduleType],[Revision],[ReasoningID]) 
                            VALUES ('$name','0','$XML_url','$pid',GETDATE(),'$user','$start','$type', '0','0')";
                    $inresult = sqlsrv_query($conn,$sql);
                    if($inresult === false){
                        $myresult['msg']="SQL Error";
                        return $myresult;
                    }	
                    else{
                        $myresult['versionNumber'] = 0;
                        $myresult['link'] = $XML_url;
                        $myresult['msg'] = "Success";
                        $myresult['schedName'] = $name;
                    }
                }
                else{
                    $sql = "INSERT INTO Project_Schedule ([Name],[Sch_Ver],[URL],[Pro_ID],[Upload_Date],[Uploaded_By],[Sch_Date],[scheduleType],[Revision],[ReasoningID],[Comment]) 
                    VALUES ('$name','$rvNumber','$XML_url','$pid',GETDATE(),'$user','$start','$type', '0','$rvReason','$rvRemarks')";
                    $inresult = sqlsrv_query($conn,$sql);
                    if($inresult === false){
                        $myresult['msg'] = "SQL Error";
                        return $myresult;
                    }
                    
                    $myresult['versionNumber'] = $rvNumber;
                    $myresult['link'] = $XML_url;
                    $sql1 = "UPDATE Project_Schedule SET Revision = 1 WHERE Pro_ID = '$pid' AND Name = '$name' AND Sch_Ver = '$rvNumber'";
                    $inresult1 = sqlsrv_query($conn,$sql1);
                    if($inresult === false){
                        $myresult['msg'] = "SQL2 Error.";
                        return $myresult;
                    }
                    else{
                        $myresult['msg'] = "Success";
                        $myresult['schedName'] = $name;
                    }
                }


                // if upload sucess update the progress schedule table PercentWorkComplete 
                // check for WBS 1 / ID 1
                if ($xmlObj) {
                    if (isset($xmlObj->Tasks)) {
                        $taskArr = json_decode(json_encode((array)$xmlObj->Tasks), TRUE);
                        
                        foreach ($taskArr['Task'] as $task) {
                            // first task with ID = 1
                            if ($task['ID'] == 1) {
                                $finActual = (isset($task['PercentWorkComplete'])) ? $task['PercentWorkComplete'] : 0;
                                $phyActual = (isset($task['PhysicalPercentComplete'])) ? $task['PhysicalPercentComplete'] : 0;
                                break;
                            }
                        }
                        $finActual = ($finActual) ? $finActual : 0;
                        $phyActual = ($phyActual) ? $phyActual : 0;

                    }

                    if($SYSTEM == 'OBYU'){
                        $sqlGetDate = "SELECT DISTINCT DATEADD(MONTH, DATEDIFF(MONTH, 0, '$start'), 0) FROM project_progress_summary WHERE pps_projectid = '$projID'"; 
                        $dateStart = sqlsrv_query($conn,$sqlGetDate);
    
                        // date from $_POST['scheduleStart'];
                        $sqlUpd = "update project_progress_summary set pps_updated_by = :0, pps_updated_date = GETDATE(), pps_physical_actual = :1, pps_financial_actual = :2 where pps_projectid = :3 and pps_month_year= :4";
                        $updRes = $CONN->execute($sqlUpd,array($user, $phyActual, $finActual, $_SESSION['projectID'], $dateStart));
                        
                        // also update all previous actual with zero
                        $sqlUpd2 = "update project_progress_summary set pps_updated_by = :0, pps_updated_date = GETDATE(), pps_physical_actual = '0', pps_financial_actual = '0' where pps_projectid = :1 and pps_physical_actual is null and pps_month_year < :2";
                        $updRes2 = $CONN->execute($sqlUpd2,array($user, $_SESSION['projectID'], $dateStart));
                    }else{
                        // date from $_POST['scheduleStart'];
                        $sqlUpd = "update project_progress_summary set pps_updated_by = :0, pps_updated_date = GETDATE(), pps_physical_actual = :1, pps_financial_actual = :2 where pps_projectid = :3 and pps_month_year= DATEADD(MONTH, DATEDIFF(MONTH, 0, :4), 0)";
                        $updRes = $CONN->execute($sqlUpd,array($user, $phyActual, $finActual, $_SESSION['projectID'], $start));
                        
                        // also update all previous actual with zero
                        $sqlUpd2 = "update project_progress_summary set pps_updated_by = :0, pps_updated_date = GETDATE(), pps_physical_actual = '0', pps_financial_actual = '0' where pps_projectid = :1 and pps_physical_actual is null and pps_month_year < DATEADD(MONTH, DATEDIFF(MONTH, 0, :2), 0)";
                        $updRes2 = $CONN->execute($sqlUpd2,array($user, $_SESSION['projectID'], $start));
                    }

                    if(!$updRes){
                        $myresult['msg'] = "SQL Error";
                        return $myresult;
                    }
                }
            }
            else{
                $myresult['msg'] = "Upload Error";
                return $myresult;
            }	
            return $myresult;
        }
        else{
            $myresult['msg'] = "upload Error";
            return $myresult;
        }
    }

    function getScheduleDetails(){
        global $conn;

        $schID = $_POST['schID'];
        $id = $_SESSION['project_id'];
        $sql = "SELECT * FROM Project_Schedule WHERE Pro_ID = '$id' AND Sch_ID = '$schID'"; 
        $res = sqlsrv_query($conn,$sql);
        if($res){
        }else{
            echo "SQL error!";
            exit();
        }
        $arr = [];
        $rvArr = [];
        while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
            $arr = $row;
        }
        $name = $arr['Name'];
        $sql = "SELECT * FROM Project_Schedule WHERE Pro_ID = '$id' AND Name = '$name' ORDER BY Sch_Ver ASC"; 
        $res = sqlsrv_query($conn,$sql);
        if(!$res){
            echo "SQL error!";
            exit();
        }
        $revision = 0;
        while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
            $rvArr[] = $row;
            if($row['Revision']){
                $revision++;
            }
        }
        $return_value['data'] = $arr;
        if($revision > 0){
            $return_value['revision'] = $rvArr;
        }else{
            $return_value['revision'] = [];

        }
        $return_json = $return_value;
        return $return_json;
    }
?>