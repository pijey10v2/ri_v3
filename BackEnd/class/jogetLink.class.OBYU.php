<?php 
/**
 * To manage joget link for form/datalist based on org
 *
 */
class JogetLink
{
	var $jogetDomain;
	var $jogetIp;
	var $jogetHost;
	var $owner_org;
	var $project_id;
	var $user_email;
	var $user_role;
	var $parent_project_id;
	var $parent_project_name;
	var $pid;
	var $jogetSupportDomain;
	var $jogetSupportIp;
	var $jogetSupportHost;

	var $constructApp;
	var $financeApp;
	var $documentApp;
	var $system;
	
	var $firstDateOfMonth = '';
	var $monthlyCutOffDate = '';

	var $jogetAppLink;
	var $construct_package_ver = 71;
	var $jogetConstructVersion = "latest";

	// Cesium Access Token
	var $mapboxToken;
	var $maptilerToken;

	private $admin_username;
	private $admin_password;
	private $conn;
	private $jogetSupportAdminUser;

	function __construct()
	{
		if (session_status() == PHP_SESSION_NONE) session_start();
		if (!isset($_SESSION['email'])) die('Session Error!');

		include_once dirname(__FILE__).'/../../login/include/_include.php';
		global $CONN;
		global $SYSTEM;
		$this->conn = $CONN;

		include_once dirname(__FILE__).'/../../Login/app_properties.php';
		global $JOGETDOMAIN, $JOGETIP;
		$this->jogetDomain = $JOGETDOMAIN;
		$this->jogetIp = $JOGETIP;


		global $JOGETADMINUSER, $JOGETADMINPWD;
		$this->admin_username = $JOGETADMINUSER;
		$this->admin_password = $JOGETADMINPWD;

		global $JOGETASSETDOMAIN, $JOGETASSETIP, $JOGETSUPPORTDOMAIN, $JOGETSUPPORTIP, $GEOSERVERDOMAIN, $GEOSERVERIP, $RIHOST, $MAPBOX_TOKEN;

		//add code for support user (new)
		global $JOGETSUPPORTDOMAIN, $JOGETSUPPORTIP;
		$this->jogetSupportDomain = $JOGETSUPPORTDOMAIN;
		$this->jogetSupportIP = $JOGETSUPPORTIP;
		global $JOGETSUPPORTADMINUSER, $JOGETSUPPORTADMINPWD;
		$this->jogetSupportAdminUser = $JOGETSUPPORTADMINUSER;
		$this->jogetSupportAdminPwd = $JOGETSUPPORTADMINPWD;
		$this->jogetAssetDomain = $JOGETASSETDOMAIN;
		$this->jogetAssetIp = $JOGETASSETIP;

		$this->jogetHost = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $this->jogetDomain : $this->jogetIp;
		$this->jogetSupportHost = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $this->jogetSupportDomain : $this->jogetSupportIP;
		$this->jogetAssetHost = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $this->jogetAssetDomain : $this->jogetAssetIp;

		$this->owner_org = isset($_SESSION['project_owner']) ? $_SESSION['project_owner'] : '';
		$this->project_id = isset($_SESSION['projectID']) ? $_SESSION['projectID'] : '';
		$this->project_name =isset($_SESSION['project_name']) ? $_SESSION['project_name'] : '';
		$this->user_email = $_SESSION['email'];
		$this->user_role = isset($_SESSION['project_role']) ?  $_SESSION['project_role']:"";
		$this->parent_project_id = isset($_SESSION['parent_project_id']) ? $_SESSION['parent_project_id'] : '';
		$this->parent_project_name = isset($_SESSION['parent_project_name']) ? $_SESSION['parent_project_name'] : '';

		$this->pid = isset($_SESSION['project_id']) ? $_SESSION['project_id'] : '';
		$this->isDownstream = isset($IS_DOWNSTREAM) ? $IS_DOWNSTREAM : false;
		
		require_once __DIR__ . "/../cesiumTokenFunctions.php";

		$this->mapboxToken = getDefaultCesiumTokens() ?? (isset($MAPBOX_TOKEN) ? $MAPBOX_TOKEN : false);
		$this->maptilerToken = getDefaultCesiumTokens('maptiler') ?? (isset($MAPTILER_TOKEN) ? $MAPTILER_TOKEN : false);

    	$appListsEncode = isset($_SESSION['appsLinks']) ? json_decode($_SESSION['appsLinks']) : [];
	    if ($appListsEncode) {
    		$constructpackageInfoArr = explode('::', $appListsEncode->constructPackage_name);
    		$this->constructApp = $constructpackageInfoArr[0];

    		$documentpackageInfoArr = explode('::', $appListsEncode->documentPackage_name);
    		$this->documentApp = $documentpackageInfoArr[0];

    		$financepackageInfoArr = explode('::', $appListsEncode->financePackage_name);
    		$this->financeApp = $financepackageInfoArr[0];
	    }

	    // date infomation
	    $this->monthlyCutOffDate = isset($_SESSION['cut_off_date']) ?  str_replace("/", "-", $_SESSION['cut_off_date']) : date('t-m-Y');
	    $this->firstDateOfMonth = '01-'.date('m-Y');

		global $SYSTEM;
		$this->system = $SYSTEM;
		$this->loadURL();
	}

	public function getAdminUserName(){
		return $this->admin_username;
	}

	public function getAdminUserPassword(){
		return $this->admin_password;
	}

	public function getConstructAppLink(){
		$ret = array(
			'dataList' => $this->constructDatalist(),
			'form' => $this->constructForm(),
			'api' => $this->constructJson()
		);
		return $ret;
	}

	private function getConstructAppJsonSrcPrefix(){
		$ret = $this->jogetHost."jw/web/json/data/list/".$this->constructApp."/";
		return $ret;
	}

	private function constructJson(){
		$jsonSrcPrefix = $this->getConstructAppJsonSrcPrefix();

		$construct_json_NCR = "";
		$construct_json_NOI = "";
		$construct_json_WIR = "";
		$construct_json_RFI = "";
		$construct_json_MOS = "";
		$construct_json_MS = "";
		$construct_json_IR = "";
		$construct_json_SD = "";
		$construct_json_SDL = "";
		$construct_json_PTW ="";
		$construct_json_CAR = "";

		//dashboard
		$construct_dash_IR = "";
		$construct_dash_SA = "";
		$construct_dash_NCR = "";
		$construct_dash_NOI = "";
		$construct_dash_SMH = "";
		$construct_dash_SD = "";
		$construct_dash_SD_opt = "";
		$construct_dash_MS = "";
		$construct_dash_MT = "";
		$construct_dash_WIR = "";
		$construct_dash_RA = "";
		$construct_dash_RA_Section = "";
		$construct_dash_RFI = "";
		$construct_dash_RR = "";
		$construct_dash_PBC = "";
		$construct_dash_EVNT = "";
		$construct_dash_MAU = "";
		$construct_dash_LM = "";
		$construct_dash_LMS = "";
		$construct_dash_LTD = "";
		$construct_dash_LD = "";
		$construct_dash_LT = "";
		$construct_dash_LMRS = "";
		$construct_dash_LMRS_new = "";
		$construct_dash_LMR = "";
		$construct_dash_LMR_CTD = "";
		$construct_dash_LAT = "";
		$construct_dash_LTR = "";
		$construct_dash_LWTG = "";
		$construct_dash_LWTGStage = "";
		$construct_dash_LWTGMile = "";
		$construct_dash_LM_sum = "";

		$construct_dash_LMAcq = "";
		$construct_dash_LMIssues = "";

	
		switch ($this->owner_org) {
			case 'KACC':
				// joget.php getJogetProcessRecords()
				$construct_json_NCR = $jsonSrcPrefix."list_kaccNcr?d-6454760-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_WIR = $jsonSrcPrefix."list_kaccWirForm?d-2753223-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_RFI = $jsonSrcPrefix."list_kaccRfiForm?d-2748120-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_MOS = $jsonSrcPrefix."list_kaccMsForm?d-6507675-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_MS = $jsonSrcPrefix."list_kaccMaForm?d-6506217-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_IR = $jsonSrcPrefix."list_kaccIncForm?d-2743017-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_SD = $jsonSrcPrefix."list_kaccSi?d-7743975-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_SDL = $jsonSrcPrefix."list_kaccSd?d-7743970-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_PTW = $jsonSrcPrefix."list_kaccPtw?d-6454834-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_CAR = $jsonSrcPrefix."list_kaccCar?d-6454655-fn_package_id=".$this->project_id."&rows=9999";

				// dashboard
				$construct_dash_IR = $jsonSrcPrefix."list_kaccIncForm?d-2743017-fn_package_id={?}&d-2743017-fn_project_id={?}";
				$construct_dash_SA = $jsonSrcPrefix."list_kaccSaForm?d-6507675-fn_package_id={?}&d-6507675-fn_project_id={?}";
				$construct_dash_NCR = $jsonSrcPrefix."list_kaccNcr?d-6454760-fn_package_id={?}&d-6454760-fn_project_id={?}";
				$construct_dash_SMH = $jsonSrcPrefix."list_kaccSmh?d-6454825-fn_package_id={?}&d-6454825-fn_project_id={?}";

				$construct_dash_SD = $jsonSrcPrefix."list_kaccSd?d-7743970-fn_package_id={?}&d-7743970-fn_day_date={?}&d-7743970-fn_day_date={?}&d-7743970-p=1&d-7743970-ps=10&d-7743970-fn_project_id={?}";
				$construct_dash_SD_opt = $jsonSrcPrefix."list_kaccSd_opt?package_id={?}&day_date={?}&day_date={?}&d-7743970-p=1&d-7743970-ps=10&project_id={?}";
				$construct_dash_MS = $jsonSrcPrefix."list_kaccMs?d-7743967-fn_package_id={?}&d-7743967-fn_project_id={?}";
				$construct_dash_MT = $jsonSrcPrefix."list_kaccMa?d-7743949-fn_package_id={?}&d-7743949-fn_project_id={?}";
				$construct_dash_WIR = $jsonSrcPrefix."list_kaccWir?d-6454859-fn_package_id={?}&d-6454859-fn_project_id={?}";
				$construct_dash_MAU =  $jsonSrcPrefix."list_kaccMau?d-6454748-fn_package_id={?}&d-6454748-fn_project_id={?}";

				break;
			case 'MRSB':
				//  Material Submission = MA = MT ************
				// Method Statement = MOS = MS **************
				// joget.php getJogetProcessRecords()
				$construct_json_NCR = $jsonSrcPrefix."mrsbNcrDataList?d-4562811-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_NOI = $jsonSrcPrefix."mrsbNoiDataList?d-4739958-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_WIR = $jsonSrcPrefix."mrsbWirDataList?d-5212350-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_RFI = $jsonSrcPrefix."mrsbRfiDataList?d-4799007-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_MOS = $jsonSrcPrefix."mrsbMsDataList?d-4325736-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_MS = $jsonSrcPrefix. "mrsbMaList?d-2641284-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_IR = $jsonSrcPrefix."list_mrsbIncForm?d-3298515-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_SD = $jsonSrcPrefix."list_mrsbSiForm?d-6693489-fn_package_id=".$this->project_id."&rows=9999";
				$construct_json_SDL = $jsonSrcPrefix."list_mrsbSdForm?d-6693084-fn_package_id=".$this->project_id."&rows=9999";
				


				$construct_dash_SD = $jsonSrcPrefix."list_mrsbSdForm?d-6693084-fn_package_id={?}&d-7743970-fn_day_date={?}&d-7743970-fn_day_date={?}";
				$construct_dash_RA = $jsonSrcPrefix."dashRaOverall?d-4956310-fn_project_id=";
				$construct_dash_RA_Section = $jsonSrcPrefix."dashRaSection?d-4955070-fn_package_id=";
				$construct_dash_NCR = $jsonSrcPrefix."dashMrsbNCR?d-7077625-fn_package_id={?}&project_id={?}";
				$construct_dash_NOI = $jsonSrcPrefix."dashMrsbNOI?d-7077652-fn_package_id={?}&project_id={?}";
				$construct_dash_SA = $jsonSrcPrefix."dashMrsbSA?d-2359194-fn_package_id=";
				$construct_dash_SMH = $jsonSrcPrefix."dashMrsbSMH?d-7077690-fn_package_id={?}&project_id={?}";
				$construct_dash_IR = $jsonSrcPrefix."list_mrsbInc?d-6461591-fn_package_id=";
				$construct_dash_RFI = $jsonSrcPrefix."dashMrsbRFI?d-7077661-fn_package_id={?}&project_id={?}";
				$construct_dash_MS = $jsonSrcPrefix."dashMrsbMS?d-2359194-fn_package_id={?}&project_id={?}";
				$construct_dash_MT = $jsonSrcPrefix."dashMrsbMA?d-2359176-fn_package_id={?}&project_id={?}";
				$construct_dash_WIR = $jsonSrcPrefix."dashMrsbWIR?d-7077724-fn_package_id={?}&project_id={?}";
				$construct_dash_RR = $jsonSrcPrefix."dashMrsbRR?d-2359208-fn_package_id={?}&project_id={?}";
				$construct_dash_PBC = $jsonSrcPrefix."dashMrsbPBC?d-7077625-fn_package_id={?}&project_id={?}";
				$construct_dash_EVNT = $jsonSrcPrefix."dashMrsbEVT?d-7077603-fn_package_id=";
				// $construct_dash_LM = $jsonSrcPrefix."dashMrsbLM?d-2359185-fn_project_id=";
				$construct_dash_LM = $jsonSrcPrefix."dashMrsbLMDuplicate?d-5715494-fn_project_id="; //change to construct_dash_LM_new
				$construct_dash_LMS = $jsonSrcPrefix."dashMrsbLMS?d-7077638-fn_c_parent_id=";
				$construct_dash_LTD = $jsonSrcPrefix."dashMrsbLTD?d-7077644-fn_project_id=";
				// $construct_dash_LD = $jsonSrcPrefix."dashMrsbLD?d-2359176-fn_parent_id=";
				$construct_dash_LD = $jsonSrcPrefix."dashMrsbLDProject?project_id=";
				$construct_dash_LMRS = $jsonSrcPrefix."dashMrsbLMRS?d-4455778-fn_parent_id=";
				$construct_dash_LMRS_new = $jsonSrcPrefix."dashMrsbLMRSnew?d-2866906-fn_parent_id=";
				// $construct_dash_LT = $jsonSrcPrefix."dashMrsbLT?d-2359192-fn_parent_id=";
				$construct_dash_LT = $jsonSrcPrefix."dashMrsbLTProject?project_id=";
				// $construct_dash_LAT = $jsonSrcPrefix."dashMrsbLAT?d-7077603-fn_parent_id=";
				$construct_dash_LAT = $jsonSrcPrefix."dashMrsbLATProject?project_id=";
				$construct_dash_LMR = $jsonSrcPrefix."dashMrsbLMR?d-7077637-fn_parent_id=";
				$construct_dash_LMR_CTD = $jsonSrcPrefix."dashMrsbLMRCTD?d-6547746-fn_parent_id=";
				$construct_dash_LTR = $jsonSrcPrefix."dashMrsbLTR?d-7077658-fn_parent_id=";
				$construct_dash_LWTG = $jsonSrcPrefix."dashMRSBLWTG?d-4422166-fn_project_id=";
				$construct_dash_LWTGStage = $jsonSrcPrefix."dashMRSBLWTGStage?d-855652-fn_parent_id=";
				$construct_dash_LWTGMile = $jsonSrcPrefix."dashMRSBLWTGMS?d-6245376-fn_parent_id=";
				$construct_dash_LM_sum = $jsonSrcPrefix."dashMrsbLMSumData?d-644596-fn_c_project_id=";

				$construct_dash_LMAcq = $jsonSrcPrefix."dashMrsbLMAcquisition?project_id=";
				$construct_dash_LMIssues = $jsonSrcPrefix."dashMrsbLMIssues?project_id=";
				$construct_dash_LMRS_copy = $jsonSrcPrefix."dashMrsbLMRSCopy?parent_id=";
				$construct_dash_LMRS_list = $jsonSrcPrefix."dashMrsbLMRSList?project_id=";

				break;
		}

		$ret = array(
			'construct_json_NCR' => $construct_json_NCR,
			'construct_json_NOI' => $construct_json_NOI,
			'construct_json_WIR' => $construct_json_WIR,
			'construct_json_RFI' => $construct_json_RFI,
			'construct_json_MOS' => $construct_json_MOS,
			'construct_json_MS' => $construct_json_MS,
			'construct_json_IR' => $construct_json_IR,
			'construct_json_SD' => $construct_json_SD,
			'construct_json_SDL' => $construct_json_SDL,
			'construct_json_PTW' => $construct_json_PTW,
			'construct_json_CAR' => $construct_json_CAR,
			// dashboard
			'construct_dash_IR' => $construct_dash_IR,
			'construct_dash_SA' => $construct_dash_SA,
			'construct_dash_NCR' => $construct_dash_NCR,
			'construct_dash_NOI' => $construct_dash_NOI,
			'construct_dash_SMH' => $construct_dash_SMH,
			'construct_dash_SD' => $construct_dash_SD,
			'construct_dash_SD_opt' => $construct_dash_SD_opt,
			'construct_dash_MS' => $construct_dash_MS,
			'construct_dash_MT' => $construct_dash_MT,
			'construct_dash_WIR' => $construct_dash_WIR,
			'construct_dash_RA' => $construct_dash_RA,
			'construct_dash_RA_Section' => $construct_dash_RA_Section,
			'construct_dash_RFI' => $construct_dash_RFI,
			'construct_dash_RR' => $construct_dash_RR,
			'construct_dash_PBC' => $construct_dash_PBC,
			'construct_dash_EVNT' => $construct_dash_EVNT,
			'construct_dash_MAU' => $construct_dash_MAU,
			'construct_dash_LM' => $construct_dash_LM,
			'construct_dash_LMS' => $construct_dash_LMS,
			'construct_dash_LTD' => $construct_dash_LTD,
			'construct_dash_LD' => $construct_dash_LD,
			'construct_dash_LMRS' => $construct_dash_LMRS,
			'construct_dash_LMRS_new' => $construct_dash_LMRS_new,
			'construct_dash_LT' => $construct_dash_LT,
			'construct_dash_LAT' => $construct_dash_LAT,
			'construct_dash_LMR' => $construct_dash_LMR,
			'construct_dash_LMR_CTD' => $construct_dash_LMR_CTD,
			'construct_dash_LTR' => $construct_dash_LTR,
			'construct_dash_LWTG' => $construct_dash_LWTG,
			'construct_dash_LWTGStage' => $construct_dash_LWTGStage,
			'construct_dash_LWTGMile' => $construct_dash_LWTGMile,
			'construct_dash_LM_sum' => $construct_dash_LM_sum,
			//new
			'construct_dash_LMAcq' => $construct_dash_LMAcq,
			'construct_dash_LMIssues' => $construct_dash_LMIssues,
			'construct_dash_LMRS_copy' => $construct_dash_LMRS_copy,
			'construct_dash_LMRS_list' => $construct_dash_LMRS_list
		);
		return $ret;		
	}

	private function getConstructAppSrcPrefix(){
		$srcPrefix = $this->jogetHost."jw/web/embed/userview/".$this->constructApp."/";
		return $srcPrefix;	
	}

	public function constructDatalist(){
		$srcPrefix = $this->getConstructAppSrcPrefix();
		
		// ConOp.js IniatiateConOp() - ConOp dataList
		$construct_list_NCR = "";
		$construct_list_WIR = "";
		$construct_list_RFI = "";
		$construct_list_MOS = "";
		$construct_list_MS = "";
		$construct_list_IR = "";
		$construct_list_SDL = "";
		$construct_list_SD = "";
		$construct_list_SA = "";
		$construct_list_SMH = "";
		$construct_list_PTW = "";
		$construct_list_CAR= "";
		$construct_list_NOI="";
		$construct_list_PUBC= "";
		$construct_list_EVNT= "";
		$construct_list_LTD= "";
		$construct_list_LM= "";
		$construct_list_RR= "";
		$construct_list_RROverall = "";
		$construct_list_RRSection = "";
		$empty ="";

		// link to open from dashboard
		$construct_dash_conop_sdl = "";
		$construct_dash_conop_sa = "";
		$construct_dash_conop_smh = "";
		$construct_dash_conop_inc = "";
		$construct_dash_conop_ncr = "";
		$construct_dash_conop_ra_overall = "";
		$construct_dash_conop_ra_section = "";
		$construct_dash_conop_qaqc_ncr = "";
		$construct_dash_conop_qaqc_noi = "";
		$construct_dash_conop_qaqc_rfi = "";
		$construct_dash_conop_qaqc_mos = "";
		$construct_dash_conop_qaqc_ms = "";
		$construct_dash_conop_qaqc_wir = "";
		$construct_dash_conop_evnt = "";
		$construct_dash_conop_pubc = "";
		$construct_dash_conop_rr = "";
		$construct_dash_conop_ms = "";
		$construct_dash_conop_ma = "";
		$construct_dash_conop_qaqc_ncr_card = "";
		$construct_dash_conop_land_management = "";
		$construct_dash_conop_land_managementAiwiFoe = "";
		$construct_dash_conop_land_timeline = "";

		$construct_list_PPU = $srcPrefix."projectprogress/_/ppuForm_crud?d-6463062-fn_package_id=".$this->project_id;

		// dashboard linking to conOp
		// need to handle link between parent and package
		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->project_id;
			$packageIdConOp = '{?}';

			$projectIdConopLand = $this->project_id;
		}else{
			$projectIdConOp = $this->parent_project_id;
			$packageIdConOp = $this->project_id;

			$projectIdConopLand = $this->parent_project_id;
		}
		
