<?php
//V3
if (session_status() == PHP_SESSION_NONE) session_start();
require dirname(__DIR__).'/../login/include/_include.php';

class ExecDashboard{
    var $db;
    var $email;
    var $password;
    var $firstName;
    var $lastName;
    var $postLoginRole;
    var $userOrg;
    var $projectOwner;
    var $userProj;
    var $projectSummary;
    var $currentDate;
    var $currentYear;
    var $currentMonth;
    var $beforeYear;
    var $beforeMonth;
	var $currPackageUuid;
	var $contractInfo;
    var $fetchProjectBasedId;
    var $rangeSetting;
    var $redVal;
    var $yellowVal;
    var $greenVal;

    function __construct(){
		global $CONN;
        $this->db = $CONN;
        $this->email = $_SESSION['email'];
        $this->password = $_SESSION['password'];
        $this->firstName = $_SESSION['firstname'];
        $this->lastName = $_SESSION['lastname'];
        $this->postLoginRole = 'User';
        $this->userOrg = $_SESSION['user_org'];
        // $this->projectOwner = ($this->userOrg == 'JKR' || $this->userOrg == 'HSSI') ? 'JKR_SABAH' : 'JKR_SARAWAK';
        $this->uiPref = $_SESSION['ui_pref'];

        if($this->userOrg == 'KKR'){
            if($_SESSION['proj_owner_sbh'] == '1' && $_SESSION['proj_owner_swk'] != '1'){
                $this->projectOwner = 'JKR_SABAH';
            }else if($_SESSION['proj_owner_sbh'] != '1' && $_SESSION['proj_owner_swk'] == '1'){
                $this->projectOwner = 'JKR_SARAWAK';
            }
        }else if($this->userOrg == 'JKR'){
            $this->projectOwner = 'JKR_SABAH';
        }else if($this->userOrg == 'HSSI'){
            $this->projectOwner = 'JKR_SABAH';
        }else if($this->userOrg == 'pmc_1b'){
            $this->projectOwner = 'JKR_SABAH';
        }else{
            $this->projectOwner = 'JKR_SARAWAK';
        }

        switch($this->userOrg)
        {
            case "JKR":
            case "HSSI":
                $this->projectOwner = 'JKR_SABAH';
                break;
            case "JKRS":
            case "PLPS":
            $this->projectOwner = 'JKR_SARAWAK';
                break;
            case "KACC":
            case "MRSB":
            case "UTSB":
                $this->projectOwner = 'OBYU';
                break;
        }

        
        if ($this->email == "pbh.sabah@gmail.com") {
            $this->projectOwner = "JKR_SABAH";
        } else if ($this->email == "pbh.sarawak@gmail.com") {
            $this->projectOwner = "JKR_SARAWAK";
        }

        $_SESSION['project_owner_dashboard'] = $this->projectOwner;

        //BECAUSE DIGITAL REPORTING USED ONE MONTH BEFORE
        $this->currentYear = date('Y', strtotime("first day of last month"));
        $this->currentMonth = date('M', strtotime("first day of last month"));

        $this->beforeYear = date('Y', strtotime("-2 month"));
        $this->beforeMonth = date('M', strtotime("-2 month"));

        if (isset($_REQUEST['filterYear']) && $_REQUEST['filterYear'] != "") {
            $this->currentYear = $_REQUEST['filterYear'];
            $this->beforeYear = date('Y', strtotime($this->currentYear.'-'.$_REQUEST['filterMonth']. ' - 1 months'));
        }

        if (isset($_REQUEST['filterMonth']) && $_REQUEST['filterMonth'] != "") {
            $this->currentMonth = $_REQUEST['filterMonth'];
            $this->beforeMonth = date('M', strtotime($this->currentYear.'-'.$this->currentMonth. ' - 1 months'));
        }

        include_once dirname(__FILE__).'/../../Login/app_properties.php';
		global $JOGETDOMAIN, $JOGETIP;
        global $JOGETADMINUSER, $JOGETADMINPWD;
        global $RIHOST;
        global $PROJECTIDNOSBH, $PROJECTIDNOSRWK;

        $this->jogetHost = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $JOGETDOMAIN : $JOGETIP;
		$this->jogetAdminUser = $JOGETADMINUSER;
		$this->jogetAdminPwd = $JOGETADMINPWD;
        $this->riHost = $RIHOST;
        $this->fetchProjectBasedId = ($this->projectOwner == "JKR_SABAH") ? $PROJECTIDNOSBH : $PROJECTIDNOSRWK;
	}

    function buildTree(array $elements, $parentId = 0) {

        $branch = array();
        foreach ($elements as $element) {
            if ($element['parent_project_id_number'] == $parentId) {
                $children = $this->buildTree($elements, $element['project_id_number']);
                if ($children) {
                    $element['children'] = $children;
                }
                $branch[] = $element;
            }
        }
        return $branch;
    }

    function fetchProject(){
        global $SYSTEM, $PROJECTIDNOSBH, $PROJECTIDNOSRWK, $PRODUCTION_FLAG;
        if ($SYSTEM == 'OBYU'){
            $sql = "SELECT * FROM projects where owner_org_id=:0 AND status = 'active' ORDER BY project_name ASC";
            $fetchProject = $this->db->fetchAll($sql, array($this->userOrg));
            return $fetchProject;
        }else{

            // hide hq package for DR since this package only want to register correspondence & document
            $exclude_packageUuid = '';
            if($PRODUCTION_FLAG){
                $exclude_packageUuid = " AND p.project_id_number <> 397 ";
            }else{
                $exclude_packageUuid = " AND p.project_id_number <> 321 ";
            }
            
            if ($this->userOrg == 'KKR') {
                $sql = "SELECT * FROM projects p where (p.project_id_number IN (:0 , :1) OR p.parent_project_id_number IN (:2 , :3)) AND p.status = 'active' $exclude_packageUuid ORDER BY p.project_name ASC;";
                $fetchProject = $this->db->fetchAll($sql, array ($PROJECTIDNOSBH, $PROJECTIDNOSRWK, $PROJECTIDNOSBH, $PROJECTIDNOSRWK));
                return $fetchProject;
            }else{
                $sql = "SELECT * FROM projects p where p.project_owner=:0 AND (p.project_id_number =:1 OR p.parent_project_id_number =:2) AND p.status = 'active' $exclude_packageUuid ORDER BY p.project_name ASC";
                $fetchProject = $this->db->fetchAll($sql, array($this->projectOwner, $this->fetchProjectBasedId, $this->fetchProjectBasedId));
                return $fetchProject;
            }

        }

    }

    function fetchRange(){
        $sql = "SELECT * FROM range_setting p where p.project_owner=:0";
        $fetchRange = $this->db->fetchAll($sql, array($this->projectOwner));
        return $fetchRange;
    }

    function fetchProjectSummary(array $elements){
        $ret = array();
        foreach ($elements as $proj) {
            if(isset($proj['project_owner']) && $proj['project_owner'] == "JKR_SABAH"){
                $fetchArr = array(
                    $this->db->quote($proj['project_id'])
                );
    
                $allSummary = $this->db->fetchAll("select * from project_progress_summary where pps_projectid in (".implode(',', $fetchArr).") order by pps_projectid, pps_month_year asc");
                
                $monthYear = $finEarly = $finPlan = $finActual = $phyEarly = $phyPlan = $phyAct = array();
                foreach ($allSummary as $sum) {
                    $projID = $sum['pps_projectid'];
                    $ret[$projID]["monthYear"][] = $sum['pps_month_year'];  
                    $ret[$projID]["finEarly"][] = number_format($sum['pps_financial_early_cm'],2);
                    $ret[$projID]["finAct"][] = number_format($sum['pps_financial_late_cm'],2);
                    $ret[$projID]["phyPlan"][] = number_format($sum['pps_physical_early'],2); //plan - estimate
                    $ret[$projID]["phyAct"][] = number_format($sum['pps_physical_late'],2); //actual - yg kita buat
                    $ret[$projID]['raw'][] =  $sum;

                    $monthYear = strtotime($sum['pps_month_year']);
                    $year = date("Y", $monthYear);
                    $month = date("M", $monthYear);
                    // for current month 
                    $ret[$projID]['card'][$year][$month]['phyPlan'] =  number_format($sum['pps_physical_early'],2); //plan - estimate
                    $ret[$projID]['card'][$year][$month]['phyAct'] =  number_format($sum['pps_physical_late'],2); //actual - yg kita buat
                    $ret[$projID]['card'][$year][$month]['finEarly'] =  number_format($sum['pps_financial_early_cm'],2);
                    $ret[$projID]['card'][$year][$month]['finAct'] = number_format($sum['pps_financial_late_cm'],2);
                    
                }
            }
            else{
                $fetchArr = array(
                    $this->db->quote($proj['project_id'])
                );
    
                $allSummary = $this->db->fetchAll("select * from project_progress_summary where pps_projectid in (".implode(',', $fetchArr).") order by pps_projectid, pps_month_year asc");

                $monthYear = $finEarly = $finPlan = $finActual = $phyEarly = $phyPlan = $phyAct = array();
    
                foreach ($allSummary as $sum) {
                    $projID = $sum['pps_projectid'];
                    $ret[$projID]["monthYear"][] = $sum['pps_month_year'];  
                    $ret[$projID]["finEarly"][] = number_format($sum['pps_financial_early_cm'],2);
                    $ret[$projID]["finAct"][] = number_format($sum['pps_financial_late_cm'],2);
                    $ret[$projID]["phyPlan"][] = number_format($sum['pps_physical_early'],2); //plan - estimate
                    $ret[$projID]["phyAct"][] = number_format($sum['pps_physical_late'],2); //actual - yg kita buat
                    $ret[$projID]['raw'][] =  $sum;

                    $monthYear = strtotime($sum['pps_month_year']);
                    $year = date("Y", $monthYear);
                    $month = date("M", $monthYear);
                    // for current month 
                    $ret[$projID]['card'][$year][$month]['phyPlan'] =  number_format($sum['pps_physical_early'],2); //plan - estimate
                    $ret[$projID]['card'][$year][$month]['phyAct'] =  number_format($sum['pps_physical_late'],2); //actual - yg kita buat
                    $ret[$projID]['card'][$year][$month]['finEarly'] =  number_format($sum['pps_financial_early_cm'],2);
                    $ret[$projID]['card'][$year][$month]['finAct'] = number_format($sum['pps_financial_late_cm'],2);
                }
            }
        }

		return $ret;
	}

    function getCurrentProgress(array $elements){
        $ret = array();
        $cardVal = array();
        $cardValBef = array();
        foreach ($elements as $key => $val) {
            $phyActN = 0;
            $phyPlanN = 0;
            $phyActB = 0;
            $phyPlanB = 0;

            $cardVal[$key] = (isset($val['card'][$this->currentYear][$this->currentMonth]) && $val['card'][$this->currentYear][$this->currentMonth]) ? $val['card'][$this->currentYear][$this->currentMonth] : [];
            $phyActN = (isset($cardVal[$key]['phyAct']) && $cardVal[$key]['phyAct']) ? $cardVal[$key]['phyAct'] : 0;
            $phyPlanN = (isset($cardVal[$key]['phyPlan']) && $cardVal[$key]['phyPlan']) ? $cardVal[$key]['phyPlan'] : 0;

            $cardVal[$key]['varPhyCurr'] = (float) ($phyActN - $phyPlanN);

            $cardValBef[$key] = (isset($val['card'][$this->beforeYear][$this->beforeMonth]) && $val['card'][$this->beforeYear][$this->beforeMonth]) ? $val['card'][$this->beforeYear][$this->beforeMonth] : [];
            $phyActB = (isset($cardValBef[$key]['phyAct']) && $cardValBef[$key]['phyAct']) ? $cardValBef[$key]['phyAct'] : 0;
            $phyPlanB = (isset($cardValBef[$key]['phyPlan']) && $cardValBef[$key]['phyPlan']) ? $cardValBef[$key]['phyPlan'] : 0;
            
            $cardValBef[$key]['varPhyBef'] = (float) $phyActB - $phyPlanB;

            if($phyActN == 0.00 && ($phyActN <= $phyActB)){
                $cardVal[$key]['varPhyCurr'] = 'N/A';

                if($phyActB == 0.00){
                    $cardValBef[$key]['varPhyBef'] = 'N/A';
                }
            }

        }

        $ret = array(
            "now" => $cardVal,
            "before" => $cardValBef
        );

        return $ret;
    }

    function fetchSorName(){
        global $SYSTEM;
        $ret = array();

        if($SYSTEM == 'OBYU'){
            $orgUsed = $this->userOrg;
        }else{
            $orgUsed = ($this->projectOwner == 'JKR_SABAH') ? 'JKR' : 'JKRS';
        }

        if($orgUsed == 'JKR'){
            $sql = "SELECT * FROM users u LEFT JOIN pro_usr_rel p ON p.Usr_ID = u.user_id where u.user_org=:0 AND p.Pro_Role = 'Project Manager' AND u.user_designation = 'SOR'";
        }else{
            $sql = "SELECT * FROM users u LEFT JOIN pro_usr_rel p ON p.Usr_ID = u.user_id where u.user_org=:0 AND p.Pro_Role = 'Project Manager'";
        }
        $fetchPM = $this->db->fetchAll($sql, array($orgUsed));

        foreach ($fetchPM as $v) {
            $ret[$v['Pro_ID']] = $v['user_firstname'] . ' ' . $v['user_lastname'];
        }

        return $ret;
    }

    function checkUserProjManager(){
        global $SYSTEM;
        $ret = array();

        if($SYSTEM == 'OBYU'){
            $sql = "SELECT * FROM users u left join pro_usr_rel pur on u.user_ID = pur.Usr_ID left join projects p on p.project_id_number=pur.Pro_ID where u.user_email=:0 AND p.status = 'active' AND p.project_owner=:1  ORDER BY p.project_name ASC";
            $fetchProj = $this->db->fetchAll($sql, array($this->email, $this->projectOwner));
        }else{
            $sql = "SELECT * FROM users u left join pro_usr_rel pur on u.user_ID = pur.Usr_ID left join projects p on p.project_id_number=pur.Pro_ID where u.user_email=:0 AND p.status = 'active' AND p.project_owner=:1 AND (p.project_id_number =:2 OR p.parent_project_id_number =:3) ORDER BY p.project_name ASC";
            $fetchProj = $this->db->fetchAll($sql, array($this->email, $this->projectOwner, $this->fetchProjectBasedId, $this->fetchProjectBasedId));
        }

        $_SESSION['is_proj_manager'] = false;
        foreach ($fetchProj as $proj) {
            if($proj['Pro_Role'] == 'Project Manager'){
                $_SESSION['is_proj_manager'] = true;
            }
        }
    }

    function fetchContractorName(){
        $ret = array();

        $sql = "SELECT * FROM organization";
        $fetchContractor = $this->db->fetchAll($sql);

        foreach ($fetchContractor as $v) {
            $ret[$v['orgID']] = $v['orgName'];
        }

        return $ret;
    }

    function id_compare($a, $b){
	    $t1 = $a['contract_id'];
	    $t2 = $b['contract_id'];
	    return $t1 - $t2;
	} 

    function fetchContractDetails(){
        $ret = array();

		$url = $this->jogetHost."jw/web/json/data/list/pfs/digRepContractList?d-7065397-fn_status=complete";
        $resContract = $this->jogetCURL($url);
        if (isset($resContract['data'])) {
            $tempArr = $resContract['data'];
            $dataArr = array();
            foreach ($tempArr as $val) {
                if ($val['archive'] != 'true') {
                    $dataArr[] = $val;
                }
            }

            // sort by id and take only latest one
            usort($dataArr, array($this, 'id_compare'));    

            if($dataArr){
                foreach ($dataArr as $co) {
                    $ret[$co['project_id']][$co['section']] = $co;
                }

                $dataSection = $ret;
                foreach ($dataSection as $key => $data) {
                    foreach ($data as $key1 => $data1) {
                        if(isset($ret[$key]['originalAmount'])){
                            $ret[$key]['originalAmount'] = $ret[$key]['originalAmount'] + (float) $data1['original_amount'];
                        }
                        else{
                            $ret[$key]['originalAmount'] = (float) $data1['original_amount'];
                        }
                    }
                    
                }
            }
        }

        return $ret;
        
    }

    function fetchContractDetailsOBYU(){
        $ret = array();

        if($this->userOrg == 'KACC'){
            $url = $this->jogetHost."jw/web/json/data/list/pfs/digRepContractListKacc?";
        }
        else if($this->userOrg == 'MRSB'){
            $url = $this->jogetHost."jw/web/json/data/list/pfs/digRepContractListMrsb?";
        }

        $resContract = $this->jogetCURL($url);
        if (isset($resContract['data'])) {
            $tempArr = $resContract['data'];
            $dataArr = array();
            if($this->userOrg == 'KACC'){
                foreach ($tempArr as $val) {
                    if ($val['archive'] != 'true') {
                        $dataArr[] = $val;
                    }
                }
            }
            else{
                $dataArr = $tempArr;
            }

            if($this->userOrg == 'KACC'){
                // sort by id and take only latest one
                usort($dataArr, array($this, 'id_compare'));  
            }

            if($dataArr){
                if($this->userOrg == 'KACC'){
                    foreach ($dataArr as $co) {
                        $ret[$co['project_id']][$co['section']] = $co;
                    }

                    $dataSection = $ret;
                    foreach ($dataSection as $key => $data) {
                        foreach ($data as $key1 => $data1) {

                            if($data1['original_amount']){
                                $data1['original_amount'] = str_replace(",", "", $data1['original_amount']);
                                if(isset($ret[$key]['originalAmount'])){
                                    $ret[$key]['originalAmount'] = $ret[$key]['originalAmount'] + (float) $data1['original_amount'];
                                }
                                else{
                                    $ret[$key]['originalAmount'] = (float) $data1['original_amount'];
                                }
                            }

                        }
                        
                    }
                }
                else{

                    foreach ($dataArr as $co) {
                        if($co['original_contract_sum']){
                            $co['original_contract_sum'] = str_replace(",", "", $co['original_contract_sum']);
                            if(isset($ret[$co['project_id']]['originalAmount'])){
                                $ret[$co['project_id']]['originalAmount'] = $ret[$co['project_id']]['originalAmount'] + (float) $co['original_contract_sum'];
                            }
                            else{
                                $ret[$co['project_id']]['originalAmount'] = (float) $co['original_contract_sum'];
                            }
                        }
                    }

                }
                
            }
        }

        return $ret;
        
    }

