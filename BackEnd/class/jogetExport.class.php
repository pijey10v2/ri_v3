<?php 

/**
 * 
 */
class jogetExport 
{
	var $jogetHost;
	var $jogetLinkObj;
	var $link;
	var $dataFlag;
	var $projectOwner;
	var $linkArr;
	var $processNameArr;
	
	private $api_username;
	private $api_password;

	function __construct()
	{
		$this->loadJS();
		if (!$this->jogetHost) {
			include_once dirname(__FILE__).'/jogetLink.class.php';
			$this->jogetLinkObj = new JogetLink();
			$this->jogetLinkObj->getLink('plugin');
			if (!isset($_SESSION['email']) && !isset($_SESSION['password'])) die('Session Error. Please Refresh');
			$this->api_username = $_SESSION['email'];
			$this->api_password = $_SESSION['password'];
			$this->link = $this->jogetLinkObj->jogetAppLink;
			$this->projectOwner = $_SESSION['project_owner'];
		}
		$this->loadData();
	}
			
	function loadData(){

		global $SYSTEM;

		if($SYSTEM == "OBYU"){
			$this->processNameArr = array(
				'mrsbNcrForm' => 'NCR',
				'mrsbWirForm' => 'WIR',
				'mrsbRfiForm' => 'RFI',
				'mrsbMsForm' => 'MS',
				'mrsbMaForm' => 'MT',
				'mrsbIncForm' => 'INC',
				'mrsbSdForm' => 'SD',
				'mrsbSiForm' => 'SI',
				'mrsbSaForm' => 'SA',
				'mrsbSmhForm' => 'SMH',
				'mrsbRrForm' => 'RR',
				'mrsbRaForm' => 'RAO',
				'mrsbRaSecForm' => 'RAS',
				'mrsbNoiForm' => 'NOI',
				'mrsbPbcForm' => 'PUBC',
				'mrsbEvtForm' => 'EVNT'
			);
		
			$this->linkArr = array(
				'mrsbNcrForm' => 'mrsbNcr_view',
				'mrsbWirForm' => 'mrsbWir_view',
				'mrsbRfiForm' => 'mrsbRfi_view',
				'mrsbMsForm' => 'mrsbMs_view',
				'mrsbMaForm' => 'mrsbMt_view',
				'mrsbIncForm' => 'mrsbInc_view',
				'mrsbSdForm' => 'mrsbSd_view',
				'mrsbSiForm' => 'mrsbSi_view',
				'mrsbSaForm' => 'mrsbSa_view',
				'mrsbSmhForm' => 'mrsbSmh_view',
				'mrsbRrForm' => 'mrsbRr_view',
				'mrsbRaForm' => 'mrsbRao_view',
				'mrsbRaSecForm' => 'mrsbRas_view',
				'mrsbNoiForm' => 'mrsbNoi_view',
				'mrsbPbcForm' => 'mrsbPubc_view',
				'mrsbEvtForm' => 'mrsbEvnt_view'
			);
		}else{
			if($this->projectOwner == 'SSLR2'){
				$this->processNameArr = array(
					'puRegister' 		=> 'PU',
					'pubcSubmit_sslr' 	=> 'PUBC',
					'leForm_sslr' 		=> 'LE',
					'liRegister_sslr' 	=> 'LI',
					'laForm_sslr' 		=> 'LA',
					'rrSubmit_sslr' 	=> 'RR',
					'smhForm_sslr' 		=> 'SMH',
					'saForm_sslr' 		=> 'SA',
					'rsSubmission_sslr' => 'RS',
					'sdForm_sslr' 		=> 'SD',
					'sdlSubmit_sslr' 	=> 'SDL',
					'incForm_sslr' 		=> 'INC',
					'maSubmission_sslr' => 'MA',
					'msSubmit_sslr' 	=> 'MS',
					'rfiDraftForm_sslr' => 'RFI',
					'dcrSubmit_sslr' 	=> 'DCR',
					'wirSubmit_sslr' 	=> 'WIR',
					'ncrSubmit_sslr' 	=> 'NCR',
					'noiSubmit_sslr' 	=> 'NOI',
					'rsdlSubmit_sslr' 	=> 'RSDL'
				);
			
				$this->linkArr = array(
					'puRegister' 		=> 'puRegister_view',
					'pubcSubmit_sslr' 	=> 'pubcSubmit_view',
					'leForm_sslr' 		=> 'leRegister_view',
					'liRegister_sslr' 	=> 'liRegister_view',
					'laForm_sslr' 		=> 'laForm_view',
					'rrSubmit_sslr' 	=> 'rrSubmit_view',
					'smhForm_sslr' 		=> 'smhRegister_view',
					'saForm_sslr' 		=> 'saRegister_view',
					'rsSubmission_sslr' => 'rsSubmit_view',
					'sdForm_sslr' 		=> 'sdSubmit_view',
					'sdlSubmit_sslr' 	=> 'sdlSubmit_view',
					'incForm_sslr' 		=> 'incRegister_view',
					'maSubmission_sslr' => 'maSubmission_view',
					'msSubmit_sslr' 	=> 'msSubmit_view',
					'rfiDraftForm_sslr' => 'rfiSubmit_view',
					'dcrSubmit_sslr' 	=> 'dcrSubmit_view',
					'wirSubmit_sslr' 	=> 'wirSubmit_view',
					'ncrSubmit_sslr' 	=> 'ncrSubmit_view',
					'noiSubmit_sslr' 	=> 'noiSubmit_view',
					'rsdlSubmit_sslr' 	=> 'rsdlSubmit_view'
				);
			}else{
				$this->processNameArr = array(
					'puRegister' 	=> 'PU',
					'daSubmit' 		=> 'DA',
					'pubcSubmit' 	=> 'PUBC',
					'lsRegister' 	=> 'LS',
					'leRegister' 	=> 'LE',
					'liRegister' 	=> 'LI',
					'laForm' 		=> 'LA',
					'rrSubmit' 		=> 'RR',
					'smhRegister' 	=> 'SMH',
					'saRegister' 	=> 'SA',
					'rsSubmission' 	=> 'RS',
					'sdSubmit' 		=> ($this->projectOwner == 'JKR_SABAH') ? 'SI' : 'SD',
					'sdlSubmit' 	=> 'SDL',
					'incRegister' 	=> 'INC',
					'maSubmission' 	=> 'MA',
					'msSubmit' 		=> 'MS',
					'rfiSubmit' 	=> ($this->projectOwner == 'JKR_SABAH') ? 'RFIT' : 'RFI',
					'dcrSubmit' 	=> 'DCR',
					'wirSubmit' 	=> ($this->projectOwner == 'JKR_SABAH') ? 'RFI' : 'WIR',
					'ncrSubmit' 	=> 'NCR',
					'noiSubmit' 	=> 'NOI',
					'rsdlSubmit' 	=> 'RSDL'
				);
			
				$this->linkArr = array(
					'puRegister' 	=> 'puRegister_view',
					'daSubmit' 		=> 'daSubmit_view',
					'pubcSubmit' 	=> 'pubcSubmit_view',
					'lsRegister' 	=> 'lsRegister_view',
					'leRegister' 	=> 'leRegister_view',
					'liRegister' 	=> 'liRegister_view',
					'laForm' 		=> 'laForm_view',
					'rrSubmit' 		=> 'rrSubmit_view',
					'smhRegister' 	=> 'smhRegister_view',
					'saRegister' 	=> 'saRegister_view',
					'rsSubmission' 	=> 'rsSubmit_view',
					'sdSubmit' 		=> 'sdSubmit_view',
					'sdlSubmit' 	=> 'sdlSubmit_view',
					'incRegister' 	=> 'incRegister_view',
					'maSubmission' 	=> 'maSubmission_view',
					'msSubmit' 		=> 'msSubmit_view',
					'rfiSubmit' 	=> 'rfiSubmit_view',
					'dcrSubmit' 	=> 'dcrSubmit_view',
					'wirSubmit' 	=> 'wirSubmit_view',
					'ncrSubmit' 	=> 'ncrSubmit_view',
					'noiSubmit' 	=> 'noiSubmit_view',
					'rsdlSubmit' 	=> 'rsdlSubmit_view'
				);
				
			}
			
		}

	}

