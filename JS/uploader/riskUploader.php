<?php 
session_start();
include_once 'lib/SimpleXLSX.php';
include_once './../../Login/include/_include.php';

global $CONN;

$ret = array();

if (!isset($_POST["functionName"])) die('Error! Invalid parameter.');

function riskTableData(){
	global $CONN;
	$projectID =  $_SESSION['projectID'];
	// fetch by this month
	// histogram data
	$projRiskHistInfo = $CONN->fetchAll("select * from risk_histogram_data where rhd_ruf_id = (select max(ruf_id) from risk_uploaded_file where ruf_projectId = :0) ORDER BY CAST(rhd_bins AS FLOAT) asc", array($projectID));
	// probability data
	$riskProbData = $CONN->fetchRow("select * from risk_probability_data where rpd_ruf_id = (select max(ruf_id) from risk_uploaded_file where ruf_projectId = :0)", array($projectID));
	
	// fetch uploaded file
	$uplodedFileInfo = $CONN->fetchAll("select * from risk_uploaded_file where ruf_projectId =:0 and ruf_imported_histogram_data_flg = '1' order by ruf_upload_date asc", array($projectID));

 	$ret['status'] = 'success'; 
 	$ret['data'] = array(
 			'projRiskHistInfo' => $projRiskHistInfo,
 			'riskProbData' => $riskProbData,
 			'uplodedFileInfo' => $uplodedFileInfo 
	);
	return $ret; 
}

