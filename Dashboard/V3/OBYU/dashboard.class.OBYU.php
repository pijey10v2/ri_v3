<?php
$pathRel = '../../../';
include_once dirname(__FILE__).'/'.$pathRel.'Login/include/_include.php';

/*
Note
- There will be no data for project only package
- As there is no project info on Package yet - need to loop throgh all the package to get data under the project
*/

class RiDashboard
{
	var $db;
	var $dashboard;
	var $projectInfo;
	var $projectID;
	var $parentProjectID;
	var $childProjectInfo;
	var $childProjectList;
	var $isWPC;
	var $ownerOrg;
	var $jogetLinkObj;
	var $pathRel = '../../../';
	var $cutOffDate = false;
	var $enableMenu = true;
	var $WPCOptions = array();
	var $WPCOptionsV3 = array();
	var $yearOptions = array();
	var $sectionOptions = array();
	var $mthLookUp = array('01' =>'JAN','1' =>'JAN','02' =>'FEB','2' =>'FEB','03' =>'MAR','3' =>'MAR','04' =>'APR','4' =>'APR','05' =>'MAY','5' =>'MAY','06' =>'JUN','6' =>'JUN','07' =>'JUL','7' =>'JUL','08' =>'AUG','8' =>'AUG','09' =>'SEP','9' =>'SEP','10' =>'OCT','11' =>'NOV','12' =>'DEC', 'JANUARY' => 'JAN','FEBRUARY' => 'FEB','MARCH' => 'MAR','APRIL' => 'APR','MAY' => 'MAY','JUNE' => 'JUN','JULY' => 'JUL','AUGUST' => 'AUG','SEPTEMBER' => 'SEP','OCTOBER' => 'OCT','NOVEMBER' => 'NOV','DECEMBER' => 'DEC');

	private $jogetHost;
	private $api_username;
	private $api_password;

	function __construct($dash = false, $ajax = false){
		global $CONN;

		// check session
		if (session_status() == PHP_SESSION_NONE) session_start();
		if (!isset($_SESSION['projectID'])) die("Session Error! Please Refresh");
		$this->projectID = $_SESSION['projectID'];
		$this->parentProjectID = (isset($_SESSION['is_Parent']) && ($_SESSION['is_Parent'] != "isParent")) ? $_SESSION['parent_project_id'] : $_SESSION['projectID'];
		$this->project_org = $_SESSION['project_owner'];

		$appListsEncode = json_decode($_SESSION['appsLinks']);
	    if($appListsEncode->constructPackage_name){
			$packageInfoArr = explode('::', $appListsEncode->constructPackage_name);
			$this->jogetConstructApp = $packageInfoArr[0];
		}

		if($appListsEncode->documentPackage_name){
			$packageDocInfoArr = explode('::', $appListsEncode->documentPackage_name);
			$this->jogetDocApp = $packageDocInfoArr[0];
		}

		$this->db = $CONN;

		if (!$this->jogetHost) {
			include_once dirname(__FILE__).'/'.$this->pathRel.'Backend/class/jogetLink.class.php';
			$this->jogetLinkObj = new JogetLink();
			$this->api_username = $this->jogetLinkObj->getAdminUserName();
			$this->api_password = $this->jogetLinkObj->getAdminUserPassword();
			$this->jogetHost = $this->jogetLinkObj->jogetHost;
		}

		if ($dash) {
			$this->dashboard = $dash;
			if (!$ajax) {
				$this->loadJS();
			}

		}

		$this->loadInfo();
	}

	public static function load($dash = false, $ajax = false){
		// check if extended class exists then return
		$obj = false;
		if (session_status() == PHP_SESSION_NONE) session_start();
		$ownerOrg = isset($_SESSION['project_owner']) ? $_SESSION['project_owner'] : '';
		if ($ownerOrg) {
			$classPath = dirname(__FILE__).'/extend/dashboard_'.$ownerOrg.'/dashboard_'.$ownerOrg.'.class.php';
			$className = 'RiDashboard'.$ownerOrg;
			if (file_exists($classPath)) {
				include_once $classPath;
			    $obj = new $className($dash, $ajax);
			}
		}
		if (!$obj) {
		    $obj = new RiDashboard($dash, $ajax);
		}
	    return $obj;
	}

	function getDashboardList(){
		// default dashboard list
		$ret = array(
			'projectSummary' => array(
					'path' => 'projectSummary.php',
					'name' => 'Project Summary'
				),
			'HSE' => array(
					'path' => 'HSE.php',
					'name' => 'HSE'
				),
			'Land' => array(
					'path' => 'Land.php',
					'name' => 'Land'
				),
			'Utilities' => array(
					'path' => 'Utilities.php',
					'name' => 'URW'
				),
			'QAQC' => array(
					'path' => 'QAQC.php',
					'name' => 'QAQC'
				),
			'Risk' => array(
					'path' => 'Risk.php',
					'name' => 'Risk'
				),
			'Bumi' => array(
					'path' => 'Bumi.php',
					'name' => 'Bumiputera'
				)
		);

		return $ret;
	}

	function loadJS(){
		// load highcharts and jquery module
		echo '
		<script src="'.$this->pathRel.'../../JS/JsLibrary/jquery-3.5.1.js"></script>
		<script src="'.$this->pathRel.'../../JS/highchart/v11/highcharts.js"></script>
		<script src="'.$this->pathRel.'../../JS/highchart/v11/highcharts.js"></script>
		<script src="../../JS/dashboard.js"></script>
		';
		
		
		switch ($this->dashboard) {
			case 'projectSummary':
				echo '<script src="JS/projectSummary.js"></script>';
				$this->enableMenu = false;
				break;
			case 'HSE':
				echo '<script src="JS/HSE.js"></script>';
				$this->enableMenu = false;
				break;
			case 'QAQC':
				echo '<script src="JS/QAQC.js"></script>';
				$this->enableMenu = false;
				break;
			case 'utilities':
				echo '<script src="JS/utilities.js"></script>';
				$this->enableMenu = false;
				break;
			case 'risk':
				echo '<script src="JS/risk.js"></script>';
				$this->enableMenu = false;
				break;
		}

		// disable all for now as it return error on highcharts
		if ($this->enableMenu) {
			echo '<script src="https://code.highcharts.com/11/modules/series-label.js"></script>
	        <script src="https://code.highcharts.com/11/modules/exporting.js"></script>
	        <script src="https://code.highcharts.com/11/modules/export-data.js"></script>
	        <script src="https://code.highcharts.com/11/modules/accessibility.js"></script>';
		}
	}

	function loadWorkPackageOption(){
		// parent is overall
		$this->WPCOptions['overall'] = 'Overall';
		$this->WPCOptionsV3['overall'] = 'Overall';
		foreach ($this->childProjectInfo as $child) {
			$this->WPCOptions[$child['project_id']] = $child['project_name'].' ('.$child['project_id'].')';
			$this->WPCOptionsV3[$child['project_id']] = $child['project_name'].' ('.$child['project_id'].')';
		}
	}

	function loadYearOption(){
        $endYear = date("Y",strtotime($this->projectInfo['end_date']));
        $startYear = date("Y",strtotime($this->projectInfo['start_date']));
        $yearDiff = $endYear - $startYear;

        $yr = $startYear;
        for ($i=0; $i < $yearDiff+1 ; $i++) {
        	$nYr = $yr++; 
			$this->yearOptions['overall'][] = $nYr;
        }


		foreach ($this->childProjectInfo as $childID) {
			$endYear = date("Y",strtotime($childID['end_date']));
			$startYear = date("Y",strtotime($childID['start_date']));
			$yearDiff = $endYear - $startYear;

			$yr = $startYear;
			for ($i=0; $i < $yearDiff+1 ; $i++) {
				$nYr = $yr++; 
				$this->yearOptions[$childID['project_id']][] = $nYr;
			}
		}
	}

