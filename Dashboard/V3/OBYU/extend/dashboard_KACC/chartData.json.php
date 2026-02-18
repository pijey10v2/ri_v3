<?php 
set_time_limit(300);
session_start();
include_once '../../../../dashboard.class.php';

global $CONN;
$res = array();

if (!isset($_POST['page'])) {
	$res['status'] = 'error';	
	$res['errorMessage'] = 'Invalid Data!';	
}

$dashObj = RiDashboard::load($_POST['page'], true);
switch ($_POST['page']) {
	case 'summary':
		$ret = $dashObj->getSummaryInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'cost':
		$ret = $dashObj->getCostInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'document':
		// check here if the date is set
		if (isset($_POST['function']) && $_POST['function'] == 'updateInfo' && isset($_POST['year']) && isset($_POST['month'])){
			$dateArr['month'] = $_POST['month'];
			$dateArr['year'] = $_POST['year'];
			$ret = $dashObj->getDocInfo($dateArr);	
		}else{
			$ret = $dashObj->getDocInfo();	
		}
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'time':
		if (isset($_POST['function']) && $_POST['function'] == 'updateInfo' && isset($_POST['year']) && isset($_POST['month'])) {
			$ret = $dashObj->getSideDiaryData($_POST['year'], $_POST['month']);	
		}else{
			$ret = $dashObj->getTimeInfo();	
		}
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'quality':
		$ret = $dashObj->getQualityInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'qaqc':
		$ret = $dashObj->getQaqcInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
}

echo json_encode($res);