<?php 
session_start();
include_once 'lib/SimpleXLSX.php';
include_once './../../Login/include/_include.php';
include_once dirname(__DIR__).'../../Login/app_properties.php';

global $CONN, $SYSTEM;
$ret = array();

if($SYSTEM == "OBYU"){
    if(isset($_SESSION['projectID'])){
        $projectID =  (isset($_POST['selWPC']) && $_POST['selWPC'] != '' && $_POST['selWPC'] !== 'false') ? $_POST['selWPC'] : $_SESSION['projectID'];
    }
}else{
    if(isset($_SESSION['projectID'])){
        $projectID =  $_SESSION['projectID'];
    }

    if(isset($_SESSION['wpc_id'])){
        $projectWpcId =  $_SESSION['wpc_id'];
    }else{
        $projectWpcId =  "";
    }
}


// handle the upload
if (isset($_POST["functionName"]) && $_POST["functionName"] == "progressExcelUpload" && isset($_FILES['file'])) {
	$filePath = $_FILES['file']['tmp_name'];
    if($SYSTEM == "OBYU"){
        $section = (isset($_POST['section'])) ? $_POST['section'] : '';
    }

	if ( $xlsx = SimpleXLSX::parse($filePath) ) {
        if($SYSTEM == "OBYU"){
            $delOk = $CONN->execute("delete from project_progress_summary where pps_projectid =:0 and pps_section =:1", array($projectID, $section));
        }
		$pps_financial_early_cm = $pps_financial_late_cm = $pps_physical_early_cm = $pps_physical_late_cm = 0;
		
        if($SYSTEM == "KKR"){
            foreach ( $xlsx->rows() as $r => $row ) {
                if ( $r === 0 || $r === 1 ) {
                    // ignore 2 header
                    continue;
                }
    
                if(($row[1] && !is_numeric($row[1])) || ($row[2] && !is_numeric($row[2])) || ($row[3] && !is_numeric($row[3])) || ($row[4] && !is_numeric($row[4])) || ($row[5] && !is_numeric($row[5])) || ($row[6] && !is_numeric($row[6]))){
                    $ret['status'] = 'error'; 
                    $ret['errorMessage'] = 'Contain non numeric value: ' .$row[0]; 
                    echo json_encode($ret);
                    exit;
                }
            }

            // clean up all data before upload as it should be only one time
            $delOk = $CONN->execute("delete from project_progress_summary where pps_projectid =:0", array($projectID));
    
            foreach ( $xlsx->rows() as $r => $row ) {
                if ( $r === 0 || $r === 1 ) {
                    // ignore 2 header
                    continue;
                }
    
                // calculate cumulative
                $pps_financial_early_cm = ($row[1]) ? (float) number_format($row[1]*100, 10) : "0";
                $pps_financial_late_cm = ($row[3]) ? (float) number_format($row[3]*100, 10) : "0";
    
                $updVal = array(
                    "pps_updated_by" => $_SESSION["email"],
                    "pps_financial_early"=> ($row[1]) ? (float) number_format($row[1]*100, 10) : "0",
                    "pps_financial_early_val"=> ($row[2]) ? (float) number_format($row[2]*100, 10) : "0",
                    "pps_financial_late" => ($row[3]) ? (float) number_format($row[3]*100, 10) : "0",
                    "pps_financial_late_val" => ($row[4]) ? (float) number_format($row[4]*100, 10) : "0",
                    "pps_physical_early" => ($row[5]) ? (float) number_format($row[5]*100, 10) : "0",
                    "pps_physical_late" => ($row[6]) ? (float) number_format($row[6]*100, 10) : "0",
                    "pps_month_year" => $row[0],
                    "pps_projectid" => $projectID,
                    "pps_project_wpc_id" => $projectWpcId,
                    "pps_financial_early_cm" => $pps_financial_early_cm,
                    "pps_financial_late_cm" => $pps_financial_late_cm,
                );
    
                $updVal['pps_created_by'] = $_SESSION["email"];
                $insSql = "insert into project_progress_summary (pps_projectid, pps_project_wpc_id, pps_created_by, pps_updated_by, pps_month_year, pps_financial_early_val, pps_financial_late_val, pps_financial_early, pps_financial_late, pps_physical_early, pps_physical_late, pps_financial_early_cm, pps_financial_late_cm) values (:pps_projectid, :pps_project_wpc_id, :pps_created_by, :pps_updated_by, :pps_month_year, :pps_financial_early_val, :pps_financial_late_val, :pps_financial_early, :pps_financial_late, :pps_physical_early, :pps_physical_late, :pps_financial_early_cm, :pps_financial_late_cm)";
                $insOk = $CONN->execute($insSql, $updVal);
    
                if (!$insOk){
                    $ret['status'] = 'error'; 
                    $ret['errorMessage'] = "SQL Error!"; 
                }else{
                    $ret['status'] = 'success'; 
                }
            }
        }else{
            foreach ( $xlsx->rows()[0] as $r => $row ) {
                // skip ab
                if ( $r === 0 || $r === 1 ) {
                    continue;
                }
                // 0 - date, 1 - financial early, 2 - financial late, 3 - physical early, 4 - physical late
                // calculate cumulative
                $pps_financial_early_cm = (float)$xlsx->rows()[1][$r]*100;
                $pps_financial_late_cm = (float)$xlsx->rows()[2][$r]*100;
    
                $updVal = array(
                    "pps_updated_by" => $_SESSION["email"],
                    "pps_physical_early" => ($xlsx->rows()[3][$r]) ? (float) number_format($xlsx->rows()[3][$r]*100, 10) : "0",
                    "pps_physical_late" => ($xlsx->rows()[4][$r]) ? (float) number_format($xlsx->rows()[4][$r]*100, 10) : "0",
                    "pps_month_year" => $row,
                    "pps_projectid" => $projectID,
                    "pps_financial_early_cm" => $pps_financial_early_cm,
                    "pps_financial_late_cm" => $pps_financial_late_cm,
                    "pps_section" => $section
                );
                $updVal['pps_created_by'] = $_SESSION["email"];
                $insSql = "insert into project_progress_summary (pps_projectid, pps_created_by, pps_updated_by, pps_month_year, pps_physical_early, pps_physical_late, pps_financial_early_cm, pps_financial_late_cm, pps_section) values (:pps_projectid, :pps_created_by, :pps_updated_by, :pps_month_year, :pps_physical_early, :pps_physical_late, :pps_financial_early_cm, :pps_financial_late_cm, :pps_section)";
                $insOk = $CONN->execute($insSql, $updVal);
                if (!$insOk) {
                    $ret['status'] = 'error'; 
                    $ret['errorMessage'] = "SQL Error!"; 
                }
            }
            $ret['status'] = 'success'; 
        }
	} else {
		$ret['status'] = 'error'; 
		$ret['errorMessage'] = SimpleXLSX::parseError(); 
	}
}