	function loadProjectInfo(){
		$this->projectInfo = $this->db->fetchRow("select * from projects where project_id =:0", array($this->projectID));
		if (!$this->projectInfo) die('Failed to retrieve project Information');
		$this->projectInfo['cut_off_day'] = ($this->projectInfo['cut_off_day']) ? $this->projectInfo['cut_off_day'] : 25;

		$imgPath =  realpath(dirname(__FILE__).'/../../../../'.$this->projectInfo['icon_url']);
		// check image url
		$this->projectInfo['icon_url'] = file_exists($imgPath) ? '../' . $this->projectInfo['icon_url'] : 'revicons.ico';

		// check if parent project or not
		$this->isWPC = ($this->projectInfo['parent_project_id_number']) ? true : false;

		// get child project infomation
		$this->childProjectInfo = $this->db->fetchAll("select * from projects where parent_project_id_number = :0 and status = 'active'", array($this->projectInfo['project_id_number']));

		// get cut off date
		$cutoffDay = (isset($this->projectInfo['cut_off_day']) && $this->projectInfo['cut_off_day']) ? $this->projectInfo['cut_off_day'] : '25';
		
		$endDateObj = DateTime::createFromFormat('j-n-Y', $cutoffDay.'-'.date('m').'-'.date('Y'));
		// if already pass cut off then this month, else previous month;
		if (date('d') >= $endDateObj->format('d')) {
			$endDateObj->modify('+1 month');
		}
		$this->cutOffDate = $endDateObj->format('d-m-Y');

		//calculate time elapse based on current cut off date
		$this->projectInfo['percentElapse'] = ($this->projectInfo['duration'] && $this->projectInfo['duration'] != 0) ? round(((round((strtotime($this->cutOffDate)-strtotime($this->projectInfo['start_date'])) / (60 * 60 * 24)))/$this->projectInfo['duration'])*100, 2) : 'N/A';
	}

	function getSectionOption(){
		if($this->project_org == 'KACC'){
			if ($this->isWPC) {
				$url = $this->jogetLinkObj->fetchLink("api","document_dash_list_section", array($this->projectID));
				$resSec = $this->jogetCURL($url);
				if (isset($resSec['data'])) {
					usort($resSec['data'], function($a, $b) {
						return strcmp($a["section_name"], $b["section_name"]);
					});
					foreach ($resSec['data'] as $sec) {
						$this->sectionOptions['overall'][] = $sec['section_name'];
					}
				}
			}
			
			foreach ($this->childProjectInfo as $childID){
				$url = $this->jogetLinkObj->fetchLink("api","document_dash_list_section", array('', $this->parentProjectID));
				$resSec = $this->jogetCURL($url);
				if (isset($resSec['data'])) {
					usort($resSec['data'], function($a, $b) {
						return strcmp($a["section_name"], $b["section_name"]);
					});
					foreach ($resSec['data'] as $sec) {
						if($childID['project_id'] == $sec['package_id']){
							$this->sectionOptions[$childID['project_id']][] = $sec['section_name'];
						}
					}
				}				
			}
		}
		else if ($this->project_org == 'MRSB'){
			$url = "list_mrsbSection?d-3304798-fn_project_id=".$this->parentProjectID."&d-3304798-fn_package_id=";
			if ($this->isWPC) {
				$resSection = $this->getCustomDatalistData($url.$this->projectID, 'doc');
				if (isset($resSection['data'])) {
					usort($resSection['data'], function($a, $b) {
						return strcmp($a["section_code"], $b["section_code"]);
					});
					foreach ($resSection['data'] as $sec) {
						$this->sectionOptions['overall'][] = $sec['section_code'];
					}
				}
			}

			$childProjectList = [];
			foreach ($this->childProjectInfo as $childID) {
				$resSection = $this->getCustomDatalistData($url.$childID['project_id'], 'doc');
				if (isset($resSection['data'])) {
					usort($resSection['data'], function($a, $b) {
						return strcmp($a["section_code"], $b["section_code"]);
					});
					foreach ($resSection['data'] as $sec) {
						$this->sectionOptions[$childID['project_id']][] = $sec['section_code'];
					}
				}
				$childProjectList[] = $childID['project_id'];
			}
			$this->childProjectList = $childProjectList;
		}

	}

	function loadInfo(){
		$this->loadProjectInfo();
		$this->loadWorkPackageOption();
		$this->loadYearOption();
		$this->getSectionOption();
	}

	function fetchActualValueInfo($fetchArr){
		$res = array();
		$physicalActualDataMth = $this->db->fetchAll("select * from project_progress_summary_actual where ppsa_projectid in (".implode(',', $fetchArr).") and ppsa_schedule_type='1' order by ppsa_projectid, ppsa_month_year asc");
		// first take month
		foreach ($physicalActualDataMth as $v) {
			$projID = ($v['ppsa_projectid'] == $this->projectID) ? 'overall' : $v['ppsa_projectid'];
			$monthYr = date('M-Y', strtotime($v['ppsa_month_year']));  
			$section = ($v['ppsa_section']) ? $v['ppsa_section'] : 'overall';
			if (!isset($res['phy'][$projID])) $res['phy'][$projID] = array();
			if (!isset($res['phy'][$projID][$section])) $res['phy'][$projID][$section] = array();
			$res['phy'][$projID][$section][$monthYr] = $v['ppsa_physical_actual'];

			if (!isset($res['fin'][$projID])) $res['fin'][$projID] = array();
			if (!isset($res['fin'][$projID][$section])) $res['fin'][$projID][$section] = array();
			$res['fin'][$projID][$section][$monthYr] = $v['ppsa_financial_actual'];
		}

		$physicalActualDataWeek = $this->db->fetchAll("select * from (SELECT ppsa_section, ppsa_month_year, ppsa_projectid, ppsa_financial_actual, ppsa_physical_actual, RANK() OVER (PARTITION BY DATEADD(MONTH, DATEDIFF(MONTH, 0, ppsa_month_year), 0) ORDER BY ppsa_month_year DESC) month_year_rank FROM project_progress_summary_actual where ppsa_projectid in (".implode(',', $fetchArr).") and ppsa_schedule_type = '0') ab where ab.month_year_rank = 1");
		// then check weekly		
		foreach ($physicalActualDataWeek as $k) {
			$projID = ($k['ppsa_projectid'] == $this->projectID) ? 'overall' : $k['ppsa_projectid'];
			$monthYr = date('M-Y', strtotime($k['ppsa_month_year']));  
			$section = ($k['ppsa_section']) ? $k['ppsa_section'] : 'overall';
			if (!isset($res['phy'][$projID][$section][$monthYr])) {
				if (!isset($res['phy'][$projID])) $res['phy'][$projID] = array();
				if (!isset($res['phy'][$projID][$section])) $res['phy'][$projID][$section] = array();
				$res['phy'][$projID][$section][$monthYr] = $k['ppsa_physical_actual'];
			}
			if (!isset($res['fin'][$projID][$section][$monthYr])) {
				if (!isset($res['fin'][$projID])) $res['fin'][$projID] = array();
				if (!isset($res['fin'][$projID][$section])) $res['fin'][$projID][$section] = array();
				$res['fin'][$projID][$section][$monthYr] = $k['ppsa_financial_actual'];
			}
		}
		return $res;
	}