	function loadJS(){
		if($_SESSION['ui_pref'] == "ri_v3"){
			$prefix = '../../../';
		}else{
			$prefix = '../../';
		}

		echo '<script src="'.$prefix.'JS/exportdata.js"></script>';
	}

	function renderSummaryHTML(){

		if($_SESSION['ui_pref'] == "ri_v3"){
			if (!isset($this->link['view_download_data'])) {
				return 'Session Error!';
			}
			
			$data = $this->jogetCURL($this->link['view_download_data']);
			$tbHTML = '';

			if ($data) {
				$tbHTML = '<div class="tableHeader bulk">
								<span class="columnFirst">Project Name</span>
								<span class="columnSecond">Last Update</span>
								<span class="columnSecond">View Data</span>
							</div>';
				
				$tbHTML .= '<div class="tableBody">';
				foreach ($data as $k) {
					$processId = (isset($this->processNameArr[$k['formId']])) ? $this->processNameArr[$k['formId']] : 'Other';
					$linkPrefix = (isset($this->link[$this->linkArr[$k['formId']]])) ? $this->link[$this->linkArr[$k['formId']]] : '';
					$aLink = ($linkPrefix) ? '<a href="#" onclick="openMinimalWindow(\''.$linkPrefix.implode(';', $k['ids']).'\', \''.$processId.'\')">View</a>' : '';

					$tbHTML .= '
									<div class="row bulk">
										<div class="columnFirst textContainer bulk"><span class="fontSmall">'.$processId.'</span></div>
										<div class="columnSecond textContainer bulk"><span class="fontSmall">'.count($k['ids']).'</span></div>
										<div class="columnSecond textContainer bulk"><span class="fontSmall">'.$aLink.'</span></div>
									</div>
								';
				}
				$tbHTML .= '</div>';
				$this->dataFlag = true;
			}else{
				$tbHTML .= '<div style="text-align: center;"><span class="infoMsg">Please select some data to download</span><div>';
				$this->dataFlag = false;
			}

		}else{
			if (!isset($this->link['view_download_data'])) {
				return 'Session Error!';
			}
			
			$data = $this->jogetCURL($this->link['view_download_data']);
			$tbHTML = '';
	
			if ($data) {
				$tbHTML = '
					<div class="">
						<table id="exportTb">';
				$tbHTML .= '<th>Process</th><th>Count</th><th></th>';
				$tbHTML .= '<tr>';
				foreach ($data as $k) {
					$processId = (isset($this->processNameArr[$k['formId']])) ? $this->processNameArr[$k['formId']] : 'Other';
					$linkPrefix = (isset($this->link[$this->linkArr[$k['formId']]])) ? $this->link[$this->linkArr[$k['formId']]] : '';
					$aLink = ($linkPrefix) ? '<a href="#" onclick="openMinimalWindow(\''.$linkPrefix.implode(';', $k['ids']).'\', \''.$processId.'\')">View</a>' : '';
	
					$tbHTML .= '<tr>';
					$tbHTML .= '<td>'.$processId.'</td><td>'.count($k['ids']).'</td><td>'.$aLink.'</td>';
					$tbHTML .= '</tr>';
				}
				$tbHTML .= '</tr>';
				$tbHTML .= '</table>';
				$this->dataFlag = true;
			}else{
				$tbHTML .= '<div style="text-align: center;"><span class="infoMsg">Please select some data to download</span><div>';
				$this->dataFlag = false;
			}
		}

		return $tbHTML;
	}

