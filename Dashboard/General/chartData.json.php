<?php 
ini_set('max_execution_time', '300');
set_time_limit(300);

//session_start();
include_once dirname(__DIR__).'\General\dashboard_executive.class.php';
$res = array();

if (!isset($_POST['page'])) {
	$res['status'] = 'error';	
	$res['errorMessage'] = 'Invalid Data!';	
}

$packageUuid = $_POST['packageUuid'];
$projectId = $_POST['projectId'];

switch ($_POST['page']) {
	case 'executiveManagement':
		$dashObj = new ExecDashboard();
		$ret = $dashObj->getExecutiveData($packageUuid, $projectId);
		if($_SESSION['project_owner'] == 'JKR_SARAWAK'){
			$sec = $dashObj->getSectionData($packageUuid, $projectId);
		}
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		if (isset($sec)){
			$res['section'] = $sec;
		}
		break;
}
echo json_encode($res);