	function getProjectSummaryInfo(){
		$fetchArr = array(
			$this->db->quote($this->projectID)
		);
		foreach ($this->childProjectInfo as $childProj) {
			$fetchArr[] = $this->db->quote($childProj['project_id']);
		}

		$allSummary = $this->db->fetchAll("select * from project_progress_summary where pps_projectid in (".implode(',', $fetchArr).") order by pps_projectid, pps_month_year asc");
		
		//actual info
		$actualData = $this->fetchActualValueInfo($fetchArr);

		//process to different array
		$monthYear = $finEarly = $finPlan = $finActual = $phyEarly = $phyPlan = $phyAct = array();

		// flag to show or hide planned/late
		$showLateCurve = false;

		$ret = array();
		foreach ($allSummary as $sum) {
			$projID = ($sum['pps_projectid'] == $this->projectID) ? 'overall' : $sum['pps_projectid'];
			$section = ($sum['pps_section']) ? $sum['pps_section'] : 'overall';
			$monthYr = date('M-Y', strtotime($sum['pps_month_year']));
			$ret[$projID][$section]['byMonYr'][$monthYr]["finEarly"] = number_format($sum['pps_financial_early_cm'],2);
			$ret[$projID][$section]['byMonYr'][$monthYr]["finPlan"] = number_format($sum['pps_financial_late_cm'],2);
			$ret[$projID][$section]['byMonYr'][$monthYr]["finActual"] =  (isset($actualData['fin'][$projID][$section][$monthYr])) ? number_format($actualData['fin'][$projID][$section][$monthYr],2) : null;
			$ret[$projID][$section]['byMonYr'][$monthYr]["phyEarly"] = number_format($sum['pps_physical_early'],2);
			$ret[$projID][$section]['byMonYr'][$monthYr]["phyPlan"] = number_format($sum['pps_physical_late'],2);
			$ret[$projID][$section]['byMonYr'][$monthYr]["phyAct"] =  (isset($actualData['phy'][$projID][$section][$monthYr])) ? number_format($actualData['phy'][$projID][$section][$monthYr],2) : null;
			$ret[$projID][$section]['raw'][] =  $sum;

			$monthYear = strtotime($sum['pps_month_year']);
			$year = date("Y", $monthYear);
			$month = date("M", $monthYear);
			// for current month / cut off
			$ret[$projID][$section]['card'][$year][$month]['phyAct'] = isset($actualData['phy'][$projID][$section][$monthYr]) ? $actualData['phy'][$projID][$section][$monthYr] : 0;
			$ret[$projID][$section]['card'][$year][$month]['finActual'] = isset($actualData['fin'][$projID][$section][$monthYr]) ? $actualData['fin'][$projID][$section][$monthYr] : 0;
			$ret[$projID][$section]['card'][$year][$month]['phyPlan'] =  $sum['pps_physical_late'];
			$ret[$projID][$section]['card'][$year][$month]['finPlan'] = $sum['pps_financial_late_cm'];
			$ret[$projID][$section]['card'][$year][$month]['phyEarly'] =  $sum['pps_physical_early'];
			$ret[$projID][$section]['card'][$year][$month]['finEarly'] =  $sum['pps_financial_early_cm'];

			if ($sum['pps_physical_late'] && $sum['pps_physical_late'] != '0.0' && $sum['pps_physical_late'] && $sum['pps_physical_late'] != '0.0') {
				$showLateCurve = true;
			}else{
				$showLateCurve = false;
			}
			$ret[$projID][$section]['flag']['showLateCurve'] = $showLateCurve; 
		}
		return $ret;
	}
	function fetchPDPCriticalRiskDriverData(){
		$ret = array();
		$colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D','#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC','#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399','#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933','#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
		$i = 0;
		
		if ($this->isWPC) {
			$mainRes = $this->getCustomDatalistData('list_rrFormOverall?d-5040102-fn_c_project='.$this->projectID);
			if (isset($mainRes['data'])){
				// sort by percentage
				usort($mainRes['data'], function($a, $b) {
				    return (int) $a['c_percentage'] - (int) $b['c_percentage'];
				});
				// filter the lastest by c_risk_description
				foreach ($mainRes['data'] as $val) {
					$dt = strtotime($val['dateCreated']);
					$ret['overall'][$val['c_risk_description']] = (isset($ret['overall'][$val['c_risk_description']]['dateCreated']) && $dt>strtotime($ret['overall'][$val['c_risk_description']]['dateCreated'])) ? $ret['overall'] : $val;
					$ret['overall'][$val['c_risk_description']]['bar_color'] = $colorArray[$i];
				}
			}
		}

		// this will be empty if $this->isWPC = true
		foreach ($this->childProjectInfo as $childID) {
			$res = $this->getCustomDatalistData('list_rrFormOverall?d-5040102-fn_c_project='.$childID['project_id']);
			if (isset($res['data'])){
				// sort by percentage
				usort($res['data'], function($a, $b) {
				    return (int) $a['c_percentage'] - (int) $b['c_percentage'];
				});
				// filter the lastest by c_risk_description
				foreach ($res['data'] as $val) {
					$dt = strtotime($val['dateCreated']);
					$ret[$childID['project_id']][$val['c_risk_description']] = (isset($ret[$childID['project_id']][$val['c_risk_description']]['dateCreated']) && $dt>strtotime($ret[$childID['project_id']][$val['c_risk_description']]['dateCreated'])) ? $ret[$childID['project_id']] : $val;
					$ret[$childID['project_id']][$val['c_risk_description']]['bar_color'] = $colorArray[$i];

					// for overall as well
					$ret['overall'][$val['c_risk_description']] = (isset($ret['overall'][$val['c_risk_description']]['dateCreated']) && $dt>strtotime($ret['overall'][$val['c_risk_description']]['dateCreated'])) ? $ret['overall'] : $val;
					$ret['overall'][$val['c_risk_description']]['bar_color'] = $colorArray[$i];

				}
				// get top 5
				if (isset($ret[$childID['project_id']])){
					$ret[$childID['project_id']] = array_slice($ret[$childID['project_id']], 0, 5);
				}
			}
			$i = ($i == count($colorArray)-1) ? 0 : $i+1;
		}
		// get top 5 overall
		if (isset($ret['overall'])){
			$ret['overall'] = array_slice($ret['overall'], 0, 15);
		}
		return $ret;
	}

	function fetchPDPOverallDurationAnalysis(){
		// get only for this month
		$ret = array();
		$overallData = $this->db->fetchAll("select * from risk_histogram_data where rhd_month_year= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0) and rhd_projectId =:0 order by rhd_bins asc", array($this->projectInfo['project_id']));
		$ret['overall']['rawData'] = $overallData;
		foreach ($overallData as $od) {
			$ret['overall']['bin'][] = $od['rhd_bins'];
			$ret['overall']['count'][] = $od['rhd_count'];
			$ret['overall']['cum'][] = $od['rhd_cum'];
		}

		foreach ($this->childProjectInfo as $childID) {
			$overallDataChild = $this->db->fetchAll("select * from risk_histogram_data where rhd_month_year= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0) and rhd_projectId =:0 order by rhd_bins asc", array($childID['project_id']));
			$ret[$childID['project_id']]['rawData'] = $overallDataChild;
			foreach ($overallDataChild as $d) {
				$ret[$childID['project_id']]['bin'][] = $d['rhd_bins'];
				$ret[$childID['project_id']]['count'][] = $d['rhd_count'];
				$ret[$childID['project_id']]['cum'][] = $d['rhd_cum'];
			}
		}
		return $ret;
	}

	function fetchRiskProbabilityData(){
		$ret = array();
		$sql = "select rpd_project_remain_dur, rpd_project_prob_complete, rpd_overall_schedule_impact_uncer, rpd_timely_completion_prob from risk_probability_data where rpd_month_year = DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0) and rpd_projectId =:0";
		if ($this->isWPC) {
			$mainRes = $this->db->fetchRow($sql, array($this->projectID));
			if ($mainRes) {
				$ret['overall'] = $mainRes;
			}
		}

		// this will be empty if $this->isWPC = true
		foreach ($this->childProjectInfo as $childID) {
			$res = $this->db->fetchRow($sql, array($childID['project_id']));
			if ($res){
				$ret[$childID['project_id']] = $res;
			}
		}
		return $ret;
	}

	function getRiskInfo(){
		// joget
		$pdp = $this->fetchPDPCriticalRiskDriverData();
		// histogram - local db
		$pdpOverallDurAnalysis = $this->fetchPDPOverallDurationAnalysis();
		
		// timely, overall, probability - local db
		$riskPd = $this->fetchRiskProbabilityData();

		$ret = array(
			'pdp' => $pdp,
			'riskProb' => $riskPd,
			'pdpODAHistogram' => $pdpOverallDurAnalysis
		);
		
		return $ret;
	}

	function getBumiInfo(){
		return array('something');
	}

	function getUtilitiesInfo(){
		return array('something');
	}

	function fetchLandIssueData(){
		// by this month and latest only for each wpc
		// projectid -> status -> sources
		$ret = array();
		$sourcesOption = array();
		$currMonYr = date('m-Y');

		// if not overall
		if ($this->isWPC) {
			$mainRes = $this->getCustomDatalistData('landIssueList?d-450646-fn_Project='.$this->projectID.'&d-450646-fn_dateCreated='.$currMonYrFilter);
			if (isset($mainRes['data'])) {
				foreach ($mainRes['data'] as $li) {
					$ret['overall']['all']['all'][] = $li;
					$ret['overall']['all'][$li['source']][] = $li; 	
					$ret['overall'][$li['issueStatus']]['all'][] = $li;
					$ret['overall'][$li['issueStatus']][$li['source']][] = $li;

					if ($li['source'] && !in_array($li['source'], $sourcesOption)) array_push($sourcesOption, $li['source']);
				}
			}
		}

		// this will be empty if $this->isWPC = true
		foreach ($this->childProjectInfo as $childID) {
			$res = $this->getCustomDatalistData('landIssueList?d-450646-fn_Project='.$childID['project_id'].'&d-450646-fn_landIssueRegistration='.$currMonYr);
			if (isset($res['data'])) {
				foreach ($res['data'] as $li) {
					$ret['overall']['all']['all'][] = $li;
					$ret['overall']['all'][$li['source']][] = $li; 	
					$ret['overall'][$li['issueStatus']]['all'][] = $li;
					$ret['overall'][$li['issueStatus']][$li['source']][] = $li;

					$ret[$childID['project_id']]['all']['all'][] = $li;
					$ret[$childID['project_id']]['all'][$li['source']][] = $li; 	
					$ret[$childID['project_id']][$li['issueStatus']]['all'][] = $li;	
					$ret[$childID['project_id']][$li['issueStatus']][$li['source']][] = $li;

					// for status option filtering
					if ($li['source'] && !in_array($li['source'], $sourcesOption)) array_push($sourcesOption, $li['source']);
				}
			}
		}
		$ret['issueSourcesOption'] = $sourcesOption;
		return $ret;
	}

