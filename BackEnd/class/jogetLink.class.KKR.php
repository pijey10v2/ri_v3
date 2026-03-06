<?php
/**
 * Manage link for external app, joget/geoserver
 */
//
class JogetLink
{
	var $jogetHost;
	var $jogetAssetHost;
	var $geoServerHost;

	var $jogetDomain;
	var $jogetIp;
	var $jogetAssetDomain;
	var $jogetAssetIp;
	var $jogetSupportDomain;
	var $jogetSupportIp;
	var $geoserverDomain;
	var $geoserverIp;
	var $riHost;

	var $constructApp;
	var $financeApp;
	var $documentApp;
	var $assetApp;
	var $fmApp;

	var $currUserEmail;
	var $currUserRole;
	var $currUserOrg;
	var $currPackageId;
	var $currPackageUuid;
	var $currProjectId;
	var $currPackageName;
	var $currProjectOwner;
	var $currWPCId;
	var $currContractLevel;
	var $pid;
	var $currLocation;
	var $currProjectPhase;
	var $currWpcAbbr;

	var $jogetAppLink = array();
	var $jogetConstructVersion = "latest";

	var $isDownstream;

	// Cesium Access Token
	var $mapboxToken;
	var $maptilerToken;

	private $conn;
	// joget
	private $jogetAdminUser;
	private $jogetAdminPwd;
	private $jogetAssetAdminUser;
	private $jogetAssetAdminPwd;
	private $jogetSupportAdminUser;
	private $jogetSupportAdminPwd;

	// geoserver
	private $geoServerAdminUser;
	private $geoServerAdminPwd;

	var $system;

	function __construct()
	{
		if (session_status() == PHP_SESSION_NONE) session_start();
		// if not logged in
		if (!isset($_SESSION['noLogin'])) {
			if (!isset($_SESSION['email'])) {
				  session_destroy();
				  header("Location: signin");
				  exit();
			}
		}

		include_once dirname(__FILE__).'/../../Login/app_properties.php';
		global $JOGETDOMAIN, $JOGETIP, $JOGETASSETDOMAIN, $JOGETASSETIP, $JOGETSUPPORTDOMAIN, $JOGETSUPPORTIP, $GEOSERVERDOMAIN, $GEOSERVERIP, $RIHOST, $IS_DOWNSTREAM, $MAPBOX_TOKEN;

		$this->jogetDomain = $JOGETDOMAIN;
		$this->jogetAssetDomain = $JOGETASSETDOMAIN;
		$this->jogetSupportDomain = $JOGETSUPPORTDOMAIN;
		$this->jogetIp = $JOGETIP;
		$this->jogetAssetIp = $JOGETASSETIP;
		$this->jogetSupportIp = $JOGETSUPPORTIP;
		$this->geoserverDomain = $GEOSERVERDOMAIN;
		$this->geoserverIp = $GEOSERVERIP;
		$this->riHost = $RIHOST;

		global $JOGETADMINUSER, $JOGETADMINPWD, $JOGETASSETADMINUSER, $JOGETASSETADMINPWD, $JOGETSUPPORTADMINUSER, $JOGETSUPPORTADMINPWD, $GEOSERVERADMINUSER, $GEOSERVERADMINPWD;
		$this->jogetAdminUser = $JOGETADMINUSER;
		$this->jogetAdminPwd = $JOGETADMINPWD;
		$this->jogetAssetAdminUser = $JOGETASSETADMINUSER;
		$this->jogetAssetAdminPwd = $JOGETASSETADMINPWD;
		$this->jogetSupportAdminUser = $JOGETSUPPORTADMINUSER;
		$this->jogetSupportAdminPwd = $JOGETSUPPORTADMINPWD;
		$this->geoServerAdminUser = $GEOSERVERADMINUSER;
		$this->geoServerAdminPwd = $GEOSERVERADMINPWD;

		$this->jogetHost = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $this->jogetDomain : $this->jogetIp;
		$this->jogetAssetHost = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $this->jogetAssetDomain : $this->jogetAssetIp;
		$this->jogetSupportHost = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $this->jogetSupportDomain : $this->jogetSupportIp;
		$this->geoServerHost = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $this->geoserverDomain : $this->geoserverIp;
		$this->isDownstream = isset($IS_DOWNSTREAM) ? $IS_DOWNSTREAM : false;

		require_once __DIR__ . "/../cesiumTokenFunctions.php";

		$this->mapboxToken = getDefaultCesiumTokens() ?? (isset($MAPBOX_TOKEN) ? $MAPBOX_TOKEN : false);
		$this->maptilerToken = getDefaultCesiumTokens('maptiler') ?? (isset($MAPTILER_TOKEN) ? $MAPTILER_TOKEN : false);

		$appListsEncode = isset($_SESSION['appsLinks']) ? json_decode($_SESSION['appsLinks']) : [];
	    if ($appListsEncode) {
    		$constructpackageInfoArr = explode('::', $appListsEncode->constructPackage_name);

			if(isset($_SESSION['Project_type']) && $_SESSION['Project_type'] == "CONSTRUCT"){
    			$this->constructApp = $constructpackageInfoArr[0];
			}else if($_SESSION['Project_type'] == 'ASSET'){
				$this->assetApp = $constructpackageInfoArr[0];
			}else{
				$this->fmApp = $constructpackageInfoArr[0];
			}
    		$documentpackageInfoArr = explode('::', $appListsEncode->documentPackage_name);
    		$this->documentApp = $documentpackageInfoArr[0];

    		$financepackageInfoArr = explode('::', $appListsEncode->financePackage_name);
    		$this->financeApp = $financepackageInfoArr[0];

			if(isset($appListsEncode->app_CP_level) && $appListsEncode->app_CP_level){
				$this->currContractLevel = $appListsEncode->app_CP_level;
			}
	    }

		$this->currUserEmail = (isset($_SESSION['email'])) ? $_SESSION['email'] : '';
	    $this->currUserOrg = (isset($_SESSION['user_org'])) ? $_SESSION['user_org'] : '';
		$this->currPackageId = (isset($_SESSION['projectID'])) ? $_SESSION['projectID'] : '';
		$this->currProjectId = (isset($_SESSION['parent_project_id'])) ? $_SESSION['parent_project_id'] : '';

		$this->currUserRole = (isset($_SESSION['project_role'])) ? $_SESSION['project_role'] : '';
		$this->currPackageName = (isset($_SESSION['project_name'])) ? $_SESSION['project_name'] : '';
		$this->currProjectOwner = (isset($_SESSION['project_owner'])) ? $_SESSION['project_owner'] : "";
		$this->currWPCId = (isset($_SESSION['wpc_id'])) ? $_SESSION['wpc_id'] : "";
		$this->pid = isset($_SESSION['project_id_number']) ? $_SESSION['project_id_number'] : '';
		$this->currPackageUuid = (isset($_SESSION['projectID']) && isset($_SESSION['project_id_number'])) ? $_SESSION['project_id_number']."_". $_SESSION['projectID']. "_" . $_SESSION['project_id_number']: "";
		$this->currLocation = (isset($_SESSION['location'])) ? $_SESSION['location'] : '';
		$this->currProjectPhase = isset($_SESSION['project_phase']) ? $_SESSION['project_phase'] : '';
		$this->currWpcAbbr = isset($_SESSION['wpc_abbr']) ? $_SESSION['wpc_abbr'] : '';

	    $this->loadUrl();

		global $SYSTEM;
		$this->system = $SYSTEM;
	}

	public function setLinkParam($link, $param){
		$ret = $link;
		foreach ($param as $val) {
		    $from = '/'.preg_quote("{?}", '/').'/';
			$ret = preg_replace($from, $val, $ret, 1);
		}
		return $ret;
	}

	public function getLink($cat, $param = array()){
		if (!isset($this->jogetAppLink[$cat])) return false;
		if (!empty($param)) {
			return $this->setLinkParam($this->jogetAppLink[$cat], $param);
		}
		return $this->jogetAppLink[$cat];
	}

	private function getJsonDatalistSrcPrefix($app = 'construct'){
		switch ($app) {
			case 'doc':
				$appName = $this->documentApp;
				$srcPrefix = $this->jogetHost."jw/web/json/data/list/".$appName."/";
				break;
			case 'finance':
				$appName = $this->financeApp;
				$srcPrefix = $this->jogetHost."jw/web/json/data/list/".$appName."/";
				break;
			case 'assetFinance':
				$appName = $this->financeApp;
				$srcPrefix = $this->jogetAssetHost."jw/web/json/data/list/".$appName."/";	
				break;
			case 'asset':
				$appName = $this->assetApp;
				$srcPrefix = $this->jogetAssetHost."jw/web/json/data/list/".$appName."/";	
				break;
			case 'fm':
				$appName = $this->fmApp;
				$srcPrefix = $this->jogetAssetHost."jw/web/json/data/list/".$appName."/";	
				break;
			default:
				$appName = $this->constructApp;
				$srcPrefix = $this->jogetHost."jw/web/json/data/list/".$appName."/";
				break;
		}

			
		return $srcPrefix;	
	}

	private function getUserviewSrcPrefix($app = 'construct'){
		switch ($app) {
			case 'doc':
				$appName = $this->documentApp;
				$srcPrefix = $this->jogetHost."jw/web/embed/userview/".$appName."/v/_/";
				break;
			case 'finance':
					$appName = $this->financeApp;
					$srcPrefix = $this->jogetHost."jw/web/embed/userview/".$appName."/pfsView/_/";
				break;
			case 'assetFinance':
				$appName = $this->financeApp;
				$srcPrefix = $this->jogetAssetHost."jw/web/embed/userview/".$appName."/PFS_ASSET/_/";
				break;
			case 'asset' :
				$appName = $this->assetApp;
				$srcPrefix = $this->jogetAssetHost."jw/web/embed/userview/".$appName."/ri_asset/_/";
				break;
			case 'fm' :
				$appName = $this->fmApp;
				$srcPrefix = $this->jogetAssetHost."jw/web/embed/userview/".$appName."/RV_AMS/_/";
				break;
			default:
				$appName = $this->constructApp;
				$srcPrefix = $this->jogetHost."jw/web/embed/userview/".$appName."/";
				break;
		}

		return $srcPrefix;	
	}

	// to get the parameters based on role status
	private function getConstructAppSrcRoleStatus(){

		$temp_NOI_IdLink ="";
		$temp_NCR_IdLink ="";
		$temp_SD_IdLink ="";
		$temp_DCR_IdLink ="";
		
		switch($this->currUserRole){
			case "Zone Manager":
				if($this->currProjectOwner == "JKR_SARAWAK"){
					$temp_NOI_IdLink = "new_noiSarawak01";
					$temp_NCR_IdLink = "new_ncrSarawak01";
				}
				break;

			case "Project Manager":
				if($this->currProjectOwner == "JKR_SABAH"){
					$temp_NOI_IdLink = "new_noiSabah01";
					if ($this->currUserOrg == 'HSSI') {
						$temp_SD_IdLink = "new_sdSabah01";
					}else if($this->currUserOrg == 'JKR'){
						$temp_NCR_IdLink = "new_ncrSabah01";
						$temp_SD_IdLink = "new_sdSabah02";
						$temp_DCR_IdLink = "new_dcrSabah1B02";
					}else if($this->currUserOrg == 'pmc_1b'){
						$temp_SD_IdLink = "new_sdSabah01";
						$temp_DCR_IdLink = "new_dcrSabah1B02";
					}
				}
				break;

			case "Safety Officer":
				if($this->currProjectOwner == "JKR_SARAWAK"){
					$temp_NOI_IdLink = "new_noiSarawak03";
					$temp_NCR_IdLink = "new_ncrSarawak03";
				}else if($this->currProjectOwner == "JKR_SABAH"){
					$temp_NOI_IdLink = "new_noiSabah03";
					if ($this->currUserOrg == 'HSSI') {
						$temp_NCR_IdLink = "new_ncrSabah03";
					} else if ($this->currUserOrg == 'pmc_1b') {
						$temp_NCR_IdLink = "new_ncrSabah03";
					}
				}
				break;
			case "Bumi Officer":
				if($this->currProjectOwner == "JKR_SABAH"){
					$temp_NOI_IdLink = "new_noiSabah01";
				}
				break;

			case "Consultant CRE":
				if($this->currProjectOwner == "JKR_SARAWAK"){
					$temp_NOI_IdLink = "new_noiSarawak02";
					$temp_NCR_IdLink = "new_ncrSarawak02";
				}else if($this->currProjectOwner == "JKR_SABAH"){
					$temp_SD_IdLink = "new_sdSabah01";
					$temp_NCR_IdLink = "new_ncrSabah02";
					$temp_NOI_IdLink = "new_noiSabah02";
					$temp_DCR_IdLink = "new_dcrSabah1B01";
				}
				break;

			case "Contractor PM":
				if ($this->currProjectOwner == "JKR_SABAH") {
					$temp_DCR_IdLink = "new_dcrSabah1B02";
				}
				break;
		
		};
		$ret = array(
			'temp_NOI_IdLink' => $temp_NOI_IdLink,
			'temp_NCR_IdLink' => $temp_NCR_IdLink,
			'temp_SD_IdLink' => $temp_SD_IdLink,
			'temp_DCR_IdLink' => $temp_DCR_IdLink,


		);
		return $ret;	
	}

	private function loadAssetUrl(){
		$jsonPrefix = $this->getJsonDatalistSrcPrefix('asset');
		$userviewPrefix = $this->getUserviewSrcPrefix('asset');

		// dashboard linking to conOp
		// need to handle link between parent and package
		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->currPackageId;
			$packageUuidIdConOp = '{?}';
		}else{
			$projectIdConOp = $this->currProjectId;
			$packageUuidIdConOp = $this->currPackageUuid;
		}

		$empty ="";
		$asset_list_networkSite = $userviewPrefix."list_networkSite?d-3183790-fn_c_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
		$asset_list_networkSection = $userviewPrefix."list_networkSection?d-2075694-fn_c_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
		$asset_list_bridge = $userviewPrefix."list_bridge?d-3004726-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&d-3004726-fn_asset_id=".$empty."&d-3004726-fn_asset_name=".$empty."&d-3004726-fn_river_navigable=".$empty."&d-3004726-fn_asset_status=".$empty."&d-3004726-fn_bridge_type=".$empty."&d-3004726-fn_asset_position=".$empty."&d-3004726-fn_asset_position=".$empty;
		$asset_list_culvert = $userviewPrefix."list_culvert?d-627894-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&d-627894-fn_asset_id=".$empty."&d-627894-fn_asset_name=".$empty."&d-627894-fn_culvert_type=".$empty."&d-627894-fn_asset_status=".$empty."&d-627894-fn_chainage=".$empty."&d-627894-fn_asset_position=".$empty;
		$asset_list_drainage = $userviewPrefix."list_drainage?package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&d-1880108-fn_asset_id=".$empty."&d-1880108-fn_asset_status=".$empty."&d-1880108-fn_drainage_type=".$empty."&d-1880108-fn_asset_position=".$empty;
		$asset_list_pavement = $userviewPrefix."list_pavement?d-1898783-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&d-1898783-fn_asset_id=".$empty."&d-1898783-fn_asset_status=".$empty."&d-1898783-fn_pavement_type=".$empty."&d-1898783-fn_asset_position=".$empty;
		$asset_list_furniture = $userviewPrefix."list_furniture?d-5673989-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&d-5673989-fn_asset_id=".$empty."&d-5673989-fn_asset_status=".$empty."&d-5673989-fn_road_furniture_type=".$empty."&d-5673989-fn_chainage=".$empty."&d-5673989-fn_asset_position=".$empty;
		$asset_list_slope = $userviewPrefix."list_slope?d-6595250-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&d-6595250-fn_asset_id=".$empty."&d-6595250-fn_asset_status=".$empty."&d-6595250-fn_slope_type=".$empty."&d-6595250-fn_asset_position=".$empty;
		$asset_list_electrical = $userviewPrefix."list_electrical?d-131717-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&d-131717-fn_asset_id=".$empty."&d-131717-fn_asset_status=".$empty."&d-131717-fn_electrical_type=".$empty."&d-131717-fn_asset_position=".$empty;
		
		//notifications & inbox
		$asset_json_datalist_notificationsv3 = $jsonPrefix."inbox_general_v3?d-8079515-fn_package_uuid=".$this->currPackageUuid."&d-8079515-fn_ResourceId=".$this->currUserEmail;
		$asset_json_datalist_notifications = $jsonPrefix."inbox_general?start=0&rows=5&d-920573-fn_package_uuid=".$this->currPackageUuid."&d-920573-fn_ResourceId=".$this->currUserEmail; //getJogetNotifications()
		$asset_json_open_inbox = $userviewPrefix."inbox_general/?";
		$asset_inbox_bridge = $userviewPrefix."inboxBridgeAssessment?d-5904326-fn_package_uuid=".$this->currPackageUuid."&d-5904326-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_culvert = $userviewPrefix."inboxCulvertAssessment?d-7535314-fn_package_uuid=".$this->currPackageUuid."&d-7535314-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_drainage = $userviewPrefix."inboxDrainageAssessment?d-8090204-fn_package_uuid=".$this->currPackageUuid."&d-8090204-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_roadfurniture = $userviewPrefix."inboxFurnitureAssessment?d-2476681-fn_package_uuid=".$this->currPackageUuid."&d-2476681-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_pavement = $userviewPrefix."inboxPavementAssessment?d-3534023-fn_package_uuid=".$this->currPackageUuid."&d-3534023-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_slope = $userviewPrefix."inboxSlopeAssessment?d-3023902-fn_package_uuid=".$this->currPackageUuid."&d-3023902-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_nod = $userviewPrefix."inboxNod?d-3636104-fn_package_uuid=".$this->currPackageUuid."&d-3636104-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_nod_emergency = $userviewPrefix."inboxNodEmergency?d-3769126-fn_package_uuid=".$this->currPackageUuid."&d-3769126-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_ncp = $userviewPrefix."inboxNCP?d-3636080-fn_package_uuid=".$this->currPackageUuid."&d-3636080-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_rfi = $userviewPrefix."inboxRFI?d-3636118-fn_package_uuid=".$this->currPackageUuid."&d-3636118-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_nod_routine = $userviewPrefix."inboxNodRoutine?d-7997629-fn_package_uuid=".$this->currPackageUuid."&d-7997629-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_schedule_inspection = $userviewPrefix."inboxScheduleInspection?d-3492269-fn_package_uuid=".$this->currPackageUuid."&d-3492269-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_site_routine = $userviewPrefix."inboxSiteRoutine?d-8061043-fn_package_uuid=".$this->currPackageUuid."&d-8061043-fn_ResourceId=".$this->currUserEmail;
		
		//dashboard ASSET
		$dash_asset_bridge = $jsonPrefix."list_bridgeDash?d-6460918-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_culvert = $jsonPrefix."list_culvertDash?d-2787466-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_drainage = $jsonPrefix."list_drainDash?d-7754495-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_pavement = $jsonPrefix."list_pavementDash?d-1190655-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_road_furniture = $jsonPrefix."list_roadFurnitureDash?d-3811589-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_slope = $jsonPrefix."list_slopeDash?d-7850966-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_electrical = $jsonPrefix."list_electricalDash?d-4490005-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_section = $jsonPrefix."list_networkDash?d-3183313-fn_c_package_uuid={?}&d-3183313-fn_project_id={?}";
		$dash_asset_nod = $jsonPrefix."list_nod_dashboard?d-3743869-fn_package_uuid={?}&project_id={?}";
		$dash_asset_nod_apj = $jsonPrefix."list_nod_dashboard_apj?d-1267381-fn_package_uuid={?}&project_id={?}";
		$dash_asset_nod_apj_ttl = $jsonPrefix."list_total_apj?d-7865377-fn_package_uuid={?}&project_id={?}";
		$dash_asset_nod_kpj_ttl = $jsonPrefix."list_total_kpj?d-7865467-fn_package_uuid={?}&project_id={?}";
		$dash_asset_workInstruct = $jsonPrefix."list_workInstruct_dash?d-1717851-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_ncp = $jsonPrefix."list_ncp_dash?d-2598601-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_nodHeavy = $jsonPrefix."list_nodHeavy_dash?d-3303506-fn_c_package_uuid={?}&project_id={?}";
		$dash_asset_wo = $jsonPrefix."list_wo_status_dash?d-1039439-fn_package_uuid={?}&project_id={?}";
		$dash_asset_rfi_ttl = $jsonPrefix."list_wo_rfi_dash?d-3754012-fn_package_uuid={?}&project_id={?}";
		
		//inspection list
		$asset_insp_abutment = $userviewPrefix."list_insp_inv_bridge_abutment?d-7722439-fn_package_uuid=".$this->currPackageUuid."&d-7722439-fn_inv_bridge.asset_name=".$empty."&d-7722439-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_beamgirder = $userviewPrefix."list_insp_inv_bridge_beam?d-613088-fn_package_uuid=".$this->currPackageUuid."&d-613088-fn_inv_bridge.asset_name=".$empty."&d-613088-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_bearing = $userviewPrefix."list_insp_inv_bridge_bearing?d-8166281-fn_package_uuid=".$this->currPackageUuid."&d-8166281-fn_inv_bridge.asset_name=".$empty."&d-8166281-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_deckslab = $userviewPrefix."list_insp_inv_bridge_deck_slab?d-7725388-fn_package_uuid=".$this->currPackageUuid."&d-7725388-fn_inv_bridge.asset_name=".$empty."&d-7725388-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_drainpipes = $userviewPrefix."list_insp_inv_bridge_drainpipe?d-6427945-fn_package_uuid=".$this->currPackageUuid."&d-6427945-fn_inv_bridge.asset_name=".$empty."&d-6427945-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_expansionjoint = $userviewPrefix."list_insp_inv_bridge_expansion_joint?d-320244-fn_package_uuid=".$this->currPackageUuid."&d-320244-fn_inv_bridge.asset_name=".$empty."&d-320244-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_parapet = $userviewPrefix."list_insp_inv_bridge_parapet?d-8176482-fn_package_uuid=".$this->currPackageUuid."&d-8176482-fn_inv_bridge.asset_name=".$empty."&d-8176482-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_pier = $userviewPrefix."list_insp_inv_bridge_pier?d-613519-fn_package_uuid=".$this->currPackageUuid."&d-613519-fn_inv_bridge.asset_name=".$empty."&d-613519-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_slopeprotectionriverbank = $userviewPrefix."list_insp_inv_bridge_slope?d-1841066-fn_package_uuid=".$this->currPackageUuid."&d-1841066-fn_inv_bridge.asset_name=".$empty."&d-1841066-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_surfacing = $userviewPrefix."list_insp_inv_bridge_surfacing?d-6543177-fn_package_uuid=".$this->currPackageUuid."&d-6543177-fn_inv_bridge.asset_name=".$empty."&d-6543177-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_hydrauliccapacity = $userviewPrefix."list_insp_inv_bridge_hydraulic?d-7142472-fn_package_uuid=".$this->currPackageUuid."&d-7142472-fn_inv_bridge.asset_name=".$empty."&d-7142472-fn_inv_bridge.asset_id=".$empty;
		$asset_insp_anticlimbfence = $userviewPrefix."list_insp_inv_furn_anti_climb_fence?d-1245235-fn_package_uuid=".$this->currPackageUuid."&d-1245235-fn_asset_id=".$empty;
		$asset_insp_crashcushion = $userviewPrefix."list_insp_inv_furn_crash_cusion?d-4508097-fn_package_uuid=".$this->currPackageUuid."&d-4508097-fn_asset_id=".$empty;
		$asset_insp_culvertmarker = $userviewPrefix."list_insp_inv_furn_culvert_marker?d-8331436-fn_package_uuid=".$this->currPackageUuid."&d-8331436-fn_asset_id=".$empty;
		$asset_insp_flexisidepost = $userviewPrefix."list_insp_inv_furn_flex_post?d-5445288-fn_package_uuid=".$this->currPackageUuid."&d-5445288-fn_asset_id=".$empty;
		$asset_insp_guardrail = $userviewPrefix."list_insp_inv_furn_guardrail?d-1466218-fn_package_uuid=".$this->currPackageUuid."&d-1466218-fn_asset_id=".$empty;
		$asset_insp_hectometermarker = $userviewPrefix."list_insp_inv_furn_hectometer_marker?d-4321761-fn_package_uuid=".$this->currPackageUuid."&d-4321761-fn_asset_id=".$empty;
		$asset_insp_kilometermarker = $userviewPrefix."list_insp_inv_furn_kilometer_marker?d-872381-fn_package_uuid=".$this->currPackageUuid."&d-872381-fn_asset_id=".$empty;
		$asset_insp_rightfence = $userviewPrefix."list_insp_inv_furn_right_of_way?d-6063325-fn_package_uuid=".$this->currPackageUuid."&d-6063325-fn_asset_id=".$empty;
		$asset_insp_rivermarker = $userviewPrefix."list_insp_inv_furn_river_marker?d-5331913-fn_package_uuid=".$this->currPackageUuid."&d-5331913-fn_asset_id=".$empty;
		$asset_insp_roadmarking = $userviewPrefix."list_insp_inv_furn_road_marking?d-5289116-fn_package_uuid=".$this->currPackageUuid."&d-5289116-fn_asset_id=".$empty;
		$asset_insp_roadstud = $userviewPrefix."list_insp_inv_furn_roadstud?d-3303933-fn_package_uuid=".$this->currPackageUuid."&d-3303933-fn_asset_id=".$empty;
		$asset_insp_signboard = $userviewPrefix."list_insp_inv_furn_signboard?d-1521884-fn_package_uuid=".$this->currPackageUuid."&d-1521884-fn_asset_id=".$empty;
		$asset_insp_steelbarricades = $userviewPrefix."list_insp_inv_furn_steel_barricades?d-12744-fn_package_uuid=".$this->currPackageUuid."&d-12744-fn_asset_id=".$empty;
		$asset_insp_wirerope = $userviewPrefix."list_insp_inv_furn_wire_rope?d-3313756-fn_package_uuid=".$this->currPackageUuid."&d-3313756-fn_asset_id=".$empty;

		//assessment list
		$asset_assess_bridge = $userviewPrefix."list_assessmentSubmitBridge?d-2185017-fn_package_uuid=".$this->currPackageUuid."&d-2185017-fn_asset_name=".$empty;
		$asset_assess_culvert = $userviewPrefix."list_assessmentSubmitCulvert?d-366977-fn_package_uuid=".$this->currPackageUuid."&d-366977-fn_asset_id=".$empty;
		$asset_assess_drainage = $userviewPrefix."list_assessmentSubmitDrainage?d-4651643-fn_package_uuid=".$this->currPackageUuid."&d-4651643-fn_asset_id=".$empty."&d-4651643-fn_id=".$empty;
		$asset_assess_roadfurniture = $userviewPrefix."assessment_furniture?package_uuid=".$this->currPackageUuid;
		$asset_assess_pavement = $userviewPrefix."list_assessmentSubmitPavement?d-3132916-fn_package_uuid=".$this->currPackageUuid."&d-3132916-fn_asset_id=".$empty;
		$asset_assess_slope = $userviewPrefix."list_assessmentSubmitSlope?d-3876245-fn_c_package_uuid=".$this->currPackageUuid."&d-3876245-fn_c_asset_id=".$empty;
		
		//condition list
		$asset_condition_bridge_component = $userviewPrefix."list_condition_bridge_component?d-6030422-fn_package_uuid=".$this->currPackageUuid."&d-6030422-fn_asset_id=".$empty."&d-6030422-fn_asset_name=".$empty."&d-6030422-fn_component=".$empty."&d-6030422-fn_defect_present=".$empty."&d-6030422-fn_severity=".$empty."&d-6030422-fn_damage_rating=".$empty."&d-6030422-fn_action=".$empty;
		$asset_condition_bridge_overall = $userviewPrefix."list_condition_bridge?d-1365843-fn_package_uuid=".$this->currPackageUuid."&d-1365843-fn_asset_id=".$empty."&d-1365843-fn_asset_name=".$empty."&d-1365843-fn_component=".$empty."&d-1365843-fn_rating_old=".$empty."&d-1365843-fn_rating_new=".$empty."&d-1365843-fn_action=".$empty;
		$asset_condition_culvert = $userviewPrefix."list_condition_culvert?d-5647119-fn_package_uuid=".$this->currPackageUuid."&d-5647119-fn_asset_id=".$empty."&d-5647119-fn_asset_name=".$empty."&d-5647119-fn_component=".$empty."&d-5647119-fn_component_condition=".$empty."&d-5647119-fn_blockage=".$empty."&d-5647119-fn_culvert_condition=".$empty."&d-5647119-fn_action=".$empty;
		$asset_condition_drainage = $userviewPrefix."list_condition_drainage?d-160567-fn_package_uuid=".$this->currPackageUuid."&d-160567-fn_asset_id=".$empty."&d-160567-fn_structure_condition=".$empty."&d-160567-fn_debris=".$empty."&d-160567-fn_base_condition=".$empty."&d-160567-fn_vegetation=".$empty."&d-160567-fn_drainage_condition=".$empty."&d-160567-fn_action=".$empty;
		$asset_condition_roadfurniture= $userviewPrefix."list_condition_furniture?d-515366-fn_package_uuid=".$this->currPackageUuid."&d-515366-fn_location_form=".$empty."&d-515366-fn_location_to=".$empty."&d-515366-fn_defect_category=".$empty."&d-515366-fn_road_furniture_type=".$empty."&d-515366-fn_action_required=".$empty."&d-515366-fn_action=".$empty;
		$asset_condition_pavement = $userviewPrefix."list_condition_pavement?d-179242-fn_package_uuid=".$this->currPackageUuid."&d-179242-fn_asset_id=".$empty."&d-179242-fn_defect=".$empty."&d-179242-fn_pavement_condition=".$empty."&d-179242-fn_chainage_start=".$empty."&d-179242-fn_chainage_end=".$empty."&d-179242-fn_location=".$empty."&d-179242-fn_action=".$empty;
		$asset_condition_slope = $userviewPrefix."list_condition_slope?d-4356739-fn_c_package_uuid=".$this->currPackageUuid."&d-4356739-fn_c_asset_id=".$empty."&d-4356739-fn_c_feature_type=".$empty."&d-4356739-fn_c_severity_code=".$empty."&d-4356739-fn_c_action=".$empty;
		
		//assesment view list
		$asset_assess_view_bridge = $userviewPrefix."list_assessmentSubmitBridgeView?d-829298-fn_package_uuid=".$this->currPackageUuid."&d-829298-fn_asset_id=".$empty."&d-829298-fn_asset_name=".$empty."&d-829298-fn_action=".$empty;
		$asset_assess_view_culvert = $userviewPrefix."list_assessmentSubmitCulvertView?d-4563002-fn_package_uuid=".$this->currPackageUuid."&d-4563002-fn_culvert_id=".$empty."&d-4563002-fn_culvert_name=".$empty."&d-4563002-fn_current_action=".$empty;
		$asset_assess_view_drainage = $userviewPrefix."list_assessmentSubmitDrainageView?d-7688020-fn_package_uuid=".$this->currPackageUuid."&d-7688020-fn_drainage_id=".$empty."&d-7688020-fn_current_action=".$empty;
		$asset_assess_view_roadfurniture = $userviewPrefix."list_assessmentSubmitFurnitureView?d-5101239-fn_package_uuid=".$this->currPackageUuid."&d-5101239-fn_current_action=".$empty; // this opens to the assessment form rather than list - process start form
		$asset_assess_view_pavement = $userviewPrefix."list_assessmentSubmitPavementView?d-2111645-fn_package_uuid=".$this->currPackageUuid."&d-2111645-fn_pavement_id=".$empty."&d-2111645-fn_current_action=".$empty;
		$asset_assess_view_slope = $userviewPrefix."list_assessmentSubmitSlopeView?d-3601038-fn_c_package_uuid=".$this->currPackageUuid."&d-3601038-fn_c_asset_id=".$empty."&d-3601038-fn_c_action=".$empty;
		
		//notification of Defects
		$asset_NotificationOfDefect = $userviewPrefix."list_nod?d-1846919-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_NotificationOfDefectEmergency = $userviewPrefix."list_nod_emergency?d-3769126-fn_package_uuid=".$this->currPackageUuid."&d-3769126-fn_ref_no=".$empty."&d-3769126-fn_nod_type=".$empty."&d-3769126-fn_year=".$empty;
		$asset_maint_view_nod_periodic = $userviewPrefix."list_nod_periodic?package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_maint_view_nod_emergency = $userviewPrefix."list_nod_emergency?package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;

		//notification of Damage
		$asset_NotificationOfDamage = $userviewPrefix."list_nodRoutine?d-6657964-fn_package_uuid=".$this->currPackageUuid."&d-6657964-fn_ref_no=".$empty."&d-6657964-fn_month=".$empty."&d-6657964-fn_year=".$empty;
		
		//Pictorial Report
		$asset_PictorialReport = $userviewPrefix."list_pict_report?d-4323255-fn_package_uuid=".$this->currPackageUuid."&d-4323255-fn_c_activity=".$empty; //sarawak
		$asset_PictorialReport_sbh = $userviewPrefix."list_pict_report_sbh?d-6254725-fn_package_uuid=".$this->currPackageUuid."&d-6254725-fn_c_activity=".$empty; //sabah
		
		//Non Conformance Product
		$asset_NonConformanceProduct = $userviewPrefix."list_ncp?d-4015084-fn_package_uuid=".$this->currPackageUuid."&d-4015084-fn_ref_no=".$empty."&d-4015084-fn_category=".$empty."&d-4015084-fn_maintenance_category=".$empty."&d-4015084-fn_verification_rectification=".$empty."&d-4015084-fn_status=".$empty."&d-4015084-fn_dateCreated=".$empty."&d-4015084-fn_dateCreated=".$empty;
		
		//Request for Inspection
		$asset_RequestForInspection = $userviewPrefix."list_rfi?d-4015122-fn_package_uuid=".$this->currPackageUuid."&d-4015122-fn_c_status=".$empty."&d-4015122-fn_ref_no=".$empty;
		
		//LPA
		$asset_LPA = $userviewPrefix."list_lpa?d-4015090-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		
		//site routine report
		$asset_site_routine = $userviewPrefix."list_site_routine_inspection?d-7271054-fn_c_package_uuid=".$this->currPackageUuid;
		
		//Defect Detection
		$asset_defect_detection = $userviewPrefix."list_defect?d-565738-fn_package_uuid=".$this->currPackageUuid."&d-565738-fn_category=".$empty; //sarawak
		$asset_defect_detection_sbh = $userviewPrefix."list_defect_sbh?d-3885736-fn_package_uuid=".$this->currPackageUuid."&d-3885736-fn_category=".$empty; //sabah
		
		//asset conop link from dashboard
		$asset_dash_NonConformanceProduct = $userviewPrefix."list_ncp?d-4015084-fn_project_id=".$projectIdConOp."&d-4015084-fn_package_uuid=".$packageUuidIdConOp."&d-4015084-fn_category=".$empty."&d-4015084-fn_maintenance_category=".$empty."&d-4015084-fn_ref_no=".$empty."&d-4015084-fn_dateCreated={?}&d-4015084-fn_dateCreated={?}&d-4015084-fn_ncp_status={?}";
		$asset_dash_NCP_status = $userviewPrefix."list_ncp?d-4015084-fn_project_id=".$projectIdConOp."&d-4015084-fn_package_uuid=".$packageUuidIdConOp."&d-4015084-fn_category=".$empty."&d-4015084-fn_maintenance_category=".$empty."&d-4015084-fn_ref_no=".$empty."&d-4015084-fn_dateCreated={?}&d-4015084-fn_dateCreated={?}&d-4015084-fn_ncp_status={?}&d-4015084-fn_verification_rectification={?}";
		$asset_dash_NCP_routine = $userviewPrefix."list_ncp?d-4015084-fn_project_id=".$projectIdConOp."&d-4015084-fn_package_uuid=".$packageUuidIdConOp."&d-4015084-fn_category=".$empty."&d-4015084-fn_maintenance_category={?}&d-4015084-fn_ref_no=".$empty."&d-4015084-fn_dateCreated={?}&d-4015084-fn_dateCreated={?}&d-4015084-fn_ncp_status={?}&d-4015084-fn_scope={?}";
		$asset_dash_work_instruction = $userviewPrefix."list_workInstruction?d-1123026-fn_project_id=".$projectIdConOp."&d-1123026-fn_package_uuid=".$packageUuidIdConOp."&d-1123026-fn_ref_no=&d-1123026-fn_type_of_activity={?}&d-1123026-fn_work_date={?}&d-1123026-fn_work_date={?}&d-1123026-fn_wi_status={?}";
		$asset_dash_NotificationOfDefect = $userviewPrefix."list_nod?d-4015108-fn_project_id=".$projectIdConOp."&d-4015108-fn_package_uuid=".$packageUuidIdConOp."&d-4015108-fn_ref_no=".$empty."&d-4015108-fn_nod_type=".$empty."&d-4015108-fn_year=".$empty."&d-4015108-fn_dateCreated={?}&d-4015108-fn_dateCreated={?}&d-4015108-fn_asset_type={?}";
		$asset_dash_NOD_status = $userviewPrefix."list_nod?d-4015108-fn_project_id=".$projectIdConOp."&d-4015108-fn_package_uuid=".$packageUuidIdConOp."&d-4015108-fn_ref_no=".$empty."&d-4015108-fn_nod_type=".$empty."&d-4015108-fn_year=".$empty."&d-4015108-fn_dateCreated={?}&d-4015108-fn_dateCreated={?}&d-4015108-fn_asset_type={?}&d-4015108-fn_approval_status={?}";
		$asset_dash_workorder = $userviewPrefix."list_workOrder?d-7884198-fn_project_id=".$projectIdConOp."&d-7884198-fn_package_uuid=".$packageUuidIdConOp."&d-7884198-fn_dateCreated={?}&d-7884198-fn_dateCreated={?}&d-7884198-fn_wo_status={?}";
		$asset_dash_wo = $userviewPrefix."list_workOrder?d-7884198-fn_project_id=".$projectIdConOp."&d-7884198-fn_package_uuid=".$packageUuidIdConOp."&d-7884198-fn_dateCreated={?}&d-7884198-fn_dateCreated={?}&d-7884198-fn_asset_type={?}";
		$asset_dash_wo_status = $userviewPrefix."list_workOrder?d-7884198-fn_project_id=".$projectIdConOp."&d-7884198-fn_package_uuid=".$packageUuidIdConOp."&d-7884198-fn_dateCreated={?}&d-7884198-fn_dateCreated={?}&d-7884198-fn_asset_type={?}&d-7884198-fn_status={?}";
		
		//dashboard conOp Link
		$dash_asset_bridge_card = $userviewPrefix."list_bridgeDashboard?d-3244120-fn_c_package_uuid=".$packageUuidIdConOp."&d-3244120-fn_c_project_id=".$projectIdConOp."&d-3244120-fn_c_division={?}";
		$dash_asset_slope_card = $userviewPrefix."list_slopeDashboard?d-6786104-fn_c_package_uuid=".$packageUuidIdConOp."&d-6786104-fn_c_project_id=".$projectIdConOp."&d-6786104-fn_c_division={?}";
		$dash_asset_drainage_card = $userviewPrefix."list_drainDashboard?d-7474270-fn_c_package_uuid=".$packageUuidIdConOp."&d-7474270-fn_c_project_id=".$projectIdConOp."&d-7474270-fn_c_division={?}";
		$dash_asset_culvert_card = $userviewPrefix."list_culvertDashboard?d-7684396-fn_c_package_uuid=".$packageUuidIdConOp."&d-7684396-fn_c_project_id=".$projectIdConOp."&d-7684396-fn_c_division={?}";
		$dash_asset_pavement_card = $userviewPrefix."list_pavementDashboard?d-4171825-fn_c_package_uuid=".$packageUuidIdConOp."&d-4171825-fn_c_project_id=".$projectIdConOp."&d-4171825-fn_c_division={?}";
		$dash_asset_road_furniture_card = $userviewPrefix."list_roadFurnitureDashboard?d-6752279-fn_c_package_uuid=".$packageUuidIdConOp."&d-6752279-fn_c_project_id=".$projectIdConOp."&d-6752279-fn_c_road_furniture_type={?}&d-6752279-fn_c_division={?}";
		$dash_asset_electrical_card = $userviewPrefix."list_electricalDashboard?d-2983719-fn_c_package_uuid=".$packageUuidIdConOp."&d-2983719-fn_c_project_id=".$projectIdConOp."&d-2983719-fn_c_division={?}";
		$dash_asset_section_card = $userviewPrefix."list_networkDashboard?d-6193571-fn_c_package_uuid=".$packageUuidIdConOp."&d-6193571-fn_c_project_id=".$projectIdConOp."";

		$dash_asset_nod_apj_card = $userviewPrefix."list_nod_apjDashboard?d-3211906-fn_package_uuid=".$packageUuidIdConOp."&d-3211906-fn_project_id=".$projectIdConOp."&d-3211906-fn_keutamaan={?}&d-3211906-fn_id={?}&d-3211906-fn_nod_date={?}&d-3211906-fn_nod_date={?}";
		$dash_asset_nod_kpj_card = $userviewPrefix."list_nod_kpjDashboard?d-3219196-fn_package_uuid=".$packageUuidIdConOp."&d-3219196-fn_project_id=".$projectIdConOp."&d-3219196-fn_keutamaan={?}&d-3219196-fn_id={?}&d-3219196-fn_nod_date={?}&d-3219196-fn_nod_date={?}";
		$dash_asset_nod_apj_ttl_card = $userviewPrefix."list_total_apjDashboard?d-7953095-fn_package_uuid=".$packageUuidIdConOp."&d-7953095-fn_project_id=".$projectIdConOp."&d-7953095-fn_nod_date={?}&d-7953095-fn_nod_date={?}";
		$dash_asset_nod_kpj_ttl_card = $userviewPrefix."list_total_kpjDashboard?d-7960385-fn_package_uuid=".$packageUuidIdConOp."&d-7960385-fn_project_id=".$projectIdConOp."&d-7960385-fn_nod_date={?}&d-7960385-fn_nod_date={?}";

		$dash_asset_workInstructCyclic_card = $userviewPrefix."list_workInstructDashboardCyclic?d-7339533-fn_c_package_uuid=".$packageUuidIdConOp."&d-7339533-fn_c_project_id=".$projectIdConOp."&d-7339533-fn_c_type_of_activity={?}&d-7339533-fn_c_wi_status={?}&d-7339533-fn_c_work_date={?}&d-7339533-fn_c_work_date={?}&d-7339533-fn_c_activity={?}";
		$dash_asset_workInstructNonCyclic_card = $userviewPrefix."list_workInstructDashboardNonCyclic?d-5280446-fn_c_package_uuid=".$packageUuidIdConOp."&d-5280446-fn_c_project_id=".$projectIdConOp."&d-5280446-fn_c_type_of_activity={?}&d-5280446-fn_c_wi_status={?}&d-5280446-fn_c_work_date={?}&d-5280446-fn_c_work_date={?}&d-5280446-fn_c_activity={?}";
		$dash_asset_ncp_card = $userviewPrefix."list_ncp_dashboard?d-774939-fn_c_package_uuid=".$packageUuidIdConOp."&d-774939-fn_c_project_id=".$projectIdConOp."&d-774939-fn_dateCreated={?}&d-774939-fn_dateCreated={?}&d-774939-fn_c_maintenance_category={?}&d-774939-fn_status_dash={?}&d-774939-fn_c_verification_rectification={?}&d-774939-fn_c_scope={?}";
		$dash_asset_ncp_dashcard = $userviewPrefix."list_ncp_listDash?d-3916215-fn_c_package_uuid=".$packageUuidIdConOp."&d-3916215-fn_c_project_id=".$projectIdConOp."&d-3916215-fn_dateCreated={?}&d-3916215-fn_dateCreated={?}&d-3916215-fn_c_maintenance_category={?}&d-3916215-fn_status_dash={?}&d-3916215-fn_c_verification_rectification={?}&d-3916215-fn_c_scope={?}";
		
		$dash_asset_nodHeavy_card = $userviewPrefix."list_nodHeavy_dashboard?d-7540596-fn_c_package_uuid=".$packageUuidIdConOp."&d-7540596-fn_c_project_id=".$projectIdConOp."";
		$dash_asset_wo_card = $userviewPrefix."list_wo_status_dashboard?d-311937-fn_package_uuid=".$packageUuidIdConOp."&project_id=".$projectIdConOp."&d-311937-fn_asset_catg={?}&d-311937-fn_status_action={?}&d-311937-fn_dateCreated={?}&d-311937-fn_dateCreated={?}";
		$dash_asset_rfi_ttl_card = $userviewPrefix."list_wo_rfi_dashboard?d-2088542-fn_package_uuid=".$packageUuidIdConOp."&project_id=".$projectIdConOp."&d-2088542-fn_contract_no={?}&d-2088542-fn_contract_name={?}";

		//Schedule Inspection
		$asset_ScheduleInspection = $userviewPrefix."list_schedule_inspection?d-5068073-fn_package_uuid=".$this->currPackageUuid."&d-5068073-fn_year=".$empty."&d-5068073-fn_month=".$empty; //sarawak
		$asset_ScheduleInspection_sbh = $userviewPrefix."list_schedule_inspection_sbh?d-7864727-fn_package_uuid=".$this->currPackageUuid."&d-7864727-fn_year=".$empty."&d-7864727-fn_month=".$empty; //sabah
		
		//inspection form from floatbox
		$asset_insp_form_bridge = $userviewPrefix. "list_insp_inv_bridge?d-6596122-fn_package_uuid=".$this->currPackageUuid; // bridge inspection opens to a list and not form as got several components
		$asset_insp_form_culvert = $userviewPrefix."insp_culvert?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_pavement = $userviewPrefix."insp_pavement?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_drainage = $userviewPrefix."insp_drainage?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_slope = $userviewPrefix."insp_slope?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;

		$asset_insp_form_anticlimbfence = $userviewPrefix."insp_furn_anti_climb_fence?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_crashcushion = $userviewPrefix."insp_furn_crash_cushion?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_culvertmarker = $userviewPrefix."insp_furn_culvert_marker?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_flexisidepost = $userviewPrefix."insp_furn_flexible_post?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_guardrail = $userviewPrefix."insp_furn_guardrail?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_hectometermarker = $userviewPrefix."insp_furn_hectometer_marker?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_kilometermarker = $userviewPrefix."insp_furn_kilometer_marker?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_rightfence = $userviewPrefix."insp_furn_right_of_way?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_rivermarker = $userviewPrefix."insp_furn_river_marker?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_roadmarking = $userviewPrefix."insp_furn_road_marking?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_roadstud = $userviewPrefix."insp_furn_roadstud?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_signboard = $userviewPrefix."insp_furn_signboard?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_steelbarricades = $userviewPrefix."insp_furn_steel_barricades?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_wirerope = $userviewPrefix."insp_furn_wire_rope?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
	
		//submit process url
		if($this->currProjectOwner == "JKR_SARAWAK"){

			$asset_maintain_rfi = $userviewPrefix."rfi?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_maintain_ncp = $userviewPrefix."ncp?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_maintain_schedule_inspection = $userviewPrefix."schedule_inspection?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
			$asset_submit_maint_work_program =  $userviewPrefix."work_program_submission?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_create_defect_detection =  $userviewPrefix."create_defect?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_create_NODefect =  $userviewPrefix."create_nod?d-570502-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_maintain_site_routine = $userviewPrefix."site_routine_inspection?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
			$asset_submit_work_order =  $userviewPrefix."work_order_periodic?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_submit_maint_noe =  $userviewPrefix."noe?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_submit_maint_work_daily_report =  $userviewPrefix."daily_work?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_submit_work_budget_approval =  $userviewPrefix."wbPeriodic?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_insp_bridge = $userviewPrefix."list_insp_inv_bridge?d-6596122-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_insp_culvert = $userviewPrefix."list_insp_inv_culvert?d-4254305-fn_package_uuid=".$this->currPackageUuid."&d-4254305-fn_asset_id=".$empty."&project_owner=".$this->currProjectOwner;
			$asset_insp_drainage = $userviewPrefix."list_insp_inv_drainage?d-4759361-fn_package_uuid=".$this->currPackageUuid."&d-4759361-fn_asset_id=".$empty."&project_owner=".$this->currProjectOwner;
			$asset_insp_pavement = $userviewPrefix."list_insp_inv_pavement?d-3658546-fn_package_uuid=".$this->currPackageUuid."&d-3658546-fn_asset_id=".$empty."&project_owner=".$this->currProjectOwner;
			$asset_insp_roadfurniture = $userviewPrefix."asset_furniture_process?package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&package_name=".$this->currPackageName."&project_id=".$this->currProjectId."&project_owner=".$this->currProjectOwner;
			$asset_insp_slope = $userviewPrefix."list_insp_inv_slope?d-4770194-fn_package_uuid=".$this->currPackageUuid."&d-4770194-fn_asset_id=".$empty."&project_owner=".$this->currProjectOwner;
			$asset_submit_maint_gar =  $userviewPrefix."gar?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_manage_maint_equipment = $userviewPrefix."EquipmentLookup?d-6421139-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;

		}else if($this->currProjectOwner == "JKR_SABAH"){

			$asset_maintain_rfi_sabah = $userviewPrefix."rfi_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_maintain_ncp_sabah = $userviewPrefix."ncp_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_maintain_schedule_inspection_sabah = $userviewPrefix."schedule_inspection_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
			$asset_submit_maint_work_program_sabah =  $userviewPrefix."work_program_submission_sbh?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_create_defect_detection =  $userviewPrefix."create_defect?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_create_NODefect =  $userviewPrefix."create_nod?d-570502-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_maintain_site_routine = $userviewPrefix."site_routine_inspection?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
			$asset_submit_work_order_sabah =  $userviewPrefix."wo_periodic_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_submit_maint_noe_sabah =  $userviewPrefix."new_noe_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_submit_maint_work_daily_report =  $userviewPrefix."daily_work?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
			$asset_submit_work_budget_approval =  $userviewPrefix."wbPeriodic?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_insp_bridge = $userviewPrefix."list_insp_inv_bridge?d-6596122-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$asset_insp_culvert = $userviewPrefix."list_insp_inv_culvert?d-4254305-fn_package_uuid=".$this->currPackageUuid."&d-4254305-fn_asset_id=".$empty."&project_owner=".$this->currProjectOwner;
			$asset_insp_drainage = $userviewPrefix."list_insp_inv_drainage?d-4759361-fn_package_uuid=".$this->currPackageUuid."&d-4759361-fn_asset_id=".$empty."&project_owner=".$this->currProjectOwner;
			$asset_insp_pavement = $userviewPrefix."list_insp_inv_pavement?d-3658546-fn_package_uuid=".$this->currPackageUuid."&d-3658546-fn_asset_id=".$empty."&project_owner=".$this->currProjectOwner;
			$asset_insp_roadfurniture = $userviewPrefix."assessment_furniture_sabah?package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&package_name=".$this->currPackageName."&project_id=".$this->currProjectId."&project_owner=".$this->currProjectOwner;
			$asset_insp_slope = $userviewPrefix."list_insp_inv_slope?d-4770194-fn_package_uuid=".$this->currPackageUuid."&d-4770194-fn_asset_id=".$empty."&project_owner=".$this->currProjectOwner;
			$asset_manage_maint_equipment = $userviewPrefix."EquipmentLookup_sbh?d-22561-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;

		}

		//maintenance right click menu
		$asset_maintain_nod = $userviewPrefix."nod?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_maintain_nod_emergency = $userviewPrefix."nod_emergency?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_manage_maint_work_activity =  $userviewPrefix."list_maintenanceActivity?d-7779575-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
		$asset_manage_maint_work_activity_sabah =  $userviewPrefix."list_maintenanceActivity_sabah?d-647463-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
		$asset_manage_maint_work_instruction =  $userviewPrefix."list_workInstructionManage?d-5021799-fn_package_uuid=".$this->currPackageUuid."&d-5021799-fn_ref_no=&d-5021799-fn_type_of_activity=";
		$asset_manage_maint_work_instruction_sabah =  $userviewPrefix."list_workInstructionManage_sabah?d-3494679-fn_package_uuid=".$this->currPackageUuid."&d-3494679-fn_ref_no=&d-3494679-fn_type_of_activity=";
		$asset_inbox_maint_work_program =  $userviewPrefix."inboxWorkProgram?d-233716-fn_package_uuid=".$this->currPackageUuid."&d-233716-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_maint_work_order =  $userviewPrefix."inboxWO?d-4008231-fn_package_uuid=".$this->currPackageUuid."&d-4008231-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_maint_noe =  $userviewPrefix."inboxNOE?d-3636105-fn_package_uuid=".$this->currPackageUuid."&d-3636105-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_maint_work_daily_report =  $userviewPrefix."inboxDailyWork?d-7990414-fn_package_uuid=".$this->currPackageUuid."&d-7990414-fn_ResourceId=".$this->currUserEmail;
		$asset_maintain_nod_routine = $userviewPrefix."nod_routine?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_work_order = $userviewPrefix."work_order?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_manage_work_order_emergency =  $userviewPrefix."list_workOrderManage?d-4220438-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_inbox_maint_work_order_emergency =  $userviewPrefix."inboxWOEmergency?d-342337-fn_package_uuid=".$this->currPackageUuid."&d-342337-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_maint_work_budget_approval =  $userviewPrefix."inboxWBPeriodic?d-3636104-fn_ResourceId=".$this->currUserEmail."&d-3636104-fn_package_uuid=".$this->currPackageUuid;
		$asset_submit_work_budget_approval_emergency =  $userviewPrefix."wbEmergency?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_inbox_maint_work_budget_approval_emergency =  $userviewPrefix."inboxWBEmergency?d-4768074-fn_ResourceId=".$this->currUserEmail."&d-4768074-fn_package_uuid=".$this->currPackageUuid;
		$asset_submit_work_order_emergency =  $userviewPrefix."work_order_emergency?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_manage_defect_detection =  $userviewPrefix."list_defectManage?d-7015122-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_manage_defect_detection_sabah =  $userviewPrefix."list_defectManage_sbh?d-6192144-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_manage_NODefect =  $userviewPrefix."list_nodManage?d-3413492-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;		
		$asset_manage_NOE =  $userviewPrefix."list_noeManage?package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;		

		// maintenance view
		$asset_maint_view_work_instruction = $userviewPrefix."list_workInstruction?d-1123026-fn_package_uuid=".$this->currPackageUuid."&d-1123026-fn_ref_no=".$empty."&d-1123026-fn_dateCreated=".$empty."&d-1123026-fn_dateCreated=".$empty."&d-1123026-fn_type_of_activity=".$empty."&d-1123026-fn_wi_status=".$empty."&d-1123026-fn_work_status=".$empty."&d-1123026-fn_activity=".$empty."&d-1123026-fn_work_date=".$empty."&d-1123026-fn_work_date=".$empty;
		$asset_maint_view_work_program_annual = $userviewPrefix."list_workProgramAnnual?d-1203571-fn_package_uuid=".$this->currPackageUuid."&d-1203571-fn_year=".$empty;
		$asset_maint_view_work_program_monthly = $userviewPrefix."list_workProgramMonthly?d-4345021-fn_package_uuid=".$this->currPackageUuid."&d-4345021-fn_year=".$empty."&d-4345021-fn_month=".$empty;
		$asset_maint_view_workorder = $userviewPrefix."list_workOrder?d-7884198-fn_package_uuid=".$this->currPackageUuid."&d-7884198-fn_asset_type=".$empty."&d-7884198-fn_status=".$empty."&d-7884198-fn_dateCreated=".$empty."&d-7884198-fn_dateCreated=".$empty;
		$asset_maint_view_notice_of_emergency = $userviewPrefix."list_noe?d-4015109-fn_package_uuid=".$this->currPackageUuid."&d-4015109-fn_ref_no=".$empty."&d-4015109-fn_noe_date=".$empty;
		$asset_maint_view_work_daily_report = $userviewPrefix."list_wdr?d-1888400-fn_package_uuid=".$this->currPackageUuid."&d-1888400-fn_ref_no=".$empty;
		$asset_maint_view_asset_handover = $userviewPrefix."list_asset_handover?d-6235256-fn_package_uuid=".$this->currPackageUuid."&d-6235256-fn_ref_no=".$empty;
		$asset_maint_view_workorder_emergency = $userviewPrefix."list_workOrderEmergency?d-4614743-fn_package_uuid=".$this->currPackageUuid;
		$asset_maint_view_apj = $userviewPrefix."list_wbAPJPeriodic?d-4015108-fn_package_uuid=".$this->currPackageUuid."&d-4015108-fn_Ref_No=".$empty."&d-4015108-fn_Date=".$empty."&d-4015108-fn_Date=".$empty."&d-4015108-fn_Asset_Type=".$empty."&d-4015108-fn_Status=".$empty;
		$asset_maint_view_apj_amendment = $userviewPrefix."list_wbAPJAmendPeriodic?d-3741830-fn_package_uuid=".$this->currPackageUuid."&d-3741830-fn_Ref_No=".$empty."&d-3741830-fn_Date=".$empty."&d-3741830-fn_Date=".$empty."&d-3741830-fn_Asset_Type=".$empty."&d-3741830-fn_Status=".$empty;
		$asset_maint_view_kpj = $userviewPrefix."list_wbKPJPeriodic?d-1252786-fn_package_uuid=".$this->currPackageUuid."&d-1252786-fn_Ref_No=".$empty."&d-1252786-fn_Date=".$empty."&d-1252786-fn_Date=".$empty."&d-1252786-fn_Asset_Type=".$empty."&d-1252786-fn_Status=".$empty;
		$asset_maint_view_apj_emergency = $userviewPrefix."list_wbAPJEmergency?d-4015108-fn_package_uuid=".$this->currPackageUuid;
		$asset_maint_view_apj_amendment_emergency = $userviewPrefix."list_wbAPJAmendEmergency?d-3741830-fn_package_uuid=".$this->currPackageUuid;
		$asset_maint_view_kpj_emergency = $userviewPrefix."list_wbKPJEmergency?d-1252786-fn_package_uuid=".$this->currPackageUuid;
		$asset_maint_view_defect_detection = $userviewPrefix."list_defectDetectionPeriodic";
		$asset_maint_view_defect_detection_emergency = $userviewPrefix."list_defectDetectionEmergency";

		if($this->currProjectOwner == "JKR_SARAWAK"){
			$assetLinkArr = array(
				'asset_list_networkSite' => $asset_list_networkSite,
				'asset_list_networkSection' => $asset_list_networkSection,
				'asset_list_bridge' => $asset_list_bridge,
				'asset_list_culvert' => $asset_list_culvert,
				'asset_list_drainage' => $asset_list_drainage,
				'asset_list_pavement' => $asset_list_pavement,
				'asset_list_furniture' => $asset_list_furniture,
				'asset_list_slope' => $asset_list_slope,
				'asset_list_electrical' => $asset_list_electrical,
				'asset_json_datalist_notificationsv3' => $asset_json_datalist_notificationsv3,
				'asset_json_datalist_notifications' => $asset_json_datalist_notifications,
				'asset_json_open_inbox' => $asset_json_open_inbox,
				'asset_inbox_bridge' => $asset_inbox_bridge,
				'asset_inbox_culvert' => $asset_inbox_culvert,
				'asset_inbox_drainage' => $asset_inbox_drainage,
				'asset_inbox_roadfurniture' => $asset_inbox_roadfurniture,
				'asset_inbox_pavement' => $asset_inbox_pavement,
				'asset_inbox_slope' => $asset_inbox_slope,
				'asset_inbox_nod' => $asset_inbox_nod,
				'asset_inbox_nod_emergency' => $asset_inbox_nod_emergency,
				'asset_inbox_ncp' => $asset_inbox_ncp,
				'asset_inbox_rfi' => $asset_inbox_rfi,
				'asset_inbox_nod_routine' => $asset_inbox_nod_routine,
				'asset_inbox_schedule_inspection' => $asset_inbox_schedule_inspection,
				'asset_inbox_site_routine' => $asset_inbox_site_routine,
				//dashboard asset
				'dash_asset_bridge' => $dash_asset_bridge,
				'dash_asset_culvert' => $dash_asset_culvert,
				'dash_asset_drainage' => $dash_asset_drainage,
				'dash_asset_pavement' => $dash_asset_pavement,
				'dash_asset_road_furniture' => $dash_asset_road_furniture,
				'dash_asset_slope' => $dash_asset_slope,
				'dash_asset_electrical' => $dash_asset_electrical,
				'dash_asset_section' => $dash_asset_section,
				'dash_asset_nod' => $dash_asset_nod,
				'dash_asset_nod_apj' => $dash_asset_nod_apj,
				'dash_asset_nod_apj_ttl' => $dash_asset_nod_apj_ttl,
				'dash_asset_nod_kpj_ttl' => $dash_asset_nod_kpj_ttl,
				'dash_asset_workInstruct' => $dash_asset_workInstruct,
				'dash_asset_ncp' => $dash_asset_ncp,
				'dash_asset_nodHeavy' => $dash_asset_nodHeavy,
				'dash_asset_wo' => $dash_asset_wo,
				'dash_asset_rfi_ttl' => $dash_asset_rfi_ttl,
				//inspection
				'asset_insp_abutment' => $asset_insp_abutment,
				'asset_insp_beamgirder' => $asset_insp_beamgirder,
				'asset_insp_bearing' => $asset_insp_bearing,
				'asset_insp_deckslab' => $asset_insp_deckslab,
				'asset_insp_drainpipes' => $asset_insp_drainpipes,
				'asset_insp_expansionjoint' => $asset_insp_expansionjoint,
				'asset_insp_parapet' => $asset_insp_parapet,
				'asset_insp_pier' => $asset_insp_pier,
				'asset_insp_slopeprotectionriverbank' => $asset_insp_slopeprotectionriverbank,
				'asset_insp_surfacing' => $asset_insp_surfacing,
				'asset_insp_hydrauliccapacity' => $asset_insp_hydrauliccapacity,
				'asset_insp_culvert' => $asset_insp_culvert,
				'asset_insp_drainage' => $asset_insp_drainage,
				'asset_insp_pavement' => $asset_insp_pavement,
				'asset_insp_slope' => $asset_insp_slope,
				'asset_insp_anticlimbfence' => $asset_insp_anticlimbfence,
				'asset_insp_crashcushion' => $asset_insp_crashcushion,
				'asset_insp_culvertmarker' => $asset_insp_culvertmarker,
				'asset_insp_flexisidepost' => $asset_insp_flexisidepost,
				'asset_insp_guardrail' => $asset_insp_guardrail,
				'asset_insp_hectometermarker' => $asset_insp_hectometermarker,
				'asset_insp_kilometermarker' => $asset_insp_kilometermarker,
				'asset_insp_rightfence' => $asset_insp_rightfence,
				'asset_insp_rivermarker' => $asset_insp_rivermarker,
				'asset_insp_roadmarking' => $asset_insp_roadmarking,
				'asset_insp_roadstud' => $asset_insp_roadstud,
				'asset_insp_signboard' => $asset_insp_signboard,
				'asset_insp_steelbarricades' => $asset_insp_steelbarricades,
				'asset_insp_wirerope' => $asset_insp_wirerope,
				'asset_insp_bridge' => $asset_insp_bridge,
				'asset_insp_roadfurniture' => $asset_insp_roadfurniture,
				//assessment
				'asset_assess_bridge' => $asset_assess_bridge,
				'asset_assess_culvert' => $asset_assess_culvert,
				'asset_assess_drainage' => $asset_assess_drainage,
				'asset_assess_roadfurniture' => $asset_assess_roadfurniture,
				'asset_assess_pavement' => $asset_assess_pavement,
				'asset_assess_slope' => $asset_assess_slope,
				//condition
				'asset_condition_bridge_component' => $asset_condition_bridge_component,
				'asset_condition_bridge_overall' => $asset_condition_bridge_overall,
				'asset_condition_culvert' => $asset_condition_culvert,
				'asset_condition_drainage' => $asset_condition_drainage,
				'asset_condition_roadfurniture' => $asset_condition_roadfurniture,
				'asset_condition_pavement' => $asset_condition_pavement,
				'asset_condition_slope' => $asset_condition_slope,
				//assesment_view
				'asset_assess_view_bridge' =>$asset_assess_view_bridge,
				'asset_assess_view_culvert' =>$asset_assess_view_culvert,
				'asset_assess_view_drainage' =>$asset_assess_view_drainage,
				'asset_assess_view_roadfurniture' =>$asset_assess_view_roadfurniture,
				'asset_assess_view_pavement' => $asset_assess_view_pavement,
				'asset_assess_view_slope' => $asset_assess_view_slope,
				//notification of defects
				'asset_NotificationOfDefect' => $asset_NotificationOfDefect,
				'asset_NotificationOfDefectEmergency' => $asset_NotificationOfDefectEmergency,
				'asset_maint_view_nod_periodic' => $asset_maint_view_nod_periodic,
				'asset_maint_view_nod_emergency' => $asset_maint_view_nod_emergency,
				//notification of damage
				'asset_NotificationOfDamage' => $asset_NotificationOfDamage,
				//pictorial report
				'asset_PictorialReport' => $asset_PictorialReport,
				'asset_PictorialReport_sbh' => $asset_PictorialReport_sbh,
				'asset_site_routine' => $asset_site_routine,
				'asset_defect_detection' => $asset_defect_detection,
				'asset_defect_detection_sbh' => $asset_defect_detection_sbh,
				//Non Conformance Product
				'asset_NonConformanceProduct' => $asset_NonConformanceProduct,
				//asset dashboard conop link
				'asset_dash_NonConformanceProduct' => $asset_dash_NonConformanceProduct,
				'asset_dash_NCP_status' => $asset_dash_NCP_status,
				'asset_dash_NCP_routine' => $asset_dash_NCP_routine,
				'asset_dash_work_instruction' => $asset_dash_work_instruction,
				'asset_dash_NotificationOfDefect' => $asset_dash_NotificationOfDefect,
				'asset_dash_NOD_status' => $asset_dash_NOD_status,
				'asset_dash_workorder' => $asset_dash_workorder,
				'asset_dash_wo' => $asset_dash_wo,
				'asset_dash_wo_status' => $asset_dash_wo_status,
				//asset dashboard conOpLink card
				'dash_asset_bridge_card' => $dash_asset_bridge_card,
				'dash_asset_slope_card' => $dash_asset_slope_card,
				'dash_asset_drainage_card' => $dash_asset_drainage_card,
				'dash_asset_culvert_card' => $dash_asset_culvert_card,
				'dash_asset_pavement_card' => $dash_asset_pavement_card,
				'dash_asset_road_furniture_card' => $dash_asset_road_furniture_card,
				'dash_asset_section_card' => $dash_asset_section_card,
				'dash_asset_electrical_card' => $dash_asset_electrical_card,
				'dash_asset_nod_apj_card' => $dash_asset_nod_apj_card,
				'dash_asset_nod_kpj_card' => $dash_asset_nod_kpj_card,
				'dash_asset_nod_apj_ttl_card' => $dash_asset_nod_apj_ttl_card,
				'dash_asset_nod_kpj_ttl_card' => $dash_asset_nod_kpj_ttl_card,
				'dash_asset_workInstructCyclic_card' => $dash_asset_workInstructCyclic_card,
				'dash_asset_workInstructNonCyclic_card' => $dash_asset_workInstructNonCyclic_card,
				'dash_asset_ncp_card' => $dash_asset_ncp_card,
				'dash_asset_ncp_dashcard' => $dash_asset_ncp_dashcard,
				'dash_asset_nodHeavy_card' => $dash_asset_nodHeavy_card,
				'dash_asset_wo_card' => $dash_asset_wo_card,
				'dash_asset_rfi_ttl_card' => $dash_asset_rfi_ttl_card,
				//Request For Inspection
				'asset_RequestForInspection' => $asset_RequestForInspection,
				'asset_LPA' => $asset_LPA,
				//Schedule Inspection
				'asset_ScheduleInspection' => $asset_ScheduleInspection,
				'asset_ScheduleInspection_sbh' => $asset_ScheduleInspection_sbh,
				//inspection form
				'asset_insp_form_bridge' => $asset_insp_form_bridge,
				'asset_insp_form_culvert' => $asset_insp_form_culvert,
				'asset_insp_form_pavement' => $asset_insp_form_pavement,
				'asset_insp_form_drainage' => $asset_insp_form_drainage,
				'asset_insp_form_slope' => $asset_insp_form_slope,
				//road furniture	
				'asset_insp_form_anticlimbfence' => $asset_insp_form_anticlimbfence,
				'asset_insp_form_crashcushion' => $asset_insp_form_crashcushion,
				'asset_insp_form_culvertmarker' => $asset_insp_form_culvertmarker,
				'asset_insp_form_flexisidepost' => $asset_insp_form_flexisidepost,
				'asset_insp_form_guardrail' => $asset_insp_form_guardrail,
				'asset_insp_form_hectometermarker' => $asset_insp_form_hectometermarker,
				'asset_insp_form_kilometermarker' => $asset_insp_form_kilometermarker,
				'asset_insp_form_rightfence' => $asset_insp_form_rightfence,
				'asset_insp_form_rivermarker' => $asset_insp_form_rivermarker,
				'asset_insp_form_roadmarking' => $asset_insp_form_roadmarking,
				'asset_insp_form_roadstud' => $asset_insp_form_roadstud,
				'asset_insp_form_signboard' => $asset_insp_form_signboard,
				'asset_insp_form_steelbarricades' => $asset_insp_form_steelbarricades,
				'asset_insp_form_wirerope' => $asset_insp_form_wirerope,
				//maintenance
				'asset_maintain_nod' => $asset_maintain_nod,
				'asset_maintain_nod_emergency' => $asset_maintain_nod_emergency,
				'asset_manage_maint_work_activity' => $asset_manage_maint_work_activity,
				'asset_manage_maint_work_activity_sabah' => $asset_manage_maint_work_activity_sabah,
				'asset_manage_maint_work_instruction' => $asset_manage_maint_work_instruction,
				'asset_manage_maint_work_instruction_sabah' => $asset_manage_maint_work_instruction_sabah,
				'asset_submit_maint_work_program' => $asset_submit_maint_work_program,
				'asset_inbox_maint_work_program' => $asset_inbox_maint_work_program,
				'asset_inbox_maint_work_order' => $asset_inbox_maint_work_order,
				'asset_submit_maint_noe' => $asset_submit_maint_noe,
				'asset_submit_maint_gar' => $asset_submit_maint_gar,
				'asset_inbox_maint_noe' => $asset_inbox_maint_noe,
				'asset_submit_maint_work_daily_report' => $asset_submit_maint_work_daily_report,
				'asset_inbox_maint_work_daily_report' => $asset_inbox_maint_work_daily_report,
				'asset_maintain_ncp' => $asset_maintain_ncp,
				'asset_maintain_rfi' => $asset_maintain_rfi,
				'asset_maintain_nod_routine' => $asset_maintain_nod_routine,
				'asset_maintain_schedule_inspection' => $asset_maintain_schedule_inspection,
				'asset_maintain_site_routine' => $asset_maintain_site_routine,
				'asset_work_order' => $asset_work_order,
				'asset_manage_maint_equipment' => $asset_manage_maint_equipment,
				'asset_manage_work_order_emergency' => $asset_manage_work_order_emergency,
				'asset_inbox_maint_work_order_emergency' => $asset_inbox_maint_work_order_emergency,
				// maintenance view
				'asset_maint_view_work_instruction' => $asset_maint_view_work_instruction,
				'asset_maint_view_work_program_annual' => $asset_maint_view_work_program_annual,
				'asset_maint_view_work_program_monthly' => $asset_maint_view_work_program_monthly,
				'asset_maint_view_workorder' => $asset_maint_view_workorder,
				'asset_maint_view_notice_of_emergency' => $asset_maint_view_notice_of_emergency,
				'asset_maint_view_work_daily_report' => $asset_maint_view_work_daily_report,
				'asset_maint_view_asset_handover' => $asset_maint_view_asset_handover,
				'asset_maint_view_workorder_emergency' => $asset_maint_view_workorder_emergency,
				'asset_submit_work_budget_approval' => $asset_submit_work_budget_approval,
				'asset_inbox_maint_work_budget_approval' => $asset_inbox_maint_work_budget_approval,
				'asset_submit_work_order' => $asset_submit_work_order,
				'asset_submit_work_budget_approval_emergency' => $asset_submit_work_budget_approval_emergency,
				'asset_inbox_maint_work_budget_approval_emergency' => $asset_inbox_maint_work_budget_approval_emergency,
				'asset_submit_work_order_emergency' => $asset_submit_work_order_emergency,
				'asset_maint_view_apj' => $asset_maint_view_apj,
				'asset_maint_view_apj_amendment' => $asset_maint_view_apj_amendment,
				'asset_maint_view_kpj' => $asset_maint_view_kpj,
				'asset_maint_view_apj_emergency' => $asset_maint_view_apj_emergency,
				'asset_maint_view_apj_amendment_emergency' => $asset_maint_view_apj_amendment_emergency,
				'asset_maint_view_kpj_emergency' => $asset_maint_view_kpj_emergency,
				'asset_maint_view_defect_detection' => $asset_maint_view_defect_detection,
				'asset_maint_view_defect_detection_emergency' => $asset_maint_view_defect_detection_emergency,
				'asset_create_defect_detection' => $asset_create_defect_detection,
				'asset_manage_defect_detection' => $asset_manage_defect_detection,
				'asset_manage_defect_detection_sabah' => $asset_manage_defect_detection_sabah,
				'asset_create_NODefect' => $asset_create_NODefect,
				'asset_manage_NODefect' => $asset_manage_NODefect,
				'asset_manage_NOE' => $asset_manage_NOE,
			);

		}else if($this->currProjectOwner == "JKR_SABAH"){
			$assetLinkArr = array(
				'asset_list_networkSite' => $asset_list_networkSite,
				'asset_list_networkSection' => $asset_list_networkSection,
				'asset_list_bridge' => $asset_list_bridge,
				'asset_list_culvert' => $asset_list_culvert,
				'asset_list_drainage' => $asset_list_drainage,
				'asset_list_pavement' => $asset_list_pavement,
				'asset_list_furniture' => $asset_list_furniture,
				'asset_list_slope' => $asset_list_slope,
				'asset_list_electrical' => $asset_list_electrical,
				'asset_json_datalist_notificationsv3' => $asset_json_datalist_notificationsv3,
				'asset_json_datalist_notifications' => $asset_json_datalist_notifications,
				'asset_json_open_inbox' => $asset_json_open_inbox,
				'asset_inbox_bridge' => $asset_inbox_bridge,
				'asset_inbox_culvert' => $asset_inbox_culvert,
				'asset_inbox_drainage' => $asset_inbox_drainage,
				'asset_inbox_roadfurniture' => $asset_inbox_roadfurniture,
				'asset_inbox_pavement' => $asset_inbox_pavement,
				'asset_inbox_slope' => $asset_inbox_slope,
				'asset_inbox_nod' => $asset_inbox_nod,
				'asset_inbox_nod_emergency' => $asset_inbox_nod_emergency,
				'asset_inbox_ncp' => $asset_inbox_ncp,
				'asset_inbox_rfi' => $asset_inbox_rfi,
				'asset_inbox_nod_routine' => $asset_inbox_nod_routine,
				'asset_inbox_schedule_inspection' => $asset_inbox_schedule_inspection,
				'asset_inbox_site_routine' => $asset_inbox_site_routine,
				//dashboard asset
				'dash_asset_bridge' => $dash_asset_bridge,
				'dash_asset_culvert' => $dash_asset_culvert,
				'dash_asset_drainage' => $dash_asset_drainage,
				'dash_asset_pavement' => $dash_asset_pavement,
				'dash_asset_road_furniture' => $dash_asset_road_furniture,
				'dash_asset_slope' => $dash_asset_slope,
				'dash_asset_electrical' => $dash_asset_electrical,
				'dash_asset_section' => $dash_asset_section,
				'dash_asset_nod' => $dash_asset_nod,
				'dash_asset_nod_apj' => $dash_asset_nod_apj,
				'dash_asset_nod_apj_ttl' => $dash_asset_nod_apj_ttl,
				'dash_asset_nod_kpj_ttl' => $dash_asset_nod_kpj_ttl,
				'dash_asset_workInstruct' => $dash_asset_workInstruct,
				'dash_asset_ncp' => $dash_asset_ncp,
				'dash_asset_nodHeavy' => $dash_asset_nodHeavy,
				'dash_asset_wo' => $dash_asset_wo,
				'dash_asset_rfi_ttl' => $dash_asset_rfi_ttl,
				//inspection
				'asset_insp_abutment' => $asset_insp_abutment,
				'asset_insp_beamgirder' => $asset_insp_beamgirder,
				'asset_insp_bearing' => $asset_insp_bearing,
				'asset_insp_deckslab' => $asset_insp_deckslab,
				'asset_insp_drainpipes' => $asset_insp_drainpipes,
				'asset_insp_expansionjoint' => $asset_insp_expansionjoint,
				'asset_insp_parapet' => $asset_insp_parapet,
				'asset_insp_pier' => $asset_insp_pier,
				'asset_insp_slopeprotectionriverbank' => $asset_insp_slopeprotectionriverbank,
				'asset_insp_surfacing' => $asset_insp_surfacing,
				'asset_insp_hydrauliccapacity' => $asset_insp_hydrauliccapacity,
				'asset_insp_culvert' => $asset_insp_culvert,
				'asset_insp_drainage' => $asset_insp_drainage,
				'asset_insp_pavement' => $asset_insp_pavement,
				'asset_insp_slope' => $asset_insp_slope,
				'asset_insp_anticlimbfence' => $asset_insp_anticlimbfence,
				'asset_insp_crashcushion' => $asset_insp_crashcushion,
				'asset_insp_culvertmarker' => $asset_insp_culvertmarker,
				'asset_insp_flexisidepost' => $asset_insp_flexisidepost,
				'asset_insp_guardrail' => $asset_insp_guardrail,
				'asset_insp_hectometermarker' => $asset_insp_hectometermarker,
				'asset_insp_kilometermarker' => $asset_insp_kilometermarker,
				'asset_insp_rightfence' => $asset_insp_rightfence,
				'asset_insp_rivermarker' => $asset_insp_rivermarker,
				'asset_insp_roadmarking' => $asset_insp_roadmarking,
				'asset_insp_roadstud' => $asset_insp_roadstud,
				'asset_insp_signboard' => $asset_insp_signboard,
				'asset_insp_steelbarricades' => $asset_insp_steelbarricades,
				'asset_insp_wirerope' => $asset_insp_wirerope,
				'asset_insp_bridge' => $asset_insp_bridge,
				'asset_insp_roadfurniture' => $asset_insp_roadfurniture,
				//assessment
				'asset_assess_bridge' => $asset_assess_bridge,
				'asset_assess_culvert' => $asset_assess_culvert,
				'asset_assess_drainage' => $asset_assess_drainage,
				'asset_assess_roadfurniture' => $asset_assess_roadfurniture,
				'asset_assess_pavement' => $asset_assess_pavement,
				'asset_assess_slope' => $asset_assess_slope,
				//condition
				'asset_condition_bridge_component' => $asset_condition_bridge_component,
				'asset_condition_bridge_overall' => $asset_condition_bridge_overall,
				'asset_condition_culvert' => $asset_condition_culvert,
				'asset_condition_drainage' => $asset_condition_drainage,
				'asset_condition_roadfurniture' => $asset_condition_roadfurniture,
				'asset_condition_pavement' => $asset_condition_pavement,
				'asset_condition_slope' => $asset_condition_slope,
				//assesment_view
				'asset_assess_view_bridge' =>$asset_assess_view_bridge,
				'asset_assess_view_culvert' =>$asset_assess_view_culvert,
				'asset_assess_view_drainage' =>$asset_assess_view_drainage,
				'asset_assess_view_roadfurniture' =>$asset_assess_view_roadfurniture,
				'asset_assess_view_pavement' => $asset_assess_view_pavement,
				'asset_assess_view_slope' => $asset_assess_view_slope,
				//notification of defects
				'asset_NotificationOfDefect' => $asset_NotificationOfDefect,
				'asset_NotificationOfDefectEmergency' => $asset_NotificationOfDefectEmergency,
				//notification of damage
				'asset_NotificationOfDamage' => $asset_NotificationOfDamage,
				//pictorial report
				'asset_PictorialReport' => $asset_PictorialReport,
				'asset_PictorialReport_sbh' => $asset_PictorialReport_sbh,
				'asset_site_routine' => $asset_site_routine,
				'asset_defect_detection' => $asset_defect_detection,
				'asset_defect_detection_sbh' => $asset_defect_detection_sbh,
				//Non Conformance Product
				'asset_NonConformanceProduct' => $asset_NonConformanceProduct,
				//asset dashboard conop link
				'asset_dash_NonConformanceProduct' => $asset_dash_NonConformanceProduct,
				'asset_dash_NCP_status' => $asset_dash_NCP_status,
				'asset_dash_NCP_routine' => $asset_dash_NCP_routine,
				'asset_dash_work_instruction' => $asset_dash_work_instruction,
				'asset_dash_NotificationOfDefect' => $asset_dash_NotificationOfDefect,
				'asset_dash_NOD_status' => $asset_dash_NOD_status,
				'asset_dash_workorder' => $asset_dash_workorder,
				'asset_dash_wo' => $asset_dash_wo,
				'asset_dash_wo_status' => $asset_dash_wo_status,
				//asset dashboard conOpLink card
				'dash_asset_bridge_card' => $dash_asset_bridge_card,
				'dash_asset_slope_card' => $dash_asset_slope_card,
				'dash_asset_drainage_card' => $dash_asset_drainage_card,
				'dash_asset_culvert_card' => $dash_asset_culvert_card,
				'dash_asset_pavement_card' => $dash_asset_pavement_card,
				'dash_asset_road_furniture_card' => $dash_asset_road_furniture_card,
				'dash_asset_section_card' => $dash_asset_section_card,
				'dash_asset_electrical_card' => $dash_asset_electrical_card,
				'dash_asset_nod_apj_card' => $dash_asset_nod_apj_card,
				'dash_asset_nod_kpj_card' => $dash_asset_nod_kpj_card,
				'dash_asset_nod_apj_ttl_card' => $dash_asset_nod_apj_ttl_card,
				'dash_asset_nod_kpj_ttl_card' => $dash_asset_nod_kpj_ttl_card,
				'dash_asset_workInstructCyclic_card' => $dash_asset_workInstructCyclic_card,
				'dash_asset_workInstructNonCyclic_card' => $dash_asset_workInstructNonCyclic_card,
				'dash_asset_ncp_card' => $dash_asset_ncp_card,
				'dash_asset_ncp_dashcard' => $dash_asset_ncp_dashcard,
				'dash_asset_nodHeavy_card' => $dash_asset_nodHeavy_card,
				'dash_asset_wo_card' => $dash_asset_wo_card,
				'dash_asset_rfi_ttl_card' => $dash_asset_rfi_ttl_card,
				//Request For Inspection
				'asset_RequestForInspection' => $asset_RequestForInspection,
				'asset_LPA' => $asset_LPA,
				//Schedule Inspection
				'asset_ScheduleInspection' => $asset_ScheduleInspection,
				'asset_ScheduleInspection_sbh' => $asset_ScheduleInspection_sbh,
				//inspection form
				'asset_insp_form_bridge' => $asset_insp_form_bridge,
				'asset_insp_form_culvert' => $asset_insp_form_culvert,
				'asset_insp_form_pavement' => $asset_insp_form_pavement,
				'asset_insp_form_drainage' => $asset_insp_form_drainage,
				'asset_insp_form_slope' => $asset_insp_form_slope,
				//road furniture	
				'asset_insp_form_anticlimbfence' => $asset_insp_form_anticlimbfence,
				'asset_insp_form_crashcushion' => $asset_insp_form_crashcushion,
				'asset_insp_form_culvertmarker' => $asset_insp_form_culvertmarker,
				'asset_insp_form_flexisidepost' => $asset_insp_form_flexisidepost,
				'asset_insp_form_guardrail' => $asset_insp_form_guardrail,
				'asset_insp_form_hectometermarker' => $asset_insp_form_hectometermarker,
				'asset_insp_form_kilometermarker' => $asset_insp_form_kilometermarker,
				'asset_insp_form_rightfence' => $asset_insp_form_rightfence,
				'asset_insp_form_rivermarker' => $asset_insp_form_rivermarker,
				'asset_insp_form_roadmarking' => $asset_insp_form_roadmarking,
				'asset_insp_form_roadstud' => $asset_insp_form_roadstud,
				'asset_insp_form_signboard' => $asset_insp_form_signboard,
				'asset_insp_form_steelbarricades' => $asset_insp_form_steelbarricades,
				'asset_insp_form_wirerope' => $asset_insp_form_wirerope,
				//maintenance
				'asset_maintain_nod' => $asset_maintain_nod,
				'asset_maintain_nod_emergency' => $asset_maintain_nod_emergency,
				'asset_manage_maint_work_activity' => $asset_manage_maint_work_activity,
				'asset_manage_maint_work_activity_sabah' => $asset_manage_maint_work_activity_sabah,
				'asset_manage_maint_work_instruction' => $asset_manage_maint_work_instruction,
				'asset_manage_maint_work_instruction_sabah' => $asset_manage_maint_work_instruction_sabah,
				'asset_submit_maint_work_program_sabah' => $asset_submit_maint_work_program_sabah,
				'asset_inbox_maint_work_program' => $asset_inbox_maint_work_program,
				'asset_inbox_maint_work_order' => $asset_inbox_maint_work_order,
				'asset_inbox_maint_noe' => $asset_inbox_maint_noe,
				'asset_submit_maint_work_daily_report' => $asset_submit_maint_work_daily_report,
				'asset_inbox_maint_work_daily_report' => $asset_inbox_maint_work_daily_report,
				'asset_maintain_rfi_sabah' => $asset_maintain_rfi_sabah,
				'asset_maintain_nod_routine' => $asset_maintain_nod_routine,
				'asset_maintain_schedule_inspection_sabah' => $asset_maintain_schedule_inspection_sabah,
				'asset_maintain_site_routine' => $asset_maintain_site_routine,
				'asset_work_order' => $asset_work_order,
				'asset_manage_maint_equipment' => $asset_manage_maint_equipment,
				'asset_manage_work_order_emergency' => $asset_manage_work_order_emergency,
				'asset_inbox_maint_work_order_emergency' => $asset_inbox_maint_work_order_emergency,
				// maintenance view
				'asset_maint_view_work_instruction' => $asset_maint_view_work_instruction,
				'asset_maint_view_work_program_annual' => $asset_maint_view_work_program_annual,
				'asset_maint_view_work_program_monthly' => $asset_maint_view_work_program_monthly,
				'asset_maint_view_workorder' => $asset_maint_view_workorder,
				'asset_maint_view_notice_of_emergency' => $asset_maint_view_notice_of_emergency,
				'asset_maint_view_work_daily_report' => $asset_maint_view_work_daily_report,
				'asset_maint_view_asset_handover' => $asset_maint_view_asset_handover,
				'asset_maint_view_workorder_emergency' => $asset_maint_view_workorder_emergency,
				'asset_submit_work_budget_approval' => $asset_submit_work_budget_approval,
				'asset_inbox_maint_work_budget_approval' => $asset_inbox_maint_work_budget_approval,
				'asset_submit_work_budget_approval_emergency' => $asset_submit_work_budget_approval_emergency,
				'asset_inbox_maint_work_budget_approval_emergency' => $asset_inbox_maint_work_budget_approval_emergency,
				'asset_submit_work_order_emergency' => $asset_submit_work_order_emergency,
				'asset_maint_view_apj' => $asset_maint_view_apj,
				'asset_maint_view_apj_amendment' => $asset_maint_view_apj_amendment,
				'asset_maint_view_kpj' => $asset_maint_view_kpj,
				'asset_maint_view_apj_emergency' => $asset_maint_view_apj_emergency,
				'asset_maint_view_apj_amendment_emergency' => $asset_maint_view_apj_amendment_emergency,
				'asset_maint_view_kpj_emergency' => $asset_maint_view_kpj_emergency,
				'asset_maint_view_defect_detection' => $asset_maint_view_defect_detection,
				'asset_maint_view_defect_detection_emergency' => $asset_maint_view_defect_detection_emergency,
				'asset_create_defect_detection' => $asset_create_defect_detection,
				'asset_manage_defect_detection' => $asset_manage_defect_detection,
				'asset_manage_defect_detection_sabah' => $asset_manage_defect_detection_sabah,
				'asset_create_NODefect' => $asset_create_NODefect,
				'asset_manage_NODefect' => $asset_manage_NODefect,
				'asset_submit_work_order_sabah' => $asset_submit_work_order_sabah,
				'asset_submit_maint_noe_sabah' => $asset_submit_maint_noe_sabah,
				'asset_maintain_ncp_sabah' => $asset_maintain_ncp_sabah
			);
		}else if($this->currProjectOwner == "UEM_EDGENTA"){
			$assetLinkArr = [];
		}

		$this->jogetAppLink = array_merge($this->jogetAppLink, $assetLinkArr);
		return;
	}

	private function loadConstructUrl(){
		$jsonPrefix = $this->getJsonDatalistSrcPrefix();
		$userviewPrefix = $this->getUserviewSrcPrefix();
		$srcUrl = $this->getConstructAppSrcRoleStatus();

		// json - jogetConstrcut.php
		$cons_json_get_coordinate = $this->jogetHost."jw/web/json/plugin/JogetConstructsAPIs.GetConstructsProcessData/service";
		$cons_json_datalist_inbox = $jsonPrefix."generalInbox_KKR?start=0&rows=5&d-7840943-fn_ResourceId=".$this->currUserEmail."&d-7840943-fn_package_id=".$this->currPackageId; //need package id as its used in the jdbc sql
		$cons_json_datalist_inboxv3 = $jsonPrefix."generalInbox_KKR?d-7840943-fn_ResourceId=".$this->currUserEmail."&d-7840943-fn_package_id=".$this->currPackageId; //need package id as its used in the jdbc sql
		
		// my task for edit changes closed RFI
		$rfi_closed_json_datalist_inbox = $jsonPrefix."list_editMyTask_inside?ResourceId=".$this->currUserEmail."&package_id=".$this->currPackageId; //need package id as its used in the jdbc sql

		$cons_json_open_inbox = $userviewPrefix."general_inbox/_/general_inbox?";
		// joget.php getJogetProcessRecords()
		$cons_json_datalist_NOI = $jsonPrefix."list_noiForm?rows=9999&d-6460389-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_NCR = $jsonPrefix."list_ncrForm?rows=9999&d-6458202-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_WIR = $jsonPrefix."list_wirForm?rows=9999&d-6466221-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_DCR = $jsonPrefix."list_dcrForm?rows=9999&d-6450912-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_RFI = $jsonPrefix."list_rfiForm?rows=9999&d-6461118-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_MOS = $jsonPrefix."list_msForm?rows=9999&d-7745341-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_MS = $jsonPrefix."list_maForm?rows=9999&d-7743883-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_IR = $jsonPrefix."list_incForm?rows=9999&d-6456015-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_RS = $jsonPrefix."list_rsForm?rows=9999&d-7746556-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_PBC = $jsonPrefix."list_pubcForm?rows=9999&d-2612337-fn_package_uuid=".$this->currPackageUuid; 
		$cons_json_datalist_LA = $jsonPrefix."list_laForm?rows=9999&d-7743640-fn_package_uuid=".$this->currPackageUuid; 
		$cons_json_datalist_LR = $jsonPrefix."list_laForm?rows=9999&d-7743640-fn_package_uuid=".$this->currPackageUuid; 
		$cons_json_datalist_LI = $jsonPrefix."list_liForm?rows=9999&d-7744288-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_SP = $this->jogetHost."jw/web/json/data/list/document_mgmt/list_SitePhoto?rows=9999&d-7634832-fn_package_uuid=".$this->currPackageUuid; 
		
		//this is legacy - this list is not in RI_Construct -BUMI
		$cons_json_datalist_BUMI = $jsonPrefix."bumiSingleRecordList?d-6251236-fn_c_kmlFileName={?}&d-6251236-fn_c_entityId={?}&d-6251236-fn_c_project=".$this->currPackageUuid;
		
		// conop.js 
		//$cons_datalist_RFI = $userviewPrefix."rfi/_/rfiForm_crud?d-6461118-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_datalist_MS = $userviewPrefix."ma/_/maForm_crud?d-7743883-fn_c_Package=".$this->currPackageUuid;
		$cons_datalist_LR = $userviewPrefix."land/_/laForm_crud?d-7743640-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_LI = $userviewPrefix."land/_/liForm_crud?d-7744288-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_datalist_LE = $userviewPrefix."land/_/leForm_crud?d-7743964-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_DCR = $userviewPrefix."dcr/_/dcrForm_crud?d-6450912-fn_package_uuid=".$this->currPackageUuid;
		
		$cons_datalist_LS = $userviewPrefix."land/_/lsForm_crud?d-7745098-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_DA = $userviewPrefix."da/_/daForm_crudSabah?d-7741696-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_datalist_PU = $userviewPrefix."pu/_/puForm_crudSabah?d-2607558-fn_package_uuid=".$this->currPackageUuid;

		// inbox datalist InitAsgnmtBox() ConOp.js
		$cons_datalist_inbox_RFI = $userviewPrefix."rfi/_/rfiInbox?d-927618-fn_package_uuid=".$this->currPackageUuid."&d-927618-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_NCR = $userviewPrefix."ncr/_/ncrInbox?d-924702-fn_package_uuid=".$this->currPackageUuid."&d-924702-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_WIR = $userviewPrefix."wir/_/wirInbox?d-932721-fn_package_uuid=".$this->currPackageUuid."&d-932721-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_MOS = $userviewPrefix."ms/_/msInbox?d-5900841-fn_package_uuid=".$this->currPackageUuid."&d-5900841-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_MS = $userviewPrefix."ma/_/maInbox?d-5899383-fn_package_uuid=".$this->currPackageUuid."&d-5899383-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_RS = $userviewPrefix."rs/_/rsInbox?d-5902056-fn_package_uuid=".$this->currPackageUuid."&d-5902056-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_SD = $userviewPrefix."sd/_/sdInbox?d-5901084-fn_package_uuid=".$this->currPackageUuid."&d-5901084-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_DCR = $userviewPrefix."dcr/_/dcrInbox?d-917412-fn_package_uuid=".$this->currPackageUuid."&d-917412-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_NOI = $userviewPrefix."noi/_/noiInbox?d-926889-fn_package_uuid=".$this->currPackageUuid."&d-926889-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_PBC = $userviewPrefix."pubc/_/pubcInbox?d-2789053-fn_package_uuid=".$this->currPackageUuid."&d-2789053-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_DA = $userviewPrefix."da/_/daInboxSabah?d-5897196-fn_package_uuid=".$this->currPackageUuid."&d-5897196-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_SDL = $userviewPrefix."sdl/_/sdlInbox?d-928104-fn_package_uuid=".$this->currPackageUuid."&d-928104-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_PU = $userviewPrefix."pu/_/puInbox?d-5901732-fn_package_uuid=".$this->currPackageUuid."&d-928104-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_IR = $userviewPrefix."inc/_/incInbox?d-922515-fn_package_uuid=".$this->currPackageUuid."&d-922515-fn_ResourceId=".$this->currUserEmail;
		$cons_datalist_inbox_RSDL = $userviewPrefix."rsdl/_/rsdlInbox?d-2793184-fn_package_uuid=".$this->currPackageUuid."&d-2793184-fn_ResourceId=".$this->currUserEmail;

		// issuance ConOp_Coordless.js
		$cons_issue_SA_BULK = $userviewPrefix."sa/_/saBulk?_action=assignmentView&Package=".$this->currPackageId."&Project=".$this->currProjectId;
		$cons_issue_SMH_BULK = $userviewPrefix."smh/_/smhBulk?_action=assignmentView&Package=".$this->currPackageId."&Project=".$this->currProjectId;
		$cons_issue_sdl_user_section_setup = $userviewPrefix."lookup/_/assignUserToSection_crud?d-5222557-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId;
		$cons_issue_RR_Category_Setup = $userviewPrefix."lookup/_/lookupRiskCategory_crud?d-7055978-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_RR_Sub_Category_Setup = $userviewPrefix."lookup/_/lookupRiskSubCategory_crud?d-7104782-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_RR_Description_Setup = $userviewPrefix."lookup/_/lookupRiskDesc_crud?d-2676193-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_SDL_Machinery_Setup = $userviewPrefix."lookup/_/lookupMachinery_crud?d-7969165-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_SDL_Manpower_Setup = $userviewPrefix."lookup/_/lookupManpower_crud?d-2659912-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_NOI_WD_Setup = $userviewPrefix."lookup/_/lookupWorkDiscipline_crud?d-7447270-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_District_Setup = $userviewPrefix."lookup/_/lookupDistrict_crud?d-2647551-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_PBC_CC_Setup = $userviewPrefix."lookup/_/pubcCCuser_crud?package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId;

		// manage ConOp_Coordless.js
		$cons_manage_SMH = $userviewPrefix."smh/_/smhAction_crud?d-7837829-fn_package_uuid=".$this->currPackageUuid;
		$cons_manage_DA = $userviewPrefix."da/_/daAction_crudSabah?d-2469409-fn_package_uuid=".$this->currPackageUuid;
		$cons_manage_LI = $userviewPrefix."land/_/liAction_crud?d-2588002-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_manage_LE = $userviewPrefix."land/_/leAction_crud?d-2585086-fn_package_uuid=".$this->currPackageUuid;
		$cons_manage_WIR = $userviewPrefix."wir/_/rfiAction_crudSabah?package_uuid=".$this->currPackageUuid;
		//phase 1B
		$cons_manage_SMH_1B = $userviewPrefix."smh/_/smhAction_crud1B?package_uuid=".$this->currPackageUuid;

		//markup review
		$cons_issue_markup = $userviewPrefix."markup/_/markUpForm?project_id_number=".$this->pid."&package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$cons_datalist_markup = $userviewPrefix."markup/_/markupForm_crud?d-6595155-fn_package_uuid=".$this->currPackageUuid;

		// bulk import general link
		if($this->currProjectOwner == "JKR_SARAWAK"){
			$cons_form_bulk = "Sarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		}else if($this->currProjectOwner == "JKR_SABAH"){
			$cons_form_bulk = "Sabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
		}
		//Land Process for Link Lot ID
		$cons_linkLot_LR = $userviewPrefix."land/_/la_linkUpdate?d-7743734-fn_package_uuid=".$this->currPackageUuid;
		$cons_linkLot_LI = $userviewPrefix."land/_/li_linkUpdate?d-7744382-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_linkLot_LE = $userviewPrefix."land/_/le_linkUpdate?d-7744058-fn_package_uuid=".$this->currPackageUuid;

		//for Project Progress
		$cons_issue_PPU = $userviewPrefix."projectprogress/_/newProjectProgress?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_OPU = $userviewPrefix."projectprogress/_/newOverallProgress?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_PF = $userviewPrefix."projectprogress/_/newProjectFeature?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_datalist_PF = $userviewPrefix."projectprogress/_/pfForm_crud?d-7745017-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_exportPP = $userviewPrefix."projectprogress/_/list_proj_progress_export";

		$dash_cons_PBS_card = '';
		$dash_cons_RR_card = '';
		$dash_cons_RS_card = '';
		$dash_cons_LS_card = '';
		$dash_cons_INC_card = '';
		$dash_cons_SA_card = '';
		$dash_cons_PU_card = '';
		$dash_cons_MT_card = '';
		$dash_cons_MS_card = '';
		$dash_cons_NCR_card = '';
		$dash_cons_RFIT_card = '';
		$dash_cons_RFI_card = '';
		$dash_cons_NOI_card = '';
		$dash_cons_SDL_card = '';
		$dash_cons_DCR_card = '';
		$dash_cons_SMH_card = '';
		$dash_cons_BP_card = '';
		$dash_cons_WIR_card = '';
		$dash_cons_NCR_card_dashboard = '';
		$dash_cons_INC_cat_card = '';
		$dash_cons_RFI = "";
		$dash_cons_RFI_opt = "";
		$dash_cons_RFI_urw = "";
		//phase 1B
		$dash_cons_PBS_card_1B = "";
		$dash_cons_RS_card_1B = "";

		//dashboard card
		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->currPackageId;
			$packageUuidIdConOp = '{?}';
			$packageIdConOp = '{?}';

		}else{
			$projectIdConOp = '';
			$packageUuidIdConOp = $this->currPackageUuid;
			$packageIdConOp = $this->currPackageId;

		}

		if($this->currProjectOwner == "JKR_SARAWAK"){
			//issuance
			$cons_issue_PBC = $userviewPrefix."pubc/_/new_pubcSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_RR = $userviewPrefix."rr/_/new_rrSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_LR = $userviewPrefix."land/_/laFormSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_LE = $userviewPrefix."land/_/leFormSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_LI = $userviewPrefix."land/_/liFormSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_LS = "";
			$cons_issue_BP = $userviewPrefix."bp/_/new_bpSarawak?package_id=".$this->currPackageId."&project_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
			$cons_issue_IR = $userviewPrefix."inc/_/incFormSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_SA = $userviewPrefix."sa/_/saFormSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_SMH = $userviewPrefix."smh/_/smhForm?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_SD = $userviewPrefix."sd/_/new_sdSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_SDL = $userviewPrefix."sdl/_/new_sdlSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_RS = $userviewPrefix."rs/_/new_rsSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&coordinates=";
  	  		$cons_issue_RFI = $userviewPrefix."rfi/_/new_rfiSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_DCR = $userviewPrefix."dcr/_/new_dcrSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_MS = $userviewPrefix."ma/_/new_maSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_MOS = $userviewPrefix."ms/_/new_msSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		    $cons_issue_WIR = $userviewPrefix."wir/_/new_wirSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		    $cons_issue_DA = "";//not there for Sarawak
			$cons_issue_PU = ""; //not there for Sarawak
			$cons_issue_SA_1B = "";
			$cons_issue_SMH_1B = "";
			$cons_issue_PBC_1B = "";
			$cons_issue_DCR_1B = "";
			$cons_issue_RS_1B = "";
			$cons_issue_SDL_1B = "";
			$cons_issue_RFI_1B = "";

			$cons_issue_NOI = $userviewPrefix."noi/_/".$srcUrl['temp_NOI_IdLink']."?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_NCR = $userviewPrefix."ncr/_/". $srcUrl['temp_NCR_IdLink'] ."?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_RR_CLOSE = $userviewPrefix."rr/_/rrAction_crud?d-2607685-fn_c_package_uuid=".$this->currPackageUuid;
			$cons_issue_RSDL = $userviewPrefix."rsdl/_/new_rsdlSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;

			// datalist
			$cons_datalist_SDL = $userviewPrefix."sdl/_/sdlForm_crudSarawak?".http_build_query(array(
				'd-6461604-fn_package_uuid' => $this->currPackageUuid,
				'd-6461604-fn_section' => '',
				'd-6461604-fn_subject' => '',
				'd-6461604-fn_ref_no' => '',
				'd-6461604-fn_contractor_name' => '',
				'd-6461604-fn_contractor_company' => '',
				'd-6461604-fn_status' => '',
				'd-6461604-fn_dateCreated' => '',
				'd-6461604-fn_dateCreated' => ''
			));
			$cons_datalist_RFI = $userviewPrefix."rfi/_/rfiForm_crudSarawak?".http_build_query(array(
				'd-6461118-fn_c_package_uuid' => $this->currPackageUuid,
				'd-6461118-fn_c_date_request' => '',
				'd-6461118-fn_c_ref_no' => '',
				'd-6461118-fn_section' => '',
				'd-6461118-fn_c_requested_by' => '',
				'd-6461118-fn_c_work_discipline' => '',
				'd-6461118-fn_c_subject' => '',
				'd-6461118-fn_status' => '',
				'd-6461118-fn_createdByName' => '',
				'd-6461118-fn_dateCreated' => '',
			));
			$cons_datalist_MS = $userviewPrefix."ma/_/maForm_crudSarawak?".http_build_query(array(
				'd-7743883-fn_package_uuid' => $this->currPackageUuid,
				'd-7743883-fn_c_ref_no' => '',
				'd-7743883-fn_section' => '',
				'd-7743883-fn_c_subject' => '',
				'd-7743883-fn_createdByName' => '',
				'd-7743883-fn_c_tsrs_no' => '',
				'd-7743883-fn_c_approval_code' => '',
				'd-7743883-fn_status' => '',
				'd-7743883-fn_dateCreated' => '',
				'd-7743883-fn_dateCreated' => ''
			));
      		$cons_datalist_SD = $userviewPrefix."sd/_/sdForm_crudSarawak?".http_build_query(array(
				'd-7745584-fn_package_uuid' => $this->currPackageUuid,
				'd-7745584-fn_ref_no' => '',
				'd-7745584-fn_section' => '',
				'd-7745584-fn_subject' => '',
				'd-7745584-fn_date_prepared' => '',
				'd-7745584-fn_issued_by' => '',
				'd-7745584-fn_date_issued' => '',
				'd-7745584-fn_action' => '',
				'd-7745584-fn_status' => '',
				'd-7745584-fn_dateCreated' => '',
				'd-7745584-fn_dateCreated' => ''
			));
			$cons_datalist_MOS = $userviewPrefix."ms/_/msForm_crudSarawak?".http_build_query(array(
				'd-7745341-fn_package_uuid' => $this->currPackageUuid,
				'd-7745341-fn_ref_no' => '',
				'd-7745341-fn_section' => '',
				'd-7745341-fn_revision_no' => '',
				'd-7745341-fn_subject' => '',
				'd-7745341-fn_work_discipline' => '',
				'd-7745341-fn_issued_by' => '',
				'd-7745341-fn_issued_date' => '',
				'd-7745341-fn_approval_status' => '',
			));
			$cons_datalist_IR = $userviewPrefix."inc/_/incForm_crudSarawak?".http_build_query(array(
				'd-6456015-fn_c_package_uuid' => $this->currPackageUuid,
				'd-6456015-fn_c_ref_no' => '',
				'd-6456015-fn_section' => '',
				'd-6456015-fn_c_chainage' => '',
				'd-6456015-fn_c_incident_category' => '',
				'd-6456015-fn_status' => '',
				'd-6456015-fn_dateCreated' => ''
			));
			$cons_datalist_NOI = $userviewPrefix."noi/_/noiForm_crudSarawak?".http_build_query(array(
				'd-6460389-fn_package_uuid' => $this->currPackageUuid,
				'd-6460389-fn_ref_no' => '',
				'd-6460389-fn_section' => '',
				'd-6460389-fn_issued_by' => '',
				'd-6460389-fn_type' => '',
				'd-6460389-fn_date_issued' => '',
				'd-6460389-fn_nature_work' => '',
				'd-6460389-fn_noi_action' => '',
				'd-6460389-fn_verify_close' => '',
				'd-6460389-fn_verified_date' => ''
			));
			$cons_datalist_NCR = $userviewPrefix."ncr/_/ncrForm_crudSarawak?".http_build_query(array(
				'd-6458202-fn_package_uuid' => $this->currPackageUuid,
				'd-6458202-fn_c_ref_no' => '',
				'd-6458202-fn_c_section' => '',
				'd-6458202-fn_c_work_discipline' => '',
				'd-6458202-fn_status' => '',
				'd-6458202-fn_dateCreated' => '',
				'd-6458202-fn_dateCreated' => ''
			));
			$cons_datalist_WIR = $userviewPrefix."wir/_/wirForm_crudSarawak?".http_build_query(array(
				'd-6466221-fn_package_uuid' => $this->currPackageUuid,
				'd-6466221-fn_c_ref_no' => '',
				'd-6466221-fn_section' => '',
				'd-6466221-fn_c_work_discipline' => '',
				'd-6466221-fn_c_propose_date' => '',
				'd-6466221-fn_createdByName' => '',
				'd-6466221-fn_c_description' => '',
				'd-6466221-fn_c_location' => '',
				'd-6466221-fn_c_contractor_rev_date' => '',
				'd-6466221-fn_c_date_approved' => '',
				'd-6466221-fn_status' => '',
				'd-6466221-fn_c_close_out_date' => '',
				'd-6466221-fn_dateCreated' => '',
				'd-6466221-fn_dateCreated' => ''
			));
			$cons_datalist_DCR = $userviewPrefix."dcr/_/dcrForm_crud?".http_build_query(array(
				'd-6450912-fn_package_uuid' => $this->currPackageUuid,
				'd-6450912-fn_ref_no' => '',
				'd-6450912-fn_revision_no' => '',
				'd-6450912-fn_subject' => '',
				'd-6450912-fn_dcr_date' => '',
				'd-6450912-fn_comp_criteria' => '',
				'd-6450912-fn_dateCreated' => '',
				'd-6450912-fn_dateCreated' => ''
			));
			$cons_datalist_PBC = $userviewPrefix."pubc/_/pubcForm_crud?".http_build_query(array(
				'd-2612337-fn_package_uuid' => $this->currPackageUuid,
				'd-2612337-fn_c_date_received' => '',
				'd-2612337-fn_c_source' => '',
				'd-2612337-fn_c_aging' => '',
				'd-2612337-fn_c_type' => ''
			));
			$cons_datalist_LR = $userviewPrefix."land/_/laForm_crud?".http_build_query(array(
				'd-7743640-fn_package_uuid' => $this->currPackageUuid,
				'd-7743640-fn_c_ref_no' => '',
				'd-7743640-fn_dateCreated' => '',
				'd-7743640-fn_dateCreated' => ''
			));
			$cons_datalist_LI = $userviewPrefix."land/_/liForm_crud?".http_build_query(array(
				'd-7744288-fn_c_package_uuid' => $this->currPackageUuid,
				'd-7744288-fn_c_ref_no' => '',
				'd-7744288-fn_status' => '',
				'd-7744288-fn_dateCreated' => '',
				'd-7744288-fn_dateCreated' => ''
			));
			$cons_datalist_LE = $userviewPrefix."land/_/leForm_crud?".http_build_query(array(
				'd-7743964-fn_package_uuid' => $this->currPackageUuid,
				'd-7743964-fn_c_year' => '',
				'd-7743964-fn_c_month' => '',
			));
			$cons_datalist_SA = $userviewPrefix."sa/_/saForm_crud?".http_build_query(array(
				'd-7745341-fn_c_package_uuid' => $this->currPackageUuid,
				'd-7745341-fn_c_section' => '',
				'd-7745341-fn_c_year' => ''
			));
			$cons_datalist_BP = $userviewPrefix."bp/_/bpAction_crud?d-2571235-fn_project_uuid=".$this->currPackageUuid;
			$cons_datalist_RS = $userviewPrefix."rs/_/rsForm_crud?".http_build_query(array(
				'd-7746556-fn_c_package_uuid' => $this->currPackageUuid,
				'd-7746556-fn_c_ref_no' => '',
				'd-7746556-fn_c_subject' => '',
				'd-7746556-fn_c_section' => '',
				'd-7746556-fn_c_category' => '',
				'd-7746556-fn_status' => '',
				'd-7746556-fn_dateCreated' => '',
				'd-7746556-fn_dateCreated' => ''
			));
			$cons_datalist_RR = $userviewPrefix."rr/_/rrForm_crud?".http_build_query(array(
				'd-7746475-fn_c_package_uuid' => $this->currPackageUuid,
				'd-7746475-fn_c_ref_no' => '',
				'd-7746475-fn_c_risk_category' => '',
				'd-7746475-fn_status' => '',
				'd-7746475-fn_dateCreated' => '',
				'd-7746475-fn_dateCreated' => ''
			));
			$cons_datalist_RSDL = $userviewPrefix."rsdl/_/rsdlForm_crudSarawak?".http_build_query(array(
				'd-2616468-fn_package_uuid' => $this->currPackageUuid,
				'd-2616468-fn_project_code' => '',
				'd-2616468-fn_ref_no' => '',
				'd-2616468-fn_company' => '',
				'd-2616468-fn_status' => '',
				'd-2616468-fn_rsdl_date' => '',
				'd-2616468-fn_work_package' => '',
				'd-2616468-fn_section' => ''
			));
			$cons_datalist_SMH = $userviewPrefix."smh/_/smhForm_crud?".http_build_query(array(
				'd-6463467-fn_package_uuid' => $this->currPackageUuid,
				'd-6463467-fn_c_section' => '',
				'd-6463467-fn_c_year' => '',
				'd-6463467-fn_c_month' => ''
			));
			$cons_datalist_PBC_1B = ""; //not there for Sarawak
			$cons_datalist_RS_1B = ""; //not there for Sarawak
			$cons_datalist_SDL_1B = ""; //not there for Sarawak

			// open close form from email
			$cons_form_RFI = $userviewPrefix."rfi/_/rfiForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
			$cons_form_NCR = $userviewPrefix."ncr/_/ncrForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		    $cons_form_WIR = $userviewPrefix."wir/_/wirForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
			$cons_form_MOS = $userviewPrefix."ms/_/msForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
			$cons_form_MS = $userviewPrefix."ma/_/maForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
			$cons_form_IR = $userviewPrefix."inc/_/incForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
			$cons_form_SDL = $userviewPrefix."sdl/_/sdlForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
			$cons_form_SD = $userviewPrefix."sd/_/sdForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
			$cons_form_RS = $userviewPrefix."rs/_/rsForm_crud/?_mode=edit&hide=hideBack&id=";
			$cons_form_SA = $userviewPrefix."sa/_/saForm_crud/?_mode=edit&hide=hideBack&id=";
			$cons_form_SMH = $userviewPrefix."smh/_/smhForm_crud/?_mode=edit&hide=hideBack&id=";
			$cons_form_RR = $userviewPrefix."rr/_/rrForm_crud/?_mode=edit&hide=hideBack&id=";
			$cons_form_DCR = $userviewPrefix."dcr/_/dcrForm_crud/?_mode=edit&hide=hideBack&id=";
			$cons_form_NOI = $userviewPrefix."noi/_/noiForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
			$cons_form_PBC = $userviewPrefix."pubc/_/pubcForm_crud/?_mode=edit&hide=hideBack&id=";
			$cons_form_DA = "";
			$cons_form_PU = "";
	
			// manage ConOp_Coordless.js
			$cons_manage_PU = ""; //not there for Sarawak
			$cons_manage_LS = "";
			$cons_manage_LR = $userviewPrefix."land/_/laAction_crud?d-2582170-fn_package_uuid=".$this->currPackageUuid;
			$cons_manage_SA = $userviewPrefix."sa/_/saAction_crud?d-2597479-fn_c_package_uuid=".$this->currPackageUuid;
			$cons_manage_IR = $userviewPrefix."inc/_/incAction_crud?d-7770761-fn_c_package_uuid=".$this->currPackageUuid;
			$cons_manage_RR = $userviewPrefix."rr/_/rrAction_crud?d-2607685-fn_c_package_uuid=".$this->currPackageUuid;
			$cons_manage_SA_1B = ""; //not there for Sarawak

			//dashboard
			$dash_cons_PBS = $jsonPrefix."dashPublicComplaintSarawak?d-3340546-fn_package_uuid={?}&project_id={?}";
			$dash_cons_RR = $jsonPrefix."dashRiskSarawak?d-3017677-fn_c_package_uuid={?}&project_id={?}";
			$dash_cons_LE = $jsonPrefix."dashLandEncumSarawak?d-8146425-fn_package_uuid={?}&project_id={?}";
			$dash_cons_LI = $jsonPrefix."dashLandIssueSarawak?d-1059082-fn_package_uuid={?}&project_id={?}";
			$dash_cons_BP = $jsonPrefix."dashBumiSarawak?d-2265349-fn_project_uuid=";
			$dash_cons_SMH = $jsonPrefix."dashTotalManHoursSarawak?d-1404999-fn_package_uuid={?}&project_id={?}";
			$dash_cons_SA = $jsonPrefix."dashSafetyActSarawak?d-3905772-fn_package_uuid={?}&project_id={?}";
			$dash_cons_INC = $jsonPrefix."dashIncidentSarawak?d-249074-fn_package_uuid={?}&project_id={?}";
			$dash_cons_NCR = $jsonPrefix."dashNonConReportSarawak?d-2507459-fn_c_package_uuid={?}&project_id={?}";
			$dash_cons_NOI = $jsonPrefix."dashNoticeOfImprovementSarawak?d-663597-fn_package_uuid={?}&project_id={?}";
			$dash_cons_MT = $jsonPrefix."dashMaterialApprovalSarawak?d-3401446-fn_package_uuid={?}&project_id={?}";
			$dash_cons_MS = $jsonPrefix."dashMethodStatementSarawak?d-6677598-fn_package_uuid={?}&project_id={?}";
			$dash_cons_RFI = $jsonPrefix."dashReqForInfoSarawak?d-836819-fn_package_uuid={?}&project_id={?}";
			$dash_cons_SDL = $jsonPrefix."dashSiteDailyLogSarawak?d-3277002-fn_package_uuid={?}&project_id={?}";
			$dash_cons_WIR = $jsonPrefix."dashWorkInspectionRequestSarawak?d-3857990-fn_package_uuid={?}&project_id={?}";
			$dash_cons_LS = "";
			$dash_cons_RFIT = "";
			$dash_cons_RFIT_opt = "";
			$dash_cons_PU = "";
			$dash_cons_DCR = "";
			$dash_cons_RS = "";
			$dash_cons_MSurw = "";
			$dash_cons_NCRurw = "";
			$dash_cons_NOIurw = "";
			$dash_cons_RS_1B = "";
			$dash_cons_RFI_opt = "";
			$dash_cons_SDL_opt = "";


			//dashboard Card ConOpLink
			$dash_cons_PBS_card = $userviewPrefix."pubc/_/dashboardPUBCFormList?d-1887555-fn_package_uuid=".$packageUuidIdConOp."&d-1887555-fn_c_project_id=".$projectIdConOp."&d-1887555-fn_status={?}&d-1887555-fn_c_date_received={?}&d-1887555-fn_c_date_received={?}&d-1887555-fn_c_type={?}";
			$dash_cons_RR_card =$userviewPrefix."rr/_/dashboardRiskListSarawak?d-932851-fn_c_package_uuid=".$packageUuidIdConOp."&d-932851-fn_project_id=".$projectIdConOp."&d-932851-fn_c_risk_description={?}&d-932851-fn_dateCreated={?}&d-932851-fn_dateCreated={?}&d-932851-fn_c_percentage={?}";
			$dash_cons_MS_card = $userviewPrefix."ms/_/dashboardMethodStatementSarawak?d-3785172-fn_package_uuid=".$packageUuidIdConOp."&d-3785172-fn_project_id=".$projectIdConOp."&d-3785172-fn_issued_date={?}&d-3785172-fn_issued_date={?}&d-3785172-fn_c_approval_status_filter={?}&d-3785172-fn_section={?}&d-3785172-fn_aging_filter={?}&d-3785172-fn_aging_filter={?}&d-3785172-fn_review_filter={?}";
			$dash_cons_NCR_card = $userviewPrefix."ncr/_/dashboardNonConReportList?d-1548233-fn_c_package_uuid=".$packageUuidIdConOp."&d-1548233-fn_project_id=".$projectIdConOp."&d-1548233-fn_date_issued={?}&d-1548233-fn_date_issued={?}&d-1548233-fn_work_discipline_filter={?}&d-1548233-fn_section={?}&d-1548233-fn_status_filter={?}&d-1548233-fn_type_filter={?}&d-1548233-fn_aging_filter={?}&d-1548233-fn_aging_filter={?}";
			$dash_cons_NOI_card = $userviewPrefix."noi/_/dashboardNoticeOfImprovementSarawak?d-3190355-fn_package_uuid=".$packageUuidIdConOp."&d-3190355-fn_project_id=".$projectIdConOp."&d-3190355-fn_date_issued={?}&d-3190355-fn_date_issued={?}&d-3190355-fn_section={?}&d-3190355-fn_status_filter={?}&d-3190355-fn_type_filter={?}";
			$dash_cons_WIR_card = $userviewPrefix."wir/_/dashboardWorkInspectionRequestSarawak?d-1889340-fn_package_uuid=".$packageUuidIdConOp."&d-1889340-fn_project_id=".$projectIdConOp."&d-1889340-fn_propose_date={?}&d-1889340-fn_propose_date={?}&d-1889340-fn_section={?}&d-1889340-fn_status_filter={?}&d-1889340-fn_work_discipline_filter={?}";
			$dash_cons_RFI_card = $userviewPrefix."rfi/_/dashboardReqForInfoSarawak?d-444121-fn_package_uuid=".$packageUuidIdConOp."&d-444121-fn_project_id=".$projectIdConOp."&d-444121-fn_date_request={?}&d-444121-fn_date_request={?}&d-444121-fn_section={?}&d-444121-fn_filter_c_rfi_acknowledge={?}&d-444121-fn_current_filter={?}";
			$dash_cons_MT_card = $userviewPrefix."ma/_/dashboardMaterialApprovalSarawak?d-6852316-fn_package_uuid=".$packageUuidIdConOp."&d-6852316-fn_project_id=".$projectIdConOp."&d-6852316-fn_submission_date={?}&d-6852316-fn_submission_date={?}&d-6852316-fn_section={?}&d-6852316-fn_c_approval_code_filter={?}&d-6852316-fn_aging_filter={?}&d-6852316-fn_aging_filter={?}";
			$dash_cons_SDL_card = $userviewPrefix."sdl/_/dashboardSiteDailyLogSarawak?d-3286444-fn_package_uuid=".$packageUuidIdConOp."&d-3286444-fn_project_id=".$projectIdConOp."&d-3286444-fn_submission_date={?}&d-3286444-fn_submission_date={?}&d-3286444-fn_section={?}&d-3286444-fn_ref_no={?}";
			$dash_cons_SMH_card = $userviewPrefix."smh/_/dashboardTotalManHoursSarawak?d-4523661-fn_package_uuid=".$packageUuidIdConOp."&d-4523661-fn_project_id=".$projectIdConOp."&d-4523661-fn_section={?}&d-4523661-fn_year={?}&d-4523661-fn_month={?}&d-4523661-fn_total_mh_wtlti={?}&d-4523661-fn_culmulative_mh_wlti={?}&d-4523661-fn_culmulative_mh_wtlti={?}";
			$dash_cons_INC_card = $userviewPrefix."inc/_/dashboardIncidentSarawak?d-3168424-fn_package_uuid=".$packageUuidIdConOp."&d-3168424-fn_project_id=".$projectIdConOp."&d-3168424-fn_c_fatality_filter={?}&d-3168424-fn_section={?}&d-3168424-fn_search_date_incident={?}&d-3168424-fn_search_date_incident={?}&d-3168424-fn_c_incident_category_filter={?}";
			$dash_cons_SA_card = $userviewPrefix."sa/_/dashboardSafetyActSarawak?d-5759682-fn_package_uuid=".$packageUuidIdConOp."&d-5759682-fn_project_id=".$projectIdConOp."&d-5759682-fn_section={?}&d-5759682-fn_year={?}&d-5759682-fn_month={?}&d-5759682-fn_package_id={?}&d-5759682-fn_committee_filter={?}&d-5759682-fn_toolbox_filter={?}&d-5759682-fn_traffic_filter={?}";
			$dash_cons_BP_card = $userviewPrefix."bp/_/dashListBumi?project_uuid=".$this->currPackageUuid."&d-2265349-fn_package_uuid=".$packageIdConOp."&category={?}&d-2265349-fn_id={?}"; 
			$dash_cons_PBS_card_1B = "";
			$dash_cons_RS_card_1B = "";

			// inbox datalist InitAsgnmtBox() ConOp.js
			$cons_datalist_inbox_RFI = $userviewPrefix."rfi/_/rfiInbox?d-927618-fn_package_uuid=".$this->currPackageUuid."&d-927618-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_NCR = $userviewPrefix."ncr/_/ncrInbox?d-924702-fn_package_uuid=".$this->currPackageUuid."&d-924702-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_WIR = $userviewPrefix."wir/_/wirInbox?d-932721-fn_package_uuid=".$this->currPackageUuid."&d-932721-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_MOS = $userviewPrefix."ms/_/msInbox?d-5900841-fn_package_uuid=".$this->currPackageUuid."&d-5900841-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_MS = $userviewPrefix."ma/_/maInbox?d-5899383-fn_package_uuid=".$this->currPackageUuid."&d-5899383-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_RS = $userviewPrefix."rs/_/rsInbox?d-5902056-fn_package_uuid=".$this->currPackageUuid."&d-5902056-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_SD = $userviewPrefix."sd/_/sdInbox?d-5901084-fn_package_uuid=".$this->currPackageUuid."&d-5901084-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_DCR = $userviewPrefix."dcr/_/dcrInbox?d-917412-fn_package_uuid=".$this->currPackageUuid."&d-917412-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_NOI = $userviewPrefix."noi/_/noiInbox?d-926889-fn_package_uuid=".$this->currPackageUuid."&d-926889-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_PBC = $userviewPrefix."pubc/_/pubcInbox?d-2789053-fn_package_uuid=".$this->currPackageUuid."&d-2789053-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_DA = $userviewPrefix."da/_/daInboxSabah?d-5897196-fn_package_uuid=".$this->currPackageUuid."&d-5897196-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_SDL = $userviewPrefix."sdl/_/sdlInbox?d-928104-fn_package_uuid=".$this->currPackageUuid."&d-928104-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_PU = $userviewPrefix."pu/_/puInbox?d-5901732-fn_package_uuid=".$this->currPackageUuid."&d-928104-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_IR = $userviewPrefix."inc/_/incInbox?d-922515-fn_package_uuid=".$this->currPackageUuid."&d-922515-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_RSDL = $userviewPrefix."rsdl/_/rsdlInbox?d-2793184-fn_package_uuid=".$this->currPackageUuid."&d-2793184-fn_ResourceId=".$this->currUserEmail;
		
			$cons_datalist_PPU = $userviewPrefix."projectprogress/_/ppuForm_crud?d-6463062-fn_package_uuid=".$this->currPackageUuid;
			$cons_datalist_OPU = "";

			$cons_datalist_bulk_WIR = $userviewPrefix."wir/_/inbox_wirBulkAction?d-450749-fn_package_uuid=".$this->currPackageUuid."&d-450749-fn_label={?}";

		}else if($this->currProjectOwner == "JKR_SABAH"){
			//issuance
			$cons_issue_PBC = $userviewPrefix."pubc/_/new_pubcSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_RR = $userviewPrefix."rr/_/new_rrSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_LR = $userviewPrefix."land/_/laFormSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_LE = $userviewPrefix."land/_/leFormSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_LI = $userviewPrefix."land/_/liFormSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_LS = $userviewPrefix."land/_/ls_FormSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_SA = $userviewPrefix."sa/_/saFormSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_IR = $userviewPrefix."inc/_/incFormSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_BP = $userviewPrefix."bp/_/new_bpSarawak?package_id=".$this->currPackageId."&project_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&project_phase=".$this->currProjectPhase;
			$cons_issue_SMH = $userviewPrefix."smh/_/smhForm?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_SD = $userviewPrefix."sd/_/".$srcUrl['temp_SD_IdLink']."?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_SDL = $userviewPrefix."sdl/_/new_sdlSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_RS = $userviewPrefix."rs/_/new_rsSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&coordinates=";
  	  		$cons_issue_RFI = $userviewPrefix."rfi/_/new_rfitSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_DCR = $userviewPrefix."dcr/_/new_dcrSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_MS = $userviewPrefix."ma/_/new_maSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_MOS =  $userviewPrefix."ms/_/new_msSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		    $cons_issue_WIR = $userviewPrefix."wir/_/new_wirSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_PU = $userviewPrefix."pu/_/new_puSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		    $cons_issue_DA = $userviewPrefix."da/_/new_daSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
			$cons_issue_RR_CLOSE = $userviewPrefix."rr/_/rrAction_crudSabah?d-4532474-fn_c_package_uuid=".$this->currPackageUuid;
			$cons_issue_RSDL = "";
			$cons_issue_NOI = $userviewPrefix."noi/_/".$srcUrl['temp_NOI_IdLink']."?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_NCR = $userviewPrefix."ncr/_/".$srcUrl['temp_NCR_IdLink']."?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			//phase 1B
			$cons_issue_SA_1B = $userviewPrefix."sa/_/saFormSabah1B?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_SMH_1B = $userviewPrefix."smh/_/smhForm1B?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_PBC_1B = $userviewPrefix."pubc/_/new_pubcSabah1B?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_DCR_1B = $userviewPrefix."dcr/_/".$srcUrl['temp_DCR_IdLink']."?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_RS_1B = $userviewPrefix."rs/_/new_rsSabah1B?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&coordinates=&project_phase=".$this->currProjectPhase."&wpc_abbr=".$this->currWpcAbbr;
			$cons_issue_SDL_1B = $userviewPrefix."sdl/_/new_sdlSabah_1B?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;
			$cons_issue_RFI_1B = $userviewPrefix."rfi/_/new_rfitSabah_1b?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation."&project_phase=".$this->currProjectPhase;

			// datalist
			$cons_datalist_SDL = $userviewPrefix."sdl/_/sdlForm_crudSabah?d-1510695-fn_package_uuid=".$this->currPackageUuid.'&d-1510695-fn_subject=&d-1510695-fn_ref_no=&d-1510695-fn_contractor_name=&d-1510695-fn_contractor_company=&d-1510695-fn_dateCreated=&d-1510695-fn_dateCreated=';
			$cons_datalist_RFI = $userviewPrefix."rfi/_/rfiForm_crudSabah?d-4816541-fn_c_package_uuid=".$this->currPackageUuid.'&d-4816541-fn_c_date_request=&d-4816541-fn_c_ref_no=&d-4816541-fn_c_requested_by=&d-4816541-fn_c_work_discipline=&d-4816541-fn_c_subject=&d-4816541-fn_c_location=&d-4816541-fn_c_action=&d-4816541-fn_createdByName=&d-4816541-fn_c_status=&d-4816541-fn_dateCreated=&d-4816541-fn_dateCreated=';
			$cons_datalist_MS = $userviewPrefix."ma/_/maForm_crudSabah?d-2725996-fn_package_uuid=".$this->currPackageUuid.'&d-2725996-fn_c_ref_no=&d-2725996-fn_dateCreated=&d-2725996-fn_c_subject=&d-2725996-fn_createdByName=&d-2725996-fn_c_tsrs_no=&d-2725996-fn_c_approval_code=&d-2725996-fn_c_status=&d-2725996-fn_dateCreated=&d-2725996-fn_dateCreated=';
      		$cons_datalist_SD = $userviewPrefix."sd/_/sdForm_crudSabah?d-3139339-fn_package_uuid=".$this->currPackageUuid.'&d-3139339-fn_ref_no=&d-3139339-fn_location=&d-3139339-fn_subject=&d-3139339-fn_action=&d-3139339-fn_issued_by=&d-3139339-fn_date_issued=&d-3139339-fn_dateCreated=&d-3139339-fn_dateCreated=';
			$cons_datalist_MOS = $userviewPrefix."ms/_/msForm_crudSabah?d-3080290-fn_package_uuid=".$this->currPackageUuid.'&d-3080290-fn_ref_no=&d-3080290-fn_revision_no=&d-3080290-fn_subject=&d-3080290-fn_work_discipline=&d-3080290-fn_issued_by=&d-3080290-fn_issued_date=&d-3080290-fn_approval_status=';
			$cons_datalist_IR = $userviewPrefix."inc/_/incForm_crudSabah?d-152568-fn_c_package_uuid=".$this->currPackageUuid.'&d-152568-fn_c_ref_no=&d-152568-fn_c_chainage=&d-152568-fn_c_incident_category=&d-152568-fn_c_status=&d-152568-fn_c_date_incident=&d-152568-fn_c_date_incident=';
			$cons_datalist_NOI = $userviewPrefix."noi/_/noiForm_crudSabah?d-1215450-fn_package_uuid=".$this->currPackageUuid.'&d-1215450-fn_ref_no=&d-1215450-fn_issued_by=&d-1215450-fn_type=&d-1215450-fn_date_issued=&d-1215450-fn_nature_work=&d-1215450-fn_noi_action=';
			$cons_datalist_NCR = $userviewPrefix."ncr/_/ncrForm_crudSabah?d-684009-fn_package_uuid=".$this->currPackageUuid.'&d-684009-fn_c_ref_no=&d-684009-fn_c_work_discipline=&d-684009-fn_c_status=&d-684009-fn_dateCreated=&d-684009-fn_dateCreated=';
			$cons_datalist_WIR = $userviewPrefix."wir/_/rfiForm_crudSabah?d-1392597-fn_package_uuid=".$this->currPackageUuid.'&d-1392597-fn_c_ref_no=&d-1392597-fn_c_work_discipline=&d-1392597-fn_c_propose_date=&d-1392597-fn_createdByName=&d-1392597-fn_c_description=&d-1392597-fn_c_location=&d-1392597-fn_c_contractor_rev_date=&d-1392597-fn_c_date_approved=&d-1392597-fn_c_status=&d-1392597-fn_c_close_out_date=&d-1392597-fn_dateCreated=&d-1392597-fn_dateCreated=&d-1392597-fn_status=';
			$cons_datalist_DCR = $userviewPrefix."dcr/_/dcrForm_crudSabah?d-7301147-fn_package_uuid=".$this->currPackageUuid.'&d-7301147-fn_ref_no=&d-7301147-fn_revision_no=&d-7301147-fn_subject=&d-7301147-fn_dcr_date=&d-7301147-fn_comp_criteria=&d-7301147-fn_dateCreated=&d-7301147-fn_dateCreated=';
			$cons_datalist_PBC = $userviewPrefix."pubc/_/pubcForm_crudSabah?d-5662910-fn_package_uuid=".$this->currPackageUuid.'&d-5662910-fn_c_date_received=&d-5662910-fn_c_source=&d-5662910-fn_c_aging=&d-5662910-fn_date_acknowledgement=&d-5662910-fn_date_acknowledgement=&d-5662910-fn_chainage_from=&d-5662910-fn_chainage_to=&d-5662910-fn_category=&d-5662910-fn_priority=&d-5662910-fn_c_update_action=&d-5662910-fn_c_updated_by=';
			$cons_datalist_LR = $userviewPrefix."land/_/laForm_crudSabah?d-2666947-fn_package_uuid=".$this->currPackageUuid.'&d-2666947-fn_c_ref_no=&d-2666947-fn_lotId=&d-2666947-fn_dateCreated=&d-2666947-fn_dateCreated='; //different datalist for SABAH and SARAWAK
			$cons_datalist_LI = $userviewPrefix."land/_/liForm_crud?d-7744288-fn_c_package_uuid=".$this->currPackageUuid.'&d-7744288-fn_c_ref_no=&d-7744288-fn_dateCreated=&d-7744288-fn_dateCreated='; //same datalist for SABAH and SARAWAK
			$cons_datalist_LE = $userviewPrefix."land/_/leForm_crud?d-7743964-fn_package_uuid=".$this->currPackageUuid.'&d-7743964-fn_c_year='; //same datalist for SABAH and SARAWAK
			$cons_datalist_SA = $userviewPrefix."sa/_/saForm_crudSabah?d-3080290-fn_c_package_uuid=".$this->currPackageUuid.'&d-3080290-fn_c_year=';
			$cons_datalist_BP = $userviewPrefix."bp/_/bpAction_crudSabah?d-4063732-fn_project_uuid=".$this->currPackageUuid.'&d-4063732-fn_category=&d-4063732-fn_consortium=&d-4063732-fn_contract_value=&d-4063732-fn_contract_value=&d-4063732-fn_participant_status=&d-4063732-fn_type=';
			$cons_datalist_RS = $userviewPrefix."rs/_/rsForm_crudSabah?d-3375535-fn_c_package_uuid=".$this->currPackageUuid.'&d-3375535-fn_c_ref_no=&d-3375535-fn_c_subject=&d-3375535-fn_c_category=&d-3375535-fn_c_status=&d-3375535-fn_dateCreated=&d-3375535-fn_dateCreated=';
			$cons_datalist_RR = $userviewPrefix."rr/_/rrForm_crudSabah?d-3355852-fn_c_package_uuid=".$this->currPackageUuid.'&d-3355852-fn_c_ref_no=&d-3355852-fn_c_risk_category=&d-3355852-fn_c_risk_subCategory=&d-3355852-fn_c_risk_owner=&d-3355852-fn_c_risk_description=&d-3355852-fn_c_risk=&d-3355852-fn_dateCreated=&d-3355852-fn_dateCreated=';
			$cons_datalist_SMH = $userviewPrefix."smh/_/smhForm_crudSabah?d-1963404-fn_package_uuid=".$this->currPackageUuid;
			$cons_datalist_RSDL = "";
			
			//phase 1B
			$cons_datalist_PBC_1B = $userviewPrefix."pubc/_/pubcForm_crudSabah1B?d-634755-fn_package_uuid=".$this->currPackageUuid.'&d-634755-fn_c_date_received=&d-634755-fn_c_source=&d-634755-fn_c_aging=&d-634755-fn_date_acknowledgement=&d-634755-fn_date_acknowledgement=&d-634755-fn_chainage_from=&d-634755-fn_chainage_to=&d-634755-fn_category=&d-634755-fn_priority=&d-634755-fn_c_update_action=&d-634755-fn_c_updated_by=';
			$cons_datalist_RS_1B = $userviewPrefix."rs/_/rsForm_crudSabah1B?package_uuid=".$this->currPackageUuid;
			$cons_datalist_SDL_1B = $userviewPrefix."sdl/_/sdlForm_crudSabah1B?package_uuid=".$this->currPackageUuid.'&subject=&ref_no=&contractor_name=&contractor_company=&dateCreated=&dateCreated=';

			// open close form
			$cons_form_RFI = $userviewPrefix."rfi/_/rfiForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_NCR = $userviewPrefix."ncr/_/ncrForm_crudSabah/?_mode=edit&hide=hideBack&id=";
		    $cons_form_WIR = $userviewPrefix."wir/_/rfiForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_MOS = $userviewPrefix."ms/_/msForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_MS = $userviewPrefix."ma/_/maForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_SDL = $userviewPrefix."sdl/_/sdlForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_IR = $userviewPrefix."inc/_/incForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_SD = $userviewPrefix."sd/_/sdForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_RS = $userviewPrefix."rs/_/rsForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_SA = $userviewPrefix."sa/_/saForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_SMH = $userviewPrefix."smh/_/smhForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_RR = $userviewPrefix."rr/_/rrForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_DCR = $userviewPrefix."dcr/_/dcrForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_NOI = $userviewPrefix."noi/_/noiForm_crudSabah/?_mode=edit&hide=hideBack&id=";
			$cons_form_PBC = $userviewPrefix."pubc/_/pubcForm_crud/?_mode=edit&hide=hideBack&id=";
			$cons_form_DA = $userviewPrefix."da/_/daForm_crud/?_mode=edit&hide=hideBack&id=";
			$cons_form_PU = $userviewPrefix."pu/_/puForm_crud/?_mode=edit&hide=hideBack&id=";

			//manage
			$cons_manage_LS = $userviewPrefix."land/_/lsAction_crud?d-2595292-fn_package_uuid=".$this->currPackageUuid;
			$cons_manage_LR = $userviewPrefix."land/_/laAction_crudSabah?d-6720937-fn_package_uuid=".$this->currPackageUuid;
			$cons_manage_SA = $userviewPrefix."sa/_/saAction_crudSabah?d-2052416-fn_c_package_uuid=".$this->currPackageUuid;
			$cons_manage_IR = $userviewPrefix."inc/_/incAction_crudSabah?d-868742-fn_c_package_uuid=".$this->currPackageUuid;
			$cons_manage_RR = $userviewPrefix."rr/_/rrAction_crudSabah?d-4532474-fn_c_package_uuid=".$this->currPackageUuid;
			//phase 1B
			$cons_manage_SA_1B = $userviewPrefix."sa/_/saAction_crudSabah1B?c_package_uuid=".$this->currPackageUuid;

			//dashboard
			$dash_cons_PBS = $jsonPrefix."dashPublicComplaintSabah?d-7827509-fn_package_uuid={?}&project_id={?}";
			$dash_cons_RR = $jsonPrefix."dashRiskSabah?d-4995432-fn_package_uuid={?}&project_id={?}";
			$dash_cons_LS = $jsonPrefix."dashLandSummarySabah?d-2795044-fn_package_uuid={?}&project_id={?}";
			$dash_cons_BP = $jsonPrefix."dashBumiSarawak?d-2265349-fn_project_uuid="; //used same datalist for bumi dashboard
			$dash_cons_SMH = $jsonPrefix."dashTotalManHoursSarawak?d-1404999-fn_package_uuid={?}&project_id={?}"; //used same datalist for HSE dashboard
			$dash_cons_SA = $jsonPrefix."dashSafetyActSabah?d-1365839-fn_package_uuid={?}&project_id={?}"; //used different datalist for HSE dashboard
			$dash_cons_INC = $jsonPrefix."dashIncidentSarawak?d-249074-fn_package_uuid={?}&project_id={?}"; //used same datalist for HSE dashboard
			$dash_cons_NCRurw = $jsonPrefix."dashNonConReportSabah?d-3074606-fn_package_uuid={?}&project_id={?}";
			$dash_cons_NCR = $jsonPrefix."dashNonConReportSarawak?d-2507459-fn_c_package_uuid={?}&project_id={?}"; //quality dashboard used same datalist with Sarawak
			$dash_cons_NOI = $jsonPrefix."dashNoticeOfImprovementSarawak?d-663597-fn_package_uuid={?}&project_id={?}";
			$dash_cons_NOIurw = $jsonPrefix."dashNoticeOfImprovementSabah?d-3801800-fn_package_uuid={?}&project_id={?}";
			$dash_cons_MT = $jsonPrefix."dashMaterialApprovalSarawak?d-3401446-fn_package_uuid={?}&project_id={?}"; //quality dashboard used same datalist with Sarawak
			$dash_cons_MSurw = $jsonPrefix."dashMethodStatementSabah?d-7266225-fn_package_uuid={?}&project_id={?}";
			$dash_cons_MS = $jsonPrefix."dashMethodStatementSarawak?d-6677598-fn_package_uuid={?}&project_id={?}"; //quality dashboard used same datalist with Sarawak
			$dash_cons_RFI = $jsonPrefix."dashReqForInfoSabah?d-5685182-fn_package_uuid={?}&project_id={?}";
			$dash_cons_RFI_opt = $jsonPrefix."dashReqForInfoSabah_opt?d-7518926-fn_package_uuid={?}&project_id={?}";
			$dash_cons_RFI_urw = $jsonPrefix."rfiSabahUtilitiesDash?d-6150084-fn_package_uuid={?}&project_id={?}";
			$dash_cons_PU = $jsonPrefix."dashProgressUpdateSabah?d-6266333-fn_package_uuid={?}&project_id={?}";
			$dash_cons_RFIT = $jsonPrefix."dashReqForInfoTechSabah?d-7534844-fn_package_uuid={?}&project_id={?}";
			$dash_cons_RFIT_opt = $jsonPrefix."dashReqForInfoTechSabah_opt?d-6346604-fn_package_uuid={?}&project_id={?}";
			$dash_cons_DCR = $jsonPrefix."dashDesignChangeReqSabah?d-6698847-fn_package_uuid={?}&project_id={?}";
			$dash_cons_SDL = $jsonPrefix."dashSiteDailyLogSarawak?d-3277002-fn_package_uuid={?}&project_id={?}";
			$dash_cons_SDL_opt = $jsonPrefix."dashSiteDailyLogSbh_total?d-4322220-fn_package_uuid={?}&project_id={?}";
			$dash_cons_RS = $jsonPrefix."dashReportSubSabah?d-4235183-fn_package_uuid={?}&project_id={?}";
			$dash_cons_RS_1B = $jsonPrefix."dashRsSabah1b?package_uuid={?}&project_id={?}&dateFrom={?}&dateTo={?}";
			$dash_cons_WIR = "";
			$dash_cons_LE = "";
			$dash_cons_LI = "";

			// inbox datalist InitAsgnmtBox() ConOp.js
			$cons_datalist_inbox_RFI = $userviewPrefix."rfi/_/rfiInboxSabah?d-7317985-fn_package_uuid=".$this->currPackageUuid."&d-7317985-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_NCR = $userviewPrefix."ncr/_/ncrInboxSabah?d-6609397-fn_package_uuid=".$this->currPackageUuid."&d-6609397-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_WIR = $userviewPrefix."wir/_/wirInboxSabah?d-169406-fn_package_uuid=".$this->currPackageUuid."&d-169406-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_MOS = $userviewPrefix."ms/_/msInboxSabah?d-7851622-fn_package_uuid=".$this->currPackageUuid."&d-7851622-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_MS = $userviewPrefix."ma/_/maInboxSabah?d-7497328-fn_package_uuid=".$this->currPackageUuid."&d-7497328-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_RS = $userviewPrefix."rs/_/rsInboxSabah?d-8146867-fn_package_uuid=".$this->currPackageUuid."&d-8146867-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_SD = $userviewPrefix."sd/_/sdInboxSabah?d-7910671-fn_package_uuid=".$this->currPackageUuid."&d-7910671-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_DCR = $userviewPrefix."dcr/_/dcrInboxSabah?d-4837927-fn_package_uuid=".$this->currPackageUuid."&d-4837927-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_NOI = $userviewPrefix."noi/_/noiInboxSabah?d-7140838-fn_package_uuid=".$this->currPackageUuid."&d-7140838-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_PBC = $userviewPrefix."pubc/_/pubcInboxSabah?d-6661858-fn_package_uuid=".$this->currPackageUuid."&d-6661858-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_DA = $userviewPrefix."da/_/daInbox?d-5897196-fn_package_uuid=".$this->currPackageUuid."&d-5897196-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_SDL = $userviewPrefix."sdl/_/sdlInboxSabah?d-7436083-fn_package_uuid=".$this->currPackageUuid."&d-7436083-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_PU = $userviewPrefix."pu/_/puInbox?d-5901732-fn_package_uuid=".$this->currPackageUuid."&d-928104-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_IR = $userviewPrefix."inc/_/incInboxSabah?d-6077956-fn_package_uuid=".$this->currPackageUuid."&d-6077956-fn_ResourceId=".$this->currUserEmail;
			$cons_datalist_inbox_RSDL = $userviewPrefix."rsdl/_/rsdlInbox?d-2793184-fn_package_uuid=".$this->currPackageUuid."&d-2793184-fn_ResourceId=".$this->currUserEmail;

			$cons_datalist_PPU = $userviewPrefix."projectprogress/_/ppuForm_crudSabah?d-1864989-fn_package_uuid=".$this->currPackageUuid;
			$cons_datalist_OPU = $userviewPrefix."projectprogress/_/opuForm_crud?d-3358966-fn_package_uuid=".$this->currPackageUuid;

			$dash_cons_PBS_card = $userviewPrefix."pubc/_/dashboardPublicComplaintSabah?d-7827509-fn_package_uuid=".$packageUuidIdConOp."&project_id=".$projectIdConOp."&d-7827509-fn_status={?}&d-7827509-fn_search_date_received={?}&d-7827509-fn_search_date_received={?}&d-7827509-fn_search_category={?}&inPackageUuid={?}";
			$dash_cons_RR_card = $userviewPrefix."rr/_/dashboardRiskSabah?d-1980266-fn_package_uuid=".$packageUuidIdConOp."&d-1980266-fn_project_id=".$projectIdConOp."&d-1980266-fn_c_status={?}&d-1980266-fn_dateCreated={?}&d-1980266-fn_dateCreated={?}&d-1980266-fn_c_risk_category={?}&d-1980266-fn_risk={?}&d-1980266-fn_id={?}";
			$dash_cons_RS_card = $userviewPrefix."rs/_/dashReportSubSabah?d-4235183-fn_package_uuid=".$packageUuidIdConOp."&d-4235183-fn_project_id=".$projectIdConOp."&d-4235183-fn_month={?}&d-4235183-fn_year={?}&d-4235183-fn_search_status={?}&d-4235183-fn_category={?}";
			$dash_cons_LS_card = $userviewPrefix."land/_/dashLandSummarySabah?d-4220774-fn_package_uuid=".$packageUuidIdConOp."&d-4220774-fn_project_id=".$projectIdConOp."&d-4220774-fn_month={?}&d-4220774-fn_year={?}&d-4220774-fn_lcm_no={?}&d-4220774-fn_district={?}";
			$dash_cons_SMH_card = $userviewPrefix."smh/_/dashTotalManHoursSabah?d-3884178-fn_package_uuid=".$packageUuidIdConOp."&d-3884178-fn_project_id=".$projectIdConOp."&d-3884178-fn_year={?}&d-3884178-fn_month={?}&d-3884178-fn_month={?}"; 
			$dash_cons_INC_card = $userviewPrefix."inc/_/dashIncidentSabah?d-5983371-fn_package_uuid=".$packageUuidIdConOp."&d-5983371-fn_project_id=".$projectIdConOp."&d-5983371-fn_search_date_incident={?}&d-5983371-fn_search_date_incident={?}&d-5983371-fn_incident_category={?}&d-5983371-fn_fatality_number={?}"; 
			$dash_cons_INC_cat_card = $userviewPrefix."inc/_/dashIncidentCatSabah?d-5086435-fn_package_uuid=".$packageUuidIdConOp."&d-5086435-fn_project_id=".$projectIdConOp."&d-5086435-fn_search_date_incident={?}&d-5086435-fn_search_date_incident={?}&d-5086435-fn_incident_category={?}"; 
			$dash_cons_SA_card = $userviewPrefix."sa/_/dashSafetyActSabah?d-1365839-fn_package_uuid=".$packageUuidIdConOp."&d-1365839-fn_project_id=".$projectIdConOp."&d-1365839-fn_year={?}&d-1365839-fn_month={?}&d-1365839-fn_committee_filter={?}&d-1365839-fn_toolbox_filter={?}&d-1365839-fn_stand_down_filter={?}&d-1365839-fn_pre_toolbox_filter={?}"; 
			$dash_cons_PU_card = $userviewPrefix."pu/_/dashProgressUpdateSabah?d-6266333-fn_package_uuid=".$packageUuidIdConOp."&d-6266333-fn_project_id=".$projectIdConOp."&d-6266333-fn_ref_no={?}&d-6266333-fn_utility_provider={?}";
			$dash_cons_MT_card = $userviewPrefix."ma/_/dashMaterialApprovalSabah?d-7557535-fn_package_uuid=".$packageUuidIdConOp."&d-7557535-fn_project_id=".$projectIdConOp."&d-7557535-fn_submission_date={?}&d-7557535-fn_submission_date={?}&d-7557535-fn_search_approval_code={?}&d-7557535-fn_search_acknowledge={?}&d-7557535-fn_aging={?}&d-7557535-fn_aging={?}"; 
			$dash_cons_MS_card = $userviewPrefix."ms/_/dashMethodStatementSabah?d-5309843-fn_package_uuid=".$packageUuidIdConOp."&d-5309843-fn_project_id=".$projectIdConOp."&d-5309843-fn_issued_date={?}&d-5309843-fn_issued_date={?}&d-5309843-fn_search_acknowledge={?}&d-5309843-fn_card_approval_status={?}&d-5309843-fn_aging={?}&d-5309843-fn_aging={?}&d-5309843-fn_status={?}&d-5309843-fn_work_discipline={?}"; 
			$dash_cons_NCR_card = $userviewPrefix."ncr/_/dashListNonConSabah?d-7500888-fn_package_uuid=".$packageUuidIdConOp."&d-7500888-fn_project_id=".$projectIdConOp."&d-7500888-fn_date_issued={?}&d-7500888-fn_date_issued={?}&d-7500888-fn_status={?}&d-7500888-fn_search_type={?}&d-7500888-fn_search_type={?}&d-7500888-fn_search_type={?}&d-7500888-fn_work_discipline={?}&d-7500888-fn_aging={?}&d-7500888-fn_aging={?}"; 
			$dash_cons_RFIT_card = $userviewPrefix."rfi/_/dashboardReqForInfoTechSabah?d-4926482-fn_package_uuid=".$packageUuidIdConOp."&d-4926482-fn_project_id=".$projectIdConOp."&d-4926482-fn_dateCreated={?}&d-4926482-fn_dateCreated={?}&d-4926482-fn_search_acknowledge={?}&d-4926482-fn_aging={?}&d-4926482-fn_aging={?}&d-4926482-fn_status={?}&d-4926482-fn_work_discipline={?}";
			$dash_cons_RFI_card = $userviewPrefix."rfi/_/dashboardReqForInfoSabah?d-5652980-fn_package_uuid=".$packageUuidIdConOp."&d-5652980-fn_project_id=".$projectIdConOp."&d-5652980-fn_dateCreated={?}&d-5652980-fn_dateCreated={?}&d-5652980-fn_rfi_status={?}&d-5652980-fn_urw_status={?}&d-5652980-fn_work_discipline={?}&d-5652980-fn_id={?}";
			$dash_cons_NOI_card = $userviewPrefix."noi/_/dashNoticeOfImprovementSabah?d-4718410-fn_package_uuid=".$packageUuidIdConOp."&d-4718410-fn_project_id=".$projectIdConOp."&d-4718410-fn_date_issued={?}&d-4718410-fn_date_issued={?}&d-4718410-fn_type={?}&d-4718410-fn_type={?}&d-4718410-fn_type={?}&d-4718410-fn_search_status={?}&d-4718410-fn_nature_work={?}&d-4718410-fn_aging={?}&d-4718410-fn_aging={?}";
			$dash_cons_SDL_card = $userviewPrefix."sdl/_/dashSiteDailyLogSabah?d-2776963-fn_package_uuid=".$packageUuidIdConOp."&d-2776963-fn_project_id=".$projectIdConOp."&d-2776963-fn_submission_date={?}&d-2776963-fn_submission_date={?}&d-2776963-fn_ref_no={?}";
			$dash_cons_DCR_card = $userviewPrefix."dcr/_/dashboardDesignChangeReqSabah?d-7262369-fn_package_uuid=".$packageUuidIdConOp."&d-7262369-fn_project_id=".$projectIdConOp."&d-7262369-fn_dateCreated={?}&d-7262369-fn_dateCreated={?}&d-7262369-fn_status={?}&d-7262369-fn_work_discipline={?}";
			$dash_cons_BP_card = $userviewPrefix."bp/_/dashListBumi?project_uuid=".$this->currPackageUuid."&d-2265349-fn_package_uuid=".$packageIdConOp."&category={?}&d-2265349-fn_id={?}&inPackageUuid={?}";
			$dash_cons_NCR_card_dashboard = $userviewPrefix."ncr/_/dashListNonConSabahStatus?d-7197238-fn_package_uuid=".$packageUuidIdConOp."&d-7197238-fn_project_id=".$projectIdConOp."&d-7197238-fn_date_issued={?}&d-7197238-fn_date_issued={?}&d-7197238-fn_status={?}&d-7197238-fn_type={?}&d-7197238-fn_type={?}&d-7197238-fn_type={?}&d-7197238-fn_work_discipline={?}&d-7197238-fn_aging={?}&d-7197238-fn_aging={?}"; 
			//phase 1B
			$dash_cons_PBS_card_1B = $userviewPrefix."pubc/_/dashboardPublicComplaintSabah1B?d-3338930-fn_package_uuid=".$packageUuidIdConOp."&d-3338930-fn_project_id=".$projectIdConOp."&d-3338930-fn_status={?}&d-3338930-fn_search_date_received={?}&d-3338930-fn_search_date_received={?}&d-3338930-fn_search_category={?}&inPackageUuid={?}";
			$dash_cons_RS_card_1B = $userviewPrefix."rs/_/dashReportSubSabah1B?package_uuid=".$packageUuidIdConOp."&project_id=".$projectIdConOp."&action={?}&dateFrom={?}&dateTo={?}&wpc={?}";

			// datalist bulk approval
			$cons_datalist_bulk_WIR = $userviewPrefix."wir/_/inbox_wirBulkAction?d-450749-fn_package_uuid=".$this->currPackageUuid."&d-450749-fn_label={?}";

		}

		$consLinkArr = array(
			'cons_json_get_coordinate' => $cons_json_get_coordinate,
			'cons_json_datalist_inbox' => $cons_json_datalist_inbox,
			'cons_json_datalist_inboxv3' => $cons_json_datalist_inboxv3,
			'cons_json_open_inbox' => $cons_json_open_inbox,
			'rfi_closed_json_datalist_inbox' => $rfi_closed_json_datalist_inbox,
			// joget.php getJogetProcessRecords()
			'cons_json_datalist_NOI' => $cons_json_datalist_NOI,
			'cons_json_datalist_NCR' => $cons_json_datalist_NCR,
			'cons_json_datalist_WIR' => $cons_json_datalist_WIR,
			'cons_json_datalist_DCR' => $cons_json_datalist_DCR,
			'cons_json_datalist_RFI' => $cons_json_datalist_RFI,
			'cons_json_datalist_MOS' => $cons_json_datalist_MOS,
			'cons_json_datalist_MS' => $cons_json_datalist_MS,
			'cons_json_datalist_IR' => $cons_json_datalist_IR,
			'cons_json_datalist_RS' => $cons_json_datalist_RS,
			'cons_json_datalist_PBC' => $cons_json_datalist_PBC,
			'cons_json_datalist_LR' => $cons_json_datalist_LR,
			'cons_json_datalist_LA' => $cons_json_datalist_LA,
			'cons_json_datalist_LI' => $cons_json_datalist_LI,
			'cons_json_datalist_BUMI' => $cons_json_datalist_BUMI,
			'cons_json_datalist_SP' => $cons_json_datalist_SP,
			// conop js
			'cons_datalist_NCR' => $cons_datalist_NCR,
			'cons_datalist_WIR' => $cons_datalist_WIR,
			'cons_datalist_RFI' => $cons_datalist_RFI,
			'cons_datalist_MOS' => $cons_datalist_MOS,
			'cons_datalist_MS' => $cons_datalist_MS,
			'cons_datalist_IR' => $cons_datalist_IR,
			'cons_datalist_SDL' => $cons_datalist_SDL,
			'cons_datalist_SD' => $cons_datalist_SD,
			'cons_datalist_RS' => $cons_datalist_RS,
			'cons_datalist_SA' => $cons_datalist_SA,
			'cons_datalist_SMH' => $cons_datalist_SMH,
			'cons_datalist_RR' => $cons_datalist_RR,
			'cons_datalist_LR' => $cons_datalist_LR,
			'cons_datalist_LI' => $cons_datalist_LI,
			'cons_datalist_LE' => $cons_datalist_LE,
			'cons_datalist_DCR' => $cons_datalist_DCR,
			'cons_datalist_NOI' => $cons_datalist_NOI,
			'cons_datalist_PBC' => $cons_datalist_PBC,
			'cons_datalist_LS' => $cons_datalist_LS,
			'cons_datalist_DA' => $cons_datalist_DA,
			'cons_datalist_PU' => $cons_datalist_PU,
			'cons_datalist_BP' => $cons_datalist_BP,
			'cons_datalist_RSDL' => $cons_datalist_RSDL,
			//phase 1B
			'cons_datalist_PBC_1B' => $cons_datalist_PBC_1B,
			'cons_datalist_RS_1B' => $cons_datalist_RS_1B,
			'cons_datalist_SDL_1B' => $cons_datalist_SDL_1B,
			// form openCloseForm() ConOp.js,
			'cons_form_NCR' => $cons_form_NCR,
			'cons_form_WIR' => $cons_form_WIR,
			'cons_form_RFI' => $cons_form_RFI,
			'cons_form_MOS' => $cons_form_MOS,
			'cons_form_MS' => $cons_form_MS,
			'cons_form_IR' => $cons_form_IR,
			'cons_form_SDL' => $cons_form_SDL,
			'cons_form_SD' => $cons_form_SD,
			'cons_form_RS' => $cons_form_RS,
			'cons_form_SA' => $cons_form_SA,
			'cons_form_SMH' => $cons_form_SMH,
			'cons_form_RR' => $cons_form_RR,
			'cons_form_DCR' => $cons_form_DCR,
			'cons_form_NOI' => $cons_form_NOI,
			'cons_form_PBC' => $cons_form_PBC,
			'cons_form_DA' => $cons_form_DA,
			'cons_form_PU' => $cons_form_PU,
			// inbox datalist InitAsgnmtBox() ConOp.js
			'cons_datalist_inbox_NCR' => $cons_datalist_inbox_NCR,
			'cons_datalist_inbox_WIR' => $cons_datalist_inbox_WIR,
			'cons_datalist_inbox_RFI' => $cons_datalist_inbox_RFI,
			'cons_datalist_inbox_MOS' => $cons_datalist_inbox_MOS,
			'cons_datalist_inbox_MS' => $cons_datalist_inbox_MS,
			'cons_datalist_inbox_RS' => $cons_datalist_inbox_RS,
			'cons_datalist_inbox_SDL' => $cons_datalist_inbox_SDL,
			'cons_datalist_inbox_SD' => $cons_datalist_inbox_SD,
			'cons_datalist_inbox_DCR' => $cons_datalist_inbox_DCR,
			'cons_datalist_inbox_NOI' => $cons_datalist_inbox_NOI,
			'cons_datalist_inbox_PBC' => $cons_datalist_inbox_PBC,
			'cons_datalist_inbox_DA' => $cons_datalist_inbox_DA,
			'cons_datalist_inbox_PU' => $cons_datalist_inbox_PU,
			'cons_datalist_inbox_IR' => $cons_datalist_inbox_IR,
			'cons_datalist_inbox_RSDL' => $cons_datalist_inbox_RSDL,
			// issuance ConOp_Coordless.js
			'cons_issue_SD' => $cons_issue_SD,
			'cons_issue_LS' => $cons_issue_LS,
			'cons_issue_SDL_Machinery_Setup' => $cons_issue_SDL_Machinery_Setup,
			'cons_issue_SDL_Manpower_Setup' => $cons_issue_SDL_Manpower_Setup,
			'cons_issue_SDL' => $cons_issue_SDL,
			'cons_issue_SA' => $cons_issue_SA,
			'cons_issue_SA_BULK' => $cons_issue_SA_BULK,
			'cons_issue_SMH' => $cons_issue_SMH,
			'cons_issue_SMH_BULK' => $cons_issue_SMH_BULK,
			'cons_issue_RR_CLOSE' => $cons_issue_RR_CLOSE,
			'cons_issue_sdl_user_section_setup' => $cons_issue_sdl_user_section_setup,
			'cons_issue_RR_Category_Setup' => $cons_issue_RR_Category_Setup,
			'cons_issue_RR_Sub_Category_Setup' => $cons_issue_RR_Sub_Category_Setup,
			'cons_issue_RR_Description_Setup' => $cons_issue_RR_Description_Setup,
			'cons_issue_RR' => $cons_issue_RR,
			'cons_issue_BP' => $cons_issue_BP,
			'cons_issue_PU' => $cons_issue_PU,
			'cons_issue_NOI_WD_Setup' => $cons_issue_NOI_WD_Setup,
			'cons_issue_District_Setup' => $cons_issue_District_Setup,
			'cons_issue_PBC_CC_Setup' => $cons_issue_PBC_CC_Setup,
			//phase 1B
			'cons_issue_SA_1B' => $cons_issue_SA_1B,
			'cons_issue_SMH_1B' => $cons_issue_SMH_1B,
			'cons_issue_PBC_1B' => $cons_issue_PBC_1B,
			'cons_issue_DCR_1B' => $cons_issue_DCR_1B,
			'cons_issue_RS_1B' => $cons_issue_RS_1B,
			'cons_issue_SDL_1B' => $cons_issue_SDL_1B,
			'cons_issue_RFI_1B' => $cons_issue_RFI_1B,
			// issuance assetWiseGuiProject.js
			'cons_issue_RFI' => $cons_issue_RFI,
			'cons_issue_RS' => $cons_issue_RS,
			'cons_issue_DCR' => $cons_issue_DCR,
			'cons_issue_NOI' => $cons_issue_NOI,
			'cons_issue_PBC' => $cons_issue_PBC,
			'cons_issue_NCR' => $cons_issue_NCR,
			'cons_issue_MS' => $cons_issue_MS,
			'cons_issue_IR' => $cons_issue_IR,
			'cons_issue_MOS' => $cons_issue_MOS,
			'cons_issue_WIR' => $cons_issue_WIR,
			'cons_issue_LR' => $cons_issue_LR,
			'cons_issue_LE' => $cons_issue_LE,
			'cons_issue_LI' => $cons_issue_LI,
			'cons_issue_DA' => $cons_issue_DA,
			'cons_issue_RSDL' => $cons_issue_RSDL,
			// manage ConOp_Coordless.js
			'cons_manage_SMH' => $cons_manage_SMH,
			'cons_manage_SA' => $cons_manage_SA,
			'cons_manage_DA' => $cons_manage_DA,
			'cons_manage_LR' => $cons_manage_LR,
			'cons_manage_LI' => $cons_manage_LI,
			'cons_manage_LE' => $cons_manage_LE,
			'cons_manage_LS' => $cons_manage_LS,
			'cons_manage_IR' => $cons_manage_IR,
			'cons_manage_RR' => $cons_manage_RR,
			'cons_manage_WIR' => $cons_manage_WIR,
			//phase 1B
			'cons_manage_SA_1B' => $cons_manage_SA_1B,
			'cons_manage_SMH_1B' => $cons_manage_SMH_1B,
			//dashboard
			'dash_cons_PBS' => $dash_cons_PBS,
			'dash_cons_RR' => $dash_cons_RR,
			'dash_cons_LE' => $dash_cons_LE,
			'dash_cons_LI' => $dash_cons_LI,
			'dash_cons_LS' => $dash_cons_LS,
			'dash_cons_BP' => $dash_cons_BP,
			'dash_cons_SMH' => $dash_cons_SMH,
			'dash_cons_SA' => $dash_cons_SA,
			'dash_cons_INC' => $dash_cons_INC,
			'dash_cons_NCR' => $dash_cons_NCR,
			'dash_cons_NOI' => $dash_cons_NOI,
			'dash_cons_MT' => $dash_cons_MT,
			'dash_cons_MS' => $dash_cons_MS,
			'dash_cons_RFI' => $dash_cons_RFI,
			'dash_cons_RFI_opt' => $dash_cons_RFI_opt,
			'dash_cons_RFI_urw' => $dash_cons_RFI_urw,
			'dash_cons_SDL' => $dash_cons_SDL,
			'dash_cons_SDL_opt' => $dash_cons_SDL_opt,
			'dash_cons_PU' => $dash_cons_PU,
			'dash_cons_RFIT' => $dash_cons_RFIT,
			'dash_cons_RFIT_opt' => $dash_cons_RFIT_opt,
			'dash_cons_DCR' => $dash_cons_DCR,
			'dash_cons_RS' => $dash_cons_RS,
			'dash_cons_MSurw' => $dash_cons_MSurw,
			'dash_cons_NCRurw' => $dash_cons_NCRurw,
			'dash_cons_NOIurw' => $dash_cons_NOIurw,
			'dash_cons_WIR' => $dash_cons_WIR,
			'dash_cons_RS_1B' => $dash_cons_RS_1B,
			//markup
			'cons_issue_markup' => $cons_issue_markup,
			'cons_datalist_markup' => $cons_datalist_markup,
			// bulk import
			'cons_form_bulk' => $cons_form_bulk,
			//Land Process for Link Lot ID
			'cons_linkLot_LR' => $cons_linkLot_LR,
			'cons_linkLot_LI' => $cons_linkLot_LI,
			'cons_linkLot_LE' => $cons_linkLot_LE,
			//For Digital Reporting
			'cons_issue_PPU' => $cons_issue_PPU,
			'cons_issue_OPU' => $cons_issue_OPU,
			'cons_datalist_PPU' => $cons_datalist_PPU,
			'cons_datalist_OPU' => $cons_datalist_OPU,
			'cons_issue_PF' => $cons_issue_PF,
			'cons_datalist_PF' => $cons_datalist_PF,
			'cons_datalist_exportPP' => $cons_datalist_exportPP,
			//dashboard card
			'dash_cons_PBS_card' => $dash_cons_PBS_card,
			'dash_cons_RR_card' => $dash_cons_RR_card,
			'dash_cons_RS_card' => $dash_cons_RS_card,
			'dash_cons_LS_card' => $dash_cons_LS_card,
			'dash_cons_SMH_card' => $dash_cons_SMH_card,
			'dash_cons_INC_card' => $dash_cons_INC_card,
			'dash_cons_INC_cat_card' => $dash_cons_INC_cat_card,
			'dash_cons_SA_card' => $dash_cons_SA_card,
			'dash_cons_PU_card' => $dash_cons_PU_card,
			'dash_cons_MT_card' => $dash_cons_MT_card,
			'dash_cons_MS_card' => $dash_cons_MS_card,
			'dash_cons_NCR_card' => $dash_cons_NCR_card,
			'dash_cons_RFIT_card' => $dash_cons_RFIT_card,
			'dash_cons_RFI_card' => $dash_cons_RFI_card,
			'dash_cons_NOI_card' => $dash_cons_NOI_card,
			'dash_cons_SDL_card' => $dash_cons_SDL_card,
			'dash_cons_DCR_card' => $dash_cons_DCR_card,
			'dash_cons_BP_card' => $dash_cons_BP_card,
			'dash_cons_NCR_card_dashboard' => $dash_cons_NCR_card_dashboard,
			//for dashboard Card ConOpLink Sarawak
			'dash_cons_PBS_card' => $dash_cons_PBS_card,
			'dash_cons_RR_card' => $dash_cons_RR_card,
			'dash_cons_MS_card' => $dash_cons_MS_card,
			'dash_cons_NCR_card' => $dash_cons_NCR_card,
			'dash_cons_NOI_card' => $dash_cons_NOI_card,
			'dash_cons_WIR_card' => $dash_cons_WIR_card,
			'dash_cons_RFI_card' => $dash_cons_RFI_card,
			'dash_cons_MT_card' => $dash_cons_MT_card,
			'dash_cons_SDL_card' => $dash_cons_SDL_card,
			'dash_cons_SMH_card' => $dash_cons_SMH_card,
			'dash_cons_SA_card' => $dash_cons_SA_card,
			'dash_cons_INC_card' => $dash_cons_INC_card,
			'dash_cons_NCR_card_dashboard' => $dash_cons_NCR_card_dashboard,
			//phase 1B
			'dash_cons_PBS_card_1B' => $dash_cons_PBS_card_1B,
			'dash_cons_RS_card_1B' => $dash_cons_RS_card_1B,
			// datalist bulk approval
			'cons_datalist_bulk_WIR' => $cons_datalist_bulk_WIR 
		);
		$this->jogetAppLink = array_merge($this->jogetAppLink, $consLinkArr);
		return;
	}

	private function loadFMUrl(){
		$jsonPrefix = $this->getJsonDatalistSrcPrefix('fm');
		$userviewPrefix = $this->getUserviewSrcPrefix('fm');

		// need to handle link between parent and package
		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->currPackageId;
			$packageUuidIdConOp = '{?}';
		}else{
			$projectIdConOp = $this->currProjectId;
			$packageUuidIdConOp = $this->currPackageUuid;
		}
		$empty ="";

		// setup lookup list
		$fm_lookup_list_currency = $userviewPrefix."lookupCurrency_crud";
		$fm_lookup_list_division = $userviewPrefix."lookupDivision_crud";
		$fm_lookup_list_purchasingOrg = $userviewPrefix."lookupPurchasingOrg_crud";
		$fm_lookup_list_trades = $userviewPrefix."lookupTrades_crud";

		// sor form / list
		$fm_sor_management_setup = $userviewPrefix.'sorForm_crud';

		// asset type
		$fm_asset_type_manage = $userviewPrefix.'assetTypeConfig_crud';

		// service request
		$fm_new_service_request =  $userviewPrefix."new_serviceRequest?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$fm_view_list_service_request =  $userviewPrefix."list_serviceRequestView";
		$fm_category_manage = $userviewPrefix.'sr_categoryForm_crud';

		// notifications
		$fm_json_notifications = $jsonPrefix."generalInbox?d-5171348-fn_assign_to=".$this->currUserEmail.'&dateModifiedFrom={?}&dateModifiedTo={?}';
		$fm_json_notifications_count =  $jsonPrefix."generalInbox_count?d-5171348-fn_assign_to=";
		$fm_json_notifications_package = $jsonPrefix."generalInbox?start=0&d-5171348-fn_package_id=".urlencode($this->currPackageId)."&d-5171348-fn_c_assign_to=".$this->currUserEmail;
		

		$fmLinkArr = [
			// setup lookup list
			'fm_lookup_list_currency' => $fm_lookup_list_currency,
			'fm_lookup_list_division' => $fm_lookup_list_division,
			'fm_lookup_list_purchasingOrg' => $fm_lookup_list_purchasingOrg,
			'fm_lookup_list_trades' => $fm_lookup_list_trades,
			// sor form / list
			'fm_sor_management_setup' => $fm_sor_management_setup,
			//asset type
			'fm_asset_type_manage' => $fm_asset_type_manage,
			//notifications
			'fm_json_notifications' => $fm_json_notifications,
			'fm_json_notifications_count' => $fm_json_notifications_count,
			'fm_json_notifications_package' => $fm_json_notifications_package,
			// service request
			'fm_new_service_request' => $fm_new_service_request,
			'fm_view_list_service_request' => $fm_view_list_service_request,
			'fm_category_manage' => $fm_category_manage
		];
	   
		$this->jogetAppLink = array_merge($this->jogetAppLink, $fmLinkArr);
		return;
	}

	private function loadSSLR2ConstructUrl(){
		$jsonPrefix = $this->getJsonDatalistSrcPrefix();
		$userviewPrefix = $this->getUserviewSrcPrefix();

		//dashboard card
	
		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->currPackageId;
			$packageUuidIdConOp = '{?}';
			$packageIdConOp = '{?}';

		}else{
			$projectIdConOp = '';
			$packageUuidIdConOp = $this->currPackageUuid;
			$packageIdConOp = $this->currPackageId;

		}

		//Inbox myTask
		$cons_json_datalist_inboxv3 = $jsonPrefix."generalInbox_KKR?d-7840943-fn_ResourceId=".$this->currUserEmail."&d-7840943-fn_package_id=".$this->currPackageId; //need package id as its used in the jdbc sql

		//Land Process for Link Lot ID
		$cons_linkLot_LR = $userviewPrefix."land/_/la_linkUpdate_sslr?d-2691443-fn_package_uuid=".$this->currPackageUuid;
		$cons_linkLot_LI = $userviewPrefix."land/_/li_linkUpdate_sslr?d-2848907-fn_c_package_uuid=".$this->currPackageUuid;

		// joget.php getJogetProcessRecords()
		$cons_json_datalist_LA = $jsonPrefix."list_laForm_sslr?rows=9999&d-2668601-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_LI = $jsonPrefix."list_liForm_sslr?rows=9999&d-2826065-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_LR = $jsonPrefix."list_laForm_sslr?rows=9999&d-2668601-fn_package_uuid=".$this->currPackageUuid; 
		$cons_json_datalist_NOI = $jsonPrefix."list_noiForm_sslr?rows=9999&d-1217104-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_NCR = $jsonPrefix."list_ncrForm_sslr?rows=9999&d-685663-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_WIR = $jsonPrefix."list_wirForm_sslr?rows=9999&d-2634280-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_DCR = $jsonPrefix."list_dcrForm_sslr?rows=9999&d-7302801-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_RFI = $jsonPrefix."list_rfiForm_sslr?rows=9999&d-1394251-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_MOS = $jsonPrefix."list_msForm_sslr?rows=9999&d-3081944-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_MS = $jsonPrefix."list_maForm_sslr?rows=9999&d-2727650-fn_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_IR = $jsonPrefix."list_incForm_sslr?rows=9999&d-154222-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_RS = $jsonPrefix."list_rrForm_sslr?rows=9999&d-3357506-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_json_datalist_PBC = $jsonPrefix."list_pubcForm_sslr?rows=9999&d-5664564-fn_package_uuid=".$this->currPackageUuid; 
		$cons_json_datalist_SP = $this->jogetHost."jw/web/json/data/list/document_mgmt/list_SitePhoto?rows=9999&d-7634832-fn_package_uuid=".$this->currPackageUuid; 

		// Conop
		$cons_datalist_RFI_SSLR2 = $userviewPrefix."rfi/_/rfiForm_crud_sslr?".http_build_query(array( 'd-1394251-fn_c_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_SD_SSLR2 = $userviewPrefix."sd/_/sdForm_crud_sslr?".http_build_query(array( 'd-3140993-fn_c_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_SA_SSLR2 = $userviewPrefix."sa/_/saForm_crud_sslr?".http_build_query(array( 'd-3081944-fn_c_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_SMH_SSLR2 = $userviewPrefix."smh/_/smhForm_crud_sslr?".http_build_query(array( 'd-1965058-fn_c_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_SDL_SSLR2 = $userviewPrefix."sdl/_/sdlForm_crud_sslr?".http_build_query(array( 'd-1512349-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_WIR_SSLR2 = $userviewPrefix."wir/_/wirForm_crud_sslr?".http_build_query(array( 'd-2634280-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_MOS_SSLR2 = $userviewPrefix."ms/_/msForm_crud_sslr?".http_build_query(array( 'd-3081944-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_NCR_SSLR2 = $userviewPrefix."ncr/_/ncrForm_crud_sslr?".http_build_query(array( 'd-685663-fn_c_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_RR_SSLR2 = $userviewPrefix."rr/_/rrForm_crud_sslr?".http_build_query(array( 'd-3357506-fn_c_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_LR_SSLR2 = $userviewPrefix."land/_/laForm_crud_sslr?".http_build_query(array( 'd-2668601-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_LI_SSLR2 = $userviewPrefix."land/_/liForm_crud_sslr?".http_build_query(array( 'd-2826065-fn_c_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_LE_SSLR2 = $userviewPrefix."land/_/leForm_sslr?".http_build_query(array( 'd-2747333-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_DCR_SSLR2 = $userviewPrefix."dcr/_/dcrForm_crud_sslr?".http_build_query(array( 'd-7302801-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_RSDL_SSLR2 = $userviewPrefix."rsdl/_/rsdlForm_crud_sslr?".http_build_query(array( 'd-6668397-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_NOI_SSLR2 = $userviewPrefix."noi/_/noiForm_crud_sslr?".http_build_query(array( 'd-1217104-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_MS_SSLR2 = $userviewPrefix."ma/_/maForm_crud_sslr?".http_build_query(array( 'd-2727650-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_RS_SSLR2 = $userviewPrefix."rs/_/rsForm_crud_sslr?".http_build_query(array( 'd-3377189-fn_c_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_IR_SSLR2 = $userviewPrefix."inc/_/incForm_crud_sslr?".http_build_query(array( 'd-154222-fn_c_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_PBC_SSLR2 = $userviewPrefix."pubc/_/pubcForm_crud_sslr?".http_build_query(array( 'd-5664564-fn_package_uuid' => $this->currPackageUuid ));
		$cons_datalist_BP_SSLR2 = $userviewPrefix."bp/_/bpAction_crud_sslr?".http_build_query(array( 'd-4065386-fn_project_uuid' => $this->currPackageUuid ));

		// Issuance
		$cons_issue_RFI_SSLR2 = $userviewPrefix."rfi/_/new_rfiSSLR?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_SD_SSLR2 = $userviewPrefix."sd/_/new_sdSSLR?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_SA_SSLR2 = $userviewPrefix."sa/_/saForm_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_SMH_SSLR2 = $userviewPrefix."smh/_/smhForm_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_SDL_SSLR2 = $userviewPrefix."sdl/_/new_sdl_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_WIR_SSLR2 = $userviewPrefix."wir/_/new_wir_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_MOS_SSLR2 = $userviewPrefix."ms/_/new_ms_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_NCR_SSLR2 = $userviewPrefix."ncr/_/new_ncr_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_RR_SSLR2 = $userviewPrefix."rr/_/new_rr_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_LR_SSLR2 = $userviewPrefix."land/_/laForm_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_LI_SSLR2 = $userviewPrefix."land/_/liForm_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_DCR_SSLR2 = $userviewPrefix."dcr/_/new_dcr_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_RSDL_SSLR2 = $userviewPrefix."rsdl/_/new_rsdl_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_NOI_SSLR2 = $userviewPrefix."noi/_/newNoi_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_MS_SSLR2 = $userviewPrefix."ma/_/newMa_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_RS_SSLR2 = $userviewPrefix."rs/_/newRs_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_IR_SSLR2 = $userviewPrefix."inc/_/incForm_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_PBC_SSLR2 = $userviewPrefix."pubc/_/newPubc_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_BP_SSLR2 = $userviewPrefix."bp/_/newBp_sslr?package_id=".$this->currPackageId."&project_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;

		// Manage
		$cons_manage_SA_SSLR2 = $userviewPrefix."sa/_/saAction_crud_sslr?d-2054070-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_manage_SMH_SSLR2 = $userviewPrefix."smh/_/smhAction_crud_sslr?d-390704-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_manage_RR_SSLR2 = $userviewPrefix."rr/_/rrAction_crud_sslr?d-4534128-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_manage_LR_SSLR2 = $userviewPrefix."land/_/laAction_crud_sslr?d-6722591-fn_package_uuid=".$this->currPackageUuid;
		$cons_manage_LI_SSLR2 = $userviewPrefix."land/_/liAction_crud_sslr?d-8139767-fn_c_package_uuid=".$this->currPackageUuid;
		$cons_manage_LE_SSLR2 = $userviewPrefix."land/_/leAction_crud_sslr?d-7431179-fn_package_uuid=".$this->currPackageUuid;
		$cons_manage_IR_SSLR2 = $userviewPrefix."inc/_/incAction_crud_sslr?d-870396-fn_c_package_uuid=".$this->currPackageUuid;

		//Setup
		$cons_issue_IR_WD_Setup = $userviewPrefix."lookup/_/lookupWorkDiscipline_crud_sslr?d-6148163-fn_package_uuid=".$this->currPackageUuid;
		$cons_setup_PBC_Category = $userviewPrefix."lookup/_/lookupComplaintCat_crud_sslr?d-4145517-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_RR_Category_Setup = $userviewPrefix."lookup/_/lookupRiskCategory_crud_sslr?d-3338895-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_RR_Sub_Category_Setup = $userviewPrefix."lookup/_/lookupRiskSubCategory_crud_sslr?d-6809659-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_RR_Description_Setup = $userviewPrefix."lookup/_/lookupRiskDesc_crud_sslr?d-4404356-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_sdl_user_section_setup = $userviewPrefix."lookup/_/assignUserToSection_crud_sslr?d-2413816-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId;
		$cons_issue_SDL_Machinery_Setup = $userviewPrefix."lookup/_/lookupMachinery_crud_sslr?d-7139528-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_SDL_Manpower_Setup = $userviewPrefix."lookup/_/lookupManpower_crud_sslr?d-448073-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_WIR_Code_Setup = $userviewPrefix."lookup/_/lookupCodeLevel_crud_sslr?d-6419767-fn_package_uuid=".$this->currPackageUuid;

		// for Project Progress
		$cons_issue_PPU = $userviewPrefix."projectprogress/_/newProjectProgress?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_issue_PF = $userviewPrefix."projectprogress/_/newProjectFeature?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;
		$cons_datalist_PPU = $userviewPrefix."projectprogress/_/ppuForm_crud?d-6463062-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_PF = $userviewPrefix."projectprogress/_/pfForm_crud?d-7745017-fn_package_uuid=".$this->currPackageUuid;

		// markup review
		$cons_issue_markup = $userviewPrefix."markup/_/markUpForm?project_id_number=".$this->pid."&package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$cons_datalist_markup = $userviewPrefix."markup/_/markupForm_crud?d-6595155-fn_package_uuid=".$this->currPackageUuid;

		// bulk import general link
		$cons_form_bulk = "SSLR?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_location=".$this->currLocation;

		// Dashboard
		$dash_cons_LI = $jsonPrefix."dashLandIssue_sslr?d-7575667-fn_package_uuid={?}&project_id={?}";
		$dash_cons_LE = $jsonPrefix."dashLandEncum_sslr?d-7431082-fn_package_uuid={?}&project_id={?}";
		$dash_cons_PBS = $jsonPrefix."dashPublicComplaint_sslr?d-7829163-fn_package_uuid={?}&project_id={?}";
		$dash_cons_BP = $jsonPrefix."dashBumi_sslr?d-4913494-fn_project_uuid=";
		$dash_cons_SMH = $jsonPrefix."dashTotalManHours_sslr?d-3885832-fn_package_uuid={?}&project_id={?}";
		$dash_cons_SA = $jsonPrefix."dashSafetyAct_sslr?d-1367493-fn_package_uuid={?}&project_id={?}";
		$dash_cons_INC = $jsonPrefix."dashIncident_sslr?d-5621531-fn_package_uuid={?}&project_id={?}";
		$dash_cons_RR = $jsonPrefix."dashRisk_sslr?d-4997086-fn_package_uuid={?}&project_id={?}";
		$dash_cons_MT = $jsonPrefix."dashMaterialApproval_sslr?d-5039727-fn_package_uuid={?}&project_id={?}";
		$dash_cons_MS = $jsonPrefix."dashMethodStatement_sslr?d-7267879-fn_package_uuid={?}&project_id={?}";
		$dash_cons_NCR = $jsonPrefix."dashNonConReport_sslr?d-3076260-fn_c_package_uuid={?}&project_id={?}";
		$dash_cons_RFI = $jsonPrefix."dashReqForInfo_sslr?d-5686836-fn_package_uuid={?}&project_id={?}";
		$dash_cons_NOI = $jsonPrefix."dashNoticeOfImprovement_sslr?d-3803454-fn_package_uuid={?}&project_id={?}";
		$dash_cons_WIR = $jsonPrefix."dashWorkInspectionRequest_sslr?d-3226319-fn_package_uuid={?}&project_id={?}";
		$dash_cons_SDL = $jsonPrefix."dashSiteDailyLog_sslr?d-6890035-fn_package_uuid={?}&project_id={?}";

		// Conop link
		$dash_cons_PBS_card = $userviewPrefix."pubc/_/dashboardPUBCFormList_sslr?d-5703306-fn_package_uuid=".$packageUuidIdConOp."&d-5703306-fn_c_project_id=".$projectIdConOp."&d-5703306-fn_status={?}&d-5703306-fn_c_date_received={?}&d-5703306-fn_c_date_received={?}&d-5703306-fn_c_type={?}&d-5703306-fn_c_category={?}";
		$dash_cons_LI_card = $userviewPrefix."land/_/dashLandIssue_sslr?d-277541-fn_package_uuid=".$packageUuidIdConOp."&d-277541-fn_project_id=".$projectIdConOp."&d-277541-fn_c_issue_date={?}&d-277541-fn_c_issue_date={?}&d-277541-fn_c_section={?}&d-277541-fn_view_issue_status={?}";
		$dash_cons_LI_table = $userviewPrefix."land/_/dashLandIssue_sslr?d-277541-fn_package_uuid=".$packageUuidIdConOp."&d-277541-fn_project_id=".$projectIdConOp."&d-277541-fn_c_issue_date={?}&d-277541-fn_c_issue_date={?}&d-277541-fn_c_title={?}";
		$dash_cons_LE_card = $userviewPrefix."land/_/dashLandEnc_sslr?d-4673600-fn_package_uuid=".$packageUuidIdConOp."&d-4673600-fn_project_id=".$projectIdConOp."&d-4673600-fn_issue_date={?}&d-4673600-fn_issue_date={?}&d-4673600-fn_section={?}&d-4673600-fn_issue_status={?}";
		$dash_cons_BP_card = $userviewPrefix."bp/_/dashListBumi_sslr?d-4913494-fn_project_uuid=".$this->currPackageUuid."&d-4913494-fn_package_uuid=".$packageIdConOp."&d-4913494-fn_category={?}&d-4913494-fn_id={?}";
		$dash_cons_SMH_card = $userviewPrefix."smh/_/dashboardTotalManHours_sslr?d-4232350-fn_package_uuid=".$packageUuidIdConOp."&d-4232350-fn_project_id=".$projectIdConOp."&d-4232350-fn_section={?}&d-4232350-fn_year={?}&d-4232350-fn_month={?}&d-4232350-fn_total_mh_wtlti={?}&d-4232350-fn_culmulative_mh_wlti={?}&d-4232350-fn_culmulative_mh_wtlti={?}";
		$dash_cons_INC_card = $userviewPrefix."inc/_/dashboardIncident_sslr?d-2217633-fn_package_uuid=".$packageUuidIdConOp."&d-2217633-fn_project_id=".$projectIdConOp."&d-2217633-fn_c_fatality_filter={?}&d-2217633-fn_section={?}&dateFrom={?}&dateTo={?}&d-2217633-fn_c_incident_category_filter={?}";
		$dash_cons_SA_card = $userviewPrefix."sa/_/dashboardSafetyAct_sslr?d-1573483-fn_package_uuid=".$packageUuidIdConOp."&d-1573483-fn_project_id=".$projectIdConOp."&d-1573483-fn_section={?}&d-1573483-fn_year={?}&d-1573483-fn_month={?}&d-1573483-fn_package_id={?}&d-1573483-fn_committee_filter={?}&d-1573483-fn_toolbox_filter={?}&d-1573483-fn_traffic_filter={?}";
		$dash_cons_MS_card = $userviewPrefix."ms/_/dashMethodStatement_sslr?d-1354093-fn_package_uuid=".$packageUuidIdConOp."&d-1354093-fn_project_id=".$projectIdConOp."&d-1354093-fn_issued_date={?}&d-1354093-fn_issued_date={?}&d-1354093-fn_c_approval_status_filter={?}&d-1354093-fn_section={?}&d-1354093-fn_aging_filter={?}&d-1354093-fn_aging_filter={?}&d-1354093-fn_review_filter={?}";
		$dash_cons_MT_card = $userviewPrefix."ma/_/dashboardMaterialApproval_sslr?d-5423157-fn_package_uuid=".$packageUuidIdConOp."&d-5423157-fn_project_id=".$projectIdConOp."&d-5423157-fn_submission_date={?}&d-5423157-fn_submission_date={?}&d-5423157-fn_section={?}&d-5423157-fn_c_approval_code_filter={?}&d-5423157-fn_aging_filter={?}&d-5423157-fn_aging_filter={?}";
		$dash_cons_RFI_card = $userviewPrefix."rfi/_/dashboardReqForInfo_sslr?d-7507338-fn_package_uuid=".$packageUuidIdConOp."&d-7507338-fn_project_id=".$projectIdConOp."&d-7507338-fn_date_request={?}&d-7507338-fn_date_request={?}&d-7507338-fn_section={?}&d-7507338-fn_filter_c_rfi_acknowledge={?}&d-7507338-fn_current_filter={?}";
		$dash_cons_SDL_card = $userviewPrefix."sdl/_/dashboardSiteDailyLog_sslr?d-5026949-fn_package_uuid=".$packageUuidIdConOp."&d-5026949-fn_project_id=".$projectIdConOp."&d-5026949-fn_submission_date={?}&d-5026949-fn_submission_date={?}&d-5026949-fn_section={?}&d-5026949-fn_ref_no={?}";
		$dash_cons_NCR_card = $userviewPrefix."ncr/_/dashNonConReport_sslr?d-5765882-fn_c_package_uuid=".$packageUuidIdConOp."&d-5765882-fn_project_id=".$projectIdConOp."&d-5765882-fn_date_issued={?}&d-5765882-fn_date_issued={?}&d-5765882-fn_work_discipline_filter={?}&d-5765882-fn_section={?}&d-5765882-fn_status_filter={?}&d-5765882-fn_type_filter={?}&d-5765882-fn_aging_filter={?}&d-5765882-fn_aging_filter={?}";
		$dash_cons_NOI_card = $userviewPrefix."noi/_/dashboardNoticeOfImprovement_sslr?d-5948340-fn_package_uuid=".$packageUuidIdConOp."&d-5948340-fn_project_id=".$projectIdConOp."&d-5948340-fn_date_issued={?}&d-5948340-fn_date_issued={?}&d-5948340-fn_section={?}&d-5948340-fn_status_filter={?}&d-5948340-fn_type_filter={?}";
		$dash_cons_WIR_card = $userviewPrefix."wir/_/dashWorkInspectionRequest_sslr?d-1143445-fn_package_uuid=".$packageUuidIdConOp."&d-1143445-fn_project_id=".$projectIdConOp."&d-1143445-fn_propose_date={?}&d-1143445-fn_propose_date={?}&d-1143445-fn_section={?}&d-1143445-fn_status_filter={?}&d-1143445-fn_work_discipline_filter={?}";
		$dash_cons_RR_card =$userviewPrefix."rr/_/dashRisk_sslr?d-1969236-fn_c_package_uuid=".$packageUuidIdConOp."&d-1969236-fn_project_id=".$projectIdConOp."&d-1969236-fn_c_risk_description={?}&d-1969236-fn_dateCreated={?}&d-1969236-fn_dateCreated={?}&d-1969236-fn_c_percentage={?}";

		$consLinkArr = array(
			// myTask
			'cons_json_datalist_inboxv3' => $cons_json_datalist_inboxv3,

			//Land Process for Link Lot ID
			'cons_linkLot_LR' => $cons_linkLot_LR,
			'cons_linkLot_LI' => $cons_linkLot_LI,

			// joget.php getJogetProcessRecords()
			'cons_json_datalist_LA' => $cons_json_datalist_LA,
			'cons_json_datalist_LI' => $cons_json_datalist_LI,
			'cons_json_datalist_LR' => $cons_json_datalist_LR,
			'cons_json_datalist_NOI' => $cons_json_datalist_NOI,
			'cons_json_datalist_NCR' => $cons_json_datalist_NCR,
			'cons_json_datalist_WIR' => $cons_json_datalist_WIR,
			'cons_json_datalist_DCR' => $cons_json_datalist_DCR,
			'cons_json_datalist_RFI' => $cons_json_datalist_RFI,
			'cons_json_datalist_MOS' => $cons_json_datalist_MOS,
			'cons_json_datalist_MS' => $cons_json_datalist_MS,
			'cons_json_datalist_IR' => $cons_json_datalist_IR,
			'cons_json_datalist_RS' => $cons_json_datalist_RS,
			'cons_json_datalist_PBC' => $cons_json_datalist_PBC,
			'cons_json_datalist_SP' => $cons_json_datalist_SP,

			// Datalist
			'cons_datalist_RFI_SSLR2' => $cons_datalist_RFI_SSLR2,
			'cons_datalist_SD_SSLR2' => $cons_datalist_SD_SSLR2,
			'cons_datalist_SA_SSLR2' => $cons_datalist_SA_SSLR2,
			'cons_datalist_SMH_SSLR2' => $cons_datalist_SMH_SSLR2,
			'cons_datalist_SDL_SSLR2' => $cons_datalist_SDL_SSLR2,
			'cons_datalist_WIR_SSLR2' => $cons_datalist_WIR_SSLR2,
			'cons_datalist_MOS_SSLR2' => $cons_datalist_MOS_SSLR2,
			'cons_datalist_NCR_SSLR2' => $cons_datalist_NCR_SSLR2,
			'cons_datalist_RR_SSLR2' => $cons_datalist_RR_SSLR2,
			'cons_datalist_LR_SSLR2' => $cons_datalist_LR_SSLR2,
			'cons_datalist_LI_SSLR2' => $cons_datalist_LI_SSLR2,
			'cons_datalist_LE_SSLR2' => $cons_datalist_LE_SSLR2,
			'cons_datalist_DCR_SSLR2' => $cons_datalist_DCR_SSLR2,
			'cons_datalist_RSDL_SSLR2' => $cons_datalist_RSDL_SSLR2,
			'cons_datalist_NOI_SSLR2' => $cons_datalist_NOI_SSLR2,
			'cons_datalist_MS_SSLR2' => $cons_datalist_MS_SSLR2,
			'cons_datalist_RS_SSLR2' => $cons_datalist_RS_SSLR2,
			'cons_datalist_IR_SSLR2' => $cons_datalist_IR_SSLR2,
			'cons_datalist_PBC_SSLR2' => $cons_datalist_PBC_SSLR2,
			'cons_datalist_BP_SSLR2' => $cons_datalist_BP_SSLR2,

			// Issuance
			'cons_issue_RFI_SSLR2' => $cons_issue_RFI_SSLR2,
			'cons_issue_SD_SSLR2' => $cons_issue_SD_SSLR2,
			'cons_issue_SA_SSLR2' => $cons_issue_SA_SSLR2,
			'cons_issue_SMH_SSLR2' => $cons_issue_SMH_SSLR2,
			'cons_issue_SDL_SSLR2' => $cons_issue_SDL_SSLR2,
			'cons_issue_WIR_SSLR2' => $cons_issue_WIR_SSLR2,
			'cons_issue_MOS_SSLR2' => $cons_issue_MOS_SSLR2,
			'cons_issue_NCR_SSLR2' => $cons_issue_NCR_SSLR2,
			'cons_issue_RR_SSLR2' => $cons_issue_RR_SSLR2,
			'cons_issue_LR_SSLR2' => $cons_issue_LR_SSLR2,
			'cons_issue_LI_SSLR2' => $cons_issue_LI_SSLR2,
			'cons_issue_DCR_SSLR2' => $cons_issue_DCR_SSLR2,
			'cons_issue_RSDL_SSLR2' => $cons_issue_RSDL_SSLR2,
			'cons_issue_NOI_SSLR2' => $cons_issue_NOI_SSLR2,
			'cons_issue_MS_SSLR2' => $cons_issue_MS_SSLR2,
			'cons_issue_RS_SSLR2' => $cons_issue_RS_SSLR2,
			'cons_issue_IR_SSLR2' => $cons_issue_IR_SSLR2,
			'cons_issue_PBC_SSLR2' => $cons_issue_PBC_SSLR2,
			'cons_issue_BP_SSLR2' => $cons_issue_BP_SSLR2,

			// Manage
			'cons_manage_SA_SSLR2' => $cons_manage_SA_SSLR2,
			'cons_manage_SMH_SSLR2' => $cons_manage_SMH_SSLR2,
			'cons_manage_RR_SSLR2' => $cons_manage_RR_SSLR2,
			'cons_manage_LR_SSLR2' => $cons_manage_LR_SSLR2,
			'cons_manage_LI_SSLR2' => $cons_manage_LI_SSLR2,
			'cons_manage_LE_SSLR2' => $cons_manage_LE_SSLR2,
			'cons_manage_IR_SSLR2' => $cons_manage_IR_SSLR2,

			// Setup
			'cons_issue_IR_WD_Setup' => $cons_issue_IR_WD_Setup,
			'cons_setup_PBC_Category' => $cons_setup_PBC_Category,
			'cons_issue_RR_Category_Setup' => $cons_issue_RR_Category_Setup,
			'cons_issue_RR_Sub_Category_Setup' => $cons_issue_RR_Sub_Category_Setup,
			'cons_issue_RR_Description_Setup' => $cons_issue_RR_Description_Setup,
			'cons_issue_sdl_user_section_setup' => $cons_issue_sdl_user_section_setup,
			'cons_issue_SDL_Machinery_Setup' =>$cons_issue_SDL_Machinery_Setup,
			'cons_issue_SDL_Manpower_Setup' => $cons_issue_SDL_Manpower_Setup,
			'cons_issue_WIR_Code_Setup' => $cons_issue_WIR_Code_Setup,

			//For Digital Reporting
			'cons_issue_PPU' => $cons_issue_PPU,
			'cons_issue_PF' => $cons_issue_PF,
			'cons_datalist_PPU' => $cons_datalist_PPU,
			'cons_datalist_PF' => $cons_datalist_PF,

			//markup
			'cons_issue_markup' => $cons_issue_markup,
			'cons_datalist_markup' => $cons_datalist_markup,

			// bulk import
			'cons_form_bulk' => $cons_form_bulk,

			// Dashboard
			'dash_cons_LI' => $dash_cons_LI,
			'dash_cons_LE' => $dash_cons_LE,
			'dash_cons_PBS' => $dash_cons_PBS,
			'dash_cons_BP' => $dash_cons_BP,
			'dash_cons_SMH' => $dash_cons_SMH,
			'dash_cons_SA' => $dash_cons_SA,
			'dash_cons_INC' => $dash_cons_INC,
			'dash_cons_RR' => $dash_cons_RR,
			'dash_cons_MT' => $dash_cons_MT,
			'dash_cons_MS' => $dash_cons_MS,
			'dash_cons_NCR' => $dash_cons_NCR,
			'dash_cons_RFI' => $dash_cons_RFI,
			'dash_cons_NOI' => $dash_cons_NOI,
			'dash_cons_WIR' => $dash_cons_WIR,
			'dash_cons_SDL' => $dash_cons_SDL,

			// Conop link
			'dash_cons_PBS_card' => $dash_cons_PBS_card,
			'dash_cons_LI_card' => $dash_cons_LI_card,
			'dash_cons_LI_table' => $dash_cons_LI_table,
			'dash_cons_LE_card' => $dash_cons_LE_card,
			'dash_cons_BP_card' => $dash_cons_BP_card,
			'dash_cons_SMH_card' => $dash_cons_SMH_card,
			'dash_cons_INC_card' => $dash_cons_INC_card,
			'dash_cons_SA_card' => $dash_cons_SA_card,
			'dash_cons_MS_card' => $dash_cons_MS_card,
			'dash_cons_MT_card' => $dash_cons_MT_card,
			'dash_cons_RFI_card' => $dash_cons_RFI_card,
			'dash_cons_SDL_card' => $dash_cons_SDL_card,
			'dash_cons_NCR_card' => $dash_cons_NCR_card,
			'dash_cons_NOI_card' => $dash_cons_NOI_card,
			'dash_cons_WIR_card' => $dash_cons_WIR_card,
			'dash_cons_RR_card' => $dash_cons_RR_card

		);
		$this->jogetAppLink = array_merge($this->jogetAppLink, $consLinkArr);
		return;

	}

	private function loadPFSSSLR2Url(){
		$jsonPrefix = $this->getJsonDatalistSrcPrefix('finance');
		$userviewPrefix = $this->getUserviewSrcPrefix('finance');
		$srcUrl = $this->getSSLRFinanceAppSrcRoleStatus();
		
		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = '{?}';
		}else{
			$projectIdConOp = $this->currPackageId;
		}

		// Project Setup
		$finance_list_AddEditProjectDetails_SSLR2 = $userviewPrefix."fb_uv_sslr?project_id=".$this->currPackageId."&contract_level=".$this->currContractLevel;
		$finance_list_ProjectInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ProjectInfo_SSLR2'].$this->currPackageId;
		$finance_list_ProjectUserInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ProjectUserInfo_SSLR2'].$this->currPackageId;
		$finance_list_WorkFlowApproval_SSLR2 = $userviewPrefix.$srcUrl['finance_list_WorkFlowApproval_SSLR2'].$this->currPackageId;
		$finance_list_FundingInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_list_FundingInfo_SSLR2'].$this->currPackageId;
		$finance_list_BudgetInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_list_BudgetInfo_SSLR2'].$this->currPackageId;
		$finance_list_AuditInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_json_AuditInfo_SSLR2'].$this->currPackageId;

		// Contract
		$finance_list_NewContract_SSLR2 = $userviewPrefix."create_contract_sslr?project_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&contract_level=".$this->currContractLevel;
		$finance_list_PublishedContracts_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ContractsUrl_SSLR2']."d-3731655-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_PublishedContractsFilter_SSLR2'];
		$finance_list_ContractInbox_SSLR2 = $userviewPrefix."contract_inbox_sslr?d-2073383-fn_project_id=".$this->currPackageId;
		$finance_list_ContractActivityForm_SSLR2 = $userviewPrefix."contract_inbox_sslr?activityId=";
		$finance_list_RejectedContracts_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ContractsUrl_SSLR2']."d-3731655-fn_project_id=".$this->currPackageId."&status1=Draft&status2=Upload%20BoQ";
		$finance_list_BulkUploadContracts_SSLR2 = $userviewPrefix."bulkImportContractSSLR?project_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&contract_level=".$this->currContractLevel;

		// Claims
		$finance_list_CurrentClaims_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl_SSLR2']."d-5151229-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_CurrentClaimsFilter_SSLR2'];
		$finance_list_RejectedClaims_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl_SSLR2']."d-5151229-fn_project_id=".$this->currPackageId."&status1=Reject";
		$finance_list_ApprovedClaims_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl_SSLR2']."d-5151229-fn_project_id=".$this->currPackageId."&status1=Complete&status2=Updated&status3=IPC Approved&status4=Payment Received";
		$finance_list_NewClaim_SSLR2 = $userviewPrefix.$srcUrl['finance_list_NewClaim_SSLR2'].$this->currPackageId. "&d-6534474-fn_status=Complete";
		$finance_list_ClaimInbox_SSLR2 = $userviewPrefix."claim_inbox_sslr?d-7941266-fn_project_id=".$this->currPackageId;
		$finance_list_ClaimApprovedRejected_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl_SSLR2']."id=";
		$finance_list_ClaimActivityForm_SSLR2 = $userviewPrefix. "claim_inbox_sslr?activityId=";

		// VOS
		$finance_list_NewVO_SSLR2 = $userviewPrefix.$srcUrl['finance_list_NewVO_SSLR2'].$this->currPackageId. "&d-7299148-fn_status=Complete";
		$finance_list_CurrentVOs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_VOsUrl_SSLR2']."d-5954156-fn_project_id=" .$this->currPackageId.$srcUrl['finance_list_CurrentVOsFilter_SSLR2'];
		$finance_list_ApprovedVOs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_VOsUrl_SSLR2']."d-5954156-fn_project_id=" .$this->currPackageId. "&status1=complete";
		$finance_list_RejectedVOs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_VOsUrl_SSLR2']."d-5954156-fn_project_id=" .$this->currPackageId. "&status1=reject";
		$finance_list_VOInbox_SSLR2 = $userviewPrefix."vo_inbox_sslr?d-8189892-fn_project_id=".$this->currPackageId;
		$finance_list_VOApprovedRejected_SSLR2 = $userviewPrefix.$srcUrl['finance_list_VOsUrl_SSLR2']."id=";
		$finance_list_VOActivityForm_SSLR2 = $userviewPrefix. "vo_inbox_sslr?activityId=";

		// Dashboard
		$finance_dash_contract_SSLR2 = $jsonPrefix."dashboardContractList_sslr?d-2000815-fn_status=complete&d-2000815-fn_project_id=";
		$finance_dash_claim_SSLR2  = $jsonPrefix."claimDashboardViewList_sslr?status1=complete&status2=Updated&status3=IPC%20Approved&status4=Payment%20Received&d-8200904-fn_contract_id_string={?}&d-8200904-fn_project_id={?}";
		$finance_dash_vo_SSLR2  = $jsonPrefix."dashboardVoList_sslr?status1=complete&d-4070284-fn_contract_string_id={?}&d-4070284-fn_project_id={?}";

		//dashboard conOpLink
		$finance_contract_dash_card_SSLR2 = $userviewPrefix."dashboardContractList_sslr?d-2000815-fn_project_id=".$projectIdConOp."&d-2000815-fn_contract_id={?}";
		$finance_dash_claim_card_SSLR2 = $userviewPrefix."claimDashboardViewList_sslr?d-8200904-fn_project_id=".$projectIdConOp."&d-8200904-fn_claim_id={?}";
		$finance_dash_vo_card_SSLR2 = $userviewPrefix."voDashboardList_sslr?d-4070284-fn_project_id=".$projectIdConOp."&d-4070284-fn_contract_string_id={?}&d-4070284-fn_vo_type={?}";
		
		// Lookup
		$finance_list_leadConsultantList_SSLR2 = $userviewPrefix. "lookup_leadConsultant_sslr?contract_level=".$this->currContractLevel.'&d-1855237-fn_project_id='.$projectIdConOp;

		// Notifications
		$finance_json_Notificationsv3 = $jsonPrefix."generalInbox?d-5171348-fn_c_project_id=".$this->currPackageId."&d-5171348-fn_c_assign_to=".$this->currUserEmail; //getJogetNotifications()
		

		$financeLinkArr = array(
			//projectDetails Urls
			'finance_list_ProjectInfo_SSLR2' => $finance_list_ProjectInfo_SSLR2,
			'finance_list_ProjectUserInfo_SSLR2' => $finance_list_ProjectUserInfo_SSLR2,
			'finance_list_WorkFlowApproval_SSLR2' => $finance_list_WorkFlowApproval_SSLR2,
			'finance_list_FundingInfo_SSLR2' => $finance_list_FundingInfo_SSLR2,
			'finance_list_BudgetInfo_SSLR2' => $finance_list_BudgetInfo_SSLR2,
			'finance_list_AuditInfo_SSLR2' => $finance_list_AuditInfo_SSLR2,
			'finance_list_AddEditProjectDetails_SSLR2' => $finance_list_AddEditProjectDetails_SSLR2,
			'finance_list_leadConsultantList_SSLR2' => $finance_list_leadConsultantList_SSLR2,
			// Contract Urls
			'finance_list_PublishedContracts_SSLR2' => $finance_list_PublishedContracts_SSLR2,
			'finance_list_NewContract_SSLR2' => $finance_list_NewContract_SSLR2,
			'finance_list_RejectedContracts_SSLR2' => $finance_list_RejectedContracts_SSLR2,
			'finance_list_ContractInbox_SSLR2' => $finance_list_ContractInbox_SSLR2,
			'finance_list_ContractActivityForm_SSLR2' => $finance_list_ContractActivityForm_SSLR2,
			'finance_list_BulkUploadContracts_SSLR2' => $finance_list_BulkUploadContracts_SSLR2,
			//Claim Urls
			'finance_list_CurrentClaims_SSLR2' => $finance_list_CurrentClaims_SSLR2,
			'finance_list_RejectedClaims_SSLR2' => $finance_list_RejectedClaims_SSLR2,
			'finance_list_ApprovedClaims_SSLR2' => $finance_list_ApprovedClaims_SSLR2,
			'finance_list_NewClaim_SSLR2' => $finance_list_NewClaim_SSLR2,
			'finance_list_ClaimInbox_SSLR2' => $finance_list_ClaimInbox_SSLR2,
			'finance_list_ClaimApprovedRejected_SSLR2' => $finance_list_ClaimApprovedRejected_SSLR2,
			'finance_list_ClaimActivityForm_SSLR2' => $finance_list_ClaimActivityForm_SSLR2,
			//VO Urls
			'finance_list_CurrentVOs_SSLR2' => $finance_list_CurrentVOs_SSLR2,
			'finance_list_ApprovedVOs_SSLR2'=> $finance_list_ApprovedVOs_SSLR2,
			'finance_list_RejectedVOs_SSLR2'=> $finance_list_RejectedVOs_SSLR2,
			'finance_list_NewVO_SSLR2' => $finance_list_NewVO_SSLR2,
			'finance_list_VOInbox_SSLR2'=> $finance_list_VOInbox_SSLR2,
			'finance_list_VOActivityForm_SSLR2' => $finance_list_VOActivityForm_SSLR2,
			'finance_list_VOApprovedRejected_SSLR2' => $finance_list_VOApprovedRejected_SSLR2,
			// Dashboard
			'finance_dash_contract_SSLR2' => $finance_dash_contract_SSLR2,
			'finance_dash_claim_SSLR2' => $finance_dash_claim_SSLR2,
			'finance_dash_vo_SSLR2' => $finance_dash_vo_SSLR2,
			'finance_contract_dash_card_SSLR2' => $finance_contract_dash_card_SSLR2,
			'finance_dash_claim_card_SSLR2' => $finance_dash_claim_card_SSLR2,
			'finance_dash_vo_card_SSLR2' => $finance_dash_vo_card_SSLR2,
			// Notifications
			'finance_json_Notificationsv3' => $finance_json_Notificationsv3
		);

		$this->jogetAppLink = array_merge($this->jogetAppLink, $financeLinkArr);
	
		return;
	}

	private function loadPFSSSLR2DownSUrl(){
		$jsonPrefix = $this->getJsonDatalistSrcPrefix('finance');
		$userviewPrefix = $this->getUserviewSrcPrefix('finance');
		$srcUrl = $this->getSSLRDownSFinanceAppSrcRoleStatus();
		
		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = '{?}';
		}else{
			$projectIdConOp = $this->currPackageId;
		}

		// Project Setup
		$finance_list_AddEditProjectDetails_SSLR2 = $userviewPrefix."fb_uv_sslr?project_id=".$this->currPackageId."&contract_level=".$this->currContractLevel;
		$finance_list_ProjectInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ProjectInfo_SSLR2'].$this->currPackageId;
		$finance_list_ProjectUserInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ProjectUserInfo_SSLR2'].$this->currPackageId;
		$finance_list_WorkFlowApproval_SSLR2 = $userviewPrefix.$srcUrl['finance_list_WorkFlowApproval_SSLR2'].$this->currPackageId;
		$finance_list_FundingInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_list_FundingInfo_SSLR2'].$this->currPackageId;
		$finance_list_BudgetInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_list_BudgetInfo_SSLR2'].$this->currPackageId;
		$finance_list_AuditInfo_SSLR2 = $userviewPrefix.$srcUrl['finance_json_AuditInfo_SSLR2'].$this->currPackageId;

		// Contract
		$finance_list_NewContract_SSLR2 = $userviewPrefix."create_contract_sslr?project_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&contract_level=".$this->currContractLevel;
		$finance_list_PublishedContracts_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ContractsUrl_SSLR2']."d-3731655-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_PublishedContractsFilter_SSLR2'];
		$finance_list_ContractInbox_SSLR2 = $userviewPrefix."contract_inbox_sslr?d-2073383-fn_project_id=".$this->currPackageId;
		$finance_list_ContractActivityForm_SSLR2 = $userviewPrefix."contract_inbox_sslr?activityId=";
		$finance_list_RejectedContracts_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ContractsUrl_SSLR2']."d-3731655-fn_project_id=".$this->currPackageId."&status1=Reject";

		// Claims
		$finance_list_CurrentClaims_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl_SSLR2']."d-5151229-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_CurrentClaimsFilter_SSLR2'];
		$finance_list_RejectedClaims_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl_SSLR2']."d-5151229-fn_project_id=".$this->currPackageId."&status1=Reject";
		$finance_list_ApprovedClaims_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl_SSLR2']."d-5151229-fn_project_id=".$this->currPackageId."&status1=Complete&status2=Updated&status3=IPC Approved&status4=Payment Received";
		$finance_list_NewClaim_SSLR2 = $userviewPrefix.$srcUrl['finance_list_NewClaim_SSLR2'].$this->currPackageId. "&d-6534474-fn_status=Complete";
		$finance_list_ClaimInbox_SSLR2 = $userviewPrefix."claim_inbox_sslr?d-7941266-fn_project_id=".$this->currPackageId;
		$finance_list_ClaimApprovedRejected_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl_SSLR2']."id=";
		$finance_list_ClaimActivityForm_SSLR2 = $userviewPrefix. "claim_inbox_sslr?activityId=";

		// VOS
		$finance_list_NewVO_SSLR2 = $userviewPrefix.$srcUrl['finance_list_NewVO_SSLR2'].$this->currPackageId. "&d-7299148-fn_status=Complete";
		$finance_list_CurrentVOs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_VOsUrl_SSLR2']."d-5954156-fn_project_id=" .$this->currPackageId.$srcUrl['finance_list_CurrentVOsFilter_SSLR2'];
		$finance_list_ApprovedVOs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_VOsUrl_SSLR2']."d-5954156-fn_project_id=" .$this->currPackageId. "&status1=complete";
		$finance_list_RejectedVOs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_VOsUrl_SSLR2']."d-5954156-fn_project_id=" .$this->currPackageId. "&status1=reject";
		$finance_list_VOInbox_SSLR2 = $userviewPrefix."vo_inbox_sslr?d-8189892-fn_project_id=".$this->currPackageId;
		$finance_list_VOApprovedRejected_SSLR2 = $userviewPrefix.$srcUrl['finance_list_VOsUrl_SSLR2']."id=";
		$finance_list_VOActivityForm_SSLR2 = $userviewPrefix. "vo_inbox_sslr?activityId=";

		// Dashboard
		$finance_dash_contract_SSLR2 = $jsonPrefix."dashboardContractList_sslr?d-2000815-fn_status=complete&d-2000815-fn_project_id=";
		$finance_dash_claim_SSLR2  = $jsonPrefix."claimDashboardViewList_sslr?status1=complete&status2=Updated&status3=IPC%20Approved&status4=Payment%20Received&d-8200904-fn_contract_id={?}&d-8200904-fn_project_id={?}";
		$finance_dash_vo_SSLR2  = $jsonPrefix."dashboardVoList_sslr?status1=complete&d-4070284-fn_contract_id={?}&d-4070284-fn_project_id={?}";
		$finance_dash_acs_SSLR2  = $jsonPrefix."dashboardContractAcsList_sslr?d-1147566-fn_contract_id={?}&d-1147566-fn_project_id={?}";
		$finance_dash_eot_SSLR2  = $jsonPrefix."dashboardContractEotList_sslr?d-2584425-fn_contract_id={?}&d-2584425-fn_project_id={?}";
		$finance_contract_lead_consultant = $jsonPrefix."list_lookupLeadConsultant_sslr?project_id=";

		//dashboard conOpLink
		$finance_contract_dash_card_SSLR2 = $userviewPrefix."dashboardContractList_sslr?d-2000815-fn_project_id=".$projectIdConOp."&d-2000815-fn_id={?}";
		$finance_dash_claim_card_SSLR2 = $userviewPrefix."claimDashboardViewList_sslr?d-8200904-fn_project_id=".$projectIdConOp."&d-8200904-fn_id={?}&d-8200904-fn_contract_id={?}";
		$finance_dash_vo_card_SSLR2 = $userviewPrefix."voDashboardList_sslr?status1=complete&d-4070284-fn_project_id=".$projectIdConOp."&d-4070284-fn_contract_id={?}";
		$finance_dash_acs_card_SSLR2 = $userviewPrefix."dashboardContractAcsList_sslr?d-1147566-fn_project_id=".$projectIdConOp."&d-1147566-fn_contract_id={?}";
		$finance_dash_eot_card_SSLR2 = $userviewPrefix."dashboardContractEotList_sslr?d-2584425-fn_project_id=".$projectIdConOp."&d-2584425-fn_id={?}";
		
		// Lookup
		$finance_list_leadConsultantList_SSLR2 = $userviewPrefix. "lookup_leadConsultant_sslr?contract_level=".$this->currContractLevel.'&project_id='.$projectIdConOp;

		// Notifications
		$finance_json_Notificationsv3 = $jsonPrefix."generalInbox_sslr?d-6747245-fn_c_project_id=".$this->currPackageId."&d-6747245-fn_c_assign_to=".$this->currUserEmail; //getJogetNotifications()

		// ACS
		$finance_list_ACS_SSLR2 = $userviewPrefix.$srcUrl['finance_list_Acs_SSLR2'].$this->currPackageId;
		$finance_list_ACS_New_SSLR2 = $userviewPrefix.$srcUrl['finance_list_newAcs_SSLR2'].$this->currPackageId;

		// EOT
		$finance_list_EOTInbox_SSLR2 = $userviewPrefix."eot_inbox_sslr?d-5359055-fn_project_id=".$this->currPackageId;
		$finance_list_CurrentEOTs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_EOTsUrl_SSLR2']."d-7651759-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_CurrentEOTsFilter_SSLR2'];
		$finance_list_NewEOT_SSLR2 = $userviewPrefix.$srcUrl['finance_list_NewEOT_SSLR2'].$this->currPackageId."&d-3039819-fn_status=Complete";
		$finance_list_RejectedEOTs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_EOTsUrl_SSLR2']."d-7651759-fn_project_id=".$this->currPackageId."&status1=reject";
		$finance_list_ApprovedEOTs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_EOTsUrl_SSLR2']."d-7651759-fn_project_id=".$this->currPackageId."&status1=complete";
		$finance_list_ApprovedVOEOTs_SSLR2 = $userviewPrefix.$srcUrl['finance_list_ApprovedVOEOTs_SSLR2']."d-2214246-fn_project_id=".$this->currPackageId;

		// $finance_list_EOT_SSLR2 = $userviewPrefix.$srcUrl['finance_list_Eot_SSL2'].$this->currPackageId;
		// $finance_list_EOT_New_SSLR2 = $userviewPrefix.$srcUrl['finance_list_newEot'].$this->currPackageId;
		
		$financeLinkArr = array(
			//projectDetails Urls
			'finance_list_ProjectInfo_SSLR2' => $finance_list_ProjectInfo_SSLR2,
			'finance_list_ProjectUserInfo_SSLR2' => $finance_list_ProjectUserInfo_SSLR2,
			'finance_list_WorkFlowApproval_SSLR2' => $finance_list_WorkFlowApproval_SSLR2,
			'finance_list_FundingInfo_SSLR2' => $finance_list_FundingInfo_SSLR2,
			'finance_list_BudgetInfo_SSLR2' => $finance_list_BudgetInfo_SSLR2,
			'finance_list_AuditInfo_SSLR2' => $finance_list_AuditInfo_SSLR2,
			'finance_list_AddEditProjectDetails_SSLR2' => $finance_list_AddEditProjectDetails_SSLR2,
			'finance_list_leadConsultantList_SSLR2' => $finance_list_leadConsultantList_SSLR2,
			// Contract Urls
			'finance_list_PublishedContracts_SSLR2' => $finance_list_PublishedContracts_SSLR2,
			'finance_list_NewContract_SSLR2' => $finance_list_NewContract_SSLR2,
			'finance_list_RejectedContracts_SSLR2' => $finance_list_RejectedContracts_SSLR2,
			'finance_list_ContractInbox_SSLR2' => $finance_list_ContractInbox_SSLR2,
			'finance_list_ContractActivityForm_SSLR2' => $finance_list_ContractActivityForm_SSLR2,
			//Claim Urls
			'finance_list_CurrentClaims_SSLR2' => $finance_list_CurrentClaims_SSLR2,
			'finance_list_RejectedClaims_SSLR2' => $finance_list_RejectedClaims_SSLR2,
			'finance_list_ApprovedClaims_SSLR2' => $finance_list_ApprovedClaims_SSLR2,
			'finance_list_NewClaim_SSLR2' => $finance_list_NewClaim_SSLR2,
			'finance_list_ClaimInbox_SSLR2' => $finance_list_ClaimInbox_SSLR2,
			'finance_list_ClaimApprovedRejected_SSLR2' => $finance_list_ClaimApprovedRejected_SSLR2,
			'finance_list_ClaimActivityForm_SSLR2' => $finance_list_ClaimActivityForm_SSLR2,
			//VO Urls
			'finance_list_CurrentVOs_SSLR2' => $finance_list_CurrentVOs_SSLR2,
			'finance_list_ApprovedVOs_SSLR2'=> $finance_list_ApprovedVOs_SSLR2,
			'finance_list_RejectedVOs_SSLR2'=> $finance_list_RejectedVOs_SSLR2,
			'finance_list_NewVO_SSLR2' => $finance_list_NewVO_SSLR2,
			'finance_list_VOInbox_SSLR2'=> $finance_list_VOInbox_SSLR2,
			'finance_list_VOActivityForm_SSLR2' => $finance_list_VOActivityForm_SSLR2,
			'finance_list_VOApprovedRejected_SSLR2' => $finance_list_VOApprovedRejected_SSLR2,
			// Dashboard
			'finance_dash_contract_SSLR2' => $finance_dash_contract_SSLR2,
			'finance_dash_claim_SSLR2' => $finance_dash_claim_SSLR2,
			'finance_dash_vo_SSLR2' => $finance_dash_vo_SSLR2,
			'finance_contract_dash_card_SSLR2' => $finance_contract_dash_card_SSLR2,
			'finance_dash_claim_card_SSLR2' => $finance_dash_claim_card_SSLR2,
			'finance_dash_vo_card_SSLR2' => $finance_dash_vo_card_SSLR2,
			'finance_dash_acs_SSLR2' => $finance_dash_acs_SSLR2,
			'finance_dash_eot_SSLR2' => $finance_dash_eot_SSLR2,
			'finance_dash_acs_card_SSLR2' => $finance_dash_acs_card_SSLR2,
			'finance_dash_eot_card_SSLR2' => $finance_dash_eot_card_SSLR2,
			'finance_contract_lead_consultant' => $finance_contract_lead_consultant,
			// Notifications
			'finance_json_Notificationsv3' => $finance_json_Notificationsv3,
			//ACS
			'finance_list_ACS_SSLR2' => $finance_list_ACS_SSLR2,
			'finance_list_ACS_New_SSLR2' => $finance_list_ACS_New_SSLR2,
			// EOT
			'finance_list_EOTInbox_SSLR2' => $finance_list_EOTInbox_SSLR2,
			'finance_list_CurrentEOTs_SSLR2'=> $finance_list_CurrentEOTs_SSLR2,
			'finance_list_NewEOT_SSLR2' => $finance_list_NewEOT_SSLR2,
			'finance_list_RejectedEOTs_SSLR2' => $finance_list_RejectedEOTs_SSLR2,
			'finance_list_ApprovedEOTs_SSLR2' => $finance_list_ApprovedEOTs_SSLR2,
			'finance_list_ApprovedVOEOTs_SSLR2'=> $finance_list_ApprovedVOEOTs_SSLR2



			// 'finance_list_EOT_SSLR2' => $finance_list_EOT_SSLR2,
			// 'finance_list_EOT_New_SSLR2' => $finance_list_EOT_New_SSLR2
		);
		
		$this->jogetAppLink = array_merge($this->jogetAppLink, $financeLinkArr);
	
		return;
	}
	
	private function loadDocumentSSLR2Url(){
		$userviewPrefix = $this->getUserviewSrcPrefix('doc');
		$jsonPrefix = $this->getJsonDatalistSrcPrefix('doc');
		$empty = "";

		// doc  common
		$doc_list_doc_draft = $userviewPrefix."draftDocument_sslr?d-6954306-fn_package_uuid=".$this->currPackageUuid;
		
		// correspondance common
		$doc_form_corr_respond = $userviewPrefix."correspondence_response_sslr";
		$doc_list_corr_inbox = $userviewPrefix."correspondence_custom_inbox_sslr?d-4419879-fn_correspondence.package_uuid=".$this->currPackageUuid;
		$doc_json_corr_notification = $jsonPrefix."doc_notification_sslr?d-7471053-fn_package_uuid=".$this->currPackageUuid."&d-7471053-fn_corr_act_user.to=".$this->currUserEmail;
		$doc_bulk_corr_register = $userviewPrefix."bulkImportCorr_sslr";
		
		//set up common
		$doc_setup_lookup_entity = $userviewPrefix."lookupEntity_crud_sslr?d-4521449-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_lookup_docType = $userviewPrefix."lookupDocType_crud_sslr?d-4589620-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_lookup_docSubType = $userviewPrefix."lookupDocSubType_crud_sslr?d-5730506-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_lookup_drawing = $userviewPrefix."lookupDrawing_crud_sslr?d-4921072-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_lookup_group = $userviewPrefix."lookupGroup_crud_sslr?d-7160387-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_lookup_dist_group = $userviewPrefix."setupDistributionGroup_crud_sslr?d-4926584-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_lookup_location = $userviewPrefix."lookupLocation_crud_sslr?d-1460411-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_lookup_section = $userviewPrefix."lookupSection_crud_sslr?d-6832753-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		
		//markup review
		$cons_issue_markupv3 = $userviewPrefix."markUpForm?project_id_number=".$this->pid."&package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$cons_datalist_markup = $userviewPrefix."markupForm_crud?d-6595155-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_markupv3 = $jsonPrefix."list_markupForm?d-6595155-fn_package_uuid=".$this->currPackageUuid;
		
		$dash_doc_register_doc_card = '';
		$dash_doc_register_corr_card = '';
		$dash_doc_register_corr_cardNotUrgent = '';
		$dash_doc_register_corr_cardUrgent = '';
		$dash_doc_register_corr_cardInc = '';
		$dash_doc_register_corr_cardOut = '';
		$dash_doc_register_corr_cardIncParent = '';
		$dash_doc_register_corr_cardOutParent = '';
		$dash_doc_register_corr_cardType = '';

		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->currPackageId;
			$packageUuidIdConOp = '{?}';
			$currentOrg = '';
		}else{
			$projectIdConOp = '';
			$packageUuidIdConOp = $this->currPackageUuid;
			$currentOrg = $this->currUserOrg;
		}

		switch ($this->currProjectOwner) {
			case "SSLR2":
				//doc
				$doc_form_doc_register = $userviewPrefix."registerDocument_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId; //doc register
				$doc_list_doc_my = $userviewPrefix."documentMy_crud_sslr?d-6599311-fn_package_uuid=".$this->currPackageUuid."&d-6599311-fn_title=".$empty."&d-6599311-fn_ref_no=".$empty."&d-6599311-fn_doc_subtype=".$empty."&d-6599311-fn_doc_type=".$empty."&d-6599311-fn_department=".$empty;  //Document (My)
				$doc_list_doc_open = $userviewPrefix."documentOpen_crud_sslr?d-669157-fn_package_uuid=".$this->currPackageUuid."&d-669157-fn_title=".$empty."&d-669157-fn_ref_no=".$empty."&d-669157-fn_doc_subtype=".$empty."&d-669157-fn_doc_type=".$empty."&d-669157-fn_department=".$empty; // Document (Open)
				$doc_list_doc_restricted = $userviewPrefix."documentRestricted_crud_sslr?d-7455316-fn_package_uuid=".$this->currPackageUuid."&d-7455316-fn_title=".$empty."&d-7455316-fn_ref_no=".$empty."&d-7455316-fn_doc_subtype=".$empty."&d-7455316-fn_doc_type=".$empty."&d-7455316-fn_department=".$empty;  //Document (Restricted)
				$doc_list_doc_confidental = $userviewPrefix."documentConfidential_crud_sslr?d-8018023-fn_package_uuid=".$this->currPackageUuid."&d-8018023-fn_title=".$empty."&d-8018023-fn_ref_no=".$empty."&d-8018023-fn_doc_subtype=".$empty."&d-8018023-fn_doc_type=".$empty."&d-8018023-fn_department=".$empty;  //Document (Confidential)
				$doc_list_doc_arch = $userviewPrefix."documentArchived_crud_sslr?d-4999661-fn_package_uuid=".$this->currPackageUuid."&d-4999661-fn_title=".$empty."&d-4999661-fn_ref_no=".$empty."&d-4999661-fn_doc_subtype=".$empty."&d-4999661-fn_doc_type=".$empty."&d-4999661-fn_department=".$empty;  //Document (Archived)
				$doc_bulk_doc_register = $userviewPrefix."bulkImportSslr";
				
				//correspondence
				$doc_form_corr_register = $userviewPrefix."correspondence_run_sslr?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
				$doc_list_corr_my = $userviewPrefix."correspondence_my_sslr?d-2711788-fn_package_uuid=".$this->currPackageUuid."&d-2711788-fn_status=".$empty."&d-2711788-fn_doc_subject=".$empty."&d-2711788-fn_doc_date=".$empty."&d-2711788-fn_doc_id=".$empty."&d-2711788-fn_section=".$empty."&d-2711788-fn_third_party=".$empty;

				$doc_list_corr_int_all = $userviewPrefix."correspondence_crud_sslr?d-7795519-fn_package_uuid=".$this->currPackageUuid."&d-7795519-fn_status=".$empty."&d-7795519-fn_doc_subject=".$empty."&d-7795519-fn_doc_date=".$empty."&d-7795519-fn_doc_id=".$empty."&d-7795519-fn_section=".$empty."&d-7795519-fn_created_by_org_name=".$empty;
				$doc_list_corr_tp_incoming = $userviewPrefix."incCorrespondence_crud_sslr?d-1842128-fn_package_uuid=".$this->currPackageUuid."&d-1842128-fn_status=".$empty."&d-1842128-fn_doc_subject=".$empty."&d-1842128-fn_doc_date=".$empty."&d-1842128-fn_doc_id=".$empty."&d-1842128-fn_section=".$empty;
				$doc_list_corr_tp_outgoing = $userviewPrefix."outCorrespondence_crud_sslr?d-310916-fn_package_uuid=".$this->currPackageUuid."&d-310916-fn_status=".$empty."&d-310916-fn_doc_subject=".$empty."&d-310916-fn_doc_date=".$empty."&d-310916-fn_doc_id=".$empty."&d-310916-fn_section=".$empty;
				$doc_list_corr_open = $userviewPrefix."openCorr_crud_sslr?d-4382149-fn_package_uuid=".$this->currPackageUuid."&d-4382149-fn_status=".$empty."&d-4382149-fn_doc_subject=".$empty."&d-4382149-fn_doc_date=".$empty."&d-4382149-fn_doc_id=".$empty."&d-4382149-fn_section=".$empty;
				$doc_list_corr_restricted= $userviewPrefix."restCorr_crud_sslr?d-3494337-fn_package_uuid=".$this->currPackageUuid."&d-3494337-fn_status=".$empty."&d-3494337-fn_doc_subject=".$empty."&d-3494337-fn_doc_date=".$empty."&d-3494337-fn_doc_id=".$empty."&d-3494337-fn_section=".$empty."&d-3494337-fn_doc_subtype=".$empty;
				$doc_list_corr_conf= $userviewPrefix."conCorr_crud_sslr?d-5923644-fn_package_uuid=".$this->currPackageUuid."&d-5923644-fn_status=".$empty."&d-5923644-fn_doc_subject=".$empty."&d-5923644-fn_doc_date=".$empty."&d-5923644-fn_doc_id=".$empty."&d-5923644-fn_section=".$empty."&d-5923644-fn_doc_subtype=".$empty;
			
				//dashboard
				$dash_doc_register_doc = $jsonPrefix."list_document_sslr?d-7259135-fn_c_package_uuid={?}&project_id={?}";
				$dash_doc_register_corr =$jsonPrefix."list_correspondence_sslr?d-5756196-fn_c_package_uuid={?}&project_id={?}";
	
				//dashboard conOpLink
				$dash_doc_register_doc_card = $userviewPrefix."documentDashboard_sslr?d-5010703-fn_c_package_uuid=".$packageUuidIdConOp."&d-5010703-fn_c_project_id=".$projectIdConOp."&d-5010703-fn_c_status={?}&d-5010703-fn_dateCreated={?}&d-5010703-fn_dateCreated={?}&d-5010703-fn_c_doc_type={?}&d-5010703-fn_c_doc_subtype={?}&d-5010703-fn_c_revision={?}&d-5010703-fn_c_section={?}";
				$dash_doc_register_corr_card = $userviewPrefix."correspondenceDashboard_sslr?d-894174-fn_c_package_uuid=".$packageUuidIdConOp."&d-894174-fn_c_project_id=".$projectIdConOp."&d-894174-fn_c_doc_subtype={?}&d-894174-fn_c_third_party={?}&d-894174-fn_c_doc_date={?}&d-894174-fn_c_doc_date={?}&d-894174-fn_c_status={?}&d-894174-fn_c_section={?}";
			
				break;
		}

		$docLinkArr = array(
			// doc
			'doc_form_doc_register' => $doc_form_doc_register,
			'doc_bulk_doc_register' => $doc_bulk_doc_register,
			'doc_list_doc_my' => $doc_list_doc_my,
			'doc_list_doc_open' => $doc_list_doc_open,
			'doc_list_doc_restricted' => $doc_list_doc_restricted,
			'doc_list_doc_confidental' => $doc_list_doc_confidental,
			'doc_list_doc_arch' => $doc_list_doc_arch,
			'doc_list_doc_draft' => $doc_list_doc_draft,
								
			// correspondance
			'doc_form_corr_register' => $doc_form_corr_register,
			'doc_list_corr_my' => $doc_list_corr_my,
			'doc_list_corr_int_all' => $doc_list_corr_int_all,
			'doc_list_corr_tp_incoming' => $doc_list_corr_tp_incoming,
			'doc_list_corr_tp_outgoing' => $doc_list_corr_tp_outgoing,
			'doc_list_corr_open' => $doc_list_corr_open,
			'doc_list_corr_conf' => $doc_list_corr_conf,
			'doc_list_corr_restricted' => $doc_list_corr_restricted,
			'doc_form_corr_respond' => $doc_form_corr_respond,
			'doc_json_corr_notification' => $doc_json_corr_notification,
			'doc_list_corr_inbox' => $doc_list_corr_inbox,
			'doc_bulk_corr_register' => $doc_bulk_corr_register,

			//set up
			'doc_setup_lookup_entity' => $doc_setup_lookup_entity,
			'doc_setup_lookup_docType' => $doc_setup_lookup_docType,
			'doc_setup_lookup_docSubType' => $doc_setup_lookup_docSubType,
			'doc_setup_lookup_drawing' => $doc_setup_lookup_drawing,
			'doc_setup_lookup_group' => $doc_setup_lookup_group,
			'doc_setup_lookup_dist_group' => $doc_setup_lookup_dist_group,
			'doc_setup_lookup_location' => $doc_setup_lookup_location,
			'doc_setup_lookup_section' => $doc_setup_lookup_section,
			//markup
			'cons_issue_markupv3' => $cons_issue_markupv3,
			'cons_datalist_markup' => $cons_datalist_markup,
			'cons_datalist_markupv3' => $cons_datalist_markupv3,
			//dashboard 
			'dash_doc_register_doc' => $dash_doc_register_doc,
			'dash_doc_register_corr' => $dash_doc_register_corr,
			
			//dashboard conOpLink
			'dash_doc_register_doc_card' => $dash_doc_register_doc_card,
			'dash_doc_register_corr_card' => $dash_doc_register_corr_card,
			'dash_doc_register_corr_cardNotUrgent' => $dash_doc_register_corr_cardNotUrgent,
			'dash_doc_register_corr_cardUrgent' => $dash_doc_register_corr_cardUrgent,
			'dash_doc_register_corr_cardInc' => $dash_doc_register_corr_cardInc,
			'dash_doc_register_corr_cardOut' => $dash_doc_register_corr_cardOut,
			'dash_doc_register_corr_cardIncParent' => $dash_doc_register_corr_cardIncParent,
			'dash_doc_register_corr_cardOutParent' => $dash_doc_register_corr_cardOutParent,
			'dash_doc_register_corr_cardType' => $dash_doc_register_corr_cardType

		);
		$this->jogetAppLink = array_merge($this->jogetAppLink, $docLinkArr);
		return;
	}

	private function getSSLRFinanceAppSrcRoleStatus()
	{
		$projectInfo = "";
		$projectUserInfo = "";
		$WorkFlowApproval = "";
		$FundingInfo = "";
		$BudgetInfo = "";
		$AuditInfo = "";
		$ContractsUrl = "";
		$PublishedContractsFilter = "";
		$ArchivedContracts = "";
		$ClaimsUrl = "";
		$NewClaim = "";
		$CurrentClaimsFilter = "";
		$VOsUrl = "";
		$NewVO = "";
		$CurrentVOsFilter ="";

		switch($this->currUserRole){
			case "Contract Executive":
				$projectInfo = "project_ce_ul_sslr?&_mode=edit&id=";
				$projectUserInfo = "project_user_ce_ul_sslr?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_ce_ul_sslr?&_mode=edit&id=";
				$FundingInfo = "funding_ce_ul_sslr?&_mode=edit&id=";
				$BudgetInfo = "budget_ce_ul_sslr?&_mode=edit&id=";
				$AuditInfo = "audit_ce_ul_sslr?&_mode=edit&id=";
				$ContractsUrl = "contracts_ul_sslr?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$NewClaim = "ce_contract_claim_ul_sslr?d-6534474-fn_project_id=";
				$ClaimsUrl = "claims_ce_ul_sslr?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$VOsUrl = "vo_ce_ul_sslr?";
				$NewVO = "ce_contract_vo_ul_sslr?d-7299148-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				break;
			case "HOD (Contract and Finance)":
				$projectInfo = "project_hod_ul_sslr?&_mode=edit&id=";
				$projectUserInfo = "project_user_hod_ul_sslr?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_hod_ul_sslr?&_mode=edit&id=";
				$FundingInfo = "funding_hod_ul_sslr?&_mode=edit&id=";
				$BudgetInfo = "budget_hod_ul_sslr?&_mode=edit&id=";
				$AuditInfo = "audit_hod_ul_sslr?&_mode=edit&id=";
				$ContractsUrl = "contracts_hod_sslr?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_hod_ul_sslr?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$VOsUrl = "vo_hod_ul_sslr?";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				break;
			case "Finance Representative":
				$projectInfo = "project_rep_ul_sslr?&_mode=edit&id=";
				$projectUserInfo = "project_user_rep_ul_sslr?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_rep_ul_sslr?&_mode=edit&id=";
				$FundingInfo = "funding_rep_ul_sslr?&_mode=edit&id=";
				$BudgetInfo = "budget_rep_ul_sslr?&_mode=edit&id=";
				$AuditInfo = "audit_rep_ul_sslr?&_mode=edit&id=";
				$ContractsUrl = "contracts_rep_sslr?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_rep_ul_sslr?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$VOsUrl = "vo_rep_ul_sslr?";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				break;
			case "DBC Rep":
				$ContractsUrl = "contracts_dbc_sslr?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_dbc_ul_sslr?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$VOsUrl = "vo_dbc_ul_sslr?";
				break;
		}

		$ret = array(
			'finance_list_ProjectInfo_SSLR2' => $projectInfo,
			'finance_list_ProjectUserInfo_SSLR2' => $projectUserInfo,
			'finance_list_WorkFlowApproval_SSLR2' => $WorkFlowApproval,
			'finance_list_FundingInfo_SSLR2' => $FundingInfo,
			'finance_list_BudgetInfo_SSLR2' => $BudgetInfo,
			'finance_json_AuditInfo_SSLR2' => $AuditInfo,
			'finance_list_ContractsUrl_SSLR2' => $ContractsUrl,
			'finance_list_PublishedContractsFilter_SSLR2' => $PublishedContractsFilter,
			'finance_list_NewClaim_SSLR2' => $NewClaim,
			'finance_list_CurrentClaimsFilter_SSLR2' => $CurrentClaimsFilter,
			'finance_list_ClaimsUrl_SSLR2' => $ClaimsUrl,
			'finance_list_VOsUrl_SSLR2' => $VOsUrl,
			'finance_list_NewVO_SSLR2' => $NewVO,
			'finance_list_CurrentVOsFilter_SSLR2' => $CurrentVOsFilter
		);
		return $ret;
	}

	private function getSSLRDownSFinanceAppSrcRoleStatus()
	{
		$projectInfo = "";
		$projectUserInfo = "";
		$WorkFlowApproval = "";
		$FundingInfo = "";
		$BudgetInfo = "";
		$AuditInfo = "";
		$ContractsUrl = "";
		$PublishedContractsFilter = "";
		$ArchivedContracts = "";
		$ClaimsUrl = "";
		$NewClaim = "";
		$CurrentClaimsFilter = "";
		$VOsUrl = "";
		$NewVO = "";
		$CurrentVOsFilter ="";
		$acsNew = "";
		$acsList = "";
		$EOTsUrl ="";
		$VOsUrl ="";
		$CurrentEOTsFilter = "";
		$NewEOT = "";
		//$eotNew = "";
		//$eotList = "";
		$VoEotUrl = "";

		switch($this->currUserRole){
			case "Contract Executive":
				$projectInfo = "project_ce_ul_sslr?&_mode=edit&id=";
				$projectUserInfo = "project_user_ce_ul_sslr?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_ce_ul_sslr?&_mode=edit&id=";
				$FundingInfo = "funding_ce_ul_sslr?&_mode=edit&id=";
				$BudgetInfo = "budget_ce_ul_sslr?&_mode=edit&id=";
				$AuditInfo = "audit_ce_ul_sslr?&_mode=edit&id=";
				$ContractsUrl = "contracts_ul_sslr?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$NewClaim = "ce_contract_claim_ul_sslr?d-6534474-fn_project_id=";
				$ClaimsUrl = "claims_ce_ul_sslr?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$VOsUrl = "vo_ce_ul_sslr?";
				$NewVO = "ce_contract_vo_ul_sslr?d-7299148-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$acsNew = "ce_acs_new_sslr?d-4145608-fn_project_id=";
				$acsList = "ce_acs_list_sslr?d-6072065-fn_project_id=";
				$EOTsUrl = "ce_eot_list_sslr?";
				$VoEotUrl = "ce_vo_eot_list_sslr?";
				$CurrentEOTsFilter ="&status1=New&status2=In%20Progress&status3=info";
				// $eotNew = "ce_eot_new_sslr?d-3039819-fn_project_id=";
				// $eotList = "ce_eot_list_sslr?d-6058700-fn_project_id=";
				break;
			case "Finance Representative":
				$projectInfo = "project_ce_ul_sslr?&_mode=edit&id=";
				$projectUserInfo = "project_user_ce_ul_sslr?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_ce_ul_sslr?&_mode=edit&id=";
				$FundingInfo = "funding_ce_ul_sslr?&_mode=edit&id=";
				$BudgetInfo = "budget_ce_ul_sslr?&_mode=edit&id=";
				$AuditInfo = "audit_ce_ul_sslr?&_mode=edit&id=";
				$ContractsUrl = "contracts_ul_sslr?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$NewClaim = "ce_contract_claim_ul_sslr?d-6534474-fn_project_id=";
				$ClaimsUrl = "claims_ce_ul_sslr?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$VOsUrl = "vo_ce_ul_sslr?";
				$NewVO = "ce_contract_vo_ul_sslr?d-7299148-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$acsNew = "ce_acs_new_sslr?d-4145608-fn_project_id=";
				$acsList = "ce_acs_list_sslr?d-6072065-fn_project_id=";
				$EOTsUrl = "ce_eot_list_sslr?";
				$VoEotUrl = "ce_vo_eot_list_sslr?";
				$CurrentEOTsFilter ="&status1=New&status2=In%20Progress&status3=info";
				$NewEOT = "rep_eot_new_sslr?d-3039819-fn_project_id=";
				// $eotNew = "ce_eot_new_sslr?d-3039819-fn_project_id=";
				// $eotList = "ce_eot_list_sslr?d-6058700-fn_project_id=";
				break;
			case "HOD (Contract and Finance)":
				$projectInfo = "project_hod_ul_sslr?&_mode=edit&id=";
				$projectUserInfo = "project_user_hod_ul_sslr?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_hod_ul_sslr?&_mode=edit&id=";
				$FundingInfo = "funding_hod_ul_sslr?&_mode=edit&id=";
				$BudgetInfo = "budget_hod_ul_sslr?&_mode=edit&id=";
				$AuditInfo = "audit_hod_ul_sslr?&_mode=edit&id=";
				$ContractsUrl = "contracts_hod_sslr?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_hod_ul_sslr?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$VOsUrl = "vo_hod_ul_sslr?";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				$acsList = "hod_acs_list_sslr?d-6072065-fn_project_id=";
				$EOTsUrl = "hod_eot_list_sslr?";
				$VoEotUrl = "hod_vo_eot_list_sslr?";
				$CurrentEOTsFilter ="&status1=New&status2=In%20Progress&status3=info";
				//$eotList = "hod_eot_list_sslr?d-6058700-fn_project_id=";
				break;
			case "Contractor FR":
				$projectInfo = "project_rep_ul_sslr?&_mode=edit&id=";
				$projectUserInfo = "project_user_rep_ul_sslr?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_rep_ul_sslr?&_mode=edit&id=";
				$FundingInfo = "funding_rep_ul_sslr?&_mode=edit&id=";
				$BudgetInfo = "budget_rep_ul_sslr?&_mode=edit&id=";
				$AuditInfo = "audit_rep_ul_sslr?&_mode=edit&id=";
				$ContractsUrl = "contracts_rep_sslr?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_rep_ul_sslr?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$VOsUrl = "vo_rep_ul_sslr?";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				$acsList = "rep_acs_list_sslr?d-6072065-fn_project_id=";
				//$eotList = "rep_eot_list_sslr?d-6058700-fn_project_id=";
				$NewClaim = "rep_contract_claim_ul_sslr?d-6534474-fn_project_id=";
				$NewVO = "rep_contract_vo_ul_sslr?d-7299148-fn_project_id=";
				$acsNew = "rep_acs_new_sslr?d-4145608-fn_project_id=";
				$EOTsUrl = "rep_eot_list_sslr?";
				$VoEotUrl = "rep_vo_eot_list_sslr?";
				$CurrentEOTsFilter ="&status1=New&status2=In%20Progress&status3=info";
				$NewEOT = "rep_eot_new_sslr?d-3039819-fn_project_id=";
				//$eotNew = "rep_eot_new_sslr?d-3039819-fn_project_id=";
				break;
			case "DBC Rep":
				$ContractsUrl = "contracts_dbc_sslr?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_dbc_ul_sslr?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$VOsUrl = "vo_dbc_ul_sslr?";
				break;
		}

		$ret = array(
			'finance_list_ProjectInfo_SSLR2' => $projectInfo,
			'finance_list_ProjectUserInfo_SSLR2' => $projectUserInfo,
			'finance_list_WorkFlowApproval_SSLR2' => $WorkFlowApproval,
			'finance_list_FundingInfo_SSLR2' => $FundingInfo,
			'finance_list_BudgetInfo_SSLR2' => $BudgetInfo,
			'finance_json_AuditInfo_SSLR2' => $AuditInfo,
			'finance_list_ContractsUrl_SSLR2' => $ContractsUrl,
			'finance_list_PublishedContractsFilter_SSLR2' => $PublishedContractsFilter,
			'finance_list_NewClaim_SSLR2' => $NewClaim,
			'finance_list_CurrentClaimsFilter_SSLR2' => $CurrentClaimsFilter,
			'finance_list_ClaimsUrl_SSLR2' => $ClaimsUrl,
			'finance_list_VOsUrl_SSLR2' => $VOsUrl,
			'finance_list_NewVO_SSLR2' => $NewVO,
			'finance_list_CurrentVOsFilter_SSLR2' => $CurrentVOsFilter,
			'finance_list_newAcs_SSLR2' => $acsNew,
			'finance_list_Acs_SSLR2' => $acsList,
			'finance_list_EOTsUrl_SSLR2'=> $EOTsUrl,
			'finance_list_NewEOT_SSLR2' => $NewEOT,
			'finance_list_CurrentEOTsFilter_SSLR2' => $CurrentEOTsFilter,
			'finance_list_ApprovedVOEOTs_SSLR2' => $VoEotUrl

			// 'finance_list_newEot' => $eotNew,
			// 'finance_list_Eot_SSL2' => $eotList
		);
		return $ret;
	}

	// to get the parameters based on role status
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
		$EOTList = "";

		switch($this->currUserRole){
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
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_fo_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "fo_archive_contracts_ul?d-4920353-fn_project_id=";
				$EOTList = "eot_fo_ul?project_id=";
				break;
			case "Project Manager":
			case "Project Monitor":
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
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_pm_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "pm_archive_contracts_ul?d-4920353-fn_project_id=";
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
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_fh_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "fh_archive_contracts_ul?d-4920353-fn_project_id=";
				$EOTList = "eot_fh_ul?project_id=";
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
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_dir_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "dir_archive_contracts_ul?d-4920353-fn_project_id=";
				$EOTList = "eot_fd_ul?project_id=";
				break;
			case "Construction Engineer":
				$ContractsUrl = "contracts_ce_ul?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_ce_ul?";
				$VOsUrl = "vo_ce_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				$EOTList = "eot_ce_ul?project_id=";
				break;
			case "Contractor PM":
				$ContractsUrl = "cpm_contract_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "cpm_claim_ul?";
				$VOsUrl = "vo_ccpm_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "cpm_contract_claim_ul?d-2823043-fn_project_id=";
				$NewVO = "cpm_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				break;
			case "Contractor Engineer":
				$ContractsUrl = "ce_contract_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "ce_claim_ul?";
				$VOsUrl = "vo_cce_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "ce_contract_claim_ul?d-2823043-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				$EOTList = "eot_cce_ul?project_id=";
				break;
			case "Consultant CRE":
				$ContractsUrl = "contracts_ccre_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_cre_ul?";
				$VOsUrl = "vo_ccre_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "ccre_contract_claim_ul?d-2823043-fn_project_id=";
				$NewVO = "cre_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				break;
			case "Consultant RE":
				$ContractsUrl = "contracts_cre_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_re_ul?";
				$VOsUrl = "vo_cre_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "cre_contract_claim_ul?d-2823043-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				break;
			case "Consultant QS":
				$ContractsUrl = "contracts_cqs_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_cqs_ul?";
				$VOsUrl = "vo_cqs_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "cqs_contract_claim_ul?d-2823043-fn_project_id=";
				$NewVO = "cqs_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
				break;
			case "Contractor QS":
				$ContractsUrl = "contracts_coqs_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_coqs_ul?";
				$VOsUrl = "vo_coqs_ul?";
				$CurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$NewClaim = "coqs_contract_claim_ul?d-2823043-fn_project_id=";
				$NewVO = "coqs_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status4=Document%20Upload&status5=info";
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
			'finance_list_EOTList' => $EOTList
			

		);
		return $ret;	
	}

	private function loadPFSUrl(){
		$jsonPrefix = $this->getJsonDatalistSrcPrefix('finance');
		$userviewPrefix = $this->getUserviewSrcPrefix('finance');
		$srcUrl = $this->getFinanceAppSrcRoleStatus();

		$finance_json_Project = $jsonPrefix."projectList?d-8112713-fn_project_id=".$this->currPackageId; //getProjectDataList()
		$finance_json_Contract = $jsonPrefix."contractList?d-5152114-fn_project_id=".$this->currPackageId."&d-5152114-fn_assign_to=".$this->currUserEmail; //getContractDataList()
		$finance_json_Claim = $jsonPrefix."claimsList?d-2380059-fn_project_id=".$this->currPackageId."&d-2380059-fn_assign_to=". $this->currUserEmail; //getClaimDataList()
		$finance_json_Contract_Details = $jsonPrefix."contractList?d-5152114-fn_project_id=".$this->currPackageId ."&d-5152114-fn_status=complete"; //getContractDetails()
		$finance_json_Notifications = $jsonPrefix."generalInbox?start=0&rows=5&d-5171348-fn_c_project_id=".$this->currPackageId."&d-5171348-fn_c_assign_to=".$this->currUserEmail; //getJogetNotifications()
		$finance_json_Notificationsv3 = $jsonPrefix."generalInbox?d-5171348-fn_c_project_id=".$this->currPackageId."&d-5171348-fn_c_assign_to=".$this->currUserEmail; //getJogetNotifications()

		$finance_json_contractApprovalFlow = $jsonPrefix."approvalFlowCheckList?d-2845235-fn_project_id=".$this->currPackageId; //getContractApprovalFlowDetails()
		$finance_json_claimApprovalFlow = $jsonPrefix."approvalFlowCheckClaimList?d-3470253-fn_project_id=".$this->currPackageId; //getClaimApprovalFlowDetails()
		$finance_json_voApprovalFlow = $jsonPrefix."approvalFlowCheckVOList?d-440924-fn_project_id=".$this->currPackageId; //getVOApprovalFlowDetails
		
		// dashboard
		$finance_dash_contract = $jsonPrefix."dashboardContractList?d-1181898-fn_status=complete&d-1181898-fn_project_id=";
		$finance_dash_claim  = $jsonPrefix."claimDashboardViewList?status1=complete&status2=Updated&status3=IPC%20Approved&status4=Payment%20Received&d-6627213-fn_contract_id_string={?}&d-6627213-fn_project_id={?}";
		//	$finance_dash_cashoutflow = $jsonPrefix."cashOutflowList?d-6699393-fn_contract_id=";

		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = '{?}';
		}else{
			$projectIdConOp = $this->currPackageId;
		}

		if($this->currProjectPhase){
			$projectPhaseParam = '&project_phase='.$this->currProjectPhase;
		}else{
			$projectPhaseParam = '';
		}
		

		$finance_list_ProjectInfo = $userviewPrefix.$srcUrl['finance_list_ProjectInfo'].$this->currPackageId;
		$finance_list_ProjectUserInfo = $userviewPrefix.$srcUrl['finance_list_ProjectUserInfo'].$this->currPackageId;
		$finance_list_WorkFlowApproval = $userviewPrefix.$srcUrl['finance_list_WorkFlowApproval'].$this->currPackageId;
		$finance_list_FundingInfo = $userviewPrefix.$srcUrl['finance_list_FundingInfo'].$this->currPackageId;
		$finance_list_BudgetInfo = $userviewPrefix.$srcUrl['finance_list_BudgetInfo'].$this->currPackageId;
		$finance_list_AuditInfo = $userviewPrefix.$srcUrl['finance_json_AuditInfo'].$this->currPackageId;
		$finance_list_AddEditProjectDetails = $userviewPrefix."fb_uv?project_id=".$this->currPackageId;
		$finance_list_PublishedContracts = $userviewPrefix.$srcUrl['finance_list_ContractsUrl']."d-4882770-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_PublishedContractsFilter'];
		$finance_list_ContractInbox = $userviewPrefix."contract_inbox?d-5152114-fn_project_id=".$this->currPackageId;
		$finance_list_ContractActivityForm = $userviewPrefix."contract_inbox?activityId=";
		$finance_list_ClaimActivityForm = $userviewPrefix. "claim_inbox?activityId=";
		$finance_list_VOActivityForm = $userviewPrefix. "vo_inbox?activityId=";
		$finance_list_ContractAmendForm = $userviewPrefix. "contract_amend_data_inbox?activityId=";
		$finance_list_ContractApprovedRejected = $userviewPrefix.$srcUrl['finance_list_ContractsUrl']."id=";
		$finance_list_ClaimApprovedRejected = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl']."id=";
		$finance_list_VOApprovedRejected = $userviewPrefix.$srcUrl['finance_list_VOsUrl']."id=";
		$finance_list_NewContract = $userviewPrefix."create_contract?project_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner.$projectPhaseParam;
		$finance_list_RejectedContracts = $userviewPrefix.$srcUrl['finance_list_ContractsUrl']."d-4882770-fn_project_id=".$this->currPackageId."&status1=Reject&status2=Upload BoQ";
		$finance_list_BulkUploadContracts = $userviewPrefix."bulkImportContract?project_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner;
		$finance_list_ExportContracts = $userviewPrefix."list_contract_export";

		$finance_list_CurrentClaims = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl']."d-6787268-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_CurrentClaimsFilter'];
		$finance_list_RejectedClaims = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl']."d-6787268-fn_project_id=".$this->currPackageId."&status1=Reject";
		$finance_list_ApprovedClaims = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl']."d-6787268-fn_project_id=".$this->currPackageId."&status1=Complete&status2=Updated&status3=IPC Approved&status4=Payment Received";
		$finance_list_ExportClaims = $userviewPrefix."list_claim_export";

		$finance_list_NewClaim = $userviewPrefix.$srcUrl['finance_list_NewClaim'].$this->currPackageId. "&d-2823043-fn_status=Complete";
		$finance_list_ClaimInbox = $userviewPrefix."claim_inbox?d-2380059-fn_project_id=".$this->currPackageId;
		$finance_list_NewVO = $userviewPrefix.$srcUrl['finance_list_NewVO'].$this->currPackageId. "&d-4828409-fn_status=Complete";
		$finance_list_CurrentVOs = $userviewPrefix.$srcUrl['finance_list_VOsUrl']."d-6410841-fn_project_id=" .$this->currPackageId.$srcUrl['finance_list_CurrentVOsFilter'];
		$finance_list_ApprovedVOs = $userviewPrefix.$srcUrl['finance_list_VOsUrl']."d-6410841-fn_project_id=" .$this->currPackageId. "&status1=complete";
		$finance_list_ExportVOs = $userviewPrefix."list_vo_export";
		$finance_list_RejectedVOs = $userviewPrefix.$srcUrl['finance_list_VOsUrl']."d-6410841-fn_project_id=" .$this->currPackageId. "&status1=reject";
		$finance_list_VOInbox = $userviewPrefix."vo_inbox?d-447905-fn_project_id=".$this->currPackageId;
		$finance_list_ScheduleData = $userviewPrefix."import_schedule_data";
		$finance_list_ImportUnit = $userviewPrefix."import_unit_data";
		$finance_list_organization = $userviewPrefix."orgList";
		$finance_list_NewAmendment = $userviewPrefix."fo_contract_amend_ul?d-122886-fn_project_id=" .$this->currPackageId. "&d-122886-fn_status=Complete";
		$finance_list_AmendmentInbox = $userviewPrefix."contract_amend_data_inbox?d-5152114-fn_project_id=".$this->currPackageId;
		$finance_list_CurrentAmendments = $userviewPrefix.$srcUrl['finance_list_CurrentAmendments'].$this->currPackageId;
		$finance_list_ArchivedContracts = $userviewPrefix.$srcUrl['finance_list_ArchivedContracts'].$this->currPackageId;
		$finance_list_RatesData = $userviewPrefix."listRates";
		$finance_list_RatesData_view = $userviewPrefix."listviewRates";
		$finance_list_LocationFactorData = $userviewPrefix."listLocationFactor";
		$finance_list_LocationFactorData_view = $userviewPrefix."listviewLocationFactor";
		
		//dashboard card Sabah
		$finance_dash_contract_card = $userviewPrefix."dashboardContractDisplay?d-1181898-fn_status=complete&d-1181898-fn_project_id={?}&d-1181898-fn_contract_id={?}";
		
		//dashboard conOpLink Sarawak
		$finance_contract_dash_card = $userviewPrefix."dashboardContractListView?d-3462739-fn_c_project_id=".$projectIdConOp."&d-3462739-fn_c_section={?}&d-3462739-fn_c_contract_id={?}";
		$finance_dash_claim_card  = $userviewPrefix."dashboardClaimListView?status1=Complete&status2=Updated&status3=IPC%20Approved&status4=Payment%20Received&&d-6627213-fn_project_id={?}&d-6627213-fn_claim_id={?}";

		//dashboard conOpLink Asset
		
		// Sabah 1B
		$finance_list_NewEOT_Sabah = $userviewPrefix."contract_eot_fo_ul?project_id=" .$this->currPackageId. "&status=Complete";
		$finance_list_EOTList_Sabah = $userviewPrefix.$srcUrl['finance_list_EOTList'].$this->currPackageId;

		$financeLinkArr = array(
			//json urls
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
			'finance_dash_claim' => $finance_dash_claim,

			//dashboard conOpLink
			'finance_contract_dash_card' => $finance_contract_dash_card,
			'finance_dash_claim_card' => $finance_dash_claim_card,
			'finance_dash_contract_card' => $finance_dash_contract_card,
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
			'finance_list_BulkUploadContracts' => $finance_list_BulkUploadContracts,
			'finance_list_ExportContracts' => $finance_list_ExportContracts,
			//Claim Urls
			'finance_list_CurrentClaims' => $finance_list_CurrentClaims,
			'finance_list_RejectedClaims' => $finance_list_RejectedClaims,
			'finance_list_ApprovedClaims' => $finance_list_ApprovedClaims,
			'finance_list_ExportClaims' => $finance_list_ExportClaims,
			'finance_list_NewClaim' => $finance_list_NewClaim,
			'finance_list_ClaimInbox' => $finance_list_ClaimInbox,
			'finance_list_ClaimActivityForm' => $finance_list_ClaimActivityForm,
			'finance_list_ClaimApprovedRejected' => $finance_list_ClaimApprovedRejected,
			//VO Urls
			'finance_list_CurrentVOs' => $finance_list_CurrentVOs,
			'finance_list_ApprovedVOs'=> $finance_list_ApprovedVOs,
			'finance_list_ExportVOs'=> $finance_list_ExportVOs,
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
			'finance_list_organization' => $finance_list_organization,
			'finance_list_RatesData'=> $finance_list_RatesData,
			'finance_list_RatesData_view'=> $finance_list_RatesData_view,
			'finance_list_LocationFactorData'=> $finance_list_LocationFactorData,
			'finance_list_LocationFactorData_view'=> $finance_list_LocationFactorData_view,
			//dashboard card
			// EOT
			'finance_list_NewEOT_Sabah' => $finance_list_NewEOT_Sabah,
			'finance_list_EOTList_Sabah' => $finance_list_EOTList_Sabah
		);
		$this->jogetAppLink = array_merge($this->jogetAppLink, $financeLinkArr);
	
		return;
	}

	private function getFinanceAppSrcAssetRoleStatus(){

		$projectInfo = "";
		$projectUserInfo = "";
		$WorkFlowApproval = "";
		$FundingInfo = "";
		$BudgetInfo = "";
		$AuditInfo = "";
		$ContractsUrl = "";
		$PublishedContractsFilter = "";
		$ClaimsUrl = "";
		$PeriodicClaimsUrl ="";
		$HqClaimsUrl ="";
		$HqClaimsPerUrl ="";
		$VOsUrl = "";
		$CurrentClaimsFilter = "";
		$PeriodicCurrentClaimsFilter ="";
		$HqCurrentClaimsFilter ="";
		$HqCurrentClaimsPerFilter ="";
		$NewClaim = "";
		$NewClaimSwk = "";
		$NewClaimPeriodic ="";
		$NewClaimHq = "";
		$NewClaimPerHq = "";
		$NewVO = "";
		$CurrentVOsFilter ="";
		$CurrentAmendments ="";
		$ArchivedContracts ="";
		$finance_list_RoutineContractsAmend = "";
		$finance_list_RoutineContractsAmendList = "";

	
		switch($this->currUserRole){
			case "Senior Civil Engineer (Road Asset)":
				$projectInfo = "project_sce_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_sce_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_sce_ul?&_mode=edit&id=";
				$FundingInfo = "funding_sce_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_sce_ul?&_mode=edit&id=";
				$AuditInfo = "audit_sce_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_sce_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_sce_ul?";
				$PeriodicClaimsUrl = "periodic_claims_sce_ul?";
				$HqClaimsUrl = "hq_claims_sce_ul?";
				$HqClaimsPerUrl = "hq_per_claims_sce_ul?";
				$VOsUrl = "vo_sce_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "sce_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_sce_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "sce_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_sce?d-5864550-fn_project_id=";
				break;
			case "Civil Engineer (Division)":
				$projectInfo = "project_ce_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_ce_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_ce_ul?&_mode=edit&id=";
				$FundingInfo = "funding_ce_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_ce_ul?&_mode=edit&id=";
				$AuditInfo = "audit_ce_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_ce_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_ce_ul?";
				$PeriodicClaimsUrl = "periodic_claims_ce_ul?";
				$HqClaimsUrl = "hq_claims_ce_ul?";
				$HqClaimsPerUrl = "hq_per_claims_ce_ul?";
				$VOsUrl = "vo_ce_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "ce_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_ce_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "ce_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_ce?d-5864550-fn_project_id=";
				break;
			case "Senior Civil Engineer (Division)":
				$projectInfo = "project_sced_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_sced_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_sced_ul?&_mode=edit&id=";
				$FundingInfo = "funding_sced_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_sced_ul?&_mode=edit&id=";
				$AuditInfo = "audit_sced_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_sced_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_sced_ul?";
				$PeriodicClaimsUrl = "periodic_claims_sced_ul?";
				$HqClaimsUrl = "hq_claims_sced_ul?";
				$HqClaimsPerUrl = "hq_per_claims_sced_ul?";
				$VOsUrl = "vo_sced_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "sced_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_sced_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "sced_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_sced?d-5864550-fn_project_id=";
				break;
			case "Civil Engineer (Road Asset)":
				$projectInfo = "project_cera_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_cera_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_cera_ul?&_mode=edit&id=";
				$FundingInfo = "funding_cera_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_cera_ul?&_mode=edit&id=";
				$AuditInfo = "audit_cera_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_cera_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_cera_ul?";
				$PeriodicClaimsUrl = "periodic_claims_cera_ul?";
				$HqClaimsUrl = "hq_claims_cera_ul?";
				$HqClaimsPerUrl = "hq_per_claims_cera_ul?";
				$VOsUrl = "vo_cera_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "cera_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_cera_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "cera_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_cera?d-5864550-fn_project_id=";
				break;
			case "Assistant Director (Road Asset)":
				$projectInfo = "project_ad_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_ad_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_ad_ul?&_mode=edit&id=";
				$FundingInfo = "funding_ad_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_ad_ul?&_mode=edit&id=";
				$AuditInfo = "audit_ad_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_ad_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_ad_ul?";
				$PeriodicClaimsUrl = "periodic_claims_ad_ul?";
				$HqClaimsUrl = "hq_claims_ad_ul?";
				$HqClaimsPerUrl = "hq_per_claims_ad_ul?";
				$VOsUrl = "vo_ad_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "ad_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_ad_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "ad_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_ad?d-5864550-fn_project_id=";
				break;
			case "Assistant Engineer (Division)":
				$projectInfo = "project_ae_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_ae_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_ae_ul?&_mode=edit&id=";
				$FundingInfo = "funding_ae_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_ae_ul?&_mode=edit&id=";
				$AuditInfo = "audit_ae_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_ae_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_ae_ul?";
				$PeriodicClaimsUrl = "periodic_claims_ae_ul?";
				$HqClaimsUrl = "hq_claims_ae_ul?";
				$HqClaimsPerUrl = "hq_per_claims_ae_ul?";
				$VOsUrl = "vo_ae_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "ae_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_ae_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "ae_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_ae?d-5864550-fn_project_id=";
				break;
			case "Quantity Surveyor":
				$projectInfo = "project_qs_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_qs_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_qs_ul?&_mode=edit&id=";
				$FundingInfo = "funding_qs_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_qs_ul?&_mode=edit&id=";
				$AuditInfo = "audit_qs_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_qs_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_qs_ul?";
				$PeriodicClaimsUrl = "periodic_claims_qs_ul?";
				$HqClaimsUrl = "hq_claims_qs_ul?";
				$HqClaimsPerUrl = "hq_per_claims_qs_ul?";
				$VOsUrl = "vo_qs_ul?";
				$CurrentClaimsFilter = "&status1=Draft&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status=Draft";
				$NewClaim = "qs_contract_claim_ul?";
				$NewClaimPeriodic = "qs_contract_per_claim_ul?";
				$NewVO = "qs_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_qs_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "qs_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmend = "amend_routine_contract_qs_ul?d-2373202-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_qs?d-5864550-fn_project_id=";
				break;
			case "Senior Quantity Surveyor":
				$projectInfo = "project_sqs_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_sqs_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_sqs_ul?&_mode=edit&id=";
				$FundingInfo = "funding_sqs_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_sqs_ul?&_mode=edit&id=";
				$AuditInfo = "audit_sqs_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_sqs_ul?";
				$PublishedContractsFilter = "&status1=New&status2=In%20Progress&status3=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_sqs_ul?";
				$PeriodicClaimsUrl = "periodic_claims_sqs_ul?";
				$HqClaimsUrl = "hq_claims_sqs_ul?";
				$HqClaimsPerUrl = "hq_per_claims_sqs_ul?";
				$VOsUrl = "vo_sqs_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "sqs_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_sqs_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "sqs_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmend = "amend_routine_contract_sqs_ul?d-2373202-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_sqs?d-5864550-fn_project_id=";
				break;
			case "Divisional Engineer":
				$projectInfo = "project_de_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_de_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_de_ul?&_mode=edit&id=";
				$FundingInfo = "funding_de_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_de_ul?&_mode=edit&id=";
				$AuditInfo = "audit_de_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_de_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_de_ul?";
				$PeriodicClaimsUrl = "periodic_claims_de_ul?";
				$HqClaimsUrl = "hq_claims_de_ul?";
				$HqClaimsPerUrl = "hq_per_claims_de_ul?";
				$VOsUrl = "vo_de_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "de_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_de_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "de_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_de?d-5864550-fn_project_id=";
				break;
			case "Contract Assistance":
				$ContractsUrl = "contracts_ca_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_ca_ul?";
				$PeriodicClaimsUrl = "periodic_claims_ca_ul?";
				$HqClaimsUrl = "hq_claims_ca_ul?";
				$HqClaimsPerUrl = "hq_per_claims_ca_ul?";
				$VOsUrl = "vo_ca_ul?";
				$CurrentClaimsFilter = "&status1=Draft&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$HqCurrentClaimsFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$NewClaim = "ca_contract_claim_ul?";
				$NewClaimSwk = "ca_contract_claim_ul_sarawak?";
				$NewClaimPeriodic= "ca_contract_per_claim_ul?";
				$NewVO = "ca_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_ca?d-5864550-fn_project_id=";
				$CurrentAmendments = "list_routine_amend_ca?d-5864550-fn_project_id=";
				break;
			case "Head of Contract":
				$ContractsUrl = "contracts_hoc_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_hoc_ul?";
				$PeriodicClaimsUrl = "periodic_claims_hoc_ul?";
				$HqClaimsUrl = "hq_claims_hoc_ul?";
				$HqClaimsPerUrl = "hq_per_claims_hoc_ul?";
				$VOsUrl = "vo_hoc_ul?";
				$CurrentClaimsFilter = "&status1=Draft&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$HqCurrentClaimsFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewClaimHq = "claim_common_hq_asset_list?"; 
				$NewClaimPerHq = "claim_periodic_hq_asset_list?"; 
				$NewVO = "hoc_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_hoc?d-5864550-fn_project_id=";
				$NewClaim = "ca_contract_claim_ul?";
				$NewClaimSwk = "ca_contract_claim_ul_sarawak?";
				$NewClaimPeriodic= "ca_contract_per_claim_ul?";
				break;
			case "Head of Finance":
				$ContractsUrl = "contracts_hof_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_hof_ul?";
				$PeriodicClaimsUrl = "periodic_claims_hof_ul?";
				$HqClaimsUrl = "hq_claims_hof_ul?";
				$HqClaimsPerUrl = "hq_per_claims_hof_ul?";
				$VOsUrl = "vo_hof_ul?";
				$CurrentClaimsFilter = "&status1=Draft&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$HqCurrentClaimsFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$NewVO = "hof_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_hof?d-5864550-fn_project_id=";
				break;
			case "Head of Section":
				$ContractsUrl = "contracts_hos_ul?";
				$PublishedContractsFilter = "&status1=Complete";
				$ClaimsUrl = "claims_hos_ul?";
				$PeriodicClaimsUrl = "periodic_claims_hos_ul?";
				$HqClaimsUrl = "hq_claims_hos_ul?";
				$HqClaimsPerUrl = "hq_per_claims_hos_ul?";
				$VOsUrl = "vo_hos_ul?";
				$CurrentClaimsFilter = "&status1=Draft&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
				$HqCurrentClaimsFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$NewVO = "hos_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_hos?d-5864550-fn_project_id=";
				break;
			case "KKR": // new role for KKR users to monitor all
				$projectInfo = "project_kkr_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_kkr_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_kkr_ul?&_mode=edit&id=";
				$FundingInfo = "funding_kkr_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_kkr_ul?&_mode=edit&id=";
				$AuditInfo = "audit_kkr_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_kkr_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_kkr_ul?";
				$PeriodicClaimsUrl = "periodic_claims_kkr_ul?";
				$HqClaimsUrl = "hq_claims_kkr_ul?";
				$HqClaimsPerUrl = "hq_per_claims_kkr_ul?";
				$VOsUrl = "vo_kkr_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "kkr_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_kkr_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "kkr_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_kkr?d-5864550-fn_project_id=";
				break;
			case "Facility Management Department": 
				$projectInfo = "project_fmd_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_fmd_ul?&_mode=edit&id=";
				$WorkFlowApproval = "workflow_approval_fmd_ul?&_mode=edit&id=";
				$FundingInfo = "funding_fmd_ul?&_mode=edit&id=";
				$BudgetInfo = "budget_fmd_ul?&_mode=edit&id=";
				$AuditInfo = "audit_fmd_ul?&_mode=edit&id=";
				$ContractsUrl = "contracts_fmd_ul?";
				$PublishedContractsFilter = "&status1=Upload%20BoQ&status2=New&status3=In%20Progress&status4=Complete&status5=info&status6=Omission-InProgress";
				$ClaimsUrl = "claims_fmd_ul?";
				$PeriodicClaimsUrl = "periodic_claims_fmd_ul?";
				$HqClaimsUrl = "hq_claims_fmd_ul?";
				$HqClaimsPerUrl = "hq_per_claims_fmd_ul?";
				$VOsUrl = "vo_fmd_ul?";
				$CurrentClaimsFilter = "&status2=Submitted&status3=Checked&status4=Resubmitted&status5=Verified";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress";
				$HqCurrentClaimsFilter = "&status5=Draft&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted";
				$HqCurrentClaimsPerFilter = "&status1=Submitted&status2=Checked&status3=Resubmit&status4=Resubmitted&status5=Draft";
				$NewVO = "fmd_contract_vo_ul?d-4828409-fn_project_id=";
				$CurrentVOsFilter ="&status1=New&status2=In%20Progress&status3=Upload%20BoQ&status4=Document%20Upload&status5=info";
				$CurrentAmendments = "contract_amend_fmd_ul?d-6113688-fn_project_id=";
				$ArchivedContracts = "fmd_archive_contracts_ul?d-4920353-fn_project_id=";
				$finance_list_RoutineContractsAmendList = "list_routine_amend_fmd?d-5864550-fn_project_id=";
				break;
			case "District Engineer":
				$projectInfo = "project_de_ul?&_mode=edit&id=";
				$projectUserInfo = "project_user_de_ul?&_mode=edit&id=";
				$AuditInfo = "audit_de_ul?&_mode=edit&id=";
				$PeriodicClaimsUrl = "periodic_claims_de_ul?";
				$PeriodicCurrentClaimsFilter = "&status1=New&status2=In%20Progress&status3=Draft";
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
			'finance_list_PeriodicClaimsUrl' => $PeriodicClaimsUrl,
			'finance_list_HqClaimsUrl' => $HqClaimsUrl,
			'finance_list_HqClaimsPerUrl' => $HqClaimsPerUrl,
			'finance_list_VOsUrl' => $VOsUrl,
			'finance_list_CurrentClaimsFilter' => $CurrentClaimsFilter,
			'finance_list_PeriodicCurrentClaimsFilter' => $PeriodicCurrentClaimsFilter,
			'finance_list_HqCurrentClaimsFilter' => $HqCurrentClaimsFilter,
			'finance_list_HqCurrentClaimsPerFilter' => $HqCurrentClaimsPerFilter,
			'finance_list_NewClaim' => $NewClaim,
			'finance_list_NewClaim_Swk' => $NewClaimSwk,
			'finance_list_NewClaimPeriodic' => $NewClaimPeriodic,
			'finance_list_NewClaimHq' => $NewClaimHq,
			'finance_list_NewClaimPerHq' => $NewClaimPerHq,
			'finance_list_NewVO' => $NewVO,
			'finance_list_CurrentVOsFilter' => $CurrentVOsFilter,
			'finance_list_CurrentAmendments' => $CurrentAmendments,
			'finance_list_ArchivedContracts' => $ArchivedContracts,
			'finance_list_RoutineContractsAmend' => $finance_list_RoutineContractsAmend,
			'finance_list_RoutineContractsAmendList' => $finance_list_RoutineContractsAmendList

		);
		return $ret;	
	}

	private function loadPFSAssetUrl(){
		$jsonPrefix = $this->getJsonDatalistSrcPrefix('assetFinance');
		$userviewPrefix = $this->getUserviewSrcPrefix('assetFinance');
		$srcUrl = $this->getFinanceAppSrcAssetRoleStatus();

		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->currPackageId;
			$packageUuidIdConOp = '{?}';
		}else{
			$projectIdConOp = $this->currProjectId;
			$packageUuidIdConOp = $this->currPackageUuid;
		}

		$finance_json_Project = $jsonPrefix."projectList?d-8112713-fn_project_id=".$this->currPackageId; //getProjectDataList()
		$finance_json_Contract = $jsonPrefix."contractList?d-5152114-fn_project_id=".$this->currPackageId."&d-5152114-fn_assign_to=".$this->currUserEmail; //getContractDataList()
		$finance_json_Claim = $jsonPrefix."claimsList?d-2380059-fn_project_id=".$this->currPackageId."&d-2380059-fn_assign_to=". $this->currUserEmail; //getClaimDataList()
		$finance_json_Contract_Details = $jsonPrefix."contractList?d-5152114-fn_project_id=".$this->currPackageId ."&d-5152114-fn_status=complete"; //getContractDetails()
		$finance_json_Notifications = $jsonPrefix."generalInbox?start=0&rows=5&d-5171348-fn_c_project_id=".$this->currPackageId."&d-5171348-fn_c_assign_to=".$this->currUserEmail; //getJogetNotifications()
		$finance_asset_json_notifications_package = $jsonPrefix."generalInbox?start=0&d-5171348-fn_c_project_id=".urlencode($this->currPackageId)."&d-5171348-fn_c_assign_to=".$this->currUserEmail;

		$finance_json_contractApprovalFlow = $jsonPrefix."approvalFlowCheckList?d-2845235-fn_project_id=".$this->currPackageId; //getContractApprovalFlowDetails()
		$finance_json_claimApprovalFlow = $jsonPrefix."approvalFlowCheckClaimList?d-3470253-fn_project_id=".$this->currPackageId; //getClaimApprovalFlowDetails()
		$finance_json_voApprovalFlow = $jsonPrefix."approvalFlowCheckVOList?d-440924-fn_project_id=".$this->currPackageId; //getVOApprovalFlowDetails
		
		// dashboard
		$finance_dash_contract = $jsonPrefix."dashboardContractList?d-1181898-fn_status=complete&d-1181898-fn_project_id=";
		$finance_dash_claim  = $jsonPrefix."claimDashboardViewList?status1=Complete&status2=Updated&status3=IPC%20Approved&status4=Payment%20Received&d-6627213-fn_contract_id_string={?}&d-6627213-fn_project_id={?}";
		//	$finance_dash_cashoutflow = $jsonPrefix."cashOutflowList?d-6699393-fn_contract_id=";

		//dashboard ConOp Link
		$dash_asset_budget_card_mp = $userviewPrefix."list_budget_dashboard_mp?d-4352871-fn_package_uuid=".$packageUuidIdConOp."&d-4352871-fn_project_id=".$projectIdConOp."&d-4352871-fn_year={?}&d-4352871-fn_budget_category={?}";
		$dash_asset_budget_card_pm = $userviewPrefix."list_budget_dashboard_pm?d-88305-fn_package_uuid=".$packageUuidIdConOp."&d-88305-fn_project_id=".$projectIdConOp."&d-88305-fn_year={?}&d-88305-fn_asset_group={?}&d-88305-fn_budget_category={?}";
		$dash_asset_claim_ttl_card = $userviewPrefix."list_claim_dashboard?d-676582-fn_package_uuid=".$packageUuidIdConOp."&d-676582-fn_project_id=".$projectIdConOp."&d-676582-fn_month={?}&d-676582-fn_year={?}&d-676582-fn_maintenance_category={?}";
		// dashboard link filtered by a specific asset group
		$dash_asset_claim_status_card = $userviewPrefix."list_claim_status_dashboard?d-8173803-fn_package_uuid=".$packageUuidIdConOp."&project_id=".$projectIdConOp."&d-8173803-fn_asset_group={?}&d-8173803-fn_audit_status={?}&d-8173803-fn_claim_date={?}&d-8173803-fn_claim_date={?}";
		// dashboard link filter for all asset group
		$dash_asset_claim_status_card_all_asset = $userviewPrefix."list_claim_status_dashboard_all_asset?d-8173803-fn_package_uuid=".$packageUuidIdConOp."&project_id=".$projectIdConOp."&d-8173803-fn_asset_group={?}&d-8173803-fn_audit_status={?}&d-8173803-fn_claim_date={?}&d-8173803-fn_claim_date={?}";
		$dash_asset_claim_status_verified_card_all_asset = $userviewPrefix."list_claim_status_verified_dashboard_all_asset?d-3667164-fn_package_uuid=".$packageUuidIdConOp."&project_id=".$projectIdConOp."&d-3667164-fn_asset_group={?}&d-3667164-fn_audit_status={?}&d-3667164-fn_claim_date={?}&d-3667164-fn_claim_date={?}";
		$dash_asset_contract_card = $userviewPrefix."list_contract_dashboard?d-1627882-fn_package_uuid=".$packageUuidIdConOp."&project_id=".$projectIdConOp."&d-1627882-fn_asset_grp={?}&d-1627882-fn_contract_date={?}&d-1627882-fn_contract_date={?}";

		$finance_list_ProjectInfo = $userviewPrefix.$srcUrl['finance_list_ProjectInfo'].$this->currPackageId;
		$finance_list_ProjectUserInfo = $userviewPrefix.$srcUrl['finance_list_ProjectUserInfo'].$this->currPackageId;
		$finance_list_WorkFlowApproval = $userviewPrefix.$srcUrl['finance_list_WorkFlowApproval'].$this->currPackageId;
		$finance_list_FundingInfo = $userviewPrefix.$srcUrl['finance_list_FundingInfo'].$this->currPackageId;
		$finance_list_BudgetInfo = $userviewPrefix.$srcUrl['finance_list_BudgetInfo'].$this->currPackageId;
		$finance_list_AuditInfo = $userviewPrefix.$srcUrl['finance_json_AuditInfo'].$this->currPackageId;
		$finance_list_AddEditProjectDetails = $userviewPrefix."fb_uv?project_id=".$this->currPackageId;
		//contract
		$finance_list_NewContract = $userviewPrefix."create_contract?project_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&parent_project_id=".$this->currProjectId;
		$finance_list_PublishedContracts = $userviewPrefix.$srcUrl['finance_list_ContractsUrl']."&package_id=".$this->currPackageId."&parent_project_id=".$this->currProjectId.$srcUrl['finance_list_PublishedContractsFilter'];
		$finance_list_RejectedContracts = $userviewPrefix.$srcUrl['finance_list_ContractsUrl']."&package_id=".$this->currPackageId."&parent_project_id=".$this->currProjectId."&status1=Reject";
		$finance_list_ContractInbox = $userviewPrefix."contract_inbox?d-5152114-fn_project_id=".$this->currPackageId;
		$finance_list_ContractActivityForm = $userviewPrefix."contract_inbox?activityId=";
		$finance_list_ContractApprovedRejected = $userviewPrefix.$srcUrl['finance_list_ContractsUrl']."id=";
		//contract routine amend
		$finance_list_AmendRoutineContracts = $userviewPrefix.$srcUrl['finance_list_RoutineContractsAmend'].$this->currPackageId;
		if($_SESSION['is_Parent'] == "isParent" ){
			$finance_list_AmendRoutineContractsList = $userviewPrefix.$srcUrl['finance_list_RoutineContractsAmendList'].$this->currPackageId;
		}else{
			$finance_list_AmendRoutineContractsList = $userviewPrefix.$srcUrl['finance_list_RoutineContractsAmendList'].$this->currProjectId."&d-5864550-fn_division_id=".$this->currPackageId;
		}

		//routine claims
		if($this->currProjectOwner == "JKR_SARAWAK"){
			$finance_list_NewClaim = $userviewPrefix.$srcUrl['finance_list_NewClaim_Swk']."&package_id=".$this->currPackageId."&parent_project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
			$finance_list_ClaimInboxPeriodic = $userviewPrefix."periodic_claim_sarawak_inbox?d-2380059-fn_project_id=".$this->currPackageId;
			$finance_list_ClaimActivityForm = $userviewPrefix. "periodic_claim_sarawak_inbox?activityId=";
			$finance_list_ClaimInbox = $userviewPrefix."claim_sarawak_inbox?d-7023879-fn_package_id=".$this->currPackageId."&d-7023879-fn_ResourceId=".$this->currUserEmail;
			$finance_list_ClaimActivityFormRoutine = $userviewPrefix. "claim_sarawak_inbox?activityId=";
		}else if($this->currProjectOwner == "JKR_SABAH"){
			$finance_list_NewClaim = $userviewPrefix.$srcUrl['finance_list_NewClaim']."&package_id=".$this->currPackageId."&parent_project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&package_uuid=".$this->currPackageUuid;
			$finance_list_ClaimInboxPeriodic = $userviewPrefix."periodic_claim_inbox?d-2380059-fn_project_id=".$this->currPackageId;
			$finance_list_ClaimActivityForm = $userviewPrefix. "periodic_claim_inbox?activityId=";
			$finance_list_ClaimInbox = $userviewPrefix."claim_inbox?d-7023879-fn_package_id=".$this->currPackageId."&d-7023879-fn_ResourceId=".$this->currUserEmail;
			$finance_list_ClaimActivityFormRoutine = $userviewPrefix. "claim_inbox?activityId=";
		}

		$finance_list_ClaimApprovedRejected = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl']."id=";
		$finance_list_CurrentClaims = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl']."d-3726679-fn_package_id=".$this->currPackageId.$srcUrl['finance_list_CurrentClaimsFilter'];
		$finance_list_RejectedClaims = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl']."d-3726679-fn_package_id=".$this->currPackageId."&status1=Reject";
		$finance_list_ApprovedClaims = $userviewPrefix.$srcUrl['finance_list_ClaimsUrl']."d-3726679-fn_package_id=".$this->currPackageId."&status1=Completed&status3=IPC Approved&status4=Payment Received";
		
		// periodic claims
		$finance_list_NewClaimPeriodic = $userviewPrefix.$srcUrl['finance_list_NewClaimPeriodic']."d-2823043-fn_project_id=".$this->currPackageId."&package_name=".$this->currPackageName."&package_uuid=".$this->currPackageUuid;
		$finance_list_ClaimApprovedRejectedPeriodic = $userviewPrefix.$srcUrl['finance_list_PeriodicClaimsUrl']."id=";
		$finance_list_CurrentClaimsPeriodic = $userviewPrefix.$srcUrl['finance_list_PeriodicClaimsUrl']."d-6787268-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_PeriodicCurrentClaimsFilter'];
		$finance_list_RejectedClaimsPeriodic = $userviewPrefix.$srcUrl['finance_list_PeriodicClaimsUrl']."d-6787268-fn_project_id=".$this->currPackageId."&status1=Reject";
		$finance_list_ApprovedClaimsPeriodic = $userviewPrefix.$srcUrl['finance_list_PeriodicClaimsUrl']."d-6787268-fn_project_id=".$this->currPackageId."&status1=Complete&status2=Updated&status3=IPC Approved&status4=Payment Received";
		$finance_list_claimInventory_SPPT = $userviewPrefix."claimAssetSubmissionSPPT_crud?package_id=".$this->currPackageId."&package_name=".$this->currPackageName;
		$finance_list_claimInventory_BRTB = $userviewPrefix."claimAssetSubmissionBRTB_crud?package_id=".$this->currPackageId."&package_name=".$this->currPackageName;
		$finance_list_claimInventory_PBBKPR = $userviewPrefix."claimAssetSubmissionPBBKPR_crud?package_id=".$this->currPackageId."&package_name=".$this->currPackageName;

		//hq claims
		$finance_list_NewClaimHq = $userviewPrefix.$srcUrl['finance_list_NewClaimHq']."&d-8373272-fn_c_project_id=".$this->currPackageId;
		$finance_list_ClaimInboxHq = $userviewPrefix."hq_claim_inbox?d-2936306-fn_project_id=".$this->currPackageId."&d-2936306-fn_ResourceId=".$this->currUserEmail;;
		$finance_list_ClaimActivityFormHq = $userviewPrefix. "hq_claim_inbox?activityId=";
		$finance_list_ClaimApprovedRejectedHq = $userviewPrefix.$srcUrl['finance_list_HqClaimsUrl']."id=";
		$finance_list_CurrentClaimsHq = $userviewPrefix.$srcUrl['finance_list_HqClaimsUrl']."d-7826522-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_HqCurrentClaimsFilter'];
		$finance_list_RejectedClaimsHq = $userviewPrefix.$srcUrl['finance_list_HqClaimsUrl']."d-7826522-fn_project_id=".$this->currPackageId."&status1=Reject";
		$finance_list_ApprovedClaimsHq = $userviewPrefix.$srcUrl['finance_list_HqClaimsUrl']."d-7826522-fn_project_id=".$this->currPackageId."&status1=Verified&status2=Updated&status3=IPC Approved&status4=Payment Received";

		//hq  periodic claims
		$finance_list_NewClaimPerHq = $userviewPrefix.$srcUrl['finance_list_NewClaimPerHq']."&d-7509908-fn_c_project_id=".$this->currPackageId;
		$finance_list_ClaimInboxPerHq = $userviewPrefix."hq_claim_per_inbox?d-2249319-fn_project_id=".$this->currPackageId."&d-2249319-fn_ResourceId=".$this->currUserEmail;;
		$finance_list_ClaimActivityFormPerHq = $userviewPrefix. "hq_claim_per_inbox?activityId=";
		$finance_list_ClaimApprovedRejectedPerHq = $userviewPrefix.$srcUrl['finance_list_HqClaimsPerUrl']."id=";
		$finance_list_CurrentClaimsPerHq = $userviewPrefix.$srcUrl['finance_list_HqClaimsPerUrl']."d-5079831-fn_project_id=".$this->currPackageId.$srcUrl['finance_list_HqCurrentClaimsPerFilter'];
		$finance_list_RejectedClaimsPerHq = $userviewPrefix.$srcUrl['finance_list_HqClaimsPerUrl']."d-5079831-fn_project_id=".$this->currPackageId."&status1=Reject";
		$finance_list_ApprovedClaimsPerHq = $userviewPrefix.$srcUrl['finance_list_HqClaimsPerUrl']."d-5079831-fn_project_id=".$this->currPackageId."&status1=Verified&status2=Updated&status3=IPC Approved&status4=Payment Received";

		//VO
		$finance_list_NewVO = $userviewPrefix.$srcUrl['finance_list_NewVO'].$this->currPackageId. "&d-4828409-fn_status=Complete";
		$finance_list_CurrentVOs = $userviewPrefix.$srcUrl['finance_list_VOsUrl']."d-6410841-fn_project_id=" .$this->currPackageId.$srcUrl['finance_list_CurrentVOsFilter'];
		$finance_list_ApprovedVOs = $userviewPrefix.$srcUrl['finance_list_VOsUrl']."d-6410841-fn_project_id=" .$this->currPackageId. "&status1=complete";
		$finance_list_RejectedVOs = $userviewPrefix.$srcUrl['finance_list_VOsUrl']."d-6410841-fn_project_id=" .$this->currPackageId. "&status1=reject";
		$finance_list_VOInbox = $userviewPrefix."vo_inbox?d-447905-fn_project_id=".$this->currPackageId;
		$finance_list_VOActivityForm = $userviewPrefix. "vo_inbox?activityId=";
		$finance_list_VOApprovedRejected = $userviewPrefix.$srcUrl['finance_list_VOsUrl']."id=";
		
		$finance_list_ScheduleData = $userviewPrefix."import_schedule_data";
		$finance_list_ImportUnit = $userviewPrefix."import_unit_data";
		$finance_list_RatesData = $userviewPrefix."listRates";
		$finance_list_RatesData_view = $userviewPrefix."listviewRates";
		$finance_list_LocationFactorData = $userviewPrefix."listLocationFactor";
		$finance_list_LocationFactorData_view = $userviewPrefix."listviewLocationFactor";
		$finance_list_RatesDataImport = $userviewPrefix."import_rates";
		$finance_list_LocationFactorDataImport = $userviewPrefix."import_location_factor";

		$finance_list_BudgetList = $userviewPrefix."budget_list?d-2422665-fn_project_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner;
		$finance_list_BudgetListView = $userviewPrefix."budget_list_view?d-2422665-fn_project_id=".$this->currPackageId;

		//contract Amendments
		$finance_list_NewAmendment = $userviewPrefix."qs_contract_amend_ul?d-122886-fn_project_id=" .$this->currPackageId. "&d-122886-fn_status=Complete";
		$finance_list_ContractAmendForm = $userviewPrefix. "contract_amend_data_inbox?activityId=";
		$finance_list_AmendmentInbox = $userviewPrefix."contract_amend_data_inbox?d-5152114-fn_project_id=".$this->currPackageId;
		$finance_list_CurrentAmendments = $userviewPrefix.$srcUrl['finance_list_CurrentAmendments'].$this->currPackageId;
		$finance_list_ArchivedContracts = $userviewPrefix.$srcUrl['finance_list_ArchivedContracts'].$this->currPackageId;
		
		//dashboard asset
		$dash_asset_budget = $jsonPrefix."list_budget_dash?d-2642773-fn_package_uuid={?}&project_id={?}";
		$dash_asset_contract = $jsonPrefix."list_contract_dash?d-7373032-fn_package_uuid={?}&project_id={?}";
		$dash_asset_claim_status = $jsonPrefix."list_claim_status_dash?d-2689945-fn_package_uuid={?}&project_id={?}";
		$dash_asset_claim_ttl = $jsonPrefix."list_claim_dashboard?d-2031622-fn_package_uuid={?}&project_id={?}";

		$financeLinkArr = array(
			//json urls
			'finance_json_Project' => $finance_json_Project,
			'finance_json_Contract' => $finance_json_Contract,
			'finance_json_Claim' => $finance_json_Claim,
			'finance_json_ContractDetails' => $finance_json_Contract_Details,
			'finance_json_Notifications' => $finance_json_Notifications,
			'finance_asset_json_notifications_package' => $finance_asset_json_notifications_package,
			'finance_json_ContractApprovalFlow' => $finance_json_contractApprovalFlow,
			'finance_json_ClaimApprovalFlow' => $finance_json_claimApprovalFlow,
			'finance_json_VOApprovalFlow' => $finance_json_voApprovalFlow,
			// dashboard
			'finance_dash_contract' => $finance_dash_contract,
			'finance_dash_claim' => $finance_dash_claim,
			//dashboard conOp Link Asset
			'dash_asset_budget_card_mp' => $dash_asset_budget_card_mp,
			'dash_asset_budget_card_pm' => $dash_asset_budget_card_pm,
			'dash_asset_claim_ttl_card' => $dash_asset_claim_ttl_card,
			'dash_asset_claim_status_card' => $dash_asset_claim_status_card,
			'dash_asset_contract_card' => $dash_asset_contract_card,
			'dash_asset_claim_status_card_all_asset' => $dash_asset_claim_status_card_all_asset,
			'dash_asset_claim_status_verified_card_all_asset' => $dash_asset_claim_status_verified_card_all_asset,
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
			'finance_list_AmendRoutineContracts' => $finance_list_AmendRoutineContracts,
			'finance_list_AmendRoutineContractsList' => $finance_list_AmendRoutineContractsList,
			//Claim Urls - routine
			'finance_list_CurrentClaims' => $finance_list_CurrentClaims,
			'finance_list_RejectedClaims' => $finance_list_RejectedClaims,
			'finance_list_ApprovedClaims' => $finance_list_ApprovedClaims,
			'finance_list_NewClaim' => $finance_list_NewClaim,
			'finance_list_ClaimInbox' => $finance_list_ClaimInbox,
			'finance_list_ClaimActivityFormRoutine' => $finance_list_ClaimActivityFormRoutine,
			'finance_list_ClaimApprovedRejected' => $finance_list_ClaimApprovedRejected,
			//periodic urls
			'finance_list_NewClaimPeriodic' => $finance_list_NewClaimPeriodic,
			'finance_list_ClaimInboxPeriodic' => $finance_list_ClaimInboxPeriodic,
			'finance_list_ClaimActivityForm' => $finance_list_ClaimActivityForm,
			'finance_list_ClaimApprovedRejectedPeriodic' => $finance_list_ClaimApprovedRejectedPeriodic,
			'finance_list_CurrentClaimsPeriodic' => $finance_list_CurrentClaimsPeriodic,
			'finance_list_RejectedClaimsPeriodic' => $finance_list_RejectedClaimsPeriodic,
			'finance_list_ApprovedClaimsPeriodic' => $finance_list_ApprovedClaimsPeriodic,
			'finance_list_claimInventory_SPPT' => $finance_list_claimInventory_SPPT,
			'finance_list_claimInventory_BRTB' => $finance_list_claimInventory_BRTB,
			'finance_list_claimInventory_PBBKPR' => $finance_list_claimInventory_PBBKPR,
			//hq consolidated urls
			'finance_list_NewClaimHq' => $finance_list_NewClaimHq,
			'finance_list_ClaimInboxHq' => $finance_list_ClaimInboxHq,
			'finance_list_ClaimActivityFormHq' => $finance_list_ClaimActivityFormHq,
			'finance_list_ClaimApprovedRejectedHq' => $finance_list_ClaimApprovedRejectedHq,
			'finance_list_CurrentClaimsHq' => $finance_list_CurrentClaimsHq,
			'finance_list_RejectedClaimsHq' => $finance_list_RejectedClaimsHq,
			'finance_list_ApprovedClaimsHq' => $finance_list_ApprovedClaimsHq,
			//hq consolidated urls periodic
			'finance_list_NewClaimPerHq' => $finance_list_NewClaimPerHq,
			'finance_list_ClaimInboxPerHq' => $finance_list_ClaimInboxPerHq,
			'finance_list_ClaimActivityFormPerHq' => $finance_list_ClaimActivityFormPerHq,
			'finance_list_ClaimApprovedRejectedPerHq' => $finance_list_ClaimApprovedRejectedPerHq,
			'finance_list_CurrentClaimsPerHq' => $finance_list_CurrentClaimsPerHq,
			'finance_list_RejectedClaimsPerHq' => $finance_list_RejectedClaimsPerHq,
			'finance_list_ApprovedClaimsPerHq' => $finance_list_ApprovedClaimsPerHq,
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
			'finance_list_RatesData'=> $finance_list_RatesData,
			'finance_list_RatesData_view'=> $finance_list_RatesData_view,
			'finance_list_LocationFactorData'=> $finance_list_LocationFactorData,
			'finance_list_LocationFactorData_view'=> $finance_list_LocationFactorData_view,
			'finance_list_RatesDataImport'=> $finance_list_RatesDataImport,
			'finance_list_LocationFactorDataImport'=> $finance_list_LocationFactorDataImport,
			'finance_list_BudgetList'=> $finance_list_BudgetList,
			'finance_list_BudgetListView'=> $finance_list_BudgetListView,
			//dashboard asset
			'dash_asset_claim_ttl' => $dash_asset_claim_ttl,
			'dash_asset_claim_status' => $dash_asset_claim_status,
			'dash_asset_budget' => $dash_asset_budget,
			'dash_asset_contract' => $dash_asset_contract
			
		);
		$this->jogetAppLink = array_merge($this->jogetAppLink, $financeLinkArr);
		return;
	}

	private function loadDocumentUrl(){
		$userviewPrefix = $this->getUserviewSrcPrefix('doc');
		$jsonPrefix = $this->getJsonDatalistSrcPrefix('doc');
		$empty = "";

		// doc  common for both Sabah & Sarawak
		$doc_list_doc_draft = $userviewPrefix."draftDocument?d-4999595-fn_package_uuid=".$this->currPackageUuid;
		
		// correspondance common for both Sabah & Sarawak
		$doc_form_corr_respond = $userviewPrefix."correspondence_response";
		$doc_list_corr_inbox = $userviewPrefix."correspondence_custom_inbox?d-6231922-fn_correspondence.package_uuid=".$this->currPackageUuid;
		$doc_json_corr_notification = $jsonPrefix."doc_notification?d-755636-fn_package_uuid=".$this->currPackageUuid."&d-755636-fn_corr_act_user.to=".$this->currUserEmail;
		$doc_bulk_corr_register = $userviewPrefix."bulkImportCorr";
		
		//set up common to both Sabah and Sarawak
		$doc_setup_lookup_entity = $userviewPrefix."lookupEntity_crud?d-1226792-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_lookup_docType = $userviewPrefix."lookupDocType_crud?d-3678065-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_lookup_group = $userviewPrefix."lookupGroup_crud?d-3205350-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$doc_setup_distribution_group = $userviewPrefix."setupDistributionGroup_crud?d-5888797-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		
		//markup review
		$cons_issue_markupv3 = $userviewPrefix."markUpForm?project_id_number=".$this->pid."&package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$cons_issue_markupv3_sbh = $userviewPrefix."new_markupSbh?project_id_number=".$this->pid."&package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$cons_datalist_markup = $userviewPrefix."markupForm_crud?d-6595155-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_markupv3 = $jsonPrefix."list_markupForm?d-6595155-fn_package_uuid=".$this->currPackageUuid;

		//markup sabah
		$markup_json_notification_package = $jsonPrefix."inbox_markupPackage?d-2911267-fn_ResourceId=".$this->currUserEmail."&d-2911267-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_markup_sabah = $userviewPrefix."markupForm_crud_sabah?d-6595155-fn_package_uuid=".$this->currPackageUuid;

		$dash_doc_register_doc_card = '';
		$dash_doc_register_corr_card = '';
		$dash_doc_register_corr_cardNotUrgent = '';
		$dash_doc_register_corr_cardUrgent = '';
		$dash_doc_register_corr_cardInc = '';
		$dash_doc_register_corr_cardOut = '';
		$dash_doc_register_corr_cardIncParent = '';
		$dash_doc_register_corr_cardOutParent = '';
		$dash_doc_register_corr_cardType = '';
		$doc_list_doc_export = '';
		$doc_list_corr_export = '';

		if($_SESSION['is_Parent'] == "isParent" ){
			// if parent need to send extra variable as package will be chosen from filter
			$projectIdConOp = $this->currPackageId;
			$packageUuidIdConOp = '{?}';
			$currentOrg = '';
		}else{
			$projectIdConOp = '';
			$packageUuidIdConOp = $this->currPackageUuid;
			$currentOrg = $this->currUserOrg;
		}

		switch ($this->currProjectOwner) {
			case "JKR_SARAWAK":
				//doc
				$doc_form_doc_register = $userviewPrefix."registerDocumentSarawak?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId; //doc register
				$doc_list_doc_my = $userviewPrefix."documentMySarawak_crud?d-660486-fn_package_uuid=".$this->currPackageUuid."&d-660486-fn_title=".$empty."&d-660486-fn_ref_no=".$empty."&d-660486-fn_doc_subtype=".$empty."&d-660486-fn_doc_type=".$empty."&d-660486-fn_department=".$empty;  //Document (My)
				$doc_list_doc_open = $userviewPrefix."documentOpenSarawak_crud?d-6009356-fn_package_uuid=".$this->currPackageUuid."&d-6009356-fn_title=".$empty."&d-6009356-fn_ref_no=".$empty."&d-6009356-fn_doc_subtype=".$empty."&d-6009356-fn_doc_type=".$empty."&d-6009356-fn_department=".$empty; // Document (Open)
				$doc_list_doc_restricted = $userviewPrefix."documentRestrictedSarawak_crud?d-8364531-fn_package_uuid=".$this->currPackageUuid."&d-8364531-fn_title=".$empty."&d-8364531-fn_ref_no=".$empty."&d-8364531-fn_doc_subtype=".$empty."&d-8364531-fn_doc_type=".$empty."&d-8364531-fn_department=".$empty;  //Document (Restricted)
				$doc_list_doc_confidental = $userviewPrefix."documentConfidentialSarawak_crud?d-5040286-fn_package_uuid=".$this->currPackageUuid."&d-5040286-fn_title=".$empty."&d-5040286-fn_ref_no=".$empty."&d-5040286-fn_doc_subtype=".$empty."&d-5040286-fn_doc_type=".$empty."&d-5040286-fn_department=".$empty;  //Document (Confidential)
				$doc_list_doc_arch = $userviewPrefix."documentArchivedSarawak_crud?d-3040852-fn_package_uuid=".$this->currPackageUuid."&d-3040852-fn_title=".$empty."&d-3040852-fn_ref_no=".$empty."&d-3040852-fn_doc_subtype=".$empty."&d-3040852-fn_doc_type=".$empty."&d-3040852-fn_department=".$empty;  //Document (Archived)
				$doc_bulk_doc_register = $userviewPrefix."bulkImportSarawak";
				
				//correspondence
				$doc_form_corr_register = $userviewPrefix."correspondenceSarawak_run?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
				$doc_list_corr_my = $userviewPrefix."correspondenceSarawak_my?d-6083206-fn_package_uuid=".$this->currPackageUuid."&d-6083206-fn_status=".$empty."&d-6083206-fn_doc_subject=".$empty."&d-6083206-fn_doc_date=".$empty."&d-6083206-fn_doc_id=".$empty."&d-6083206-fn_section=".$empty."&d-6083206-fn_third_party=".$empty;

				$doc_list_corr_int_all = $userviewPrefix."correspondenceSarawak_crud?d-657429-fn_package_uuid=".$this->currPackageUuid."&d-657429-fn_status=".$empty."&d-657429-fn_doc_subject=".$empty."&d-657429-fn_doc_date=".$empty."&d-657429-fn_doc_id=".$empty."&d-657429-fn_section=".$empty."&d-657429-fn_created_by_org_name=".$empty;
				$doc_list_corr_tp_incoming = $userviewPrefix."incCorrespondenceSarawak_crud?d-7791538-fn_package_uuid=".$this->currPackageUuid."&d-7791538-fn_status=".$empty."&d-7791538-fn_doc_subject=".$empty."&d-7791538-fn_doc_date=".$empty."&d-7791538-fn_doc_id=".$empty."&d-7791538-fn_section=".$empty;
				$doc_list_corr_tp_outgoing = $userviewPrefix."outCorrespondenceSarawak_crud?d-3246-fn_package_uuid=".$this->currPackageUuid."&d-3246-fn_status=".$empty."&d-3246-fn_doc_subject=".$empty."&d-3246-fn_doc_date=".$empty."&d-3246-fn_doc_id=".$empty."&d-3246-fn_section=".$empty;
				$doc_list_corr_open = $userviewPrefix."openCorrSarawak_crud?d-885865-fn_package_uuid=".$this->currPackageUuid."&d-885865-fn_status=".$empty."&d-885865-fn_doc_subject=".$empty."&d-885865-fn_doc_date=".$empty."&d-885865-fn_doc_id=".$empty."&d-885865-fn_section=".$empty;
				$doc_list_corr_restricted= $userviewPrefix."restCorrSarawak_crud?d-6270152-fn_package_uuid=".$this->currPackageUuid."&d-6270152-fn_status=".$empty."&d-6270152-fn_doc_subject=".$empty."&d-6270152-fn_doc_date=".$empty."&d-6270152-fn_doc_id=".$empty."&d-6270152-fn_section=".$empty."&d-6270152-fn_doc_subtype=".$empty;
				$doc_list_corr_conf= $userviewPrefix."conCorrSarawak_crud?d-2968091-fn_package_uuid=".$this->currPackageUuid."&d-2968091-fn_status=".$empty."&d-2968091-fn_doc_subject=".$empty."&d-2968091-fn_doc_date=".$empty."&d-2968091-fn_doc_id=".$empty."&d-2968091-fn_section=".$empty."&d-2968091-fn_doc_subtype=".$empty;

				//set up
				$doc_setup_lookup_section = $userviewPrefix."lookupSection_crud?d-3687296-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_owner=".$this->currProjectOwner."&package_name=".$this->currPackageName."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
			
				//dashboard
				$dash_doc_register_doc = $jsonPrefix."list_document_sarawak?d-3055783-fn_c_package_uuid={?}&project_id={?}";
				$dash_doc_register_corr =$jsonPrefix."list_correspondence_sarawak?d-4419470-fn_c_package_uuid={?}&project_id={?}";
	
				//dashboard conOpLink
				$dash_doc_register_doc_card = $userviewPrefix."documentSarawakDashboard?d-1068375-fn_c_package_uuid=".$packageUuidIdConOp."&d-1068375-fn_c_project_id=".$projectIdConOp."&d-1068375-fn_c_status={?}&d-1068375-fn_dateCreated={?}&d-1068375-fn_dateCreated={?}&d-1068375-fn_c_doc_type={?}&d-1068375-fn_c_doc_subtype={?}&d-1068375-fn_c_revision={?}";
				$dash_doc_register_corr_card = $userviewPrefix."correspondenceSarawakDashboard?d-7362604-fn_c_package_uuid=".$packageUuidIdConOp."&d-7362604-fn_c_project_id=".$projectIdConOp."&d-7362604-fn_c_doc_subtype={?}&d-7362604-fn_c_third_party={?}&d-7362604-fn_c_doc_date={?}&d-7362604-fn_c_doc_date={?}&d-7362604-fn_c_status={?}&d-7362604-fn_c_section={?}";
			
				break;
			case "JKR_SABAH":
				//doc
				$doc_form_doc_register = $userviewPrefix."registerDocumentSabah?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_phase=".$this->currProjectPhase; //doc register
				$doc_list_doc_my = $userviewPrefix."documentMySabah_crud?d-6597657-fn_package_uuid=".$this->currPackageUuid."&d-6597657-fn_department=".$empty."&d-6597657-fn_doc_type=".$empty."&d-6597657-fn_doc_subtype=".$empty."&d-6597657-fn_ref_no=".$empty."&d-6597657-fn_title=".$empty."&d-6597657-fn_doc_date=".$empty."&d-6597657-fn_superseded=".$empty;  //Document (My)
				$doc_list_doc_open = $userviewPrefix."documentOpenSabah_crud?d-667503-fn_package_uuid=".$this->currPackageUuid."&d-667503-fn_department=".$empty."&d-667503-fn_doc_type=".$empty."&d-667503-fn_doc_subtype=".$empty."&d-667503-fn_ref_no=".$empty."&d-667503-fn_title=".$empty."&d-667503-fn_doc_date=".$empty."&d-667503-fn_superseded=".$empty; // Document (Open)
				$doc_list_doc_restricted = $userviewPrefix."documentRestrictedSabah_crud?d-7453662-fn_package_uuid=".$this->currPackageUuid."&d-7453662-fn_department=".$empty."&d-7453662-fn_doc_type=".$empty."&d-7453662-fn_doc_subtype=".$empty."&d-7453662-fn_ref_no=".$empty."&d-7453662-fn_title=".$empty."&d-7453662-fn_doc_date=".$empty."&d-7453662-fn_superseded=".$empty; //Document (Restricted)
				$doc_list_doc_export = $userviewPrefix."list_doc_export?"; 
				$doc_list_doc_confidental = $userviewPrefix."documentConfidentialSabah_crud?d-8016369-fn_package_uuid=".$this->currPackageUuid."&d-8016369-fn_department=".$empty."&d-8016369-fn_doc_type=".$empty."&d-8016369-fn_doc_subtype=".$empty."&d-8016369-fn_ref_no=".$empty."&d-8016369-fn_title=".$empty."&d-8016369-fn_doc_date=".$empty."&d-8016369-fn_superseded=".$empty; //Document (Confidential)
				$doc_list_doc_arch = $userviewPrefix."documentArchivedSabah_crud?d-4998007-fn_package_uuid=".$this->currPackageUuid."&d-4998007-fn_department=".$empty."&d-4998007-fn_doc_type=".$empty."&d-4998007-fn_doc_subtype=".$empty."&d-4998007-fn_ref_no=".$empty."&d-4998007-fn_title=".$empty."&d-4998007-fn_doc_date=".$empty."&d-4998007-fn_superseded=".$empty; //Document (Archived)
				$doc_bulk_doc_register = $userviewPrefix."bulkImportSabah";

				//correspondence
				$doc_form_corr_register = $userviewPrefix."correspondenceSabah_run?package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId."&project_phase=".$this->currProjectPhase;
				$doc_list_corr_my = $userviewPrefix."correspondenceSabah_my?d-8132249-fn_package_uuid=".$this->currPackageUuid."&d-8132249-fn_corr_type=".$empty."&d-8132249-fn_doc_id=".$empty."&d-8132249-fn_doc_subtype=".$empty."&d-8132249-fn_doc_date=".$empty."&d-8132249-fn_doc_subject=".$empty."&d-8132249-fn_action_required=".$empty."&d-8132249-fn_status=".$empty;
				$doc_list_corr_int_all = $userviewPrefix."correspondenceSabah_crud?d-490849-fn_c_package_uuid=".$this->currPackageUuid."&d-490849-fn_c_corr_type=".$empty."&d-490849-fn_c_doc_id=".$empty."&d-490849-fn_c_doc_subtype=".$empty."&d-490849-fn_c_doc_date=".$empty."&d-490849-fn_c_doc_subject=".$empty."&d-490849-fn_c_action_required=".$empty."&d-490849-fn_c_status=".$empty;
				$doc_list_corr_tp_incoming = $userviewPrefix."incCorrespondenceSabah_crud?d-5525861-fn_package_uuid=".$this->currPackageUuid."&d-5525861-fn_corr_type=".$empty."&d-5525861-fn_doc_id=".$empty."&d-5525861-fn_doc_subtype=".$empty."&d-5525861-fn_doc_date=".$empty."&d-5525861-fn_doc_subject=".$empty."&d-5525861-fn_action_required=".$empty."&d-5525861-fn_status=".$empty;
				$doc_list_corr_tp_outgoing	= $userviewPrefix."outCorrespondenceSabah_crud?d-932225-fn_package_uuid=".$this->currPackageUuid."&d-932225-fn_corr_type=".$empty."&d-932225-fn_doc_id=".$empty."&d-932225-fn_doc_subtype=".$empty."&d-932225-fn_doc_date=".$empty."&d-932225-fn_doc_subject=".$empty."&d-932225-fn_action_required=".$empty."&d-932225-fn_status=".$empty;
				$doc_list_corr_open = $userviewPrefix."openCorrSabah_crud?d-4758564-fn_package_uuid=".$this->currPackageUuid."&d-4758564-fn_status=".$empty."&d-4758564-fn_doc_subject=".$empty."&d-4758564-fn_doc_date=".$empty."&d-4758564-fn_doc_id=".$empty."&d-4758564-fn_section=".$empty;
				$doc_list_corr_restricted= $userviewPrefix."restCorrSabah_crud?d-3492683-fn_package_uuid=".$this->currPackageUuid."&d-3492683-fn_status=".$empty."&d-3492683-fn_doc_subject=".$empty."&d-3492683-fn_doc_date=".$empty."&d-3492683-fn_doc_id=".$empty."&d-3492683-fn_section=".$empty."&d-3492683-fn_doc_subtype=".$empty;
				$doc_list_corr_export= $userviewPrefix."list_corr_export?";
				$doc_list_corr_conf= $userviewPrefix."conCorrSabah_crud?d-5921990-fn_package_uuid=".$this->currPackageUuid."&d-5921990-fn_status=".$empty."&d-5921990-fn_doc_subject=".$empty."&d-5921990-fn_doc_date=".$empty."&d-5921990-fn_doc_id=".$empty."&d-5921990-fn_section=".$empty."&d-5921990-fn_doc_subtype=".$empty;

				$doc_setup_lookup_section="";

				//dashboard
				$dash_doc_register_doc = $jsonPrefix."list_document_sabah?d-4999666-fn_c_package_uuid={?}&project_id={?}";
				$dash_doc_register_corr = $jsonPrefix."list_correspondence_sabah?d-490849-fn_c_package_uuid={?}&project_id={?}";
				
				// dashboard card
				$dash_doc_register_doc_card = $userviewPrefix."dashboardListDocument_sabah?d-6642978-fn_c_package_uuid=".$packageUuidIdConOp."&d-6642978-fn_c_project_id=".$projectIdConOp."&d-6642978-fn_document_date={?}&d-6642978-fn_document_date={?}&d-6642978-fn_c_doc_type={?}&d-6642978-fn_c_doc_subtype={?}&d-6642978-fn_revision_status={?}&inPackageUuid={?}";
				$dash_doc_register_corr_card = $userviewPrefix."dashListCorrespondence_sabah?d-4230405-fn_c_package_uuid=".$packageUuidIdConOp."&d-4230405-fn_c_project_id=".$projectIdConOp."&d-4230405-fn_c_doc_date={?}&d-4230405-fn_c_doc_date={?}&d-4230405-fn_c_doc_subtype={?}&d-4230405-fn_c_corr_type={?}&d-4230405-fn_c_status={?}&d-4230405-fn_c_respond_flag={?}&d-4230405-fn_c_priority={?}&d-4230405-fn_c_third_party={?}&inPackageUuid={?}";
				$dash_doc_register_corr_cardNotUrgent = $userviewPrefix."dashListCorrespondence_sabah?d-4230405-fn_c_package_uuid=".$packageUuidIdConOp."&d-4230405-fn_c_project_id=".$projectIdConOp."&d-4230405-fn_c_doc_date={?}&d-4230405-fn_c_doc_date={?}&d-4230405-fn_c_doc_subtype={?}&d-4230405-fn_c_corr_type={?}&d-4230405-fn_c_third_party={?}&d-4230405-fn_c_status={?}&d-4230405-fn_c_priority=Low&d-4230405-fn_c_priority=Medium&d-4230405-fn_c_priority=High&d-4230405-fn_c_created_by_user_org=".$currentOrg;
				$dash_doc_register_corr_cardUrgent = $userviewPrefix."dashListCorrespondence_sabah?d-4230405-fn_c_package_uuid=".$packageUuidIdConOp."&d-4230405-fn_c_project_id=".$projectIdConOp."&d-4230405-fn_c_doc_date={?}&d-4230405-fn_c_doc_date={?}&d-4230405-fn_c_doc_subtype={?}&d-4230405-fn_c_status={?}&d-4230405-fn_c_respond_flag={?}&d-4230405-fn_c_third_party={?}&d-4230405-fn_c_priority=Urgent&d-4230405-fn_c_created_by_user_org=".$currentOrg;
				$dash_doc_register_corr_cardInc = $userviewPrefix."dashListCorrespondence_sabah_inc?d-5170117-fn_c_package_uuid=".$packageUuidIdConOp."&d-5170117-fn_c_project_id=".$projectIdConOp."&d-5170117-fn_c_doc_date={?}&d-5170117-fn_c_doc_date={?}&d-5170117-fn_c_doc_subtype={?}&d-5170117-fn_c_created_by_user_org=".$currentOrg;
				$dash_doc_register_corr_cardIncParent = $userviewPrefix."dashListCorrespondence_sabah_inc_parent?d-2562031-fn_c_package_uuid=".$packageUuidIdConOp."&d-2562031-fn_c_project_id=".$projectIdConOp."&d-2562031-fn_c_doc_date={?}&d-2562031-fn_c_doc_date={?}&d-2562031-fn_c_doc_subtype={?}&inPackageUuid={?}";
				$dash_doc_register_corr_cardOut = $userviewPrefix."dashListCorrespondence_sabah_out?d-5170209-fn_c_package_uuid=".$packageUuidIdConOp."&d-5170209-fn_c_project_id=".$projectIdConOp."&d-5170209-fn_c_doc_date={?}&d-5170209-fn_c_doc_date={?}&d-5170209-fn_c_doc_subtype={?}&d-5170209-fn_c_third_party={?}&d-5170209-fn_c_created_by_user_org=".$currentOrg;
				$dash_doc_register_corr_cardOutParent = $userviewPrefix."dashListCorrespondence_sabah_inc_parent?d-2562031-fn_c_package_uuid=".$packageUuidIdConOp."&d-2562031-fn_c_project_id=".$projectIdConOp."&d-2562031-fn_c_doc_date={?}&d-2562031-fn_c_doc_date={?}&d-2562031-fn_c_doc_subtype={?}&inPackageUuid={?}";
				$dash_doc_register_corr_cardType = $userviewPrefix."dashListCorrespondence_sabah_type?d-7122279-fn_c_package_uuid=".$packageUuidIdConOp."&d-7122279-fn_c_project_id=".$projectIdConOp."&d-5170209-fn_c_doc_date={?}&d-5170209-fn_c_doc_date={?}&d-7122279-fn_c_corr_type={?}&inPackageUuid={?}";
				break;
		}

		$docLinkArr = array(
			// doc
			'doc_form_doc_register' => $doc_form_doc_register,
			'doc_bulk_doc_register' => $doc_bulk_doc_register,
			'doc_list_doc_my' => $doc_list_doc_my,
			'doc_list_doc_open' => $doc_list_doc_open,
			'doc_list_doc_restricted' => $doc_list_doc_restricted,
			'doc_list_doc_export' => $doc_list_doc_export,
			'doc_list_doc_confidental' => $doc_list_doc_confidental,
			'doc_list_doc_arch' => $doc_list_doc_arch,
			'doc_list_doc_draft' => $doc_list_doc_draft,
								
			// correspondance
			'doc_form_corr_register' => $doc_form_corr_register,
			'doc_list_corr_my' => $doc_list_corr_my,
			'doc_list_corr_int_all' => $doc_list_corr_int_all,
			'doc_list_corr_tp_incoming' => $doc_list_corr_tp_incoming,
			'doc_list_corr_tp_outgoing' => $doc_list_corr_tp_outgoing,
			'doc_list_corr_open' => $doc_list_corr_open,
			'doc_list_corr_conf' => $doc_list_corr_conf,
			'doc_list_corr_restricted' => $doc_list_corr_restricted,
			'doc_list_corr_export' => $doc_list_corr_export,
			'doc_form_corr_respond' => $doc_form_corr_respond,
			'doc_json_corr_notification' => $doc_json_corr_notification,
			'doc_list_corr_inbox' => $doc_list_corr_inbox,
			'doc_bulk_corr_register' => $doc_bulk_corr_register,

			//set up
			'doc_setup_lookup_entity' => $doc_setup_lookup_entity,
			'doc_setup_lookup_docType' => $doc_setup_lookup_docType,
			'doc_setup_lookup_section' => $doc_setup_lookup_section,
			'doc_setup_lookup_group' => $doc_setup_lookup_group,
			'doc_setup_distribution_group' => $doc_setup_distribution_group,
			//markup
			'cons_issue_markupv3' => $cons_issue_markupv3,
			'cons_issue_markupv3_sbh' => $cons_issue_markupv3_sbh,
			'cons_datalist_markup' => $cons_datalist_markup,
			'cons_datalist_markupv3' => $cons_datalist_markupv3,
			'markup_json_notification_package' => $markup_json_notification_package,
			'cons_datalist_markup_sabah' => $cons_datalist_markup_sabah,
			//dashboard 
			'dash_doc_register_doc' => $dash_doc_register_doc,
			'dash_doc_register_corr' => $dash_doc_register_corr,
			
			//dashboard conOpLink
			'dash_doc_register_doc_card' => $dash_doc_register_doc_card,
			'dash_doc_register_corr_card' => $dash_doc_register_corr_card,
			'dash_doc_register_corr_cardNotUrgent' => $dash_doc_register_corr_cardNotUrgent,
			'dash_doc_register_corr_cardUrgent' => $dash_doc_register_corr_cardUrgent,
			'dash_doc_register_corr_cardInc' => $dash_doc_register_corr_cardInc,
			'dash_doc_register_corr_cardOut' => $dash_doc_register_corr_cardOut,
			'dash_doc_register_corr_cardIncParent' => $dash_doc_register_corr_cardIncParent,
			'dash_doc_register_corr_cardOutParent' => $dash_doc_register_corr_cardOutParent,
			'dash_doc_register_corr_cardType' => $dash_doc_register_corr_cardType

		);
		$this->jogetAppLink = array_merge($this->jogetAppLink, $docLinkArr);
		return;
	}
	
	private function loadGeneralUrl(){

		$empty ="";

		// to read from datalist and read all the apps
		$appNameConstruct = 'ri_construct';
		$jsonPrefixConstruct = $this->jogetHost."jw/web/json/data/list/".$appNameConstruct."/";
		$userviewPrefixConstruct = $this->jogetHost."jw/web/embed/userview/".$appNameConstruct."/";

		$appNameDocument = 'document_mgmt';
		$jsonPrefixDocument = $this->jogetHost."jw/web/json/data/list/".$appNameDocument."/";
		$userviewPrefixDocument = $this->jogetHost."jw/web/embed/userview/".$appNameDocument."/v/_/";
		//doc SARAWAK/SABAH
		$doc_open_corr_respond = $userviewPrefixDocument."correspondence_response?id=";
		$doc_open_corr_acknowldge = $userviewPrefixDocument."correspondence_acknowledge?id=";
		//doc SSLR
		$doc_open_corr_respond_sslr = $userviewPrefixDocument."correspondence_response_sslr?id=";
		$doc_open_corr_acknowldge_sslr = $userviewPrefixDocument."correspondence_acknowledge_sslr?id=";

		// markup sabah
		$doc_markup_sabah_view = $userviewPrefixDocument."markup_sabah_view?id=";

		$appNameFinance = 'pfs';
		$jsonPrefixFinance = $this->jogetHost."jw/web/json/data/list/".$appNameFinance."/";
		$userviewPrefixFinance = $this->jogetHost."jw/web/embed/userview/".$appNameFinance."/pfsView/_/";
		$userviewPrefixAssetFinance = $this->jogetAssetHost."jw/web/embed/userview/".$appNameFinance."/PFS_ASSET/_/";

		$appNameAsset = 'ri_asset';
		$jsonPrefixAsset = $this->jogetAssetHost."jw/web/json/data/list/".$appNameAsset."/";
		$userviewPrefixAsset = $this->jogetAssetHost."jw/web/embed/userview/".$appNameAsset."/ri_asset/_/";
		$jsonPrefixFinanceAsset = $this->jogetAssetHost."jw/web/json/data/list/".$appNameFinance."/";

		$appNameFm = 'RV_AMS';
		$jsonPrefixFm = $this->jogetAssetHost."jw/web/json/data/list/".$appNameFm."/";
		$userviewPrefixFm = $this->jogetAssetHost."jw/web/embed/userview/".$appNameFm."/RV_AMS/_/";

		$cons_json_datalist_task = $jsonPrefixConstruct."generalInbox_v3?d-5409928-fn_ResourceId=".$this->currUserEmail.'&dateModifiedFrom={?}&dateModifiedTo={?}';
		$doc_json_datalist_task = $jsonPrefixDocument."doc_notification_list?d-7470797-fn_to=".$this->currUserEmail.'&dateModifiedFrom={?}&dateModifiedTo={?}';
		if($this->isDownstream){
			$finance_json_datalist_task = $jsonPrefixFinance."generalInbox_sslr?d-6747245-fn_c_assign_to=".$this->currUserEmail; 
		}else{
			$finance_json_datalist_task = $jsonPrefixFinance."generalInbox?d-5171348-fn_c_assign_to=".$this->currUserEmail.'&dateModifiedFrom={?}&dateModifiedTo={?}';
		}
		//new datalist for all pending task in all users project
		$asset_json_datalist_task = $jsonPrefixAsset."inbox_general_v3?d-8079515-fn_ResourceId=".$this->currUserEmail.'&dateModifiedFrom={?}&dateModifiedTo={?}';
		// finance asset myTask 
		$finance_asset_json_notifications = $jsonPrefixFinanceAsset."generalInbox?d-5171348-fn_c_assign_to=".$this->currUserEmail.'&dateModifiedFrom={?}&dateModifiedTo={?}';

		$cons_open_inboxv3 = $userviewPrefixConstruct."general_inbox/_/general_inbox?";
		$cons_open_inboxv3_markup = $userviewPrefixDocument."markupInbox?";
		$finance_open_ContractActivityForm = $userviewPrefixFinance."contract_inbox?activityId=";
		$finance_open_ClaimActivityForm = $userviewPrefixFinance. "claim_inbox?activityId=";
		$finance_open_VOActivityForm = $userviewPrefixFinance. "vo_inbox?activityId=";
		$finance_open_VOActivityForm_SSLR2 = $userviewPrefixFinance. "vo_inbox_sslr?activityId=";
		$finance_open_EOTActivityForm_SSLR2 = $userviewPrefixFinance. "eot_inbox_sslr?activityId=";

		$finance_list_ContractActivityFormAsset = $userviewPrefixAssetFinance."contract_inbox?activityId=";
		$finance_list_ClaimActivityFormAsset = $userviewPrefixAssetFinance."periodic_claim_inbox?activityId=";
		$finance_list_ClaimActivityFormRoutineAsset = $userviewPrefixAssetFinance. "claim_inbox?activityId=";
		$finance_list_ClaimActivityFormHqAsset = $userviewPrefixAssetFinance. "hq_claim_inbox?activityId=";
		$finance_list_ClaimActivityFormPerHqAsset = $userviewPrefixAssetFinance. "hq_claim_per_inbox?activityId=";

		// SSLR2 PFS
		$finance_list_ClaimViewAttachment_SSLR2 = $userviewPrefixFinance. "sslr_claimAttachmentView?id={?}";
		$finance_list_ApprovedClaimsLinking_SSLR2 = $userviewPrefixFinance."claimUploadAttachmentList_sslr?project_id=".$this->currPackageId."&layer_id={?}&layer_name={?}";
		$finance_list_Additionalfile_SSLR2 = $userviewPrefixFinance."bimAdditionalUploadFile_sslr?layer_id={?}";
		$finance_list_ClaimView_SSLR2 = $userviewPrefixFinance."claimLinkedBimList_sslr?project_id=".$this->currPackageId."&layer_id={?}";
		$finance_list_AdditionalfileView_SSLR2 = $userviewPrefixFinance. "sslr_additionalAttachmentView?id={?}";

		// open close form from email
		$cons_form_RFI = $userviewPrefixConstruct."rfi/_/rfiForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		$cons_form_NCR = $userviewPrefixConstruct."ncr/_/ncrForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		$cons_form_WIR = $userviewPrefixConstruct."wir/_/wirForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		$cons_form_MOS = $userviewPrefixConstruct."ms/_/msForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		$cons_form_MS = $userviewPrefixConstruct."ma/_/maForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		$cons_form_IR = $userviewPrefixConstruct."inc/_/incForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		$cons_form_SDL = $userviewPrefixConstruct."sdl/_/sdlForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		$cons_form_SD = $userviewPrefixConstruct."sd/_/sdForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		$cons_form_RS = $userviewPrefixConstruct."rs/_/rsForm_crud/?_mode=edit&hide=hideBack&id=";
		$cons_form_SA = $userviewPrefixConstruct."sa/_/saForm_crud/?_mode=edit&hide=hideBack&id=";
		$cons_form_SMH = $userviewPrefixConstruct."smh/_/smhForm_crud/?_mode=edit&hide=hideBack&id=";
		$cons_form_RR = $userviewPrefixConstruct."rr/_/rrForm_crud/?_mode=edit&hide=hideBack&id=";
		$cons_form_DCR = $userviewPrefixConstruct."dcr/_/dcrForm_crud/?_mode=edit&hide=hideBack&id=";
		$cons_form_NOI = $userviewPrefixConstruct."noi/_/noiForm_crudSarawak/?_mode=edit&hide=hideBack&id=";
		$cons_form_PBC = $userviewPrefixConstruct."pubc/_/pubcForm_crud/?_mode=edit&hide=hideBack&id=";
		$cons_form_DA = "";
		$cons_form_PU = "";

		//asset
		$asset_json_open_inbox = $userviewPrefixAsset."inbox_general/?";
		$asset_insp_form_bridge = $userviewPrefixAsset. "list_insp_inv_bridge?d-6596122-fn_package_uuid=".$this->currPackageUuid; // bridge inspection opens to a list and not form as got several components
		$asset_insp_form_culvert = $userviewPrefixAsset."insp_culvert?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_pavement = $userviewPrefixAsset."insp_pavement?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_drainage = $userviewPrefixAsset."insp_drainage?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_form_slope = $userviewPrefixAsset."insp_slope?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_insp_culvert = $userviewPrefixAsset."list_insp_inv_culvert?d-4254305-fn_package_uuid=".$this->currPackageUuid."&d-4254305-fn_asset_id=".$empty;
		$asset_insp_drainage = $userviewPrefixAsset."list_insp_inv_drainage?d-4759361-fn_package_uuid=".$this->currPackageUuid."&d-4759361-fn_asset_id=".$empty."&project_owner=".$this->currProjectOwner;
		//$asset_insp_pavement = $userviewPrefixAsset."list_insp_inv_pavement?d-3658546-fn_package_uuid=".$this->currPackageUuid."&d-3658546-fn_asset_id=".$empty;
		$asset_insp_slope = $userviewPrefixAsset."list_insp_inv_slope?d-4770194-fn_package_uuid=".$this->currPackageUuid."&d-4770194-fn_asset_id=".$empty;

		//asset inbox
		$asset_inbox_maint_work_program =  $userviewPrefixAsset."inboxWorkProgram?d-233716-fn_package_uuid=".$this->currPackageUuid."&d-233716-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_maint_work_order =  $userviewPrefixAsset."inboxWO?d-4008231-fn_package_uuid=".$this->currPackageUuid."&d-4008231-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_maint_noe =  $userviewPrefixAsset."inboxNOE?d-3636105-fn_package_uuid=".$this->currPackageUuid."&d-3636105-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_maint_work_daily_report =  $userviewPrefixAsset."inboxDailyWork?d-7990414-fn_package_uuid=".$this->currPackageUuid."&d-7990414-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_maint_work_order_emergency =  $userviewPrefixAsset."inboxWOEmergency?d-342337-fn_package_uuid=".$this->currPackageUuid."&d-342337-fn_ResourceId=".$this->currUserEmail;
		$asset_inbox_maint_work_budget_approval =  $userviewPrefixAsset."inboxWBPeriodic?d-3636104-fn_ResourceId=".$this->currUserEmail."&d-3636104-fn_package_uuid=".$this->currPackageUuid;
		$asset_inbox_maint_work_budget_approval_emergency =  $userviewPrefixAsset."inboxWBEmergency?d-4768074-fn_ResourceId=".$this->currUserEmail."&d-4768074-fn_package_uuid=".$this->currPackageUuid;
		
		//asset manage
		$asset_manage_NODefect =  $userviewPrefixAsset."list_nodManage?d-3413492-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_manage_defect_detection =  $userviewPrefixAsset."list_defectManage?d-7015122-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_manage_defect_detection_sabah =  $userviewPrefixAsset."list_defectManage_sbh?d-6192144-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_manage_NOE =  $userviewPrefixAsset."list_noeManage?package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;

		$asset_maintain_schedule_inspection = $userviewPrefixAsset."schedule_inspection?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
		$asset_maintain_schedule_inspection_sabah = $userviewPrefixAsset."schedule_inspection_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
		$asset_maintain_nod = $userviewPrefixAsset."nod?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_maintain_nod_emergency = $userviewPrefixAsset."nod_emergency?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_manage_maint_work_activity =  $userviewPrefixAsset."list_maintenanceActivity?d-7779575-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
		$asset_manage_maint_work_activity_sabah =  $userviewPrefixAsset."list_maintenanceActivity_sabah?d-647463-fn_package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
		$asset_manage_maint_work_instruction =  $userviewPrefixAsset."list_workInstructionManage?d-5021799-fn_package_uuid=".$this->currPackageUuid."&d-5021799-fn_ref_no=&d-5021799-fn_type_of_activity=";
		$asset_manage_maint_work_instruction_sabah =  $userviewPrefixAsset."list_workInstructionManage_sabah?d-3494679-fn_package_uuid=".$this->currPackageUuid."&d-3494679-fn_ref_no=&d-3494679-fn_type_of_activity=";
		$asset_submit_maint_work_program =  $userviewPrefixAsset."work_program_submission?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_submit_maint_work_program_sabah =  $userviewPrefixAsset."work_program_submission_sbh?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_submit_maint_noe =  $userviewPrefixAsset."noe?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_submit_maint_noe_sabah =  $userviewPrefixAsset."new_noe_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_submit_maint_work_daily_report =  $userviewPrefixAsset."daily_work?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_maintain_ncp = $userviewPrefixAsset."ncp?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_maintain_ncp_sabah = $userviewPrefixAsset."ncp_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_maintain_rfi = $userviewPrefixAsset."rfi?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_maintain_rfi_sabah = $userviewPrefixAsset."rfi_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_maintain_nod_routine = $userviewPrefixAsset."nod_routine?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_maintain_site_routine = $userviewPrefixAsset."site_routine_inspection?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner;
		$asset_work_order = $userviewPrefixAsset."work_order?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_manage_work_order_emergency =  $userviewPrefixAsset."list_workOrderManage?d-4220438-fn_package_uuid=".$this->currPackageUuid;
		$asset_submit_work_budget_approval =  $userviewPrefixAsset."wbPeriodic?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_submit_work_order =  $userviewPrefixAsset."work_order_periodic?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_submit_work_order_sabah =  $userviewPrefixAsset."wo_periodic_sabah?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_submit_work_budget_approval_emergency =  $userviewPrefixAsset."wbEmergency?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_submit_work_order_emergency =  $userviewPrefixAsset."work_order_emergency?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_create_defect_detection =  $userviewPrefixAsset."create_defect?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;
		$asset_submit_maint_gar =  $userviewPrefixAsset."gar?package_id=".$this->currPackageId."&project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_location=".$this->currLocation;
		$asset_create_NODefect =  $asset_create_NODefect =  $userviewPrefixAsset."create_nod?d-570502-fn_package_uuid=".$this->currPackageUuid."&project_owner=".$this->currProjectOwner;

		// maintenance view
		$asset_maint_view_work_instruction = $userviewPrefixAsset."list_workInstruction?d-1123026-fn_package_uuid=".$this->currPackageUuid."&d-1123026-fn_ref_no=".$empty."&d-1123026-fn_dateCreated=".$empty."&d-1123026-fn_dateCreated=".$empty."&d-1123026-fn_type_of_activity=".$empty."&d-1123026-fn_wi_status=".$empty."&d-1123026-fn_work_status=".$empty."&d-1123026-fn_activity=".$empty."&d-1123026-fn_work_date=".$empty."&d-1123026-fn_work_date=".$empty;
		$asset_maint_view_work_program_annual = $userviewPrefixAsset."list_workProgramAnnual?d-1203571-fn_package_uuid=".$this->currPackageUuid."&d-1203571-fn_year=".$empty;
		$asset_maint_view_work_program_monthly = $userviewPrefixAsset."list_workProgramMonthly?d-4345021-fn_package_uuid=".$this->currPackageUuid."&d-4345021-fn_year=".$empty."&d-4345021-fn_month=".$empty;
		$asset_maint_view_workorder = $userviewPrefixAsset."list_workOrder?d-7884198-fn_package_uuid=".$this->currPackageUuid."&d-7884198-fn_asset_type=".$empty."&d-7884198-fn_status=".$empty."&d-7884198-fn_dateCreated=".$empty."&d-7884198-fn_dateCreated=".$empty;
		$asset_maint_view_notice_of_emergency = $userviewPrefixAsset."list_noe?d-4015109-fn_package_uuid=".$this->currPackageUuid."&d-4015109-fn_ref_no=".$empty."&d-4015109-fn_noe_date=".$empty;
		$asset_maint_view_work_daily_report = $userviewPrefixAsset."list_wdr?d-1888400-fn_package_uuid=".$this->currPackageUuid."&d-1888400-fn_ref_no=".$empty;
		$asset_maint_view_asset_handover = $userviewPrefixAsset."list_asset_handover?d-6235256-fn_package_uuid=".$this->currPackageUuid."&d-6235256-fn_ref_no=".$empty;
		$asset_maint_view_workorder_emergency = $userviewPrefixAsset."list_workOrderEmergency?d-4614743-fn_package_uuid=".$this->currPackageUuid;
		$asset_maint_view_apj = $userviewPrefixAsset."list_wbAPJPeriodic?d-4015108-fn_package_uuid=".$this->currPackageUuid."&d-4015108-fn_Ref_No=".$empty."&d-4015108-fn_Date=".$empty."&d-4015108-fn_Date=".$empty."&d-4015108-fn_Asset_Type=".$empty."&d-4015108-fn_Status=".$empty;
		$asset_maint_view_apj_amendment = $userviewPrefixAsset."list_wbAPJAmendPeriodic?d-3741830-fn_package_uuid=".$this->currPackageUuid."&d-3741830-fn_Ref_No=".$empty."&d-3741830-fn_Date=".$empty."&d-3741830-fn_Date=".$empty."&d-3741830-fn_Asset_Type=".$empty."&d-3741830-fn_Status=".$empty;
		$asset_maint_view_kpj = $userviewPrefixAsset."list_wbKPJPeriodic?d-1252786-fn_package_uuid=".$this->currPackageUuid."&d-1252786-fn_Ref_No=".$empty."&d-1252786-fn_Date=".$empty."&d-1252786-fn_Date=".$empty."&d-1252786-fn_Asset_Type=".$empty."&d-1252786-fn_Status=".$empty;
		$asset_maint_view_apj_emergency = $userviewPrefixAsset."list_wbAPJEmergency?d-4015108-fn_package_uuid=".$this->currPackageUuid;
		$asset_maint_view_apj_amendment_emergency = $userviewPrefixAsset."list_wbAPJAmendEmergency?d-3741830-fn_package_uuid=".$this->currPackageUuid;
		$asset_maint_view_kpj_emergency = $userviewPrefixAsset."list_wbKPJEmergency?d-1252786-fn_package_uuid=".$this->currPackageUuid;
		$asset_maint_view_defect_detection = $userviewPrefixAsset."list_defectDetectionPeriodic";
		$asset_maint_view_defect_detection_emergency = $userviewPrefixAsset."list_defectDetectionEmergency";

		// signature
		if($this->isDownstream){
			$asset_user_signature = $userviewPrefixConstruct."ri_asset/_/userSignature?d-8275578-fn_id=".$this->currUserEmail;
		}else{
			$asset_user_signature = $userviewPrefixAsset."userSignature?d-8275578-fn_id=".$this->currUserEmail;
		}

		// count for all assignments
		$cons_json_datalist_task_count = $jsonPrefixConstruct."generalInbox_count?d-5409928-fn_ResourceId=".$this->currUserEmail;
		$doc_json_datalist_task_count = $jsonPrefixDocument."doc_notification_count?d-755636-fn_corr_act_user.to=".$this->currUserEmail;
		$asset_json_datalist_task_count = $jsonPrefixAsset."inbox_general_v3_count?d-8079515-fn_ResourceId=".$this->currUserEmail;
		$finance_json_datalist_task_count = $jsonPrefixFinance."generalInbox_count?d-5171348-fn_c_assign_to=".$this->currUserEmail;
		$finance_asset_json_notifications_count = $jsonPrefixFinanceAsset."generalInbox_count?d-5171348-fn_c_assign_to=".$this->currUserEmail;

		// fm
		$fm_json_datalist_asset_type = $jsonPrefixFm."list_assetTypeConfiguration";
		// markup tool inbox sabah
		$markup_json_datalist_task = $jsonPrefixDocument."inbox_reviewToolForm?ResourceId=".$this->currUserEmail;
		$markup_json_datalist_task_count = $jsonPrefixDocument."inboxMarkup_count?d-4187620-fn_ResourceId=".$this->currUserEmail;

		// rfi edit closed rfi
		$rfi_edit_json_datalist_task = $jsonPrefixConstruct."list_editMyTask?ResourceId=".$this->currUserEmail;
		$rfi_edit_json_datalist_task_count = $jsonPrefixConstruct."list_editMyTask_count?ResourceId=".$this->currUserEmail;
		$cons_issue_verify_rfi = $userviewPrefixConstruct."wir/_/wir_verifySabah?id=";

		// from email view without mytask action - sslr
		$email_view_sslr_MS = $userviewPrefixConstruct."ms/_/ms_sslr_email_view?id=";
		$email_view_sslr_NOI = $userviewPrefixConstruct."noi/_/noi_sslr_email_view?id=";
		$email_view_sslr_NCR = $userviewPrefixConstruct."ncr/_/ncr_sslr_email_view?id=";
		$email_view_sslr_INC = $userviewPrefixConstruct."inc/_/inc_sslr_email_view?id=";
		$email_view_sslr_RFI = $userviewPrefixConstruct."rfi/_/rfi_sslr_email_view?id=";
		$email_view_sslr_WIR = $userviewPrefixConstruct."wir/_/wir_sslr_email_view?id=";

		// from email view without mytask action - sabah 1b
		$email_view_sbh_1b_SA = $userviewPrefixConstruct."sa/_/sa_sbh_1b_email_view?id=";
		$email_view_sbh_1b_SMH = $userviewPrefixConstruct."smh/_/smh_sbh_1b_email_view?id=";
		$email_view_sbh_PUBC = $userviewPrefixConstruct."pubc/_/pubc_sabah_email_view?id=";

		//markup review
		$cons_datalist_markup = $userviewPrefixDocument."markupForm_crud?d-6595155-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_markupv3 = $jsonPrefixDocument."list_markupForm?d-6595155-fn_package_uuid=".$this->currPackageUuid;
		$cons_issue_markupv3 = $userviewPrefixDocument."markUpForm?project_id_number=".$this->pid."&package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;

		//markup sabah
		$cons_issue_markupv3_sbh = $userviewPrefixDocument."new_markupSbh?project_id_number=".$this->pid."&package_id=".$this->currPackageId."&package_uuid=".$this->currPackageUuid."&package_name=".$this->currPackageName."&project_owner=".$this->currProjectOwner."&wpc=".$this->currWPCId."&project_id=".$this->currProjectId;
		$markup_json_notification_package = $jsonPrefixDocument."inbox_markupPackage?d-2911267-fn_ResourceId=".$this->currUserEmail."&d-2911267-fn_package_uuid=".$this->currPackageUuid;
		$cons_datalist_markup_sabah = $userviewPrefixDocument."markupForm_crud_sabah?d-6595155-fn_package_uuid=".$this->currPackageUuid;
		$omni_class_network_asset = $jsonPrefixAsset.'list_AssetHierarchy?start=0&rows=9999';
		$asset_hierarchy_form = $userviewPrefixAsset."assetHierarchyForm?project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId;
		$asset_hierarchy_crud = $userviewPrefixAsset."assetHierarchy_crud?project_id=".$this->currProjectId."&package_uuid=".$this->currPackageUuid."&package_id=".$this->currPackageId;

		$generalLinkArr = array(
			'cons_json_datalist_task' => $cons_json_datalist_task,
			'doc_json_datalist_task' => $doc_json_datalist_task,
			'finance_json_datalist_task' => $finance_json_datalist_task,
			'cons_open_inboxv3' => $cons_open_inboxv3,
			'cons_open_inboxv3_markup' => $cons_open_inboxv3_markup,
			'finance_open_ContractActivityForm' => $finance_open_ContractActivityForm,
			'finance_open_ClaimActivityForm' => $finance_open_ClaimActivityForm,
			'finance_open_VOActivityForm' => $finance_open_VOActivityForm,
			'finance_open_VOActivityForm_SSLR2' => $finance_open_VOActivityForm_SSLR2,
			'finance_open_EOTActivityForm_SSLR2' => $finance_open_EOTActivityForm_SSLR2,
			'doc_open_corr_respond' => $doc_open_corr_respond,
			'doc_open_corr_acknowldge' => $doc_open_corr_acknowldge,
			'doc_open_corr_respond_sslr' => $doc_open_corr_respond_sslr,
			'doc_open_corr_acknowldge_sslr' => $doc_open_corr_acknowldge_sslr,
			'doc_markup_sabah_view' => $doc_markup_sabah_view,
			'asset_json_datalist_task' => $asset_json_datalist_task,
			'finance_asset_json_notifications' => $finance_asset_json_notifications,
			'finance_list_ContractActivityFormAsset' => $finance_list_ContractActivityFormAsset,
			'finance_list_ClaimActivityFormAsset' => $finance_list_ClaimActivityFormAsset,
			'finance_list_ClaimActivityFormRoutineAsset' => $finance_list_ClaimActivityFormRoutineAsset,
			'finance_list_ClaimActivityFormHqAsset' => $finance_list_ClaimActivityFormHqAsset,
			'finance_list_ClaimActivityFormPerHqAsset' => $finance_list_ClaimActivityFormPerHqAsset,
			'finance_list_ClaimViewAttachment_SSLR2' => $finance_list_ClaimViewAttachment_SSLR2,
			'finance_list_ApprovedClaimsLinking_SSLR2' => $finance_list_ApprovedClaimsLinking_SSLR2,
			'finance_list_Additionalfile_SSLR2' => $finance_list_Additionalfile_SSLR2,
			'finance_list_ClaimView_SSLR2' => $finance_list_ClaimView_SSLR2,
			'finance_list_AdditionalfileView_SSLR2' => $finance_list_AdditionalfileView_SSLR2,
			// open close form from email
			'cons_form_RFI' => $cons_form_RFI,
			'cons_form_NCR' => $cons_form_NCR,
			'cons_form_WIR' => $cons_form_WIR,
			'cons_form_MOS' => $cons_form_MOS,
			'cons_form_MS' => $cons_form_MS,
			'cons_form_IR' => $cons_form_IR,
			'cons_form_SDL' => $cons_form_SDL,
			'cons_form_SD' => $cons_form_SD,
			'cons_form_RS' => $cons_form_RS,
			'cons_form_SA' => $cons_form_SA,
			'cons_form_SMH' => $cons_form_SMH,
			'cons_form_RR' => $cons_form_RR,
			'cons_form_DCR' => $cons_form_DCR,
			'cons_form_NOI' => $cons_form_NOI,
			'cons_form_PBC' => $cons_form_PBC,
			'cons_form_DA' => $cons_form_DA,
			'cons_form_PU' => $cons_form_PU,
			// asset
			'asset_json_open_inbox' => $asset_json_open_inbox,
			'asset_maintain_schedule_inspection' => $asset_maintain_schedule_inspection,
			'asset_maintain_schedule_inspection_sabah' => $asset_maintain_schedule_inspection_sabah,
			'asset_insp_form_bridge' => $asset_insp_form_bridge,
			'asset_insp_form_culvert' => $asset_insp_form_culvert,
			'asset_insp_form_pavement' => $asset_insp_form_pavement,
			'asset_insp_form_drainage' => $asset_insp_form_drainage,
			'asset_insp_form_slope' => $asset_insp_form_slope,
			'asset_insp_culvert' => $asset_insp_culvert,
			'asset_insp_drainage' => $asset_insp_drainage,
			//'asset_insp_pavement' => $asset_insp_pavement,
			'asset_insp_slope' => $asset_insp_slope,
			'asset_maintain_nod' => $asset_maintain_nod,
			'asset_maintain_nod_emergency' => $asset_maintain_nod_emergency,
			'asset_manage_maint_work_activity' => $asset_manage_maint_work_activity,
			'asset_manage_maint_work_activity_sabah' => $asset_manage_maint_work_activity_sabah,
			'asset_manage_maint_work_instruction' => $asset_manage_maint_work_instruction,
			'asset_manage_maint_work_instruction_sabah' => $asset_manage_maint_work_instruction_sabah,
			'asset_submit_maint_work_program' => $asset_submit_maint_work_program,
			'asset_submit_maint_work_program_sabah' => $asset_submit_maint_work_program_sabah,
			'asset_inbox_maint_work_program' => $asset_inbox_maint_work_program,
			'asset_inbox_maint_work_order' => $asset_inbox_maint_work_order,
			'asset_submit_maint_noe' => $asset_submit_maint_noe,
			'asset_submit_maint_gar' => $asset_submit_maint_gar,
			'asset_inbox_maint_noe' => $asset_inbox_maint_noe,
			'asset_submit_maint_work_daily_report' => $asset_submit_maint_work_daily_report,
			'asset_inbox_maint_work_daily_report' => $asset_inbox_maint_work_daily_report,
			'asset_maintain_ncp' => $asset_maintain_ncp,
			'asset_maintain_rfi' => $asset_maintain_rfi,
			'asset_maintain_rfi_sabah' => $asset_maintain_rfi_sabah,
			'asset_maintain_nod_routine' => $asset_maintain_nod_routine,
			'asset_maintain_site_routine' => $asset_maintain_site_routine,
			'asset_work_order' => $asset_work_order,
			'asset_manage_work_order_emergency' => $asset_manage_work_order_emergency,
			'asset_inbox_maint_work_order_emergency' => $asset_inbox_maint_work_order_emergency,
			// maintenance view
			'asset_maint_view_work_instruction' => $asset_maint_view_work_instruction,
			'asset_maint_view_work_program_annual' => $asset_maint_view_work_program_annual,
			'asset_maint_view_work_program_monthly' => $asset_maint_view_work_program_monthly,
			'asset_maint_view_workorder' => $asset_maint_view_workorder,
			'asset_maint_view_notice_of_emergency' => $asset_maint_view_notice_of_emergency,
			'asset_maint_view_work_daily_report' => $asset_maint_view_work_daily_report,
			'asset_maint_view_asset_handover' => $asset_maint_view_asset_handover,
			'asset_maint_view_workorder_emergency' => $asset_maint_view_workorder_emergency,
			'asset_submit_work_budget_approval' => $asset_submit_work_budget_approval,
			'asset_inbox_maint_work_budget_approval' => $asset_inbox_maint_work_budget_approval,
			'asset_submit_work_order' => $asset_submit_work_order,
			'asset_submit_work_budget_approval_emergency' => $asset_submit_work_budget_approval_emergency,
			'asset_inbox_maint_work_budget_approval_emergency' => $asset_inbox_maint_work_budget_approval_emergency,
			'asset_submit_work_order_emergency' => $asset_submit_work_order_emergency,
			'asset_maint_view_apj' => $asset_maint_view_apj,
			'asset_maint_view_apj_amendment' => $asset_maint_view_apj_amendment,
			'asset_maint_view_kpj' => $asset_maint_view_kpj,
			'asset_maint_view_apj_emergency' => $asset_maint_view_apj_emergency,
			'asset_maint_view_apj_amendment_emergency' => $asset_maint_view_apj_amendment_emergency,
			'asset_maint_view_kpj_emergency' => $asset_maint_view_kpj_emergency,
			'asset_maint_view_defect_detection' => $asset_maint_view_defect_detection,
			'asset_maint_view_defect_detection_emergency' => $asset_maint_view_defect_detection_emergency,
			'asset_create_defect_detection' => $asset_create_defect_detection,
			'asset_manage_defect_detection' => $asset_manage_defect_detection,
			'asset_manage_defect_detection_sabah' => $asset_manage_defect_detection_sabah,
			'asset_create_NODefect' => $asset_create_NODefect,
			'asset_manage_NODefect' => $asset_manage_NODefect,
			'asset_manage_NOE' => $asset_manage_NOE,
			'asset_user_signature' => $asset_user_signature,
			'asset_submit_work_order_sabah' => $asset_submit_work_order_sabah,
			'asset_submit_maint_noe_sabah' => $asset_submit_maint_noe_sabah,
			'asset_maintain_ncp_sabah' => $asset_maintain_ncp_sabah,
			'cons_json_datalist_task_count' => $cons_json_datalist_task_count,
			'doc_json_datalist_task_count' => $doc_json_datalist_task_count,
			'asset_json_datalist_task_count' => $asset_json_datalist_task_count,
			'finance_json_datalist_task_count' => $finance_json_datalist_task_count,
			'finance_asset_json_notifications_count' => $finance_asset_json_notifications_count,
			// fm
			'fm_json_datalist_asset_type' => $fm_json_datalist_asset_type,
			'markup_json_datalist_task' => $markup_json_datalist_task,
			'markup_json_datalist_task_count' => $markup_json_datalist_task_count,
			'rfi_edit_json_datalist_task' => $rfi_edit_json_datalist_task,
			'rfi_edit_json_datalist_task_count' => $rfi_edit_json_datalist_task_count,
			'cons_issue_verify_rfi' => $cons_issue_verify_rfi,

			'email_view_sslr_MS' => $email_view_sslr_MS,
			'email_view_sslr_NOI' => $email_view_sslr_NOI,
			'email_view_sslr_NCR' => $email_view_sslr_NCR,
			'email_view_sslr_INC' => $email_view_sslr_INC,
			'email_view_sslr_RFI' => $email_view_sslr_RFI,
			'email_view_sslr_WIR' => $email_view_sslr_WIR,
			'email_view_sbh_1b_SA' => $email_view_sbh_1b_SA,
			'email_view_sbh_1b_SMH' => $email_view_sbh_1b_SMH,
			'email_view_sbh_PUBC' => $email_view_sbh_PUBC,
			//markup
			'cons_datalist_markupv3' => $cons_datalist_markupv3,
			'cons_datalist_markup' => $cons_datalist_markup,
			'cons_issue_markupv3' => $cons_issue_markupv3,
			'cons_issue_markupv3_sbh' => $cons_issue_markupv3_sbh,
			'markup_json_notification_package' => $markup_json_notification_package,
			'cons_datalist_markup_sabah' => $cons_datalist_markup_sabah,

			'omni_class_network_asset' => $omni_class_network_asset,
			'asset_hierarchy_crud' => $asset_hierarchy_crud,
			'asset_hierarchy_form' => $asset_hierarchy_form
		);

		if($this->currProjectOwner == "SSLR2"){
			$exportLink = array(
				'view_download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.ViewDownloadableDataAPI/service',
				'download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.DownloadDataListData/service',
				'puRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/pu/_/puDown_list?data=',
				'pubcSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/pubc/_/pubcDown_list_sslr?data=',
				'leRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/land/_/leDown_list_sslr?data=',
				'liRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/land/_/liDown_list_sslr?data=',
				'laForm_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/land/_/laDown_list_sslr?data=',
				'rrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/rr/_/rrDown_list_sslr?data=',
				'smhRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/smh/_/smhDown_list_sslr?data=',
				'saRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/sa/_/saDown_list_sslr?data=',
				'rsSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/rs/_/rsDown_list_sslr?data=',
				'sdSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/sd/_/sdDown_list_sslr?data=',
				'sdlSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/sdl/_/sdlDown_list_sslr?data=',
				'incRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/inc/_/incDown_list_sslr?data=',
				'maSubmission_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/ma/_/maDown_list_sslr?data=',
				'msSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/ms/_/msDown_list_sslr?data=',
				'rfiSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/rfi/_/rfiDown_list_sslr?data=',
				'dcrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/dcr/_/dcrDown_list_sslr?data=',
				'wirSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/wir/_/wirDown_list_sslr?data=',
				'ncrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/ncr/_/ncrDown_list_sslr?data=',
				'noiSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/noi/_/noiDown_list_sslr?data=',
				'rsdlSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/rsdl/_/rsdlDown_list_sslr?data='
			);

		}else{
			$exportLink = array(
				'view_download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.ViewDownloadableDataAPI/service',
				'download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.DownloadDataListData/service',
				'puRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/pu/_/puDown_list?data=',
				'daSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/da/_/daDown_list?data=',
				'pubcSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/pubc/_/pubcDown_list?data=',
				'lsRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/land/_/lsDown_list?data=',
				'leRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/land/_/leDown_list?data=',
				'liRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/land/_/liDown_list?data=',
				'laForm_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/land/_/laDown_list?data=',
				'rrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/rr/_/rrDown_list?data=',
				'smhRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/smh/_/smhDown_list?data=',
				'saRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/sa/_/saDown_list?data=',
				'rsSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/rs/_/rsDown_list?data=',
				'sdSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/sd/_/sdDown_list?data=',
				'sdlSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/sdl/_/sdlDown_list?data=',
				'incRegister_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/inc/_/incDown_list?data=',
				'maSubmission_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/ma/_/maDown_list?data=',
				'msSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/ms/_/msDown_list?data=',
				'rfiSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/rfi/_/rfiDown_list?data=',
				'dcrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/dcr/_/dcrDown_list?data=',
				'wirSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/wir/_/wirDown_list?data=',
				'ncrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/ncr/_/ncrDown_list?data=',
				'noiSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/noi/_/noiDown_list?data=',
				'rsdlSubmit_view' => $this->jogetHost.'jw/web/embed/userview/ri_construct/rsdl/_/rsdlDown_list?data='
			);
		}

		$this->jogetAppLink = array_merge($this->jogetAppLink, $generalLinkArr, $exportLink);
	}

	private function getPluginLink(){
		if($this->currProjectOwner == "SSLR2"){
			$ret = array(
				'view_download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.ViewDownloadableDataAPI/service',
				'download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.DownloadDataListData/service',
				'puRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/pu/_/puDown_list?data=',
				'pubcSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/pubc/_/pubcDown_list_sslr?data=',
				'leRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/land/_/leDown_list_sslr?data=',
				'liRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/land/_/liDown_list_sslr?data=',
				'laForm_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/land/_/laDown_list_sslr?data=',
				'rrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/rr/_/rrDown_list_sslr?data=',
				'smhRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/smh/_/smhDown_list_sslr?data=',
				'saRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/sa/_/saDown_list_sslr?data=',
				'rsSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/rs/_/rsDown_list_sslr?data=',
				'sdSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/sd/_/sdDown_list_sslr?data=',
				'sdlSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/sdl/_/sdlDown_list_sslr?data=',
				'incRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/inc/_/incDown_list_sslr?data=',
				'maSubmission_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/ma/_/maDown_list_sslr?data=',
				'msSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/ms/_/msDown_list_sslr?data=',
				'rfiSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/rfi/_/rfiDown_list_sslr?data=',
				'dcrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/dcr/_/dcrDown_list_sslr?data=',
				'wirSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/wir/_/wirDown_list_sslr?data=',
				'ncrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/ncr/_/ncrDown_list_sslr?data=',
				'noiSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/noi/_/noiDown_list_sslr?data=',
				'rsdlSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/rsdl/_/rsdlDown_list_sslr?data='
			);
		}else{
			$ret = array(
				'view_download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.ViewDownloadableDataAPI/service',
				'download_data' => $this->jogetHost.'jw/web/json/plugin/org.joget.tutorial.DownloadDataListData/service',
				'puRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/pu/_/puDown_list?data=',
				'daSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/da/_/daDown_list?data=',
				'pubcSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/pubc/_/pubcDown_list?data=',
				'lsRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/land/_/lsDown_list?data=',
				'leRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/land/_/leDown_list?data=',
				'liRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/land/_/liDown_list?data=',
				'laForm_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/land/_/laDown_list?data=',
				'rrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/rr/_/rrDown_list?data=',
				'smhRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/smh/_/smhDown_list?data=',
				'saRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/sa/_/saDown_list?data=',
				'rsSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/rs/_/rsDown_list?data=',
				'sdSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/sd/_/sdDown_list?data=',
				'sdlSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/sdl/_/sdlDown_list?data=',
				'incRegister_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/inc/_/incDown_list?data=',
				'maSubmission_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/ma/_/maDown_list?data=',
				'msSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/ms/_/msDown_list?data=',
				'rfiSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/rfi/_/rfiDown_list?data=',
				'dcrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/dcr/_/dcrDown_list?data=',
				'wirSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/wir/_/wirDown_list?data=',
				'ncrSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/ncr/_/ncrDown_list?data=',
				'noiSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/noi/_/noiDown_list?data=',
				'rsdlSubmit_view' => $this->jogetHost.'jw/web/embed/userview/'.$this->constructApp.'/rsdl/_/rsdlDown_list?data='
			);
		}
		
		$this->jogetAppLink = array_merge($this->jogetAppLink, $ret);
	}

	private function loadUrl(){

		if(isset($_SESSION['Project_type']) && $_SESSION['Project_type'] == "CONSTRUCT"){
			if($_SESSION['project_owner'] == 'SSLR2'){
				if($this->constructApp)	{
					$this->getPluginLink();
					$this->loadSSLR2ConstructUrl();
				}
				if($this->financeApp){
					if($this->isDownstream){
						$this->loadPFSSSLR2DownSUrl();
					}else{
						$this->loadPFSSSLR2Url();
					}
				}
				if($this->documentApp)$this->loadDocumentSSLR2Url();
			}else{
				if($this->constructApp )	{
					$this->getPluginLink();
					$this->loadConstructUrl();
				}
				if($this->financeApp) $this->loadPFSUrl();
				if($this->documentApp)$this->loadDocumentUrl();
			}
		}else if(isset($_SESSION['Project_type']) && $_SESSION['Project_type'] == 'ASSET'){
			if($this->assetApp) $this->loadAssetUrl();
			if($this->financeApp) $this->loadPFSAssetUrl();
		}else{
			if($this->fmApp) $this->loadFMUrl();
		}
		
		$this->loadGeneralUrl();
	}

	public function getAdminUserName($app = 'joget'){
		$ret = "";
		if($app == 'joget'){
			$ret = $this->jogetAdminUser;
		}elseif ($app == 'asset') {
			$ret = $this->jogetAssetAdminUser;
		}elseif ($app == 'support') {
			$ret = $this->jogetSupportAdminUser;
		}elseif ($app == 'geoServer') {
			$ret = $this->geoServerAdminUser;
		}
		return $ret;
	}

	public function getAdminUserPassword($app = 'joget'){
		$ret = "";
		if($app == 'joget'){
			$ret = $this->jogetAdminPwd;
		}elseif ($app == 'asset') {
			$ret = $this->jogetAssetAdminPwd;
		}elseif ($app == 'support') {
			$ret = $this->jogetSupportAdminPwd;
		}elseif ($app == 'geoServer') {
			$ret = $this->geoServerAdminPwd;
		}
		return $ret;
	}

	public function setToGlobalJSVariable($varname = 'JOGETLINK'){
		echo "<script>";
		echo "var JOGETHOST = '".$this->jogetHost."';";
		echo "var JOGETASSETHOST = '".$this->jogetAssetHost."';";
		echo "var JOGETSUPPORTHOST = '".$this->jogetSupportHost."';";
		echo "var GEOHOST = '".$this->geoServerHost."';";
		echo "var SYSTEM = '".$this->system."';";
		echo "var IS_DOWNSTREAM = '".$this->isDownstream."';";
		echo "var MAPBOX_TOKEN = '".$this->mapboxToken."';";
		echo "var MAPTILER_TOKEN = '".$this->maptilerToken."';";
		if ($this->jogetAppLink) {
			echo "var ".$varname." = JSON.parse('".json_encode($this->jogetAppLink)."');";
		}
		if($this->constructApp){
			echo "var JOGET_CONSTRUCTAPP = '".$this->constructApp."';";
		}
		if(isset($_SESSION['ui_pref'])){
			echo "var UI_PREF = '".$_SESSION['ui_pref']."';";
		}
		
		echo "</script>";
	}

	public function preloadURL() {
		$this->loadUrl();
		return $this->jogetAppLink;
	}
}
