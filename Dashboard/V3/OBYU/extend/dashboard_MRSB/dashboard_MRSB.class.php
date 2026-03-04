<?php 
/**
 * 
 */
class RiDashboardMRSB extends RiDashboard
{
	var $extendClassPath = 'V3/OBYU/extend/dashboard_MRSB/';
	var $contractInfo;
	var $cutoffDay;
	var $sCurveData;
	var $packageCutOffArr;

	function __construct($dash = false, $ajax = false)
	{
		$this->cutoffDay = (isset($_SESSION['cut_off_day'])) ? $_SESSION['cut_off_day'] : '25';
		parent::__construct($dash, $ajax);
		$this->getPackageCutOffDay();

	}

	function loadJS(){
		echo '
			<script src="'.$this->pathRel.'../../JS/JsLibrary/jquery-3.5.1.js"></script>
			<script src="../../JS/dashboard.js"></script>
			<script src="'.((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https' : 'http').'://code.highcharts.com/highcharts.js"></script>
			'.((isset($_SESSION['ui_pref']) && $_SESSION['ui_pref'] == 'ri_v3') ? '<script src="../../../../../JS/v3.js"></script>' : '').'
		';

		switch ($this->dashboard) {
			case 'document':
				echo '<script src="JS/document.js"></script>';
				$this->enableMenu = true;
				break;
			case 'risk':
				echo '<script src="JS/risk.js"></script>
				<script src="https://code.highcharts.com/highcharts-more.js"></script>
				<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>';
				$this->enableMenu = true;
				break;
			case 'riskPackage':
				echo '<script src="JS/riskPackage.js"></script>';
				$this->enableMenu = true;
				break;
			case 'time':
				echo '<script src="JS/time.js"></script>';
				$this->enableMenu = true;
				break;
			case 'cost':
				echo '<script src="JS/cost.js"></script>';
				$this->enableMenu = true;
				break;
			case 'hset':
				echo '<script src="JS/hset.js"></script>';
				$this->enableMenu = true;
				break;
			case 'qaqc':
				echo '<script src="JS/qaqc.js"></script>';
				$this->enableMenu = true;
				break;
			case 'stakeholder':
				echo '<script src="JS/stakeholder.js"></script>';
				$this->enableMenu = true;
				break;
			case 'main':
				echo '<script src="JS/main.js"></script>';
				$this->enableMenu = true;
				break;
			case 'land':
				echo '<script src="JS/land.js"></script>
				<script src="https://code.highcharts.com/highcharts-more.js"></script>';
				$this->enableMenu = true;
				break;
		}

		if ($this->enableMenu) {
			echo '<script src="https://code.highcharts.com/modules/series-label.js"></script>
	        <script src="https://code.highcharts.com/modules/exporting.js"></script>';
		}
	}