    function fetchProjectProgressForParent(){
        $ret = array();

		if($this->projectOwner == 'OBYU'){
            $url = $this->jogetHost."jw/web/json/data/list/conOp/list_ppuDashboard?"; 
        }else{
            $url = $this->jogetHost."jw/web/json/data/list/ri_construct/list_ppuForm?";
        }
        $res = $this->jogetCURL($url);
        if (isset($res['data'])) {
            usort($res['data'], function($a, $b) {
                $aU = $a['date_report'];
                $bU = $b['date_report'];

                if ($aU == $bU) {
                    return strtotime($a['dateCreated']) - strtotime($b['dateCreated']);
                }

                return strtotime($aU) - strtotime($bU);
            });

            $dataArr = $res['data'];

            if($dataArr){
                foreach ($dataArr as $projProg) {
                    // based on month and year
                    $dateCreated = strtotime($projProg['date_report']);
                    $year = date("Y", $dateCreated);
                    $month = date("M", $dateCreated);

                    if (isset($projProg['parent_project']) &&  isset($projProg['parent_project'])== 'Yes'){
                        $ret[$projProg['package_id']][$year][$month] = $projProg;
                    }
                }

            }
        }
        return $ret;
    }

    function fetchDaysDelay(){
        $ret = array();

		if($this->projectOwner == 'OBYU'){
            $url = $this->jogetHost."jw/web/json/data/list/conOp/list_ppuDashboard?"; 
        }else{
            $url = $this->jogetHost."jw/web/json/data/list/ri_construct/list_ppuForm?";
        }
        
        $res = $this->jogetCURL($url);

        if (isset($res['data'])) {
            usort($res['data'], function($a, $b) {
                $aU = $a['date_report'];
                $bU = $b['date_report'];

                if ($aU == $bU) {
                    return strtotime($a['dateCreated']) - strtotime($b['dateCreated']);
                }

                return strtotime($aU) - strtotime($bU);
            });

            $dataArr = $res['data'];

            if($dataArr){
                foreach ($dataArr as $projProg) {
                    // based on month and year
                    $dateCreated = strtotime($projProg['date_report']);
                    $year = date("Y", $dateCreated);
                    $month = date("M", $dateCreated);
                    $daysDelay = $projProg['no_days_delay'];

                    $ret[$projProg['package_id']][$year][$month]['no_days_delay'] = $daysDelay;
                }

            }
        }
        return $ret;
    }