	function fetchLandEncumbrancesData(){
		$ret = array();
		$overallTotalLength = 0;
		$overallFreeEnc = 0;
		$overallTotalEnc = 0;
		
		// $currMon = date('m');
		// $currYr = date('Y');

		// Return all data that already registered
		if ($this->isWPC) {
			$mainRes = $this->getCustomDatalistData('landEncumbrancesList?d-810989-fn_Project='.$this->projectID);
			foreach($mainRes['data'] as $eachLandData) {
				$ret['encData']['overall'] = $eachLandData;
				$overallFreeEnc = $overallFreeEnc + (float) str_replace(',', '', $eachLandData['free_encumbrances']);
				$overallTotalLength = $overallTotalLength + (float) str_replace(',', '',   $eachLandData['total_length']);
				$overallTotalEnc = $overallTotalEnc + (float) str_replace(',', '',  $eachLandData['total_encumbrances']);
				$ret['encData']['overall']['free_encumbrances'] = $overallFreeEnc;
				$ret['encData']['overall']['total_length'] = $overallTotalLength;
				$ret['encData']['overall']['total_encumbrances'] = $overallTotalEnc;
				
			}

			// if (isset($mainRes['data'][0]) && $mainRes['data']) {
			//  the value return contain comma 
			// 	$data = $this->processLandEncData($mainRes['data'][0]);
			// 	$ret['encData']['overall'] = $data;
			// 	$overallTotalLength = $overallTotalLength + $data['total_length'];
			// 	$overallFreeEnc = $overallFreeEnc + $data['free_encumbrances']; 
			// 	$overallTotalEnc = $overallTotalEnc + $data['total_encumbrances'];
			// }
		}


		// this will be empty if $this->isWPC = true
		foreach ($this->childProjectInfo as $childID) {
			$res = $this->getCustomDatalistData('landEncumbrancesList?d-810989-fn_Project='.$childID['project_id']);
				if ($res['data']){
					foreach($res['data'] as $eachLandData) {
						$ret['encData'][$childID['project_id']] = $eachLandData;
						$overallFreeEnc = $overallFreeEnc + (float) str_replace(',', '', $eachLandData['free_encumbrances']);
						$overallTotalLength = $overallTotalLength + (float) str_replace(',', '',   $eachLandData['total_length']);
						$overallTotalEnc = $overallTotalEnc + (float) str_replace(',', '',  $eachLandData['total_encumbrances']);
						
					}
					$ret['encData'][$childID['project_id']]['foc']  = ($overallTotalLength != 0 && $overallTotalLength > $overallFreeEnc) ?  number_format(($overallFreeEnc/$overallTotalLength)*100, 2) : 0;
					$ret['encData'][$childID['project_id']]['encumbrances']  = ($overallTotalLength != 0 && $overallTotalLength > $overallTotalEnc) ?  number_format(($overallTotalEnc/$overallTotalLength)*100, 2) : 0;
				}
				
			// if (isset($res['data'][0]) && $res['data']) {
			// 	$data = $this->processLandEncData($res['data'][0]);
			// 	$ret['encData'][$childID['project_id']] = $data;
			// 	$overallTotalLength = $overallTotalLength + $data['total_length'];
			// 	$overallFreeEnc = $overallFreeEnc + $data['free_encumbrances']; 
			// 	$overallTotalEnc = $overallTotalEnc + $data['total_encumbrances']; 			
			// }
		}

		$ret['encCardData']['totalFOE'] = ($overallTotalLength != 0 && $overallTotalLength > $overallFreeEnc) ?  number_format(($overallFreeEnc/$overallTotalLength)*100, 2) : 0;
		$ret['encCardData']['totalEnc'] = ($overallTotalLength != 0 && $overallTotalLength > $overallTotalEnc) ?  number_format(($overallTotalEnc/$overallTotalLength)*100, 2) : 0;
		return $ret;
	}

	function getLandInfo(){
		$issue = $this->fetchLandIssueData();
		$encumbrances = $this->fetchLandEncumbrancesData();
		$ret = array(
			"issue" => $issue,
			"encumbrances" => $encumbrances
		);

		return $ret;
	}

	function getQAQCInfo(){
		$infoArr = array();
		$processArr = array('MS', 'MOS', 'NCR', 'WIR');
		if ($this->isWPC) {
			$mainRes = $this->getCustomDatalistData('processInfoList?d-1883645-fn_projectID='.$this->projectID);
			if ($mainRes['data']) {
				foreach ($mainRes['data'] as $data) {
					$infoArr[$data['processType']]['overall']['raw'][] = $data;

					// based in month year
					$infoArr[$data['processType']]['overall']['basedOnMonYr'][$data['yr_mon']]['raw'][] = $data;

					// based on month year + status
					$infoArr[$data['processType']]['overall']['basedOnMonYr'][$data['yr_mon']]['basedOnStatus'][$data['status']][] = $data;

					// based on month year + basedOnWd and classification
					if ($data['processType'] == 'NCR') {
						$infoArr[$data['processType']]['overall']['basedOnMonYr'][$data['yr_mon']]['basedOnWD'][$data['ncr_wd']][] = $data;

						$infoArr[$data['processType']]['overall']['basedOnMonYr'][$data['yr_mon']]['basedOnClassif'][$data['c_classification']][] = $data;
					
						// aging (0-30/30-90/>91) - only status not closed
						if ($data['status'] != 'WIR Approved' && $data['status'] != 'Draft') {
							if ($data['aging_day'] < 30) {
								$infoArr[$data['processType']]['overall']['basedOnAging']['<30'][] = $data;
							}elseif ($data['aging_day'] >= 30 && $data['aging_day'] < 90) {
								$infoArr[$data['processType']]['overall']['basedOnAging']['30-90'][] = $data;
							}else{
								$infoArr[$data['processType']]['overall']['basedOnAging']['>90'][] = $data;							}
						}
					}
				}
			}
		}

		// this will be empty if $this->isWPC = true
		// can be optimise by creating one big datalist and just query from there
		foreach ($this->childProjectInfo as $childID) {
			$res = $this->getCustomDatalistData('processInfoList?d-1883645-fn_projectID='.$childID['project_id']);
			if (isset($res['data'])) {
				foreach ($res['data'] as $data) {
					$infoArr[$data['processType']][$childID['project_id']]['raw'][] = $data;
					$infoArr[$data['processType']]['overall']['raw'][] = $data;

					// based in month year
					$infoArr[$data['processType']][$childID['project_id']]['basedOnMonYr'][$data['yr_mon']]['raw'][] = $data;
					$infoArr[$data['processType']]['overall']['basedOnMonYr'][$data['yr_mon']]['raw'][] = $data;

					// based on month year + status
					$infoArr[$data['processType']][$childID['project_id']]['basedOnMonYr'][$data['yr_mon']]['basedOnStatus'][$data['status']][] = $data;
					$infoArr[$data['processType']]['overall']['basedOnMonYr'][$data['yr_mon']]['basedOnStatus'][$data['status']][] = $data;

					// based on month year + basedOnWd and classification
					if ($data['processType'] == 'NCR') {
						$infoArr[$data['processType']][$childID['project_id']]['basedOnMonYr'][$data['yr_mon']]['basedOnWD'][$data['ncr_wd']][] = $data;
						$infoArr[$data['processType']]['overall']['basedOnMonYr'][$data['yr_mon']]['basedOnWD'][$data['ncr_wd']][] = $data;

						$infoArr[$data['processType']][$childID['project_id']]['basedOnMonYr'][$data['yr_mon']]['basedOnClassif'][$data['c_classification']][] = $data;
						$infoArr[$data['processType']]['overall']['basedOnMonYr'][$data['yr_mon']]['basedOnClassif'][$data['c_classification']][] = $data;
					
						// aging (0-30/30-90/>91) - only status not closed
						if ($data['status'] != 'WIR Approved' && $data['status'] != 'Draft') {
							if ($data['aging_day'] < 30) {
								$infoArr[$data['processType']][$childID['project_id']]['basedOnAging']['<30'][] = $data;
								$infoArr[$data['processType']]['overall']['basedOnAging']['<30'][] = $data;
							}elseif ($data['aging_day'] >= 30 && $data['aging_day'] < 90) {
								$infoArr[$data['processType']][$childID['project_id']]['basedOnAging']['30-90'][] = $data;
								$infoArr[$data['processType']]['overall']['basedOnAging']['30-90'][] = $data;
							}else{
								$infoArr[$data['processType']][$childID['project_id']]['basedOnAging']['>90'][] = $data;
								$infoArr[$data['processType']]['overall']['basedOnAging']['>90'][] = $data;							}
						}
					}
				}
			}
		}
		return $infoArr;
	}

