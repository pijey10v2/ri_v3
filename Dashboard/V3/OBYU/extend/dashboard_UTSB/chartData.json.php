<?php 
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
		// $ret = true;	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
}

echo json_encode($res);