if (isset($_POST["functionName"]) && $_POST["functionName"] == "progressTableData") {
    if($SYSTEM == "OBYU"){
        if (isset($_POST['section']) && $_POST['section']) {
            $sql = "select * from project_progress_summary where pps_projectid =:0 and pps_section =:1 order by pps_month_year asc";
            $projProgressInfo = $CONN->fetchAll($sql, array($projectID, $_POST['section']));
        }else{
            $sql = "select * from project_progress_summary where pps_projectid =:0 order by pps_month_year asc";
            $projProgressInfo = $CONN->fetchAll($sql, array($projectID));
        }
    }else{
        $projProgressInfo = $CONN->fetchAll("select * from project_progress_summary where pps_projectid =:0", array($projectID));
    }

	if ($projProgressInfo) {
	 	$ret['status'] = 'success'; 
	 	$ret['data'] = $projProgressInfo; 
	} else{
	 	$ret['status'] = 'noData'; 
	 	$ret['data'] = array(); 
	}
}

if($SYSTEM == "OBYU"){
    if (isset($_POST["functionName"]) && $_POST["functionName"] == "sectionOption") {
        include_once("./../../BackEnd/class/jogetLink.class.php");
        $constructLinkObj = new JogetLink();
        $constructLinkObj->getLink('document');
        if (isset($constructLinkObj->jogetAppLink['api']['document_list_section'])) {
            $url = $constructLinkObj->jogetAppLink['api']['document_list_section'].'&rows=9999';
            $usr = $constructLinkObj->getAdminUserName();
            $pwd = $constructLinkObj->getAdminUserPassword();
             $headers = array(
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode("$usr:$pwd")
            );
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            $return = curl_exec($ch);
            $err    = curl_error($ch);
            curl_close($ch);
    
            $retArr = ($return) ? json_decode($return, true) : [];
            if (isset($retArr['data'])) {
                $tempArr = array();
                foreach ($retArr['data'] as $section) {
                    $tempArr[] = $section['section_name'];
                }
                sort($tempArr);
                 $ret['status'] = 'success'; 
                 $ret['data'] = $tempArr; 
            }else{
                 $ret['status'] = 'error'; 
                 $ret['data'] = array(); 
            }
        } else if(isset($constructLinkObj->jogetAppLink['document_list_section'])){
            $url = $constructLinkObj->jogetAppLink['document_list_section'].'&rows=9999';
            $usr = $constructLinkObj->getAdminUserName();
            $pwd = $constructLinkObj->getAdminUserPassword();
             $headers = array(
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode("$usr:$pwd")
            );
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            $return = curl_exec($ch);
            $err    = curl_error($ch);
            curl_close($ch);
    
            $retArr = ($return) ? json_decode($return, true) : [];
            if (isset($retArr['data'])) {
                $tempArr = array();
                foreach ($retArr['data'] as $section) {
                    $tempArr[] = $section['section_name'];
                }
                sort($tempArr);
                 $ret['status'] = 'success'; 
                 $ret['data'] = $tempArr; 
            }else{
                 $ret['status'] = 'error'; 
                 $ret['data'] = array(); 
            }
        }else{
             $ret['status'] = 'error'; 
             $ret['data'] = array(); 
        }
    }
}

echo json_encode($ret);