function riskExcelUpload($_files){
	if ($_files["type"] != "application/xls" && $_files["type"] != "application/vnd.ms-excel" && $_files["type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
			$ret = array(
				'status' => 'error',
				'errorMessage' => 'Invalid excel file'
			);
			return $ret;
	}

	global $CONN;
	$ret = array();

	$projectID =  $_SESSION['projectID'];
	$t=time();
	$tmpfilePath = $_files['tmp_name'];
	$fileDir = '../Data/Others/riskUpload/'.$projectID.'/'.$t;
	if (!file_exists('./../../'.$fileDir)) {
	   mkdir('./../../'.$fileDir, 0777, true);
	}
	$fileName = $_files['name'];
	$filePath = $fileDir.'/'.$fileName;
	$fileRelPath = './../../'.$filePath;

	$moveOk = move_uploaded_file($tmpfilePath, $fileRelPath) ;
	if (!$moveOk) {
		$ret = array(
			'status' => 'error',
			'errorMessage' => 'Eror uploading file.'
		);
		return $ret;
	}

	// insert into risk_uploaded_file
	$insRUF = $CONN->execute("insert into risk_uploaded_file (ruf_projectId, ruf_upload_by, ruf_imported_histogram_data_flg, ruf_file_path, ruf_file_name) values (:0, :1, :2, :3, :4)", array($projectID, $_SESSION['email'], '0', $filePath, $fileName));
	if (!$insRUF) {
		$ret = array(
			'status' => 'error',
			'errorMessage' => 'SQL Error'
		);
		return $ret;	
	}

	// to update ruf_imported_histogram_data_flg after import data
	$rufID = $CONN->getLastInsertID();

	if ( $xlsx = SimpleXLSX::parse($fileRelPath) ) {
		/* 
			check 3rd sheet name = 'WP'
		 	check 3rd sheet row[48] (in excel a49) contains Bin Count Scaled Cum
		 		- in excel it start from 1 here start from 0 
		 	if exist then start pick the value
		 	if success upload the need to upload the file to server and another table
		*/
		 $sheetNo = 0; // start from 0
		 $histogramPlotTbRow = 48; // start from 0
		 if ($xlsx->sheetName($sheetNo) == 'WP') {
	 		if (!$xlsx->rows($sheetNo)[$histogramPlotTbRow][0] && strtoupper($xlsx->rows($sheetNo)[$histogramPlotTbRow][0]) != 'BINS') {
	 			$ret = array(
	 				'status' => 'error',
					'errorMessage' => 'Template Error'
	 			);
	 			return $ret;
	 		}
	 		// store from [49] - [89]
			for ($i=49; $i <89 ; $i++) { 
				if(!$xlsx->rows($sheetNo)[$i][0] && !$xlsx->rows($sheetNo)[$i][1] && !$xlsx->rows($sheetNo)[$i][2] && !$xlsx->rows($sheetNo)[$i][3]) continue;
				// [0] => Bins, [1] => Count, [2] => Scaled, [3] => Cum
				$monthYr = date('01-m-Y');
				$dataArr = array(
					$rufID,
					($xlsx->rows($sheetNo)[$i][0]) ? (float) number_format($xlsx->rows($sheetNo)[$i][0], 4) : '0',
					($xlsx->rows($sheetNo)[$i][1]) ? (float) $xlsx->rows($sheetNo)[$i][1] : '0',
					($xlsx->rows($sheetNo)[$i][2]) ? (float) number_format($xlsx->rows($sheetNo)[$i][2], 4) : '0',
					($xlsx->rows($sheetNo)[$i][3]) ? (float) number_format($xlsx->rows($sheetNo)[$i][3], 4)*100 : '0',
					$_POST['date'],
					$projectID					
				);

				$insOk = $CONN->execute("insert into risk_histogram_data (rhd_ruf_id, rhd_bins, rhd_count, rhd_scaled, rhd_cum, rhd_month_year, rhd_projectId) values (:0, :1, :2, :3, :4, :5, :6)", $dataArr);
				if (!$insOk) {
					$ret['status'] = 'error'; 
					$ret['errorMessage'] = "SQL Error!";
					return $ret;
				}
			}
			// Probability data
			// get remaining duration // c34 ==> [33][2]
			$remainDur = (isset($xlsx->rows($sheetNo)['33']['2'])) ? number_format($xlsx->rows($sheetNo)['33']['2'], 2) : 0;

			// get probability completing per schedule // d36 ==> [35][3]
			$probComplete = (isset($xlsx->rows($sheetNo)['35']['3'])) ? ($xlsx->rows($sheetNo)['35']['3']*100) : 0;

			// get overall project schedule impact uncertainty // d35 ==> [34][3]
			$scheduleImpUncer = (isset($xlsx->rows($sheetNo)['34']['3'])) ? ($xlsx->rows($sheetNo)['34']['3']*100) : 0;

			// get timely completion probability // d37 ==> [36][3]
			$timelyCompProb = (isset($xlsx->rows($sheetNo)['36']['3'])) ? ($xlsx->rows($sheetNo)['36']['3']*100) : 0;

			$probDataArr = array($projectID, $rufID, $remainDur, $probComplete, $scheduleImpUncer, $timelyCompProb, $_POST['date']);
			$probInsOk = $CONN->execute("insert into risk_probability_data (rpd_projectId, rpd_ruf_id, rpd_project_remain_dur, rpd_project_prob_complete, rpd_overall_schedule_impact_uncer, rpd_timely_completion_prob, rpd_month_year) values (:0, :1, :2, :3, :4, :5, :6)", $probDataArr);
			if (!$probInsOk) {
				$ret['status'] = 'error'; 
				$ret['errorMessage'] = "SQL Error!";
					return $ret;
			}				
			// update flag in risk_uploaded_file after successfully import data
			$CONN->execute("update risk_uploaded_file set ruf_imported_histogram_data_flg = '1' where ruf_id=:0", array($rufID));
			$ret['status'] = 'success'; 
		 }else{
			$ret['status'] = 'error'; 
			$ret['errorMessage'] = 'Template error. Invalid sheet name'; 	 	
		 }

	} else {
		$ret['status'] = 'error'; 
		$ret['errorMessage'] = SimpleXLSX::parseError(); 
	}

	return $ret;
}

switch ($_POST["functionName"]) {
	case 'riskExcelUpload':
		if (isset($_FILES['file'])) {
			$ret = riskExcelUpload($_FILES['file']);
		}else{
			$ret['status'] = 'error'; 
			$ret['errorMessage'] = 'Upload Error. File not found.';
		}
		break;
	case 'riskTableData':
		$ret = riskTableData();
		break;
	default:
			$ret['status'] = 'error'; 
			$ret['errorMessage'] = 'Invalid parameter.';
		break;
}

echo json_encode($ret);