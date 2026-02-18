<?php 
session_start();
include_once 'lib/SimpleXLSX.php';
include_once './../../Login/include/_include.php';

global $CONN;

$ret = array();

$projectID =  $_SESSION['projectID'];
$projectWpcId =  $_SESSION['wpc_id'];

// handle the upload
if (isset($_POST["functionName"]) && $_POST["functionName"] == "progressExcelUpload" && isset($_FILES['file'])) {
	$filePath = $_FILES['file']['tmp_name'];

	if ( $xlsx = SimpleXLSX::parse($filePath) ) {
		$pps_financial_early_cm = $pps_financial_late_cm = $pps_physical_early_cm = $pps_physical_late_cm = 0;
		
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

	} else {
		$ret['status'] = 'error'; 
		$ret['errorMessage'] = SimpleXLSX::parseError(); 
	}
}

if (isset($_POST["functionName"]) && $_POST["functionName"] == "progressTableData") {
	$projProgressInfo = $CONN->fetchAll("select * from project_progress_summary where pps_projectid =:0", array($projectID));
	if ($projProgressInfo) {
	 	$ret['status'] = 'success'; 
	 	$ret['data'] = $projProgressInfo; 
	} else{
	 	$ret['status'] = 'noData'; 
	 	$ret['data'] = array(); 
	}
}

echo json_encode($ret);