		switch ($this->owner_org) {
			case 'KACC':
				// ConOp.js IniatiateConOp() - ConOp dataList
				$construct_list_NCR = $srcPrefix."kacc/_/kaccNcr_crud?d-6454760-fn_package_id=".$this->project_id."&d-6454760-fn_ref_no=".$empty."&d-6454760-fn_issuer=".$empty."&d-6454760-fn_management_system=".$empty."&d-6454760-fn_dateCreated=".$empty."&d-6454760-fn_date_issued=".$empty."&d-6454760-fn_date_issued=".$empty."&d-6454760-fn_status=".$empty."&d-6454760-fn_category=".$empty."&d-6454760-fn_issuer=".$empty;
				$construct_list_WIR = $srcPrefix."kacc/_/kaccWir_crud?d-6454859-fn_package_id=".$this->project_id."&d-6454859-fn_ref_no=".$empty."&d-6454859-fn_work_discipline=".$empty."&d-6454859-fn_dateCreated=".$empty;
				$construct_list_RFI = $srcPrefix."kacc/_/kaccRfi_crud?d-6454796-fn_package_id=".$this->project_id."&d-6454796-fn_reference_no=".$empty."&d-6454796-fn_trade=".$empty."&d-6454796-fn_subject=".$empty."&d-6454796-fn_dateCreated=".$empty;
				$construct_list_MOS = $srcPrefix."kacc/_/kaccMs_crud?d-7743967-fn_package_id=".$this->project_id."&d-7743967-fn_ref_no=".$empty."&d-7743967-fn_dateCreated=".$empty."&d-7743967-fn_date_submitted=".$empty."&d-7743967-fn_date_submitted=".$empty."&d-7743967-fn_approval_status=".$empty;
				$construct_list_MS = $srcPrefix."kacc/_/kaccMa_crud?d-7743949-fn_package_id=".$this->project_id."&d-7743949-fn_ref_no=".$empty."&d-7743949-fn_trades=".$empty."&d-7743949-fn_dateCreated=".$empty."&d-7743949-fn_date_submission=".$empty."&d-7743949-fn_date_submission=".$empty."&d-7743949-fn_approval_status=".$empty."&d-7743949-fn_approval_status=".$empty."&d-7743949-fn_approval_status=".$empty."&d-7743949-fn_approval_status=".$empty."&d-7743949-fn_approval_status=".$empty;
				$construct_list_IR = $srcPrefix."kacc/_/kaccInc_crud?d-6454733-fn_package_id=".$this->project_id."&d-6454733-fn_ref_no=".$empty."&d-6454733-fn_incident_category=".$empty."&d-6454733-fn_dateCreated=".$empty."&d-6454733-fn_dateCreated=".$empty."&d-6454733-fn_incident_date=".$empty."&d-6454733-fn_incident_date=".$empty."&d-6454733-fn_fatality_type=".$empty."&d-6454733-fn_property_damage_type=".$empty;
				$construct_list_SDL = $srcPrefix."kacc/_/kaccSd_crud?d-7743970-fn_package_id=".$this->project_id."&d-7743970-fn_ref_no=".$empty."&d-7743970-fn_day_date=".$empty."&d-7743970-fn_day_date=".$empty;
				$construct_list_SD = $srcPrefix."kacc/_/kaccSi_crud?d-7743975-fn_package_id=".$this->project_id."&d-7743975-fn_ref_no=".$empty."&d-7743975-fn_dateCreated=".$empty;
				$construct_list_SA = $srcPrefix."kacc/_/kaccSa_crud?d-7743967-fn_package_id=".$this->project_id."&d-7743967-fn_dateCreated=".$empty."&d-7743967-fn_month=".$empty."&d-7743967-fn_year=".$empty;
				$construct_list_SMH = $srcPrefix."kacc/_/kaccSmh_crud?d-6454825-fn_package_id=".$this->project_id."&d-6454825-fn_dateCreated=".$empty."&d-6454825-fn_month=".$empty."&d-6454825-fn_year=".$empty;
				$construct_list_PTW = $srcPrefix."kacc/_/kaccPtw_crud?d-6454834-fn_package_id=".$this->project_id."&d-6454834-fn_project_name=".$empty."&d-6454834-fn_date_start=".$empty."&d-6454834-fn_ref_no=".$empty."&d-6454834-fn_type=".$empty."&d-6454834-fn_date_completion=".$empty."&d-6454834-fn_dateCreated=".$empty;
				$construct_list_CAR = $srcPrefix."kacc/_/kaccCar_crud?d-6454655-fn_package_id=".$this->project_id."&d-6454655-fn_ref_no=".$empty."&d-6454655-fn_ref_no=".$empty."&d-6454655-fn_issuer=".$empty."&d-6454655-fn_management_system=".$empty."&d-6454655-fn_dateCreated=".$empty;
				
				$construct_dash_conop_sdl = $srcPrefix."kacc/_/kaccSd_crud?d-7743970-fn_package_id=".$packageIdConOp."&d-7743970-fn_project_id=".$projectIdConOp."&d-7743970-fn_day_date={?}&d-7743970-fn_day_date={?}&d-7743970-fn_section={?}&d-7743970-p=1&d-7743970-ps=10";
				$construct_dash_conop_smh =  $srcPrefix."kacc/_/kaccSmh_crud?d-6454825-fn_package_id=".$packageIdConOp."&d-6454825-fn_project_id=".$projectIdConOp."&d-6454825-fn_dateCreated=".$empty."&d-6454825-fn_month={?}&d-6454825-fn_year={?}";
				$construct_dash_conop_inc =  $srcPrefix."kacc/_/kaccInc_crud?d-6454733-fn_package_id=".$packageIdConOp."&d-6454733-fn_project_id=".$projectIdConOp."&d-6454733-fn_ref_no=&d-6454733-fn_dateCreated=&d-6454733-fn_dateCreated=&d-6454733-fn_incident_date={?}&d-6454733-fn_incident_date={?}&d-6454733-fn_fatality_type={?}&d-6454733-fn_property_damage_type={?}&d-6454733-fn_incident_category={?}&d-6454733-ps=10&d-6454733-p=1";
				$construct_dash_conop_ncr =  $srcPrefix."kacc/_/kaccNcr_crud?d-6454760-fn_package_id=".$packageIdConOp."&d-6454760-fn_project_id=".$projectIdConOp."&d-6454760-fn_ref_no=".$empty."&d-6454760-fn_issuer=".$empty."&d-6454760-fn_management_system=".$empty."&d-6454760-fn_dateCreated=".$empty."&d-6454760-fn_date_issued={?}&d-6454760-fn_date_issued={?}&d-6454760-fn_status={?}&d-6454760-fn_category={?}&d-6454760-fn_issuer={?}&d-6454760-fn_issuer=&d-6454760-p=1&d-6454760-ps=10";
				$construct_dash_conop_qaqc_ncr =  $srcPrefix."kacc/_/kaccNcr_crud?d-6454760-fn_package_id={?}&d-6454760-fn_ref_no=".$empty."&d-6454760-fn_management_system=".$empty."&d-6454760-fn_dateCreated=".$empty."&d-6454760-fn_date_issued={?}&d-6454760-fn_date_issued={?}&d-6454760-fn_status={?}&d-6454760-fn_category={?}&d-6454760-fn_issuer={?}&d-6454760-fn_receiver={?}&d-6454760-fn_sub_category={?}&d-6454760-p=1&d-6454760-ps=10&d-6454760-fn_project_id=".$projectIdConOp;
				$construct_dash_conop_qaqc_ncr_card =  $srcPrefix."kacc/_/kaccNcr_crud?d-6454760-fn_package_id=".$packageIdConOp."&d-6454760-fn_ref_no=".$empty."&d-6454760-fn_management_system=".$empty."&d-6454760-fn_dateCreated=".$empty."&d-6454760-fn_date_issued={?}&d-6454760-fn_date_issued={?}&d-6454760-fn_status={?}&d-6454760-fn_category={?}&d-6454760-fn_issuer={?}&d-6454760-fn_receiver={?}&d-6454760-fn_sub_category={?}&d-6454760-p=1&d-6454760-ps=10&d-6454760-fn_project_id=".$projectIdConOp;
				$construct_dash_conop_ms = $srcPrefix."kacc/_/kaccMs_crud?d-7743967-fn_package_id=".$packageIdConOp."&d-7743967-fn_project_id=".$projectIdConOp."&d-7743967-fn_ref_no=".$empty."&d-7743967-fn_dateCreated=".$empty."&d-7743967-fn_date_submitted={?}&d-7743967-fn_date_submitted={?}&d-7743967-fn_approval_status={?}&d-7743967-fn_approval_status={?}&d-7743967-fn_approval_status={?}&d-7743967-fn_approval_status={?}&d-7743967-p=1&d-7743967-ps=10&d-7743967-o=2&d-7743967-s=8";
				$construct_dash_conop_ma = $srcPrefix."kacc/_/kaccMa_crud?d-7743949-fn_package_id=".$packageIdConOp."&d-7743949-fn_project_id=".$projectIdConOp."&d-7743949-fn_ref_no=".$empty."&d-7743949-fn_trades=".$empty."&d-7743949-fn_dateCreated=".$empty."&d-7743949-fn_date_submission={?}&d-7743949-fn_date_submission={?}&d-7743949-fn_approval_status={?}&d-7743949-fn_approval_status={?}&d-7743949-fn_approval_status={?}&d-7743949-fn_approval_status={?}&d-7743949-p=1&d-7743949-ps=10&d-7743949-o=2&d-7743949-s=8";
				$construct_dash_conop_sa = $srcPrefix."kacc/_/kaccSa_crud?d-7743967-fn_package_id={?}&d-7743967-fn_project_id=".$projectIdConOp."&d-7743967-fn_dateCreated=".$empty."&d-7743967-fn_month={?}&d-7743967-fn_year={?}";
				$construct_dash_conop_qaqc_wir = $srcPrefix."kacc/_/kaccWir_crud?d-6454859-fn_package_id=".$packageIdConOp."&d-6454859-fn_ref_no=".$empty."&d-6454859-fn_work_discipline=".$empty."&d-6454859-fn_dateCreated=".$empty."&d-6454859-fn_submitted_date={?}&d-6454859-fn_submitted_date={?}&d-6454859-fn_status={?}&d-6454859-fn_project_id=".$projectIdConOp."&d-6454859-s=4&d-6454859-p=1&d-6454859-o=1&d-6454859-ps=10";

				break;
			case 'MRSB':
				//  Material Submission = MA = MT ************
				// Method Statement = MOS = MS **************
				$construct_list_NOI = $srcPrefix."mrsb/_/mrsbNoi_crud?d-6461645-fn_package_id=".$this->project_id."&d-6461645-fn_date_issued=".$empty."&d-6461645-fn_issued_by=".$empty."&d-6461645-fn_issued_to=".$empty."&d-6461645-fn_discipline=".$empty."&d-6461645-fn_ref_no=".$empty."&d-6461645-fn_noi_status=".$empty;
				$construct_list_RR = $srcPrefix."mrsb/_/mrsbRr_crud?d-7746267-fn_package_id=".$this->project_id."&d-7746267-fn_project_id=".$this->parent_project_id."&d-7746267-fn_risk_source=".$empty."&d-7746267-fn_risk=".$empty."&d-7746267-fn_risk_status=".$empty."&d-7746267-fn_risk_area=".$empty."&d-7746267-fn_date_identified=".$empty."&d-7746267-fn_ref_no=".$empty."&d-7746267-fn_risk_owner=".$empty."&d-7746267-fn_project_impact=".$empty;
				$construct_list_SMH = $srcPrefix."mrsb/_/mrsbSmh_crud?d-6461683-fn_package_id=".$this->project_id."&d-6461683-fn_month=".$empty."&d-6461683-fn_year=".$empty;
				$construct_list_SA = $srcPrefix."mrsb/_/mrsbSa_crud?d-7746253-fn_package_id=".$this->project_id."&d-7746253-fn_month=".$empty."&d-7746253-fn_year=".$empty;
				$construct_list_SDL = $srcPrefix."mrsb/_/mrsbSd_crud?d-7746256-fn_package_id=".$this->project_id."&d-7746256-fn_month=".$empty."&d-7746256-fn_year=".$empty;
				$construct_list_IR = $srcPrefix."mrsb/_/mrsbInc_crud?d-6461591-fn_package_id=".$this->project_id."&d-6461591-fn_project_id=".$this->parent_project_id."&d-6461591-fn_ref_no=".$empty."&d-6461591-fn_incident_category=".$empty."&d-6461591-fn_incident_date=".$empty;
				$construct_list_RROverall = $srcPrefix."mrsb/_/mrsbRa_crud?d-7746250-fn_project_id=".$this->parent_project_id."&d-7746250-fn_month=".$empty."&d-7746250-fn_year=".$empty;
				$construct_list_RRSection = $srcPrefix."mrsb/_/mrsbRas_crud?d-6461649-fn_package_id=".$this->project_id."&d-6461649-fn_month=".$empty."&d-6461649-fn_year=".$empty;
				$construct_list_PUBC = $srcPrefix."mrsb/_/mrsbPbc_crud?d-6461618-fn_package_id=".$this->project_id."&d-6461618-fn_category=&d-6461618-fn_date_received=&d-6461618-fn_date_received=&d-6461618-fn_type=&d-6461618-fn_pbc_status=&d-6461618-fn_year=&d-6461618-fn_month=";
				$construct_list_EVNT = $srcPrefix."mrsb/_/mrsbEvt_crud?d-6461596-fn_package_id=".$this->project_id."&d-6461596-fn_category=".$empty."&d-6461596-fn_year=".$empty."&d-6461596-fn_month=&d-6461596-fn_date_event=&d-6461596-fn_date_event=&d-6461596-fn_type=&d-6461596-ps=10&d-6461596-p=1";
				$construct_list_WIR = $srcPrefix."mrsb/_/mrsbWir_crud?d-6461717-fn_package_id=".$this->project_id."&d-6461717-fn_section=".$empty."&d-6461717-fn_year=".$empty."&d-6461717-fn_month=".$empty."&d-6461717-fn_total_submitted=".$empty."&d-6461717-fn_total_approved=".$empty."&d-6461717-fn_total_unapproved=".$empty."&d-6461717-fn_total_cancelled=".$empty."&d-6461717-fn_total_pending=".$empty."&d-6461717-fn_total_closed=".$empty;
				$construct_list_NCR = $srcPrefix."mrsb/_/mrsbNcr_crud?d-6461618-fn_package_id=".$this->project_id."&d-6461618-fn_sub_discipline=&d-6461618-fn_classification=&d-6461618-fn_ref_no=".$empty."&d-6461618-fn_date_issued=".$empty."&d-6461618-fn_issued_to=".$empty."&d-6461618-fn_discipline_code=".$empty."&d-6461618-fn_description=".$empty."&d-6461618-fn_ncr_status=".$empty."&d-6461618-fn_ncr_ageing=".$empty."&d-6461618-fn_project_id=".$this->parent_project_id;
				$construct_list_SD = $srcPrefix."mrsb/_/mrsbSi_crud?d-7746261-fn_package_id=".$this->project_id."&d-7746261-fn_ref_no=".$empty."&d-7746261-fn_subject=".$empty;
				$construct_list_MOS = $srcPrefix."mrsb/_/mrsbMs_crud?d-7746253-fn_package_id=".$this->project_id."&d-7746253-fn_ref_no=".$empty."&d-7746253-fn_submission_type=".$empty."&d-7746253-fn_section=".$empty."&d-7746253-fn_submission_date=".$empty;
				$construct_list_MS = $srcPrefix."mrsb/_/mrsbMa_crud?d-7746235-fn_package_id=".$this->project_id."&d-7746235-fn_ref_no=".$empty."&d-7746235-fn_section=".$empty."&d-7746235-fn_manufacturer=".$empty."&d-7746235-fn_manufacturer=".$empty."&d-7746235-fn_submission_date=&d-7746235-fn_submission_date=&d-7746235-fn_approval_status=&no_approval_status_flag=";
				$construct_list_RFI = $srcPrefix."mrsb/_/mrsbRfi_crud?d-6461654-fn_package_id=".$this->project_id."&d-6461654-fn_section=".$empty."&d-6461654-fn_year=".$empty."&d-6461654-fn_month=".$empty."&d-6461654-fn_total_submitted=".$empty."&d-6461654-fn_total_open=".$empty."&d-6461654-fn_total_closed=".$empty;
				$construct_list_LTD = $srcPrefix."mrsb/_/mrsbLtd_ins_crud?d-6461637-fn_project_id=".$this->parent_project_id;
				$construct_list_LM = $srcPrefix."mrsb/_/mrsbLm_crud?d-7746244-fn_project_id=".$this->parent_project_id."&d-7746244-fn_month=".$empty."&d-7746244-fn_year=".$empty."&d-7746244-fn_month_timeline=".$empty;

				// dashboard linking to conOp
				$construct_dash_conop_evnt = $srcPrefix."mrsb/_/mrsbEvt_crud?d-6461596-fn_package_id=".$packageIdConOp."&d-6461596-fn_project_id=".$projectIdConOp."&d-6461596-fn_date_event={?}&d-6461596-fn_date_event={?}&d-6461596-fn_type={?}&d-6461596-ps=10&d-6461596-p=1";
				$construct_dash_conop_pubc = $srcPrefix."mrsb/_/mrsbPbc_crud?d-6461618-fn_package_id=".$packageIdConOp."&d-6461618-fn_project_id=".$projectIdConOp."&d-6461618-fn_date_received={?}&d-6461618-fn_date_received={?}&d-6461618-fn_category={?}&d-6461618-fn_pbc_status={?}&d-6461618-fn_year={?}&d-6461618-fn_month={?}&d-6461618-s=4&d-6461618-ps=10&d-6461618-o=2&d-6461618-p=1";
				$construct_dash_conop_sdl = $srcPrefix."mrsb/_/mrsbSd_crud?d-7746256-fn_package_id=".$packageIdConOp."&d-7746256-fn_project_id=".$projectIdConOp."&d-7746256-fn_day_date={?}&d-7746256-fn_day_date={?}";
				$construct_dash_conop_ra_overall = $srcPrefix."mrsb/_/mrsbRa_crud?package_id=".$packageIdConOp."&d-7746250-fn_project_id=".$projectIdConOp."&d-7746250-fn_year={?}&d-7746250-fn_month={?}";
				$construct_dash_conop_ra_section = $srcPrefix."mrsb/_/mrsbRas_crud?d-6461649-fn_package_id=".$packageIdConOp."&d-6461649-fn_month={?}&d-6461649-fn_year={?}";
				$construct_dash_conop_sa = $srcPrefix."mrsb/_/mrsbSa_crud?d-7746253-fn_package_id=".$packageIdConOp."&d-7746253-fn_project_id=".$projectIdConOp."&d-7746253-fn_month={?}&d-7746253-fn_year={?}&d-7746253-fn_wpc_no={?}";
				$construct_dash_conop_smh = $srcPrefix."mrsb/_/mrsbSmh_crud?d-6461683-fn_package_id=".$packageIdConOp."&d-6461683-fn_project_id=".$projectIdConOp."&d-6461683-fn_month={?}&d-6461683-fn_year={?}";
				$construct_dash_conop_inc = $srcPrefix."mrsb/_/mrsbInc_crud?d-6461591-fn_package_id=".$packageIdConOp."&d-6461591-fn_project_id=".$projectIdConOp."&d-6461591-fn_category={?}&d-6461591-fn_incident_date={?}&d-6461591-fn_incident_date={?}&d-6461591-fn_incident_location={?}&d-6461591-fn_incident_related={?}";
				$construct_dash_conop_ncr = $srcPrefix."mrsb/_/mrsbNcr_crudDashboard?d-5120850-fn_package_id=".$packageIdConOp."&d-5120850-fn_project_id=".$projectIdConOp."&d-5120850-fn_discipline=Health%20%26%20Safety&d-5120850-fn_discipline=Environment&d-5120850-fn_discipline=Traffic&d-5120850-fn_ncr_status={?}&d-5120850-fn_date_issued={?}&d-5120850-fn_date_issued={?}&d-5120850-fn_project_title=&d-5120850-fn_project_code=&d-5120850-fn_ref_no=&d-5120850-fn_issued_to=&d-5120850-fn_discipline_code=&d-5120850-fn_description=&d-5120850-fn_ncr_ageing=&d-5120850-fn_classification=&d-5120850-fn_sub_discipline=&d-5120850-ps=10&d-5120850-p=1";
				$construct_dash_conop_qaqc_ncr = $srcPrefix."mrsb/_/mrsbNcr_crudDashboard?d-5120850-fn_package_id=".$packageIdConOp."&d-5120850-fn_project_id=".$projectIdConOp."&d-5120850-fn_classification={?}&d-5120850-fn_discipline={?}&d-5120850-fn_sub_discipline={?}&d-5120850-fn_date_issued={?}&d-5120850-fn_date_issued={?}&d-5120850-fn_ncr_status={?}&d-5120850-fn_project_title=&d-5120850-fn_project_code=&d-5120850-fn_ref_no=&d-5120850-fn_issued_to=&d-5120850-fn_discipline_code=&d-5120850-fn_description=&d-5120850-fn_ncr_ageing=&d-5120850-ps=10&d-5120850-p=1";
				$construct_dash_conop_qaqc_noi =  $srcPrefix."mrsb/_/mrsbNoi_crud?d-6461645-fn_package_id=".$packageIdConOp."&d-6461645-fn_project_id=".$projectIdConOp."&d-6461645-fn_classification={?}&d-6461645-fn_date_issued={?}&d-6461645-fn_date_issued={?}&d-6461645-fn_noi_status={?}&d-6461645-ps=10&d-6461645-p=1&d-6461645-fn_discipline=Quality";
				$construct_dash_conop_qaqc_rfi = $srcPrefix."mrsb/_/mrsbRfi_crud?d-6461654-fn_package_id=".$packageIdConOp."&d-6461654-fn_project_id=".$projectIdConOp."&d-6461654-fn_year={?}&d-6461654-fn_month={?}";
				$construct_dash_conop_qaqc_mos = $srcPrefix."mrsb/_/mrsbMs_crudDashboard?d-5237925-fn_package_id=".$packageIdConOp."&d-5237925-fn_project_id=".$projectIdConOp."&d-5237925-fn_submission_date={?}&d-5237925-fn_submission_date={?}&d-5237925-fn_approval_status={?}&no_approval_status_flag={?}"; 
				$construct_dash_conop_qaqc_ms = $srcPrefix."mrsb/_/mrsbMa_crudDashboard?d-5119827-fn_package_id=".$packageIdConOp."&d-5119827-fn_project_id=".$projectIdConOp."&d-5119827-fn_submission_date={?}&d-5119827-fn_submission_date={?}&d-5119827-fn_approval_status={?}&no_approval_status_flag={?}";
				$construct_dash_conop_qaqc_wir = $srcPrefix."mrsb/_/mrsbWir_crud?d-6461717-fn_package_id=".$packageIdConOp."&d-6461717-fn_project_id=".$projectIdConOp."&d-6461717-fn_year={?}&d-6461717-fn_month={?}";
				$construct_dash_conop_rr = $srcPrefix."mrsb/_/mrsbRr_crud?d-7746267-fn_package_id=".$packageIdConOp."&d-7746267-fn_project_id=".$projectIdConOp."&d-7746267-fn_date_identified={?}&d-7746267-fn_date_identified={?}&d-7746267-fn_risk_status={?}";
				$construct_dash_conop_land_management = $srcPrefix."mrsb/_/mrsbLm_crud?d-7746244-fn_project_id=".$projectIdConopLand."&d-7746244-fn_month_timeline=&d-7746244-fn_year={?}&d-7746244-fn_month={?}";
				$construct_dash_conop_land_managementAiwiFoe = $srcPrefix."mrsb/_/mrsbLm_crud?d-7746244-fn_project_id=".$projectIdConopLand."&d-7746244-fn_month=&d-7746244-fn_year={?}&d-7746244-fn_month_timeline={?}";
				$construct_dash_conop_land_timeline = $srcPrefix."mrsb/_/mrsbLtd_crud?d-3302166-fn_project_id=".$projectIdConopLand."&d-3302166-fn_year={?}&d-3302166-fn_month={?}&d-3302166-fn_category={?}";
				
				break;

		}	