	function jogetCURL($url){
		if (!$url) return false;
	    $headers = array(
	        'Content-Type: application/json',
	        'Authorization: Basic ' . base64_encode("$this->api_username:$this->api_password")
	    );

	    $ch = curl_init($url);
	    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
	    curl_setopt($ch, CURLOPT_POST, 1);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	    // only for dev, need to remove on production
	   	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

	    $return = curl_exec($ch);
	    $err    = curl_error($ch);
	    if ($err) {
	        return false;
	    } else {
	        return json_decode($return, true);
	    }	
	}

	function renderButton(){
		$btnHTML = '';

		if ($this->dataFlag) {

			$btnHTML = '            
			<div class="bottom">
				<button type="button" aria-label="Download Data" id="" onclick="downloadData(\''.$this->link['download_data'].'\');">
					<span aria-hidden="true">Download Data</span>
				</button>
			</div>';
	
		}
		return $btnHTML;
	}

	function render(){
		if($_SESSION['ui_pref'] == "ri_v3"){
			$ret = '<div class="bulkDownloadBody">';
			$ret .= $this->renderSummaryHTML();
			$ret .= $this->renderButton();
			$ret .= '</div>';

		}else{
			$ret = '<div class="bulkDownloadBody">';
			$ret .= $this->renderSummaryHTML();
			$ret .= $this->renderButton();
			$ret .= '</div>';
		}
		return $ret;
	}
}