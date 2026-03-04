<?php 
/**
 * 
 */
class RiDashboardKACC extends RiDashboard
{
	var $extendClassPath = 'V3/OBYU/extend/dashboard_KACC/';
	var $monthlyCutOffDate;
	var $cutoffDay;
	var $firstDayofMonthDate;
	var $sCurveData;
	var $monthCertifiedClaimInfo;
	var $monthClaimAndPaymentInfo;
	var $contractInfo;
	var $contractInfoRaw;
	var $contractSections;
	var $paymentAging;
	var $packageCutOffArr;
	var $monthToNum;
	var $sectionList;

	function __construct($dash = false, $ajax = false)
	{
		parent::__construct($dash, $ajax);
		
		$this->cutoffDay = (isset($_SESSION['cut_off_day'])) ? $_SESSION['cut_off_day'] : '25';
		$endDateObj = DateTime::createFromFormat('j-n-Y', $this->cutoffDay.'-'.date('m').'-'.date('Y'));
		
		// if already pass cut off then this month, else previous month;
		if (date('d') > $endDateObj->format('d')) {
			$endDateObj->modify('+1 month');
		}
		$this->monthlyCutOffDate = $endDateObj->format('d-m-Y');
		$endDateObj->modify('-1 month');
		$endDateObj->modify('+1 day');
		$this->firstDayofMonthDate = $endDateObj->format('d-m-Y');

		$this->getPackageCutOffDay();
		$this->monthToNum = array("January"=>"01","February"=>"02","March"=>"03","April"=>"04","May"=>"05","June"=>"06","July"=>"07","August"=>"08","September"=>"09","October"=>"10","November"=>"11","December"=>"12");

	}

	function loadJS(){
		echo '
			<script src="'.$this->pathRel.'../../JS/JsLibrary/jquery-3.5.1.js"></script>
			<script src="../../JS/dashboard.js"></script>
			<script src="'.((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https' : 'http').'://code.highcharts.com/highcharts.js"></script>
			'.((isset($_SESSION['ui_pref']) && $_SESSION['ui_pref'] == 'ri_v3') ? '<script src="../../../../../JS/v3.js"></script>' : '').'
		';

		switch ($this->dashboard) {
			case 'cost':
				echo '
					<script src="JS/cost.js"></script>
					<script src="https://code.highcharts.com/highcharts-more.js"></script>
					<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
				';				
				$this->enableMenu = true;
				break;
			case 'summary':
				echo '
					<script src="JS/summary.js"></script>
					<script src="https://code.highcharts.com/highcharts-more.js"></script>
					<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
				';				
				$this->enableMenu = true;
				break;
			case 'quality':
				echo '<script src="JS/quality.js"></script>';
				$this->enableMenu = true;
				break;
			case 'qaqc':
				echo '<script src="JS/qaqc.js"></script>';
				$this->enableMenu = true;
				break;
			case 'document':
				echo '<script src="JS/document.js"></script>';
				$this->enableMenu = true;
				break;
			case 'time':
				echo '
					<script src="JS/time.js"></script>
					<script src="https://code.highcharts.com/highcharts-more.js"></script>
					<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
				';
				$this->enableMenu = true;
				break;
		}

		// disable all for now as it return error on highcharts
		if ($this->enableMenu) {
			echo '<script src="https://code.highcharts.com/modules/series-label.js"></script>
	        <script src="https://code.highcharts.com/modules/exporting.js"></script>';
		}
	}

	function getDashboardList(){
		// default dashboard list
		$ret = array(
			'summary' => array(
					'path' => $this->extendClassPath.'summary.php',
					'name' => 'Summary'
				),
			'timeManagement' => array(
					'path' => $this->extendClassPath.'timeManagement.php',
					'name' => 'Time Management'
				),
			'cost' => array(
					'path' => $this->extendClassPath.'cost.php',
					'name' => 'Cost Management'
				),
			'document' => array(
				'path' => $this->extendClassPath.'Document.php',
				'name' => 'Document Management'
			),
			'quality' => array(
					'path' => $this->extendClassPath.'quality.php',
					'name' => 'Quality Management'
				)
					
		);

		return $ret;
	}