	function fetchIFData(){
		$info = [];

		if ($this->isWPC) {
			$mainRes = $this->getJogetProcessRecords('IR', $this->projectID);
			if(isset($mainRes['data'])){
				foreach ($mainRes['data'] as $val) {
					$monYr = strtoupper(date("M-Y", strtotime($val['IncidentDate'])));
					$yr = strtoupper(date("Y", strtotime($val['IncidentDate'])));

					// fix incident date format
					$dtFmtStr = explode('-', $val['IncidentDate']);
					if (isset($dtFmtStr[2]) && strlen($dtFmtStr[2]) == 4) {
						$val['IncidentDateFormat'] = (implode('-', array_reverse($dtFmtStr)));
					}else{
						$val['IncidentDateFormat'] = $val['IncidentDate'];
					}

					$info['overall']['data'][] = $val;
					$info['overall']['basedOnStatus'][$val['Status']][] = $val;

					$info['overall']['basedOnMonYr'][$monYr][] = $val;
					$info['overall']['yr'][$yr][] = $val;
					
					$fatality = ($val['NumberOfFatality']) ? (int)$val['NumberOfFatality'] : 0;				
					$info['overall']['fatalityCnt']['monYr'][$monYr] = (isset($info['overall']['fatalityCnt']['monYr'][$monYr])) ? $info['overall']['fatalityCnt']['monYr'][$monYr]+$fatality : $fatality;
					$info['overall']['fatalityCnt']['yr'][$yr] = (isset($info['overall']['fatalityCnt']['yr'][$yr])) ? $info['overall']['fatalityCnt']['yr'][$yr]+$fatality : $fatality;
					$info['overall']['fatalityCnt']['total'] = (isset($info['overall']['fatalityCnt']['total'])) ? $info['overall']['fatalityCnt']['total']+$fatality : $fatality;
				}
			}
		}
		// this will be empty if $this->isWPC = true
		foreach ($this->childProjectInfo as $childID) {
			$res = $this->getJogetProcessRecords('IR', $childID['project_id']);
			$info[$childID['project_id']] = $res;
			if(isset($res['data'])){
				foreach ($res['data'] as $val) {
					$monYr = strtoupper(date("M-Y", strtotime($val['IncidentDate'])));
					$yr = strtoupper(date("Y", strtotime($val['IncidentDate'])));

					// fix incident date format
					$dtFmtStr = explode('-', $val['IncidentDate']);
					if (isset($dtFmtStr[2]) && strlen($dtFmtStr[2]) == 4) {
						$val['IncidentDateFormat'] = (implode('-', array_reverse($dtFmtStr)));
					}else{
						$val['IncidentDateFormat'] = $val['IncidentDate'];
					}

					$info['overall']['data'][] = $val;
					$info[$childID['project_id']]['basedOnStatus'][$val['Status']][] = $val;
					$info['overall']['basedOnStatus'][$val['Status']][] = $val;

					$info[$childID['project_id']]['basedOnMonYr'][$monYr][] = $val;
					$info['overall']['basedOnMonYr'][$monYr][] = $val;
					$info['overall']['yr'][$yr][] = $val;
					
					$fatality = ($val['NumberOfFatality']) ? (int)$val['NumberOfFatality'] : 0;				

					$info[$childID['project_id']]['fatalityCnt']['monYr'][$monYr] = (isset($info[$childID['project_id']]['fatalityCnt']['monYr'][$monYr])) ? $info[$childID['project_id']]['fatalityCnt']['monYr'][$monYr]+$fatality : $fatality;
					$info[$childID['project_id']]['fatalityCnt']['yr'][$yr] = (isset($info[$childID['project_id']]['fatalityCnt']['yr'][$yr])) ? $info[$childID['project_id']]['fatalityCnt']['yr'][$yr]+$fatality : $fatality;
					$info[$childID['project_id']]['fatalityCnt']['total'] = (isset($info[$childID['project_id']]['fatalityCnt']['total'])) ? $info[$childID['project_id']]['fatalityCnt']['total']+$fatality : $fatality;
					$info['overall']['fatalityCnt']['monYr'][$monYr] = (isset($info['overall']['fatalityCnt']['monYr'][$monYr])) ? $info['overall']['fatalityCnt']['monYr'][$monYr]+$fatality : $fatality;
					$info['overall']['fatalityCnt']['yr'][$yr] = (isset($info['overall']['fatalityCnt']['yr'][$yr])) ? $info['overall']['fatalityCnt']['yr'][$yr]+$fatality : $fatality;
					$info['overall']['fatalityCnt']['total'] = (isset($info['overall']['fatalityCnt']['total'])) ? $info['overall']['fatalityCnt']['total']+$fatality : $fatality;
				}
			}
		}
		return $info;
	}