	function getDashboardList(){
		$this->loadProjectInfo();
		// default dashboard list
		$ret = array(
				'main' => array(
					'path' => $this->extendClassPath.'main.php',
					'name' => 'Main Summary'
				),
				'cost' => array(
					'path' => $this->extendClassPath.'cost.php',
					'name' => 'Cost Management'
				),			
				'document' => array(
					'path' => $this->extendClassPath.'Document.php',
					'name' => 'Document Management'
				),
				'hset' => array(
					'path' => $this->extendClassPath.'HSET.php',
					'name' => 'HSET Management'
				),
				'land' => array(
					'path' => $this->extendClassPath.'land.php',
					'name' => 'Land Management'
				),
				'qaqc' => array(
					'path' => $this->extendClassPath.'qaqc.php',
					'name' => 'Quality Management'
				),
				'stakeholder' => array(
					'path' => $this->extendClassPath.'stakeholder.php',
					'name' => 'Stakeholder Management'
				),
				'time' => array(
					'path' => $this->extendClassPath.'time.php',
					'name' => 'Time Management'
				)
		);

		if($this->isWPC){
			$ret['riskPackage'] = array(
				'path' => $this->extendClassPath.'RiskPackage.php',
				'name' => 'Risk Management'
			);
		}
		else{
			$ret['risk'] = array(
				'path' => $this->extendClassPath.'Risk.php',
				'name' => 'Risk Management'
			);
		}

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

	function getRegisteredDocInfo (){
		$res = array();
		$ncrListArr = array(
			'Non-Conformance Report (NCR)',
			'Non-Conformance Report (NCR) (Traffic Management)',
			'Non-Conformance Report (NCR) (Quality)',
			'Non-Conformance Report (NCR) (Health and Safety)',
			'Non-Conformance Report (NCR) (Environment)'
		);
		$carListArr = array(
			'Corrective Action Request (CAR)',
			'Corrective Action Request (CAR) (Quality)',
			'Corrective Action Request (CAR) (Health Safety)',
			'Corrective Action Request (CAR) (Environment)',
			'Corrective Action Request (CAR) (Traffic Management)'
		);

		if ($this->isWPC) {
			$resDocURL = $this->jogetLinkObj->getLink('document_dash_doc_list', array($this->projectID, $this->parentProjectID));
			$resDoc = $this->jogetCURL($resDocURL);
			if (isset($resDoc['data'])) {
				// all count
				$res['overall']['overall']['count']['all'] = count($resDoc['data']);
				foreach ($resDoc['data'] as $doc) {
					// for filtering on ConOp
					if (!isset($res['overall'][$doc['section']]['count']['allData'])) {
						$res['overall'][$doc['section']]['count']['allData'] = array('section' => $doc['section']);
					}

					if (isset($res['overall'][$doc['section']]['count']['all'])) {
						$res['overall'][$doc['section']]['count']['all']++;
					}else{
						$res['overall'][$doc['section']]['count']['all'] = 1;
					}

					// for filtering on ConOp
					if (!isset($res['overall']['overall']['byType'][$doc['document_type']]['allData'])) {
						$res['overall']['overall']['byType'][$doc['document_type']]['allData'] = array('section' => '', 'document_type' => $doc['document_type']);
					}
					if (!isset($res['overall'][$doc['section']]['byType'][$doc['document_type']]['allData'])) {
						$res['overall'][$doc['section']]['byType'][$doc['document_type']]['allData'] = array('section' => $doc['section'], 'document_type' => $doc['document_type']);
					}

					// document type
					if (isset($res['overall']['overall']['byType'][$doc['document_type']]['val'])) {
						$res['overall']['overall']['byType'][$doc['document_type']]['val']++;
					}else{
						$res['overall']['overall']['byType'][$doc['document_type']]['val'] = 1; 
					}
					if (isset($res['overall'][$doc['section']]['byType'][$doc['document_type']]['val'])) {
						$res['overall'][$doc['section']]['byType'][$doc['document_type']]['val']++;
					}else{
						$res['overall'][$doc['section']]['byType'][$doc['document_type']]['val'] = 1; 
					}

					// for drawing
					if ($doc['document_type'] == 'Drawing') {
						// for filtering on ConOp
						if (!isset($res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['allData'])) {
							$res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['allData'] =  array('section' => '', 'document_type' => 'Drawing', 'drawing_type' => $doc['drawing_type']);
						}
						if (!isset($res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['allData'])) {
							$res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['allData'] =  array('section' => $doc['section'], 'document_type' => 'Drawing', 'drawing_type' => $doc['drawing_type']);
						}

						// drawing by type
						if (isset($res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['val'])) {
							$res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['val']++;
						}else{
							$res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['val'] = 1;
						}
						if (isset($res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['val'])) {
							$res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['val']++;
						}else{
							$res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['val'] = 1;
						}

						// for filtering on ConOp
						if (!isset($res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['allData'])) {
							$res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['allData'] =  array('section' => '', 'document_type' => 'Drawing', 'discipline' => $doc['discipline']);
						}
						if (!isset($res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['allData'])) {
							$res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['allData'] =  array('section' => $doc['section'], 'document_type' => 'Drawing', 'discipline' => $doc['discipline']);
						}

						// drawing by discipline
						if (isset($res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['val'])) {
							$res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['val']++;
						}else{
							$res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['val'] = 1;
						}
						if (isset($res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['val'])) {
							$res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['val']++;
						}else{
							$res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['val'] = 1;
						}

						// for filtering on ConOp
						if (!isset($res['overall']['overall']['drawing']['revisedTotal']['Total']['allData'])) {
							$res['overall']['overall']['drawing']['revisedTotal']['Total']['allData'] =  array('section' => '', 'document_type' => 'Drawing');
						}
						if (!isset($res['overall'][$doc['section']]['drawing']['revisedTotal']['Total']['allData'])) {
							$res['overall'][$doc['section']]['drawing']['revisedTotal']['Total']['allData'] =  array('section' => $doc['section'], 'document_type' => 'Drawing');
						}

						// drawing count by total and revision
						if (isset($res['overall']['overall']['drawing']['revisedTotal']['Total']['cnt'])) {
							$res['overall']['overall']['drawing']['revisedTotal']['Total']['cnt']++;
						}else{
							$res['overall']['overall']['drawing']['revisedTotal']['Total']['cnt'] = 1;
						}
						if (isset($res['overall'][$doc['section']]['drawing']['revisedTotal']['Total']['cnt'])) {
							$res['overall'][$doc['section']]['drawing']['revisedTotal']['Total']['cnt']++;
						}else{
							$res['overall'][$doc['section']]['drawing']['revisedTotal']['Total']['cnt'] = 1;
						}

						if ($doc['revision_no']) {
							// for filtering on ConOp
							if (!isset($res['overall']['overall']['drawing']['revisedTotal']['Revised']['allData'])) {
								$res['overall']['overall']['drawing']['revisedTotal']['Revised']['allData'] =  array('section' => '', 'document_type' => 'Drawing');
							}
							if (!isset($res['overall'][$doc['section']]['drawing']['revisedTotal']['Revised']['allData'])) {
								$res['overall'][$doc['section']]['drawing']['revisedTotal']['Revised']['allData'] =  array('section' => $doc['section'], 'document_type' => 'Drawing');
							}

							if (isset($res['overall']['overall']['drawing']['revisedTotal']['Revised']['cnt'])) {
								$res['overall']['overall']['drawing']['revisedTotal']['Revised']['cnt']++;
							}else{
								$res['overall']['overall']['drawing']['revisedTotal']['Revised']['cnt'] = 1;
							}
							if (isset($res['overall'][$doc['section']]['drawing']['revisedTotal']['Revised']['cnt'])) {
								$res['overall'][$doc['section']]['drawing']['revisedTotal']['Revised']['cnt']++;
							}else{
								$res['overall'][$doc['section']]['drawing']['revisedTotal']['Revised']['cnt'] = 1;
							}
						}
					}
					// for car and ncr
					if (in_array($doc['document_type'], $ncrListArr) || in_array($doc['document_type'], $carListArr)) {
						if (in_array($doc['document_type'], $carListArr)){
							$type = 'car';
							$typeFullName = 'Corrective Action Request (CAR)';
						}
						else{
							$type = 'ncr';
							$typeFullName = 'Non-Conformance Report (NCR)';

						}
						$aging = ($doc['document_date']) ? round((strtotime(date('Y-m-d')) - strtotime($doc['document_date']))/(60 * 60 * 24), 2) : '0';
						$doc['aging'] = ($aging > 0) ? $aging : 0;
						
						// for filtering on ConOp
						if (!isset($res['overall']['overall'][$type]['cnt']['allData'])) {
							$res['overall']['overall'][$type]['cnt']['allData'] = array('section' => '', 'document_type' => $typeFullName);
						}
						if (!isset($res['overall'][$doc['section']][$type]['cnt']['allData'])) {
							$res['overall'][$doc['section']][$type]['cnt']['allData'] = array('section' => $doc['section'], 'document_type' => $typeFullName);
						}

						if(!isset($res['overall']['overall'][$type]['allData'])){
							$res['overall']['overall'][$type]['allData'] = array('section' => '', 'document_type' => $typeFullName);
						}
						if(!isset($res['overall'][$doc['section']][$type]['allData'])){
							$res['overall'][$doc['section']][$type]['allData'] = array('section' => $doc['section'], 'document_type' => $typeFullName);
						}

						if (isset($res['overall']['overall'][$type]['cnt']['total'])) {
							$res['overall']['overall'][$type]['cnt']['total']++;
						}else{
							$res['overall']['overall'][$type]['cnt']['total'] = 1;
						}
						$res['overall']['overall'][$type]['raw'][] = $doc;	

						if (isset($res['overall'][$doc['section']][$type]['cnt']['total'])) {
							$res['overall'][$doc['section']][$type]['cnt']['total']++;
						}else{
							$res['overall'][$doc['section']][$type]['cnt']['total'] = 1;
						}
						$res['overall'][$doc['section']][$type]['raw'][] = $doc;		
					}
				}
			}
		}
		else{
			foreach ($this->childProjectInfo as $childID) {
				$childID = $childID['project_id'];
				$resDocURL = $this->jogetLinkObj->getLink('document_dash_doc_list', array($childID));
				$resDocs[$resDocURL] = $this->jogetCURL($resDocURL);
			}

			foreach ($resDocs as $resDocURL => $resDoc) {
				if (isset($resDoc['data'])) {
					// for filtering on ConOp
					if (!isset($res['overall']['overall']['count']['allData'])) {
						$res['overall']['overall']['count']['allData'] = array('section' => '');
					}
	
					foreach ($resDoc['data'] as $doc) {
						// for filtering on ConOp
						if (!isset($res[$doc['package_id']]['overall']['count']['allData'])) {
							$res[$doc['package_id']]['overall']['count']['allData'] = array('section' => '');
						}
						// for filtering on ConOp
						if (!isset($res['overall'][$doc['section']]['count']['allData'])) {
							$res['overall'][$doc['section']]['count']['allData'] = array('section' => $doc['section'] );
						}
						if (!isset($res[$doc['package_id']][$doc['section']]['count']['allData'])) {
							$res[$doc['package_id']][$doc['section']]['count']['allData'] = array('section' => $doc['section'] );
						}
		
						// all count
						if (isset($res['overall']['overall']['count']['all'])) {
							$res['overall']['overall']['count']['all']++;
						}else{
							$res['overall']['overall']['count']['all'] = 1;
						}
		
						if (isset($res[$doc['package_id']]['overall']['count']['all'])) {
							$res[$doc['package_id']]['overall']['count']['all']++;
						}else{
							$res[$doc['package_id']]['overall']['count']['all'] = 1;
						}
		
						if (isset($res['overall'][$doc['section']]['count']['all'])) {
							$res['overall'][$doc['section']]['count']['all']++;
						}else{
							$res['overall'][$doc['section']]['count']['all'] = 1;
						}
						if (isset($res[$doc['package_id']][$doc['section']]['count']['all'])) {
							$res[$doc['package_id']][$doc['section']]['count']['all']++;
						}else{
							$res[$doc['package_id']][$doc['section']]['count']['all'] = 1;
						}
		
						// for filtering on ConOp
						if (!isset($res['overall']['overall']['byType'][$doc['document_type']]['allData'])) {
							$res['overall']['overall']['byType'][$doc['document_type']]['allData'] = array('section' => '', 'document_type' => $doc['document_type']);
						}
						if (!isset($res['overall'][$doc['section']]['byType'][$doc['document_type']]['allData'])) {
							$res['overall'][$doc['section']]['byType'][$doc['document_type']]['allData'] = array('section' => $doc['section'], 'document_type' => $doc['document_type']);
						}
						if (!isset($res[$doc['package_id']]['overall']['byType'][$doc['document_type']]['allData'])) {
							$res[$doc['package_id']]['overall']['byType'][$doc['document_type']]['allData'] = array('section' => '', 'document_type' => $doc['document_type']);
						}
						if (!isset($res[$doc['package_id']][$doc['section']]['byType'][$doc['document_type']]['allData'])) {
							$res[$doc['package_id']][$doc['section']]['byType'][$doc['document_type']]['allData'] = array('section' => $doc['section'], 'document_type' => $doc['document_type']);
						}
		
						// document type
						if (isset($res['overall']['overall']['byType'][$doc['document_type']]['val'])) {
							$res['overall']['overall']['byType'][$doc['document_type']]['val']++;
						}else{
							$res['overall']['overall']['byType'][$doc['document_type']]['val'] = 1; 
						}
						if (isset($res['overall'][$doc['section']]['byType'][$doc['document_type']]['val'])) {
							$res['overall'][$doc['section']]['byType'][$doc['document_type']]['val']++;
						}else{
							$res['overall'][$doc['section']]['byType'][$doc['document_type']]['val'] = 1; 
						}
		
						if (isset($res[$doc['package_id']]['overall']['byType'][$doc['document_type']]['val'])) {
							$res[$doc['package_id']]['overall']['byType'][$doc['document_type']]['val']++;
						}else{
							$res[$doc['package_id']]['overall']['byType'][$doc['document_type']]['val'] = 1; 
						}
						if (isset($res[$doc['package_id']][$doc['section']]['byType'][$doc['document_type']]['val'])) {
							$res[$doc['package_id']][$doc['section']]['byType'][$doc['document_type']]['val']++;
						}else{
							$res[$doc['package_id']][$doc['section']]['byType'][$doc['document_type']]['val'] = 1; 
						}
		
						// for drawing
						if ($doc['document_type'] == 'Drawing') {
							// for filtering on ConOp
							if (!isset($res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['allData'])) {
								$res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['allData'] =  array('section' => '', 'drawing_type' => 'Drawing');
							}
							if (!isset($res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['allData'])) {
								$res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['allData'] =  array('section' => $doc['section'], 'drawing_type' => 'Drawing');
							}
							if (!isset($res[$doc['package_id']]['overall']['drawing']['byType'][$doc['drawing_type']]['allData'])) {
								$res[$doc['package_id']]['overall']['drawing']['byType'][$doc['drawing_type']]['allData'] =  array('section' => '', 'drawing_type' => 'Drawing');
							}
							if (!isset($res[$doc['package_id']][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['allData'])) {
								$res[$doc['package_id']][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['allData'] =  array('section' => $doc['section'], 'drawing_type' => 'Drawing');
							}
		
							// drawing by type
							if (isset($res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['val'])) {
								$res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['val']++;
							}else{
								$res['overall']['overall']['drawing']['byType'][$doc['drawing_type']]['val'] = 1;
							}
							if (isset($res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['val'])) {
								$res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['val']++;
							}else{
								$res['overall'][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['val'] = 1;
							}
		
							if (isset($res[$doc['package_id']]['overall']['drawing']['byType'][$doc['drawing_type']]['val'])) {
								$res[$doc['package_id']]['overall']['drawing']['byType'][$doc['drawing_type']]['val']++;
							}else{
								$res[$doc['package_id']]['overall']['drawing']['byType'][$doc['drawing_type']]['val'] = 1;
							}
							if (isset($res[$doc['package_id']][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['val'])) {
								$res[$doc['package_id']][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['val']++;
							}else{
								$res[$doc['package_id']][$doc['section']]['drawing']['byType'][$doc['drawing_type']]['val'] = 1;
							}
		
							// for filtering on ConOp
							if (!isset($res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['allData'])) {
								$res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['allData'] =  array('section' => '', 'drawing_type' => 'Drawing', 'discipline' => $doc['discipline']);
							}
							if (!isset($res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['allData'])) {
								$res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['allData'] =  array('section' => $doc['section'], 'drawing_type' => 'Drawing', 'discipline' => $doc['discipline']);
							}
							if (!isset($res[$doc['package_id']]['overall']['drawing']['byDiscipline'][$doc['discipline']]['allData'])) {
								$res[$doc['package_id']]['overall']['drawing']['byDiscipline'][$doc['discipline']]['allData'] =  array('section' => '', 'drawing_type' => 'Drawing', 'discipline' => $doc['discipline']);
							}
							if (!isset($res[$doc['package_id']][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['allData'])) {
								$res[$doc['package_id']][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['allData'] =  array('section' => $doc['section'], 'drawing_type' => 'Drawing', 'discipline' => $doc['discipline']);
							}
		
							// drawing by discipline
							if (isset($res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['val'])) {
								$res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['val']++;
							}else{
								$res['overall']['overall']['drawing']['byDiscipline'][$doc['discipline']]['val'] = 1;
							}
							if (isset($res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['val'])) {
								$res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['val']++;
							}else{
								$res['overall'][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['val'] = 1;
							}
		
							if (isset($res[$doc['package_id']]['overall']['drawing']['byDiscipline'][$doc['discipline']]['val'])) {
								$res[$doc['package_id']]['overall']['drawing']['byDiscipline'][$doc['discipline']]['val']++;
							}else{
								$res[$doc['package_id']]['overall']['drawing']['byDiscipline'][$doc['discipline']]['val'] = 1;
							}
							if (isset($res[$doc['package_id']][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['val'])) {
								$res[$doc['package_id']][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['val']++;
							}else{
								$res[$doc['package_id']][$doc['section']]['drawing']['byDiscipline'][$doc['discipline']]['val'] = 1;
							}
		
							// for filtering on ConOp
							if (!isset($res['overall']['overall']['drawing']['cnt']['allData'])) {
								$res['overall']['overall']['drawing']['cnt']['allData'] =  array('section' => '', 'document_type' => 'Drawing');
							}
							if (!isset($res['overall'][$doc['section']]['drawing']['cnt']['allData'])) {
								$res['overall'][$doc['section']]['drawing']['cnt']['allData'] =  array('section' => $doc['section'], 'document_type' => 'Drawing');
							}
							if (!isset($res[$doc['package_id']]['overall']['drawing']['cnt']['allData'])) {
								$res[$doc['package_id']]['overall']['drawing']['cnt']['allData'] =  array('section' => '', 'document_type' => 'Drawing');
							}
							if (!isset($res[$doc['package_id']][$doc['section']]['drawing']['cnt']['allData'])) {
								$res[$doc['package_id']][$doc['section']]['drawing']['cnt']['allData'] =  array('section' => $doc['section'], 'document_type' => 'Drawing');
							}
		
							// drawing count by total and revision
							if (isset($res['overall']['overall']['drawing']['revisedTotal']['Total']['cnt'])) {
								$res['overall']['overall']['drawing']['revisedTotal']['Total']['cnt']++;
							}else{
								$res['overall']['overall']['drawing']['revisedTotal']['Total']['cnt'] = 1;
							}
							if (isset($res['overall'][$doc['section']]['drawing']['revisedTotal']['Total']['cnt'])) {
								$res['overall'][$doc['section']]['drawing']['revisedTotal']['Total']['cnt']++;
							}else{
								$res['overall'][$doc['section']]['drawing']['revisedTotal']['Total']['cnt'] = 1;
							}
		
							if (isset($res[$doc['package_id']]['overall']['drawing']['revisedTotal']['Total']['cnt'])) {
								$res[$doc['package_id']]['overall']['drawing']['revisedTotal']['Total']['cnt']++;
							}else{
								$res[$doc['package_id']]['overall']['drawing']['revisedTotal']['Total']['cnt'] = 1;
							}
							if (isset($res[$doc['package_id']][$doc['section']]['drawing']['revisedTotal']['Total']['cnt'])) {
								$res[$doc['package_id']][$doc['section']]['drawing']['revisedTotal']['Total']['cnt']++;
							}else{
								$res[$doc['package_id']][$doc['section']]['drawing']['revisedTotal']['Total']['cnt'] = 1;
							}
		
							if ($doc['revision_no']) {
		
								// for filtering on ConOp
								if (!isset($res['overall']['overall']['drawing']['cnt']['allData'])) {
									$res['overall']['overall']['drawing']['cnt']['allData'] =  array('section' => '', 'document_type' => 'Drawing');
								}
								if (!isset($res['overall'][$doc['section']]['drawing']['cnt']['allData'])) {
									$res['overall'][$doc['section']]['drawing']['cnt']['allData'] =  array('section' => $doc['section'], 'document_type' => 'Drawing');
								}
								if (!isset($res[$doc['package_id']]['overall']['drawing']['cnt']['allData'])) {
									$res[$doc['package_id']]['overall']['drawing']['cnt']['allData'] =  array('section' => '', 'document_type' => 'Drawing');
								}
								if (!isset($res[$doc['package_id']][$doc['section']]['drawing']['cnt']['allData'])) {
									$res[$doc['package_id']][$doc['section']]['drawing']['cnt']['allData'] =  array('section' => $doc['section'], 'document_type' => 'Drawing');
								}
		
								if (isset($res['overall']['overall']['drawing']['cnt']['Revised'])) {
									$res['overall']['overall']['drawing']['cnt']['Revised']++;
								}else{
									$res['overall']['overall']['drawing']['cnt']['Revised'] = 1;
								}
								if (isset($res['overall'][$doc['section']]['drawing']['cnt']['Revised'])) {
									$res['overall'][$doc['section']]['drawing']['cnt']['Revised']++;
								}else{
									$res['overall'][$doc['section']]['drawing']['cnt']['Revised'] = 1;
								}
		
								if (isset($res[$doc['package_id']]['overall']['drawing']['cnt']['Revised'])) {
									$res[$doc['package_id']]['overall']['drawing']['cnt']['Revised']++;
								}else{
									$res[$doc['package_id']]['overall']['drawing']['cnt']['Revised'] = 1;
								}
								if (isset($res[$doc['package_id']][$doc['section']]['drawing']['cnt']['Revised'])) {
									$res[$doc['package_id']][$doc['section']]['drawing']['cnt']['Revised']++;
								}else{
									$res[$doc['package_id']][$doc['section']]['drawing']['cnt']['Revised'] = 1;
								}
							}
						}
						// for car and ncr
						if (in_array($doc['document_type'], $ncrListArr) || in_array($doc['document_type'], $carListArr)) {
							if (in_array($doc['document_type'], $carListArr)){
								$type = 'car';
								$typeFullName = 'Corrective Action Request (CAR)';
							}
							else{
								$type = 'ncr';
								$typeFullName = 'Non-Conformance Report (NCR)';
		
							}
		
							$aging = ($doc['document_date']) ? round((strtotime(date('Y-m-d')) - strtotime($doc['document_date']))/(60 * 60 * 24), 2) : '0';
							$doc['aging'] = ($aging > 0) ? $aging : 0;
							
							// for filtering on ConOp
							if (!isset($res['overall']['overall'][$type]['cnt']['allData'])) {
								$res['overall']['overall'][$type]['cnt']['allData'] = array('section' => '', 'document_type' => $typeFullName);
							}
							if (!isset($res['overall'][$doc['section']][$type]['cnt']['allData'])) {
								$res['overall'][$doc['section']][$type]['cnt']['allData'] = array('section' => $doc['section'], 'document_type' => $typeFullName);
							}
							if (!isset($res[$doc['package_id']]['overall'][$type]['cnt']['allData'])) {
								$res[$doc['package_id']]['overall'][$type]['cnt']['allData'] = array('section' => '', 'document_type' => $typeFullName);
							}
							if (!isset($res[$doc['package_id']][$doc['section']][$type]['cnt']['allData'])) {
								$res[$doc['package_id']][$doc['section']][$type]['cnt']['allData'] = array('section' => $doc['section'], 'document_type' => $typeFullName);
							}
							if(!isset($res['overall']['overall'][$type]['allData'])){
								$res['overall']['overall'][$type]['allData'] = array('section' => '', 'document_type' => $typeFullName);
							}
							if(!isset($res['overall'][$doc['section']][$type]['allData'])){
								$res['overall'][$doc['section']][$type]['allData'] = array('section' => $doc['section'], 'document_type' => $typeFullName);
							}
							if(!isset($res[$doc['package_id']]['overall'][$type]['allData'])){
								$res[$doc['package_id']]['overall'][$type]['allData'] = array('section' => '', 'document_type' => $typeFullName);
							}
							if(!isset($res[$doc['package_id']][$doc['section']][$type]['allData'])){
								$res[$doc['package_id']][$doc['section']][$type]['allData'] = array('section' => $doc['section'], 'document_type' => $typeFullName);
							}
		
							if (isset($res['overall']['overall'][$type]['cnt']['total'])) {
								$res['overall']['overall'][$type]['cnt']['total']++;
							}else{
								$res['overall']['overall'][$type]['cnt']['total'] = 1;
							}
							$res['overall']['overall'][$type]['raw'][] = $doc;	
		
							if (isset($res[$doc['package_id']]['overall'][$type]['cnt']['total'])) {
								$res[$doc['package_id']]['overall'][$type]['cnt']['total']++;
							}else{
								$res[$doc['package_id']]['overall'][$type]['cnt']['total'] = 1;
							}
							$res[$doc['package_id']]['overall'][$type]['raw'][] = $doc;
		
							if (isset($res['overall'][$doc['section']][$type]['cnt']['total'])) {
								$res['overall'][$doc['section']][$type]['cnt']['total']++;
							}else{
								$res['overall'][$doc['section']][$type]['cnt']['total'] = 1;
							}
							$res['overall'][$doc['section']][$type]['raw'][] = $doc;	
		
		
							if (isset($res[$doc['package_id']][$doc['section']][$type]['cnt']['total'])) {
								$res[$doc['package_id']][$doc['section']][$type]['cnt']['total']++;
							}else{
								$res[$doc['package_id']][$doc['section']][$type]['cnt']['total'] = 1;
							}
							$res[$doc['package_id']][$doc['section']][$type]['raw'][] = $doc;	
						}
					}
				}
			}
		}
		return $res;
	}
	
	private function getCorrInfo (){
		$res = array();
		// purpose
		$toRespondArr = array('for approval','for review','for comment');
		if ($this->isWPC) {
			$resCorrURL = $this->jogetLinkObj->getLink('document_dash_corr_list', array($this->projectID, $this->parentProjectID));
			$resCorrRes = $this->jogetCURL($resCorrURL);			
			if (isset($resCorrRes['data'])) {
				foreach ($resCorrRes['data'] as $corr) {
					// for filtering on ConOp
					if (!isset($res['overall']['overall']['cnt']['allData'])) {
						$res['overall']['overall']['cnt']['allData'] = array('section' => '');;
					}
					if (!isset($res['overall'][$corr['section']]['cnt']['allData'])) {
						$res['overall'][$corr['section']]['cnt']['allData'] = array('section' => $corr['section']);;
					}

					// total
					if (isset($res['overall'][$corr['section']]['cnt']['total'])) {
						$res['overall'][$corr['section']]['cnt']['total']++;
					}else{
						$res['overall'][$corr['section']]['cnt']['total'] = 1;
					}

					if (isset($res['overall']['overall']['cnt']['total'])) {
						$res['overall']['overall']['cnt']['total']++;
					}else{
						$res['overall']['overall']['cnt']['total'] = 1;
					}
					
					// for filtering on ConOp
					if (!isset($res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['allData'])) {
						$res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['allData'] = array('section' => '', 'type' => $corr['type'], 'correspondence_type' => $corr['correspondence_type']);
					}
					if (!isset($res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['allData'])) {
						$res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['allData'] = array('section' => $corr['section'], 'type' => $corr['type'], 'correspondence_type' => $corr['correspondence_type']);
					}

					// bytype all
					if (isset($res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['val'])) {
						$res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['val']++;
					}else{
						$res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['val'] = 1;
					}
					if (isset($res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['val'])) {
						$res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['val']++;
					}else{
						$res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['val'] = 1;
					}
	
					// for filtering on ConOp
					if (!isset($res['overall']['overall'][$corr['type']]['byPurpose']['allData'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose']['allData'] = array('section' => '', 'type' => $corr['type']);
					}
					if (!isset($res['overall'][$corr['section']][$corr['type']]['byPurpose']['allData'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose']['allData'] = array('section' => $corr['section'], 'type' => $corr['type']);
					}

					// by pupose and status
					// total
					if (isset($res['overall']['overall'][$corr['type']]['byPurpose']['total'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose']['total']++;
					}else{
						$res['overall']['overall'][$corr['type']]['byPurpose']['total'] = 1;
					}
					if (isset($res['overall'][$corr['section']][$corr['type']]['byPurpose']['total'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose']['total']++;
					}else{
						$res['overall'][$corr['section']][$corr['type']]['byPurpose']['total'] = 1;
					}

					// status
					// $status = ($corr['status'] == 'Responded') ? 'Responded' : 'Pending';
					$status = $corr['status'];
					$purpose = (in_array(strtolower($corr['purpose']), $toRespondArr)) ? 'toRespond' : 'forInfo';

					// for filtering on ConOp
					if (!isset($res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['allData'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['allData'] = array('section' => '', 'type' => $corr['type'], 'purpose' => $corr['purpose'], 'status' => $corr['status']);
					}
					if (!isset($res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['allData'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['allData'] = array('section' => $corr['section'], 'type' => $corr['type'], 'purpose' => $corr['purpose'], 'status' => $corr['status']);
					}

					if (!isset($res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['allData'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['allData'] = array('section' => '', 'type' => $corr['type'], 'purpose' => $corr['purpose']);
					}
					if (!isset($res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['allData'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['allData'] = array('section' => $corr['section'], 'type' => $corr['type'], 'purpose' => $corr['purpose']);
					}

					if (isset($res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['val'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['val']++;
					}else{
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['val'] = 1;
					}
					if (isset($res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['val'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['val']++;
					}else{
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['val'] = 1;
					}
					if (isset($res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['total'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['total']++;
					}else{
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['total'] = 1;
					}
					if (isset($res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['total'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['total']++;
					}else{
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['total'] = 1;
					}
				}
			}
		}
		else{
			$resCorrURL = $this->jogetLinkObj->getLink('document_dash_corr_list', array('', $this->parentProjectID));
			$resCorrRes = $this->jogetCURL($resCorrURL);
			if (isset($resCorrRes['data'])) {
				foreach ($resCorrRes['data'] as $corr) {
					// for filtering on ConOp
					if (!isset($res['overall']['overall']['cnt']['allData'])) {
						$res['overall']['overall']['cnt']['allData'] = array('section' => '');;
					}
					if (!isset($res['overall'][$corr['section']]['cnt']['allData'])) {
						$res['overall'][$corr['section']]['cnt']['allData'] = array('section' => $corr['section']);;
					}
					if (!isset($res[$corr['package_id']]['overall']['cnt']['allData'])) {
						$res[$corr['package_id']]['overall']['cnt']['allData'] = array('section' => '');;
					}
					if (!isset($res[$corr['package_id']][$corr['section']]['cnt']['allData'])) {
						$res[$corr['package_id']][$corr['section']]['cnt']['allData'] = array('section' => $corr['section']);;
					}

					// total
					if (isset($res['overall'][$corr['section']]['cnt']['total'])) {
						$res['overall'][$corr['section']]['cnt']['total']++;
					}else{
						$res['overall'][$corr['section']]['cnt']['total'] = 1;
					}

					if (isset($res['overall']['overall']['cnt']['total'])) {
						$res['overall']['overall']['cnt']['total']++;
					}else{
						$res['overall']['overall']['cnt']['total'] = 1;
					}

					// for child for total
					if (isset($res[$corr['package_id']][$corr['section']]['cnt']['total'])) {
						$res[$corr['package_id']][$corr['section']]['cnt']['total']++;
					}else{
						$res[$corr['package_id']][$corr['section']]['cnt']['total'] = 1;
					}

					if (isset($res[$corr['package_id']]['overall']['cnt']['total'])) {
						$res[$corr['package_id']]['overall']['cnt']['total']++;
					}else{
						$res[$corr['package_id']]['overall']['cnt']['total'] = 1;
					}

					// for filtering on ConOp
					if (!isset($res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['allData'])) {
						$res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['allData'] = array('section' => '', 'type' => $corr['type'], 'correspondence_type' => $corr['correspondence_type']);
					}
					if (!isset($res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['allData'])) {
						$res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['allData'] = array('section' => $corr['section'], 'type' => $corr['type'], 'correspondence_type' => $corr['correspondence_type']);
					}
					if (!isset($res[$corr['package_id']]['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['allData'])) {
						$res[$corr['package_id']]['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['allData'] = array('section' => '', 'type' => $corr['type'], 'correspondence_type' => $corr['correspondence_type']);
					}
					if (!isset($res[$corr['package_id']][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['allData'])) {
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['allData'] = array('section' => $corr['section'], 'type' => $corr['type'], 'correspondence_type' => $corr['correspondence_type']);
					}

					// bytype all
					if (isset($res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['val'])) {
						$res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['val']++;
					}else{
						$res['overall']['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['val'] = 1;
					}
					if (isset($res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['val'])) {
						$res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['val']++;
					}else{
						$res['overall'][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['val'] = 1;
					}

					// for child for bytype all
					if (isset($res[$corr['package_id']]['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['val'])) {
						$res[$corr['package_id']]['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['val']++;
					}else{
						$res[$corr['package_id']]['overall'][$corr['type']]['byType'][$corr['correspondence_type']]['val'] = 1;
					}
					if (isset($res[$corr['package_id']][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['val'])) {
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['val']++;
					}else{
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byType'][$corr['correspondence_type']]['val'] = 1;
					}
	
					// for filtering on ConOp
					if (!isset($res['overall']['overall'][$corr['type']]['byPurpose']['allData'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose']['allData'] = array('section' => '', 'type' => $corr['type']);
					}
					if (!isset($res['overall'][$corr['section']][$corr['type']]['byPurpose']['allData'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose']['allData'] = array('section' => $corr['section'], 'type' => $corr['type']);
					}
					if (!isset($res[$corr['package_id']]['overall'][$corr['type']]['byPurpose']['allData'])) {
						$res[$corr['package_id']]['overall'][$corr['type']]['byPurpose']['allData'] = array('section' => '', 'type' => $corr['type']);
					}
					if (!isset($res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose']['allData'])) {
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose']['allData'] = array('section' => $corr['section'], 'type' => $corr['type']);
					}

					// by pupose and status
					// total
					if (isset($res['overall']['overall'][$corr['type']]['byPurpose']['total'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose']['total']++;
					}else{
						$res['overall']['overall'][$corr['type']]['byPurpose']['total'] = 1;
					}
					if (isset($res['overall'][$corr['section']][$corr['type']]['byPurpose']['total'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose']['total']++;
					}else{
						$res['overall'][$corr['section']][$corr['type']]['byPurpose']['total'] = 1;
					}

					if (isset($res[$corr['package_id']]['overall'][$corr['type']]['byPurpose']['total'])) {
						$res[$corr['package_id']]['overall'][$corr['type']]['byPurpose']['total']++;
					}else{
						$res[$corr['package_id']]['overall'][$corr['type']]['byPurpose']['total'] = 1;
					}
					if (isset($res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose']['total'])) {
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose']['total']++;
					}else{
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose']['total'] = 1;
					}

					// status
					// $status = ($corr['status'] == 'Responded') ? 'Responded' : 'Pending';
					$status = $corr['status'];
					$purpose = (in_array(strtolower($corr['purpose']), $toRespondArr)) ? 'toRespond' : 'forInfo';
					
					// for filtering on ConOp
					if (!isset($res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['allData'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['allData'] = array('section' => '', 'type' => $corr['type'], 'purpose' => $corr['purpose'], 'status' => $corr['status']);
					}
					if (!isset($res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['allData'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['allData'] = array('section' => $corr['section'], 'type' => $corr['type'], 'purpose' => $corr['purpose'], 'status' => $corr['status']);
					}
					if (!isset($res[$corr['package_id']]['overall'][$corr['type']]['byPurpose'][$purpose][$status]['allData'])) {
						$res[$corr['package_id']]['overall'][$corr['type']]['byPurpose'][$purpose][$status]['allData'] = array('section' => '', 'type' => $corr['type'], 'purpose' => $corr['purpose'], 'status' => $corr['status']);
					}
					if (!isset($res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['allData'])) {
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['allData'] = array('section' => $corr['section'], 'type' => $corr['type'], 'purpose' => $corr['purpose'], 'status' => $corr['status']);
					}

					if (!isset($res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['allData'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['allData'] = array('section' => '', 'type' => $corr['type'], 'purpose' => $corr['purpose']);
					}
					if (!isset($res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['allData'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['allData'] = array('section' => $corr['section'], 'type' => $corr['type'], 'purpose' => $corr['purpose']);
					}
					if (!isset($res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['allData'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['allData'] = array('section' => '', 'type' => $corr['type'], 'purpose' => $corr['purpose']);
					}
					if (!isset($res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['allData'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['allData'] = array('section' => $corr['section'], 'type' => $corr['type'], 'purpose' => $corr['purpose']);
					}

					if (isset($res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['val'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['val']++;
					}else{
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose][$status]['val'] = 1;
					}
					if (isset($res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['val'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['val']++;
					}else{
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['val'] = 1;
					}

					// for child
					if (isset($res[$corr['package_id']]['overall'][$corr['type']]['byPurpose'][$purpose][$status]['val'])) {
						$res[$corr['package_id']]['overall'][$corr['type']]['byPurpose'][$purpose][$status]['val']++;
					}else{
						$res[$corr['package_id']]['overall'][$corr['type']]['byPurpose'][$purpose][$status]['val'] = 1;
					}
					if (isset($res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['val'])) {
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['val']++;
					}else{
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose'][$purpose][$status]['val'] = 1;
					}


					if (isset($res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['total'])) {
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['total']++;
					}else{
						$res['overall']['overall'][$corr['type']]['byPurpose'][$purpose]['total'] = 1;
					}
					if (isset($res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['total'])) {
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['total']++;
					}else{
						$res['overall'][$corr['section']][$corr['type']]['byPurpose'][$purpose]['total'] = 1;
					}

					// for child
					if (isset($res[$corr['package_id']]['overall'][$corr['type']]['byPurpose'][$purpose]['total'])) {
						$res[$corr['package_id']]['overall'][$corr['type']]['byPurpose'][$purpose]['total']++;
					}else{
						$res[$corr['package_id']]['overall'][$corr['type']]['byPurpose'][$purpose]['total'] = 1;
					}
					if (isset($res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose'][$purpose]['total'])) {
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose'][$purpose]['total']++;
					}else{
						$res[$corr['package_id']][$corr['section']][$corr['type']]['byPurpose'][$purpose]['total'] = 1;
					}
				}
			}
		}
		return $res;
	}

	function getSectionInfo(){
		$res = array();
		if ($this->isWPC) {
			//$resSectionURL = $this->jogetLinkObj->jogetAppLink['api']['document_dash_list_section'].$this->projectID ?? "";
			$resSectionURL = $this->jogetLinkObj->getLink('document_dash_list_section', array($this->projectID, $this->parentProjectID));
			$resSection = $this->jogetCURL($resSectionURL);
			if (isset($resSection['data'])) {
				foreach ($resSection['data'] as $section) {
					$res['overall'][] = $section['section_code'];
				}
			}
		}
		else{
			$resSectionURL = $this->jogetLinkObj->getLink('document_dash_list_section', array('', $this->parentProjectID));
			$resSection = $this->jogetCURL($resSectionURL);
			if (isset($resSection['data'])) {
				foreach ($resSection['data'] as $section) {
					$res[$section['package_id']][] = $section['section_code'];
				}
			}
		}
		return $res;
	}

	function getDocInfo(){
		$docInfo = $this->getRegisteredDocInfo();
		$corrInfo = $this->getCorrInfo();
		$sectionFilter = $this->getSectionInfo();
		$ret = array(
			'sectionFilter' => $sectionFilter,
			'doc' => $docInfo,
			'corr' => $corrInfo
		);
		return $ret;
	}
	
	function fetchPDPCriticalRiskDriverData(){
		$ret = array();
		$monthFulltoHalf = ["January"=>"Jan","February"=>"Feb","March"=>"Mar","April"=>"Apr","May"=>"May","June"=>"Jun","July"=>"Jul","August"=>"Aug","September"=>"Sep","October"=>"Oct","November"=>"Nov","December"=>"Dec"];


		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_RA_Section'].$this->projectID ?? '';
			$res = $this->jogetCURL($url);
			if (isset($res['data'])){
				usort($res['data'], function($b, $a) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});
				if (isset($res['data'][0])){
					$raData = $res['data'][0];
					$ret['all']['all']['packageCard']['planCompleteDate'] = ($raData['planned_comp_date']) ? date('d/m/y', strtotime($raData['planned_comp_date'])) : [];
					$ret['all']['all']['packageCard']['forecastCompleteDate'] = ($raData['estimated_comp_date']) ? date('d/m/y', strtotime($raData['estimated_comp_date'])) : [];
					$ret['all']['all']['packageCard']['probMeetPlan'] = $raData['probability_meet_plan'];
					$ret['all']['all']['packageCard']['allData'] = array('year'=>$raData['year'], 'month'=> $raData['month']);
					$ret['all']['all']['sectionCard']['estimatedComplete'] = ($raData['estimated_comp_date']) ? date('d/m/y', strtotime($raData['estimated_comp_date'])) : [];
					$ret['all']['all']['sectionCard']['estimatedProgress'] = $raData['estimated_progress'];
					$ret['all']['all']['sectionChart'][$raData['section']]['probExceedTarget'] = $raData['probability_exceed_target'];
					$ret['all']['all']['sectionChart'][$raData['section']]['allData'] = array('year'=>$raData['year'], 'month'=> $raData['month']);

					$raData['area_concern'] = json_decode($raData['area_concern'], true);
					foreach ($raData['area_concern'] as $ra2){
						if($ra2['section_name'] == "") continue;
						if(isset($ret['all']['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'])){
							$ret['all']['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'] = $ret['all']['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'] + (float) $ra2['impact'];
						}
						else{
							$ret['all']['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'] = (float) $ra2['impact'];
							$ret['all']['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['allData'] = array('year'=>$raData['year'], 'month'=> $raData['month']);
						}
					}
				}

				foreach($res['data'] as $ra) {
					$ret[$ra['year']]['all']['packageCard']['planCompleteDate'] = ($ra['planned_comp_date']) ? date('d/m/y', strtotime($ra['planned_comp_date'])) : [];
					$ret[$ra['year']]['all']['packageCard']['forecastCompleteDate'] = ($ra['estimated_comp_date']) ? date('d/m/y', strtotime($ra['estimated_comp_date'])) : [];
					$ret[$ra['year']]['all']['packageCard']['probMeetPlan'] = $ra['probability_meet_plan'];
					$ret[$ra['year']]['all']['packageCard']['allData'] = array('year'=>$ra['year'], 'month'=> '');
					$ret[$ra['year']]['all']['sectionCard']['estimatedComplete'] = ($ra['estimated_comp_date']) ? date('d/m/y', strtotime($ra['estimated_comp_date'])) : [];
					$ret[$ra['year']]['all']['sectionCard']['estimatedProgress'] = $ra['estimated_progress'];
					// one here
					$ret[$ra['year']]['all']['sectionChart'][$ra['section']]['probExceedTarget'] = $ra['probability_exceed_target'];
					$ret[$ra['year']]['all']['sectionChart'][$ra['section']]['allData'] = array('year'=>$ra['year'], 'month'=> '');

					$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['packageCard']['planCompleteDate'] = ($ra['planned_comp_date']) ? date('d/m/y', strtotime($ra['planned_comp_date'])) : [];
					$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['packageCard']['forecastCompleteDate'] = ($ra['estimated_comp_date']) ? date('d/m/y', strtotime($ra['estimated_comp_date'])) : [];
					$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['packageCard']['probMeetPlan'] = $ra['probability_meet_plan'];
					$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['packageCard']['allData'] = array('year'=>$ra['year'], 'month'=> $ra['month']);
					$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['sectionCard']['estimatedComplete'] = ($ra['estimated_comp_date']) ? date('d/m/y', strtotime($ra['estimated_comp_date'])) : [];
					$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['sectionCard']['estimatedProgress'] = $ra['estimated_progress'];
					$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['sectionChart'][$ra['section']]['probExceedTarget'] = $ra['probability_exceed_target'];
					$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['sectionChart'][$ra['section']]['allData'] = array('year'=>$ra['year'], 'month'=> $ra['month']);

					$ra['area_concern'] = json_decode($ra['area_concern'], true);
					foreach ($ra['area_concern'] as $ra2){
						if($ra2['section_name'] == "") continue;
						if(isset($ret[$ra['year']]['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'])){
							$ret[$ra['year']]['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'] = $ret[$ra['year']]['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'] + (float) $ra2['impact'];
						}
						else{
							$ret[$ra['year']]['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'] = (float) $ra2['impact'];
							$ret[$ra['year']]['all']['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['allData'] = array('year'=>$ra['year'], 'month'=> '');
						}

						if(isset($ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'])){
							$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'] = $ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'] + (float) $ra2['impact'];
						}
						else{
							$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['val'] = (float) $ra2['impact'];
							$ret[$ra['year']][$monthFulltoHalf[$ra['month']]]['areaChart'][$ra2['section_name'].'-'.$ra2['activity']]['allData'] = array('year'=>$ra['year'], 'month'=> $ra['month']);
						}
					}
				}
			}
		}
		else{
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_RA'].$this->projectID ?? '';
			$res = $this->jogetCURL($url);
			if (isset($res['data'])){
				// sort by month and year
				usort($res['data'], function($b, $a) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});
				
				if (isset($res['data'][0])){
					$raData = $res['data'][0];
					$ret['all']['all']['chartPbb']['overall']['pbbCompletion'] = $raData['probability_comp_wsche'];
					$ret['all']['all']['chartPbb']['overall']['allData'] = array('year'=>$raData['year'], 'month'=> $raData['month']);
					$ret['all']['all']['card']['overall']['planProgress'] = $raData['planned_progress'];
					$ret['all']['all']['card']['overall']['actualProgress'] = $raData['actual_progress'];
					$ret['all']['all']['card']['overall']['variance'] = $raData['variance'];
					$ret['all']['all']['card']['overall']['riskScore'] = $raData['risk_score'];
					$ret['all']['all']['card']['overall']['allData'] = array('year'=>$raData['year'], 'month'=> $raData['month']);

					$val['risk_data'] = json_decode($raData['risk_data'], true);
					foreach ($val['risk_data'] as $val2) {
						$ret['all']['all']['chartPbb'][$val2['package']]['pbbCompletion'] = $val2['probability_completion'];
						$ret['all']['all']['chartPbb'][$val2['package']]['allData'] = array('year'=>$raData['year'], 'month'=> $raData['month']);
						$ret['all']['all']['tableEst'][$val2['package']]['estCompletion'] = $val2['estimated_completion'];
						$ret['all']['all']['tableEst'][$val2['package']]['allData'] = array('year'=>$raData['year'], 'month'=> $raData['month']);
					}

					$val['risk_driver'] = json_decode($raData['risk_driver'], true);
					foreach ($val['risk_driver'] as $val2) {
						$ret['all']['all']['chartRisk']['projectRisk'][$val2['risk']]['val'] = $val2['risk_impact'];						
						$ret['all']['all']['chartRisk']['projectRisk'][$val2['risk']]['allData'] = array('year'=>$raData['year'], 'month'=> $raData['month']);						
					}
				}

				foreach($res['data'] as $ra) {
					$ret[$ra['year']]['all']['chartPbb']['overall']['pbbCompletion'] = $ra['probability_comp_wsche'];
					$ret[$ra['year']]['all']['chartPbb']['overall']['allData'] = array('year'=>$ra['year'], 'month'=> '');
					$ret[$ra['year']]['all']['card']['overall']['planProgress'] = $ra['planned_progress'];
					$ret[$ra['year']]['all']['card']['overall']['actualProgress'] = $ra['actual_progress'];
					$ret[$ra['year']]['all']['card']['overall']['variance'] = $ra['variance'];
					$ret[$ra['year']]['all']['card']['overall']['riskScore'] = $ra['risk_score'];
					$ret[$ra['year']]['all']['card']['overall']['allData'] =  array('year'=>$ra['year'], 'month'=> '');
					$ret[$ra['year']][$ra['month']]['chartPbb']['overall']['pbbCompletion'] = $ra['probability_comp_wsche'];
					$ret[$ra['year']][$ra['month']]['chartPbb']['overall']['allData'] = array('year'=>$ra['year'], 'month'=> $ra['month']);
					$ret[$ra['year']][$ra['month']]['card']['overall']['planProgress'] = $ra['planned_progress'];
					$ret[$ra['year']][$ra['month']]['card']['overall']['actualProgress'] = $ra['actual_progress'];
					$ret[$ra['year']][$ra['month']]['card']['overall']['variance'] = $ra['variance'];
					$ret[$ra['year']][$ra['month']]['card']['overall']['riskScore'] = $ra['risk_score'];
					$ret[$ra['year']][$ra['month']]['card']['overall']['allData'] = array('year'=>$ra['year'], 'month'=> $ra['month']);

					$ra['risk_data'] = json_decode($ra['risk_data'], true);
					foreach ($ra['risk_data'] as $ra2) {
						$ret[$ra['year']]['all']['chartPbb'][$ra2['package']]['pbbCompletion'] = $ra2['probability_completion'];
						$ret[$ra['year']]['all']['chartPbb'][$ra2['package']]['allData'] = array('year'=>$ra['year'], 'month'=> '');
						$ret[$ra['year']][$ra['month']]['chartPbb'][$ra2['package']]['pbbCompletion'] = $ra2['probability_completion'];
						$ret[$ra['year']][$ra['month']]['chartPbb'][$ra2['package']]['allData'] = array('year'=>$ra['year'], 'month'=> $ra['month']);

						$ret[$ra['year']]['all']['tableEst'][$ra2['package']]['estCompletion'] = $ra2['estimated_completion'];
						$ret[$ra['year']]['all']['tableEst'][$ra2['package']]['allData'] = array('year'=>$ra['year'], 'month'=> '');
						$ret[$ra['year']][$ra['month']]['tableEst'][$ra2['package']]['estCompletion'] = $ra2['estimated_completion'];
						$ret[$ra['year']][$ra['month']]['tableEst'][$ra2['package']]['allData'] = array('year'=>$ra['year'], 'month'=> $ra['month']);
					}

					$ra['risk_driver'] = json_decode($ra['risk_driver'], true);
					foreach ($ra['risk_driver'] as $ra2) {
						$ret[$ra['year']][$ra['month']]['chartRisk']['projectRisk'][$ra2['risk']]['val'] = $ra2['risk_impact'];					
						$ret[$ra['year']][$ra['month']]['chartRisk']['projectRisk'][$ra2['risk']]['allData'] =  array('year'=>$ra['year'], 'month'=> $ra['month']);			
					}
				}
			}
		}
		
		return $ret;
	}

	function fetchPDPOverallDurationAnalysis(){
		// get only for this month
		$ret = array();
		if ($this->isWPC) {
			$overallData = $this->db->fetchAll("select * from risk_histogram_data where rhd_month_year= DATEFROMPARTS(YEAR(GETDATE()),MONTH(GETDATE()),1) and rhd_projectId =:0 and rhd_overall_flag = '0' order by rhd_bins asc", array($this->projectID));
		}else{
			$overallData = $this->db->fetchAll("select * from risk_histogram_data where rhd_month_year= DATEFROMPARTS(YEAR(GETDATE()),MONTH(GETDATE()),1) and rhd_overall_flag = '1' and rhd_parent_project_id = :0 order by rhd_bins asc", array($this->projectID));
		}
		$ret['rawData'] = $overallData;
		foreach ($overallData as $od) {
			$ret['bin'][] = $od['rhd_bins'];
			$ret['count'][] = $od['rhd_count'];
			$ret['cum'][] = $od['rhd_cum'];
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
		$this->fetchProgressData();

		if($this->isWPC){
			$ret = array(
				'pdp' =>  $this->fetchPDPCriticalRiskDriverData(),
				// local db
				'projInfo' => $this->projectInfo,
				'pSU' => $this->sCurveData
			);
		}
		else{
			$ret = array(
				'pdp' =>  $this->fetchPDPCriticalRiskDriverData(),
				// local db
				'riskProb' => $this->fetchRiskProbabilityData(),
				'pdpODAHistogram' => $this->fetchPDPOverallDurationAnalysis()
			);
		}
		
		return $ret;		
	}

	function date_compare_sd($a, $b)
	{
	    $t1 = strtotime($a['day_date']);
	    $t2 = strtotime($b['day_date']);
	    return $t1 - $t2;
	}   

	function getMonthfromTSRange($dtObj, $cutOffDay){
		// if higher than cutoff days will be next month data
		$realDateObj = $dtObj;
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
		$yr = $dtObj->format('Y');			
		$ret['yr'] = $yr;

		$newDay = $cutOffDay + 1;
		$newDay = ($newDay > 31) ? 31 : $newDay;

		$yrFirstDay = date($newDay.'/12/'.($yr-1));
		$yrLastDay = date($cutOffDay."/12/".$yr);
		$ret['yrFirstDay'] = $yrFirstDay;			
		$ret['yrLastDay'] = $yrLastDay;			

		return $ret;
	}

	function fetchSDData($year, $month){
		$ret = array();
		$tempCalc = array();

		$periodMth = 7;
		// to populate which data has been fetch
		$tempObj = DateTime::createFromFormat('j-n-Y', $this->cutoffDay.'-'.$month.'-'.$year);
		for ($i=0; $i <= $periodMth ; $i++) { 
			$ret['sys']['data'][$tempObj->format('Y-m')] = true;
			$tempObj->modify('-1 month');
		}
		
		$wheatherArr = array(
			'Clear' => 'count_weather_c',
			'Drizzle' => 'count_weather_d',
			'Rain' => 'count_weather_r',
			'Storm' => 'count_weather_s'
		);

		//with this format 31-08-2021
		$startDateObj= DateTime::createFromFormat('j-n-Y', $this->cutoffDay.'-'.$month.'-'.$year)->modify('-'.$periodMth.' month');
		$endDateObj = DateTime::createFromFormat('j-n-Y', $this->cutoffDay.'-'.$month.'-'.$year);
		

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_SD", array($this->projectID, $startDateObj->format("d/m/Y"), $endDateObj->format("d/m/Y")));
			$resSd = $this->jogetCURL($url);
			if (isset($resSd['data'])) {
				$dataArr = $resSd['data'];
				usort($dataArr, array($this, 'date_compare_sd'));
				foreach ($dataArr as $sd) {
					$mthCT = $this->getMonthfromTSRange(new DateTime($sd['day_date']), $this->cutoffDay);
					// weather
					if (!isset($ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['dateFrom'])) {
						$ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['dateFrom'] = $mthCT['fromDate'];
					}
					if (!isset($ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['dateTo'])) {
						$ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['dateTo'] = $mthCT['toDate'];
					}
					foreach ($wheatherArr as $k => $v) {
						if (isset($ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k])) {
							$ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k] = $ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k] + (float) $sd[$v];
						}else{
							$ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k] = (float) $sd[$v];
						}
					}

					if (!isset($ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateFrom'])) {
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateFrom'] = $mthCT['fromDate'];
					}
					if (!isset($ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateTo'])) {
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateTo'] = $mthCT['toDate'];
					}
					if (!isset($ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateFrom'])) {
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateFrom'] = $mthCT['fromDate'];
					}
					if (!isset($ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateTo'])) {
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateTo'] = $mthCT['toDate'];
					}
					// manpower
					// to add more variable

					// planned
					if (isset($ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'])) {
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = $ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] + (float) $sd['planned_manpower'];
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount']++;
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = $ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative']/$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'];
					}else{
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = (float) $sd['planned_manpower'];
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'] = 1;
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = (float) $sd['planned_manpower'];
					}
					// actual
					if (isset($ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'])) {
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'] = $ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'] + (float) $sd['count_worker'];
					}else{
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'] = (float) $sd['count_worker'];
					}
					// machinery
					// planned
					if (isset($ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'])) {
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = $ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] + (float) $sd['planned_machinery'];
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount']++;
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = $ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative']/$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'];
					}else{
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = (float) $sd['planned_machinery'];
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'] = 1;
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = (float) $sd['planned_machinery'];
					}
					// actuall
					if (isset($ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'])) {
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'] = $ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'] + (float) $sd['count_machinery'];
					}else{
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'] = (float) $sd['count_machinery'];
					}
				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->fetchLink("api","construct_dash_SD", array($childID['project_id'], $startDateObj->format("d/m/Y"), $endDateObj->format("d/m/Y")));
			$resSd = $this->jogetCURL($url);
			if (isset($resSd['data'])) {
				$dataArr = $resSd['data'];
				usort($dataArr, array($this, 'date_compare_sd'));
				foreach ($dataArr as $sd) {
					$mthCT = $this->getMonthfromTSRange(new DateTime($sd['day_date']), $this->cutoffDay);
					// weather
					foreach ($wheatherArr as $k => $v) {
						// overall
						if (isset($ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k])) {
							$ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k] = $ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k] + (float) $sd[$v];
						}else{
							$ret['overall']['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k] = (float) $sd[$v];
						}
						// child
						if (isset($ret[$childID['project_id']]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k])) {
							$ret[$childID['project_id']]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k] = $ret[$childID['project_id']]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k] + (float) $sd[$v];
						}else{
							$ret[$childID['project_id']]['overall']['weather'][$mthCT['yr']][$mthCT['mth']]['val'][$k] = (float) $sd[$v];
						}
					}
					/////OVERALL////
					if (!isset($ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateFrom'])) {
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateFrom'] = $mthCT['fromDate'];
					}
					if (!isset($ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateTo'])) {
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateTo'] = $mthCT['toDate'];
					}
					if (!isset($ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateFrom'])) {
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateFrom'] = $mthCT['fromDate'];
					}
					if (!isset($ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateTo'])) {
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateTo'] = $mthCT['toDate'];
					}
					// manpower
					// planned
					if (isset($ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'])) {
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = $ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] + (float) $sd['planned_manpower'];
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount']++;
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = $ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative']/$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'];
					}else{
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = (float) $sd['planned_manpower'];
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'] = 1;
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = (float) $sd['planned_manpower'];
					}
					// actual
					if (isset($ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'])) {
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'] = $ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'] + (float) $sd['count_worker'];
					}else{
						$ret['overall']['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'] = (float) $sd['count_worker'];
					}
					// machinery
					// planned
					if (isset($ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'])) {
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = $ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] + (float) $sd['planned_machinery'];
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount']++;
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = $ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative']/$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'];
					}else{
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = (float) $sd['planned_machinery'];
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'] = 1;
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = (float) $sd['planned_machinery'];
					}
					// actuall
					if (isset($ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'])) {
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'] = $ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'] + (float) $sd['count_machinery'];
					}else{
						$ret['overall']['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'] = (float) $sd['count_machinery'];
					}
					/////CHILD////
					if (!isset($ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateFrom'])) {
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateFrom'] = $mthCT['fromDate'];
					}
					if (!isset($ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateTo'])) {
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['dateTo'] = $mthCT['toDate'];
					}
					if (!isset($ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateFrom'])) {
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateFrom'] = $mthCT['fromDate'];
					}
					if (!isset($ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateTo'])) {
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['dateTo'] = $mthCT['toDate'];
					}
					// manpower
					// planned
					if (isset($ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'])) {
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = $ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] + (float) $sd['planned_manpower'];
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount']++;
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = $ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative']/$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'];
					}else{
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = (float) $sd['planned_manpower'];
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'] = 1;
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = (float) $sd['planned_manpower'];
					}
					// actual
					if (isset($ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'])) {
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'] = $ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'] + (float) $sd['count_worker'];
					}else{
						$ret[$childID['project_id']]['overall']['manpower'][$mthCT['yr']][$mthCT['mth']]['actual'] = (float) $sd['count_worker'];
					}
					// machinery
					// planned
					if (isset($ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'])) {
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = $ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] + (float) $sd['planned_machinery'];
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount']++;
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = $ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative']/$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'];
					}else{
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['average'] = (float) $sd['planned_machinery'];
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['recCount'] = 1;
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['planned']['cumulative'] = (float) $sd['planned_machinery'];
					}
					// actuall
					if (isset($ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'])) {
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'] = $ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'] + (float) $sd['count_machinery'];
					}else{
						$ret[$childID['project_id']]['overall']['machinery'][$mthCT['yr']][$mthCT['mth']]['actual'] = (float) $sd['count_machinery'];
					}
				}
			}
		}
		return $ret;
	}

	function getACSInfo(){
		if (!$this->contractInfo) return;

		$ret = array();
		if ($this->isWPC) {
			if (!isset($this->contractInfo['overall']['contract_no'])) return;
			$contractId = $this->contractInfo['overall']['contract_no'] ?? "";
			$contractEncode = urlencode($contractId);

			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_acs", array($contractEncode, $this->projectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
					$t1 = strtotime(str_replace('/', '-', $a['approved_acs_date']));
				    $t2 = strtotime(str_replace('/', '-', $b['approved_acs_date']));
				    return $t1 - $t2;
				});

				$acsNo = array();
				foreach ($res['data'] as $vo) {
					if($vo['acs_no']){
						$acsNo[] = $vo['acs_no'];
					}
				}

				$ret['overall']['cardACS']['allData'] = array('contract_id'=>$contractId, 'dateFrom' => '', 'dateTo' => '');
				$ret['overall']['cardACS']['acsNo'] = $acsNo;
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			if (!isset($this->contractInfo[$childID['project_id']]['contract_no'])) continue;
			$contractId = $this->contractInfo[$childID['project_id']]['contract_no'] ?? "";
			$contractEncode = urlencode($contractId);

			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_acs", array($contractEncode, $childID['project_id']));
			$res = $this->jogetCURL($url);
			
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime(str_replace('/', '-', $a['approved_acs_date']));
				    $t2 = strtotime(str_replace('/', '-', $b['approved_acs_date']));
				    return $t1 - $t2;
				});

				$acsNo = array();
				foreach ($res['data'] as $vo) {
					if($vo['acs_no']){
						$acsNo[] = $vo['acs_no'];

						if(isset($ret['overallProject']['ttlACS'][$childID['project_name']]['count'])){
							$ret['overallProject']['ttlACS'][$childID['project_name']]['count']++;
						}
						else{
							$ret['overallProject']['ttlACS'][$childID['project_name']]['count'] = 1;
		
						}

						$vo['approved_nett_acs_amount'] = str_replace(",", "", $vo['approved_nett_acs_amount']);
						if(isset($ret['overallProject']['ttlACS'][$childID['project_name']]['totalAmountBasedOnPackage'])){
							$ret['overallProject']['ttlACS'][$childID['project_name']]['totalAmountBasedOnPackage'] = $ret['overallProject']['ttlACS'][$childID['project_name']]['totalAmountBasedOnPackage'] + (float) $vo['approved_nett_acs_amount'];;
						}
						else{
							$ret['overallProject']['ttlACS'][$childID['project_name']]['totalAmountBasedOnPackage'] = (float) $vo['approved_nett_acs_amount'];
		
						}
					}
				}

				$ret[$childID['project_id']]['cardACS']['allData'] = array('contract_id'=>$contractId, 'dateFrom' => '', 'dateTo' => '');
				$ret[$childID['project_id']]['cardACS']['acsNo'] = $acsNo;
			}
		}
		
		return $ret;
	}

	function getVOInfo(){
		if (!$this->contractInfo) return;

		$ret = array();
		if ($this->isWPC) {
			if (!isset($this->contractInfo['overall']['contract_no'])) return;
			$contractId = $this->contractInfo['overall']['contract_no'] ?? "";
			$contractEncode = urlencode($contractId);

			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_vo", array($contractEncode, $this->projectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
					$t1 = strtotime(str_replace('/', '-', $a['approved_vo_date']));
				    $t2 = strtotime(str_replace('/', '-', $b['approved_vo_date']));
				    return $t1 - $t2;
				});

				$voNo = array();
				foreach ($res['data'] as $vo) {
					if($vo['vo_no']){
						$voNo[] = $vo['vo_no'];
					}
				}
				$ret['overall']['cardVO']['allData'] = array('contract_id'=>$contractId, 'dateFrom' => '', 'dateTo' => '');
				$ret['overall']['cardVO']['voNo'] = $voNo;
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			if (!isset($this->contractInfo[$childID['project_id']]['contract_no'])) continue;
			$contractId = $this->contractInfo[$childID['project_id']]['contract_no'] ?? "";
			$contractEncode = urlencode($contractId);

			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_vo", array($contractEncode, $childID['project_id']));
			$res = $this->jogetCURL($url);

			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime(str_replace('/', '-', $a['approved_vo_date']));
				    $t2 = strtotime(str_replace('/', '-', $b['approved_vo_date']));
				    return $t1 - $t2;
				});

				$voNo = array();
				foreach ($res['data'] as $vo) {
					if($vo['vo_no']){
						$voNo[] = $vo['vo_no'];

						if(isset($ret['overallProject']['ttlVO'][$childID['project_name']]['count'])){
							$ret['overallProject']['ttlVO'][$childID['project_name']]['count']++;
						}
						else{
							$ret['overallProject']['ttlVO'][$childID['project_name']]['count'] = 1;
		
						}

						$vo['approved_nett_vo_amount'] = str_replace(",", "", $vo['approved_nett_vo_amount']);
						if(isset($ret['overallProject']['ttlVO'][$childID['project_name']]['totalAmountBasedOnPackage'])){
							$ret['overallProject']['ttlVO'][$childID['project_name']]['totalAmountBasedOnPackage'] = $ret['overallProject']['ttlVO'][$childID['project_name']]['totalAmountBasedOnPackage'] + (float) $vo['approved_nett_vo_amount'];
						}
						else{
							$ret['overallProject']['ttlVO'][$childID['project_name']]['totalAmountBasedOnPackage'] = (float) $vo['approved_nett_vo_amount'];
		
						}
					}
				}
				
				$ret[$childID['project_id']]['cardVO']['allData'] = array('contract_id'=>$contractId, 'dateFrom' => '', 'dateTo' => '');
				$ret[$childID['project_id']]['cardVO']['voNo'] = $voNo;
			}
		}
		
		return $ret;
	}

	function getEOTInfo(){
		if (!$this->contractInfo) return;

		$ret = array();
		if ($this->isWPC) {
			if (!isset($this->contractInfo['overall']['contract_no'])) return;
			$contractId = $this->contractInfo['overall']['contract_no'] ?? "";
			$contractEncode = urlencode($contractId);

			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_eot", array($contractEncode, $this->projectID));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
					$t1 = strtotime(str_replace('/', '-', $a['approved_eot_date']));
				    $t2 = strtotime(str_replace('/', '-', $b['approved_eot_date']));
				    return $t1 - $t2;
				});

				$eotNo = array();
				foreach ($res['data'] as $eot) {
					if($eot['eot_no']){
						$eotNo[] = $eot['eot_no'];
					}
				}

				$ret['overall']['cardEOT']['allData'] = array('contract_id'=>$contractId, 'dateFrom' => '', 'dateTo' => '');

				$eotString = implode(',', $eotNo);
				$ret['overall']['cardEOT']['eotNo'] = $eotString;
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			if (!isset($this->contractInfo[$childID['project_id']]['contract_no'])) continue;
			$contractId = $this->contractInfo[$childID['project_id']]['contract_no'] ?? "";
			$contractEncode = urlencode($contractId);

			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_eot", array($contractEncode, $childID['project_id']));
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime(str_replace('/', '-', $a['approved_eot_date']));
				    $t2 = strtotime(str_replace('/', '-', $b['approved_eot_date']));
				    return $t1 - $t2;
				});
				$eotNo = array();
				foreach ($res['data'] as $eot) {
					if($eot['eot_no']){
						$eotNo[] = $eot['eot_no'];
					}
				}
				
				$ret[$childID['project_id']]['cardEOT']['allData'] = array('contract_id'=>$contractId, 'dateFrom' => '', 'dateTo' => '');

				$eotString = implode(',', $eotNo);
				$ret[$childID['project_id']]['cardEOT']['eotNo'] = $eotString;
			}
		}
		
		return $ret;
	}

	function getClaimInfo(){
		if (!$this->contractInfo) return;

		$ret = array();
		if ($this->isWPC) {
			if (!isset($this->contractInfo['overall']['contract_no'])) return;
			$contractId = $this->contractInfo['overall']['contract_no'] ?? "";
			$contractEncode = urlencode($contractId);

			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_ipc", array($contractEncode, $this->projectID));
			$resSd = $this->jogetCURL($url);
			if (isset($resSd['data'])) {
				usort($resSd['data'], function ($b, $a) {
				    $t1 = strtotime(str_replace('/', '-', $a['dateCreated']));
				    $t2 = strtotime(str_replace('/', '-', $b['dateCreated']));
				    return $t1 - $t2;
				});

				if (isset($resSd['data'][0])) {
					$claimData = $resSd['data'][0];

					$ret['overall']['card']['allData'] = array('id'=>$claimData['id'], 'dateFrom' => '', 'dateTo' => '');
					$ret['overall']['card']['IPCNo'] = $claimData['ipc_no'];
					$ret['overall']['card']['RetentionSum'] = $claimData['retention_sum'];
					$ret['overall']['card']['LAD'] = $claimData['lad'];
					$ret['overall']['card']['IPCCurrentAmount'] = $claimData['current_ipc_amount'];
					$ret['overall']['card']['WorkFrom'] = date('d/m/Y', strtotime(str_replace('/', '-', $claimData['work_done_from'])));
					$ret['overall']['card']['WorkTo'] = date('d/m/Y', strtotime(str_replace('/', '-', $claimData['work_done_to'])));
				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			if (!isset($this->contractInfo[$childID['project_id']]['contract_no'])) continue;
			$contractId = $this->contractInfo[$childID['project_id']]['contract_no'] ?? "";
			$contractEncode = urlencode($contractId);

			$url = $this->jogetLinkObj->fetchLink("api","finance_dash_ipc", array($contractEncode, $childID['project_id']));
			$resSd = $this->jogetCURL($url);
			if (isset($resSd['data'])) {
				usort($resSd['data'], function ($b, $a) {
				    $t1 = strtotime(str_replace('/', '-', $a['dateCreated']));
				    $t2 = strtotime(str_replace('/', '-', $b['dateCreated']));
				    return $t1 - $t2;
				});

				if (isset($resSd['data'][0])) {
					$claimData = $resSd['data'][0];

					$ret[$childID['project_id']]['card']['allData'] = array('id'=>$claimData['id'], 'dateFrom' => '', 'dateTo' => '');
					$ret[$childID['project_id']]['card']['IPCNo'] = $claimData['ipc_no'];
					$ret[$childID['project_id']]['card']['RetentionSum'] = $claimData['retention_sum'];
					$ret[$childID['project_id']]['card']['LAD'] = $claimData['lad'];
					$ret[$childID['project_id']]['card']['IPCCurrentAmount'] = $claimData['current_ipc_amount'];
					$ret[$childID['project_id']]['card']['WorkFrom'] = date('d/m/Y', strtotime(str_replace('/', '-', $claimData['work_done_from'])));
					$ret[$childID['project_id']]['card']['WorkTo'] = date('d/m/Y', strtotime(str_replace('/', '-', $claimData['work_done_to'])));

					$claimData['cumulative_ipc_amount'] = str_replace(",", "", $claimData['cumulative_ipc_amount']);
					if(isset($ret['overallProject']['ttlIPC'][$childID['project_name']]['totalAmountBasedOnPackage'])){
						$ret['overallProject']['ttlIPC'][$childID['project_name']]['totalAmountBasedOnPackage'] = $ret['overallProject']['ttlIPC'][$childID['project_name']]['totalAmountBasedOnPackage'] + (float) $claimData['cumulative_ipc_amount'];;
					}
					else{
						$ret['overallProject']['ttlIPC'][$childID['project_name']]['totalAmountBasedOnPackage'] = (float) $claimData['cumulative_ipc_amount'];
					}
				}

				foreach ($resSd['data'] as $ipc) {
					if(isset($ret['overallProject']['ttlIPC'][$childID['project_name']]['count'])){
						$ret['overallProject']['ttlIPC'][$childID['project_name']]['count']++;
					}
					else{
						$ret['overallProject']['ttlIPC'][$childID['project_name']]['count'] = 1;
					}
				}
			}
		}

		return $ret;
	}


	function fetchContractData(){
		// take only latest one
		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['finance_dash_contract'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				$data = $res['data'];
				usort($data, function ($b, $a) {
				    $t1 = strtotime(str_replace('/', '-', $a['dateCreated']));
				    $t2 = strtotime(str_replace('/', '-', $b['dateCreated']));
				    return $t1 - $t2;
				});

				if (isset($data[0])) {
					$this->contractInfo[$this->projectID] = $data[0];
					$this->contractInfo[$this->projectID]['allData'] = array('id'=>$data[0]['id'], 'dateFrom' => '', 'dateTo' => '');
				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['finance_dash_contract'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				$data = $res['data'];
				usort($data, function ($b, $a) {
				    $t1 = strtotime(str_replace('/', '-', $a['dateCreated']));
				    $t2 = strtotime(str_replace('/', '-', $b['dateCreated']));
				    return $t1 - $t2;
				});
				if (isset($data[0])) {
					$co = $data[0];
					$this->contractInfo[$childID['project_id']] = $data[0];
					$this->contractInfo[$childID['project_id']]['allData'] = array('id'=>$data[0]['id'], 'dateFrom' => '', 'dateTo' => '');

					if($co['original_contract_sum']){
						$co['original_contract_sum'] = str_replace(",", "", $co['original_contract_sum']);
						if(isset($this->contractInfo['overallProject']['ttlContractSum']['ttlAll'])){
							$this->contractInfo['overallProject']['ttlContractSum']['ttlAll'] = $this->contractInfo['overallProject']['ttlContractSum']['ttlAll'] + (float) $co['original_contract_sum'];
						}
						else{
							$this->contractInfo['overallProject']['ttlContractSum']['ttlAll'] = (float) $co['original_contract_sum'];
						}

						$this->contractInfo['overallProject']['ttlContractSum'][$childID['project_name']] = (float) $co['original_contract_sum'];
					}

					if($co['revised_contract_sum']){
						$co['revised_contract_sum'] = str_replace(",", "", $co['revised_contract_sum']);
						if(isset($this->contractInfo['overallProject']['ttlRevised']['ttlAll'])){
							$this->contractInfo['overallProject']['ttlRevised']['ttlAll'] = $this->contractInfo['overallProject']['ttlRevised']['ttlAll'] + (float) $co['revised_contract_sum'];
						}
						else{
							$this->contractInfo['overallProject']['ttlRevised']['ttlAll'] = (float) $co['revised_contract_sum'];
						}

						$this->contractInfo['overallProject']['ttlRevised'][$childID['project_name']] = (float) $co['revised_contract_sum'];
					}

					if($co['cumulative_approved_vo_amount']){
						$co['cumulative_approved_vo_amount'] = str_replace(",", "", $co['cumulative_approved_vo_amount']);
						if(isset($this->contractInfo['overallProject']['ttlVO']['ttlAll']['totalAmountBasedOnAll'])){
							$this->contractInfo['overallProject']['ttlVO']['ttlAll']['totalAmountBasedOnAll'] = $this->contractInfo['overallProject']['ttlVO']['ttlAll']['totalAmountBasedOnAll'] + (float) $co['cumulative_approved_vo_amount'];
						}
						else{
							$this->contractInfo['overallProject']['ttlVO']['ttlAll']['totalAmountBasedOnAll'] = (float) $co['cumulative_approved_vo_amount'];
						}
					}

					if($co['cumulative_approved_acs_amount']){
						$co['cumulative_approved_acs_amount'] = str_replace(",", "", $co['cumulative_approved_acs_amount']);
						if(isset($this->contractInfo['overallProject']['ttlACS']['ttlAll']['totalAmountBasedOnAll'])){
							$this->contractInfo['overallProject']['ttlACS']['ttlAll']['totalAmountBasedOnAll'] = $this->contractInfo['overallProject']['ttlACS']['ttlAll']['totalAmountBasedOnAll'] + (float) $co['cumulative_approved_acs_amount'];
						}
						else{
							$this->contractInfo['overallProject']['ttlACS']['ttlAll']['totalAmountBasedOnAll'] = (float) $co['cumulative_approved_acs_amount'];
						}
					}
					
					if($co['cumulative_ipc_amount']){
						$co['cumulative_ipc_amount'] = str_replace(",", "", $co['cumulative_ipc_amount']);
						if(isset($this->contractInfo['overallProject']['ttlIPC']['ttlAll']['totalAmountBasedOnAll'])){
							$this->contractInfo['overallProject']['ttlIPC']['ttlAll']['totalAmountBasedOnAll'] = $this->contractInfo['overallProject']['ttlIPC']['ttlAll']['totalAmountBasedOnAll'] + (float) $co['cumulative_ipc_amount'];
						}
						else{
							$this->contractInfo['overallProject']['ttlIPC']['ttlAll']['totalAmountBasedOnAll'] = (float) $co['cumulative_ipc_amount'];
						}
					}
				}
				
			}
		}
		return;
	}

	function processProjectData($data, $yr, $mth, &$ret){
		$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");

		$periodMth = 7;
		$tempObj = DateTime::createFromFormat('j-n-Y', $this->cutoffDay.'-'.$mth.'-'.$yr);
		
		$projId = $data['project_id'];
		for ($i=0; $i <= $periodMth ; $i++) { 
			// format date
			$m = $tempObj->format('n');
			$y = $tempObj->format('Y');
			$ret['overall'][$y][$m][$data['project_id']] = $data;
			$ret['overall'][$y][$m][$data['project_id']]['end_date'] = (isset($data['end_date'])) ? date('d-m-Y', strtotime($data['end_date'])) : '';
			$ret['overall'][$y][$m][$data['project_id']]['start_date'] = (isset($data['start_date'])) ? date('d-m-Y', strtotime($data['start_date'])) : '';
			
			$ret[$projId][$y][$m][$data['project_id']] = $data;
			$ret[$projId][$y][$m][$data['project_id']]['end_date'] = (isset($data['end_date'])) ? date('d-m-Y', strtotime($data['end_date'])) : '';
			$ret[$projId][$y][$m][$data['project_id']]['start_date'] = (isset($data['start_date'])) ? date('d-m-Y', strtotime($data['start_date'])) : '';
			
			// get contract value
			$original_contract_sum = (isset($this->contractInfo[$data['project_id']]['original_contract_sum'])) ? str_replace(",", "", $this->contractInfo[$data['project_id']]['original_contract_sum']) : 0; 
			$ret['overall'][$y][$m][$data['project_id']]['original_contract_sum'] = $original_contract_sum;
			$ret[$projId][$y][$m][$data['project_id']]['original_contract_sum'] = $original_contract_sum;
			
			// elapse duration
			if ($mth == date('m') && $yr == date('Y')) {
				$fromDt = time();
			}else{
				$fromDt = $tempObj->getTimestamp();
			}
			$startDt = strtotime($data['start_date']);
			$endDt = strtotime($data['end_date']);
			$timeElapse = $fromDt - $startDt;
			$remainDur = $endDt - $fromDt;

			$ret['overall'][$y][$m][$data['project_id']]['time_elapse'] = ($timeElapse > 0) ? round($timeElapse / (60 * 60 * 24)) : 0;
			$ret['overall'][$y][$m][$data['project_id']]['remain_dur'] = ($remainDur > 0) ? round($remainDur / (60 * 60 * 24)) : 0;

			$ret[$projId][$y][$m][$data['project_id']]['time_elapse'] = ($timeElapse > 0) ? round($timeElapse / (60 * 60 * 24)) : 0;
			$ret[$projId][$y][$m][$data['project_id']]['remain_dur'] = ($remainDur > 0) ? round($remainDur / (60 * 60 * 24)) : 0;

			if ($this->isWPC) {
				$planned = (isset($this->sCurveData['overall']['overall']['card'][$y][$monthHalftext[$m]]['phyPlan'])) ? (float) $this->sCurveData['overall']['overall']['card'][$y][$monthHalftext[$m]]['phyPlan'] : 0;
				$act = (isset($this->sCurveData['overall']['overall']['card'][$y][$monthHalftext[$m]]['phyAct'])) ? (float) $this->sCurveData['overall']['overall']['card'][$y][$monthHalftext[$m]]['phyAct'] : 0;
			}else{
				$planned = (isset($this->sCurveData[$projId]['overall']['card'][$y][$monthHalftext[$m]]['phyPlan'])) ? (float) $this->sCurveData[$projId]['overall']['card'][$y][$monthHalftext[$m]]['phyPlan'] : 0;
				$act = (isset($this->sCurveData[$projId]['overall']['card'][$y][$monthHalftext[$m]]['phyAct'])) ? (float) $this->sCurveData[$projId]['overall']['card'][$y][$monthHalftext[$m]]['phyAct'] : 0;
			}
			$ret['overall'][$y][$m][$data['project_id']]['planned_progress'] = number_format($planned, 2);
			$ret['overall'][$y][$m][$data['project_id']]['actual_progress'] = number_format( $act, 2);
			
			$ret[$projId][$y][$m][$data['project_id']]['planned_progress'] = number_format($planned, 2);
			$ret[$projId][$y][$m][$data['project_id']]['actual_progress'] = number_format( $act, 2);
			
			$tempObj->modify('-1 month');
		}
		return $ret;
	}

	function fetchProjectData($yr, $mth){
		$ret = array();
		$this->fetchContractData();
		if ($this->isWPC) {
			$this->processProjectData($this->projectInfo, $yr, $mth, $ret);
		}
		
		foreach ($this->childProjectInfo as $childArr) {
			$this->processProjectData($childArr, $yr, $mth, $ret);
		}
		return $ret;
	}

	function fetchProgressData(){
		$this->sCurveData = $this->getProjectSummaryInfo();
		return;
	}

	function getTimeInfo($yr = false, $mth = false){
		$yr = ($yr) ? $yr : date('Y');
		$mth = ($mth) ? $mth : date('m');
		$this->fetchProgressData();
		$ret = array(
			'sd' =>  $this->fetchSDData($yr, $mth),
			'info' => $this->fetchProjectData($yr, $mth),
			'progress' => $this->sCurveData
		);
		return $ret;
	}

	function getCostInfo(){
		$ret = array();

		$this->fetchContractData();

		if(isset($this->contractInfo[$this->projectID])){
			$this->contractInfo['overall'] = $this->contractInfo[$this->projectID];
			unset($this->contractInfo[$this->projectID]);
		}

		// if got contract id then check the claim related
		if ($this->contractInfo) {
			$claimData = $this->getClaimInfo();
			$eotData = $this->getEOTInfo();
			$voData = $this->getVOInfo();
			$acsData = $this->getACSInfo();
		}

		$ret = array(
			'contractInfo' => $this->contractInfo,
			'claimInfo' => $claimData,
			'eotInfo' => $eotData,
			'voInfo' => $voData,
			'acsInfo' => $acsData,
		);
		return $ret;
	}

	function fetchIFData(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_IR'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				foreach($res['data'] as $inc){
					$incDate = str_replace('/','-',$inc['incident_date']);
					$mthCT = $this->getMonthfromTSRange(new DateTime($incDate), $this->cutoffDay);

					if($inc['incident_related'] == 'No') continue;
					// for conOp filter
					if (!isset($ret['overall']['all']['all']['chartCategory'][$inc['category']]['allData'])) {
						$ret['overall']['all']['all']['chartCategory'][$inc['category']]['allData'] = array('incDateFrom'=>'', 'incDateTo' => '', 'incCat'=>$inc['category']);
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['allData'] = array('incDateFrom'=>$mthCT['yrFirstDay'], 'incDateTo' => $mthCT['yrLastDay'], 'incCat'=>$inc['category']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['allData'] = array('incDateFrom'=>$mthCT['fromDate'], 'incDateTo' => $mthCT['toDate'], 'incCat'=>$inc['category']);
					}

					if(isset($ret['overall']['all']['all']['chartCategory'][$inc['category']]['val'])){
						$ret['overall']['all']['all']['chartCategory'][$inc['category']]['val']++;
					}
					else{
						$ret['overall']['all']['all']['chartCategory'][$inc['category']]['val'] = 1;
					}
					if(isset($ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['val'])){
						$ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['val']++;
					}
					else{
						$ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['val'] = 1;
					}
					if(isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['val'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['val']++;
					}
					else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['val'] = 1;
					}

					if($inc['category'] == 'Traffic Accident'){

						// for conOp filter
						if (!isset($ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['allData'])) {
							$ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['allData'] = array('incDateFrom'=>'', 'incDateTo' => '', 'incCat'=>$inc['category']);
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['allData'])) {
							$ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['allData'] = array('incDateFrom'=>$mthCT['yrFirstDay'], 'incDateTo' => $mthCT['yrLastDay'], 'incCat'=>$inc['category']);
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['allData'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['allData'] = array('incDateFrom'=>$mthCT['fromDate'], 'incDateTo' => $mthCT['toDate'], 'incCat'=>$inc['category']);
						}

						if(isset($ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['val'])){
							$ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['val']++;
						}
						else{
							$ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['val'] = 1;
						}
						if(isset($ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['val'])){
							$ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['val']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['val'] = 1;
						}
						if(isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['val'])){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['val']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['val'] = 1;
						}
					}
				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_IR'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				foreach($res['data'] as $inc){
					$incDate = str_replace('/','-',$inc['incident_date']);
					$mthCT = $this->getMonthfromTSRange(new DateTime($incDate), $this->cutoffDay);

					if($inc['incident_related'] == 'No') continue;

					// for conOp filter
					if (!isset($ret['overall']['all']['all']['chartCategory'][$inc['category']]['allData'])) {
						$ret['overall']['all']['all']['chartCategory'][$inc['category']]['allData'] = array('incDateFrom'=>'', 'incDateTo' => '', 'incCat'=>$inc['category']);
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['allData'] = array('incDateFrom'=> $mthCT['yrFirstDay'], 'incDateTo' => $mthCT['yrLastDay'], 'incCat'=>$inc['category']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['allData'] = array('incDateFrom'=> $mthCT['fromDate'], 'incDateTo' => $mthCT['toDate'], 'incCat'=>$inc['category']);
					}

					if(isset($ret['overall']['all']['all']['chartCategory'][$inc['category']]['val'])){
						$ret['overall']['all']['all']['chartCategory'][$inc['category']]['val']++;
					}
					else{
						$ret['overall']['all']['all']['chartCategory'][$inc['category']]['val'] = 1;
					}
					if(isset($ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['val'])){
						$ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['val']++;
					}
					else{
						$ret['overall'][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['val'] = 1;
					}
					if(isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['val'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['val']++;
					}
					else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['val'] = 1;
					}

					//-------------START CHILD-------------//
					// for conOp filter
					if (!isset($ret[$childID['project_id']]['all']['all']['chartCategory'][$inc['category']]['allData'])) {
						$ret[$childID['project_id']]['all']['all']['chartCategory'][$inc['category']]['allData'] = array('incDateFrom'=>'', 'incDateTo' => '', 'incCat'=>$inc['category']);
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['allData'] = array('incDateFrom'=> $mthCT['yrFirstDay'], 'incDateTo' => $mthCT['yrLastDay'], 'incCat'=>$inc['category']);
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['allData'] = array('incDateFrom'=>$mthCT['fromDate'], 'incDateTo' => $mthCT['toDate'], 'incCat'=>$inc['category']);
					}

					if(isset($ret[$childID['project_id']]['all']['all']['chartCategory'][$inc['category']]['val'])){
						$ret[$childID['project_id']]['all']['all']['chartCategory'][$inc['category']]['val']++;
					}
					else{
						$ret[$childID['project_id']]['all']['all']['chartCategory'][$inc['category']]['val'] = 1;
					}
					if(isset($ret[$childID['project_id']][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['val'])){
						$ret[$childID['project_id']][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['val']++;
					}
					else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['chartCategory'][$inc['category']]['val'] = 1;
					}
					if(isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['val'])){
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['val']++;
					}
					else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartCategory'][$inc['category']]['val'] = 1;
					}
					//--------------END CHILD--------------//

					if($inc['category'] == 'Traffic Accident'){
						// for conOp filter
						if (!isset($ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['allData'])) {
							$ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['allData'] = array('incDateFrom'=>'', 'incDateTo' => '', 'incCat'=>$inc['category']);
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['allData'])) {
							$ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['allData'] = array('incDateFrom'=>$mthCT['yrFirstDay'], 'incDateTo' => $mthCT['yrLastDay'], 'incCat'=>$inc['category']);
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['allData'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['allData'] = array('incDateFrom'=>$mthCT['fromDate'], 'incDateTo' => $mthCT['toDate'], 'incCat'=>$inc['category']);
						}

						if(isset($ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['val'])){
							$ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['val']++;
						}
						else{
							$ret['overall']['all']['all']['chartLocation'][$inc['incident_location']]['val'] = 1;
						}
						if(isset($ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['val'])){
							$ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['val']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['val'] = 1;
						}
						if(isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['val'])){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['val']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['val'] = 1;
						}

						//--------------START CHILD--------------//
						// for conOp filter
						if (!isset($ret[$childID['project_id']]['all']['all']['chartLocation'][$inc['incident_location']]['allData'])) {
							$ret[$childID['project_id']]['all']['all']['chartLocation'][$inc['incident_location']]['allData'] = array('incDateFrom'=>'', 'incDateTo' => '', 'incCat'=>$inc['category']);
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['allData'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['allData'] = array('incDateFrom'=>$mthCT['yrFirstDay'], 'incDateTo' => $mthCT['yrLastDay'], 'incCat'=>$inc['category']);
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['allData'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['allData'] = array('incDateFrom'=>$mthCT['fromDate'], 'incDateTo' => $mthCT['toDate'], 'incCat'=>$inc['category']);
						}

						if(isset($ret[$childID['project_id']]['all']['all']['chartLocation'][$inc['incident_location']]['val'])){
							$ret[$childID['project_id']]['all']['all']['chartLocation'][$inc['incident_location']]['val']++;
						}
						else{
							$ret[$childID['project_id']]['all']['all']['chartLocation'][$inc['incident_location']]['val'] = 1;
						}
						if(isset($ret[$childID['project_id']][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['val'])){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['val']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['chartLocation'][$inc['incident_location']]['val'] = 1;
						}
						if(isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['val'])){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['val']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartLocation'][$inc['incident_location']]['val'] = 1;
						}
						//--------------END CHILD--------------//

					}
				}
			}
		}

		return $ret;
	}

	function fetchSMHData(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_SMH'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function($a, $b) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});

				if($res['data'] && isset($res['data'][count($res['data'])-1])){
					$smhData = $res['data'][count($res['data'])-1];
					$ret['overall']['all']['all']['cardCumulWithoutLti'] = (float) $smhData['tmh_wolti'];
					$ret['overall']['all']['all']['allData'] = array('year'=>$smhData['year'], 'month'=> $smhData['month']);
				}

				foreach($res['data'] as $smh){
					$ret['overall'][$smh['year']]['all']['cardCumulWithoutLti'] = (float) $smh['tmh_wolti'];
					$ret['overall'][$smh['year']]['all']['allData'] = array('year'=>$smh['year'], 'month'=> $smh['month']);

					$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['cardCumulWithoutLti'] = (float) $smh['tmh_wolti'];
					$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['allData'] = array('year'=>$smh['year'], 'month'=> $smh['month']);
					
					if (!isset($ret['overall']['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'])) {
						$ret['overall']['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'] =  array('year'=>$smh['year'], 'month'=> $smh['month']);
					}
					if (!isset($ret['overall'][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'])) {
						$ret['overall'][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'] =  array('year'=>$smh['year'], 'month'=> $smh['month']);
					}
					if (!isset($ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'])) {
						$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'] =  array('year'=>$smh['year'], 'month'=> $smh['month']);
					}

					$ret['overall']['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = (float) $smh['monthly_mh_wolti'];
					$ret['overall'][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = (float) $smh['monthly_mh_wolti'];
					$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = (float) $smh['monthly_mh_wolti'];

				}
			}
		}

		$keyArrToSort = array(
			'all'
		); // year

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_SMH'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function($a, $b) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});

				if($res['data'] && isset($res['data'][count($res['data'])-1])){
					$smhData = $res['data'][count($res['data'])-1];

					if(isset($ret['overall']['all']['all']['cardCumulWithoutLti'])){
						$ret['overall']['all']['all']['cardCumulWithoutLti'] = $ret['overall']['all']['all']['cardCumulWithoutLti'] + (float) $smhData['tmh_wolti'];
					}
					else{
						$ret['overall']['all']['all']['cardCumulWithoutLti'] = (float) $smhData['tmh_wolti'];
					}

					if(isset($ret['overall'][$smhData['year']]['all']['cardCumulWithoutLti'])){
						$ret['overall'][$smhData['year']]['all']['cardCumulWithoutLti'] = $ret['overall'][$smhData['year']]['all']['cardCumulWithoutLti'] + (float) $smhData['tmh_wolti'];
					}
					else{
						$ret['overall'][$smhData['year']]['all']['cardCumulWithoutLti'] = (float) $smhData['tmh_wolti'];
					}

					//-----------------START CHILD--------------------//
					$ret[$childID['project_id']]['all']['all']['cardCumulWithoutLti'] = (float) $smhData['tmh_wolti'];
					$ret[$childID['project_id']]['all']['all']['allData'] = array('year'=>$smhData['year'], 'month'=> $smhData['month']);
					//-----------------END CHILD--------------------//
				}

				foreach($res['data'] as $smh){
					if(!in_array($smh['year'], $keyArrToSort)){
						$keyArrToSort[] = $smh['year'];
					}

					if(isset($ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['cardCumulWithoutLti'])){
						$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['cardCumulWithoutLti'] = $ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['cardCumulWithoutLti'] + (float) $smh['tmh_wolti'];
					}
					else{
						$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['cardCumulWithoutLti'] = (float) $smh['tmh_wolti'];
					}
					$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['allData'] = array('year'=>$smh['year'], 'month'=> $smh['month']);	

					//--------------START CHILD---------------//
					$ret[$childID['project_id']][$smh['year']]['all']['cardCumulWithoutLti'] = (float) $smh['tmh_wolti'];
					$ret[$childID['project_id']][$smh['year']]['all']['allData'] = array('year'=>$smh['year'], 'month'=> $smh['month']);

					$ret[$childID['project_id']][$smh['year']][$monthNumtoHalf[$smh['month']]]['cardCumulWithoutLti'] = (float) $smh['tmh_wolti'];
					$ret[$childID['project_id']][$smh['year']][$monthNumtoHalf[$smh['month']]]['allData'] = array('year'=>$smh['year'], 'month'=> $smh['month']);
					//---------------END CHILD---------------//
					
					if (!isset($ret['overall']['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'])) {
						$ret['overall']['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'] =  array('year'=>$smh['year'], 'month'=> $smh['month']);
					}
					if (!isset($ret['overall'][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'])) {
						$ret['overall'][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'] =  array('year'=>$smh['year'], 'month'=> $smh['month']);
					}
					if (!isset($ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'])) {
						$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'] =  array('year'=>$smh['year'], 'month'=> $smh['month']);
					}

					if (isset($ret['overall']['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'])){
						$ret['overall']['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = $ret['overall']['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] + (float) $smh['monthly_mh_wolti'];
					}
					else{
						$ret['overall']['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = (float) $smh['monthly_mh_wolti'];
					}
					if (isset($ret['overall'][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'])){
						$ret['overall'][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = $ret['overall'][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] + (float) $smh['monthly_mh_wolti'];
					}
					else{
						$ret['overall'][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = (float) $smh['monthly_mh_wolti'];
					}
					if (isset($ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'])){
						$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = $ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] + (float) $smh['monthly_mh_wolti'];
					}
					else{
						$ret['overall'][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = (float) $smh['monthly_mh_wolti'];
					}

					//---------------START CHILD-------------//
					if (!isset($ret[$childID['project_id']]['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'])) {
						$ret[$childID['project_id']]['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'] =  array('year'=>$smh['year'], 'month'=> $smh['month']);
					}
					if (!isset($ret[$childID['project_id']][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'])) {
						$ret[$childID['project_id']][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'] =  array('year'=>$smh['year'], 'month'=> $smh['month']);
					}
					if (!isset($ret[$childID['project_id']][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'])) {
						$ret[$childID['project_id']][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['allData'] =  array('year'=>$smh['year'], 'month'=> $smh['month']);
					}

					$ret[$childID['project_id']]['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = (float) $smh['monthly_mh_wolti'];
					$ret[$childID['project_id']]['all']['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalCumulWithoutLTI'] = (float) $smh['tmh_wolti'];
					$ret[$childID['project_id']][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = (float) $smh['monthly_mh_wolti'];
					$ret[$childID['project_id']][$smh['year']]['all']['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalCumulWithoutLTI'] = (float) $smh['tmh_wolti'];
					$ret[$childID['project_id']][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalWithoutLTI'] = (float) $smh['monthly_mh_wolti'];
					$ret[$childID['project_id']][$smh['year']][$monthNumtoHalf[$smh['month']]]['chart'][$monthNumtoHalf[$smh['month']].'-'.$smh['year']]['totalCumulWithoutLTI'] = (float) $smh['tmh_wolti'];
					//---------------END CHILD----------------//

				}
			}
		}

		foreach ($keyArrToSort as $yrs) {
			if (isset($ret['overall'][$yrs]['all']['chart'])){
				uksort($ret['overall'][$yrs]['all']['chart'], function($a, $b) {
					return strtotime($a) - strtotime($b);
				});
			}
		}

		return $ret;
	}

	function fetchSAData(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_SA'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				foreach($res['data'] as $sa){
					// for date filter conOp
					if (!isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['allData'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['allData'] =  array('year'=>'', 'month'=> '');
					}
					if (!isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['allData'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['allData'] =  array('year'=>$sa['year'], 'month'=> '');
					}
					if (!isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['allData'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['allData'] =   array('year'=>$sa['year'], 'month'=> $sa['month']);
					}

					if (isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = $ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] + (float) $sa['safety_walkabout'];
					}else{
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = (float) $sa['safety_walkabout'];
					}
					if (isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = $ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] + (float) $sa['safety_walkabout'];
					}else{
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = (float) $sa['safety_walkabout'];
					}
					if (isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = $ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'] + (float) $sa['safety_walkabout'];
					}else{
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = (float) $sa['safety_walkabout'];
					}

					if (isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = $ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] + (float) $sa['toolbox_briefing'];
					}else{
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = (float) $sa['toolbox_briefing'];
					}
					if (isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = $ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] + (float) $sa['toolbox_briefing'];
					}else{
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = (float) $sa['toolbox_briefing'];
					}
					if (isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = $ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] + (float) $sa['toolbox_briefing'];
					}else{
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = (float) $sa['toolbox_briefing'];
					}

					if (isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = $ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] + (float) $sa['safety_induction'];
					}else{
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = (float) $sa['safety_induction'];
					}
					if (isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = $ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] + (float) $sa['safety_induction'];
					}else{
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = (float) $sa['safety_induction'];
					}
					if (isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'] = $ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'] + (float) $sa['safety_induction'];
					}else{
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'] = (float) $sa['safety_induction'];
					}

					if (isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = $ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] + (float) $sa['site_comm_meeting'];
					}else{
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = (float) $sa['site_comm_meeting'];
					}
					if (isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = $ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] + (float) $sa['site_comm_meeting'];
					}else{
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = (float) $sa['site_comm_meeting'];
					}
					if (isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = $ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] + (float) $sa['site_comm_meeting'];
					}else{
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = (float) $sa['site_comm_meeting'];
					}

				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_SA'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				foreach($res['data'] as $sa){
					// for date filter conOp
					if (!isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['allData'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['allData'] =  array('year'=>'', 'month'=> '');
					}
					if (!isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['allData'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['allData'] =  array('year'=>$sa['year'], 'month'=> '');
					}
					if (!isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['allData'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['allData'] =   array('year'=>$sa['year'], 'month'=> $sa['month']);
					}

					if (isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = $ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] + (float) $sa['safety_walkabout'];
					}else{
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = (float) $sa['safety_walkabout'];
					}
					if (isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = $ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] + (float) $sa['safety_walkabout'];
					}else{
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = (float) $sa['safety_walkabout'];
					}
					if (isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = $ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'] + (float) $sa['safety_walkabout'];
					}else{
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = (float) $sa['safety_walkabout'];
					}

					if (isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = $ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] + (float) $sa['toolbox_briefing'];
					}else{
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = (float) $sa['toolbox_briefing'];
					}
					if (isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = $ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] + (float) $sa['toolbox_briefing'];
					}else{
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = (float) $sa['toolbox_briefing'];
					}
					if (isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = $ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] + (float) $sa['toolbox_briefing'];
					}else{
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = (float) $sa['toolbox_briefing'];
					}

					if (isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = $ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] + (float) $sa['safety_induction'];
					}else{
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = (float) $sa['safety_induction'];
					}
					if (isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = $ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] + (float) $sa['safety_induction'];
					}else{
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = (float) $sa['safety_induction'];
					}
					if (isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'] = $ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'] + (float) $sa['safety_induction'];
					}else{
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'] = (float) $sa['safety_induction'];
					}

					if (isset($ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'])) {
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = $ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] + (float) $sa['site_comm_meeting'];
					}else{
						$ret['overall']['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = (float) $sa['site_comm_meeting'];
					}
					if (isset($ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'])) {
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = $ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] + (float) $sa['site_comm_meeting'];
					}else{
						$ret['overall'][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = (float) $sa['site_comm_meeting'];
					}
					if (isset($ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'])) {
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = $ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] + (float) $sa['site_comm_meeting'];
					}else{
						$ret['overall'][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = (float) $sa['site_comm_meeting'];
					}

					//-----------------START CHILD-------------------//
					// for date filter conOp
					if (!isset($ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['allData'])) {
						$ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['allData'] =  array('year'=>'', 'month'=> '');
					}
					if (!isset($ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['allData'])) {
						$ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['allData'] =  array('year'=>$sa['year'], 'month'=> '');
					}
					if (!isset($ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['allData'])) {
						$ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['allData'] =   array('year'=>$sa['year'], 'month'=> $sa['month']);
					}
					if (isset($ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'])) {
						$ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = $ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] + (float) $sa['safety_walkabout'];
					}else{
						$ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = (float) $sa['safety_walkabout'];
					}
					if (isset($ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'])) {
						$ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = $ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] + (float) $sa['safety_walkabout'];
					}else{
						$ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = (float) $sa['safety_walkabout'];
					}
					if (isset($ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'])) {
						$ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = $ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'] + (float) $sa['safety_walkabout'];
					}else{
						$ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulWalkabout'] = (float) $sa['safety_walkabout'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'])) {
						$ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = $ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] + (float) $sa['toolbox_briefing'];
					}else{
						$ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = (float) $sa['toolbox_briefing'];
					}
					if (isset($ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'])) {
						$ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = $ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] + (float) $sa['toolbox_briefing'];
					}else{
						$ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = (float) $sa['toolbox_briefing'];
					}
					if (isset($ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'])) {
						$ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = $ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] + (float) $sa['toolbox_briefing'];
					}else{
						$ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulToolboxMeet'] = (float) $sa['toolbox_briefing'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'])) {
						$ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = $ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] + (float) $sa['safety_induction'];
					}else{
						$ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = (float) $sa['safety_induction'];
					}
					if (isset($ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'])) {
						$ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = $ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] + (float) $sa['safety_induction'];
					}else{
						$ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulInduction'] = (float) $sa['safety_induction'];
					}
					if (isset($ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'])) {
						$ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'] = $ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'] + (float) $sa['safety_induction'];
					}else{
						$ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulInduction'] = (float) $sa['safety_induction'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'])) {
						$ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = $ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] + (float) $sa['site_comm_meeting'];
					}else{
						$ret[$childID['project_id']]['all']['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = (float) $sa['site_comm_meeting'];
					}
					if (isset($ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'])) {
						$ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = $ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] + (float) $sa['site_comm_meeting'];
					}else{
						$ret[$childID['project_id']][$sa['year']]['all']['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = (float) $sa['site_comm_meeting'];
					}
					if (isset($ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'])) {
						$ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = $ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] + (float) $sa['site_comm_meeting'];
					}else{
						$ret[$childID['project_id']][$sa['year']][$monthNumtoHalf[$sa['month']]]['chartSA'][$sa['wpc_no']]['cumulCommiteeMeet'] = (float) $sa['site_comm_meeting'];
					}
					//------------------END CHILD--------------------//
				}
			}
		}

		return $ret;
	}

	function fetchNCRData(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_NCR'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				$dataArr = $res['data'];
				
				usort($dataArr, function ($a, $b) {
				    $t1 = strtotime($a['date_issued']);
				    $t2 = strtotime($b['date_issued']);
				    return $t1 - $t2;
				});

				$total = 1;
				$total14 = 0;
				$total60 = 0;
				$total100 = 0;
				$total100Plus = 0;

				$total14quality = 0;
				$total60quality = 0;
				$total100quality = 0;
				$total100Plusquality = 0;

				foreach($dataArr as $ncr){
					$mthCT = $this->getMonthfromTSRange(new DateTime($ncr['date_issued']), $this->cutoffDay);
					$dateCreated = strtotime($ncr['date_issued']);

					//-------------HSET Management Dashboard--------------//
					if($ncr['discipline'] == 'Health & Safety' || $ncr['discipline'] == 'Environment' || $ncr['discipline'] == 'Traffic'){

						// for filtering on ConOp
						if (!isset($ret['overall']['all']['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['allData'])) {
							$ret['overall']['all']['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['allData'] = array('status'=>$ncr['ncr_status'], 'dateFrom' => '', 'dateTo' => '');
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['allData'])) {
							$ret['overall'][$mthCT['yr']]['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['allData'] = array('status'=>$ncr['ncr_status'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$this->projectID][$ncr['ncr_status']]['allData'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$this->projectID][$ncr['ncr_status']]['allData'] = array('status'=>$ncr['ncr_status'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}

						if (isset($ret['overall']['all']['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['val'])) {
							$ret['overall']['all']['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['val']++;
						}else{
							$ret['overall']['all']['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['val'] = 1;
						}
					
						if (isset($ret['overall'][$mthCT['yr']]['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['val'])) {
							$ret['overall'][$mthCT['yr']]['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['val']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['statusNCR'][$this->projectID][$ncr['ncr_status']]['val'] = 1;
						}
					
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$this->projectID][$ncr['ncr_status']]['val'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$this->projectID][$ncr['ncr_status']]['val']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$this->projectID][$ncr['ncr_status']]['val'] = 1;
						}

						if($ncr['ncr_status'] == 'Pending'){
							$now = new DateTime();
							$diffDays = floor(($now->getTimestamp()-$dateCreated) / (60 * 60 * 24));
							
							$dateTo = $now->format('d/m/Y');
							$dateFrom_14 = (new DateTime())->modify('-14 days')->format('d/m/Y');
							$dateFrom_60 = (new DateTime())->modify('-60 days')->format('d/m/Y');
							$dateFrom_100 = (new DateTime())->modify('-100 days')->format('d/m/Y');

							$dateTo_14 = (new DateTime())->modify('-15 days')->format('d/m/Y');
							$dateTo_60 = (new DateTime())->modify('-61 days')->format('d/m/Y');
							$dateTo_100 = (new DateTime())->modify('-101 days')->format('d/m/Y');

							$dateEnd_14 = (new DateTime($ncr['date_issued']))->format('d/m/Y');
							$dateEnd_60 = (new DateTime($ncr['date_issued']))->format('d/m/Y');
							$dateEnd_100 = (new DateTime($ncr['date_issued']))->format('d/m/Y');

							if (!isset($ret['overall']['all']['all']['byAging'][$this->projectID]['less14']['val'])) {
								$ret['overall']['all']['all']['byAging'][$this->projectID]['less14']['val'] = 0;
								$ret['overall']['all']['all']['byAging'][$this->projectID]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
							}
							if (!isset($ret['overall']['all']['all']['byAging'][$this->projectID]['less60']['val'])) {
								$ret['overall']['all']['all']['byAging'][$this->projectID]['less60']['val'] = 0;
								$ret['overall']['all']['all']['byAging'][$this->projectID]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
							}
							if (!isset($ret['overall']['all']['all']['byAging'][$this->projectID]['less100']['val'])) {
								$ret['overall']['all']['all']['byAging'][$this->projectID]['less100']['val'] = 0;
								$ret['overall']['all']['all']['byAging'][$this->projectID]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
							}
							if (!isset($ret['overall']['all']['all']['byAging'][$this->projectID]['more100']['val'])) {
								$ret['overall']['all']['all']['byAging'][$this->projectID]['more100']['val'] = 0;
								$ret['overall']['all']['all']['byAging'][$this->projectID]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateTo_100);
							}
		
							if (!isset($ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less14']['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less14']['val'] = 0;
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
							}
							if (!isset($ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less60']['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less60']['val'] = 0;
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
							}
							if (!isset($ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less100']['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less100']['val'] = 0;
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
							}
							if (!isset($ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['more100']['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['more100']['val'] = 0;
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateTo_100);
							}

							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less14']['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less14']['val'] = 0;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
							}
							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less60']['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less60']['val'] = 0;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
							}
							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less100']['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less100']['val'] = 0;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
							}
							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['more100']['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['more100']['val'] = 0;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateTo_100);
							}

							if($diffDays <= 14){
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								$total14++;
							}
							else if ($diffDays >= 15 && $diffDays <= 60){
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateEnd_14);
								$total60++;
							}
							else if ($diffDays >= 61 && $diffDays <= 100){
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateEnd_60);
								$total100++;
							}
							else{
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateEnd_100);
								$total100Plus++;
							}

							$ret['overall']['all']['all']['byAging'][$this->projectID]['less14']['val'] = $total14;
							$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less14']['val'] = $total14;
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less14']['val'] = $total14;

							$ret['overall']['all']['all']['byAging'][$this->projectID]['less60']['val'] = $total60;
							$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less60']['val'] = $total60;
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less60']['val'] = $total60;

							$ret['overall']['all']['all']['byAging'][$this->projectID]['less100']['val'] = $total100;
							$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['less100']['val'] = $total100;
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['less100']['val'] = $total100;

							$ret['overall']['all']['all']['byAging'][$this->projectID]['more100']['val'] = $total100Plus;
							$ret['overall'][$mthCT['yr']]['all']['byAging'][$this->projectID]['more100']['val'] = $total100Plus;
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$this->projectID]['more100']['val'] = $total100Plus;

						}
						
					}
					else{
						//-------------Quality Management Dashboard--------------//
						// for filter
						if (!isset($ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'])) {
							$ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'] = array('subDicipline' => $ncr['sub_discipline'], 'dateFrom' => '', 'dateTo' => '');
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'])) {
							$ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'] = array('subDicipline' => $ncr['sub_discipline'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['allData'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['allData'] = array('subDicipline' => $ncr['sub_discipline'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}

						if (isset($ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['val'])) {
							$ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['val']++;
						}else{
							$ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['val'])) {
							$ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['val']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['val'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['val']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['val'] = 1;
						}

						// for filter conOp - cumulative
						if(!isset($ret['overall']['all']['all']['card']['cumulative']['allData'])){
							$ret['overall']['all']['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
						}
						if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['allData'])){
							$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['yrLastDay']);
						}
						if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'])){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['toDate']);
						}
						// for filter conOp - current
						if(!isset($ret['overall']['all']['all']['card']['current']['allData'])){
							$ret['overall']['all']['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
						}
						if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['current']['allData'])){
							$ret['overall'][$mthCT['yr']]['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'])){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}
						// for filter conOp - status
						if(!isset($ret['overall']['all']['all']['card'][$ncr['ncr_status']]['allData'])){
							$ret['overall']['all']['all']['card'][$ncr['ncr_status']]['allData'] = array('status' => $ncr['ncr_status'], 'dateFrom' => "", 'dateTo' => "");
						}
						if(!isset($ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['allData'])){
							$ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['allData'] = array('status' => $ncr['ncr_status'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['allData'])){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['allData'] = array('status' => $ncr['ncr_status'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}

						if (isset($ret['overall']['all']['all']['card']['cumulative']['val'])) {
							$ret['overall']['all']['all']['card']['cumulative']['val']++;
						}else{
							$ret['overall']['all']['all']['card']['cumulative']['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal'])) {
							$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'] = 1;
						}

						if (isset($ret['overall']['all']['all']['card']['current']['val'])) {
							$ret['overall']['all']['all']['card']['current']['val']++;
						}else{
							$ret['overall']['all']['all']['card']['current']['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card']['current']['val'])) {
							$ret['overall'][$mthCT['yr']]['all']['card']['current']['val']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card']['current']['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'] = 1;
						}

						if (isset($ret['overall']['all']['all']['card'][$ncr['ncr_status']]['val'])) {
							$ret['overall']['all']['all']['card'][$ncr['ncr_status']]['val']++;
						}else{
							$ret['overall']['all']['all']['card'][$ncr['ncr_status']]['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['notVal'])) {
							$ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['notVal']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['notVal'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['notVal'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['notVal']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['notVal'] = 1;
						}
						
						if($ncr['discipline'] == 'Quality'){
							if($ncr['ncr_status'] == 'Pending'){
								$now = new DateTime();
								$diffDays = floor(($now->getTimestamp()-$dateCreated) / (60 * 60 * 24));

								// for filter on conOp
								$dateTo = $now->format('d/m/Y');
								$dateFrom_14 = (new DateTime())->modify('-14 days')->format('d/m/Y');
								$dateFrom_60 = (new DateTime())->modify('-60 days')->format('d/m/Y');
								$dateFrom_100 = (new DateTime())->modify('-100 days')->format('d/m/Y');

								$dateTo_14 = (new DateTime())->modify('-15 days')->format('d/m/Y');
								$dateTo_60 = (new DateTime())->modify('-61 days')->format('d/m/Y');
								$dateTo_100 = (new DateTime())->modify('-101 days')->format('d/m/Y');

								if (!isset($ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less14']['allData'])) {
									$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less14']['val'] = 0;
									$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less14']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								}
								if (!isset($ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less60']['allData'])) {
									$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less60']['val'] = 0;
									$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less60']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
								}
								if (!isset($ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less100']['allData'])) {
									$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less100']['val'] = 0;
									$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
								}
								if (!isset($ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['more100']['allData'])) {
									$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['more100']['val'] = 0;
									$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['more100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => "", 'dateTo' => $dateTo_100);
								}

								if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less14']['allData'])) {
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less14']['val'] = 0;
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less14']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								}
								if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less60']['allData'])) {
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less60']['val'] = 0;
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less60']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
								}
								if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less100']['allData'])) {
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less100']['val'] = 0;
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
								}
								if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['more100']['allData'])) {
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['more100']['val'] = 0;
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['more100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => "", 'dateTo' => $dateTo_100);
								}

								if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less14']['allData'])) {
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less14']['val'] = 0;
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less14']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								}
								if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less60']['allData'])) {
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less60']['val'] = 0;
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less60']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
								}
								if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less100']['allData'])) {
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less100']['val'] = 0;
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
								}
								if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['more100']['allData'])) {
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['more100']['val'] = 0;
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['more100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => "", 'dateTo' => $dateTo_100);
								}

								if($diffDays <= 14){
									$total14quality++;
								}
								else if ($diffDays >= 15 && $diffDays <= 60){
									$total60quality++;
								}
								else if ($diffDays >= 61 && $diffDays <= 100){
									$total100quality++;
								}
								else{
									$total100Plusquality++;
								}

								$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less14']['val'] = $total14quality;
								$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less14']['val'] = $total14quality;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less14']['val'] = $total14quality;

								$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less60']['val'] = $total60quality;
								$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less60']['val'] = $total60quality;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less60']['val'] = $total60quality;

								$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['less100']['val'] = $total100quality;
								$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['less100']['val'] = $total100quality;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['less100']['val'] = $total100quality;

								$ret['overall']['all']['all']['byAgingQuality'][$this->projectID]['more100']['val'] = $total100Plusquality;
								$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$this->projectID]['more100']['val'] = $total100Plusquality;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$this->projectID]['more100']['val'] = $total100Plusquality;
							}

							// for filter
							if (!isset($ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['allData'])) {
								$ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['allData'] = array('classification' => $ncr['classification'], 'dicipline'=>$ncr['discipline'], 'dateFrom' => "", 'dateTo' => "");
							}
							if (!isset($ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['allData'])) {
								$ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['allData'] = array('classification' => $ncr['classification'], 'dicipline'=>$ncr['discipline'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
							}
							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['allData'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['allData'] = array('classification' => $ncr['classification'], 'dicipline'=>$ncr['discipline'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);;
							}

							if (isset($ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['val'])) {
								$ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['val']++;
							}else{
								$ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['val'] = 1;
							}
							if (isset($ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['val']++;
							}else{
								$ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['val'] = 1;
							}
							if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['val']++;
							}else{
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['val'] = 1;
							}
						}

					}

					$total++;
				}

				if($dataArr){
					$minDate = strtotime($dataArr[0]['date_issued']);
					$maxDate = strtotime(end($dataArr)['date_issued']);
					$minYear = date("Y", $minDate);
					$maxYear = date("Y", $maxDate);

					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");
					$monthTextHalf = array("Jan"=>"01","Feb"=>"02","Mar"=>"03","Apr"=>"04","May"=>"05","Jun"=>"06","Jul"=>"07","Aug"=>"08","Sep"=>"09","Oct"=>"10","Nov"=>"11","Dec"=>"12");

					$valYrData = 0;
					$valMthData = 0;

					$valYrPending = 0;
					$valMthPending = 0;

					$valYrClosed = 0;
					$valMthClosed = 0;

					
					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						
						if (isset($ret['overall'][$nYr]['all']['card']['cumulative']['notVal'])) {
							$valYrData = $valYrData + $ret['overall'][$nYr]['all']['card']['cumulative']['notVal'];
						}
						
						// for filter
						$yrLastDay = date($this->cutoffDay.'/12/'.$nYr);
						$ret['overall'][$nYr]['all']['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['cumulative']['val'] = $valYrData;

						if (isset($ret['overall'][$nYr]['all']['card']['Pending']['notVal'])) {
							$valYrPending = $valYrPending +  $ret['overall'][$nYr]['all']['card']['Pending']['notVal'];
						}
						$ret['overall'][$nYr]['all']['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['Pending']['val'] = $valYrPending;

						if (isset($ret['overall'][$nYr]['all']['card']['Closed']['notVal'])) {
							$valYrClosed = $valYrClosed +  $ret['overall'][$nYr]['all']['card']['Closed']['notVal'];
						}
						$ret['overall'][$nYr]['all']['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['Closed']['val'] = $valYrClosed;

						foreach ($monthHalftext as $key => $mthval) {
							if (isset($ret['overall'][$nYr][$mthval]['card']['cumulative']['notVal'])) {
								$valMthData = $valMthData + $ret['overall'][$nYr][$mthval]['card']['cumulative']['notVal'];
								
							}

							$dateString = $nYr.'-'.$mthval;
							$mthYrLastDay = date($this->cutoffDay.'/'.$monthTextHalf[$mthval].'/'.$nYr, strtotime($dateString));
							
							$ret['overall'][$nYr][$mthval]['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['cumulative']['val'] = $valMthData;

							if (isset($ret['overall'][$nYr][$mthval]['card']['Pending']['notVal'])) {
								$valMthPending = $valMthPending +  $ret['overall'][$nYr][$mthval]['card']['Pending']['notVal'];
							}
							$ret['overall'][$nYr][$mthval]['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['Pending']['val'] = $valMthPending;

							if (isset($ret['overall'][$nYr][$mthval]['card']['Closed']['notVal'])) {
								$valMthClosed = $valMthClosed +  $ret['overall'][$nYr][$mthval]['card']['Closed']['notVal'];
							}
							$ret['overall'][$nYr][$mthval]['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['Closed']['val'] = $valMthClosed;
						}
					}
				}
			}
		}

		$valYrData = 0;
		$valMthData = 0;
		$valYrPending = 0;
		$valMthPending = 0;
		$valYrClosed = 0;
		$valMthClosed = 0;

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_NCR'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				$dataArr = $res['data'];
				
				usort($dataArr, function ($a, $b) {
				    $t1 = strtotime($a['date_issued']);
				    $t2 = strtotime($b['date_issued']);
				    return $t1 - $t2;
				});

				$total = 1;
				$total14 = 0;
				$total60 = 0;
				$total100 = 0;
				$total100Plus = 0;

				$total14quality = 0;
				$total60quality = 0;
				$total100quality = 0;
				$total100Plusquality = 0;

				foreach($dataArr as $ncr){
					$mthCT = $this->getMonthfromTSRange(new DateTime($ncr['date_issued']), $this->cutoffDay);
					$dateCreated = strtotime($ncr['date_issued']);

					//-------------HSET Management Dashboard--------------//
					if($ncr['discipline'] == 'Health & Safety' || $ncr['discipline'] == 'Environment' || $ncr['discipline'] == 'Traffic'){

						// for filtering on ConOp
						if (!isset($ret['overall']['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'])) {
							$ret['overall']['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'] = array('status'=>$ncr['ncr_status'], 'dateFrom' => '', 'dateTo' => '');
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'])) {
							$ret['overall'][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'] = array('status'=>$ncr['ncr_status'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'] = array('status'=>$ncr['ncr_status'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}

						if (isset($ret['overall']['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'])) {
							$ret['overall']['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val']++;
						}else{
							$ret['overall']['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'] = 1;
						}
					
						if (isset($ret['overall'][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'])) {
							$ret['overall'][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'] = 1;
						}
					
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'] = 1;
						}

						//--------------START CHILD-------------//
						if (!isset($ret[$childID['project_id']]['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'])) {
							$ret[$childID['project_id']]['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'] = array('status'=>$ncr['ncr_status'], 'dateFrom' => '', 'dateTo' => '');
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'] = array('status'=>$ncr['ncr_status'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['allData'] = array('status'=>$ncr['ncr_status'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}

						if (isset($ret[$childID['project_id']]['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'])) {
							$ret[$childID['project_id']]['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val']++;
						}else{
							$ret[$childID['project_id']]['all']['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'] = 1;
						}
					
						if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'] = 1;
						}
					
						if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['statusNCR'][$childID['project_id']][$ncr['ncr_status']]['val'] = 1;
						}
						//----------END CHILD----------------//

						if($ncr['ncr_status'] == 'Pending'){
							$now = new DateTime();
							$diffDays = floor(($now->getTimestamp()-$dateCreated) / (60 * 60 * 24));
							
							$dateTo = $now->format('d/m/Y');
							$dateFrom_14 = (new DateTime())->modify('-14 days')->format('d/m/Y');
							$dateFrom_60 = (new DateTime())->modify('-60 days')->format('d/m/Y');
							$dateFrom_100 = (new DateTime())->modify('-100 days')->format('d/m/Y');

							$dateTo_14 = (new DateTime())->modify('-15 days')->format('d/m/Y');
							$dateTo_60 = (new DateTime())->modify('-61 days')->format('d/m/Y');
							$dateTo_100 = (new DateTime())->modify('-101 days')->format('d/m/Y');

							$dateEnd_14 = (new DateTime($ncr['date_issued']))->format('d/m/Y');
							$dateEnd_60 = (new DateTime($ncr['date_issued']))->format('d/m/Y');
							$dateEnd_100 = (new DateTime($ncr['date_issued']))->format('d/m/Y');

							if (!isset($ret['overall']['all']['all']['byAging'][$childID['project_id']]['less14']['val'])) {
								$ret['overall']['all']['all']['byAging'][$childID['project_id']]['less14']['val'] = 0;
								$ret['overall']['all']['all']['byAging'][$childID['project_id']]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
							}
							if (!isset($ret['overall']['all']['all']['byAging'][$childID['project_id']]['less60']['val'])) {
								$ret['overall']['all']['all']['byAging'][$childID['project_id']]['less60']['val'] = 0;
								$ret['overall']['all']['all']['byAging'][$childID['project_id']]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
							}
							if (!isset($ret['overall']['all']['all']['byAging'][$childID['project_id']]['less100']['val'])) {
								$ret['overall']['all']['all']['byAging'][$childID['project_id']]['less100']['val'] = 0;
								$ret['overall']['all']['all']['byAging'][$childID['project_id']]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
							}
							if (!isset($ret['overall']['all']['all']['byAging'][$childID['project_id']]['more100']['val'])) {
								$ret['overall']['all']['all']['byAging'][$childID['project_id']]['more100']['val'] = 0;
								$ret['overall']['all']['all']['byAging'][$childID['project_id']]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateTo_100);
							}
		
							if (!isset($ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less14']['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less14']['val'] = 0;
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
							}
							if (!isset($ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less60']['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less60']['val'] = 0;
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
							}
							if (!isset($ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less100']['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less100']['val'] = 0;
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
							}
							if (!isset($ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['more100']['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['more100']['val'] = 0;
								$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateTo_100);
							}

							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['val'] = 0;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
							}
							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['val'] = 0;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
							}
							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['val'] = 0;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
							}
							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['val'] = 0;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateTo_100);
							}

							//----------------START CHILD--------------//
							if (!isset($ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less14']['val'])) {
								$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less14']['val'] = 0;
								$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
							}
							if (!isset($ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less60']['val'])) {
								$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less60']['val'] = 0;
								$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
							}
							if (!isset($ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less100']['val'])) {
								$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less100']['val'] = 0;
								$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
							}
							if (!isset($ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['more100']['val'])) {
								$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['more100']['val'] = 0;
								$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateTo_100);
							}
		
							if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less14']['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less14']['val'] = 0;
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
							}
							if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less60']['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less60']['val'] = 0;
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
							}
							if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less100']['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less100']['val'] = 0;
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
							}
							if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['more100']['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['more100']['val'] = 0;
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateTo_100);
							}

							if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['val'] = 0;
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
							}
							if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['val'] = 0;
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
							}
							if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['val'] = 0;
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
							}
							if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['val'] = 0;
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateTo_100);
							}
							//----------------END CHILD-------------//

							if($diffDays <= 14){
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								$total14++;
							}
							else if ($diffDays >= 15 && $diffDays <= 60){
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateEnd_14);
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_60, 'dateTo' => $dateEnd_14);
								$total60++;
							}
							else if ($diffDays >= 61 && $diffDays <= 100){
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateEnd_60);
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['allData'] = array('status' => 'Pending', 'dateFrom' => $dateFrom_100, 'dateTo' => $dateEnd_60);
								$total100++;
							}
							else{
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateEnd_100);
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $dateEnd_100);
								$total100Plus++;
							}

							$ret['overall']['all']['all']['byAging'][$childID['project_id']]['less14']['val'] = $total14;
							$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less14']['val'] = $total14;
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['val'] = $total14;

							$ret['overall']['all']['all']['byAging'][$childID['project_id']]['less60']['val'] = $total60;
							$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less60']['val'] = $total60;
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['val'] = $total60;

							$ret['overall']['all']['all']['byAging'][$childID['project_id']]['less100']['val'] = $total100;
							$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less100']['val'] = $total100;
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['val'] = $total100;

							$ret['overall']['all']['all']['byAging'][$childID['project_id']]['more100']['val'] = $total100Plus;
							$ret['overall'][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['more100']['val'] = $total100Plus;
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['val'] = $total100Plus;

							//--------------START CHILD----------------//
							$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less14']['val'] = $total14;
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less14']['val'] = $total14;
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less14']['val'] = $total14;

							$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less60']['val'] = $total60;
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less60']['val'] = $total60;
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less60']['val'] = $total60;

							$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['less100']['val'] = $total100;
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['less100']['val'] = $total100;
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['less100']['val'] = $total100;

							$ret[$childID['project_id']]['all']['all']['byAging'][$childID['project_id']]['more100']['val'] = $total100Plus;
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAging'][$childID['project_id']]['more100']['val'] = $total100Plus;
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAging'][$childID['project_id']]['more100']['val'] = $total100Plus;
							//-------------END CHILD--------------------//
						}
					}
					else{
						//-------------Quality Management Dashboard--------------//
						// for filter
						if (!isset($ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'])) {
							$ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'] = array('subDicipline' => $ncr['sub_discipline'], 'dateFrom' => '', 'dateTo' => '');
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'])) {
							$ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'] = array('subDicipline' => $ncr['sub_discipline'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['allData'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['allData'] = array('subDicipline' => $ncr['sub_discipline'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}

						if (isset($ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['val'])) {
							$ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['val']++;
						}else{
							$ret['overall']['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['val'])) {
							$ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['val']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['val'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['val']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['val'] = 1;
						}

						//--------------------START CHILD--------------------//
						if (!isset($ret[$childID['project_id']]['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'])) {
							$ret[$childID['project_id']]['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'] = array('subDicipline' => $ncr['sub_discipline'], 'dateFrom' => '', 'dateTo' => '');
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['allData'] = array('subDicipline' => $ncr['sub_discipline'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['allData'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['allData'] = array('subDicipline' => $ncr['sub_discipline'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}

						if (isset($ret[$childID['project_id']]['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['val'])) {
							$ret[$childID['project_id']]['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['val']++;
						}else{
							$ret[$childID['project_id']]['all']['all']['chartNCRSub'][$ncr['sub_discipline']]['val'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['val'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['val']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['chartNCRSub'][$ncr['sub_discipline']]['val'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['val'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['val']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNCRSub'][$ncr['sub_discipline']]['val'] = 1;
						}
						//-------------------END CHILD---------------------//

						// for filter conOp - cumulative
						if(!isset($ret['overall']['all']['all']['card']['cumulative']['allData'])){
							$ret['overall']['all']['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
						}
						if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['allData'])){
							$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['yrLastDay']);
						}
						if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'])){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['toDate']);
						}
						// for filter conOp - current
						if(!isset($ret['overall']['all']['all']['card']['current']['allData'])){
							$ret['overall']['all']['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
						}
						if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['current']['allData'])){
							$ret['overall'][$mthCT['yr']]['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'])){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}
						// for filter conOp - status
						if(!isset($ret['overall']['all']['all']['card'][$ncr['ncr_status']]['allData'])){
							$ret['overall']['all']['all']['card'][$ncr['ncr_status']]['allData'] = array('status' => $ncr['ncr_status'], 'dateFrom' => "", 'dateTo' => "");
						}
						if(!isset($ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['allData'])){
							$ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['allData'] = array('status' => $ncr['ncr_status'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['allData'])){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['allData'] = array('status' => $ncr['ncr_status'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}

						//----------------START CHILD----------------//
						if(!isset($ret[$childID['project_id']]['all']['all']['card']['cumulative']['allData'])){
							$ret[$childID['project_id']]['all']['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
						}
						if(!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['allData'])){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['yrLastDay']);
						}
						if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'])){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['toDate']);
						}
						// for filter conOp - current
						if(!isset($ret[$childID['project_id']]['all']['all']['card']['current']['allData'])){
							$ret[$childID['project_id']]['all']['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
						}
						if(!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['allData'])){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'])){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}
						// for filter conOp - status
						if(!isset($ret[$childID['project_id']]['all']['all']['card'][$ncr['ncr_status']]['allData'])){
							$ret[$childID['project_id']]['all']['all']['card'][$ncr['ncr_status']]['allData'] = array('status' => $ncr['ncr_status'], 'dateFrom' => "", 'dateTo' => "");
						}
						if(!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['allData'])){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['allData'] = array('status' => $ncr['ncr_status'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
						}
						if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['allData'])){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['allData'] = array('status' => $ncr['ncr_status'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
						}
						//-------------------END CHILD-----------------//

						if (isset($ret['overall']['all']['all']['card']['cumulative']['val'])) {
							$ret['overall']['all']['all']['card']['cumulative']['val']++;
						}else{
							$ret['overall']['all']['all']['card']['cumulative']['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal'])) {
							$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'] = 1;
						}

						if (isset($ret['overall']['all']['all']['card']['current']['val'])) {
							$ret['overall']['all']['all']['card']['current']['val']++;
						}else{
							$ret['overall']['all']['all']['card']['current']['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card']['current']['val'])) {
							$ret['overall'][$mthCT['yr']]['all']['card']['current']['val']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card']['current']['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'] = 1;
						}

						if (isset($ret['overall']['all']['all']['card'][$ncr['ncr_status']]['val'])) {
							$ret['overall']['all']['all']['card'][$ncr['ncr_status']]['val']++;
						}else{
							$ret['overall']['all']['all']['card'][$ncr['ncr_status']]['val'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['notVal'])) {
							$ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['notVal']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['notVal'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['notVal'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['notVal']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['notVal'] = 1;
						}
						
						//----------------START CHILD-----------------//
						if (isset($ret[$childID['project_id']]['all']['all']['card']['cumulative']['val'])) {
							$ret[$childID['project_id']]['all']['all']['card']['cumulative']['val']++;
						}else{
							$ret[$childID['project_id']]['all']['all']['card']['cumulative']['val'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['notVal'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['notVal']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['notVal'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'] = 1;
						}

						if (isset($ret[$childID['project_id']]['all']['all']['card']['current']['val'])) {
							$ret[$childID['project_id']]['all']['all']['card']['current']['val']++;
						}else{
							$ret[$childID['project_id']]['all']['all']['card']['current']['val'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['val'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['val']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['val'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'] = 1;
						}

						if (isset($ret[$childID['project_id']]['all']['all']['card'][$ncr['ncr_status']]['val'])) {
							$ret[$childID['project_id']]['all']['all']['card'][$ncr['ncr_status']]['val']++;
						}else{
							$ret[$childID['project_id']]['all']['all']['card'][$ncr['ncr_status']]['val'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['notVal'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['notVal']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ncr['ncr_status']]['notVal'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['notVal'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['notVal']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ncr['ncr_status']]['notVal'] = 1;
						}
						//--------------------END CHILD----------------//

						if($ncr['discipline'] == 'Quality'){
							if($ncr['ncr_status'] == 'Pending'){
								$now = new DateTime();
								$diffDays = floor(($now->getTimestamp()-$dateCreated) / (60 * 60 * 24));

								// for filter on conOp
								$dateTo = $now->format('d/m/Y');
								$dateFrom_14 = (new DateTime())->modify('-14 days')->format('d/m/Y');
								$dateFrom_60 = (new DateTime())->modify('-60 days')->format('d/m/Y');
								$dateFrom_100 = (new DateTime())->modify('-100 days')->format('d/m/Y');

								$dateTo_14 = (new DateTime())->modify('-15 days')->format('d/m/Y');
								$dateTo_60 = (new DateTime())->modify('-61 days')->format('d/m/Y');
								$dateTo_100 = (new DateTime())->modify('-101 days')->format('d/m/Y');

								if (!isset($ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less14']['allData'])) {
									$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less14']['val'] = 0;
									$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less14']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								}
								if (!isset($ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less60']['allData'])) {
									$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less60']['val'] = 0;
									$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less60']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
								}
								if (!isset($ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less100']['allData'])) {
									$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less100']['val'] = 0;
									$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
								}
								if (!isset($ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['more100']['allData'])) {
									$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['more100']['val'] = 0;
									$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['more100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => "", 'dateTo' => $dateTo_100);
								}

								if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less14']['allData'])) {
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less14']['val'] = 0;
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less14']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								}
								if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less60']['allData'])) {
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less60']['val'] = 0;
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less60']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
								}
								if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less100']['allData'])) {
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less100']['val'] = 0;
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
								}
								if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['more100']['allData'])) {
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['more100']['val'] = 0;
									$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['more100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => "", 'dateTo' => $dateTo_100);
								}

								if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less14']['allData'])) {
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less14']['val'] = 0;
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less14']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								}
								if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less60']['allData'])) {
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less60']['val'] = 0;
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less60']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
								}
								if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less100']['allData'])) {
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less100']['val'] = 0;
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
								}
								if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['more100']['allData'])) {
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['more100']['val'] = 0;
									$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['more100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => "", 'dateTo' => $dateTo_100);
								}

								//-----------------START CHILD------------------//
								if (!isset($ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less14']['allData'])) {
									$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less14']['val'] = 0;
									$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less14']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								}
								if (!isset($ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less60']['allData'])) {
									$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less60']['val'] = 0;
									$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less60']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
								}
								if (!isset($ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less100']['allData'])) {
									$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less100']['val'] = 0;
									$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
								}
								if (!isset($ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['more100']['allData'])) {
									$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['more100']['val'] = 0;
									$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['more100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => "", 'dateTo' => $dateTo_100);
								}

								if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less14']['allData'])) {
									$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less14']['val'] = 0;
									$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less14']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								}
								if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less60']['allData'])) {
									$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less60']['val'] = 0;
									$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less60']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
								}
								if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less100']['allData'])) {
									$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less100']['val'] = 0;
									$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
								}
								if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['more100']['allData'])) {
									$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['more100']['val'] = 0;
									$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['more100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => "", 'dateTo' => $dateTo_100);
								}

								if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less14']['allData'])) {
									$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less14']['val'] = 0;
									$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less14']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_14, 'dateTo' => $dateTo);
								}
								if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less60']['allData'])) {
									$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less60']['val'] = 0;
									$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less60']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_60, 'dateTo' => $dateTo_14);
								}
								if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less100']['allData'])) {
									$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less100']['val'] = 0;
									$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => $dateFrom_100, 'dateTo' => $dateTo_60);
								}
								if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['more100']['allData'])) {
									$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['more100']['val'] = 0;
									$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['more100']['allData'] = array('dicipline' => $ncr['discipline'], 'dateFrom' => "", 'dateTo' => $dateTo_100);
								}
								//---------------------END CHILD-----------------//

								if($diffDays <= 14){
									$total14quality++;
								}
								else if ($diffDays >= 15 && $diffDays <= 60){
									$total60quality++;
								}
								else if ($diffDays >= 61 && $diffDays <= 100){
									$total100quality++;
								}
								else{
									$total100Plusquality++;
								}

								$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less14']['val'] = $total14quality;
								$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less14']['val'] = $total14quality;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less14']['val'] = $total14quality;

								$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less60']['val'] = $total60quality;
								$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less60']['val'] = $total60quality;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less60']['val'] = $total60quality;

								$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['less100']['val'] = $total100quality;
								$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less100']['val'] = $total100quality;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less100']['val'] = $total100quality;

								$ret['overall']['all']['all']['byAgingQuality'][$childID['project_id']]['more100']['val'] = $total100Plusquality;
								$ret['overall'][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['more100']['val'] = $total100Plusquality;
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['more100']['val'] = $total100Plusquality;

								//----------------START CHILD----------------//
								$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less14']['val'] = $total14quality;
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less14']['val'] = $total14quality;
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less14']['val'] = $total14quality;

								$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less60']['val'] = $total60quality;
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less60']['val'] = $total60quality;
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less60']['val'] = $total60quality;

								$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['less100']['val'] = $total100quality;
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['less100']['val'] = $total100quality;
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['less100']['val'] = $total100quality;

								$ret[$childID['project_id']]['all']['all']['byAgingQuality'][$childID['project_id']]['more100']['val'] = $total100Plusquality;
								$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingQuality'][$childID['project_id']]['more100']['val'] = $total100Plusquality;
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingQuality'][$childID['project_id']]['more100']['val'] = $total100Plusquality;
								//-----------------END CHILD--------------//
							}

							// for filter
							if (!isset($ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['allData'])) {
								$ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['allData'] = array('classification' => $ncr['classification'], 'dicipline'=>$ncr['discipline'], 'dateFrom' => "", 'dateTo' => "");
							}
							if (!isset($ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['allData'])) {
								$ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['allData'] = array('classification' => $ncr['classification'], 'dicipline'=>$ncr['discipline'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
							}
							if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['allData'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['allData'] = array('classification' => $ncr['classification'], 'dicipline'=>$ncr['discipline'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);;
							}

							if (isset($ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['val'])) {
								$ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['val']++;
							}else{
								$ret['overall']['all']['all']['pieChartClassify'][$ncr['classification']]['val'] = 1;
							}
							if (isset($ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['val'])) {
								$ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['val']++;
							}else{
								$ret['overall'][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['val'] = 1;
							}
							if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['val'])) {
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['val']++;
							}else{
								$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['val'] = 1;
							}

							//--------------START CHILD----------------//
							if (!isset($ret[$childID['project_id']]['all']['all']['pieChartClassify'][$ncr['classification']]['allData'])) {
								$ret[$childID['project_id']]['all']['all']['pieChartClassify'][$ncr['classification']]['allData'] = array('classification' => $ncr['classification'], 'dicipline'=>$ncr['discipline'], 'dateFrom' => "", 'dateTo' => "");
							}
							if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['allData'])) {
								$ret[$childID['project_id']][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['allData'] = array('classification' => $ncr['classification'], 'dicipline'=>$ncr['discipline'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
							}
							if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['allData'])) {
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['allData'] = array('classification' => $ncr['classification'], 'dicipline'=>$ncr['discipline'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);;
							}

							if (isset($ret[$childID['project_id']]['all']['all']['pieChartClassify'][$ncr['classification']]['val'])) {
								$ret[$childID['project_id']]['all']['all']['pieChartClassify'][$ncr['classification']]['val']++;
							}else{
								$ret[$childID['project_id']]['all']['all']['pieChartClassify'][$ncr['classification']]['val'] = 1;
							}
							if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['val']++;
							}else{
								$ret[$childID['project_id']][$mthCT['yr']]['all']['pieChartClassify'][$ncr['classification']]['val'] = 1;
							}
							if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['val'])) {
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['val']++;
							}else{
								$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['pieChartClassify'][$ncr['classification']]['val'] = 1;
							}
							//---------------END CHILD----------------//
						}

					}

					$total++;
				}

				if($dataArr){
					$minDate = strtotime($dataArr[0]['date_issued']);
					$maxDate = strtotime(end($dataArr)['date_issued']);
					$minYear = date("Y", $minDate);
					$maxYear = date("Y", $maxDate);

					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");
					$monthTextHalf = array("Jan"=>"01","Feb"=>"02","Mar"=>"03","Apr"=>"04","May"=>"05","Jun"=>"06","Jul"=>"07","Aug"=>"08","Sep"=>"09","Oct"=>"10","Nov"=>"11","Dec"=>"12");

					$valYrDataChild = 0;
					$valMthDataChild = 0;
					$valYrPendingChild = 0;
					$valMthPendingChild = 0;
					$valYrClosedChild = 0;
					$valMthClosedChild = 0;

					$valMthDataFix = 0;
					$valMthDataClosedFix = 0;
					$valMthDataClosedFix = 0;

					$valMthDataPrev = 0;
					$valMthDataPrevPending = 0;
					$valMthDataPrevClosed = 0;
					
					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						// for filter
						$yrLastDay = date($childID['cut_off_day'].'/12/'.$nYr);

						//OVERALL YEAR ALL CUMULATIVE
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['notVal'])) {
							$valYrData = $valYrData + $ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['notVal'];
						}
						
						$ret['overall'][$nYr]['all']['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['cumulative']['val'] = $valYrData;

						//OVERALL YEAR PENDING CUMULATIVE
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['Pending']['notVal'])) {
							$valYrPending = $valYrPending +  $ret[$childID['project_id']][$nYr]['all']['card']['Pending']['notVal'];
						}
						$ret['overall'][$nYr]['all']['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['Pending']['val'] = $valYrPending;

						//OVERALL YEAR CLOSED CUMULATIVE
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['Closed']['notVal'])) {
							$valYrClosed = $valYrClosed +  $ret[$childID['project_id']][$nYr]['all']['card']['Closed']['notVal'];
						}
						$ret['overall'][$nYr]['all']['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['Closed']['val'] = $valYrClosed;

						//------------START CHILD-------------//
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['notVal'])) {
							$valYrDataChild = $valYrDataChild + $ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['notVal'];
						}
						$ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['val'] = $valYrDataChild;

						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['Pending']['notVal'])) {
							$valYrPendingChild = $valYrPendingChild +  $ret[$childID['project_id']][$nYr]['all']['card']['Pending']['notVal'];
						}
						$ret[$childID['project_id']][$nYr]['all']['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret[$childID['project_id']][$nYr]['all']['card']['Pending']['val'] = $valYrPendingChild;

						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['Closed']['notVal'])) {
							$valYrClosedChild = $valYrClosedChild +  $ret[$childID['project_id']][$nYr]['all']['card']['Closed']['notVal'];
						}
						$ret[$childID['project_id']][$nYr]['all']['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret[$childID['project_id']][$nYr]['all']['card']['Closed']['val'] = $valYrClosedChild;
						//---------------END CHILD--------------//
						
						foreach ($monthHalftext as $key => $mthval) {
							
							//OVERALL YEAR MONTH CUMULATIVE
							$dateString = $nYr.'-'.$mthval;
							$mthYrLastDay = date($childID['cut_off_day'].'/'.$monthTextHalf[$mthval].'/'.$nYr, strtotime($dateString));
							$ret['overall'][$nYr][$mthval]['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);

							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'])) {
								if(isset($ret['overall'][$nYr][$mthval]['card']['cumulative']['val'])){
									$valMthDataPrev = $ret['overall'][$nYr][$mthval]['card']['cumulative']['val'];
								}
								else{
									$valMthDataPrev = $ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'];
								}
								$valMthData = $valMthData + $valMthDataPrev;
							}

							//OVERALL YEAR MONTH PENDING
							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'])) {
								if(isset($ret['overall'][$nYr][$mthval]['card']['Pending']['val'])){
									$valMthDataPrevPending = $ret['overall'][$nYr][$mthval]['card']['Pending']['val'];
								}
								else{
									$valMthDataPrevPending = $ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'];
								}
								$valMthPending = $valMthPending + $valMthDataPrevPending;
							}

							//OVERALL YEAR MONTH CLOSED
							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'])) {
								if(isset($ret['overall'][$nYr][$mthval]['card']['Closed']['val'])){
									$valMthDataPrevClosed = $ret['overall'][$nYr][$mthval]['card']['Closed']['val'];
								}
								else{
									$valMthDataPrevClosed = $ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'];
								}
								$valMthClosed = $valMthClosed + $valMthDataPrevClosed;
							}

							//-------------START CHILD----------------//
							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'])) {
								$valMthDataChild = $valMthDataChild + $ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'];
							}
							$ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['val'] = $valMthDataChild;

							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'])) {
								$valMthPendingChild = $valMthPendingChild +  $ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'];
							}
							$ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['val'] = $valMthPendingChild;

							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'])) {
								$valMthClosedChild = $valMthClosedChild +  $ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'];
							}
							$ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['val'] = $valMthClosedChild;
							//----------------END CHILD---------------//

							if (isset($ret['overall'][$nYr][$mthval]['card']['cumulative']['val'])){
								if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'])) {
									$valMthDataFix = $ret['overall'][$nYr][$mthval]['card']['cumulative']['val'];
								}
								else{
									$valMthDataFix = $ret['overall'][$nYr][$mthval]['card']['cumulative']['val'];
								}
								$ret['overall'][$nYr][$mthval]['card']['cumulative']['val'] = $valMthDataFix + $valMthDataChild;
							}
							else{
								$ret['overall'][$nYr][$mthval]['card']['cumulative']['val'] = $valMthData;
							}

							if (isset($ret['overall'][$nYr][$mthval]['card']['Pending']['val'])){
								if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'])) {
									$valMthDataPendingFix = $ret['overall'][$nYr][$mthval]['card']['Pending']['val'];
								}
								else{
									$valMthDataPendingFix = $ret['overall'][$nYr][$mthval]['card']['Pending']['val'];
								}
								$ret['overall'][$nYr][$mthval]['card']['Pending']['val'] = $valMthDataPendingFix + $valMthPendingChild;
							}
							else{
								$ret['overall'][$nYr][$mthval]['card']['Pending']['val'] = $valMthPending;
							}

							if (isset($ret['overall'][$nYr][$mthval]['card']['Closed']['val'])){
								if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'])) {
									$valMthDataClosedFix = $ret['overall'][$nYr][$mthval]['card']['Closed']['val'];
								}
								else{
									$valMthDataClosedFix = $ret['overall'][$nYr][$mthval]['card']['Closed']['val'];
								}
								$ret['overall'][$nYr][$mthval]['card']['Closed']['val'] = $valMthDataClosedFix + $valMthClosedChild;
							}
							else{
								$ret['overall'][$nYr][$mthval]['card']['Closed']['val'] = $valMthClosed;
							}
						}
					}
				}
				
			}
		}

		return $ret;
	}

	function fetchNOIData(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_NOI'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				$dataArr = $res['data'];
				
				usort($dataArr, function ($a, $b) {
				    $t1 = strtotime($a['date_issued']);
				    $t2 = strtotime($b['date_issued']);
				    return $t1 - $t2;
				});

				foreach($dataArr as $noi){
					if($noi['discipline'] != "Quality") continue;
					$mthCT = $this->getMonthfromTSRange(new DateTime($noi['date_issued']), $this->cutoffDay);

					//-------------Quality Management Dashboard--------------//
					// filter conOP
					if (!isset($ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['allData'])) {
						$ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['allData'] = array('classification' => $noi['classification'], 'dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['allData'] = array('classification' => $noi['classification'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['allData'] = array('classification' => $noi['classification'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['val'])) {
						$ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['val']++;
					}else{
						$ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['val'])) {
						$ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['val'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['val'] = 1;
					}

					// for filter conOp - cumulative
					if(!isset($ret['overall']['all']['all']['card']['cumulative']['allData'])){
						$ret['overall']['all']['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['toDate']);
					}
					// for filter conOp - current
					if(!isset($ret['overall']['all']['all']['card']['current']['allData'])){
						$ret['overall']['all']['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['current']['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					// for filter conOp - status
					if(!isset($ret['overall']['all']['all']['card'][$noi['noi_status']]['allData'])){
						$ret['overall']['all']['all']['card'][$noi['noi_status']]['allData'] = array('status' => $noi['noi_status'], 'dateFrom' => "", 'dateTo' => "");
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['allData'] = array('status' => $noi['noi_status'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['allData'] = array('status' => $noi['noi_status'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['card']['cumulative']['val'])) {
						$ret['overall']['all']['all']['card']['cumulative']['val']++;
					}else{
						$ret['overall']['all']['all']['card']['cumulative']['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['current']['val'])) {
						$ret['overall']['all']['all']['card']['current']['val']++;
					}else{
						$ret['overall']['all']['all']['card']['current']['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['current']['val'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['current']['val']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['current']['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card'][$noi['noi_status']]['val'])) {
						$ret['overall']['all']['all']['card'][$noi['noi_status']]['val']++;
					}else{
						$ret['overall']['all']['all']['card'][$noi['noi_status']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['notVal'])) {
						$ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['notVal']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['notVal'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['notVal'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['notVal']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['notVal'] = 1;
					}

				}

				if($dataArr){
					$minDate = strtotime($dataArr[0]['date_issued']);
					$maxDate = strtotime(end($dataArr)['date_issued']);
					$minYear = date("Y", $minDate);
					$maxYear = date("Y", $maxDate);

					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");
					$monthTextHalf = array("Jan"=>"01","Feb"=>"02","Mar"=>"03","Apr"=>"04","May"=>"05","Jun"=>"06","Jul"=>"07","Aug"=>"08","Sep"=>"09","Oct"=>"10","Nov"=>"11","Dec"=>"12");

					$valYrData = 0;
					$valMthData = 0;

					$valYrPending = 0;
					$valMthPending = 0;

					$valYrClosed = 0;
					$valMthClosed = 0;

					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						
						if (isset($ret['overall'][$nYr]['all']['card']['cumulative']['notVal'])) {
							$valYrData = $valYrData + $ret['overall'][$nYr]['all']['card']['cumulative']['notVal'];
						}
						// for filter
						$yrLastDay = date($this->cutoffDay.'/12/'.$nYr);

						$ret['overall'][$nYr]['all']['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['cumulative']['val'] = $valYrData;

						if (isset($ret['overall'][$nYr]['all']['card']['Pending']['notVal'])) {
							$valYrPending = $valYrPending +  $ret['overall'][$nYr]['all']['card']['Pending']['notVal'];
						}
						$ret['overall'][$nYr]['all']['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['Pending']['val'] = $valYrPending;

						if (isset($ret['overall'][$nYr]['all']['card']['Closed']['notVal'])) {
							$valYrClosed = $valYrClosed +  $ret['overall'][$nYr]['all']['card']['Closed']['notVal'];
						}
						$ret['overall'][$nYr]['all']['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['Closed']['val'] = $valYrClosed;

						foreach ($monthHalftext as $key => $mthval) {
							if (isset($ret['overall'][$nYr][$mthval]['card']['cumulative']['notVal'])) {
								$valMthData = $valMthData + $ret['overall'][$nYr][$mthval]['card']['cumulative']['notVal'];
		
							}

							$dateString = $nYr.'-'.$mthval;
							$mthYrLastDay = date($this->cutoffDay.'/'.$monthTextHalf[$mthval].'/'.$nYr, strtotime($dateString));

							$ret['overall'][$nYr][$mthval]['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['cumulative']['val'] = $valMthData;

							if (isset($ret['overall'][$nYr][$mthval]['card']['Pending']['notVal'])) {
								$valMthPending = $valMthPending +  $ret['overall'][$nYr][$mthval]['card']['Pending']['notVal'];
							}
							$ret['overall'][$nYr][$mthval]['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['Pending']['val'] = $valMthPending;

							if (isset($ret['overall'][$nYr][$mthval]['card']['Closed']['notVal'])) {
								$valMthClosed = $valMthClosed +  $ret['overall'][$nYr][$mthval]['card']['Closed']['notVal'];
							}
							$ret['overall'][$nYr][$mthval]['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['Closed']['val'] = $valMthClosed;
						}
					}
				}
				
			}
		}

		$valYrData = 0;
		$valMthData = 0;
		$valYrPending = 0;
		$valMthPending = 0;
		$valYrClosed = 0;
		$valMthClosed = 0;

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_NOI'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				$dataArr = $res['data'];
				
				usort($dataArr, function ($a, $b) {
				    $t1 = strtotime($a['date_issued']);
				    $t2 = strtotime($b['date_issued']);
				    return $t1 - $t2;
				});
				
				foreach($res['data'] as $noi){
					if($noi['discipline'] != "Quality") continue;
					$mthCT = $this->getMonthfromTSRange(new DateTime($noi['date_issued']), $this->cutoffDay);

					//-------------Quality Management Dashboard--------------//
					// filter conOP
					if (!isset($ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['allData'])) {
						$ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['allData'] = array('classification' => $noi['classification'], 'dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['allData'] = array('classification' => $noi['classification'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['allData'] = array('classification' => $noi['classification'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					
					if (isset($ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['val'])) {
						$ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['val']++;
					}else{
						$ret['overall']['all']['all']['chartNOIclassify'][$noi['classification']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['val'])) {
						$ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['val'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['val'] = 1;
					}

					//-----------------START CHILD--------------------//
					// filter conOP
					if (!isset($ret[$childID['project_id']]['all']['all']['chartNOIclassify'][$noi['classification']]['allData'])) {
						$ret[$childID['project_id']]['all']['all']['chartNOIclassify'][$noi['classification']]['allData'] = array('classification' => $noi['classification'], 'dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['allData'] = array('classification' => $noi['classification'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['allData'] = array('classification' => $noi['classification'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					
					if (isset($ret[$childID['project_id']]['all']['all']['chartNOIclassify'][$noi['classification']]['val'])) {
						$ret[$childID['project_id']]['all']['all']['chartNOIclassify'][$noi['classification']]['val']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['chartNOIclassify'][$noi['classification']]['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['val'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['val']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['chartNOIclassify'][$noi['classification']]['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['val'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['val']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['chartNOIclassify'][$noi['classification']]['val'] = 1;
					}
					//-----------------END CHILD--------------------//

					// for filter conOp - cumulative
					if(!isset($ret['overall']['all']['all']['card']['cumulative']['allData'])){
						$ret['overall']['all']['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['toDate']);
					}
					// for filter conOp - current
					if(!isset($ret['overall']['all']['all']['card']['current']['allData'])){
						$ret['overall']['all']['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['current']['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					// for filter conOp - status
					if(!isset($ret['overall']['all']['all']['card'][$noi['noi_status']]['allData'])){
						$ret['overall']['all']['all']['card'][$noi['noi_status']]['allData'] = array('status' => $noi['noi_status'], 'dateFrom' => "", 'dateTo' => "");
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['allData'] = array('status' => $noi['noi_status'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['allData'] = array('status' => $noi['noi_status'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					//-----------------START CHILD--------------------//
					if(!isset($ret[$childID['project_id']]['all']['all']['card']['cumulative']['allData'])){
						$ret[$childID['project_id']]['all']['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['allData'] = array('status' => "", 'dateFrom' => '', 'dateTo' => $mthCT['toDate']);
					}
					// for filter conOp - current
					if(!isset($ret[$childID['project_id']]['all']['all']['card']['current']['allData'])){
						$ret[$childID['project_id']]['all']['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => "", 'dateTo' => "");
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['allData'] = array('status' => "", 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					// for filter conOp - status
					if(!isset($ret[$childID['project_id']]['all']['all']['card'][$noi['noi_status']]['allData'])){
						$ret[$childID['project_id']]['all']['all']['card'][$noi['noi_status']]['allData'] = array('status' => $noi['noi_status'], 'dateFrom' => "", 'dateTo' => "");
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$noi['noi_status']]['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$noi['noi_status']]['allData'] = array('status' => $noi['noi_status'], 'dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['allData'] = array('status' => $noi['noi_status'], 'dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					//-----------------END CHILD--------------------//


					if (isset($ret['overall']['all']['all']['card']['cumulative']['val'])) {
						$ret['overall']['all']['all']['card']['cumulative']['val']++;
					}else{
						$ret['overall']['all']['all']['card']['cumulative']['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']['notVal'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'] = 1;
					}

					//-----------------START CHILD--------------------//
					if (isset($ret[$childID['project_id']]['all']['all']['card']['cumulative']['val'])) {
						$ret[$childID['project_id']]['all']['all']['card']['cumulative']['val']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['cumulative']['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['notVal'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['notVal']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']['notVal'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']['notVal'] = 1;
					}
					//-----------------END CHILD--------------------//


					if (isset($ret['overall']['all']['all']['card']['current']['val'])) {
						$ret['overall']['all']['all']['card']['current']['val']++;
					}else{
						$ret['overall']['all']['all']['card']['current']['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['current']['val'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['current']['val']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['current']['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'] = 1;
					}

					//-----------------START CHILD--------------------//
					if (isset($ret[$childID['project_id']]['all']['all']['card']['current']['val'])) {
						$ret[$childID['project_id']]['all']['all']['card']['current']['val']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['current']['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['val'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['val']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['current']['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['current']['val'] = 1;
					}
					//-----------------END CHILD--------------------//


					if (isset($ret['overall']['all']['all']['card'][$noi['noi_status']]['val'])) {
						$ret['overall']['all']['all']['card'][$noi['noi_status']]['val']++;
					}else{
						$ret['overall']['all']['all']['card'][$noi['noi_status']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['notVal'])) {
						$ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['notVal']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card'][$noi['noi_status']]['notVal'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['notVal'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['notVal']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['notVal'] = 1;
					}

					//-----------------START CHILD--------------------//
					if (isset($ret[$childID['project_id']]['all']['all']['card'][$noi['noi_status']]['val'])) {
						$ret[$childID['project_id']]['all']['all']['card'][$noi['noi_status']]['val']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card'][$noi['noi_status']]['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$noi['noi_status']]['notVal'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$noi['noi_status']]['notVal']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$noi['noi_status']]['notVal'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['notVal'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['notVal']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$noi['noi_status']]['notVal'] = 1;
					}
					//-----------------END CHILD--------------------//
				}

				if($dataArr){
					$minDate = strtotime($dataArr[0]['date_issued']);
					$maxDate = strtotime(end($dataArr)['date_issued']);
					$minYear = date("Y", $minDate);
					$maxYear = date("Y", $maxDate);
					$yDiff = $maxYear - $minYear;
					$yr = $minYear;

					$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");
					$monthTextHalf = array("Jan"=>"01","Feb"=>"02","Mar"=>"03","Apr"=>"04","May"=>"05","Jun"=>"06","Jul"=>"07","Aug"=>"08","Sep"=>"09","Oct"=>"10","Nov"=>"11","Dec"=>"12");

					$valYrDataChild = 0;
					$valMthDataChild = 0;
					$valYrPendingChild = 0;
					$valMthPendingChild = 0;
					$valYrClosedChild = 0;
					$valMthClosedChild = 0;
					
					$valMthDataFix = 0;
					$valMthDataClosedFix = 0;
					$valMthDataClosedFix = 0;

					$valMthDataPrev = 0;
					$valMthDataPrevPending = 0;
					$valMthDataPrevClosed = 0;

					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						// for filter
						$yrLastDay = date($childID['cut_off_day'].'/12/'.$nYr);

						//OVERALL YEAR ALL CUMULATIVE
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['notVal'])) {
							$valYrData = $valYrData + $ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['notVal'];
						}
						
						$ret['overall'][$nYr]['all']['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['cumulative']['val'] = $valYrData;

						//OVERALL YEAR PENDING CUMULATIVE
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['Pending']['notVal'])) {
							$valYrPending = $valYrPending +  $ret[$childID['project_id']][$nYr]['all']['card']['Pending']['notVal'];
						}
						$ret['overall'][$nYr]['all']['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['Pending']['val'] = $valYrPending;

						//OVERALL YEAR CLOSED CUMULATIVE
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['Closed']['notVal'])) {
							$valYrClosed = $valYrClosed +  $ret[$childID['project_id']][$nYr]['all']['card']['Closed']['notVal'];
						}
						$ret['overall'][$nYr]['all']['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['Closed']['val'] = $valYrClosed;

						//--------------------START CHILD-------------------//
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['notVal'])) {
							$valYrDataChild = $valYrDataChild + $ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['notVal'];
						}
						$ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret[$childID['project_id']][$nYr]['all']['card']['cumulative']['val'] = $valYrDataChild;

						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['Pending']['notVal'])) {
							$valYrPendingChild = $valYrPendingChild +  $ret[$childID['project_id']][$nYr]['all']['card']['Pending']['notVal'];
						}
						$ret[$childID['project_id']][$nYr]['all']['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret[$childID['project_id']][$nYr]['all']['card']['Pending']['val'] = $valYrPendingChild;

						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['Closed']['notVal'])) {
							$valYrClosedChild = $valYrClosedChild +  $ret[$childID['project_id']][$nYr]['all']['card']['Closed']['notVal'];
						}
						$ret[$childID['project_id']][$nYr]['all']['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret[$childID['project_id']][$nYr]['all']['card']['Closed']['val'] = $valYrClosedChild;
						//---------------------END CHILD--------------------//

						foreach ($monthHalftext as $key => $mthval) {

							//OVERALL YEAR MONTH CUMULATIVE
							$dateString = $nYr.'-'.$mthval;
							$mthYrLastDay = date($childID['cut_off_day'].'/'.$monthTextHalf[$mthval].'/'.$nYr, strtotime($dateString));
							$ret['overall'][$nYr][$mthval]['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);

							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'])) {
								if(isset($ret['overall'][$nYr][$mthval]['card']['cumulative']['val'])){
									$valMthDataPrev = $ret['overall'][$nYr][$mthval]['card']['cumulative']['val'];
								}
								else{
									$valMthDataPrev = $ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'];
								}
								$valMthData = $valMthData + $valMthDataPrev;
							}

							//OVERALL YEAR MONTH PENDING
							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'])) {
								if(isset($ret['overall'][$nYr][$mthval]['card']['Pending']['val'])){
									$valMthDataPrevPending = $ret['overall'][$nYr][$mthval]['card']['Pending']['val'];
								}
								else{
									$valMthDataPrevPending = $ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'];
								}
								$valMthPending = $valMthPending + $valMthDataPrevPending;
							}

							//OVERALL YEAR MONTH CLOSED
							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'])) {
								if(isset($ret['overall'][$nYr][$mthval]['card']['Closed']['val'])){
									$valMthDataPrevClosed = $ret['overall'][$nYr][$mthval]['card']['Closed']['val'];
								}
								else{
									$valMthDataPrevClosed = $ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'];
								}
								$valMthClosed = $valMthClosed + $valMthDataPrevClosed;
							}

							//-----------------START CHILD------------------//
							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'])) {
								$valMthDataChild = $valMthDataChild + $ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'];
							}
							$ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['allData'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['val'] = $valMthDataChild;

							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'])) {
								$valMthPendingChild = $valMthPendingChild +  $ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'];
							}
							$ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['allData'] = array('status' => 'Pending', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['val'] = $valMthPendingChild;

							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'])) {
								$valMthClosedChild = $valMthClosedChild +  $ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'];
							}
							$ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['allData'] = array('status' => 'Closed', 'dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['val'] = $valMthClosedChild;
							//-------------------END CHILD------------------//

							if (isset($ret['overall'][$nYr][$mthval]['card']['cumulative']['val'])){
								if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative']['notVal'])) {
									$valMthDataFix = $ret['overall'][$nYr][$mthval]['card']['cumulative']['val'];
								}
								else{
									$valMthDataFix = $ret['overall'][$nYr][$mthval]['card']['cumulative']['val'];
								}
								$ret['overall'][$nYr][$mthval]['card']['cumulative']['val'] = $valMthDataFix + $valMthDataChild;
							}
							else{
								$ret['overall'][$nYr][$mthval]['card']['cumulative']['val'] = $valMthData;
							}

							if (isset($ret['overall'][$nYr][$mthval]['card']['Pending']['val'])){
								if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Pending']['notVal'])) {
									$valMthDataPendingFix = $ret['overall'][$nYr][$mthval]['card']['Pending']['val'];
								}
								else{
									$valMthDataPendingFix = $ret['overall'][$nYr][$mthval]['card']['Pending']['val'];
								}
								$ret['overall'][$nYr][$mthval]['card']['Pending']['val'] = $valMthDataPendingFix + $valMthPendingChild;
							}
							else{
								$ret['overall'][$nYr][$mthval]['card']['Pending']['val'] = $valMthPending;
							}

							if (isset($ret['overall'][$nYr][$mthval]['card']['Closed']['val'])){
								if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['Closed']['notVal'])) {
									$valMthDataClosedFix = $ret['overall'][$nYr][$mthval]['card']['Closed']['val'];
								}
								else{
									$valMthDataClosedFix = $ret['overall'][$nYr][$mthval]['card']['Closed']['val'];
								}
								$ret['overall'][$nYr][$mthval]['card']['Closed']['val'] = $valMthDataClosedFix + $valMthClosedChild;
							}
							else{
								$ret['overall'][$nYr][$mthval]['card']['Closed']['val'] = $valMthClosed;
							}
							
						}
					}
				}

				
			}
		}

		return $ret;
	}

	function fetchRFIData(){
		$ret = array();
		$monthFulltoHalf = ["January"=>"Jan","February"=>"Feb","March"=>"Mar","April"=>"Apr","May"=>"May","June"=>"Jun","July"=>"Jul","August"=>"Aug","September"=>"Sep","October"=>"Oct","November"=>"Nov","December"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_RFI'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				
				usort($res['data'], function($b, $a) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});
				
				foreach($res['data'] as $rfi){

					//-------------Quality Management Dashboard--------------//
					// for filter conOp
					if(!isset($ret['overall']['all']['all']['card']['allData'])){
						$ret['overall']['all']['all']['card']['allData'] = array('month' => '', 'year' => '');
					}
					if(!isset($ret['overall'][$rfi['year']]['all']['card']['allData'])){
						$ret['overall'][$rfi['year']]['all']['card']['allData'] = array('month' => '', 'year' => $rfi['year']);
					}
					if(!isset($ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['allData'])){
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['allData'] = array('month' => $rfi['month'], 'year' => $rfi['year']);
					}

					if (isset($ret['overall']['all']['all']['card']['ttlSubmit'])) {
						$ret['overall']['all']['all']['card']['ttlSubmit'] = $ret['overall']['all']['all']['card']['ttlSubmit'] + (float) $rfi['total_submitted'];
					}else{
						$ret['overall']['all']['all']['card']['ttlSubmit'] = (float) $rfi['total_submitted'];
					}
					if (isset($ret['overall'][$rfi['year']]['all']['card']['ttlSubmit'])) {
						$ret['overall'][$rfi['year']]['all']['card']['ttlSubmit'] = $ret['overall'][$rfi['year']]['all']['card']['ttlSubmit'] + (float) $rfi['total_submitted'];
					}else{
						$ret['overall'][$rfi['year']]['all']['card']['ttlSubmit'] = (float) $rfi['total_submitted'];
					}
					if (isset($ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'])) {
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'] = $ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'] + (float) $rfi['total_submitted'];
					}else{
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'] = (float) $rfi['total_submitted'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlOpen'])) {
						$ret['overall']['all']['all']['card']['ttlOpen'] = $ret['overall']['all']['all']['card']['ttlOpen'] + (float) $rfi['total_open'];
					}else{
						$ret['overall']['all']['all']['card']['ttlOpen'] = (float) $rfi['total_open'];
					}
					if (isset($ret['overall'][$rfi['year']]['all']['card']['ttlOpen'])) {
						$ret['overall'][$rfi['year']]['all']['card']['ttlOpen'] = $ret['overall'][$rfi['year']]['all']['card']['ttlOpen'] + (float) $rfi['total_open'];
					}else{
						$ret['overall'][$rfi['year']]['all']['card']['ttlOpen'] = (float) $rfi['total_open'];
					}
					if (isset($ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'])) {
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'] = $ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'] + (float) $rfi['total_open'];
					}else{
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'] = (float) $rfi['total_open'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlClose'])) {
						$ret['overall']['all']['all']['card']['ttlClose'] = $ret['overall']['all']['all']['card']['ttlClose'] + (float) $rfi['total_closed'];
					}else{
						$ret['overall']['all']['all']['card']['ttlClose'] = (float) $rfi['total_closed'];
					}
					if (isset($ret['overall'][$rfi['year']]['all']['card']['ttlClose'])) {
						$ret['overall'][$rfi['year']]['all']['card']['ttlClose'] = $ret['overall'][$rfi['year']]['all']['card']['ttlClose'] + (float) $rfi['total_closed'];
					}else{
						$ret['overall'][$rfi['year']]['all']['card']['ttlClose'] = (float) $rfi['total_closed'];
					}
					if (isset($ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'])) {
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'] = $ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'] + (float) $rfi['total_closed'];
					}else{
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'] = (float) $rfi['total_closed'];
					}

				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_RFI'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function($b, $a) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});
				
				foreach($res['data'] as $rfi){

					//-------------Quality Management Dashboard--------------//
					// for filter conOp
					if(!isset($ret['overall']['all']['all']['card']['allData'])){
						$ret['overall']['all']['all']['card']['allData'] = array('month' => '', 'year' => '');
					}
					if(!isset($ret['overall'][$rfi['year']]['all']['card']['allData'])){
						$ret['overall'][$rfi['year']]['all']['card']['allData'] = array('month' => '', 'year' => $rfi['year']);
					}
					if(!isset($ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['allData'])){
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['allData'] = array('month' => $rfi['month'], 'year' => $rfi['year']);
					}

					if (isset($ret['overall']['all']['all']['card']['ttlSubmit'])) {
						$ret['overall']['all']['all']['card']['ttlSubmit'] = $ret['overall']['all']['all']['card']['ttlSubmit'] + (float) $rfi['total_submitted'];
					}else{
						$ret['overall']['all']['all']['card']['ttlSubmit'] = (float) $rfi['total_submitted'];
					}
					if (isset($ret['overall'][$rfi['year']]['all']['card']['ttlSubmit'])) {
						$ret['overall'][$rfi['year']]['all']['card']['ttlSubmit'] = $ret['overall'][$rfi['year']]['all']['card']['ttlSubmit'] + (float) $rfi['total_submitted'];
					}else{
						$ret['overall'][$rfi['year']]['all']['card']['ttlSubmit'] = (float) $rfi['total_submitted'];
					}
					if (isset($ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'])) {
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'] = $ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'] + (float) $rfi['total_submitted'];
					}else{
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'] = (float) $rfi['total_submitted'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlOpen'])) {
						$ret['overall']['all']['all']['card']['ttlOpen'] = $ret['overall']['all']['all']['card']['ttlOpen'] + (float) $rfi['total_open'];
					}else{
						$ret['overall']['all']['all']['card']['ttlOpen'] = (float) $rfi['total_open'];
					}
					if (isset($ret['overall'][$rfi['year']]['all']['card']['ttlOpen'])) {
						$ret['overall'][$rfi['year']]['all']['card']['ttlOpen'] = $ret['overall'][$rfi['year']]['all']['card']['ttlOpen'] + (float) $rfi['total_open'];
					}else{
						$ret['overall'][$rfi['year']]['all']['card']['ttlOpen'] = (float) $rfi['total_open'];
					}
					if (isset($ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'])) {
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'] = $ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'] + (float) $rfi['total_open'];
					}else{
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'] = (float) $rfi['total_open'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlClose'])) {
						$ret['overall']['all']['all']['card']['ttlClose'] = $ret['overall']['all']['all']['card']['ttlClose'] + (float) $rfi['total_closed'];
					}else{
						$ret['overall']['all']['all']['card']['ttlClose'] = (float) $rfi['total_closed'];
					}
					if (isset($ret['overall'][$rfi['year']]['all']['card']['ttlClose'])) {
						$ret['overall'][$rfi['year']]['all']['card']['ttlClose'] = $ret['overall'][$rfi['year']]['all']['card']['ttlClose'] + (float) $rfi['total_closed'];
					}else{
						$ret['overall'][$rfi['year']]['all']['card']['ttlClose'] = (float) $rfi['total_closed'];
					}
					if (isset($ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'])) {
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'] = $ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'] + (float) $rfi['total_closed'];
					}else{
						$ret['overall'][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'] = (float) $rfi['total_closed'];
					}

					//--------------START CHILD------------------//
					// for filter conOp
					if(!isset($ret[$childID['project_id']]['all']['all']['card']['allData'])){
						$ret[$childID['project_id']]['all']['all']['card']['allData'] = array('month' => '', 'year' => '');
					}
					if(!isset($ret[$childID['project_id']][$rfi['year']]['all']['card']['allData'])){
						$ret[$childID['project_id']][$rfi['year']]['all']['card']['allData'] = array('month' => '', 'year' => $rfi['year']);
					}
					if(!isset($ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['allData'])){
						$ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['allData'] = array('month' => $rfi['month'], 'year' => $rfi['year']);
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'] = $ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'] + (float) $rfi['total_submitted'];
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'] = (float) $rfi['total_submitted'];
					}
					if (isset($ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlSubmit'])) {
						$ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlSubmit'] = $ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlSubmit'] + (float) $rfi['total_submitted'];
					}else{
						$ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlSubmit'] = (float) $rfi['total_submitted'];
					}
					if (isset($ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'])) {
						$ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'] = $ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'] + (float) $rfi['total_submitted'];
					}else{
						$ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlSubmit'] = (float) $rfi['total_submitted'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlOpen'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlOpen'] = $ret[$childID['project_id']]['all']['all']['card']['ttlOpen'] + (float) $rfi['total_open'];
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlOpen'] = (float) $rfi['total_open'];
					}
					if (isset($ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlOpen'])) {
						$ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlOpen'] = $ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlOpen'] + (float) $rfi['total_open'];
					}else{
						$ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlOpen'] = (float) $rfi['total_open'];
					}
					if (isset($ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'])) {
						$ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'] = $ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'] + (float) $rfi['total_open'];
					}else{
						$ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlOpen'] = (float) $rfi['total_open'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlClose'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlClose'] = $ret[$childID['project_id']]['all']['all']['card']['ttlClose'] + (float) $rfi['total_closed'];
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlClose'] = (float) $rfi['total_closed'];
					}
					if (isset($ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlClose'])) {
						$ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlClose'] = $ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlClose'] + (float) $rfi['total_closed'];
					}else{
						$ret[$childID['project_id']][$rfi['year']]['all']['card']['ttlClose'] = (float) $rfi['total_closed'];
					}
					if (isset($ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'])) {
						$ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'] = $ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'] + (float) $rfi['total_closed'];
					}else{
						$ret[$childID['project_id']][$rfi['year']][$monthFulltoHalf[$rfi['month']]]['card']['ttlClose'] = (float) $rfi['total_closed'];
					}
					//---------------END CHILD-------------------//
				}
			}
		}

		return $ret;
	}

	function fetchMSData(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_MS'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['submission_date']);
				    $t2 = strtotime($b['submission_date']);
				    return $t1 - $t2;
				});

				foreach($res['data'] as $ms){
					$mthCT = $this->getMonthfromTSRange(new DateTime($ms['submission_date']), $this->cutoffDay);
					$dateCreated = strtotime($ms['submission_date']);

					//-------------Quality Management Dashboard--------------//
					// for filter

					// for cumulative, and by code only as Current based on current month
					if(!isset($ret['overall']['all']['all']['card']['allData'])){
						$ret['overall']['all']['all']['card']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					// for current only
					if(!isset($ret['overall']['all']['all']['card']['allDataCurr'])){
						$ret['overall']['all']['all']['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['card']['cumul'])) {
						$ret['overall']['all']['all']['card']['cumul']++;
					}else{
						$ret['overall']['all']['all']['card']['cumul'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['ttlSubmit'])) {
						$ret['overall']['all']['all']['card']['ttlSubmit']++;
					}else{
						$ret['overall']['all']['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'] = 1;
					}

					//for card Under Review
					if($ms['approval_status'] == "" && $ms['submission_date'] != ""){
						if (isset($ret['overall']['all']['all']['card']['totalNoCode'])) {
							$ret['overall']['all']['all']['card']['totalNoCode']++;
						}else{
							$ret['overall']['all']['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode'])) {
							$ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'] = 1;
						}

						$now = new DateTime();
						$diffDays = floor(($now->getTimestamp()-$dateCreated) / (60 * 60 * 24));
						
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less14'])) {
							$ret['overall']['all']['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less60'])) {
							$ret['overall']['all']['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less100'])) {
							$ret['overall']['all']['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['more100'])) {
							$ret['overall']['all']['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall']['all']['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall']['all']['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall']['all']['all']['byAgingNull']['less100']++;
						}
						else{
							$ret['overall']['all']['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100']++;
						}

					}
					else if ($ms['submission_date'] != ""){
						//for card code1/code2/code3
						if (isset($ret['overall']['all']['all']['card'][$ms['approval_status']])) {
							$ret['overall']['all']['all']['card'][$ms['approval_status']]++;
						}else{
							$ret['overall']['all']['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']])) {
							$ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']]++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']]++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']] = 1;
						}

						//Ageing only for CODE 2
						if($ms['approval_status'] != "Code 2: Approved with Comment") continue; 

						if($ms['resubmitDate']){
							$dateApproved = strtotime($ms['resubmitDate']);
						}
						else{
							$now = new DateTime();
							$dateApproved = $now->getTimestamp();
						}

						$diffDays = floor(($dateApproved - $dateCreated) / (60 * 60 * 24));

						if (!isset($ret['overall']['all']['all']['byAgingWith']['less14'])) {
							$ret['overall']['all']['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less60'])) {
							$ret['overall']['all']['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less100'])) {
							$ret['overall']['all']['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['more100'])) {
							$ret['overall']['all']['all']['byAgingWith']['more100'] = 0;
						}

						if($diffDays <= 14){
							$ret['overall']['all']['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall']['all']['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall']['all']['all']['byAgingWith']['less100']++;
						}
						else{
							$ret['overall']['all']['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100'] = 0;
						}

						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'] = 0;
						}

						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100']++;
						}

					}
				}

				if($res['data']){
					$minDate = strtotime($res['data'][0]['submission_date']);
					$maxDate = strtotime(end($res['data'])['submission_date']);
					$minYear = date("Y", $minDate);
					$maxYear = date("Y", $maxDate);

					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");

					$valYrData = 0;
					$valMthData = 0;

					$valYrPending = 0;
					$valMthPending = 0;

					$valYrClosed = 0;
					$valMthClosed = 0;

					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						
						if (isset($ret['overall'][$nYr]['all']['card']['cumulative'])) {
							$valYrData = $valYrData + $ret['overall'][$nYr]['all']['card']['cumulative'];
						}
						// for filter
						$yrLastDay = date($this->cutoffDay.'/12/'.$nYr);
						$ret['overall'][$nYr]['all']['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['cumul'] = $valYrData;

						foreach ($monthHalftext as $key => $mthval) {
							if (isset($ret['overall'][$nYr][$mthval]['card']['cumulative'])) {
								$valMthData = $valMthData + $ret['overall'][$nYr][$mthval]['card']['cumulative'];
							}
							$mthYrLastDay = date($this->cutoffDay.'/'.str_pad($key,2,"0",STR_PAD_LEFT).'/'.$nYr);
							$ret['overall'][$nYr][$mthval]['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['cumul'] = $valMthData;
						}
					}
				}

			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_MS'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['submission_date']);
				    $t2 = strtotime($b['submission_date']);
				    return $t1 - $t2;
				});

				foreach($res['data'] as $ms){
					$mthCT = $this->getMonthfromTSRange(new DateTime($ms['submission_date']), $this->cutoffDay);
					$dateCreated = strtotime($ms['submission_date']);

					//-------------Quality Management Dashboard--------------//
					// for filter

					// for cumulative, and by code only as Current based on current month
					if(!isset($ret['overall']['all']['all']['card']['allData'])){
						$ret['overall']['all']['all']['card']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if(!isset($ret['overall']['all']['all']['card']['allDataCurr'])){
						$ret['overall']['all']['all']['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					
					if (isset($ret['overall']['all']['all']['card']['cumul'])) {
						$ret['overall']['all']['all']['card']['cumul']++;
					}else{
						$ret['overall']['all']['all']['card']['cumul'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['ttlSubmit'])) {
						$ret['overall']['all']['all']['card']['ttlSubmit']++;
					}else{
						$ret['overall']['all']['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'] = 1;
					}

					//---------------START CHILD-------------------//
					// for filter
					// for cumulative, and by code only as Current based on current month
					if(!isset($ret[$childID['project_id']]['all']['all']['card']['allData'])){
						$ret[$childID['project_id']]['all']['all']['card']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					// for current only
					if(!isset($ret[$childID['project_id']]['all']['all']['card']['allDataCurr'])){
						$ret[$childID['project_id']]['all']['all']['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'])){
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					
					if (isset($ret[$childID['project_id']]['all']['all']['card']['cumul'])) {
						$ret[$childID['project_id']]['all']['all']['card']['cumul']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['cumul'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'] = 1;
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlSubmit']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['ttlSubmit'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['ttlSubmit']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'] = 1;
					}
					//---------------END CHILD-------------------//

					//for card Under Review
					if($ms['approval_status'] == "" && $ms['submission_date'] != ""){
						if (isset($ret['overall']['all']['all']['card']['totalNoCode'])) {
							$ret['overall']['all']['all']['card']['totalNoCode']++;
						}else{
							$ret['overall']['all']['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode'])) {
							$ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'] = 1;
						}

						//---------------START CHILD-------------------//
						if (isset($ret[$childID['project_id']]['all']['all']['card']['totalNoCode'])) {
							$ret[$childID['project_id']]['all']['all']['card']['totalNoCode']++;
						}else{
							$ret[$childID['project_id']]['all']['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['totalNoCode'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['totalNoCode']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'] = 1;
						}
						//---------------END CHILD-------------------//

						$now = new DateTime();
						$diffDays = floor(($now->getTimestamp()-$dateCreated) / (60 * 60 * 24));
						
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less14'])) {
							$ret['overall']['all']['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less60'])) {
							$ret['overall']['all']['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less100'])) {
							$ret['overall']['all']['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['more100'])) {
							$ret['overall']['all']['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall']['all']['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall']['all']['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall']['all']['all']['byAgingNull']['less100']++;
						}
						else{
							$ret['overall']['all']['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100']++;
						}


						//---------------START CHILD-------------------//
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingNull']['less14'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingNull']['less60'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingNull']['less100'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingNull']['more100'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less100']++;
						}
						else{
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less14'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less60'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less100'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['more100'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less100']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100']++;
						}
						//------------------END CHILD-------------------------//

					}
					else if ($ms['submission_date'] != ""){
						//for card code1/code2/code3
						if (isset($ret['overall']['all']['all']['card'][$ms['approval_status']])) {
							$ret['overall']['all']['all']['card'][$ms['approval_status']]++;
						}else{
							$ret['overall']['all']['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']])) {
							$ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']]++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']]++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']] = 1;
						}

						//------------------START CHILD-------------------------//
						if (isset($ret[$childID['project_id']]['all']['all']['card'][$ms['approval_status']])) {
							$ret[$childID['project_id']]['all']['all']['card'][$ms['approval_status']]++;
						}else{
							$ret[$childID['project_id']]['all']['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ms['approval_status']])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ms['approval_status']]++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']]++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']] = 1;
						}
						//------------------END CHILD-------------------------//

						//Ageing only for CODE 2
						if($ms['approval_status'] != "Code 2: Approved with Comment") continue; 

						if($ms['resubmitDate']){
							$dateApproved = strtotime($ms['resubmitDate']);
						}
						else{
							$now = new DateTime();
							$dateApproved = $now->getTimestamp();
						}

						$diffDays = floor(($dateApproved - $dateCreated) / (60 * 60 * 24));
						
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less14'])) {
							$ret['overall']['all']['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less60'])) {
							$ret['overall']['all']['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less100'])) {
							$ret['overall']['all']['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['more100'])) {
							$ret['overall']['all']['all']['byAgingWith']['more100'] = 0;
						}

						if($diffDays <= 14){
							$ret['overall']['all']['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall']['all']['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall']['all']['all']['byAgingWith']['less100']++;
						}
						else{
							$ret['overall']['all']['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100'] = 0;
						}

						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'] = 0;
						}

						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100']++;
						}

						//------------------START CHILD-------------------------//
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingWith']['less14'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingWith']['less60'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingWith']['less100'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingWith']['more100'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['more100'] = 0;
						}

						if($diffDays <= 14){
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less100']++;
						}
						else{
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less14'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less60'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less100'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['more100'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['more100'] = 0;
						}

						if($diffDays <= 14){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less100']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'] = 0;
						}

						if($diffDays <= 14){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100']++;
						}
						//------------------END CHILD-------------------------//
					}
				}

				if($res['data']){
					$minDate = strtotime($res['data'][0]['submission_date']);
					$maxDate = strtotime(end($res['data'])['submission_date']);
					$minYear = date("Y", $minDate);
					$maxYear = date("Y", $maxDate);

					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");

					$valYrData = 0;
					$valMthData = 0;
					$valYrDataChild = 0;
					$valMthDataChild = 0;

					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						
						if (isset($ret['overall'][$nYr]['all']['card']['cumulative'])) {
							$valYrData = $valYrData + $ret['overall'][$nYr]['all']['card']['cumulative'];
						}
						// for filter
						$yrLastDay = date($childID['cut_off_day'].'/12/'.$nYr);
						$ret['overall'][$nYr]['all']['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['cumul'] = $valYrData;

						//--------------START CHILD------------//
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['cumulative'])) {
							$valYrDataChild = $valYrDataChild + $ret[$childID['project_id']][$nYr]['all']['card']['cumulative'];
						}
						$ret[$childID['project_id']][$nYr]['all']['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret[$childID['project_id']][$nYr]['all']['card']['cumul'] = $valYrDataChild;
						//--------------END CHILD------------//

						foreach ($monthHalftext as $key => $mthval) {
							if (isset($ret['overall'][$nYr][$mthval]['card']['cumulative'])) {
								$valMthData = $valMthData + $ret['overall'][$nYr][$mthval]['card']['cumulative'];
							}
							
							$mthYrLastDay = date($childID['cut_off_day'].'/'.str_pad($key,2,"0",STR_PAD_LEFT).'/'.$nYr);
							$ret['overall'][$nYr][$mthval]['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['cumul'] = $valMthData;

							//--------------START CHILD-------------//
							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative'])) {
								$valMthDataChild = $valMthDataChild + $ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative'];
							}
							$ret[$childID['project_id']][$nYr][$mthval]['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret[$childID['project_id']][$nYr][$mthval]['card']['cumul'] = $valMthDataChild;
							//---------------END CHILD--------------//
						}
					}
				}

				
			}
		}

		return $ret;
	}

	function fetchMTData(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_MT'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['submission_date']);
				    $t2 = strtotime($b['submission_date']);
				    return $t1 - $t2;
				});

				foreach($res['data'] as $ms){
					$mthCT = $this->getMonthfromTSRange(new DateTime($ms['submission_date']), $this->cutoffDay);
					$dateCreated = strtotime($ms['submission_date']);

					//-------------Quality Management Dashboard--------------//
					// for filter

					if(!isset($ret['overall']['all']['all']['card']['allData'])){
						$ret['overall']['all']['all']['card']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if(!isset($ret['overall']['all']['all']['card']['allDataCurr'])){
						$ret['overall']['all']['all']['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['card']['cumul'])) {
						$ret['overall']['all']['all']['card']['cumul']++;
					}else{
						$ret['overall']['all']['all']['card']['cumul'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['ttlSubmit'])) {
						$ret['overall']['all']['all']['card']['ttlSubmit']++;
					}else{
						$ret['overall']['all']['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'] = 1;
					}

					//for card Under Review
					if($ms['approval_status'] == ""){
						if (isset($ret['overall']['all']['all']['card']['totalNoCode'])) {
							$ret['overall']['all']['all']['card']['totalNoCode']++;
						}else{
							$ret['overall']['all']['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode'])) {
							$ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'] = 1;
						}

						$now = new DateTime();
						$diffDays = floor(($now->getTimestamp()-$dateCreated) / (60 * 60 * 24));
						
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less14'])) {
							$ret['overall']['all']['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less60'])) {
							$ret['overall']['all']['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less100'])) {
							$ret['overall']['all']['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['more100'])) {
							$ret['overall']['all']['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall']['all']['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall']['all']['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall']['all']['all']['byAgingNull']['less100']++;
						}
						else{
							$ret['overall']['all']['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100']++;
						}

					}
					else{
						//for card code1/code2/code3
						if (isset($ret['overall']['all']['all']['card'][$ms['approval_status']])) {
							$ret['overall']['all']['all']['card'][$ms['approval_status']]++;
						}else{
							$ret['overall']['all']['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']])) {
							$ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']]++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']]++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']] = 1;
						}

						//Ageing only for CODE 2
						if($ms['approval_status'] != "Code 2: Approved with Comment") continue; 

						if($ms['resubmitDate']){
							$dateApproved = strtotime($ms['resubmitDate']);
						}
						else{
							$now = new DateTime();
							$dateApproved = $now->getTimestamp();
						}

						$diffDays = floor(($dateApproved - $dateCreated) / (60 * 60 * 24));
						
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less14'])) {
							$ret['overall']['all']['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less60'])) {
							$ret['overall']['all']['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less100'])) {
							$ret['overall']['all']['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['more100'])) {
							$ret['overall']['all']['all']['byAgingWith']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall']['all']['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall']['all']['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall']['all']['all']['byAgingWith']['less100']++;
						}
						else{
							$ret['overall']['all']['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100']++;
						}

					}
				}

				if($res['data']){
					$minDate = strtotime($res['data'][0]['submission_date']);
					$maxDate = strtotime(end($res['data'])['submission_date']);
					$minYear = date("Y", $minDate);
					$maxYear = date("Y", $maxDate);

					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");

					$valYrData = 0;
					$valMthData = 0;

					$valYrPending = 0;
					$valMthPending = 0;

					$valYrClosed = 0;
					$valMthClosed = 0;

					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						
						if (isset($ret['overall'][$nYr]['all']['card']['cumulative'])) {
							$valYrData = $valYrData + $ret['overall'][$nYr]['all']['card']['cumulative'];
						}
						$yrLastDay = date($this->cutoffDay.'/12/'.$nYr);
						$ret['overall'][$nYr]['all']['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['cumul'] = $valYrData;

						foreach ($monthHalftext as $key => $mthval) {
							if (isset($ret['overall'][$nYr][$mthval]['card']['cumulative'])) {
								$valMthData = $valMthData + $ret['overall'][$nYr][$mthval]['card']['cumulative'];
							}
							$mthYrLastDay = date($this->cutoffDay.'/'.str_pad($key,2,"0",STR_PAD_LEFT).'/'.$nYr);
							$ret['overall'][$nYr][$mthval]['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['cumul'] = $valMthData;
						}
					}
				}
				
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_MT'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['submission_date']);
				    $t2 = strtotime($b['submission_date']);
				    return $t1 - $t2;
				});

				foreach($res['data'] as $ms){
					$mthCT = $this->getMonthfromTSRange(new DateTime($ms['submission_date']), $this->cutoffDay);
					$dateCreated = strtotime($ms['submission_date']);

					//-------------Quality Management Dashboard--------------//
					// for filter
					if(!isset($ret['overall']['all']['all']['card']['allData'])){
						$ret['overall']['all']['all']['card']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if(!isset($ret['overall'][$mthCT['yr']]['all']['card']['allData'])){
						$ret['overall'][$mthCT['yr']]['all']['card']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					// for current only
					$mthYrFirstDayCurr = date('01/m/Y');
					$mthYrLastDayCurr = date('t/m/Y');

					if(!isset($ret['overall']['all']['all']['card']['allDataCurr'])){
						$ret['overall']['all']['all']['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if(!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'])){
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['card']['cumul'])) {
						$ret['overall']['all']['all']['card']['cumul']++;
					}else{
						$ret['overall']['all']['all']['card']['cumul'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'] = 1;
					}

					if (isset($ret['overall']['all']['all']['card']['ttlSubmit'])) {
						$ret['overall']['all']['all']['card']['ttlSubmit']++;
					}else{
						$ret['overall']['all']['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'] = 1;
					}

					//------------------START CHILD----------------------//
					// for filter

					if(!isset($ret[$childID['project_id']]['all']['all']['card']['allData'])){
						$ret[$childID['project_id']]['all']['all']['card']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'])){
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					// for current only
					$mthYrFirstDayCurr = date('01/m/Y');
					$mthYrLastDayCurr = date('t/m/Y');

					if(!isset($ret[$childID['project_id']]['all']['all']['card']['allDataCurr'])){
						$ret[$childID['project_id']]['all']['all']['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if(!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'])){
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['allDataCurr'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['cumul'])) {
						$ret[$childID['project_id']]['all']['all']['card']['cumul']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['cumul'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'] = 1;
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlSubmit']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['ttlSubmit'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['ttlSubmit']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['ttlSubmit'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['ttlSubmit'] = 1;
					}
					//-------------------END CHILD-----------------------//

					//for card Under Review
					if($ms['approval_status'] == ""){
						if (isset($ret['overall']['all']['all']['card']['totalNoCode'])) {
							$ret['overall']['all']['all']['card']['totalNoCode']++;
						}else{
							$ret['overall']['all']['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode'])) {
							$ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode']++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode']++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'] = 1;
						}

						//-------------------START CHILD-----------------------//
						if (isset($ret[$childID['project_id']]['all']['all']['card']['totalNoCode'])) {
							$ret[$childID['project_id']]['all']['all']['card']['totalNoCode']++;
						}else{
							$ret[$childID['project_id']]['all']['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['totalNoCode'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['totalNoCode']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['totalNoCode'] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode']++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['totalNoCode'] = 1;
						}
						//-------------------END CHILD-----------------------//


						$now = new DateTime();
						$diffDays = floor(($now->getTimestamp()-$dateCreated) / (60 * 60 * 24));
						
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less14'])) {
							$ret['overall']['all']['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less60'])) {
							$ret['overall']['all']['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['less100'])) {
							$ret['overall']['all']['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingNull']['more100'])) {
							$ret['overall']['all']['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall']['all']['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall']['all']['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall']['all']['all']['byAgingNull']['less100']++;
						}
						else{
							$ret['overall']['all']['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100']++;
						}

						//--------------------START CHILD--------------------------//
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingNull']['less14'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingNull']['less60'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingNull']['less100'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingNull']['more100'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['less100']++;
						}
						else{
							$ret[$childID['project_id']]['all']['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less14'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less60'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less100'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['more100'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['less100']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingNull']['more100']++;
						}

						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['less100']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingNull']['more100']++;
						}
						//--------------------END CHILD--------------------------//

					}
					else{
						//for card code1/code2/code3
						if (isset($ret['overall']['all']['all']['card'][$ms['approval_status']])) {
							$ret['overall']['all']['all']['card'][$ms['approval_status']]++;
						}else{
							$ret['overall']['all']['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']])) {
							$ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']]++;
						}else{
							$ret['overall'][$mthCT['yr']]['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']]++;
						}else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']] = 1;
						}

						//--------------------START CHILD--------------------------//
						if (isset($ret[$childID['project_id']]['all']['all']['card'][$ms['approval_status']])) {
							$ret[$childID['project_id']]['all']['all']['card'][$ms['approval_status']]++;
						}else{
							$ret[$childID['project_id']]['all']['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ms['approval_status']])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ms['approval_status']]++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$ms['approval_status']] = 1;
						}
						if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']]++;
						}else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$ms['approval_status']] = 1;
						}
						//--------------------END CHILD--------------------------//

						//Ageing only for CODE 2
						if($ms['approval_status'] != "Code 2: Approved with Comment") continue; 
						
						if($ms['resubmitDate']){
							$dateApproved = strtotime($ms['resubmitDate']);
						}
						else{
							$now = new DateTime();
							$dateApproved = $now->getTimestamp();
						}

						$diffDays = floor(($dateApproved - $dateCreated) / (60 * 60 * 24));
						
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less14'])) {
							$ret['overall']['all']['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less60'])) {
							$ret['overall']['all']['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['less100'])) {
							$ret['overall']['all']['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall']['all']['all']['byAgingWith']['more100'])) {
							$ret['overall']['all']['all']['byAgingWith']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall']['all']['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall']['all']['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall']['all']['all']['byAgingWith']['less100']++;
						}
						else{
							$ret['overall']['all']['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100'])) {
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']]['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'])) {
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100']++;
						}
						else{
							$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100']++;
						}

						//---------------START CHILD-------------------//
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingWith']['less14'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingWith']['less60'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingWith']['less100'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']]['all']['all']['byAgingWith']['more100'])) {
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['less100']++;
						}
						else{
							$ret[$childID['project_id']]['all']['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less14'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less60'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less100'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['more100'])) {
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['less100']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']]['all']['byAgingWith']['more100']++;
						}

						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100'] = 0;
						}
						if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'])) {
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100'] = 0;
						}
	
						if($diffDays <= 14){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less14']++;
						}
						else if ($diffDays >= 15 && $diffDays <= 60){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less60']++;
						}
						else if ($diffDays >= 61 && $diffDays <= 100){
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['less100']++;
						}
						else{
							$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['byAgingWith']['more100']++;
						}
						//---------------END CHILD-------------------//

					}
				}

				if($res['data']){
					$minDate = strtotime($res['data'][0]['submission_date']);
					$maxDate = strtotime(end($res['data'])['submission_date']);
					$minYear = date("Y", $minDate);
					$maxYear = date("Y", $maxDate);

					$yDiff = $maxYear - $minYear;
					$yr = $minYear;
					$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");

					$valYrData = 0;
					$valMthData = 0;
					$valYrDataChild = 0;
					$valMthDataChild = 0;

					for ($i=0; $i < $yDiff+1 ; $i++) {
						$nYr = $yr++; 
						
						if (isset($ret['overall'][$nYr]['all']['card']['cumulative'])) {
							$valYrData = $valYrData + $ret['overall'][$nYr]['all']['card']['cumulative'];
						}
						// for filter
						$yrLastDay = date($childID['cut_off_day'].'/12/'.$nYr);
						$ret['overall'][$nYr]['all']['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret['overall'][$nYr]['all']['card']['cumul'] = $valYrData;

						//--------------START CHILD------------//
						if (isset($ret[$childID['project_id']][$nYr]['all']['card']['cumulative'])) {
							$valYrDataChild = $valYrDataChild + $ret[$childID['project_id']][$nYr]['all']['card']['cumulative'];
						}
						$ret[$childID['project_id']][$nYr]['all']['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $yrLastDay);
						$ret[$childID['project_id']][$nYr]['all']['card']['cumul'] = $valYrDataChild;
						//--------------END CHILD------------//

						foreach ($monthHalftext as $key => $mthval) {
							if (isset($ret['overall'][$nYr][$mthval]['card']['cumulative'])) {
								$valMthData = $valMthData + $ret['overall'][$nYr][$mthval]['card']['cumulative'];
							}
							$mthYrLastDay = date($childID['cut_off_day'].'/'.str_pad($key,2,"0",STR_PAD_LEFT).'/'.$nYr);
							$ret['overall'][$nYr][$mthval]['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret['overall'][$nYr][$mthval]['card']['cumul'] = $valMthData;

							//--------------START CHILD-------------//
							if (isset($ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative'])) {
								$valMthDataChild = $valMthDataChild + $ret[$childID['project_id']][$nYr][$mthval]['card']['cumulative'];
							}
							$ret[$childID['project_id']][$nYr][$mthval]['card']['allDataCumul'] = array('dateFrom' => '', 'dateTo' => $mthYrLastDay);
							$ret[$childID['project_id']][$nYr][$mthval]['card']['cumul'] = $valMthDataChild;
							//---------------END CHILD--------------//
						}
					}
				}
			}
		}

		return $ret;
	}

	function fetchWIRData(){
		$ret = array();
		$monthFulltoHalf = ["January"=>"Jan","February"=>"Feb","March"=>"Mar","April"=>"Apr","May"=>"May","June"=>"Jun","July"=>"Jul","August"=>"Aug","September"=>"Sep","October"=>"Oct","November"=>"Nov","December"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_WIR'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				
				usort($res['data'], function($b, $a) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});
				
				foreach($res['data'] as $wir){

					//-------------Quality Management Dashboard--------------//
					// for filter
					if(!isset($ret['overall']['all']['all']['card']['allData'])){
						$ret['overall']['all']['all']['card']['allData'] = array('year' => '', 'month' => '');
					}
					if(!isset($ret['overall'][$wir['year']]['all']['card']['allData'])){
						$ret['overall'][$wir['year']]['all']['card']['allData'] = array('year' => $wir['year'], 'month' => '');
					}
					if(!isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['allData'])){
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['allData'] = array('year' => $wir['year'], 'month' => $wir['month']);
					}

					if (isset($ret['overall']['all']['all']['card']['ttlSubmit'])) {
						$ret['overall']['all']['all']['card']['ttlSubmit'] = $ret['overall']['all']['all']['card']['ttlSubmit'] + (float) $wir['total_submitted'];
					}else{
						$ret['overall']['all']['all']['card']['ttlSubmit'] = (float) $wir['total_submitted'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlSubmit'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlSubmit'] = $ret['overall'][$wir['year']]['all']['card']['ttlSubmit'] + (float) $wir['total_submitted'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlSubmit'] = (float) $wir['total_submitted'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'] + (float) $wir['total_submitted'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'] = (float) $wir['total_submitted'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlApproved'])) {
						$ret['overall']['all']['all']['card']['ttlApproved'] = $ret['overall']['all']['all']['card']['ttlApproved'] + (float) $wir['total_approved'];
					}else{
						$ret['overall']['all']['all']['card']['ttlApproved'] = (float) $wir['total_approved'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlApproved'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlApproved'] = $ret['overall'][$wir['year']]['all']['card']['ttlApproved'] + (float) $wir['total_approved'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlApproved'] = (float) $wir['total_approved'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'] + (float) $wir['total_approved'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'] = (float) $wir['total_approved'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlUnApproved'])) {
						$ret['overall']['all']['all']['card']['ttlUnApproved'] = $ret['overall']['all']['all']['card']['ttlUnApproved'] + (float) $wir['total_unapproved'];
					}else{
						$ret['overall']['all']['all']['card']['ttlUnApproved'] = (float) $wir['total_unapproved'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlUnApproved'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlUnApproved'] = $ret['overall'][$wir['year']]['all']['card']['ttlUnApproved'] + (float) $wir['total_unapproved'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlUnApproved'] = (float) $wir['total_unapproved'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'] + (float) $wir['total_unapproved'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'] = (float) $wir['total_unapproved'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlCancel'])) {
						$ret['overall']['all']['all']['card']['ttlCancel'] = $ret['overall']['all']['all']['card']['ttlCancel'] + (float) $wir['total_cancelled'];
					}else{
						$ret['overall']['all']['all']['card']['ttlCancel'] = (float) $wir['total_cancelled'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlCancel'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlCancel'] = $ret['overall'][$wir['year']]['all']['card']['ttlCancel'] + (float) $wir['total_cancelled'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlCancel'] = (float) $wir['total_cancelled'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'] + (float) $wir['total_cancelled'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'] = (float) $wir['total_cancelled'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlPending'])) {
						$ret['overall']['all']['all']['card']['ttlPending'] = $ret['overall']['all']['all']['card']['ttlPending'] + (float) $wir['total_pending'];
					}else{
						$ret['overall']['all']['all']['card']['ttlPending'] = (float) $wir['total_pending'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlPending'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlPending'] = $ret['overall'][$wir['year']]['all']['card']['ttlPending'] + (float) $wir['total_pending'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlPending'] = (float) $wir['total_pending'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'] + (float) $wir['total_pending'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'] = (float) $wir['total_pending'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlClose'])) {
						$ret['overall']['all']['all']['card']['ttlClose'] = $ret['overall']['all']['all']['card']['ttlClose'] + (float) $wir['total_closed'];
					}else{
						$ret['overall']['all']['all']['card']['ttlClose'] = (float) $wir['total_closed'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlClose'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlClose'] = $ret['overall'][$wir['year']]['all']['card']['ttlClose'] + (float) $wir['total_closed'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlClose'] = (float) $wir['total_closed'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'] + (float) $wir['total_closed'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'] = (float) $wir['total_closed'];
					}

				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_WIR'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function($b, $a) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});
				
				foreach($res['data'] as $wir){

					//-------------Quality Management Dashboard--------------//
					// for filter
					if(!isset($ret['overall']['all']['all']['card']['allData'])){
						$ret['overall']['all']['all']['card']['allData'] = array('year' => '', 'month' => '');
					}
					if(!isset($ret['overall'][$wir['year']]['all']['card']['allData'])){
						$ret['overall'][$wir['year']]['all']['card']['allData'] = array('year' => $wir['year'], 'month' => '');
					}
					if(!isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['allData'])){
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['allData'] = array('year' => $wir['year'], 'month' => $wir['month']);
					}
					
					if (isset($ret['overall']['all']['all']['card']['ttlSubmit'])) {
						$ret['overall']['all']['all']['card']['ttlSubmit'] = $ret['overall']['all']['all']['card']['ttlSubmit'] + (float) $wir['total_submitted'];
					}else{
						$ret['overall']['all']['all']['card']['ttlSubmit'] = (float) $wir['total_submitted'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlSubmit'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlSubmit'] = $ret['overall'][$wir['year']]['all']['card']['ttlSubmit'] + (float) $wir['total_submitted'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlSubmit'] = (float) $wir['total_submitted'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'] + (float) $wir['total_submitted'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'] = (float) $wir['total_submitted'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlApproved'])) {
						$ret['overall']['all']['all']['card']['ttlApproved'] = $ret['overall']['all']['all']['card']['ttlApproved'] + (float) $wir['total_approved'];
					}else{
						$ret['overall']['all']['all']['card']['ttlApproved'] = (float) $wir['total_approved'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlApproved'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlApproved'] = $ret['overall'][$wir['year']]['all']['card']['ttlApproved'] + (float) $wir['total_approved'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlApproved'] = (float) $wir['total_approved'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'] + (float) $wir['total_approved'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'] = (float) $wir['total_approved'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlUnApproved'])) {
						$ret['overall']['all']['all']['card']['ttlUnApproved'] = $ret['overall']['all']['all']['card']['ttlUnApproved'] + (float) $wir['total_unapproved'];
					}else{
						$ret['overall']['all']['all']['card']['ttlUnApproved'] = (float) $wir['total_unapproved'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlUnApproved'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlUnApproved'] = $ret['overall'][$wir['year']]['all']['card']['ttlUnApproved'] + (float) $wir['total_unapproved'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlUnApproved'] = (float) $wir['total_unapproved'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'] + (float) $wir['total_unapproved'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'] = (float) $wir['total_unapproved'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlCancel'])) {
						$ret['overall']['all']['all']['card']['ttlCancel'] = $ret['overall']['all']['all']['card']['ttlCancel'] + (float) $wir['total_cancelled'];
					}else{
						$ret['overall']['all']['all']['card']['ttlCancel'] = (float) $wir['total_cancelled'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlCancel'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlCancel'] = $ret['overall'][$wir['year']]['all']['card']['ttlCancel'] + (float) $wir['total_cancelled'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlCancel'] = (float) $wir['total_cancelled'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'] + (float) $wir['total_cancelled'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'] = (float) $wir['total_cancelled'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlPending'])) {
						$ret['overall']['all']['all']['card']['ttlPending'] = $ret['overall']['all']['all']['card']['ttlPending'] + (float) $wir['total_pending'];
					}else{
						$ret['overall']['all']['all']['card']['ttlPending'] = (float) $wir['total_pending'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlPending'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlPending'] = $ret['overall'][$wir['year']]['all']['card']['ttlPending'] + (float) $wir['total_pending'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlPending'] = (float) $wir['total_pending'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'] + (float) $wir['total_pending'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'] = (float) $wir['total_pending'];
					}

					if (isset($ret['overall']['all']['all']['card']['ttlClose'])) {
						$ret['overall']['all']['all']['card']['ttlClose'] = $ret['overall']['all']['all']['card']['ttlClose'] + (float) $wir['total_closed'];
					}else{
						$ret['overall']['all']['all']['card']['ttlClose'] = (float) $wir['total_closed'];
					}
					if (isset($ret['overall'][$wir['year']]['all']['card']['ttlClose'])) {
						$ret['overall'][$wir['year']]['all']['card']['ttlClose'] = $ret['overall'][$wir['year']]['all']['card']['ttlClose'] + (float) $wir['total_closed'];
					}else{
						$ret['overall'][$wir['year']]['all']['card']['ttlClose'] = (float) $wir['total_closed'];
					}
					if (isset($ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'])) {
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'] = $ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'] + (float) $wir['total_closed'];
					}else{
						$ret['overall'][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'] = (float) $wir['total_closed'];
					}


					//----------------START CHILD---------------//
					// for filter
					if(!isset($ret[$childID['project_id']]['all']['all']['card']['allData'])){
						$ret[$childID['project_id']]['all']['all']['card']['allData'] = array('year' => '', 'month' => '');
					}
					if(!isset($ret[$childID['project_id']][$wir['year']]['all']['card']['allData'])){
						$ret[$childID['project_id']][$wir['year']]['all']['card']['allData'] = array('year' => $wir['year'], 'month' => '');
					}
					if(!isset($ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['allData'])){
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['allData'] = array('year' => $wir['year'], 'month' => $wir['month']);
					}
					
					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'] = $ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'] + (float) $wir['total_submitted'];
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlSubmit'] = (float) $wir['total_submitted'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']]['all']['card']['ttlSubmit'])) {
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlSubmit'] = $ret[$childID['project_id']][$wir['year']]['all']['card']['ttlSubmit'] + (float) $wir['total_submitted'];
					}else{
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlSubmit'] = (float) $wir['total_submitted'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'])) {
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'] = $ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'] + (float) $wir['total_submitted'];
					}else{
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlSubmit'] = (float) $wir['total_submitted'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlApproved'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlApproved'] = $ret[$childID['project_id']]['all']['all']['card']['ttlApproved'] + (float) $wir['total_approved'];
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlApproved'] = (float) $wir['total_approved'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']]['all']['card']['ttlApproved'])) {
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlApproved'] = $ret[$childID['project_id']][$wir['year']]['all']['card']['ttlApproved'] + (float) $wir['total_approved'];
					}else{
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlApproved'] = (float) $wir['total_approved'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'])) {
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'] = $ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'] + (float) $wir['total_approved'];
					}else{
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlApproved'] = (float) $wir['total_approved'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlUnApproved'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlUnApproved'] = $ret[$childID['project_id']]['all']['all']['card']['ttlUnApproved'] + (float) $wir['total_unapproved'];
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlUnApproved'] = (float) $wir['total_unapproved'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']]['all']['card']['ttlUnApproved'])) {
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlUnApproved'] = $ret[$childID['project_id']][$wir['year']]['all']['card']['ttlUnApproved'] + (float) $wir['total_unapproved'];
					}else{
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlUnApproved'] = (float) $wir['total_unapproved'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'])) {
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'] = $ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'] + (float) $wir['total_unapproved'];
					}else{
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlUnApproved'] = (float) $wir['total_unapproved'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlCancel'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlCancel'] = $ret[$childID['project_id']]['all']['all']['card']['ttlCancel'] + (float) $wir['total_cancelled'];
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlCancel'] = (float) $wir['total_cancelled'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']]['all']['card']['ttlCancel'])) {
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlCancel'] = $ret[$childID['project_id']][$wir['year']]['all']['card']['ttlCancel'] + (float) $wir['total_cancelled'];
					}else{
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlCancel'] = (float) $wir['total_cancelled'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'])) {
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'] = $ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'] + (float) $wir['total_cancelled'];
					}else{
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlCancel'] = (float) $wir['total_cancelled'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlPending'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlPending'] = $ret[$childID['project_id']]['all']['all']['card']['ttlPending'] + (float) $wir['total_pending'];
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlPending'] = (float) $wir['total_pending'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']]['all']['card']['ttlPending'])) {
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlPending'] = $ret[$childID['project_id']][$wir['year']]['all']['card']['ttlPending'] + (float) $wir['total_pending'];
					}else{
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlPending'] = (float) $wir['total_pending'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'])) {
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'] = $ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'] + (float) $wir['total_pending'];
					}else{
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlPending'] = (float) $wir['total_pending'];
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['ttlClose'])) {
						$ret[$childID['project_id']]['all']['all']['card']['ttlClose'] = $ret[$childID['project_id']]['all']['all']['card']['ttlClose'] + (float) $wir['total_closed'];
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['ttlClose'] = (float) $wir['total_closed'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']]['all']['card']['ttlClose'])) {
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlClose'] = $ret[$childID['project_id']][$wir['year']]['all']['card']['ttlClose'] + (float) $wir['total_closed'];
					}else{
						$ret[$childID['project_id']][$wir['year']]['all']['card']['ttlClose'] = (float) $wir['total_closed'];
					}
					if (isset($ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'])) {
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'] = $ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'] + (float) $wir['total_closed'];
					}else{
						$ret[$childID['project_id']][$wir['year']][$monthFulltoHalf[$wir['month']]]['card']['ttlClose'] = (float) $wir['total_closed'];
					}
					//-------------END CHILD-------------------//
				}
			}
		}


		return $ret;
	}

	function fetchRRData(){
		$ret = array();
		$monthFulltoHalf = ["January"=>"Jan","February"=>"Feb","March"=>"Mar","April"=>"Apr","May"=>"May","June"=>"Jun","July"=>"Jul","August"=>"Aug","September"=>"Sep","October"=>"Oct","November"=>"Nov","December"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_RR'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($b, $a) {
				    $t1 = strtotime($a['date_identified']);
				    $t2 = strtotime($b['date_identified']);
				    return $t1 - $t2;
				});

				foreach($res['data'] as $rr){
					$dateCreated = strtotime($rr['date_identified']);
					$year = date("Y", $dateCreated);
					$month = date("M", $dateCreated);

					//-------------Main Summary Dashboard--------------//
					// for conOp data filter 
					$mthYrFirstDay = date('01/m/Y', $dateCreated);
					$mthYrLastDay = date('t/m/Y', $dateCreated);
					$yrFirstDay = date('01/01/Y', $dateCreated);
					$yrLastDay = date('31/12/Y', $dateCreated);

					if (!isset($ret['overall']['all']['all']['card']['riskStatus']['allData'])) {
						$ret['overall']['all']['all']['card']['riskStatus']['allData'] = array('dateFrom'=>'', 'dateTo'=> '');
					}
					if (!isset($ret['overall'][$year]['all']['card']['riskStatus']['allData'])) {
						$ret['overall'][$year]['all']['card']['riskStatus']['allData'] = array('dateFrom'=>$yrFirstDay, 'dateTo'=> $yrLastDay);
					}
					if (!isset($ret['overall'][$year][$month]['card']['riskStatus']['allData'])) {
						$ret['overall'][$year][$month]['card']['riskStatus']['allData'] = array('dateFrom'=>$mthYrFirstDay, 'dateTo'=> $mthYrLastDay);
					}
					// for conOp data filter end

					if (isset($ret['overall']['all']['all']['card']['riskStatus'][$rr['risk_status']])) {
						$ret['overall']['all']['all']['card']['riskStatus'][$rr['risk_status']]++;
					}else{
						$ret['overall']['all']['all']['card']['riskStatus'][$rr['risk_status']] = 1;
					}
					if (isset($ret['overall'][$year]['all']['card']['riskStatus'][$rr['risk_status']])) {
						$ret['overall'][$year]['all']['card']['riskStatus'][$rr['risk_status']]++;
					}else{
						$ret['overall'][$year]['all']['card']['riskStatus'][$rr['risk_status']] = 1;
					}
					if (isset($ret['overall'][$year][$month]['card']['riskStatus'][$rr['risk_status']])) {
						$ret['overall'][$year][$month]['card']['riskStatus'][$rr['risk_status']]++;
					}else{
						$ret['overall'][$year][$month]['card']['riskStatus'][$rr['risk_status']] = 1;
					}

				}
			}
		}
		else{
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_RA'].$this->projectID ?? '';
			$res = $this->jogetCURL($url);
			if (isset($res['data'])){
				// sort by month and year
				usort($res['data'], function($b, $a) {
				    return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
				});

				if(isset($res['data'][0])){
					$ret['overall']['all']['all']['cardOverall']['riskScore'] = (float) $res['data'][0]['risk_score'];

				}
				foreach($res['data'] as $rr){

					$ret['overall'][$rr['year']]['all']['cardOverall']['riskScore'] = (float) $rr['risk_score'];
					$ret['overall'][$rr['year']][$rr['month']]['cardOverall']['riskScore'] = (float) $rr['risk_score'];

				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_RR'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($b, $a) {
				    $t1 = strtotime($a['date_identified']);
				    $t2 = strtotime($b['date_identified']);
				    return $t1 - $t2;
				});
				
				foreach($res['data'] as $rr){
					$dateCreated = strtotime($rr['date_identified']);
					$year = date("Y", $dateCreated);
					$month = date("M", $dateCreated);

					//-------------Main Summary Dashboard--------------//
					// for conOp data filter 
					$mthYrFirstDay = date('01/m/Y', $dateCreated);
					$mthYrLastDay = date('t/m/Y', $dateCreated);
					$yrFirstDay = date('01/01/Y', $dateCreated);
					$yrLastDay = date('31/12/Y', $dateCreated);

					if (!isset($ret['overall']['all']['all']['card']['riskStatus']['allData'])) {
						$ret['overall']['all']['all']['card']['riskStatus']['allData'] = array('dateFrom'=>'', 'dateTo'=> '');
					}
					if (!isset($ret['overall'][$year]['all']['card']['riskStatus']['allData'])) {
						$ret['overall'][$year]['all']['card']['riskStatus']['allData'] = array('dateFrom'=>$yrFirstDay, 'dateTo'=> $yrLastDay);
					}
					if (!isset($ret['overall'][$year][$month]['card']['riskStatus']['allData'])) {
						$ret['overall'][$year][$month]['card']['riskStatus']['allData'] = array('dateFrom'=>$mthYrFirstDay, 'dateTo'=> $mthYrLastDay);
					}
					// for conOp data filter end

					if (isset($ret['overall']['all']['all']['card']['riskStatus'][$rr['risk_status']])) {
						$ret['overall']['all']['all']['card']['riskStatus'][$rr['risk_status']]++;
					}else{
						$ret['overall']['all']['all']['card']['riskStatus'][$rr['risk_status']] = 1;
					}
					if (isset($ret['overall'][$year]['all']['card']['riskStatus'][$rr['risk_status']])) {
						$ret['overall'][$year]['all']['card']['riskStatus'][$rr['risk_status']]++;
					}else{
						$ret['overall'][$year]['all']['card']['riskStatus'][$rr['risk_status']] = 1;
					}
					if (isset($ret['overall'][$year][$month]['card']['riskStatus'][$rr['risk_status']])) {
						$ret['overall'][$year][$month]['card']['riskStatus'][$rr['risk_status']]++;
					}else{
						$ret['overall'][$year][$month]['card']['riskStatus'][$rr['risk_status']] = 1;
					}

					//----------------START CHILD----------------------//
					// for conOp filter
					if (!isset($ret[$childID['project_id']]['all']['all']['card']['riskStatus']['allData'])) {
						$ret[$childID['project_id']]['all']['all']['card']['riskStatus']['allData'] = array('dateFrom'=>'', 'dateTo'=> '');
					}
					if (!isset($ret[$childID['project_id']][$year]['all']['card']['riskStatus']['allData'])) {
						$ret[$childID['project_id']][$year]['all']['card']['riskStatus']['allData'] = array('dateFrom'=>$yrFirstDay, 'dateTo'=> $yrLastDay);
					}
					if (!isset($ret[$childID['project_id']][$year][$month]['card']['riskStatus']['allData'])) {
						$ret[$childID['project_id']][$year][$month]['card']['riskStatus']['allData'] = array('dateFrom'=>$mthYrFirstDay, 'dateTo'=> $mthYrLastDay);
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['riskStatus'][$rr['risk_status']])) {
						$ret[$childID['project_id']]['all']['all']['card']['riskStatus'][$rr['risk_status']]++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['riskStatus'][$rr['risk_status']] = 1;
					}
					if (isset($ret[$childID['project_id']][$year]['all']['card']['riskStatus'][$rr['risk_status']])) {
						$ret[$childID['project_id']][$year]['all']['card']['riskStatus'][$rr['risk_status']]++;
					}else{
						$ret[$childID['project_id']][$year]['all']['card']['riskStatus'][$rr['risk_status']] = 1;
					}
					if (isset($ret[$childID['project_id']][$year][$month]['card']['riskStatus'][$rr['risk_status']])) {
						$ret[$childID['project_id']][$year][$month]['card']['riskStatus'][$rr['risk_status']]++;
					}else{
						$ret[$childID['project_id']][$year][$month]['card']['riskStatus'][$rr['risk_status']] = 1;
					}
					//----------------END CHILD--------------------//

				}
			}
		}


		return $ret;
	}

	function fetchPUBCData(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_PBC'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_received']);
				    $t2 = strtotime($b['date_received']);
				    return $t1 - $t2;
				});

				$total = 1;
				foreach($res['data'] as $pbc){
					$mthCT = $this->getMonthfromTSRange(new DateTime($pbc['date_received']), $this->cutoffDay);

					//-------------Main Summary Dashboard--------------//
					// for conOp filter start
					if (!isset($ret['overall']['all']['all']['allData'])) {
						$ret['overall']['all']['all']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['allData'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					// for conOp filter end

					$status = ($pbc['pbc_status'] == 'In Progress') ? 'Open' : 'Close';
					if (isset($ret['overall']['all']['all']['card'][$status])) {
						$ret['overall']['all']['all']['card'][$status]++;
					}else{
						$ret['overall']['all']['all']['card'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$status])) {
						$ret['overall'][$mthCT['yr']]['all']['card'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$status])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$status] = 1;
					}

					$ret['overall']['all']['all']['card']['cumulative'] = $total;
					$ret['overall'][$mthCT['yr']]['all']['card']['cumulative'] = $total;
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'] = 1;
					}

					$total++;
				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_PBC'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_received']);
				    $t2 = strtotime($b['date_received']);
				    return $t1 - $t2;
				});
				
				foreach($res['data'] as $pbc){
					$mthCT = $this->getMonthfromTSRange(new DateTime($pbc['date_received']), $this->cutoffDay);

					//-------------Main Summary Dashboard--------------//
					if (!isset($ret['overall']['all']['all']['allData'])) {
						$ret['overall']['all']['all']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['allData'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['card']['cumulative'])) {
						$ret['overall']['all']['all']['card']['cumulative']++;
					}else{
						$ret['overall']['all']['all']['card']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['cumulative'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'] = 1;
					}

					$status = ($pbc['pbc_status'] == 'In Progress') ? 'Open' : 'Close';
					if (isset($ret['overall']['all']['all']['card'][$status])) {
						$ret['overall']['all']['all']['card'][$status]++;
					}else{
						$ret['overall']['all']['all']['card'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card'][$status])) {
						$ret['overall'][$mthCT['yr']]['all']['card'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card'][$status] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$status])) {
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$status]++;
					}else{
						$ret['overall'][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$status] = 1;
					}

					//-----------------START CHILD------------------//
					if (!isset($ret[$childID['project_id']]['all']['all']['allData'])) {
						$ret[$childID['project_id']]['all']['all']['allData'] = array('year'=>'', 'month'=>'');
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['allData'] = array('year'=> $mthCT['yr'], 'month'=>'');
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['allData'] = array('year'=> $mthCT['yr'], 'month'=> $pbc['month']);
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['cumulative'])) {
						$ret[$childID['project_id']]['all']['all']['card']['cumulative']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['cumulative'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['cumulative'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card']['cumulative'] = 1;
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card'][$status])) {
						$ret[$childID['project_id']]['all']['all']['card'][$status]++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card'][$status] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$status])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$status]++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card'][$status] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$status])) {
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$status]++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$monthNumtoHalf[$mthCT['mth']]]['card'][$status] = 1;
					}
					//------------------END CHILD--------------------//
				}
			}
		}

		return $ret;
	}

	function fetchPUBCForStakeholder(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_PBC'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {

				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_received']);
				    $t2 = strtotime($b['date_received']);
				    return $t1 - $t2;
				});
				
				foreach($res['data'] as $pbc){
					$mthCT = $this->getMonthfromTSRange(new DateTime($pbc['date_received']), $this->cutoffDay);

					//-------------Stakeholder Management Dashboard--------------//
					// for filter dashboard to conop
					if (!isset($ret['overall']['all']['all']['allData'])) {
						$ret['overall']['all']['all']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['card']['total'])) {
						$ret['overall']['all']['all']['card']['total']++;
					}else{
						$ret['overall']['all']['all']['card']['total'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total'] = 1;
					}

					if (isset($ret['overall']['all']['all']['pieChart'][$pbc['category']])) {
						$ret['overall']['all']['all']['pieChart'][$pbc['category']]++;
					}else{
						$ret['overall']['all']['all']['pieChart'][$pbc['category']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['pieChart'][$pbc['category']])) {
						$ret['overall'][$mthCT['yr']]['all']['pieChart'][$pbc['category']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['pieChart'][$pbc['category']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$pbc['category']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$pbc['category']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$pbc['category']] = 1;
					}

					if (!isset($ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'])) {
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'])) {
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val']++;
					}else{
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'])) {
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'] = 1;
					}

					if($pbc['date_closed']){
						$dateReceived = new DateTime($pbc['date_received']);
						$dateClosed = new DateTime($pbc['date_closed']);

						$difference = $dateReceived->diff($dateClosed);
						$diffDays = $difference->format('%a');

						$pbc['resolveDay'] = $diffDays;

					}

					$ret['overall']['all']['all']['raw'][] = $pbc;
					$ret['overall'][$mthCT['yr']]['all']['raw'][] = $pbc;
					$ret['overall'][$mthCT['yr']][$mthCT['mth']]['raw'][] = $pbc;

				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_PBC'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_received']);
				    $t2 = strtotime($b['date_received']);
				    return $t1 - $t2;
				});

				foreach($res['data'] as $pbc){
					$mthCT = $this->getMonthfromTSRange(new DateTime($pbc['date_received']), $this->cutoffDay);

					//-------------Stakeholder Management Dashboard--------------//
					// for filter dashboard to conop
					if (!isset($ret['overall']['all']['all']['allData'])) {
						$ret['overall']['all']['all']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['card']['total'])) {
						$ret['overall']['all']['all']['card']['total']++;
					}else{
						$ret['overall']['all']['all']['card']['total'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total'] = 1;
					}

					if (isset($ret['overall']['all']['all']['pieChart'][$pbc['category']])) {
						$ret['overall']['all']['all']['pieChart'][$pbc['category']]++;
					}else{
						$ret['overall']['all']['all']['pieChart'][$pbc['category']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['pieChart'][$pbc['category']])) {
						$ret['overall'][$mthCT['yr']]['all']['pieChart'][$pbc['category']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['pieChart'][$pbc['category']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$pbc['category']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$pbc['category']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$pbc['category']] = 1;
					}

					if (!isset($ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'])) {
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'])) {
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val']++;
					}else{
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'])) {
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'] = 1;
					}

					if($pbc['date_closed']){
						$dateReceived = new DateTime($pbc['date_received']);
						$dateClosed = new DateTime($pbc['date_closed']);

						$difference = $dateReceived->diff($dateClosed);
						$diffDays = $difference->format('%a');

						$pbc['resolveDay'] = $diffDays;

					}

					$ret['overall']['all']['all']['raw'][] = $pbc;
					$ret['overall'][$mthCT['yr']]['all']['raw'][] = $pbc;
					$ret['overall'][$mthCT['yr']][$mthCT['mth']]['raw'][] = $pbc;

					//--------------START CHILD------------//
					if (!isset($ret[$childID['project_id']]['all']['all']['allData'])) {
						$ret[$childID['project_id']]['all']['all']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret[$childID['project_id']]['all']['all']['card']['total'])) {
						$ret[$childID['project_id']]['all']['all']['card']['total']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['total'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['total'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['total']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['total'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['card']['total'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['card']['total'] = 1;
					}

					if (isset($ret[$childID['project_id']]['all']['all']['pieChart'][$pbc['category']])) {
						$ret[$childID['project_id']]['all']['all']['pieChart'][$pbc['category']]++;
					}else{
						$ret[$childID['project_id']]['all']['all']['pieChart'][$pbc['category']] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['pieChart'][$pbc['category']])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['pieChart'][$pbc['category']]++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['pieChart'][$pbc['category']] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['pieChart'][$pbc['category']])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['pieChart'][$pbc['category']]++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['pieChart'][$pbc['category']] = 1;
					}

					if (!isset($ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'])) {
						$ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'])) {
						$ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$pbc['category']]['val'] = 1;
					}

					$ret[$childID['project_id']]['all']['all']['raw'][] = $pbc;
					$ret[$childID['project_id']][$mthCT['yr']]['all']['raw'][] = $pbc;
					$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['raw'][] = $pbc;
					//------------END CHILD--------------//

				}
			}
		}


		return $ret;
	}

	function fetchEVNTData(){
		$ret = array();
		$monthNumtoHalf = ["01"=>"Jan","02"=>"Feb","03"=>"Mar","04"=>"Apr","05"=>"May","06"=>"Jun","07"=>"Jul","08"=>"Aug","09"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec"];

		if ($this->isWPC) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_EVNT'].$this->projectID;
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($a, $b) {
				    $t1 = strtotime($a['date_event']);
				    $t2 = strtotime($b['date_event']);
				    return $t1 - $t2;
				});
				foreach($res['data'] as $evt){
					$mthCT = $this->getMonthfromTSRange(new DateTime($evt['date_event']), $this->cutoffDay);
					//-------------Stakeholder Management Dashboard--------------//
					// for filter dashboard to conop
					if (!isset($ret['overall']['all']['all']['allData'])) {
						$ret['overall']['all']['all']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					$ret['overall']['all']['all']['raw'][] = $evt;
					$ret['overall'][$mthCT['yr']]['all']['raw'][] = $evt;
					$ret['overall'][$mthCT['yr']][$mthCT['mth']]['raw'][] = $evt;

					if (isset($ret['overall']['all']['all']['card']['total'])) {
						$ret['overall']['all']['all']['card']['total']++;
					}else{
						$ret['overall']['all']['all']['card']['total'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total'] = 1;
					}

					if (isset($ret['overall']['all']['all']['pieChart'][$evt['type']])) {
						$ret['overall']['all']['all']['pieChart'][$evt['type']]++;
					}else{
						$ret['overall']['all']['all']['pieChart'][$evt['type']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['pieChart'][$evt['type']])) {
						$ret['overall'][$mthCT['yr']]['all']['pieChart'][$evt['type']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['pieChart'][$evt['type']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$evt['type']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$evt['type']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$evt['type']] = 1;
					}

					if (!isset($ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'])) {
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'])) {
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val']++;
					}else{
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'])) {
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'] = 1;
					}
				}
			}
		}

		foreach ($this->childProjectInfo as $childID) {
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_EVNT'].$childID['project_id'];
			$res = $this->jogetCURL($url);
			if (isset($res['data'])) {
				usort($res['data'], function ($b, $a) {
				    $t1 = strtotime($a['date_event']);
				    $t2 = strtotime($b['date_event']);
				    return $t1 - $t2;
				});
				
				foreach($res['data'] as $evt){
					$mthCT = $this->getMonthfromTSRange(new DateTime($evt['date_event']), $this->cutoffDay);

					//-------------Stakeholder Management Dashboard--------------//
					// for filter dashboard to conop
					if (!isset($ret['overall']['all']['all']['allData'])) {
						$ret['overall']['all']['all']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					$ret['overall']['all']['all']['raw'][] = $evt;
					$ret['overall'][$mthCT['yr']]['all']['raw'][] = $evt;
					$ret['overall'][$mthCT['yr']][$mthCT['mth']]['raw'][] = $evt;

					if (isset($ret['overall']['all']['all']['card']['total'])) {
						$ret['overall']['all']['all']['card']['total']++;
					}else{
						$ret['overall']['all']['all']['card']['total'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['card']['total'])) {
						$ret['overall'][$mthCT['yr']]['all']['card']['total']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['card']['total'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['card']['total'] = 1;
					}

					if (isset($ret['overall']['all']['all']['pieChart'][$evt['type']])) {
						$ret['overall']['all']['all']['pieChart'][$evt['type']]++;
					}else{
						$ret['overall']['all']['all']['pieChart'][$evt['type']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['pieChart'][$evt['type']])) {
						$ret['overall'][$mthCT['yr']]['all']['pieChart'][$evt['type']]++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['pieChart'][$evt['type']] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$evt['type']])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$evt['type']]++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['pieChart'][$evt['type']] = 1;
					}


					if (!isset($ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'])) {
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'])) {
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'])) {
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val']++;
					}else{
						$ret['overall']['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'])) {
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'] = 1;
					}
					if (isset($ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'])) {
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val']++;
					}else{
						$ret['overall'][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'] = 1;
					}

					//--------------START CHILD-------------//
					// for filter dashboard to conop
					if (!isset($ret[$childID['project_id']]['all']['all']['allData'])) {
						$ret[$childID['project_id']]['all']['all']['allData'] = array('dateFrom' => '', 'dateTo' => '');
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['allData'] = array('dateFrom' => $mthCT['yrFirstDay'], 'dateTo' => $mthCT['yrLastDay']);
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					$ret[$childID['project_id']]['all']['all']['raw'][] = $evt;
					$ret[$childID['project_id']][$mthCT['yr']]['all']['raw'][] = $evt;
					$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['raw'][] = $evt;

					if (isset($ret[$childID['project_id']]['all']['all']['card']['total'])) {
						$ret[$childID['project_id']]['all']['all']['card']['total']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['card']['total'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['card']['total'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['total']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['card']['total'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['card']['total'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['card']['total']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['card']['total'] = 1;
					}

					if (isset($ret[$childID['project_id']]['all']['all']['pieChart'][$evt['type']])) {
						$ret[$childID['project_id']]['all']['all']['pieChart'][$evt['type']]++;
					}else{
						$ret[$childID['project_id']]['all']['all']['pieChart'][$evt['type']] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['pieChart'][$evt['type']])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['pieChart'][$evt['type']]++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['pieChart'][$evt['type']] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['pieChart'][$evt['type']])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['pieChart'][$evt['type']]++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['pieChart'][$evt['type']] = 1;
					}


					if (!isset($ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'])) {
						$ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}
					if (!isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['allData'] = array('dateFrom' => $mthCT['fromDate'], 'dateTo' => $mthCT['toDate']);
					}

					if (isset($ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'])) {
						$ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val']++;
					}else{
						$ret[$childID['project_id']]['all']['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'])) {
						$ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']]['all']['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'] = 1;
					}
					if (isset($ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'])) {
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val']++;
					}else{
						$ret[$childID['project_id']][$mthCT['yr']][$mthCT['mth']]['typeEvent'][$monthNumtoHalf[$mthCT['mth']].'-'.$mthCT['yr']][$evt['type']]['val'] = 1;
					}
					//--------------END CHILD-----------------//
				}
			}
		}
		return $ret;
	}

	function orderStageSection($a, $b) {
		if ($a['stage'] == $b['stage']) {
			return strcmp($a['section'], $b['section']);
		}
	
		return strcmp($a['stage'], $b['stage']);
	}

	function fetchLandDataMain(){
		$monthHalftext = ['01'=>"Jan",'02'=>"Feb",'03'=>"Mar",'04'=>"Apr",'05'=>"May",'06'=>"Jun",'07'=>"Jul",'08'=>"Aug",'09'=>"Sep",'10'=>"Oct",'11'=>"Nov",'12'=>"Dec"];

		$ret = array();
		$arrayId = array();

		if ($this->isWPC){
			$project_id = $this->parentProjectID;
		}
		else{
			$project_id = $this->projectID;
		}

		$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LM'].$project_id;
		$res = $this->jogetCURL($url);

		if (isset($res['data'])) {
			$dataArr = $res['data'];

			usort($dataArr, function ($a, $b) {
				$t1 = strtotime('01-'.$a['month'].'-'.$a['year']);
				$t2 = strtotime('01-'.$b['month'].'-'.$b['year']);

				return $t1 - $t2;
			});
			
			foreach ($dataArr as $lm) {
				
				$idUsed = $lm['id'];

				$arrayId[] = $idUsed;
				$ret['idForEach'][$lm['year']][$monthHalftext[$lm['month']]] = $idUsed;

				if (!isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['allData'])) {
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['allData'] = array('year'=>$lm['year'], 'month' => $lm['month']);
				}

				//FOR MAIN SUMMARY

				// for aiwi status & foe status
				if($lm['current_stage'] == 'Acquisition and Compensation' && $lm['month_timeline'] != ''){

					//completed aiwi %
					$ret['overall']['all']['all']['aiwiPercentComplete'] = (float) $lm['accumulated'];
					$ret['overall'][$lm['year']]['all']['aiwiPercentComplete'] = (float) $lm['accumulated'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['aiwiPercentComplete'] = (float) $lm['accumulated'];
	
					//balance aiwi %
					$ret['overall']['all']['all']['aiwiPercentBal'] = (float) $lm['gap'];
					$ret['overall'][$lm['year']]['all']['aiwiPercentBal'] = (float) $lm['gap'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['aiwiPercentBal'] = (float) $lm['gap'];
	
					//completed aiwi km-run
					$ret['overall']['all']['all']['aiwiKMcomplete'] = (float) $lm['completed_km_run'];
					$ret['overall'][$lm['year']]['all']['aiwiKMcomplete'] = (float) $lm['completed_km_run'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['aiwiKMcomplete'] = (float) $lm['completed_km_run'];
	
					//balance aiwi km-run
					$ret['overall']['all']['all']['aiwiKMbal'] = (float) $lm['total_km_run'] - (float) $lm['completed_km_run'];
					$ret['overall'][$lm['year']]['all']['aiwiKMbal'] = (float) $lm['total_km_run'] - (float) $lm['completed_km_run'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['aiwiKMbal'] = (float) $lm['total_km_run'] - (float) $lm['completed_km_run'];

				}else if($lm['current_stage'] != 'Acquisition and Compensation' && $lm['month_timeline'] != ''){

					//completed foe %
					$ret['overall']['all']['all']['foePercentComplete'] = (float) $lm['accumulated'];
					$ret['overall'][$lm['year']]['all']['foePercentComplete'] = (float) $lm['accumulated'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['foePercentComplete'] = (float) $lm['accumulated'];
	
					//balance foe %
					$ret['overall']['all']['all']['foePercentBal'] = (float) $lm['gap'];
					$ret['overall'][$lm['year']]['all']['foePercentBal'] = (float) $lm['gap'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['foePercentBal'] = (float) $lm['gap'];
	
					//completed foe km-run
					$ret['overall']['all']['all']['foeKMcomplete'] = (float) $lm['completed_km_run'];
					$ret['overall'][$lm['year']]['all']['foeKMcomplete'] = (float) $lm['completed_km_run'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['foeKMcomplete'] = (float) $lm['completed_km_run'];
	
					//balance foe km-run
					$ret['overall']['all']['all']['foeKMbal'] = (float) $lm['total_km_run'] - (float) $lm['completed_km_run'];
					$ret['overall'][$lm['year']]['all']['foeKMbal'] = (float) $lm['total_km_run'] - (float) $lm['completed_km_run'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['foeKMbal'] = (float) $lm['total_km_run'] - (float) $lm['completed_km_run'];
				}

				// FOR LMR STATUS TABLE
				// issue accumulative ctd
				if(isset($ret['overall']['all']['all']['issueAccumul'])){
					$ret['overall']['all']['all']['issueAccumul'] = $ret['overall']['all']['all']['issueAccumul'] + (float) $lm['ttl_accumulative_ctd_issue'];
				}
				else{
					$ret['overall']['all']['all']['issueAccumul'] = (float) $lm['ttl_accumulative_ctd_issue'];
				}
				if(isset($ret['overall'][$lm['year']]['all']['issueAccumul'])){
					$ret['overall'][$lm['year']]['all']['issueAccumul'] = $ret['overall'][$lm['year']]['all']['issueAccumul'] + (float) $lm['ttl_accumulative_ctd_issue'];
				}
				else{
					$ret['overall'][$lm['year']]['all']['issueAccumul'] = (float) $lm['ttl_accumulative_ctd_issue'];
				}
				if(isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueAccumul'])){
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueAccumul'] = $ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueAccumul'] + (float) $lm['ttl_accumulative_ctd_issue'];
				}
				else{
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueAccumul'] = (float) $lm['ttl_accumulative_ctd_issue'];
				}

				// issue solved
				if(isset($ret['overall']['all']['all']['issueSolved'])){
					$ret['overall']['all']['all']['issueSolved'] = $ret['overall']['all']['all']['issueSolved'] + (float) $lm['ttl_solved_issues'];
				}
				else{
					$ret['overall']['all']['all']['issueSolved'] = (float) $lm['ttl_solved_issues'];
				}
				if(isset($ret['overall'][$lm['year']]['all']['issueSolved'])){
					$ret['overall'][$lm['year']]['all']['issueSolved'] = $ret['overall'][$lm['year']]['all']['issueSolved'] + (float) $lm['ttl_solved_issues'];
				}
				else{
					$ret['overall'][$lm['year']]['all']['issueSolved'] = (float) $lm['ttl_solved_issues'];
				}
				if(isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueSolved'])){
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueSolved'] = $ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueSolved'] + (float) $lm['ttl_solved_issues'];
				}
				else{
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueSolved'] = (float) $lm['ttl_solved_issues'];
				}

				// issue balance
				if(isset($ret['overall']['all']['all']['issueBal'])){
					$ret['overall']['all']['all']['issueBal'] = $ret['overall']['all']['all']['issueBal'] + (float) $lm['ttl_bal_unresolved_issues'];
				}
				else{
					$ret['overall']['all']['all']['issueBal'] = (float) $lm['ttl_bal_unresolved_issues'];
				}
				if(isset($ret['overall'][$lm['year']]['all']['issueBal'])){
					$ret['overall'][$lm['year']]['all']['issueBal'] = $ret['overall'][$lm['year']]['all']['issueBal'] + (float) $lm['ttl_bal_unresolved_issues'];
				}
				else{
					$ret['overall'][$lm['year']]['all']['issueBal'] = (float) $lm['ttl_bal_unresolved_issues'];
				}
				if(isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueBal'])){
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueBal'] = $ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueBal'] + (float) $lm['ttl_bal_unresolved_issues'];
				}
				else{
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['issueBal'] = (float) $lm['ttl_bal_unresolved_issues'];
				}

				// km accumulative ctd
				if(isset($ret['overall']['all']['all']['kmAccumul'])){
					$ret['overall']['all']['all']['kmAccumul'] = $ret['overall']['all']['all']['kmAccumul'] + (float) $lm['ttl_accumulative_ctd_km'];
				}
				else{
					$ret['overall']['all']['all']['kmAccumul'] = (float) $lm['ttl_accumulative_ctd_km'];
				}
				if(isset($ret['overall'][$lm['year']]['all']['kmAccumul'])){
					$ret['overall'][$lm['year']]['all']['kmAccumul'] = $ret['overall'][$lm['year']]['all']['kmAccumul'] + (float) $lm['ttl_accumulative_ctd_km'];
				}
				else{
					$ret['overall'][$lm['year']]['all']['kmAccumul'] = (float) $lm['ttl_accumulative_ctd_km'];
				}
				if(isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmAccumul'])){
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmAccumul'] = $ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmAccumul'] + (float) $lm['ttl_accumulative_ctd_km'];
				}
				else{
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmAccumul'] = (float) $lm['ttl_accumulative_ctd_km'];
				}

				// km solved
				if(isset($ret['overall']['all']['all']['kmSolved'])){
					$ret['overall']['all']['all']['kmSolved'] = $ret['overall']['all']['all']['kmSolved'] + (float) $lm['ttl_solved_km'];
				}
				else{
					$ret['overall']['all']['all']['kmSolved'] = (float) $lm['ttl_solved_km'];
				}
				if(isset($ret['overall'][$lm['year']]['all']['kmSolved'])){
					$ret['overall'][$lm['year']]['all']['kmSolved'] = $ret['overall'][$lm['year']]['all']['kmSolved'] + (float) $lm['ttl_solved_km'];
				}
				else{
					$ret['overall'][$lm['year']]['all']['kmSolved'] = (float) $lm['ttl_solved_km'];
				}
				if(isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmSolved'])){
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmSolved'] = $ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmSolved'] + (float) $lm['ttl_solved_km'];
				}
				else{
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmSolved'] = (float) $lm['ttl_solved_km'];
				}

				// km balance
				if(isset($ret['overall']['all']['all']['kmBal'])){
					$ret['overall']['all']['all']['kmBal'] = $ret['overall']['all']['all']['kmBal'] + (float) $lm['ttl_bal_unresolved_km'];
				}
				else{
					$ret['overall']['all']['all']['kmBal'] = (float) $lm['ttl_bal_unresolved_km'];
				}
				if(isset($ret['overall'][$lm['year']]['all']['kmBal'])){
					$ret['overall'][$lm['year']]['all']['kmBal'] = $ret['overall'][$lm['year']]['all']['kmBal'] + (float) $lm['ttl_bal_unresolved_km'];
				}
				else{
					$ret['overall'][$lm['year']]['all']['kmBal'] = (float) $lm['ttl_bal_unresolved_km'];
				}
				if(isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmBal'])){
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmBal'] = $ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmBal'] + (float) $lm['ttl_bal_unresolved_km'];
				}
				else{
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['kmBal'] = (float) $lm['ttl_bal_unresolved_km'];
				}
			}
		}

		$link = $url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LM_sum'].$project_id;
		$respData = $this->jogetCURL($link);

		if(isset($respData['data'])){
			$dataArr = $respData['data'];

			usort($dataArr, function ($a, $b) {
				$t1 = strtotime('01-'.$a['month'].'-'.$a['year']);
				$t2 = strtotime('01-'.$b['month'].'-'.$b['year']);

				return $t1 - $t2;
			});

			foreach ($dataArr as $lmSum) {

				// cumulative solved issue
				if(isset($ret['overall']['all']['all']['cumulativeSolvedIssue'])){
					$ret['overall']['all']['all']['cumulativeSolvedIssue'] = $ret['overall']['all']['all']['cumulativeSolvedIssue'] + (float) $lmSum['c_solved_issues'];
				}
				else{
					$ret['overall']['all']['all']['cumulativeSolvedIssue'] = (float) $lmSum['c_solved_issues'];
				}
				if(isset($ret['overall'][$lmSum['year']]['all']['cumulativeSolvedIssue'])){
					$ret['overall'][$lmSum['year']]['all']['cumulativeSolvedIssue'] = $ret['overall'][$lmSum['year']]['all']['cumulativeSolvedIssue'] + (float) $lmSum['c_solved_issues'];
				}
				else{
					$ret['overall'][$lmSum['year']]['all']['cumulativeSolvedIssue'] = (float) $lmSum['c_solved_issues'];
				}
				if(isset($ret['overall'][$lmSum['year']][$monthHalftext[$lmSum['month']]]['cumulativeSolvedIssue'])){
					$ret['overall'][$lmSum['year']][$monthHalftext[$lmSum['month']]]['cumulativeSolvedIssue'] = $ret['overall'][$lmSum['year']][$monthHalftext[$lmSum['month']]]['cumulativeSolvedIssue'] + (float) $lmSum['c_solved_issues'];
				}
				else{
					$ret['overall'][$lmSum['year']][$monthHalftext[$lmSum['month']]]['cumulativeSolvedIssue'] = (float) $lmSum['c_solved_issues'];
				}

				// cumulative solved issue km
				if(isset($ret['overall']['all']['all']['cumulativeSolvedIssueKM'])){
					$ret['overall']['all']['all']['cumulativeSolvedIssueKM'] = $ret['overall']['all']['all']['cumulativeSolvedIssueKM'] + (float) $lmSum['c_solved_issues_km'];
				}
				else{
					$ret['overall']['all']['all']['cumulativeSolvedIssueKM'] = (float) $lmSum['c_solved_issues_km'];
				}
				if(isset($ret['overall'][$lmSum['year']]['all']['cumulativeSolvedIssueKM'])){
					$ret['overall'][$lmSum['year']]['all']['cumulativeSolvedIssueKM'] = $ret['overall'][$lmSum['year']]['all']['cumulativeSolvedIssueKM'] + (float) $lmSum['c_solved_issues_km'];
				}
				else{
					$ret['overall'][$lmSum['year']]['all']['cumulativeSolvedIssueKM'] = (float) $lmSum['c_solved_issues_km'];
				}
				if(isset($ret['overall'][$lmSum['year']][$monthHalftext[$lmSum['month']]]['cumulativeSolvedIssueKM'])){
					$ret['overall'][$lmSum['year']][$monthHalftext[$lmSum['month']]]['cumulativeSolvedIssueKM'] = $ret['overall'][$lmSum['year']][$monthHalftext[$lmSum['month']]]['cumulativeSolvedIssueKM'] + (float) $lmSum['c_solved_issues_km'];
				}
				else{
					$ret['overall'][$lmSum['year']][$monthHalftext[$lmSum['month']]]['cumulativeSolvedIssueKM'] = (float) $lmSum['c_solved_issues_km'];
				}

			}
		}

		return $ret;
	}

	function fetchLandManageData($main = false){
		$monthHalftext = ['01'=>"Jan",'02'=>"Feb",'03'=>"Mar",'04'=>"Apr",'05'=>"May",'06'=>"Jun",'07'=>"Jul",'08'=>"Aug",'09'=>"Sep",'10'=>"Oct",'11'=>"Nov",'12'=>"Dec"];

		$ret = array();
		$arrayId = array();

		if ($this->isWPC){
			$project_id = $this->parentProjectID;
		}
		else{
			$project_id = $this->projectID;
		}

		$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LM'].$project_id;
		$res = $this->jogetCURL($url);

		if (isset($res['data'])) {
			$dataArr = $res['data'];

			usort($dataArr, function ($a, $b) {
				$t1 = strtotime('01-'.$a['month'].'-'.$a['year']);
				$t2 = strtotime('01-'.$b['month'].'-'.$b['year']);

				return $t1 - $t2;
			});

			$urlLms = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LMS'];
			$resLms = $this->jogetCURL($urlLms);

			$urlLmrs = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LMRS_new'];
			$resLmrs = $this->jogetCURL($urlLmrs);

			$urlLmrt = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LMR'];
			$resLmrt = $this->jogetCURL($urlLmrt);

			$urlLtr = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LTR'];
			$resLtr = $this->jogetCURL($urlLtr);

			foreach ($dataArr as $lm) {
				
				$idUsed = $lm['id'];

				$arrayId[] = $idUsed;
				$ret['idForEach'][$lm['year']][$monthHalftext[$lm['month']]] = $idUsed;

				if (!isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['allData'])) {
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['allData'] = array('year'=>$lm['year'], 'month' => $lm['month']);
				}

				//FOR MAIN SUMMARY
				if(isset($ret['overall']['all']['all']['ttlIssueBalance'])){
					$ret['overall']['all']['all']['ttlIssueBalance'] = $ret['overall']['all']['all']['ttlIssueBalance'] + (float) $lm['type_total_bal_issues'];
				}
				else{
					$ret['overall']['all']['all']['ttlIssueBalance'] = (float) $lm['type_total_bal_issues'];
				}

				if(isset($ret['overall'][$lm['year']]['all']['ttlIssueBalance'])){
					$ret['overall'][$lm['year']]['all']['ttlIssueBalance'] = $ret['overall'][$lm['year']]['all']['ttlIssueBalance'] + (float) $lm['type_total_bal_issues'];
				}
				else{
					$ret['overall'][$lm['year']]['all']['ttlIssueBalance'] = (float) $lm['type_total_bal_issues'];
				}

				if(isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['ttlIssueBalance'])){
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['ttlIssueBalance'] = $ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['ttlIssueBalance'] + (float) $lm['type_total_bal_issues'];
				}
				else{
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['ttlIssueBalance'] = (float) $lm['type_total_bal_issues'];
				}

				if(!$main){
					//FOR LAND SYNOPSIS

					if (isset($resLms['data'])) {
						foreach ($resLms['data'] as $lms) {
							if($lms['c_parent_id'] == $idUsed){
								if($lms['c_sypnosis'] == '') continue;
								$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['synopsis'][] = $lms['c_sypnosis'];
							}
						}
					}

					//IF USER COMPLAINT DATA NOT SHOWING, IT IS BECAUSE THEY STORE DIFFERENT THING WITH THIS - AIWI Partial Delivery
					//FOR AIWI
					if($lm['current_stage'] == 'Acquisition and Compensation' && $lm['month_timeline'] != ''){
						$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['aiwiBefore'] = $lm['progress'] . '-' . $lm['month_timeline'];
					}

					//IF USER COMPLAINT DATA NOT SHOWING, IT IS BECAUSE THEY STORE DIFFERENT THING WITH THIS - FOE Partial Delivery
					//FOR FOE
					if($lm['current_stage'] != 'Acquisition and Compensation' && $lm['month_timeline'] != ''){
						$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]]['foeBefore'] = $lm['progress']  . '-' . $lm['month_timeline'];
					}

					//FOR LMR - SECTION
					$ltrArray = array();
					$order = ['Limbang 1', 'Limbang 2', 'Limbang 3', 'Lawas 1', 'Lawas 2'];

					if (isset($resLmrs['data'])) {
						usort($resLmrs['data'], function ($a, $b) use ($order) {
							$aIndex = array_search($a['section'], $order);
							$bIndex = array_search($b['section'], $order);
							return $aIndex - $bIndex;
						});
						foreach ($resLmrs['data'] as $lmrs) {
							if($lmrs['parent_id'] == $idUsed){
								if($lmrs['section'] == '') continue;
								$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['lmr-section'][$lmrs['section']] = $lmrs;
							}
						}
					}

					//FOR LMR - SECTION - TOTAL 
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlCFIssue'] = $lm['ttl_unresolved_issues'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlNewIssue'] = $lm['ttl_new_issues'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlSolvedIssue'] = $lm['ttl_solved_issues'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlBalIssue'] = $lm['ttl_bal_unresolved_issues'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlCFKM'] = $lm['ttl_unresolved_km'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlNewKM'] = $lm['ttl_new_km'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlSolvedKM'] = $lm['ttl_solved_km'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlBalKM'] = $lm['ttl_bal_unresolved_km'];

					// FOR LMR - SECTION - TOTAL ACCUMULATIVE (ALL) CTD
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlAccCFIssue'] = $lm['ttl_accumul_cf_issues'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlAccCFkm'] = $lm['ttl_accumul_cf_km'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlAccCTDIssue'] = $lm['ttl_accumulative_ctd_issue'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlAccCTDkm'] = $lm['ttl_accumulative_ctd_km'];

					//FOR LMR - TYPE
					if (isset($resLmrt['data'])) {
						foreach ($resLmrt['data'] as $lmrt) {
							if($lmrt['parent_id'] == $idUsed){
								if($lmrt['type'] == '') continue;
								$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['lmr-type'][$lmrt['type']] = $lmrt;
							}
						}
					}

					// FOR LMR - TYPE - TOTAL
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlIssueType'] = $lm['type_total_bal_issues'];
					$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['total']['ttlLengthType'] = $lm['type_total_length'];

					//FOR LAND TRACKING
					$arryLandTracking = array();
					$ltrArray = array();
					$order = ['Limbang', 'Lawas'];

					if (isset($resLtr['data'])) {
						
						usort($resLtr['data'], function ($a, $b) use ($order) {
							$aIndex = array_search($a['package'], $order);
							$bIndex = array_search($b['package'], $order);
							$sortComparison = $aIndex - $bIndex;
						
							if ($sortComparison !== 0) {
								return $sortComparison;
							}
						
							if ($a['stage'] == $b['stage']) {
								return strcmp($a['section'], $b['section']);
							}
						
							return strcmp($a['stage'], $b['stage']);
						});


						foreach ($resLtr['data'] as $ltr) {
							if($ltr['parent_id'] == $idUsed){
								if($ltr['package'] == '' || $ltr['section'] == '') continue;

								$ltrArray[] = $ltr;

								$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['landTracking']['data'][$ltr['critical_milestone']][$ltr['stage']][$ltr['package']][$ltr['section']][] = $ltr;
								$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['landTracking']['dataUsed'][$ltr['critical_milestone']][$ltr['stage']][$ltr['section']][] = $ltr;

								if(isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['landTracking']['count']['countSectionWithPackage'][$ltr['package']])){
									if(!in_array($ltr['section'], $ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['landTracking']['count']['countSectionWithPackage'][$ltr['package']])){
										$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['landTracking']['count']['countSectionWithPackage'][$ltr['package']][] = $ltr['section'];
									}
								}
								else{
									$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['landTracking']['count']['countSectionWithPackage'][$ltr['package']][] = $ltr['section'];
									
								}

								if(isset($arryLandTracking[$ltr['package']])){
									if(!in_array($ltr['section'], $arryLandTracking[$ltr['package']])){
										$arryLandTracking[$ltr['package']][] = $ltr['section'];
									}
								}
								else{
									$arryLandTracking[$ltr['package']][] = $ltr['section'];
								}
							}
						}
					}

					if($resLtr['data']){
						foreach ($arryLandTracking as $key=>$value) {
							foreach ($value as $key1) {
								foreach ($ltrArray as $keyLtr) {
									if(!isset($ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['landTracking']['data'][$keyLtr['critical_milestone']][$keyLtr['stage']][$key][$key1])){
										$ret['overall'][$lm['year']][$monthHalftext[$lm['month']]][$idUsed]['landTracking']['data'][$keyLtr['critical_milestone']][$keyLtr['stage']][$key][$key1][] = 0;
									}
								}
							}
						}
					}
				}
			}

			if($dataArr){
				$minDate = strtotime($dataArr[0]['year']. '-'.$dataArr[0]['month'].'-01');
				$maxDate = strtotime(end($dataArr)['year']. '-'.end($dataArr)['month'].'-01');
				$minYear = date("Y", $minDate);
				$maxYear = date("Y", $maxDate);
	
				$yDiff = $maxYear - $minYear;
				$yr = $minYear;
				$monthHalftext = array("1"=>"Jan","2"=>"Feb","3"=>"Mar","4"=>"Apr","5"=>"May","6"=>"Jun","7"=>"Jul","8"=>"Aug","9"=>"Sep","10"=>"Oct","11"=>"Nov","12"=>"Dec");
				$monthTextHalf = array("Jan"=>"01","Feb"=>"02","Mar"=>"03","Apr"=>"04","May"=>"05","Jun"=>"06","Jul"=>"07","Aug"=>"08","Sep"=>"09","Oct"=>"10","Nov"=>"11","Dec"=>"12");
				
				$monthHalftoMonthCode = array("Jan"=>"M1","Feb"=>"M2","Mar"=>"M3","Apr"=>"M4","May"=>"M5","Jun"=>"M6","Jul"=>"M7","Aug"=>"M8","Sep"=>"M9","Oct"=>"M10","Nov"=>"M11","Dec"=>"M12");

				//aiwi
				$tempAiwiArr = array();
				$valAiwiArr = array();

				//foe
				$tempFoeArr = array();
				$valFoeArr = array();

				for ($i=0; $i < $yDiff+1 ; $i++) {
					$nYr = $yr++; 

					$valMthAiwi = 0;
					$valMthFoe = 0;
					foreach ($monthHalftext as $key => $mthval) {

						if (isset($ret['overall'][$nYr][$mthval]['aiwiBefore'])) {
							$valUsed = explode("-", $ret['overall'][$nYr][$mthval]['aiwiBefore']);
							$value1 = $valUsed[0];
							$value2Aiwi = $valUsed[1];

							$valMthAiwi = $value1;
						}
						else{
							$value2Aiwi = '';
							$valMthAiwi = 0;
						}

						if (isset($ret['overall'][$nYr][$mthval]['foeBefore'])) {
							$valUsed = explode("-", $ret['overall'][$nYr][$mthval]['foeBefore']);
							$value1 = $valUsed[0];
							$value2Foe = $valUsed[1];

							$valMthFoe = $value1;
						}
						else{
							$value2Foe = '';
							$valMthFoe = 0;
						}

						//ALL ALL FOR MAIN SUMMARY ONLY, LAND DASHBOARD NOT USED THIS
						if(isset($ret['overall']['all']['all']['aiwiMain'])){
							$ret['overall']['all']['all']['aiwiMain'] = $ret['overall']['all']['all']['aiwiMain'] + (float) $valMthAiwi;
						}
						else{
							$ret['overall']['all']['all']['aiwiMain'] = (float) $valMthAiwi;
						}

						if(isset($ret['overall']['all']['all']['foeMain'])){
							$ret['overall']['all']['all']['foeMain'] = $ret['overall']['all']['all']['foeMain'] + (float) $valMthFoe;
						}
						else{
							$ret['overall']['all']['all']['foeMain'] = (float) $valMthFoe;
						}

						$ret['overall'][$nYr]['all']['aiwi'][$value2Aiwi] = $valMthAiwi;
						$ret['overall'][$nYr]['all']['foe'][$value2Foe] = $valMthFoe;

						if(isset($ret['overall'][$nYr]['all']['aiwiMain'])){
							$ret['overall'][$nYr]['all']['aiwiMain'] = $ret['overall'][$nYr]['all']['aiwiMain'] + (float) $valMthAiwi;
						}
						else{
							$ret['overall'][$nYr]['all']['aiwiMain'] = (float) $valMthAiwi;
						}

						if(isset($ret['overall'][$nYr]['all']['foeMain'])){
							$ret['overall'][$nYr]['all']['foeMain'] = $ret['overall'][$nYr]['all']['foeMain'] + (float) $valMthFoe;
						}
						else{
							$ret['overall'][$nYr]['all']['foeMain'] = (float) $valMthFoe;
						}

						//aiwi
						$valAiwiArr[$value2Aiwi] = $valMthAiwi;
						array_push($tempAiwiArr, $valAiwiArr);
						$ret['overall'][$nYr][$mthval]['aiwi'] = end($tempAiwiArr);
						$ret['overall'][$nYr][$mthval]['aiwiMain'] = $valMthAiwi;

						//foe
						$valFoeArr[$value2Foe] = $valMthFoe;
						array_push($tempFoeArr, $valFoeArr);
						$ret['overall'][$nYr][$mthval]['foe'] = end($tempFoeArr);
						$ret['overall'][$nYr][$mthval]['foeMain'] = $valMthFoe;

					}
				}
			}
		}

		if(!$main){
			// FOR LMR - TYPE - CTD
			$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LMR_CTD'].$project_id;
			$resLmrt_ctd = $this->jogetCURL($url);
			if (isset($resLmrt_ctd['data'])) {

				foreach ($resLmrt_ctd['data'] as $lmrt_ctd) {
					if($lmrt_ctd['type_of_issue'] == '') continue;
					$ret['overall']['lmr-type-ctd'][$lmrt_ctd['type_of_issue']] = $lmrt_ctd;
				}
			}
		}

		return $ret;
	}

	function fetchLandTimeDbData (){
		$ret = array();

		if ($this->isWPC){
			$project_id = $this->parentProjectID;
		}
		else{
			$project_id = $this->projectID;
		}

		$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LTD'].$project_id;
		$res = $this->jogetCURL($url);

		$order = ['Limbang 1', 'Limbang 2', 'Limbang 3', 'Lawas 1', 'Lawas 2'];

		if (isset($res['data'])) {
			foreach ($res['data'] as $ltd) {
				$idUsed = $ltd['id'];
				$ret['overall']['all']['all']['allData'][$ltd['category']]['idForConop']= $idUsed;
				
				//FOR LAND DATABASE
				if($ltd['category'] == 'Database'){
					$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LD'].$idUsed;
					$res = $this->jogetCURL($url);
					if (isset($res['data'])) {
						usort($res['data'], function ($a, $b) use ($order) {
							$aIndex = array_search($a['section'], $order);
							$bIndex = array_search($b['section'], $order);
							return $aIndex - $bIndex;
						});
						foreach ($res['data'] as $ld) {
							$ret['overall']['all']['all']['landDatabase']['KM-RUN'][$ld['section']]= $ld['km_run'];
							$ret['overall']['all']['all']['landDatabase']['KM-RUN%'][$ld['section']]= $ld['km_run_percentage'];
							$ret['overall']['all']['all']['landDatabase']['LOTS'][$ld['section']]= $ld['lots'];
							$ret['overall']['all']['all']['landDatabase']['LOTS%'][$ld['section']]= $ld['lots_percentage'];
							$ret['overall']['all']['all']['landDatabase']['ACREAGE'][$ld['section']]= $ld['acreage'];
							$ret['overall']['all']['all']['landDatabase']['ACREAGE%'][$ld['section']]= $ld['acreage_percentage'];
							$ret['overall']['all']['all']['landDatabase']['#STRUCTURES'][$ld['section']]= $ld['structure'];
							$ret['overall']['all']['all']['landDatabase']['#STRUCTURES%'][$ld['section']]= $ld['structure_percentage'];
						}
	
					}
				}

				//FOR LAND TIMELINE
				if($ltd['category'] == 'Timeline'){
					$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LT'].$idUsed;
					$res = $this->jogetCURL($url);
					if (isset($res['data'])) {
						usort($res['data'], function ($a, $b) {
							$t1 = strtotime('01-'.$a['month'].'-'.$a['year']);
							$t2 = strtotime('01-'.$b['month'].'-'.$b['year']);
			
							return $t1 - $t2;
						});

						foreach ($res['data'] as $lt) {
							$ret['overall']['all']['all']['landTimeline']['data'][] = $lt;
						}
	
					}

					//FOR TARGET ASSUMPTIONS
					$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LAT'].$idUsed;
					$res = $this->jogetCURL($url);
					if (isset($res['data'])) {
						usort($res['data'], function ($a, $b) {
							return strtotime($a['date']) - strtotime($b['date']);
						});

						foreach ($res['data'] as $lat) {
							$ret['overall']['all']['all']['landTimeline']['assumption'][] = $lat;
						}
	
					}
				}

			}
		}

		return $ret;
	}

	function fetchLandWTGData (){
		$ret = array();

		if ($this->isWPC){
			$project_id = $this->parentProjectID;
		}
		else{
			$project_id = $this->projectID;
		}

		$arryMileStage = array();

		$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LWTG'].$project_id;
		$res = $this->jogetCURL($url);
		if (isset($res['data'])) {
			foreach ($res['data'] as $lwtg) {
				$idUsed = $lwtg['id'];

				$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LWTGStage'].$idUsed;
				$res = $this->jogetCURL($url);
				$arryStage = array();

				if (isset($res['data'])) {
					foreach ($res['data'] as $stage) {
						$ret['overall']['all']['all']['wtg']['stage'][$stage['stage']][] = $stage;

						if(isset($arryStage)){
							if(!in_array($stage['stage'], $arryStage)){
								$arryStage[] = $stage['stage'];
							}
						}
						else{
							$arryStage[] = $stage['stage'];
						}
					}
				}

				$url = $this->jogetLinkObj->jogetAppLink['api']['construct_dash_LWTGMile'].$idUsed;
				$res = $this->jogetCURL($url);
				$arryMile = array();

				if (isset($res['data'])) {
					foreach ($res['data'] as $mile) {
						$ret['overall']['all']['all']['wtg']['mile'][$mile['critical_milestone']][] = $mile;

						if(isset($arryMile)){
							if(!in_array($mile['critical_milestone'], $arryMile)){
								$arryMile[] = $mile['critical_milestone'];
							}
						}
						else{
							$arryMile[] = $mile['critical_milestone'];
						}
					}
				}
			}

			if(isset($arryMile) && isset($arryStage)){
				foreach ($arryMile as $key) {
					$toUsedStringMile = (explode(".",$key));

					foreach ($arryStage as $key1) {
						$toUsedStringStge = (explode(".",$key1));

						if($toUsedStringMile[0] == $toUsedStringStge[0]){
							if(isset($arryMileStage[$key])){
								if(!in_array($key1, $arryMileStage[$key])){
									$arryMileStage[$key][] = $key1;
								}
							}
							else{
								$arryMileStage[$key][] = $key1;
							}
						}
					}
				}

			}
			
			$ret['overall']['all']['all']['wtg']['mileStage'] = $arryMileStage;

			
		}

		return $ret;

	}

	function getHSETInfo(){
		$ncrHset = $this->fetchNCRData();
		$saHset = $this->fetchSAData();
		$smhHset = $this->fetchSMHData();
		$irHset = $this->fetchIFData();

		$ret = array(
			'ncr' => $ncrHset,
			'sa' => $saHset,
			'smh' => $smhHset,
			'inc' => $irHset
		);

		return $ret;
	}

	function getQAQCInfo(){
		$ncrData = $this->fetchNCRData();
		$noiData = $this->fetchNOIData();
		$rfiData = $this->fetchRFIData();
		$msData = $this->fetchMSData();
		$mtData = $this->fetchMTData();
		$wirData = $this->fetchWIRData();

		$ret = array(
			'ncr' => $ncrData,
			'noi' => $noiData,
			'rfi' => $rfiData,
			'ms' => $msData,
			'mt' => $mtData,
			'wir' => $wirData
		);

		return $ret;
	}

	function getMainInfo(){
		$this->fetchContractData();
		if(isset($this->contractInfo[$this->projectID])){
			$this->contractInfo['overall'] = $this->contractInfo[$this->projectID];
			unset($this->contractInfo[$this->projectID]);
		}

		$ncrData = $this->fetchNCRData();
		$noiData = $this->fetchNOIData();
		$rfiData = $this->fetchRFIData();
		$wirData = $this->fetchWIRData();
		$smhHset = $this->fetchSMHData();
		$rrData = $this->fetchRRData();
		$pbcData = $this->fetchPUBCData();
		$msData = $this->fetchMSData();
		$mtData = $this->fetchMTData();
		$lmData = $this->fetchLandManageData(true);
		$lmMainData = $this->fetchLandDataMain();

		$this->fetchProgressData();

		$res = array();
		if($this->isWPC){
			$res['overall'] = $this->projectInfo;
			$timeData = $res;
		}
		else{
			foreach ($this->childProjectInfo as $childID) {
				$res[$childID['project_id']] = $childID;
			}

			$timeData = $res;
		}

		$ret = array(
			'contractInfo' => $this->contractInfo,
			'ncr' => $ncrData,
			'noi' => $noiData,
			'rfi' => $rfiData,
			'wir' => $wirData,
			'smh' => $smhHset,
			'pSU' => $this->sCurveData,
			'rr' =>  $rrData,
			'pubc' =>  $pbcData,
			'time' => $timeData,
			'ms' => $msData,
			'mt' => $mtData,
			'landManagement' => $lmData,
			'landMain' => $lmMainData,
		);

		return $ret;
	}

	function getStakeInfo(){
		$eventData = $this->fetchEVNTData();
		$pubcData = $this->fetchPUBCForStakeholder();

		$ret = array(
			'packageCutOffDay' => $this->packageCutOffArr,
			'event' => $eventData,
			'pbc' => $pubcData
		);

		return $ret;
	}

	function getLandInfo(){
		$lmData = $this->fetchLandManageData(); //LAND SYNOPSIS + LAND TRACKING + AIWI + FOE
		$ltdData = $this->fetchLandTimeDbData(); //LAND DATABASE + LAND TIMELINE
		$lwtgData = $this->fetchLandWTGData();


		$ret = array(
			'landManagement' => $lmData,
			'landTimelineDatabase' => $ltdData,
			'landWTG' => $lwtgData
		);

		return $ret;
	}

}