	private function getRegisteredDocInfo(){
		$res = array();

		if ($this->isWPC) {
			$resDocURL = $this->jogetLinkObj->fetchLink('api', 'document_dash_doc_list', array($this->projectID));
			$resDoc = $this->jogetCURL($resDocURL);

			if (isset($resDoc['data'])) {
				usort($resDoc['data'], function ($a, $b) {
				    $t1 = strtotime($a['doc_date']);
				    $t2 = strtotime($b['doc_date']);
				    return $t1 - $t2;
				});
				foreach ($resDoc['data'] as $doc) {
					$mthCT = $this->getMonthfromTSRange(new DateTime($doc['doc_date']), $this->cutoffDay);
					if ($doc['document_type'] == "Drawing") {
						$revisedOrig = (trim($doc['revision_no']) != "") ? 'revised' : 'original';
						$doc['drawing_type'] = strtolower(trim($doc['drawing_type']));
						
						$res['overall']['all']['all']['raw'][] = $doc;
						$res['overall'][$mthCT['yr']]['all']['raw'][] = $doc;
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['raw'][] = $doc;

						$res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total']['all'] = (isset($res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total']['all'])) ? $res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total']['all']+1 : 1;
						$res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total']['all'] = (isset($res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total']['all'])) ? $res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total']['all']+1 : 1;
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total']['all'] = (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total']['all'])) ? $res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total']['all']+1 : 1;
						
						$res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig] = (isset($res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig])) ? $res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig]+1 : 1;
						$res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig] = (isset($res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig])) ? $res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig]+1 : 1;
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total'][$revisedOrig] = (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total'][$revisedOrig])) ? $res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total'][$revisedOrig]+1 : 1;
						
						if (isset($res['overall']['all']['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig])) {
							$res['overall']['all']['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig]++;
						}else{
							$res['overall']['all']['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig])) {
							$res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig] = 1;
						}
					}
					// aging and archiving
					if (isset($res['overall']['all']['all']['archiving'][$doc['archiving_year']])) {
						$res['overall']['all']['all']['archiving'][$doc['archiving_year']]++;
					}else{
						$res['overall']['all']['all']['archiving'][$doc['archiving_year']] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']]['all']['archiving'][$doc['archiving_year']])) {
						$res['overall'][$mthCT['yr']]['all']['archiving'][$doc['archiving_year']]++;
					}else{
						$res['overall'][$mthCT['yr']]['all']['archiving'][$doc['archiving_year']] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['archiving'][$doc['archiving_year']])) {
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['archiving'][$doc['archiving_year']]++;
					}else{
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['archiving'][$doc['archiving_year']] = 1;
					}
				}
			}
		}else{
			$resDocChildURL = $this->jogetLinkObj->fetchLink('api', 'document_dash_doc_list', array('', $this->parentProjectID));
			$resDoc = $this->jogetCURL($resDocChildURL);
			if (isset($resDoc['data'])) {
				usort($resDoc['data'], function ($a, $b) {
				    $t1 = strtotime($a['doc_date']);
				    $t2 = strtotime($b['doc_date']);
				    return $t1 - $t2;
				});
				foreach ($resDoc['data'] as $doc) {
					$mthCT = $this->getMonthfromTSRange(new DateTime($doc['doc_date']), $this->cutoffDay);
					if ($doc['document_type'] == "Drawing") {
						$revisedOrig = (trim($doc['revision_no']) != "") ? 'revised' : 'original';
						$doc['drawing_type'] = strtolower(trim($doc['drawing_type']));
						
						$res['overall']['all']['all']['raw'][] = $doc;
						$res['overall'][$mthCT['yr']]['all']['raw'][] = $doc;
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['raw'][] = $doc;

						$res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total']['all'] = (isset($res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total']['all'])) ? $res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total']['all']+1 : 1;
						$res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total']['all'] = (isset($res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total']['all'])) ? $res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total']['all']+1 : 1;
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total']['all'] = (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total']['all'])) ? $res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total']['all']+1 : 1;
						
						$res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig] = (isset($res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig])) ? $res['overall']['all']['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig]+1 : 1;
						$res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig] = (isset($res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig])) ? $res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig]+1 : 1;
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total'][$revisedOrig] = (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total'][$revisedOrig])) ? $res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total'][$revisedOrig]+1 : 1;
						
						if (isset($res['overall']['all']['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig])) {
							$res['overall']['all']['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig]++;
						}else{
							$res['overall']['all']['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig])) {
							$res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig] = 1;
						}

						// for child 
						$res[$doc['package_id']]['all']['all']['raw'][] = $doc;
						$res[$doc['package_id']][$mthCT['yr']]['all']['raw'][] = $doc;
						$res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['raw'][] = $doc;

						$res[$doc['package_id']]['all']['all']['drawing'][$doc['drawing_type']]['total']['all'] = (isset($res[$doc['package_id']]['all']['all']['drawing'][$doc['drawing_type']]['total']['all'])) ? $res[$doc['package_id']]['all']['all']['drawing'][$doc['drawing_type']]['total']['all']+1 : 1;
						$res[$doc['package_id']][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total']['all'] = (isset($res[$doc['package_id']][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total']['all'])) ? $res[$doc['package_id']][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total']['all']+1 : 1;
						$res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total']['all'] = (isset($res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total']['all'])) ? $res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total']['all']+1 : 1;
						
						$res[$doc['package_id']]['all']['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig] = (isset($res[$doc['package_id']]['all']['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig])) ? $res[$doc['package_id']]['all']['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig]+1 : 1;
						$res[$doc['package_id']][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig] = (isset($res[$doc['package_id']][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig])) ? $res[$doc['package_id']][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['total'][$revisedOrig]+1 : 1;
						$res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total'][$revisedOrig] = (isset($res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total'][$revisedOrig])) ? $res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['total'][$revisedOrig]+1 : 1;
						
						if (isset($res[$doc['package_id']]['all']['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig])) {
							$res[$doc['package_id']]['all']['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig]++;
						}else{
							$res[$doc['package_id']]['all']['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig] = 1;
						}
						if (isset($res[$doc['package_id']][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig])) {
							$res[$doc['package_id']][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig]++;
						}else{
							$res[$doc['package_id']][$mthCT['yr']]['all']['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig] = 1;
						}
						if (isset($res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig])) {
							$res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig]++;
						}else{
							$res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['drawing'][$doc['drawing_type']]['byTrait'][$doc['trait']][$revisedOrig] = 1;
						}
					}

					// aging and archiving
					if (isset($res['overall']['all']['all']['archiving'][$doc['archiving_year']])) {
						$res['overall']['all']['all']['archiving'][$doc['archiving_year']]++;
					}else{
						$res['overall']['all']['all']['archiving'][$doc['archiving_year']] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']]['all']['archiving'][$doc['archiving_year']])) {
						$res['overall'][$mthCT['yr']]['all']['archiving'][$doc['archiving_year']]++;
					}else{
						$res['overall'][$mthCT['yr']]['all']['archiving'][$doc['archiving_year']] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['archiving'][$doc['archiving_year']])) {
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['archiving'][$doc['archiving_year']]++;
					}else{
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['archiving'][$doc['archiving_year']] = 1;
					}
					// child
					if (isset($res[$doc['package_id']]['all']['all']['archiving'][$doc['archiving_year']])) {
						$res[$doc['package_id']]['all']['all']['archiving'][$doc['archiving_year']]++;
					}else{
						$res[$doc['package_id']]['all']['all']['archiving'][$doc['archiving_year']] = 1;
					}
					if (isset($res[$doc['package_id']][$mthCT['yr']]['all']['archiving'][$doc['archiving_year']])) {
						$res[$doc['package_id']][$mthCT['yr']]['all']['archiving'][$doc['archiving_year']]++;
					}else{
						$res[$doc['package_id']][$mthCT['yr']]['all']['archiving'][$doc['archiving_year']] = 1;
					}
					if (isset($res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['archiving'][$doc['archiving_year']])) {
						$res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['archiving'][$doc['archiving_year']]++;
					}else{
						$res[$doc['package_id']][$mthCT['yr']][$mthCT['mth']]['archiving'][$doc['archiving_year']] = 1;
					}
				}
			}
		}
		return $res;
	}

	private function getCorrInfo_opt(){
		$res = array();
		if ($this->isWPC) {
			$resCorrURL = $this->jogetLinkObj->fetchLink("api","document_dash_corr_list_opt", array($this->projectID,'', $this->cutoffDay));
			$resCorrRes = $this->jogetCURL($resCorrURL);
			if (isset($resCorrRes['data'])) {
				// usort($resCorrRes['data'], function ($a, $b) {
				//     $t1 = strtotime($a['doc_date']);
				//     $t2 = strtotime($b['doc_date']);
				//     return $t1 - $t2;
				// });
				foreach ($resCorrRes['data'] as $corr) {
					$corr['status'] = ($corr['status']) ? (($corr['status'] == 'Closed') ? 'Responded' :  $corr['status']) : 'Pending';
					// $mthCT = $this->getMonthfromTSRange(new DateTime($corr['doc_date']), $this->cutoffDay);
					$yr = $corr['date_Year'];
					$mth = $corr['date_Month'];

					// // populate overall data
					// $res['overall']['all']['all'][$corr['corr_type']]['raw'][] = $corr;
					// $res['overall'][$yr]['all'][$corr['corr_type']]['raw'][] = $corr;
					// $res['overall'][$yr][$mth][$corr['corr_type']]['raw'][] = $corr;

					// by reciever/sender based in status for (Incoming + to Respond) and (Outgoing)
					if ($corr['corr_type'] == 'Incoming') {
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}

						// by reciever/sender in total
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}

						// purely by status
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']] = $corr['total_sum'];
						}

						// card for count responded & pending
						if (isset($res['overall']['all']['all']['card'][$corr['status']])) {
							$res['overall']['all']['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all']['card'][$corr['status']])) {
							$res['overall'][$yr]['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth]['card'][$corr['status']])) {
							$res['overall'][$yr][$mth]['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth]['card'][$corr['status']] = $corr['total_sum'];
						}

					}else{
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}

						// by reciever/sender in total
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}

						// card for count responded & pending
						if (isset($res['overall']['all']['all']['card'][$corr['status']])) {
							$res['overall']['all']['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all']['card'][$corr['status']])) {
							$res['overall'][$yr]['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth]['card'][$corr['status']])) {
							$res['overall'][$yr][$mth]['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth]['card'][$corr['status']] = $corr['total_sum'];
						}
					}
					// total
					if (isset($res['overall']['all']['all'][$corr['corr_type']]['total'])) {
						$res['overall']['all']['all'][$corr['corr_type']]['total'] += $corr['total_sum'];
					}else{
						$res['overall']['all']['all'][$corr['corr_type']]['total'] = $corr['total_sum'];
					}
					if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['total'])) {
						$res['overall'][$yr]['all'][$corr['corr_type']]['total'] += $corr['total_sum'];
					}else{
						$res['overall'][$yr]['all'][$corr['corr_type']]['total'] = $corr['total_sum'];
					}
					if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['total'])) {
						$res['overall'][$yr][$mth][$corr['corr_type']]['total'] += $corr['total_sum'];
					}else{
						$res['overall'][$yr][$mth][$corr['corr_type']]['total'] = $corr['total_sum'];
					}
					// if type email
					if ($corr['type'] == 'Email') {
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['totalMail'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['totalMail'] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['totalMail'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'] = $corr['total_sum'];
						}
					}
				}
			}
		}else {
			$resCorrURL = $this->jogetLinkObj->fetchLink("api","document_dash_corr_list_opt", array('', $this->parentProjectID, $this->cutoffDay));
			$resCorrRes = $this->jogetCURL($resCorrURL);
			if (isset($resCorrRes['data'])) {
				// usort($resCorrRes['data'], function ($a, $b) {
				//     $t1 = strtotime($a['doc_date']);
				//     $t2 = strtotime($b['doc_date']);
				//     return $t1 - $t2;
				// }); 
				foreach ($resCorrRes['data'] as $corr) {
					$corr['status'] = ($corr['status']) ? (($corr['status'] == 'Closed') ? 'Responded' :  $corr['status']) : 'Pending';
					$yr = $corr['date_Year'];
					$mth = $corr['date_Month'];

					//for Debug use
					//if($corr['package_id'] == 'SSB' && $yr == '2021' && $corr['corr_type'] == 'Incoming') {$res[$corr['package_id']]['raw'][] = $corr; }

					// by reciever/sender based in status for (Incoming + to Respond) and (Outgoing)
					if ($corr['corr_type'] == 'Incoming') {
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						// for child
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}

						// by reciever/sender in total
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}

						// for child
						// by reciever/sender in total
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}

						// purely by status
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']] = $corr['total_sum'];
						}

						// for child
						// purely by status
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']] = $corr['total_sum'];
						}

						// card for count responded & pending
						if (isset($res['overall']['all']['all']['card'][$corr['status']])) {
							$res['overall']['all']['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all']['card'][$corr['status']])) {
							$res['overall'][$yr]['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth]['card'][$corr['status']])) {
							$res['overall'][$yr][$mth]['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth]['card'][$corr['status']] = $corr['total_sum'];
						}

						// for child
						// card for count responded & pending
						if (isset($res[$corr['package_id']]['all']['all']['card'][$corr['status']])) {
							$res[$corr['package_id']]['all']['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']]['all']['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr]['all']['card'][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr]['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr][$mth]['card'][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth]['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr][$mth]['card'][$corr['status']] = $corr['total_sum'];
						}

					}else{
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						//for child
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = $corr['total_sum'];
						}

						// by reciever/sender in total
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}

						// for child
						// by reciever/sender in total
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = $corr['total_sum'];
						}

						// card for count responded & pending
						if (isset($res['overall']['all']['all']['card'][$corr['status']])) {
							$res['overall']['all']['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all']['card'][$corr['status']])) {
							$res['overall'][$yr]['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth]['card'][$corr['status']])) {
							$res['overall'][$yr][$mth]['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth]['card'][$corr['status']] = $corr['total_sum'];
						}

						// for child
						// card for count responded & pending
						if (isset($res[$corr['package_id']]['all']['all']['card'][$corr['status']])) {
							$res[$corr['package_id']]['all']['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']]['all']['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr]['all']['card'][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all']['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr]['all']['card'][$corr['status']] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr][$mth]['card'][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth]['card'][$corr['status']] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr][$mth]['card'][$corr['status']] = $corr['total_sum'];
						}
					}

					// total
					if (isset($res['overall']['all']['all'][$corr['corr_type']]['total'])) {
						$res['overall']['all']['all'][$corr['corr_type']]['total'] += $corr['total_sum'];
					}else{
						$res['overall']['all']['all'][$corr['corr_type']]['total'] = $corr['total_sum'];
					}
					if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['total'])) {
						$res['overall'][$yr]['all'][$corr['corr_type']]['total'] += $corr['total_sum'];
					}else{
						$res['overall'][$yr]['all'][$corr['corr_type']]['total'] = $corr['total_sum'];
					}
					if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['total'])) {
						$res['overall'][$yr][$mth][$corr['corr_type']]['total'] += $corr['total_sum'];
					}else{
						$res['overall'][$yr][$mth][$corr['corr_type']]['total'] = $corr['total_sum'];
					}

					// for child
					// total
					if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['total'])) {
						$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['total'] += $corr['total_sum'];
					}else{
						$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['total'] = $corr['total_sum'];
					}
					if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['total'])) {
						$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['total'] += $corr['total_sum'];
					}else{
						$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['total'] = $corr['total_sum'];
					}
					if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['total'])) {
						$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['total'] += $corr['total_sum'];
					}else{
						$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['total'] = $corr['total_sum'];
					}

					// if type email
					if ($corr['type'] == 'Email') {
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['totalMail'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['totalMail'] += $corr['total_sum'];
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['totalMail'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'] = $corr['total_sum'];
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'] += $corr['total_sum'];
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'] = $corr['total_sum'];
						}

						// for child
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['totalMail'])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['totalMail'] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['totalMail'] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['totalMail'])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['totalMail'] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['totalMail'] = $corr['total_sum'];
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['totalMail'])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['totalMail'] += $corr['total_sum'];
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['totalMail'] = $corr['total_sum'];
						}
					}
				}
			}		
		}

		return $res;

	}
	
	private function getCorrInfo(){
		$res = array();
		if ($this->isWPC) {
			$resCorrURL = $this->jogetLinkObj->fetchLink("api","document_dash_corr_list", array($this->projectID));
			$resCorrRes = $this->jogetCURL($resCorrURL);
			if (isset($resCorrRes['data'])) {
				usort($resCorrRes['data'], function ($a, $b) {
				    $t1 = strtotime($a['doc_date']);
				    $t2 = strtotime($b['doc_date']);
				    return $t1 - $t2;
				});
				foreach ($resCorrRes['data'] as $corr) {
					$corr['status'] = ($corr['status']) ? (($corr['status'] == 'Closed') ? 'Responded' :  $corr['status']) : 'Pending';
					$mthCT = $this->getMonthfromTSRange(new DateTime($corr['doc_date']), $this->cutoffDay);
					$yr = $mthCT['yr'];
					$mth = $mthCT['mth'];

					// populate overall data
					$res['overall']['all']['all'][$corr['corr_type']]['raw'][] = $corr;
					$res['overall'][$yr]['all'][$corr['corr_type']]['raw'][] = $corr;
					$res['overall'][$yr][$mth][$corr['corr_type']]['raw'][] = $corr;

					// by reciever/sender based in status for (Incoming + to Respond) and (Outgoing)
					if ($corr['corr_type'] == 'Incoming') {
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}

						// by reciever/sender in total
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}

						// purely by status
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']]++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']] = 1;
						}

						// card for count responded & pending
						if (isset($res['overall']['all']['all']['card'][$corr['status']])) {
							$res['overall']['all']['all']['card'][$corr['status']]++;
						}else{
							$res['overall']['all']['all']['card'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all']['card'][$corr['status']])) {
							$res['overall'][$yr]['all']['card'][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all']['card'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth]['card'][$corr['status']])) {
							$res['overall'][$yr][$mth]['card'][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth]['card'][$corr['status']] = 1;
						}

					}else{
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}

						// by reciever/sender in total
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}

						// card for count responded & pending
						if (isset($res['overall']['all']['all']['card'][$corr['status']])) {
							$res['overall']['all']['all']['card'][$corr['status']]++;
						}else{
							$res['overall']['all']['all']['card'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all']['card'][$corr['status']])) {
							$res['overall'][$yr]['all']['card'][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all']['card'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth]['card'][$corr['status']])) {
							$res['overall'][$yr][$mth]['card'][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth]['card'][$corr['status']] = 1;
						}
					}
					// total
					if (isset($res['overall']['all']['all'][$corr['corr_type']]['total'])) {
						$res['overall']['all']['all'][$corr['corr_type']]['total']++;
					}else{
						$res['overall']['all']['all'][$corr['corr_type']]['total'] = 1;
					}
					if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['total'])) {
						$res['overall'][$yr]['all'][$corr['corr_type']]['total']++;
					}else{
						$res['overall'][$yr]['all'][$corr['corr_type']]['total'] = 1;
					}
					if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['total'])) {
						$res['overall'][$yr][$mth][$corr['corr_type']]['total']++;
					}else{
						$res['overall'][$yr][$mth][$corr['corr_type']]['total'] = 1;
					}
					// if type email
					if ($corr['type'] == 'Email') {
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['totalMail'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['totalMail']++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['totalMail'] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['totalMail']++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['totalMail']++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'] = 1;
						}
					}
				}
			}
		}else {
			$resCorrURL = $this->jogetLinkObj->fetchLink("api","document_dash_corr_list", array('', $this->parentProjectID));
			$resCorrRes = $this->jogetCURL($resCorrURL);
			if (isset($resCorrRes['data'])) {
				usort($resCorrRes['data'], function ($a, $b) {
				    $t1 = strtotime($a['doc_date']);
				    $t2 = strtotime($b['doc_date']);
				    return $t1 - $t2;
				});
				foreach ($resCorrRes['data'] as $corr) {
					$corr['status'] = ($corr['status']) ? (($corr['status'] == 'Closed') ? 'Responded' :  $corr['status']) : 'Pending';
					$mthCT = $this->getMonthfromTSRange(new DateTime($corr['doc_date']), $this->cutoffDay);
					$yr = $mthCT['yr'];
					$mth = $mthCT['mth'];

					// populate overall data
					$res['overall']['all']['all'][$corr['corr_type']]['raw'][] = $corr;
					$res['overall'][$yr]['all'][$corr['corr_type']]['raw'][] = $corr;
					$res['overall'][$yr][$mth][$corr['corr_type']]['raw'][] = $corr;

					// for child
					// populate overall data
					$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['raw'][] = $corr;
					$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['raw'][] = $corr;
					$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['raw'][] = $corr;
					
					// by reciever/sender based in status for (Incoming + to Respond) and (Outgoing)
					if ($corr['corr_type'] == 'Incoming') {
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						// for child
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}

						// by reciever/sender in total
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}

						// for child
						// by reciever/sender in total
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}

						// purely by status
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']]++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']] = 1;
						}

						// for child
						// purely by status
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']]++;
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byStatus'][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byStatus'][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byStatus'][$corr['status']] = 1;
						}

						// card for count responded & pending
						if (isset($res['overall']['all']['all']['card'][$corr['status']])) {
							$res['overall']['all']['all']['card'][$corr['status']]++;
						}else{
							$res['overall']['all']['all']['card'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all']['card'][$corr['status']])) {
							$res['overall'][$yr]['all']['card'][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all']['card'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth]['card'][$corr['status']])) {
							$res['overall'][$yr][$mth]['card'][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth]['card'][$corr['status']] = 1;
						}

						// for child
						// card for count responded & pending
						if (isset($res[$corr['package_id']]['all']['all']['card'][$corr['status']])) {
							$res[$corr['package_id']]['all']['all']['card'][$corr['status']]++;
						}else{
							$res[$corr['package_id']]['all']['all']['card'][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr]['all']['card'][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all']['card'][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr]['all']['card'][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr][$mth]['card'][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth]['card'][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr][$mth]['card'][$corr['status']] = 1;
						}

					}else{
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						//for child
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']][$corr['status']] = 1;
						}

						// by reciever/sender in total
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}

						// for child
						// by reciever/sender in total
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total']++;
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['byRecieverSender'][$corr['reciever_sender']]['total'] = 1;
						}

						// card for count responded & pending
						if (isset($res['overall']['all']['all']['card'][$corr['status']])) {
							$res['overall']['all']['all']['card'][$corr['status']]++;
						}else{
							$res['overall']['all']['all']['card'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr]['all']['card'][$corr['status']])) {
							$res['overall'][$yr]['all']['card'][$corr['status']]++;
						}else{
							$res['overall'][$yr]['all']['card'][$corr['status']] = 1;
						}
						if (isset($res['overall'][$yr][$mth]['card'][$corr['status']])) {
							$res['overall'][$yr][$mth]['card'][$corr['status']]++;
						}else{
							$res['overall'][$yr][$mth]['card'][$corr['status']] = 1;
						}

						// for child
						// card for count responded & pending
						if (isset($res[$corr['package_id']]['all']['all']['card'][$corr['status']])) {
							$res[$corr['package_id']]['all']['all']['card'][$corr['status']]++;
						}else{
							$res[$corr['package_id']]['all']['all']['card'][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr]['all']['card'][$corr['status']])) {
							$res[$corr['package_id']][$yr]['all']['card'][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr]['all']['card'][$corr['status']] = 1;
						}
						if (isset($res[$corr['package_id']][$yr][$mth]['card'][$corr['status']])) {
							$res[$corr['package_id']][$yr][$mth]['card'][$corr['status']]++;
						}else{
							$res[$corr['package_id']][$yr][$mth]['card'][$corr['status']] = 1;
						}
					}

					// total
					if (isset($res['overall']['all']['all'][$corr['corr_type']]['total'])) {
						$res['overall']['all']['all'][$corr['corr_type']]['total']++;
					}else{
						$res['overall']['all']['all'][$corr['corr_type']]['total'] = 1;
					}
					if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['total'])) {
						$res['overall'][$yr]['all'][$corr['corr_type']]['total']++;
					}else{
						$res['overall'][$yr]['all'][$corr['corr_type']]['total'] = 1;
					}
					if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['total'])) {
						$res['overall'][$yr][$mth][$corr['corr_type']]['total']++;
					}else{
						$res['overall'][$yr][$mth][$corr['corr_type']]['total'] = 1;
					}

					// for child
					// total
					if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['total'])) {
						$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['total']++;
					}else{
						$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['total'] = 1;
					}
					if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['total'])) {
						$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['total']++;
					}else{
						$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['total'] = 1;
					}
					if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['total'])) {
						$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['total']++;
					}else{
						$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['total'] = 1;
					}

					// if type email
					if ($corr['type'] == 'Email') {
						if (isset($res['overall']['all']['all'][$corr['corr_type']]['totalMail'])) {
							$res['overall']['all']['all'][$corr['corr_type']]['totalMail']++;
						}else{
							$res['overall']['all']['all'][$corr['corr_type']]['totalMail'] = 1;
						}
						if (isset($res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'])) {
							$res['overall'][$yr]['all'][$corr['corr_type']]['totalMail']++;
						}else{
							$res['overall'][$yr]['all'][$corr['corr_type']]['totalMail'] = 1;
						}
						if (isset($res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'])) {
							$res['overall'][$yr][$mth][$corr['corr_type']]['totalMail']++;
						}else{
							$res['overall'][$yr][$mth][$corr['corr_type']]['totalMail'] = 1;
						}

						// for child
						if (isset($res[$corr['package_id']]['all']['all'][$corr['corr_type']]['totalMail'])) {
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['totalMail']++;
						}else{
							$res[$corr['package_id']]['all']['all'][$corr['corr_type']]['totalMail'] = 1;
						}
						if (isset($res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['totalMail'])) {
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['totalMail']++;
						}else{
							$res[$corr['package_id']][$yr]['all'][$corr['corr_type']]['totalMail'] = 1;
						}
						if (isset($res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['totalMail'])) {
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['totalMail']++;
						}else{
							$res[$corr['package_id']][$yr][$mth][$corr['corr_type']]['totalMail'] = 1;
						}
					}
				}
			}		
		}

		return $res;

	}

	function getDocInfo(){
		$docInfo = $this->getRegisteredDocInfo();
		$corrInfo = $this->getCorrInfo_opt();
		$ret = array(
			'doc' => $docInfo,
			'corr' => $corrInfo,
			'packageCutOffDay' => $this->packageCutOffArr
		);
		return $ret;
	}
	
	private function getIncidentInfo(){
		$res = array();
		if ($this->isWPC) {
			$incCatArr = array();
			$resIncURL = $this->jogetLinkObj->fetchLink('api', 'construct_dash_IR', array($this->projectID, $this->parentProjectID));
			$resIncRes = $this->jogetCURL($resIncURL);
			if (isset($resIncRes['data'])) {
				usort($resIncRes['data'], function ($a, $b) {
				    $t1 = strtotime($a['incident_date']);
				    $t2 = strtotime($b['incident_date']);
				    return $t1 - $t2;
				});
				foreach ($resIncRes['data'] as $inc) {
					$dateCreated = strtotime($inc['incident_date']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);
					// as we taking directly from 

					if(!in_array($inc['incident_category'], $incCatArr)) $incCatArr[] = $inc['incident_category'];
					// by category total/current
					if (isset($res['overall']['all']['all']['byCategory'][$inc['incident_category']]['cumulative'])) {
						$res['overall']['all']['all']['byCategory'][$inc['incident_category']]['cumulative']++;
					}else{
						$res['overall']['all']['all']['byCategory'][$inc['incident_category']]['cumulative'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']]['all']['byCategory'][$inc['incident_category']]['current'])) {
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$inc['incident_category']]['current']++;
					}else{
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$inc['incident_category']]['current'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$inc['incident_category']]['current'])) {
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$inc['incident_category']]['current']++;
					}else{
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$inc['incident_category']]['current'] = 1;
					}

					if (isset($res['overall']['all']['all']['fatality'][$inc['fatality_type']])) {
						$res['overall']['all']['all']['fatality'][$inc['fatality_type']] = $res['overall']['all']['all']['fatality'][$inc['fatality_type']] + (int) $inc['fatality_no'];
					}else{
						$res['overall']['all']['all']['fatality'][$inc['fatality_type']] = (int) $inc['fatality_no'];
					}
					if (isset($res['overall'][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']])) {
						$res['overall'][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']] = $res['overall'][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']] + (int) $inc['fatality_no'];
					}else{
						$res['overall'][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']] = (int) $inc['fatality_no'];
					}
					if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']])) {
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']] = $res['overall'][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']] + (int) $inc['fatality_no'];
					}else{
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']] = (int) $inc['fatality_no'];
					}

					// by types of property if incident category - Property Damage
					if ($inc['incident_category'] == "Property Damage") {
						if (isset($res['overall']['all']['all']['byPropDamageType'][$inc['property_damage_type']]['total'])) {
							$res['overall']['all']['all']['byPropDamageType'][$inc['property_damage_type']]['total']++;
						}else{
							$res['overall']['all']['all']['byPropDamageType'][$inc['property_damage_type']]['total'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['byPropDamageType'][$inc['property_damage_type']]['total'])) {
							$res['overall'][$mthCT['yr']]['all']['byPropDamageType'][$inc['property_damage_type']]['total']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['byPropDamageType'][$inc['property_damage_type']]['total'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byPropDamageType'][$inc['property_damage_type']]['total'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byPropDamageType'][$inc['property_damage_type']]['total']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byPropDamageType'][$inc['property_damage_type']]['total'] = 1;
						}
					}
				}

				/****Cumulation calculation start*****/
				if($resIncRes['data'] && $incCatArr){
					// by category cumul - calculated based on total value each month
					foreach($incCatArr as $incCat){
						$minDate = strtotime($resIncRes['data'][0]['incident_date']);
						$maxDate = strtotime(end($resIncRes['data'])['incident_date']);
						$now = time();
						if($maxDate > $now){
							$maxYear = date("Y", $maxDate);
						}
						else{
							$maxYear = date("Y", $now);
						}
						$minYear = date("Y", $minDate);
						$yDiff = $maxYear - $minYear;
						$yr = $minYear;
						$monthHalftext = array("1"=>"01","2"=>"02","3"=>"03","4"=>"04","5"=>"05","6"=>"06","7"=>"07","8"=>"08","9"=>"09","10"=>"10","11"=>"11","12"=>"12");
									
						$valMthData = 0;
						$valYearData = 0;
						for ($i=0; $i < $yDiff+1 ; $i++) {
							$nYr = $yr++;

							if (isset($res['overall'][$nYr]['all']['byCategory'][$incCat]['current'])) {
								$valYearData = $valYearData + $res['overall'][$nYr]['all']['byCategory'][$incCat]['current'];
							}
							$res['overall'][$nYr]['all']['byCategory'][$incCat]['cumulative'] = $valYearData;

							foreach ($monthHalftext as $key => $mthval) {
								if (isset($res['overall'][$nYr][$mthval]['byCategory'][$incCat]['current'])) {
									$valMthData = $valMthData + $res['overall'][$nYr][$mthval]['byCategory'][$incCat]['current'];
								}
								$res['overall'][$nYr][$mthval]['byCategory'][$incCat]['cumulative'] = $valMthData;
							}
						}
					}
				}
				/****Cumulation calculation end*****/
			}
		}else {
			$valAllMthData = 0;
			$valAllYearData = 0;

			$resIncURL = $this->jogetLinkObj->fetchLink('api', 'construct_dash_IR', array('', $this->parentProjectID));
			$resIncRes = $this->jogetCURL($resIncURL);
			$incCatArr = array();
			if (isset($resIncRes['data'])) {
				usort($resIncRes['data'], function ($a, $b) {
				    $t1 = strtotime($a['incident_date']);
				    $t2 = strtotime($b['incident_date']);
				    return $t1 - $t2;
				});
				foreach ($resIncRes['data'] as $inc) {
					$dateCreated = strtotime($inc['incident_date']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);
					
					if(!in_array($inc['incident_category'], $incCatArr)) $incCatArr[] = $inc['incident_category'];

					if (isset($res['overall']['all']['all']['byCategory'][$inc['incident_category']]['cumulative'])) {
						$res['overall']['all']['all']['byCategory'][$inc['incident_category']]['cumulative']++;
					}else{
						$res['overall']['all']['all']['byCategory'][$inc['incident_category']]['cumulative'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']]['all']['byCategory'][$inc['incident_category']]['current'])) {
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$inc['incident_category']]['current']++;
					}else{
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$inc['incident_category']]['current'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$inc['incident_category']]['current'])) {
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$inc['incident_category']]['current']++;
					}else{
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$inc['incident_category']]['current'] = 1;
					}
		
					if (isset($res['overall']['all']['all']['fatality'][$inc['fatality_type']])) {
						$res['overall']['all']['all']['fatality'][$inc['fatality_type']] = $res['overall']['all']['all']['fatality'][$inc['fatality_type']] + (int) $inc['fatality_no'];
					}else{
						$res['overall']['all']['all']['fatality'][$inc['fatality_type']] = (int) $inc['fatality_no'];
					}
					if (isset($res['overall'][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']])) {
						$res['overall'][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']] = $res['overall'][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']] + (int) $inc['fatality_no'];
					}else{
						$res['overall'][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']] = (int) $inc['fatality_no'];
					}
					if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']])) {
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']] = $res['overall'][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']] + (int) $inc['fatality_no'];
					}else{
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']] = (int) $inc['fatality_no'];
					}

					//-----------START CHILD-----------------//
					if (isset($res[$inc['package_id']]['all']['all']['byCategory'][$inc['incident_category']]['cumulative'])) {
						$res[$inc['package_id']]['all']['all']['byCategory'][$inc['incident_category']]['cumulative']++;
					}else{
						$res[$inc['package_id']]['all']['all']['byCategory'][$inc['incident_category']]['cumulative'] = 1;
					}
					if (isset($res[$inc['package_id']][$mthCT['yr']]['all']['byCategory'][$inc['incident_category']]['current'])) {
						$res[$inc['package_id']][$mthCT['yr']]['all']['byCategory'][$inc['incident_category']]['current']++;
					}else{
						$res[$inc['package_id']][$mthCT['yr']]['all']['byCategory'][$inc['incident_category']]['current'] = 1;
					}
					if (isset($res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['byCategory'][$inc['incident_category']]['current'])) {
						$res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['byCategory'][$inc['incident_category']]['current']++;
					}else{
						$res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['byCategory'][$inc['incident_category']]['current'] = 1;
					}

					if (isset($res[$inc['package_id']]['all']['all']['fatality'][$inc['fatality_type']])) {
						$res[$inc['package_id']]['all']['all']['fatality'][$inc['fatality_type']] = $res[$inc['package_id']]['all']['all']['fatality'][$inc['fatality_type']] + (int) $inc['fatality_no'];
					}
					else{
						$res[$inc['package_id']]['all']['all']['fatality'][$inc['fatality_type']] = (int) $inc['fatality_no'];
					}
					if (isset($res[$inc['package_id']][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']])) {
						$res[$inc['package_id']][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']] = $res[$inc['package_id']][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']] + (int) $inc['fatality_no'];
					}
					else{
						$res[$inc['package_id']][$mthCT['yr']]['all']['fatality'][$inc['fatality_type']] = (int) $inc['fatality_no'];
					}
					if (isset($res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']])) {
						$res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']] = $res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']] + (int) $inc['fatality_no'];
					}
					else{
						$res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['fatality'][$inc['fatality_type']] = (int) $inc['fatality_no'];
					}
					//-----------END CHILD-----------------//

					// by types of property if incident category - Property Damage
					if ($inc['incident_category'] == "Property Damage") {
						if (isset($res['overall']['all']['all']['byPropDamageType'][$inc['property_damage_type']]['total'])) {
							$res['overall']['all']['all']['byPropDamageType'][$inc['property_damage_type']]['total']++;
						}else{
							$res['overall']['all']['all']['byPropDamageType'][$inc['property_damage_type']]['total'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['byPropDamageType'][$inc['property_damage_type']]['total'])) {
							$res['overall'][$mthCT['yr']]['all']['byPropDamageType'][$inc['property_damage_type']]['total']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['byPropDamageType'][$inc['property_damage_type']]['total'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byPropDamageType'][$inc['property_damage_type']]['total'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byPropDamageType'][$inc['property_damage_type']]['total']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byPropDamageType'][$inc['property_damage_type']]['total'] = 1;
						}

						//-----------START CHILD----------------//
						if (isset($res[$inc['package_id']]['all']['all']['byPropDamageType'][$inc['property_damage_type']]['total'])) {
							$res[$inc['package_id']]['all']['all']['byPropDamageType'][$inc['property_damage_type']]['total']++;
						}else{
							$res[$inc['package_id']]['all']['all']['byPropDamageType'][$inc['property_damage_type']]['total'] = 1;
						}
						if (isset($res[$inc['package_id']][$mthCT['yr']]['all']['byPropDamageType'][$inc['property_damage_type']]['total'])) {
							$res[$inc['package_id']][$mthCT['yr']]['all']['byPropDamageType'][$inc['property_damage_type']]['total']++;
						}else{
							$res[$inc['package_id']][$mthCT['yr']]['all']['byPropDamageType'][$inc['property_damage_type']]['total'] = 1;
						}
						if (isset($res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['byPropDamageType'][$inc['property_damage_type']]['total'])) {
							$res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['byPropDamageType'][$inc['property_damage_type']]['total']++;
						}else{
							$res[$inc['package_id']][$mthCT['yr']][$mthCT['mth']]['byPropDamageType'][$inc['property_damage_type']]['total'] = 1;
						}
						//-----------END CHILD----------------//
					}
				}
				foreach ($this->childProjectInfo as $childID) {
					/****Cumulation calculation start*****/
					if($resIncRes['data'] && $incCatArr){
						// by category cumul - calculated based on total value each month
						foreach($incCatArr as $incCat){
							$minDate = strtotime($resIncRes['data'][0]['incident_date']);
							$maxDate = strtotime(end($resIncRes['data'])['incident_date']);
							$now = time();
							if($maxDate > $now){
								$maxYear = date("Y", $maxDate);
							}
							else{
								$maxYear = date("Y", $now);
							}
							$minYear = date("Y", $minDate);
							$yDiff = $maxYear - $minYear;
							$yr = $minYear;
							$monthHalftext = array("1"=>"01","2"=>"02","3"=>"03","4"=>"04","5"=>"05","6"=>"06","7"=>"07","8"=>"08","9"=>"09","10"=>"10","11"=>"11","12"=>"12");
										
							$valMthData = 0;
							$valYearData = 0;
							for ($i=0; $i < $yDiff+1 ; $i++) {
								$nYr = $yr++; 

								if (isset($res['overall'][$nYr]['all']['byCategory'][$incCat]['current'])) {
									$valAllYearData = $valAllYearData + $res['overall'][$nYr]['all']['byCategory'][$incCat]['current'];
								}
								$res['overall'][$nYr]['all']['byCategory'][$incCat]['cumulative'] = $valAllYearData;

								if (isset($res[$childID['project_id']][$nYr]['all']['byCategory'][$incCat]['current'])) {
									$valYearData = $valYearData + $res[$childID['project_id']][$nYr]['all']['byCategory'][$incCat]['current'];
								}
								$res[$childID['project_id']][$nYr]['all']['byCategory'][$incCat]['cumulative'] = $valYearData;

								foreach ($monthHalftext as $key => $mthval) {
									if (isset($res['overall'][$nYr][$mthval]['byCategory'][$incCat]['current'])) {
										$valAllMthData = $valAllMthData + $res['overall'][$nYr][$mthval]['byCategory'][$incCat]['current'];
									}
									$res['overall'][$nYr][$mthval]['byCategory'][$incCat]['cumulative'] = $valAllMthData;

									// child
									if (isset($res[$childID['project_id']][$nYr][$mthval]['byCategory'][$incCat]['current'])) {
										$valMthData = $valMthData + $res[$childID['project_id']][$nYr][$mthval]['byCategory'][$incCat]['current'];
									}
									$res[$childID['project_id']][$nYr][$mthval]['byCategory'][$incCat]['cumulative'] = $valMthData;
								}
							}
						}
					}
					/****Cumulation calculation end*****/
				}

			}			
		}

		return $res;
	}

	private function safetyActivityRes(&$res, $sa, $id, $packID) {
		// monthly record is unique so should be only one record
		$mth = (isset($this->monthToNum[$sa['month']])) ? $this->monthToNum[$sa['month']] : $sa['month'];
		
		//SITE COMM MEETING
		if(isset($res[$id]['all']['all']['siteComm'][$packID])){
			$res[$id]['all']['all']['siteComm'][$packID] = $res[$id]['all']['all']['siteComm'][$packID] + (float) $sa['site_comm_meeting'];
		}
		else{
			$res[$id]['all']['all']['siteComm'][$packID] = (float) $sa['site_comm_meeting'];
		}
		if(isset($res[$id][$sa['year']]['all']['siteComm'][$packID])){
			$res[$id][$sa['year']]['all']['siteComm'][$packID] = $res[$id][$sa['year']]['all']['siteComm'][$packID] + (float) $sa['site_comm_meeting'];
		}
		else{
			$res[$id][$sa['year']]['all']['siteComm'][$packID] = (float) $sa['site_comm_meeting'];
		}
		if(isset($res[$id][$sa['year']][$mth]['siteComm'][$packID])){
			$res[$id][$sa['year']][$mth]['siteComm'][$packID] = $res[$id][$sa['year']][$mth]['siteComm'][$packID] + (float) $sa['site_comm_meeting'];
		}
		else{
			$res[$id][$sa['year']][$mth]['siteComm'][$packID] = (float) $sa['site_comm_meeting'];
		}

		//TOOLBOX BRIEFING
		if(isset($res[$id]['all']['all']['toolboxBrief'][$packID])){
			$res[$id]['all']['all']['toolboxBrief'][$packID] = $res[$id]['all']['all']['toolboxBrief'][$packID] + (float) $sa['toolbox_briefing'];
		}
		else{
			$res[$id]['all']['all']['toolboxBrief'][$packID] = (float) $sa['toolbox_briefing'];
		}
		if(isset($res[$id][$sa['year']]['all']['toolboxBrief'][$packID])){
			$res[$id][$sa['year']]['all']['toolboxBrief'][$packID] = $res[$id][$sa['year']]['all']['toolboxBrief'][$packID] + (float) $sa['toolbox_briefing'];
		}
		else{
			$res[$id][$sa['year']]['all']['toolboxBrief'][$packID] = (float) $sa['toolbox_briefing'];
		}
		if(isset($res[$id][$sa['year']][$mth]['toolboxBrief'][$packID])){
			$res[$id][$sa['year']][$mth]['toolboxBrief'][$packID] = $res[$id][$sa['year']][$mth]['toolboxBrief'][$packID] + (float) $sa['toolbox_briefing'];
		}
		else{
			$res[$id][$sa['year']][$mth]['toolboxBrief'][$packID] = (float) $sa['toolbox_briefing'];
		}

		//SAFETY INDUCTION
		if(isset($res[$id]['all']['all']['safe'][$packID])){
			$res[$id]['all']['all']['safe'][$packID] = $res[$id]['all']['all']['safe'][$packID] + (float) $sa['safety_induction'];
		}
		else{
			$res[$id]['all']['all']['safe'][$packID] = (float) $sa['safety_induction'];
		}
		if(isset($res[$id][$sa['year']]['all']['safe'][$packID])){
			$res[$id][$sa['year']]['all']['safe'][$packID] = $res[$id][$sa['year']]['all']['safe'][$packID] + (float) $sa['safety_induction'];
		}
		else{
			$res[$id][$sa['year']]['all']['safe'][$packID] = (float) $sa['safety_induction'];
		}
		if(isset($res[$id][$sa['year']][$mth]['safe'][$packID])){
			$res[$id][$sa['year']][$mth]['safe'][$packID] = $res[$id][$sa['year']][$mth]['safe'][$packID] + (float) $sa['safety_induction'];
		}
		else{
			$res[$id][$sa['year']][$mth]['safe'][$packID] = (float) $sa['safety_induction'];
		}

		//SAFETY WALKABOUT
		if(isset($res[$id]['all']['all']['safe'][$packID])){
			$res[$id]['all']['all']['safe'][$packID] = $res[$id]['all']['all']['safe'][$packID] + (float) $sa['safety_walkabout'];
		}
		else{
			$res[$id]['all']['all']['safe'][$packID] = (float) $sa['safety_walkabout'];
		}
		if(isset($res[$id][$sa['year']]['all']['safe'][$packID])){
			$res[$id][$sa['year']]['all']['safe'][$packID] = $res[$id][$sa['year']]['all']['safe'][$packID] + (float) $sa['safety_walkabout'];
		}
		else{
			$res[$id][$sa['year']]['all']['safe'][$packID] = (float) $sa['safety_walkabout'];
		}
		if(isset($res[$id][$sa['year']][$mth]['safe'][$packID])){
			$res[$id][$sa['year']][$mth]['safe'][$packID] = $res[$id][$sa['year']][$mth]['safe'][$packID] + (float) $sa['safety_walkabout'];
		}
		else{
			$res[$id][$sa['year']][$mth]['safe'][$packID] = (float) $sa['safety_walkabout'];
		}

		//FIRE EXTINGUISHER
		if(isset($res[$id]['all']['all']['fireExt'][$packID])){
			$res[$id]['all']['all']['fireExt'][$packID] = $res[$id]['all']['all']['fireExt'][$packID] + (float) $sa['fire_ext_training'];
		}
		else{
			$res[$id]['all']['all']['fireExt'][$packID] = (float) $sa['fire_ext_training'];
		}
		if(isset($res[$id][$sa['year']]['all']['fireExt'][$packID])){
			$res[$id][$sa['year']]['all']['fireExt'][$packID] = $res[$id][$sa['year']]['all']['fireExt'][$packID] + (float) $sa['fire_ext_training'];
		}
		else{
			$res[$id][$sa['year']]['all']['fireExt'][$packID] = (float) $sa['fire_ext_training'];
		}
		if(isset($res[$id][$sa['year']][$mth]['fireExt'][$packID])){
			$res[$id][$sa['year']][$mth]['fireExt'][$packID] = $res[$id][$sa['year']][$mth]['fireExt'][$packID] + (float) $sa['fire_ext_training'];
		}
		else{
			$res[$id][$sa['year']][$mth]['fireExt'][$packID] = (float) $sa['fire_ext_training'];
		}	
	}

	private function getSafetyActivityInfo(){
		$res = array();
		if ($this->isWPC) {
			$resSaURL = $this->jogetLinkObj->fetchLink("api","construct_dash_SA", array($this->projectID, $this->parentProjectID));
			$resSaRes = $this->jogetCURL($resSaURL);
			if (isset($resSaRes['data'])) {
				usort($resSaRes['data'], function ($a, $b) {
					return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});
				foreach ($resSaRes['data'] as $sa) {
					$this->safetyActivityRes($res, $sa, 'overall', $this->projectID);
				}
			}
		}else {
			$resSaURL = $this->jogetLinkObj->fetchLink("api","construct_dash_SA", array('', $this->parentProjectID));
			$resSaRes = $this->jogetCURL($resSaURL);
			if (isset($resSaRes['data'])) {
				usort($resSaRes['data'], function ($a, $b) {
					return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});
				foreach ($resSaRes['data'] as $sa) {
					$this->safetyActivityRes($res, $sa, 'overall', $sa['package_id']);
					$this->safetyActivityRes($res, $sa, $sa['package_id'], $sa['package_id']);
				}
			}
		}
		return $res;
	}

	private function getNcrInfo(){
		$res = array();
		if ($this->isWPC) {
			$resNcrURL = $this->jogetLinkObj->fetchLink("api","construct_dash_NCR", array($this->projectID, $this->parentProjectID));
			$resNcrRes = $this->jogetCURL($resNcrURL);
			if (isset($resNcrRes['data'])) {
				usort($resNcrRes['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_issued']);
				    $t2 = strtotime($b['date_issued']);
				    return $t1 - $t2;
				});
				foreach ($resNcrRes['data'] as $ncr) {
					// based on month cut off
					$dateCreated = strtotime($ncr['date_issued']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);
					// check data
					$ncr['sub_category'] = ($ncr['sub_category']) ? strtoupper($ncr['sub_category']) : 'Others';

					//byCategory for SHE dashboard
					if($ncr['category'] != 'Quality' && $ncr['issuer'] == 'Consultant'){
						if (isset($res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					if($ncr['category'] != 'Quality' && $ncr['receiver'] == 'Subcon'){
						if (isset($res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					// by category count
					if (isset($res['overall']['all']['all']['byCategory'][$ncr['category']]['total'])) {
						$res['overall']['all']['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res['overall']['all']['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'])) {
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'])) {
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total']++;
					}else{
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'] = 1;
					}

					// QAQC dashboard
					if ($ncr['category'] == 'Quality') {
						//START SUMMARY DASHBOARD
						// total 
						if (isset($res['overall']['all']['all']['total'])) {
							$res['overall']['all']['all']['total']++;
						}else{
							$res['overall']['all']['all']['total'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['ttl'])) {
							$res['overall'][$mthCT['yr']]['all']['ttl']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['ttl'] = 1;
						}

						////////////////////////// YEAR DIA STILL TAK JALAN PADAHAL CUMULATIVE
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['ttl'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['ttl']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['ttl'] = 1;
						}

						// purely by status - closed/ pending
						$status = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
						if (isset($res['overall']['all']['all']['byStatus'][$status])) {
							$res['overall']['all']['all']['byStatus'][$status]++;
						}else{
							$res['overall']['all']['all']['byStatus'][$status] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['byStatusBefore'][$status])) {
							$res['overall'][$mthCT['yr']]['all']['byStatusBefore'][$status]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['byStatusBefore'][$status] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status] = 1;
						}
						//END SUMMARY DASHBOARD

						// When Issuer is Consultant
						if ($ncr['issuer'] == 'Consultant') {
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['card']['Cumulative'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Cumulative']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Cumulative'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumul'])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumul'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'] = 1;
							}

							if (isset($res['overall']['all']['all']['bySor']['byStatus']['byProject'][$this->projectID]['Cumulative'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$this->projectID]['Cumulative']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$this->projectID]['Cumulative'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$this->projectID]['Cumul'])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$this->projectID]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$this->projectID]['Cumul'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$this->projectID]['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$this->projectID]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$this->projectID]['Cumul'] = 1;
							}

							// for total card
							if (isset($res['overall']['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall']['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}

							// for chart by projectid
							if (isset($res['overall']['all']['all']['bySor']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']])) {
								$res['overall']['all']['all']['bySor']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['bySor']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']] = 1;
							}

							// for total card
							$qualityStatus = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res['overall']['all']['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['bySor']['byStatus']['card']['Received'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['byProject'][$this->projectID][$qualityStatus])) {
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$this->projectID][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$this->projectID][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$this->projectID][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$this->projectID][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$this->projectID][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$this->projectID][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$this->projectID][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$this->projectID][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['bySor']['byStatus']['byProject'][$this->projectID]['Received'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$this->projectID]['Received']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$this->projectID]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$this->projectID]['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$this->projectID]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$this->projectID]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$this->projectID]['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$this->projectID]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$this->projectID]['Received'] = 1;
							}

						}

						// // When Receiver is Subcon
						// by sub category and status as well
						if ($ncr['receiver'] == 'Subcon') {

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['card']['Cumulative'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Cumulative']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Cumulative'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumul'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumul'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'] = 1;
							}

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumulative'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumulative']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumulative'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul'] = 1;
							}

							// for total card
							if (isset($res['overall']['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}

							// for chart by projectid
							if (isset($res['overall']['all']['all']['toSubCon']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']])) {
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$this->projectID][$ncr['sub_category']] = 1;
							}

							// for total card
							$qualityStatus = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$this->projectID][$qualityStatus])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$this->projectID][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$this->projectID][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$this->projectID][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$this->projectID][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$this->projectID][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$this->projectID][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$this->projectID][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$this->projectID][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Received'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Received']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$this->projectID]['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$this->projectID]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$this->projectID]['Received'] = 1;
							}

						}
					}
				}

				if($resNcrRes['data']){
					$minDate = strtotime($resNcrRes['data'][0]['date_issued']);
					$maxDate = strtotime(end($resNcrRes['data'])['date_issued']);
					$now = time();
					if($maxDate > $now){
						$maxYear = date("Y", $maxDate);
					}
					else{
						$maxYear = date("Y", $now);
					}
					$minYear = date("Y", $minDate);
					$yDiff = $maxYear - $minYear;

					$yr = $minYear;
					$monthHalftext = array("1"=>"01","2"=>"02","3"=>"03","4"=>"04","5"=>"05","6"=>"06","7"=>"07","8"=>"08","9"=>"09","10"=>"10","11"=>"11","12"=>"12");

					//data for QAQC Dashboard
					$valMthDataSorCard = 0;
					$valMthDataSorProject = 0;
					$valMthDataSubConCard = 0;
					$valMthDataSubConProject = 0;

					$valYrDataSorCard = 0;
					$valYrDataSorProject = 0;
					$valYrDataSubConCard = 0;
					$valYrDataSubConProject = 0;

					$valEnviromentCumul = 0;
					$valSafetyCumul = 0;
					$valTrafficCumul = 0;

					$valEnviromentCumulSubCon = 0;
					$valSafetyCumulSubCon = 0;
					$valTrafficCumulSubCon = 0;
					//data for SUMMARY Dashboard
					$valYrDataAll = 0;
					$valYrDataPending = 0;
					$valYrDataClosed = 0;

					$valMthDataAll = 0;
					$valMthDataPending = 0;
					$valMthDataClosed = 0;


					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++;

						if (isset($res['overall'][$nYr]['all']['ttl'])) {
							$valYrDataAll = $valYrDataAll + $res['overall'][$nYr]['all']['ttl'];
						}
						$res['overall'][$nYr]['all']['total'] = $valYrDataAll;

						if (isset($res['overall'][$nYr]['all']['byStatusBefore']['Pending'])) {
							$valYrDataPending = $valYrDataPending + $res['overall'][$nYr]['all']['byStatusBefore']['Pending'];
						}
						$res['overall'][$nYr]['all']['byStatus']['Pending'] = $valYrDataPending;

						if (isset($res['overall'][$nYr]['all']['byStatusBefore']['Closed'])) {
							$valYrDataClosed = $valYrDataClosed + $res['overall'][$nYr]['all']['byStatusBefore']['Closed'];
						}
						$res['overall'][$nYr]['all']['byStatus']['Closed'] = $valYrDataClosed;

						// qaqc dashboard
						if (isset($res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumul'])) {
							$valYrDataSorCard = $valYrDataSorCard + $res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumul'];

						}
						$res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'] = $valYrDataSorCard;

						if (isset($res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumul'])) {
							$valYrDataSubConCard = $valYrDataSubConCard + $res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumul'];

						}
						$res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'] = $valYrDataSubConCard;

						if (isset($res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$this->projectID]['Cumul'])) {
							$valYrDataSorProject = $valYrDataSorProject + $res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$this->projectID]['Cumul'];
						}
						$res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$this->projectID]['Cumulative'] = $valYrDataSorProject;

						if (isset($res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul'])) {
							$valYrDataSubConProject = $valYrDataSubConProject + $res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul'];

						}
						$res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumulative'] = $valYrDataSubConProject;

						foreach ($monthHalftext as $key => $mthval) {
							// for she dashboard
							if (isset($res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'])) {
								$valEnviromentCumul = $valEnviromentCumul + $res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumul;

							if (isset($res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'])) {
								$valSafetyCumul = $valSafetyCumul + $res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumul;

							if (isset($res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'])) {
								$valTrafficCumul = $valTrafficCumul + $res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumul;

							// for she dashboard
							if (isset($res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'])) {
								$valEnviromentCumulSubCon = $valEnviromentCumulSubCon + $res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumulSubCon;

							if (isset($res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'])) {
								$valSafetyCumulSubCon = $valSafetyCumulSubCon + $res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumulSubCon;

							if (isset($res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'])) {
								$valTrafficCumulSubCon = $valTrafficCumulSubCon + $res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumulSubCon;

							//Summary Dashboard
							if (isset($res['overall'][$nYr][$mthval]['ttl'])) {
								$valMthDataAll = $valMthDataAll + $res['overall'][$nYr][$mthval]['ttl'];
							}
							$res['overall'][$nYr][$mthval]['total'] = $valMthDataAll;

							if (isset($res['overall'][$nYr][$mthval]['byStatusBefore']['Pending'])) {
								$valMthDataPending = $valMthDataPending + $res['overall'][$nYr][$mthval]['byStatusBefore']['Pending'];
							}
							$res['overall'][$nYr][$mthval]['byStatus']['Pending'] = $valMthDataPending;

							if (isset($res['overall'][$nYr][$mthval]['byStatusBefore']['Closed'])) {
								$valMthDataClosed = $valMthDataClosed + $res['overall'][$nYr][$mthval]['byStatusBefore']['Closed'];
							}
							$res['overall'][$nYr][$mthval]['byStatus']['Closed'] = $valMthDataClosed;

							//QAQC Dashboard
							if (isset($res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumul'])) {
								$valMthDataSorCard = $valMthDataSorCard + $res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumul'];

							}
							$res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'] = $valMthDataSorCard;

							if (isset($res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$this->projectID]['Cumul'])) {
								$valMthDataSorProject = $valMthDataSorProject + $res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$this->projectID]['Cumul'];
							}
							$res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$this->projectID]['Cumulative'] = $valMthDataSorProject;

							if (isset($res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumul'])) {
								$valMthDataSubConCard = $valMthDataSubConCard + $res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumul'];

							}
							$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'] = $valMthDataSubConCard;

							if (isset($res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul'])) {
								$valMthDataSubConProject = $valMthDataSubConProject + $res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumul'];

							}
							$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$this->projectID]['Cumulative'] = $valMthDataSubConProject;

						}
					}
				}
			}
		} else {
			$valYrDataAll = 0;
			$valYrDataPending = 0;
			$valYrDataClosed = 0;
	
			$valMthDataAll = 0;
			$valMthDataPending = 0;
			$valMthDataClosed = 0;
			
			$resNcrURL = $this->jogetLinkObj->fetchLink("api","construct_dash_NCR", array('', $this->parentProjectID));
			$resNcrRes = $this->jogetCURL($resNcrURL);

			if (isset($resNcrRes['data'])) {
				usort($resNcrRes['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_issued']);
				    $t2 = strtotime($b['date_issued']);
				    return $t1 - $t2;
				});
				foreach ($resNcrRes['data'] as $ncr) {
					$dateCreated = strtotime($ncr['date_issued']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);
					// check data
					$ncr['sub_category'] = ($ncr['sub_category']) ? strtoupper($ncr['sub_category']) : 'Others';

					//byCategory for SHE dashboard
					if($ncr['category'] != 'Quality' && $ncr['issuer'] == 'Consultant'){
						if (isset($res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					if($ncr['category'] != 'Quality' && $ncr['receiver'] == 'Subcon'){
						if (isset($res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					// by category count
					if (isset($res['overall']['all']['all']['byCategory'][$ncr['category']]['total'])) {
						$res['overall']['all']['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res['overall']['all']['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'])) {
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'])) {
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total']++;
					}else{
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'] = 1;
					}

					//---------------START CHILD-----------------//
					if($ncr['category'] != 'Quality' && $ncr['issuer'] == 'Consultant'){
						if (isset($res[$ncr['package_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$ncr['package_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$ncr['package_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$ncr['package_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res[$ncr['package_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res[$ncr['package_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res[$ncr['package_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res[$ncr['package_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res[$ncr['package_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$ncr['package_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$ncr['package_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$ncr['package_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					if($ncr['category'] != 'Quality' && $ncr['receiver'] == 'Subcon'){
						if (isset($res[$ncr['package_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$ncr['package_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$ncr['package_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$ncr['package_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res[$ncr['package_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res[$ncr['package_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res[$ncr['package_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res[$ncr['package_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res[$ncr['package_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$ncr['package_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$ncr['package_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$ncr['package_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					// by category count
					if (isset($res[$ncr['package_id']]['all']['all']['byCategory'][$ncr['category']]['total'])) {
						$res[$ncr['package_id']]['all']['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res[$ncr['package_id']]['all']['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'])) {
						$res[$ncr['package_id']][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res[$ncr['package_id']][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'])) {
						$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total']++;
					}else{
						$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'] = 1;
					}
					//--------------END CHILD---------------//


					// QAQC dashboard
					if ($ncr['category'] == 'Quality') {
						//START SUMMARY DASHBOARD
						// total 
						if (isset($res['overall']['all']['all']['total'])) {
							$res['overall']['all']['all']['total']++;
						}else{
							$res['overall']['all']['all']['total'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['ttl'])) {
							$res['overall'][$mthCT['yr']]['all']['ttl']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['ttl'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['ttl'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['ttl']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['ttl'] = 1;
						}

						//--------START CHILD-----------//
						if (isset($res[$ncr['package_id']]['all']['all']['total'])) {
							$res[$ncr['package_id']]['all']['all']['total']++;
						}else{
							$res[$ncr['package_id']]['all']['all']['total'] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['ttl'])) {
							$res[$ncr['package_id']][$mthCT['yr']]['all']['ttl']++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']]['all']['ttl'] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['ttl'])) {
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['ttl']++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['ttl'] = 1;
						}
						//--------END CHILD-----------//

						// purely by status - closed/ pending
						$status = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
						if (isset($res['overall']['all']['all']['byStatus'][$status])) {
							$res['overall']['all']['all']['byStatus'][$status]++;
						}else{
							$res['overall']['all']['all']['byStatus'][$status] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['byStatusBefore'][$status])) {
							$res['overall'][$mthCT['yr']]['all']['byStatusBefore'][$status]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['byStatusBefore'][$status] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status] = 1;
						}

						//----------START CHILD-----------//
						if (isset($res[$ncr['package_id']]['all']['all']['byStatus'][$status])) {
							$res[$ncr['package_id']]['all']['all']['byStatus'][$status]++;
						}else{
							$res[$ncr['package_id']]['all']['all']['byStatus'][$status] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['byStatusBefore'][$status])) {
							$res[$ncr['package_id']][$mthCT['yr']]['all']['byStatusBefore'][$status]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']]['all']['byStatusBefore'][$status] = 1;
						}
						if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status])) {
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status]++;
						}else{
							$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status] = 1;
						}
						//------------END CHILD------------//
						//END SUMMARY DASHBOARD

						// When Issuer is Consultant
						if ($ncr['issuer'] == 'Consultant') {
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['card']['Cumulative'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Cumulative']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Cumulative'] = 1;
							}
							// if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumulative'])) {
							// 	$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumulative']++;
							// }else{
							// 	$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumulative'] = 1;
							// }
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'] = 1;
							}

							//-----START CHILD-----//
							if (isset($res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['card']['Cumulative'])) {
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['card']['Cumulative']++;
							}else{
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['card']['Cumulative'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumul'])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumul']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumul'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'] = 1;
							}
							//-----END CHILD---//
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumulative']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'] = 1;
							}
							// if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'])) {
							// 	$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumulative']++;
							// }else{
							// 	$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'] = 1;
							// }
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumul'] = 1;
							}

							//------START CHILD---------//
							if (isset($res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'])) {
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumulative']++;
							}else{
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumul'])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumul']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumul'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumul'])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumul']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Cumul'] = 1;
							}
							//------END CHILD---------//

							// for total card
							if (isset($res['overall']['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall']['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}

							//------------START CHILD-----------//
							if (isset($res[$ncr['package_id']]['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$ncr['package_id']]['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']]['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							//--------END CHILD-------------//

							// for chart by projectid
							if (isset($res['overall']['all']['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res['overall']['all']['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}

							//------------START CHILD-----------//
							if (isset($res[$ncr['package_id']]['all']['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res[$ncr['package_id']]['all']['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']]['all']['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}
							//------------END CHILD-----------//

							// for total card
							$qualityStatus = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res['overall']['all']['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['bySor']['byStatus']['card']['Received'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}

							//-----------START CHILD---------------//
							if (isset($res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['card']['Received'])) {
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}

							if (isset($res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res[$ncr['package_id']]['all']['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							//------------END CHILD-----------//

						}

						// // When Receiver is Subcon
						// by sub category and status as well
						if ($ncr['receiver'] == 'Subcon') {

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['card']['Cumulative'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Cumulative']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Cumulative'] = 1;
							}
							// if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumulative'])) {
							// 	$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumulative']++;
							// }else{
							// 	$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumulative'] = 1;
							// }
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'] = 1;
							}

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumulative']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul'] = 1;
							}

							// for total card
							if (isset($res['overall']['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}

							// for chart by projectid
							if (isset($res['overall']['all']['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}

							// for total card
							$qualityStatus = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}

							//-----------START CHILD----------------//
							if (isset($res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['card']['Cumulative'])) {
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['card']['Cumulative']++;
							}else{
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['card']['Cumulative'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumul'])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumul']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumul'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'] = 1;
							}

							if (isset($res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'])) {
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumulative']++;
							}else{
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumulative'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul'])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul'])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Cumul'] = 1;
							}

							// for total card
							if (isset($res[$ncr['package_id']]['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$ncr['package_id']]['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']]['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}

							// for chart by projectid
							if (isset($res[$ncr['package_id']]['all']['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res[$ncr['package_id']]['all']['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']]['all']['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$ncr['package_id']][$ncr['sub_category']] = 1;
							}

							// for total card
							$qualityStatus = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
							if (isset($res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus]++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']][$qualityStatus] = 1;
							}

							if (isset($res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res[$ncr['package_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							if (isset($res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'])) {
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received']++;
							}else{
								$res[$ncr['package_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$ncr['package_id']]['Received'] = 1;
							}
							//-------------END CHILD--------------//
						}
					}
				}

				foreach ($this->childProjectInfo as $childID) {
					if($resNcrRes['data']){
						$minDate = strtotime($resNcrRes['data'][0]['date_issued']);
						$maxDate = strtotime(end($resNcrRes['data'])['date_issued']);
						$now = time();
						if($maxDate > $now){
							$maxYear = date("Y", $maxDate);
						}
						else{
							$maxYear = date("Y", $now);
						}
						$minYear = date("Y", $minDate);
						$yDiff = $maxYear - $minYear;
	
						$yr = $minYear;
						$monthHalftext = array("1"=>"01","2"=>"02","3"=>"03","4"=>"04","5"=>"05","6"=>"06","7"=>"07","8"=>"08","9"=>"09","10"=>"10","11"=>"11","12"=>"12");
	
						//data for QAQC Dashboard
						$valMthDataSorCard = 0;
						$valMthDataSorProject = 0;
						$valMthDataSubConCard = 0;
						$valMthDataSubConProject = 0;
	
						$valYrDataSorCard = 0;
						$valYrDataSorProject = 0;
						$valYrDataSubConCard = 0;
						$valYrDataSubConProject = 0;
	
						$valEnviromentCumul = 0;
						$valSafetyCumul = 0;
						$valTrafficCumul = 0;
	
						$valEnviromentCumulChild = 0;
						$valSafetyCumulChild = 0;
						$valTrafficCumulChild = 0;
						
						$valEnviromentCumulSubCon = 0;
						$valSafetyCumulSubCon = 0;
						$valTrafficCumulSubCon = 0;
	
						$valEnviromentCumulSubConChild = 0;
						$valSafetyCumulSubConChild = 0;
						$valTrafficCumulSubConChild = 0;
						//data for SUMMARY Dashboard
						$valYrChildDataAll = 0;
						$valYrChildDataPending = 0;
						$valYrChildDataClosed = 0;
	
						$valMthChildDataAll = 0;
						$valMthChildDataPending = 0;
						$valMthChildDataClosed = 0;
	
						for ($i=0; $i < $yDiff+1 ; $i++) {
							$nYr = $yr++;
	
							// child
							if (isset($res[$childID['project_id']][$nYr]['all']['ttl'])) {
								$valYrChildDataAll = $valYrChildDataAll + $res[$childID['project_id']][$nYr]['all']['ttl'];
							}
							$res[$childID['project_id']][$nYr]['all']['total'] = $valYrChildDataAll;
	
							if (isset($res[$childID['project_id']][$nYr]['all']['byStatusBefore']['Pending'])) {
								$valYrChildDataPending = $valYrChildDataPending + $res[$childID['project_id']][$nYr]['all']['byStatusBefore']['Pending'];
							}
							$res[$childID['project_id']][$nYr]['all']['byStatus']['Pending'] = $valYrChildDataPending;
	
							if (isset($res[$childID['project_id']][$nYr]['all']['byStatusBefore']['Closed'])) {
								$valYrChildDataClosed = $valYrChildDataClosed + $res[$childID['project_id']][$nYr]['all']['byStatusBefore']['Closed'];
							}
							$res[$childID['project_id']][$nYr]['all']['byStatus']['Closed'] = $valYrChildDataClosed;
	
	
							// overall based on child
							if (isset($res['overall'][$nYr]['all']['total'])) {
								$res['overall'][$nYr]['all']['total'] = $res['overall'][$nYr]['all']['total'] + $valYrChildDataAll;
							}else {
								$res['overall'][$nYr]['all']['total'] = $valYrChildDataAll;
							}
	
							if (isset($res['overall'][$nYr]['all']['byStatus']['Pending'])) {
								$res['overall'][$nYr]['all']['byStatus']['Pending'] = $res['overall'][$nYr]['all']['byStatus']['Pending'] + $valYrChildDataPending;
							}else {
								$res['overall'][$nYr]['all']['byStatus']['Pending'] = $valYrChildDataPending;
							}
	
							if (isset($res['overall'][$nYr]['all']['byStatus']['Closed'])) {
								$res['overall'][$nYr]['all']['byStatus']['Closed'] = $res['overall'][$nYr]['all']['byStatus']['Closed'] + $valYrChildDataClosed;
							}else {
								$res['overall'][$nYr]['all']['byStatus']['Closed'] = $valYrChildDataClosed;
							}
							
	
							// qaqc dashboard
							if (isset($res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['card']['Cumul'])) {
								$valYrDataSorCard = $valYrDataSorCard + $res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['card']['Cumul'];
	
							}
							$res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'] = $valYrDataSorCard;
							if (isset($res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'])) {
								$res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'] = $res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'] + $valYrDataSorCard;
							}else {
								$res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'] = $valYrDataSorCard;
							}	
	
							if (isset($res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['card']['Cumul'])) {
								$valYrDataSubConCard = $valYrDataSubConCard + $res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['card']['Cumul'];
	
							}
							$res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'] = $valYrDataSubConCard;
							if (isset($res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'])) {
								$res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'] = $res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'] + $valYrDataSubConCard;
							}else {
								$res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'] = $valYrDataSubConCard;
							}	
						
							if (isset($res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$valYrDataSorProject = $valYrDataSorProject + $res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'];
							}
							$res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valYrDataSorProject;
							if (isset($res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
								$res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] + $valYrDataSorProject;
							}else {
								$res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valYrDataSorProject;
							}	
	
							if (isset($res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$valYrDataSubConProject = $valYrDataSubConProject + $res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'];
	
							}
							$res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valYrDataSubConProject;
							if (isset($res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
								$res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] + $valYrDataSubConProject;
							}else {
								$res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valYrDataSubConProject;
							}	
	
							foreach ($monthHalftext as $key => $mthval) {
								// for she dashboard
								if (isset($res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'])) {
									$valEnviromentCumul = $valEnviromentCumul + $res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'];
								}
								$res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumul;
	
								if (isset($res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'])) {
									$valSafetyCumul = $valSafetyCumul + $res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'];
								}
								//here to count
								$res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumul;
	
								if (isset($res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'])) {
									$valTrafficCumul = $valTrafficCumul + $res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'];
								}
								$res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumul;
	
								// for she dashboard
								if (isset($res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'])) {
									$valEnviromentCumulSubCon = $valEnviromentCumulSubCon + $res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'];
								}
								$res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumulSubCon;
	
								if (isset($res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'])) {
									$valSafetyCumulSubCon = $valSafetyCumulSubCon + $res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'];
								}
								$res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumulSubCon;
	
								if (isset($res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'])) {
									$valTrafficCumulSubCon = $valTrafficCumulSubCon + $res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'];
								}
								$res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumulSubCon;
	
								//Summary Dashboard
								if (isset($res['overall'][$nYr][$mthval]['ttl'])) {
									$valMthDataAll = $valMthDataAll + $res['overall'][$nYr][$mthval]['ttl'];
								}
								$res['overall'][$nYr][$mthval]['total'] = $valMthDataAll;
	
								if (isset($res['overall'][$nYr][$mthval]['byStatusBefore']['Pending'])) {
									$valMthDataPending = $valMthDataPending + $res['overall'][$nYr][$mthval]['byStatusBefore']['Pending'];
								}
								$res['overall'][$nYr][$mthval]['byStatus']['Pending'] = $valMthDataPending;
	
								if (isset($res['overall'][$nYr][$mthval]['byStatusBefore']['Closed'])) {
									$valMthDataClosed = $valMthDataClosed + $res['overall'][$nYr][$mthval]['byStatusBefore']['Closed'];
								}
								$res['overall'][$nYr][$mthval]['byStatus']['Closed'] = $valMthDataClosed;
	
								//--------------START CHILD-----------------//
								// for she dashboard
								if (isset($res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'])) {
									$valEnviromentCumulChild = $valEnviromentCumulChild + $res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumulChild;
	
								if (isset($res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'])) {
									$valSafetyCumulChild = $valSafetyCumulChild + $res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumulChild;
	
								if (isset($res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'])) {
									$valTrafficCumulChild = $valTrafficCumulChild + $res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumulChild;
	
								// for she dashboard
								if (isset($res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'])) {
									$valEnviromentCumulSubConChild = $valEnviromentCumulSubConChild + $res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumulSubConChild;
	
								if (isset($res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'])) {
									$valSafetyCumulSubConChild = $valSafetyCumulSubConChild + $res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumulSubConChild;
	
								if (isset($res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'])) {
									$valTrafficCumulSubConChild = $valTrafficCumulSubConChild + $res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumulSubConChild;
	
								//SUMMARY DASHBOARD
								if (isset($res[$childID['project_id']][$nYr][$mthval]['ttl'])) {
									$valMthChildDataAll = $valMthChildDataAll + $res[$childID['project_id']][$nYr][$mthval]['ttl'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['total'] = $valMthChildDataAll;
	
								if (isset($res[$childID['project_id']][$nYr][$mthval]['byStatusBefore']['Pending'])) {
									$valMthChildDataPending = $valMthChildDataPending + $res[$childID['project_id']][$nYr][$mthval]['byStatusBefore']['Pending'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['byStatus']['Pending'] = $valMthChildDataPending;
	
								if (isset($res[$childID['project_id']][$nYr][$mthval]['byStatusBefore']['Closed'])) {
									$valMthChildDataClosed = $valMthChildDataClosed + $res[$childID['project_id']][$nYr][$mthval]['byStatusBefore']['Closed'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['byStatus']['Closed'] = $valMthChildDataClosed;
								
	
								// QAQC Dashboard child
								// overall based on child, pening? yea me too							
								if (isset($res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['card']['Cumul'])) {
									$valMthDataSorCard = $valMthDataSorCard + $res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['card']['Cumul'];
	
								}
								$res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'] = $valMthDataSorCard;
								if (isset($res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'])) {
									$res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'] = $res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'] + $valMthDataSorCard;
								}else {
									$res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'] = $valMthDataSorCard;
								}
								
								if (isset($res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
									$valMthDataSorProject = $valMthDataSorProject + $res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valMthDataSorProject;
								
								if (isset($res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
									$res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] + $valMthDataSorProject;
								}else {
									$res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valMthDataSorProject;
								}							
								
								if (isset($res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumul'])) {
									$valMthDataSubConCard = $valMthDataSubConCard + $res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumul'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'] = $valMthDataSubConCard;
								if (isset($res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'])) {
									$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'] = $res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'] + $valMthDataSubConCard;
								}else {
									$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'] = $valMthDataSubConCard;
								}
	
								if (isset($res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
									$valMthDataSubConProject = $valMthDataSubConProject + $res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'];
								}
								$res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valMthDataSubConProject;
								if (isset($res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
									$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] + $valMthDataSubConProject;
								}else {
									$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valMthDataSubConProject;
								}
								
								//---------------END CHILD--------------//
	
							}
						}
					}
				}
			}
		}

		// summary dashboard
		$valYrDataAll = 0;
		$valYrDataPending = 0;
		$valYrDataClosed = 0;

		$valMthDataAll = 0;
		$valMthDataPending = 0;
		$valMthDataClosed = 0;
							
		foreach ($this->childProjectInfo as $childID) {
			$resNcrURL = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_NCR'].$childID['project_id'] ?? "";
			$resNcrRes = $this->jogetCURL($resNcrURL);

			if (isset($resNcrRes['data'])) {
				usort($resNcrRes['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_issued']);
				    $t2 = strtotime($b['date_issued']);
				    return $t1 - $t2;
				});
				foreach ($resNcrRes['data'] as $ncr) {
					$dateCreated = strtotime($ncr['date_issued']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);
					// check data
					$ncr['sub_category'] = ($ncr['sub_category']) ? strtoupper($ncr['sub_category']) : 'Others';

					//byCategory for SHE dashboard
					if($ncr['category'] != 'Quality' && $ncr['issuer'] == 'Consultant'){
						if (isset($res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall']['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					if($ncr['category'] != 'Quality' && $ncr['receiver'] == 'Subcon'){
						if (isset($res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall']['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					// by category count
					if (isset($res['overall']['all']['all']['byCategory'][$ncr['category']]['total'])) {
						$res['overall']['all']['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res['overall']['all']['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'])) {
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res['overall'][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'])) {
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total']++;
					}else{
						$res['overall'][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'] = 1;
					}

					//---------------START CHILD-----------------//
					if($ncr['category'] != 'Quality' && $ncr['issuer'] == 'Consultant'){
						if (isset($res[$childID['project_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$childID['project_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$childID['project_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$childID['project_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res[$childID['project_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res[$childID['project_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res[$childID['project_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res[$childID['project_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res[$childID['project_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$childID['project_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$childID['project_id']]['all']['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$childID['project_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']]['all']['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['issueConsultant']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					if($ncr['category'] != 'Quality' && $ncr['receiver'] == 'Subcon'){
						if (isset($res[$childID['project_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$childID['project_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$childID['project_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$childID['project_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']])) {
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['bySubCategory'][$ncr['sub_category']] = 1;
						}
	
						if (isset($res[$childID['project_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res[$childID['project_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res[$childID['project_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'])) {
							$res[$childID['project_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative']++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['cumulative'] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'])) {
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current']++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byTotal']['current'] = 1;
						}
	
						if (isset($res[$childID['project_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$childID['project_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$childID['project_id']]['all']['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$childID['project_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']]['all']['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']])) {
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['receivedSubcon']['byCategory'][$ncr['category']]['byStatus'][$ncr['status']] = 1;
						}
					}
					
					// by category count
					if (isset($res[$childID['project_id']]['all']['all']['byCategory'][$ncr['category']]['total'])) {
						$res[$childID['project_id']]['all']['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res[$childID['project_id']]['all']['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'])) {
						$res[$childID['project_id']][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total']++;
					}else{
						$res[$childID['project_id']][$mthCT['yr']]['all']['byCategory'][$ncr['category']]['total'] = 1;
					}
					if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'])) {
						$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total']++;
					}else{
						$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['byCategory'][$ncr['category']]['total'] = 1;
					}
					//--------------END CHILD---------------//


					// QAQC dashboard
					if ($ncr['category'] == 'Quality') {
						//START SUMMARY DASHBOARD
						// total 
						if (isset($res['overall']['all']['all']['total'])) {
							$res['overall']['all']['all']['total']++;
						}else{
							$res['overall']['all']['all']['total'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['ttl'])) {
							$res['overall'][$mthCT['yr']]['all']['ttl']++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['ttl'] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['ttl'])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['ttl']++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['ttl'] = 1;
						}

						//--------START CHILD-----------//
						if (isset($res[$childID['project_id']]['all']['all']['total'])) {
							$res[$childID['project_id']]['all']['all']['total']++;
						}else{
							$res[$childID['project_id']]['all']['all']['total'] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['ttl'])) {
							$res[$childID['project_id']][$mthCT['yr']]['all']['ttl']++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']]['all']['ttl'] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['ttl'])) {
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['ttl']++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['ttl'] = 1;
						}
						//--------END CHILD-----------//

						// purely by status - closed/ pending
						$status = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
						if (isset($res['overall']['all']['all']['byStatus'][$status])) {
							$res['overall']['all']['all']['byStatus'][$status]++;
						}else{
							$res['overall']['all']['all']['byStatus'][$status] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']]['all']['byStatusBefore'][$status])) {
							$res['overall'][$mthCT['yr']]['all']['byStatusBefore'][$status]++;
						}else{
							$res['overall'][$mthCT['yr']]['all']['byStatusBefore'][$status] = 1;
						}
						if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status])) {
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status]++;
						}else{
							$res['overall'][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status] = 1;
						}

						//----------START CHILD-----------//
						if (isset($res[$childID['project_id']]['all']['all']['byStatus'][$status])) {
							$res[$childID['project_id']]['all']['all']['byStatus'][$status]++;
						}else{
							$res[$childID['project_id']]['all']['all']['byStatus'][$status] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['byStatusBefore'][$status])) {
							$res[$childID['project_id']][$mthCT['yr']]['all']['byStatusBefore'][$status]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']]['all']['byStatusBefore'][$status] = 1;
						}
						if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status])) {
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status]++;
						}else{
							$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['byStatusBefore'][$status] = 1;
						}
						//------------END CHILD------------//
						//END SUMMARY DASHBOARD

						// When Issuer is Consultant
						if ($ncr['issuer'] == 'Consultant') {
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['card']['Cumulative'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Cumulative']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Cumulative'] = 1;
							}
							// if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumulative'])) {
							// 	$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumulative']++;
							// }else{
							// 	$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumulative'] = 1;
							// }
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'] = 1;
							}

							//-----START CHILD-----//
							if (isset($res[$childID['project_id']]['all']['all']['bySor']['byStatus']['card']['Cumulative'])) {
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['card']['Cumulative']++;
							}else{
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['card']['Cumulative'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumul'])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumul']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Cumul'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Cumul'] = 1;
							}
							//-----END CHILD---//
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = 1;
							}
							// if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
							// 	$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative']++;
							// }else{
							// 	$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = 1;
							// }
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'] = 1;
							}

							//------START CHILD---------//
							if (isset($res[$childID['project_id']]['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative']++;
							}else{
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'] = 1;
							}
							//------END CHILD---------//

							// for total card
							if (isset($res['overall']['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall']['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}

							//------------START CHILD-----------//
							if (isset($res[$childID['project_id']]['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$childID['project_id']]['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']]['all']['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							//--------END CHILD-------------//

							// for chart by projectid
							if (isset($res['overall']['all']['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res['overall']['all']['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}

							//------------START CHILD-----------//
							if (isset($res[$childID['project_id']]['all']['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res[$childID['project_id']]['all']['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']]['all']['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}
							//------------END CHILD-----------//

							// for total card
							$qualityStatus = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res['overall']['all']['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['bySor']['byStatus']['card']['Received'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res['overall']['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res['overall']['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}

							//-----------START CHILD---------------//
							if (isset($res[$childID['project_id']]['all']['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res[$childID['project_id']]['all']['all']['bySor']['byStatus']['card']['Received'])) {
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res[$childID['project_id']]['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}

							if (isset($res[$childID['project_id']]['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res[$childID['project_id']]['all']['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['bySor']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							//------------END CHILD-----------//

						}

						// // When Receiver is Subcon
						// by sub category and status as well
						if ($ncr['receiver'] == 'Subcon') {

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['card']['Cumulative'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Cumulative']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Cumulative'] = 1;
							}
							// if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumulative'])) {
							// 	$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumulative']++;
							// }else{
							// 	$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumulative'] = 1;
							// }
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'] = 1;
							}

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'] = 1;
							}

							// for total card
							if (isset($res['overall']['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}

							// for chart by projectid
							if (isset($res['overall']['all']['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}

							// for total card
							$qualityStatus = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}

							if (isset($res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res['overall']['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							if (isset($res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res['overall'][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}

							//-----------START CHILD----------------//
							if (isset($res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['card']['Cumulative'])) {
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['card']['Cumulative']++;
							}else{
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['card']['Cumulative'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumul'])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumul']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Cumul'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Cumul'] = 1;
							}

							if (isset($res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative']++;
							}else{
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'] = 1;
							}

							// for total card
							if (isset($res[$childID['project_id']]['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$childID['project_id']]['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']]['all']['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['card'][$ncr['sub_category']] = 1;
							}

							// for chart by projectid
							if (isset($res[$childID['project_id']]['all']['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res[$childID['project_id']]['all']['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']]['all']['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['bySubCategory']['byProject'][$childID['project_id']][$ncr['sub_category']] = 1;
							}

							// for total card
							$qualityStatus = ($ncr['status'] == 'Closed') ? $ncr['status'] : 'Pending';
							if (isset($res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card'][$qualityStatus] = 1;
							}

							if (isset($res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['card']['Received'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['card']['Received'] = 1;
							}

							// for chart by project
							if (isset($res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus]++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']][$qualityStatus] = 1;
							}

							if (isset($res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res[$childID['project_id']]['all']['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							if (isset($res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'])) {
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received']++;
							}else{
								$res[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Received'] = 1;
							}
							//-------------END CHILD--------------//
						}
					}
				}

				if($resNcrRes['data']){
					$minDate = strtotime($resNcrRes['data'][0]['date_issued']);
					$maxDate = strtotime(end($resNcrRes['data'])['date_issued']);
					$now = time();
					if($maxDate > $now){
						$maxYear = date("Y", $maxDate);
					}
					else{
						$maxYear = date("Y", $now);
					}
					$minYear = date("Y", $minDate);
					$yDiff = $maxYear - $minYear;

					$yr = $minYear;
					$monthHalftext = array("1"=>"01","2"=>"02","3"=>"03","4"=>"04","5"=>"05","6"=>"06","7"=>"07","8"=>"08","9"=>"09","10"=>"10","11"=>"11","12"=>"12");

					//data for QAQC Dashboard
					$valMthDataSorCard = 0;
					$valMthDataSorProject = 0;
					$valMthDataSubConCard = 0;
					$valMthDataSubConProject = 0;

					$valYrDataSorCard = 0;
					$valYrDataSorProject = 0;
					$valYrDataSubConCard = 0;
					$valYrDataSubConProject = 0;

					$valEnviromentCumul = 0;
					$valSafetyCumul = 0;
					$valTrafficCumul = 0;

					$valEnviromentCumulChild = 0;
					$valSafetyCumulChild = 0;
					$valTrafficCumulChild = 0;
					
					$valEnviromentCumulSubCon = 0;
					$valSafetyCumulSubCon = 0;
					$valTrafficCumulSubCon = 0;

					$valEnviromentCumulSubConChild = 0;
					$valSafetyCumulSubConChild = 0;
					$valTrafficCumulSubConChild = 0;
					//data for SUMMARY Dashboard
					$valYrChildDataAll = 0;
					$valYrChildDataPending = 0;
					$valYrChildDataClosed = 0;

					$valMthChildDataAll = 0;
					$valMthChildDataPending = 0;
					$valMthChildDataClosed = 0;

					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++;

						// child
						if (isset($res[$childID['project_id']][$nYr]['all']['ttl'])) {
							$valYrChildDataAll = $valYrChildDataAll + $res[$childID['project_id']][$nYr]['all']['ttl'];
						}
						$res[$childID['project_id']][$nYr]['all']['total'] = $valYrChildDataAll;

						if (isset($res[$childID['project_id']][$nYr]['all']['byStatusBefore']['Pending'])) {
							$valYrChildDataPending = $valYrChildDataPending + $res[$childID['project_id']][$nYr]['all']['byStatusBefore']['Pending'];
						}
						$res[$childID['project_id']][$nYr]['all']['byStatus']['Pending'] = $valYrChildDataPending;

						if (isset($res[$childID['project_id']][$nYr]['all']['byStatusBefore']['Closed'])) {
							$valYrChildDataClosed = $valYrChildDataClosed + $res[$childID['project_id']][$nYr]['all']['byStatusBefore']['Closed'];
						}
						$res[$childID['project_id']][$nYr]['all']['byStatus']['Closed'] = $valYrChildDataClosed;


						// overall based on child
						if (isset($res['overall'][$nYr]['all']['total'])) {
							$res['overall'][$nYr]['all']['total'] = $res['overall'][$nYr]['all']['total'] + $valYrChildDataAll;
						}else {
							$res['overall'][$nYr]['all']['total'] = $valYrChildDataAll;
						}

						if (isset($res['overall'][$nYr]['all']['byStatus']['Pending'])) {
							$res['overall'][$nYr]['all']['byStatus']['Pending'] = $res['overall'][$nYr]['all']['byStatus']['Pending'] + $valYrChildDataPending;
						}else {
							$res['overall'][$nYr]['all']['byStatus']['Pending'] = $valYrChildDataPending;
						}

						if (isset($res['overall'][$nYr]['all']['byStatus']['Closed'])) {
							$res['overall'][$nYr]['all']['byStatus']['Closed'] = $res['overall'][$nYr]['all']['byStatus']['Closed'] + $valYrChildDataClosed;
						}else {
							$res['overall'][$nYr]['all']['byStatus']['Closed'] = $valYrChildDataClosed;
						}
						

						// qaqc dashboard
						if (isset($res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['card']['Cumul'])) {
							$valYrDataSorCard = $valYrDataSorCard + $res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['card']['Cumul'];

						}
						$res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'] = $valYrDataSorCard;
						if (isset($res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'])) {
							$res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'] = $res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'] + $valYrDataSorCard;
						}else {
							$res['overall'][$nYr]['all']['bySor']['byStatus']['card']['Cumulative'] = $valYrDataSorCard;
						}	

						if (isset($res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['card']['Cumul'])) {
							$valYrDataSubConCard = $valYrDataSubConCard + $res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['card']['Cumul'];

						}
						$res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'] = $valYrDataSubConCard;
						if (isset($res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'])) {
							$res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'] = $res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'] + $valYrDataSubConCard;
						}else {
							$res['overall'][$nYr]['all']['toSubCon']['byStatus']['card']['Cumulative'] = $valYrDataSubConCard;
						}	
					
						if (isset($res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
							$valYrDataSorProject = $valYrDataSorProject + $res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'];
						}
						$res[$childID['project_id']][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valYrDataSorProject;
						if (isset($res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
							$res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] + $valYrDataSorProject;
						}else {
							$res['overall'][$nYr]['all']['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valYrDataSorProject;
						}	

						if (isset($res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
							$valYrDataSubConProject = $valYrDataSubConProject + $res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'];

						}
						$res[$childID['project_id']][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valYrDataSubConProject;
						if (isset($res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
							$res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] + $valYrDataSubConProject;
						}else {
							$res['overall'][$nYr]['all']['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valYrDataSubConProject;
						}	

						foreach ($monthHalftext as $key => $mthval) {
							// for she dashboard
							if (isset($res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'])) {
								$valEnviromentCumul = $valEnviromentCumul + $res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumul;

							if (isset($res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'])) {
								$valSafetyCumul = $valSafetyCumul + $res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'];
							}
							//here to count
							$res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumul;

							if (isset($res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'])) {
								$valTrafficCumul = $valTrafficCumul + $res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumul;

							// for she dashboard
							if (isset($res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'])) {
								$valEnviromentCumulSubCon = $valEnviromentCumulSubCon + $res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumulSubCon;

							if (isset($res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'])) {
								$valSafetyCumulSubCon = $valSafetyCumulSubCon + $res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumulSubCon;

							if (isset($res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'])) {
								$valTrafficCumulSubCon = $valTrafficCumulSubCon + $res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'];
							}
							$res['overall'][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumulSubCon;

							//Summary Dashboard
							if (isset($res['overall'][$nYr][$mthval]['ttl'])) {
								$valMthDataAll = $valMthDataAll + $res['overall'][$nYr][$mthval]['ttl'];
							}
							$res['overall'][$nYr][$mthval]['total'] = $valMthDataAll;

							if (isset($res['overall'][$nYr][$mthval]['byStatusBefore']['Pending'])) {
								$valMthDataPending = $valMthDataPending + $res['overall'][$nYr][$mthval]['byStatusBefore']['Pending'];
							}
							$res['overall'][$nYr][$mthval]['byStatus']['Pending'] = $valMthDataPending;

							if (isset($res['overall'][$nYr][$mthval]['byStatusBefore']['Closed'])) {
								$valMthDataClosed = $valMthDataClosed + $res['overall'][$nYr][$mthval]['byStatusBefore']['Closed'];
							}
							$res['overall'][$nYr][$mthval]['byStatus']['Closed'] = $valMthDataClosed;

							//--------------START CHILD-----------------//
							// for she dashboard
							if (isset($res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'])) {
								$valEnviromentCumulChild = $valEnviromentCumulChild + $res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['current'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumulChild;

							if (isset($res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'])) {
								$valSafetyCumulChild = $valSafetyCumulChild + $res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['current'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumulChild;

							if (isset($res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'])) {
								$valTrafficCumulChild = $valTrafficCumulChild + $res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['current'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['issueConsultant']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumulChild;

							// for she dashboard
							if (isset($res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'])) {
								$valEnviromentCumulSubConChild = $valEnviromentCumulSubConChild + $res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['current'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Environment']['byTotal']['cumulative'] = $valEnviromentCumulSubConChild;

							if (isset($res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'])) {
								$valSafetyCumulSubConChild = $valSafetyCumulSubConChild + $res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['current'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Safety and Health']['byTotal']['cumulative'] = $valSafetyCumulSubConChild;

							if (isset($res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'])) {
								$valTrafficCumulSubConChild = $valTrafficCumulSubConChild + $res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['current'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['receivedSubcon']['byCategory']['Traffic']['byTotal']['cumulative'] = $valTrafficCumulSubConChild;

							//SUMMARY DASHBOARD
							if (isset($res[$childID['project_id']][$nYr][$mthval]['ttl'])) {
								$valMthChildDataAll = $valMthChildDataAll + $res[$childID['project_id']][$nYr][$mthval]['ttl'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['total'] = $valMthChildDataAll;

							if (isset($res[$childID['project_id']][$nYr][$mthval]['byStatusBefore']['Pending'])) {
								$valMthChildDataPending = $valMthChildDataPending + $res[$childID['project_id']][$nYr][$mthval]['byStatusBefore']['Pending'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['byStatus']['Pending'] = $valMthChildDataPending;

							if (isset($res[$childID['project_id']][$nYr][$mthval]['byStatusBefore']['Closed'])) {
								$valMthChildDataClosed = $valMthChildDataClosed + $res[$childID['project_id']][$nYr][$mthval]['byStatusBefore']['Closed'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['byStatus']['Closed'] = $valMthChildDataClosed;
							

							// QAQC Dashboard child
							// overall based on child, pening? yea me too							
							if (isset($res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['card']['Cumul'])) {
								$valMthDataSorCard = $valMthDataSorCard + $res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['card']['Cumul'];

							}
							$res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'] = $valMthDataSorCard;
							if (isset($res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'])) {
								$res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'] = $res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'] + $valMthDataSorCard;
							}else {
								$res['overall'][$nYr][$mthval]['bySor']['byStatus']['card']['Cumulative'] = $valMthDataSorCard;
							}
							
							if (isset($res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$valMthDataSorProject = $valMthDataSorProject + $res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumul'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valMthDataSorProject;
							
							if (isset($res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
								$res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] + $valMthDataSorProject;
							}else {
								$res['overall'][$nYr][$mthval]['bySor']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valMthDataSorProject;
							}							
							
							if (isset($res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumul'])) {
								$valMthDataSubConCard = $valMthDataSubConCard + $res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumul'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'] = $valMthDataSubConCard;
							if (isset($res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'])) {
								$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'] = $res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'] + $valMthDataSubConCard;
							}else {
								$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['card']['Cumulative'] = $valMthDataSubConCard;
							}

							if (isset($res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'])) {
								$valMthDataSubConProject = $valMthDataSubConProject + $res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumul'];
							}
							$res[$childID['project_id']][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valMthDataSubConProject;
							if (isset($res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'])) {
								$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] + $valMthDataSubConProject;
							}else {
								$res['overall'][$nYr][$mthval]['toSubCon']['byStatus']['byProject'][$childID['project_id']]['Cumulative'] = $valMthDataSubConProject;
							}
							
							//---------------END CHILD--------------//

						}
					}
				}
			}
		}

		return $res;
	}

	function smhSort($a, $b){
	    $t1 = strtotime($a['year'].'-'.$a['month'].'-01');
	    $t2 = strtotime($b['year'].'-'.$b['month'].'-01');
	    return $t1 - $t2;
	}

	private function getOverallManHoursData(){
		$res = array();
		if ($this->isWPC) {
			$resSmhURL = $this->jogetLinkObj->fetchLink("api","construct_dash_SMH", array($this->projectID, $this->parentProjectID));
			$resSmhRes = $this->jogetCURL($resSmhURL);
			if (isset($resSmhRes['data'])) {
				// only one data for each month
				usort($resSmhRes['data'], array($this, 'smhSort'));
				$currMthYr = date('Y-m').'-01';
				$withOutLtiCum = 0;
				foreach ($resSmhRes['data'] as $smh) {
					if (strtotime($smh['year'].'-'.$smh['month'].'-01') <= strtotime($currMthYr)) {
						$conOpLinkArr = array(
							'yr' => $smh['year'],
							'mth' => $smh['month']
						);
						$res['overall']['all']['all']['filterArr'] = $conOpLinkArr;
						$res['overall'][$smh['year']]['all']['filterArr'] = $conOpLinkArr;
						$res['overall'][$smh['year']][$smh['month']]['filterArr'] = $conOpLinkArr;
						
						$res['overall']['all']['all']['withLTI'] = (float) $smh['tmh_wlti'];		
						$res['overall'][$smh['year']]['all']['withLTI'] = (float) $smh['tmh_wlti'];

						$res['overall']['all']['all']['withoutLTI'] = (float) $smh['tmh_wolti'];		
						$res['overall'][$smh['year']]['all']['withoutLTI'] = (float) $smh['tmh_wolti'];

						if (isset($res['overall'][$smh['year']][$smh['month']]['withLTI'])) {
							$res['overall'][$smh['year']][$smh['month']]['withLTI'] = $res['overall'][$smh['year']][$smh['month']]['withLTI'] + (float) $smh['tmh_wlti'];		
						}else{
							$res['overall'][$smh['year']][$smh['month']]['withLTI'] = (float) $smh['tmh_wlti'];
						}

						if (isset($res['overall'][$smh['year']][$smh['month']]['withoutLTI'])) {
							$res['overall'][$smh['year']][$smh['month']]['withoutLTI'] = $res['overall'][$smh['year']][$smh['month']]['withoutLTI'] + (float) $smh['tmh_wolti'];		
						}else{
							$res['overall'][$smh['year']][$smh['month']]['withoutLTI'] = (float) $smh['tmh_wolti'];
						}
					}
				}
			}
		}else {
			$resSmhURL = $this->jogetLinkObj->fetchLink("api","construct_dash_SMH", array('', $this->parentProjectID));
			$resSmhRes = $this->jogetCURL($resSmhURL);
			if (isset($resSmhRes['data'])) {
				// only one data for each month
				usort($resSmhRes['data'], array($this, 'smhSort'));

				$currMthYr = date('Y-m').'-01';
				foreach ($resSmhRes['data'] as $smh) {
					if (strtotime($smh['year'].'-'.$smh['month'].'-01') <= strtotime($currMthYr)) {
						$conOpLinkArr = array(
							'yr' => $smh['year'],
							'mth' => $smh['month']
						);
						$res['overall']['all']['all']['filterArr'] = $conOpLinkArr;
						$res['overall'][$smh['year']]['all']['filterArr'] = $conOpLinkArr;
						$res['overall'][$smh['year']][$smh['month']]['filterArr'] = $conOpLinkArr;

						$res['overall']['all']['all']['withLTI'] = (float) $smh['tmh_wlti'];		
						$res['overall'][$smh['year']]['all']['withLTI'] = (float) $smh['tmh_wlti'];

						$res['overall']['all']['all']['withoutLTI'] = (float) $smh['tmh_wolti'];		
						$res['overall'][$smh['year']]['all']['withoutLTI'] = (float) $smh['tmh_wolti'];
						
						//------------START CHILD-------------//
						$res[$smh['package_id']]['all']['all']['filterArr'] = $conOpLinkArr;
						$res[$smh['package_id']][$smh['year']]['all']['filterArr'] = $conOpLinkArr;
						$res[$smh['package_id']][$smh['year']][$smh['month']]['filterArr'] = $conOpLinkArr;

						$res[$smh['package_id']]['all']['all']['withLTI'] = (float) $smh['tmh_wlti'];		
						$res[$smh['package_id']][$smh['year']]['all']['withLTI'] = (float) $smh['tmh_wlti'];

						$res[$smh['package_id']]['all']['all']['withoutLTI'] = (float) $smh['tmh_wolti'];		
						$res[$smh['package_id']][$smh['year']]['all']['withoutLTI'] = (float) $smh['tmh_wolti'];
						//--------------END CHILD--------------//

						if (isset($res['overall'][$smh['year']][$smh['month']]['withLTI'])) {
							$res['overall'][$smh['year']][$smh['month']]['withLTI'] = $res['overall'][$smh['year']][$smh['month']]['withLTI'] + (float) $smh['tmh_wlti'];		
						}else{
							$res['overall'][$smh['year']][$smh['month']]['withLTI'] = (float) $smh['tmh_wlti'];
						}

						if (isset($res['overall'][$smh['year']][$smh['month']]['withoutLTI'])) {
							$res['overall'][$smh['year']][$smh['month']]['withoutLTI'] = $res['overall'][$smh['year']][$smh['month']]['withoutLTI'] + (float) $smh['tmh_wolti'];		
						}else{
							$res['overall'][$smh['year']][$smh['month']]['withoutLTI'] = (float) $smh['tmh_wolti'];
						}

						//-------------START CHILD--------------//
						if (isset($res[$smh['package_id']][$smh['year']][$smh['month']]['withLTI'])) {
							$res[$smh['package_id']][$smh['year']][$smh['month']]['withLTI'] = $res[$smh['package_id']][$smh['year']][$smh['month']]['withLTI'] + (float) $smh['tmh_wlti'];		
						}else{
							$res[$smh['package_id']][$smh['year']][$smh['month']]['withLTI'] = (float) $smh['tmh_wlti'];
						}

						if (isset($res[$smh['package_id']][$smh['year']][$smh['month']]['withoutLTI'])) {
							$res[$smh['package_id']][$smh['year']][$smh['month']]['withoutLTI'] = $res[$smh['package_id']][$smh['year']][$smh['month']]['withoutLTI'] + (float) $smh['tmh_wolti'];		
						}else{
							$res[$smh['package_id']][$smh['year']][$smh['month']]['withoutLTI'] = (float) $smh['tmh_wolti'];
						}
						//-------------END CHILD--------------//
					}
				}
			}		
		}
		return $res;
	}

	function getQualityInfo(){
		$ret = array(
			'incident' => $this->getIncidentInfo(),
			'safetyActivity' => $this->getSafetyActivityInfo(),
			'ncr' => $this->getNcrInfo(),
			'overallManHours' => $this->getOverallManHoursData()
		);
		return $ret;
	}

	function date_compare_certified_claim($a, $b){
	    $t1 = strtotime($a['certifiedClaimDate']);
	    $t2 = strtotime($b['certifiedClaimDate']);
	    return $t1 - $t2;
	} 

	function compare_date_keys($dt1, $dt2) {
	    return strtotime($dt1) - strtotime($dt2);
	}

	function getClaimInfo(){
		if (!$this->contractInfo) return;
		$ret = array();
		if ($this->isWPC) {
			if(!$this->contractInfo['overall']) return;
			
			// for overall summation
			$paymentDayDiffTtlSum = 0;
			$paymentDayDiffRecCntSum = 0;
			// loop throgh each contract info in overall
			foreach ($this->contractInfo['overall'] as $contract) {
				$key = $contract['section'];
				$paymentDayDiffTtl = 0;
				$paymentDayDiffRecCnt = 0;

				if (!isset($contract['contract_id'])) continue;
				$contractId = $contract['contract_id'];

				$url = $this->jogetLinkObj->fetchLink("api","finance_dash_claim", array($contractId, $this->projectID));
				$resSd = $this->jogetCURL($url);
				$totalClaimOverall = $totalPaymentOverall = 0;
				if (isset($resSd['data'])) {
					//for summary dashboard based on contract info get the total cumulative claim (total) by month (ipa_submission_date) and payment amount (payment_received_amount) by month (paymentReceivedDate);
					usort($resSd['data'], array($this, 'date_compare_certified_claim'));
					$byMonYrArr = array();
					foreach ($resSd['data'] as $claim) {
						// for payment aging
						$paymentReceivedDate = ($claim['paymentReceivedDate']) ? $claim['paymentReceivedDate'] : date("Y-m-d");
	
						// for payment ageing
						if ($claim['ipa_submission_date']) {
							$dateDiff = strtotime($paymentReceivedDate) - strtotime($claim['ipa_submission_date']);
							$dayDiff = round($dateDiff / (60 * 60 * 24));
							if ($dayDiff > 0) {
								$paymentDayDiffTtl = $paymentDayDiffTtl + $dayDiff;
								$paymentDayDiffTtlSum = $paymentDayDiffTtlSum + $dayDiff;
							}
							$paymentDayDiffRecCnt = $paymentDayDiffRecCnt + 1;
							$paymentDayDiffRecCntSum = $paymentDayDiffRecCntSum + 1;
						}
	
						// claim - total, ipa_submission_date
						if ($claim['ipa_submission_date'] && $claim['total_claim_value']) {
							$claimMthYr = date('M-Y', strtotime($claim['ipa_submission_date']));
							$claimTotal = ($claim['total_claim_value']) ? (float) $claim['total_claim_value'] : 0;
							if (isset($byMonYrArr[$claimMthYr]['claim'])) {
								$byMonYrArr[$claimMthYr]['claim'] += $claimTotal;
							}else{
								$byMonYrArr[$claimMthYr]['claim'] = $claimTotal;
							}
						}
	
						// payment - payment_received_amount, paymentReceivedDate
						if ($claim['payment_received_amount'] && $claim['paymentReceivedDate']) {
							$payMthYr = date('M-Y', strtotime($claim['paymentReceivedDate']));
							$payTotal = ($claim['payment_received_amount']) ? (float) $claim['payment_received_amount'] : 0;		
							if (isset($byMonYrArr[$payMthYr]['payment'])) {
								$byMonYrArr[$payMthYr]['payment'] += $payTotal;
							}else{
								$byMonYrArr[$payMthYr]['payment'] = $payTotal;
							}
						}
	
						if (!$claim['certifiedClaimDate']) continue;
					}
	
					// for summary dashboard chart - loop payment and claim again after sort to get cumulative
					uksort($byMonYrArr, array($this,"compare_date_keys"));
					$totalClaim = $totalPayment = 0;
					foreach ($byMonYrArr as $j => $k) {
						$totalClaim = $totalClaim + (isset($k['claim']) ? $k['claim'] : 0);
						$totalPayment = $totalPayment + (isset($k['payment']) ? $k['payment'] : 0);
	
						$this->monthClaimAndPaymentInfo['overall'][$key][$j]['claim'] = $totalClaim;	
						$this->monthClaimAndPaymentInfo['overall'][$key][$j]['payment'] = $totalPayment;
						
						$totalClaimOverall = $totalClaimOverall + (isset($k['claim']) ? $k['claim'] : 0);
						$totalPaymentOverall = $totalPaymentOverall + (isset($k['payment']) ? $k['payment'] : 0);
						$this->monthClaimAndPaymentInfo['overall']['overall'][$j]['claim'] = $totalClaimOverall;	
						$this->monthClaimAndPaymentInfo['overall']['overall'][$j]['payment'] = $totalPaymentOverall;

						$this->monthClaimAndPaymentInfo['overall']['overall'][$j]['contract_id'] = $contractId;
					}
				}
				if($paymentDayDiffRecCnt > 0){
					$this->paymentAging['overall'][$key] = $paymentDayDiffTtl/$paymentDayDiffRecCnt;
				}
			}
			if($paymentDayDiffRecCntSum > 0){
				$this->paymentAging['overall']['overall'] = $paymentDayDiffTtlSum/$paymentDayDiffRecCntSum;
			}
		}else{
			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_claim", array('','', $this->projectID));
			$resSd = $this->jogetCURL($url);

			if( $resSd['data']){
				$dataArr = $resSd['data'];
				$allclaims = array();
				foreach ($dataArr as $dataClaim) {
					$allclaims[$dataClaim['project_id']][$dataClaim['contract_id_string']][] = $dataClaim;
				}
				
				foreach ($this->childProjectInfo as $childID) {
					if(empty($this->contractInfo) && !isset($this->contractInfo[$childID['project_id']])) return;

					// for overall summation
					$paymentDayDiffTtlSum = 0;
					$paymentDayDiffRecCntSum = 0;
					// loop throgh each contract info in overall
					foreach ($this->contractInfo[$childID['project_id']] as $contract) {
					
						$key = $contract['section'];
						$paymentDayDiffTtl = 0;
						$paymentDayDiffRecCnt = 0;
		
						if (!isset($contract['contract_id'])) continue;
						$contractId = $contract['contract_id'];

						$dataForContract = array();
						if(isset($allclaims[$childID['project_id']][$contractId])){
							$dataForContract = $allclaims[$childID['project_id']][$contractId];
						}
						
						// $url = $this->jogetLinkObj->fetchLink("api","finance_dash_claim", array($contractId, $childID['project_id'], ''));
						// $resSd = $this->jogetCURL($url);
						$totalClaimOverall = $totalPaymentOverall = 0;
						if (isset($dataForContract)) {
							
							//for summary dashboard based on contract info get the total cumulative claim (total) by month (ipa_submission_date) and payment amount (payment_received_amount) by month (paymentReceivedDate);
							usort($dataForContract, array($this, 'date_compare_certified_claim'));
							$byMonYrArr = array();
							foreach ($dataForContract as $claim) {

								// for payment aging
								$paymentReceivedDate = ($claim['paymentReceivedDate']) ? $claim['paymentReceivedDate'] : date("Y-m-d");
			
								// for payment ageing
								if ($claim['ipa_submission_date']) {
									$dateDiff = strtotime($paymentReceivedDate) - strtotime($claim['ipa_submission_date']);
									$dayDiff = round($dateDiff / (60 * 60 * 24));
									if ($dayDiff > 0) {
										$paymentDayDiffTtl = $paymentDayDiffTtl + $dayDiff;
										$paymentDayDiffTtlSum = $paymentDayDiffTtlSum + $dayDiff;
									}
									$paymentDayDiffRecCnt = $paymentDayDiffRecCnt + 1;
									$paymentDayDiffRecCntSum = $paymentDayDiffRecCntSum + 1;
								}
			
								// claim - total, ipa_submission_date
								if ($claim['ipa_submission_date'] && $claim['total_claim_value']) {
									$claimMthYr = date('M-Y', strtotime($claim['ipa_submission_date']));
									$claimTotal = ($claim['total_claim_value']) ? (float) $claim['total_claim_value'] : 0;
									if (isset($byMonYrArr[$claimMthYr]['claim'])) {
										$byMonYrArr[$claimMthYr]['claim'] += $claimTotal;
									}else{
										$byMonYrArr[$claimMthYr]['claim'] = $claimTotal;
									}
								}
			
								// payment - payment_received_amount, paymentReceivedDate
								if ($claim['payment_received_amount'] && $claim['paymentReceivedDate']) {
									$payMthYr = date('M-Y', strtotime($claim['paymentReceivedDate']));
									$payTotal = ($claim['payment_received_amount']) ? (float) $claim['payment_received_amount'] : 0;		
									if (isset($byMonYrArr[$payMthYr]['payment'])) {
										$byMonYrArr[$payMthYr]['payment'] += $payTotal;
									}else{
										$byMonYrArr[$payMthYr]['payment'] = $payTotal;
									}
								}
			
								if (!$claim['certifiedClaimDate']) continue;
							}
			
							// for summary dashboard chart - loop payment and claim again after sort to get cumulative
							uksort($byMonYrArr, array($this,"compare_date_keys"));
							$totalClaim = $totalPayment = 0;
							foreach ($byMonYrArr as $j => $k) {
								$totalClaim = $totalClaim + (isset($k['claim']) ? $k['claim'] : 0);
								$totalPayment = $totalPayment + (isset($k['payment']) ? $k['payment'] : 0);
			
								$this->monthClaimAndPaymentInfo['overall'][$key][$j]['claim'] = $totalClaim;	
								$this->monthClaimAndPaymentInfo['overall'][$key][$j]['payment'] = $totalPayment;
								
								$totalClaimOverall = $totalClaimOverall + (isset($k['claim']) ? $k['claim'] : 0);
								$totalPaymentOverall = $totalPaymentOverall + (isset($k['payment']) ? $k['payment'] : 0);
		
								// for child 
								$this->monthClaimAndPaymentInfo[$childID['project_id']][$key][$j]['claim'] = $totalClaim;	
								$this->monthClaimAndPaymentInfo[$childID['project_id']][$key][$j]['payment'] = $totalPayment;
								$this->monthClaimAndPaymentInfo[$childID['project_id']]['overall'][$j]['claim'] = $totalClaimOverall;	
								$this->monthClaimAndPaymentInfo[$childID['project_id']]['overall'][$j]['payment'] = $totalPaymentOverall;
		
								$this->monthClaimAndPaymentInfo[$childID['project_id']]['overall'][$j]['contract_id'] = $contractId;
							}
						}
						if($paymentDayDiffRecCnt > 0){
							$this->paymentAging['overall'][$key] = $paymentDayDiffTtl/$paymentDayDiffRecCnt;
							$this->paymentAging[$childID['project_id']][$key] = $paymentDayDiffTtl/$paymentDayDiffRecCnt;
						}
					}
					if($paymentDayDiffRecCntSum > 0){
						$this->paymentAging['overall']['overall'] = $paymentDayDiffTtlSum/$paymentDayDiffRecCntSum;
						$this->paymentAging[$childID['project_id']]['overall'] = $paymentDayDiffTtlSum/$paymentDayDiffRecCntSum;
					}
				}
			}
		}

		
		return;
	}

	function cashOutFlowInfo(){
		if ($this->isWPC) {
			if(!$this->contractInfo['overall']) return;
			// for total cashflow health overall
			$totalOutFlowSum = 0;
			foreach ($this->contractInfo['overall'] as $contract) {
				$key = $contract['section'];
				if (!isset($contract['contract_id'])) continue;
				$contractId = $contract['contract_id'];
				// to filter by contract id
				$url = $this->jogetLinkObj->fetchLink("api","finance_dash_cashoutflow", array($contractId, $this->projectID));
				$res = $this->jogetCURL($url);
				if (isset($res['data'])) {
					// get total out flow based on current contract only
					$totalOutFlow = 0;
					foreach ($res['data'] as $cash) {
						$totalOutFlow = $totalOutFlow + (float) $cash['amount'];
						$totalOutFlowSum = $totalOutFlowSum + (float) $cash['amount'];
					}
					// cash inflow - cash outflow
					$totalInflow = (float) $this->contractInfo['overall'][$key]['total_claim_vo_and_claim'];
					$diff = $totalInflow - $totalOutFlow;
	
					$ret['overall'][$key]['inflow'] = $totalInflow;
					$ret['overall'][$key]['outflow'] = $totalOutFlow;
					if ($diff == 0) {
						$ret['overall'][$key]['val'] = 0;
					}else if ($diff < 0){
						$ret['overall'][$key]['val'] = -1;
					}else{
						$ret['overall'][$key]['val'] = 1;
					}
				}
			}
			// for overall sum when filter are not selected
			$totalInflowSum = isset($this->contractInfo['overall']['sum']['total_claim_vo_and_claim']) ? (float) $this->contractInfo['overall']['sum']['total_claim_vo_and_claim'] : 0;
			$diffSum = $totalInflowSum - $totalOutFlowSum;
			$ret['overall']['overall']['inflow'] = $totalInflowSum;
			$ret['overall']['overall']['outflow'] = $totalOutFlowSum;
			if ($diffSum == 0) {
				$ret['overall']['overall']['val'] = 0;
			}else if ($diffSum < 0){
				$ret['overall']['overall']['val'] = -1;
			}else{
				$ret['overall']['overall']['val'] = 1;
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			if(!$this->contractInfo && !$this->contractInfo[$childID['project_id']]) return;
			// for total cashflow health overall
			$totalOutFlowSum = 0;
			foreach ($this->contractInfo[$childID['project_id']] as $contract) {
				$key = $contract['section'];
				if (!isset($contract['contract_id'])) continue;
				$contractId = $contract['contract_id'];
				// to filter by contract id
				$url = $this->jogetLinkObj->fetchLink("api","finance_dash_cashoutflow", array($contractId, $childID['project_id']));
				$res = $this->jogetCURL($url);
				if (isset($res['data'])) {
					// get total out flow based on current contract only
					$totalOutFlow = 0;
					foreach ($res['data'] as $cash) {
						$totalOutFlow = $totalOutFlow + (float) $cash['amount'];
						$totalOutFlowSum = $totalOutFlowSum + (float) $cash['amount'];
					}
					// cash inflow - cash outflow
					$totalInflow = isset($this->contractInfo[$childID['project_id']][$key]['total_claim_vo_and_claim']) ? (float) $this->contractInfo[$childID['project_id']][$key]['total_claim_vo_and_claim'] : 0;
					$diff = $totalInflow - $totalOutFlow;
	
					$ret['overall'][$key]['inflow'] = $totalInflow;
					$ret['overall'][$key]['outflow'] = $totalOutFlow;
					$ret[$childID['project_id']][$key]['inflow'] = $totalInflow;
					$ret[$childID['project_id']][$key]['outflow'] = $totalOutFlow;
					if ($diff == 0) {
						$ret['overall'][$key]['val'] = 0;
						$ret[$childID['project_id']][$key]['val'] = 0;
					}else if ($diff < 0){
						$ret['overall'][$key]['val'] = -1;
						$ret[$childID['project_id']][$key]['val'] = -1;
					}else{
						$ret['overall'][$key]['val'] = 1;
						$ret[$childID['project_id']][$key]['val'] = 1;
					}
				}
			}
			// for overall sum when filter are not selected
			$totalInflowSum = isset($this->contractInfo['overall']['sum']['total_claim_vo_and_claim']) ? (float) $this->contractInfo['overall']['sum']['total_claim_vo_and_claim'] : 0;
			$diffSum = $totalInflowSum - $totalOutFlowSum;
			$ret['overall']['overall']['inflow'] = $totalInflowSum;
			$ret['overall']['overall']['outflow'] = $totalOutFlowSum;
			if ($diffSum == 0) {
				$ret['overall']['overall']['val'] = 0;
				$ret[$childID['project_id']]['overall']['val'] = 0;
			}else if ($diffSum < 0){
				$ret['overall']['overall']['val'] = -1;
				$ret[$childID['project_id']]['overall']['val'] = -1;
			}else{
				$ret['overall']['overall']['val'] = 1;
				$ret[$childID['project_id']]['overall']['val'] = 1;
			}		
		}
		return $ret;
	}

	// 'N/A', 1, 0, -1
	function ladRiskInfo(){
		$ret = array();
		// current year and month
		if ($this->sCurveData) {
			if(isset($this->sCurveData['overall'])){
				foreach ($this->sCurveData['overall'] as $key => $sCurve) {
					$currentPlanPhy = (isset($this->sCurveData['overall'][$key]['card'][date('Y')][date('M')]['finEarly'])) ? $this->sCurveData['overall'][$key]['card'][date('Y')][date('M')]['finEarly'] : 0;
					$currentActPhy = (isset($this->sCurveData['overall'][$key]['card'][date('Y')][date('M')]['finActual'])) ? $this->sCurveData['overall'][$key]['card'][date('Y')][date('M')]['finActual'] : 0;
	
					$ret['overall'][$key]['finActual'] = $currentActPhy;
					$ret['overall'][$key]['finEarly'] = $currentPlanPhy;
					// different between physical and actual
					$diff = $currentPlanPhy - $currentActPhy;
					$ret['overall'][$key]['diff'] = $diff;
					if ($diff <= 1) {
						$ret['overall'][$key]['val'] = 1;
					}elseif ($diff <= 20) {
						$ret['overall'][$key]['val'] = 0;
					}else{
						$ret['overall'][$key]['val'] = -1;
					}
				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			if ($this->sCurveData) {
				if(isset($this->sCurveData[$childID['project_id']])){
					foreach ($this->sCurveData[$childID['project_id']] as $key => $sCurve) {
						$currentPlanPhy = (isset($this->sCurveData[$childID['project_id']][$key]['card'][date('Y')][date('M')]['finEarly'])) ? $this->sCurveData[$childID['project_id']][$key]['card'][date('Y')][date('M')]['finEarly'] : 0;
						$currentActPhy = (isset($this->sCurveData[$childID['project_id']][$key]['card'][date('Y')][date('M')]['finActual'])) ? $this->sCurveData[$childID['project_id']][$key]['card'][date('Y')][date('M')]['finActual'] : 0;
		
						$ret[$childID['project_id']][$key]['finActual'] = $currentActPhy;
						$ret[$childID['project_id']][$key]['finEarly'] = $currentPlanPhy;
						// different between physical and actual
						$diff = $currentPlanPhy - $currentActPhy;
						$ret[$childID['project_id']][$key]['diff'] = $diff;
						if ($diff <= 1) {
							$ret[$childID['project_id']][$key]['val'] = 1;
						}elseif ($diff <= 20) {
							$ret[$childID['project_id']][$key]['val'] = 0;
						}else{
							$ret[$childID['project_id']][$key]['val'] = -1;
						}
					}
				}
			}		
		}
		return $ret;
	}

	function paymentAgingInfo(){
		$ret = array();
		if(isset($this->paymentAging['overall'])){
			foreach ($this->paymentAging['overall'] as $key => $payAge) {
				$ageingVal = ($payAge) ? $payAge : 0;
				$ret['overall'][$key]['value'] = number_format($ageingVal, 2, '.', '');
				$ret['overall'][$key]['level'] = '1';
				if ((int) $ageingVal < 37) {
					$ret['overall'][$key]['level'] = '1';
				}elseif ((int) $ageingVal < 44) {
					$ret['overall'][$key]['level'] = '0';
				}elseif ((int) $ageingVal > 44) {
					$ret['overall'][$key]['level'] = '-1';
				}
			}
		}
		foreach ($this->childProjectInfo as $childID) {
			if(isset($this->paymentAging[$childID['project_id']])){
				foreach ($this->paymentAging[$childID['project_id']] as $key => $payAge) {
					$ageingVal = ($payAge) ? $payAge : 0;
					$ret[$childID['project_id']][$key]['value'] = number_format($ageingVal, 2, '.', '');
					$ret[$childID['project_id']][$key]['level'] = '1';
					if ((int) $ageingVal < 37) {
						$ret[$childID['project_id']][$key]['level'] = '1';
					}elseif ((int) $ageingVal < 44) {
						$ret[$childID['project_id']][$key]['level'] = '0';
					}elseif ((int) $ageingVal > 44) {
						$ret[$childID['project_id']][$key]['level'] = '-1';
					}
				}
			}		
		}
		return $ret;
	}

	function getCostInfo(){
		$ret = array();
		$this->sectionList = $this->getSectionList();
		$this->sCurveData = $this->getProjectSummaryInfo();

		$this->contractInfo = $this->getContractInfo();
		
		// if got contract id then check the claim related
		$claimInfo = [];
		if ($this->contractInfo) {
			$this->getClaimInfo();
		}

		//lad risk
		//cash outflow
		$ret = array(
			'finSCurve' => $this->sCurveData,
			'contractInfo' => $this->contractInfo,
			'paymentAndClaim' => $this->monthClaimAndPaymentInfo,
			'sectionList' => $this->sectionList,
			'indicator' => array(
				'lad' => $this->ladRiskInfo(),
				'cashOutFlow' => $this->cashOutFlowInfo(),
				'paymentAging' => $this->paymentAgingInfo()
			)
		);
		return $ret;
	}

	function getSectionList(){
		$ret = array();
		$this->jogetLinkObj->getLink('document');
		if ($this->isWPC) {
			if (!isset($this->jogetLinkObj->jogetAppLink['api'])) return;
			$url = $this->jogetLinkObj->fetchLink("api","document_dash_list_section", array($this->projectID));
			$resSec = $this->jogetCURL($url);
			if (isset($resSec['data'])) {
				usort($resSec['data'], function($a, $b) {
				    return strcmp($a["section_name"], $b["section_name"]);
				});
				foreach ($resSec['data'] as $sec) {
					$ret['overall'][] = $sec['section_name'];
				}
			}
		}else{
			$url = $this->jogetLinkObj->fetchLink("api","document_dash_list_section", array('', $this->parentProjectID));
			$resSec = $this->jogetCURL($url);
			if (isset($resSec['data'])) {
				usort($resSec['data'], function($a, $b) {
				    return strcmp($a["section_name"], $b["section_name"]);
				});
				foreach ($resSec['data'] as $sec) {
					$ret[$sec['package_id']][] = $sec['section_name'];
				}
			}				
		}
		return $ret;
	}

	function date_compare_sd($a, $b)
	{
	    $t1 = strtotime($a['day_date']);
	    $t2 = strtotime($b['day_date']);
	    return $t1 - $t2;
	}    

	/*
	Use at : Time dashboard
		Fetch data for pass 5 month only after cut off
	*/
	function getMonthfromTSRange($dtObj, $cutOffDay){
		// if higher than cutoff days will be next month data
		$ret['realDate'] = $dtObj->format('d/m/Y');
		$newDateObj = new DateTime($cutOffDay.'-'.$dtObj->format('m-Y'));
		if ($dtObj->format('j')> $cutOffDay) {
			$dtObj->modify('first day of next month');
			
			$newDateObj->modify('+1 days');
			$ret['fromDate'] = $newDateObj->format('d/m/Y');
			$newDateObj->modify('+1 months');
			$newDateObj->modify('-1 days');
			$ret['toDate'] = $newDateObj->format('d/m/Y');
		}else{
			$ret['toDate'] = $newDateObj->format('d/m/Y');
			$newDateObj->modify('-1 months');
			$newDateObj->modify('+1 days');
			$ret['fromDate'] = $newDateObj->format('d/m/Y');
		}
		$ret['mth'] = $dtObj->format('m');
		$ret['yr'] = $dtObj->format('Y');
		
		$yr = $dtObj->format('Y');			
		$newDay = $cutOffDay + 1;
		$newDay = ($newDay > 31) ? 31 : $newDay;

		$yrFirstDay = date($newDay.'/12/'.($yr-1));
		$yrLastDay = date($cutOffDay."/12/".$yr);
		$ret['yrFirstDay'] = $yrFirstDay;			
		$ret['yrLastDay'] = $yrLastDay;	

		return $ret;
	}

	function getPackageCutOffDay(){
		if (!$this->isWPC) {
			$dataCutOff = $this->db->fetchAll("select cut_off_day, project_id from projects where parent_project_id_number = :0", array($_SESSION['project_id']));
			foreach ($dataCutOff as $val) {
				$this->packageCutOffArr[$val['project_id']] = ($val['cut_off_day']) ? $val['cut_off_day'] : "25";
			}
		} 
		$this->packageCutOffArr['overall'] = $this->cutoffDay;
		return;
	}
	
	function sideDiaryRes(&$ret, $sd, $mthCT, $packId){
		if(!isset($ret[$packId]['overall']['allData']['all']['all'])){
			$ret[$packId]['overall']['allData']['all']['all'] = array('dateFrom' => '', 'dateTo' => '', 'section' => '');
		}
		if(!isset($ret[$packId]['overall']['allData'][$mthCT['yr']]['all'])){
			$ret[$packId]['overall']['allData'][$mthCT['yr']]['all'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay'], 'section' => '');
		}
		if(!isset($ret[$packId]['overall']['allData'][$mthCT['yr']][$mthCT['mth']])){
			$ret[$packId]['overall']['allData'][$mthCT['yr']][$mthCT['mth']] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate'], 'section' => '');
		}

		if(!isset($ret[$packId][$sd['section']]['allData']['all']['all'])){
			$ret[$packId][$sd['section']]['allData']['all']['all'] = array('dateFrom' => '', 'dateTo' => '', 'section' => $sd['section']);
		}
		if(!isset($ret[$packId][$sd['section']]['allData'][$mthCT['yr']]['all'])){
			$ret[$packId][$sd['section']]['allData'][$mthCT['yr']]['all'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay'], 'section' => $sd['section']);
		}
		if(!isset($ret[$packId][$sd['section']]['allData'][$mthCT['yr']][$mthCT['mth']])){
			$ret[$packId][$sd['section']]['allData'][$mthCT['yr']][$mthCT['mth']] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate'], 'section' => $sd['section']);
		}

		// date 26-6-2021 - 25-7-2021 consider 7	
		// sunny
		if (isset($ret[$packId]['overall']['weather']['all']['all']['Sunny'])) {
			$ret[$packId]['overall']['weather']['all']['all']['Sunny'] = $ret[$packId]['overall']['weather']['all']['all']['Sunny'] + (float) $sd['count_weather_s'];
		}else{
			$ret[$packId]['overall']['weather']['all']['all']['Sunny'] = (float) $sd['count_weather_s'];
		}
		if (isset($ret[$packId][$sd['section']]['weather']['all']['all']['Sunny'])) {
			$ret[$packId][$sd['section']]['weather']['all']['all']['Sunny'] = $ret[$packId][$sd['section']]['weather']['all']['all']['Sunny'] + (float) $sd['count_weather_s'];
		}else{
			$ret[$packId][$sd['section']]['weather']['all']['all']['Sunny'] = (float) $sd['count_weather_s'];
		}

		if (isset($ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Sunny'])) {
			$ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Sunny'] = $ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Sunny'] + (float) $sd['count_weather_s'];
		}else{
			$ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Sunny'] = (float) $sd['count_weather_s'];
		}
		if (isset($ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Sunny'])) {
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Sunny'] = $ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Sunny'] + (float) $sd['count_weather_s'];
		}else{
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Sunny'] = (float) $sd['count_weather_s'];
		}

		if (isset($ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Sunny'])) {
			$ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Sunny'] = $ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Sunny'] + (float) $sd['count_weather_s'];
		}else{
			$ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Sunny'] = (float) $sd['count_weather_s'];
		}
		if (isset($ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Sunny'])) {
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Sunny'] = $ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Sunny'] + (float) $sd['count_weather_s'];
		}else{
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Sunny'] = (float) $sd['count_weather_s'];
		}

		// cloudy
		if (isset($ret[$packId]['overall']['weather']['all']['all']['Cloudy'])) {
			$ret[$packId]['overall']['weather']['all']['all']['Cloudy'] = $ret[$packId]['overall']['weather']['all']['all']['Cloudy'] + (float) $sd['count_weather_c'];
		}else{
			$ret[$packId]['overall']['weather']['all']['all']['Cloudy'] = (float) $sd['count_weather_c'];
		}
		if (isset($ret[$packId][$sd['section']]['weather']['all']['all']['Cloudy'])) {
			$ret[$packId][$sd['section']]['weather']['all']['all']['Cloudy'] = $ret[$packId][$sd['section']]['weather']['all']['all']['Cloudy'] + (float) $sd['count_weather_c'];
		}else{
			$ret[$packId][$sd['section']]['weather']['all']['all']['Cloudy'] = (float) $sd['count_weather_c'];
		}

		if (isset($ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Cloudy'])) {
			$ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Cloudy'] = $ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Cloudy'] + (float) $sd['count_weather_c'];
		}else{
			$ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Cloudy'] = (float) $sd['count_weather_c'];
		}
		if (isset($ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Cloudy'])) {
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Cloudy'] = $ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Cloudy'] + (float) $sd['count_weather_c'];
		}else{
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Cloudy'] = (float) $sd['count_weather_c'];
		}

		if (isset($ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Cloudy'])) {
			$ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Cloudy'] = $ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Cloudy'] + (float) $sd['count_weather_c'];
		}else{
			$ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Cloudy'] = (float) $sd['count_weather_c'];
		}
		if (isset($ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Cloudy'])) {
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Cloudy'] = $ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Cloudy'] + (float) $sd['count_weather_c'];
		}else{
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Cloudy'] = (float) $sd['count_weather_c'];
		}

		// drizzle
		if (isset($ret[$packId]['overall']['weather']['all']['all']['Drizzle'])) {
			$ret[$packId]['overall']['weather']['all']['all']['Drizzle'] = $ret[$packId]['overall']['weather']['all']['all']['Drizzle'] + (float) $sd['count_weather_d'];
		}else{
			$ret[$packId]['overall']['weather']['all']['all']['Drizzle'] = (float) $sd['count_weather_d'];
		}
		if (isset($ret[$packId][$sd['section']]['weather']['all']['all']['Drizzle'])) {
			$ret[$packId][$sd['section']]['weather']['all']['all']['Drizzle'] = $ret[$packId][$sd['section']]['weather']['all']['all']['Drizzle'] + (float) $sd['count_weather_d'];
		}else{
			$ret[$packId][$sd['section']]['weather']['all']['all']['Drizzle'] = (float) $sd['count_weather_d'];
		}

		if (isset($ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Drizzle'])) {
			$ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Drizzle'] = $ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Drizzle'] + (float) $sd['count_weather_d'];
		}else{
			$ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Drizzle'] = (float) $sd['count_weather_d'];
		}
		if (isset($ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Drizzle'])) {
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Drizzle'] = $ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Drizzle'] + (float) $sd['count_weather_d'];
		}else{
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Drizzle'] = (float) $sd['count_weather_d'];
		}

		if (isset($ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Drizzle'])) {
			$ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Drizzle'] = $ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Drizzle'] + (float) $sd['count_weather_d'];
		}else{
			$ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Drizzle'] = (float) $sd['count_weather_d'];
		}
		if (isset($ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Drizzle'])) {
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Drizzle'] = $ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Drizzle'] + (float) $sd['count_weather_d'];
		}else{
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Drizzle'] = (float) $sd['count_weather_d'];
		}

		// heavy rain
		if (isset($ret[$packId]['overall']['weather']['all']['all']['Heavy Rain'])) {
			$ret[$packId]['overall']['weather']['all']['all']['Heavy Rain'] = $ret[$packId]['overall']['weather']['all']['all']['Heavy Rain'] + (float) $sd['count_weather_r'];
		}else{
			$ret[$packId]['overall']['weather']['all']['all']['Heavy Rain'] = (float) $sd['count_weather_r'];
		}
		if (isset($ret[$packId][$sd['section']]['weather']['all']['all']['Heavy Rain'])) {
			$ret[$packId][$sd['section']]['weather']['all']['all']['Heavy Rain'] = $ret[$packId][$sd['section']]['weather']['all']['all']['Heavy Rain'] + (float) $sd['count_weather_r'];
		}else{
			$ret[$packId][$sd['section']]['weather']['all']['all']['Heavy Rain'] = (float) $sd['count_weather_r'];
		}

		if (isset($ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Heavy Rain'])) {
			$ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Heavy Rain'] = $ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Heavy Rain'] + (float) $sd['count_weather_r'];
		}else{
			$ret[$packId]['overall']['weather'][$mthCT['yr']]['all']['Heavy Rain'] = (float) $sd['count_weather_r'];
		}
		if (isset($ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Heavy Rain'])) {
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Heavy Rain'] = $ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Heavy Rain'] + (float) $sd['count_weather_r'];
		}else{
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']]['all']['Heavy Rain'] = (float) $sd['count_weather_r'];
		}

		if (isset($ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Heavy Rain'])) {
			$ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Heavy Rain'] = $ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Heavy Rain'] + (float) $sd['count_weather_r'];
		}else{
			$ret[$packId]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['Heavy Rain'] = (float) $sd['count_weather_r'];
		}
		if (isset($ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Heavy Rain'])) {
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Heavy Rain'] = $ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Heavy Rain'] + (float) $sd['count_weather_r'];
		}else{
			$ret[$packId][$sd['section']]['weather'][$mthCT['yr']][$mthCT['mth']]['Heavy Rain'] = (float) $sd['count_weather_r'];
		}

		// machinery and worker
		// take highest
		// machinery
		if (isset($ret[$packId]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']])) {
			$ret[$packId]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']] = ((float) $sd['count_machinery'] > $ret[$packId]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]) ? (float) $sd['count_machinery'] : $ret[$packId]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']];
		}else{
			$ret[$packId]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']] = (float) $sd['count_machinery'];
		}

		if (isset($ret[$packId][$sd['section']]['machinery'][$mthCT['yr']][$mthCT['mth']])) {
			$ret[$packId][$sd['section']]['machinery'][$mthCT['yr']][$mthCT['mth']] = ((float) $sd['count_machinery'] > $ret[$packId][$sd['section']]['machinery'][$mthCT['yr']][$mthCT['mth']]) ? (float) $sd['count_machinery'] : $ret[$packId][$sd['section']]['machinery'][$mthCT['yr']][$mthCT['mth']];
		}else{
			$ret[$packId][$sd['section']]['machinery'][$mthCT['yr']][$mthCT['mth']] = (float) $sd['count_machinery'];
		}

		// worker
		if (isset($ret[$packId]['overall']['worker'][$mthCT['yr']][$mthCT['mth']])) {
			$ret[$packId]['overall']['worker'][$mthCT['yr']][$mthCT['mth']] = ((float) $sd['count_worker'] > $ret[$packId]['overall']['worker'][$mthCT['yr']][$mthCT['mth']]) ? (float) $sd['count_worker'] : $ret[$packId]['overall']['worker'][$mthCT['yr']][$mthCT['mth']];
		}else{
			$ret[$packId]['overall']['worker'][$mthCT['yr']][$mthCT['mth']] = (float) $sd['count_worker'];
		}

		if (isset($ret[$packId][$sd['section']]['worker'][$mthCT['yr']][$mthCT['mth']])) {
			$ret[$packId][$sd['section']]['worker'][$mthCT['yr']][$mthCT['mth']] = ((float) $sd['count_worker'] > $ret[$packId][$sd['section']]['worker'][$mthCT['yr']][$mthCT['mth']]) ? (float) $sd['count_worker'] : $ret[$packId][$sd['section']]['worker'][$mthCT['yr']][$mthCT['mth']];
		}else{
			$ret[$packId][$sd['section']]['worker'][$mthCT['yr']][$mthCT['mth']] = (float) $sd['count_worker'];
		}

		return;
	}

	function getSideDiaryData($year, $month){
		if (!$year) $year = date('Y');
		$ret = array();
		if (!$this->sectionList) $this->sectionList = $this->getSectionList();

		if ($this->isWPC) {
			//with this format 31-08-2021
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_SD_opt", array($this->projectID, '', '', $this->parentProjectID));
			$resSd = $this->jogetCURL($url);
			// get all section highest if have value do the things
			$sectionHighestArr = array(); 

			if (isset($resSd['data'])) {
				$dataArr = $resSd['data'];
				usort($dataArr, array($this, 'date_compare_sd'));
				foreach ($dataArr as $sd) {
					$mthCT = $this->getMonthfromTSRange(new DateTime($sd['day_date']), $this->cutoffDay);
					$this->sideDiaryRes($ret, $sd, $mthCT, 'overall');

					// if has section then need to calculate the total for overall

					//FOR YEAR AND MONTH
					// weather sunny
					if(isset($sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalSunny'])){
						$sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalSunny'] = $sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalSunny'] + (float) $sd['count_weather_s'];
					}else{
						$sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalSunny'] = (float) $sd['count_weather_s']; 
					}
					// weather cloudy
					if(isset($sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalCloudy'])){
						$sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalCloudy'] = $sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalCloudy'] + (float) $sd['count_weather_c'];
					}else{
						$sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalCloudy'] = (float) $sd['count_weather_c']; 
					}
					// weather drizzle
					if(isset($sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalDrizzle'])){
						$sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalDrizzle'] = $sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalDrizzle'] + (float) $sd['count_weather_d'];
					}else{
						$sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalDrizzle'] = (float) $sd['count_weather_d']; 
					}
					// weather heavy rain
					if(isset($sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalRain'])){
						$sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalRain'] = $sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalRain'] + (float) $sd['count_weather_r'];
					}else{
						$sectionHighestArr['overall'][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalRain'] = (float) $sd['count_weather_r']; 
					}
				}
			}
			
			if(isset($ret) && $ret > 0){
				foreach ($ret as $keySection => $valSection) {
					foreach ($valSection as $keyData => $valData) {
						if($keyData == 'overall'){
							if(isset($valData['machinery'])){
								foreach ($valData['machinery'] as $keyYear => $valYear) {
									foreach ($valYear as $keyMonth => $valMonth) {
										$valueToAdd = $valMonth;
										// machinery
										if(isset($ret['overall']['overall']['machinery']['all']['all'])){
											$ret['overall']['overall']['machinery']['all']['all'] = $ret['overall']['overall']['machinery']['all']['all'] + (float) $valueToAdd;
										}else{
											$ret['overall']['overall']['machinery']['all']['all'] = (float) $valueToAdd;
										}

										if(isset($ret['overall']['overall']['machinery'][$keyYear]['all'])){
											$ret['overall']['overall']['machinery'][$keyYear]['all'] = $ret['overall']['overall']['machinery'][$keyYear]['all'] + (float) $valueToAdd;
										}else{
											$ret['overall']['overall']['machinery'][$keyYear]['all'] = (float) $valueToAdd;
										}

									}
								}

							}

							if(isset($valData['worker'])){
								foreach ($valData['worker'] as $keyYear => $valYear) {
									foreach ($valYear as $keyMonth => $valMonth) {
										$valueToAdd = $valMonth;
										// worker
										if(isset($ret['overall']['overall']['worker']['all']['all'])){
											$ret['overall']['overall']['worker']['all']['all'] = $ret['overall']['overall']['worker']['all']['all'] + (float) $valueToAdd;
										}else{
											$ret['overall']['overall']['worker']['all']['all'] = (float) $valueToAdd;
										}

										if(isset($ret['overall']['overall']['worker'][$keyYear]['all'])){
											$ret['overall']['overall']['worker'][$keyYear]['all'] = $ret['overall']['overall']['worker'][$keyYear]['all'] + (float) $valueToAdd;
										}else{
											$ret['overall']['overall']['worker'][$keyYear]['all'] = (float) $valueToAdd;
										}
									}
								}

							}
						}
						else{
							if(isset($valData['machinery'])){
								foreach ($valData['machinery'] as $keyYear => $valYear) {
									foreach ($valYear as $keyMonth => $valMonth) {
										$valueToAdd = $valMonth;
										// machinery
										//FOR SECTION
										if(isset($ret['overall'][$keyData]['machinery']['all']['all'])){
											$ret['overall'][$keyData]['machinery']['all']['all'] = $ret['overall'][$keyData]['machinery']['all']['all'] + (float) $valueToAdd;
										}else{
											$ret['overall'][$keyData]['machinery']['all']['all'] = (float) $valueToAdd;
										}

										if(isset($ret['overall'][$keyData]['machinery'][$keyYear]['all'])){
											$ret['overall'][$keyData]['machinery'][$keyYear]['all'] = $ret['overall'][$keyData]['machinery'][$keyYear]['all'] + (float) $valueToAdd;
										}else{
											$ret['overall'][$keyData]['machinery'][$keyYear]['all'] = (float) $valueToAdd;
										}
									}
								}

							}

							if(isset($valData['worker'])){
								foreach ($valData['worker'] as $keyYear => $valYear) {
									foreach ($valYear as $keyMonth => $valMonth) {
										$valueToAdd = $valMonth;
										// worker
										//FOR SECTION
										if(isset($ret['overall'][$keyData]['worker']['all']['all'])){
											$ret['overall'][$keyData]['worker']['all']['all'] = $ret['overall'][$keyData]['worker']['all']['all'] + (float) $valueToAdd;
										}else{
											$ret['overall'][$keyData]['worker']['all']['all'] = (float) $valueToAdd;
										}

										if(isset($ret['overall'][$keyData]['worker'][$keyYear]['all'])){
											$ret['overall'][$keyData]['worker'][$keyYear]['all'] = $ret['overall'][$keyData]['worker'][$keyYear]['all'] + (float) $valueToAdd;
										}else{
											$ret['overall'][$keyData]['worker'][$keyYear]['all'] = (float) $valueToAdd;
										}
									}
								}

							}
						}
							
					}
				}
			}

			$secCount = isset($this->sectionList['overall']) ? count($this->sectionList['overall']) : 0;
			$tmpArr = array();
			if(isset($sectionHighestArr['overall']) && $secCount > 0){
				$ret['overall']['overall']['weather'] = array();
				foreach ($sectionHighestArr['overall'] as $sect => $sectArr) {
					foreach ($sectArr as $year => $yrArr) {
						foreach ($yrArr as $month => $mthArr) {
							//ALL ALL
							// sunny
							if (isset($tmpArr['all']['all']['totalSunny'])) {
								$tmpArr['all']['all']['totalSunny'] = $tmpArr['all']['all']['totalSunny'] + (float) $mthArr['totalSunny'];
							}else{
								$tmpArr['all']['all']['totalSunny'] = (float) $mthArr['totalSunny'];
							}
							$ret['overall']['overall']['weather']['all']['all']['Sunny'] = round($tmpArr['all']['all']['totalSunny']/$secCount, 2);
							// cloudy
							if (isset($tmpArr['all']['all']['totalCloudy'])) {
								$tmpArr['all']['all']['totalCloudy'] = $tmpArr['all']['all']['totalCloudy'] + (float) $mthArr['totalCloudy'];
							}else{
								$tmpArr['all']['all']['totalCloudy'] = (float) $mthArr['totalCloudy'];
							}
							$ret['overall']['overall']['weather']['all']['all']['Cloudy'] = round($tmpArr['all']['all']['totalCloudy']/$secCount, 2);
							// drizzle
							if (isset($tmpArr['all']['all']['totalDrizzle'])) {
								$tmpArr['all']['all']['totalDrizzle'] = $tmpArr['all']['all']['totalDrizzle'] + (float) $mthArr['totalDrizzle'];
							}else{
								$tmpArr['all']['all']['totalDrizzle'] = (float) $mthArr['totalDrizzle'];
							}
							$ret['overall']['overall']['weather']['all']['all']['Drizzle'] = round($tmpArr['all']['all']['totalDrizzle']/$secCount, 2);
							// heavy rain
							if (isset($tmpArr['all']['all']['totalRain'])) {
								$tmpArr['all']['all']['totalRain'] = $tmpArr['all']['all']['totalRain'] + (float) $mthArr['totalRain'];
							}else{
								$tmpArr['all']['all']['totalRain'] = (float) $mthArr['totalRain'];
							}
							$ret['overall']['overall']['weather']['all']['all']['Heavy Rain'] = round($tmpArr['all']['all']['totalRain']/$secCount, 2);

							//YEAR ALL
							// sunny
							if (isset($tmpArr[$year]['all']['totalSunny'])) {
								$tmpArr[$year]['all']['totalSunny'] = $tmpArr[$year]['all']['totalSunny'] + (float) $mthArr['totalSunny'];
							}else{
								$tmpArr[$year]['all']['totalSunny'] = (float) $mthArr['totalSunny'];
							}
							$ret['overall']['overall']['weather'][$year]['all']['Sunny'] = round($tmpArr[$year]['all']['totalSunny']/$secCount, 2);
							// cloudy
							if (isset($tmpArr[$year]['all']['totalCloudy'])) {
								$tmpArr[$year]['all']['totalCloudy'] = $tmpArr[$year]['all']['totalCloudy'] + (float) $mthArr['totalCloudy'];
							}else{
								$tmpArr[$year]['all']['totalCloudy'] = (float) $mthArr['totalCloudy'];
							}
							$ret['overall']['overall']['weather'][$year]['all']['Cloudy'] = round($tmpArr[$year]['all']['totalCloudy']/$secCount, 2);
							// drizzle
							if (isset($tmpArr[$year]['all']['totalDrizzle'])) {
								$tmpArr[$year]['all']['totalDrizzle'] = $tmpArr[$year]['all']['totalDrizzle'] + (float) $mthArr['totalDrizzle'];
							}else{
								$tmpArr[$year]['all']['totalDrizzle'] = (float) $mthArr['totalDrizzle'];
							}
							$ret['overall']['overall']['weather'][$year]['all']['Drizzle'] = round($tmpArr[$year]['all']['totalDrizzle']/$secCount, 2);
							// heavy rain
							if (isset($tmpArr[$year]['all']['totalRain'])) {
								$tmpArr[$year]['all']['totalRain'] = $tmpArr[$year]['all']['totalRain'] + (float) $mthArr['totalRain'];
							}else{
								$tmpArr[$year]['all']['totalRain'] = (float) $mthArr['totalRain'];
							}
							$ret['overall']['overall']['weather'][$year]['all']['Heavy Rain'] = round($tmpArr[$year]['all']['totalRain']/$secCount, 2);

							// for weather take average
							// sunny
							if (isset($tmpArr[$year][$month]['totalSunny'])) {
								$tmpArr[$year][$month]['totalSunny'] = $tmpArr[$year][$month]['totalSunny'] + (float) $mthArr['totalSunny'];
							}else{
								$tmpArr[$year][$month]['totalSunny'] = (float) $mthArr['totalSunny'];
							}
							$ret['overall']['overall']['weather'][$year][$month]['Sunny'] = round($tmpArr[$year][$month]['totalSunny']/$secCount, 2);
							// cloudy
							if (isset($tmpArr[$year][$month]['totalCloudy'])) {
								$tmpArr[$year][$month]['totalCloudy'] = $tmpArr[$year][$month]['totalCloudy'] + (float) $mthArr['totalCloudy'];
							}else{
								$tmpArr[$year][$month]['totalCloudy'] = (float) $mthArr['totalCloudy'];
							}
							$ret['overall']['overall']['weather'][$year][$month]['Cloudy'] = round($tmpArr[$year][$month]['totalCloudy']/$secCount, 2);
							// drizzle
							if (isset($tmpArr[$year][$month]['totalDrizzle'])) {
								$tmpArr[$year][$month]['totalDrizzle'] = $tmpArr[$year][$month]['totalDrizzle'] + (float) $mthArr['totalDrizzle'];
							}else{
								$tmpArr[$year][$month]['totalDrizzle'] = (float) $mthArr['totalDrizzle'];
							}
							$ret['overall']['overall']['weather'][$year][$month]['Drizzle'] = round($tmpArr[$year][$month]['totalDrizzle']/$secCount, 2);
							// heavy rain
							if (isset($tmpArr[$year][$month]['totalRain'])) {
								$tmpArr[$year][$month]['totalRain'] = $tmpArr[$year][$month]['totalRain'] + (float) $mthArr['totalRain'];
							}else{
								$tmpArr[$year][$month]['totalRain'] = (float) $mthArr['totalRain'];
							}
							$ret['overall']['overall']['weather'][$year][$month]['Heavy Rain'] = round($tmpArr[$year][$month]['totalRain']/$secCount, 2);
						}
					}
				}
			}
		}
		else {
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_SD_opt", array('', '', '', $this->parentProjectID));
			$resSd = $this->jogetCURL($url);
			
			foreach ($this->childProjectInfo as $childID) {
				
				// get all section highest if have value do the things
				$sectionHighestArr = array(); 
	
				if (isset($resSd['data'])) {
					$dataArr = $resSd['data'];
					// usort($dataArr, array($this, 'date_compare_sd'));
					foreach ($dataArr as $sd) {
						if($childID['project_id'] != $sd['package_id']) {continue;}

						$mthCT = $this->getMonthfromTSRange(new DateTime($sd['day_date']), $this->cutoffDay);
						$this->sideDiaryRes($ret, $sd, $mthCT, $childID['project_id']);
	
						// if has section then need to calculate the total for overall
						// for child
						// worker
						if(isset($sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['worker'])){
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['worker'] = ((float) $sd['count_worker'] > $sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['worker']) ? (float) $sd['count_worker'] : $sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['worker'];
						}else{
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['worker'] = (float) $sd['count_worker']; 
						}
						// machinery
						if(isset($sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['machinery'])){
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['machinery'] = ((float) $sd['count_machinery'] > $sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['machinery']) ? (float) $sd['count_machinery'] : $sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['machinery'];
						}else{
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['machinery'] = (float) $sd['count_machinery']; 
						}
						// weather sunny
						if(isset($sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalSunny'])){
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalSunny'] = $sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalSunny'] + (float) $sd['count_weather_s'];
						}else{
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalSunny'] = (float) $sd['count_weather_s']; 
						}
						// weather cloudy
						if(isset($sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalCloudy'])){
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalCloudy'] = $sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalCloudy'] + (float) $sd['count_weather_c'];
						}else{
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalCloudy'] = (float) $sd['count_weather_c']; 
						}
						// weather drizzle
						if(isset($sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalDrizzle'])){
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalDrizzle'] = $sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalDrizzle'] + (float) $sd['count_weather_d'];
						}else{
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalDrizzle'] = (float) $sd['count_weather_d']; 
						}
						// weather heavy rain
						if(isset($sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalRain'])){
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalRain'] = $sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalRain'] + (float) $sd['count_weather_r'];
						}else{
							$sectionHighestArr[$childID['project_id']][$sd['section']][$mthCT['yr']][$mthCT['mth']]['totalRain'] = (float) $sd['count_weather_r']; 
						}
	
					}
				}
				
	
				if(isset($ret) && $ret > 0){
					foreach ($ret as $keySection => $valSection) {
						foreach ($valSection as $keyData => $valData) {
							if($keyData == 'overall'){
								if(isset($valData['machinery'])){
									foreach ($valData['machinery'] as $keyYear => $valYear) {
										foreach ($valYear as $keyMonth => $valMonth) {
											$valueToAdd = $valMonth;
											// machinery
											if(isset($ret['overall']['overall']['machinery']['all']['all'])){
												$ret['overall']['overall']['machinery']['all']['all'] = $ret['overall']['overall']['machinery']['all']['all'] + (float) $valueToAdd;
											}else{
												$ret['overall']['overall']['machinery']['all']['all'] = (float) $valueToAdd;
											}
	
											if(isset($ret['overall']['overall']['machinery'][$keyYear]['all'])){
												$ret['overall']['overall']['machinery'][$keyYear]['all'] = $ret['overall']['overall']['machinery'][$keyYear]['all'] + (float) $valueToAdd;
											}else{
												$ret['overall']['overall']['machinery'][$keyYear]['all'] = (float) $valueToAdd;
											}
	
											//--------START CHILD-----------------//
											// machinery
											if(isset($ret[$childID['project_id']]['overall']['machinery']['all']['all'])){
												$ret[$childID['project_id']]['overall']['machinery']['all']['all'] = $ret[$childID['project_id']]['overall']['machinery']['all']['all'] + (float) $valueToAdd;
											}else{
												$ret[$childID['project_id']]['overall']['machinery']['all']['all'] = (float) $valueToAdd;
											}
	
											if(isset($ret[$childID['project_id']]['overall']['machinery'][$keyYear]['all'])){
												$ret[$childID['project_id']]['overall']['machinery'][$keyYear]['all'] = $ret[$childID['project_id']]['overall']['machinery'][$keyYear]['all'] + (float) $valueToAdd;
											}else{
												$ret[$childID['project_id']]['overall']['machinery'][$keyYear]['all'] = (float) $valueToAdd;
											}
	
										}
									}
	
								}
	
								if(isset($valData['worker'])){
									foreach ($valData['worker'] as $keyYear => $valYear) {
										foreach ($valYear as $keyMonth => $valMonth) {
											$valueToAdd = $valMonth;
											// worker
											if(isset($ret['overall']['overall']['worker']['all']['all'])){
												$ret['overall']['overall']['worker']['all']['all'] = $ret['overall']['overall']['worker']['all']['all'] + (float) $valueToAdd;
											}else{
												$ret['overall']['overall']['worker']['all']['all'] = (float) $valueToAdd;
											}
	
											if(isset($ret['overall']['overall']['worker'][$keyYear]['all'])){
												$ret['overall']['overall']['worker'][$keyYear]['all'] = $ret['overall']['overall']['worker'][$keyYear]['all'] + (float) $valueToAdd;
											}else{
												$ret['overall']['overall']['worker'][$keyYear]['all'] = (float) $valueToAdd;
											}
	
											//-----------START CHILD-----------//
											// worker
											if(isset($ret[$childID['project_id']]['overall']['worker']['all']['all'])){
												$ret[$childID['project_id']]['overall']['worker']['all']['all'] = $ret[$childID['project_id']]['overall']['worker']['all']['all'] + (float) $valueToAdd;
											}else{
												$ret[$childID['project_id']]['overall']['worker']['all']['all'] = (float) $valueToAdd;
											}
	
											if(isset($ret[$childID['project_id']]['overall']['worker'][$keyYear]['all'])){
												$ret[$childID['project_id']]['overall']['worker'][$keyYear]['all'] = $ret[$childID['project_id']]['overall']['worker'][$keyYear]['all'] + (float) $valueToAdd;
											}else{
												$ret[$childID['project_id']]['overall']['worker'][$keyYear]['all'] = (float) $valueToAdd;
											}
											//--------------END CHILD--------------//
										}
									}
	
								}
							}
							else{
								if(isset($valData['machinery'])){
									foreach ($valData['machinery'] as $keyYear => $valYear) {
										foreach ($valYear as $keyMonth => $valMonth) {
											$valueToAdd = $valMonth;
											// machinery
											//FOR SECTION
											if(isset($ret['overall'][$keyData]['machinery']['all']['all'])){
												$ret['overall'][$keyData]['machinery']['all']['all'] = $ret['overall'][$keyData]['machinery']['all']['all'] + (float) $valueToAdd;
											}else{
												$ret['overall'][$keyData]['machinery']['all']['all'] = (float) $valueToAdd;
											}
	
											if(isset($ret['overall'][$keyData]['machinery'][$keyYear]['all'])){
												$ret['overall'][$keyData]['machinery'][$keyYear]['all'] = $ret['overall'][$keyData]['machinery'][$keyYear]['all'] + (float) $valueToAdd;
											}else{
												$ret['overall'][$keyData]['machinery'][$keyYear]['all'] = (float) $valueToAdd;
											}
	
											//-----------START CHILD------------------//
											// machinery
											//FOR SECTION
											if(isset($ret[$childID['project_id']][$keyData]['machinery']['all']['all'])){
												$ret[$childID['project_id']][$keyData]['machinery']['all']['all'] = $ret[$childID['project_id']][$keyData]['machinery']['all']['all'] + (float) $valueToAdd;
											}else{
												$ret[$childID['project_id']][$keyData]['machinery']['all']['all'] = (float) $valueToAdd;
											}
	
											if(isset($ret[$childID['project_id']][$keyData]['machinery'][$keyYear]['all'])){
												$ret[$childID['project_id']][$keyData]['machinery'][$keyYear]['all'] = $ret[$childID['project_id']][$keyData]['machinery'][$keyYear]['all'] + (float) $valueToAdd;
											}else{
												$ret[$childID['project_id']][$keyData]['machinery'][$keyYear]['all'] = (float) $valueToAdd;
											}
											//-----------END CHILD-------------//
										}
									}
	
								}
	
								if(isset($valData['worker'])){
									foreach ($valData['worker'] as $keyYear => $valYear) {
										foreach ($valYear as $keyMonth => $valMonth) {
											$valueToAdd = $valMonth;
											// worker
											//FOR SECTION
											if(isset($ret['overall'][$keyData]['worker']['all']['all'])){
												$ret['overall'][$keyData]['worker']['all']['all'] = $ret['overall'][$keyData]['worker']['all']['all'] + (float) $valueToAdd;
											}else{
												$ret['overall'][$keyData]['worker']['all']['all'] = (float) $valueToAdd;
											}
	
											if(isset($ret['overall'][$keyData]['worker'][$keyYear]['all'])){
												$ret['overall'][$keyData]['worker'][$keyYear]['all'] = $ret['overall'][$keyData]['worker'][$keyYear]['all'] + (float) $valueToAdd;
											}else{
												$ret['overall'][$keyData]['worker'][$keyYear]['all'] = (float) $valueToAdd;
											}
	
											//-------------START CHILD------------------//
											// worker
											//FOR SECTION
											if(isset($ret[$childID['project_id']][$keyData]['worker']['all']['all'])){
												$ret[$childID['project_id']][$keyData]['worker']['all']['all'] = $ret[$childID['project_id']][$keyData]['worker']['all']['all'] + (float) $valueToAdd;
											}else{
												$ret[$childID['project_id']][$keyData]['worker']['all']['all'] = (float) $valueToAdd;
											}
	
											if(isset($ret[$childID['project_id']][$keyData]['worker'][$keyYear]['all'])){
												$ret[$childID['project_id']][$keyData]['worker'][$keyYear]['all'] = $ret[$childID['project_id']][$keyData]['worker'][$keyYear]['all'] + (float) $valueToAdd;
											}else{
												$ret[$childID['project_id']][$keyData]['worker'][$keyYear]['all'] = (float) $valueToAdd;
											}
											//--------------END CHILD------------------//
										}
									}
	
								}
							}
								
						}
					}
				}
	
				// for child
				//[section][year][month]['worker']
				$secCount = isset($this->sectionList[$childID['project_id']]) ? count($this->sectionList[$childID['project_id']]) : 0;
				$tmpArr = array();
				if(isset($sectionHighestArr[$childID['project_id']]) && $sectionHighestArr[$childID['project_id']] && $secCount>0){
					$ret[$childID['project_id']]['overall']['weather'] = array();
					foreach ($sectionHighestArr[$childID['project_id']] as $sect => $sectArr) {
						foreach ($sectArr as $year => $yrArr) {
							foreach ($yrArr as $month => $mthArr) {
								//ALL ALL
								// sunny
								if (isset($tmpArr['all']['all']['totalSunny'])) {
									$tmpArr['all']['all']['totalSunny'] = $tmpArr['all']['all']['totalSunny'] + (float) $mthArr['totalSunny'];
								}else{
									$tmpArr['all']['all']['totalSunny'] = (float) $mthArr['totalSunny'];
								}
								$ret[$childID['project_id']]['overall']['weather']['all']['all']['Sunny'] = round($tmpArr['all']['all']['totalSunny']/$secCount, 2);
								// cloudy
								if (isset($tmpArr['all']['all']['totalCloudy'])) {
									$tmpArr['all']['all']['totalCloudy'] = $tmpArr['all']['all']['totalCloudy'] + (float) $mthArr['totalCloudy'];
								}else{
									$tmpArr['all']['all']['totalCloudy'] = (float) $mthArr['totalCloudy'];
								}
								$ret[$childID['project_id']]['overall']['weather']['all']['all']['Cloudy'] = round($tmpArr['all']['all']['totalCloudy']/$secCount, 2);
								// drizzle
								if (isset($tmpArr['all']['all']['totalDrizzle'])) {
									$tmpArr['all']['all']['totalDrizzle'] = $tmpArr['all']['all']['totalDrizzle'] + (float) $mthArr['totalDrizzle'];
								}else{
									$tmpArr['all']['all']['totalDrizzle'] = (float) $mthArr['totalDrizzle'];
								}
								$ret[$childID['project_id']]['overall']['weather']['all']['all']['Drizzle'] = round($tmpArr['all']['all']['totalDrizzle']/$secCount, 2);
								// heavy rain
								if (isset($tmpArr['all']['all']['totalRain'])) {
									$tmpArr['all']['all']['totalRain'] = $tmpArr['all']['all']['totalRain'] + (float) $mthArr['totalRain'];
								}else{
									$tmpArr['all']['all']['totalRain'] = (float) $mthArr['totalRain'];
								}
								$ret[$childID['project_id']]['overall']['weather']['all']['all']['Heavy Rain'] = round($tmpArr['all']['all']['totalRain']/$secCount, 2);
	
								//YEAR ALL
								// sunny
								if (isset($tmpArr[$year]['all']['totalSunny'])) {
									$tmpArr[$year]['all']['totalSunny'] = $tmpArr[$year]['all']['totalSunny'] + (float) $mthArr['totalSunny'];
								}else{
									$tmpArr[$year]['all']['totalSunny'] = (float) $mthArr['totalSunny'];
								}
								$ret[$childID['project_id']]['overall']['weather'][$year]['all']['Sunny'] = round($tmpArr[$year]['all']['totalSunny']/$secCount, 2);
								// cloudy
								if (isset($tmpArr[$year]['all']['totalCloudy'])) {
									$tmpArr[$year]['all']['totalCloudy'] = $tmpArr[$year]['all']['totalCloudy'] + (float) $mthArr['totalCloudy'];
								}else{
									$tmpArr[$year]['all']['totalCloudy'] = (float) $mthArr['totalCloudy'];
								}
								$ret[$childID['project_id']]['overall']['weather'][$year]['all']['Cloudy'] = round($tmpArr[$year]['all']['totalCloudy']/$secCount, 2);
								// drizzle
								if (isset($tmpArr[$year]['all']['totalDrizzle'])) {
									$tmpArr[$year]['all']['totalDrizzle'] = $tmpArr[$year]['all']['totalDrizzle'] + (float) $mthArr['totalDrizzle'];
								}else{
									$tmpArr[$year]['all']['totalDrizzle'] = (float) $mthArr['totalDrizzle'];
								}
								$ret[$childID['project_id']]['overall']['weather'][$year]['all']['Drizzle'] = round($tmpArr[$year]['all']['totalDrizzle']/$secCount, 2);
								// heavy rain
								if (isset($tmpArr[$year]['all']['totalRain'])) {
									$tmpArr[$year]['all']['totalRain'] = $tmpArr[$year]['all']['totalRain'] + (float) $mthArr['totalRain'];
								}else{
									$tmpArr[$year]['all']['totalRain'] = (float) $mthArr['totalRain'];
								}
								$ret[$childID['project_id']]['overall']['weather'][$year]['all']['Heavy Rain'] = round($tmpArr[$year]['all']['totalRain']/$secCount, 2);
	
								// for weather take average
								// sunny
								if (isset($tmpArr[$year][$month]['totalSunny'])) {
									$tmpArr[$year][$month]['totalSunny'] = $tmpArr[$year][$month]['totalSunny'] + (float) $mthArr['totalSunny'];
								}else{
									$tmpArr[$year][$month]['totalSunny'] = (float) $mthArr['totalSunny'];
								}
								$ret[$childID['project_id']]['overall']['weather'][$year][$month]['Sunny'] = round($tmpArr[$year][$month]['totalSunny']/$secCount, 2);
								// cloudy
								if (isset($tmpArr[$year][$month]['totalCloudy'])) {
									$tmpArr[$year][$month]['totalCloudy'] = $tmpArr[$year][$month]['totalCloudy'] + (float) $mthArr['totalCloudy'];
								}else{
									$tmpArr[$year][$month]['totalCloudy'] = (float) $mthArr['totalCloudy'];
								}
								$ret[$childID['project_id']]['overall']['weather'][$year][$month]['Cloudy'] = round($tmpArr[$year][$month]['totalCloudy']/$secCount, 2);
								// drizzle
								if (isset($tmpArr[$year][$month]['totalDrizzle'])) {
									$tmpArr[$year][$month]['totalDrizzle'] = $tmpArr[$year][$month]['totalDrizzle'] + (float) $mthArr['totalDrizzle'];
								}else{
									$tmpArr[$year][$month]['totalDrizzle'] = (float) $mthArr['totalDrizzle'];
								}
								$ret[$childID['project_id']]['overall']['weather'][$year][$month]['Drizzle'] = round($tmpArr[$year][$month]['totalDrizzle']/$secCount, 2);
								// heavy rain
								if (isset($tmpArr[$year][$month]['totalRain'])) {
									$tmpArr[$year][$month]['totalRain'] = $tmpArr[$year][$month]['totalRain'] + (float) $mthArr['totalRain'];
								}else{
									$tmpArr[$year][$month]['totalRain'] = (float) $mthArr['totalRain'];
								}
								$ret[$childID['project_id']]['overall']['weather'][$year][$month]['Heavy Rain'] = round($tmpArr[$year][$month]['totalRain']/$secCount, 2);
	
							}
						}
					}
				}
			}
		}
 

		return $ret;
	}

	function id_compare($a, $b)
	{
	    $t1 = $a['contract_id'];
	    $t2 = $b['contract_id'];
	    return $t1 - $t2;
	}    

	function formatDate($date){
		return ($date) ? date('d-m-Y', strtotime($date)) : $date;
	}

	// calculate overall only based on latest contract
	function resContractInfoOverall(&$res, $id){
		$contractSumArr = array();
		/*
			For overall on cost dashboard
			contract_no (Contract no) - blank
			completion_date (Original Completion Date) - latest
			loa_date (Commencement Date) - earliest
			extension_of_time (Extension of Time) - blank
			revised_completion_date (Revised Completion) - latest

			total_subcontractor_amount (Sub-Contract Value) - summation
			original_amount - summation
			new_amount - summation
			total_vo_amount_completed - summation
			total_claim_vo_and_claim - summation
			cumulative_payment_received - summation
			cumulative_certified_amount - summation

			// extra for time dashboard
			site_possession_date (Site Possession Date) - earliest

			31/1/2023, Change requested by Sofia
			if there is no section:
			contract_no (Contract no) - latest
			extension_of_time (Extension of Time) - latest
		*/
		$res[$id]['sum'] = $contractSumArr;

		if(isset($this->contractSections[$id])){

			$contractSumArr['extension_of_time'] = ''; // blank
			$contractSumArr['contract_no'] = ''; // blank
			$contractSumArr['total_subcontractor_amount'] = 0.00;
			$contractSumArr['contract_ids'] = ''; // blank

			$section_contract_ids = [];
			foreach ($this->contractSections[$id] as $section => $contract) {
				
				//Hazirah & Maheswari comment as it will skip the contract that doesnt have section
				// if(isset($this->sectionList[$id]) && count($this->sectionList[$id]) > 1 && $section == '') continue;

				// earliest
				$earliestArr = ['loa_date_kacc', 'site_possession_date', 'loa_date'];
				foreach ($earliestArr as $field) {
					if(!isset($contractSumArr[$field]) || $contractSumArr[$field] == ''){
						$contractSumArr[$field] = $contract[$field];
					}else{
						if($contractSumArr[$field] != '' && $contract[$field] != ''){
							$contractSumArr[$field] = strtotime($contract[$field]) < strtotime($contractSumArr[$field]) ? $contract[$field] : $contractSumArr[$field];
						}
					}
				}

				//latest
				$latestArr = ['completion_date', 'revised_completion_date'];
				foreach ($latestArr as $field2) {
					if(!isset($contractSumArr[$field2]) || $contractSumArr[$field2] == ''){
						$contractSumArr[$field2] = $contract[$field2];
					}else{
						if($contractSumArr[$field2] != '' && $contract[$field2] != ''){
							$contractSumArr[$field2] = strtotime($contract[$field2]) > strtotime($contractSumArr[$field2]) ? $contract[$field2] : $contractSumArr[$field2];
						}
					}
				}

				// new duration - revised completion date
				if(!isset($contractSumArr['new_duration'])) {
					$contractSumArr['new_duration'] = '';
				}
				if($contractSumArr['revised_completion_date'] != '' && $contractSumArr['site_possession_date'] != ''){
					$contractSumArr['new_duration'] = round((strtotime($contractSumArr['revised_completion_date']) - strtotime($contractSumArr['site_possession_date']))/(60 * 60 * 24)); 
				}
				if($section == ''){
					$contractSumArr['extension_of_time'] = $contract['extension_of_time'];
					$contractSumArr['contract_no'] = $contract['contract_no'];
				}

				$contractSumArr['total_subcontractor_amount'] = (float) $contractSumArr['total_subcontractor_amount'] + (float) $contract['total_subcontractor_amount'];
				$contractSumArr['original_amount'] = isset($contractSumArr['original_amount']) ? $contractSumArr['original_amount'] + (double) $contract['original_amount'] : (double) $contract['original_amount'];
				$contractSumArr['new_amount'] = isset($contractSumArr['new_amount']) ? $contractSumArr['new_amount'] + (double) $contract['new_amount'] : (double) $contract['new_amount'];
				$contractSumArr['total_vo_amount_completed'] = isset($contractSumArr['total_vo_amount_completed']) ? $contractSumArr['total_vo_amount_completed'] + (double) $contract['total_vo_amount_completed'] : (double) $contract['total_vo_amount_completed'];
				$contractSumArr['total_claim_vo_and_claim'] = isset($contractSumArr['total_claim_vo_and_claim']) ? $contractSumArr['total_claim_vo_and_claim'] + (double) $contract['total_claim_vo_and_claim'] : (double) $contract['total_claim_vo_and_claim'];
				$contractSumArr['cumulative_payment_received'] = isset($contractSumArr['cumulative_payment_received']) ? $contractSumArr['cumulative_payment_received'] + (double) $contract['cumulative_payment_received'] : (double) $contract['cumulative_payment_received'];
				$contractSumArr['cumulative_certified_amount'] = isset($contractSumArr['cumulative_certified_amount']) ? $contractSumArr['cumulative_certified_amount'] + (double) $contract['cumulative_certified_amount'] : (double) $contract['cumulative_certified_amount'];
				$section_contract_ids[] = (int) $contract['contract_id'];
				$contractSumArr['contract_ids'] = $section_contract_ids;

				$res[$id]['sum'] = $contractSumArr;
			}
		}
		return;
	}

	// will return latest for each contract
	function resContractInfo($contract, &$res, $id){
		$contract['revised_completion_date'] = $this->formatDate($contract['revised_completion_date']);
		$contract['loa_date_kacc'] = $this->formatDate($contract['loa_date_kacc']);
		$contract['loa_date'] = $this->formatDate($contract['loa_date']);
		$contract['site_possession_date'] = $this->formatDate($contract['site_possession_date']);
		if($contract['completion_date']){
			$contract['completion_date'] = DateTime::createFromFormat('d/m/Y', $contract['completion_date'])->format('d-m-Y');
		}

		// if want to use calculation instead of using from the field
		if($contract['revised_completion_date'] != '' && $contract['site_possession_date'] != ''){
			$contract['new_duration'] = round((strtotime($contract['revised_completion_date']) - strtotime($contract['site_possession_date']))/(60 * 60 * 24)); 
		}

		$contract['total_subcontractor_amount'] = ($contract['total_subcontractor_amount']) ? (float) $contract['total_subcontractor_amount'] : 0;
		$res[$id][$contract['section']] = $contract;
		$this->contractSections[$id][$contract['section']] = $contract;
		// overall is for latest but sum is summary for COST 
		$res[$id]['overall'] = $contract;
	}

	function getContractInfo(){
		$res = array();
		$this->contractInfoRaw = array();
		
		if ($this->isWPC) {
			// $url = $this->jogetLinkObj->jogetAppLink['api']['finance_dash_contract'].$this->projectID;
			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_contract", array($this->projectID, ''));
			$resContract =  $this->jogetCURL($url);
			if (isset($resContract['data'])) {
				$tempArr = $resContract['data'];
				$dataArr = array();
				foreach ($tempArr as $val) {
					if ($val['archive'] != 'true') {
						$dataArr[] = $val;
					}
				}
				usort($dataArr, array($this, 'id_compare'));
				
				// $this->contractInfoRaw = array_merge($dataArr, $this->contractInfoRaw);
				foreach ($dataArr as $key => $contract) {
					$this->resContractInfo($contract, $res, 'overall');
				}
				
				// loop again for overall [again]
				$this->resContractInfoOverall($res, 'overall');
			}
		}else{
			// foreach ($this->childProjectInfo as $childID) {
			// 	// if($childID['project_id'] == $_SESSION['projectID']){
			// 		$childID = $childID['project_id'];
			// 		$resDocURL = $this->jogetLinkObj->getLink('finance_dash_contract', array($childID, ''));
			// 		$resDocs[$childID] = $this->jogetCURL($resDocURL);
			// 	// }
			// }

			$url = $this->jogetLinkObj->getLink('finance_dash_contract', array('', $this->projectID));
			$resContractData = $this->jogetCURL($url);
			if (isset($resContractData['data'])) {
				$dataArr = $resContractData['data'];
				usort($dataArr, array($this, 'id_compare'));

				foreach ($this->childProjectInfo as $childID) {

					// $this->contractInfoRaw = array_merge($dataArr, $this->contractInfoRaw);
					foreach ($dataArr as $key => $contract) {
						if($contract['project_id'] != $childID['project_id']) continue;
						
						$this->resContractInfo($contract, $res, 'overall');
						$this->resContractInfo($contract, $res, $childID['project_id']);

					}
					$this->resContractInfoOverall($res, $childID['project_id']);

				}
			}
		}
		return $res;
	}

	function getMonthlyAttchment(){
		$ret = array();
		if ($this->isWPC) {
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_MAU", array($this->projectID));
			$res = $this->jogetCURL($url);
			// $this->db->dbug($res,1);
			if (isset($res['data'])) {
				foreach ($res['data'] as $key => $attch) {
					$ret['overall']['overall'][$attch['year']][$attch['month']] = $this->jogetLinkObj->jogetAppLink['form']['construct_view_MAU'].$attch['id'];
				}
			}
		}else{
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_MAU", array('',$this->parentProjectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				foreach ($res['data'] as $key => $attch) {
					$ret[$attch['package_id']]['overall'][$attch['year']][$attch['month']] = $this->jogetLinkObj->jogetAppLink['form']['construct_view_MAU'].$attch['id'];
				}
			}
		}
		return $ret;
	}

	function getTimeInfo(){
		// check until which date to show based on current timestamp
		// need to add next month as well as current implementation is different
		$this->sectionList = $this->getSectionList();
		$siteDiary = $this->getSideDiaryData(date('Y', strtotime('+1 month')), date('m', strtotime('+1 month')));
		$monthlyAttchment =  $this->getMonthlyAttchment();
		$this->sCurveData = $this->getProjectSummaryInfo();

		$this->contractInfo = $this->getContractInfo();
		
		$tempProjInfoArr = array();
		foreach ($this->childProjectInfo as $childArr) {
			$childArr['cut_off_day'] = ($childArr['cut_off_day']) ? $childArr['cut_off_day'] : "25";
			$tempProjInfoAr[$childArr['project_id']] = $childArr;
		}
		$tempProjInfoAr['overall'] = $this->projectInfo;

		$ret = array(
			'progressSummaryData' => $this->sCurveData,
			'sectionList' => $this->sectionList,
			'sideDiary' => $siteDiary,
			'contractInfo' => $this->contractInfo,
			'projInfo' => $tempProjInfoAr,
			'packageCutOffDay' => $this->packageCutOffArr,
			'monthlyAttachment' => $monthlyAttchment
		);
		return $ret;
	}

	function processClaimAndPaymentInfo(){
		$ret = array();
		$monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		if($this->isWPC){
			if(!isset($this->monthClaimAndPaymentInfo['overall']['overall'])) return;
			$mthCPInfoArr = $this->monthClaimAndPaymentInfo['overall']['overall'];
			$firstMthYr = key($mthCPInfoArr);
			if(!$firstMthYr) return;
			$firstYr = date('Y', strtotime($firstMthYr));

			$projEndYear = date("Y",strtotime($this->projectInfo['end_date']));

			$pCumul = 0;
			$cCumul = 0;
			$contract_id = '';
			for ($yr=$firstYr; $yr < $projEndYear; $yr++) { 
				foreach ($monthArr as $mth) {
					if(isset($mthCPInfoArr[$mth.'-'.$yr]['payment'])){
						$p = (float) $mthCPInfoArr[$mth.'-'.$yr]['payment'];
						$pCumul = $p;
					}
					if(isset($mthCPInfoArr[$mth.'-'.$yr]['claim'])){
						$c = (float) $mthCPInfoArr[$mth.'-'.$yr]['claim'];
						$cCumul = $c;
					}

					$ret['overall']['overall'][$yr][$mth]['payment'] = $pCumul;
					$ret['overall']['overall'][$yr][$mth]['claim'] = $cCumul;

					$ret['overall']['overall'][$yr]['all']['payment'] = $pCumul;
					$ret['overall']['overall'][$yr]['all']['claim'] = $cCumul;

					$ret['overall']['overall']['all']['all']['payment'] = $pCumul;
					$ret['overall']['overall']['all']['all']['claim'] = $cCumul;

					$contract_id = isset($mthCPInfoArr[$mth.'-'.$yr]['contract_id']) ? $mthCPInfoArr[$mth.'-'.$yr]['contract_id'] : $contract_id;
					
					$ret['overall']['overall'][$yr][$mth]['contract_id'] = $contract_id;
					$ret['overall']['overall'][$yr]['all']['contract_id'] = $contract_id;
					$ret['overall']['overall']['all']['all']['contract_id'] = $contract_id;
				}
			}
		}else {
			foreach ($this->childProjectInfo as $childID) {
				if(!isset($this->monthClaimAndPaymentInfo[$childID['project_id']]['overall'])) continue;
				$mthCPInfoArr = $this->monthClaimAndPaymentInfo[$childID['project_id']]['overall'];
				$firstMthYr = key($mthCPInfoArr);
				if(!$firstMthYr) return;
				$firstYr = date('Y', strtotime($firstMthYr));

				$projEndYear = date("Y",strtotime($childID['end_date']));

				$pCumul = 0;
				$cCumul = 0;
				$contract_id = '';
				for ($yr=$firstYr; $yr < $projEndYear; $yr++) { 
					foreach ($monthArr as $mth) {
						if(isset($mthCPInfoArr[$mth.'-'.$yr]['payment'])){
							$p = (float) $mthCPInfoArr[$mth.'-'.$yr]['payment'];
							$pCumul = $p;
						}
						if(isset($mthCPInfoArr[$mth.'-'.$yr]['claim'])){
							$c = (float) $mthCPInfoArr[$mth.'-'.$yr]['claim'];
							$cCumul = $c;
						}

						$ret[$childID['project_id']]['overall'][$yr][$mth]['payment'] = $pCumul;
						$ret[$childID['project_id']]['overall'][$yr][$mth]['claim'] = $cCumul;
	
						$ret[$childID['project_id']]['overall'][$yr]['all']['payment'] = $pCumul;
						$ret[$childID['project_id']]['overall'][$yr]['all']['claim'] = $cCumul;
	
						$ret[$childID['project_id']]['overall']['all']['all']['payment'] = $pCumul;
						$ret[$childID['project_id']]['overall']['all']['all']['claim'] = $cCumul;

						$contract_id = isset($mthCPInfoArr[$mth.'-'.$yr]['contract_id']) ? $mthCPInfoArr[$mth.'-'.$yr]['contract_id'] : $contract_id;

						$ret[$childID['project_id']]['overall'][$yr][$mth]['contract_id'] = $contract_id;
						$ret[$childID['project_id']]['overall'][$yr]['all']['contract_id'] = $contract_id;
						$ret[$childID['project_id']]['overall']['all']['all']['contract_id'] = $contract_id;
					}
				}			
			}
		}
		return $ret;
	}
	function getSummaryInfo (){
		// Progress and Cost
		$this->sCurveData = $this->getProjectSummaryInfo();

		$this->contractInfo = $this->getContractInfo();
		
		// if got contract id then check the claim related
		if ($this->contractInfo) {
			$this->getClaimInfo();
		}

		// Document
		$corrInfo = $this->getCorrInfo_opt();

		// Quality
		$incidentInfo = $this->getIncidentInfo();
		$ncrInfo = $this->getNcrInfo();
		$overallManHoursInfo = $this->getOverallManHoursData();

		$ret = array(
			'progressSummaryData' => $this->sCurveData,
			'contractInfo' => $this->contractInfo,
			'paymentAndClaim' => $this->monthClaimAndPaymentInfo,
			'paymentAndClaimByMthYr' => $this->processClaimAndPaymentInfo(),
			'document' => array(
				'corr' => $corrInfo
			),
			'quality' => array(
				'incident' => $incidentInfo,
				'ncr' => $ncrInfo,
				'overallManHours' => $overallManHoursInfo,
				'ms' => $this->getMSData(),
				'ma' => $this->getMAData()
			),
			'packageCutOffDay' => $this->packageCutOffArr
		);
		return $ret;
	}

	function getMSData(){
		$ret = array();
		if ($this->isWPC) {
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_MS", array($this->projectID, $this->parentProjectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_submitted']);
				    $t2 = strtotime($b['date_submitted']);
				    return $t1 - $t2;
				});
				foreach ($res['data'] as $ms) {
					$dateCreated = strtotime($ms['date_submitted']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);

					if (isset($ret['overall']['all']['all']['card']['total']['cumulative'])) {
						$ret['overall']['all']['all']['card']['total']['cumulative']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['total']['submitted'])) {
						$ret['overall']['all']['all']['card']['total']['submitted']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['byStatus'][$ms['approval_status']])) {
						$ret['overall']['all']['all']['card']['byStatus'][$ms['approval_status']]++;
					}else{
						$ret['overall']['all']['all']['card']['byStatus'][$ms['approval_status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ms['approval_status']])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ms['approval_status']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ms['approval_status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ms['approval_status']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ms['approval_status']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ms['approval_status']] = 1;
					}
					
					// purely by approval_status - closed/ pending
					$status = ($ms['approval_status'] == 'Close') ? 'Closed' : 'Pending';
					if (isset($ret['overall']['all']['all']['onCutOff']['byStatus'][$status])) {
						$ret['overall']['all']['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall']['all']['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status])) {
						$ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status] = 1;
					}
				}
				if($res['data']){
					$minDate = strtotime($res['data'][0]['date_submitted']);
					$maxDate = strtotime(end($res['data'])['date_submitted']);
					$now = time();
					if($maxDate > $now){
						$maxYear = date("Y", $maxDate);
					}
					else{
						$maxYear = date("Y", $now);
					}
					$minYear = date("Y", $minDate);
					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"01","2"=>"02","3"=>"03","4"=>"04","5"=>"05","6"=>"06","7"=>"07","8"=>"08","9"=>"09","10"=>"10","11"=>"11","12"=>"12");

					$valMthData = 0;

					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						foreach ($monthHalftext as $key => $mthval) {
							if (isset($ret['overall'][$nYr][$mthval]['card']['total']['cumul'])) {
								$valMthData = $valMthData + $ret['overall'][$nYr][$mthval]['card']['total']['cumul'];
							}
							$ret['overall'][$nYr][$mthval]['card']['total']['cumulative'] = $valMthData;
							$ret['overall'][$nYr]['all']['card']['total']['cumulative'] = $valMthData;
						}
					}
				}
			}
		}else{
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_MS", array('', $this->parentProjectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_submitted']);
				    $t2 = strtotime($b['date_submitted']);
				    return $t1 - $t2;
				});
				foreach ($res['data'] as $ms) {
					$dateCreated = strtotime($ms['date_submitted']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);

					if (isset($ret['overall']['all']['all']['card']['total']['cumulative'])) {
						$ret['overall']['all']['all']['card']['total']['cumulative']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['total']['submitted'])) {
						$ret['overall']['all']['all']['card']['total']['submitted']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['byStatus'][$ms['approval_status']])) {
						$ret['overall']['all']['all']['card']['byStatus'][$ms['approval_status']]++;
					}else{
						$ret['overall']['all']['all']['card']['byStatus'][$ms['approval_status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ms['approval_status']])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ms['approval_status']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ms['approval_status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ms['approval_status']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ms['approval_status']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ms['approval_status']] = 1;
					}
					
					// purely by approval_status - closed/ pending
					$status = ($ms['approval_status'] == 'Close') ? 'Closed' : 'Pending';
					if (isset($ret['overall']['all']['all']['onCutOff']['byStatus'][$status])) {
						$ret['overall']['all']['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall']['all']['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status])) {
						$ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status] = 1;
					}

					//----------START CHILD--------//
					if (isset($ret[$ms['package_id']]['all']['all']['card']['total']['cumulative'])) {
						$ret[$ms['package_id']]['all']['all']['card']['total']['cumulative']++;
					}else{
						$ret[$ms['package_id']]['all']['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret[$ms['package_id']][$mthCT['yr']]['all']['card']['total']['cumulative'])) {
						$ret[$ms['package_id']][$mthCT['yr']]['all']['card']['total']['cumulative']++;
					}else{
						$ret[$ms['package_id']][$mthCT['yr']]['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'])) {
						$ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul']++;
					}else{
						$ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'] = 1;
					}

					if (isset($ret[$ms['package_id']]['all']['all']['card']['total']['submitted'])) {
						$ret[$ms['package_id']]['all']['all']['card']['total']['submitted']++;
					}else{
						$ret[$ms['package_id']]['all']['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret[$ms['package_id']][$mthCT['yr']]['all']['card']['total']['submitted'])) {
						$ret[$ms['package_id']][$mthCT['yr']]['all']['card']['total']['submitted']++;
					}else{
						$ret[$ms['package_id']][$mthCT['yr']]['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'])) {
						$ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted']++;
					}else{
						$ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'] = 1;
					}

					if (isset($ret[$ms['package_id']]['all']['all']['card']['byStatus'][$ms['approval_status']])) {
						$ret[$ms['package_id']]['all']['all']['card']['byStatus'][$ms['approval_status']]++;
					}else{
						$ret[$ms['package_id']]['all']['all']['card']['byStatus'][$ms['approval_status']] = 1;
					}
					if (isset($ret[$ms['package_id']][$mthCT['yr']]['all']['card']['byStatus'][$ms['approval_status']])) {
						$ret[$ms['package_id']][$mthCT['yr']]['all']['card']['byStatus'][$ms['approval_status']]++;
					}else{
						$ret[$ms['package_id']][$mthCT['yr']]['all']['card']['byStatus'][$ms['approval_status']] = 1;
					}
					if (isset($ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ms['approval_status']])) {
						$ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ms['approval_status']]++;
					}else{
						$ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ms['approval_status']] = 1;
					}
					
					// purely by approval_status - closed/ pending
					$status = ($ms['approval_status'] == 'Close') ? 'Closed' : 'Pending';
					if (isset($ret[$ms['package_id']]['all']['all']['onCutOff']['byStatus'][$status])) {
						$ret[$ms['package_id']]['all']['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret[$ms['package_id']]['all']['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret[$ms['package_id']][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status])) {
						$ret[$ms['package_id']][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret[$ms['package_id']][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status])) {
						$ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status]++;
					}else{
						$ret[$ms['package_id']][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status] = 1;
					}
					//------------END CHILD------------//
				}

				foreach ($this->childProjectInfo as $childID) {
					if($res['data']){
						$minDate = strtotime($res['data'][0]['date_submitted']);
						$maxDate = strtotime(end($res['data'])['date_submitted']);
						$now = time();
						if($maxDate > $now){
							$maxYear = date("Y", $maxDate);
						}
						else{
							$maxYear = date("Y", $now);
						}
						$minYear = date("Y", $minDate);
						$yDiff = $maxYear - $minYear;
						$yr = $minYear;
						$monthHalftext = array("1"=>"01","2"=>"02","3"=>"03","4"=>"04","5"=>"05","6"=>"06","7"=>"07","8"=>"08","9"=>"09","10"=>"10","11"=>"11","12"=>"12");
	
						$valMthData = 0;
						$valMthDataChild = 0;
						$valYrData = 0;
						for ($i=0; $i < $yDiff+1 ; $i++) {
							$nYr = $yr++; 
							foreach ($monthHalftext as $key => $mthval) {
								if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['total']['cumul'])) {
									$valMthDataChild = $valMthDataChild + $ret[$childID['project_id']][$nYr][$mthval]['card']['total']['cumul'];
								}
								$ret[$childID['project_id']][$nYr][$mthval]['card']['total']['cumulative'] = $valMthDataChild;
	
								if (isset($ret['overall'][$nYr][$mthval]['card']['total']['cumulative'])) {
									$ret['overall'][$nYr][$mthval]['card']['total']['cumulative'] = $ret['overall'][$nYr][$mthval]['card']['total']['cumulative'] + $valMthDataChild;
								}else{
									$ret['overall'][$nYr][$mthval]['card']['total']['cumulative'] = $valMthDataChild;
								}
							}
							if (isset($ret['overall'][$nYr]['all']['card']['total']['cumulative'])) {
								$valYrData = $valYrData + $ret['overall'][$nYr]['all']['card']['total']['cumulative'];
							}
							$ret['overall'][$nYr]['all']['card']['total']['cumulative'] = $valYrData;
						}
					}				
				}

			}
		}
		return $ret;
	}

	function getMAData(){
		$ret = array();
		if ($this->isWPC) {
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_MT", array($this->projectID, $this->parentProjectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_submission']);
				    $t2 = strtotime($b['date_submission']);
				    return $t1 - $t2;
				});
				foreach ($res['data'] as $ma) {
					$dateCreated = strtotime($ma['date_submission']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);

					if (isset($ret['overall']['all']['all']['card']['total']['cumulative'])) {
						$ret['overall']['all']['all']['card']['total']['cumulative']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['total']['submitted'])) {
						$ret['overall']['all']['all']['card']['total']['submitted']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['byStatus'][$ma['approval_status']])) {
						$ret['overall']['all']['all']['card']['byStatus'][$ma['approval_status']]++;
					}else{
						$ret['overall']['all']['all']['card']['byStatus'][$ma['approval_status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ma['approval_status']])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ma['approval_status']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ma['approval_status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ma['approval_status']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ma['approval_status']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ma['approval_status']] = 1;
					}
					
					// purely by approval_status - closed/ pending
					$status = ($ma['approval_status'] == 'Close') ? 'Closed' : 'Pending';
					if (isset($ret['overall']['all']['all']['onCutOff']['byStatus'][$status])) {
						$ret['overall']['all']['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall']['all']['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status])) {
						$ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status] = 1;
					}
				}

				if($res['data']){
					$minDate = strtotime($res['data'][0]['date_submission']);
					$maxDate = strtotime(end($res['data'])['date_submission']);
					$now = time();
					if($maxDate > $now){
						$maxYear = date("Y", $maxDate);
					}
					else{
						$maxYear = date("Y", $now);
					}
					$minYear = date("Y", $minDate);
					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"01","2"=>"02","3"=>"03","4"=>"04","5"=>"05","6"=>"06","7"=>"07","8"=>"08","9"=>"09","10"=>"10","11"=>"11","12"=>"12");

					$valMthData = 0;

					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						foreach ($monthHalftext as $key => $mthval) {
							if (isset($ret['overall'][$nYr][$mthval]['card']['total']['cumul'])) {
								$valMthData = $valMthData + $ret['overall'][$nYr][$mthval]['card']['total']['cumul'];
							}
							$ret['overall'][$nYr][$mthval]['card']['total']['cumulative'] = $valMthData;
							$ret['overall'][$nYr]['all']['card']['total']['cumulative'] = $valMthData;
						}
					}
				}
			}
		}else {
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_MT", array('', $this->parentProjectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_submission']);
				    $t2 = strtotime($b['date_submission']);
				    return $t1 - $t2;
				});
				foreach ($res['data'] as $ma) {
					$dateCreated = strtotime($ma['date_submission']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);

					if (isset($ret['overall']['all']['all']['card']['total']['cumulative'])) {
						$ret['overall']['all']['all']['card']['total']['cumulative']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['total']['submitted'])) {
						$ret['overall']['all']['all']['card']['total']['submitted']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['byStatus'][$ma['approval_status']])) {
						$ret['overall']['all']['all']['card']['byStatus'][$ma['approval_status']]++;
					}else{
						$ret['overall']['all']['all']['card']['byStatus'][$ma['approval_status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ma['approval_status']])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ma['approval_status']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$ma['approval_status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ma['approval_status']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ma['approval_status']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ma['approval_status']] = 1;
					}
					
					// purely by approval_status - closed/ pending
					$status = ($ma['approval_status'] == 'Close') ? 'Closed' : 'Pending';
					if (isset($ret['overall']['all']['all']['onCutOff']['byStatus'][$status])) {
						$ret['overall']['all']['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall']['all']['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status])) {
						$ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status] = 1;
					}

					//---------START CHILD----------//
					if (isset($ret[$ma['package_id']]['all']['all']['card']['total']['cumulative'])) {
						$ret[$ma['package_id']]['all']['all']['card']['total']['cumulative']++;
					}else{
						$ret[$ma['package_id']]['all']['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret[$ma['package_id']][$mthCT['yr']]['all']['card']['total']['cumulative'])) {
						$ret[$ma['package_id']][$mthCT['yr']]['all']['card']['total']['cumulative']++;
					}else{
						$ret[$ma['package_id']][$mthCT['yr']]['all']['card']['total']['cumulative'] = 1;
					}
					if (isset($ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'])) {
						$ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul']++;
					}else{
						$ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['cumul'] = 1;
					}

					if (isset($ret[$ma['package_id']]['all']['all']['card']['total']['submitted'])) {
						$ret[$ma['package_id']]['all']['all']['card']['total']['submitted']++;
					}else{
						$ret[$ma['package_id']]['all']['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret[$ma['package_id']][$mthCT['yr']]['all']['card']['total']['submitted'])) {
						$ret[$ma['package_id']][$mthCT['yr']]['all']['card']['total']['submitted']++;
					}else{
						$ret[$ma['package_id']][$mthCT['yr']]['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'])) {
						$ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted']++;
					}else{
						$ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'] = 1;
					}

					if (isset($ret[$ma['package_id']]['all']['all']['card']['byStatus'][$ma['approval_status']])) {
						$ret[$ma['package_id']]['all']['all']['card']['byStatus'][$ma['approval_status']]++;
					}else{
						$ret[$ma['package_id']]['all']['all']['card']['byStatus'][$ma['approval_status']] = 1;
					}
					if (isset($ret[$ma['package_id']][$mthCT['yr']]['all']['card']['byStatus'][$ma['approval_status']])) {
						$ret[$ma['package_id']][$mthCT['yr']]['all']['card']['byStatus'][$ma['approval_status']]++;
					}else{
						$ret[$ma['package_id']][$mthCT['yr']]['all']['card']['byStatus'][$ma['approval_status']] = 1;
					}
					if (isset($ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ma['approval_status']])) {
						$ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ma['approval_status']]++;
					}else{
						$ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$ma['approval_status']] = 1;
					}
					
					// purely by approval_status - closed/ pending
					$status = ($ma['approval_status'] == 'Close') ? 'Closed' : 'Pending';
					if (isset($ret[$ma['package_id']]['all']['all']['onCutOff']['byStatus'][$status])) {
						$ret[$ma['package_id']]['all']['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret[$ma['package_id']]['all']['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret[$ma['package_id']][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status])) {
						$ret[$ma['package_id']][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status]++;
					}else{
						$ret[$ma['package_id']][$mthCT['yr']]['all']['onCutOff']['byStatus'][$status] = 1;
					}
					if (isset($ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status])) {
						$ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status]++;
					}else{
						$ret[$ma['package_id']][$mthCT['yr']][$mthCT['mth']]['onCutOff']['byStatus'][$status] = 1;
					}
					//---------END CHILD--------//
				}
				foreach ($this->childProjectInfo as $childID) {
					$minDate = strtotime($res['data'][0]['date_submission']);
					$maxDate = strtotime(end($res['data'])['date_submission']);
					$now = time();
					if($maxDate > $now){
						$maxYear = date("Y", $maxDate);
					}
					else{
						$maxYear = date("Y", $now);
					}
					$minYear = date("Y", $minDate);
					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"01","2"=>"02","3"=>"03","4"=>"04","5"=>"05","6"=>"06","7"=>"07","8"=>"08","9"=>"09","10"=>"10","11"=>"11","12"=>"12");

					$valMthData = 0;
					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						foreach ($monthHalftext as $key => $mthval) {
							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['total']['cumul'])) {
								$valMthData = $valMthData + $ret[$childID['project_id']][$nYr][$mthval]['card']['total']['cumul'];
							}
							$ret[$childID['project_id']][$nYr][$mthval]['card']['total']['cumulative'] = $valMthData;
							$ret[$childID['project_id']][$nYr]['all']['card']['total']['cumulative'] = $valMthData;

							// overall based on child
							if (isset($ret['overall'][$nYr][$mthval]['card']['total']['cumulative'])) {
								$ret['overall'][$nYr][$mthval]['card']['total']['cumulative'] = $ret['overall'][$nYr][$mthval]['card']['total']['cumulative'] + $valMthData;
							}else {
								$ret['overall'][$nYr][$mthval]['card']['total']['cumulative'] = $valMthData;
							}

							if (isset($ret['overall'][$nYr]['all']['card']['total']['cumulative'])) {
								$ret['overall'][$nYr]['all']['card']['total']['cumulative'] = $ret['overall'][$nYr]['all']['card']['total']['cumulative'] + $valMthData;
							}else {
								$ret['overall'][$nYr]['all']['card']['total']['cumulative'] = $valMthData;
							}
						}
					}
				}
			}
		}
		return $ret;
	}

	function getWIRData() {
		$ret = array();
		if ($this->isWPC) {
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_WIR", array($this->projectID, $this->parentProjectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				foreach ($res['data'] as $wir) {
					$dateCreated = strtotime($wir['submitted_date']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);

					if (isset($ret['overall']['all']['all']['card']['total']['submitted'])) {
						$ret['overall']['all']['all']['card']['total']['submitted']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['byStatus'][$wir['status']])) {
						$ret['overall']['all']['all']['card']['byStatus'][$wir['status']]++;
					}else{
						$ret['overall']['all']['all']['card']['byStatus'][$wir['status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$wir['status']])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$wir['status']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$wir['status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$wir['status']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$wir['status']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$wir['status']] = 1;
					}
				}

			}
		}else{
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_WIR", array('', $this->parentProjectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				foreach ($res['data'] as $wir) {
					$dateCreated = strtotime($wir['submitted_date']);
					$mthCT['yr'] = date("Y", $dateCreated);
					$mthCT['mth']= date("m", $dateCreated);
					
					if (isset($ret['overall']['all']['all']['card']['total']['submitted'])) {
						$ret['overall']['all']['all']['card']['total']['submitted']++;
					}else{
						$ret['overall']['all']['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['byStatus'][$wir['status']])) {
						$ret['overall']['all']['all']['card']['byStatus'][$wir['status']]++;
					}else{
						$ret['overall']['all']['all']['card']['byStatus'][$wir['status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$wir['status']])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$wir['status']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['byStatus'][$wir['status']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$wir['status']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$wir['status']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$wir['status']] = 1;
					}

					// for project
					if (isset($ret[$wir['package_id']]['all']['all']['card']['total']['submitted'])) {
						$ret[$wir['package_id']]['all']['all']['card']['total']['submitted']++;
					}else{
						$ret[$wir['package_id']]['all']['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret[$wir['package_id']][$mthCT['yr']]['all']['card']['total']['submitted'])) {
						$ret[$wir['package_id']][$mthCT['yr']]['all']['card']['total']['submitted']++;
					}else{
						$ret[$wir['package_id']][$mthCT['yr']]['all']['card']['total']['submitted'] = 1;
					}
					if (isset($ret[$wir['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'])) {
						$ret[$wir['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted']++;
					}else{
						$ret[$wir['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']['submitted'] = 1;
					}

					if (isset($ret[$wir['package_id']]['all']['all']['card']['byStatus'][$wir['status']])) {
						$ret[$wir['package_id']]['all']['all']['card']['byStatus'][$wir['status']]++;
					}else{
						$ret[$wir['package_id']]['all']['all']['card']['byStatus'][$wir['status']] = 1;
					}
					if (isset($ret[$wir['package_id']][$mthCT['yr']]['all']['card']['byStatus'][$wir['status']])) {
						$ret[$wir['package_id']][$mthCT['yr']]['all']['card']['byStatus'][$wir['status']]++;
					}else{
						$ret[$wir['package_id']][$mthCT['yr']]['all']['card']['byStatus'][$wir['status']] = 1;
					}
					if (isset($ret[$wir['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$wir['status']])) {
						$ret[$wir['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$wir['status']]++;
					}else{
						$ret[$wir['package_id']][$mthCT['yr']][$mthCT['mth']]['card']['byStatus'][$wir['status']] = 1;
					}
				}
			}	
		}
		return $ret;
	}

	function getQaqcInfo(){
		// ms, mt, wir, ncr
		$ret = array(
			'ms' => $this->getMSData(),
			'ma' => $this->getMAData(),
			'wir' => $this->getWIRData(),
			'ncr' => $this->getNcrInfo()
		);
		return $ret;
	}

}
