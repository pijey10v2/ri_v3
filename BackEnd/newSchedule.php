<?php
    session_start();
    require '../Login/include/db_connect.php';
    require '../Login/include/_include.php';
    global $CONN;

    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    $start = $_POST['scheduleStart'];
    $rvNumber = $_POST['revisionnumber'];
    $rvReason = $_POST['revisionreason'];
    $rvRemarks = $_POST['revisionremarks'];
    $name = $_POST['scheduleName'];
    $type = $_POST['scheduleType'];
    $myresult = array();
    if(isset($_FILES['xmlInp']) && !empty( $_FILES['xmlInp']['name'] )){
      if(isset($_POST['rename'])){
        $file_name = $_POST['rename'];
      }
      else{
        $file_name = $_FILES['xmlInp']['name'];
      }
      $file_tmp = $_FILES['xmlInp']['tmp_name'];
      $xmlObj = simplexml_load_file($file_tmp);
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
            echo json_encode($myresult);
            exit;
          }	
          else{
            $myresult['versionNumber'] = 0;
            $myresult['link'] = $XML_url;
            $myresult['msg'] = "Success";
          }
        }
        else{
          $sql = "INSERT INTO Project_Schedule ([Name],[Sch_Ver],[URL],[Pro_ID],[Upload_Date],[Uploaded_By],[Sch_Date],[scheduleType],[Revision],[ReasoningID],[Comment]) 
          VALUES ('$name','$rvNumber','$XML_url','$pid',GETDATE(),'$user','$start','$type', '0','$rvReason','$rvRemarks')";
          $inresult = sqlsrv_query($conn,$sql);
          if($inresult === false){
            $myresult['msg'] = "SQL Error";
            echo json_encode($myresult);
            exit;
          }
          
          $versionNumber = $rvNumber - 1;
          $myresult['versionNumber'] = $rvNumber;
          $myresult['link'] = $XML_url;
          $sql1 = "UPDATE Project_Schedule SET Revision = 1 WHERE Pro_ID = '$pid' AND Name = '$name' AND Sch_Ver = '$versionNumber'";
          $inresult1 = sqlsrv_query($conn,$sql1);
          if($inresult === false){
            $myresult['msg'] = "SQL2 Error.";
            echo json_encode($myresult);
            exit;
          }
          else{
            $myresult['msg'] = "Success";
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
                $finActual = $task['PercentWorkComplete'];
                $phyActual = $task['PhysicalPercentComplete'];
                break;
              }
            }
            $finActual = ($finActual) ? $finActual : 0;
            $phyActual = ($phyActual) ? $phyActual : 0;

          }
        }
        // date from $_POST['scheduleStart'];
        $sqlUpd = "update project_progress_summary set pps_updated_by = :0, pps_updated_date = GETDATE(), pps_physical_actual = :1, pps_financial_actual = :2 where pps_month_year= DATEADD(MONTH, DATEDIFF(MONTH, 0, :3), 0) and pps_projectid = :4";
        $updRes = $CONN->execute($sqlUpd,array($user, $phyActual, $finActual, $start, $_SESSION['projectID']));

        // also update all previous actual with zero
        $sqlUpd2 = "update project_progress_summary set pps_updated_by = :0, pps_updated_date = GETDATE(), pps_physical_actual = '0', pps_financial_actual = '0' where pps_month_year < DATEADD(MONTH, DATEDIFF(MONTH, 0, :1), 0) and pps_projectid = :2 and pps_physical_actual is null";
        $updRes2 = $CONN->execute($sqlUpd2,array($user, $start, $_SESSION['projectID']));

        // print_r($_SESSION['projectID']);
        // print_r($sqlUpd2);
        if(!$updRes){
            $myresult['msg'] = "SQL Error";
            echo json_encode($myresult);
            exit;
        }
      }
      else{
        $myresult['msg'] = "Upload Error";
        echo json_encode($myresult);
        exit;
      }	
      echo json_encode($myresult);
        exit;
  }
  else{
      $myresult['msg'] = "upload Error";
      echo json_encode($myresult);
      exit;
    }
?>