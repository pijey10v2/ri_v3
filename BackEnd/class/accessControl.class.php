<?php
//V3 file
class accessControl
{
    var $accessArr = array();
    var $controlArr = array();
    var $compareArr = array();
    var $setupArr = array();
    var $updateArr = array();
    var $bulkApprovalArr = array();


    function __construct(){
        global $SYSTEM, $IS_DOWNSTREAM;

        if($SYSTEM == 'KKR'){
            $this->loadAccessKKR();
        }else{
            $this->loadAccessOBYU();
        }   
    }

    function loadAccessKKR(){
        global $IS_DOWNSTREAM;
        
        $appListsEncode = isset($_SESSION['appsLinks']) ? json_decode($_SESSION['appsLinks'], true) : [];
        $addOwner = ($_SESSION['project_owner']) ? $_SESSION['project_owner'] : ""; 

        if($appListsEncode){
            if(!isset($appListsEncode['constructPackage_name'])){
                return;
            }

            $skipArr = ['project_id', 'constructPackage_name', 'financePackage_name', 'documentPackage_name'];
            foreach ($appListsEncode as $k => $v) {
                if(in_array($k, $skipArr)) continue;

                
                if($_SESSION['Project_type'] == 'ASSET'){
                    $oriName = explode('_', $k);
                    if(isset($oriName[2])){
                        $this->accessArr[$oriName[2]] = $v;
                    }
                }else{
                    $oriName = explode('_', $k);
                    $this->accessArr[$oriName[1]] = $v;

                }
                
            }
        }

        if($_SESSION['Project_type'] == 'CONSTRUCT'){

            if($_SESSION['project_owner'] == 'JKR_SABAH'){
                if($_SESSION['project_phase'] == '1B'){
                    $linkFile = dirname(__FILE__)."\..\access\accessControl_".$addOwner."_1B.json";
                }else{
                    $linkFile = dirname(__FILE__)."\..\access\accessControl_".$addOwner.".json";
                }
            }else if($_SESSION['project_owner'] == 'SSLR2'){
                if($IS_DOWNSTREAM){
                    $linkFile = dirname(__FILE__)."\..\access\accessControl_SSLR2_DOWNSTREAM.json";
                }else{
                    $linkFile = dirname(__FILE__)."\..\access\accessControl_SSLR2.json";
                }
            }else{
                $linkFile = dirname(__FILE__)."\..\access\accessControl_".$addOwner.".json";
            }

            if(file_exists($linkFile)){
                $access_control = json_decode(file_get_contents($linkFile), true);
            }
            else{
                $access_control = json_decode(file_get_contents("../BackEnd/accessControl.json"), true);
            }
        }else{

            $linkFile = dirname(__FILE__)."\..\access\accessControlAsset_".$addOwner.".json";

            if(file_exists($linkFile)){
                $access_control = json_decode(file_get_contents($linkFile), true);
            }
            else{
                $access_control = json_decode(file_get_contents("../BackEnd/accessControlAsset.json"), true);
            }
        }

        $roleUser = isset($_SESSION['project_role']) ? $_SESSION['project_role'] : 'noRole';
        
        if($_SESSION['Project_type'] == 'CONSTRUCT'){
            if (isset($access_control[$roleUser]['Construct']) && $access_control[$roleUser]['Construct']) {
                foreach ($access_control[$roleUser]['Construct'] as $key => $val) {
                    $this->controlArr[$key] = $val;
                }
            }
        }else{
            if (isset($access_control[$roleUser]['Asset']) && $access_control[$roleUser]['Asset']) {
                foreach ($access_control[$roleUser]['Asset'] as $key => $val) {
                    $this->controlArr[$key] = $val;
                }
            }
        }

        //this->accessArr -> from DB
        //this->controlArr -> from access control
        if($this->accessArr && $this->controlArr){
            $assetMainMenu = array('RM','PM','EW','RFI','NCP','PAU');
            $assetMenuRM = array('RM','PM','EW','RFI','NCP','PAU','RI','AM','WP','WA','WI','DR','NOD','IVR','BRG','CVT','DRG','PAVE','RF','SLP');
            $assetMenuPM = array('RM','PM','EW','RFI','NCP','PAU','WO','WB');
            $assetMenuEW = array('RM','PM','EW','RFI','NCP','PAU','NOE','GAR','WDR');
            $assetMenu = array('RM','PM','EW','RI','AM','WP','WA','WI','DR','NOD','IVR','WO','WB','NOE','GAR','WDR','RFI','NCP','PAU','BRG','CVT','DRG','PAVE','RF','SLP');

            if($_SESSION['Project_type'] == 'CONSTRUCT'){
                foreach ($this->accessArr as $index => $true) {
                    if($true == "1"){
                        foreach ($this->controlArr as $index2 => $true2) {
                            if($index == $index2){
    
                                if($true2['create']){
                                    if(isset($true2['org'])){
                                        $this->compareArr[$index]['ORG'][$true2['org']] = true;
                                    }
                                    else{
                                        $this->compareArr[$index]['ORG'][$addOwner] = true;
                                    }
                                }
                                else{
                                    $this->compareArr[$index] = false;
                                }
    
                                if(isset($true2['update']) && $true2['update']){
                                    $this->updateArr[$index]['Manage'] = true;
                                }

                                if(isset($true2['bulkApproval']) && $true2['bulkApproval']){
                                    $this->bulkApprovalArr[$index] = true;
                                }
    
                            }
    
                            if($index2 == 'SETUP'){
                                $this->setupArr = $true2;
                            }
                            else{
                                $this->setupArr = false;
                            }
                        }
                    }
                    else{
                        $this->compareArr[$index] = false;
                    }
                }
            }else{
                foreach ($this->accessArr as $index => $true) {
                    if($true == "1"){
                        if(strtoupper($index) == 'RM'){
                            foreach ($this->controlArr as $index2 => $true2) {
                                if(in_array($index2, $assetMenuRM)){
                                    if($true2['create']){
                                        $this->compareArr[$index2] = true;
                                    }
                                    else{
                                        $this->compareArr[$index2] = false;
                                    }
                                }
                            }
                        }else if(strtoupper($index) == 'PM'){
                            foreach ($this->controlArr as $index2 => $true2) {
                                if(in_array($index2, $assetMenuPM)){
                                    if($true2['create']){
                                        $this->compareArr[$index2] = true;
                                    }
                                    else{
                                        $this->compareArr[$index2] = false;
                                    }
                                }
                            }
                        }else if(strtoupper($index) == 'EW'){
                            foreach ($this->controlArr as $index2 => $true2) {
                                if(in_array($index2, $assetMenuEW)){
                                    if($true2['create']){
                                        $this->compareArr[$index2] = true;
                                    }
                                    else{
                                        $this->compareArr[$index2] = false;
                                    }
                                }
                            }
                        }else{
                            foreach ($this->controlArr as $index2 => $true2) {
                                if(in_array($index2, $assetMainMenu)){
                                    if($true2['create']){
                                        $this->compareArr[$index2] = true;
                                    }
                                    else{
                                        $this->compareArr[$index2] = false;
                                    }
                                }
                            }
                        }
                    }else{
                        $this->compareArr[$index] = false;
                    }
                }

                foreach ($this->controlArr as $index2 => $true2) {
                    if(in_array($index2, $assetMenu)){
                        if(isset($true2['update']) && $true2['update']){
                            $this->updateArr[$index2]['Manage'] = true;
                        }
                    }
                }
            }

            //FOR BUMI, PROJECT SCHEDULE UPLOAD & MONTHLY ATTACHMENT UPLOAD
            foreach ($this->controlArr as $index2 => $true2) {
                if($index2 == 'BR'){
                    if($true2['create']){
                        if(isset($true2['org'])){
                            $this->compareArr[$index2]['ORG'][$true2['org']] = true;
                        }
                        else{
                            $this->compareArr[$index2]['ORG'][$addOwner] = true;
                        }
                    }
                    else{
                        $this->compareArr[$index2] = false;
                    }
                }
                if($index2 == 'PSU'){
                    if($true2['create']){
                        if(isset($true2['org'])){
                            $this->compareArr[$index2]['ORG'][$true2['org']] = true;
                        }
                        else{
                            $this->compareArr[$index2]['ORG'][$addOwner] = true;
                        }
                    }
                    else{
                        $this->compareArr[$index2] = false;
                    }
                }
                if($index2 == 'MAU'){
                    if($true2['create']){
                        if(isset($true2['org'])){
                            $this->compareArr[$index2]['ORG'][$true2['org']] = true;
                        }
                        else{
                            $this->compareArr[$index2]['ORG'][$addOwner] = true;
                        }
                    }
                    else{
                        $this->compareArr[$index2] = false;
                    }

                    if(isset($true2['update']) && $true2['update']){
                        $this->updateArr[$index2]['Manage'] = true;
                    }
                }
            }
        }
    }

