<?php 
/**
 * 
 */
class RiDashboardUTSB extends RiDashboard
{
	var $extendClassPath = 'V3/OBYU/extend/dashboard_UTSB/';

	function __construct($dash = false, $ajax = false)
	{
		parent::__construct($dash, $ajax);
	}

	function loadJS(){
		$linkJSPre = ($_SESSION['ui_pref'] == "ri_v3") ? "../../../../../" : "../";

		echo '
			<script src="'.$this->pathRel.'../../JS/JsLibrary/jquery-3.5.1.js"></script>
			<script src="../../JS/dashboard.js"></script>
			<script src="'.$linkJSPre.'JS/highchart/v11/highcharts.js"></script>
			'.((isset($_SESSION['ui_pref']) && $_SESSION['ui_pref'] == 'ri_v3') ? '<script src="../../../../../JS/v3.js"></script>' : '').'
		';

		switch ($this->dashboard) {
			case 'document':
				echo '<script src="JS/document.js"></script>';
				$this->enableMenu = true;
				break;
		}

		// disable all for now as it return error on highcharts
		if ($this->enableMenu) {
			echo '<script src="'.$linkJSPre.'JS/highchart/v11/series-label.js"></script>
	        <script src="'.$linkJSPre.'JS/highchart/v11/exporting.js"></script>';
		}
	}

	function getDashboardList(){
		// default dashboard list
		$ret = array(
			'document' => array(
					'path' => $this->extendClassPath.'Document.php',
					'name' => 'Document Management'
				)		
		);
		return $ret;
	}

	function getRegisteredDocInfo(){
		$res = array();
		if ($this->isWPC) {
			$resDocURL = $this->jogetLinkObj->jogetAppLink['api']['document_dash_doc_list'].$this->projectID ?? '';
			$resDoc = $this->jogetCURL($resDocURL);
			if (isset($resDoc['data'])) {
				foreach ($resDoc['data'] as $doc) {
					$doc['document_type'] = ($doc['document_type']) ? $doc['document_type'] : "Others";
					if (isset($res['overall']['byType'][$doc['document_type']])) {
						$res['overall']['byType'][$doc['document_type']]++;
					}else{
						$res['overall']['byType'][$doc['document_type']] = 1;
					}

					if (isset($res['overall']['total'])) {
						$res['overall']['total']++;
					}else{
						$res['overall']['total'] = 1;
					}
				}
			}
		}
		foreach ($this->childProjectInfo as $childID) {
			$resDocChildURL = $this->jogetLinkObj->jogetAppLink['api']['document_dash_doc_list'].$childID['project_id'] ?? '';
			$resDoc = $this->jogetCURL($resDocChildURL);
			if (isset($resDoc['data'])) {
				foreach ($resDoc['data'] as $doc) {
					if (isset($res['overall']['byType'][$doc['document_type']])) {
						$res['overall']['byType'][$doc['document_type']]++;
					}else{
						$res['overall']['byType'][$doc['document_type']] = 1;
					}
					if (isset($res[$childID['project_id']]['byType'][$doc['document_type']])) {
						$res[$childID['project_id']]['byType'][$doc['document_type']]++;
					}else{
						$res[$childID['project_id']]['byType'][$doc['document_type']] = 1;
					}
					
					if (isset($res[$childID['project_id']]['total'])) {
						$res[$childID['project_id']]['total']++;
					}else{
						$res[$childID['project_id']]['total'] = 1;
					}

					if (isset($res['overall']['total'])) {
						$res['overall']['total']++;
					}else{
						$res['overall']['total'] = 1;
					}					
				}
			}
		}
		return $res;
	}