		$ret = array(
			// ConOp.js IniatiateConOp() - ConOp dataList
			'construct_list_NCR' => $construct_list_NCR,
			'construct_list_WIR' => $construct_list_WIR,
			'construct_list_RFI' => $construct_list_RFI,
			'construct_list_MOS' => $construct_list_MOS,
			'construct_list_MS' => $construct_list_MS,
			'construct_list_IR' => $construct_list_IR,
			'construct_list_SDL' => $construct_list_SDL,
			'construct_list_SD' => $construct_list_SD,
			'construct_list_SA' => $construct_list_SA,
			'construct_list_SMH' => $construct_list_SMH,
			'construct_list_PTW' => $construct_list_PTW,
			'construct_list_CAR' => $construct_list_CAR,
			'construct_list_NOI' => $construct_list_NOI,
			'construct_list_PUBC' => $construct_list_PUBC,
			'construct_list_EVNT' => $construct_list_EVNT,
			'construct_list_LTD' => $construct_list_LTD,
			'construct_list_LM' => $construct_list_LM,
			'construct_list_RR' => $construct_list_RR,
			'construct_list_RROverall' => $construct_list_RROverall,
			'construct_list_RRSection' => $construct_list_RRSection,
			//for dashboard to open link
			'construct_dash_conop_sdl' => $construct_dash_conop_sdl,
			'construct_dash_conop_ra_overall' => $construct_dash_conop_ra_overall,
			'construct_dash_conop_ra_section' => $construct_dash_conop_ra_section,
			'construct_dash_conop_evnt' => $construct_dash_conop_evnt,
			'construct_dash_conop_pubc' => $construct_dash_conop_pubc,
			'construct_dash_conop_sa' => $construct_dash_conop_sa,
			'construct_dash_conop_smh' => $construct_dash_conop_smh,
			'construct_dash_conop_inc' => $construct_dash_conop_inc,
			'construct_dash_conop_ncr' => $construct_dash_conop_ncr,
			'construct_dash_conop_ms' => $construct_dash_conop_ms,
			'construct_dash_conop_ma' => $construct_dash_conop_ma,
			'construct_dash_conop_qaqc_ncr' => $construct_dash_conop_qaqc_ncr,
			'construct_dash_conop_qaqc_noi' => $construct_dash_conop_qaqc_noi,
			'construct_dash_conop_qaqc_rfi' => $construct_dash_conop_qaqc_rfi,
			'construct_dash_conop_qaqc_mos' => $construct_dash_conop_qaqc_mos,
			'construct_dash_conop_qaqc_ms' => $construct_dash_conop_qaqc_ms,
			'construct_dash_conop_qaqc_wir' => $construct_dash_conop_qaqc_wir,
			'construct_dash_conop_rr' => $construct_dash_conop_rr,
			'construct_dash_conop_qaqc_ncr_card' => $construct_dash_conop_qaqc_ncr_card,
			'construct_list_PPU' => $construct_list_PPU,
			'construct_dash_conop_land_management' => $construct_dash_conop_land_management,
			'construct_dash_conop_land_managementAiwiFoe' => $construct_dash_conop_land_managementAiwiFoe,
			'construct_dash_conop_land_timeline' => $construct_dash_conop_land_timeline
		);

