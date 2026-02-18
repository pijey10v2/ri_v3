<?php 
ini_set('max_execution_time', '300');
set_time_limit(300);

session_start();
include_once dirname(__DIR__).'../Login/include/_include.php';
include_once dirname(__DIR__).'/dashboard/dashboard.class.php';
global $CONN;
$res = array();


if (!isset($_POST['page'])) {
	$res['status'] = 'error';	
	$res['errorMessage'] = 'Invalid Data!';	
}

$currYr = (isset($_POST['currYr'])) ? $_POST['currYr'] : '';
$currMth = (isset($_POST['currMth'])) ? $_POST['currMth'] : '';
$prevMth = (isset($_POST['prevMth'])) ? $_POST['prevMth'] : '';
$prevYr = (isset($_POST['prevYr'])) ? $_POST['prevYr'] : '';

switch ($_POST['page']) {
	case 'risk':
		$dashObj = new RiDashboard('risk', true, false);
		$ret = $dashObj->getRiskInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'utilities':
		$dashObj = new RiDashboard('utilities', true);
		$ret = $dashObj->getUtilitiesInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'land':
		$dashObj = new RiDashboard('land', true, false);
		$packageId = (isset($_POST['packageId'])) ? $_POST['packageId'] : '';
		$year = (isset($_POST['year'])) ? $_POST['year'] : '';
		$month = (isset($_POST['month'])) ? $_POST['month'] : '';
		$ret = $dashObj->getLandInfo($packageId,$year,$month);	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'bumi':
		$dashObj = new RiDashboard('bumi', true, false);
		$ret = $dashObj->getBumiInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'projectSummary':
		$dashObj = new RiDashboard('projectSummary', true, false);
		$ret = $dashObj->getProjectSummaryInfo($_SESSION['projectID']);	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'HSE':
		$dashObj = new RiDashboard('HSE', true, false);
		$ret = $dashObj->getHSEInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'quality':
		$dashObj = new RiDashboard('quality', true, false);
		$ret = $dashObj->getQualityInfo();
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'document':
		$dashObj = new RiDashboard('document', true, false);
		$ret = $dashObj->getDocumentInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'publicComplaint':
		$dashObj = new RiDashboard('publicComplaint', true, false);
		$ret = $dashObj->getPublicComplaintInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'procurement':
		$dashObj = new RiDashboard('procurement', true, false);
		$ret = $dashObj->getProcurementInfo();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'planningManagement':
		$dashObj = new RiDashboard('planningManagement', true, false);
		$ret = $dashObj->getReportSubmissionInfo($currYr, $currMth, $prevMth, $prevYr);	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'statistic':
		$dashObj = new RiDashboard('statistic', true);
		$ret = $dashObj->getAssetStatistic();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'PCA_Analysis':
		$dateFilter = filter_input(INPUT_POST, 'dateFilter', FILTER_SANITIZE_STRING);
		$laneFilter = filter_input(INPUT_POST, 'laneFilter', FILTER_SANITIZE_STRING);
		$chgFromFilter = filter_input(INPUT_POST, 'chgFromFilter', FILTER_SANITIZE_STRING);
		$chgToFilter = filter_input(INPUT_POST, 'chgToFilter', FILTER_SANITIZE_STRING);
		
		$dashObj = new RiDashboard('PCA_Analysis', true);
		$ret = $dashObj->getPCAAnalysis($dateFilter, $laneFilter, $chgFromFilter, $chgToFilter);	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'PCA_Stripmap':
		$dashObj = new RiDashboard('PCA_Stripmap', true);
		if(isset($_POST['selDate']) && isset($_POST['func']) && $_POST['func'] == 'updateData'){
			$ret = $dashObj->getPCAStripmap($_POST['selDate']);	
		}else{
			$ret = $dashObj->getPCAStripmap();	
		}
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;	
		}
		break;
	case 'nod':
		$dashObj = new RiDashboard('nod', true);
		$ret = $dashObj->getNoticeOfDefect();	
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'maintenanceProg':
		$dashObj = new RiDashboard('maintenanceProg', true);
		$ret = $dashObj->getMaintenanceProg();
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
	case 'heavyMaintenance':
		$dashObj = new RiDashboard('heavyMaintenance', true);
		$ret = $dashObj->getHeavyMaintenance();
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
}
echo json_encode($res);