	function getCorrInfo(){
		$res = array();
		$purposeToShowArr = ['Issue for Comment/Revision','Issue for Approval'];
		if ($this->isWPC) {
			$resCorrURL = $this->jogetLinkObj->jogetAppLink['api']['document_dash_corr_list'].$this->projectID ?? "";
			$resCorrRes = $this->jogetCURL($resCorrURL);

			if (isset($resCorrRes['data'])) {
				foreach ($resCorrRes['data'] as $corr) {
					$corr['correspondence_type'] = ($corr['correspondence_type']) ? $corr['correspondence_type'] : 'If Else';
					// show on table only for 'comment /Revision & Approval' with 'Pending'
					if ($corr['status'] == 'Pending' && in_array($corr['purpose'], $purposeToShowArr)) {
						// check the overdue flag based on due date and current date and status must pending
						$corr['overdueFlag'] = 0;
						$corr['correspondence_type'] = ($corr['correspondence_type']) ? $corr['correspondence_type'] : 'If Else';
						if ($corr['status'] == 'Pending') {
							$dueDays = ($corr['due_date']) ? (strtotime(date('Y-m-d'))  - strtotime($corr['due_date']))/(60 * 60 * 24) : 0;
							$corr['overdueFlag'] = ($dueDays>0) ? 1 : 0;
						}
						
						// check the aging based on ducument date
						$aging = ($corr['document_date']) ? (strtotime(date('Y-m-d')) - strtotime($corr['document_date']))/(60 * 60 * 24) : 0;
						$corr['aging'] = ($aging<0) ? 0 : round($aging, 2); 

						$res['overall'][$corr['type']]['table'][] = $corr;
					}

					// populate overall data
					$res['overall'][$corr['type']]['raw'][] = $corr;
					$res['overall'][$corr['type']]['byType'][$corr['correspondence_type']][] = $corr;

					if (isset($res['overall'][$corr['type']]['byPurpose'][$corr['purpose']]['total'])) {
						$res['overall'][$corr['type']]['byPurpose'][$corr['purpose']]['total']++;
					}else{
						$res['overall'][$corr['type']]['byPurpose'][$corr['purpose']]['total'] = 1;
					}
					if (isset($res['overall'][$corr['type']]['byCategory'][$corr['category']]['total'])) {
						$res['overall'][$corr['type']]['byCategory'][$corr['category']]['total']++;
					}else{
						$res['overall'][$corr['type']]['byCategory'][$corr['category']]['total'] = 1;
					}

					$status = ($corr['status'] == 'Pending') ? $corr['status'] : 'Responded'; 
					if (isset($res['overall'][$corr['type']]['byCategory'][$corr['category']][$status])) {
						$res['overall'][$corr['type']]['byCategory'][$corr['category']][$status]++;
					}else{
						$res['overall'][$corr['type']]['byCategory'][$corr['category']][$status] = 1;
					}
				}
			}
		}
		foreach ($this->childProjectInfo as $childID) {
			$resCorrURL = $this->jogetLinkObj->jogetAppLink['api']['document_dash_corr_list'].$childID['project_id'] ?? "";
			$resCorrRes = $this->jogetCURL($resCorrURL);
			if (isset($resCorrRes['data'])) {
				foreach ($resCorrRes['data'] as $corr) {
					$corr['correspondence_type'] = ($corr['correspondence_type']) ? $corr['correspondence_type'] : 'If Else';
					// show on table only for 'comment /Revision & Approval' with 'Pending'
					if ($corr['status'] == 'Pending' && in_array($corr['purpose'], $purposeToShowArr)) {
						// check the overdue flag based on due date and current date and status must pending
						$corr['overdueFlag'] = 0;
						$corr['correspondence_type'] = ($corr['correspondence_type']) ? $corr['correspondence_type'] : 'If Else';
						if ($corr['status'] == 'Pending') {
							$dueDays = ($corr['due_date']) ? (strtotime(date('Y-m-d')) - strtotime($corr['due_date']))/(60 * 60 * 24) : 0;
							$corr['overdueFlag'] = ($dueDays>0) ? 1 : 0;
						}
						
						// check the aging based on ducument date
						$aging = ($corr['document_date']) ? (strtotime(date('Y-m-d')) - strtotime($corr['document_date']))/(60 * 60 * 24) : 0;
						$corr['aging'] = ($aging<0) ? 0 : round($aging, 2); 

						$res['overall'][$corr['type']]['table'][] = $corr;
						$res[$childID['project_id']][$corr['type']]['table'][] = $corr;
					}
					// for each project
					$res[$childID['project_id']][$corr['type']]['raw'][] = $corr;
					$res[$childID['project_id']][$corr['type']]['byType'][$corr['correspondence_type']][] = $corr;
					
					if (isset($res[$childID['project_id']][$corr['type']]['byPurpose'][$corr['purpose']]['total'])) {
						$res[$childID['project_id']][$corr['type']]['byPurpose'][$corr['purpose']]['total']++;
					}else{
						$res[$childID['project_id']][$corr['type']]['byPurpose'][$corr['purpose']]['total'] = 1;
					}
					if (isset($res[$childID['project_id']][$corr['type']]['byCategory'][$corr['category']]['total'])) {
						$res[$childID['project_id']][$corr['type']]['byCategory'][$corr['category']]['total']++;
					}else{
						$res[$childID['project_id']][$corr['type']]['byCategory'][$corr['category']]['total'] = 1;
					}

					// for overall
					$res['overall'][$corr['type']]['raw'][] = $corr;
					$res['overall'][$corr['type']]['byType'][$corr['correspondence_type']][] = $corr;
					
					if (isset($res['overall'][$corr['type']]['byPurpose'][$corr['purpose']]['total'])) {
						$res['overall'][$corr['type']]['byPurpose'][$corr['purpose']]['total']++;
					}else{
						$res['overall'][$corr['type']]['byPurpose'][$corr['purpose']]['total'] = 1;
					}
					if (isset($res['overall'][$corr['type']]['byCategory'][$corr['category']]['total'])) {
						$res['overall'][$corr['type']]['byCategory'][$corr['category']]['total']++;
					}else{
						$res['overall'][$corr['type']]['byCategory'][$corr['category']]['total'] = 1;
					}
				}
			}
		}
		return $res;
	}

	function getDocProjectInfo (){
		$ret = array();
		if ($this->isWPC) {
			$resURL = $this->jogetLinkObj->jogetAppLink['api']['document_dash_project_info'].$this->projectID ?? "";
			$res = $this->jogetCURL($resURL);
			if (isset($res['data'][0])) {
				$ret['overall'] = $res['data'][0];
			}
		}
		foreach ($this->childProjectInfo as $childID) {
			$resURLChild = $this->jogetLinkObj->jogetAppLink['api']['document_dash_project_info'].$childID['project_id'] ?? "";;
			$resChild = $this->jogetCURL($resURLChild);
			if (isset($resChild['data'][0])) {
				$ret[$childID['project_id']] = $resChild['data'][0];
			}
		}

		return $ret;
	}

	function getDocInfo(){
		$docInfo = $this->getRegisteredDocInfo();
		$corrInfo = $this->getCorrInfo();
		$docProjInfo = $this->getDocProjectInfo();
		$ret = array(
			'doc' => $docInfo,
			'corr' => $corrInfo,
			'docProjInfo' => $docProjInfo
		);
		return $ret;
	}
}