		return $ret;
	}

	public function constructForm(){
		$srcPrefix = $this->getConstructAppSrcPrefix();
		$sDate = "";
		$eDate = "";

		if(isset($_SESSION['start_date'])){
			$mydate = explode("/", $_SESSION['start_date']);
			$eDate = $mydate[2];
		}else{
			$mydate = null;
			$eDate = null;
		}

		if(isset($_SESSION['end_date'])){
			$mydate1 = explode("/", $_SESSION['end_date']);
			$sDate = $mydate1[2];
		}else{
			$mydate1 = null;
			$eDate = null;
		}

		$construct_issue_SA = "";
		$construct_issue_SMH = "";
		// assetWiseGuiProject.js line 2312 full path
		$construct_issue_NCR = "";
		$construct_issue_MS = "";
		$construct_issue_RFI = "";
		$construct_issue_IR = "";
		$construct_issue_MOS = "";
		$construct_issue_WIR = "";
		$construct_issue_SD = "";
		$construct_issue_SDL = "";
		$construct_issue_PTW ="";
		$construct_issue_CAR ="";
		$construct_issue_RR ="";
		$construct_issue_NOI ="";
		$construct_issue_PUBC ="";
		$construct_issue_EVNT ="";
		$construct_issue_LTD ="";
		$construct_issue_LM ="";
		$construct_issue_RROverall ="";
		$construct_issue_RRSection ="";
		$construct_issue_MAU = "";

		$construct_manage_SA = "";
		$construct_statistics_SA = "";
		$construct_manage_SMH = "";
		$construct_statistics_SMH = "";
		$construct_manage_NCR = "";
		$construct_manage_NOI = "";
		$construct_manage_MS = "";
		$construct_manage_RFI = "";
		$construct_manage_IR = "";
		$construct_manage_MOS = "";
		$construct_manage_WIR = "";
		$construct_manage_SD = "";
		$construct_manage_SDL = "";
		$construct_manage_PTW = "";
		$construct_manage_PTW = "";
		$construct_manage_CAR = "";
		$construct_manage_PUBC = "";
		$construct_manage_EVNT = "";
		$construct_manage_LTD = "";
		$construct_manage_LM = "";
		$construct_manage_RR = "";
		$construct_manage_RROverall = "";
		$construct_manage_RRSection = "";
		$construct_manage_MAU = "";

		$construct_setup_NCR = "";
		$construct_setup_trade_NCR = "";
		$construct_setup_section_NCR = "";	
		$construct_setup_area_RR = "";
		$construct_setup_owner_RR = "";
		$construct_setup_projectimpact_RR = "";
		$construct_source_RR = "";
		$construct_setup_projectid_RR = "";
		$construct_setup_control_RR = "";
		$construct_setup_status_RR = "";
		$construct_setup_WPC = "";
		$construct_setup_INC_Category ="";
		$construct_setup_packageid_RR = "";
		$construct_setup_PUBC = "";
		$construct_setup_EVNT = "";
		$construct_setup_discipline = "";	
		$construct_setup_entity = "";	
		$construct_setup_subdiscipline = "";	
		$construct_setup_classif = "";	
		$construct_setup_section_LTD = "";	
		$construct_setup_section_LM = "";
		$construct_setup_section_CTD = "";

		$construct_view_MAU = "";

		//for Project Progress
		$construct_issue_PPU = $srcPrefix."projectprogress/_/newProjectProgress?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name."&owner_org_id=".$this->owner_org;
		
		$empty ="";

		switch ($this->owner_org) {
			case 'KACC':
				
				$construct_issue_SA = $srcPrefix."kacc/_/kaccSaCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_SMH = $srcPrefix."kacc/_/kaccSmhCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
		
				// assetWiseGuiProject.js line 2312 full path
				$construct_issue_NCR = $srcPrefix. "kacc/_/kaccNcrCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_MS = $srcPrefix. "kacc/_/kaccMaCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_RFI = $srcPrefix. "kacc/_/kaccRfiCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_IR = $srcPrefix. "kacc/_/kaccIncCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_MOS = $srcPrefix. "kacc/_/kaccMsCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_WIR = $srcPrefix. "kacc/_/kaccWirCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name;
				$construct_issue_SD = $srcPrefix. "kacc/_/kaccSiCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_SDL = $srcPrefix. "kacc/_/kaccSdCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_PTW = $srcPrefix. "kacc/_/kaccPtwCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name;
				$construct_issue_CAR = $srcPrefix. "kacc/_/kaccCarCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_MAU = $srcPrefix. "kacc/_/kaccMauCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;

				//for modify forms .. display the list of records
				$construct_manage_SA =  $srcPrefix. "kacc/_/kaccSaForm_crud?d-6507675-fn_package_id=".$this->project_id;
				$construct_statistics_SA = $srcPrefix. "kacc/_/kaccSaForm_crud_statistics?d-7300143-fn_package_id=".$this->project_id;
				$construct_manage_SMH =  $srcPrefix. "kacc/_/kaccSmhForm_crud?d-2750469-fn_package_id=".$this->project_id;
				$construct_statistics_SMH = $srcPrefix. "kacc/_/kaccSmhForm_crud_statistics?d-5135649-fn_package_id=".$this->project_id;
				$construct_manage_NCR =  $srcPrefix. "kacc/_/kaccNcrForm_crud?d-2745204-fn_package_id=".$this->project_id;
				$construct_manage_MS =  $srcPrefix. "kacc/_/kaccMaForm_crud?d-6506217-fn_package_id=".$this->project_id;
				$construct_manage_RFI =  $srcPrefix. "kacc/_/kaccRfiForm_crud?d-2748120-fn_package_id=".$this->project_id;
				$construct_manage_IR =  $srcPrefix. "kacc/_/kaccIncForm_crud?d-2743017-fn_package_id=".$this->project_id;
				$construct_manage_MOS =  $srcPrefix. "kacc/_/kaccMsForm_crud?d-6507675-fn_package_id=".$this->project_id;
				$construct_manage_WIR =  $srcPrefix. "kacc/_/kaccWirForm_crud?d-2753223-fn_package_id=".$this->project_id;
				$construct_manage_SD =  $srcPrefix. "kacc/_/kaccSiForm_crud?d-6508323-fn_package_id=".$this->project_id;
				$construct_manage_SDL =  $srcPrefix. "kacc/_/kaccSdForm_crud?d-6507918-fn_package_id=".$this->project_id;
				$construct_setup_NCR = $srcPrefix. "kacc/_/kaccNcrCategory_crud"; //there is no filter by project id as the set up is available for all projects
				$construct_setup_INC_Category = $srcPrefix. "kacc/_/kaccIncCat_crud"; //there is no filter by project id as the set up is available for all projects
				$construct_manage_PTW =  $srcPrefix. "kacc/_/kaccPtwForm_crud?d-2751198-fn_package_id=".$this->project_id;
				$construct_manage_CAR =  $srcPrefix. "kacc/_/kaccCarForm_crud?d-2736699-fn_package_id=".$this->project_id;
				$construct_manage_MAU =  $srcPrefix. "kacc/_/kaccMauForm_crud?d-6454748-fn_package_id=".$this->project_id;

				$construct_view_MAU =  $srcPrefix. "kacc/_/kaccMauForm_crud?_mode=edit&noback=1&id=";
				break;

			case 'MRSB':
				// issuance
				//  Material Submission = MA = MT ************
				// Method Statement = MOS = MS **************
				$construct_issue_RR = $srcPrefix. "mrsb/_/mrsbRrCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_SMH = $srcPrefix."mrsb/_/mrsbSmhCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&sDate=". $sDate."&edate=". $eDate;
				$construct_issue_SA = $srcPrefix."mrsb/_/mrsbSaCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&sDate=". $sDate."&edate=". $eDate;
				$construct_issue_SDL = $srcPrefix. "mrsb/_/mrsbSdCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name."&sDate=". $sDate."&edate=". $eDate;
				$construct_issue_IR = $srcPrefix. "mrsb/_/mrsbIncCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_NOI = $srcPrefix. "mrsb/_/mrsbNoiCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_RROverall = $srcPrefix. "mrsb/_/mrsbRaCreate?project_id=".$this->parent_project_id; //overall is parent project so only need parent id
				$construct_issue_RRSection = $srcPrefix. "mrsb/_/mrsbRasCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_WIR = $srcPrefix. "mrsb/_/mrsbWirCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name."&sDate=". $sDate."&edate=". $eDate;
				$construct_issue_NCR = $srcPrefix. "mrsb/_/mrsbNcrCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name;
				$construct_issue_SD = $srcPrefix. "mrsb/_/mrsbSiCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id;
				$construct_issue_MOS = $srcPrefix. "mrsb/_/mrsbMsCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name;
				$construct_issue_MS = $srcPrefix. "mrsb/_/mrsbMaCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name;
				$construct_issue_RFI = $srcPrefix. "mrsb/_/mrsbRfiCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name;
				$construct_issue_PUBC = $srcPrefix. "mrsb/_/mrsbPbcCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name;
				$construct_issue_EVNT = $srcPrefix. "mrsb/_/mrsbEvtCreate?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&package_name=".$this->project_name;
				// Land is for project level and not at package - data to be entered /managed at any of the pacakages
				$construct_issue_LTD = $srcPrefix. "mrsb/_/mrsbLtdCreateNew?&project_id=".$this->parent_project_id;
				$construct_issue_LM = $srcPrefix. "mrsb/_/mrsbLmCreateNew?&project_id=".$this->parent_project_id;

				// manage
				$construct_manage_RR = $srcPrefix. "mrsb/_/mrsbRrForm_crud?d-6693975-fn_package_id=".$this->project_id."&d-6693975-fn_project_id=".$this->parent_project_id."&d-6693975-fn_ref_no=".$empty."&d-6693975-fn_risk=".$empty."&d-6693975-fn_risk_area=".$empty."&d-6693975-fn_risk_owner=".$empty."&d-6693975-fn_risk_status=".$empty."&d-6693975-fn_project_impact=".$empty."&d-6693975-fn_risk_source=".$empty;
				$construct_manage_SMH =  $srcPrefix. "mrsb/_/mrsbSmhForm_crud?d-3305967-fn_package_id=".$this->project_id."&d-3305967-fn_year=".$empty."&d-3305967-fn_month=".$empty;
				$construct_manage_SA =  $srcPrefix. "mrsb/_/mrsbSaForm_crud?d-6692841-fn_package_id=".$this->project_id."&d-6692841-fn_year=".$empty."&d-6692841-fn_month=".$empty;
				$construct_manage_SDL =  $srcPrefix. "mrsb/_/mrsbSdForm_crud?d-6693084-fn_package_id=".$this->project_id."&d-6693084-fn_ref_no=".$empty."&d-6693084-fn_year=".$empty."&d-6693084-fn_month=".$empty."&d-6693084-fn_day_date=".$empty;
				$construct_manage_IR =  $srcPrefix. "mrsb/_/mrsbIncForm_crud?d-3298515-fn_package_id=".$this->project_id."&d-3298515-fn_project_id=".$this->parent_project_id."&d-3298515-fn_incident_category=".$empty."&d-3298515-fn_ref_no=".$empty."&d-3298515-fn_incident_date=".$empty;
				$construct_manage_RROverall = $srcPrefix. "mrsb/_/mrsbRaForm_crud?d-6692598-fn_project_id=".$this->parent_project_id."&d-6692598-fn_month=".$empty."&d-6692598-fn_year=".$empty;
				$construct_manage_RRSection = $srcPrefix. "mrsb/_/mrsbRasForm_crud?d-3303213-fn_package_id=".$this->project_id."&d-3303213-fn_month=".$empty."&d-3303213-fn_year=".$empty;
				$construct_manage_WIR =  $srcPrefix. "mrsb/_/mrsbWirForm_crud?d-3308721-fn_package_id=".$this->project_id."&d-3308721-fn_year=".$empty."&d-3308721-fn_month=".$empty;
				$construct_manage_NOI =  $srcPrefix. "mrsb/_/mrsbNoiForm_crud?d-3302889-fn_package_id=".$this->project_id."&d-3302889-fn_ref_no=".$empty."&d-3302889-fn_date_issued=".$empty."&d-3302889-fn_issued_by=".$empty."&d-3302889-fn_issued_to=".$empty."&d-3302889-fn_discipline=".$empty."&d-3302889-fn_noi_status=".$empty;
				$construct_manage_NCR =  $srcPrefix. "mrsb/_/mrsbNcrForm_crud?d-3300702-fn_package_id=".$this->project_id."&d-3300702-fn_project_id=".$this->parent_project_id."&d-3300702-fn_project_title=".$empty."&d-3300702-fn_project_code=".$empty."&d-3300702-fn_discipline=".$empty."&d-3300702-fn_ref_no=".$empty."&d-3300702-fn_date_issued=".$empty."&d-3300702-fn_issued_to=".$empty."&d-3300702-fn_discipline_code=".$empty."&d-3300702-fn_description=".$empty."&d-3300702-fn_ncr_status=".$empty."&d-3300702-fn_ncr_ageing=".$empty;
				$construct_manage_SD =  $srcPrefix. "mrsb/_/mrsbSiForm_crud?d-6693489-fn_package_id=".$this->project_id."&d-6693489-fn_ref_no=".$empty."&d-6693489-fn_subject=".$empty;
				$construct_manage_MOS =  $srcPrefix. "mrsb/_/mrsbMsForm_crud?d-6692841-fn_package_id=".$this->project_id."&d-6692841-fn_ref_no=".$empty."&d-6692841-fn_submission_type=".$empty."&d-6692841-fn_section=".$empty;
				$construct_manage_MS =  $srcPrefix. "mrsb/_/mrsbMaForm_crud?d-6691383-fn_package_id=".$this->project_id."&d-6691383-fn_ref_no=".$empty."&d-6691383-fn_submission_date=".$empty."&d-6691383-fn_section=".$empty."&d-6691383-fn_submission_type=".$empty."&d-6691383-fn_manufacturer=".$empty;
				$construct_manage_RFI =  $srcPrefix. "mrsb/_/mrsbRfiForm_crud?d-3303618-fn_package_id=".$this->project_id."&d-3303618-fn_section=".$empty."&d-3303618-fn_year=".$empty."&d-3303618-fn_month=".$empty;
				$construct_manage_PUBC = $srcPrefix. "mrsb/_/mrsbPbcForm_crud?d-3300702-fn_package_id=".$this->project_id."&d-3300702-fn_year=".$empty."&d-3300702-fn_month=".$empty."&d-3300702-fn_category=".$empty;
				$construct_manage_EVNT = $srcPrefix. "mrsb/_/mrsbEvtForm_crud?d-3298920-fn_package_id=".$this->project_id."&d-3298920-fn_month=".$empty."&d-3298920-fn_year=".$empty."&d-3298920-fn_category=".$empty;
				// Land is for project level and not at package - data to be entered /managed at any of the pacakages
				$construct_manage_LTD = $srcPrefix. "mrsb/_/mrsbLtdForm_crud_new?project_id=".$this->parent_project_id;
				$construct_manage_LM = $srcPrefix. "mrsb/_/mrsbLmForm_crud_new?project_id=".$this->parent_project_id."&month=".$empty."&year=".$empty;
				
				// setup
				$construct_setup_area_RR = $srcPrefix. "mrsb/_/mrsbRrArea_crud?d-5366195-fn_project_id=".$this->parent_project_id; 
				$construct_setup_owner_RR = $srcPrefix. "mrsb/_/mrsbRrOwner_crud?d-7711453-fn_project_id=".$this->parent_project_id; 
				$construct_setup_projectimpact_RR = $srcPrefix. "mrsb/_/mrsbRrProjectImpact_crud?d-4248340-fn_project_id=".$this->parent_project_id; 
				$construct_source_RR = $srcPrefix. "mrsb/_/mrsbRrSource_crud?d-6357829-fn_project_id=".$this->parent_project_id; 
				$construct_setup_packageid_RR = $srcPrefix. "mrsb/_/mrsbRrPackage_crud?d-4580459-fn_project_id=".$this->parent_project_id; 
				$construct_setup_control_RR = $srcPrefix. "mrsb/_/mrsbRrControl_crud?d-2284367-fn_project_id=".$this->parent_project_id;
				$construct_setup_status_RR = $srcPrefix. "mrsb/_/mrsbRrStatus_crud?d-1529153-fn_project_id=".$this->parent_project_id;
				$construct_setup_WPC =  $srcPrefix. "mrsb/_/mrsbWpc_crud?d-7298778-fn_project_id=".$this->parent_project_id;
				$construct_setup_INC_Category = $srcPrefix."mrsb/_/mrsbIncCat_crud?d-5168795-fn_project_id=".$this->parent_project_id;
				$construct_setup_PUBC = $srcPrefix."mrsb/_/mrsbPbcCat_crud?d-3884348-fn_project_id=".$this->parent_project_id; 
				$construct_setup_EVNT = $srcPrefix."mrsb/_/mrsbEvtCat_crud?d-581254-fn_project_id=".$this->parent_project_id; 
				$construct_setup_trade_NCR = $srcPrefix."mrsb/_/mrsbTrade_crud?d-7824053-fn_project_id=".$this->parent_project_id;
				$construct_setup_section_NCR = $srcPrefix."mrsb/_/mrsbConstSection_crud?package_id=".$this->project_id."&d-3304798-fn_project_id=".$this->parent_project_id;
				$construct_setup_discipline = $srcPrefix."mrsb/_/mrsbConstDiscipline_crud?d-5098467-fn_project_id=".$this->parent_project_id;
				$construct_setup_entity = $srcPrefix."mrsb/_/mrsbConstEntity_crud?d-6691698-fn_project_id=".$this->parent_project_id;
				$construct_setup_subdiscipline = $srcPrefix."mrsb/_/mrsbConstSubDiscipline_crud?d-3537373-fn_project_id=".$this->parent_project_id;
				$construct_setup_classif = $srcPrefix."mrsb/_/mrsbConstClassification_crud?d-8218085-fn_project_id=".$this->parent_project_id;
				// Land is for project level and not at package - data to be entered /managed at any of the pacakages
				$construct_setup_section_LTD = $srcPrefix."mrsb/_/mrsbLandSection_crud?d-7172055-fn_project_id=".$this->parent_project_id;
				$construct_setup_section_LM = $srcPrefix."mrsb/_/mrsbLandWtg_crud?d-3299028-fn_project_id=".$this->parent_project_id;
				$construct_setup_section_CTD = $srcPrefix."mrsb/_/mrsbLmrCtd_crud?d-6692901-fn_project_id=".$this->parent_project_id;

				break;
		}	

		$ret = array(
			'construct_issue_SA' => $construct_issue_SA,
			'construct_issue_SMH' => $construct_issue_SMH,
			'construct_issue_NCR' => $construct_issue_NCR,
			'construct_issue_MS' => $construct_issue_MS,
			'construct_issue_RFI' => $construct_issue_RFI,
			'construct_issue_IR' => $construct_issue_IR,
			'construct_issue_MOS' => $construct_issue_MOS,
			'construct_issue_WIR' => $construct_issue_WIR,
			'construct_issue_SD' => $construct_issue_SD,
			'construct_issue_SDL'=> $construct_issue_SDL,
			'construct_issue_PTW'=> $construct_issue_PTW,
			'construct_issue_CAR'=> $construct_issue_CAR,
			'construct_issue_RR'=> $construct_issue_RR,
			'construct_issue_NOI'=> $construct_issue_NOI,
			'construct_issue_RROverall' => $construct_issue_RROverall,
			'construct_issue_RRSection' => $construct_issue_RRSection,
			'construct_issue_PUBC' => $construct_issue_PUBC,
			'construct_issue_EVNT' => $construct_issue_EVNT,
			'construct_issue_LTD' => $construct_issue_LTD,
			'construct_issue_LM' => $construct_issue_LM,
			'construct_issue_MAU' => $construct_issue_MAU,
			'construct_manage_SA' => $construct_manage_SA,
			'construct_statistics_SA' => $construct_statistics_SA,
			'construct_manage_SMH' => $construct_manage_SMH,
			'construct_statistics_SMH' => $construct_statistics_SMH,
			'construct_manage_NCR' => $construct_manage_NCR,
			'construct_manage_MS' => $construct_manage_MS,
			'construct_manage_RFI' => $construct_manage_RFI,
			'construct_manage_IR' => $construct_manage_IR,
			'construct_manage_MOS' => $construct_manage_MOS,
			'construct_manage_WIR' => $construct_manage_WIR,
			'construct_manage_SD' => $construct_manage_SD,
			'construct_manage_SDL'=> $construct_manage_SDL,
			'construct_setup_NCR'=> $construct_setup_NCR,
			'construct_setup_PUBC'=> $construct_setup_PUBC,
			'construct_setup_EVNT'=> $construct_setup_EVNT,
			'construct_manage_PTW' =>$construct_manage_PTW,
			'construct_manage_CAR'=>$construct_manage_CAR,
			'construct_manage_RR'=>$construct_manage_RR,
			'construct_manage_RROverall' => $construct_manage_RROverall,
			'construct_manage_RRSection' => $construct_manage_RRSection,
			'construct_setup_area_RR' => $construct_setup_area_RR,
			'construct_setup_owner_RR' => $construct_setup_owner_RR,
			'construct_setup_projectimpact_RR' => $construct_setup_projectimpact_RR,
			'construct_source_RR' => $construct_source_RR,
			'construct_setup_packageid_RR' => $construct_setup_packageid_RR,
			'construct_setup_control_RR' => $construct_setup_control_RR,
			'construct_setup_status_RR' => $construct_setup_status_RR,
			'construct_setup_INC_Category' => $construct_setup_INC_Category,
			'construct_setup_WPC' => $construct_setup_WPC,
			'construct_manage_NOI' => $construct_manage_NOI,
			'construct_manage_PUBC' => $construct_manage_PUBC,
			'construct_manage_EVNT' => $construct_manage_EVNT,
			'construct_manage_LTD' => $construct_manage_LTD,
			'construct_manage_LM' => $construct_manage_LM,
			'construct_manage_MAU' => $construct_manage_MAU,
			'construct_setup_trade_NCR' => $construct_setup_trade_NCR,
			'construct_setup_section_NCR' => $construct_setup_section_NCR,
			'construct_setup_discipline'=> $construct_setup_discipline,	
			'construct_setup_entity' => $construct_setup_entity,
			'construct_setup_subdiscipline' => $construct_setup_subdiscipline,
			'construct_setup_classif' => $construct_setup_classif,
			'construct_setup_section_LTD' => $construct_setup_section_LTD,
			'construct_setup_section_LM' => $construct_setup_section_LM,
			'construct_setup_section_CTD' => $construct_setup_section_CTD,
			'construct_view_MAU' => $construct_view_MAU,
			'construct_issue_PPU' => $construct_issue_PPU
		);
		return $ret;
	}
	
	private function getDocAppJsonSrcPrefix(){
		$srcPrefix = $this->jogetHost."jw/web/json/data/list/".$this->documentApp."/";	
		return $srcPrefix;	
	}

	private function documentJson(){
		$srcPrefix = $this->getDocAppJsonSrcPrefix();

		$document_json_noti = "";
		$document_json_noti_check = "";
		$document_json_corr_list = "";
		$document_json_doc_list = "";
		$document_json_project_info_list = "";

		//dashboard
		$document_dash_doc_list = "";
		$document_dash_corr_list = "";
		$document_dash_corr_list_opt = "";
		$document_dash_list_section = "";
		$document_dash_project_info = "";
		$document_list_section = "";

		// progress uploader
		$document_list_section = "";
		switch ($this->owner_org) {
			case 'KACC':
				switch($this->project_id){
					case 'projectInformation':
						$document_json_doc_list = $srcPrefix."list_pimDocForm?d-6664815-fn_project_id=".$this->project_id."&rows=9999";
						break;
					case 'eLibrary':
						$document_json_doc_list = $srcPrefix."list_libDocForm?d-6562026-fn_project_id=".$this->project_id."&rows=9999";
						break;
					default:
						$document_json_noti = $srcPrefix."list_kaccCorrInbox?start=0&rows=5&d-7891553-fn_package_id=".$this->project_id."&d-7891553-fn_kacc_action_user.to=".$this->user_email;
						$document_json_corr_list = $srcPrefix."list_kaccCorrForm?d-8222857-fn_package_id=".$this->project_id;
						$document_json_doc_list = $srcPrefix."list_kaccDocAll?d-6505514-fn_package_id=".$this->project_id."&d-6505514-fn_project_id=".$this->parent_project_id."&rows=9999";
						$document_json_project_info_list = $srcPrefix."list_kaccProjectInfo?d-4723118-fn_package_id=".$this->project_id;
						// dashboard - with cut off date
						$document_dash_doc_list = $srcPrefix."list_kaccDocAll?d-6505514-fn_package_id={?}&d-6505514-fn_project_id={?}";
						$document_dash_corr_list = $srcPrefix."list_kaccCorrForm?d-8222857-fn_package_id={?}&d-8222857-fn_project_id={?}";
						$document_dash_corr_list_opt = $srcPrefix."list_kaccCorrForm_opt?package_id={?}&project_id={?}&cut_off_day={?}";

						$document_dash_list_section = $srcPrefix."list_kaccSection?d-2749300-fn_package_id={?}&d-2749300-fn_project_id={?}";

						// progress uploader
						$document_list_section = $srcPrefix."list_kaccSection?d-2749300-fn_package_id=".$this->project_id;
						break;
				};
				break;

			case 'MRSB':
				$document_json_noti = $srcPrefix."list_mrsbCorrInbox?start=0&rows=5&d-4502427-fn_package_id=".$this->project_id."&d-4502427-fn_mrsb_action_user.to=".$this->user_email;
				$document_json_corr_list = $srcPrefix."list_mrsbCorrForm?d-1500743-fn_package_id=".$this->project_id;
				$document_json_doc_list = $srcPrefix."list_mrsbDocFormAll?d-5082988-fn_package_id=".$this->project_id."&d-5082988-fn_project_id=".$this->parent_project_id."&rows=9999";
				
				$document_dash_doc_list = $srcPrefix."list_mrsbDocFormAll?d-5082988-fn_package_id={?}&d-5082988-fn_project_id={?}";
				$document_dash_corr_list = $srcPrefix."list_mrsbCorrForm?d-1500743-fn_package_id={?}&d-1500743-fn_project_id={?}";
				$document_dash_list_section = $srcPrefix."list_mrsbSection?d-3304798-fn_package_id={?}&d-3304798-fn_project_id={?}";

				break;

			case 'UTSB':
				$document_json_noti = $srcPrefix."list_utsbCorrInbox?start=0&rows=5&d-719641-fn_package_id=".$this->project_id."&d-719641-fn_utsb_action_user.to=".$this->user_email;
				$document_json_noti_check = $document_json_noti."&d-719641-fn_utsb_action_user.id=";
				$document_json_corr_list = $srcPrefix."list_utsbCorrForm?d-3036017-fn_package_id=".$this->project_id;
				$document_json_doc_list = $srcPrefix."list_utsbDocForm?d-3806871-fn_package_id=".$this->project_id."&rows=9999";
				$document_json_project_info_list = $srcPrefix."list_utsbProjectInfo?d-7284774-fn_package_id=".$this->project_id;

				// dashboard
				$document_dash_doc_list = $srcPrefix."list_utsbDocForm?d-3806871-fn_package_id=";
				$document_dash_corr_list = $srcPrefix."list_utsbCorrForm?d-3036017-fn_package_id=";
				$document_dash_project_info = $srcPrefix."list_utsbProjectInfo?d-7284774-fn_package_id=";
				break;	
		}
		
		$ret = array(
			'document_json_noti' => $document_json_noti,
			'document_json_noti_check' => $document_json_noti_check,
			'document_json_corr_list' => $document_json_corr_list,
			'document_json_doc_list' =>  $document_json_doc_list,
			'document_dash_doc_list' => $document_dash_doc_list,
			'document_dash_corr_list' => $document_dash_corr_list,
			'document_dash_corr_list_opt' => $document_dash_corr_list_opt,
			'document_json_project_info_list' => $document_json_project_info_list,
			'document_list_section' => $document_list_section,
			'document_dash_list_section' => $document_dash_list_section,
			'document_dash_project_info' => $document_dash_project_info
		);

		return $ret;
	}

	public function getDocumentAppLink(){
		$ret = array(
			'dataList' => $this->documentDatalist(),
			'form' => $this->documentForm(),
			'api' => $this->documentJson()
		);
		return $ret;
	}

	private function getDocAppSrcPrefix(){
		$srcPrefix = $this->jogetHost."jw/web/embed/userview/".$this->documentApp."/";	
		return $srcPrefix;	
	}
	private function getDocumentAppSrcRoleStatus(){ //for KACC
		$drawing_list ="";
		$empty = "";
		switch($this->user_role){
			case "Doc Controller":
				$drawing_list = "kacc/_/kaccDwg_crud?d-2741883-fn_package_id=".$this->project_id."&d-2741883-fn_project_id=".$this->parent_project_id."&d-2741883-fn_ref_no=".$empty."&d-2741883-fn_title=".$empty."&d-2741883-fn_drawing_type=".$empty."&d-2741883-fn_trait=".$empty."&d-2741883-fn_dateCreated=".$empty;
				break;
			default :
				$drawing_list = "kacc/_/kaccDwgView_crud?d-2742232-fn_package_id=".$this->project_id."&d-2742232-fn_project_id=".$this->parent_project_id."&d-2742232-fn_ref_no=".$empty."&d-2742232-fn_title=".$empty."&d-2742232-fn_drawing_type=".$empty."&d-2742232-fn_trait=".$empty."&d-2742232-fn_dateCreated=".$empty;
				break;
		}
		
		$ret = array(
			'drawing_list' => $drawing_list
		);
		return $ret;	
	}

	private function getDocumentAppSrcRoleStatusMRSB(){ //for MRSB
		$drawing_list ="";
		$empty = "";
		switch($this->user_role){
			case "Doc Controller":
				$drawing_list = "mrsb/_/mrsbDwg_crud?d-7045011-fn_c_package_id=".$this->project_id."&d-7045011-fn_c_project_id=".$this->parent_project_id."&d-7045011-fn_c_work_sec_contract_no=".$empty."&d-7045011-fn_c_discipline=".$empty."&d-7045011-fn_c_volume=".$empty."&d-7045011-fn_c_drawing_type=".$empty. "&d-7045011-fn_c_section=".$empty . "&d-7045011-fn_c_ref_no=" . $empty . "&d-7045011-fn_c_revision_no=" . $empty . "&d-7045011-fn_c_title=" . $empty . "&d-7045011-fn_c_created_date=" . $empty . "&d-7045011-fn_filter_keywords=" . $empty . "&d-7045011-fn_c_document_date=" . $empty;
				break;
			default :
				$drawing_list = "mrsb/_/mrsbDwgView_crud?d-7073280-fn_c_package_id=".$this->project_id."&d-7073280-fn_c_project_id=".$this->parent_project_id."&d-7073280-fn_c_work_sec_contract_no=".$empty."&d-7073280-fn_c_discipline=".$empty."&d-7073280-fn_c_volume=".$empty."&d-7073280-fn_c_drawing_type=".$empty. "&d-7073280-fn_c_section=".$empty."&d-7073280-fn_c_ref_no=".$empty. "&d-7073280-fn_c_revision_no=" . $empty . "&d-7073280-fn_c_title=" . $empty . "&d-7073280-fn_c_created_date=" . $empty . "&d-7073280-fn_filter_keywords=" . $empty . "&d-7073280-fn_c_document_date=" . $empty;
				break;
		}
		
		$ret = array(
			'drawing_list' => $drawing_list
		);
		return $ret;	
	}

	public function documentDatalist(){
		$srcPrefix = $this->getDocAppSrcPrefix();
		$srcUrl = $this->getDocumentAppSrcRoleStatus();
		$jsonPrefix = $this->getDocAppJsonSrcPrefix();

		$document_open = "";
		$document_open_normal = "";
		$document_all = "";
		$document_drawing = "";
		$document_restricted = "";
		$document_confidential = "";
		$document_archived = "";
		$document_corr_list_all = "";
		$document_corr_list_incoming= "";
		$document_corr_list_outgoing= "";
		$document_corr_list_incoming_conf= "";
		$document_corr_list_outgoing_conf= "";
		$document_corr_list_dismiss_notif = ""; //mrsb
		$document_corr_list_dismiss_notif_utsb = ""; //utsb
		$document_corr_inbox = "";
		
		$document_setup_type = "";
		$document_setup_work_discipline = "";
		$document_setup_section = "";
		$document_setup_entity = "";
		$document_setup_volume = "";
		$document_setup_distribution_group = "";
		$document_setup_distribution_matrix = "";
		$document_setup_distribution_group_utsb = "";
		$document_setup_distribution_matrix_utsb = "";
		$markup_review_list = "";
		$markup_list_review = "";
		$empty = "";

		// dashboard linking to conOp
		$document_dash_doc_all = "";
		$document_dash_doc_rev = "";
		$document_dash_corr_all = "";
		$document_dash_corr_all_toRespond = "";
		$document_dash_corr_all_forInfo = "";
		$document_dash_corr_all_toRespond_respond = "";
		$document_dash_corr_all_toRespond_closed = "";
		$document_dash_corr_all_forInfo_respond = "";
		$document_dash_corr_all_forInfo_closed = "";
		$document_dash_corr_all_toRespond_pending = "";
		$document_dash_corr_all_forInfo_pending = "";
		$document_corr_list_card = "";
		$document_archived_card = "";
		$document_drawing_card = "";
		$document_dash_corr_all_not_pending = '';
		$document_dash_corr_all_pie = "";

		// need to handle link between parent and package
		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->project_id;
			$packageIdConOp = '{?}';
		}else{
			$projectIdConOp = $this->parent_project_id;
			$packageIdConOp = $this->project_id;
		}

		switch ($this->owner_org) {
			case 'KACC':
				// document
				switch($this->project_id){
					
					case 'projectInformation':
						$document_all = $srcPrefix."pim/_/pimDocForm_crud?d-6664815-fn_project_id=".$this->project_id."&d-6664815-fn_ref_no=".$empty."&d-6664815-fn_title=".$empty."&d-6664815-fn_type=".$empty."&d-6664815-fn_dateCreated=".$empty; 
						$document_open = $srcPrefix."pim/_/pimDocNormal_crud?d-1265422-fn_project_id=".$this->project_id."&d-1265422-fn_ref_no=".$empty."&d-1265422-fn_title=".$empty."&d-1265422-fn_type=".$empty."&d-1265422-fn_dateCreated=".$empty;
						$document_open_normal = $srcPrefix."pim/_/pimDocNormal_crud?d-1265422-fn_project_id=".$this->project_id."&d-1265422-fn_ref_no=".$empty."&d-1265422-fn_title=".$empty."&d-1265422-fn_type=".$empty."&d-1265422-fn_dateCreated=".$empty;
						$document_restricted = $srcPrefix."pim/_/pimDocRestricted_crud?d-1864306-fn_project_id=".$this->project_id."&d-1864306-fn_ref_no=".$empty."&d-1864306-fn_title=".$empty."&d-1864306-fn_type=".$empty."&d-1864306-fn_dateCreated=".$empty; 
						$document_confidential = $srcPrefix."pim/_/pimDocConfidential_crud?d-6110683-fn_project_id=".$this->project_id."&d-6110683-fn_ref_no=".$empty."&d-6110683-fn_title=".$empty."&d-6110683-fn_type=".$empty."&d-6110683-fn_dateCreated=".$empty; 
						// setup
						$document_setup_type = $srcPrefix."pim/_/pimDocType_crud?d-6665269-fn_project_id=".$this->project_id; 
						break;
					case 'eLibrary':
						$document_all = $srcPrefix."lib/_/libDocForm_crud?d-6562026-fn_project_id=".$this->project_id."&d-6562026-fn_title=".$empty."&d-6562026-fn_type=".$empty."&d-6562026-fn_dateCreated=".$empty; 
						$document_open = $srcPrefix."lib/_/libDocNormal_crud?d-340321-fn_project_id=".$this->project_id."&d-340321-fn_title=".$empty."&d-340321-fn_type=".$empty."&d-340321-fn_dateCreated=".$empty;
						$document_open_normal = $srcPrefix."lib/_/libDocNormal_crud?d-340321-fn_project_id=".$this->project_id."&d-340321-fn_title=".$empty."&d-340321-fn_type=".$empty."&d-340321-fn_dateCreated=".$empty;
						$document_restricted = $srcPrefix."lib/_/libDocRestricted_crud?d-2428597-fn_project_id=".$this->project_id."&d-2428597-fn_title=".$empty."&d-2428597-fn_type=".$empty."&d-2428597-fn_dateCreated=".$empty;
						$document_confidential = $srcPrefix."lib/_/libDocConfidential_crud?d-2800694-fn_project_id=".$this->project_id."&d-2800694-fn_title=".$empty."&d-2800694-fn_type=".$empty."&d-2800694-fn_dateCreated=".$empty;
						// setup
						$document_setup_type = $srcPrefix."lib/_/libDocType_crud?d-6562480-fn_project_id=".$this->project_id;
						break;
					default:
						$document_open = $srcPrefix."kacc/_/kaccDocNormal?d-7881662-fn_package_id=".$this->project_id."&d-7881662-fn_ref_no=".$empty."&d-7881662-fn_title=".$empty."&d-7881662-fn_document_type=".$empty."&d-7881662-fn_dateCreated=".$empty; //pacakge id is current project id
						$document_open_normal = $srcPrefix."kacc/_/kaccDocNormal?d-7881662-fn_package_id=".$this->project_id."&d-7881662-fn_ref_no=".$empty."&d-7881662-fn_title=".$empty."&d-7881662-fn_document_type=".$empty."&d-7881662-fn_dateCreated=".$empty; //pacakge id is current project id
						$document_all = $srcPrefix."kacc/_/kaccDocForm_crud?d-2739615-fn_package_id=".$this->project_id."&d-2739615-fn_ref_no=".$empty."&d-2739615-fn_title=".$empty."&d-2739615-fn_document_type=".$empty."&d-2739615-fn_dateCreated=".$empty; //pacakge id is current project id
						$document_restricted = $srcPrefix."kacc/_/kaccDocRestricted?d-908834-fn_package_id=".$this->project_id."&d-908834-fn_ref_no=".$empty."&d-908834-fn_title=".$empty."&d-908834-fn_document_type=".$empty."&d-908834-fn_dateCreated=".$empty; //pacakge id is current project id
						$document_confidential = $srcPrefix."kacc/_/kaccDocConfidential?d-5900043-fn_package_id=".$this->project_id."&d-5900043-fn_ref_no=".$empty."&d-5900043-fn_title=".$empty."&d-5900043-fn_document_type=".$empty."&d-5900043-fn_dateCreated=".$empty; //pacakge id is current project id
						$document_archived = $srcPrefix."kacc/_/kaccDocArchived_crud?d-3796509-fn_package_id=".$this->project_id."&d-3796509-fn_project_id=".$this->parent_project_id."&d-3796509-fn_ref_no=".$empty."&d-3796509-fn_title=".$empty."&d-3796509-fn_drawing_type=".$empty."&d-3796509-fn_dateCreated=".$empty."&d-3796509-fn_trait=".$empty; //pacakge id is current project id
						$document_drawing = $srcPrefix.$srcUrl['drawing_list'];
						
						// correspondence
						$document_corr_inbox = $srcPrefix."kacc/_/kaccCorrCustomInbox?d-7891553-fn_package_id=".$this->project_id."&d-7891553-fn_kacc_action_user.to=".$this->user_email;
						$document_corr_list_all = $srcPrefix."kacc/_/kaccCorrForm_crud?d-6897156-fn_package_id=".$this->project_id."&d-6897156-fn_doc_date=".$empty."&d-6897156-fn_corr_type=".$empty."&d-6897156-fn_status=".$empty."&d-6897156-fn_ext_ref_no=".$empty."&d-6897156-fn_int_ref_no=".$empty."&d-6897156-fn_reciever_sender=".$empty."&d-6897156-fn_subject=".$empty."&d-6897156-fn_dateCreated=".$empty; //pacakge id is current project id
						$document_corr_list_incoming = $srcPrefix."kacc/_/kaccCorrInc_crud?d-7891416-fn_package_id=".$this->project_id."&d-7891416-fn_status=".$empty."&d-7891416-fn_ext_ref_no=".$empty."&d-7891416-fn_int_ref_no=".$empty."&d-7891416-fn_reciever_sender=".$empty."&d-7891416-fn_subject=".$empty."&d-7891416-fn_dateCreated=".$empty; //pacakge id is current project id
						if(strpos($this->parent_project_name, 'HQ') === false){
							$document_corr_list_outgoing = $srcPrefix."kacc/_/kaccCorrOut_crud?d-7892244-fn_package_id=".$this->project_id."&d-7892244-fn_status=".$empty."&d-7892244-fn_ext_ref_no=".$empty."&d-7892244-fn_int_ref_no=".$empty."&d-7892244-fn_reciever_sender=".$empty."&d-7892244-fn_subject=".$empty."&d-7892244-fn_dateCreated=".$empty; //pacakge id is current project id
						}else{
							$document_corr_list_outgoing = $srcPrefix."kacc/_/kaccCorrOutSite_crud?package_id=".$this->project_id."&d-1741191-fn_status=".$empty."&d-1741191-fn_ext_ref_no=".$empty."&d-1741191-fn_int_ref_no=".$empty."&d-1741191-fn_reciever_sender=".$empty."&d-1741191-fn_subject=".$empty."&d-1741191-fn_dateCreated=".$empty; //pacakge id is current project id
						}
						// setup
						$document_setup_type = $srcPrefix."kacc/_/kaccDocType_crud?d-2740069-fn_project_id=".$this->parent_project_id; //filter is based on parent id 
						$document_setup_work_discipline = $srcPrefix."kacc/_/kaccWorkDisc_crud?d-8265915-fn_project_id=".$this->parent_project_id; //filter is based on parent id 
						$document_setup_section = $srcPrefix."kacc/_/kaccSection_crud?d-2749300-fn_package_id=".$this->project_id."&project_id=".$this->parent_project_id; //filter is based on parent id 
						
						//review markup
						$markup_review_list = $srcPrefix."kacc/_/kaccMarkupForm_crud?d-6595155-fn_project_id=".$this->parent_project_id."&d-6595155-fn_package_id=".$this->project_id;
						$markup_list_review = $jsonPrefix."list_markupForm?d-6595155-fn_project_id=".$this->parent_project_id."&d-6595155-fn_package_id=".$this->project_id;
						//dashboard card 
						
						$document_corr_list_card = $srcPrefix."kacc/_/kaccCorrDashboard?d-1633571-fn_project_id=".$projectIdConOp."&d-1633571-fn_package_id=".$packageIdConOp."&d-1633571-fn_doc_date={?}&d-1633571-fn_doc_date={?}&d-1633571-fn_corr_type={?}&d-1633571-fn_reciever_sender={?}&d-1633571-fn_card_status={?}&d-1633571-fn_card_status={?}"; 
						$document_drawing_card = $srcPrefix."kacc/_/kaccDwgDashboard?d-2205928-fn_project_id=".$projectIdConOp."&d-2205928-fn_package_id=".$packageIdConOp."&d-2205928-fn_doc_date={?}&d-2205928-fn_doc_date={?}&d-2205928-fn_revision_status={?}&d-2205928-fn_drawing_type={?}&d-2205928-fn_trait={?}";
						$document_archived_card = $srcPrefix."kacc/_/docAll?d-6505514-fn_project_id=".$projectIdConOp."&d-6505514-fn_package_id=".$packageIdConOp."&d-6505514-fn_ref_no=".$empty."&d-6505514-fn_title=".$empty."&d-6505514-fn_document_type=".$empty."&d-6505514-fn_dateCreated=".$empty."&d-6505514-fn_doc_date={?}&d-6505514-fn_doc_date={?}&d-6505514-fn_archiving_year={?}"; 
						break;
				}
			break;

			case 'MRSB':
				// document
				$srcMRSBUrl = $this->getDocumentAppSrcRoleStatusMRSB();
				$empty = "";
				$document_open = $srcPrefix."mrsb/_/mrsbDocNormal?d-4492536-fn_package_id=".$this->project_id."&d-4492536-fn_project_id=".$this->parent_project_id."&d-4492536-fn_document_type=".$empty."&d-4492536-fn_ref_no=".$empty."&d-4492536-fn_title=".$empty."&d-4492536-fn_created_date=".$empty."&d-4492536-fn_document_date=".$empty."&d-4492536-fn_section=".$empty; //pacakge id is current project id
				$document_open_normal = $srcPrefix."mrsb/_/mrsbDocNormal?d-4492536-fn_package_id=".$this->project_id."&d-4492536-fn_project_id=".$this->parent_project_id."&d-4492536-fn_document_type=".$empty."&d-4492536-fn_ref_no=".$empty."&d-4492536-fn_title=".$empty."&d-4492536-fn_created_date=".$empty."&d-4492536-fn_document_date=".$empty."&d-4492536-fn_section=".$empty; //pacakge id is current project id
				$document_all = $srcPrefix."mrsb/_/mrsbDocForm_crud?d-3295113-fn_package_id=".$this->project_id."&d-3295113-fn_project_id=".$this->parent_project_id."&d-3295113-fn_document_type=".$empty."&d-3295113-fn_ref_no=".$empty."&d-3295113-fn_title=".$empty."&d-3295113-fn_created_date=".$empty."&d-3295113-fn_document_date=".$empty."&d-3295113-fn_section=".$empty; //pacakge id is current project id
				$document_restricted = $srcPrefix."mrsb/_/mrsbDocLimited?d-5085821-fn_package_id=".$this->project_id."&d-5085821-fn_project_id=".$this->parent_project_id."&d-5085821-fn_document_type=".$empty."&d-5085821-fn_ref_no=".$empty."&d-5085821-fn_title=".$empty."&d-5085821-fn_dateCreated=".$empty."&d-5085821-fn_document_date=".$empty."&d-5085821-fn_section=".$empty; //pacakge id is current project id
				$document_confidential = $srcPrefix."mrsb/_/mrsbDocConfidential?d-1477941-fn_package_id=".$this->project_id."&d-1477941-fn_project_id=".$this->parent_project_id."&d-1477941-fn_document_type=".$empty."&d-1477941-fn_ref_no=".$empty."&d-1477941-fn_title=".$empty."&d-1477941-fn_created_date=".$empty."&d-1477941-fn_document_date=".$empty."&d-1477941-fn_section=".$empty; //pacakge id is current project id
				$document_archived = $srcPrefix."mrsb/_/mrsbDocArchived_crud?d-6848807-fn_package_id=".$this->project_id."&d-6848807-fn_project_id=".$this->parent_project_id."&d-6848807-fn_document_type=".$empty."&d-6848807-fn_ref_no=".$empty."&d-6848807-fn_title=".$empty."&d-6848807-fn_created_date=".$empty."&d-6848807-fn_document_date=".$empty. "&d-6848807-fn_section=".$empty; //pacakge id is current project id
				$document_drawing = $srcPrefix.$srcMRSBUrl['drawing_list']; //setting empty for other filters in the function itself.

				// correspondence
				$document_corr_inbox = $srcPrefix."mrsb/_/mrsbCorrCustomInbox?d-4502427-fn_mrsb_action_user.to=".$this->user_email."&d-4502427-fn_package_id=".$this->project_id;
				$document_corr_list_all = $srcPrefix."mrsb/_/mrsbCorrForm_crud?d-1500743-fn_package_id=".$this->project_id."&d-1500743-fn_project_id=".$this->parent_project_id."&d-1500743-fn_type=".$empty."&d-1500743-fn_status=".$empty."&d-1500743-fn_correspondence_type=".$empty."&d-1500743-fn_int_ref_no=".$empty."&d-1500743-fn_ext_ref_no=".$empty."&d-1500743-fn_subject=".$empty."&d-1500743-fn_year=".$empty."&d-1500743-fn_received_date=".$empty."&d-1500743-fn_letter_date=".$empty."&d-1500743-fn_dateCreated=".$empty. "&d-1500743-fn_section=".$empty; //pacakge id is current project id
				$document_corr_list_incoming = $srcPrefix."mrsb/_/mrsbCorrInc_crud?d-3296423-fn_package_id=".$this->project_id."&d-3296423-fn_project_id=".$this->parent_project_id."&d-3296423-fn_status=".$empty."&d-3296423-fn_correspondence_type=".$empty."&d-3296423-fn_int_ref_no=".$empty."&d-3296423-fn_ext_ref_no=".$empty."&d-3296423-fn_subject=".$empty."&d-3296423-fn_year=".$empty."&d-3296423-fn_received_date=".$empty."&d-3296423-fn_letter_date=".$empty."&d-3296423-fn_dateCreated=".$empty. "&d-3296423-fn_section=".$empty;  //pacakge id is current project id
				$document_corr_list_outgoing = $srcPrefix."mrsb/_/mrsbCorrOut_crud?d-3296515-fn_package_id=".$this->project_id."&d-3296515-fn_project_id=".$this->parent_project_id."&d-3296515-fn_status=".$empty."&d-3296515-fn_correspondence_type=".$empty."&d-3296515-fn_int_ref_no=".$empty."&d-3296515-fn_ext_ref_no=".$empty."&d-3296515-fn_subject=".$empty."&d-3296515-fn_year=".$empty."&d-3296515-fn_received_date=".$empty."&d-3296515-fn_letter_date=".$empty."&d-3296515-fn_dateCreated=".$empty. "&d-3296515-fn_section=".$empty; //pacakge id is current project id
				$document_corr_list_incoming_conf = $srcPrefix."mrsb/_/mrsbCorrIncCon_crud?d-7427535-fn_package_id=".$this->project_id."&d-7427535-fn_project_id=".$this->parent_project_id."&d-7427535-fn_status=".$empty."&d-7427535-fn_correspondence_type=".$empty."&d-7427535-fn_int_ref_no=".$empty."&d-7427535-fn_ext_ref_no=".$empty."&d-7427535-fn_subject=".$empty."&d-7427535-fn_year=".$empty."&d-7427535-fn_received_date=".$empty."&d-7427535-fn_letter_date=".$empty."&d-7427535-fn_dateCreated=".$empty. "&d-7427535-fn_section=".$empty;  //pacakge id is current project id
				$document_corr_list_outgoing_conf = $srcPrefix."mrsb/_/mrsbCorrOutCon_crud?d-5988459-fn_package_id=".$this->project_id."&d-5988459-fn_project_id=".$this->parent_project_id."&d-5988459-fn_status=".$empty."&d-5988459-fn_correspondence_type=".$empty."&d-5988459-fn_int_ref_no=".$empty."&d-5988459-fn_ext_ref_no=".$empty."&d-5988459-fn_subject=".$empty."&d-5988459-fn_year=".$empty."&d-5988459-fn_received_date=".$empty."&d-5988459-fn_letter_date=".$empty."&d-5988459-fn_dateCreated=".$empty. "&d-5988459-fn_section=".$empty; //pacakge id is current project id
				$document_corr_list_dismiss_notif = $srcPrefix."mrsb/_/mrsbCorrDismissNotif_crud?d-5812794-fn_au_to=".$this->user_email."&d-5812794-fn_package_id=".$this->project_id."&d-5812794-fn_project_id=".$this->parent_project_id."&d-5812794-fn_status=".$empty."&d-5812794-fn_correspondence_type=".$empty."&d-5812794-fn_int_ref_no=".$empty."&d-5812794-fn_ext_ref_no=".$empty."&d-5812794-fn_subject=".$empty."&d-5812794-fn_year=".$empty."&d-5812794-fn_received_date=".$empty."&d-5812794-fn_letter_date=".$empty."&d-5812794-fn_dateCreated=".$empty. "&d-5812794-fn_section=".$empty; //pacakge id is current project id

				// setup
				$document_setup_type = $srcPrefix."mrsb/_/mrsbDocType_crud?d-3295567-fn_project_id=".$this->parent_project_id."&d-3295567-fn_desc_doc_01=".$empty; //filter is based on parent id 
				$document_setup_work_discipline = $srcPrefix."mrsb/_/mrsbDiscipline_crud?d-5098467-fn_project_id=".$this->parent_project_id; //filter is based on parent id 
				$document_setup_section = $srcPrefix."mrsb/_/mrsbSection_crud?d-3304798-fn_project_id=".$this->parent_project_id."&package_id=".$this->project_id; //filter is based on parent id 
				$document_setup_entity = $srcPrefix."mrsb/_/mrsbEntity_crud?d-6691698-fn_project_id=".$this->parent_project_id."&d-6691698-fn_entity_type=".$empty; //filter is based on parent id 
				$document_setup_volume = $srcPrefix."mrsb/_/mrsbDrawingVol_crud?d-5132272-fn_project_id=".$this->parent_project_id; //filter is based on parent id 
				$document_setup_distribution_group= $srcPrefix."mrsb/_/mrsbGroupCreate_crud?project_id=".$this->parent_project_id."&d-7268784-fn_package_id=".$this->project_id; //filter is based on parent id 
				$document_setup_distribution_matrix= $srcPrefix."mrsb/_/mrsbDistMatrix_crud?project_id=".$this->parent_project_id."&d-5103142-fn_package_id=".$this->project_id; //filter is based on parent id 

				//review markup
				$markup_review_list = $srcPrefix."mrsb/_/mrsbMarkupForm_crud?d-6595155-fn_project_id=".$this->parent_project_id."&d-6595155-fn_package_id=".$this->project_id;
				$markup_list_review = $jsonPrefix."list_markupForm?d-6595155-fn_project_id=".$this->parent_project_id."&d-6595155-fn_package_id=".$this->project_id;

				//dashboard linking
				$document_dash_doc_all = $srcPrefix."mrsb/_/mrsbDocDashboard_crud?d-3762723-fn_package_id=".$packageIdConOp."&d-3762723-fn_project_id=".$projectIdConOp."&d-3762723-fn_ref_no=".$empty."&d-3762723-fn_title=".$empty."&d-3762723-fn_created_date=".$empty."&d-3762723-fn_document_date=".$empty."&d-3762723-fn_document_type={?}&d-3762723-fn_section={?}&d-3762723-fn_drawing_type={?}&d-3762723-fn_discipline={?}&d-3762723-p=1&d-3762723-ps=10";
				$document_dash_doc_rev = $srcPrefix."mrsb/_/mrsbDocDashboard_crud_rev?d-931384-fn_c_package_id=".$packageIdConOp."&d-931384-fn_c_project_id=".$projectIdConOp."&d-931384-fn_c_ref_no=".$empty."&d-931384-fn_c_title=".$empty."&d-931384-fn_c_created_date=".$empty."&d-931384-fn_c_document_date=".$empty."&d-931384-fn_c_document_type={?}&d-931384-fn_c_section={?}&d-931384-fn_c_drawing_type={?}&d-931384-fn_c_discipline={?}&d-931384-fn-p=1&d-931384-fn-ps=10";
				$document_dash_corr_all = $srcPrefix."mrsb/_/mrsbCorrDashboard_crud?d-3938429-fn_package_id=".$packageIdConOp."&d-3938429-fn_project_id=".$projectIdConOp."&d-3938429-fn_type={?}&d-3938429-fn_section={?}&d-3938429-fn_purpose={?}&d-3938429-fn_status={?}&d-3938429-fn_correspondence_type={?}&d-3938429-fn_int_ref_no=".$empty."&d-3938429-fn_ext_ref_no=".$empty."&d-3938429-fn_subject=".$empty."&d-3938429-fn_year=".$empty."&d-3938429-fn_received_date=".$empty."&d-3938429-fn_letter_date=".$empty."&d-3938429-fn_dateCreated=".$empty."&d-3938429-p=1&d-3938429-ps=10";
				$document_dash_corr_all_toRespond = $srcPrefix."mrsb/_/mrsbCorrDashboard_crud?d-3938429-fn_package_id=".$packageIdConOp."&d-3938429-fn_project_id=".$projectIdConOp."&d-3938429-fn_type={?}&d-3938429-fn_section={?}&d-3938429-fn_purpose=For%20Approval&d-3938429-fn_purpose=For%20Review&d-3938429-fn_purpose=For%20Comment&d-3938429-fn_correspondence_type={?}&d-3938429-fn_int_ref_no=".$empty."&d-3938429-fn_ext_ref_no=".$empty."&d-3938429-fn_subject=".$empty."&d-3938429-fn_year=".$empty."&d-3938429-fn_received_date=".$empty."&d-3938429-fn_letter_date=".$empty."&d-3938429-fn_dateCreated=".$empty."&d-3938429-fn_status=".$empty."&d-3938429-p=1&d-3938429-ps=10";
				$document_dash_corr_all_forInfo = $srcPrefix."mrsb/_/mrsbCorrDashboard_crud?d-3938429-fn_package_id=".$packageIdConOp."&d-3938429-fn_project_id=".$projectIdConOp."&d-3938429-fn_type={?}&d-3938429-fn_section={?}&d-3938429-fn_purpose=For%20Information&d-3938429-fn_purpose=For%20Implementation&d-3938429-fn_purpose=For%20Construction&d-3938429-fn_purpose=For%20Copy&d-3938429-fn_purpose=As%20requested&d-3938429-fn_purpose=Others&d-3938429-fn_status=".$empty."&d-3938429-fn_correspondence_type={?}&d-3938429-fn_int_ref_no=".$empty."&d-3938429-fn_ext_ref_no=".$empty."&d-3938429-fn_subject=".$empty."&d-3938429-fn_year=".$empty."&d-3938429-fn_received_date=".$empty."&d-3938429-fn_letter_date=".$empty."&d-3938429-fn_dateCreated=".$empty."&d-3938429-p=1&d-3938429-ps=10";
				$document_dash_corr_all_toRespond_respond = $srcPrefix."mrsb/_/mrsbCorrDashboard_crud?d-3938429-fn_package_id=".$packageIdConOp."&d-3938429-fn_project_id=".$projectIdConOp."&d-3938429-fn_type={?}&d-3938429-fn_section={?}&d-3938429-fn_purpose=For%20Approval&d-3938429-fn_purpose=For%20Review&d-3938429-fn_purpose=For%20Comment&d-3938429-fn_status=Responded&d-3938429-fn_correspondence_type={?}&d-3938429-fn_int_ref_no=".$empty."&d-3938429-fn_ext_ref_no=".$empty."&d-3938429-fn_subject=".$empty."&d-3938429-fn_year=".$empty."&d-3938429-fn_received_date=".$empty."&d-3938429-fn_letter_date=".$empty."&d-3938429-fn_dateCreated=".$empty."&d-3938429-p=1&d-3938429-ps=10";
				$document_dash_corr_all_toRespond_closed = $srcPrefix."mrsb/_/mrsbCorrDashboard_crud?d-3938429-fn_package_id=".$packageIdConOp."&d-3938429-fn_project_id=".$projectIdConOp."&d-3938429-fn_type={?}&d-3938429-fn_section={?}&d-3938429-fn_purpose=For%20Approval&d-3938429-fn_purpose=For%20Review&d-3938429-fn_purpose=For%20Comment&d-3938429-fn_status=Closed&d-3938429-fn_correspondence_type={?}&d-3938429-fn_int_ref_no=".$empty."&d-3938429-fn_ext_ref_no=".$empty."&d-3938429-fn_subject=".$empty."&d-3938429-fn_year=".$empty."&d-3938429-fn_received_date=".$empty."&d-3938429-fn_letter_date=".$empty."&d-3938429-fn_dateCreated=".$empty."&d-3938429-p=1&d-3938429-ps=10";
				$document_dash_corr_all_forInfo_respond = $srcPrefix."mrsb/_/mrsbCorrDashboard_crud?d-3938429-fn_package_id=".$packageIdConOp."&d-3938429-fn_project_id=".$projectIdConOp."&d-3938429-fn_type={?}&d-3938429-fn_section={?}&d-3938429-fn_purpose=For%20Information&d-3938429-fn_purpose=For%20Implementation&d-3938429-fn_purpose=For%20Construction&d-3938429-fn_purpose=For%20Copy&d-3938429-fn_purpose=As%20requested&d-3938429-fn_purpose=Others&d-3938429-fn_status=Responded&d-3938429-fn_correspondence_type={?}&d-3938429-fn_int_ref_no=".$empty."&d-3938429-fn_ext_ref_no=".$empty."&d-3938429-fn_subject=".$empty."&d-3938429-fn_year=".$empty."&d-3938429-fn_received_date=".$empty."&d-3938429-fn_letter_date=".$empty."&d-3938429-fn_dateCreated=".$empty."&d-3938429-p=1&d-3938429-ps=10";
				$document_dash_corr_all_forInfo_closed = $srcPrefix."mrsb/_/mrsbCorrDashboard_crud?d-3938429-fn_package_id=".$packageIdConOp."&d-3938429-fn_project_id=".$projectIdConOp."&d-3938429-fn_type={?}&d-3938429-fn_section={?}&d-3938429-fn_purpose=For%20Information&d-3938429-fn_purpose=For%20Implementation&d-3938429-fn_purpose=For%20Construction&d-3938429-fn_purpose=For%20Copy&d-3938429-fn_purpose=As%20requested&d-3938429-fn_purpose=Others&d-3938429-fn_status=Closed&d-3938429-fn_correspondence_type={?}&d-3938429-fn_int_ref_no=".$empty."&d-3938429-fn_ext_ref_no=".$empty."&d-3938429-fn_subject=".$empty."&d-3938429-fn_year=".$empty."&d-3938429-fn_received_date=".$empty."&d-3938429-fn_letter_date=".$empty."&d-3938429-fn_dateCreated=".$empty."&d-3938429-p=1&d-3938429-ps=10";
				$document_dash_corr_all_toRespond_pending = $srcPrefix."mrsb/_/mrsbCorrDashboard_crud?d-3938429-fn_package_id=".$packageIdConOp."&d-3938429-fn_project_id=".$projectIdConOp."&d-3938429-fn_type={?}&d-3938429-fn_section={?}&d-3938429-fn_purpose=For%20Approval&d-3938429-fn_purpose=For%20Review&d-3938429-fn_purpose=For%20Comment&d-3938429-fn_status=Pending&d-3938429-fn_correspondence_type={?}&d-3938429-fn_int_ref_no=".$empty."&d-3938429-fn_ext_ref_no=".$empty."&d-3938429-fn_subject=".$empty."&d-3938429-fn_year=".$empty."&d-3938429-fn_received_date=".$empty."&d-3938429-fn_letter_date=".$empty."&d-3938429-fn_dateCreated=".$empty."&d-3938429-p=1&d-3938429-ps=10";
				$document_dash_corr_all_forInfo_pending = $srcPrefix."mrsb/_/mrsbCorrDashboard_crud?d-3938429-fn_package_id=".$packageIdConOp."&d-3938429-fn_project_id=".$projectIdConOp."&d-3938429-fn_type={?}&d-3938429-fn_section={?}&d-3938429-fn_purpose=For%20Information&d-3938429-fn_purpose=For%20Implementation&d-3938429-fn_purpose=For%20Construction&d-3938429-fn_purpose=For%20Copy&d-3938429-fn_purpose=As%20requested&d-3938429-fn_purpose=Others&d-3938429-fn_status=Pending&d-3938429-fn_correspondence_type={?}&d-3938429-fn_int_ref_no=".$empty."&d-3938429-fn_ext_ref_no=".$empty."&d-3938429-fn_subject=".$empty."&d-3938429-fn_year=".$empty."&d-3938429-fn_received_date=".$empty."&d-3938429-fn_letter_date=".$empty."&d-3938429-fn_dateCreated=".$empty."&d-3938429-p=1&d-3938429-ps=10";
				
				break;

			case 'UTSB':
				// document
				$document_open = $srcPrefix."utsb/_/utsbDocNormal?d-709750-fn_package_id=".$this->project_id; //pacakge id is current project id
				$document_open_normal = $srcPrefix."utsb/_/utsbDocNormal?d-709750-fn_package_id=".$this->project_id; //pacakge id is current project id
				$document_all = $srcPrefix."utsb/_/utsbDocForm_crud?d-3806871-fn_package_id=".$this->project_id; //pacakge id is current project id
				$document_restricted = $srcPrefix."utsb/_/utsbDocRestricted?d-7186522-fn_package_id=".$this->project_id; //pacakge id is current project id
				$document_confidential = $srcPrefix."utsb/_/utsbDocConfidential?d-3678979-fn_package_id=".$this->project_id; //pacakge id is current project id
				
				// correspondence
				$document_corr_inbox = $srcPrefix."utsb/_/utsbCorrCustomInbox?d-719641-fn_package_id=".$this->project_id."&d-719641-fn_utsb_action_user.to=".$this->user_email;
				$document_corr_list_all = $srcPrefix."utsb/_/utsbCorrForm_crud?d-3036017-fn_package_id=".$this->project_id; //pacakge id is current project id
				$document_corr_list_incoming = $srcPrefix."utsb/_/utsbCorrInc_crud?d-3808181-fn_package_id=".$this->project_id; //pacakge id is current project id
				$document_corr_list_outgoing = $srcPrefix."utsb/_/utsbCorrOut_crud?d-3808273-fn_package_id=".$this->project_id; //pacakge id is current project id
				$document_corr_list_dismiss_notif_utsb = $srcPrefix."utsb/_/utsbCorrDismissNotif_crud?d-2202932-fn_package_id=".$this->project_id."&d-2202932-fn_utsb_action_user.to=".$this->user_email;
				// setup
				$document_setup_type = $srcPrefix."utsb/_/utsbDocType_crud?d-3807325-fn_project_id=".$this->parent_project_id; //filter is based on parent id 
				$document_setup_work_discipline = $srcPrefix."utsb/_/utsbDisciplineForm_crud?d-5467257-fn_project_id=".$this->parent_project_id; ///filter is based on parent id 
				$document_setup_distribution_group_utsb= $srcPrefix."utsb/_/utsbGroupCreate_crud?project_id=".$this->parent_project_id."&d-6778142-fn_package_id=".$this->project_id; //filter is based on parent id 
				$document_setup_distribution_matrix_utsb= $srcPrefix."utsb/_/utsbDistMatrix_crud?project_id=".$this->parent_project_id."&d-2143392-fn_package_id=".$this->project_id; //filter is based on parent id 

				//review markup
				$markup_review_list = $srcPrefix."utsb/_/utsbMarkupForm_crud?d-6595155-fn_project_id=".$this->parent_project_id."&d-6595155-fn_package_id=".$this->project_id;
				$markup_list_review = $jsonPrefix."list_markupForm?d-6595155-fn_project_id=".$this->parent_project_id."&d-6595155-fn_package_id=".$this->project_id;
				
				//dashboard linking
				$document_dash_doc_all = $srcPrefix."utsb/_/utsbDocDashboard?d-7084002-fn_package_id=".$packageIdConOp."&d-7084002-fn_project_id=".$projectIdConOp."&d-7084002-fn_document_type={?}";
				$document_dash_corr_all = $srcPrefix."utsb/_/utsbCorrDashboard?d-4474922-fn_package_id=".$packageIdConOp."&d-4474922-fn_project_id=".$projectIdConOp."&d-4474922-fn_type={?}&d-4474922-fn_purpose={?}&d-4474922-fn_category={?}&d-4474922-fn_status={?}&d-4474922-fn_id={?}";
				$document_dash_corr_all_not_pending = $srcPrefix."utsb/_/utsbCorrDashboard?d-4474922-fn_package_id=".$packageIdConOp."&d-4474922-fn_project_id=".$projectIdConOp."&d-4474922-fn_type={?}&d-4474922-fn_purpose={?}&d-4474922-fn_category={?}&d-4474922-fn_status=Responded&d-4474922-fn_status=Closed";
				$document_dash_corr_all_pie = $srcPrefix."utsb/_/utsbCorrDashboardPie?d-3383518-fn_package_id=".$packageIdConOp."&d-3383518-fn_project_id=".$projectIdConOp."&d-3383518-fn_type={?}&d-3383518-fn_purpose={?}&d-3383518-fn_category={?}&d-3383518-fn_status={?}&d-3383518-fn_correspondence_type={?}";

				break;	

			case 'KURW':
				// document
				$document_open = $srcPrefix."documentOpen_crud?d-8011580-fn_Project=".$this->project_id;
				$document_open_normal = $srcPrefix."documentOpen_crud?d-8011580-fn_Project=".$this->project_id;
				$document_all = $srcPrefix."document_crud?d-2584378-fn_Project=".$this->project_id;
				$document_restricted = $srcPrefix."documentRestricted_crud?d-2032849-fn_Project=".$this->project_id;
				$document_confidential = $srcPrefix."documentConfidential_crud?d-7627570-fn_Project=".$this->project_id;
				
				// correspondence
				
				$document_corr_inbox = $srcPrefix."correspondence_custom_inbox?d-8154704-fn_Project=".$this->project_id;
				$document_corr_list_all = $srcPrefix."correspondence_crud?d-5823169-fn_Project=".$this->project_id;
				$document_corr_list_incoming = $srcPrefix."correspondence_crud?d-5823169-fn_Project=".$this->project_id;
				$document_corr_list_outgoing = $srcPrefix."correspondence_crud?d-5823169-fn_Project=".$this->project_id;
				
				// setup
				$document_setup_type = $srcPrefix."lookupDocType_crud";
				$document_setup_work_discipline = $srcPrefix."lookupDocSubtype_crud";
				break;

			case 'OBYU':
				// document
				$document_open = $srcPrefix."documentOpen_crud?d-8011580-fn_Project=".$this->project_id;
				$document_open_normal = $srcPrefix."documentOpen_crud?d-8011580-fn_Project=".$this->project_id;
				$document_all = $srcPrefix."document_crud?d-2584378-fn_Project=".$this->project_id;
				$document_restricted = $srcPrefix."documentRestricted_crud?d-2032849-fn_Project=".$this->project_id;
				$document_confidential = $srcPrefix."documentConfidential_crud?d-7627570-fn_Project=".$this->project_id;
				
				// correspondence
				
				$document_corr_inbox = $srcPrefix."correspondence_custom_inbox?d-8154704-fn_Project=".$this->project_id;
				$document_corr_list_all = $srcPrefix."correspondence_crud?d-5823169-fn_Project=".$this->project_id;
				$document_corr_list_incoming = $srcPrefix."correspondence_crud?d-5823169-fn_Project=".$this->project_id;
				$document_corr_list_outgoing = $srcPrefix."correspondence_crud?d-5823169-fn_Project=".$this->project_id;
				
				// setup
				$document_setup_type = $srcPrefix."lookupDocType_crud";
				$document_setup_work_discipline = $srcPrefix."lookupDocSubtype_crud";
				break;

			case 'SHRFLD':
				// document
				$document_open = $srcPrefix."documentOpen_crud?d-8011580-fn_Project=".$this->project_id;
				$document_open_normal = $srcPrefix."documentOpen_crud?d-8011580-fn_Project=".$this->project_id;
				$document_all = $srcPrefix."document_crud?d-2584378-fn_Project=".$this->project_id;
				$document_restricted = $srcPrefix."documentRestricted_crud?d-2032849-fn_Project=".$this->project_id;
				$document_confidential = $srcPrefix."documentConfidential_crud?d-7627570-fn_Project=".$this->project_id;
				
				// correspondence
				
				$document_corr_inbox = $srcPrefix."correspondence_custom_inbox?d-8154704-fn_Project=".$this->project_id;
				$document_corr_list_all = $srcPrefix."correspondence_crud?d-5823169-fn_Project=".$this->project_id;
				$document_corr_list_incoming = $srcPrefix."correspondence_crud?d-5823169-fn_Project=".$this->project_id;
				$document_corr_list_outgoing = $srcPrefix."correspondence_crud?d-5823169-fn_Project=".$this->project_id;
				
				// setup
				$document_setup_type = $srcPrefix."lookupDocType_crud";
				$document_setup_work_discipline = $srcPrefix."lookupDocSubtype_crud";
				break;
		}
		
		$ret = array(
			'document_open' => $document_open,
			'document_open_normal' => $document_open_normal,
			'document_all' => $document_all,
			'document_drawing' => $document_drawing,
			'document_restricted' => $document_restricted,
			'document_confidential' => $document_confidential,
			'document_archived' => $document_archived,
			'document_corr_inbox' => $document_corr_inbox,
			'document_corr_list_all' => $document_corr_list_all,
			'document_corr_list_incoming' => $document_corr_list_incoming,
			'document_corr_list_outgoing' => $document_corr_list_outgoing,
			'document_corr_list_incoming_conf' => $document_corr_list_incoming_conf,
			'document_corr_list_outgoing_conf' => $document_corr_list_outgoing_conf,
			'document_corr_list_dismiss_notif' => $document_corr_list_dismiss_notif, //mrsb
			'document_corr_list_dismiss_notif_utsb' => $document_corr_list_dismiss_notif_utsb, //utsb
			'document_setup_type' => $document_setup_type,
			'document_setup_work_discipline' => $document_setup_work_discipline,
			'document_setup_section' => $document_setup_section,
			'document_setup_entity' => $document_setup_entity,
			'document_setup_volume' => $document_setup_volume,
			'document_setup_distribution_group' => $document_setup_distribution_group,
			'document_setup_distribution_matrix' => $document_setup_distribution_matrix,
			'document_setup_distribution_group_utsb' => $document_setup_distribution_group_utsb,
			'document_setup_distribution_matrix_utsb' => $document_setup_distribution_matrix_utsb,
			'markup_review_list' => $markup_review_list,
			'markup_list_review' => $markup_list_review,
			//dashboard linking
			'document_dash_doc_all' => $document_dash_doc_all,
			'document_dash_doc_rev' => $document_dash_doc_rev,
			'document_dash_corr_all' => $document_dash_corr_all,
			'document_dash_corr_all_toRespond' => $document_dash_corr_all_toRespond,
			'document_dash_corr_all_forInfo' => $document_dash_corr_all_forInfo,
			'document_dash_corr_all_toRespond_respond' => $document_dash_corr_all_toRespond_respond,
			'document_dash_corr_all_toRespond_closed' => $document_dash_corr_all_toRespond_closed,
			'document_dash_corr_all_forInfo_respond' => $document_dash_corr_all_forInfo_respond,
			'document_dash_corr_all_forInfo_closed' => $document_dash_corr_all_forInfo_closed,
			'document_dash_corr_all_toRespond_pending' => $document_dash_corr_all_toRespond_pending,
			'document_dash_corr_all_forInfo_pending' => $document_dash_corr_all_forInfo_pending,
			'document_archived_card' => $document_archived_card,
			'document_corr_list_card' => $document_corr_list_card,
			'document_drawing_card' => $document_drawing_card,
			'document_dash_corr_all_not_pending' => $document_dash_corr_all_not_pending,
			'document_dash_corr_all_pie' => $document_dash_corr_all_pie
		);

		return $ret;
	}

	public function documentForm(){
		$srcPrefix = $this->getDocAppSrcPrefix();

		$document_register = "";
		$document_bulk_upload = "";
		$document_register_edit = "";
		$document_register_view = "";
		$document_corr_register = "";
		$document_corr_inbox_res = "";
		$document_corr_view_incoming = "";
		$document_corr_view_outgoing = "";
		$document_project_info_register ="";
		$document_project_info_view ="";
		$document_project_info_edit = "";
		$document_corr_inbox_res_ack = "";
		$document_bulk_corr_register = "";
		
		//for 3D Markup Tools
		$markup_review_form = "";
		$start_date = isset($_SESSION['start_date']) ? $_SESSION['start_date'] : "";
		$end_date = isset($_SESSION['end_date']) ? $_SESSION['end_date'] : "";

		switch ($this->owner_org) {
			case 'KACC':
				switch($this->project_id){
					case 'projectInformation':
						$document_register = $srcPrefix."pim/_/pimDocCreate?project_id=".$this->project_id;
						$document_bulk_upload = $srcPrefix."pim/_/bulkImport";
						break;
					case 'eLibrary':
						$document_register = $srcPrefix."lib/_/libDocCreate?project_id=".$this->project_id;
						$document_bulk_upload = $srcPrefix. "lib/_/bulkImport";
						break;
					default:
						$document_register = $srcPrefix."kacc/_/kaccDocCreate?project_id=".$this->parent_project_id."&package_id=".$this->project_id;
						$document_bulk_upload = $srcPrefix."kacc/_/bulkImport?project_id=".$this->parent_project_id."&package_id=".$this->project_id;
						$document_corr_register = $srcPrefix."kacc/_/kacCorrCreate?project_id=".$this->parent_project_id."&package_id=".$this->project_id;
						$document_bulk_corr_register = $srcPrefix."kacc/_/bulkImportCorr";
						$document_corr_inbox_res = $srcPrefix."kacc/_/kaccCorrAction";
						$document_register_edit = $srcPrefix."kacc/_/kaccDocEdit";
						$document_register_view = $srcPrefix."kacc/_/kaccDocForm_crud";
						$document_corr_view_incoming = "";
						$document_corr_view_outgoing = "";

						//project info form
						$document_project_info_register = $srcPrefix."kacc/_/kaccProjectInfo?project_id=".$this->parent_project_id."&package_id=".$this->project_id."&project_name=".$_SESSION['project_name']."&start_date=".$start_date."&end_date=".$end_date;
						$document_project_info_view = $srcPrefix."kacc/_/kaccProjectInfoView?&_mode=edit&id=";//need to add the id of the record
						$document_project_info_edit = $srcPrefix."kacc/_/kaccProjectInfoEdit?&_mode=edit&id=";//need to add the id of the record

						$markup_review_form = $srcPrefix."kacc/_/kaccMarkupForm?project_id=".$this->parent_project_id."&package_id=".$this->project_id."&project_id_number=".$this->pid;
					break;
				}
				break;

			case 'MRSB':
				$document_register = $srcPrefix."mrsb/_/mrsbDocCreate?project_id=".$this->parent_project_id."&package_id=".$this->project_id;
				$document_bulk_upload = $srcPrefix."mrsb/_/bulkImport?project_id=".$this->parent_project_id."&package_id=".$this->project_id;
				$document_corr_register = $srcPrefix."mrsb/_/mrsbCorrCreate?project_id=".$this->parent_project_id."&package_id=".$this->project_id;
				if($this->parent_project_id == "NCH"){
					$document_bulk_corr_register = $srcPrefix."mrsb/_/bulkImportCorrNCH";
				}else{
					$document_bulk_corr_register = $srcPrefix."mrsb/_/bulkImportCorr";
				}
        		$document_corr_inbox_res = $srcPrefix."mrsb/_/mrsbCorrAction";
				$document_corr_view_incoming = $srcPrefix."mrsb/_/mrsbCorrInc_crud?_mode=edit&id=";
				$document_corr_view_outgoing = $srcPrefix."mrsb/_/mrsbCorrOut_crud?_mode=edit&id=";
				
				$markup_review_form = $srcPrefix."mrsb/_/mrsbMarkupForm?project_id=".$this->parent_project_id."&package_id=".$this->project_id."&project_id_number=".$this->pid;
				break;

			case 'UTSB':
				$document_register = $srcPrefix."utsb/_/utsbDocCreate?project_id=".$this->parent_project_id."&package_id=".$this->project_id;
				$document_bulk_upload = $srcPrefix."utsb/_/bulkImport?project_id=".$this->parent_project_id."&package_id=".$this->project_id;
				$document_corr_register = $srcPrefix."utsb/_/utsbCorrCreate?project_id=".$this->parent_project_id."&package_id=".$this->project_id;
				$document_bulk_corr_register = $srcPrefix."utsb/_/bulkImportCorr";
				$document_corr_inbox_res = $srcPrefix."utsb/_/utsbCorrAction";
				$document_corr_inbox_res_ack = $srcPrefix."utsb/_/utsbCorrActionAcknowledge";

				//get project manager information to pass to project information form
				$checkSql = "SELECT u.user_email FROM users u LEFT JOIN pro_usr_rel p  ON p.Usr_ID = u.user_id WHERE p.Pro_ID=:0 AND p.Pro_Role='Project Manager'";
				$projectManager = $this->conn->fetchOne($checkSql, array($this->pid));
				if (empty($projectManager)) {
					$document_project_info_register = $srcPrefix."utsb/_/utsbProjectInfo?project_id=".$this->parent_project_id."&package_id=".$this->project_id."&project_name=".$_SESSION['project_name']."&start_date=".$start_date."&end_date=".$end_date;
				}else{
					$document_project_info_register = $srcPrefix."utsb/_/utsbProjectInfo?project_id=".$this->parent_project_id."&package_id=".$this->project_id."&project_name=".$_SESSION['project_name']."&start_date=".$start_date."&end_date=".$end_date."&person_in_charge=".$projectManager;
				}
				$document_project_info_view = $srcPrefix."utsb/_/utsbProjectInfoView?&_mode=edit&id=";//need to add the id of the record
				$document_project_info_edit = $srcPrefix."utsb/_/utsbProjectInfoEdit?&_mode=edit&id=";//need to add the id of the record

				$markup_review_form = $srcPrefix."utsb/_/utsbMarkupForm?project_id=".$this->parent_project_id."&package_id=".$this->project_id."&project_id_number=".$this->pid;
				break;

			case 'KURW':
				$document_register = $srcPrefix."registerDocument";
				$document_corr_register = $srcPrefix."correspondence_run?Project=".$this->project_id;
				$document_corr_inbox_res = $srcPrefix."correspondence_response";
				break;

			case 'OBYU':
				$document_register = $srcPrefix."registerDocument";
				$document_corr_register = $srcPrefix."correspondence_run?Project=".$this->project_id;
				$document_corr_inbox_res = $srcPrefix."correspondence_response";
				break;

			case 'SHRFLD':
				$document_register = $srcPrefix."registerDocument";
				$document_corr_register = $srcPrefix."correspondence_run?Project=".$this->project_id;
				$document_corr_inbox_res = $srcPrefix."correspondence_response";
				break;			
		}

		$ret = array(
			"document_register" => $document_register,
			"document_bulk_upload" => $document_bulk_upload,
			"document_corr_register" => $document_corr_register,
			"document_bulk_corr_register" => $document_bulk_corr_register,
			"document_corr_inbox_res" => $document_corr_inbox_res,
			"document_corr_inbox_res_ack" => $document_corr_inbox_res_ack,
			"document_project_info_register" => $document_project_info_register,
			"document_project_info_view" => $document_project_info_view,
			"document_project_info_edit" => $document_project_info_edit,
			"document_register_edit" => $document_register_edit,
			"document_register_view" => $document_register_view,
			"markup_review_form" => $markup_review_form,
			'document_corr_view_incoming' => $document_corr_view_incoming,
			'document_corr_view_outgoing' => $document_corr_view_outgoing
		);

		return $ret;
	}
	public function getFinanceAppLink(){
		$ret = array(
			'dataList' => $this->financeDatalist(),
			//'form' => $this->financeForm(),
			'api' => $this->financeJson()
		);
		return $ret;
	}

	private function getFinanceAppJsonSrcPrefix(){
		$ret = $this->jogetHost."jw/web/json/data/list/".$this->financeApp."/";
		return $ret;	
	}

	private function financeJson(){
		$jsonSrcPrefix = $this->getFinanceAppJsonSrcPrefix();

		// joget.php getJogetProcessRecords()
		$finance_json_Project = "";
		$finance_json_Contract = "";
		$finance_json_Claim = "";
		$finance_json_Contract_Details = "";
		$finance_json_Notifications = "";
		$finance_json_Notificationsv3 = "";
		$finance_json_contractApprovalFlow = "";
		$finance_json_claimApprovalFlow = "";
		$finance_json_voApprovalFlow = "";

		// dashboard
		$finance_dash_contract = "";
		$finance_dash_ipc = "";
		$finance_dash_eot = "";
		$finance_dash_vo = "";
		$finance_dash_acs = "";
		$finance_dash_claim = "";
		$finance_dash_cashoutflow = "";
		switch ($this->owner_org) {
			case 'KACC':
				// joget.php getJogetProcessRecords()
				$finance_json_Project = $jsonSrcPrefix."projectList?d-8112713-fn_project_id=".$this->project_id; //getProjectDataList()
				$finance_json_Contract = $jsonSrcPrefix."contractList?d-5152114-fn_project_id=".$this->project_id."&d-5152114-fn_assign_to=".$this->user_email; //getContractDataList()
				$finance_json_Claim = $jsonSrcPrefix."claimsList?d-2380059-fn_project_id=".$this->project_id."&d-2380059-fn_assign_to=". $this->user_email; //getClaimDataList()
				$finance_json_Contract_Details = $jsonSrcPrefix."contractList?d-5152114-fn_project_id=".$this->project_id ."&d-5152114-fn_status=complete"; //getContractDetails()
				$finance_json_Notifications = $jsonSrcPrefix."generalInbox?start=0&rows=5&d-5171348-fn_c_project_id=".$this->project_id."&d-5171348-fn_c_assign_to=".$this->user_email; //getJogetNotifications()
				$finance_json_Notificationsv3 = $jsonSrcPrefix."generalInbox?d-5171348-fn_c_project_id=".$this->project_id."&d-5171348-fn_c_assign_to=".$this->user_email;
				$finance_json_contractApprovalFlow = $jsonSrcPrefix."approvalFlowCheckList?d-2845235-fn_project_id=".$this->project_id; //getContractApprovalFlowDetails()
				$finance_json_claimApprovalFlow = $jsonSrcPrefix."approvalFlowCheckClaimList?d-3470253-fn_project_id=".$this->project_id; //getClaimApprovalFlowDetails()
				$finance_json_voApprovalFlow = $jsonSrcPrefix."approvalFlowCheckVOList?d-440924-fn_project_id=".$this->project_id; //getVOApprovalFlowDetails
				
				// dashboard
				//$finance_dash_contract = $jsonSrcPrefix."dashboardContractList?d-1181898-fn_project_id={?}";
				$finance_dash_contract = $jsonSrcPrefix."dashboardContractList?d-1181898-fn_project_id={?}&d-1181898-fn_parent_project_id={?}";
				//$finance_dash_claim  = $jsonSrcPrefix."claimDashboardViewList?status1=Complete&status2=Updated&status3=IPC%20Approved&status4=Payment%20Received&d-6627213-fn_contract_id_string={?}&d-6627213-fn_project_id={?}";
				$finance_dash_claim  = $jsonSrcPrefix."claimDashboardViewList?status1=Complete&status2=Updated&status3=IPC%20Approved&status4=Payment%20Received&d-6627213-fn_contract_id_string={?}&d-6627213-fn_project_id={?}&d-6627213-fn_parent_project_id={?}";
				$finance_dash_cashoutflow = $jsonSrcPrefix."cashOutflowList?d-6699393-fn_contract_id={?}&d-6699393-fn_project_id={?}";
				break;
			case 'MRSB':
				$finance_dash_contract = $jsonSrcPrefix."mrsbContractList?d-4322286-fn_project_id={?}&parent_project_id={?}";
				$finance_dash_ipc = $jsonSrcPrefix."mrsbIPCList?d-7915316-fn_contract_no={?}&d-7915316-fn_project_id={?}";
				$finance_dash_eot = $jsonSrcPrefix."mrsbEOTList?d-7913534-fn_contract_no={?}&d-7913534-fn_project_id={?}";
				$finance_dash_vo = $jsonSrcPrefix."mrsbVOListCopy?d-4291118-fn_contract_no={?}&d-4291118-fn_project_id={?}";
				$finance_dash_acs = $jsonSrcPrefix."mrsbACSList?d-7907621-fn_contract_no={?}&d-7907621-fn_project_id={?}";
				$finance_json_Contract_Details = $jsonSrcPrefix."mrsbContractList?d-4322286-fn_project_id=".$this->project_id; //getContractDetails()
				break;

		}

		$ret = array(
			'finance_json_Project' => $finance_json_Project,
			'finance_json_Contract' => $finance_json_Contract,
			'finance_json_Claim' => $finance_json_Claim,
			'finance_json_ContractDetails' => $finance_json_Contract_Details,
			'finance_json_Notifications' => $finance_json_Notifications,
			'finance_json_Notificationsv3' => $finance_json_Notificationsv3,
			'finance_json_ContractApprovalFlow' => $finance_json_contractApprovalFlow,
			'finance_json_ClaimApprovalFlow' => $finance_json_claimApprovalFlow,
			'finance_json_VOApprovalFlow' => $finance_json_voApprovalFlow,
			// dashboard
			'finance_dash_contract' => $finance_dash_contract,
			'finance_dash_ipc' => $finance_dash_ipc,
			'finance_dash_eot' => $finance_dash_eot,
			'finance_dash_vo' => $finance_dash_vo,
			'finance_dash_acs' => $finance_dash_acs,
			'finance_dash_claim' => $finance_dash_claim,
			'finance_dash_cashoutflow' => $finance_dash_cashoutflow
		);
		return $ret;		
	}

	private function getFinanceAppSrcPrefix(){
		$srcPrefix = $this->jogetHost."jw/web/embed/userview/".$this->financeApp."/pfsView/_/";
		return $srcPrefix;	
	}
	private function getFinanceAppSrcRoleStatus(){
		$projectInfo = "";
		$projectUserInfo = "";
		$WorkFlowApproval = "";
		$FundingInfo = "";
		$BudgetInfo = "";
		$AuditInfo = "";
		$ContractsUrl = "";
		$PublishedContractsFilter = "";
		$ClaimsUrl = "";
		$VOsUrl = "";
		$CurrentClaimsFilter = "";
		$NewClaim = "";
		$NewVO = "";
		$CurrentVOsFilter ="";
		$CurrentAmendments ="";
		$ArchivedContracts ="";
		$NewCashOutflow ="";
		$CashOutflow = "";
		$NewEOT = "";
		switch($this->user_role){
			case "Finance Officer":
				$projectInfo = "project_fo_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_fo_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_fo_ul?&_mode=edit&id=";
				$FundingInfo = "funding_fo_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_fo_ul?&_mode=edit&id=";
				$AuditInfo = "audit_fo_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_fo_ul?";
				$VOsUrl = "vo_fo_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "fo_contract_claim_ul?d-2823043-fn_project_id=";
				$NewVO = "fo_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ";
				$CurrentAmendments = "contract_amend_fo_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "fo_archive_contracts_ul?d-4920353-fn_project_id=";
				$NewCashOutflow = "new_cash_outflow_fo_ul?d-1463671-fn_project_id=";
				$CashOutflow = "cash_outflow_list_fo_ul?d-6699393-fn_project_id=";
				break;
			case "Project Manager":
				$projectInfo = "project_pm_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_pm_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_pm_ul?&_mode=edit&id=";
				$FundingInfo = "funding_pm_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_pm_ul?&_mode=edit&id=";
				$AuditInfo = "audit_pm_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_pm_ul?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_pm_ul?";
				$VOsUrl = "vo_pm_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$NewVO = "pm_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ";
				$CurrentAmendments = "contract_amend_pm_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "pm_archive_contracts_ul?d-4920353-fn_project_id=";
				$NewCashOutflow = "new_cash_outflow_pm_ul?d-1463671-fn_project_id=";
				$CashOutflow = "cash_outflow_list_pm_ul?d-6699393-fn_project_id=";
				break;
			case "Finance Head":
				$projectInfo = "project_fh_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_fh_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_fh_ul?&_mode=edit&id=";
				$FundingInfo = "funding_fh_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_fh_ul?&_mode=edit&id=";
				$AuditInfo = "audit_fh_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_fh_ul?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_fh_ul?";
				$VOsUrl = "vo_fh_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress";
				$CurrentAmendments = "contract_amend_fh_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "fh_archive_contracts_ul?d-4920353-fn_project_id=";
				break;
			case "Director":
				$projectInfo = "project_dir_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_dir_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_dir_ul?&_mode=edit&id=";
				$FundingInfo = "funding_dir_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_dir_ul?&_mode=edit&id=";
				$AuditInfo = "audit_dir_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_dir_ul?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_dir_ul?";
				$VOsUrl = "vo_dir_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress";
				$CurrentAmendments = "contract_amend_dir_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "dir_archive_contracts_ul?d-4920353-fn_project_id=";
				break;
			case "Construction Engineer":
				$ContractsUrl = "contracts_ce_ul?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_ce_ul?";
				$VOsUrl = "vo_ce_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress";
				break;
			case "Contractor PM":
				$ContractsUrl = "cpm_contract_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "cpm_claim_ul?";
				$VOsUrl = "vo_ccpm_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "cpm_contract_claim_ul?d-2823043-fn_project_id=";
				$NewVO = "cpm_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ";
				break;
			case "Contractor Engineer":
				$ContractsUrl = "ce_contract_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "ce_claim_ul?";
				$VOsUrl = "vo_cce_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "cpm_contract_claim_ul?d-2823043-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress";
				break;
			case "Consultant CRE":
				$ContractsUrl = "contracts_ccre_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_cre_ul?";
				$VOsUrl = "vo_ccre_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "ccre_contract_claim_ul?d-2823043-fn_project_id=";
				$NewVO = "cre_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ";
				break;
			case "Consultant RE":
				$ContractsUrl = "contracts_cre_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_re_ul?";
				$VOsUrl = "vo_cre_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "ce_contract_claim_ul?d-2823043-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress";
				break;
			case "Planning Engineer":
				$NewEOT = "ple_contract_eot_ul?project_id=";
				break;
		}
		$ret = array(
			'finance_list_ProjectInfo' => $projectInfo,
			'finance_list_ProjectUserInfo' => $projectUserInfo,
			'finance_list_WorkFlowApproval' => $WorkFlowApproval,
			'finance_list_FundingInfo' => $FundingInfo,
			'finance_list_BudgetInfo' => $BudgetInfo,
			'finance_json_AuditInfo' => $AuditInfo,
			'finance_list_ContractsUrl' => $ContractsUrl,
			'finance_list_PublishedContractsFilter' => $PublishedContractsFilter,
			'finance_list_ClaimsUrl' => $ClaimsUrl,
			'finance_list_VOsUrl' => $VOsUrl,
			'finance_list_CurrentClaimsFilter' => $CurrentClaimsFilter,
			'finance_list_NewClaim' => $NewClaim,
			'finance_list_NewVO' => $NewVO,
			'finance_list_CurrentVOsFilter' => $CurrentVOsFilter,
			'finance_list_CurrentAmendments' => $CurrentAmendments,
			'finance_list_ArchivedContracts' => $ArchivedContracts,
			'finance_list_NewCashOutflow' => $NewCashOutflow,
			'finance_list_CashOutflow' => $CashOutflow,
			'finance_list_NewEOT' => $NewEOT

		);
		return $ret;	
	}

	public function financeDatalist(){
		$srcPrefix = $this->getFinanceAppSrcPrefix();
		$srcUrl = $this->getFinanceAppSrcRoleStatus();

		$finance_list_ProjectInfo = "";
		$finance_list_ProjectUserInfo = "";
		$finance_list_WorkFlowApproval = "";
		$finance_list_FundingInfo = "";
		$finance_list_BudgetInfo = "";
		$finance_list_AuditInfo = "";
		$finance_list_AddEditProjectDetails = "";
		$finance_list_PublishedContracts = "";
		$finance_list_ContractInbox = "";
		$finance_list_ContractActivityForm = "";
		$finance_list_ClaimActivityForm = "";
		$finance_list_VOActivityForm = "";
		$finance_list_ContractAmendForm ="";
		$finance_list_ContractApprovedRejected = "";
		$finance_list_ClaimApprovedRejected = "";
		$finance_list_VOApprovedRejected = "";
		$finance_list_NewContract = "";
		$finance_list_RejectedContracts = "";
		$finance_list_CurrentClaims = "";
		$finance_list_RejectedClaims = "";
		$finance_list_ApprovedClaims = "";
		$finance_list_NewClaim = "";
		$finance_list_ClaimInbox = "";
		$finance_list_NewVO = "";
		$finance_list_CurrentVOs = "";
		$finance_list_ApprovedVOs = "";
		$finance_list_RejectedVOs = "";
		$finance_list_VOInbox = "";
		$finance_list_ScheduleData ="";
		$finance_list_ImportUnit = "";
		$finance_list_NewAmendment = "";
		$finance_list_AmendmentInbox ="";
		$finance_list_CurrentAmendments = "";
		$finance_list_ArchivedContracts = "";
		$finance_list_NewCashOutflow = "";
		$finance_list_CashOutflowList = "";
		$finance_list_NewACS = "";
		$finance_list_ApprovedACS = "";
		$finance_list_NewEOT = "";
		$finance_list_ApprovedEOT = "";
		$finance_list_ConsultantList = "";
		$finance_list_NewEOT = "";
		$empty = "";
	
		// dashboard linking to conOp
		$finance_dash_list_contract = "";
		$finance_dash_list_ipc = "";
		$finance_dash_list_eot = "";
		$finance_dash_list_vo = "";
		$finance_dash_list_acs = "";
		$finance_list_contract_list_card = "";
		$finance_list_claim_list_card = "";
		
		// need to handle link between parent and package
		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->project_id;
			$packageIdConOp = '{?}';
		}else{
			$projectIdConOp = $this->parent_project_id;
			$packageIdConOp = $this->project_id;
		}

		switch ($this->owner_org) {
			case 'KACC':
				// all Finance DataLists based on Roles
				$finance_list_ProjectInfo = $srcPrefix.$srcUrl['finance_list_ProjectInfo'].$this->project_id;
				$finance_list_ProjectUserInfo = $srcPrefix.$srcUrl['finance_list_ProjectUserInfo'].$this->project_id;
				$finance_list_WorkFlowApproval = $srcPrefix.$srcUrl['finance_list_WorkFlowApproval'].$this->project_id;
				$finance_list_FundingInfo = $srcPrefix.$srcUrl['finance_list_FundingInfo'].$this->project_id;
				$finance_list_BudgetInfo = $srcPrefix.$srcUrl['finance_list_BudgetInfo'].$this->project_id;
				$finance_list_AuditInfo = $srcPrefix.$srcUrl['finance_json_AuditInfo'].$this->project_id;
				$finance_list_AddEditProjectDetails = $srcPrefix."fb_uv?project_id=".$this->project_id;
				$finance_list_PublishedContracts = $srcPrefix.$srcUrl['finance_list_ContractsUrl']."d-4882770-fn_project_id=".$this->project_id.$srcUrl['finance_list_PublishedContractsFilter'];
				$finance_list_ContractInbox = $srcPrefix."contract_inbox?d-2051932-fn_project_id=".$this->project_id;
				$finance_list_ContractActivityForm = $srcPrefix."contract_inbox?activityId=";
				$finance_list_ClaimActivityForm = $srcPrefix. "claim_inbox?activityId=";
				$finance_list_VOActivityForm = $srcPrefix. "vo_inbox?activityId=";
				$finance_list_ContractAmendForm = $srcPrefix. "contract_amend_data_inbox?activityId=";
				$finance_list_ContractApprovedRejected = $srcPrefix.$srcUrl['finance_list_ContractsUrl']."id=";
				$finance_list_ClaimApprovedRejected = $srcPrefix.$srcUrl['finance_list_ClaimsUrl']."id=";
				$finance_list_VOApprovedRejected = $srcPrefix.$srcUrl['finance_list_VOsUrl']."id=";
				$finance_list_NewContract = $srcPrefix."create_contract?project_id=".$this->project_id;
				$finance_list_RejectedContracts = $srcPrefix.$srcUrl['finance_list_ContractsUrl']."d-4882770-fn_project_id=".$this->project_id."&status1=Reject";
				$finance_list_CurrentClaims = $srcPrefix.$srcUrl['finance_list_ClaimsUrl']."d-6787268-fn_project_id=".$this->project_id.$srcUrl['finance_list_CurrentClaimsFilter'];
				$finance_list_RejectedClaims = $srcPrefix.$srcUrl['finance_list_ClaimsUrl']."d-6787268-fn_project_id=".$this->project_id."&status1=Reject";
				$finance_list_ApprovedClaims = $srcPrefix.$srcUrl['finance_list_ClaimsUrl']."d-6787268-fn_project_id=".$this->project_id."&status1=Complete&status2=Updated&status3=IPC Approved&status4=Payment Received";
				$finance_list_NewClaim = $srcPrefix.$srcUrl['finance_list_NewClaim'].$this->project_id. "&d-2823043-fn_status=Complete";
				$finance_list_ClaimInbox = $srcPrefix."claim_inbox?d-2380059-fn_project_id=".$this->project_id;
				$finance_list_NewVO = $srcPrefix.$srcUrl['finance_list_NewVO'].$this->project_id. "&d-4828409-fn_status=Complete";
				$finance_list_CurrentVOs = $srcPrefix.$srcUrl['finance_list_VOsUrl']."d-6410841-fn_project_id=" .$this->project_id.$srcUrl['finance_list_CurrentVOsFilter'];
				$finance_list_ApprovedVOs = $srcPrefix.$srcUrl['finance_list_VOsUrl']."d-6410841-fn_project_id=" .$this->project_id. "&status1=complete";
				$finance_list_RejectedVOs = $srcPrefix.$srcUrl['finance_list_VOsUrl']."d-6410841-fn_project_id=" .$this->project_id. "&status1=reject";
				$finance_list_VOInbox = $srcPrefix."vo_inbox?d-447905-fn_project_id=".$this->project_id;
				$finance_list_ScheduleData = $srcPrefix."import_schedule_data";
				$finance_list_ImportUnit = $srcPrefix."import_unit_data";
				$finance_list_NewAmendment = $srcPrefix."fo_contract_amend_ul?d-122886-fn_project_id=" .$this->project_id. "&d-122886-fn_status=Complete";
				$finance_list_AmendmentInbox = $srcPrefix."contract_amend_data_inbox?d-5152114-fn_project_id=".$this->project_id;
				$finance_list_CurrentAmendments = $srcPrefix.$srcUrl['finance_list_CurrentAmendments'].$this->project_id;
				$finance_list_ArchivedContracts = $srcPrefix.$srcUrl['finance_list_ArchivedContracts'].$this->project_id;
				$finance_list_NewCashOutflow = $srcPrefix.$srcUrl['finance_list_NewCashOutflow'].$this->project_id;
				$finance_list_CashOutflowList = $srcPrefix.$srcUrl['finance_list_CashOutflow'].$this->project_id;
				$finance_list_NewEOT = $srcPrefix.$srcUrl['finance_list_NewEOT'].$this->project_id. "&status=Complete";
				$finance_list_ApprovedEOT = $srcPrefix."eot_ple_list?d-6383306-fn_project_id=" .$this->project_id."&d-6383306-fn_contract_no=".$empty;

				// dashboard card
				$finance_list_contract_list_card = $srcPrefix."ContractListDashboard?d-8172624-fn_project_id=".$packageIdConOp."&d-8172624-fn_section={?}&contract_ids={?}&d-8172624-fn_contract_no={?}";
				$finance_list_claim_list_card = $srcPrefix."claimListDashboard?status1=Complete&status2=Updated&status3=IPC%20Approved&status4=Payment%20Received&d-6184632-fn_project_id=".$packageIdConOp."&d-6184632-fn_contract_id_string={?}&d-6184632-fn_paymentReceivedDate={?}&d-6184632-fn_paymentReceivedDate={?}&d-6184632-fn_ipa_submission_date={?}&d-6184632-fn_ipa_submission_date={?}";

				
				break;
			case 'MRSB':
				$finance_list_NewContract = $srcPrefix."mrsb_new_contract?project_id=".$this->project_id."&project_name=".$this->project_name."&parent_project_id=". $this->parent_project_id;
				$finance_list_PublishedContracts = $srcPrefix."mrsb_contract_list?d-4322286-fn_project_id=".$this->project_id;
				$finance_list_ConsultantList = $srcPrefix."mrsb_consultant_setup?d-5450103-fn_project_id=".$this->project_id;
				$finance_list_NewClaim = $srcPrefix."mrsb_contract_claim_list?d-1749138-fn_project_id=".$this->project_id;
				$finance_list_ApprovedClaims = $srcPrefix."mrsb_ipc_list?d-7915316-fn_project_id=".$this->project_id."&d-7915316-fn_contract_no=".$empty;
				$finance_list_NewVO = $srcPrefix."mrsb_contract_vo_list?d-5346479-fn_project_id=".$this->project_id;
				$finance_list_ApprovedVOs = $srcPrefix."vo_list?d-4291118-fn_project_id=" .$this->project_id."&d-4291118-fn_contract_no=".$empty;
				$finance_list_NewACS = $srcPrefix."mrsb_contract_acs_list?d-7650687-fn_project_id=".$this->project_id;
				$finance_list_ApprovedACS = $srcPrefix."acs_list?d-7907621-fn_project_id=" .$this->project_id."&d-7907621-fn_contract_no=".$empty;
				$finance_list_NewEOT = $srcPrefix."mrsb_contract_eot_list?d-7650760-fn_project_id=".$this->project_id;
				$finance_list_ApprovedEOT = $srcPrefix."eot_list?d-7913534-fn_project_id=" .$this->project_id."&d-7913534-fn_contract_no=".$empty;
				// link to open from dashboard
				$finance_dash_list_contract = $srcPrefix."mrsb_contract_list?d-4322286-fn_project_id=".$packageIdConOp."&d-4322286-fn_id={?}&d-4322286-ps=10&d-4322286-p=1";
				$finance_dash_list_ipc = $srcPrefix."mrsb_ipc_dashboard?d-2369906-fn_project_id=".$packageIdConOp."&d-2369906-fn_id={?}&d-2369906-ps=10&d-2369906-p=1";
				$finance_dash_list_eot = $srcPrefix."eot_list?d-7913534-fn_project_id=".$packageIdConOp."&d-7913534-fn_contract_no={?}&d-7913534-ps=10&d-7913534-p=1";
				$finance_dash_list_vo = $srcPrefix."vo_list?d-4291118-fn_project_id=".$packageIdConOp."&d-4291118-fn_contract_no={?}&d-4291118-ps=10&d-4291118-p=1";
				$finance_dash_list_acs = $srcPrefix."acs_list?d-7907621-fn_project_id=".$packageIdConOp."&d-7907621-fn_contract_no={?}&d-7907621-ps=10&d-7907621-p=1";
				break;
		}	

		$ret = array(
			//projectDetails Urls
			'finance_list_ProjectInfo' => $finance_list_ProjectInfo,
			'finance_list_ProjectUserInfo' => $finance_list_ProjectUserInfo,
			'finance_list_WorkFlowApproval' => $finance_list_WorkFlowApproval,
			'finance_list_FundingInfo' => $finance_list_FundingInfo,
			'finance_list_BudgetInfo' => $finance_list_BudgetInfo,
			'finance_list_AuditInfo' => $finance_list_AuditInfo,
			'finance_list_AddEditProjectDetails' => $finance_list_AddEditProjectDetails,
			// Contract Urls
			'finance_list_PublishedContracts' => $finance_list_PublishedContracts,
			'finance_list_NewContract' => $finance_list_NewContract,
			'finance_list_RejectedContracts' => $finance_list_RejectedContracts,
			'finance_list_ContractInbox' => $finance_list_ContractInbox,
			'finance_list_ContractActivityForm' => $finance_list_ContractActivityForm,
			'finance_list_ContractApprovedRejected' => $finance_list_ContractApprovedRejected,
			//Claim Urls
			'finance_list_CurrentClaims' => $finance_list_CurrentClaims,
			'finance_list_RejectedClaims' => $finance_list_RejectedClaims,
			'finance_list_ApprovedClaims' => $finance_list_ApprovedClaims,
			'finance_list_NewClaim' => $finance_list_NewClaim,
			'finance_list_ClaimInbox' => $finance_list_ClaimInbox,
			'finance_list_ClaimActivityForm' => $finance_list_ClaimActivityForm,
			'finance_list_ClaimApprovedRejected' => $finance_list_ClaimApprovedRejected,
			//VO Urls
			'finance_list_CurrentVOs' => $finance_list_CurrentVOs,
			'finance_list_ApprovedVOs'=> $finance_list_ApprovedVOs,
			'finance_list_RejectedVOs'=> $finance_list_RejectedVOs,
			'finance_list_NewVO' => $finance_list_NewVO,
			'finance_list_VOInbox'=> $finance_list_VOInbox,
			'finance_list_VOActivityForm' => $finance_list_VOActivityForm,
			'finance_list_VOApprovedRejected' => $finance_list_VOApprovedRejected,
			//Amendment Urls
			'finance_list_ContractAmendForm' => $finance_list_ContractAmendForm,
			'finance_list_NewAmendment' => $finance_list_NewAmendment,
			'finance_list_AmendmentInbox' => $finance_list_AmendmentInbox,
			'finance_list_CurrentAmendments' => $finance_list_CurrentAmendments,
			'finance_list_ArchivedContracts'=> $finance_list_ArchivedContracts,
			//Look up Data Urls
			'finance_list_ScheduleData'=> $finance_list_ScheduleData,
			'finance_list_ImportUnit'=> $finance_list_ImportUnit,
			'finance_list_ConsultantList' => $finance_list_ConsultantList,
			//cash outflow
			'finance_list_NewCashOutflow' => $finance_list_NewCashOutflow,
			'finance_list_CashOutflowList' => $finance_list_CashOutflowList,
			//mrsb acs and eot urls
			'finance_list_NewACS' => $finance_list_NewACS,
			'finance_list_ApprovedACS' => $finance_list_ApprovedACS,
			'finance_list_NewEOT' => $finance_list_NewEOT,
			'finance_list_ApprovedEOT' => $finance_list_ApprovedEOT,
			// dashboard linking
			'finance_dash_list_contract' => $finance_dash_list_contract,
			'finance_dash_list_ipc' => $finance_dash_list_ipc,
			'finance_dash_list_eot' => $finance_dash_list_eot,
			'finance_dash_list_vo' => $finance_dash_list_vo,
			'finance_dash_list_acs' => $finance_dash_list_acs,
			'finance_list_contract_list_card' => $finance_list_contract_list_card,
			'finance_list_claim_list_card' => $finance_list_claim_list_card
		);

		return $ret;
	}

	private function getPluginLink(){
		$ret = array(
			'view_download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.ViewDownloadableDataAPI/service',
			'download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.DownloadDataListData/service',
			'mrsbNcr_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbNcrDown_list?data=',
			'mrsbNcr_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbNcrDown_list?data=',
			'mrsbWir_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbWirDown_list?data=',
			'mrsbRfi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbRFIDown_list?data=',
			'mrsbMs_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbMsDown_list?data=',
			'mrsbMt_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbMaDown_list?data=',
			'mrsbInc_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbIncDown_list?data=',
			'mrsbSd_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbSdDown_list?data=',
			'mrsbSi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbSiDown_list?data=',
			'mrsbSa_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbSaDown_list?data=',
			'mrsbSmh_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbSmhDown_list?data=',
			'mrsbRr_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbRrDown_list?data=',
			'mrsbRao_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbRaDown_list?data=',
			'mrsbRas_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbRasDown_list?data=',
			'mrsbNoi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbNoiDown_list?data=',
			'mrsbPubc_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbPbcDown_list?data=',
			'mrsbEvnt_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbEvtDown_list?data=',
			'kaccCar_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccCarDown_list?data=',
			'kaccInc_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccincDown_list?data=',
			'kaccMs_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccMsDown_list?data=',
			'kaccMa_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccMaDown_list?data=',
			'kaccNcr_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccNcrDown_list?data=',
			'kaccPtw_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccPtwDown_list?data=',
			'kaccRfi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccRfiDown_list?data=',
			'kaccSa_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccSaDown_list?data=',
			'kaccSi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccSiDown_list?data=',
			'kaccSd_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccSdDown_list?data=',
			'kaccSmh_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccSmhDown_list?data=',
			'kaccWir_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccWirDown_list?data='
		);
		return $ret;
	}

	private function loadGeneralUrl(){
		$ret = array();
		$appNameDocument = 'doc';
		$jsonPrefixDocument = $this->jogetHost."jw/web/json/data/list/".$appNameDocument."/";
		$userviewPrefixDocument = $this->jogetHost."jw/web/embed/userview/".$appNameDocument."/".strtolower($_SESSION['user_org'])."/_/";
		
		$appNameFinance = 'pfs';
		$jsonPrefixFinance = $this->jogetHost."jw/web/json/data/list/".$appNameFinance."/";
		$userviewPrefixFinance = $this->jogetHost."jw/web/embed/userview/".$appNameFinance."/pfsView/_/";

		$doc_json_datalist_task = $jsonPrefixDocument."doc_notification?d-755636-fn_to=".$this->user_email;
		$doc_json_corr_notification = $jsonPrefixDocument."doc_notification?d-755636-fn_package_id=".$this->project_id."&d-755636-fn_to=".$this->user_email;

		$doc_open_corr_respond = $userviewPrefixDocument.strtolower($_SESSION['user_org'])."CorrAction?id=";
		$finance_json_datalist_task = $jsonPrefixFinance."generalInbox?d-5171348-fn_c_assign_to=".$this->user_email; 

		$finance_open_ContractActivityForm = $userviewPrefixFinance."contract_inbox?activityId=";
		$finance_open_ClaimActivityForm = $userviewPrefixFinance. "claim_inbox?activityId=";
		$finance_open_VOActivityForm = $userviewPrefixFinance. "vo_inbox?activityId=";

		$document_list_section = $jsonPrefixDocument."list_kaccSection?d-2749300-fn_package_id=".$this->project_id;

		$kacc_form_bulk = "?package_id=".$this->project_id."&project_id=".$this->parent_project_id."&project_name=".$this->project_name;
		
		$ret = array(
			'doc_json_datalist_task' => $doc_json_datalist_task,
			'document_list_section' => $document_list_section,
			'doc_open_corr_respond' => $doc_open_corr_respond,
			'finance_json_datalist_task' => $finance_json_datalist_task,
			'finance_open_ContractActivityForm' => $finance_open_ContractActivityForm,
			'finance_open_ClaimActivityForm' => $finance_open_ClaimActivityForm,
			'finance_open_VOActivityForm' => $finance_open_VOActivityForm,
			'doc_json_corr_notification' => $doc_json_corr_notification,
			'view_download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.ViewDownloadableDataAPI/service',
			'download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.DownloadDataListData/service',
			'mrsbNcr_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbNcrDown_list?data=',
			'mrsbNcr_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbNcrDown_list?data=',
			'mrsbWir_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbWirDown_list?data=',
			'mrsbRfi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbRFIDown_list?data=',
			'mrsbMs_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbMsDown_list?data=',
			'mrsbMt_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbMaDown_list?data=',
			'mrsbInc_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbIncDown_list?data=',
			'mrsbSd_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbSdDown_list?data=',
			'mrsbSi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbSiDown_list?data=',
			'mrsbSa_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbSaDown_list?data=',
			'mrsbSmh_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbSmhDown_list?data=',
			'mrsbRr_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbRrDown_list?data=',
			'mrsbRao_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbRaDown_list?data=',
			'mrsbRas_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbRasDown_list?data=',
			'mrsbNoi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbNoiDown_list?data=',
			'mrsbPubc_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbPbcDown_list?data=',
			'mrsbEvnt_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/mrsb/_/mrsbEvtDown_list?data=',
			'kaccCar_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccCarDown_list?data=',
			'kaccInc_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccincDown_list?data=',
			'kaccMs_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccMsDown_list?data=',
			'kaccMa_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccMaDown_list?data=',
			'kaccNcr_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccNcrDown_list?data=',
			'kaccPtw_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccPtwDown_list?data=',
			'kaccRfi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccRfiDown_list?data=',
			'kaccSa_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccSaDown_list?data=',
			'kaccSi_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccSiDown_list?data=',
			'kaccSd_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccSdDown_list?data=',
			'kaccSmh_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccSmhDown_list?data=',
			'kaccWir_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/kacc/_/kaccWirDown_list?data=',
			'kacc_form_bulk' => $kacc_form_bulk
		);
		
		return $ret;
	}

	public function getLink($cat, $param = array()){
		$ret = '';
		if(isset($this->jogetAppLink['dataList'][$cat])) $ret = $this->jogetAppLink['dataList'][$cat];
		if(isset($this->jogetAppLink['form'][$cat])) $ret = $this->jogetAppLink['form'][$cat];
		if(isset($this->jogetAppLink['api'][$cat])) $ret = $this->jogetAppLink['api'][$cat];
		if(isset($this->jogetAppLink[$cat])) $ret = $this->jogetAppLink[$cat];
		if (!empty($param)) {
			return $this->setLinkParam($ret, $param);
		}
		return $ret;
	}

	public function loadURL(){
		$ret = array();

		if ($this->documentApp) {
			$ret = array_merge_recursive($ret, $this->getDocumentAppLink());
		}

		if($this->constructApp){
			$ret = array_merge_recursive($ret, $this->getConstructAppLink());
		}

		if($this->financeApp){
			$ret = array_merge_recursive($ret, $this->getFinanceAppLink());
		}
		
		$ret = array_merge_recursive($ret, $this->loadGeneralUrl());
		$this->jogetAppLink = $ret;
		return $ret;
	}

	public function setToGlobalJSVariable($varname = 'JOGETLINK'){
		echo "<script>";
		echo "var JOGETHOST = '".$this->jogetHost."';";
		echo "var JOGETSUPPORTHOST = '".$this->jogetSupportHost."';";
		echo "var OWNERORG = '".$this->owner_org."';";
		echo "var GEOHOST = '';";
		echo "var SYSTEM = '".$this->system."';";
		echo "var IS_DOWNSTREAM = '".$this->isDownstream."';";
		echo "var MAPBOX_TOKEN = '".$this->mapboxToken."';";
		echo "var MAPTILER_TOKEN = '".$this->maptilerToken."';";
		if ($this->jogetAppLink) {
			echo "var ".$varname." = JSON.parse('".json_encode($this->jogetAppLink, JSON_INVALID_UTF8_IGNORE)."');";
		}
		if($this->constructApp){
			echo "var JOGET_CONSTRUCTAPP = '".$this->constructApp."';";
		}
		if(isset($_SESSION['ui_pref'])){
			echo "var UI_PREF = '".$_SESSION['ui_pref']."';";
		}
		echo "</script>";
	}

	public function setLinkParam($link, $param){
		$ret = $link;
		foreach ($param as $val) {
		    $from = '/'.preg_quote("{?}", '/').'/';
			$ret = preg_replace($from, $val, $ret, 1);
		}
		// handle all other extra {?}
		return str_replace("{?}","",$ret);
	}

	public function fetchLink($type, $linkName, $param){
		if (!isset($this->jogetAppLink[$type][$linkName])) return false;
		if (!empty($param)) {
			return $this->setLinkParam($this->jogetAppLink[$type][$linkName], $param);
		}
		return $this->jogetAppLink[$type][$linkName];
	}

	public function preloadURL() {
		$this->loadUrl();
		return $this->jogetAppLink;
	}
}