    function fetchOverallProgress(){
        global $PROJECTIDNOSBH, $CONN;
        $getSql = "SELECT CONCAT(project_id_number, '_', project_id, '_', project_id_number) as package_uuid FROM projects WHERE project_id_number=:0";
        $getProjeId = $CONN->fetchOne($getSql, array($PROJECTIDNOSBH));

        $ret = array();
        $url = $this->jogetHost."jw/web/json/data/list/ri_construct/list_opuCardForm?d-3341121-fn_package_uuid=".$getProjeId;

        $res = $this->jogetCURL($url);

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

    function getDivisionHTML(){

        $this->userProj = $this->fetchProject();
        $this->projectSummary = $this->fetchProjectSummary($this->userProj);
        
        $variance = $this->getCurrentProgress($this->projectSummary);
        $sorNameArr = $this->fetchSorName();
        $checkUserProjManager = $this->checkUserProjManager();
        $contractorNameArr = $this->fetchContractorName();

        if($this->projectOwner == 'OBYU'){
            $contractArr = $this->fetchContractDetailsOBYU();
        }
        else{
            $contractArr = $this->fetchContractDetails();
            $overallProgressArr = $this->fetchOverallProgress();
        }

        $projProgressArr = $this->fetchProjectProgressForParent();
        $projProgressDayDelay = $this->fetchDaysDelay();
        $rangeSetting = $this->fetchRange();

        $projectPackageTree = $this->buildTree($this->userProj);
        
        if($this->projectOwner != 'OBYU'){
            $pmSet = json_decode(file_get_contents(dirname(__DIR__)."/../BackEnd/pmSabahSet.json"), true);
            $contractorSet = json_decode(file_get_contents(dirname(__DIR__)."/../BackEnd/contractorSabahSet.json"), true);
            $pakageSet = json_decode(file_get_contents(dirname(__DIR__)."/../BackEnd/packageNameSabahSet.json"), true);
        }
        
        $divisionHTML ='';
        $progressBarHTML = '';
        $filterHTML ='';
        $cardPackage ='';
        $cardProj ='';
        $valDaysDelay = '';
        
        $countAll = 0;
        $countComplete = 0;
        $countTrack = 0;
        $countAlarm = 0;
        $countDelay = 0;
        $countNA = 0;

        $countCompletePercent = 0;
        $countTrackPercent = 0;
        $countAlarmPercent = 0;
        $countDelayPercent = 0;
        $countNAPercent = 0;

        if(empty($rangeSetting)){
            $redVal = [-100, -5];
            $yellowVal = [-4, -1];
            $greenVal = [0, 100];
        }else{
            foreach ($rangeSetting as $key){
                if($key['project_owner']){
                    $redVal = ($key['red']) ? explode(',',$key['red']) : [-100, -5];
                    $yellowVal = ($key['yellow']) ? explode(',',$key['yellow']) : [-4, -1];
                    $greenVal = ($key['green']) ? explode(',',$key['green']) : [0, 100];
                }
            }
        }
        
        if($this->uiPref == 'ri_v3'){
            $icnPrefix = '../../';
            $faviconPrefix = '../';
        }else{
            $icnPrefix = '../../../';
            $faviconPrefix = '../../';
        }
        
        if($this->userOrg == 'KKR'){
                if(($_SESSION['proj_owner_sbh'] == "1") && ($_SESSION['proj_owner_swk'] == "1")){
                    $divisionHTML .= '<div class = "dashboardBodyExec">';
                    foreach ($projectPackageTree as $key){
                        if ($key['project_owner']  == 'JKR_SARAWAK'){
                            $projectIcon = $icnPrefix.$key['icon_url'];
                            $imgUrl = (file_exists($projectIcon)) ? $projectIcon : $faviconPrefix.'favicon.ico';
                            $projectID = (isset($key['project_id'])) ? $key['project_id'] : '';
                            $currPackageUuid = (isset($key['project_id']) && isset($key['project_id_number'])) ? $key['project_id_number']."_". $key['project_id']. "_" . $key['project_id_number']: ""; 
                            $projectStartDate = (isset($key['start_date'])) ? $key['start_date'] : 'N/A';
                            $projectEndDate = (isset($key['end_date'])) ? $key['end_date'] : 'N/A';
                            $projectDuration = (isset($key['duration'])) ? $key['duration'] : 'N/A';
                            $projectName = (isset($key['project_name'])) ? $key['project_name'] : 'N/A';
                            $projectWPCID = (isset($key['project_id'])) ? $key['project_id'] : '';
                            $totProjAmount = 0;
                            $startDate = '';
                            $endDate = '';
        
                            $physical_actual_parent = 0;
                            $physical_schedule_parent = 0;
                            $physical_schedule_parent = 0;
                            $day_delay_parent = 0;
        
                            $cardProj='';
                            if(isset($key['children'])){
                                foreach($key['children'] as $children){
                                    $projectContractAmount = (isset($contractArr[$children['project_id']]['originalAmount'])) ? $contractArr[$children['project_id']]['originalAmount'] : 0;
                                    $totProjAmount = $totProjAmount + $projectContractAmount;
                                    
                                    if (!$startDate){
                                        $startDate = $children['start_date'];
                                    }else if($children['start_date'] == $startDate){
                                        $startDate = $startDate;
                                    }else if($children['start_date'] < $startDate){
                                        $startDate = $children['start_date'];
                                    }else if($children['start_date'] > $startDate){
                                        $startDate = $startDate;
                                    }
        
                                    if (!$endDate){
                                        $endDate = $children['end_date'];
                                    }else if($children['end_date'] == $endDate){
                                        $endDate = $endDate;
                                    }else if($children['end_date'] > $endDate){
                                        $endDate = $children['end_date'];
                                    }else if($children['end_date'] < $endDate){
                                        $endDate = $endDate;
                                    }
                                }
                                $contractAmt = number_format($totProjAmount, 2, ".", ",");
                            }else{
                                $contractAmt = 0.00;
                            }
                        
                            if(isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_actual_parent'])){
                                $physical_actual_parent = (isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_actual_parent'])) ? $projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_actual_parent'] : 0;
                            }
                            else{
                                $physical_actual_parent = "N/A";
                            }
        
                            if(isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_schedule_parent'])){
                                $physical_schedule_parent = (isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_schedule_parent'])) ? $projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_schedule_parent'] : 0;
                            }
                            else{
                                $physical_schedule_parent = "N/A";
                            }
                            if(isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['day_delay_parent'])){
                                $day_delay_parent = (isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['day_delay_parent'])) ? $projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['day_delay_parent'].' day(s) delay' : 0;
                            }else{
                                $day_delay_parent = "N/A";
                            }
        
                            if($physical_actual_parent == "N/A" || $physical_schedule_parent == "N/A"){
                                $varEachNow = "N/A";
                            }
                            else{
                                $varEachNow = (float) $physical_actual_parent - (float) $physical_schedule_parent;
                            }
        
                            if($varEachNow == "N/A" ){
                                $progressProj = 'notAvailable';
                                $explain = '';
                                $trend = '<i class="fa-solid fa-ban"></i>';
                            }else if($varEachNow <= $redVal['1']){
                                $progressProj = 'delay';
                                $explain = 'Sick Project';
                                $trend = '<i class="fa-solid fa-arrow-trend-down delay" style="font-weight: bold; color: red;"></i>';
                                $varEachNow = $varEachNow . '%';
                            }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                $progressProj = 'alarming';
                                $explain = 'Delayed Project';
                                $trend = '<i class="fa-solid fa-diamond-exclamation" style="font-weight: bold; color: #ffc107;"></i>';
                                $varEachNow = $varEachNow . '%';
                            }else if($varEachNow > $yellowVal['1']){
                                $progressProj = 'onTrack';
                                $explain = 'On Schedule';
                                $trend = '<i class="fa-solid fa-arrow-trend-up" style="font-weight: bold; color: #4caf50;"></i>';
                                $varEachNow = $varEachNow . '%';
                            }
        
                            $divisionHTML .= '
                            <div class="division">
                                
                                <div class="row-container" style="padding: .8rem 0; font-size: 1rem; font-weight: bold;">'.$key['project_name'].'
                                        <div class="projImage" >
                                            <img src="'.$imgUrl.'"/>
                                        </div>
                                        <div class="projName" >
                                            <!--<div class="name">'.$key['project_name'].'</div>-->
                                            <div clas="amount">
                                                <i class="fa-solid fa-circle-dollar"></i>
                                                <span class="column-two one-line amount">RM'.$contractAmt.'</span>
                                            </div>
                                        </div>
                                        <div class="ProjInfo" >
                                            <div class="col">
                                                <div class="row">
                                                    <div class="column-label small" title="Start Date"><i class="fa-light fa-calendar-days" style="margin-right: 5px"></i>Start Date</div>
                                                </div>
                                                <div class="row">
                                                    <span class="column-two progress">'.date("d M Y", strtotime($startDate)).'</span>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="row">
                                                    <div class="column-label small" title="End Date"><i class="fa-light fa-calendar-days" style="margin-right: 5px"></i>End Date</div>
                                                </div>
                                                <div class="row">
                                                    <span class="column-two progress">'.date("d M Y", strtotime($endDate)).'</span>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="row">
                                                    <div class="column-label small" title="Status"><i class="fa-light fa-bars-progress" style="margin-right: 5px"></i>Project Status</div>
                                                </div>
                                                <div class="row">
                                                    <span class="column-two indicator-value">'.$trend.'   '.$varEachNow.' '.$explain.'</span>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="row">
                                                    <div class="column-label small" title="Days Delay"><i class="fa-light fa-calendar-clock" style="margin-right: 5px"></i>Days Delay</div>
                                                </div>
                                                <div class="row">
                                                    <span class="column-two indicator-value">'.$trend.'   '.$day_delay_parent.'</span>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                <div class="card-container mix-wrapper '.$progressProj.'">';
                                    if(isset($key['children'])){
                                        if($key['project_type'] == 'ASSET') continue;
                                            $cardPackage ='';
                                            foreach($key['children'] as $children){
                                                if(isset($children)){
                                                    //MR CHANG asked to skip this package
                                                    if($children['project_id'] == 'PBHS_Redline') continue;
        
                                                    $projectIcon = $icnPrefix.$children['icon_url'];
        
                                                    $imgUrl = (file_exists($projectIcon)) ? $projectIcon : $faviconPrefix.'favicon.ico';
                                                    $projectID = (isset($children['project_id'])) ? $children['project_id'] : '';
                                                    $currPackageUuid = (isset($children['project_id']) && isset($children['project_id_number'])) ? $children['project_id_number']."_". $children['project_id']. "_" . $children['project_id_number']: ""; 
                                                    
                                                    
                                                    if(isset($pakageSet[$children['project_id']])){
                                                        $projectName = (isset($pakageSet[$children['project_id']])) ? $pakageSet[$children['project_id']] : 'N/A';
                                                    }else{
                                                        $projectName = (isset($children['project_name'])) ? $children['project_name'] : 'N/A';
                                                    }
        
                                                    $projectWPCID = (isset($children['project_wpc_id'])) ? $children['project_wpc_id'] : '';
                                                    $projectStartDate = (isset($children['start_date'])) ? $children['start_date'] : 'N/A';
                                                    $projectDuration = (isset($children['duration'])) ? $children['duration'] : 'N/A';

                                                    $projectPM = (isset($sorNameArr[$children['project_id_number']])) ? $sorNameArr[$children['project_id_number']] : 'N/A';
                                                                                                        
                                                    if(isset($contractorSet[$children['project_id']])){
                                                        $projectContractor = (isset($contractorSet[$children['project_id']])) ? $contractorSet[$children['project_id']] : 'N/A';
                                                    }
                                                    else{
                                                        $projectContractor = (isset($contractorNameArr[$children['contractor_org_id']])) ? $contractorNameArr[$children['contractor_org_id']] : 'N/A';
                                                    }
                                                
                                                    $projectContractAmount = (isset($contractArr[$children['project_id']]['originalAmount'])) ? $contractArr[$children['project_id']]['originalAmount'] : 0;
                                                    $contractAmt = number_format($projectContractAmount, 2, ".", ",");
        
                                                    if(isset($variance['now'][$children['project_id']]['phyAct'])){
                                                        $phyActNow = (isset($variance['now'][$children['project_id']]['phyAct'])) ? number_format($variance['now'][$children['project_id']]['phyAct'], 2) : 0;
                                                    }else{
                                                        $phyActNow = 0;
                                                    }
        
                                                    if(isset($variance['now'][$children['project_id']]['varPhyCurr']) && $variance['now'][$children['project_id']]['varPhyCurr'] === 'N/A'){
                                                        $varEachNow = "N/A";
                                                    }
                                                    else{
                                                        $varEachNow = (isset($variance['now'][$children['project_id']]['varPhyCurr'])) ? number_format($variance['now'][$children['project_id']]['varPhyCurr'], 2) : "N/A";
                                                    }
        
                                                    if(isset($variance['before'][$children['project_id']]['phyAct'])){
                                                        $phyActBef = (isset($variance['before'][$children['project_id']]['phyAct'])) ? number_format($variance['before'][$children['project_id']]['phyAct'], 2) : 0;
                                                    }else{
                                                        $phyActBef = 0;
                                                    }
        
                                                    if(isset($variance['before'][$children['project_id']]['varPhyBef']) && $variance['before'][$children['project_id']]['varPhyBef'] === "N/A"){
                                                        $varEachBef = "N/A";
                                                    }
                                                    else{
                                                        $varEachBef = (isset($variance['before'][$children['project_id']]['varPhyBef'])) ? number_format($variance['before'][$children['project_id']]['varPhyBef'], 2) : "N/A";
                                                    }
        
                                                    $pmName = ($key['project_owner'] == "JKR_SABAH") ? 'SOR' : 'PM';
        
                                                    if ($key['project_owner'] == 'JKR_SARAWAK'){
                                                        if($varEachNow == 0 && $phyActNow == 100.00){
                                                            $progress = 'completed';
                                                            $explain = 'Completed';
                                                            $countComplete = $countComplete +1;
                                                            $varEachNow = "";
                                                        }else if($varEachNow == "N/A" ){
                                                            $progress = 'notAvailable';
                                                            $explain = 'Not Available';
                                                            $countNA = $countNA +1;
                                                        }else if($varEachNow <= $redVal['1']){
                                                            $progress = 'delay';
                                                            $explain = 'Sick Project';
                                                            $countDelay = $countDelay +1;
                                                        }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                            $progress = 'alarming';
                                                            $explain = 'Delayed Project';
                                                            $countAlarm = $countAlarm +1;
                                                        }else if($varEachNow > $yellowVal['1']){
                                                            $progress = 'onTrack';
                                                            $explain = 'On Schedule';
                                                            $countTrack = $countTrack +1;
                                                        }
                                                        
                                                        if($varEachBef == 0 && $phyActBef == 100.00){
                                                            $progressBef = 'completed';
                                                            $explainBef = 'Completed';
                                                        }else if($varEachBef <= $redVal['1']){
                                                            $progressBef = 'delay';
                                                            $explainBef = 'Sick Project';
                                                        }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                            $progressBef = 'alarming';
                                                            $explainBef = 'Delay Project';
                                                        }else if($varEachBef > $yellowVal['1']){
                                                            $progressBef = 'onTrack';
                                                            $explainBef = 'On Schedule';
                                                        }
                                                    }
        
                                                    $countAll = $countAll +1;
                                                    $per =( $explain == 'Completed')?"" :"% ";
                                                    $cardPackage .= '
                                                        <div class="card cardProjSearch mix package '.$progress.'" data-name="'.$projectID.'" data-pname="'.$projectName.'" data-start-date="'.$projectStartDate.'" data-contract-amount="'.$projectContractAmount.'" data-package_uuid="'.$currPackageUuid.'" data-project_owner="'.$key['project_owner'].'" data-package_id="'.$projectID.'" data-user_org="'.$this->userOrg.'">
                                                            <div class="column-one">
                                                                <img src="'.$imgUrl.'"/>
                                                                <div class="title"><div class="text-ellipsis">'.$projectWPCID.'</div></div>
                                                                <div class="content">
                                                                    <div class="row height bold"><span class="description">'.$projectName.'</span></div>
                                                                    <div class="row column noBottom">
                                                                        <div class="column-one">'.$pmName.'</div>
                                                                        <span class="column-two clamp-text">'.$projectPM.'</span>
                                                                    </div>
                                                                    <div class="row column">
                                                                        <div class="column-one">Contractor</div>
                                                                        <span class="column-two one-line">'.$projectContractor.'</span>
                                                                    </div>
                                                                    <div class="row column align-center mobile bold">
                                                                        <div class="column-one small"><i class="fa-solid fa-circle-dollar"></i></div>
                                                                        <span class="column-two one-line amount">RM '.$contractAmt.' </span>
                                                                    </div>
                                                                    <div class="row column align-center mobile bold">
                                                                        <div class="column-one small"><i class="fa-solid fa-clock-seven"></i></i></div>
                                                                        <span class="column-two progress">'.$projectDuration.' Days</span>
                                                                    </div>
                                                                </div>
                                                                <div class="footer '.$progress.'">
                                                                    <div><i class="fa-solid fa-circle-info"></i>
                                                                        <div class="indicator-container">
                                                                            <span class="indicator-value">'.$varEachNow.$per.$explain.'</span>
                                                                            <span class="indicator-value-previous">'.$varEachBef.'% from previous month</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="column-two"></div>
                                                        </div>
                                                    ';
                                                }
                                            }
                                            $divisionHTML .= " $cardPackage";
                                    }
                                    $divisionHTML .= '
                                </div>
                            </div>';
                        }else{
                            if(isset($key['children'])){
                                if($key['project_type'] == 'ASSET') continue;
                                $divisionHTML .= '
                                    <div class="division '.$key['project_id'].'">
                                        <div class="row-container" style="padding: .8rem 0; font-size: 1rem; font-weight: bold; align-items: center"">'.$key['project_name'].'
                                            <select class="select-projectphase" data-projectid="'.$key['project_id'].'">
                                                <option value="all">All</option>
                                                <option value="1A">1A</option>
                                                <option value="1B">1B</option>
                                            </select>
                                        </div>
                                        
                                        <div class="card-container mix-wrapper">';
                                        $cardPackage ='';
                                        foreach($key['children'] as $children){
                                            if(isset($children)){
                                                //MR CHANG asked to skip this packag;
                                                if($children['project_id'] == 'PBHS_Redline') continue;
                
                                                $projectIcon = $icnPrefix.$children['icon_url'];
                                                $imgUrl = (file_exists($projectIcon)) ? $projectIcon : $faviconPrefix.'favicon.ico';
                                                $projectID = (isset($children['project_id'])) ? $children['project_id'] : '';
                                                $currPackageUuid = (isset($children['project_id']) && isset($children['project_id_number'])) ? $children['project_id_number']."_". $children['project_id']. "_" . $children['project_id_number']: ""; 
                                                $projectWPCID = (isset($children['project_wpc_id'])) ? $children['project_wpc_id'] : '';
                                                $projectStartDate = (isset($children['start_date'])) ? $children['start_date'] : 'N/A';
                                                $projectDuration = (isset($children['duration'])) ? $children['duration'] : 'N/A';
                                                $projectPhase = (isset($children['project_phase'])) ? $children['project_phase'] : '1A';
                                                
                                                if(isset($pakageSet[$children['project_id']])){
                                                    $projectName = (isset($pakageSet[$children['project_id']])) ? $pakageSet[$children['project_id']] : 'N/A';
                                                }else{
                                                    $projectName = (isset($children['project_name'])) ? $children['project_name'] : 'N/A';
                                                }
                                                
                                                $projectPM = (isset($sorNameArr[$children['project_id_number']])) ? $sorNameArr[$children['project_id_number']] : 'N/A';
                                                
                                                if(isset($contractorSet[$children['project_id']])){
                                                    $projectContractor = (isset($contractorSet[$children['project_id']])) ? $contractorSet[$children['project_id']] : 'N/A';
                                                }
                                                else{
                                                    $projectContractor = (isset($contractorNameArr[$children['contractor_org_id']])) ? $contractorNameArr[$children['contractor_org_id']] : 'N/A';
                                                }
                                            
                                                $projectContractAmount = (isset($contractArr[$children['project_id']]['originalAmount'])) ? $contractArr[$children['project_id']]['originalAmount'] : 0;
                                                $contractAmt = number_format($projectContractAmount, 2, ".", ",");
                
                                                if(isset($variance['now'][$children['project_id']]['phyAct'])){
                                                    $phyActNow = (isset($variance['now'][$children['project_id']]['phyAct'])) ? number_format($variance['now'][$children['project_id']]['phyAct'], 2) : 0;
                                                }else{
                                                    $phyActNow =0; 
                                                }
                
                                                if(isset($variance['now'][$children['project_id']]['varPhyCurr']) && $variance['now'][$children['project_id']]['varPhyCurr'] === 'N/A'){
                                                    $varEachNow = "N/A";
                                                }
                                                else{
                                                    $varEachNow = (isset($variance['now'][$children['project_id']]['varPhyCurr'])) ? number_format($variance['now'][$children['project_id']]['varPhyCurr'], 2) : "N/A";
                                                }
                
                                                if(isset($variance['before'][$children['project_id']]['phyAct'])){
                                                    $phyActBef = (isset($variance['before'][$children['project_id']]['phyAct'])) ? number_format($variance['before'][$children['project_id']]['phyAct'], 2) : 0;
                                                }else{
                                                    $phyActBef = 0;
                                                }
                
                                                if(isset($variance['before'][$children['project_id']]['varPhyBef']) && $variance['before'][$children['project_id']]['varPhyBef'] === "N/A"){
                                                    $varEachBef = "N/A";
                                                }
                                                else{
                                                    $varEachBef = (isset($variance['before'][$children['project_id']]['varPhyBef'])) ? number_format($variance['before'][$children['project_id']]['varPhyBef'], 2) : "N/A";
                                                }

                                                if(isset($projProgressDayDelay[$children['project_id']][$this->currentYear][$this->currentMonth]['no_days_delay'])){
                                                    $valDaysDelay = $projProgressDayDelay[$children['project_id']][$this->currentYear][$this->currentMonth]['no_days_delay'];
                                                    $varDaysDelay = '<br>('.$valDaysDelay.' Days)';
                                                }else{
                                                    $varDaysDelay = "";
                                                }
                
                                                $pmName = ($key['project_owner'] == "JKR_SABAH") ? 'SOR' : 'PM';
                
                                                if ($key['project_owner'] == 'JKR_SABAH'){
                                                    if($varEachNow == 0 && $phyActNow == 100.00){
                                                        $progress = 'completed';
                                                        $explain = 'Completed';
                                                        $countComplete = $countComplete +1;
                                                        $varEachNow = "";
                                                    }else if($varEachNow == "N/A" ){
                                                        $progress = 'notAvailable';
                                                        $explain = 'Not Available';
                                                        $countNA = $countNA +1;
                                                    }else if($varEachNow <= $redVal['1']){
                                                        $progress = 'delay';
                                                        $explain = 'Delay';
                                                        $countDelay = $countDelay +1;
                                                    }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                        $progress = 'alarming';
                                                        $explain = 'Alarming';
                                                        $countAlarm = $countAlarm +1;
                                                    }else if($varEachNow > $yellowVal['1']){
                                                        $progress = 'onTrack';
                                                        $explain = 'On Track';
                                                        $countTrack = $countTrack +1;
                                                    }
                                                    
                                                    if($varEachBef == 0 && $phyActBef == 100.00){
                                                        $progressBef = 'completed';
                                                        $explainBef = 'Completed';
                                                    }else if($varEachBef <= $redVal['1']){
                                                        $progressBef = 'delay';
                                                        $explainBef = 'Delay';
                                                    }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                        $progressBef = 'alarming';
                                                        $explainBef = 'Alarming';
                                                    }else if($varEachBef > $yellowVal['1'] ){
                                                        $progressBef = 'onTrack';
                                                        $explainBef = 'On Track';
                                                    }

                                                    //check if variance is negative, then it showing no. of delay
                                                    if($varEachNow < 0 && $valDaysDelay !== ''){
                                                        $daysDelay = $varDaysDelay;
                                                    }else{
                                                        $daysDelay = "";
                                                    }
                                                }
                
                                                $countAll = $countAll +1;
                                                $per =( $explain == 'Completed')?"" :"% ";
                                                $cardPackage .= '
                                                    <div class="card cardProjSearch mix package '.$progress.'" data-name="'.$projectID.'" data-pname="'.$projectName.'" data-start-date="'.$projectStartDate.'" data-contract-amount="'.$projectContractAmount.'" data-package_uuid="'.$currPackageUuid.'" data-project_owner="'.$key['project_owner'].'" data-package_id="'.$projectID.'" data-user_org="'.$this->userOrg.'" data-project_phase="'.$projectPhase.'">
                                                        <div class="column-one">
                                                            <img src="'.$imgUrl.'"/>
                                                            <div class="title"><div class="text-ellipsis">'.$projectWPCID.'</div></div>
                                                            <div class="content">
                                                                <div class="row height bold"><span class="description">'.$projectName.'</span></div>
                                                                <div class="row column noBottom">
                                                                    <div class="column-one">'.$pmName.'</div>
                                                                    <span class="column-two clamp-text">'.$projectPM.'</span>
                                                                </div>
                                                                <div class="row column">
                                                                    <div class="column-one">Contractor</div>
                                                                    <span class="column-two one-line">'.$projectContractor.'</span>
                                                                </div>
                                                                <div class="row column align-center mobile bold">
                                                                    <div class="column-one small"><i class="fa-solid fa-circle-dollar"></i></div>
                                                                    <span class="column-two one-line amount">RM '.$contractAmt.' </span>
                                                                </div>
                                                                <div class="row column align-center mobile bold">
                                                                    <div class="column-one small"><i class="fa-solid fa-clock-seven"></i></i></div>
                                                                    <span class="column-two progress">'.$projectDuration.' Days</span>
                                                                </div>
                                                            </div>
                                                            <div class="footer '.$progress.'">
                                                                <div><i class="fa-solid fa-circle-info"></i>
                                                                    <div class="indicator-container">
                                                                        <span class="indicator-value">'.$varEachNow.$per.$explain.$daysDelay.'</span>
                                                                        <span class="indicator-value-previous">'.$varEachBef.'% from previous month</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="column-two"></div>
                                                    </div>
                                                ';
                                            }
                                        }
                                            $divisionHTML .= " $cardProj";
                                            $divisionHTML .= " $cardPackage
                                        </div>
                                    </div>
                                ";
                            }
                        }
                    }
                }else{ 
                    if($this->projectOwner == 'JKR_SARAWAK'){
                        foreach ($projectPackageTree as $key){
                            if ($key['project_owner']  == 'JKR_SARAWAK'){
                                $projectIcon = $icnPrefix.$key['icon_url'];
                                $imgUrl = (file_exists($projectIcon)) ? $projectIcon : $faviconPrefix.'favicon.ico';
                                $projectID = (isset($key['project_id'])) ? $key['project_id'] : '';
                                $currPackageUuid = (isset($key['project_id']) && isset($key['project_id_number'])) ? $key['project_id_number']."_". $key['project_id']. "_" . $key['project_id_number']: ""; 
                                $projectStartDate = (isset($key['start_date'])) ? $key['start_date'] : 'N/A';
                                $projectEndDate = (isset($key['end_date'])) ? $key['end_date'] : 'N/A';
                                $projectDuration = (isset($key['duration'])) ? $key['duration'] : 'N/A';
                                $projectName = (isset($key['project_name'])) ? $key['project_name'] : 'N/A';
                                $projectWPCID = (isset($key['project_id'])) ? $key['project_id'] : '';
                                $totProjAmount = 0;
                                $startDate = '';
                                $endDate = '';
            
                                $physical_actual_parent = 0;
                                $physical_schedule_parent = 0;
                                $physical_schedule_parent = 0;
                                $day_delay_parent = 0;
            
                                $cardProj='';
                                if(isset($key['children'])){
                                    foreach($key['children'] as $children){
                                        $projectContractAmount = (isset($contractArr[$children['project_id']]['originalAmount'])) ? $contractArr[$children['project_id']]['originalAmount'] : 0;
                                        $totProjAmount = $totProjAmount + $projectContractAmount;
                                        
                                        if (!$startDate){
                                            $startDate = $children['start_date'];
                                        }else if($children['start_date'] == $startDate){
                                            $startDate = $startDate;
                                        }else if($children['start_date'] < $startDate){
                                            $startDate = $children['start_date'];
                                        }else if($children['start_date'] > $startDate){
                                            $startDate = $startDate;
                                        }
            
                                        if (!$endDate){
                                            $endDate = $children['end_date'];
                                        }else if($children['end_date'] == $endDate){
                                            $endDate = $endDate;
                                        }else if($children['end_date'] > $endDate){
                                            $endDate = $children['end_date'];
                                        }else if($children['end_date'] < $endDate){
                                            $endDate = $endDate;
                                        }
                                    }
                                    $contractAmt = number_format($totProjAmount, 2, ".", ",");
                                }else{
                                    $contractAmt = 0.00;
                                }
                            
                                if(isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_actual_parent'])){
                                    $physical_actual_parent = (isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_actual_parent'])) ? $projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_actual_parent'] : 0;
                                }
                                else{
                                    $physical_actual_parent = "N/A";
                                }
            
                                if(isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_schedule_parent'])){
                                    $physical_schedule_parent = (isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_schedule_parent'])) ? $projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_schedule_parent'] : 0;
                                }
                                else{
                                    $physical_schedule_parent = "N/A";
                                }
                                if(isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['day_delay_parent'])){
                                    $day_delay_parent = (isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['day_delay_parent'])) ? $projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['day_delay_parent'].' day(s) delay' : 0;
                                }else{
                                    $day_delay_parent = "N/A";
                                }
            
                                if($physical_actual_parent == "N/A" || $physical_schedule_parent == "N/A"){
                                    $varEachNow = "N/A";
                                }
                                else{
                                    $varEachNow = (float) $physical_actual_parent - (float) $physical_schedule_parent;
                                }
            
                                if($varEachNow == "N/A" ){
                                    $progressProj = 'notAvailable';
                                    $explain = '';
                                    $trend = '<i class="fa-solid fa-ban"></i>';
                                }else if($varEachNow <= $redVal['1']){
                                    $progressProj = 'delay';
                                    $explain = 'Sick Project';
                                    $trend = '<i class="fa-solid fa-arrow-trend-down delay" style="font-weight: bold; color: red;"></i>';
                                    $varEachNow = $varEachNow . '%';
                                }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                    $progressProj = 'alarming';
                                    $explain = 'Delayed Project';
                                    $trend = '<i class="fa-solid fa-diamond-exclamation" style="font-weight: bold; color: #ffc107;"></i>';
                                    $varEachNow = $varEachNow . '%';
                                }else if($varEachNow > $yellowVal['1']){
                                    $progressProj = 'onTrack';
                                    $explain = 'On Schedule';
                                    $trend = '<i class="fa-solid fa-arrow-trend-up" style="font-weight: bold; color: #4caf50;"></i>';
                                    $varEachNow = $varEachNow . '%';
                                }
            
                                $divisionHTML .= '
                                <div class = "dashboardBodyExec">
                                <div class="division">
                                    <div class="row-container '.$progressProj.'">
                                        <div class="projImage">
                                            <img src="'.$imgUrl.'"/>
                                        </div>
                                        <div class="projName">
                                            <div class="name">'.$key['project_name'].'</div>
                                            <div clas="amount">
                                                <i class="fa-solid fa-circle-dollar"></i>
                                                <span class="column-two one-line amount">RM'.$contractAmt.'</span>
                                            </div>
                                        </div>
                                        <div class="ProjInfo">
                                            <div class="col">
                                                <div class="row">
                                                    <div class="column-label small" title="Start Date"><i class="fa-light fa-calendar-days" style="margin-right: 5px"></i>Start Date</div>
                                                </div>
                                                <div class="row">
                                                    <span class="column-two progress">'.date("d M Y", strtotime($startDate)).'</span>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="row">
                                                    <div class="column-label small" title="End Date"><i class="fa-light fa-calendar-days" style="margin-right: 5px"></i>End Date</div>
                                                </div>
                                                <div class="row">
                                                    <span class="column-two progress">'.date("d M Y", strtotime($endDate)).'</span>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="row">
                                                    <div class="column-label small" title="Status"><i class="fa-light fa-bars-progress" style="margin-right: 5px"></i>Project Status</div>
                                                </div>
                                                <div class="row">
                                                    <span class="column-two indicator-value">'.$trend.'   '.$varEachNow.' '.$explain.'</span>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="row">
                                                    <div class="column-label small" title="Days Delay"><i class="fa-light fa-calendar-clock" style="margin-right: 5px"></i>Days Delay</div>
                                                </div>
                                                <div class="row">
                                                    <span class="column-two indicator-value">'.$trend.'   '.$day_delay_parent.'</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-container mix-wrapper '.$progressProj.'">';
                                        if(isset($key['children'])){
                                            if($key['project_type'] == 'ASSET') continue;
                                                $cardPackage ='';
                                                foreach($key['children'] as $children){
                                                    if(isset($children)){
                                                        //MR CHANG asked to skip this package
                                                        if($children['project_id'] == 'PBHS_Redline') continue;
            
                                                        $projectIcon = $icnPrefix.$children['icon_url'];
            
                                                        $imgUrl = (file_exists($projectIcon)) ? $projectIcon : $faviconPrefix.'favicon.ico';
                                                        $projectID = (isset($children['project_id'])) ? $children['project_id'] : '';
                                                        $currPackageUuid = (isset($children['project_id']) && isset($children['project_id_number'])) ? $children['project_id_number']."_". $children['project_id']. "_" . $children['project_id_number']: ""; 
                                                        
                                                        
                                                        if(isset($pakageSet[$children['project_id']])){
                                                            $projectName = (isset($pakageSet[$children['project_id']])) ? $pakageSet[$children['project_id']] : 'N/A';
                                                        }else{
                                                            $projectName = (isset($children['project_name'])) ? $children['project_name'] : 'N/A';
                                                        }
            
                                                        $projectWPCID = (isset($children['project_wpc_id'])) ? $children['project_wpc_id'] : '';
                                                        $projectStartDate = (isset($children['start_date'])) ? $children['start_date'] : 'N/A';
                                                        $projectDuration = (isset($children['duration'])) ? $children['duration'] : 'N/A';
                                                        
                                                        $projectPM = (isset($sorNameArr[$children['project_id_number']])) ? $sorNameArr[$children['project_id_number']] : 'N/A';
                                                        
                                                        if(isset($contractorSet[$children['project_id']])){
                                                            $projectContractor = (isset($contractorSet[$children['project_id']])) ? $contractorSet[$children['project_id']] : 'N/A';
                                                        }
                                                        else{
                                                            $projectContractor = (isset($contractorNameArr[$children['contractor_org_id']])) ? $contractorNameArr[$children['contractor_org_id']] : 'N/A';
                                                        }
                                                    
                                                        $projectContractAmount = (isset($contractArr[$children['project_id']]['originalAmount'])) ? $contractArr[$children['project_id']]['originalAmount'] : 0;
                                                        $contractAmt = number_format($projectContractAmount, 2, ".", ",");
            
                                                        if(isset($variance['now'][$children['project_id']]['phyAct'])){
                                                            $phyActNow = (isset($variance['now'][$children['project_id']]['phyAct'])) ? number_format($variance['now'][$children['project_id']]['phyAct'], 2) : 0;
                                                        }else{
                                                            $phyActNow = 0;
                                                        }
            
                                                        if(isset($variance['now'][$children['project_id']]['varPhyCurr']) && $variance['now'][$children['project_id']]['varPhyCurr'] === 'N/A'){
                                                            $varEachNow = "N/A";
                                                        }
                                                        else{
                                                            $varEachNow = (isset($variance['now'][$children['project_id']]['varPhyCurr'])) ? number_format($variance['now'][$children['project_id']]['varPhyCurr'], 2) : "N/A";
                                                        }
            
                                                        if(isset($variance['before'][$children['project_id']]['phyAct'])){
                                                            $phyActBef = (isset($variance['before'][$children['project_id']]['phyAct'])) ? number_format($variance['before'][$children['project_id']]['phyAct'], 2) : 0;
                                                        }else{
                                                            $phyActBef = 0;
                                                        }
            
                                                        if(isset($variance['before'][$children['project_id']]['varPhyBef']) && $variance['before'][$children['project_id']]['varPhyBef'] === "N/A"){
                                                            $varEachBef = "N/A";
                                                        }
                                                        else{
                                                            $varEachBef = (isset($variance['before'][$children['project_id']]['varPhyBef'])) ? number_format($variance['before'][$children['project_id']]['varPhyBef'], 2) : "N/A";
                                                        }
            
                                                        $pmName = ($key['project_owner'] == "JKR_SABAH") ? 'SOR' : 'PM';
            
                                                        if ($key['project_owner'] == 'JKR_SARAWAK'){
                                                            if($varEachNow == 0 && $phyActNow == 100.00){
                                                                $progress = 'completed';
                                                                $explain = 'Completed';
                                                                $countComplete = $countComplete +1;
                                                                $varEachNow = "";
                                                            }else if($varEachNow == "N/A" ){
                                                                $progress = 'notAvailable';
                                                                $explain = 'Not Available';
                                                                $countNA = $countNA +1;
                                                            }else if($varEachNow <= $redVal['1']){
                                                                $progress = 'delay';
                                                                $explain = 'Sick Project';
                                                                $countDelay = $countDelay +1;
                                                            }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                                $progress = 'alarming';
                                                                $explain = 'Delayed Project';
                                                                $countAlarm = $countAlarm +1;
                                                            }else if($varEachNow > $yellowVal['1']){
                                                                $progress = 'onTrack';
                                                                $explain = 'On Schedule';
                                                                $countTrack = $countTrack +1;
                                                            }
                                                            
                                                            if($varEachBef == 0 && $phyActBef == 100.00){
                                                                $progressBef = 'completed';
                                                                $explainBef = 'Completed';
                                                            }else if($varEachBef <= $redVal['1']){
                                                                $progressBef = 'delay';
                                                                $explainBef = 'Sick Project';
                                                            }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                                $progressBef = 'alarming';
                                                                $explainBef = 'Delay Project';
                                                            }else if($varEachBef > $yellowVal['1']){
                                                                $progressBef = 'onTrack';
                                                                $explainBef = 'On Schedule';
                                                            }
                                                        }
            
                                                        $countAll = $countAll +1;
                                                        $per =( $explain == 'Completed')?"" :"% ";
                                                        $cardPackage .= '
                                                            <div class="card cardProjSearch mix package '.$progress.'" data-name="'.$projectID.'" data-pname="'.$projectName.'" data-start-date="'.$projectStartDate.'" data-contract-amount="'.$projectContractAmount.'" data-package_uuid="'.$currPackageUuid.'" data-project_owner="'.$key['project_owner'].'" data-package_id="'.$projectID.'" data-user_org="'.$this->userOrg.'">
                                                                <div class="column-one">
                                                                    <img src="'.$imgUrl.'"/>
                                                                    <div class="title"><div class="text-ellipsis">'.$projectWPCID.'</div></div>
                                                                    <div class="content">
                                                                        <div class="row height bold"><span class="description">'.$projectName.'</span></div>
                                                                        <div class="row column noBottom">
                                                                            <div class="column-one">'.$pmName.'</div>
                                                                            <span class="column-two clamp-text">'.$projectPM.'</span>
                                                                        </div>
                                                                        <div class="row column">
                                                                            <div class="column-one">Contractor</div>
                                                                            <span class="column-two one-line">'.$projectContractor.'</span>
                                                                        </div>
                                                                        <div class="row column align-center mobile bold">
                                                                            <div class="column-one small"><i class="fa-solid fa-circle-dollar"></i></div>
                                                                            <span class="column-two one-line amount">RM '.$contractAmt.' </span>
                                                                        </div>
                                                                        <div class="row column align-center mobile bold">
                                                                            <div class="column-one small"><i class="fa-solid fa-clock-seven"></i></i></div>
                                                                            <span class="column-two progress">'.$projectDuration.' Days</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="footer '.$progress.'">
                                                                        <div><i class="fa-solid fa-circle-info"></i>
                                                                            <div class="indicator-container">
                                                                                <span class="indicator-value">'.$varEachNow.$per.$explain.'</span>
                                                                                <span class="indicator-value-previous">'.$varEachBef.'% from previous month</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="column-two"></div>
                                                            </div>
                                                        ';
                                                    }
                                                }
                                                $divisionHTML .= " $cardPackage";
                                        }
                                        $divisionHTML .= '
                                    </div>
                                </div>';
                            }
                        }
                    }else{

                        foreach ($projectPackageTree as $key){

                            if ($key['project_owner']  == 'JKR_SABAH'){
                                if(isset($key['children'])){
                                    if($key['project_type'] == 'ASSET') continue;
                                    $divisionHTML .= '
                                        <div class = "dashboardBodyExec large">
                                        <div class="division '.$key['project_id'].'">
                                            <div class="row-container" style="padding: .8rem 0; font-size: 1rem; font-weight: bold;">'.$key['project_name'].'
                                                <select class="select-projectphase" data-projectid="'.$key['project_id'].'">
                                                    <option value="all">All</option>
                                                    <option value="1A">1A</option>
                                                    <option value="1B">1B</option>
                                                </select>
                                            </div>
                                            <div class="card-container mix-wrapper">';
                                            $cardPackage ='';
                                            foreach($key['children'] as $children){
                                                if(isset($children)){
                                                    //MR CHANG asked to skip this packag;
                                                    if($children['project_id'] == 'PBHS_Redline') continue;
                    
                                                    $projectIcon = $icnPrefix.$children['icon_url'];
                                                    $imgUrl = (file_exists($projectIcon)) ? $projectIcon : $faviconPrefix.'favicon.ico';
                                                    $projectID = (isset($children['project_id'])) ? $children['project_id'] : '';
                                                    $currPackageUuid = (isset($children['project_id']) && isset($children['project_id_number'])) ? $children['project_id_number']."_". $children['project_id']. "_" . $children['project_id_number']: ""; 
                                                    $projectWPCID = (isset($children['project_wpc_id'])) ? $children['project_wpc_id'] : '';
                                                    $projectStartDate = (isset($children['start_date'])) ? $children['start_date'] : 'N/A';
                                                    $projectDuration = (isset($children['duration'])) ? $children['duration'] : 'N/A';
                                                    $projectPhase = (isset($children['project_phase'])) ? $children['project_phase'] : '1A';
                                                    
                                                    if(isset($pakageSet[$children['project_id']])){
                                                        $projectName = (isset($pakageSet[$children['project_id']])) ? $pakageSet[$children['project_id']] : 'N/A';
                                                    }else{
                                                        $projectName = (isset($children['project_name'])) ? $children['project_name'] : 'N/A';
                                                    }
                                                    
                                                    $projectPM = (isset($sorNameArr[$children['project_id_number']])) ? $sorNameArr[$children['project_id_number']] : 'N/A';
                                                    
                                                    if(isset($contractorSet[$children['project_id']])){
                                                        $projectContractor = (isset($contractorSet[$children['project_id']])) ? $contractorSet[$children['project_id']] : 'N/A';
                                                    }
                                                    else{
                                                        $projectContractor = (isset($contractorNameArr[$children['contractor_org_id']])) ? $contractorNameArr[$children['contractor_org_id']] : 'N/A';
                                                    }
                                                
                                                    $projectContractAmount = (isset($contractArr[$children['project_id']]['originalAmount'])) ? $contractArr[$children['project_id']]['originalAmount'] : 0;
                                                    $contractAmt = number_format($projectContractAmount, 2, ".", ",");
                    
                                                    if(isset($variance['now'][$children['project_id']]['phyAct'])){
                                                        $phyActNow = (isset($variance['now'][$children['project_id']]['phyAct'])) ? number_format($variance['now'][$children['project_id']]['phyAct'], 2) : 0;
                                                    }else{
                                                        $phyActNow =0; 
                                                    }
                    
                                                    if(isset($variance['now'][$children['project_id']]['varPhyCurr']) && $variance['now'][$children['project_id']]['varPhyCurr'] === 'N/A'){
                                                        $varEachNow = "N/A";
                                                    }
                                                    else{
                                                        $varEachNow = (isset($variance['now'][$children['project_id']]['varPhyCurr'])) ? number_format($variance['now'][$children['project_id']]['varPhyCurr'], 2) : "N/A";
                                                    }
                    
                                                    if(isset($variance['before'][$children['project_id']]['phyAct'])){
                                                        $phyActBef = (isset($variance['before'][$children['project_id']]['phyAct'])) ? number_format($variance['before'][$children['project_id']]['phyAct'], 2) : 0;
                                                    }else{
                                                        $phyActBef = 0;
                                                    }
                    
                                                    if(isset($variance['before'][$children['project_id']]['varPhyBef']) && $variance['before'][$children['project_id']]['varPhyBef'] === "N/A"){
                                                        $varEachBef = "N/A";
                                                    }
                                                    else{
                                                        $varEachBef = (isset($variance['before'][$children['project_id']]['varPhyBef'])) ? number_format($variance['before'][$children['project_id']]['varPhyBef'], 2) : "N/A";
                                                    }

                                                    if(isset($projProgressDayDelay[$children['project_id']][$this->currentYear][$this->currentMonth]['no_days_delay'])){
                                                        $valDaysDelay = $projProgressDayDelay[$children['project_id']][$this->currentYear][$this->currentMonth]['no_days_delay'];
                                                        $varDaysDelay = '<br>('.$valDaysDelay.' Days)';
                                                    }else{
                                                        $varDaysDelay = "";
                                                    }
                    
                                                    $pmName = ($key['project_owner'] == "JKR_SABAH") ? 'SOR' : 'PM';
                    
                                                    if ($key['project_owner'] == 'JKR_SABAH'){
                                                        if($varEachNow == 0 && $phyActNow == 100.00){
                                                            $progress = 'completed';
                                                            $explain = 'Completed';
                                                            $countComplete = $countComplete +1;
                                                            $varEachNow = "";
                                                        }else if($varEachNow == "N/A" ){
                                                            $progress = 'notAvailable';
                                                            $explain = 'Not Available';
                                                            $countNA = $countNA +1;
                                                        }else if($varEachNow <= $redVal['1']){
                                                            $progress = 'delay';
                                                            $explain = 'Delay';
                                                            $countDelay = $countDelay +1;
                                                        }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                            $progress = 'alarming';
                                                            $explain = 'Alarming';
                                                            $countAlarm = $countAlarm +1;
                                                        }else if($varEachNow > $yellowVal['1']){
                                                            $progress = 'onTrack';
                                                            $explain = 'On Track';
                                                            $countTrack = $countTrack +1;
                                                        }
                                                        
                                                        if($varEachBef == 0 && $phyActBef == 100.00){
                                                            $progressBef = 'completed';
                                                            $explainBef = 'Completed';
                                                        }else if($varEachBef <= $redVal['1']){
                                                            $progressBef = 'delay';
                                                            $explainBef = 'Delay';
                                                        }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                            $progressBef = 'alarming';
                                                            $explainBef = 'Alarming';
                                                        }else if($varEachBef > $yellowVal['1'] ){
                                                            $progressBef = 'onTrack';
                                                            $explainBef = 'On Track';
                                                        }

                                                        //check if variance is negative, then it showing no. of delay
                                                        if($varEachNow < 0 && $valDaysDelay !== ''){
                                                            $daysDelay = $varDaysDelay;
                                                        }else{
                                                            $daysDelay = "";
                                                        }
                                                    }
                    
                                                    $countAll = $countAll +1;
                                                    $per =( $explain == 'Completed')?"" :"% ";
                                                    $cardPackage .= '
                                                        <div class="card cardProjSearch mix package '.$progress.'" data-name="'.$projectID.'" data-pname="'.$projectName.'" data-start-date="'.$projectStartDate.'" data-contract-amount="'.$projectContractAmount.'" data-package_uuid="'.$currPackageUuid.'" data-project_owner="'.$key['project_owner'].'" data-package_id="'.$projectID.'" data-user_org="'.$this->userOrg.'" data-project_phase="'.$projectPhase.'">
                                                            <div class="column-one">
                                                                <img src="'.$imgUrl.'"/>
                                                                <div class="title"><div class="text-ellipsis">'.$projectWPCID.'</div></div>
                                                                <div class="content">
                                                                    <div class="row height bold"><span class="description">'.$projectName.'</span></div>
                                                                    <div class="row column noBottom">
                                                                        <div class="column-one">'.$pmName.'</div>
                                                                        <span class="column-two clamp-text">'.$projectPM.'</span>
                                                                    </div>
                                                                    <div class="row column">
                                                                        <div class="column-one">Contractor</div>
                                                                        <span class="column-two one-line">'.$projectContractor.'</span>
                                                                    </div>
                                                                    <div class="row column align-center mobile bold">
                                                                        <div class="column-one small"><i class="fa-solid fa-circle-dollar"></i></div>
                                                                        <span class="column-two one-line amount">RM '.$contractAmt.' </span>
                                                                    </div>
                                                                    <div class="row column align-center mobile bold">
                                                                        <div class="column-one small"><i class="fa-solid fa-clock-seven"></i></i></div>
                                                                        <span class="column-two progress">'.$projectDuration.' Days</span>
                                                                    </div>
                                                                </div>
                                                                <div class="footer '.$progress.'">
                                                                    <div><i class="fa-solid fa-circle-info"></i>
                                                                        <div class="indicator-container">
                                                                            <span class="indicator-value">'.$varEachNow.$per.$explain.$daysDelay.'</span>
                                                                            <span class="indicator-value-previous">'.$varEachBef.'% from previous month</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="column-two"></div>
                                                        </div>
                                                    ';
                                                }
                                            }
                                                $divisionHTML .= " $cardProj";
                                                $divisionHTML .= " $cardPackage
                                            </div>
                                        </div>
                                    ";
                                }

                            }
                          
                        }
                    }
                }
        }else{
            $createBody = true;
            if(count($projectPackageTree) > 0){
                foreach ($projectPackageTree as $key){
                    if ($this->projectOwner == 'JKR_SARAWAK' || $this->projectOwner == 'OBYU'){
                        $projectIcon = $icnPrefix.$key['icon_url'];
                        $imgUrl = (file_exists($projectIcon)) ? $projectIcon : $faviconPrefix.'favicon.ico';
                        $projectID = (isset($key['project_id'])) ? $key['project_id'] : '';
                        $currPackageUuid = (isset($key['project_id']) && isset($key['project_id_number'])) ? $key['project_id_number']."_". $key['project_id']. "_" . $key['project_id_number']: ""; 
                        $projectStartDate = (isset($key['start_date'])) ? $key['start_date'] : 'N/A';
                        $projectEndDate = (isset($key['end_date'])) ? $key['end_date'] : 'N/A';
                        $projectDuration = (isset($key['duration'])) ? $key['duration'] : 'N/A';
                        $projectName = (isset($key['project_name'])) ? $key['project_name'] : 'N/A';
                        $projectWPCID = (isset($key['project_id'])) ? $key['project_id'] : '';
                        $totProjAmount = 0;
                        $startDate = '';
                        $endDate = '';
    
                        $physical_actual_parent = 0;
                        $physical_schedule_parent = 0;
                        $physical_schedule_parent = 0;
                        $day_delay_parent = 0;
    
                        $cardProj='';
                        if(isset($key['children'])){
                            foreach($key['children'] as $children){
                                $projectContractAmount = (isset($contractArr[$children['project_id']]['originalAmount'])) ? $contractArr[$children['project_id']]['originalAmount'] : 0;
                                $totProjAmount = $totProjAmount + $projectContractAmount;
                                
                                if (!$startDate){
                                    $startDate = $children['start_date'];
                                }else if($children['start_date'] == $startDate){
                                    $startDate = $startDate;
                                }else if($children['start_date'] < $startDate){
                                    $startDate = $children['start_date'];
                                }else if($children['start_date'] > $startDate){
                                    $startDate = $startDate;
                                }
    
                                if (!$endDate){
                                    $endDate = $children['end_date'];
                                }else if($children['end_date'] == $endDate){
                                    $endDate = $endDate;
                                }else if($children['end_date'] > $endDate){
                                    $endDate = $children['end_date'];
                                }else if($children['end_date'] < $endDate){
                                    $endDate = $endDate;
                                }
                            }
                            $contractAmt = number_format($totProjAmount, 2, ".", ",");
                        }else{
                            $contractAmt = 0.00;
                        }
                    
                        if(isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_actual_parent'])){
                            $physical_actual_parent = (isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_actual_parent'])) ? $projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_actual_parent'] : 0;
                        }
                        else{
                            $physical_actual_parent = "N/A";
                        }
    
                        if(isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_schedule_parent'])){
                            $physical_schedule_parent = (isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_schedule_parent'])) ? $projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['physical_schedule_parent'] : 0;
                        }
                        else{
                            $physical_schedule_parent = "N/A";
                        }
                        if(isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['day_delay_parent'])){
                            $day_delay_parent = (isset($projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['day_delay_parent'])) ? $projProgressArr[$projectID][$this->currentYear][$this->currentMonth]['day_delay_parent'].' day(s) delay' : 0;
                        }else{
                            $day_delay_parent = "N/A";
                        }
    
                        if($physical_actual_parent == "N/A" || $physical_schedule_parent == "N/A"){
                            $varEachNow = "N/A";
                        }
                        else{
                            $varEachNow = (float) $physical_actual_parent - (float) $physical_schedule_parent;
                        }
    
                        if($varEachNow == "N/A" ){
                            $progressProj = 'notAvailable';
                            $explain = '';
                            $trend = '<i class="fa-solid fa-ban"></i>';
                        }else if($varEachNow <= $redVal['1']){
                            $progressProj = 'delay';
                            $explain = 'Sick Project';
                            $trend = '<i class="fa-solid fa-arrow-trend-down delay" style="font-weight: bold; color: red;"></i>';
                            $varEachNow = $varEachNow . '%';
                        }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                            $progressProj = 'alarming';
                            $explain = 'Delayed Project';
                            $trend = '<i class="fa-solid fa-diamond-exclamation" style="font-weight: bold; color: #ffc107;"></i>';
                            $varEachNow = $varEachNow . '%';
                        }else if($varEachNow > $yellowVal['1']){
                            $progressProj = 'onTrack';
                            $explain = 'On Schedule';
                            $trend = '<i class="fa-solid fa-arrow-trend-up" style="font-weight: bold; color: #4caf50;"></i>';
                            $varEachNow = $varEachNow . '%';
                        }
    
                        if($createBody){
                            $divisionHTML .= '<div class = "dashboardBodyExec">';
                            $createBody = false;
                        }
                        $divisionHTML .= '
                        <div class="division">
                            <div class="row-container '.$progressProj.'">
                                <div class="projImage">
                                    <img src="'.$imgUrl.'"/>
                                </div>
                                <div class="projName">
                                    <div class="name">'.$key['project_name'].'</div>
                                    <div clas="amount">
                                        <i class="fa-solid fa-circle-dollar"></i>
                                        <span class="column-two one-line amount">RM'.$contractAmt.'</span>
                                    </div>
                                </div>
                                <div class="ProjInfo">
                                    <div class="col">
                                        <div class="row">
                                            <div class="column-label small" title="Start Date"><i class="fa-light fa-calendar-days" style="margin-right: 5px"></i>Start Date</div>
                                        </div>
                                        <div class="row">
                                            <span class="column-two progress">'.date("d M Y", strtotime($startDate)).'</span>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row">
                                            <div class="column-label small" title="End Date"><i class="fa-light fa-calendar-days" style="margin-right: 5px"></i>End Date</div>
                                        </div>
                                        <div class="row">
                                            <span class="column-two progress">'.date("d M Y", strtotime($endDate)).'</span>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row">
                                            <div class="column-label small" title="Status"><i class="fa-light fa-bars-progress" style="margin-right: 5px"></i>Project Status</div>
                                        </div>
                                        <div class="row">
                                            <span class="column-two indicator-value">'.$trend.'   '.$varEachNow.' '.$explain.'</span>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row">
                                            <div class="column-label small" title="Days Delay"><i class="fa-light fa-calendar-clock" style="margin-right: 5px"></i>Days Delay</div>
                                        </div>
                                        <div class="row">
                                            <span class="column-two indicator-value">'.$trend.'   '.$day_delay_parent.'</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-container mix-wrapper '.$progressProj.'">';
                                if(isset($key['children'])){
                                    if($key['project_type'] == 'ASSET') continue;
                                        $cardPackage ='';
                                        foreach($key['children'] as $children){
                                            if(isset($children)){
                                                //MR CHANG asked to skip this package
                                                if($children['project_id'] == 'PBHS_Redline') continue;
    
                                                $projectIcon = $icnPrefix.$children['icon_url'];
    
                                                $imgUrl = (file_exists($projectIcon)) ? $projectIcon : $faviconPrefix.'favicon.ico';
                                                $projectID = (isset($children['project_id'])) ? $children['project_id'] : '';
                                                $currPackageUuid = (isset($children['project_id']) && isset($children['project_id_number'])) ? $children['project_id_number']."_". $children['project_id']. "_" . $children['project_id_number']: ""; 
                                                $projectPhase = '';
                                                
                                                
                                                if(isset($pakageSet[$children['project_id']])){
                                                    $projectName = (isset($pakageSet[$children['project_id']])) ? $pakageSet[$children['project_id']] : 'N/A';
                                                }else{
                                                    $projectName = (isset($children['project_name'])) ? $children['project_name'] : 'N/A';
                                                }
    
                                                $projectWPCID = (isset($children['project_wpc_id'])) ? $children['project_wpc_id'] : '';
                                                $projectStartDate = (isset($children['start_date'])) ? $children['start_date'] : 'N/A';
                                                $projectDuration = (isset($children['duration'])) ? $children['duration'] : 'N/A';
                                                
                                                $projectPM = (isset($sorNameArr[$children['project_id_number']])) ? $sorNameArr[$children['project_id_number']] : 'N/A';
                                                
                                                if(isset($contractorSet[$children['project_id']])){
                                                    $projectContractor = (isset($contractorSet[$children['project_id']])) ? $contractorSet[$children['project_id']] : 'N/A';
                                                }
                                                else{
                                                    $projectContractor = (isset($contractorNameArr[$children['contractor_org_id']])) ? $contractorNameArr[$children['contractor_org_id']] : 'N/A';
                                                }
                                            
                                                $projectContractAmount = (isset($contractArr[$children['project_id']]['originalAmount'])) ? $contractArr[$children['project_id']]['originalAmount'] : 0;
                                                $contractAmt = number_format($projectContractAmount, 2, ".", ",");
    
                                                if(isset($variance['now'][$children['project_id']]['phyAct'])){
                                                    $phyActNow = (isset($variance['now'][$children['project_id']]['phyAct'])) ? number_format($variance['now'][$children['project_id']]['phyAct'], 2) : 0;
                                                }else{
                                                    $phyActNow = 0;
                                                }
    
                                                if(isset($variance['now'][$children['project_id']]['varPhyCurr']) && $variance['now'][$children['project_id']]['varPhyCurr'] === 'N/A'){
                                                    $varEachNow = "N/A";
                                                }
                                                else{
                                                    $varEachNow = (isset($variance['now'][$children['project_id']]['varPhyCurr'])) ? number_format($variance['now'][$children['project_id']]['varPhyCurr'], 2) : "N/A";
                                                }
    
                                                if(isset($variance['before'][$children['project_id']]['phyAct'])){
                                                    $phyActBef = (isset($variance['before'][$children['project_id']]['phyAct'])) ? number_format($variance['before'][$children['project_id']]['phyAct'], 2) : 0;
                                                }else{
                                                    $phyActBef = 0;
                                                }
    
                                                if(isset($variance['before'][$children['project_id']]['varPhyBef']) && $variance['before'][$children['project_id']]['varPhyBef'] === "N/A"){
                                                    $varEachBef = "N/A";
                                                }
                                                else{
                                                    $varEachBef = (isset($variance['before'][$children['project_id']]['varPhyBef'])) ? number_format($variance['before'][$children['project_id']]['varPhyBef'], 2) : "N/A";
                                                }
    
                                                $pmName = ($this->projectOwner == "JKR_SABAH") ? 'SOR' : 'PM';
    
                                                if ($this->projectOwner == 'JKR_SARAWAK'){
                                                    if($varEachNow == 0 && $phyActNow == 100.00){
                                                        $progress = 'completed';
                                                        $explain = 'Completed';
                                                        $countComplete = $countComplete +1;
                                                        $varEachNow = "";
                                                    }else if($varEachNow == "N/A" ){
                                                        $progress = 'notAvailable';
                                                        $explain = 'Not Available';
                                                        $countNA = $countNA +1;
                                                    }else if($varEachNow <= $redVal['1']){
                                                        $progress = 'delay';
                                                        $explain = 'Sick Project';
                                                        $countDelay = $countDelay +1;
                                                    }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                        $progress = 'alarming';
                                                        $explain = 'Delayed Project';
                                                        $countAlarm = $countAlarm +1;
                                                    }else if($varEachNow > $yellowVal['1']){
                                                        $progress = 'onTrack';
                                                        $explain = 'On Schedule';
                                                        $countTrack = $countTrack +1;
                                                    }
    
                                                    if($varEachBef == 0 && $phyActBef == 100.00){
                                                        $progressBef = 'completed';
                                                        $explainBef = 'Completed';
                                                    }else if($varEachBef <= $redVal['1']){
                                                        $progressBef = 'delay';
                                                        $explainBef = 'Sick Project';
                                                    }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                        $progressBef = 'alarming';
                                                        $explainBef = 'Delay Project';
                                                    }else if($varEachBef > $yellowVal['1']){
                                                        $progressBef = 'onTrack';
                                                        $explainBef = 'On Schedule';
                                                    }
                                                }else{
                                                    if($varEachNow == 0 && $phyActNow == 100.00){
                                                        $progress = 'completed';
                                                        $explain = 'Completed';
                                                        $countComplete = $countComplete +1;
                                                        $varEachNow = "";
                                                    }else if($varEachNow == "N/A" ){
                                                        $progress = 'notAvailable';
                                                        $explain = 'Not Available';
                                                        $countNA = $countNA +1;
                                                    }else if($varEachNow <= $redVal['1']){
                                                        $progress = 'delay';
                                                        $explain = 'Delay';
                                                        $countDelay = $countDelay +1;
                                                    }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                        $progress = 'alarming';
                                                        $explain = 'Alarming';
                                                        $countAlarm = $countAlarm +1;
                                                    }else if($varEachNow > $yellowVal['1']){
                                                        $progress = 'onTrack';
                                                        $explain = 'On Track';
                                                        $countTrack = $countTrack +1;
                                                    }
    
                                                    if($varEachBef == 0 && $phyActBef == 100.00){
                                                        $progressBef = 'completed';
                                                        $explainBef = 'Completed';
                                                    }else if($varEachBef <= $redVal['1']){
                                                        $progressBef = 'delay';
                                                        $explainBef = 'Delay';
                                                    }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                        $progressBef = 'alarming';
                                                        $explainBef = 'Alarming';
                                                    }else if($varEachBef > $yellowVal['1'] ){
                                                        $progressBef = 'onTrack';
                                                        $explainBef = 'On Track';
                                                    }
                                                }
    
                                                $countAll = $countAll +1;
                                                $per =( $explain == 'Completed')?"" :"% ";
                                                $cardPackage .= '
                                                    <div class="card cardProjSearch mix package '.$progress.'" data-name="'.$projectID.'" data-pname="'.$projectName.'" data-start-date="'.$projectStartDate.'" data-contract-amount="'.$projectContractAmount.'" data-package_uuid="'.$currPackageUuid.'" data-project_owner="'.$this->projectOwner.'" data-package_id="'.$projectID.'" data-user_org="'.$this->userOrg.'" data-project_phase="'.$projectPhase.'">
                                                        <div class="column-one">
                                                            <img src="'.$imgUrl.'"/>
                                                            <div class="title"><div class="text-ellipsis">'.$projectWPCID.'</div></div>
                                                            <div class="content">
                                                                <div class="row height bold"><span class="description">'.$projectName.'</span></div>
                                                                <div class="row column noBottom">
                                                                    <div class="column-one">'.$pmName.'</div>
                                                                    <span class="column-two clamp-text">'.$projectPM.'</span>
                                                                </div>
                                                                <div class="row column">
                                                                    <div class="column-one">Contractor</div>
                                                                    <span class="column-two one-line">'.$projectContractor.'</span>
                                                                </div>
                                                                <div class="row column align-center mobile bold">
                                                                    <div class="column-one small"><i class="fa-solid fa-circle-dollar"></i></div>
                                                                    <span class="column-two one-line amount">RM '.$contractAmt.' </span>
                                                                </div>
                                                                <div class="row column align-center mobile bold">
                                                                    <div class="column-one small"><i class="fa-solid fa-clock-seven"></i></i></div>
                                                                    <span class="column-two progress">'.$projectDuration.' Days</span>
                                                                </div>
                                                            </div>
                                                            <div class="footer '.$progress.'">
                                                                <div><i class="fa-solid fa-circle-info"></i>
                                                                    <div class="indicator-container">
                                                                        <span class="indicator-value">'.$varEachNow.$per.$explain.'</span>
                                                                        <span class="indicator-value-previous">'.$varEachBef.'% from previous month</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="column-two"></div>
                                                    </div>
                                                ';
                                            }
                                        }
                                        $divisionHTML .= " $cardPackage";
                                }
                                $divisionHTML .= '
                            </div>
                        </div>';
                    }else{
                        if(isset($key['children'])){
                            if($key['project_type'] == 'ASSET') continue;
                            if($createBody){
                                $divisionHTML .= '<div class = "dashboardBodyExec large">';
                                $createBody = false;
                            }
                            $divisionHTML .= '
                                <div class="division '.$key['project_id'].'">
                                    <div class="row-container" style="padding: .8rem 0; font-size: 1rem; font-weight: bold; align-items: center"">'.$key['project_name'].'
                                        <select class="select-projectphase" data-projectid="'.$key['project_id'].'">
                                            <option value="all">All</option>
                                            <option value="1A">1A</option>
                                            <option value="1B">1B</option>
                                        </select>
                                    </div>
                                    <div class="card-container mix-wrapper">';
                                    $cardPackage ='';
                                    foreach($key['children'] as $children){
                                        if(isset($children)){
                                            //MR CHANG asked to skip this packag;
                                            if($children['project_id'] == 'PBHS_Redline') continue;
            
                                            $projectIcon = $icnPrefix.$children['icon_url'];
                                            $imgUrl = (file_exists($projectIcon)) ? $projectIcon : $faviconPrefix.'favicon.ico';
                                            $projectID = (isset($children['project_id'])) ? $children['project_id'] : '';
                                            $currPackageUuid = (isset($children['project_id']) && isset($children['project_id_number'])) ? $children['project_id_number']."_". $children['project_id']. "_" . $children['project_id_number']: ""; 
                                            $projectWPCID = (isset($children['project_wpc_id'])) ? $children['project_wpc_id'] : '';
                                            $projectStartDate = (isset($children['start_date'])) ? $children['start_date'] : 'N/A';
                                            $projectDuration = (isset($children['duration'])) ? $children['duration'] : 'N/A';
                                            $projectPhase = (isset($children['project_phase'])) ? $children['project_phase'] : '1A';
                                            
                                            if(isset($pakageSet[$children['project_id']])){
                                                $projectName = (isset($pakageSet[$children['project_id']])) ? $pakageSet[$children['project_id']] : 'N/A';
                                            }else{
                                                $projectName = (isset($children['project_name'])) ? $children['project_name'] : 'N/A';
                                            }
                                            
                                            $projectPM = (isset($sorNameArr[$children['project_id_number']])) ? $sorNameArr[$children['project_id_number']] : 'N/A';
                                            
                                            if(isset($contractorSet[$children['project_id']])){
                                                $projectContractor = (isset($contractorSet[$children['project_id']])) ? $contractorSet[$children['project_id']] : 'N/A';
                                            }
                                            else{
                                                $projectContractor = (isset($contractorNameArr[$children['contractor_org_id']])) ? $contractorNameArr[$children['contractor_org_id']] : 'N/A';
                                            }
                                        
                                            $projectContractAmount = (isset($contractArr[$children['project_id']]['originalAmount'])) ? $contractArr[$children['project_id']]['originalAmount'] : 0;
                                            $contractAmt = number_format($projectContractAmount, 2, ".", ",");
            
                                            if(isset($variance['now'][$children['project_id']]['phyAct'])){
                                                $phyActNow = (isset($variance['now'][$children['project_id']]['phyAct'])) ? number_format($variance['now'][$children['project_id']]['phyAct'], 2) : 0;
                                            }else{
                                                $phyActNow = 0;
                                            }
            
                                            if(isset($variance['now'][$children['project_id']]['varPhyCurr']) && $variance['now'][$children['project_id']]['varPhyCurr'] === 'N/A'){
                                                $varEachNow = "N/A";
                                            }
                                            else{
                                                $varEachNow = (isset($variance['now'][$children['project_id']]['varPhyCurr'])) ? number_format($variance['now'][$children['project_id']]['varPhyCurr'], 2) : "N/A";
                                            }
            
                                            if(isset($variance['before'][$children['project_id']]['phyAct'])){
                                                $phyActBef = (isset($variance['before'][$children['project_id']]['phyAct'])) ? number_format($variance['before'][$children['project_id']]['phyAct'], 2) : 0;
                                            }else {
                                                $phyActBef = 0;
                                            }
            
                                            if(isset($variance['before'][$children['project_id']]['varPhyBef']) && $variance['before'][$children['project_id']]['varPhyBef'] === "N/A"){
                                                $varEachBef = "N/A";
                                            }
                                            else{
                                                $varEachBef = (isset($variance['before'][$children['project_id']]['varPhyBef'])) ? number_format($variance['before'][$children['project_id']]['varPhyBef'], 2) : "N/A";
                                            }
    
                                            if(isset($projProgressDayDelay[$children['project_id']][$this->currentYear][$this->currentMonth]['no_days_delay'])){
                                                $valDaysDelay = $projProgressDayDelay[$children['project_id']][$this->currentYear][$this->currentMonth]['no_days_delay'];
                                                $varDaysDelay = '<br>('.$valDaysDelay.' Days)';
                                            }else{
                                                $varDaysDelay = "";
                                            }
            
                                            $pmName = ($this->projectOwner == "JKR_SABAH") ? 'SOR' : 'PM';
            
                                            if ($this->projectOwner == 'JKR_SARAWAK'){
                                                if($varEachNow == 0 && $phyActNow == 100.00){
                                                    $progress = 'completed';
                                                    $explain = 'Completed';
                                                    $countComplete = $countComplete +1;
                                                    $varEachNow = "";
                                                }else if($varEachNow == "N/A" ){
                                                    $progress = 'notAvailable';
                                                    $explain = 'Not Available';
                                                    $countNA = $countNA +1;
                                                }else if($varEachNow <= $redVal['1']){
                                                    $progress = 'delay';
                                                    $explain = 'Sick Project';
                                                    $countDelay = $countDelay +1;
                                                }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                    $progress = 'alarming';
                                                    $explain = 'Delayed Project';
                                                    $countAlarm = $countAlarm +1;
                                                }else if($varEachNow > $yellowVal['1']){
                                                    $progress = 'onTrack';
                                                    $explain = 'On Schedule';
                                                    $countTrack = $countTrack +1;
                                                }
                                                
                                                if($varEachBef == 0 && $phyActBef == 100.00){
                                                    $progressBef = 'completed';
                                                    $explainBef = 'Completed';
                                                }else if($varEachBef <= $redVal['1']){
                                                    $progressBef = 'delay';
                                                    $explainBef = 'Sick Project';
                                                }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                    $progressBef = 'alarming';
                                                    $explainBef = 'Delay Project';
                                                }else if($varEachBef > $yellowVal['1']){
                                                    $progressBef = 'onTrack';
                                                    $explainBef = 'On Schedule';
                                                }
                                            }else{
                                                if($varEachNow == 0 && $phyActNow == 100.00){
                                                    $progress = 'completed';
                                                    $explain = 'Completed';
                                                    $countComplete = $countComplete +1;
                                                    $varEachNow = "";
                                                }else if($varEachNow == "N/A" ){
                                                    $progress = 'notAvailable';
                                                    $explain = 'Not Available';
                                                    $countNA = $countNA +1;
                                                }else if($varEachNow <= $redVal['1']){
                                                    $progress = 'delay';
                                                    $explain = 'Delay';
                                                    $countDelay = $countDelay +1;
                                                }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                    $progress = 'alarming';
                                                    $explain = 'Alarming';
                                                    $countAlarm = $countAlarm +1;
                                                }else if($varEachNow > $yellowVal['1']){
                                                    $progress = 'onTrack';
                                                    $explain = 'On Track';
                                                    $countTrack = $countTrack +1;
                                                }
    
                                                if($varEachBef == 0 && $phyActBef == 100.00){
                                                    $progressBef = 'completed';
                                                    $explainBef = 'Completed';
                                                }else if($varEachBef <= $redVal['1']){
                                                    $progressBef = 'delay';
                                                    $explainBef = 'Delay';
                                                }else if( $redVal['1'] < $varEachNow && $varEachNow <= $yellowVal['1']) {
                                                    $progressBef = 'alarming';
                                                    $explainBef = 'Alarming';
                                                }else if($varEachBef > $yellowVal['1'] ){
                                                    $progressBef = 'onTrack';
                                                    $explainBef = 'On Track';
                                                }

                                                //check if variance is negative, then it showing no. of delay
                                                if($varEachNow < 0 && $valDaysDelay !== ''){
                                                    $daysDelay = $varDaysDelay;
                                                }else{
                                                    $daysDelay = "";
                                                }
                                            }
            
                                            $countAll = $countAll +1;
                                            $per =( $explain == 'Completed')?"" :"% ";
                                            $cardPackage .= '
                                                <div class="card cardProjSearch mix package '.$progress.'" data-name="'.$projectID.'" data-pname="'.$projectName.'" data-start-date="'.$projectStartDate.'" data-contract-amount="'.$projectContractAmount.'" data-package_uuid="'.$currPackageUuid.'" data-project_owner="'.$this->projectOwner.'" data-package_id="'.$projectID.'" data-user_org="'.$this->userOrg.'" data-project_phase="'.$projectPhase.'">
                                                    <div class="column-one">
                                                        <img src="'.$imgUrl.'"/>
                                                        <div class="title"><div class="text-ellipsis">'.$projectWPCID.'</div></div>
                                                        <div class="content">
                                                            <div class="row height bold"><span class="description">'.$projectName.'</span></div>
                                                            <div class="row column noBottom">
                                                                <div class="column-one">'.$pmName.'</div>
                                                                <span class="column-two clamp-text">'.$projectPM.'</span>
                                                            </div>
                                                            <div class="row column">
                                                                <div class="column-one">Contractor</div>
                                                                <span class="column-two one-line">'.$projectContractor.'</span>
                                                            </div>
                                                            <div class="row column align-center mobile bold">
                                                                <div class="column-one small"><i class="fa-solid fa-circle-dollar"></i></div>
                                                                <span class="column-two one-line amount">RM '.$contractAmt.' </span>
                                                            </div>
                                                            <div class="row column align-center mobile bold">
                                                                <div class="column-one small"><i class="fa-solid fa-clock-seven"></i></i></div>
                                                                <span class="column-two progress">'.$projectDuration.' Days</span>
                                                            </div>
                                                        </div>
                                                        <div class="footer '.$progress.'">
                                                            <div><i class="fa-solid fa-circle-info"></i>
                                                                <div class="indicator-container">
                                                                    <span class="indicator-value">'.$varEachNow.$per.$explain.$daysDelay.'</span>
                                                                    <span class="indicator-value-previous">'.$varEachBef.'% from previous month</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="column-two"></div>
                                                </div>
                                            ';
                                        }
                                    }
                                        $divisionHTML .= " $cardProj";
                                        $divisionHTML .= " $cardPackage
                                    </div>
                                </div>
                            ";
                        }
                    }
                }
            }else{
                $divisionHTML .= '<div class = "dashboardBodyExec">';
            }
        }

        $countCompletePercent = ($countAll != 0) ? number_format((($countComplete/$countAll)*100), 2) : 0;
        $countTrackPercent = ($countAll != 0) ? number_format((($countTrack/$countAll)*100), 2) : 0;
        $countAlarmPercent = ($countAll != 0) ? number_format((($countAlarm/$countAll)*100), 2) : 0;
        $countDelayPercent = ($countAll != 0) ? number_format((($countDelay/$countAll)*100), 2) : 0;
        $countNAPercent = ($countAll != 0) ? number_format((($countNA/$countAll)*100), 2) : 0;

        //Start Overall Progress
        if($this->userOrg == 'KKR'){
            if(($_SESSION['proj_owner_sbh'] == "1") && ($_SESSION['proj_owner_swk'] == "1")){
                $dashboardFooterClass = "";
                $progressBarHTML .= "<div class='title'>Overall Progress </div>
                                     <div class='progressBar'>
                                        <div class='styling'></div>";
                $countCompletePercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn completed' data-filter='.completed' style='--count-percent: \"".$countCompletePercent."%\"; --width-percent:".$countCompletePercent."%;'></div>";
                $countTrackPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn onTrack' data-filter='.onTrack' style='--count-percent: \"".$countTrackPercent."%\";  --width-percent:".$countTrackPercent."%'></div>";
                $countAlarmPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn alarming' data-filter='.alarming' style='--count-percent: \"".$countAlarmPercent."%\";  --width-percent:".$countAlarmPercent."%'></div>";
                $countDelayPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn delay' data-filter='.delay' style='--count-percent: \"".$countDelayPercent."%\";  --width-percent:".$countDelayPercent."%'></div>";
                $countNAPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn notAvailable' data-filter='.notAvailable' style='--count-percent: \"".$countNAPercent."%\";  --width-percent:".$countNAPercent."%'></div>";
            }else if(($_SESSION['proj_owner_sbh'] !== "1") && ($_SESSION['proj_owner_swk'] == "1")){
                $dashboardFooterClass = "";
                $progressBarHTML .= "<div class='title'>Overall Progress </div>
                                     <div class='progressBar'>
                                        <div class='styling'></div>";
                $countCompletePercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn completed' data-filter='.completed' style='--count-percent: \"".$countCompletePercent."%\"; --width-percent:".$countCompletePercent."%;'></div>";
                $countTrackPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn onTrack' data-filter='.onTrack' style='--count-percent: \"".$countTrackPercent."%\";  --width-percent:".$countTrackPercent."%'></div>";
                $countAlarmPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn alarming' data-filter='.alarming' style='--count-percent: \"".$countAlarmPercent."%\";  --width-percent:".$countAlarmPercent."%'></div>";
                $countDelayPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn delay' data-filter='.delay' style='--count-percent: \"".$countDelayPercent."%\";  --width-percent:".$countDelayPercent."%'></div>";
                $countNAPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn notAvailable' data-filter='.notAvailable' style='--count-percent: \"".$countNAPercent."%\";  --width-percent:".$countNAPercent."%'></div>";
            }else if(($_SESSION['proj_owner_sbh'] == "1") && ($_SESSION['proj_owner_swk'] !== "1")){
                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['curr_month_physical'])){
                    $curr_month_physical_1A = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['curr_month_physical'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['curr_month_physical'] : 'N/A';
                }else{
                    $curr_month_physical_1A = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['curr_month_physical'])){
                    $curr_month_physical_1B = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['curr_month_physical'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['curr_month_physical'] : 'N/A';
                }else{
                    $curr_month_physical_1B = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['prev_month_physical'])){
                    $prev_month_physical_1A = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['prev_month_physical'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['prev_month_physical'] : 'N/A';
                }else{
                    $prev_month_physical_1A = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['prev_month_physical'])){
                    $prev_month_physical_1B = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['prev_month_physical'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['prev_month_physical'] : 'N/A';
                }else{
                    $prev_month_physical_1B = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['variance'])){
                    $variance_physical_1A = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['variance'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['variance'] : 'N/A';
                }else{
                    $variance_physical_1A = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['variance'])){
                    $variance_physical_1B = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['variance'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['variance'] : 'M/A';
                }else{
                    $variance_physical_1B = "N/A";
                }

                $dashboardFooterClass = "desc";
                $progressBarHTML .= "<div class='title bold'>Overall Progress :</div>
                                        <div class='progressDesc'>";
                $progressBarHTML .= "<span>Current Month Physical Progress (%) : <span id=\"curr_month_physical\">1A :  <b>|</b> 1B :  </span></span>";
                $progressBarHTML .= "<span>Previous Month Physical Progress (%) : <span id=\"prev_month_physical\">1A : ".$prev_month_physical_1A." <b>|</b> 1B : ".$prev_month_physical_1B."</span></span>";
                $progressBarHTML .= "<span>Variance (%) : <span id=\"variance_physical\">1A : ".$variance_physical_1A." <b>|</b> 1B : ".$variance_physical_1B."</span></span>";
            }
        }else{
            if($this->projectOwner == 'JKR_SARAWAK' || $this->projectOwner == 'OBYU'){
                $dashboardFooterClass = "";
                $progressBarHTML .= "<div class='title'>Overall Progress </div>
                                     <div class='progressBar'>
                                        <div class='styling'></div>";
                $countCompletePercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn completed' data-filter='.completed' style='--count-percent: \"".$countCompletePercent."%\"; --width-percent:".$countCompletePercent."%;'></div>";
                $countTrackPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn onTrack' data-filter='.onTrack' style='--count-percent: \"".$countTrackPercent."%\";  --width-percent:".$countTrackPercent."%'></div>";
                $countAlarmPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn alarming' data-filter='.alarming' style='--count-percent: \"".$countAlarmPercent."%\";  --width-percent:".$countAlarmPercent."%'></div>";
                $countDelayPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn delay' data-filter='.delay' style='--count-percent: \"".$countDelayPercent."%\";  --width-percent:".$countDelayPercent."%'></div>";
                $countNAPercent == "0" ? "" : $progressBarHTML .= "<div class='filter-btn notAvailable' data-filter='.notAvailable' style='--count-percent: \"".$countNAPercent."%\";  --width-percent:".$countNAPercent."%'></div>";
            }else{
                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['curr_month_physical'])){
                    $curr_month_physical_1A = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['curr_month_physical'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['curr_month_physical'] : 'N/A';
                }else{
                    $curr_month_physical_1A = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['curr_month_physical'])){
                    $curr_month_physical_1B = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['curr_month_physical'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['curr_month_physical'] : 'N/A';
                }else{
                    $curr_month_physical_1B = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['prev_month_physical'])){
                    $prev_month_physical_1A = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['prev_month_physical'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['prev_month_physical'] : 'N/A';
                }else{
                    $prev_month_physical_1A = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['prev_month_physical'])){
                    $prev_month_physical_1B = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['prev_month_physical'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['prev_month_physical'] : 'N/A';
                }else{
                    $prev_month_physical_1B = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['variance'])){
                    $variance_physical_1A = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['variance'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1A']['variance'] : 'N/A';
                }else{
                    $variance_physical_1A = "N/A";
                }

                if(isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['variance'])){
                    $variance_physical_1B = (isset($overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['variance'])) ? $overallProgressArr['project_id'][$this->currentYear][$this->currentMonth]['1B']['variance'] : 'M/A';
                }else{
                    $variance_physical_1B = "N/A";
                }

                $dashboardFooterClass = "desc";
                $progressBarHTML .= "<div class='title bold'>Overall Progress :</div>
                                        <div class='progressDesc'>";
                $progressBarHTML .= "<span>Current Month Physical Progress (%) : <span id=\"curr_month_physical\">1A :   <b>|</b> 1B :  </span></span>";
                $progressBarHTML .= "<span>Previous Month Physical Progress (%) : <span id=\"prev_month_physical\">1A : ".$prev_month_physical_1A." <b>|</b> 1B : ".$prev_month_physical_1B."</span></span>";
                $progressBarHTML .= "<span>Variance (%) : <span id=\"variance_physical\">1A : ".$variance_physical_1A." <b>|</b> 1B : ".$variance_physical_1B."</span>";
            }
        }

        if($this->projectOwner == 'JKR_SARAWAK'){
            $green = 'On Schedule';
            $yellow  = 'Delay Project';
            $red = 'Sick Project';
        }else{
            $green = 'On Track';
            $yellow  = 'Alarming';
            $red = 'Delay';
        }

        $divisionHTML .="
            </div>
            <div class= 'dashboardFooterExec ".$dashboardFooterClass."'>
                <div class='progressContainer ".$dashboardFooterClass."'>";
                        $divisionHTML .= $progressBarHTML;
                        $divisionHTML .="
                    </div>
                </div>
                <div class='indicatorContainer'>
                    <div class='filter-btn all' data-filter='all' style='--count: \"".$countAll."\";'>All</div>
                    <div class='filter-btn completed' data-filter='.completed' style='--count: \"".$countComplete."\";'>Completed</div>
                    <div class='filter-btn onTrack' data-filter='.onTrack' style='--count: \"".$countTrack."\";'>$green</div>
                    <div class='filter-btn alarming' data-filter='.alarming' style='--count: \"".$countAlarm."\";'>$yellow</div>
                    <div class='filter-btn delay' data-filter='.delay' style='--count: \"".$countDelay."\";'>$red</div>
                    <div class='filter-btn notAvailable' data-filter='.notAvailable' style='--count: \"".$countNA."\";'>Not Available</div>";
                    (isset($_SESSION['is_proj_manager']) && $_SESSION['is_proj_manager']) ? 
                    $divisionHTML .="<div class='setting' id='toggleSetting' onclick='openSetting()'><i class='fa-sharp fa-solid fa-gear'></i></div>"
                    : 
                    $divisionHTML .= "";

                    $divisionHTML .="
                </div>
            </div>
            <div class='filter-list'>
                <button class='close-btn' onclick='closeFilterList()'><i class='fa-solid fa-xmark'></i></button>
                <div class='filter-container'>
                    <div class='title'>Sort</div>
                    <div class='filtersort-container'>
                        <div class='filterContainer'>
                            <button class='sort-btn asc' data-sort='name:desc'><i class='fa-duotone fa-sort-up'></i><span class='atag'>Package Name</span></button>
                            <button class='sort-btn desc' data-sort='name:asc' style='display: none'><i class='fa-duotone fa-sort-down'></i><span class='atag'>Package Name</span></button>
                            <button class='sort-btn asc' data-sort='start-date:desc'><i class='fa-duotone fa-sort-up'></i><span class='atag'>Start Date</span></button>
                            <button class='sort-btn desc' data-sort='start-date:asc' style='display: none'><i class='fa-duotone fa-sort-down'></i><span class='atag'>Start Date</span></button>
                            <button class='sort-btn asc' data-sort='contract-amount:desc'><i class='fa-duotone fa-sort-up'></i> <span class='atag'>Contract Amount</span></button>
                            <button class='sort-btn desc' data-sort='contract-amount:asc' style='display: none'><i class='fa-duotone fa-sort-down'></i> <span class='atag'>Contract Amount</span></button>
                        </div>
                    </div>
                </div>
                <div class='filter-container bottom'>
                    <div class='title'>Filter</div>
                    <div class='filtersort-container'>
                        <div class='filterContainer inline-flex'>
                            <div class='filter-btn all' data-filter='all' style='--count: \"".$countAll."\";'>All</div>
                            <div class='filter-btn completed' data-filter='.completed' style='--count: \"".$countComplete."\";'>Completed</div>
                            <div class='filter-btn onTrack' data-filter='.onTrack' style='--count: \"".$countTrack."\";'>On Track</div>
                            <div class='filter-btn alarming' data-filter='.alarming' style='--count: \"".$countAlarm."\";'>Alarming</div>
                            <div class='filter-btn delay' data-filter='.delay' style='--count: \"".$countDelay."\";'>Delay</div>
                            <div class='filter-btn notAvailable' data-filter='.notAvailable' style='--count: \"".$countNA."\";'>Not Available</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='rangeSetting' id='rangeSetting'>
                <h5>Change label Range</h5>
                <div class='fieldContainer'>
                    <label>$green (%)</label><br>
                    <div class='flexContainer'>
                        <input type='number' id='green2' value='".$greenVal['1']."'>
                        to
                        <input type='number' id='green1' value='".$greenVal['0']."'>
                    </div>
                </div>
                <div class='fieldContainer'>
                    <label>$yellow (%)</label><br>
                    <div class='flexContainer'>
                        <input type='number' id='yellow2' value='".$yellowVal['1']."'>
                        to
                        <input type='number' id='yellow1' value='".$yellowVal['0']."'>
                    </div>
                </div>
                <div class='fieldContainer'>
                    <label>$red (%)</label><br>
                    <div class='flexContainer'>
                        <input type='number' id='red2' value='".$redVal['1']."'>
                        to
                        <input type='number' id='red1' value='".$redVal['0']."'>
                        </div>
                </div>
                <div class='buttonContainer'>
                    <button onclick='saveRange()'>Save</button>
                    <button onclick='closeSetting()'>Close</button>
                </div>
            </div>
        ";
        return $divisionHTML;
    }


    function fetchProjectProgress($packageUuid, $projectId){
        global $SYSTEM;
        $urlJogetApp = '';
		$ret = array();
        $fileExtension = ['docx', 'docm', 'dotm', 'dotx', 'doc', 'xlsx','xlsb', 'xls', 'xlsm', 'pptx', 'ppsx', 'ppt', 'pps', 'pptm', 'potm', 'ppam', 'potx', 'ppsm', 'pdf','txt','dwg','png','jpeg','jpg','mp4','mov','wmv','avi'];
        
        if($SYSTEM == 'OBYU'){
            $urlJogetApp = 'conOp';
        }else{
            $urlJogetApp = 'ri_construct';
        }

        if($this->projectOwner == 'OBYU'){
            $url = $this->jogetHost."jw/web/json/data/list/conOp/list_ppuForm?d-6463062-fn_package_id=" .$projectId;
        }else{
            $url = $this->jogetHost."jw/web/json/data/list/ri_construct/list_ppuForm?d-6463062-fn_package_uuid=" .$packageUuid;
        }

        $res = $this->jogetCURL($url);

        if (isset($res['data'])) {
            usort($res['data'], function($a, $b) {
                $aU = $a['date_report'];
                $bU = $b['date_report'];

                if ($aU == $bU) {
                    return strtotime($a['dateCreated']) - strtotime($b['dateCreated']);
                }

                return strtotime($aU) - strtotime($bU);
            });
            foreach ($res['data'] as $data) {
                
                // based on month and year
                $dateCreated = strtotime($data['date_report']);
                $year = date("Y", $dateCreated);
                $month = date("M", $dateCreated);

                if($data['section_yes_no'] == '' || $data['section_yes_no'] == 'No'){
                    if($data['c_attachment_img']){
                        $img = explode(';', $data['c_attachment_img']);
                        $ret['all']['overall'][$year][$month]['img'] = [];
                        foreach ($img as $imgData) {
                            $ret['all']['overall'][$year][$month]['img'][] = $this->jogetHost. "jw/web/client/app/" .$urlJogetApp. "/latest/form/download/project_progress/" .$data['id']. "/" .urlencode($imgData). ".";
                        }
                    }

                    if($data['c_attachment_video']){
                        $video = explode(';', $data['c_attachment_video']);
                        $ret['all']['overall'][$year][$month]['video'] = [];
                        foreach ($video as $videoData) {
                            $ret['all']['overall'][$year][$month]['video'][] = $this->jogetHost. "jw/web/client/app/" .$urlJogetApp. "/latest/form/download/project_progress/" .$data['id']. "/" .urlencode($videoData). ".";
                        }
                    }

                    if($data['attachment']){
                        $file = explode(';', $data['attachment']);
                        $ret['all']['overall'][$year][$month]['file'] = [];
                        $fileCreate = date("d/m/Y h:i A", strtotime($data['dateCreated']));
                        foreach ($file as $fileData) {
                            $ext = explode('.', $fileData);
                            $type = strtoupper($ext[1]);
                            $fileLink = $this->jogetHost. "jw/web/client/app/" .$urlJogetApp. "/latest/form/download/project_progress/" .$data['id']. "/" .($fileData). ".?attachment=true";
                            
                            if(in_array($ext[1], $fileExtension)){
                                $fileLinkLast = $this->riHost. "BackEnd/jogetDocViewer.php?src=" .urlencode($fileLink);
                            }
                            else{
                                $fileLinkLast = $fileLink;
                            }

                            if (!isset($ret['all']['overall'][$year][$month]['file'])) {
                                $ret['all']['overall'][$year][$month]['file'] = [];
                            }

                            $typeVal = (!empty($ext[1]) && is_string($ext[1])) ? "{$ext[1]} Document" : '';

                            $ret['all']['overall'][$year][$month]['file'][] = [
                                'link' => $fileLinkLast ? $fileLinkLast : '',
                                'name' => $fileData ? $fileData : '',
                                'date' => $fileCreate ? $fileCreate : '',
                                'type' => $typeVal ? $typeVal : ''
                            ];
    
                            
                        }
                    }

                    $ret['all']['overall'][$year][$month]['data'] = $data;

                }else{
                    if($this->projectOwner == 'JKR_SARAWAK'){
                        $ret['all'][$data['section']][$year][$month]['data'] = $data;
                    }
                }
            }
            
        }

        return $ret;
    }

    function fetchProjectFeature($packageUuid){
		$ret = array();

        $url = $this->jogetHost."jw/web/json/data/list/ri_construct/list_pfForm?d-7745017-fn_package_uuid=" .$packageUuid;
        $res = $this->jogetCURL($url);

        if (isset($res['data'])) {
            usort($res['data'], function($a, $b) {
                $aU = $a['dateModified'];
                $bU = $b['dateModified'];

                return strtotime($aU) - strtotime($bU);
            });

            foreach ($res['data'] as $data) {
                // based on month and year
                $dateCreated = strtotime($data['dateModified']);
                $year = date("Y", $dateCreated);
                $month = date("M", $dateCreated);
                
                $ret['all']['all']['all']['data'] = $data;
            }
            
        }
        return $ret;
    }

    function fetchPublicComplaintInfo($packageUuid){
        $ret = array();
		$pcCategoryArray = array();

        $url = $this->jogetHost."jw/web/json/data/list/ri_construct/dashPublicComplaintSabah?d-7827509-fn_package_uuid=" .$packageUuid;
        $res = $this->jogetCURL($url);
        if (isset($res['data'])) {
            foreach($res['data'] as $pc) {
                $dateCreated = strtotime($pc['date_received']);
                $year = date("Y", $dateCreated);
                $month = date("M", $dateCreated);

                $pcCategoryArray = explode(';', $pc['category']);
                foreach ($pcCategoryArray as $pc2){
                    if (isset($ret['overall']['pieChart']['all']['all'][$pc2])) {
                        $ret['overall']['pieChart']['all']['all'][$pc2]++;
                    }else{
                        $ret['overall']['pieChart']['all']['all'][$pc2] = 1;
                    }
                    if (isset($ret['overall']['pieChart'][$year]['all'][$pc2])) {
                        $ret['overall']['pieChart'][$year]['all'][$pc2]++;
                    }else{
                        $ret['overall']['pieChart'][$year]['all'][$pc2] = 1;
                    }
                    if (isset($ret['overall']['pieChart'][$year][$month][$pc2])) {
                        $ret['overall']['pieChart'][$year][$month][$pc2]++;
                    }else{
                        $ret['overall']['pieChart'][$year][$month][$pc2] = 1;
                    }
                }
                
            }
        }
		return $ret;
    }


    function setSessionDigitalReporting($projectId){
        $sql = "SELECT p.duration as duration, p.start_date as pstartdate, p.end_date as penddate, p.project_name as pname, p.project_id as pid, p.project_owner as powner, p.project_wpc_id as pwpcid, p.project_id_number as pnumber,  p.industry as ind, p.time_zone_text as timet, 
        p.time_zone_value as timev, p.location as loc, p.longitude_1 as long1,p.longitude_2 as long2, p.latitude_1 as lat1, p.latitude_2 as lat2, p.icon_url as icon, p.created_by as created_by, 
        p.created_time as created_time, p.updated_by as updated_by, p.last_update as last_update, p.parent_project_id_number as is_Parent, p.file_method as file_method, p.project_type as Project_type
        FROM projects p WHERE p.project_id=:0";

        $setSession = $this->db->fetchRow($sql, array($projectId));

        if($setSession){
            $_SESSION['project_id_number'] = $setSession['pnumber'];
            $_SESSION['project_name'] = $setSession['pname'];
            $_SESSION['projectID'] = $setSession['pid'];
            $_SESSION['Project_type'] = $setSession['Project_type'];

            $_SESSION['icon_url'] = $setSession['icon'];
            $_SESSION['file_method'] = trim($setSession['file_method']);
            $_SESSION['created_by'] = $setSession['created_by'];
            if (is_null($setSession['is_Parent'])) {
                $_SESSION['is_Parent'] = "isParent";
            } else {
                $_SESSION['is_Parent'] = $setSession['is_Parent'];
                $_SESSION['parent_project_id'] = ''; //because we doesnt select project_id for parent, but in dashboard.class we need this field
            };

            if(!is_null($setSession['pwpcid'])){
                $_SESSION['wpc_id'] = $setSession['pwpcid'];
            }else{
                $_SESSION['wpc_id'] = "";
            };
            
            $_SESSION['project_owner'] = $setSession['powner'];
        }

        $appsLinks = array();
        $sql2 = "SELECT * FROM project_apps_process WHERE project_id =:0";
       
        $result2 = $this->db->fetchRow($sql2, array($_SESSION['is_Parent']));
        if($result2){
            $_SESSION['appsLinks'] = json_encode($result2);
        }
    }

    function getExecutiveData($packageUuid, $projectId){
        $this->setSessionDigitalReporting($projectId);
        $ret = array();

        $execData = $this->fetchProjectProgress($packageUuid, $projectId);
        $projfeatureData = $this->fetchProjectFeature($packageUuid, $projectId);
        $weatherData = $this->fetchWeather($packageUuid, $projectId);
        $incidentData = $this->fetchIncident($packageUuid, $projectId);
        $riskData = $this->fetchRiskInfo($packageUuid, $projectId);
        $pubcData = $this->fetchPublicComplaintInfo($packageUuid, $projectId);
        $landData = $this->fetchLandSummaryData($packageUuid, $projectId);

        $this->contractInfo = $this->fetchContractPartSabah($projectId);
        if ($this->contractInfo) {
            $claimData = $this->fetchClaimDetailSabah($projectId);
        }

		$ret = array(
			'projectProg' => $execData,
			'projectFeature' => $projfeatureData,
            'sdWeather' => $weatherData,
            'incident' => $incidentData,
            'risk' => $riskData,
            'pubc' => $pubcData,
            'land' => $landData,
            'claim' => $claimData,
            'project_owner' => $this->projectOwner
		);
        
		return $ret;

    }

    function getSectionData($packageUuid, $projectId){
		$sectionUrl = $this->jogetHost.'jw/web/json/data/list/document_mgmt/list_lookupSection?d-3687296-fn_package_id='.$projectId.'&d-3687296-fn_package_uuid='.$packageUuid;
        $resSection = $this->jogetCURL($sectionUrl);
        if (isset($resSection['data'])){
            usort($resSection['data'], function($a, $b) {
                $aU = $a['dateCreated'];
                $bU = $b['dateCreated'];
                return strtotime($aU) - strtotime($bU);
            });

            $tempArr = $resSection['data'];
            $dataArr = array();
            foreach($resSection['data'] as $section){
                $dataArr[] = $section;
            }
        }
		return $dataArr;
    }

    function drawDashboardLayout(){
        $layoutHTML='';
        $color='';

        if($this->uiPref !== 'ri_v3'){
            $color = 'white';
        }

        if($this->projectOwner == 'JKR_SABAH'){
            $layoutHTML='
                <div class="rowOne L twoRow">
                    <div class="rowOne M twoColumn">
                        <div class="columnOne M twoColumn">
                            <div class="columnOne M twoRow round shadow container-full-screen">
                                <div class="rowOne-T roundT" style="position: relative">
                                    PROJECT PROGRESS
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn" style="color: '.$color.'"></i></button>
                                </div>
                                <div class="rowTwo-T scrollbar-inner roundB" id = "projectProgressTable">
                                </div>
                            </div>
                            <div class="columnTwo M twoRow shadow round container-full-screen">
                                <div class="rowOne-T roundT" style="position: relative">
                                    SITE DIARY (WEATHER)
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn" style="color: '.$color.'"></i></button>
                                </div>
                                <div class="rowTwo-T roundB" id = "weatherSDL">
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoColumn">
                            <div class="columnOne M twoRow shadow round container-full-screen">
                                <div class="rowOne-T roundT" style="position: relative">
                                    OVERALL ACCIDENT / INCIDENTS RECORD
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn" style="color: '.$color.'"></i></button>
                                </div>
                                <div class="rowTwo-T roundB" id = "OverallIncidentsAndAccidentsRecord">
                                </div>
                            </div>
                            <div class="columnTwo M twoRow shadow round container-full-screen">
                                <div class="rowOne-T roundT" style="position: relative">
                                    PUBLIC COMPLAINT
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn" style="color: '.$color.'"></i></button>
                                </div>
                                <div class="rowTwo-T roundB" id = "pcCatChart">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M twoColumn">
                        <div class="columnOne M40 twoColumn">
                            <div class="columnOne M twoRow round shadow container-full-screen">
                                <div class="rowOne-T roundT" style="position: relative">
                                    PROJECT FEATURE
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn" style="color: '.$color.'"></i></button>

                                </div>
                                <div class="rowTwo-T roundB scrollbar-inner" id = "projectFeatureTable">
                                </div>
                            </div>
                            <div class="columnTwo M twoRow">
                                <div class="rowOne SM twoRow round shadow">
                                    <div class="rowOne-T roundT">
                                        TOTAL CERTIFIED PAYMENT AMOUNT (RM)
                                    </div>
                                    <div class="rowTwo-T roundB scrollbar-inner" id = "ttlCertifiedPayment" style = "text-align:center;display: flex;align-items: center;justify-content: center;overflow-y: auto;">
                                    </div>
                                </div>
                                <div class="rowTwo ML twoRow round shadow container-full-screen">
                                    <div class="rowOne-T roundT" style="position: relative">
                                        FILE ATTACHMENT
                                        <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn" style="color: '.$color.'"></i></button>
                                    </div>
                                    <div class="rowTwo-T roundB scrollbar-inner" id="insert-nofile" style="padding: 0; width: 100%; height: calc(100% - 30px);">
                                        <table>
                                            <thead id="fileProgressHead">
                                                <tr class="header">
                                                    <th></th>
                                                    <th>Name</th>
                                                    <th>Last Update</th>
                                                    <th>Type</th>
                                                </tr>
                                            </thead>
                                            <tbody id = "fileProgress">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M60 twoRow round shadow round container-full-screen">
                            <div class="rowOne-T roundT" style="position: relative">
                                PAYMENT MADE FOR LAND
                                <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn" style="color: '.$color.'"></i></button>
                            </div>
                            <div class="rowTwo-T roundB twoColumn white-bg">
                                <div class="columnOne L" id = "offerIssuedChart">
                                </div>
                                <div class="columnTwo S flex">
                                    <div class="infoContainer">
                                        <div class="head">
                                            LAND
                                        </div>
                                        <div class="body body-height" id = "paymentLand">
                                        </div>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">
                                            STRUCTURE
                                        </div>
                                        <div class="body body-height" id = "paymentStructure">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowTwo S round white '.$this->projectOwner.'" id = "viewImageJoget">
                </div>
            ';
        }else if($this->projectOwner == 'JKR_SARAWAK' || $this->projectOwner == 'OBYU'){
            $layoutHTML='
                <div class="rowOne L twoRow">
                    <div class="rowOne M twoColumn">
                        <div class="columnOne M twoColumn">
                            <div class="columnOne M twoRow shadow round">
                                <div class="rowOne-T roundT">
                                    DESCRIPTION
                                </div>
                                <div class="rowTwo-T roundB fontSize" id = "descProgress">
                                </div>
                            </div>
                            <div class="columnTwo M twoRow shadow round">
                                <div class="rowOne-T roundT">
                                    PROBLEM / REASON FOR DELAY
                                </div>
                                <div class="rowTwo-T roundB fontSize" id = "problemProgress">
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoColumn">
                            <div class="columnOne M twoRow shadow round">
                                <div class="rowOne-T roundT">
                                    IMPLICATION TO PROJECT
                                </div>
                                <div class="rowTwo-T roundB fontSize" id = "implicationProgress">
                                </div>
                            </div>
                            <div class="columnTwo M twoRow shadow round">
                                <div class="rowOne-T roundT">
                                    ACTION PLAN (PM)
                                </div>
                                <div class="rowTwo-T roundB fontSize" id = "actionSorProgress">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M twoColumn">
                        <div class="columnOne M twoColumn">
                            <div class="columnOne M twoRow shadow round">
                                <div class="rowOne-T roundT roundT">
                                    ACTION PLAN (PO)
                                </div>
                                <div class="rowTwo-T roundB fontSize" id = "actionpoProgress">
                                </div>
                            </div>
                            <div class="columnTwo M twoRow shadow round">
                                <div class="rowOne-T roundT">
                                    SPC COMMENTS
                                </div>
                                <div class="rowTwo-T roundB fontSize" id = "spcProgress">
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoColumn">
                            <div class="columnOne M twoRow shadow round">
                                <div class="rowOne-T roundT">
                                    QS IN-CHARGE
                                </div>
                                <div class="rowTwo-T roundB fontSize" id = "qsProgress">
                                </div>
                            </div>
                            <div class="columnTwo M twoRow shadow round">
                                <div class="rowOne-T roundT">
                                    FILE ATTACHMENT
                                </div>
                                <div class="rowTwo-T roundB" id="insert-nofile" style="padding: 0; width: 100%; height: calc(100% - 30px);">
                                    <table>
                                        <thead id="fileProgressHead">
                                        <tr class="header">
                                                <th></th>
                                                <th>Name</th>
                                                <th>Last Update</th>
                                                <th>Type</th>
                                            </tr>
                                        </thead>
                                        <tbody id = "fileProgress">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowTwo S '.$this->projectOwner.'" id = "viewImageJoget">
                </div>
            ';
        }
        return $layoutHTML;
    }

    function fetchWeather($packageUuid){
		$ret = array();
        $url = $this->jogetHost."jw/web/json/data/list/ri_construct/dashSiteDailyLogSarawak?d-3277002-fn_package_uuid=" .$packageUuid;
        $res = $this->jogetCURL($url);
        if (isset($res['data']) && $res['data']) {
            foreach ($res['data'] as $sd) {
                // based on month and year
                $dateCreated = strtotime($sd['submission_date']);
                $year = date("Y", $dateCreated);
                $month = date("M", $dateCreated);

                if($this->projectOwner == "JKR_SABAH"){
                    // weather
                    if (isset($ret['overall']['all']['all']['weather']['sunny'])) {
                        $ret['overall']['all']['all']['weather']['sunny'] = $ret['overall']['all']['all']['weather']['sunny'] + (float) $sd['count_weather_s'];
                    }else{
                        $ret['overall']['all']['all']['weather']['sunny'] = (float) $sd['count_weather_s'];
                    }

                    if (isset($ret['overall']['all']['all']['weather']['cloudy'])) {
                        $ret['overall']['all']['all']['weather']['cloudy'] = $ret['overall']['all']['all']['weather']['cloudy'] + (float) $sd['count_weather_c'];
                    }else{
                        $ret['overall']['all']['all']['weather']['cloudy']  = (float) $sd['count_weather_c'];
                    }
                    
                    if (isset($ret['overall']['all']['all']['weather']['rain'])){
                        $ret['overall']['all']['all']['weather']['rain'] = $ret['overall']['all']['all']['weather']['rain'] + (float) $sd['count_weather_r'];
                    }else{
                        $ret['overall']['all']['all']['weather']['rain'] = (float) $sd['count_weather_r'];
                    }

                    if (isset($ret['overall']['all']['all']['weather']['drizzle'])) {
                        $ret['overall']['all']['all']['weather']['drizzle'] = $ret['overall']['all']['all']['weather']['drizzle'] + (float) $sd['count_weather_d'];
                    }else{
                        $ret['overall']['all']['all']['weather']['drizzle'] = (float) $sd['count_weather_d'];
                    }

                    // weather for year
                    if (isset($ret['overall'][$year]['all']['weather']['sunny'])) {
                        $ret['overall'][$year]['all']['weather']['sunny'] = $ret['overall'][$year]['all']['weather']['sunny'] + (float) $sd['count_weather_s'];
                    }else{
                        $ret['overall'][$year]['all']['weather']['sunny'] = (float) $sd['count_weather_s'];
                    }

                    if (isset($ret['overall'][$year]['all']['weather']['cloudy'])) {
                        $ret['overall'][$year]['all']['weather']['cloudy'] = $ret['overall'][$year]['all']['weather']['cloudy'] + (float) $sd['count_weather_c'];
                    }else{
                        $ret['overall'][$year]['all']['weather']['cloudy']  = (float) $sd['count_weather_c'];
                    }
                    
                    if (isset($ret['overall'][$year]['all']['weather']['rain'])){
                        $ret['overall'][$year]['all']['weather']['rain'] = $ret['overall'][$year]['all']['weather']['rain'] + (float) $sd['count_weather_r'];
                    }else{
                        $ret['overall'][$year]['all']['weather']['rain'] = (float) $sd['count_weather_r'];
                    }

                    if (isset($ret['overall'][$year]['all']['weather']['drizzle'])) {
                        $ret['overall'][$year]['all']['weather']['drizzle'] = $ret['overall'][$year]['all']['weather']['drizzle'] + (float) $sd['count_weather_d'];
                    }else{
                        $ret['overall'][$year]['all']['weather']['drizzle'] = (float) $sd['count_weather_d'];
                    }

                    // weather for year & month
                    if (isset($ret['overall'][$year][$month]['weather']['sunny'])) {
                        $ret['overall'][$year][$month]['weather']['sunny'] = $ret['overall'][$year][$month]['weather']['sunny'] + (float) $sd['count_weather_s'];
                    }else{
                        $ret['overall'][$year][$month]['weather']['sunny'] = (float) $sd['count_weather_s'];
                    }

                    if (isset($ret['overall'][$year][$month]['weather']['cloudy'])) {
                        $ret['overall'][$year][$month]['weather']['cloudy'] = $ret['overall'][$year][$month]['weather']['cloudy'] + (float) $sd['count_weather_c'];
                    }else{
                        $ret['overall'][$year][$month]['weather']['cloudy']  = (float) $sd['count_weather_c'];
                    }
                    
                    if (isset($ret['overall'][$year][$month]['weather']['rain'])){
                        $ret['overall'][$year][$month]['weather']['rain'] = $ret['overall'][$year][$month]['weather']['rain'] + (float) $sd['count_weather_r'];
                    }else{
                        $ret['overall'][$year][$month]['weather']['rain'] = (float) $sd['count_weather_r'];
                    }

                    if (isset($ret['overall'][$year][$month]['weather']['drizzle'])) {
                        $ret['overall'][$year][$month]['weather']['drizzle'] = $ret['overall'][$year][$month]['weather']['drizzle'] + (float) $sd['count_weather_d'];
                    }else{
                        $ret['overall'][$year][$month]['weather']['drizzle'] = (float) $sd['count_weather_d'];
                    }

                }
            }
        }

        
		return $ret;
	}

    function fetchIncident($packageUuid) {
        $info = [];

        $url = $this->jogetHost."jw/web/json/data/list/ri_construct/dashIncidentSarawak?d-249074-fn_package_uuid=" .$packageUuid;
        $res = $this->jogetCURL($url);

        if(isset($res['data'])){
            foreach ($res['data'] as $val) {
                $dateCreated = strtotime($val['date_incident']);
                $year = date("Y", $dateCreated);
                $month = date("M", $dateCreated);

                if (isset($info['overall']['card']['all']['all']['total'])) {
                    $info['overall']['card']['all']['all']['total'] ++;
                }else{
                    $info['overall']['card']['all']['all']['total'] = 1;
                }
                if (isset($info['overall']['card'][$year]['all']['total'])) {
                    $info['overall']['card'][$year]['all']['total'] ++;
                }else{
                    $info['overall']['card'][$year]['all']['total'] = 1;
                }
                if (isset($info['overall']['card'][$year][$month]['total'])) {
                    $info['overall']['card'][$year][$month]['total'] ++;
                }else{
                    $info['overall']['card'][$year][$month]['total'] = 1;
                }

                if (isset($info['overall']['byCat']['all']['all'][$val['incident_category']])) {
                    $info['overall']['byCat']['all']['all'][$val['incident_category']] ++;
                }else{
                    $info['overall']['byCat']['all']['all'][$val['incident_category']] = 1;
                }
                if (isset($info['overall']['byCat'][$year]['all'][$val['incident_category']])) {
                    $info['overall']['byCat'][$year]['all'][$val['incident_category']] ++;
                }else{
                    $info['overall']['byCat'][$year]['all'][$val['incident_category']] = 1;
                }
                if (isset($info['overall']['byCat'][$year][$month][$val['incident_category']])) {
                    $info['overall']['byCat'][$year][$month][$val['incident_category']] ++;
                }else{
                    $info['overall']['byCat'][$year][$month][$val['incident_category']] = 1;
                }
                
                $fatality = ($val['fatality_number']) ? (int)$val['fatality_number'] : 0;				
                $info['overall']['fatalityCnt']['all']['all']['total'] = (isset($info['overall']['fatalityCnt']['all']['all']['total'])) ? $info['overall']['fatalityCnt']['all']['all']['total']+$fatality : $fatality;
                $info['overall']['fatalityCnt'][$year]['all']['total'] = (isset($info['overall']['fatalityCnt'][$year]['all']['total'])) ? $info['overall']['fatalityCnt'][$year]['all']['total']+$fatality : $fatality;
                $info['overall']['fatalityCnt'][$year][$month]['total'] = (isset($info['overall']['fatalityCnt'][$year][$month]['total'])) ? $info['overall']['fatalityCnt'][$year][$month]['total']+$fatality : $fatality;
            }
        }
        return $info;
    }

    function fetchRiskInfo($packageUuid){
		$ret = array();
        $url = $this->jogetHost."jw/web/json/data/list/ri_construct/dashRiskSabah?d-4995432-fn_package_uuid=" .$packageUuid;
        $res = $this->jogetCURL($url);
        if (isset($res['data'])) {
            foreach ($res['data'] as $risk) {
                $dateCreated = strtotime($risk['dateCreated']);
                $year = date("Y", $dateCreated);
                $month = date("M", $dateCreated);

                // category
                if (isset($ret['overall']['category']['all']['all'][$risk['c_risk_category']])) {
                    $ret['overall']['category']['all']['all'][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category']['all']['all'][$risk['c_risk_category']] = 1;
                }
                if (isset($ret['overall']['category']['all']['all'][$risk['c_risk_category']])) {
                    $ret['overall']['category']['all']['all'][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category']['all']['all'][$risk['c_risk_category']] = 1;
                }
                if (isset($ret['overall']['category']['all']['all'][$risk['c_risk_category']])) {
                    $ret['overall']['category']['all']['all'][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category']['all']['all'][$risk['c_risk_category']] = 1;
                }
                if (isset($ret['overall']['category']['all']['all'][$risk['c_risk_category']])) {
                    $ret['overall']['category']['all']['all'][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category']['all']['all'][$risk['c_risk_category']] = 1;
                }

                if (isset($ret['overall']['category'][$year]['all'][$risk['c_risk_category']])) {
                    $ret['overall']['category'][$year]['all'][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category'][$year]['all'][$risk['c_risk_category']] = 1;
                }
                if (isset($ret['overall']['category'][$year]['all'][$risk['c_risk_category']])) {
                    $ret['overall']['category'][$year]['all'][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category'][$year]['all'][$risk['c_risk_category']] = 1;
                }
                if (isset($ret['overall']['category'][$year]['all'][$risk['c_risk_category']])) {
                    $ret['overall']['category'][$year]['all'][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category'][$year]['all'][$risk['c_risk_category']] = 1;
                }
                if (isset($ret['overall']['category'][$year]['all'][$risk['c_risk_category']])) {
                    $ret['overall']['category'][$year]['all'][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category'][$year]['all'][$risk['c_risk_category']] = 1;
                }

                if (isset($ret['overall']['category'][$year][$month][$risk['c_risk_category']])) {
                    $ret['overall']['category'][$year][$month][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category'][$year][$month][$risk['c_risk_category']] = 1;
                }
                if (isset($ret['overall']['category'][$year][$month][$risk['c_risk_category']])) {
                    $ret['overall']['category'][$year][$month][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category'][$year][$month][$risk['c_risk_category']] = 1;
                }
                if (isset($ret['overall']['category'][$year][$month][$risk['c_risk_category']])) {
                    $ret['overall']['category'][$year][$month][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category'][$year][$month][$risk['c_risk_category']] = 1;
                }
                if (isset($ret['overall']['category'][$year][$month][$risk['c_risk_category']])) {
                    $ret['overall']['category'][$year][$month][$risk['c_risk_category']]++;
                }else{
                    $ret['overall']['category'][$year][$month][$risk['c_risk_category']] = 1;
                }
            }
        }
		return $ret;
	}

    function fetchLandSummaryData($packageUuid){
		$ret = array();
        $monthHalftext = ['01'=>"Jan",'02'=>"Feb",'03'=>"Mar",'04'=>"Apr",'05'=>"May",'06'=>"Jun",'07'=>"Jul",'08'=>"Aug",'09'=>"Sep",'10'=>"Oct",'11'=>"Nov",'12'=>"Dec"];

        $url = $this->jogetHost."jw/web/json/data/list/ri_construct/dashLandSummarySabah?d-2795044-fn_package_uuid=" .$packageUuid;
        $res = $this->jogetCURL($url);
        if (isset($res['data'])) {
            // sort by date and month
            $dataArr = $res['data'];
            usort($dataArr, function($a, $b) {
                return strtotime('01-'.$a['month'].'-'.$a['year']) - strtotime('01-'.$b['month'].'-'.$b['year']);
            });
            // overall->card->year->month
            // overall->chart->

            //HAZIRAH ADD
            $value1 = 0;
            $value2 = 0;

            foreach($dataArr as $summary) {
                //-----------CARD
                //------------payment made
                if(isset($ret['overall']['card'][$summary['year']][$monthHalftext[$summary['month']]]['paymentLand'])){
                    $valueUse = explode("/", $ret['overall']['card'][$summary['year']][$monthHalftext[$summary['month']]]['paymentLand']);
                    $value1 = $valueUse[0] + (float) $summary['land_total_payment_done'];
                    $value2 = $valueUse[1] + ((float) $summary['land_total_payment_done'] + (float) $summary['land_total_payment_not_done']);

                    $ret['overall']['card'][$summary['year']][$monthHalftext[$summary['month']]]['paymentLand'] = $value1 ."/". $value2;
                }
                else{
                    $ret['overall']['card'][$summary['year']][$monthHalftext[$summary['month']]]['paymentLand'] = (float) $summary['land_total_payment_done'] ."/". ((float) $summary['land_total_payment_done'] + (float) $summary['land_total_payment_not_done']);
                }

                if(isset($ret['overall']['card'][$summary['year']][$monthHalftext[$summary['month']]]['paymentStructure'])){
                    $valueUse = explode("/", $ret['overall']['card'][$summary['year']][$monthHalftext[$summary['month']]]['paymentStructure']);
                    $value1 = $valueUse[0] + (float) $summary['structure_total_payment_done'];
                    $value2 = $valueUse[1] + (float) $summary['structure_total_offer_issued'];

                    $ret['overall']['card'][$summary['year']][$monthHalftext[$summary['month']]]['paymentStructure'] = $value1 ."/". $value2;
                }
                else{
                    $ret['overall']['card'][$summary['year']][$monthHalftext[$summary['month']]]['paymentStructure'] = (float) $summary['structure_total_payment_done'] ."/". (float) $summary['structure_total_offer_issued'];
                }

                //-----------CHART
                //------------ALLDISTRICT
                if(isset($ret['overall']['chart']['all']['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'])){
                    $ret['overall']['chart']['all']['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'] = $ret['overall']['chart']['all']['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'] + (float) $summary['structure_total_payment_done'];
                }else{
                    $ret['overall']['chart']['all']['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'] = (float) $summary['structure_total_payment_done'];
                }

                if(isset($ret['overall']['chart']['all']['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'])){
                    $ret['overall']['chart']['all']['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'] = $ret['overall']['chart']['all']['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'] + (float) $summary['land_total_payment_done'];
                }else{
                    $ret['overall']['chart']['all']['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'] = (float) $summary['land_total_payment_done'];
                }

                if(isset($ret['overall']['chart'][$summary['year']]['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'])){
                    $ret['overall']['chart'][$summary['year']]['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'] = $ret['overall']['chart'][$summary['year']]['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'] + (float) $summary['structure_total_payment_done'];
                }else{
                    $ret['overall']['chart'][$summary['year']]['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'] = (float) $summary['structure_total_payment_done'];
                }

                if(isset($ret['overall']['chart'][$summary['year']]['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'])){
                    $ret['overall']['chart'][$summary['year']]['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'] = $ret['overall']['chart'][$summary['year']]['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'] + (float) $summary['land_total_payment_done'];
                }else{
                    $ret['overall']['chart'][$summary['year']]['all']['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'] = (float) $summary['land_total_payment_done'];
                }

                if(isset($ret['overall']['chart'][$summary['year']][$monthHalftext[$summary['month']]]['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'])){
                    $ret['overall']['chart'][$summary['year']][$monthHalftext[$summary['month']]]['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'] = $ret['overall']['chart'][$summary['year']][$monthHalftext[$summary['month']]]['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'] + (float) $summary['structure_total_payment_done'];
                }else{
                    $ret['overall']['chart'][$summary['year']][$monthHalftext[$summary['month']]]['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['structure'] = (float) $summary['structure_total_payment_done'];
                }

                if(isset($ret['overall']['chart'][$summary['year']][$monthHalftext[$summary['month']]]['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'])){
                    $ret['overall']['chart'][$summary['year']][$monthHalftext[$summary['month']]]['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'] = $ret['overall']['chart'][$summary['year']][$monthHalftext[$summary['month']]]['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'] + (float) $summary['land_total_payment_done'];
                }else{
                    $ret['overall']['chart'][$summary['year']][$monthHalftext[$summary['month']]]['paymentMade'][$summary['month'].'-'.$summary['year']][$summary['district']]['land'] = (float) $summary['land_total_payment_done'];
                }
            }
        }
		return $ret;
	}

    function id_compareSabah($b, $a){
	    $t1 = $a['contract_id'];
	    $t2 = $b['contract_id'];
	    return $t1 - $t2;
	}

    function fetchContractPartSabah($projectId){
		$ret = array();

        $url = $this->jogetHost."jw/web/json/data/list/pfs/dashboardContractList?d-1181898-fn_status=complete&d-1181898-fn_project_id=" .$projectId;
        $resContract = $this->jogetCURL($url);

        if (isset($resContract['data'])) {
            $tempArr = $resContract['data'];
            // sort by id and take only latest one
            
            $dataArr = array();
            foreach ($tempArr as $val) {
                if ($val['archive'] != 'true') {
                    $dataArr[] = $val;
                }
            }
            usort($dataArr, array($this, 'id_compareSabah'));
            $tempArr = array();
            if(isset($dataArr['0'])) {
                // take only latest one, and change the date format
                // completion_date, loa_date, revised_completion_date
                $currContractArr = $dataArr[0];

                if($currContractArr['revised_completion_date']){
                    $currContractArr['revised_completion_date'] = date('d-m-Y', strtotime($currContractArr['revised_completion_date']));
                }

                if($currContractArr['loa_date']){
                    $currContractArr['loa_date'] = date('d-m-Y', strtotime($currContractArr['loa_date']));
                }

                if($currContractArr['site_possession_date']){
                    $currContractArr['site_possession_date'] = date('d-m-Y', strtotime($currContractArr['site_possession_date']));
                }

                if($currContractArr['completion_date']){
                    $currContractArr['completion_date'] = DateTime::createFromFormat('d/m/Y', $currContractArr['completion_date'])->format('d-m-Y');
                }

                $tempArr = $currContractArr;
            }
            $ret['overall'] = $tempArr;
        }

		return $ret;
	}

    function fetchClaimDetailSabah($projectId){
		$ret = array();
		if (!$this->contractInfo) return;

        if (!isset($this->contractInfo['overall']['contract_id'])) return;

        $contractId = $this->contractInfo['overall']['contract_id'] ?? "";

        $url = $this->jogetHost."jw/web/json/data/list/pfs/claimDashboardViewList?status1=Complete&status2=Updated&status3=IPC%20Approved&status4=Payment%20Received&d-6627213-fn_contract_id_string=".$contractId."&d-6627213-fn_project_id=".$projectId;
        $res = $this->jogetCURL($url);
        if(isset($res['data'])){
            foreach ($res['data'] as $co) {
                // based on month and year
                $dateCreated = strtotime($co['interim_date_submission']);
                $year = date("Y", $dateCreated);
                $month = date("M", $dateCreated);

                if(isset($ret['overall']['all']['calculateCard']['totalIpcRecAmount'])){
                    $ret['overall']['all']['calculateCard']['totalIpcRecAmount'] = $ret['overall']['all']['calculateCard']['totalIpcRecAmount'] + (double) str_replace(",", "", $co['certified_claim_amount']);
                }
                else{
                    $ret['overall']['all']['calculateCard']['totalIpcRecAmount'] = (double) str_replace(",", "", $co['certified_claim_amount']);
                }
                if(isset($ret['overall'][$year]['calculateCard']['totalIpcRecAmount'])){
                    $ret['overall'][$year]['calculateCard']['totalIpcRecAmount'] = $ret['overall'][$year]['calculateCard']['totalIpcRecAmount'] + (double) str_replace(",", "", $co['certified_claim_amount']);
                }
                else{
                    $ret['overall'][$year]['calculateCard']['totalIpcRecAmount'] = (double) str_replace(",", "", $co['certified_claim_amount']);
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
?>