	function fetchTtlManHrsWOLTIData(){
		$ret = array();
		if ($this->isWPC) {
			$datalistUrl = 'list_totalSafeManHoursWithoutLTI?d-3144584-fn_Project='.$this->projectID;
			$res = $this->getCustomDatalistData($datalistUrl);
			if (isset($res['data'])) {
				$resData = $res['data'];
				$mthArr = $yrArr = array();
				foreach ($res['data'] as $key => $row) {
				    $mthArr[$key]  = $row['year'];
				    $yrArr[$key] = $row['month'];
				}
				// sort array based on year and month
				array_multisort($yrArr, SORT_ASC, $mthArr, SORT_ASC, $resData);
				
				// for each created key based on the month and year
				foreach ($resData as $data) {
					$d = $data;
					if (!array_key_exists(strtoupper($data['month']), $this->mthLookUp)) continue;
					$ret['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']] = $d;
					$ret['overall']['byYr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']] = $d;
				}
			}
		}

		// this will be empty if $this->isWPC = true
		foreach ($this->childProjectInfo as $childID) {
			$datalistUrl = 'list_totalSafeManHoursWithoutLTI?d-3144584-fn_Project='.$childID['project_id'];
			$childRes = $this->getCustomDatalistData($datalistUrl);
			if (isset($childRes['data'])) {
				$resData = $childRes['data'];
				$mthArr = $yrArr = array();
				foreach ($childRes['data'] as $key => $row) {
				    $mthArr[$key]  = $row['year'];
				    $yrArr[$key] = $row['month'];
				}
				// sort array based on year and month
				array_multisort($yrArr, SORT_ASC, $mthArr, SORT_ASC, $resData);
				
				// for each created key based on the month and year
				foreach ($resData as $data) {
					$d = $data;
					if (!array_key_exists(strtoupper($data['month']), $this->mthLookUp)) continue;

					$ret[$childID['project_id']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']] = $d;
					$ret[$childID['project_id']]['byYr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']] = $d;
					
					// for overall need to do summation
					$sum = (isset($ret['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['total_manhours'])) ? $ret['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['total_manhours'] + (int)$d['total_manhours'] : (int)$d['total_manhours'];
					$ret['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['total_manhours'] = $sum;
					
					$sumByYr = (isset($ret['overall']['byYr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['total_manhours'])) ? $ret['overall']['byYr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['total_manhours'] + (int)$d['total_manhours'] : (int)$d['total_manhours'];
					$ret['overall']['byYr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['total_manhours'] = $sumByYr;
				}
			}
		}
		return $ret;
	}

	function processHSEActivityData($data){
		if (!isset($data['month']) || empty($data['month']) || !isset($this->mthLookUp[strtoupper($data['month'])])) return false;
		if (!isset($data['year']) || empty($data['year'])) return false;
		// some data is not filled so it return null instead
		$data['no_of_site_hse_committee_meeting'] = ($data['no_of_site_hse_committee_meeting']) ? (int) $data['no_of_site_hse_committee_meeting'] : 0;
		$data['no_of_toolbox_briefing'] = ($data['no_of_toolbox_briefing']) ? (int) $data['no_of_toolbox_briefing'] : 0;
		$data['no_safety_walkabout'] = ($data['no_safety_walkabout']) ? (int) $data['no_safety_walkabout'] : 0;
		$data['no_of_safety_induction'] = ($data['no_of_safety_induction']) ? (int) $data['no_of_safety_induction'] : 0;
		$data['cidb_green_card_induction_course'] = ($data['cidb_green_card_induction_course']) ? (int) $data['cidb_green_card_induction_course'] : 0;
		$data['ert_fire_evacuation_and_response'] = ($data['ert_fire_evacuation_and_response']) ? (int) $data['ert_fire_evacuation_and_response'] : 0 ;
		$data['fire_extinguisher_training'] = ($data['fire_extinguisher_training']) ? (int) $data['fire_extinguisher_training'] : 0 ;

		return $data;
	}
	function fetchHSEActivityData(){
		/*
		by project
			- HSE Comitee Meeting : no_of_site_hse_committee_meeting
				- by month year
			- HSE Toolbox Briefing : no_of_toolbox_briefing
				- by month year
			- CIDB Course : cidb_green_card_induction_course
				- by month year
			- ERT : Fire : ert_fire_evacuation_and_response
				- by month year
			- Fire Extinguisher Programme : fire_extinguisher_training
				- by month year
			- Traffic Controller : traffic_controller_training_flagman
				- by month year

		by month year only 
			- HSE Walkabout & Induction : no_of_safety_induction & no_of_safety_induction
		*/
		$ret = array();

		if ($this->isWPC) {
			$maindatalistUrl = 'list_safetyActivity?d-4446968-fn_Project='.$this->projectID;
			$mainRes = $this->getCustomDatalistData($maindatalistUrl);
			if (isset($mainRes['data']) && $mainRes['data']) {
				usort($mainRes['data'], function($a, $b) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});

				foreach ($mainRes['data'] as $k => $data) {
					$data = $this->processHSEActivityData($data);
					if (!$data) continue;

			 		//HSE Comitee Meeting : no_of_site_hse_committee_meeting
					$hseCommMeetCnt = (isset($ret['overall']['overall']['hseCommMeet'])) ? $ret['overall']['overall']['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['overall']['overall']['hseCommMeet'] = $hseCommMeetCnt; 

					$hseCommMeetByYrCnt = (isset($ret['overall']['overall']['byYr'][$data['year']]['hseCommMeet'])) ? $ret['overall']['overall']['byYr'][$data['year']]['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['overall']['overall']['byYr'][$data['year']]['hseCommMeet'] = $hseCommMeetByYrCnt; 
					$hseCommMeetByMonYrCnt = (isset($ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseCommMeet'])) ? $ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseCommMeet'] = $hseCommMeetByMonYrCnt; 

					$hseCommMeetCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['hseCommMeet'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['hseCommMeet'] = $hseCommMeetCntByMonYr;
					$hseCommMeetCntByYr = (isset($ret['byYr'][$data['year']]['overall']['hseCommMeet'])) ? $ret['byYr'][$data['year']]['overall']['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['byYr'][$data['year']]['overall']['hseCommMeet'] = $hseCommMeetCntByYr; 
			
			 		//HSE Toolbox Briefing : no_of_toolbox_briefing
					$hseTBBriefCnt = (isset($ret['overall']['overall']['hseTBBrief'])) ? $ret['overall']['overall']['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['hseTBBrief'] = $hseTBBriefCnt; 

					$hseTBBriefYrCnt = (isset($ret['overall']['overall']['byYr'][$data['year']]['hseTBBrief'])) ? $ret['overall']['overall']['byYr'][$data['year']]['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byYr'][$data['year']]['hseTBBrief'] = $hseTBBriefYrCnt; 					
					$hseTBBriefMonYrCnt = (isset($ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseTBBrief'])) ? $ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseTBBrief'] = $hseTBBriefMonYrCnt; 
					
					$hseTBBriefCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['hseTBBrief'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['hseTBBrief'] = $hseTBBriefCntByMonYr; 
					$hseTBBriefCntByYr = (isset($ret['byYr'][$data['year']]['overall']['hseTBBrief'])) ? $ret['byYr'][$data['year']]['overall']['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['byYr'][$data['year']]['overall']['hseTBBrief'] = $hseTBBriefCntByYr; 

			 		//CIDB Course : cidb_green_card_induction_course
					$CIDBCnt = (isset($ret['overall']['overall']['CIDB'])) ? $ret['overall']['overall']['CIDB']+$data['cidb_green_card_induction_course'] : $data['cidb_green_card_induction_course'];
					$ret['overall']['overall']['CIDB'] = $CIDBCnt; 
					
					$CIDBYrCnt = (isset($ret['overall']['overall']['byYr'][$data['year']]['CIDB'])) ? $ret['overall']['overall']['byYr'][$data['year']]['CIDB']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byYr'][$data['year']]['CIDB'] = $CIDBYrCnt; 					
					$CIDBMonYrCnt = (isset($ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['CIDB'])) ? $ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['CIDB']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['CIDB'] = $CIDBMonYrCnt; 

					$CIDBCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['CIDB'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['CIDB']+$data['cidb_green_card_induction_course'] : $data['cidb_green_card_induction_course'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['CIDB'] = $CIDBCntByMonYr; 
					$CIDBCntByYr = (isset($ret['byYr'][$data['year']]['overall']['CIDB'])) ? $ret['byYr'][$data['year']]['overall']['CIDB']+$data['cidb_green_card_induction_course'] : $data['cidb_green_card_induction_course'];
					$ret['byYr'][$data['year']]['overall']['CIDB'] = $CIDBCntByMonYr; 

			 		//ERT : Fire : ert_fire_evacuation_and_response
					$ERTFireCnt = (isset($ret['overall']['overall']['ERTFire'])) ? $ret['overall']['overall']['ERTFire']+(int)$data['ert_fire_evacuation_and_response'] : (int) $data['ert_fire_evacuation_and_response'];
					$ret['overall']['overall']['ERTFire'] = $ERTFireCnt; 

					$ERTFireYrCnt = (isset($ret['overall']['overall']['byYr'][$data['year']]['ERTFire'])) ? $ret['overall']['overall']['byYr'][$data['year']]['ERTFire']+ (int)$data['no_of_toolbox_briefing'] : (int) $data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byYr'][$data['year']]['ERTFire'] = $ERTFireYrCnt; 					
					$ERTFireMonYrCnt = (isset($ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['ERTFire'])) ? $ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['ERTFire']+ (int) $data['no_of_toolbox_briefing'] : (int) $data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['ERTFire'] = $ERTFireMonYrCnt; 

					$ERTFireCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['ERTFire'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['ERTFire']+(int)$data['ert_fire_evacuation_and_response'] : (int)$data['ert_fire_evacuation_and_response'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['ERTFire'] = $ERTFireCntByMonYr; 
					$ERTFireCntByYr = (isset($ret['byYr'][$data['year']]['overall']['ERTFire'])) ? $ret['byYr'][$data['year']]['overall']['ERTFire']+(int)$data['ert_fire_evacuation_and_response'] : (int)$data['ert_fire_evacuation_and_response'];
					$ret['byYr'][$data['year']]['overall']['ERTFire'] = $ERTFireCntByYr; 
		
			 		//Fire Extinguisher Programme : fire_extinguisher_training
					$fireEPCnt = (isset($ret['overall']['overall']['fireEP'])) ? $ret['overall']['overall']['fireEP']+$data['fire_extinguisher_training'] : $data['fire_extinguisher_training'];
					$ret['overall']['overall']['fireEP'] = $fireEPCnt; 

					$fireEPYrCnt = (isset($ret['overall']['overall']['byYr'][$data['year']]['fireEP'])) ? $ret['overall']['overall']['byYr'][$data['year']]['fireEP']+(int)$data['no_of_toolbox_briefing'] : (int)$data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byYr'][$data['year']]['fireEP'] = $fireEPYrCnt; 					
					$fireEPMonYrCnt = (isset($ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['fireEP'])) ? $ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['fireEP']+(int)$data['no_of_toolbox_briefing'] : (int)$data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['fireEP'] = $fireEPMonYrCnt; 

					$fireEPCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['fireEP'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['fireEP']+(int)$data['fire_extinguisher_training'] : (int)$data['fire_extinguisher_training'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['fireEP'] = $fireEPCntByMonYr; 
					$fireEPCntByYr = (isset($ret['byYr'][$data['year']]['overall']['fireEP'])) ? $ret['byYr'][$data['year']]['overall']['fireEP']+$data['fire_extinguisher_training'] : $data['fire_extinguisher_training'];
					$ret['byYr'][$data['year']]['overall']['fireEP'] = $fireEPCntByYr; 

			 		//Traffic Controller : traffic_controller_training_flagman
					$trafficCtrlCnt = (isset($ret['overall']['overall']['trafficCtrl'])) ? $ret['overall']['overall']['trafficCtrl']+(int)$data['traffic_controller_training_flagman'] : (int)$data['traffic_controller_training_flagman'];
					$ret['overall']['overall']['trafficCtrl'] = $trafficCtrlCnt; 

					$trafficCtrlYrCnt = (isset($ret['overall']['overall']['byYr'][$data['year']]['trafficCtrl'])) ? $ret['overall']['overall']['byYr'][$data['year']]['trafficCtrl']+$data['no_of_toolbox_briefing'] : (int)$data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byYr'][$data['year']]['trafficCtrl'] = $trafficCtrlYrCnt; 					
					$trafficCtrlMonYrCnt = (isset($ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['trafficCtrl'])) ? $ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['trafficCtrl']+(int)$data['no_of_toolbox_briefing'] : (int)$data['no_of_toolbox_briefing'];
					$ret['overall']['overall']['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['trafficCtrl'] = $trafficCtrlMonYrCnt; 

					$trafficCtrlCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['trafficCtrl'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['trafficCtrl']+(int)$data['traffic_controller_training_flagman'] : (int)$data['traffic_controller_training_flagman'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['overall']['trafficCtrl'] = $trafficCtrlCntByMonYr; 
					$trafficCtrlCntByYr = (isset($ret['byYr'][$data['year']]['overall']['trafficCtrl'])) ? $ret['byYr'][$data['year']]['overall']['trafficCtrl']+(int)$data['traffic_controller_training_flagman'] : (int)$data['traffic_controller_training_flagman'];
					$ret['byYr'][$data['year']]['overall']['trafficCtrl'] = $trafficCtrlCntByYr; 
					
					// HSE Walkabout & Induction : no_safety_walkabout & no_of_safety_induction
					$safeWalkaboutCnt = (isset($ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout'])) ? $ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout']+(int)$data['no_safety_walkabout'] : (int)$data['no_safety_walkabout'];

					$ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout'] = $safeWalkaboutCnt; 
					$ret['overall']['safetyWalkInd']['yr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout'] = $safeWalkaboutCnt; 

					$safeInductionCnt = (isset($ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction'])) ? $ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction']+(int)$data['no_of_safety_induction'] : (int)$data['no_of_safety_induction'];
					
					$ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction'] = $safeInductionCnt; 
					$ret['overall']['safetyWalkInd']['yr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction'] = $safeInductionCnt; 
				}
			}
		}

		// this will be empty if $this->isWPC = true
		foreach ($this->childProjectInfo as $childID) {
			$datalistUrl = 'list_safetyActivity?d-4446968-fn_Project='.$childID['project_id'];
			$res = $this->getCustomDatalistData($datalistUrl);
			if (isset($res['data']) && $res['data']) {
				usort($res['data'], function($a, $b) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});
				// can be enchance to loop recursively
				foreach ($res['data'] as $k => $data) {
					$data = $this->processHSEActivityData($data);
					if (!$data) continue;

			 		//HSE Comitee Meeting : no_of_site_hse_committee_meeting
					$hseCommMeetCnt = (isset($ret['overall'][$childID['project_id']]['hseCommMeet'])) ? $ret['overall'][$childID['project_id']]['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['overall'][$childID['project_id']]['hseCommMeet'] = $hseCommMeetCnt; 

					$hseCommMeetByYrCnt = (isset($ret['overall'][$childID['project_id']]['byYr'][$data['year']]['hseCommMeet'])) ? $ret['overall'][$childID['project_id']]['byYr'][$data['year']]['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['overall'][$childID['project_id']]['byYr'][$data['year']]['hseCommMeet'] = $hseCommMeetByYrCnt; 

					$hseCommMeetByMonYrCnt = (isset($ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseCommMeet'])) ? $ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseCommMeet'] = $hseCommMeetByMonYrCnt; 

					$hseCommMeetCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['hseCommMeet'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['hseCommMeet'] = $hseCommMeetCntByMonYr;
					$hseCommMeetCntByYr = (isset($ret['byYr'][$data['year']][$childID['project_id']]['hseCommMeet'])) ? $ret['byYr'][$data['year']][$childID['project_id']]['hseCommMeet']+$data['no_of_site_hse_committee_meeting'] : $data['no_of_site_hse_committee_meeting'];
					$ret['byYr'][$data['year']][$childID['project_id']]['hseCommMeet'] = $hseCommMeetCntByYr; 
			

			 		//HSE Toolbox Briefing : no_of_toolbox_briefing
					$hseTBBriefCnt = (isset($ret['overall'][$childID['project_id']]['hseTBBrief'])) ? $ret['overall'][$childID['project_id']]['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['hseTBBrief'] = $hseTBBriefCnt; 

					$hseTBBriefYrCnt = (isset($ret['overall'][$childID['project_id']]['byYr'][$data['year']]['hseTBBrief'])) ? $ret['overall'][$childID['project_id']]['byYr'][$data['year']]['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byYr'][$data['year']]['hseTBBrief'] = $hseTBBriefYrCnt; 					
					$hseTBBriefMonYrCnt = (isset($ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseTBBrief'])) ? $ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['hseTBBrief'] = $hseTBBriefMonYrCnt; 
					
					$hseTBBriefCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['hseTBBrief'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['hseTBBrief'] = $hseTBBriefCntByMonYr; 
					$hseTBBriefCntByYr = (isset($ret['byYr'][$data['year']][$childID['project_id']]['hseTBBrief'])) ? $ret['byYr'][$data['year']][$childID['project_id']]['hseTBBrief']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['byYr'][$data['year']][$childID['project_id']]['hseTBBrief'] = $hseTBBriefCntByYr; 

			 		//CIDB Course : cidb_green_card_induction_course
					$CIDBCnt = (isset($ret['overall'][$childID['project_id']]['CIDB'])) ? $ret['overall'][$childID['project_id']]['CIDB']+$data['cidb_green_card_induction_course'] : $data['cidb_green_card_induction_course'];
					$ret['overall'][$childID['project_id']]['CIDB'] = $CIDBCnt; 
					
					$CIDBYrCnt = (isset($ret['overall'][$childID['project_id']]['byYr'][$data['year']]['CIDB'])) ? $ret['overall'][$childID['project_id']]['byYr'][$data['year']]['CIDB']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byYr'][$data['year']]['CIDB'] = $CIDBYrCnt; 					
					$CIDBMonYrCnt = (isset($ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['CIDB'])) ? $ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['CIDB']+$data['no_of_toolbox_briefing'] : $data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['CIDB'] = $CIDBMonYrCnt; 

					$CIDBCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['CIDB'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['CIDB']+$data['cidb_green_card_induction_course'] : $data['cidb_green_card_induction_course'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['CIDB'] = $CIDBCntByMonYr; 
					$CIDBCntByYr = (isset($ret['byYr'][$data['year']][$childID['project_id']]['CIDB'])) ? $ret['byYr'][$data['year']][$childID['project_id']]['CIDB']+$data['cidb_green_card_induction_course'] : $data['cidb_green_card_induction_course'];
					$ret['byYr'][$data['year']][$childID['project_id']]['CIDB'] = $CIDBCntByMonYr; 

			 		//ERT : Fire : ert_fire_evacuation_and_response
					$ERTFireCnt = (isset($ret['overall'][$childID['project_id']]['ERTFire'])) ? $ret['overall'][$childID['project_id']]['ERTFire']+(int)$data['ert_fire_evacuation_and_response'] : (int) $data['ert_fire_evacuation_and_response'];
					$ret['overall'][$childID['project_id']]['ERTFire'] = $ERTFireCnt; 

					$ERTFireYrCnt = (isset($ret['overall'][$childID['project_id']]['byYr'][$data['year']]['ERTFire'])) ? $ret['overall'][$childID['project_id']]['byYr'][$data['year']]['ERTFire']+ (int)$data['no_of_toolbox_briefing'] : (int) $data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byYr'][$data['year']]['ERTFire'] = $ERTFireYrCnt; 					
					$ERTFireMonYrCnt = (isset($ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['ERTFire'])) ? $ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['ERTFire']+ (int) $data['no_of_toolbox_briefing'] : (int) $data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['ERTFire'] = $ERTFireMonYrCnt; 

					$ERTFireCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['ERTFire'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['ERTFire']+(int)$data['ert_fire_evacuation_and_response'] : (int)$data['ert_fire_evacuation_and_response'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['ERTFire'] = $ERTFireCntByMonYr; 
					$ERTFireCntByYr = (isset($ret['byYr'][$data['year']][$childID['project_id']]['ERTFire'])) ? $ret['byYr'][$data['year']][$childID['project_id']]['ERTFire']+(int)$data['ert_fire_evacuation_and_response'] : (int)$data['ert_fire_evacuation_and_response'];
					$ret['byYr'][$data['year']][$childID['project_id']]['ERTFire'] = $ERTFireCntByYr; 
		
			 		//Fire Extinguisher Programme : fire_extinguisher_training
					$fireEPCnt = (isset($ret['overall'][$childID['project_id']]['fireEP'])) ? $ret['overall'][$childID['project_id']]['fireEP']+$data['fire_extinguisher_training'] : $data['fire_extinguisher_training'];
					$ret['overall'][$childID['project_id']]['fireEP'] = $fireEPCnt; 

					$fireEPYrCnt = (isset($ret['overall'][$childID['project_id']]['byYr'][$data['year']]['fireEP'])) ? $ret['overall'][$childID['project_id']]['byYr'][$data['year']]['fireEP']+(int)$data['no_of_toolbox_briefing'] : (int)$data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byYr'][$data['year']]['fireEP'] = $fireEPYrCnt; 					
					$fireEPMonYrCnt = (isset($ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['fireEP'])) ? $ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['fireEP']+(int)$data['no_of_toolbox_briefing'] : (int)$data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['fireEP'] = $fireEPMonYrCnt; 

					$fireEPCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['fireEP'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['fireEP']+(int)$data['fire_extinguisher_training'] : (int)$data['fire_extinguisher_training'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['fireEP'] = $fireEPCntByMonYr; 
					$fireEPCntByYr = (isset($ret['byYr'][$data['year']][$childID['project_id']]['fireEP'])) ? $ret['byYr'][$data['year']][$childID['project_id']]['fireEP']+$data['fire_extinguisher_training'] : $data['fire_extinguisher_training'];
					$ret['byYr'][$data['year']][$childID['project_id']]['fireEP'] = $fireEPCntByYr; 


			 		//Traffic Controller : traffic_controller_training_flagman
					$trafficCtrlCnt = (isset($ret['overall'][$childID['project_id']]['trafficCtrl'])) ? $ret['overall'][$childID['project_id']]['trafficCtrl']+(int)$data['traffic_controller_training_flagman'] : (int)$data['traffic_controller_training_flagman'];
					$ret['overall'][$childID['project_id']]['trafficCtrl'] = $trafficCtrlCnt; 

					$trafficCtrlYrCnt = (isset($ret['overall'][$childID['project_id']]['byYr'][$data['year']]['trafficCtrl'])) ? $ret['overall'][$childID['project_id']]['byYr'][$data['year']]['trafficCtrl']+$data['no_of_toolbox_briefing'] : (int)$data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byYr'][$data['year']]['trafficCtrl'] = $trafficCtrlYrCnt; 					
					$trafficCtrlMonYrCnt = (isset($ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['trafficCtrl'])) ? $ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['trafficCtrl']+(int)$data['no_of_toolbox_briefing'] : (int)$data['no_of_toolbox_briefing'];
					$ret['overall'][$childID['project_id']]['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['trafficCtrl'] = $trafficCtrlMonYrCnt; 

					$trafficCtrlCntByMonYr = (isset($ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['trafficCtrl'])) ? $ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['trafficCtrl']+(int)$data['traffic_controller_training_flagman'] : (int)$data['traffic_controller_training_flagman'];
					$ret['byMonYr'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']][$childID['project_id']]['trafficCtrl'] = $trafficCtrlCntByMonYr; 
					$trafficCtrlCntByYr = (isset($ret['byYr'][$data['year']][$childID['project_id']]['trafficCtrl'])) ? $ret['byYr'][$data['year']][$childID['project_id']]['trafficCtrl']+(int)$data['traffic_controller_training_flagman'] : (int)$data['traffic_controller_training_flagman'];
					$ret['byYr'][$data['year']][$childID['project_id']]['trafficCtrl'] = $trafficCtrlCntByYr; 
					
					// HSE Walkabout & Induction : no_safety_walkabout & no_of_safety_induction
					$safeWalkaboutCntOverall = (isset($ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout'])) ? $ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout']+(int)$data['no_safety_walkabout'] : (int)$data['no_safety_walkabout'];
					$ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout'] = $safeWalkaboutCntOverall; 
					$ret['overall']['safetyWalkInd']['yr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout'] = $safeWalkaboutCntOverall; 

					$safeWalkaboutCntChild = (isset($ret[$childID['project_id']]['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout'])) ? $ret[$childID['project_id']]['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout']+(int)$data['no_safety_walkabout'] : (int)$data['no_safety_walkabout'];
					$ret[$childID['project_id']]['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout'] = $safeWalkaboutCntChild; 
					$ret[$childID['project_id']]['safetyWalkInd']['yr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeWalkabout'] = $safeWalkaboutCntChild; 

					$safeInductionCntOverall = (isset($ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction'])) ? $ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction']+(int)$data['no_of_safety_induction'] : (int)$data['no_of_safety_induction'];
					$ret['overall']['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction'] = $safeInductionCntOverall; 
					$ret['overall']['safetyWalkInd']['yr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction'] = $safeInductionCntOverall;

					$safeInductionCntChild = (isset($ret[$childID['project_id']]['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction'])) ? $ret[$childID['project_id']]['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction']+(int)$data['no_of_safety_induction'] : (int)$data['no_of_safety_induction'];
					$ret[$childID['project_id']]['safetyWalkInd']['overall'][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction'] = $safeInductionCntChild; 
					$ret[$childID['project_id']]['safetyWalkInd']['yr'][$data['year']][$this->mthLookUp[strtoupper($data['month'])].'-'.$data['year']]['safeInduction'] = $safeInductionCntChild;  
				}
			}else{
				$ret['overall'][$childID['project_id']]['hseCommMeet'] = 0; 
				$ret['overall'][$childID['project_id']]['hseTBBrief'] = 0; 
				$ret['overall'][$childID['project_id']]['CIDB'] = 0; 
				$ret['overall'][$childID['project_id']]['ERTFire'] = 0; 
				$ret['overall'][$childID['project_id']]['fireEP'] = 0; 
				$ret['overall'][$childID['project_id']]['trafficCtrl'] = 0; 
			}
		}
		return $ret;
	}

	function getHSEInfo(){
		$ttlManHrsWOlti = $this->fetchTtlManHrsWOLTIData();
		$hseActivity = $this->fetchHSEActivityData();
		$irData = $this->fetchIFData();

		$ret = array(
			'IR' => $irData,
			'ttlManHrsWOLTI' => $ttlManHrsWOlti,
			'activity' => $hseActivity
		);
		return $ret;
	}

	// taken from joget.php [return instead of echo + variable]
	function getJogetProcessRecords($processName, $projectID)
	{
		// parent project does not have $_SESSION['appsLinks'] 
	    $jogetApp = 'RI_Constructs_test1';
	    $url = $this->jogetHost ."jw/web/json/data/list/".$jogetApp;
	    switch($processName){
	        case "NCR":
	            $host = $url."/NCRList?rows=90000&d-1303589-fn_Project=".$projectID; 
	        break;
	        case "WIR":
	            $host = $url."/WIRList?rows=90000&d-1311608-fn_Project=".$projectID;
	        break;
	        case "RFI":
	            $host = $url."/RFI_common_list?rows=90000&d-2066818-fn_Project=".$projectID;
	        break;
	        case "MOS":
	            $host = $url."/MoSList?rows=90000&d-1313633-fn_Project=".$projectID;
	        break;
	        case "MS":
	            $host = $url."/MSList?rows=90000&d-435674-fn_Project=".$projectID;
	        break;
	        case "IR":
	            $host = $url."/IncidentList?rows=90000&d-173530-fn_Project=".$projectID;
	        break;
	        case "RS":
	            $host = $url."/ReportList?rows=90000&d-2037996-fn_Project=".$projectID;
	        break;
	    }

	    $headers = array(
	        'Content-Type: application/json',
	        'Authorization: Basic ' . base64_encode("$this->api_username:$this->api_password")
	    );
	    $ch = curl_init($host);
	    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
	    curl_setopt($ch, CURLOPT_POST, 1);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	    $return = curl_exec($ch);
	    $err    = curl_error($ch);
	    curl_close($ch);
	    if ($err) {
	        return false;
	    } else {
	        return json_decode($return, true);
	    }
	}

	function getCustomDatalistData($dataListUrl, $app = "construct", $row = 0){
		switch ($app) {
			case 'doc':
				$jogetApp = $this->jogetDocApp;
				break;
			case 'construct':
			default:
				$jogetApp = $this->jogetConstructApp;
				break;
		}

	    $url = $this->jogetHost ."jw/web/json/data/list/".$jogetApp.'/'.$dataListUrl.'&rows='.(($row != 0) ? $row : '90000');
	    $headers = array(
	        'Content-Type: application/json',
	        'Authorization: Basic ' . base64_encode("$this->api_username:$this->api_password")
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
	    if ($err) {
	        return false;
	    } else {
	        return json_decode($return, true);
	    }	
	}

	function jogetCURL($url, $row = false){
		if (!$url) return false;
	    $headers = array(
	        'Content-Type: application/json',
	        'Authorization: Basic ' . base64_encode("$this->api_username:$this->api_password")
	    );
    	$url = $url.'&rows='.(($row) ? $row : '90000');
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
	    if ($err) {
	        return false;
	    } else {
	        return json_decode($return, true);
	    }	
	}
}