    function loadAccessOBYU(){
        $appListsEncode = isset($_SESSION['appsLinks']) ? json_decode($_SESSION['appsLinks'], true) : [];
        $addOwner = ($_SESSION['project_owner']) ? $_SESSION['project_owner'] : ""; 
        $userOrganization = ($_SESSION['user_org']) ? $_SESSION['user_org'] : "";

        if($appListsEncode){
            if(!isset($appListsEncode['constructPackage_name'])){
                return;
            }
            
            $skipArr = ['project_id', 'constructPackage_name', 'financePackage_name', 'documentPackage_name'];
            foreach ($appListsEncode as $k => $v) {
                if(in_array($k, $skipArr)) continue;
                $oriName = explode('_', $k);
                $this->accessArr[$oriName[1]] = $v;
            }
        }

        
        $linkFile = dirname(__FILE__)."\..\access\accessControl_".$addOwner.".json";

        if(file_exists($linkFile)){
            $access_control = json_decode(file_get_contents($linkFile), true);
        }
        else{
            $access_control = json_decode(file_get_contents("../BackEnd/accessControl.json"), true);
        }

        $roleUser = isset($_SESSION['project_role']) ? $_SESSION['project_role'] : 'noRole';

        if (isset($access_control[$roleUser]['Construct'])) {
            foreach ($access_control[$roleUser]['Construct'] as $key => $val) {
                $this->controlArr[$key] = $val;
            }
        }

        //this->accessArr -> from DB
        //this->controlArr -> from access control
        if($this->accessArr && $this->controlArr){
            
            foreach ($this->accessArr as $index => $true) {
                if($true == "1"){
                    foreach ($this->controlArr as $index2 => $true2) {
                        if($index == $index2){
                            if($true2['create']){
                                if(isset($true2['org'])){
                                    $this->compareArr[$index]['ORG'][$true2['org']] = true;
                                }
                                else{
                                    $this->compareArr[$index]['ORG'][$userOrganization] = true;
                                }
                            }
                            else{
                                $this->compareArr[$index] = false;
                            }

                            if(isset($true2['update']) && $true2['update']){
                                $this->updateArr[$index]['Manage'] = true;
                            }

                        }

                        if($index2 == 'SETUP'){
                            $this->setupArr = $true2;
                        }
                        else{
                            $this->setupArr = false;
                        }
                    }
                }
                else{
                    $this->compareArr[$index] = false;
                }
            }

            //FOR BUMI, PROJECT SCHEDULE UPLOAD & MONTHLY ATTACHMENT UPLOAD
            foreach ($this->controlArr as $index2 => $true2) {
                if($index2 == 'BR'){
                    if($true2['create']){
                        if(isset($true2['org'])){
                            $this->compareArr[$index2]['ORG'][$true2['org']] = true;
                        }
                        else{
                            $this->compareArr[$index2]['ORG'][$userOrganization] = true;
                        }
                    }
                    else{
                        $this->compareArr[$index2] = false;
                    }
                }
                if($index2 == 'PSU'){
                    if($true2['create']){
                        if(isset($true2['org'])){
                            $this->compareArr[$index2]['ORG'][$true2['org']] = true;
                        }
                        else{
                            $this->compareArr[$index2]['ORG'][$userOrganization] = true;
                        }

                    }
                    else{
                        $this->compareArr[$index2] = false;
                    }
                }
                if($index2 == 'MAU'){
                    if($true2['create']){
                        if(isset($true2['org'])){
                            $this->compareArr[$index2]['ORG'][$true2['org']] = true;
                        }
                        else{
                            $this->compareArr[$index2]['ORG'][$userOrganization] = true;
                        }
                    }
                    else{
                        $this->compareArr[$index2] = false;
                    }

                    if(isset($true2['update']) && $true2['update']){
                        $this->updateArr[$index2]['Manage'] = true;
                    }
                }

            }
        }
    }
    
    function getControlArray(){
        return $this->compareArr;
    }

    function getSetupArray(){
        return $this->setupArr;
    }

    function getManageArray(){
        return $this->updateArr;
    }

    function getBulkArpprovalArray(){
        return $this->bulkApprovalArr;
    }

}
