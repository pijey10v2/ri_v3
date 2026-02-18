<?php 

ini_set('max_execution_time', '300');
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
	case 'document':
		$ret = $dashObj->getDocInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'risk':
		$ret = $dashObj->getRiskInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'time':
		if (isset($_POST['function']) && $_POST['function'] == 'updateInfo' && isset($_POST['year']) && isset($_POST['month'])) {
			$ret = $dashObj->getTimeInfo($_POST['year'], $_POST['month']);
		}else{
			$ret = $dashObj->getTimeInfo();	
		}
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
	case 'hset':
		$ret = $dashObj->getHSETInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'qaqc':
		$ret = $dashObj->getQAQCInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'main':
		$ret = $dashObj->getMainInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'stakeholder':
		if (isset($_POST['function']) && $_POST['function'] == 'updateInfo' && isset($_POST['year']) && isset($_POST['month'])) {
			$ret['event2'] = $dashObj->fetchEVNTData($_POST['year'], $_POST['month']);
			$ret['pbc2'] = $dashObj->fetchPUBCForStakeholder($_POST['year'], $_POST['month']);	
		}else{
			$ret = $dashObj->getStakeInfo();	
		}
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'land':
		$ret = $dashObj->getLandInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
}

echo json_encode($res);