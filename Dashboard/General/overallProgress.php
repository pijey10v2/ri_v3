<?php
session_start();
require dirname(__DIR__).'/../login/include/_include.php';
$res = array();

class overallCard {
	function fetchOverallProgressCard(){
		global $JOGETDOMAIN, $JOGETIP;
		global $JOGETADMINUSER, $JOGETADMINPWD;
		global $PROJECTIDNOSBH, $CONN;
		$this->jogetHost = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $JOGETDOMAIN : $JOGETIP;
		$this->jogetAdminUser = $JOGETADMINUSER;
		$this->jogetAdminPwd = $JOGETADMINPWD;
		
		$getSql = "SELECT CONCAT(project_id_number, '_', project_id, '_', project_id_number) as package_uuid FROM projects WHERE project_id_number=:0";
		$getProjeId = $CONN->fetchOne($getSql, array($PROJECTIDNOSBH));

		$project_phase_param = '';
		if($_SESSION['user_org'] == 'pmc_1b'){
			$project_phase_param = "&project_phase=1B";
		}else if($_SESSION['user_org'] == 'HSSI'){
			$project_phase_param = "&project_phase=1A"; 
		}
		
		
		$ret = array();
		$url = $this->jogetHost."jw/web/json/data/list/ri_construct/list_opuCardForm?d-3341121-fn_package_uuid=".$getProjeId.$project_phase_param;
		$res = $this->jogetCURL($url);
		$ret['getSql'] = $getSql;
		$ret['getProjeId'] = $getProjeId;
		$ret['url'] = $url;
		$ret['user_org'] = $_SESSION['user_org'];

		
	
		if (isset($res['data'])) {
			$dataArr = $res['data'];
			$mainFlag1A = false;
			$mainFlag1B = false;
	
			if($dataArr){
				foreach ($dataArr as $overallProg) {
					// based on month and year
					$year = $overallProg['year'];
					$currPhysical = $overallProg['curr_month_physical'];
					$prevPhysical = $overallProg['prev_month_physical'];
					$variance = $overallProg['variance'];
					$flag1a = $overallProg['flag_1a'];
					$flag1b = $overallProg['flag_1b'];

					$month = (int)$overallProg['month'];
					$monthName = date('M', mktime(0, 0, 0, $month, 10));

					$phase = ($overallProg['project_phase'] !== '') ? $overallProg['project_phase'] : '1B';

					if($mainFlag1A == false && $flag1a == true){
						$mainFlag1A = true;
					}

					if($mainFlag1B == false && $flag1b == true){
						$mainFlag1B = true;
					}
	
					$ret['overall'][$year][$monthName][$phase]['curr_month_physical'] = $currPhysical;
					$ret['overall'][$year][$monthName][$phase]['prev_month_physical'] = $prevPhysical;
					$ret['overall'][$year][$monthName][$phase]['variance'] = $variance;
					$ret['overall']['flag1A'] = $mainFlag1A;
					$ret['overall']['flag1B'] = $mainFlag1B;
				}
			}
		}
		return $ret;
	}

	function jogetCURL($url, $row = false){
		if (!$url) return false;
		$headers = array(
			'Content-Type: application/json',
			'Authorization: Basic ' . base64_encode("$this->jogetAdminUser:$this->jogetAdminPwd")
		);
		$url = $url.'&rows='.(($row) ? $row : '90000');
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_TIMEOUT, 30);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, 1000);
		$return = curl_exec($ch);
		$err    = curl_error($ch);
		curl_close($ch);
		if ($err) {
			return false;
		} else {
			return json_decode($return, true);
		}	
	}
}

if (!isset($_POST['page'])) {
	$res['status'] = 'error';	
	$res['errorMessage'] = 'Invalid Data!';	
}

switch ($_POST['page']) {
	case 'overall':
		$overallObj = new overallCard();	
		$ret = $overallObj->fetchOverallProgressCard();
		if ($ret) {
			$res['status'] = 'ok';	
			$res['data'] = $ret;		
		}
		break;
}
echo json_encode($res);