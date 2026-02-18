<?php
include "verify_postlogin.php";
include "verify_homepage.php";
include_once '..\Dashboard\General\dashboard_executive.class.php';
require "include/_include.php";
require("include/db_connect.php");

header('Access-Control-Allow-Origin: *');

global $CONN, $SYSTEM, $PRODUCTION_FLAG, $IS_DOWNSTREAM;

$email = $_SESSION['email'];
$firstName = $_SESSION['firstname'];
$lastName = $_SESSION['lastname'];

$postLoginRole = 'User';
$userProfileImg = ($_SESSION['profile_img'] != NULL && file_exists('../../Data/users/'.$email.'/'.$_SESSION['profile_img'])) ? '../../Data/users/'.$email.'/'.$_SESSION['profile_img'] : '../Images/defaultProfile.png';
$userProfileHeader = ($_SESSION['profile_header'] != NULL && file_exists('../../Data/users/'.$email.'/'.$_SESSION['profile_header'])) ? '../../Data/users/'.$email.'/'.$_SESSION['profile_header'] : '../Images/icons/ri_v3/wallpaper/default.jpg';

$countryOptionArr = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Congo, The Democratic Republic of The', 'Cook Islands', 'Costa Rica', 'Cote D\'ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-bissau', 'Guyana', 'Haiti', 'Heard Island and Mcdonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran, Islamic Republic of', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, Democratic People\'s Republic of', 'Korea, Republic of', 'Kuwait', 'Kyrgyzstan', 'Lao People\'s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia, The Former Yugoslav Republic of', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestinian Territory, Occupied', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Pierre and Miquelon', 'Saint Vincent and The Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia and Montenegro', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and The South Sandwich Islands', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan, Province of China', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Timor-leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Viet Nam', 'Virgin Islands, British', 'Virgin Islands, U.S.', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

$myTaskClassHeight = '';

switch ($SYSTEM) {
    case 'OBYU':
        $access_control = json_decode(file_get_contents("../BackEnd/accessControl_OBYU.json"), true);
        $userNewOrgTypeArr = ['contractor', 'consultant'];
        $assetSignatureHTML = '';
        $addNewProjectPage7HTML = '';
        $addNewProjectIndicatorHTML = '';
        $reviewPageIndex = 7;
        $addNewProjectIndicatorName = '';
        $refreshUserListFunction = 'refreshUserListBasedOnOrg(\'parentId\')';

        for($i=1; $i <= $reviewPageIndex ; $i++){
            switch ($i) {
                case 1:
                    $addNewProjectIndicatorName = 'Project<br>Particular';
                    break;
                case 2:
                    $addNewProjectIndicatorName = 'Project App<br>Assignment';
                    break;
                case 3:
                    $addNewProjectIndicatorName = 'Project<br>Timeline';
                    break;
                case 4:
                    $addNewProjectIndicatorName = 'Project<br>Area';
                    break;
                case 5:
                    $addNewProjectIndicatorName = 'Project<br>Team';
                    break;
                case 6:
                    $addNewProjectIndicatorName = 'Project<br>Team2';
                    break;
                case 7:
                    $addNewProjectIndicatorName = 'Review';
                    break;
            }

            $addNewProjectIndicatorHTML .= '<div class="wizard-button-container" data-pageButton="'.$i.'">
                                                <button onclick="wizardIndicatorProjectChecking(this)" data-nextpage="'.$i.'"><i class="fa-solid fa-'.$i.'"></i></button>'.$addNewProjectIndicatorName.'
                                            </div>';
                                            if($i !== 7){
                                                $addNewProjectIndicatorHTML .= '<div class="wizard-divider" data-pageDivider="'.$i.'"><i class="fa-solid fa-horizontal-rule"></i></div>';
                                            }
        }

        // Progress Summary Template File
        $template_path = '../Templates/'.$_SESSION['user_org'].'/Progress_Summary_-_Template_v1.0.xlsx';
        break;
    default:
        $access_control = json_decode(file_get_contents("../BackEnd/accessControl.json"), true);
        $access_control_asset = json_decode(file_get_contents("../BackEnd/accessControlAsset.json"), true);
        $userNewOrgTypeArr = ['owner', 'contractor', 'consultant', 'DBC'];
        $assetSignatureHTML = '<button id="profileuserSign" onclick="onClickUserSignature()">Add Signature</button>';
        $addNewProjectPage7HTML = '<div class="page addNewProject" data-page="7">
                                        <div class="tableContent heightWizard">
                                            <div class="headerContainer">
                                                <span class="title font-default">User(s)</span>
                                                <input class="searchContainer" id="temp2" placeholder="Search User" onkeyup="groupProjectSearch(this)">
                                            </div>
                                            <div class="tablecontainer">
                                                <div class="tableHeader system-admin fiveColumn">
                                                    <span class="columnSmall"><input type="checkbox" onchange="checkAllFormUsers(this)" id="toggleAllUser" data-tableclass="addusergrouptable" style="visibility: hidden"></span>
                                                    <span class="columnMiddle">User Email</span>
                                                    <span class="columnMiddle">Name</span>
                                                    <span class="columnMiddle">Organisation</span>
                                                    <span class="columnMiddle">Role</span>
                                                    <span class="columnMiddle">Group</span>
                                                </div>
                                                <div class="tableBody" id="addUserGroupTableBody">
                                                </div>
                                            </div>
                                        </div>
                                    </div>';
        $addNewProjectIndicatorHTML = '';
        $reviewPageIndex = 8;
        $addNewProjectIndicatorName = '';
        $refreshUserListFunction = 'refreshUserListProjectCreation(\'parentId\')';

        for($i=1; $i <= $reviewPageIndex ; $i++){
            switch ($i) {
                case 1:
                    $addNewProjectIndicatorName = 'Project<br>Particular';
                    break;
                case 2:
                    $addNewProjectIndicatorName = 'Project App<br>Assignment';
                    break;
                case 3:
                    $addNewProjectIndicatorName = 'Project<br>Timeline';
                    break;
                case 4:
                    $addNewProjectIndicatorName = 'Project<br>Area';
                    break;
                case 5:
                    $addNewProjectIndicatorName = 'Project<br>Team';
                    break;
                case 6:
                    $addNewProjectIndicatorName = 'Project<br>Team2';
                    break;
                case 7:
                    $addNewProjectIndicatorName = 'Project<br>Group';
                    break;
                case 8:
                    $addNewProjectIndicatorName = 'Review';
                    break;
            }

            $addNewProjectIndicatorHTML .= '<div class="wizard-button-container" data-pageButton="'.$i.'">
                                                <button onclick="wizardIndicatorProjectChecking(this)" data-nextpage="'.$i.'"><i class="fa-solid fa-'.$i.'"></i></button>'.$addNewProjectIndicatorName.'
                                            </div>';
                                            if($i !== 8){
                                                $addNewProjectIndicatorHTML .= '<div class="wizard-divider" data-pageDivider="'.$i.'"><i class="fa-solid fa-horizontal-rule"></i></div>';
                                            }
        }

        // Progress Summary Template File
        $template_path = '../Templates/Progress_Summary_-_Template.xlsx';

        //My Task table height if datepicker visible
        $myTaskClassHeight = 'datepickerList';
        break;
}

function checkAdminAccess($role){
    $adminAccessRoles = ['Project Manager', 'Planning Engineer', 'Project Monitor', 'Project Director', "Senior Civil Engineer (Road Asset)", "Assistant Director (Road Asset)", "KKR", "Civil Engineer (Road Asset)", "SMO Representative", "PMO Representative"];
    if($_SESSION['user_org'] == "UTSB") array_push($adminAccessRoles, "Construction Engineer");

    // can handle asset project here also
    return in_array($role, $adminAccessRoles);
}

$projectImage = '';
if(isset($_SESSION['icon_url'])){
    $projectImage =  (file_exists('../../'.$_SESSION['icon_url'])) ? '../../'.$_SESSION['icon_url'] : '';
}

$sqlGetSystemAdminFlag = "SELECT user_type FROM users where user_email=:0";
$fetchSystemAdminFlag = $CONN->fetchOne($sqlGetSystemAdminFlag, array($email));

$_SESSION['USER_TYPE'] = $fetchSystemAdminFlag;

$sql = "SELECT * FROM users u left join pro_usr_rel pur on u.user_ID = pur.Usr_ID left join projects p on p.project_id_number=pur.Pro_ID where u.user_email=:0 AND u.user_type != 'non_active' AND p.status = 'active' AND pur.Pro_Role != 'non_Member' ORDER BY p.project_name ASC";
$fetchUserProject = $CONN->fetchAll($sql, array($email));

$proid_array = array();
$admin_array = array();
$projectTileHTML = '';
$packageTileHTML = '';
$projpackListHTML = '';
$processPackageHTML = '';
$processPackageBulkHTML = '';
$assetProcessPackageHTML = '';
$assetProcessPackageBulkHTML = '';
$sysAdminHTML = '';
$sysAdminUserHTML = '';
$sysAdminProjectHTML = '';
$funcOpen = '';
$yearHTML = '';
$systemTabsHTML = '';

// ============ For Digital Reporting ================//

$dashObj = new ExecDashboard();
$divisionHTML = $dashObj->getDivisionHTML();
$owner = $dashObj->projectOwner;
$org = $dashObj->userOrg;

global $projectManager;
$layoutHTML='';

if($org == 'KKR'){
    $layoutHTML='
        <div class="sabah_layout layout twoRow" id="lOne" style="width:calc(100% - 85px); cursor: default; margin: 0 40px;">          
            <div class=" rowOne L twoRow">
                <div class="rowOne M twoColumn">
                    <div class="columnOne M twoColumn">
                        <div class="columnOne M twoRow round shadow container-full-screen">
                            <div class="rowOne-T roundT" style="position: relative">
                                PROJECT PROGRESS
                                <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
                            </div>
                            <div class="rowTwo-T scrollbar-inner roundB" id = "projectProgressTable">
                            </div>
                        </div>
                        <div class="columnTwo M twoRow shadow round container-full-screen">
                            <div class="rowOne-T roundT" style="position: relative">
                                SITE DIARY (WEATHER)
                                <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
                            </div>
                            <div class="rowTwo-T roundB" id = "weatherSDL">
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M twoColumn">
                        <div class="columnOne M twoRow shadow round container-full-screen">
                            <div class="rowOne-T roundT" style="position: relative">
                                OVERALL ACCIDENT / INCIDENTS RECORD
                                <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
                            </div>
                            <div class="rowTwo-T roundB" id = "OverallIncidentsAndAccidentsRecord">
                            </div>
                        </div>
                        <div class="columnTwo M twoRow shadow round container-full-screen">
                            <div class="rowOne-T roundT" style="position: relative">
                                PUBLIC COMPLAINT
                                <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
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
                                <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>

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
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
                                </div>
                                <div class="rowTwo-T roundB scrollbar-inner" id="insert-nofile" style="padding: 0; width: 100%; height: calc(100% - 30px);">
                                    <table style="width: 100%;">
                                        <thead id="fileProgressHead">
                                            <tr>
                                                <td></td>
                                                <td>Name</td>
                                                <td>Last Update</td>
                                                <td>Type</td>
                                            </tr>
                                        </thead>
                                        <tbody class="fileProgress" id = "fileProgress">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M60 twoRow round shadow round container-full-screen">
                        <div class="rowOne-T roundT" style="position: relative">
                            PAYMENT MADE FOR LAND
                            <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
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
            <div class="sabah_layout rowTwo S round white viewImageJoget" id = "viewImageJoget">
            </div>
        </div>
        <div class="sarawak_layout layout twoRow" id="lOne" style="width:calc(100% - 85px); cursor: default; margin: 0 40px;">   
            <div class=" rowOne L twoRow">
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
                                <table style="width: 100%;">
                                    <thead id="fileProgressHead">
                                        <tr>
                                            <td></td>
                                            <td>Name</td>
                                            <td>Last Update</td>
                                            <td>Type</td>
                                        </tr>
                                    </thead>
                                    <tbody class="fileProgress" id = "fileProgress">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class=" rowTwo S viewImageJoget" id = "viewImageJoget">
            </div>
        </div>
        
    ';
}else{
    if($owner == 'JKR_SABAH'){
        $layoutHTML='
            <div class="sabah_layout layout twoRow" id="lOne" style="width:calc(100% - 85px); cursor: default; margin: 0 40px;">   
                <div class="rowOne L twoRow">
                    <div class="rowOne M twoColumn">
                        <div class="columnOne M twoColumn">
                            <div class="columnOne M twoRow round shadow container-full-screen">
                                <div class="rowOne-T roundT" style="position: relative">
                                    PROJECT PROGRESS
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
                                </div>
                                <div class="rowTwo-T scrollbar-inner roundB" id = "projectProgressTable">
                                </div>
                            </div>
                            <div class="columnTwo M twoRow shadow round container-full-screen">
                                <div class="rowOne-T roundT" style="position: relative">
                                    SITE DIARY (WEATHER)
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
                                </div>
                                <div class="rowTwo-T roundB" id = "weatherSDL">
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoColumn">
                            <div class="columnOne M twoRow shadow round container-full-screen">
                                <div class="rowOne-T roundT" style="position: relative">
                                    OVERALL ACCIDENT / INCIDENTS RECORD
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
                                </div>
                                <div class="rowTwo-T roundB" id = "OverallIncidentsAndAccidentsRecord">
                                </div>
                            </div>
                            <div class="columnTwo M twoRow shadow round container-full-screen">
                                <div class="rowOne-T roundT" style="position: relative">
                                    PUBLIC COMPLAINT
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
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
                                    <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>

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
                                        <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
                                    </div>
                                    <div class="rowTwo-T roundB scrollbar-inner" id="insert-nofile" style="padding: 0; width: 100%; height: calc(100% - 30px);">
                                        <table style="width: 100%;">
                                            <thead id="fileProgressHead">
                                                <tr>
                                                    <td></td>
                                                    <td>Name</td>
                                                    <td>Last Update</td>
                                                    <td>Type</td>
                                                </tr>
                                            </thead>
                                            <tbody class="fileProgress" id = "fileProgress">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M60 twoRow round shadow round container-full-screen">
                            <div class="rowOne-T roundT" style="position: relative">
                                PAYMENT MADE FOR LAND
                                <button class="expand btn-full-screen" onclick="chartFullScreen(this)"><i class="fa-solid fa-expand fa-btn"></i></button>
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
                <div class="rowTwo S round white viewImageJoget" id = "viewImageJoget">
                </div>
            </div>
        ';
    }else if($owner == 'JKR_SARAWAK' || $owner == 'OBYU'){
        $layoutHTML='
            <div class="sarawak_layout layout twoRow" id="lOne" style="width:calc(100% - 85px); cursor: default; margin: 0 40px;">   
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
                                    <table style="width: 100%;">
                                        <thead id="fileProgressHead">
                                            <tr>
                                                <td></td>
                                                <td>Name</td>
                                                <td>Last Update</td>
                                                <td>Type</td>
                                            </tr>
                                        </thead>
                                        <tbody class="fileProgress" id = "fileProgress">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowTwo S viewImageJoget" id = "viewImageJoget">
                </div>
            </div>
        ';
    }  
}

$lastMonth = date('F Y', strtotime("first day of last month"));

$yearOptions = array();
$currYear = date("Y");

$haveParams = false;
$classDashboardActive = '';
$classActive = '';
$displayBlockDashboard = 'display: none';
$displayBlock = 'display: none';
$subMenuOpened = 'subMenuOpened';
$projMenu = '';
$subMenuActive = '';

if ((isset($_REQUEST['filterYear']) && $_REQUEST['filterYear'] != "") || (isset($_REQUEST['filterMonth']) && $_REQUEST['filterMonth'] != "") || (isset($_REQUEST['rangeSaved']) && $_REQUEST['rangeSaved']!= "")) {
    $haveParams = true;
    $classDashboardActive = 'active';
    $displayBlockDashboard = 'display: block';
    $classActive = '';
    $subMenuActive = '';
    $displayBlock = 'display: none';
    $subMenuOpened = '';
} else {
    //Hide Construction Menu for UTSB
    if($_SESSION['user_org'] == "UTSB"){
        $subMenuActive = '';
        $subMenuOpened = '';
        $projMenu = 'noSubMenu';
    }else{
        $subMenuActive = 'active';
        $subMenuOpened = 'subMenuOpened';
    }

    $classActive = 'active';
    $displayBlock = 'display: block';
    $classDashboardActive = '';
    $displayBlockDashboard = 'display: none';
}

$yr = $currYear;
for ($i=0; $i < 5 ; $i++) { 
    $yearOptions[] = $yr--; 
}

foreach ($yearOptions as $year) {
    $yearHTML .= '<option value="'.$year.'">'.$year.'</option>';
}

if ($owner == "JKR_SABAH"){
    $titleDigitalReporting = '<b style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                Monthly Reporting as of
                                <select onchange="showSubmitButton()" id="filterMonthDashboard" class="filter">
                                    <option value="Jan">January</option>
                                    <option value="Feb">February</option>
                                    <option value="Mar">March</option>
                                    <option value="Apr">April</option>
                                    <option value="May">May</option>
                                    <option value="Jun">June</option>
                                    <option value="Jul">July</option>
                                    <option value="Aug">August</option>
                                    <option value="Sep">September</option>
                                    <option value="Oct">October</option>
                                    <option value="Nov">November</option>
                                    <option value="Dec">December</option>
                                </select>
                                <select onchannge="showSubmitButton()" id="filterYearDashboard">
                                    '.$yearHTML.'
                                </select>
                            </b> <button id="filterButton" class="btn" onclick="submitDashboardExecFilter()">Show</button>';
}else{
    if ($_SESSION['user_org'] == "KKR"){
        $titleDigitalReporting = '<b style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                Monthly Reporting as of
                                <select onchange="showSubmitButton()" id="filterMonthDashboard" class="filter">
                                    <option value="Jan">January</option>
                                    <option value="Feb">February</option>
                                    <option value="Mar">March</option>
                                    <option value="Apr">April</option>
                                    <option value="May">May</option>
                                    <option value="Jun">June</option>
                                    <option value="Jul">July</option>
                                    <option value="Aug">August</option>
                                    <option value="Sep">September</option>
                                    <option value="Oct">October</option>
                                    <option value="Nov">November</option>
                                    <option value="Dec">December</option>
                                </select>
                                <select onchannge="showSubmitButton()" id="filterYearDashboard">
                                    '.$yearHTML.'
                                </select>
                            </b> <button id="filterButton" class="btn" onclick="submitDashboardExecFilter()">Show</button>';
    }else{

        $titleDigitalReporting = '<b style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">Monthly Reporting</b> ';
    }
}

$titleFInanceClaims = ($_SESSION['user_org'] == "MRSB") ? 'Interim Payment Certificate': 'Claims';

//============== End of Digital Reporitng ================//
$fileName = 'risk_overall_duration_analysis.xlsx';
$filePath = '';
if($SYSTEM == 'KKR'){
    $filePath = '../Data/sample/'.$fileName;
}else if($SYSTEM == 'OBYU'){
    $filePath = '../Templates/MRSB/'.$fileName;
}
$fileLinkHTML = '';
$rruHtmlInsight = '';
$rruHtmlOutside = '';

//for risk upload
if (file_exists($filePath)) {
    $fileLinkHTML = '<span class="textNoWrap textEllipsis">Template: <a href="'.$filePath.'" download>'.$fileName.'</a></span>';
}else{
    // show error if sample template not found
    $fileLinkHTML = '<span class="textNoWrap textEllipsis" style="color:red;">Template file not found.</span>';
}

//-----------------START RISK UPLOAD--------------------//
if ($_SESSION['is_Parent'] !== "isParent") {
    
    $forOverallHtmlInsight = '';
    if($SYSTEM == 'OBYU'){
        $forOverallHtmlInsight = '<input type="checkbox" id="forOverallInsight" name="forOverall" value="0">
        <label class="textNoWrap" for="forOverall"> For Overall</label>';
    }else{
        $forOverallHtmlInsight = '';
    }
    $rruHtmlInsight = '
    <div class="uploadContainer">
        <div class="buttoncontainer">
            <div class="flex" style="max-width: 40%">
                '.$fileLinkHTML.'
                <div class="flex marginLeft">
                    '.$forOverallHtmlInsight.'
                </div>
            </div>
            <div class="flex marginLeft">
                <label for="uploaded-date">Date: </label>
                <input class="marginLeft" type="date" id="uploaded-dateInsight" required>
            </div>
            <input type="file" name="uploadExcelRiskUploadInsight" id="uploadExcelRiskUploadInsight" accept=".xls,.xlsx" style="">
            <button class="uploadExcelRiskUpload" id="importExcelRiskUploadInsight" name="import" class="btn-submit" style="display:none;">Import</button>
        </div>
            
        <div id="tableMainContainer">
            <div class="combineContainer">
                <div class= "tableTitle">Uploaded Histogram Plot Data <span class ="dateAdded"></span></div>
                <div class="tableChildContainer">
                    <table> 
                        <thead>
                            <th>Bins</th>
                            <th>Count</th>
                            <th>Scaled</th>
                            <th>Cum</th>
                        </thead>
                        <tbody id="uploadedDataTableInsight"></tbody>
                    </table>
                </div>
            </div>
            <div class="vl"></div>
            <div class="combineContainer twoRow">
                <div class="combineContainer top">
                    <div class= "tableTitle">Uploaded File(s) <span class= "tableNote"></span></div>
                    <div class="tableChildContainer top">
                        <table> 
                            <thead>
                                <th>Upload Date</th>
                                <th>Uploaded by</th>
                                <th>File</th>
                            </thead>
                            <tbody id="uploadedFileTableInsight"></tbody>
                        </table>
                    </div>
                </div>
                <div class="combineContainer bottom">
                    <div class= "tableTitle">Uploaded Probability Data <span class ="dateAdded"></span></div>
                    <div class="tableChildContainer bottom">
                        <table> 
                            <tbody>
                                <tr>
                                    <td>Remaining Duration</td>
                                    <td><span id="remainDurValInsight">N/A</span> month(s)</td>
                                </tr> 
                                <tr>
                                    <td>Overall Project Schedule Impact Uncertainty</td>
                                    <td><span id="schImpUncerValInsight">N/A</span> %</td>
                                </tr>
                                <tr>
                                    <td>Probability of Completing per Schedule</td>
                                    <td><span id="compPerSchValInsight">N/A</span> %</td>
                                </tr>
                                <tr>
                                    <td>Timely Completion Probability</td>
                                    <td><span id="timeCompProbValInsight">N/A</span> %</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>    
                </div>
            </div>
        </div>
    </div>';

    $forOverallHtmlOutside = '';
    if($SYSTEM == 'OBYU'){
        $forOverallHtmlOutside = '<input type="checkbox" id="forOverallOutside" name="forOverall" value="0">
        <label class="textNoWrap" for="forOverall"> For Overall</label>';
    }else{
        $forOverallHtmlOutside = '';
    }
    $rruHtmlOutside = '
    <div class="uploadContainer">
        <div class="buttoncontainer">
            <div class="flex" style="max-width: 40%">
                '.$fileLinkHTML.'
                <div class="flex marginLeft">
                    '.$forOverallHtmlOutside.'
                </div>
            </div>
            <div class="flex marginLeft">
                <label for="uploaded-date">Date: </label>
                <input class="marginLeft" type="date" id="uploaded-dateOutside" required>
            </div>
            <input type="file" name="uploadExcelRiskUploadOutside" id="uploadExcelRiskUploadOutside" accept=".xls,.xlsx" style="">
            <button class="uploadExcelRiskUpload" id="importExcelRiskUploadOutside" name="import" class="btn-submit" style="display:none;">Import</button>
        </div>
            
        <div id="tableMainContainer">
            <div class="combineContainer">
                <div class= "tableTitle">Uploaded Histogram Plot Data <span class ="dateAdded"></span></div>
                <div class="tableChildContainer">
                    <table> 
                        <thead>
                            <th>Bins</th>
                            <th>Count</th>
                            <th>Scaled</th>
                            <th>Cum</th>
                        </thead>
                        <tbody id="uploadedDataTableOutside"></tbody>
                    </table>
                </div>
            </div>
            <div class="vl"></div>
            <div class="combineContainer twoRow">
                <div class="combineContainer top">
                    <div class= "tableTitle">Uploaded File(s) <span class= "tableNote"></span></div>
                    <div class="tableChildContainer top">
                        <table> 
                            <thead>
                                <th>Upload Date</th>
                                <th>Uploaded by</th>
                                <th>File</th>
                            </thead>
                            <tbody id="uploadedFileTableOutside"></tbody>
                        </table>
                    </div>
                </div>
                <div class="combineContainer bottom">
                    <div class= "tableTitle">Uploaded Probability Data <span class ="dateAdded"></span></div>
                    <div class="tableChildContainer bottom">
                        <table> 
                            <tbody>
                                <tr>
                                    <td>Remaining Duration</td>
                                    <td><span id="remainDurValOutside">N/A</span> month(s)</td>
                                </tr> 
                                <tr>
                                    <td>Overall Project Schedule Impact Uncertainty</td>
                                    <td><span id="schImpUncerValOutside">N/A</span> %</td>
                                </tr>
                                <tr>
                                    <td>Probability of Completing per Schedule</td>
                                    <td><span id="compPerSchValOutside">N/A</span> %</td>
                                </tr>
                                <tr>
                                    <td>Timely Completion Probability</td>
                                    <td><span id="timeCompProbValOutside">N/A</span> %</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>    
                </div>
            </div>
        </div>
    </div>';
}else{
    $rruHtmlInsight = '
    <div class="uploadContainer">

        <div class="buttoncontainer">
        
            <div class="uploadDiv">
                <span aria-hidden="true" class="progressFileName"></span> 
            </div>
        </div>
            
        <div id="tableMainContainer">
            <div class="combineContainer">
                <div class= "tableTitle">Uploaded Histogram Plot Data <span class ="dateAdded"></span></div>
                <div class="tableChildContainer">
                    <table> 
                        <thead>
                            <th>Bins</th>
                            <th>Count</th>
                            <th>Scaled</th>
                            <th>Cum</th>
                        </thead>
                        <tbody id="uploadedDataTableInsight"></tbody>
                    </table>
                </div>
            </div>
            <div class="vl"></div>
            <div class="combineContainer twoRow">
                <div class="combineContainer top">
                    <div class= "tableTitle">Uploaded File(s) <span class= "tableNote"></span></div>
                    <div class="tableChildContainer top">
                        <table> 
                            <thead>
                                <th>Upload Date</th>
                                <th>Uploaded by</th>
                                <th>File</th>
                            </thead>
                            <tbody id="uploadedFileTableInsight"></tbody>
                        </table>
                    </div>
                </div>
                <div class="combineContainer bottom">
                    <div class= "tableTitle">Uploaded Probability Data ('.date('m-Y').')</div>
                    <div class="tableChildContainer bottom">
                        <table> 
                            <tbody>
                                <tr>
                                    <td>Remaining Duration</td>
                                    <td><span id="remainDurValInsight">N/A</span> month(s)</td>
                                </tr> 
                                <tr>
                                    <td>Overall Project Schedule Impact Uncertainty</td>
                                    <td><span id="schImpUncerValInsight">N/A</span> %</td>
                                </tr>
                                <tr>
                                    <td>Probability of Completing per Schedule</td>
                                    <td><span id="compPerSchValInsight">N/A</span> %</td>
                                </tr>
                                <tr>
                                    <td>Timely Completion Probability</td>
                                    <td><span id="timeCompProbValInsight">N/A</span> %</td>
                                </tr>
                            </tbody>
                            <tbody id="uploadedFileTableInsight"></tbody>
                        </table>
                    </div>    
                </div>
            </div>
        </div>
    </div>';

    $rruHtmlOutside = '
    <div class="uploadContainer">

        <div class="buttoncontainer">
        
            <div class="uploadDiv">
                <span aria-hidden="true" class="progressFileName"></span> 
            </div>
        </div>
            
        <div id="tableMainContainer">
            <div class="combineContainer">
                <div class= "tableTitle">Uploaded Histogram Plot Data <span class ="dateAdded"></span></div>
                <div class="tableChildContainer">
                    <table> 
                        <thead>
                            <th>Bins</th>
                            <th>Count</th>
                            <th>Scaled</th>
                            <th>Cum</th>
                        </thead>
                        <tbody id="uploadedDataTableOutside"></tbody>
                    </table>
                </div>
            </div>
            <div class="vl"></div>
            <div class="combineContainer twoRow">
                <div class="combineContainer top">
                    <div class= "tableTitle">Uploaded File(s) <span class= "tableNote"></span></div>
                    <div class="tableChildContainer top">
                        <table> 
                            <thead>
                                <th>Upload Date</th>
                                <th>Uploaded by</th>
                                <th>File</th>
                            </thead>
                            <tbody id="uploadedFileTableOutside"></tbody>
                        </table>
                    </div>
                </div>
                <div class="combineContainer bottom">
                    <div class= "tableTitle">Uploaded Probability Data ('.date('m-Y').')</div>
                    <div class="tableChildContainer bottom">
                        <table> 
                            <tbody>
                                <tr>
                                    <td>Remaining Duration</td>
                                    <td><span id="remainDurValOutside">N/A</span> month(s)</td>
                                </tr> 
                                <tr>
                                    <td>Overall Project Schedule Impact Uncertainty</td>
                                    <td><span id="schImpUncerValOutside">N/A</span> %</td>
                                </tr>
                                <tr>
                                    <td>Probability of Completing per Schedule</td>
                                    <td><span id="compPerSchValOutside">N/A</span> %</td>
                                </tr>
                                <tr>
                                    <td>Timely Completion Probability</td>
                                    <td><span id="timeCompProbValOutside">N/A</span> %</td>
                                </tr>
                            </tbody>
                            <tbody id="uploadedFileTableOutside"></tbody>
                        </table>
                    </div>    
                </div>
            </div>
        </div>
    </div>';
}
//-----------------END RISK UPLOAD--------------------//

$projectManager = false;

$sqlGetDRAccess = "SELECT show_reporting FROM users WHERE user_id = :0";
$fetchAccessDR = $CONN->fetchOne($sqlGetDRAccess, array($_SESSION['user_id']));

$_SESSION['DR_ACCESS'] = $fetchAccessDR;

if($_SESSION['DR_ACCESS'] == 1){
    $projectManager = true;
}

function buildTree(array $elements, $parentId = 0) {
    global $projectManager;
    $branch = array();
    foreach ($elements as $element) {
        if($element['Pro_Role'] == "Project Manager" || $element['Pro_Role'] == "Project Monitor"){
            $projectManager = true;
        }
        if($element['Pro_Role'] == "Planning Engineer" && $_SESSION['user_org'] == "JKRS"){
            $projectManager = true;
        }
        if(($element['Pro_Role'] == "Planning Engineer" || $element['Pro_Role'] == "Risk Engineer") && $_SESSION['user_org'] == "HSSI"){
            $projectManager = true;
        }
        if(($element['Pro_Role'] == "Project Manager" || $element['Pro_Role'] == "Project Monitor") && $_SESSION['user_org'] == "KKR"){
            $projectManager = true;
        }
        if ($element['parent_project_id_number'] == $parentId) {
            $children = buildTree($elements, $element['project_id_number']);
            if ($children) {
                $element['children'] = $children;
            }
            $branch[] = $element;
        }
    }
    return $branch;
}

// This section solely for package that dont have parent
$noParentPackage_array = array();
foreach ($fetchUserProject as $k) {

    if ($k['parent_project_id_number'] && $k['parent_project_id_number'] != '') {
        $valueParent = array_column($fetchUserProject, 'project_id_number');

        $searching = array_search($k['parent_project_id_number'], array_column($fetchUserProject, 'project_id_number'));
        $typeSearching = gettype($searching);
        if ($typeSearching !== 'integer') {
            // if searching have value of KEY, it return integer value, which if there is no project exist, need to not have any value
            $noParentPackage_array[] = $k;
        }
    }
}

usort($fetchUserProject, function ($a, $b) {
    $topPackIdArr = ['eLibrary', 'projectInformation'];
    if (!in_array($a['project_id'], $topPackIdArr) && in_array($b['project_id'], $topPackIdArr)) {
        return 1;
    } elseif (in_array($a['project_id'], $topPackIdArr) && in_array($b['project_id'], $topPackIdArr)) {
        return -1;
    } 
    return 0;
});

if(isset($fetchUserProject[0]['project_id']) && count($fetchUserProject) >= 1){
    $projectPackageTree = buildTree($fetchUserProject);
}
else{
    $projectPackageTree = [];
}

//flag if user has asset app or not
$flagAssetApp = false;

// for project and package list
foreach ($projectPackageTree as $project) {

    $flagConstructProject = false;
    $flagAssetProject = false;
    $flagFinanceProject = false;
    $flagDocumentProject = false;
    $flagAdminProject = false;

    // split time and date 
    if(!$project['last_access']){
        $project['last_login_date'] = 'Never Accessed';
    }else{
        $lastLoginObj = new DateTime($project['last_access']);
        $currentDate = new DateTime();
        $interval = $currentDate->diff($lastLoginObj);
        if($interval->y){
            $project['last_login_date'] = $interval->y > 1 ? $interval->format('%y years ago') : $interval->format('%y year ago');
        }else if($interval->m){
            $project['last_login_date'] = $interval->m > 1 ? $interval->format('%m months ago') : $interval->format('%m month ago');
        }else if($interval->d){
            $project['last_login_date'] = $interval->d > 1 ? $interval->format('%d days ago') : $interval->format('%d day ago');
        }else if($interval->h){
            $project['last_login_date'] = $interval->h > 1 ? $interval->format('%h hours ago') : $interval->format('%h hour ago');
        }else if($interval->i){
            $project['last_login_date'] = $interval->i > 1 ? $interval->format('%i minutes ago') : $interval->format('%i minute ago');
        }else if($interval->s){
            $project['last_login_date'] = $interval->s > 1 ? $interval->format('%s seconds ago') : $interval->format('%s second ago');
        }
    };

    if ($project['status'] == 'archive')continue;


    $imgUrl = (file_exists('../../' . $project['icon_url'])) ? '../../' . $project['icon_url'] : ''; 

    //to check have app access or not
    $sqlApps = "SELECT * from project_apps_process WHERE project_id = :0";
    $checkingApp = $CONN->fetchRow($sqlApps, array($project['project_id_number']));

    if($checkingApp){
        $checkConstruct = $checkingApp['constructPackage_name'];
        $checkFinance = $checkingApp['financePackage_name'];
        $checkDocument = $checkingApp['documentPackage_name'];

        if (strpos($checkConstruct, 'ri_asset') !== false) {
            $flagAssetProject = true;
            $flagAssetApp = true;
        }

        if (strpos($checkConstruct, 'ri_construct') !== false) {
            $flagConstructProject = true;
        }
        else if(strpos($checkConstruct, 'conOp') !== false){
            $flagConstructProject = true;
        }

        if($checkFinance){
            $flagFinanceProject = true;
        }

        if($checkDocument){
            $flagDocumentProject = true;
        }
        
    }

    $fav_projArr = explode(",", $_SESSION['fav_proj']);
    $p_ID = $project['project_id_number'];
    $parent_projID = $project['project_id_number'];
    $p_Name = $project['project_name'];
    $icon_url = $imgUrl;
    $favClass = '';
    $is_parent = $project['parent_project_id_number'];

    if($project['project_id'] ==  'eLibrary'){
        $listButtonProject = '
            <button class="appButton projectDoc" title="'.$p_Name.'" data-projectid = "' . $p_ID . '" rel="'.$project['project_id'].'" data-color="#d7ae35" onclick=\'openAppProject(this)\'><i class="fa-solid fa-book" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>'.$p_Name.'</a></button>
        ';
        $tileButtonProject = '
            <button class="appButton projectDoc" title="'.$p_Name.'" data-projectid = "' . $p_ID . '" rel="'.$project['project_id'].'" data-color="#d7ae35" onclick=\'openAppProject(this)\'><i class="fa-solid fa-book" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>'.$p_Name.'</a></button>
        ';
    }else if($project['project_id'] ==  'projectInformation'){
        $listButtonProject = '
        <button class="appButton projectDoc" title="'.$p_Name.'" data-projectid = "' . $p_ID . '" rel="'.$project['project_id'].'" data-color="#d7ae35" onclick=\'openAppProject(this)\'><i class="fa-solid fa-circle-info" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>'.$p_Name.'</a></button>
        ';
        $tileButtonProject = '
            <button class="appButton projectDoc" title="'.$p_Name.'" data-projectid = "' . $p_ID . '" rel="'.$project['project_id'].'" data-color="#d7ae35" onclick=\'openAppProject(this)\'><i class="fa-solid fa-circle-info" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>'.$p_Name.'</a></button>
        ';
    }else{
        $listButtonProject = '
            <button class="appButton riConstruct" title="Insights" data-projectid = "' . $p_ID . '" rel="myInsights" data-color="#198901" onclick=\'openAppProject(this)\'><i class="fa-solid fa-earth-americas" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Insights</a></button>
            <button class="appButton myDashboard" title="Dashboard" data-projectid = "' . $p_ID . '" rel="myDashboard" data-color="#73009F" onclick=\'openAppProject(this)\'><i class="fa-solid fa-gauge" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Dashboard</a></button>
        ';
        $tileButtonProject = '
            <button class="appButton riConstruct" title="Insights" data-projectid = "' . $p_ID . '" rel="myInsights" data-color="#198901" onclick=\'openAppProject(this)\' ><i class="fa-solid fa-earth-americas" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Insights</a></button>
            <button class="appButton myDashboard" title="Dashboard" data-projectid = "' . $p_ID . '" rel="myDashboard" data-color="#73009F" onclick=\'openAppProject(this)\'><i class="fa-solid fa-gauge" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Dashboard</a></button>
        ';

        //finance app
        if($flagFinanceProject && $flagAssetProject){
            if (isset($access_control_asset[$project['Pro_Role']]) && isset($access_control_asset[$project['Pro_Role']]["PFS"])){
                $listButtonProject .= '
                    <button class="appButton myTask" title="Task" data-projectid = "' . $p_ID . '" rel="myTask" data-color="#AD5E2A" onclick=\'openAppProject(this)\'><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>My Task</a></button>
                    <button class="appButton finance" title="Finance" data-projectid = "' . $p_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                ';
                $tileButtonProject .= '
                    <button class="appButton myTask" title="Task" data-projectid = "' . $p_ID . '" rel="myTask" data-color="#AD5E2A" onclick=\'openAppProject(this)\'><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>My Task</a></button>
                    <button class="appButton finance" title="Finance" data-projectid = "' . $p_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                ';
            }else{
                $flagFinancePackage = false;
                $tileButtonProject .= '
                    <button class="empty"></button>
                ';
            }
        }
        else{
            if(isset($project['project_owner']) && $project['project_owner'] == 'SSLR2') {
                if (isset($access_control[$project['Pro_Role']]) && isset($access_control[$project['Pro_Role']]["PFS"])){
                    $listButtonProject .= '
                        <button class="appButton myTask" title="Task" data-projectid = "' . $p_ID . '" rel="myTask" data-color="#AD5E2A" onclick=\'openAppProject(this)\'><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>My Task</a>
                    ';
                    $tileButtonProject .= '
                        <button class="appButton myTask" title="Task" data-projectid = "' . $p_ID . '" rel="myTask" data-color="#AD5E2A" onclick=\'openAppProject(this)\'><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>My Task</a></button>
                        <button class="appButton finance" title="Finance" data-projectid = "' . $p_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                    ';
                }

            }else{
                $flagFinancePackage = false;
                $tileButtonProject .= '
                    <button class="empty"></button>
                ';
            }
        }

        if($project['project_type'] == 'FM'){
            $listButtonProject .= '<button class="appButton myTask" title="Task" data-projectid = "' . $p_ID . '" rel="myTask" data-color="#AD5E2A" onclick=\'openAppProject(this)\'><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>My Task</a></button>';
        }

        if (checkAdminAccess($project['Pro_Role'])){
            $flagAdminProject = true;
            $listButtonProject .= '
                <button class="appButton projectAdmin" title="Admin" data-projectid = "' . $p_ID . '" rel="myAdmin" data-color="#5C5C5C" onclick=\'openAppProject(this)\'><i class="fa-solid fa-user-tie" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Admin</a></button>
            ';
            $tileButtonProject .= '
                <button class="appButton projectAdmin" title="Admin" data-projectid = "' . $p_ID . '" rel="myAdmin" data-color="#5C5C5C" onclick=\'openAppProject(this)\'><i class="fa-solid fa-user-tie" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Admin</a></button>
            ';

            array_push($admin_array, $p_ID);

        }else{
            $tileButtonProject .= '
                <button class="empty"></button>
            ';
        }
        
    }

    $object = (object) [
        'project_id' => $p_ID, 'project_name' => $p_Name,
        'icon_url' => $icon_url, 'project_par_id' => $is_parent,
        'construct_app' => $flagConstructProject, 'asset_app' => $flagAssetProject, 
        'finance_app' => $flagFinanceProject, 'document_app' => $flagDocumentProject,
        'admin_app' => $flagAdminProject
    ];

    array_push($proid_array, $object);

    if (in_array($p_ID, $fav_projArr, TRUE)){
        $favClass .= ' fav';
    }else{
        $favClass .= '';
    }
    $projpackListHTML .= '
        <div class="row project homeProjSearch'.$favClass.'" rel="'.$project['project_id'].'" data-projectid = "' . $p_ID . '">
            <div class="columnIndex"><img src="'.$imgUrl.'"></div>
            <div class="columnFirst textContainer">
                <div class="nameContainer">
                    <span class="text">'.$project['project_name'].'</span>
                </div>
            </div>
            <div class="buttonContainer">
                '.$listButtonProject.'
                <button class="appButton favBtn'.$favClass.'" title="Add as Favourite" data-projectid = "' . $p_ID . '" onclick=\'favProject(event, this)\'><i class="fa-solid fa-star" style="--fa-secondary-opacity: 1; --fa-primary-color: #dbdbdb; --fa-secondary-color: #dbdbdb; font-size:18px;"></i><a></a></button>
            </div>
            <div class="columnThird textContainer" onclick="openMobileAppBtn()"><span class="center"><i class="fa-solid fa-ellipsis-vertical"></i></span></div>
            <div class="columnSecond textContainer"><span class="fontSmall">'.$project['last_login_date'].'</span></div>
        </div>';
    $projectTileHTML .= '
        <div class="tile project homeProjSearch active'.$favClass.'" data-id = "'.$project['project_id'].'" data-parentid = "'.$parent_projID.'" data-projectid = "' . $p_ID . '">
            <div class="imgContainer">
                <img class="projectTitle" src="' . $imgUrl . '">
            </div>
            <div class="textContainer">
                <a class="pName pri">' . $project['project_name'] . '</a>
            </div>
            <div class="buttonContainer">
                '.$tileButtonProject.'
            </div>
        </div>';
    
    if(isset($project['children'])){

        usort($project['children'], function($a, $b) {
            return strcmp($a["project_name"], $b["project_name"]);
        });
        
        foreach ($project['children'] as $package) {
            $flagConstructPackage = ($flagConstructProject) ? true : false;
            $flagAssetPackage = ($flagAssetProject) ? true : false;
            $flagFinancePackage = ($flagFinanceProject) ? true : false;
            $flagDocumentPackage = ($flagDocumentProject) ? true : false;
            $flagAdminPackage = false;

            $imgUrlPackage = (file_exists('../../' . $package['icon_url'])) ? '../../' . $package['icon_url'] : ''; 
            
            $p_ID = $package['project_id_number'];
            $p_Name = $package['project_name'];
            $icon_url = $imgUrlPackage;
            $favClassPackage = '';
            $is_parent = $package['parent_project_id_number'];

            if(!$package['last_access']){
                $package['last_login_date'] = 'Never Accessed';
            }else{
                $lastLoginObjPack = new DateTime($package['last_access']);
                $currentDatePack = new DateTime();
                $intervalPack = $currentDatePack->diff($lastLoginObjPack);
                if($intervalPack->y){
                    $package['last_login_date'] = $intervalPack->y > 1 ? $intervalPack->format('%y years ago') : $intervalPack->format('%y year ago');
                }else if($intervalPack->m){
                    $package['last_login_date'] = $intervalPack->m > 1 ? $intervalPack->format('%m months ago') : $intervalPack->format('%m month ago');
                }else if($intervalPack->d){
                    $package['last_login_date'] = $intervalPack->d > 1 ? $intervalPack->format('%d days ago') : $intervalPack->format('%d day ago');
                }else if($intervalPack->h){
                    $package['last_login_date'] = $intervalPack->h > 1 ? $intervalPack->format('%h hours ago') : $intervalPack->format('%h hour ago');
                }else if($intervalPack->i){
                    $package['last_login_date'] = $intervalPack->i > 1 ? $intervalPack->format('%i minutes ago') : $intervalPack->format('%i minute ago');
                }else if($intervalPack->s){
                    $package['last_login_date'] = $intervalPack->s > 1 ? $intervalPack->format('%s seconds ago') : $intervalPack->format('%s second ago');
                }
            };

            $flagObyuFinance = true;
            if(isset($package['Pro_Role']) && $package['Pro_Role'] == 'Planning Engineer' && $package['owner_org_id'] != 'KACC'){
                $flagObyuFinance = false;
            }

            $listButtonPackage = '
                <button class="appButton riConstruct" title="Insights" data-projectid = "' . $p_ID . '" rel="myInsights" data-color="#198901" onclick=\'openAppProject(this)\'><i class="fa-solid fa-earth-americas" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Insights</a></button>
                <button class="appButton myDashboard" title="Dashboard" data-projectid = "' . $p_ID . '" rel="myDashboard" data-color="#b51173" onclick=\'openAppProject(this)\'><i class="fa-solid fa-gauge" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Dashboard</a></button>
                <button class="appButton myTask" title="Task" data-projectid = "' . $p_ID . '" rel="myTask" data-color="#AD5E2A" onclick=\'openAppProject(this)\'><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>My Task</a></button>

            ';
            $tileButtonPackage = '
                <button class="appButton riConstruct" title="Insights" data-projectid = "' . $p_ID . '" rel="myInsights" data-color="#198901" onclick=\'openAppProject(this)\'><i class="fa-solid fa-earth-americas" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Insights</a></button>
                <button class="appButton myDashboard" title="Dashboard" data-projectid = "' . $p_ID . '" rel="myDashboard" data-color="#b51173" onclick=\'openAppProject(this)\'><i class="fa-solid fa-gauge" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Dashboard</a></button>
                <button class="appButton myTask" title="Task" data-projectid = "' . $p_ID . '" rel="myTask" data-color="#AD5E2A" onclick=\'openAppProject(this)\'><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>My Task</a></button>

            ';

            if($flagDocumentProject){
                if (isset($access_control[$package['Pro_Role']]) && isset($access_control[$package['Pro_Role']]["Project_Document"])) {
                    $listButtonPackage .= '
                        <button class="appButton projectDoc" title="Document" data-projectid = "' . $p_ID . '" rel="myDocument" data-color="#d7ae35" onclick=\'openAppProject(this)\'><i class="fa-solid fa-folder-open" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Document</a></button>
                    ';
                    $tileButtonPackage .= '
                        <button class="appButton projectDoc" title="Document" data-projectid = "' . $p_ID . '" rel="myDocument" data-color="#d7ae35" onclick=\'openAppProject(this)\'><i class="fa-solid fa-folder-open" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Document</a></button>
                    ';
                }else{
                    $tileButtonPackage .= '
                        <button class="empty"></button>
                    ';
                }
            }
            else{
                $tileButtonPackage .= '
                    <button class="empty"></button>
                ';
            }

            if($flagFinanceProject){
                if(!$flagAssetPackage){
                    if($SYSTEM == 'KKR'){
                        if (isset($access_control[$package['Pro_Role']]) && isset($access_control[$package['Pro_Role']]["PFS"])){
                            $listButtonPackage .= '
                                <button class="appButton finance" title="Finance" data-projectid = "' . $p_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                            ';
                            $tileButtonPackage .= '
                                <button class="appButton finance" title="Finance" data-projectid = "' . $p_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                            ';
                        }else{
                            $flagFinancePackage = false;
                            $tileButtonPackage .= '
                                <button class="empty"></button>
                            ';
                        }
                    }else{
                        if (isset($access_control[$package['Pro_Role']]) && isset($access_control[$package['Pro_Role']]["PFS"])){
                            if($flagObyuFinance){
                                if($package['Pro_Role'] == 'Project Manager' && $project['project_id'] == 'NCH' && $package['owner_org_id'] == 'MRSB'){        
                                    $tileButtonPackage .= '
                                        <button class="empty"></button>
                                    ';
                                }
                                else{
                                    $listButtonPackage .= '
                                        <button class="appButton finance" title="Finance" data-projectid = "' . $p_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                                    ';
                                    $tileButtonPackage .= '
                                        <button class="appButton finance" title="Finance" data-projectid = "' . $p_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                                    ';
                                }
                            }
                        }else{
                            $flagFinancePackage = false;
                            $tileButtonPackage .= '
                                <button class="empty"></button>
                            ';
                        }
                    }
                }else{
                    if (isset($access_control_asset[$package['Pro_Role']]) && isset($access_control_asset[$package['Pro_Role']]["PFS"])){
                        $listButtonPackage .= '
                            <button class="appButton finance" title="Finance" data-projectid = "' . $p_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                        ';
                        $tileButtonPackage .= '
                            <button class="appButton finance" title="Finance" data-projectid = "' . $p_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                        ';
                    }else{
                        $flagFinancePackage = false;
                        $tileButtonPackage .= '
                            <button class="empty"></button>
                        ';
                    }
                }
            }
            else{
                $flagFinancePackage = false;
                $tileButtonPackage .= '
                    <button class="empty"></button>
                ';
            }
            
            if (checkAdminAccess($package['Pro_Role'])){
                $flagAdminPackage = true;
                $listButtonPackage .= '
                    <button class="appButton projectAdmin" title="Admin" data-projectid = "' . $p_ID . '" rel="myAdmin" data-color="#5C5C5C" onclick=\'openAppProject(this)\'><i class="fa-solid fa-user-tie" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Admin</a></button>
                ';
                $tileButtonPackage .= '
                    <button class="appButton projectAdmin" title="Admin" data-projectid = "' . $p_ID . '" rel="myAdmin" data-color="#5C5C5C" onclick=\'openAppProject(this)\'><i class="fa-solid fa-user-tie" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Admin</a></button>
                ';

                array_push($admin_array, $p_ID);

            }else{
                $tileButtonPackage .= '
                    <button class="empty"></button>
                ';
            }

            $object = (object) [
                'project_id' => $p_ID, 'project_name' => $p_Name,
                'icon_url' => $icon_url, 'project_par_id' => $is_parent,
                'construct_app' => $flagConstructPackage, 'asset_app' => $flagAssetPackage, 
                'finance_app' => $flagFinancePackage, 'document_app' => $flagDocumentPackage,
                'admin_app' => $flagAdminPackage
            ];
            
            array_push($proid_array, $object);

            if (in_array($p_ID, $fav_projArr, TRUE)){
                $favClassPackage .= ' fav';
            }else{
                $favClassPackage .= '';
            }

            $last_login_date = '0 second ago';
            if (isset($package['last_login_date'])) {
                $last_login_date = $package['last_login_date'];
            }

            // package list
            $projpackListHTML .= '
            <div class="homeProjSearch'.$favClassPackage.'" id="'.$project['project_id'].'" data-projectid = "' . $p_ID . '">
                <div class="row package">
                    <div class="columnIndex"><img src="'.$imgUrlPackage.'"></div>
                    <div class="columnFirst textContainer">
                        <div class="nameContainer">
                            <span class="text">'.$package['project_name'].'</span>
                        </div>
                    </div>
                    <div class="buttonContainer">
                        '.$listButtonPackage.'
                        <button class="appButton favBtn'.$favClassPackage.'" title="Add as Favourite" data-projectid = "' . $p_ID . '" onclick=\'favProject(event, this)\'><i class="fa-solid fa-star" style="--fa-secondary-opacity: 1; --fa-primary-color: #dbdbdb; --fa-secondary-color: #dbdbdb; font-size:18px;"></i><a></a></button>
                    </div>
                    <div class="columnThird textContainer" onclick="openMobileAppBtn()"><span class="center"><i class="fa-solid fa-ellipsis-vertical"></i></span></div>
                    <div class="columnSecond textContainer"><span class="fontSmall">'.$last_login_date.'</span></div>
                </div>
            </div>';
            // package tile
            $packageTileHTML .= '
            <div class="tile package homeProjSearch active'.$favClassPackage.'" data-id = "'.$package['project_id'].'" data-parentid="'.$package['parent_project_id_number'].'" data-projectid = "' . $p_ID . '">
                <div class="imgContainer">
                    <img class="projectTitle" src="'.$imgUrlPackage.'">
                </div>
                <div class="textContainer">
                    <a class="pName pri">'.$package['project_name'].'</a>
                    <a class="pName second">Last Access: '.$last_login_date.'</a>
                </div>
                <div class="buttonContainer">
                    '.$tileButtonPackage.'
                </div>
            </div>';

            //for list of package in new, bulk and manage process
            //skip UTSB as it doesnt have Construction access
            if($SYSTEM == 'OBYU'){if($package['owner_org_id'] == 'UTSB') continue;}

            if($package['project_type'] == 'ASSET'){
                $assetProcessPackageHTML .= '
                    <div class="row wizard processProjSearch" rel='.$package['project_id'].' data-parentprojectidnumber='.$package['parent_project_id_number'].' data-projectid='.$package['project_id'].' data-projectidnumber='.$package['project_id_number'].' data-projectowner="'.$package['project_owner'].'" onclick="projectClick(this)">
                        <div class="columnIndex"><img src="'.$imgUrlPackage.'"></div>
                            <div class="columnFirst textContainer wizard">
                                <span class="text ellipsis">'.$package['project_name'].'</span>
                            </div>
                            <div class="columnSecond textContainer wizard"><span class="fontSmall">'.$package['last_login_date'].'</span></div>
                        </div>
                        <div id='.$package['project_id'].'>
                    </div>';
            }
            else{
                $processPackageHTML .= '
                    <div class="row wizard processProjSearch" rel='.$package['project_id'].' data-parentprojectidnumber='.$package['parent_project_id_number'].' data-projectid='.$package['project_id'].' data-projectidnumber='.$package['project_id_number'].' data-projectowner="'.$package['project_owner'].'" data-projectphase="'.$package['project_phase'].'" onclick="projectClick(this)">
                        <div class="columnIndex"><img src="'.$imgUrlPackage.'"></div>
                            <div class="columnFirst textContainer wizard">
                                <span class="text ellipsis">'.$package['project_name'].'</span>
                            </div>
                            <div class="columnSecond textContainer wizard"><span class="fontSmall">'.$last_login_date.'</span></div>
                        </div>
                        <div id='.$package['project_id'].'>
                    </div>';
            }

            if($package['project_type'] == 'ASSET'){
                $assetProcessPackageBulkHTML .= '
                    <div class="row wizard processProjSearch" rel='.$package['project_id'].' data-parentprojectidnumber='.$package['parent_project_id_number'].' data-projectid='.$package['project_id'].' data-projectidnumber='.$package['project_id_number'].' data-projectowner="'.$package['project_owner'].'" onclick="projectClick(this)">
                        <div class="columnIndex"><img src="'.$imgUrlPackage.'"></div>
                            <div class="columnFirst textContainer wizard">
                                <span class="text ellipsis">'.$package['project_name'].'</span>
                            </div>
                            <div class="columnSecond textContainer wizard"><span class="fontSmall">'.$package['last_login_date'].'</span></div>
                        </div>
                        <div id='.$package['project_id'].'>
                    </div>';
            }
            else{
                $processPackageBulkHTML .= '
                    <div class="row wizard processProjSearch" rel='.$package['project_id'].' data-parentprojectidnumber='.$package['parent_project_id_number'].' data-projectid='.$package['project_id'].' data-projectidnumber='.$package['project_id_number'].' data-projectowner="'.$package['project_owner'].'" data-projectphase="'.$package['project_phase'].'" onclick="projectClick(this)">
                        <div class="columnIndex"><img src="'.$imgUrlPackage.'"></div>
                            <div class="columnFirst textContainer wizard">
                                <span class="text ellipsis">'.$package['project_name'].'</span>
                            </div>
                            <div class="columnSecond textContainer wizard"><span class="fontSmall">'.$last_login_date.'</span></div>
                        </div>
                        <div id='.$package['project_id'].'>
                    </div>';
            }
            
        }
    }
}

//-----------------START SYSTEM ADMIN--------------------//
//for create new process app (construct or asset) in system admin
if($SYSTEM == 'OBYU'){
    $constructProcessApp = [
        "app_NCR" => "Non Conformance Report (NCR)",
        "app_WIR" => "Work Inspection Request (WIR)",
        "app_RFI" => "Request For Information (RFI)",
        "app_MOS" => "Method Statement (MS)",
        "app_MS" => "Material Submission (MT)",
        "app_IR" => "Incident (INC)",
        "app_SDL" => "Site Diary (SD)",
        "app_SD" => "Site Instruction (SI)",
        "app_RS" => "Report Submission (RS)",
        "app_SA" => "Safety Activity (SA)",
        "app_SMH" => "Total Safe Man-Hour Works Without LTI (SMH)",
        "app_PTW" => "Permit To Work (PTW)",
        "app_CAR" => "Corrective Action Request (CAR)",
        "app_RR" => "Risk Register (RR)",
        "app_NOI" => "Notice Of Improvement (NOI)",
        "app_PUBC" => "Public Complaint (PBC)",
        "app_EVNT" => "Event (EVNT)",
        "app_LAND" => "Land (LTD & LM)"
    ];

    $assetProcessApp = [];
}else{
    $constructProcessApp = [
        "app_NOI" => "Notice Of Improvement (NOI)",
        "app_NCR" => "Non Conformance Report (NCR)",
        "app_WIR" => "Work Inspection Request (WIR)",
        "app_DCR" => "Design Change Request (DCR)",
        "app_RFI" => "Request For Information (RFI)",
        "app_MOS" => "Method Statement (MS)",
        "app_MS" => "Material Acceptance (MT)",
        "app_IR" => "Incident (INC)",
        "app_SDL" => "Site Daily Log (SDL)",
        "app_SD" => "Site Direction (SD)",
        "app_RS" => "Report Submission (RS)",
        "app_SA" => "Safety Activity (SA)",
        "app_SMH" => "Total Man-Hours (SMH)",
        "app_RR" => "Risk Register (RR)",
        "app_LR" => "Land Registration (LR)",
        "app_LI" => "Land Issue (LI)",
        "app_LE" => "Land Encumbrances (LE)",
        "app_LS" => "Land Summary (LS)",
        "app_PBC" => "Public Complaint (PBC)",
        "app_DA" => "Approved Design Drawing (DA)",
        "app_PU" => "Progress Update (PU)",
        "app_RSDL" => "RET’s Site Diary Log (RSDL)"
    ];

    $assetProcessApp = [
        "app_asset_insp" => "Inspection",
        "app_asset_assess" => "Assesment",
        "app_asset_rm" => "Routine Maintainence",
        "app_asset_pm" => "Periodic Maintainence",
        "app_asset_ew" => "Emergency Works",
        "app_asset_rfi" => "Request for Inspection",
        "app_asset_ncp" => "Non Conformance Product",
        "app_asset_pca" => "Pavement Analysis Upload",
        "app_asset_setup" => "Setup"
    ];
}

$constructAppHTML = "";
$assetAppHTML = "";

foreach ($constructProcessApp as $kc => $vc) {
    $constructAppHTML .= 
    '<div class="content-sub">
        <div class="content-right"><span class="textWrap">'.$vc.'</span></div>
        <div class="content-left">
            <input type="checkbox" class="resetcheck jogetApp_list" id="'.$kc.'" name="" value="" onclick="" disabled>
        </div>
    </div>';
}

foreach ($assetProcessApp as $ka => $va) {
    $assetAppHTML .= 
    '<div class="content-sub">
        <div class="content-right"><span class="textWrap">'.$va.'</span></div>
        <div class="content-left">
            <input type="checkbox" class="resetcheck jogetApp_list" id="'.$ka.'" name="" value="" onclick="" disabled>
        </div>
    </div>';
}

//-----------------END SYSTEM ADMIN--------------------//
foreach ($noParentPackage_array as $noParentPackage) {
    // This section solely for package that dont have parent
    $flagConstructProject = false;
    $flagAssetProject = false;
    $flagFinanceProject = false;
    $flagDocumentProject = false;

    $project_ID = $noParentPackage['project_id_number'];
    $parent_Project_ID = $noParentPackage['parent_project_id_number'];
    $project_phase = $noParentPackage['project_phase'];
    $fav_projArr = explode(",", $_SESSION['fav_proj']);
    $favClass = '';
    $imgUrl = (file_exists('../../' . $noParentPackage['icon_url'])) ? '../../' . $noParentPackage['icon_url'] : '';

    $p_ID = $noParentPackage['project_id_number'];
    $p_Name = $noParentPackage['project_name'];
    $icon_url = $imgUrl;
    $is_parent = $noParentPackage['parent_project_id_number'];

    //to check have app access or not
    $sqlApps = "SELECT * from project_apps_process WHERE project_id = :0";
    $checkingApp = $CONN->fetchRow($sqlApps, array($parent_Project_ID));

    if($checkingApp){
        $checkConstruct = $checkingApp['constructPackage_name'];
        $checkFinance = $checkingApp['financePackage_name'];
        $checkDocument = $checkingApp['documentPackage_name'];

        if (strpos($checkConstruct, 'ri_asset') !== false) {
            $flagAssetProject = true;
            $flagAssetApp = true;
        }
        if (strpos($checkConstruct, 'ri_construct') !== false) {
            $flagConstructProject = true;
        }
        if($checkFinance){
            $flagFinanceProject = true;
        }
        if($checkDocument){
            $flagDocumentProject = true;
        }
    }

    $flagConstructPackage = ($flagConstructProject) ? true : false;
    $flagAssetPackage = ($flagAssetProject) ? true : false;
    $flagFinancePackage = ($flagFinanceProject) ? true : false;
    $flagDocumentPackage = ($flagDocumentProject) ? true : false;
    $flagAdminPackage = false;

    if(!$noParentPackage['last_access']){
        $noParentPackage['last_login_date'] = 'Never Accessed';
    }else{
        $lastLoginObjPack = new DateTime($noParentPackage['last_access']);
        $currentDatePack = new DateTime();
        $intervalPack = $currentDatePack->diff($lastLoginObjPack);
        if($intervalPack->y){
            $noParentPackage['last_login_date'] = $intervalPack->y > 1 ? $intervalPack->format('%y years ago') : $intervalPack->format('%y year ago');
        }else if($intervalPack->m){
            $noParentPackage['last_login_date'] = $intervalPack->m > 1 ? $intervalPack->format('%m months ago') : $intervalPack->format('%m month ago');
        }else if($intervalPack->d){
            $noParentPackage['last_login_date'] = $intervalPack->d > 1 ? $intervalPack->format('%d days ago') : $intervalPack->format('%d day ago');
        }else if($intervalPack->h){
            $noParentPackage['last_login_date'] = $intervalPack->h > 1 ? $intervalPack->format('%h hours ago') : $intervalPack->format('%h hour ago');
        }else if($intervalPack->i){
            $noParentPackage['last_login_date'] = $intervalPack->i > 1 ? $intervalPack->format('%i minutes ago') : $intervalPack->format('%i minute ago');
        }else if($intervalPack->s){
            $noParentPackage['last_login_date'] = $intervalPack->s > 1 ? $intervalPack->format('%s seconds ago') : $intervalPack->format('%s second ago');
        }
    }

    if (in_array($project_ID, $fav_projArr, TRUE)) {
        $favClass .= ' fav';
    } else {
        $favClass .= '';
    }

    $last_login_date = '0 second ago';
    if (isset($noParentPackage['last_login_date'])) {
        $last_login_date = $noParentPackage['last_login_date'];
    }

    $listButtonHTML = '
        <button class="appButton riConstruct" title="Insights" data-projectid = "' . $project_ID . '" rel="myInsights" data-color="#198901" onclick=\'openAppProject(this)\'><i class="fa-solid fa-earth-americas" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Insights</a></button>
        <button class="appButton myDashboard" title="Dashboard" data-projectid = "' . $project_ID . '" rel="myDashboard" data-color="#73009F" onclick=\'openAppProject(this)\'><i class="fa-solid fa-gauge" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Dashboard</a></button>
        <button class="appButton myTask" title="Task" data-projectid = "' . $project_ID . '" rel="myTask" data-color="#AD5E2A" onclick=\'openAppProject(this)\'><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>My Task</a></button>
    ';

    $tileButtonHTML = '
        <button class="appButton riConstruct" title="Insights" data-projectid = "' . $project_ID . '" rel="myInsights" data-color="#198901" onclick=\'openAppProject(this)\'><i class="fa-solid fa-earth-americas" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Insights</a></button>
        <button class="appButton myDashboard" title="Dashboard" data-projectid = "' . $project_ID . '" rel="myDashboard" data-color="#b51173" onclick=\'openAppProject(this)\'><i class="fa-solid fa-gauge" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Dashboard</a></button>
        <button class="appButton myTask" title="Task" data-projectid = "' . $project_ID . '" rel="myTask" data-color="#AD5E2A" onclick=\'openAppProject(this)\'><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>My Task</a></button>

    ';

    if($flagDocumentProject){
        if (isset($access_control[$noParentPackage['Pro_Role']]) && isset($access_control[$noParentPackage['Pro_Role']]["Project_Document"])) {
            $listButtonHTML .= '
                <button class="appButton projectDoc" title="Document" data-projectid = "' . $project_ID . '" rel="myDocument" data-color="#d7ae35" onclick=\'openAppProject(this)\'><i class="fa-solid fa-folder-open" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Document</a></button>
            ';
            $tileButtonHTML .= '
                <button class="appButton projectDoc" title="Document" data-projectid = "' . $project_ID . '" rel="myDocument" data-color="#d7ae35" onclick=\'openAppProject(this)\'><i class="fa-solid fa-folder-open" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Document</a></button>
            ';
        }else{
            $tileButtonHTML .= '
                <button class="empty"></button>
            ';
        }
    }
    else{
        $tileButtonHTML .= '
            <button class="empty"></button>
        ';
    }

    if($flagFinanceProject){
        if(!$flagAssetPackage){
            if (isset($access_control[$noParentPackage['Pro_Role']]) && isset($access_control[$noParentPackage['Pro_Role']]["PFS"])){
                $listButtonHTML .= '
                    <button class="appButton finance" title="Finance" data-projectid = "' . $project_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                ';
                $tileButtonHTML .= '
                    <button class="appButton finance" title="Finance" data-projectid = "' . $project_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                ';
            }else{
                $flagFinancePackage = false;
                $tileButtonHTML .= '
                    <button class="empty"></button>
                ';
            }
        }else{
            if (isset($access_control_asset[$noParentPackage['Pro_Role']]) && isset($access_control_asset[$noParentPackage['Pro_Role']]["PFS"])){
                $listButtonHTML .= '
                    <button class="appButton finance" title="Finance" data-projectid = "' . $project_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                ';
                $tileButtonHTML .= '
                    <button class="appButton finance" title="Finance" data-projectid = "' . $project_ID . '" rel="myFinance" data-color="#008f8e" onclick=\'openAppProject(this)\'><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon); font-size:21px;"></i><a>Finance</a></button>
                ';
            }else{
                $flagFinancePackage = false;
                $tileButtonHTML .= '
                    <button class="empty"></button>
                ';
            }
        }
    }
    else{
        $flagFinancePackage = false;
        $tileButtonHTML .= '
            <button class="empty"></button>
        ';
    }

    $object = (object) [
        'project_id' => $p_ID, 'project_name' => $p_Name,
        'icon_url' => $icon_url, 'project_par_id' => $is_parent,
        'construct_app' => $flagConstructPackage, 'asset_app' => $flagAssetPackage, 
        'finance_app' => $flagFinancePackage, 'document_app' => $flagDocumentPackage,
        'admin_app' => $flagAdminPackage
    ];
    
    array_push($proid_array, $object);

    $projpackListHTML .= '
        <div class="row package homeProjSearch'.$favClass.'" style="display: flex;" rel="'.$noParentPackage['project_id'].'" data-projectid = "' . $project_ID . ' data-projectphase = "' . $project_phase . '">
            <div class="columnIndex"><img src="'.$imgUrl.'"></div>
            <div class="columnFirst textContainer">
                <div class="nameContainer">
                    <span class="text">'.$noParentPackage['project_name'].'</span>
                </div>
            </div>
            <div class="buttonContainer">
                '.$listButtonHTML.'
                <button class="appButton favBtn'.$favClass.'" title="Add as Favourite" data-projectid = "' . $project_ID . '" onclick=\'favProject(event, this)\'><i class="fa-solid fa-star" style="--fa-secondary-opacity: 1; --fa-primary-color: #dbdbdb; --fa-secondary-color: #dbdbdb; font-size:18px;"></i><a></a></button>
            </div>
            <div class="columnThird textContainer" onclick="openMobileAppBtn()"><span class="center"><i class="fa-solid fa-ellipsis-vertical"></i></span></div>
            <div class="columnSecond textContainer"><span class="fontSmall">'.$last_login_date.'</span></div>
        </div>';

    $packageTileHTML .= '
        <div class="tile package homeProjSearch active'.$favClass.'" data-id = "'.$noParentPackage['project_id'].'" data-parentid="'.$noParentPackage['parent_project_id_number'].'" data-projectid = "' . $project_ID . ' data-projectphase = "' . $project_phase . '">
            <div class="imgContainer">
                <img class="projectTitle" src="'.$imgUrl.'">
            </div>
            <div class="textContainer">
                <a class="pName pri">'.$noParentPackage['project_name'].'</a>
                <a class="pName second">Last Access: '.$last_login_date.'</a>
            </div>
            <div class="buttonContainer">
                '.$tileButtonHTML.'
            </div>
        </div>';
    
    
    //for list of package in new, bulk and manage process
    //skip UTSB as it doesnt have Construction access
    if($SYSTEM == 'OBYU'){if($noParentPackage['owner_org_id'] == 'UTSB') continue;}

    if ($noParentPackage['project_type'] == 'ASSET') {
        $assetProcessPackageHTML .= '
            <div class="row wizard processProjSearch" rel='.$noParentPackage['project_id'].' data-parentprojectidnumber='.$noParentPackage['parent_project_id_number'].' data-projectid='.$noParentPackage['project_id'].' data-projectidnumber='.$noParentPackage['project_id_number'].' data-projectowner="'.$noParentPackage['project_owner'].'" onclick="projectClick(this)">
                <div class="columnIndex"><img src="'.$imgUrl.'"></div>
                    <div class="columnFirst textContainer wizard">
                        <span class="text ellipsis">'.$noParentPackage['project_name'].'</span>
                    </div>
                    <div class="columnSecond textContainer wizard"><span class="fontSmall">'.$noParentPackage['last_login_date'].'</span></div>
                </div>
                <div id='.$noParentPackage['project_id'].'>
            </div>';
    } else {
        $processPackageHTML .= '
            <div class="row wizard processProjSearch" rel='.$noParentPackage['project_id'].' data-parentprojectidnumber='.$noParentPackage['parent_project_id_number'].' data-projectid='.$noParentPackage['project_id'].' data-projectidnumber='.$noParentPackage['project_id_number'].' data-projectowner="'.$noParentPackage['project_owner'].'" data-projectphase = "'.$project_phase.'" onclick="projectClick(this)" >
                <div class="columnIndex"><img src="'.$imgUrl.'"></div>
                    <div class="columnFirst textContainer wizard">
                        <span class="text ellipsis">'.$noParentPackage['project_name'].'</span>
                    </div>
                    <div class="columnSecond textContainer wizard"><span class="fontSmall">'.$last_login_date.'</span></div>
                </div>
                <div id='.$noParentPackage['project_id'].'>
            </div>';
    }

    //skip SSLR2 in bulk register as it is not in the URS
    if(isset($project['project_owner']) && $project['project_owner'] == 'SSLR2'){continue;}

    if($noParentPackage['project_type'] == 'ASSET'){
        $assetProcessPackageBulkHTML .= '
            <div class="row wizard processProjSearch" rel='.$noParentPackage['project_id'].' data-parentprojectidnumber='.$noParentPackage['parent_project_id_number'].' data-projectid='.$noParentPackage['project_id'].' data-projectidnumber='.$noParentPackage['project_id_number'].' data-projectowner="'.$noParentPackage['project_owner'].'" onclick="projectClick(this)">
                <div class="columnIndex"><img src="'.$imgUrl.'"></div>
                    <div class="columnFirst textContainer wizard">
                        <span class="text ellipsis">'.$noParentPackage['project_name'].'</span>
                    </div>
                    <div class="columnSecond textContainer wizard"><span class="fontSmall">'.$noParentPackage['last_login_date'].'</span></div>
                </div>
                <div id='.$noParentPackage['project_id'].'>
            </div>';
    }
    else{
        $processPackageBulkHTML .= '
            <div class="row wizard processProjSearch" rel='.$noParentPackage['project_id'].' data-parentprojectidnumber='.$noParentPackage['parent_project_id_number'].' data-projectid='.$noParentPackage['project_id'].' data-projectidnumber='.$noParentPackage['project_id_number'].' data-projectowner="'.$noParentPackage['project_owner'].'" data-projectphase="'.$noParentPackage['project_phase'].'" onclick="projectClick(this)">
                <div class="columnIndex"><img src="'.$imgUrl.'"></div>
                    <div class="columnFirst textContainer wizard">
                        <span class="text ellipsis">'.$noParentPackage['project_name'].'</span>
                    </div>
                    <div class="columnSecond textContainer wizard"><span class="fontSmall">'.$last_login_date.'</span></div>
                </div>
                <div id='.$noParentPackage['project_id'].'>
            </div>';
    }
}

$dataUserProject = $fetchUserProject;
$_SESSION['project_list'] = $proid_array;
$_SESSION['admin_pro'] = $admin_array;

include_once("../BackEnd/class/jogetLink.class.php");
$constructLinkObj = new JogetLink();
$constructLinkObj->setToGlobalJSVariable();

echo '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title id="titleDesc"></title>
    <link id="titleIcon" rel="shortcut icon" href="" type="image/x-icon" />
    <script src="../JS/JsLibrary/jquery-3.5.1.js"></script>
    <script src="../JS/JsLibrary/jquery-ui.js"></script>
    <script src="../JS/JsLibrary/jquery-confirm.min.js"></script>
    <script src="../JS/JsLibrary/jogetUtil.js" ></script>
    <script src="../JS/resizeable.js"></script>
    <script src="../JS/JsLibrary/mixitup.min.js"></script>
    <script src="../JS/uploader/riskUploadv3.js"></script>
    <script src = "../JS/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="../JS/JsLibrary/spectrum.css">                 <!--     CSS for colorpicker in markup tool-->
    <script  defer src= "../JS/JsLibrary/spectrum.js"></script>                    <!--     JS for colorpicker in markup tool-->
    <script src="../JS/JsLibrary/JSTree/jstree.min.js"></script>                   <!--     Js for creating folder tree-->
    <link rel="stylesheet" href="../JS/JsLibrary/JSTree/style.min.css" />                  <!--     CSS for jstree-->
    <link rel="stylesheet" href="../CSS/v3/home.css">
    <link rel="stylesheet" href="../CSS/V3/dashboard.css">  
    <link rel="stylesheet" href="../CSS/v3/Wizard.css">
    <link rel="stylesheet" href="../CSS/v3/Navbar.css">
    <link rel ="stylesheet" href ="../CSS/v3/tooltip.css" type ="text/css" />
    <link rel="stylesheet" href="../JS/JsLibrary/jquery-confirm.min.css">
    <link rel="stylesheet" href="../CSS/kbd.css">
    <link rel="stylesheet" href="../CSS/swiper-bundle.css">
    <link href="../JS/RICore/Widgets/widgets.css" rel="stylesheet">                 <!--     CSS for cesium map-->
    <script src="../JS/RICore/Cesium.js"></script>                                 <!--     JS for cesium map-->
    <script src="../JS/RICore/Compass/viewerCesiumNavigationMixin.js"></script>    <!--     Js for cesium compas (top left of screen)-->
    <link rel="stylesheet" type="text/css" href="../JS/JSLibrary/spectrum.css">
    <script type="text/javascript" src="../JS/JSLibrary/spectrum.js"></script>
    <!-- <link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"/> -->
    <link rel="stylesheet" href="../CSS/fontawesome7/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" href="../CSS/fontawesome7/fontawesome-free/css/fontawesome.min.css">
    <link rel="stylesheet" href="../CSS/fontawesome7/fontawesome-free/css/solid.min.css">
    <link rel="stylesheet" href="../CSS/fontawesome7/fontawesome-free/css/regular.min.css">
    <link rel="stylesheet" href="../CSS/fontawesome7/fontawesome-free/css/brands.min.css">

    <!-- PHOTOSPHERE -->
    <link rel="stylesheet" href="../CSS/photo-sphere-viewer.min.css" />
    <script src="../JS/JsLibrary/openLayer/three.min.js"></script>
    <script src="../JS/JsLibrary/openLayer/photo-sphere-viewer.min.js"></script>

    <!-- GANTT CHART -->
    <script src="../JS/ganttV3/gantt.js"></script>                                   <!--     JS for gantt chart-->
    <link rel="stylesheet" href="../JS/ganttV3/gantt.css" type="text/css"/>

    <!-- OPENLAYER -->
    <link rel="stylesheet" href="../CSS/openLayer.css" type="text/css"/>
    <script src="../JS/JsLibrary/openLayer/openLayer.js"></script>
        

    <!-- multi select  -->
    <link href="../CSS/V3/selectize.default.css" rel="stylesheet" />
    <script src="../JS/JsLibrary/selectizev3.js"></script>

    <script src="../JS/all.js"></script>

	<link rel="stylesheet" href="../css/style.css"> <!-- Resource style -->
	<script src="../JS/modernizr.js"></script> <!-- Modernizr -->

</head>';

$prodFlag = (isset($PRODUCTION_FLAG) && $PRODUCTION_FLAG == true) ? 'true' : 'false';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
$radioTheme = '';

if(isset($PRODUCTION_FLAG) && $PRODUCTION_FLAG == true){
    if ($themeClass == 'dark'){
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="lightMode" value="light">
                            <label for="lightMode">Light</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark"  checked>
                            <label for="darkMode">Dark</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                        </div>';
    }else if($themeClass == 'light') {
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="lightMode" value="light" checked>
                            <label for="lightMode">Light</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                        </div>';
    }else if($themeClass == 'darling') {
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="lightMode" value="light">
                            <label for="lightMode">Light</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling" checked>
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                        </div>';
    }else if($themeClass == 'matcha') {
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="lightMode" value="light">
                            <label for="lightMode">Light</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha" checked>
                            <label for="matcha">Matcha</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                        </div>';
    }else if($themeClass == 'laser') {
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="lightMode" value="light">
                            <label for="lightMode">Light</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser" checked>
                            <label for="laser">Laser</label>
                            <br>
                        </div>';
    }else{
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default" checked>
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="lightMode" value="light">
                            <label for="lightMode">Light</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                        </div>';
    }
}else{
    if ($themeClass == 'dark'){
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark" checked>
                            <label for="darkMode">Dark</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                            <br>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="digileMode" value="digile">
                            <label for="digileMode">Twinsights</label>
                            <br>
                        </div>';
    }else if($themeClass == 'digile') {
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="digileMode" value="digile" checked>
                            <label for="digileMode">Twinsights</label>
                        </div>';
    }else if($themeClass == 'darling') {
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling" checked>
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="digileMode" value="digile">
                            <label for="digileMode">Twinsights</label>
                        </div>';
    }else if($themeClass == 'matcha') {
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha" checked>
                            <label for="matcha">Matcha</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="digileMode" value="digile">
                            <label for="digileMode">Twinsights</label>
                            <br>
                        </div>';
    }else if($themeClass == 'laser') {
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default">
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser" checked>
                            <label for="laser">Laser</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="digileMode" value="digile">
                            <label for="digileMode">Twinsights</label>
                            <br>
                        </div>';
    }else{
        $radioTheme .= '<div class="col1">
                            <input class="sysMode" type="radio" name="sysMode" id="defaultMode" value="default" checked>
                            <label for="lightMode">System Default</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="darkMode" value="dark">
                            <label for="darkMode">Dark</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="matchaMode" value="matcha">
                            <label for="matcha">Matcha</label>
                        </div>
                        <div class="col2">
                            <input class="sysMode" type="radio" name="sysMode" id="darlingMode" value="darling">
                            <label for="darling">Ruby</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="laserMode" value="laser">
                            <label for="laser">Laser</label>
                            <br>
                            <input class="sysMode" type="radio" name="sysMode" id="digileMode" value="digile">
                            <label for="digileMode">Twinsights</label>
                            <br>
                        </div>';
    }
}

echo '
<body class="preload '.$themeClass.'">
    <nav class="nav-bar index" >
        <div class="navbarButton menuButton" id="sidebarItemOpen" rel="appsBar" title="Menu Bar"><img src="../Images/icons/navbar/dark_red/show-apps-button.png" alt=""></div>
        <div class="navbarButton RiLogo noHover">
            <img class="riImage" src="">
            <div id="riDescParent">
                <img id="riDesc" src="">
            </div>
        </div>
        <div class="navbarButton profile" id="usersetting" rel="profileBar" title="Profile" >
            <img id="userImage" class="userImage" src="'.$userProfileImg.'">
        </div>
        <div class="navbarButton project" title="Project" rel="projectView" onclick="wizardOpenPage(this)" data-width="55" data-height="80">
            <span class = "projectName"></span>
        </div>
        <div class="navbarButton bell toolButton" rel="notiPanel" title="Notification Bell" >
            <span class="bellContainer swing" data-count="999">
                <i class="fa-solid fa-bell"></i>
            </span>
        </div>
    </div>
    </nav>

    <div class="appsbar" id="appsBar">
        <div class="appscontainer">
            <h3></h3>
            <div class="scrollcontainer scrollbar-inner">
                <div class="appsbutton"  id="sideBarButtonLink">
                    <button onclick="window.open(\'https://wsg.reveronconsulting.com/ReveronInsights/Documentation/Home.php\')"><span class="img"><img src="../Images/icons/third_button/open-book.png"></span><span class="atag"><a>Product Documentation</a></span></button>
                    <!--<button value="Open Window" onclick = "window.open(\'https://wsg.reveronconsulting.com/imodelJS\')" ><span class="img"><img src="../Images/icons/appsbar/imodel.jpg"></span><span class="atag"><a>iModel.js</a></span></button>-->';
                    if(isset($_SESSION['theme_mode']) && $_SESSION['theme_mode'] == "digile"){
                        echo '<button id="appWebsite" value="Open Window" onclick="window.open(\'https://digile.com/\')" ><span class="img"><img class="riLogoNavbar" src=""></span><span class="atag"><a class="appProperties"></a></span></button>';
                    }else{
                        echo '<button id="appWebsite" value="Open Window" onclick="window.open(\'https://www.reveronconsulting.com/\')" ><span class="img"><img class="riLogoNavbar" src=""></span><span class="atag"><a class="appProperties"></a></span></button>';
                    }
                    if($_SESSION['support_user'] == '1'){
                        echo'
                            <button value="Open Window" onclick=OnClickRaiseSupport() ><span class="img"><img src="../Images/icons/appsbar/service_request.png"></span><span class="atag"><a>Support Request</a></span></button>
                        ';
                    }
                    echo'
                </div>
            </div>
        </div>

        <div class="projectContainerNav">
            <h3>Projects</h3>
            <div class="scrollcontainer scrollbar-inner" id="projectListContainer">
                <div class="appsbutton" id="projectslist">
                </div>
                <div class="appsbutton" id="projectslistOther">
                </div>
            </div>  
        </div>
    </div>

    <div class = "profileBar" id= "profileBar">
        <div class="profileName">
            <div class="col1">
                <img class="userImage" src="'.$userProfileImg.'">
            </div>
            <div class="col2">
                <span class="atag name"><a id="profileNameTag">' . $_SESSION["firstname"] .'</a></span>
                <br>
                <span class="atag email" id="myprofileEmail"><a>' .$_SESSION["email"] . '</a></span>
            </div>
	    </div>
        <div class="buttonSection" rel="profile" onclick="wizardOpenPage(this)" data-width="55">
            <span class="atag"><i class="fa-regular fa-user" style="font-size: 13px; margin-right: 5px"></i><a>  View Profile</a></span>
        </div>
        <div class="themeSection">
            <div class="themeChange">
                <div class="head">
                    <span><i class="fa-solid fa-palette" style="font-size: 13px; margin-right: 5px;"></i>    System Mode</span>
                </div>
                <div class="buttonContainer">
                    '.$radioTheme.'
                </div>
            </div>
        </div>';
        if($SYSTEM == 'OBYU'){
            if(isset($_SESSION['user_org']) && $_SESSION['user_org'] != 'MRSB'){
                echo '<div class="uiSection">
                        <div class="interfaceChange">
                            <div class="head">
                                <span class="atag"><a>Prefer the old user interface?</a></span>
                            </div>
                            <div class="buttonContainer">
                                <span><button class="btn" onclick="oldUI()">Yes, please!</button></span>
                            </div>
                        </div>
                    </div>';
            }
        }
        echo'
        <div class="newsSection '.(($SYSTEM == 'KKR') ? 'noUIPref' : '').'">
            <div class="head">
                <span class="atag"><a>News Feed</a></span>
            </div>
            <div id="newsContentContainer" class="contentContainer">
            </div>
        </div>
        <form class="formLogout" action ="include/logout">
            <button type = "submit" id="signOut" name="signOut"><span class="atag"><i class="fa-solid fa-door-open" style="font-size: 13px; margin-right: 5px"></i><a style="text-decoration: none">  Sign Out</a></span></button>
        </form>
    </div>

    <div class="appButtonContainer" style="">';
    if ($projectManager) {
        echo '
        <div class="mainAppButton show noSubMenu '.$classDashboardActive.'" rel="myReporting" onclick = "changeApps(this)" data-color="#1e88e5">
            <i class="fa-solid fa-chart-line"></i>
            <span class="active">Reporting</span>
        </div>';
    }
    if($_SESSION['USER_TYPE'] == 'system_admin'){
        $sysAdminHTML = '
            <div class="mainAppButton  hs sysAdmin" style = "display: flex" rel="mySysAdmin" data-color="#5C5C5C" onclick = "changeApps(this)">
                <i class="fa-solid fa-screwdriver-wrench"></i>
                <span>SysAdmin</span>
            </div>
        ';

        $postLoginRole = 'System Admin';
       
        $sysAdminUserHTML = '
            <div class="subButton" id = "activeUser" rel = "main-active-user" onclick = "onFunctionSysAdmin(this, \'mySysAdmin\')">
                <span class="parentTagName">Active User</span>
            </div>
            <div class="subButton" id = "inactiveUser" rel = "main-inactive-user" onclick = "onFunctionSysAdmin(this, \'mySysAdmin\')">
                <span class="parentTagName">Inactive User</span>
            </div>
            <div class="subButton" id = "addNewUser" rel = "addNewUser" data-width="55" data-height="80" data-title="New User" data-type="new" onclick = "wizardOpenPage(this)">
                <span class="parentTagName">Add User</span>
            </div>
            <div class="subButton" id = "importUser" rel = "main-import-user" onclick = "OnClickImportUsers()">
                <span class="parentTagName">Import User</span>
            </div>
            <div class="subButton" id = "exportUser" rel = "main-export-user" onclick = "OnClickExportUsers()">
                <span class="parentTagName">Export User</span>
            </div>
        ';
        $sysAdminProjectHTML = '
            <div class="subButton" id = "activeProject" rel = "main-active-project" onclick = "onFunctionSysAdmin(this, \'mySysAdmin\')">
                <span class="parentTagName">Active Project</span>
            </div>
            <div class="subButton" id = "addNewProject" rel = "addNewProject" data-width="75" data-height="80" data-title="Add New Project" data-type="new" onclick = "wizardOpenPage(this)">
                <span class="parentTagName">New Project</span>
            </div>
            <div class="subButton" id = "archivedProject" rel = "main-archived-project" onclick = "onFunctionSysAdmin(this, \'mySysAdmin\')">
                <span class="parentTagName">Archived Project</span>
            </div>
        ';
        $systemTabsHTML = '
            <div class="subButton" id = "tokenMgmt" rel = "main-tokenmgmt-project" onclick = "onFunctionSysAdmin(this, \'mySysAdmin\')">
                <span class="parentTagName">Manage Tokens</span>
            </div>
        ';
        $_SESSION['isSysadmin'] = true;
    }
    
    echo'
        <div class="mainAppButton show '.$projMenu.' '.$classActive.'" rel="myProject" onclick = "changeApps(this)" data-color="#1e88e5">
            <i class="fa-solid fa-puzzle-piece"></i>
            <span class="active">Project</span>
        </div>
        <div class="mainAppButton eLibrary" rel="eLibrary" onclick = "changeApps(this)" data-color="#1e88e5">
            <i class="fa-solid fa-book"></i>
            <span class="active">E-Library</span>
        </div>
        <div class="mainAppButton projectInformation" rel="projectInformation" onclick = "changeApps(this)" data-color="#1e88e5">
            <i class="fa-solid fa-circle-info"></i>
            <span class="active">Project<br>Information</span>
        </div>
        <div class="mainAppButton hs wp noSubMenu" rel="myInsights" onclick = "changeApps(this)" data-color="#198901">
            <i class="fa-solid fa-earth-americas"></i>
            <span>Insights</span>
        </div>
        <div class="mainAppButton hs wp" rel="myDashboard" onclick = "changeApps(this)" data-color="#b51173">
            <i class="fa-solid fa-gauge"></i>
            <span>Dashboard</span>
        </div>
        <div class="mainAppButton hs p" rel="myTask" onclick = "changeApps(this)" data-color="#AD5E2A">
            <i class="fa-solid fa-clipboard-list"></i>
            <span>My Task</span>
        </div>
        <div class="mainAppButton hs p" rel="myDocument" onclick = "changeApps(this)" data-color="#D7AE35">
            <i class="fa-solid fa-folder-open"></i>
            <span>Document</span>
        </div>
        <div class="mainAppButton hs p" rel="myFinance" onclick = "changeApps(this)" data-color="#008F8E">
            <i class="fa-solid fa-coins"></i>
            <span>Finance</span>
        </div>
        <div class="mainAppButton hs p" rel="myAdmin" onclick = "changeApps(this)" data-color="#5C5C5C">
            <i class="fa-solid fa-user-tie"></i>
            <span>Admin</span>
        </div>
        '. $sysAdminHTML .'
    </div>

<div id="print-modal-overlay" style="background-color: #c1bdbdd6; display: none; position: fixed; top: 0;left: 0;width: 100%;height: 100%; align-items:center;justify-content:center;z-index: 9999;">

        <div id="print-chart-container" style="border-radius: 10px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); width: 700px; height: 55px; padding: 12px; background-color: #e1e2e1;">
            <div id="print-chart-filter" style="display: flex; gap: 4px; justify-content: end; align-items: center;">
                <button onClick="closeModal()"
                        style="border-radius: 100%; 
                        position: absolute; z-index: 10; 
                        border: none; background-color: red; height: 30px; width: 30px; margin-top: -70px; margin-right:-20px; color: white; font-size: 20px;">&times;</button>
                <div id="print-note">
                    <span style="margin-right: auto;"> Select Filter Range: </span> <br>
                    <small style="color: red; font-size: 10px;">* This filter applies only to horizontal bar charts to improve data readability</small>
                </div>

                <select 
                    id="from-date-js" 
                    name="from-date-js" 
                    style="height: 26px; margin: 0; border: 1px solid gray; padding: 2px 4px; border-radius: 5px;">
                </select>
                <p>-</p>
                <select 
                    id="to-date-js" 
                    name="to-date-js" 
                    style="height: 26px; margin: 0; border: 1px solid gray; padding: 2px 4px; border-radius: 5px;">
                </select>    
                <button 
                    id="apply-filter"
                    style="height: 26px; width:90px; padding: 0 8px; margin-left: 4px; border: 1px solid gray; border-radius: 5px;" 
                    onclick="applyDateRangeAndPrint()">Print
                    <i class="fa fa-print printClassHehe" style="margin-right: 6px;"></i>
                </button>
            </div>

            <p id="print-chart-error" style="margin: -10px 0 0 0; text-align: end; color: red; font-size: 10px;"></p>
            <div id="print-chart-content">
                <div id="land-chart-content" style="display: flex; flex-direction: column; gap: 10px; height: 95vh; width: 100%; box-sizing: border-box; padding: 10px; visibility: hidden; overflow: hidden;">
                    <div class="land-row" style="display: flex; flex: 1; gap: 10px; min-height: 0;">
                        <div id="offerIssuedChart" style="width: 70%; height: 100%;"></div>
                        <div id="land-summ-1" style="width: 30%; height: 100%; display: flex; flex-direction: column; justify-content: center; text-align: center;">
                            <div style=" font-weight: bold; color: gray; font-size: 16px;">Land</div>
                            <div id="offerLand" style="margin-bottom: 8px; color: gray;"></div>
                            <div class="structureHeader" style="font-weight: bold; color: gray; font-size: 16px;">Structure</div>
                            <div id="offerStructure" style="color: gray;"></div>
                        </div>
                    </div>
 
                    <div class="land-row" style="display: flex; flex: 1; gap: 10px; min-height: 0;">
                        <div id="paymentChart" style="width: 70%; height: 100%;"></div>
                        <div id="land-summ-2" style="width: 30%; height: 100%; display: flex; flex-direction: column; justify-content: center; text-align: center;">
                            <div style="font-weight: bold; color: gray; font-size: 16px;">Land</div>
                            <div id="paymentLand" style="margin-bottom: 8px; color: gray;"></div>
                            <div class="structureHeader" style="font-weight: bold; color: gray; font-size: 16px;">Structure</div>
                            <div id="paymentStructure" style="color: gray;"></div>
                        </div>
                    </div>
 
                    <div class="land-row" style="display: flex; flex: 1; gap: 10px; min-height: 0;">
                        <div id="demolisedChart" style="width: 70%; height: 100%;"></div>
                        <div id="land-summ-3" style="width: 30%; height: 100%; display: flex; flex-direction: column; justify-content: center; text-align: center;">
                            <div style="font-weight: bold; color: gray; font-size: 16px;">Structure</div>
                            <div id="demolishedStructure" style="color: gray;"></div>
                        </div>
                    </div>
 
                </div>

                <!-- HSET Dashboard -->
                <div id="hset-chart-content" style="display: none; grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(6, 1fr); gap: 4px; width: 100%; height: 90%;">
                    <div style="display: flex; flex-direction: column; grid-column: span 9 / span 9; grid-row: span 2 / span 2;">
                        <div style="height: 30px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase;">Total Man Hours Without LTI (HRS)</div>
                        <div id="p-hset-1" style="background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 4px; grid-column: span 3 / span 3; grid-row: span 2 / span 2; grid-column-start: 10;">
                        <div style="display: flex; flex-direction: column;">
                            <div style="min-height: 56px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-size: 12px; padding: 1px;">Cumulative Total Man Hours Without LTI (HRS)</div>
                            <div id="p-hset-2-1" style="display: flex; align-items: center; justify-content: center; background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <div style="min-height: 56px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-size: 12px; padding: 1px;">Cumulative Total Man Hours With LTI (HRS)</div>
                            <div id="p-hset-2-2" style="display: flex; align-items: center; justify-content: center; background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <div style="min-height: 56px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-size: 12px; padding: 1px;">Total Accidents/Incidents</div>
                            <div id="p-hset-2-3" style="display: flex; align-items: center; justify-content: center; background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <div style="min-height: 56px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-size: 12px; padding: 1px;">Fatality</div>
                            <div id="p-hset-2-4" style="display: flex; align-items: center; justify-content: center; background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; grid-column: span 9 / span 9; grid-row: span 2 / span 2; grid-row-start: 3;">
                        <div style="height: 30px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase;">HSET walkabout and induction</div>
                        <div id="p-hset-3" style="background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; grid-column: span 3 / span 3; grid-row: span 2 / span 2; grid-column-start: 10; grid-row-start: 3;">
                        <div style="height: 30px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase;">Overall Accidents/Incidents</div>
                        <div id="p-hset-4" style="background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; grid-column: span 2 / span 2; grid-row: span 2 / span 2; grid-row-start: 5;">
                        <div style="height: 30px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-size: 12px;">HSET COMMITTEE MEETING</div>
                        <div id="p-hset-5" style="background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; grid-column: span 2 / span 2; grid-row: span 2 / span 2; grid-column-start: 3; grid-row-start: 5;">
                        <div style="height: 30px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-size: 12px;">HSET TOOLBOX MEETING</div>
                        <div id="p-hset-6" style="background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; grid-column: span 2 / span 2; grid-row: span 2 / span 2; grid-column-start: 5; grid-row-start: 5;">
                        <div style="height: 30px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-size: 12px;">SAFETY STAND DOWN</div>
                        <div id="p-hset-7" style="background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; grid-column: span 2 / span 2; grid-row: span 2 / span 2; grid-column-start: 7; grid-row-start: 5;">
                        <div style="height: 30px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-size: 12px;">PRE-TOOLBOX MEETING</div>
                        <div id="p-hset-8" style="background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; grid-column: span 4 / span 4; grid-row: span 2 / span 2; grid-column-start: 9; grid-row-start: 5;">
                        <div style="height: 30px; color: white; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #2f3e5a; display: flex; justify-content: center; align-items: center; text-transform: uppercase;">HSET PROGRAM AND RESPONSE</div>
                        <div id="p-hset-9" style="background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; height: 100%;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>    

    <div class="mainContainer '.$subMenuOpened.'" id="mainContainer">
        <div class="enlargeContainer myInsights myDashboard myDocument myFinanace myAdmin myTask mySysAdmin" id="enlargeContainer">
            <button class="printButton myDashboard" onclick="printContent(this)" data-general-print="true" id="genPrint" style="display: none"><img src="../Images/icons/form/printer.png"></button>
            <button class="enlargeButton" onclick="enlargeMainContainer(this)">
                <img src="../Images/icons/form/maximizeLightv3.png">
            </button>
            <button class="fullScreenButton" onclick="fullMainContainer(this)">
                <img src="../Images/icons/form/fullscreenWhite.png">
            </button>
        </div>

        <div id="detactedWidget" class="draggable detach">
            <div id="resizableDetach" class="ui-widget-content detach">
                <div class="headerContainer detach">
                    <div class="title">ConOp List</div>
                    <div class="detachButtonContainer" onclick="detachWidgetClose(this)"><i style="transform: rotate(180deg); " class="fa-solid fa-square-arrow-up-right"></i></div>
                </div>
                <div class="headerContainer detach" id="detachWidgetConopList">
                </div>
                <div class="headerContainer detach" id="detachWidgetMaintenanceList">
                    <div class="buttonTab parentTab maintenanceList" id = "">
                    </div>
                    <div class="buttonTab childrenTab conditionBrowser" id = "" style="display:none">
                    </div>
                    <div class="buttonTab childrenTab assessmentBrowser" id = "" style="display:none">
                    </div>
                    <div class="buttonTab childrenTab routineBrowser" id = "" style="display:none">
                    </div>
                    <div class="buttonTab childrenTab periodicBrowser" id = "" style="display:none">
                    </div>
                    <div class="buttonTab childrenTab emergencyBrowser" id = "" style="display:none">
                    </div>
                </div>
                <div class="headerContainer detach" id="detachWidgetInventoryList">
                    <div class="buttonTab parentTab inventoryList">
                    <div class="tab inventory changeName parent" rel = "network" style = "font-size;9px" title = "NW" onclick="navBoxTabParentClick(this)">Network</div>
                    <div class="tab inventory changeName parent" rel = "bridge" style = "font-size;9px" title = "BR" onclick="navBoxTabParentClick(this)">Bridge</div>
                    <div class="tab inventory changeName parent" rel = "culvert" style = "font-size;9px" title = "CL" onclick="navBoxTabParentClick(this)">Culvert</div>
                    <div class="tab inventory changeName parent" rel = "drainage" style = "font-size;9px" title = "DR" onclick="navBoxTabParentClick(this)">Drainage</div>
                    <div class="tab inventory changeName parent" rel = "pavement" style = "font-size;9px" title = "PV" onclick="navBoxTabParentClick(this)">Pavement</div>
                    <div class="tab inventory changeName parent" rel = "roadFur" style = "font-size;9px" title = "RF" onclick="navBoxTabParentClick(this)">Road Furniture</div>
                    <div class="tab inventory changeName parent" rel = "slope" style = "font-size;9px" title = "SL" onclick="navBoxTabParentClick(this)">Slope</div>
                    <div class="tab inventory changeName parent" rel = "electrical" style = "font-size;9px" title = "EL" onclick="navBoxTabParentClick(this)">Electrical</div>
                </div>
                <div class="buttonTab childrenTab networkBrowser" style="display:none">
                    <div class="tab changeName children inventoryJoget" rel="network_div" id="inventoryJoget" style="max-width: 100px;" title="" onclick="navBoxTabClick(this)"></div>
                    <div class="tab changeName children inventoryJoget" rel="network_route" id="inventoryJoget" style="max-width: 100px;" title="RT" onclick="navBoxTabClick(this)">Route</div>
                </div>
                </div>
                <div class="bodyContainer">
                    <iframe id="detachWidgetIframe" class="" src = ""></iframe>
                </div>
            </div>
        </div>

        <div id="widgetConop" class="draggable">
            <div id="resizable" class="ui-widget-content">
                <div class="headerContainer">
                    <div class="title"></div>
                    <div class="closeButtonContainer" onclick="widgetConopClose()"><i class="fa-solid fa-xmark"></i></div>
                </div>
                <div class="bodyContainer">
                    <iframe id="widgetIframe" src = ""></iframe>
                </div>
            </div>
        </div>

        <div class="mainPage myReporting '.$classDashboardActive.'" style="'.$displayBlockDashboard.'">
            <div class="contentContainer">
                <div class="head">
                    <h2>'.$titleDigitalReporting.'</h2>
                </div>
                <div class="contentContainer" id="myReporting" >
                    <div class = "dashboardHeaderExec">
                        <div class="filterContainer">
                            <div class="btn-container">
                                <button class="sort-btn asc" data-sort="name:desc"><i class="fa-solid fa-sort-up"></i> <span>Package Name</span></button>
                                <button class="sort-btn desc" data-sort="name:asc" style="display: none"><i class="fa-solid fa-sort-down"></i> <span>Package Name</span></button>
                                <button class="sort-btn asc" data-sort="start-date:desc"><i class="fa-solid fa-sort-up"></i> <span>Start Date</span></button>
                                <button class="sort-btn desc" data-sort="start-date:asc" style="display: none"><i class="fa-solid fa-sort-down"></i> <span>Start Date</span></button>
                                <button class="sort-btn asc" data-sort="contract-amount:desc"><i class="fa-solid fa-sort-up"></i> <span>Contract Amount</span></button>
                                <button class="sort-btn desc" data-sort="contract-amount:asc" style="display: none"><i class="fa-solid fa-sort-down"></i> <span>Contract Amount</span></button>
                            </div>
                            <button class="btn filter-expand max"><i class="fa-solid fa-arrows-up-to-line"></i></button>
                            <input onkeyup ="homeSearchExecutive(this)" placeholder="Search...">
                            <button class="filter-sort-btn" onclick="closeFilterList()"><i class="fa-solid fa-filter"></i></button>
                        </div>
                    </div>
                        '.$divisionHTML.'
                </div>
            </div>
        </div>
        <div class="mainPage myProject swiper swiper-h '.$classActive.'" style="'.$displayBlock.'; opacity: 0">
            <div class="title">
                <h3 id="">Hi, ' . $firstName . ' ' . $lastName . '</h3>
                <!--Toggle For View Pref-->
                <label class="switch view" id="toggleView" title="Toggle View">
                    <input type="checkbox" checked>
                    <span class="slider view"></span>
                </label>
            </div>
            <div class="contentContainer multiColumn header swiper-wrapper">
                <div class="columnOne swiper-slide">
                    <div class="head">
                        <h2>My Project</h2>
                    </div>
                    <div class="tableContainer">
                        <div class="searchContainer">
                            <!--Toggle For myProject Card Pref-->
                            <label class="switch" id="toggleContainer">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <input onkeyup ="homeSearchProject(this)" placeholder="Search Project"/>
                        </div>
                        <div class="filterContainer">
                            <div class="button active" rel="" onClick="filterProjectList(this)">All</div>
                            <div class="button" rel="fav" onClick="filterProjectList(this)">Favorites</div>
                        </div>
                        <div class="projectContainer " id=""  style="display:none">
                            <div class="mainProject">
                                <h3>Projects</h3>
                                <div class="tileContainer">
                                    '.$projectTileHTML.'
                                </div>
                            </div>
                            <div class="packageProject">
                                <h3>Packages</h3>
                                <div class="tileContainer">
                                    '.$packageTileHTML.'
                                </div>
                            </div>
                        </div>
                        <div class="projectContainerList active"  id="" style="height: 100%">
                            <div class="tableHeader project">
                                <span class="columnIndex"></span>
                                <span class="columnFirst">Project Name</span>
                                <span class="columnSecond">Last Access</span>
                            </div>
                            <div class="tableBody projectList">
                                '.$projpackListHTML.'
                            </div>
                        </div>
                    </div>
                </div>
                <div class="columnTwo swiper-slide">
                    <div class="head">
                        <h2>My Task</h2>
                    </div>
                    <div class="tableContainer myTask">
                        <div class="searchContainer myTask">
                            <input onkeyup="homeSearchTask(this)" placeholder="Search Task"/>
                        </div>';
                        if($SYSTEM == 'KKR'){
                            echo '<div class="dateFilterContainer searchContainer bottom">
                                <input class="small" type="text" name="dfrom"  placeholder="Start Date"/> to 
                                <input class="small" type="text" name="dto"  placeholder="End Date"/>
                                <button class="reset" id="resetDateSearch" title="Clear Dates">
                                    <i class="fa-solid fa-eraser"></i>
                                </button>
                                <br><em><small>Please note that the lists is filtered according to the date range above.</small></em>
                            </div>';
                        }
                        echo '<div class="tableHeader sortHandler">
                            <span class="columnIndex"></span>
                            <span class="columnFirst">Reference No.
                                <button type="button" class="control unset" data-sort="mytask-refno:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="mytask-refno:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="mytask-refno:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnFirst">Project
                                <button type="button" class="control unset" data-sort="mytask-project:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="mytask-project:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="mytask-project:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Modified
                                <button id="myTaskModifiedAsc" type="button" class="control unset" data-sort="mytask-modifieddate:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="mytask-modifieddate:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="mytask-modifieddate:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Pending Task
                                <button type="button" class="control unset" data-sort="mytask-pending:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="mytask-pending:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="mytask-pending:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                            <span class="columnSecond columnHidden">Section
                                <button type="button" class="control unset" data-sort="mytask-section:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="mytask-section:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="mytask-section:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                            <span class="columnFirst columnHidden">Work Discipline
                                <button type="button" class="control unset" data-sort="mytask-workdiscipline:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="mytask-workdiscipline:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="mytask-workdiscipline:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                            <span class="columnFirst columnHidden">Created By
                                <button type="button" class="control unset" data-sort="mytask-createdbyname:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="mytask-createdbyname:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="mytask-createdbyname:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                        </div>
                        <div class="tableBody myTask '.$myTaskClassHeight.'" id="sortTask">
                            <div class="loadingRowContainer" style="display:block;">
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tableFooter '.$myTaskClassHeight.'">
                            <a id="myTaskPendingCount" rel="myTaskList" data-title="My Task List" onclick="wizardOpenPage(this)" data-width="55"></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <div class="mainPage myInsights">
            <div class="contentContainer">
                <div class="head hideHeader">
                    <h2 class="hideHeader">Insights</h2>
                </div>
                <div class="toolContainer">
                    <div class="leftToggleContainer">
                        <div class="tool asset">
                            <div class="flexContainer">
                                <div class="buttonContainer eight">
                                    <button class="toolButton mid" rel="insight" title="New Asset Process" data-width="55" data-page="asset"><i class="fa-solid fa-file-circle-plus"></i><div class="label">New<br>Asset Process</div></button>
                                    <button class="toolButton mid inventory" rel="list" title="Inventory List" data-process="allListInventory" style="display: none;">
                                    <i class="fa-solid fa-boxes-stacked"></i><div class="label">Asset<br>Table</div>
                                    </button>
                                    <button class="toolButton mid manageAsset" rel="insight" title="Manage Asset Process" data-width="70" data-page="manageAsset"><i class="fa-solid fa-hexagon-nodes"></i><div class="label">Manage</div></button>
                                    <button class="toolButton mid pavement" rel="insight" title="Pavement Analysis" data-width="70" data-page="pavementAnalysis"><i class="fa-solid fa-chart-area"></i><div class="label">Pavement<br>Analysis</div></button>
                                    <button class="toolButton mid bulk" rel="insight" title="Bulk Export Process" data-width="55" data-page="bulkAsset"><i class="fa-solid fa-paste"></i><div class="label">Bulk<br>Export</div></button>
                                    <button class="toolButton mid" rel="list" title="Maintenance Browser" data-process="maintenanceBrowser"><i class="fa-solid fa-wrench"></i><div class="label">Maintenance<br>Browser</div></button>
                                    <button class="toolButton mid" rel="insight" title="Setup" data-width="70" data-page="setupList"><i class="fa-solid fa-gear"></i><div class="label">Setup</div></button>
                                </div>
                            </div>
                            <div class="text">Asset</div>
                        </div>
                        <div class="tool construct">
                            <div class="flexContainer">
                                <div class="buttonContainer eight">
                                    <button class="toolButton mid" rel="insight" title="New Construction Process" data-width="70" data-page="process"><i class="fa-solid fa-file-circle-plus"></i><div class="label">New<br>Process</div></button>
                                    <button class="toolButton mid setup" rel="insight" title="Setup" data-width="55" data-page="setupPage"><i class="fa-solid fa-gear"></i><div class="label">Setup</div></button>
                                    <button class="toolButton mid conop" rel="list" title="ConOp List" data-process="allListConstruct"><i class="fa-solid fa-list"></i><div class="label">ConOp<br>List</div></button>
                                    <button class="toolButton mid manage" rel="insight" title="Manage Construction Process" data-width="55" data-page="manage"><i class="fa-solid fa-hexagon-nodes"></i><div class="label">Manage<br>Process</div></button>
                                    <button class="toolButton mid bulk" rel="insight" title="Bulk Register Process" data-width="55" data-page="bulk"><i class="fa-solid fa-paste"></i><div class="label">Bulk<br>Register</div></button>
                                    <button class="toolButton mid bumi" rel="list" title="Bumi List" data-process="bumiList"><i class="fa-solid fa-globe"></i><div class="label">Bumi<br>List</div></button>
                                    <button class="toolButton mid" rel="insight" title="Link Lot Parcel" data-width="70" data-page="linkLotParcel"><i class="fa-solid fa-link"></i><div class="label">Link Lot<br>Parcel</div></button>
                                    <button class="toolButton mid bulkapproval" rel="list" title="Bulk Assignment Approvals" data-width="70" data-process="bulkApprovals" style="display:none;"><i class="fa fa-list-alt"></i><div class="label">Bulk <br>Approvals</div></button>';

                                    if($SYSTEM == 'OBYU'){
                                        if(isset($_SESSION['user_org']) && $_SESSION['user_org'] == 'KACC'){
                                            echo'
                                            <button class="toolButton mid statistic" rel="insight" title="Statistic" data-width="55" data-page="statisticPage"><i class="fa-solid fa-line-chart"></i><div class="label">Statistic</div></button>';
                                        }
                                        
                                    }

                                    $aic_show_btn = ($SYSTEM == 'OBYU') ? 'style = "display: none;"' : "" ;

                                    echo '
                                    
                                </div>
                            </div>
                            <div class="text">Construct</div>
                        </div>
                        <div class="tool fm">
                            <div class="flexContainer">
                                <div class="buttonContainer eight">
                                    <button class="toolButton mid" rel="insight" title="New Asset Process" data-width="55" data-page="asset"><i class="fa-solid fa-file-circle-plus"></i><div class="label">New<br>Asset Process</div></button>
                                    <button class="toolButton mid assetlist" rel="list" title="Asset Data List" data-process="assetListInventory">
                                    <i class="fa-solid fa-boxes-stacked"></i><div class="label">Asset<br>Table</div>
                                    </button>
                                    <button class="toolButton mid manageAsset" rel="insight" title="Manage Asset Process" data-width="70" data-page="manageAsset"><i class="fa-solid fa-hexagon-nodes"></i><div class="label">Manage</div></button>
                                    <button class="toolButton mid bulk" rel="insight" title="Bulk Export Process" data-width="55" data-page="bulkAsset"><i class="fa-solid fa-paste"></i><div class="label">Bulk<br>Export</div></button>
                                    <button class="toolButton mid" rel="list" title="Maintenance Browser" data-process="maintenanceBrowser"><i class="fa-solid fa-wrench"></i><div class="label">Maintenance<br>Browser</div></button>
                                    <button class="toolButton mid" rel="insight" title="Setup" data-width="70" data-page="fmSetupList"><i class="fa-solid fa-gear"></i><div class="label">Setup</div></button>
                                    </div>
                            </div>
                            <div class="text">Facilites</div>
                        </div>
                        <div class="tool main">
                            <div class="buttonContainer">
                                <button class="toolButton mid" rel="layer" title="layer"><i class="fa-solid fa-layer-group"></i><div class="label">Layer</div></button>
                                <button class="toolButton mid" id="refreshList" rel="reviewTool" title="Review Tool" onclick="getReviewv3()"><i class="fa-solid fa-magnifying-glass-location"></i><div class="label">Review<br>Tool</div></button>
                                <button class="toolButton mid" '.$aic_show_btn.' rel="aic" data-measure="aic" title="Aerial Image Compare" onClick="initializeECW(this)"><i class="fa-solid fa-plane"></i><div class="label">Aerial<br>Image</div></button>
                                <button class="toolButton mid" rel="markupTool" id="markupTool" title="Markup"><i class="fa-solid fa-marker"></i><div class="label">Markup</div></button>
                            </div>
                            <div class="text">Main</div>
                        </div>
                        <div class="tool iot" style="display: none;">
                            <div class="flexContainer">
                                <div class="buttonContainer">
                                    <button class="toolButton mid" rel="controlPanel" title="IoT Control Panel" data-width="70" onclick= ""><i class="fa-solid fa-sensor-cloud"></i><div class="label">IoT<br>Control Panel</div></button>
                                    <button class="toolButton mid register" rel="addIoT" title="Register Iot Sensor" data-page="iotItem" ><i class="fa-solid fa-sensor"></i><div class="label">Register<br>IoT</div></button>
                                    <button class="toolButton mid manage" rel="manageIoT" title="Manage IoT" onclick = "OnClickManageIoT()"><i class="fa-solid fa-sensor-on"></i><div class="label">Manage<br>IoT</div></button>
                                </div>
                            </div>
                            <div class="text">IoT</div>
                        </div>
                        <div class="tool measure">
                            <div class="buttonContainer">
                                <button class="toolButton mid" rel="measureTool" data-measure="point" title="Point" onClick="openMeasureTool(this)"><i class="fa-solid fa-map-pin"></i><div class="label">Point</div></button>
                                <button class="toolButton mid" rel="measureTool" data-measure="distance" title="Distance" onClick="openMeasureTool(this)"><i class="fa-solid fa-ruler"></i><div class="label">Distance</div></button>
                                <button class="toolButton mid" rel="measureTool" data-measure="area" title="Area" onClick="openMeasureTool(this)"><i class="fa-solid fa-draw-polygon"></i><div class="label">Area</div></button>
                            </div>
                            <div class="text">Measure</div>
                        </div>
                        <div class="tool admin">
                            <div class="buttonContainer ten">
                                <button class="toolButton mid" rel="manageLayer" title="Manage Layer" onclick="manageLayer(this)"><i class="fa-solid fa-copy"></i><div class="label">Manage<br>Layer</div></button>
                                <button class="toolButton mid" rel="drawTool" title="Add Video" id="addvideocam" data-page="cameraItem" onclick="OnClickAddCamera()"><i class="fa-solid fa-video"></i><div class="label">Add<br>Video</div></button>
                                <button class="toolButton mid" rel="drawTool" title="Mark Asset" data-page="pinPoint" data-width="55"><i class="fa-solid fa-paintbrush"></i><div class="label">Mark<br>Asset</div></button>
                                <button class="toolButton mid" rel="locationDirectory" title="Mark Location" data-page="markEntity" onclick="openDrawTool(this)"><i class="fa-solid fa-location-pin"></i><div class="label">Mark<br>Location</div></button>
                                <button class="toolButton mid" rel="uploadTool" title="Upload Layer"><i class="fa-solid fa-upload"></i><div class="label">Upload<br>Layer</div></button>
                                <button class="toolButton mid" rel="adjustElevation" title="Adjust Layers Elevation" onclick="adjustLayer(this)"><i class="fa-sharp fa-solid fa-sliders"></i><div class="label">Adjust<br>Elevation</div></button>
                                <button class="toolButton mid" rel="drawTool" title="Add 360 Image" data-page="earthViewItem"><i class="fa-solid fa-image"></i><div class="label">Add<br>360 Image</div></button>
                                <button class="toolButton mid" rel="insight" title="Edit Marked Asset/Location" data-page="editentityForm" data-width="30" onclick="OnClickEdit(this)"><i class="fa-solid fa-pencil"></i><div class="label">Edit<br>Asset / Location</div></button>
                                <button class="toolButton mid" rel="delete" title="Remove Marked Asset/Location" onclick="OnClickDelete(this)"><i class="fa-solid fa-trash-can"></i><div class="label">Remove<br>Asset / Location</div></button>
                            </div>
                            <div class="text">Admin</div>
                        </div>
                        <div class="tool nav">
                            <div class="buttonContainer eight">
                                <button class="toolButton mid" rel="cameraFeed" title="360 Image Feed" data-page="earthViewItem" onclick="OnClickEarthView()"><i class="fa-solid fa-street-view"></i><div class="label">360 Image<br>Feed</div></button>
                                <button class="toolButton mid" rel="thematic" title="Thematic"><i class="fa-solid fa-brush"></i><div class="label">Thematic</div></button>
                                <button class="toolButton mid" rel="folderDirectory" title="Folder Directory" onclick=""><i class="fa-solid fa-folder-tree"></i><div class="label">Folder<br>Directory</div></button>
                                <button class="toolButton mid" rel="cameraFeed" title="Camera Feed" data-page="cameraItem" onclick = "OnClickCameraFeedv3()"><i class="fa-solid fa-video"></i><div class="label">Camera<br>Feed</div></button>
                                <button class="toolButton mid" rel="trackAnimation" title="Fly Through Animation"><i class="fa-solid fa-magnifying-glass-location"></i><div class="label">Fly<br>Through</div></button>
                                <button class="toolButton mid" rel="insight" title="Gantt Chart" data-width="70" onclick="wizardOpenPageGantt(\'insights\')"><i class="fa-solid fa-chart-gantt"></i><div class="label">Gantt<br>Chart</div></button>
                                <button class="toolButton mid" rel="markAsset" title="Asset List"><i class="fa-solid fa-table"></i><div class="label">Asset<br>List</div></button>';
                                if ($projectManager) {
                                    echo'
                                    <button class="toolButton mid" rel="insight" title="Power BI" data-process="powerBi" data-page="powerBi" data-width="70" onclick="OnClickPowerBi()"><i class="fa-solid fa-chart-simple"></i><div class="label">Power BI</div></button>';
                                }
                                echo'
                            </div>
                            <div class="text">Navigation</div>
                        </div>
                    </div>
                    
                    <div class="rightToggleContainer">
                        <div class="toggleButton active" data-value="on"><i class="fa-solid fa-angle-up"></i></div>
                        <div class="toggleText active">
                            <i class="fa-stack fa-1x">
                                <i class="fa-solid fa-font fa-stack-1x"></i>
                                <i class="fa-solid fa-slash fa-stack-1x"></i>
                            </i>
                        </div>
                    </div>
                </div>
                <div class="flexBox">
                    <div class="innerFlexBox">
                        <div id="RIContainer">
                            <div class="blinkDiv"></div>
                            <div class="buttonContainer" id="insightsToolContainer">
                                <button class="icon" rel="" id="switchTerrainMod" title="Switch Terrain Mode"><i class="onPrimary fa-solid fa-image-landscape fa-lg"></i><span>TERRAIN OFF</span></button>
                                <button class="icon" rel="" id="SwitchSceneMod" title="Switch Scene Mode"><i class="onPrimary fa-solid fa-toggle-on fa-lg"></i></button>
                                <button class="icon" rel="lastminutetool" title="Move" onclick="openRIContainerTool(this)"><i class="onPrimary fa-solid fa-up-down-left-right fa-lg"></i></button>
                                <button class="icon" rel="" id="changeToGlobe" title="Globe"><i class="onPrimary fa-solid fa-earth-asia fa-lg"></i></button>
                                <button class="icon" rel="" id="flyToHome" title="Home"><i class="onPrimary fa-solid fa-house fa-lg"></i></button>
                                <button class="icon" rel="" id="changeBaseMap" title="Base Map Toggle"><i class="onPrimary fa-solid fa-map fa-lg"></i>
                                </button>
                            </div>
                            <div id="toolbarTransparency">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>Translucency enabled</td>
                                        <td>
                                            <input type="checkbox" data-bind="checked: translucencyEnabled">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Fade by distance</td>
                                        <td>
                                            <input type="checkbox" data-bind="checked: fadeByDistance">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Alpha</td>
                                        <td class="alpha">
                                            <input type="range" min="0.0" max="1.0" step="0.1" data-bind="value: alpha, valueUpdate: \'input\'">
                                            <input type="text" size="5" data-bind="value: alpha">
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="ScreenSpaceTool" class="lastminutetool">
                                <div class="flexColumn">
                                    <label style="color:white">Brightness</label>
                                </div>
                                <div class="flexColumn">
                                    <input class="slider" type="range" min="-1.0" max="1.0" step="0.02" data-bind="value: brightness, valueUpdate: \'input\'">
                                </div>
                                <div class="flexColumn alpha">
                                    <input type="text" size="5" data-bind="value: brightness">
                                </div>
                            </div>
                            <div id="ControlDiv" class="lastminutetool">
                                <div class="leftbuttoncontainer">
                                    <button id ="moveForward" onmousedown="ControlMouseDownv3(this.id)" onmouseup="ControlMouseLeavev3(this.id)" onmouseleave="ControlMouseLeavev3(this.id)" ><img id="forward" src="../Images/icons/navi_control/forward.png"></button>
                                    <button id ="moveBackward" onmousedown="ControlMouseDownv3(this.id)" onmouseup="ControlMouseLeavev3(this.id)" onmouseleave="ControlMouseLeavev3(this.id)"><img id="backward" src="../Images/icons/navi_control/backward.png"></button>
                                    <button id ="moveRight" onmousedown="ControlMouseDownv3(this.id)" onmouseup="ControlMouseLeavev3(this.id)" onmouseleave="ControlMouseLeavev3(this.id)"><img id="right" src="../Images/icons/navi_control/right.png"></button>
                                    <button id ="moveLeft" onmousedown="ControlMouseDownv3(this.id)" onmouseup="ControlMouseLeavev3(this.id)" onmouseleave="ControlMouseLeavev3(this.id)"><img id="left" src="../Images/icons/navi_control/left.png"></button>
                                </div>
                                <div class="rightbuttoncontainer">
                                    <button id ="moveUp" onmousedown="ControlMouseDownv3(this.id)" onmouseup="ControlMouseLeavev3(this.id)" onmouseleave="ControlMouseLeavev3(this.id)"><img src="../Images/icons/navi_control/up.png"></button>
                                    <button id ="moveDown" onmousedown="ControlMouseDownv3(this.id)" onmouseup="ControlMouseLeavev3(this.id)" onmouseleave="ControlMouseLeavev3(this.id)"><img src="../Images/icons/navi_control/down.png"></button>
                                </div>
                            </div>
                            <div class="floatBox" id = "floatBoxId">
                                <div class="floatBoxHeader">
                                    <div class="header"></div>
                                    <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                                </div>
                                <div class="floatBoxBody">

                                </div>
                                <div class="floatBoxFooter">
                                    <a class="folderMoreInfo" rel="folderMoreInfo" style="display: none">Show more info --></a>
                                </div>
                                 <div class="floatBoxFooter">
                                    <a class="floatBoxActionLink" rel="floatBoxActionLink" style="display: none">Component</a>
                                </div>
                            </div>
                        </div>
                        <div class="navBox measureTool">
                            <div class="infoHeader">
                                <div class="header">Measure Tool</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="instructionContainer measureTool">
                                    <div class="instruction leftClick">
                                        <i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark</label>
                                    </div>
                                    <div class="instruction rightClick">
                                        <i class="fa-solid fa-computer-mouse"></i><label>  Right click to finish</label>
                                    </div>
                                    <div class="instruction clickSave">
                                        <label>Click <kbd>Save</kbd> button to save<label></label>
                                    </div>
                                    <div class="instruction clickCancel">
                                        <label>Click <kbd>Cancel</kbd> to cancel</label>
                                    </div>
                                    <div class="instruction escape">
                                        <label>Press <kbd>Esc</kbd> to exit tool</label>
                                    </div>
                                </div>
                                <div class="buttonTab right">
                                    <button class="icon" title = "Clear" onclick = "removeHistoryMeasure()"><i class="onPrimary fa-solid fa-trash"></i></button>
                                </div>
                                <div class="groupitem ungroup" id = "historyMeasure">
                                </div>                       
                            </div>
                        </div>
                        <div class="navBox drawTool">
                            <div class="infoHeader">
                                <div class="header"></div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="pageContainer pinPoint">
                                    <div class="instructionContainer drawTool">
                                        <div class="instruction leftClick">
                                            <i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark</label>
                                        </div>
                                        <div class="instruction rightClick">
                                            <i class="fa-solid fa-computer-mouse"></i><label>  Right click to finish</label>
                                        </div>
                                        <div class="instruction clickSave">
                                            <label>Click <kbd>Save</kbd> button to save<label></label>
                                        </div>
                                        <div class="instruction clickCancel">
                                            <label>Click <kbd>Cancel</kbd> to cancel</label>
                                        </div>
                                        <div class="instruction escape">
                                            <label>Press <kbd>Esc</kbd> to exit tool</label>
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Coordinate</div>
                                        <div class="tool justifyBetween">
                                            <label>x</label>
                                            <input type="text" disabled="disabled" id="inputx">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>y</label>
                                            <input type="text" disabled="disabled" id="inputy">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>z</label>
                                            <input type="text" disabled="disabled" id="inputz">
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Shape</div>
                                        <div class="tool start">
                                            <input type="radio" name="shape" id="radiobox" checked>
                                            <label>Box</label>
                                        </div>
                                        <div class="tool start">
                                            <input type="radio" name="shape" id="radioelipsoid">
                                            <label>Elipsoid</label>
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Size</div>
                                        <div class="tool justifyBetween">
                                            <label>Width</label>
                                            <input type="number" id="sizewidth" onchange = "OnChangeInputPinpointValues()">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Length</label>
                                            <input type="number" id="sizelength" onchange = "OnChangeInputPinpointValues()">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Height</label>
                                            <input type="number" id="sizeheight" onchange = "OnChangeInputPinpointValues()">
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Orientation</div>
                                        <div class="tool justifyBetween">
                                            <label>Head</label>
                                            <input type="number" id="orientationhead" onchange = "OnChangeInputPinpointValues()">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Pitch</label>
                                            <input type="number" id="orientationpitch" onchange = "OnChangeInputPinpointValues()">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Roll</label>
                                            <input type="number" id="orientationroll" onchange = "OnChangeInputPinpointValues()">
                                        </div>
                                    </div>
                                    <div class="flexContainer bottom">
                                        <button class="pinPointSave" rel="insight" title="New Asset" data-page="pinPointForm" data-width="30" onclick="OnClickPinpointToolSave(this)">Apply</button>
                                        <button onclick="OnClickPinpointToolReset()">Reset</button>
                                    </div>
                                </div>
                                <div class="pageContainer cameraItem">
                                    <div class="instructionContainer drawTool">
                                        <div class="instruction">
                                        </div>
                                        <!--<div class="instruction leftClick">
                                            <i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark</label>
                                        </div>
                                        <div class="instruction rightClick">
                                            <i class="fa-solid fa-computer-mouse"></i><label>  Right click to finish</label>
                                        </div>
                                        <div class="instruction clickSave">
                                            <label>Click <kbd>Save</kbd> button to save<label></label>
                                        </div>
                                        <div class="instruction clickCancel">
                                            <label>Click <kbd>Cancel</kbd> to cancel</label>
                                        </div>
                                        <div class="instruction escape">
                                            <label>Press <kbd>Esc</kbd> to exit tool</label>
                                        </div>-->
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Camera Information</div>
                                        <div class="tool">
                                            <label>Camera Name</label>
                                            <input type="text" id="camName" placeholder="e.g. Camera 001">
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Camera Pin</div>
                                        <div class="tool justifyBetween">
                                            <label>Longitude</label>
                                            <input type="text" id ="camLong" onfocus="this.blur" disabled="disabled">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Latitude</label>
                                            <input type="text"id ="camLat" onfocus="this.blur"  disabled="disabled">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Height</label>
                                            <input type="number" id="camHeight" placeholder="">
                                        </div>
                                    </div>
                                    <div class="drawContainer" id="videoSourceRadio" style="display: block;">
                                        <div class="header">Upload Type</div>
                                        <div class="tool start">
                                            <input type="radio" id="localVideo" name="video" value="localVideo">
                                            <label>Upload Video</label>
                                        </div>
                                        <div class="tool start">
                                            <input type="radio" id="EmbedLink" name="video" value="embedVideo">
                                            <label>Embedded Link</label>
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Upload File</div>
                                        <div class="tool justifyBetween localVideo">
                                            <button id="browseCamFile">Browse Video</button><p id="videoFileName"></p>
                                            <div class="video-statuscontainer">
                                                <div class="progress-bar stripes animated">
                                                    <span id="video-progress-inner"></span>
                                                </div>
                                                <a id="videoStatus"></a>
                                            </div>
                                        </div>
                                        <div class="tool justifyBetween embedVideo" style="display: none;">
                                            <label>Embedded Link</label>
                                            <input type="text" id="embedLinkInput" placeholder="E.g https://www.youtube.com/embed/gVM1lyukQkk">
                                        </div>
                                        <div class="indicatorContainer">
                                            <div class="progress-bar-container">
                                                <div class="progress-bar"></div>
                                            </div>
                                            <a id="videoStatus"></a>
                                        </div>
                                    </div>
                                    <div class="flexContainer bottom">
                                        <button id="startCamFile">Save</button>
                                        <button onclick = "OnClickAddCameraCancel()">Reset</button>
                                    </div>
                                </div>
                                <div class="pageContainer earthViewItem">
                                    <div class="instructionContainer drawTool">
                                        <div class="instruction leftClick">
                                            <i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark</label>
                                        </div>
                                        <div class="instruction rightClick">
                                            <i class="fa-solid fa-computer-mouse"></i><label>  Right click to finish</label>
                                        </div>
                                        <div class="instruction clickSave">
                                            <label>Click <kbd>Save</kbd> button to save<label></label>
                                        </div>
                                        <div class="instruction clickCancel">
                                            <label>Click <kbd>Cancel</kbd> to cancel</label>
                                        </div>
                                        <div class="instruction escape">
                                            <label>Press <kbd>Esc</kbd> to exit tool</label>
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">360 Image Information</div>
                                        <div class="tool justifyBetween">
                                            <label>Image Name</label>
                                            <input type="text" id="imgName">
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Image Pin</div>
                                        <input type="hidden" id="imagePinID">
                                        <div class="tool justifyBetween">
                                            <label>Longitude</label>
                                            <input type="text" disabled="disabled" id="imgLong">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Latitude</label>
                                            <input type="text" disabled="disabled" id="imgLat">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Height</label>
                                            <input type="number" id="imgHeight">
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;" id="imgSourceRadio">
                                        <div class="header">Set Initial Heading</div>
                                        <div class="tool start">
                                            <input type="radio" id="fromPinDetails" name="setImage" value="choosePinDetails" checked="">
                                            <label>Used Pin Details</label>
                                        </div>
                                        <div class="tool start">
                                            <input type="radio" id="fromImage" name="setImage" value="chooseImage">
                                            <label>Choose From Image</label>
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Upload File</div>
                                        <div class="tool justifyBetween alignItem">
                                            <label class="button" for="upload-video">Browse</label>
                                            <input type="file" class="uploadFile" name="imageFileName" id="imageFileName">
                                        </div>
                                        <div class="tool flexColumn alignItem initImageDiv" style="display: none;">
                                            <label>Select Center Point (North) of Image</label>
                                            <button id="northReset">Reset</button>
                                            <div class="imageContainer" id="initImageContainer">
                                                <img id="initImage" src=""/>
                                                <div class="verticalLine"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flexContainer bottom earthViewItem">
                                        <button id="startImageFile" onclick="OnClickAddImageSave()">Save</button>
                                        <button onclick="OnClickAddImageCancel()">Reset</button>
                                    </div>
                                </div>
                                <div class="pageContainer layerItem">
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Layer Information</div>
                                        <div class="tool justifyBetween alignItem">
                                            <label>Layer ID</label>
                                            <input type="text" id="layerId" readonly disabled>
                                        </div>
                                        <div class="tool justifyBetween alignItem" id="folderNameDiv" style="display: none;">
                                            <label>Folder Name</label>
                                            <input type="text" id="folderName" readonly disabled>
                                        </div>
                                        <div class="tool justifyBetween alignItem">
                                            <label>Layer Name</label>
                                            <input type="text" id="layerName" readonly disabled >
                                        </div>
                                        <div class="tool justifyBetween alignItem">
                                            <label>Data Type</label>
                                            <input type="text" id="layerType" readonly disabled>
                                        </div>  

                                        <div class="tool justifyStart alignItem">
                                            <label for="showMetadata">Show Metadata</label>
                                            <input class="checkbox" type="checkbox" id="showMetadata" onchange="onChangeShowMetadata(this)">
                                            <div class="flex">
                                                
                                            </div>
                                        </div>

                                        <input type="text" id="projectLayerId" hidden > 
 
                                        <div class="metaDataEdit" style="display: none;">    
                                            <div class="buttonContainer justifyEnd">
                                                <button class="metadataEdit" data-width="70" data-page="metadataEdit" rel="insight" title="Metadata List"  onclick="onClickOpenMetadataList(this)"><i class="fa-sharp fa-regular fa-window"></i> Metadata List </button>
                                            </div>
                                            
                                            <div class="tool justifyBetween alignItem">
                                                <label>Meta ID</label>
                                                <input type="text" id="metaId" readonly disabled>
                                            </div> 
                                            <div class="tool justifyBetween alignItem">
                                                <label>Mission/Cycle ID</label>
                                                <input type="text" id="missionCycleId" >
                                            </div>
                                            <div class="tool justifyBetween alignItem">
                                                <label>Date</label>
                                                <input type="date" id="layerDate" >
                                            </div>
                                            <div class="tool justifyBetween alignItem">
                                                <label class="widthSmall">Start Time</label>
                                                <input class="widthSmall" type="text" id="layerStartTime" placeholder="00:00" >
                                            </div>
                                            <div class="tool justifyBetween alignItem">
                                                <label class="widthSmall">End Time</label>
                                                <input class="widthSmall" type="text" id="layerEndTime"  placeholder="00:00" >
                                            </div>
                                             
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: none;">
                                        <div class="header">Upload File</div>
                                        <div class="tool justifyBetween alignItem">
                                            <label class="button" for="upload-video">Browse</label>
                                            <input type="file" class="uploadFile" name="layerFileName" id="layerFileName">
                                        </div>
                                    </div>
                                    <div class="flexContainer bottom layerItem">
                                        <button id="startLayerFile" onclick="OnClickLayerEditUpdate()">Update</button>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="navBox layer" id="navBoxLayer">
                            <div class="infoHeader">
                                <div class="header">Layer</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="buttonTab sticky sortHandler">
                                    <span class="sort">Name
                                        <div class="control unset" date-sort="insightslayer-name:desc" style="display:none"><i class="fa-solid fa-sort"></i></div>
                                        <div class="control asc" date-sort="insightslayer-name:desc" style="display:inline-block"><i class="fa-solid fa-sort-up"></i></div>
                                        <div class="control desc" date-sort="insightslayer-name:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></div>
                                    </span>
                                    <span class="sort">Date
                                        <div class="control unset" date-sort="insightslayer-date:desc" style="display:inline-block"><i class="fa-solid fa-sort"></i></div>
                                        <div class="control asc" date-sort="insightslayer-date:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></div>
                                        <div class="control desc" date-sort="insightslayer-date:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></div>
                                    </span>
                                </div>
                                <div class="group layer">
                                    <div class="groupHead" rel="layer"><i class="fa-solid fa-caret-right"></i>Layer</div>
                                    <div class="groupItem" id="layer"></div>
                                </div>
                                <div class="group conOp">
                                    <div class="groupHead" rel="conOp"><i class="fa-solid fa-caret-right"></i>ConOp</div>
                                    <div class="groupItem" id="conOp"></div>
                                </div>
                               <div class="group defectReg asset">
                                    <div class="groupHead" rel="defectReg"><i class="fa-solid fa-caret-right"></i>Defect Register</div>
                                    <div class="groupItem" id="defectReg">
                                        <div class="filterContainer">
                                            <select type="text" class="SelYearRoutineDefect" id="selMonthsDefectOption" onchange="onChangeSelYear(this)">
                                                <option value="default">Select Year</option>
                                            </select>
                                            <div class="multipleSelect disabled" id="selMonthsDefect" onclick="onClickSelMonth(this, event)">Select Months <i class="fa-solid fa-ellipsis-vertical"></i></div>
                                        </div>
                                        <div class="selMonthsDefect multiContainer" style="display:none">
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="01" data-layer="defect"><label>Jan</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="02" data-layer="defect"><label>Feb</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="03" data-layer="defect"><label>Mar</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="04" data-layer="defect"><label>Apr</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="05" data-layer="defect"><label>May</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="06" data-layer="defect"><label>Jun</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="07" data-layer="defect"><label>Jul</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="08" data-layer="defect"><label>Aug</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="09" data-layer="defect"><label>Sep</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="10" data-layer="defect"><label>Oct</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="11" data-layer="defect"><label>Nov</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="12" data-layer="defect"><label>Dec</label></div>
                                        </div>
                                        <div id="defectRegItems">
                                        </div>
                                    </div>
                                </div>
                                <div class="group routineMain asset">
                                    <div class="groupHead" rel="routineMain"><i class="fa-solid fa-caret-right"></i>Routine Maintenance</div>
                                    <div class="groupItem" id="routineMain">
                                        <div class="filterContainer">
                                            <select type="text" class="SelYearRoutineDefect" id="selMonthsRoutineOption" onchange="onChangeSelYear(this)">
                                                <option value="default">Select Year</option>
                                            </select>
                                            <div class="multipleSelect disabled" id="selMonthsRoutine" onclick="onClickSelMonth(this, event)">Select Months <i class="fa-solid fa-ellipsis-vertical"></i></div>
                                        </div>
                                        <div class="selMonthsRoutine multiContainer" style="display:none">
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="01" data-layer="routine"><label>Jan</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="02" data-layer="routine"><label>Feb</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="03" data-layer="routine"><label>Mar</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="04" data-layer="routine"><label>Apr</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="05" data-layer="routine"><label>May</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="06" data-layer="routine"><label>Jun</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="07" data-layer="routine"><label>Jul</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="08" data-layer="routine"><label>Aug</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="09" data-layer="routine"><label>Sep</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="10" data-layer="routine"><label>Oct</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="11" data-layer="routine"><label>Nov</label></div>
                                            <div class="multiOption"><input type="checkbox" onchange="filterOnChange(this)" value="12" data-layer="routine"><label>Dec</label></div>
                                        </div>
                                        <div id="routineMainItems">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="infoFooter" id="metadataDetails">
                            </div>
                        </div>
                        <div class="navBox reviewTool">
                            <div class="infoHeader">
                                <div class="header">Review Tool</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="buttonTab">
                                    <button class="icon reviewTool" onclick="wizardOpenPage(this)" rel="insight" data-width="75" data-page="reviewPage" title="Create Review"><i class="onPrimary fa-solid fa-file"></i></button>
                                    <button class="icon reviewTool" id="reviewToolList" onclick="wizardOpenPage(this)" rel="insight" data-width="75" data-page="openJogetForm" title="Review List"><i class="onPrimary fa-solid fa-list"></i></button>

                                </div>
                                <div class="groupItem ungroup" id="reviewDataList" style="display: block;">
                                </div>
                            </div>
                            <div class="infoFooter">
                            </div>
                        </div>
                        <div class="navBox manageLayer">
                            <div class="infoHeader">
                                <div class="header">Manage Layer</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody moreInfo">
                                <div class="groupItem ungroup" style="display: block;" id="manageLayerList">
                                </div>
                            </div>
                            <div class="infoFooter moreInfo twoRow" id="manageLayerDetail">
                            </div>
                        </div>
                        <div class="navBox adjustElevation">
                            <div class="infoHeader">
                                <div class="header">Adjust Layers Elevation</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody moreInfo">
                                <div class="groupItem ungroup" style="display: block;" id="adjustLayerList">
                                </div>
                            </div>
                            <div class="infoFooter moreInfo extraSmall twoRow" id="adjustLayerDetail">
                            </div>
                        </div>
                        <div class="navBox markAsset">
                            <div class="infoHeader">
                                <div class="header">Asset List</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody moreInfo">
                                <div class="groupItem ungroup" style="display: block;" id="markAssetList">
                                </div>
                            </div>
                            <div class="infoFooter moreInfo twoRow" id="markAssetDetail" onclick="OnClickAssetDataTable()">
                            </div>
                        </div>
                        <div class="navbox cameraFeed">
                            <div class="infoHeader">
                                <div class="header"></div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="groupItem cameraItem" id="cameraPinList">
                                </div>
                                <div class="groupItem earthViewItem" id="earthViewItem">
                                </div>
                            </div>
                            <div class="infoFooter">
                            </div>
                        </div>
                        <div class="navbox folderDirectory">
                            <div class="infoHeader">
                                <div class="header">Folder Directory</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="buttonTab folder">
                                    <button id="lock-refresh" class="icon" onclick="OnClickRefreshPWFolder()"><i class="onPrimary fa-solid fa-refresh"></i></button>
                                </div>
                                <div class="jstree" id="jstree"><div id="infoRootNode"></div></div>
                            </div>
                            <div class="infoFooter">
                            </div>
                        </div>
                        <div class="navbox locationDirectory">
                            <div class="infoHeader">
                                <div class="header">Location Directory</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="instructionContainer markEntity">
                                    <div class="instruction rightClick">
                                        <i class="fa-solid fa-computer-mouse"></i><label>  Right click to mark point</label>
                                    </div>
                                    <div class="instruction escape">
                                        <label>Press <kbd>Esc</kbd> to exit tool</label>
                                    </div>
                                </div>
                                <div class="jstree" id="jstree"><div id="rootNode"></div></div>
                            </div>
                            <div class="infoFooter">
                            </div>
                        </div>
                        <div class="navbox thematic">
                            <div class="infoHeader">
                                <div class="header">Thematic</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="inputContainer">
                                    <label>Attribute</label>
                                    <select id="pipeAttr"></select>
                                    <br>
                                    <label style="display: none;">Layer</label>
                                    <select id="thematicLayer" style="display: none;"></select>
                                </div>
                                <div class="flexContainer">
                                    <button onclick="updateThematicv3()">Apply</button>
                                    <button onclick="removeThemev3()">Reset</button>
                                </div>

                            </div>
                            <div class="infoFooter moreInfo twoRow" style="overflow-y: auto;">
                                <div class="header" style="display: none;">Legend</div>
                                <div class="content">
                                    <div id="legendToolList" class="legendToolList">
                                        <div class="legendView" id="legendpage">
                                            <table>
                                                <tbody id="pipeLegends"></tbody>
                                            </table>
                                        </div> 
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="navbox uploadTool">
                            <div class="infoHeader">
                                <div class="header">Upload Tool</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="buttonTab">
                                    <div class="tab active" rel="upload" data-page="kmldiv" onclick="navBoxTabClick(this)">KML</div>
                                    <div class="tab" rel="upload" data-page="shpdiv" onclick="navBoxTabClick(this)">SHP</div>
                                    <div class="tab" rel="upload" data-page="b3dmdiv" onclick="navBoxTabClick(this)">B3DM</div>
                                    <div class="tab" id="xmldiv" rel="upload" data-page="xmldiv" onclick="navBoxTabClick(this)" style="display: none;">XML</div>
                                </div>
                                <div class="multiPage">
                                    <div class="page upload kmldiv active">
                                        <div>
                                            <div class="header">Upload KML/KMZ file</div>
                                            <div class="buttonTab insidePage">
                                                <button id="add-file-btn">Add File</button>
                                                <button class="hidden" id="start-upload-btn" class="hidden">Upload File</button>
                                                <button class="hidden" id="cancel-upload-btn" class="hidden">Cancel</button>
                                                <button class="hidden" id="reset-upload-btn" class="hidden">Reset</button>
                                            </div>
                                        </div>
                                        <div class="indicatorContainer">
                                            <div class="progress-bar-container">
                                                <div class="progress-bar"></div>
                                            </div>
                                            <span id="b3dmstatus" class="b3dmstatus"></span>
                                            <span id = "totalfiles" class="totalfiles">file(s)</span>
                                        </div>
                                        <div class="tableContainer" id = "filetb">
                                            <div class="tableHeader insight">
                                                <span class="middleColumn text-ellipsis">File Name</span>
                                                <span class="middleBigColumn text-ellipsis">Layer</span>
                                                <span class="middleMediumColumn text-ellipsis">Display</span>
                                                <span class="middleMediumColumn text-ellipsis">Share</span>
                                                <span class="middleMediumColumn text-ellipsis">Animation</span>
                                                <span class="middleColumn text-ellipsis">Status</span>
                                            </div>
                                            <div class="tableBody" id="fileTBody"></div>
                                        </div>
                                    </div>
                                    <div class="page upload shpdiv">
                                        <div>
                                            <div class="header">Upload SHP file</div>
                                            <div class="buttonTab insidePage">
                                                <button type="button" onClick="$(\'#add-file-btn\').trigger(\'click\')">Add File</button>
                                                <button class="hidden" type="button" onClick="$(\'#start-upload-btn\').trigger(\'click\')">Upload File</button>
                                                <button class="hidden" type="button" onClick="$(\'#cancel-upload-btn\').trigger(\'click\')">Cancel</button>
                                                <button class="hidden" type="button" onClick="geoDataClear()">Reset</button>
                                            </div>
                                        </div>
                                        <div class="indicatorContainer">
                                            <div class="progress-bar-container">
                                                <div class="progress-bar"></div>
                                            </div>
                                        </div>
                                        <div id="shpitem" class="tableContainer" style="display:none">
                                            <div class="folderName flexColumn">
                                                <label>Folder Name</label>
                                                <input id="shpFolder" type="text" class="inputContainer" disabled="disabled">
                                            </div>
                                            <div class="layerName flexColumn">
                                                <label>Layer Name</label>
                                                <input id ="shpName" type="text" class="inputContainer"/>
                                            </div>
                                            <div class="settings flexColumn">
                                                <div class="flexRow">
                                                    <input id= "shpchk" class="alignContent" type="checkbox"/>
                                                    <label>Default Display</label>
                                                </div>
                                                <div class="flexRow">
                                                    <input id = "shpsharechk" class="alignContent" type="checkbox"/>
                                                    <label>Share</label>
                                                </div>
                                                <div class="flexColumn">
                                                    <label>Progress :</label><spanstyle="text-align:center" id="shpstatus"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="page upload b3dmdiv">
                                        <div>
                                            <div class="header">Upload B3DM</div>
                                            <div class="buttonTab insidePage">
                                                <button type="button" onClick="$(\'#add-file-btn\').trigger(\'click\')">Add File</button>
                                                <button class="hidden" type="button" onClick="$(\'#start-upload-btn\').trigger(\'click\')">Upload File</button>
                                                <button class="hidden" type="button" onClick="$(\'#cancel-upload-btn\').trigger(\'click\')">Cancel</button>
                                                <button class="hidden" type="button" onClick="geoDataClear()">Reset</button>
                                            </div>
                                        </div>
                                        <div class="indicatorContainer">
                                            <div class="progress-bar-container">
                                                <div class="progress-bar"></div>
                                            </div>
                                            <span id="b3dmstatus" class="b3dmstatus"></span>
                                            <span id = "totalfiles" class="totalfiles">file(s)</span>
                                        </div>
                                        <div class="tableContainer" id = "b3dmitem" style="display:none">
                                            <div class="folderName flexColumn">
                                                <label>Folder Name</label>
                                                <input id="b3dmFolder" type="text" class="inputContainer" disabled>
                                            </div>
                                            <div class="layerName flexColumn">
                                                <label>Layer Name</label>
                                                <input id="bd3mName" type="text" class="inputContainer">
                                            </div>
                                            <div class="layerName flexColumn">
                                                <label>Main JSON File</label>
                                                <select id="jsonF_selection" type="text" class="inputContainer"></select>
                                            </div>
                                            <div class="settings flexColumn">
                                                <div class="flexRow">
                                                    <input id="b3dmchk" class="alignContent" type="checkbox">
                                                    <label>Default Display</label>
                                                </div>
                                                <div class="flexRow">
                                                    <input id="b3dmsharechk" class="alignContent" type="checkbox">
                                                    <label>Share</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="page upload xmldiv active">
                                        <div>
                                            <div class="header">Upload XML file</div>
                                            <div class="buttonTab insidePage">
                                                <button id="add-file-btn-xml">Add File</button>
                                                <button class="hidden" type="button" onClick="$(\'#start-upload-btn\').trigger(\'click\')">Upload File</button>
                                                <button class="hidden" type="button" onClick="geoDataClear()">Reset</button>
                                            </div>
                                        </div>
                                        <div class="indicatorContainer">
                                            <div class="progress-bar-container">
                                                <div class="progress-bar"></div>
                                            </div>
                                            <span id="b3dmstatus" class="b3dmstatus"></span>
                                        </div>
                                        <div class="tableContainer" id = "xmlfiletb" style="display:none">
                                            <div class="tableHeader insight">
                                                <span class="middleColumn text-ellipsis">File Name</span>
                                                <span class="middleBigColumn text-ellipsis">XML Name</span>
                                                <span class="middleColumn text-ellipsis">Status</span>
                                            </div>
                                            <div class="tableBody" id="xmlFileTBody"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="infoFooter">
                            </div>
                        </div>
                        <div class="navbox aic" id="navBoxAIC">
                            <div class="infoHeader">
                                <div class="header">Aerial Image</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="buttonTab" id="packageDiv">
                                    <div class="inputContainer">
                                        <select id="packageDropdown" onchange="aicPackageChanged(this)">
                                        </select>
                                    </div>
                                </div>
                                <div class="buttonTab">
                                    <div class="tab active" rel="uploadData_Weekly" id="uploadTab_Weekly" data-category="Weekly" onclick="tabAICData(this)" data-page="weekly">Weekly</div>
                                    <div class="tab" rel="uploadData_Monthly" id="uploadTab_Monthly" data-category="Monthly" onclick="tabAICData(this)" data-page="monthly">Monthly</div>
                                    <div class="tab" rel="uploadData_Quarterly" id="uploadTab_Quarterly" data-category="Quarterly" onclick="tabAICData(this)" data-page="quarterly">Quarterly</div>
                                </div>
                                <div class="buttonTab noBorder">
                                    <button class="icon" onclick="wizardOpenPage(this)" rel="insight" data-width="75" data-page="aicPage" title="Aerial Image Comparison"><i class="onPrimary fa-regular fa-images"></i></button>';
                                    if(isset($_SESSION['email']) && $_SESSION['email'] ==  "dionnald.manager@gmail.com" || $_SESSION['email'] == "pbh.sabah@gmail.com" || $_SESSION['email'] == "pbh.sarawak@gmail.com" || $_SESSION['email'] == "sslr2.support@digile.com" || $_SESSION['email'] == "sslr2.gis@digile.com"){
                                        echo '
                                        <button class="icon" onclick="wizardOpenPage(this)" rel="insight" data-width="75" data-page="aicEditPage" title="Aerial Image Edit" data-aicedit="Weekly" id="aerialEditBtn"><i class="onPrimary fa-solid fa-file-pen"></i></button>';
                                    }
                                    echo'
                                </div>
                                <div class="multiPage">
                                    <div class="page aic weekly" id="uploadData_Weekly" style="display:block">
                                        <label class="">No Aic Data</label>
                                    </div>
                                    <div class="page aic monthly" id="uploadData_Monthly" style="display:none">
                                        <label class="">No Aic Data</label>
                                    </div>
                                    <div class="page aic quarterly" id="uploadData_Quarterly" style="display:none">
                                        <label class="">No Aic Data</label>
                                    </div>
                                </div>
                            </div>
                            <div class="infoFooter">
                            </div>
                        </div>
                        <div class="navbox floatBox" id="folderMoreInfo">
                            <div class="infoHeader">
                                <div class="header">Documents</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="buttonTab">
                                    <div class="tab active" rel="floatBox" data-page="floatDocument" onclick="navBoxTabClick(this)">Document</div>
                                </div>
                                <div class="multiPage">
                                    <div class="page floatBox floatDocument active">
                                        <div class="column">
                                            <div>Name</div>
                                            <div>WPC_ID</div>
                                            <div>SHAPE_LENG</div>
                                            <div>WPC_NO</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="infoFooter moreInfo" style="display:none">
                                <div class="header"><input disabled value="Package List"></div>
                                <div class="content flexColumn">
                                    <span>Select a package project to associate :</span>
                                    <div class="packageListContainer">
                                        <select>
                                            <option>Sabah Package 2</option>
                                            <option>Training PBH Sabah WP02</option>
                                            <option>Training PBH Sabah WP03</option>
                                            <option>Training PBH Sabah WP04</option>
                                        </select>
                                        <div><button rel="insight" onclick="wizardOpenPage(this)" data-width="55" data-page="openJogetForm" title="Register">Select</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="navBox markupTool">
                            <div class="infoHeader">
                                <div class="header">Markup Tool</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="instructionContainer markupTool">
                                    
                                </div>
                                <div class="drawContainer" style="display: block;">
                                    <div class="header">Draw</div>
                                    <div class="tool">
                                        <button class="icon markup" rel="markupTool" title="Point" id="btn_point"><i class="onPrimary fa-solid fa-location-dot"></i></button>
                                        <button class="icon markup" rel="markupTool" title="Line" id="btn_line"><i class="onPrimary fa-solid fa-grip-lines"></i></button>
                                        <button class="icon markup" rel="markupTool" title="Polygon" id="btn_polygon"><i class="onPrimary fa-solid fa-draw-polygon"></i></button>
                                        <button class="icon markup" rel="markupTool" title="Text Annotation" id="btn_text"><i class="onPrimary fa-solid fa-font"></i></button>
                                    </div>
                                    <div class="header edit" style="display: none;">Edit</div>
                                    <div class="tool alignItem edit" style="display: none;">
                                        <button class="icon markup" rel="markupTool" title="Undo Drawing" id="btn_undo" style="display: none;"><i class="onPrimary fa-solid fa-arrow-left-long"></i></button>
                                        <button class="icon markup" rel="markupTool" title="Delete Drawing" id="btn_delete" style="display: none;"><i class="onPrimary fa-solid fa-eraser"></i></i></button>
                                        <button class="icon markup" rel="markupTool" title="Reset All" id="btn_reset"><i class="onPrimary fa-solid fa-arrows-rotate"></i></button>
                                        <button class="icon markup" rel="markupTool" title="Print Map" id="btn_print"><i class="onPrimary fa-solid fa-print"></i></button>
                                        <input id="color-picker" value="white"/>
                                    </div>
                                </div>                    
                            </div>
                        </div>
                        <div class="navBox controlPanel">
                            <div class="infoHeader">
                                <div class="header">Control Panel</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody moreInfo">
                                <div class="groupItem" style="display: block;">
                                    <div class="list header">
                                        <div class="column1" ><a class="label">AssetID</a></div>
                                        <div class="column2 width"><a class="label">Current Value</a></div>
                                        <div class="column2 width"><a class="label">Indicator</a></div>
                                        <div class="column2 width"><a class="label"></a></div>
                                    </div>
                                </div>
                                <div class="groupItem ungroup groupTable" style="display: block;" id="controlPanelAssetList">
                                </div>
                            </div>
                        </div>
                        <div class="navbox manageIoT">
                            <div class="infoHeader">
                                <div class="header">Manage IoT</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="groupItem iotItem" id="iotSensorList" style="display:block">
                                </div>
                            </div>
                            <div class="infoFooter">
                            </div>
                        </div>
                        <div class="navBox addIoT">
                            <div class="infoHeader">
                                <div class="header">Add New IoT Sensor</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="pageContainer iotItem">
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">IoT Sensor Information</div>
                                        <div class="tool justifyBetween">
                                            <label>ID</label>
                                            <input type="text" id="dbID" style = "display:none">
                                            <input type="text" id="iotID">
                                        </div>
                                        <div class="tool justifyBetween">  
                                            <label>Name</label>
                                            <input type="text" id="iotName">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Type</label>
                                            <br>
                                            <div class="flex alignItem">
                                                <label for="temperature" >Temperature</label>
                                                <input type="radio" id="temperature" name="iotType" checked="checked">
                                            </div>
                                            <div class="flex alignItem">
                                                <label for="pressure" >Pressure</label>
                                                <input type="radio" id="pressure" name="iotType">
                                            </div>
                                            <div class="flex alignItem">
                                                <label for="humidity" >Humidity</label>
                                                <input type="radio" id="humidity" name="iotType">
                                            </div>
                                            
                                        </div>
                                        <div class="tool justifyBetween">
                                            <div class="" id="thresholdSetting" style ="display:block">
                                                <h5>Threshold label Range</h5>
                                                <div class="fieldContainer">
                                                    <label>Green</label><br>
                                                    <div class="flexContainer">
                                                        <input type="number" id="iotG2">
                                                        to
                                                        <input type="number" id="iotG1">
                                                    </div>
                                                </div>
                                                <div class="fieldContainer">
                                                    <label>Yellow</label><br>
                                                    <div class="flexContainer">
                                                        <input type="number" id="iotY2">
                                                        to
                                                        <input type="number" id="iotY1">
                                                    </div>
                                                </div>
                                                <div class="fieldContainer">
                                                    <label>Red</label><br>
                                                    <div class="flexContainer">
                                                        <input type="number" id="iotR2">
                                                        to
                                                        <input type="number" id="iotR1">
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="instructionContainer drawTool">
                                        <div class="instruction leftClick">
                                            <i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark the sensor in the model</label>
                                        </div>
                                    </div>
                                    <div class="drawContainer" style="display: block;">
                                        <div class="header">Sensor</div>
                                        <div class="tool justifyBetween">
                                            <label>Element ID</label>
                                            <input type="text" disabled="disabled" id="sensorElementID">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Longitude</label>
                                            <input type="text" disabled="disabled" id="sensorLong">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Latitude</label>
                                            <input type="text" disabled="disabled" id="sensorLat">
                                        </div>
                                        <div class="tool justifyBetween">
                                            <label>Height</label>
                                            <input type="number" id="sensorHeight">
                                        </div>
                                    </div>
                                    <div class="flexContainer bottom iotItem">
                                        <button id="startImageFile" onclick="OnClickIoTSave()">Save</button>
                                        <button onclick="OnClickIoTReset()">Reset</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="navBox notiPanel">
                            <div class="infoHeader">
                                <div class="header">IoT Notification</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody moreInfo">
                                <div class="groupItem ungroup" style="display: block;" id="IoTNotiList">
                                    <div class="list" onclick="getIotDetail(this)" data-created-at="10/10/2023" data-datetime="11/10/2023" data-element-id="12" data-iot-id="1-D" data-iot-name="test name" data-iot-type="temperature" data-sensor-colour="red" data-value="45">
                                        <div class="column1" rel="id-layer_213">
                                            <a class="label">TMS-Road-KM10-20</a>
                                        </div>
                                        <div class="column2 width"><a class="label">B3DM</a></div>
                                        <div class="column2 width"><a class="label">Default: OFF</a></div>
                                        <div class="column2 width">Wed May 18 2022</div>
                                        <div class="column2 width"><input type="checkbox" id="" name="" value=""></div>
                                    </div>
                                </div>
                            </div>
                            <div class="infoFooter moreInfo twoRow" id="IotNotiDetail">
                            </div>
                        </div>
                        <div class="navbox trackAnimation">
                            <div class="infoHeader">
                                <div class="header">Fly Through Animation Feed</div>
                                <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                            </div>
                            <div class="infoBody">
                                <div class="groupItem trackItem ungroup" id="trackList">
                                </div>
                            </div>
                            <div class="infoFooter moreInfo extraSmall twoRow">
                                <div class="header">
                                    <input disabled value="Animation Tool">
                                </div>
                                <div class="content">
                                    <div class="col1">
                                        <div>Duration(s)</div>
                                        <div>Camera Height (m)</div>
                                        <div style="display: none">Date</div>
                                    </div>
                                    <div class="col2 no-col3">
                                        <input id="trackDuration" type="number" min="0" step="1">
                                        <input id="trackLevel" type="number" min="5" step="1">
                                        <input style="display: none" id="trackDate" type="date">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="text" id="input-text" style="display: none;
                        position: absolute;
                        z-index: 1;
                        background: #adadad7d;
                        border: none;
                        outline: none;
                        color: white;
                        border-radius: 2px;
                        width: 100px;
                        padding: 5px;" />
                    <div class="navBox jogetList bumiList">
                        <div class="infoHeader">
                            <div class="header">Bumi Participant List</div>
                            <div class="refreshButton" onclick="detachWidgetOpen(this)" title="Attach/Detach" data-list="bumiList"><i class="fa-solid fa-square-arrow-up-right"></i></div>
                            <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                        </div>
                        <div class="infoBody">
                            <iframe class="fullFrame bumiDatalist" id = "jogetBumiList" src="" frameBorder="0"></iframe>
                        </div>
                        <div class="infoFooter">
                        </div>
                    </div>
                    <div class="navbox jogetList conopList">
                        <div class="infoHeader" id="conopButton">
                            <div class="header" id = "nameDatalist"></div>
                            <div class="refreshButton" onclick="detachWidgetOpen(this)" title="Attach/Detach" data-list="allListConstruct"><i class="fa-solid fa-square-arrow-up-right"></i></div>
                            <div class="refreshButton" id = "changeNameConop" title="Change Tab Name"><i class="fa-solid fa-toggle-on fa-xs top-3" id = "toggleConop"></i></div>
                            <div class="closeButton" title="Close"><i class="fa-solid fa-xmark"></i></div>
                        </div>
                        <div class="infoBody">
                            <div class="buttonTab" id = "conopList">
                            </div>
                            <iframe class="fullFrame jogetDatalist" id = "jogetConopList" src="" frameBorder="0"></iframe>
                        </div>
                        <div class="infoFooter">
                        </div>
                    </div>
                    <div class="navbox jogetList maintenanceBrowser">
                        <div class="infoHeader" id="maintainButton">
                            <div class="header">Maintenance Browser</div>
                            <div class="refreshButton" onclick="detachWidgetOpen(this)" title="Attach/Detach" data-list="maintenanceBrowser"><i class="fa-solid fa-square-arrow-up-right"></i></div>
                            <div class="refreshButton" id = "changeNameMaintenance" title="Change Tab Name"><i class="fa-solid fa-toggle-on fa-xs top-3" id = "toggleMaintain"></i></div>
                            <div class="closeButton" title="Close"><i class="fa-solid fa-xmark"></i></div>
                        </div>
                        <div class="infoBody">
                            <div class="buttonTab parentTab maintenanceList" id = "">
                            </div>
                            <div class="buttonTab childrenTab conditionBrowser" id = "" style="display:none">
                            </div>
                            <div class="buttonTab childrenTab assessmentBrowser" id = "" style="display:none">
                            </div>
                            <div class="buttonTab childrenTab routineBrowser" id = "" style="display:none">
                            </div>
                            <div class="buttonTab childrenTab periodicBrowser" id = "" style="display:none">
                            </div>
                            <div class="buttonTab childrenTab emergencyBrowser" id = "" style="display:none">
                            </div>
                            <iframe class="fullFrame maintenanceList" id="jogetBrowserList" src="" frameBorder="0"></iframe>
                        </div>
                        <div class="infoFooter">
                        </div>
                    </div>
                    <div class="navbox jogetList inventoryList">
                        <div class="infoHeader" id="inventoryButton">
                            <div class="header" id = "nameInventorylist">Asset Table</div>
                            <div class="refreshButton" onclick="detachWidgetOpen(this)" title="Attach/Detach" data-list="allListInventory"><i class="fa-solid fa-square-arrow-up-right"></i></div>
                            <div class="refreshButton" id = "changeNameInventory" title="Change Tab Name"><i class="fa-solid fa-toggle-on fa-xs top-3" id = "toggleInventory"></i></div>
                            <div class="closeButton" title="Close"><i class="fa-solid fa-xmark"></i></div>
                        </div>
                        <div class="infoBody">
                            <div class="buttonTab parentTab inventoryList">
                                <div class="tab inventory changeName parent" rel = "network" style = "font-size;9px" title = "NW" onclick="navBoxTabParentClick(this)">Network</div>
                                <div class="tab inventory changeName parent" rel = "bridge" style = "font-size;9px" title = "BR" onclick="navBoxTabParentClick(this)">Bridge</div>
                                <div class="tab inventory changeName parent" rel = "culvert" style = "font-size;9px" title = "CL" onclick="navBoxTabParentClick(this)">Culvert</div>
                                <div class="tab inventory changeName parent" rel = "drainage" style = "font-size;9px" title = "DR" onclick="navBoxTabParentClick(this)">Drainage</div>
                                <div class="tab inventory changeName parent" rel = "pavement" style = "font-size;9px" title = "PV" onclick="navBoxTabParentClick(this)">Pavement</div>
                                <div class="tab inventory changeName parent" rel = "roadFur" style = "font-size;9px" title = "RF" onclick="navBoxTabParentClick(this)">Road Furniture</div>
                                <div class="tab inventory changeName parent" rel = "slope" style = "font-size;9px" title = "SL" onclick="navBoxTabParentClick(this)">Slope</div>
                                <div class="tab inventory changeName parent" rel = "electrical" style = "font-size;9px" title = "EL" onclick="navBoxTabParentClick(this)">Electrical</div>
                            </div>
                            <div class="buttonTab childrenTab networkBrowser" id = "" style="display:none">
                                <div class="tab changeName children inventoryJoget" rel="network_div" id="inventoryJoget" style="max-width: 100px;" title="" onclick="navBoxTabClick(this)"></div>
                                <div class="tab changeName children inventoryJoget" rel="network_route" id="inventoryJoget" style="max-width: 100px;" title="RT" onclick="navBoxTabClick(this)">Route</div>
                            </div>
                            <iframe class="fullFrame jogetInventorylist" id="jogetInventoryList" src="" frameBorder="0"></iframe>
                        </div>
                        <div class="infoFooter">
                        </div>
                    </div>
                    <div class="navbox jogetList assetList">
                        <div class="infoHeader">
                            <div class="header">Asset Table</div>
                            <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                        </div>
                        <div class="infoBody">
                            <div class="buttonTab asset parentTab" id = "assetList">
                                
                            </div>
                            <div class="buttonTab" id = "facilityBrowser" style="display:none">
                               
                            </div>
                            <table id="assetDataTable" style="display:none">
                                <thead>
                                    <tr id = "assetTableHeader">
                                        <th>Asset No</th>
                                        <th>Asset Name</th>
                                        <th>Asset Type</th>
                                        <th>Manufacturer</th>
                                        <th>Floor</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="assetData";>
                                </tbody>
                            </table>     
                        </div>
                        <div class="infoFooter">
                        </div>
                    </div>
                    <div class="navbox jogetList workOrder">
                        <div class="infoHeader">
                            <div class="header">Work Order Form</div>
                            <div class="closeButton"><i class="fa-solid fa-xmark"></i></div>
                        </div>
                        <div class="infoBody">
                            <iframe class="fullFrame jogetDatalist" id = "workOrderForm" src="" frameBorder="0"></iframe>
                        </div>
                        <div class="infoFooter">
                        </div>
                    </div>
                    <div class="navbox jogetList bulkApprovalList">
                        <div class="infoHeader" id="conopButton">
                            <div class="header" id = "">Bulk Approval Assignments</div>
                            <div class="closeButton" title="Close"><i class="fa-solid fa-xmark"></i></div>
                        </div>
                        <div class="infoBody">
                            <div class="buttonTab" id = "bulkApprovalList">
                            </div>
                            <iframe class="fullFrame jogetDatalist" id = "jogetBulkApprovalList" src="" frameBorder="0"></iframe>
                        </div>
                        <div class="infoFooter">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mainPage myDashboard">
            <div class="contentContainer">
                <div class="head">
                    <h2>Project Summary</h2>
                    <div class="filterContainer">
                        <select class = "packFilter myDashboard" onchange="refreshPackage(\'myDashboard\')">
                        </select>
                        <select class = "yrFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "mthFilter myDashboard" onchange="refreshDash(\'myDashboard\')" disabled>
                            <option value="all">Select Month</option>
                            <option value="Jan">January</option>
                            <option value="Feb">February</option>
                            <option value="Mar">March</option>
                            <option value="Apr">April</option>
                            <option value="May">May</option>
                            <option value="Jun">June</option>
                            <option value="Jul">July</option>
                            <option value="Aug">August</option>
                            <option value="Sep">September</option>
                            <option value="Oct">October</option>
                            <option value="Nov">November</option>
                            <option value="Dec">December</option>
                        </select>
                        <select class = "sectFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                        </select>';

                        if($SYSTEM == 'KKR'){
                            echo '
                                <select class = "categoryFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                                </select>';
                        }else{
                            echo '
                                <select class = "categoryFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                                    <option value="overall">Select Category</option>
                                    <option value="Designated">Designated</option>
                                    <option value="Domestic">Domestic</option>
                                    <option value="Nominated">Nominated</option>
                                </select>';
                        }
                        
                        echo '
                        <select class = "statusPubcFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option value="allstatus">Select Status</option>
                            <option value="CLOSED">Close</option>
                            <option value="OPEN">Open</option>
                        </select>
                        <select class = "statusLandFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option value="all">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Close</option>
                        </select>
                        <select class = "sourceFilter myDashboard" id = "sourceFilterId" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "statusPubcSbhFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option value="allstatus">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="closed">Closed</option>
                        </select>
                        <select class = "reportCategoryFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option value="allcategory">Select Category</option>
                            <option value="JKR Overall Project Monthly Progress Report">JKR Overall Project Monthly Progress Report</option>
                            <option value="Monthly QAQC Report">Monthly QAQC Report</option>
                            <option value="PMC Overall Project Monthly Progress Report">PMC Overall Project Monthly Progress Report</option>
                            <option value="WPC Monthly Progress Report">WPC Monthly Progress Report</option>
                            <option value="WPC Weekly Progress Report">WPC Weekly Progress Report</option>
                        </select>
                        <select class = "reportStatusFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option value="allstatus">Select Status</option>
                            <option value="closed">Closed</option>
                            <option value="pending">Pending</option>
                        </select>
                        <select class = "categoryRiskFilter myDashboard" id = "categoryRiskFilterId" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "riskRatingFilter myDashboard" id = "riskRatingFilterId" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "lcmNoFilter myDashboard" id = "lcmNoFilterId" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "districtFilter myDashboard" id = "districtFilterId" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "issueStatus myDashboard" id = "issueStatusId" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "catgGenMgmt myDashboard" id = "catgGenMgmtId" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "typeGenMgmt myDashboard" id = "typeGenMgmtId" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "assetApjFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option value="default">Select Priority</option>
                            <option value="Critical">Critical</option>
                            <option value="Serious">Serious</option>
                            <option value="Bad">Bad</option>
                            <option value="Mild">Mild</option>
                            <option value="Good">Good</option>
                        </select>
                        <select class = "assetRoutineActivityFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "subActivityFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option value="default">Select Sub Activity</option>
                        </select>
                        <select class = "assetTypeFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option value="default">Select Asset Type</option>
                        </select>
                        <select class = "assetGroupFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option value="all">Select Asset Group</option>
                            <option value="Pavement">Pavement</option>
                            <option value="Non Pavement">Non Pavement</option>
                            <option value="Bridge">Bridge</option>
                            <option value="Slope">Slope</option>
                            <option value="Electrical">Electrical</option>
                        </select>
                        <select class = "assetDateFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "assetLaneFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option val="Fast" selected>Fast Lane</option>
                            <option val="Slow">Slow Lane</option>
                        </select>
                        <select class = "assetChainFromFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "assetChainToFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                        </select>
                        <select class = "assetDirectionToFilter myDashboard" onchange="refreshDash(\'myDashboard\')">
                            <option selected value="Increasing">Increasing</option>
                            <option value="Decreasing">Decreasing</option>
                        </select>
                    </div>
                </div>
                <iframe class="iframe" id="myDashboard" src=""></iframe>
            </div>
        </div>
        <div class="mainPage myDocument">
            <div class="contentContainer">
                <div class="head">
                    <h2>Document</h2>
                    <div class="filterContainer">
                        <select class = "packFilter myDocument" onchange="refreshDash(\'myDocument\')">
                        </select>
                        <select class = "sectFilter myDocument" onchange="refreshDash(\'myDocument\')">
                        </select>
                        <select class = "yrFilter myDocument" onchange="refreshDash(\'myDocument\')">
                        </select>
                        <select class = "mthFilter myDocument" onchange="refreshDash(\'myDocument\')" disabled>
                            <option value="all">Select Month</option>
                            <option value="Jan">January</option>
                            <option value="Feb">February</option>
                            <option value="Mar">March</option>
                            <option value="Apr">April</option>
                            <option value="May">May</option>
                            <option value="Jun">June</option>
                            <option value="Jul">July</option>
                            <option value="Aug">August</option>
                            <option value="Sep">September</option>
                            <option value="Oct">October</option>
                            <option value="Nov">November</option>
                            <option value="Dec">December</option>
                        </select>
                        </select>
                    </div>
                    <div class="buttonContainer">
                        <div class="backButtonContainer">
                            <button onclick="linkToJogetPage(this, \'backButtonContainer\')">Back</button>
                        </div>
                        <div class="editButtonContainer">
                            <button data-jogetlink="" onclick="linkToJogetPage(this, \'editButtonContainer\')">Edit</button>
                        </div>
                        <div class="addButtonContainer">
                            <button data-jogetlink="" onclick="linkToJogetPage(this, \'addButtonContainer\')">Add Details</button>
                        </div>
                        <div class="newButtonContainer">
                            <button data-jogetlink="" onclick="linkToJogetPage(this, \'newButtonContainer\')">New Contract</button>
                        </div>
                    </div>
                </div>
                <div class="templateContainer" style="display: none">
                </div>
                <iframe class="iframe" id="myDocument" src=""></iframe>
            </div>
        </div>
        <div class="mainPage myFinance">
            <div class="contentContainer">
                <div class="head">
                    <h2>Finance</h2>
                    <div class="filterContainer">
                        <select class = "packFilter myFinance" onchange="refreshDash(\'myFinance\')">
                        </select>
                        <select class = "sectFilter myFinance" onchange="refreshDash(\'myFinance\')">
                        </select>
                        <select class = "yrFilter myFinance" onchange="refreshDash(\'myFinance\')">
                        </select>
                        <select class = "mthFilter myFinance" onchange="refreshDash(\'myFinance\')" disabled>
                            <option value="all">Select Month</option>
                            <option value="Jan">January</option>
                            <option value="Feb">February</option>
                            <option value="Mar">March</option>
                            <option value="Apr">April</option>
                            <option value="May">May</option>
                            <option value="Jun">June</option>
                            <option value="Jul">July</option>
                            <option value="Aug">August</option>
                            <option value="Sep">September</option>
                            <option value="Oct">October</option>
                            <option value="Nov">November</option>
                            <option value="Dec">December</option>
                        </select>
                        </select>
                    </div>
                    <div class="buttonContainer">
                        <div class="backButtonContainer">
                            <button onclick="linkToJogetPage(this, \'backButtonContainer\')">Back</button>
                        </div>
                        <div class="editButtonContainer">
                            <button data-jogetlink="" onclick="linkToJogetPage(this, \'editButtonContainer\')">Edit</button>
                        </div>
                        <div class="addButtonContainer">
                            <button data-jogetlink="" onclick="linkToJogetPage(this, \'addButtonContainer\')">Add Details</button>
                        </div>
                        <div class="newButtonContainer">
                            <button data-jogetlink="" onclick="linkToJogetPage(this, \'newButtonContainer\')">New Contract</button>
                        </div>
                    </div>
                </div>
                <div class="templateContainer" style="display: none">
                </div>
                <iframe class="iframe" id="myFinance" src=""></iframe>
            </div>
        </div>
        <div class="mainPage myAdmin">
            <div class="contentContainer">
                <div class="head">
                    <h2>Project Admin</h2>
                </div>
                <iframe class="iframe" id="myAdmin" src=""></iframe>
            </div>
        </div>
        <div class="mainPage myTask swiper swiper-h">
            <div class="contentContainer multiColumn swiper-wrapper">
                <div class="column swiper-slide" id="constTask" style="display: none">
                    <div class="head">
                        <h2>Construction</h2>
                    </div>
                    <div class="tableContainer">
                        <div class="searchContainer">
                            <input onkeyup="homeSearchTask(this)" placeholder="Search Task"/>
                        </div>
                        <div class="tableHeader taskConstruct sortHandler">
                            <span class="columnIndex"></span>
                            <span class="columnFirst">Reference No.
                                <button type="button" class="control unset" data-sort="construct-refno:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="construct-refno:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="construct-refno:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Modified
                                <button type="button" class="control unset" data-sort="construct-modifieddate:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="construct-modifieddate:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="construct-modifieddate:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Pending Task
                                <button type="button" class="control unset" data-sort="construct-pending:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="construct-pending:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="construct-pending:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond columnHidden">Section
                                <button type="button" class="control unset" data-sort="construct-section:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="construct-section:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="construct-section:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                            <span class="columnFirst columnHidden">Work Discipline
                                <button type="button" class="control unset" data-sort="construct-workdiscipline:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="construct-workdiscipline:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="construct-workdiscipline:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                            <span class="columnFirst columnHidden">Created By
                                <button type="button" class="control unset" data-sort="construct-createdbyname:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="construct-createdbyname:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="construct-createdbyname:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                        </div>
                        <div class="tableBody taskConstruct sortTable">
                            <div class="loadingRowContainer" style="display:block;">
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column swiper-slide" id="docTask" style="display: none">
                    <div class="head">
                        <h2>Document</h2>
                    </div>
                    <div class="tableContainer">
                        <div class="searchContainer">
                            <input onkeyup="homeSearchTask(this)" placeholder="Search Task"/>
                        </div>
                        <div class="tableHeader taskDocument sortHandler">
                            <span class="columnIndex"></span>
                            <span class="columnFirst">Reference No.
                                <button type="button" class="control unset" data-sort="document-refno:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="document-refno:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="document-refno:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Modified
                                <button type="button" class="control unset" data-sort="document-modifieddate:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="document-modifieddate:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="document-modifieddate:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Pending Task
                                <button type="button" class="control unset" data-sort="document-pending:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="document-pending:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="document-pending:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond columnHidden">Section
                                <button type="button" class="control unset" data-sort="document-section:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="document-section:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="document-section:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                            <span class="columnFirst columnHidden">Created By
                                <button type="button" class="control unset" data-sort="document-createdbyname:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="document-createdbyname:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="document-createdbyname:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                        </div>
                        <div class="tableBody taskDocument sortTable">
                            <div class="loadingRowContainer" style="display:block;">
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column swiper-slide" id="pfsTask" style="display: none">
                    <div class="head">
                        <h2>Finance</h2>
                    </div>
                    <div class="tableContainer">
                        <div class="searchContainer">
                            <input onkeyup="homeSearchTask(this)" placeholder="Search Task"/>
                        </div>
                        <div class="tableHeader taskFinance sortHandler">
                            <span class="columnIndex"></span>
                            <span class="columnFirst">Reference No.
                                <button type="button" class="control unset" data-sort="finance-refno:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="finance-refno:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="finance-refno:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Modified
                                <button type="button" class="control unset" data-sort="finance-modifieddate:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="finance-modifieddate:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="finance-modifieddate:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Pending Task
                                <button type="button" class="control unset" data-sort="finance-pending:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="finance-pending:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="finance-pending:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond columnHidden">Section
                                <button type="button" class="control unset" data-sort="finance-section:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="finance-section:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="finance-section:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnFirst columnHidden">Created By
                                <button type="button" class="control unset" data-sort="finance-createdbyname:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="finance-createdbyname:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="finance-createdbyname:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                        </div>
                        <div class="tableBody taskFinance sortTable">
                            <div class="loadingRowContainer" style="display:block;">
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column swiper-slide" id="assetTask" style="display: none">
                    <div class="head">
                        <h2>Asset</h2>
                    </div>
                    <div class="tableContainer">
                        <div class="searchContainer">
                            <input onkeyup="homeSearchTask(this)" placeholder="Search Task"/>
                        </div>
                        <div class="tableHeader taskAsset sortHandler">
                            <span class="columnIndex"></span>
                            <span class="columnFirst">Reference No.
                                <button type="button" class="control unset" data-sort="asset-refno:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="asset-refno:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="asset-refno:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Modified
                                <button type="button" class="control unset" data-sort="asset-modifieddate:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="asset-modifieddate:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="asset-modifieddate:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Pending Task
                                <button type="button" class="control unset" data-sort="asset-pending:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="asset-pending:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="asset-pending:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnFirst columnHidden">Work Discipline
                                <button type="button" class="control unset" data-sort="asset-workdiscipline:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="asset-workdiscipline:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="asset-workdiscipline:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                            <span class="columnFirst columnHidden">Created By
                                <button type="button" class="control unset" data-sort="asset-createdbyname:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="asset-createdbyname:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="asset-createdbyname:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span> 
                        </div>
                        <div class="tableBody taskAsset sortTable">
                            <div class="loadingRowContainer" style="display:block;">
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column swiper-slide" id="fmTask" style="display: none">
                    <div class="head">
                        <h2>Asset</h2>
                    </div>
                    <div class="tableContainer">
                        <div class="searchContainer">
                            <input onkeyup="homeSearchTask(this)" placeholder="Search Task"/>
                        </div>
                        <div class="tableHeader taskServiceRequest sortHandler">
                            <span class="columnIndex"></span>
                            <span class="columnFirst">Reference No.
                                <button type="button" class="control unset" data-sort="asset-refno:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="asset-refno:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="asset-refno:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Modified
                                <button type="button" class="control unset" data-sort="asset-modifieddate:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="asset-modifieddate:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="asset-modifieddate:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                            <span class="columnSecond">Pending Task
                                <button type="button" class="control unset" data-sort="asset-pending:desc"><i class="fa-solid fa-sort"></i></button>
                                <button type="button" class="control asc" data-sort="asset-pending:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                                <button type="button" class="control desc" data-sort="asset-pending:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                            </span>
                        </div>
                        <div class="tableBody taskServiceRequest sortTable">
                            <div class="loadingRowContainer" style="display:block;">
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column" id="noTask" style="display: none">
                    <div class="head">
                        <h2>My Task</h2>
                    </div>
                    <div class="tableContainer">
                        <div class="searchContainer">
                            <input onkeyup="homeSearchTask(this)" placeholder="Search Task"/>
                        </div>
                        <div class="tableHeader">
                            <span class="columnIndex"></span>
                            <span class="columnFirst">Reference No.</span>
                            <span class="columnSecond">Modified</span>
                            <span class="columnSecond">Pending Task</span> 
                        </div>
                        <div class="tableBody taskNo">
                            <div class="loadingRowContainer" style="display:block;">
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row loadingRow">
                                    <div class="timeline-item-row">
                                        <div class="animated-background-row">
                                            <div class="background-masker header-top"></div>
                                            <div class="background-masker header-left"></div>
                                            <div class="background-masker header-right"></div>
                                            <div class="background-masker header-bottom"></div>
                                            <div class="background-masker subheader-left"></div>
                                            <div class="background-masker subheader-right"></div>
                                            <div class="background-masker subheader-bottom"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <div class="mainPage eLibrary">
            <div class="contentContainer">
                <div class="head">
                    <h2>E-Library</h2>
                </div>
                <iframe class="iframe" id="eLibrary" src=""></iframe>
            </div>
        </div>
        <div class="mainPage projectInformation">
            <div class="contentContainer">
                <div class="head">
                    <h2>Project Information</h2>
                </div>
                <iframe class="iframe" id="projectInformation" src=""></iframe>
            </div>
        </div>
        <div class="mainPage mySysAdmin">
            <div class="contentContainer">
                <div class="head">
                    <h2></h2>
                </div>
                <iframe class="iframe" id="mySysAdmin" src=""></iframe>
            </div>
        </div>
    </div>
    
    <div class="subMenuButtonContainer '.$subMenuActive.'" style="opacity:0">
        <div class="closeSubMenuButtonContainer"><div class="closeSubMenu"><i class="fa-solid fa-square-caret-left"></i></div></div>                        
        <div class="menuSubButtonContainer">
            <div class="buttonContainer myHome myProject show">
                <div class="mainButton" title="New">
                    <span class="tagName">Construction</span>
                </div>
                <div class="subButtonContainer">
                    <div class="subButton" id="createNewProcess" rel="processProj" onclick="wizardOpenPage(this)" data-width="70">
                        <span class="parentTagName">New Process</span>
                    </div>
                    <div class="subButton" id="createBulkRegister" rel="bulkProj" onclick="wizardOpenPage(this)" data-width="70">
                        <span class="parentTagName">Bulk Register</span>
                    </div>
                    <div class="subButton" id="" rel="manageProj" onclick="wizardOpenPage(this)" data-width="55">
                        <span class="parentTagName">Manage Process</span>
                    </div>
                </div>
            </div>';
            if($flagAssetApp == true){
                echo'
                <div class="buttonContainer myHome myProject show">
                    <div class="mainButton" title="Asset">
                        <span class="tagName">Asset</span>
                    </div>
                    <div class="subButtonContainer">
                        <div class="subButton" id="createNewProcessAsset" rel="assetProj" onclick="wizardOpenPage(this)" data-width="70">
                            <span class="parentTagName">New Process</span>
                        </div>
                        <div class="subButton" id="createBulkAsset" rel="bulkProjAsset" onclick="wizardOpenPage(this)" data-width="70">
                            <span class="parentTagName">Bulk Export</span>
                        </div>
                        <div class="subButton" id="" rel="manageAssetProj" onclick="wizardOpenPage(this)" data-width="55">
                            <span class="parentTagName">Manage Process</span>
                        </div>
                    </div>
                </div>';
            }
            echo '
            <div class="buttonContainer myDashboard myDocument myFinance myTask myInsights" id = "constructionProcess">
                <div class="mainButton" title="New">
                    <span class="tagName">Construction</span>
                </div>
                <div class="subButtonContainer">
                    <div class="subButton" id="createNewProcess" rel="process" onclick="wizardOpenPage(this)" data-width="70">
                        <span class="parentTagName">New Process</span>
                    </div>
                    <div class="subButton" id="createBulkRegister" rel="bulk" onclick="wizardOpenPage(this)" data-width="70">
                        <span class="parentTagName">Bulk Register</span>
                    </div>
                    <div class="subButton" id="" rel="manage" onclick="wizardOpenPage(this)" data-width="55">
                        <span class="parentTagName">Manage Process</span>
                    </div>
                </div>
            </div>
            <div class="buttonContainer myDashboard myDocument myFinance myTask myInsights" id = "assetProcess">
                <div class="mainButton" title="New">
                    <span class="tagName">Asset</span>
                </div>
                <div class="subButtonContainer">
                    <div class="subButton" id="" rel="asset" onclick="wizardOpenPage(this)" data-width="70">
                        <span class="parentTagName">New Process</span>
                    </div>
                    <div class="subButton" id="" rel="manageAsset" onclick="wizardOpenPage(this)" data-width="55">
                        <span class="parentTagName">Manage Process</span>
                    </div>
                </div>
            </div>
            <div class="buttonContainer myDashboard">
                <div class="mainButton">
                    <span class="tagName">Dashboard</span>
                </div>
                <div class="subButtonContainer" id = "dashboardSideMenu">
                </div>
            </div>
            <div class="buttonContainer myDocument projInformation obyu">
                <div class="mainButton" title="Project">
                    <span class="tagName">Project</span>
                </div>
                <div class="subButtonContainer" id="projInfoSideMenu">
                </div>
            </div>
            <div class="buttonContainer myDocument document">
                <div class="mainButton" title="Document">
                    <span class="tagName">Document</span>
                </div>
                <div class="subButtonContainer" id="docSideMenu">
                </div>
            </div>
            <div class="buttonContainer myDocument corespondence">
                <div class="mainButton" title="Correspondence">
                    <span class="tagName">Correspondence</span>
                </div>
                <div class="subButtonContainer" id="corrSideMenu">
                </div>
            </div>
            <div class="buttonContainer myDocument setup">
                <div class="mainButton" title="Setup">
                    <span class="tagName">Setup</span>
                </div>
                <div class="subButtonContainer" id="setupSideMenu">
                </div>
            </div>
            <div class="buttonContainer elibrary document">
                <div class="mainButton" title="Document">
                    <span class="tagName">Document</span>
                </div>
                <div class="subButtonContainer" id="eLibDocSideMenu">
                </div>
            </div>
            <div class="buttonContainer projectInformation document">
                <div class="mainButton" title="Document">
                    <span class="tagName">Document</span>
                </div>
                <div class="subButtonContainer" id="projInfoDocSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance projectDetails">
                <div class="mainButton" title="Project Details">
                    <span class="tagName">Project Details</span>
                </div>
                <div class="subButtonContainer" id="projectDetailSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance budget">
                <div class="mainButton" title="Budget">
                    <span class="tagName">Budget</span>
                </div>
                <div class="subButtonContainer" id="budgetSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance contract">
                <div class="mainButton" title="Contract">
                    <span class="tagName">Contracts</span>
                </div>
                <div class="subButtonContainer" id="contractSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance claims">
                <div class="mainButton" title="'.$titleFInanceClaims.'">
                    <span class="tagName">'.$titleFInanceClaims.'</span>
                </div>
                <div class="subButtonContainer" id="claimSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance claimsPer">
                <div class="mainButton" title="Routine (HQ)">
                    <span class="tagName">Routine (HQ)</span>
                </div>
                <div class="subButtonContainer" id="claimPeriodicSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance claimsInventory">
                <div class="mainButton" title="Claim Asset Inventory">
                    <span class="tagName">Claim Asset Inventory</span>
                </div>
                <div class="subButtonContainer" id="claimInventorySideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance vo">
                <div class="mainButton" title="">
                    <span class="tagName"></span>
                </div>
                <div class="subButtonContainer" id="voSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance ammendment">
                <div class="mainButton" title="Contract Amendments">
                    <span class="tagName">Contract Amendments</span>
                </div>
                <div class="subButtonContainer" id="amendmentSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance eotSabah hide">
                <div class="mainButton" title="Approved Extension of Time">
                    <span class="tagName">Approved Extension of Time</span>
                </div>
                <div class="subButtonContainer" id="eotSabahSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance acs obyu">
                <div class="mainButton" title="Approved Adjustment to Contract Sum">
                    <span class="tagName">Approved Adjustment to Contract Sum</span>
                </div>
                <div class="subButtonContainer" id="acsSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance eot obyu">
                <div class="mainButton" title="Approved Extension of Time">
                    <span class="tagName">Approved Extension of Time</span>
                </div>
                <div class="subButtonContainer" id="eotSideMenu">
                </div>
            </div>';
            if($IS_DOWNSTREAM){
                echo '
                <div class="buttonContainer myFinance eotSSLR hide">
                    <div class="mainButton" title="Approved Extension of Time">
                        <span class="tagName">Approved Extension of Time</span>
                    </div>
                    <div class="subButtonContainer" id="eotSSLRSideMenu">
                    </div>
                </div>';
            }
            echo '
            <div class="buttonContainer myFinance lookup">
                <div class="mainButton" title="Look Up Values">
                    <span class="tagName">Look Up Values</span>
                </div>
                <div class="subButtonContainer" id="lookupSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance setup obyu">
                <div class="mainButton" title="Set Up">
                    <span class="tagName">Set Up</<span>
                </div>
                <div class="subButtonContainer" id="setUpFinanceSideMenu">
                </div>
            </div>
            <div class="buttonContainer myFinance cashoutflow obyu">
                <div class="mainButton" title="Cash Outflow">
                    <span class="tagName">Cash Outflow</<span>
                </div>
                <div class="subButtonContainer" id="cashOutflowSideMenu">
                </div>
            </div>
            <div class="buttonContainer myAdmin user">
                <div class="mainButton" title="Project Details">
                    <span class="tagName">Project Details</span>
                </div>
                <div class="subButtonContainer" id="editProjectSideMenu">
                </div>
            </div>
            <div class="buttonContainer myAdmin data">
                <div class="mainButton" title="Data Catalogue">
                    <span class="tagName">Data Catalogue</span>
                </div>
                <div class="subButtonContainer" id="userSideMenu">
                </div>
                <div class="subButtonContainer" id="dataSideMenu">
                </div>
            </div>
            <div class="buttonContainer myAdmin schedule">
                <div class="mainButton title="Schedule"">
                    <span class="tagName">Schedule</span>
                </div>
                <div class="subButtonContainer" id="scheduleSideMenu">
                </div>
            </div>
            <div class="buttonContainer myAdmin config">
                <div class="mainButton" title="Configuration">
                    <span class="tagName">Configuration</span>
                </div>
                <div class="subButtonContainer" id="configSideMenu">
                </div>
            </div>
            <div class="buttonContainer mySysAdmin sysUser">
                <div class="mainButton" title="User">
                    <span class="tagName">User</span>
                </div>
                <div class="subButtonContainer" id="sysUserSideMenu">'.$sysAdminUserHTML.'</div>
            </div>
            <div class="buttonContainer mySysAdmin sysProject">
                <div class="mainButton" title="Project">
                    <span class="tagName">Project</span>
                </div>
                <div class="subButtonContainer" id="sysProjectSideMenu">'.$sysAdminProjectHTML.'</div>
            </div>
            <div class="buttonContainer mySysAdmin sysProject">
                <div class="mainButton" title="Project">
                    <span class="tagName">System</span>
                </div>
                <div class="subButtonContainer" id="sysProjectSideMenu">'.$systemTabsHTML.'</div>
            </div>
        </div>
    </div>

    <div id="wizard" class="modal">
        <div class="modal-content">
            <span id="wizardClose" class ="closebuttonWizard" rel ="" onclick="wizardCancelPage()">&times;</span>
            <span id="wizardMaximize" class ="maximizebutton" rel =""><img src="../Images/icons/form/maximize.png"></span>
            <div class="modal-header"><a></a></div>

            <div class="modal-container processProj" rel="processProj">
                <div data-page="1" class="page projectList">
                    <div class="tableHeader wizard">
                        <span class="columnIndex"></span>
                        <span class="columnFirst">Project Name</span>
                        <span class="columnSecond">Last Update</span>
                        <div class="columnSecond">
                            <div class="searchContainer">
                                <input class="processSearch"  placeholder="Search Project" onkeyup="processSearchProject(this)"/>
                            </div>
                        </div>
                    </div>
                    <div class="tableBody">
                    '.$processPackageHTML.'
                    </div>
                </div>
                <div data-page="2" class="page projectProcess">
                    <div class="projectProcessSelect">
                        <div class="labelContainer"><span class="labelTitle labelWidth">Process List</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption" id="valueProceessConstruct1" onchange="processListOnchange(this)">
                            </select>
                        </div>
                    </div>

                    <div class="projectProcessSelect projectProcessCreate" style="display:none">
                        <div class="labelContainer"><span class="labelTitle">Create</span></div>
                        <div class="customCheckbox">
                            <label class="container">No Location
                                <input type="checkbox" class="noLocationProj" name="project" value="Coordless" onclick="selectOnlyThis(this)"><span class="checkmark" for="project"></span>
                            </label>
                            <label class="container">Point
                                <input type="checkbox" class="pointLocationProj" name="project" value="Point" onclick="selectOnlyThis(this)"><span class="checkmark" for="project"></span>
                            </label>
                            <label class="container">Polygon
                                <input type="checkbox" class="polygonLocationProj" name="project" value="Polygon" onclick="selectOnlyThis(this)"><span class="checkmark" for="project"></span>
                            </label>
                        </div>
                    </div>

                    <div class="projectProcessSelect projectProcessCreateLand" style="display:none">
                        <div class="labelContainer"><span class="labelTitle">Create</span></div>
                        <div class="customCheckbox">
                            <label class="container">Select From Lot Parcel
                                <input type="checkbox" class="lotParcel" name="land" value="Lot" onclick="selectOnlyThisLand(this)"><span class="checkmark" for="land"></span>
                            </label>
                            <label class="container">Manual Input
                                <input type="checkbox" class="manualInput" name="land" value="Manual" onclick="selectOnlyThisLand(this)"><span class="checkmark" for="land"></span>
                            </label>
                        </div>
                    </div>

                    <div class="projectProcessSelect projectProcessBumi" style="display: none">
                        <div class="labelContainer"><span class="labelTitle">Package List</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption packageListOption" id="packageSelection1" onchange="bumiPackageOnchange(this)">
                            </select>
                        </div>
                    </div>

                    <div class="projectProcessSelect flexRow processChainageInput" style="display:none">
                        <div class="inputContainer width"><span>Insert Chainage:</span></div>
                        <div class="inputContainer">
                            <form>
                                <input type="text" id="fname" class="inputForm" name="fname">
                            </form>
                        </div>
                    </div>

                    <div class="projectProcessContainer projectProcessMap" style="display:none">
                        <div class="RIwindowContainer">
                            <div class="RIwindowLabel"><span class="labelTitle">Location</span></div>
                            <div class="RILandContainer">
                                <div class="customOption">
                                    <select type="text" class="selectOption" id="layerOptionNewProcess" onchange="layerOnChangeNewProcess(this)">
                                    </select>
                                </div>
                            </div>
                            <div class="RIwindowViewer" id = "RIContainerProcessProj" style="width: 100%;height: calc(95% - 25px);"></div>
                        </div>
                        <div class="coordinateContainer">
                            <div class="coordinateLabel"><span class="labelTitle">Coordinate</span><button id="clearCoord">Clear Map</button></div>
                            <div class="coordinateValueContainer">
                                <div class="coordinateValueScroll" id="fromInsightCoord">
                                    LONGITUDE, LATITUDE: <span class="longLatVal"></span>
                                </div>
                            </div>
                            <div class="coordinateValueContainer">
                                <div class="coordinateValueScroll lotId" id="fromInsightCoord" style = "display:none">
                                    LOT: <span class="lotVal"></span>
                                </div>
                            </div>
                            <div class="coordinateValueContainer">
                                <div class="coordinateValueScroll structChain" id="fromInsightCoord" style = "display:none">
                                    STRUCTURE_: <span class="structureVal"></span> & CHAINAGE_: <span class="chainageVal"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div data-page="3" class="page process">
                    <iframe id = "jogetPageOustide" src="">
                    </iframe>
                </div>

                <div data-page="PSU" class="page progressSummary">
                    <div class="wizardContainer" id="dashboarduploaddiv">
                        <div class="contentContainer">';
                        if (file_exists($template_path)) {
                            echo ' 
                            <div id="progressUploadtemplateFileProj"';
                            if($_SESSION['user_org'] == 'KACC'){
                                echo ' class = "kacc"';
                            }
                            echo'>
                                <div>Template File : <a href="'.$template_path.'" target="_blank" style="color: var(--text-url)">Progress Summary - Template v1.0.xlsx</a></div>';
                                if($_SESSION['user_org'] == 'KACC'){
                                    echo '
                                    <div>
                                        <input type="checkbox" id="sectionCheckBoxOutside" name="section" value="1">
                                        <label for="sectionCheckBoxOutside"> For Section </label><br/>
                                        <div id="progressUploadSectionDivOutside">Section : 
                                            <select style="" id="progressUploadSectionOptionOutside"></select>
                                        </div>
                                    </div>';
                                }
                                echo'
                            </div>';
                        }
                        echo '<p>Upload excel files.</p>
                            <div class="progressFilecontainer">
                                <span aria-hidden="true" class="progressFileName"></span>
                                <div class="buttoncontainer">
                                    <button id="importExcelProgressReportOutside" name="import" class="btn-submit right"   style="display:none" onclick="importPSUstart(); return false;">Import</button>&nbsp;
                                    <button type="button" aria-label="Choose file" id="add-file-btn-dash-outside" onclick="addFileButtonProgress(event)">
                                        <span aria-hidden="true">Choose file</span> 
                                    </button>
                                    <input type="file" name="uploadExcelInputProgressOutside" id="uploadExcelInputProgressOutside" accept=".xls,.xlsx" style="display:none;">
                                </div>
                            </div>
                        </div>
                        <div';
                        if($_SESSION['user_org'] == 'KACC'){
                            echo ' class="tableContainer  kacc"';
                        }else{
                            echo ' class="tableContainer"';
                        }
                        echo' id = "dashboarditemOutside">
                            <div class="tableHeader summary fiveColumn">
                                <span class="M">Month/Year</span>
                                <span class="M">Financial Early Curve</span>
                                <span class="M">Financial Late Curve</span>
                                <span class="M">Physical Early Curve</span>
                                <span class="M">Physical Late Curve</span>
                            </div>
                            <div class="tableBody summary" id="excelTBodyOutside">
                            </div>
                        </div>
                    </div>
                </div>

                <div data-page="RU" class="page riskAnalysisUpload">
                    '.$rruHtmlOutside.'  
                </div>

                <div class="modal-footer">
                    <button class="backPage primary" data-process="" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary" data-process="" onclick="wizardNextPage(this)">Next</button>
                    <button class="cancelPage secondary" data-process="" onclick="wizardCancelPage(this)">Cancel</button>
                </div>
            </div>
        
            <div class="modal-container process" rel="process">
                <div data-page="1" class="page projectProcess">
                    <div class="projectProcessSelect">
                        <div class="labelContainer"><span class="labelTitle labelWidth">Process List</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption" id="valueProceessConstruct" onchange="processListOnchange(this)">
                            </select>
                        </div>
                    </div>

                    <div class="projectProcessSelect projectProcessCreate" style="display:none">
                        <div class="labelContainer"><span class="labelTitle">Create</span></div>
                        <div class="customCheckbox">
                            <label class="container">No Location
                                <input type="checkbox" class="noLocation" name="project" value="Coordless" onclick="selectOnlyThis(this)"><span class="checkmark" for="project"></span>
                            </label>
                            <label class="container">Point
                                <input type="checkbox" class="pointLocation" name="project" value="Point" onclick="selectOnlyThis(this)"><span class="checkmark" for="project"></span>
                            </label>
                            <label class="container">Polygon
                                <input type="checkbox" class="polygonLocation" name="project" value="Polygon" onclick="selectOnlyThis(this)"><span class="checkmark" for="project"></span>
                            </label>
                        </div>
                    </div>

                    <div class="projectProcessSelect projectProcessCreateLand" style="display:none">
                        <div class="labelContainer"><span class="labelTitle">Create</span></div>
                        <div class="customCheckbox">
                            <label class="container">Select From Lot Parcel
                                <input type="checkbox" class="lotParcel" name="land" value="Lot" onclick="selectOnlyThisLand(this)"><span class="checkmark" for="land"></span>
                            </label>
                            <label class="container">Manual Input
                                <input type="checkbox" class="manualInput" name="land" value="Manual" onclick="selectOnlyThisLand(this)"><span class="checkmark" for="land"></span>
                            </label>
                        </div>
                    </div>

                    <div class="projectProcessSelect projectProcessBumi" style="display: none">
                        <div class="labelContainer"><span class="labelTitle">Package List</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption packageListOption" id="packageSelection2" onchange="bumiPackageOnchange(this)">
                            </select>
                        </div>
                    </div>

                    <div class="projectProcessSelect flexRow processChainageInput" style="display:none">
                        <div class="inputContainer width"><span>Insert Chainage:</span></div>
                        <div class="inputContainer">
                            <form>
                                <input type="text" id="fname" class="inputForm" name="fname">
                            </form>
                        </div>
                    </div>

                    <div class="projectProcessContainer projectProcessMap" style="display:none">
                        <div class="RIwindowContainer">
                            <div class="RIwindowLabel"><span class="labelTitle">Location</span></div>
                            <div class="RILandContainer">
                                <div class="customOption">
                                    <select type="text" class="selectOption" id="layerOptionNewProcess1" onchange="layerOnChangeNewProcess(this)">
                                    </select>
                                </div>
                            </div>
                            <div class="RIwindowViewer" id = "RIContainerProcess"></div>
                        </div>
                        <div class="coordinateContainer">
                            <div class="coordinateLabel"><span class="labelTitle">Coordinate</span><button id="clearCoords">Clear Map</button></div>
                            <div class="coordinateValueContainer">
                                <div class="coordinateValueScroll" id="fromInsightCoord">
                                    LONGITUDE, LATITUDE: <span class="longLatVal"></span>
                                </div>
                            </div>
                            <div class="coordinateValueContainer">
                                <div class="coordinateValueScroll lotId" id="fromInsightCoord" style = "display:none">
                                    LOT: <span class="lotVal"></span>
                                </div>
                            </div>
                            <div class="coordinateValueContainer">
                                <div class="coordinateValueScroll structChain" id="fromInsightCoord" style = "display:none">
                                    <span class="white-space">STRUCTURE_: </span><span class="structureVal overflow-x"></span><span class="white-space">   & CHAINAGE_: </span><span class="chainageVal overflow-x"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-page="2" class="page process">
                    <iframe id = "jogetPage" src="">
                    </iframe>
                </div>
                <div data-page="PSU" class="page progressSummary">
                    <div class="wizardContainer" id="dashboarduploaddiv">
                        <div class="contentContainer">';
                        if (file_exists($template_path)) {
                            echo ' 
                            <div id="progressUploadtemplateFile"';
                            if($_SESSION['user_org'] == 'KACC'){
                                echo ' class = "kacc"';
                            }
                            echo'>
                                <div>Template File : <a href="'.$template_path.'" target="_blank" style="color: var(--text-url)">Progress Summary - Template v1.0.xlsx</a></div>';
                                if($_SESSION['user_org'] == 'KACC'){
                                    echo '
                                    <div>
                                        <input type="checkbox" id="sectionCheckBoxInside" name="section" value="1">
                                        <label for="sectionCheckBoxInside"> For Section </label><br/>
                                        <div id="progressUploadSectionDivInside">Section : 
                                            <select style="" id="progressUploadSectionOptionInside"></select>
                                        </div>
                                    </div>';
                                }
                                echo'
                            </div>';
                        }
                        echo '<p>Upload excel files.</p>
                            <div class="progressFilecontainer">
                                <span aria-hidden="true" class="progressFileName"></span>
                                <div class="buttoncontainer">
                                    <button id="importExcelProgressReportInside" name="import" class="btn-submit right"   style="display:none" onclick="importPSUstart(); return false;">Import</button>&nbsp;
                                    <button type="button" aria-label="Choose file" id="add-file-btn-dash-inside" onclick="addFileButtonProgress(event)">
                                        <span aria-hidden="true">Choose file</span> 
                                    </button>
                                    <input type="file" name="uploadExcelInputProgressInside" id="uploadExcelInputProgressInside" accept=".xls,.xlsx" style="display:none;">
                                </div>
                            </div>
                        </div>
                        <div';
                        if($_SESSION['user_org'] == 'KACC'){
                            echo ' class="tableContainer  kacc"';
                        }else{
                            echo ' class="tableContainer"';
                        }
                        echo' id = "dashboarditemInside">
                            <div class="tableHeader summary fiveColumn">
                                <span class="M">Month/Year</span>
                                <span class="M">Financial Early Curve</span>
                                <span class="M">Financial Late Curve</span>
                                <span class="M">Physical Early Curve</span>
                                <span class="M">Physical Late Curve</span>
                            </div>
                            <div class="tableBody summary" id="excelTBodyInside">
                            </div>
                        </div>
                    </div>
                </div>
                <div data-page="RRU" class="page riskAnalysisUpload">
                '.$rruHtmlInsight.'
                </div>
                <div class="modal-footer">
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary" onclick="wizardNextPage(this)">Next</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage(this)">Cancel</button>
                </div>
            </div>

            <div class="modal-container bulkProj" rel="bulkProj">
                <div data-page="1" class="page projectList">
                    <div class="tableHeader wizard">
                        <span class="columnIndex"></span>
                        <span class="columnFirst">Project Name</span>
                        <span class="columnSecond">Last Update</span>
                        <div class="columnSecond">
                            <div class="searchContainer">
                                <input  class="processSearch"  placeholder="Search Project"  onkeyup="processSearchProject(this)"/>
                            </div>
                        </div>
                    </div>
                    <div class="tableBody">
                    '.$processPackageBulkHTML.'
                    </div>
                </div>
                <div data-page="2" class="page projectProcess">
                    <div class="projectProcessSelect bulkProcessSelect">
                        <div class="labelContainer"><span class="labelTitle labelWidth">Bulk Type</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption" id="typebulkProj" data-page="bulkProj" onchange="bulkTypeOnchangeBulkType(this, this.value)">
                                <option value="default" selected>Please Select...</option>
                                <option value="bulkImport">Bulk Import</option>';
                                if($SYSTEM == 'OBYU'){
                                    if($_SESSION['user_org'] != 'UTSB'){
                                        echo '<option value="bulkExport">Bulk Export</option>';
                                    }else{
                                        '';
                                    }
                                }else{
                                    echo '<option value="bulkExport">Bulk Export</option>';
                                }
                                echo
                                '
                            </select>
                        </div>
                    </div>
                    <div class="projectProcessSelect bulkProcess" style="display:none">
                        <div class="labelContainer"><span class="labelTitle">Process List</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption" data-page="bulkProj" id="processNamebulkProj" onchange="processListOnchangeBulk(this, this.value)">
                            </select>
                        </div>
                    </div>
                    <div class="projectProcessSelect buttonConfig import" style="display:none">
                        <button class="circle config" title="Bulk Config" data-page="bulkProj" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-gear"></i></button>
                        <button class="circle import" title="Bulk Import Form" data-page="bulkProj" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-file-import"></i></button>
                    </div>
                    <div class="projectProcessContainer bulkImportContainer" id="ImportIframeDivbulkProj" style="display:none">
                        <iframe id="importContentIframebulkProj" src=""></iframe>
                    </div>
                </div>
                <div data-page="3" class="page projectProcess">
                    <div class="projectProcessSelect buttonConfig export">
                        <button class="circle download" title="Bulk Download" data-page="bulkProj" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-download"></i></button>
                        <button class="circle datalist" title="Bulk Export Datalist" data-page="bulkProj" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-list-ul"></i></button>
                    </div>
                    <iframe id ="exportContentIframebulkProj" src="" class="projectProcessBulkJoget">
                    </iframe>
                </div>
                <div class="modal-footer">
                    <button class="savePage primary" data-page="bulkProj" onclick="saveImportConfig(this)" style="display: none">Save Template</button>
                    <button class="downloadPage primary" target="_blank" onclick="../Templates/Document_Template.xlsx" download="" style="display: none">Download Template</button>
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary" onclick="wizardNextPage(this)">Next</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage()">Cancel</button>
                </div>
            </div>

            <div class="modal-container bulk" rel="bulk">
                <div data-page="1" class="page projectProcess">
                    <div class="projectProcessSelect bulkProcessSelect">
                    <div class="labelContainer"><span class="labelTitle labelWidth">Bulk Type</span><span class="projectLabelName projectName projectPackageName"></span></div>
                    <div class="customOption">
                        <select type="text" class="selectOption processListOption" id="typebulk" data-page="bulk" onchange="bulkTypeOnchangeBulkType(this, this.value)">
                            <option value="default" selected>Please Select...</option>
                            <option value="bulkImport">Bulk Import</option>';
                            if($SYSTEM == 'OBYU'){
                                if($_SESSION['user_org'] != 'UTSB'){
                                echo '<option value="bulkExport">Bulk Export</option>';
                                }else{
                                '';
                                }
                            }else{
                                echo '<option value="bulkExport">Bulk Export</option>';
                            }
                            echo'
                        </select>
                    </div>
                    </div>
                    <div class="projectProcessSelect bulkProcess" style="display:none">
                        <div class="labelContainer"><span class="labelTitle">Process List</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption" data-page="bulk" id="processNamebulk" onchange="processListOnchangeBulk(this, this.value)">
                                <option value="default" selected>Please Select..</option>
                            </select>
                        </div>
                    </div>
                    <div class="projectProcessSelect buttonConfig" style="display:none">
                        <button class="circle config" title="Bulk Config" data-page="bulk" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-gear"></i></button>
                        <button class="circle import" title="Bulk Import Form" data-page="bulk" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-file-check"></i></button>
                    </div>
                    <div class="projectProcessContainer bulkImportContainer" id="ImportIframeDivbulk" style="display:none">
                        <iframe id="importContentIframebulk" src=""></iframe>
                    </div>
                </div>
                <div data-page="2" class="page projectProcess">
                    <div class="projectProcessSelect buttonConfig export">
                        <button class="circle download" title="Bulk Download" data-page="bulk" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-download"></i></button>
                        <button class="circle datalist" title="Bulk Export Datalist" data-page="bulk" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-list-ul"></i></button>
                    </div>
                    <iframe id ="exportContentIframebulk" src="" class="projectProcessBulkJoget">
                    </iframe>
                </div>
                <div class="modal-footer">
                    <button class="savePage primary" data-page="bulk" onclick="saveImportConfig(this)" style="display: none">Save Template</button>
                    <button class="downloadPage primary" target="_blank" onclick="../Templates/Document_Template.xlsx" download="" style="display: none">Download Template</button>
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary" onclick="wizardNextPage(this)">Next</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage()">Cancel</button>
                </div>
            </div>

            <div class="modal-container bulkProjAsset" rel="bulkProjAsset">
                <div data-page="1" class="page projectList">
                    <div class="tableHeader wizard">
                        <span class="columnIndex"></span>
                        <span class="columnFirst">Project Name</span>
                        <span class="columnSecond">Last Update</span>
                        <div class="columnSecond">
                            <div class="searchContainer">
                                <input class="projectSearchInput"  placeholder="Search Project" onkeyup="processSearchProject(this)"/>
                            </div>
                        </div>
                    </div>
                    <div class="tableBody">
                    '.$assetProcessPackageBulkHTML.'
                    </div>
                </div>
                <div data-page="2" class="page projectProcess">
                    <div class="projectProcessSelect">
                        <div class="labelContainer">
                            <span class="labelTitle labelWidth">Process Type</span>
                            <span class="projectLabelName projectName projectPackageName"></span>
                        </div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOptionBulk1" id="assetProcesssBulkProj" onchange="processListOnchangeAssetBulkProj(this)" data-currentTier="1" data-modal="bulkProjAsset">
                            </select>
                        </div>
                    </div>
                    <div class="projectProcessSelect processAsset2" style="display:none">
                        <div class="labelContainer"><span class="labelTitle second">Subprocess Type</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOptionBulk2" id="assetProcesssBulkProj1" onchange="processListOnchangeAssetBulkProj(this)" data-currentTier="2" data-modal="bulkProjAsset">
                            </select>
                        </div>
                    </div>
                </div>
                <div data-page="3" class="page projectProcess">
                    <div class="projectProcessSelect buttonConfig export">
                        <button class="circle download" title="Bulk Download" data-page="bulkProj" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-download"></i></button>
                        <button class="circle datalist" title="Bulk Export Datalist" data-page="bulkProj" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-list-ul"></i></button>
                    </div>
                    <iframe id ="exportContentIframebulkAssetProj" src="" class="projectProcessBulkJoget">
                    </iframe>
                </div>
                <div class="modal-footer">
                    <button class="savePage primary" data-page="bulkProj" onclick="saveImportConfig(this)" style="display: none">Save Template</button>
                    <button class="downloadPage primary" target="_blank" onclick="../Templates/Document_Template.xlsx" download="" style="display: none">Download Template</button>
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary" onclick="wizardNextPage(this)">Next</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage()">Cancel</button>
                </div>
            </div>

            <div class="modal-container bulkAsset" rel="bulkAsset">
                <div data-page="1" class="page projectProcess">
                    <div class="projectProcessSelect">
                        <div class="labelContainer">
                            <span class="labelTitle labelWidth">Process Type</span>
                            <span class="projectLabelName projectName projectPackageName"></span>
                        </div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOptionBulk1" id="assetProcesssBulk1" onchange="processListOnchangeAssetBulk(this)" data-currentTier="1" data-modal="bulkAsset">
                            </select>
                        </div>
                    </div>
                    <div class="projectProcessSelect processAssetBulk2" style="display:none">
                        <div class="labelContainer"><span class="labelTitle second">Subprocess Type</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOptionBulk2" id="assetProcesssBulk2" onchange="processListOnchangeAssetBulk(this)" data-currentTier="2" data-modal="bulkAsset">
                            </select>
                        </div>
                    </div>
                </div>
                <div data-page="2" class="page projectProcess">
                    <div class="projectProcessSelect buttonConfig export">
                        <button class="circle download" title="Bulk Download" data-page="bulk" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-download"></i></button>
                        <button class="circle datalist" title="Bulk Export Datalist" data-page="bulk" onclick="onClickBulkConfig(this)"><i class="fa-solid fa-list-ul"></i></button>
                    </div>
                    <iframe id ="exportContentIframebulkAsset" src="" class="projectProcessBulkJoget">
                    </iframe>
                </div>
                <div class="modal-footer">
                    <button class="savePage primary" data-page="bulk" onclick="saveImportConfig(this)" style="display: none">Save Template</button>
                    <button class="downloadPage primary" target="_blank" onclick="../Templates/Document_Template.xlsx" download="" style="display: none">Download Template</button>
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary" onclick="wizardNextPage(this)">Next</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage()">Cancel</button>
                </div>
            </div>

            <div class="modal-container assetProj" rel="assetProj">
                <div data-page="1" class="page projectList">
                    <div class="tableHeader wizard">
                        <span class="columnIndex"></span>
                        <span class="columnFirst">Project Name</span>
                        <span class="columnSecond">Last Update</span>
                        <div class="columnSecond">
                            <div class="searchContainer">
                                <input class="processSearch" placeholder="Search Project" onkeyup="processSearchProject(this)"/>
                            </div>
                        </div>
                    </div>
                    <div class="tableBody">
                    '.$assetProcessPackageHTML.'
                    </div>
                </div>
                <div data-page="2" class="page projectProcess">
                    <div class="projectProcessSelect">
                    <div class="labelContainer"><span class="labelTitle labelWidth">Process Type</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption1" id="processAsset1" onchange="processListOnchangeAsset(this)" data-currentTier="1" data-modal="assetProj">
                            </select>
                        </div>
                    </div>
                    <div class="projectProcessSelect processAsset2" style="display:none">
                        <div class="labelContainer"><span class="labelTitle second">Subprocess Type</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption2" id="processAsset2" onchange="processListOnchangeAsset(this)" data-currentTier="2" data-modal="assetProj">
                                <option value="default">Please Choose</option>
                                <option value="test" data-nextprocess="3">Tier 3</option>
                                <option value="test" data-nextprocess="next">Next</option>
                            </select>
                        </div>
                    </div>
                    <div class="projectProcessSelect processAsset3" style="display:none">
                        <div class="labelContainer"><span class="labelTitle third">Asset Type</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption3" id="processAsset3" onchange="processListOnchangeAsset(this)" data-currentTier="3" data-modal="assetProj">
                                <option value="default">Please Choose</option>
                                <option value="test" data-nextprocess="next">Last tier</option>
                                <option value="test" data-nextprocess="next">Last tier</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div data-page="3" class="page process">
                    <iframe id="assetPage" src="">
                    </iframe>
                </div>
                <div class="modal-footer">
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary" onclick="wizardNextPage(this)">Next</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage(this)">Cancel</button>
                </div>
            </div>

            <div class="modal-container asset" rel="asset">
                <div data-page="1" class="page projectProcess">
                    <div class="projectProcessSelect">
                    <div class="labelContainer"><span class="labelTitle labelWidth">Process Type</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption1" id="processTypeAsset1" onchange="processListOnchangeAsset(this)" data-currentTier="1" data-modal="asset">
                            </select>
                        </div>
                    </div>
                    <div class="projectProcessSelect processAsset2" style="display:none">
                        <div class="labelContainer"><span class="labelTitle second">Subprocess Type</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption2" id="processTypeAsset2" onchange="processListOnchangeAsset(this)" data-currentTier="2" data-modal="asset">
                            </select>
                        </div>
                    </div>
                    <div class="projectProcessSelect processAsset3" style="display:none">
                        <div class="labelContainer"><span class="labelTitle third">Asset Type</span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption processListOption3" id="processTypeAsset3" onchange="processListOnchangeAsset(this)" data-currentTier="3" data-modal="asset">
                            </select>
                        </div>
                    </div>
                </div>
                <div data-page="2" class="page process">
                    <iframe id="assetPage" src="">
                    </iframe>
                </div>
                <div class="modal-footer">
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary" onclick="wizardNextPage(this)">Next</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage(this)">Cancel</button>
                </div>
            </div>

            <div class="modal-container manage" rel="manage">
                <div class="page projectList">
                    <div class="tableHeader wizard">
                        <span class="columnIndex"></span>
                        <span class="columnFirst">Project Name</span>
                        <span class="columnSecond">Last Update</span>
                        <div class="columnSecond">
                            <div class="searchContainer">
                                <input class="manageSearch"  placeholder="Search Project" onkeyup="processSearchProject(this)"/>
                            </div>
                        </div>
                    </div>
                    <div class="tableBody">
                    '.$processPackageHTML.'
                    </div>
                </div>
                <div data-page="1" class="page projectProcess">
                    <div class="projectProcessSelect">
                    <div class="labelContainer"><span class="labelTitle labelWidth">Manage Process</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption manageListOption" id="valueManageConstruct" onchange="manageListOnchange(this)">
                            </select>
                        </div>
                    </div>
                    <div class="bottomContainer handleManageProcess">
                        <div class="riContainer RIwindowViewer" id="RIContainerManageProj1"></div>
                        <iframe class="bottom" id = "manageIframe" src=""></iframe>
                    </div>
                </div>
            </div>

            <div class="modal-container manageProj" rel="manageProj">
                <div data-page="1" class="page projectList">
                    <div class="tableHeader wizard">
                        <span class="columnIndex"></span>
                        <span class="columnFirst">Project Name</span>
                        <span class="columnSecond">Last Update</span>
                        <div class="columnSecond">
                            <div class="searchContainer">
                                <input class="manageSearch" placeholder="Search Project" onkeyup="processSearchProject(this)"/>
                            </div>
                        </div>
                    </div>
                    <div class="tableBody">
                    '.$processPackageHTML.'
                    </div>
                </div>
                <div data-page="2" class="page projectProcess">
                    <div class="projectProcessSelect">
                    <div class="labelContainer"><span class="labelTitle labelWidth">Manage Process</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption manageListOption" id="valueManageConstruct1" onchange="manageListOnchange(this)">
                            </select>
                        </div>
                    </div>
                    <div class="bottomContainer handleManageProcess">
                        <div class="riContainer RIwindowViewer" id="RIContainerManageProj"></div>
                        <iframe class="bottom" id = "manageIframe" src=""></iframe>
                    </div>
                </div>
            </div>

            <div class="modal-container profile" id="profileUserViewID">
                <div class="infoContent">
                    <div class="infoContainerHeaderBody">
                        <div class="infoHeader-profile" id="wallpaperPic" style="background-image: url('.$userProfileHeader.')">
                            <label for="imgWallpaper" class="picEdit wallpaper-edit">
                                <img src="../Images/icons/ri_v3/pencil.png">
                            </label>
                            <input type="file" id="imgWallpaper" name="imgWallpaper" accept=".png, .jpeg, .jpg" hidden="true">
                            <label for="imgProfile" class="infoPicture">
                                <div class="infoProfilePic"><img id="profilePic" src="'.$userProfileImg.'"></div>
                                <div class="infoContent"><img src="../Images/icons/third_button/camera.png"></div>
                            </label>
                            <input type="file" id="imgProfile" name="imgProfile" accept=".png, .jpeg, .jpg" hidden="true">
                        </div>
                        <div class="infoHeader-readonly"><h3 id = "h3_fullname_profileuser">Name</h3><h4 id="h4_role">'.$postLoginRole.'</h4></div>
                    </div>
                    <div class="infoContainerMainBody">
                        <div class="infoContainerBody-edit">';
                            if($SYSTEM == 'KKR'){
                                echo'
                                <div class="idcontainer">
                                    <label>User ID</label>
                                    <br>
                                    <input class="newid" type="text" id="newIDprofile" readonly onfocus="this.blur" style="background-color: lightgrey; outline:none; cursor: not-allowed">
                                </div>';
                            }
                            echo'
                            <div class="doubleinput marginBottom">
                                <div class="column1">
                                    <span class="labelTitle">First Name</span>
                                    <br>
                                    <input type="text" required id="firstnameprofile" name="firstnameprofile"  pattern="[A-Za-z]\S.*" autocomplete="off"> </div>
                                <div class="column2">
                                    <span class="labelTitle">Last Name</span>
                                    <br>
                                    <input type="text" required id="lastnameprofile" name="lastnameprofile"  pattern="[A-Za-z]\S.*" autocomplete="off"> </div>
                            </div>';
                            if($IS_DOWNSTREAM){
                                echo '
                                    <span class="labelTitle">Designation</span>
                                    <br>
                                    <input type="text" id="designationprofile" name="designationprofile" required="" placeholder="Enter your designation">';
                            }
                            echo '
                            <input style="display: none" type="text" id="designationprofile" name="designationprofile" required="" placeholder="Enter your designation">
                            <br>
                            <span class="labelTitle">Country</span>
                            <br>
                            <select type="text" id="countryprofile" class="marginBottom" name="countryprofile">';
                                foreach ($countryOptionArr as $country) {
                                    echo '<option value="'.$country.'">'.$country.'</option>';
                                }
                            echo '
                            </select>
                            <br>
                            <label class="required">Mobile Phone No.</label>
                            <br>
                            <input type="text" id="phonenumberprofile" name="phonenumber" required="" placeholder="0123456789">
                            <br>
                            <div class="customCheckbox marginTop">
                                <label class="container resetcheck labelTitle">Change Password?
                                    <input type="checkbox" class="resetcheck" id="checkresetlabelprofile" name="password" value="default" onclick="selectLoginThis(this)"><span class="checkmark" for="password"></span>
                                </label>
                            </div>
                            <div class="resetpasswordcontainer" style="display: none;">
                                <label class="required labelTitle">Password</label>
                                <br>
                                <input onkeyup="onkeyupPassword(this)" data-currentkeyup="profile" placeholder="Enter your password here" required type="password" id="userPasswordprofile" name="userPasswordprofile" pattern=".{5,}" autocomplete="new-password">
                                <div class="password-showhide">
                                    <button type="button" class="password-show profile" rel="userPasswordprofile" data-confirm="profile"><img title="Show Password" src="../Images/icons/gen_button/visibility.png" alt=""></button>
                                    <button type="button" style="display:none" class="password-hide profile" rel="userPasswordprofile" data-confirm="profile"><img title="Hide Password" src="../Images/icons/gen_button/hide.png" alt=""></button>
                                </div>
                                <div class="passindicator profile" style= "width: 100%">
                                    <div id="passwordstrengthContainerprofile">
                                        <div id="passwordstrengthprofile"></div>
                                    </div>
                                    <span id="passwordstrengthTextprofile"></span>
                                </div>
                                <label class="required labelTitle">Confirm Password</label>
                                <br>
                                <input type="password" id="userConfirmPasswordprofile" name="userConfirmPasswordprofile" autocomplete="new-password">
                                <div class="confirm-password-showhide">
                                    <button type="button" class="password-show-confirm profile" rel="userConfirmPasswordprofile" data-confirm="profile"><img title="Show Password" src="../Images/icons/gen_button/visibility.png" alt=""></button>
                                    <button type="button" style="display:none" class="password-hide-confirm profile" rel="userConfirmPasswordprofile" data-confirm="profile"><img title="Hide Password" src="../Images/icons/gen_button/hide.png" alt=""></button>
                                </div>
                            </div>
                            <div class="customCheckbox">
                                <label class="container resetcheck labelTitle">Change Bentley Credentials?
                                    <input type="checkbox" class="resetcheck" id="checkresetbentleycredentials" name="bentley" value="default" onclick="selectLoginThis(this)"><span class="checkmark" for="bentley"></span>
                                </label>
                            </div>
                            <div class="resetbentleycredscontainer" style="display: none;">
                                <label class = "required labelTitle">Username</label>
                                <br>
                                <input placeholder = "Enter your username here" require = "required" id="newbentleyusernameprofile" name = "newbentleyusernameprofile">
                                <label class="required labelTitle">Password</label>
                                <br>
                                <input placeholder="Enter your password here" require="required"  type="password" id="newbentleypasswordprofile" name="newbentleypasswordprofile" >
                            </div>
                        </div>
                        <div class="infoContainerBody-readonly">
                            <div class="readOnlyContainer"><i class="fa-solid fa-user"></i><span title ="Name" id="img_fullname">Name</span></div>
                            <div class="readOnlyContainer"><i class="fa-solid fa-envelope"></i><span title ="Email" id="img_email">Email</span></div>';
                            if($IS_DOWNSTREAM){
                                echo '<div class="readOnlyContainer"><i class="fa-solid fa-briefcase"></i><span title ="Designation" id="img_designation"></span></div>';
                                }
                            echo '    
                            <div class="readOnlyContainer"><i class="fa-solid fa-phone"></i><span title ="Phone Number" id="img_mobileno">0123456789</span></div>
                            <div class="readOnlyContainer"><i class="fa-solid fa-sitemap"></i><span title ="Organization" id="img_org" title ="Organization">Company</span></div>
                            <div class="readOnlyContainer"><i class="fa-solid fa-earth-asia"></i></i><span title ="Country" id="img_country">Country</span></div>
                        </div>
                        <div id="jogetSignature" class="formView1">
                            <div class="formContent1">
                                <div class="formcontainerMainBody1">
                                    <iframe id="signatureForm" style="width: 100%; height: 100%; border:none;"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer profileuserFooter">
                    <div class="editPage">
                        <button class="primary" id="postlogin-profileuserSave">Save</button>
                        <button class="secondary" id="profileuserCancel">Cancel</button>
                    </div>
                    <div class="readonly">
                        '.$assetSignatureHTML.'
                        <button class="primary" id="profileuserEdit">Edit</button>
                        <button class="secondary" id="profileuserClose" onclick="wizardCancelPage(this)">Close</button>
                    </div>
                </div>
            </div>

            <div class="modal-container myTask">
                <div data-page="1" class="page">
                    <iframe class="" id="myTask" src=""></iframe>
                </div>
            </div>

            <div class="modal-container myTaskList">
                <div class="tableContainer">
                    <div class="tableHeader sortHandler">
                        <span class="columnIndex"></span>
                        <span class="columnFirst">Reference No.
                            <button type="button" class="control unset" data-sort="mytaskall-refno:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="mytaskall-refno:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="mytaskall-refno:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnFirst">Project
                            <button type="button" class="control unset" data-sort="mytaskall-project:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="mytaskall-project:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="mytaskall-project:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnSecond">Modified
                            <button id="myTaskModifiedAscAll" type="button" class="control unset" data-sort="mytaskall-modifieddate:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="mytaskall-modifieddate:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="mytaskall-modifieddate:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnSecond">Pending Task
                            <button type="button" class="control unset" data-sort="mytaskall-pending:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="mytaskall-pending:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="mytaskall-pending:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span> 
                    </div>
                    <div class="tableBody myTaskAll '.$myTaskClassHeight.'" id="sortTaskAll">
                        <div class="loadingRowContainer" style="display:block;">
                            <div class="row loadingRow">
                                <div class="timeline-item-row">
                                    <div class="animated-background-row">
                                        <div class="background-masker header-top"></div>
                                        <div class="background-masker header-left"></div>
                                        <div class="background-masker header-right"></div>
                                        <div class="background-masker header-bottom"></div>
                                        <div class="background-masker subheader-left"></div>
                                        <div class="background-masker subheader-right"></div>
                                        <div class="background-masker subheader-bottom"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row loadingRow">
                                <div class="timeline-item-row">
                                    <div class="animated-background-row">
                                        <div class="background-masker header-top"></div>
                                        <div class="background-masker header-left"></div>
                                        <div class="background-masker header-right"></div>
                                        <div class="background-masker header-bottom"></div>
                                        <div class="background-masker subheader-left"></div>
                                        <div class="background-masker subheader-right"></div>
                                        <div class="background-masker subheader-bottom"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row loadingRow">
                                <div class="timeline-item-row">
                                    <div class="animated-background-row">
                                        <div class="background-masker header-top"></div>
                                        <div class="background-masker header-left"></div>
                                        <div class="background-masker header-right"></div>
                                        <div class="background-masker header-bottom"></div>
                                        <div class="background-masker subheader-left"></div>
                                        <div class="background-masker subheader-right"></div>
                                        <div class="background-masker subheader-bottom"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-container insight">
                <div class="page reviewPage" id="reviewTool">
                    <div class="modal-buttonContainer">
                        <div class="columnLeft">
                            <div id = "textReview" class="flexColumn" style = "display:none">
                                <label for"reviewToolText">Text</label>
                                <input type="text" id="reviewToolText" placeholder="Input Text Here"/>
                            </div>
                            <div id = "sizeReview" class="flexColumn">
                                <input type="number" id="reviewToolFontSizeInput" value="30" min="1" max="60"/>
                                <input type="range" id="reviewToolFontSize" value="30" min="1" max="60"/>
                            </div>
                            <div id = "colourReview" class="flexColumn">
                                <div class="color-picker-div" ><input id="reviewTool-color-picker" value="" /></div>
                            </div>
                        </div>
                        <div>
                            <button class="button-ok review active" id= "reviewdraw" onclick="reviewToolSwitchMode(\'draw\')" title="Draw"><i class="fa-solid fa-paintbrush"></i></button>
                            <button class="button-ok review" id= "reviewerase" onclick="reviewToolSwitchMode(\'erase\')" title="Erase"><i class="fa-solid fa-eraser"></i></button>
                            <button class="button-ok review" id= "reviewtext" onclick="reviewToolSwitchMode(\'text\')" title="Text"><i class="fa-solid fa-font"></i></button>
                        </div>
                    </div>
                    <div class="reviewContainer" id="reviewContainerID" style="position: relative;">
                        <canvas id="reviewCanvasImgBase" style="position: absolute; left: 0; top: 0; z-index: 0; image-rendering: pixelated; width: 100%; height: 100%;"></canvas>
                        <canvas id="reviewCanvasImgTop" style="position: absolute; left: 0; top: 0; z-index: 1; image-rendering: pixelated; width: 100%; height: 100%;"></canvas>
                    </div>
                    <div class="modal-footer">
                        <button rel="insight" id="reviewcanvas" title="Register" class="form primary" onclick="wizardOpenPage(this)" data-width="55" data-page="openJogetForm">Save</button>
                    </div>
                </div>

                <div class="page earthView">
                    <div id = "viewer">
                    </div>
                </div>

                <div class="page aicPage">
                    <div class="aic_popup" id="aicpage">';
                        if($SYSTEM == 'KKR'){
                            echo'
                            <div class="itemsContainer" id="itemsContainer">
                                <div class="fieldcontainer">
                                    <div class="column1">
                                        <span>Project: </span>
                                    </div>
                                    <div class="column1">
                                        <span>Package:</span>
                                    </div>
                                </div>
                                <div class="fieldcontainer marginBottom">
                                    <div class="column1">
                                        <strong><span id="aicProjectName"></span></strong><br>
                                        Image Captured Date: <strong><span id="projectImageCaptureDate"></strong></span>
                                    </div>
                                    <div class="column1">
                                        <strong><span id="aicPackageName"></span></strong><br>
                                        Image Captured Date: <strong><span id="packageImageCaptureDate"></strong></span>
                                    </div>
                                </div>
                            </div>
                            <div class="openLayerContainer" id="openLayerContainer">
                                <div class="olWrapper" id="aicSelection">
                                    <div class="olMapHalf">
                                        <div id="beforeMap" class="olMap"></div>
                                    </div>
                                    <div class="olMapHalf">
                                        <div id="afterMap" class="olMap"></div>
                                    </div>
                                </div>
                            </div>';
                        }else{
                            echo'
                            <div class="itemsContainer" id="itemsContainer">
                                <div class="fieldcontainer">
                                    <div class="column1">
                                        <span>Project: </span>
                                    </div>
                                    <div class="column1">
                                        <span>Package:</span>
                                    </div>
                                </div>
                                <div class="fieldcontainer marginBottom">
                                    <div class="column1">
                                        <strong><span id="aicProjectName"></span></strong><br>
                                        Image Captured Date: <strong><span id="projectImageCaptureDate"></strong></span>
                                    </div>
                                    <div class="column1">
                                        <strong><span id="aicPackageName"></span></strong><br>
                                        Image Captured Date: <strong><span id="packageImageCaptureDate"></strong></span>
                                    </div>
                                </div>
                            </div>
                            <figure class="cd-image-container">
                                <img src="../Images/image2.png" alt="Original Image">
                                <span class="cd-image-label" data-type="original">Original</span>

                                <div class="cd-resize-img"> <!-- the resizable image on top -->
                                    <img src="../Images/image3.png" alt="Modified Image">
                                    <span class="cd-image-label" data-type="modified">Modified</span>
                                </div>

                                <span class="cd-handle"></span>
                            </figure> <!-- cd-image-container -->';
                        }
                        echo'
                    </div>
                </div>

                <div class="page aicEditPage">
                    <div class="tableHeader wizard">
                        <span class="columnIndex"></span>
                        <span class="columnFirst">Image Capture Date</span>
                        <span class="columnSecond">FileName</span>
                        <span class="columnThird">Upload Date</span>
                    </div>
                    <div class="tableBody" id="aicEditList">
                        <div id="aerialEditContainer">
                        </div>
                    </div>
                </div>
                
                <div class="page viPage">
                    <div id="videoframe">
                        <div class="vi_popup" id="videoContainer" style="height: 100%; width: 100%; padding: 0px 0px;"></div>
                    </div>
                </div>

                <div class="page openJogetForm">
                    <iframe class="previewCanvas" id="previewcanvas" src=""></iframe>
                </div>

                <div class="page inputForm pinPointForm">
                    <div class="contentContainer noBackground">
                        <p>Do you want to Save the model? Please enter the Layer Name, Asset Name and Asset ID to save.</p>
                        <div class="content 2">
                            <span class="labelTitle required">Layer Name</span>
                            <select id="modelLayerName" placeholder="eg: Hospital Ward.b3dm"></select>
                            <span class="labelTitle">Asset Type</span>
                            <input type="text" id="modelBuildingType" placeholder="eg: Bridge" data-dpmaxz-eid="15" data-dpmaxz-pid="4.00.00.t">
                            <span class="labelTitle">Asset Owner</span>
                            <input type="text" id="modelBuildingOwner" placeholder="eg: Reveron" data-dpmaxz-eid="16" data-dpmaxz-pid="4.00.00.t">
                            <span class="labelTitle required">Asset Name</span>
                            <input type="text" id="modelAssetName" required placeholder="eg: Air Conditioning" data-dpmaxz-eid="18" data-dpmaxz-pid="4.00.00.t">
                            <span class="labelTitle required">Asset ID</span>
                            <input type="text" id="modelAssetID" class="uppercase" required placeholder="eg: BIM-001" data-dpmaxz-eid="17" data-dpmaxz-pid="4.00.00.t">
                            <span class="labelTitle">SLA(Number)</span>
                            <input type="text" id="modelAssetSLA" required placeholder = "eg: 1" pattern="[0-9]+" data-dpmaxz-eid="19" data-dpmaxz-pid="4.00.00.t">
                        </div>
                        <div class="modal-footer pinPointFormFooter">
                            <button rel="insight" id="pinPointFormSave" title="Save" class="form" onclick="OnClickModelFormSave()">Save</button>
                            <button rel="insight" id="pinPointFormCancel" title="Cancel" class="form" onclick="OnClickModelFormCancel()">Cancel</button>
                        </div>
                    </div>
                </div>

                <div class="page inputForm newEntityForm entityForm">
                    <div class="contentContainer noBackground">
                        <p>Do you want to Save the location? Please enter the Location name and Region name to save.</p>
                        <div class="content">
                            <span class="labelTitle required">Location Name:</span>
                            <input type="text" placeholder="Enter Name" id="lName">
                            <span class="labelTitle required">Region:</span>
                            <input type="text" placeholder="Enter Region" id="rName">
                        </div>
                        <div class="modal-footer newEntityFormFooter">
                            <button rel="insight" id="newEntitySave" title="Save primary" class="form primary" onclick="OnClickNewEntitySave()">Save</button>
                        </div>
                    </div>
                </div>

                <div class="page inputForm pwCredentials">
                    <div class="contentContainer noBackground">
                        <p>Do you want to Save the credentials? Please enter the new Username and Password to save.</p>
                        <div class="content">
                            <span class="labelTitle required">Username:</span>
                            <input type="text" id="pwUserName" placeholder="User name" data-dpmaxz-eid="3">
                            <span class="labelTitle required">Password:</span>
                            <input type="password" id="pwPassword" placeholder="Password" data-dpmaxz-eid="4">
                        </div>
                        <div class="modal-footer pwCredentialsFooter">
                            <button class="form primary" name="pwCredentialsSave" id="pwCredentialsSave" onClick = "OnClickPwCredentialsSave()">OK</button>
                        </div>
                    </div>
                </div>

                <div class="page inputForm editentityForm" id="editentityForm">
                    <div class="contentContainer noBackground">
                        <p>Do you want to Edit the entity? Please enter the new details to save.</p>
                        <div class="content">
                            <span class="labelTitle">Location Name:</span>
                            <input type="text" id="locationName" readonly="" data-dpmaxz-eid="8" data-dpmaxz-pid="3.00.00.t">
                            <span class="labelTitle">Region:</span>
                            <input type="text" id="regionName"  readonly="" data-dpmaxz-eid="9" data-dpmaxz-pid="3.00.00.t">
                            <span class="labelTitle">Location Status:</span>
                            <select id="locationstatus">
                                <option value="0%">0%</option>
                                <option value="10%">10%</option>
                                <option value="25%">25%</option>
                                <option value="50%">50%</option>
                                <option value="75%">75%</option>
                                <option value="100%">100%</option>
                            </select>';
                            if (isset($_SESSION['file_method']) && $_SESSION['file_method'] == 'sp') {
                                echo '
                                <div class="doublefield">
                                    <div class="column1">
                                        <span class="labelTitle">SP Path:</span>
                                        <input type="text" id="SPPathDisplay" readonly="" data-dpmaxz-eid="9" data-dpmaxz-pid="3.00.00.t">
                                    </div>
                                    <div class="column2">
                                        <span class="labelTitle">Change Path?</span>
                                        <input type = "checkbox" id = "changeSPPath">
                                    </div>
                                </div>
                                <div id ="folderRootSP" class="appearoncheck"></div>';
                            } else {
                                echo '
                                <div class="doublefield">
                                    <div class="column1">
                                        <span class="labelTitle">PW Path:</span>
                                        <input type="text" id="PWPathDisplay" readonly="" data-dpmaxz-eid="9" data-dpmaxz-pid="3.00.00.t">
                                    </div>
                                    <div class="column2">
                                    <span class="labelTitle">Change Path?</span>
                                        <input type = "checkbox" id = "changePWPath">
                                    </div>
                                </div>
                                <div id ="folderRoot" class="appearoncheck"></div>';
                            }
                            echo '
                            <div class="loadingcontainer-mainadmin">
                                <div class="loader"></div>
                                <div id="loadingText"></div>
                            </div>
                        </div>
                        <div class="modal-footer newEntityFormFooter">
                            <button id="entityFormSave" title="Save" class="form primary" onclick="OnClickEntityFormSave()">Save</button>
                        </div>
                    </div>
                </div>

                <div class="page setupPage">
                    <div class="contentContainer noBackground">
                        <div class="labelContainer"><span class="labelTitle labelWidth default">Setup List</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption setupListOption" id="valueSetupConstruct" onchange="setupListOnchange(this)">
                            </select>
                        </div>
                    </div>
                    <iframe class="bottom" id = "setupIframe" src=""></iframe>
                </div>

                <div class="page statisticPage">
                    <div class="contentContainer noBackground">
                        <div class="labelContainer"><span class="labelTitle labelWidth default">Statistic List</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption statisticListOption" id="valueStatisticConstruct" onchange="statisticListOnchange(this)">
                                <option value="default">Please Choose</option>
                                <option value="SA">HSET Activity</option>
                                <option value="SMH">Total Safe Man-Hour Works Without LTI</option>
                            </select>
                        </div>
                    </div>
                    <iframe class="bottom" id = "statisticIframe" src=""></iframe>
                </div>

                <div class="page setupList">
                    <div class="contentContainer noBackground">
                        <div class="labelContainer"><span class="labelTitle labelWidth default">Setup List</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption setupAssetOption" id="valueSetupAsset" onchange="setupAssetOnchange(this)">
                                <option value = "">Please Choose</option>
                                <option value = "Equipment">Equipment</option>
                            </select>
                        </div>
                    </div>
                    <iframe class="bottom bottomContainer" id = "setupAssetIframe" src=""></iframe>
                </div>
                
                <div class="page fmSetupList">
                    <div class="contentContainer noBackground">
                        <div class="labelContainer"><span class="labelTitle labelWidth default">Setup List</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption setupAssetOption" id="valueSetupFm" onchange="fmSetupAssetOnchange(this)">
                                <option value = "default">Please Choose</option>
                                <option value = "SOR Management">Standard Operating Rate</option>
                            </select>
                        </div>
                    </div>
                    <iframe class="bottom bottomContainer" id = "setupAssetIframe" src=""></iframe>
                </div>

                <div class="page fmNewAssetTable">
                    <div class="contentContainer noBackground">
                        <input type="hidden" id="fm_asset_no" value="" />
                        <input type="hidden" id="fm_asset_name" value="" />
                        <input type="hidden" id="fm_asset_type" value="" />
                        <div class="labelContainer"><span class="labelTitle labelWidth default">Process Type</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption fmAssetTableProcessOption" onchange="fmAssetTableOptionOnchange(this)">
                                <option value = "default">Please Choose</option>
                                <option value = "Service Request">Service Request</option>
                            </select>
                        </div>
                    </div>
                    <iframe class="bottom bottomContainer" id = "assetTableProcessIframe" src=""></iframe>
                </div>

                <div class="page pavementAnalysis">
                    <div class="wizardContainer projectProcess active">
                        <div class="projectProcessSelect">
                            <div class="labelContainer">
                                <span class="labelTitle labelWidth">Processs Type</span>
                                <span class="projectLabelName projectName projectPackageName"></span>
                            </div>
                            <div class="customOption">
                                <select type="text" class="selectOption processListOption" id="processTypePavement" data-page="insight" onchange="processListOnchangePavement(this)">
                                </select>
                            </div>
                        </div>
                        <div class="projectProcessSelect projectPavementupload" style="display:none">
                            <div class="labelContainer"><span class="labelTitle">Analysis Type</span></div>
                            <div class="customCheckbox" id="pavementCheckBox">
                                <label class="container">Falling Weight Deflectometer
                                    <input type="checkbox" class="fwdAnalysis" id="paveType" name="pavement" value="assetFWD" onclick="selectOnlyThisPavement(this)"><span class="checkmark" for="pavement"></span>
                                </label>
                                <label class="container">Multi-level Profiler
                                    <input type="checkbox" class="mlpAnalysis" id="paveType" name="pavement" value="assetMLP" onclick="selectOnlyThisPavement(this)"><span class="checkmark" for="pavement"></span>
                                </label>
                            </div>
                        </div>
                        <div class="contentContainer noBackground inlineFilter pavementReport" style="display:none">
                            <div class="progressFilecontainer fwd">
                                <div class="customOption">
                                    <span class="labelTitle inlineLabel">Date</span>
                                    <select class="selectOption" id="dataDateOpt" onclick="fetchData(this)"></select>
                                </div>
                                <div class="flex">
                                    <div class="customOption marginRight">
                                        <span class="labelTitle inlineLabel">Chainage From</span>
                                        <select class="selectOption chgOptions" id="chgFromOpt" onchange="filterChg()"></select>
                                    </div>
                                    <div class="customOption">
                                        <span class="labelTitle inlineLabel">Chainage To</span>
                                        <select class="selectOption chgOptions" id="chgToOpt" onchange="filterChg()"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="progressFilecontainer mlp">
                                <div class="customOption">
                                    <span class="labelTitle inlineLabel">Date</span>
                                    <select class="selectOption" id="dataDateMLP" onclick="fetchDataMLP(this)"></select>
                                </div>
                                <div class="flex">
                                    <div class="customOption marginRight">
                                        <span class="labelTitle inlineLabel">Chainage From</span>
                                        <select class="selectOption chgMLP" id="chgFromMLP" onchange="filterChgMLP()"></select>
                                    </div>
                                    <div class="customOption">
                                        <span class="labelTitle inlineLabel">Chainage To</span>
                                        <select class="selectOption chgMLP" id="chgToMLP" onchange="filterChgMLP()"></select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tableContainer pavementUpload">
                            <iframe id = "pavementUploadTable" src=""></iframe>
                        </div>
                    </div>
                </div>

                <div class="page metadataEdit">
                Meta ID : <input type="text" id="filterMetaID">
                Mission/Cycle ID : <input type="text" id="filterMissionCycleID"> 
                <button class="form primary" onclick="refreshMetadataList()">Search</button>
                    <div class="contentContainer noBackground">
                        <table style="width:100%; border: 1px solid var(--border-bottom);">
                            <thead>
                                <tr>
                                    <th>Meta ID</th>
                                    <th>Mission/Cycle ID</th>
                                    <th>Date</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                </tr>
                            </thead>
                            <tbody id="metadataEditList">
                                <tr class=" fa-copy" style="cursor: pointer">
                                    <td style="border-bottom: 1px solid; border-right: 1px solid" >Magazzini</td>
                                    <td style="border-bottom: 1px solid; border-right: 1px solid">Giovanni Rovelli Alimentari</td>
                                    <td style="border-bottom: 1px solid; border-right: 1px solid">Ita ly</td>
                                    <td style="border-bottom: 1px solid; border-right: 1px solid">Magazzini  </td>
                                    <td style="border-bottom: 1px solid; border-right: 1px solid">Giovanni  </td> 
                                </tr> 
                            </tbody>
                        </table>
                        <div class="modal-footer metadataEditFooter">
                            <button rel="" id="" title="Submit Metadata" class="form primary" onclick="" hidden>Submit</button>
                        </div>
                    </div>
                </div>

                <div class="page iotGraph">
                    <div id="">
                        <div class="" id="iotTimeSeries" style="height: 100%; width: 100%; padding: 0px 0px;"></div>
                    </div>
                </div>

                <div class="page iotTableList">
                    <div id="">
                        <div class="tableListContainer" id="iotTableSeries">
                            <table> 
                                <thead>
                                    <tr>
                                        <th>Asset ID</th>
                                        <th>IoT Name</th>
                                        <th>Type</th>
                                        <th>Sensor Color</th>
                                        <th>Notify Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody id="historyTable"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-container newsFeed" id="newsFeedModal">
                <div class="page newsFeed">
                    <div class="image">
                        <img src="https://buffer.com/library/content/images/library/wp-content/uploads/2017/03/customize-my-facebook-news-feed-featured-image.png">
                    </div>
                    <div class="flexContainer">
                        <div class="title">News On New Reveron Insights Feature</div>
                        <div class="footer">
                            <div class="timeStamp"><i class="fa-regular fa-clock"></i> 6m</div>&nbsp&nbsp•&nbsp&nbsp
                        </div>
                        <div class="desc scrollbar-inner" id="desc">
                            <p>
                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                            </p>
                            <p>
                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-container projectView">
                <div class="infoContent">
                    <div class="infoContainerHeaderBody">
                        <div class="infoHeader-profile" style="background-image: url('.$userProfileHeader.')">
                            <label class="infoPicture" style="pointer-events: none">
                                <div class="infoProfilePic"><img src="'.$projectImage.'"  id="projectViewImage"></div>
                            </label>
                        </div>
                        <div class="infoHeader-readonly full-width"><h3 class="projectName"></h3>
                        <div class="buttonTab">
                            <div class="tab active" rel="projectView" data-page="general" onclick="navBoxTabClick(this)">General</div>
                            <div class="tab" rel="projectView" data-page="finance" onclick="navBoxTabClick(this)">Finance</div>
                        </div>
                        </div>
                    </div>
                    <div class="infoContainerMainBody projectView">
                        <div class="infoContainerBody-readonly">
                            <div class="page projectView general active">
                                <div class="menuTitle">Contact Project Admin <i class="fa-solid fa-info alert" id="notiMessage"></i></div>
                                    <div id="adminUsersList" class="notiMessage notiContainer"> 
                                    </div>
                                <div class="doublefield">
                                    <div class="readOnlyContainer flex"><i class="fa-solid fa-puzzle-piece"></i>
                                        <div class="twoLabel">
                                            <span class="textEllipsis headerTitle">Project ID</span>
                                            <span class="textEllipsis projectID"></span>
                                        </div>
                                    </div>
                                    <div class="readOnlyContainer flex"><i class="fa-solid fa-dice-d6"></i>
                                        <div class="twoLabel">
                                            <span class="textEllipsis headerTitle">Project Name</span>
                                            <span class="textEllipsis projectName"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="doublefield">
                                    <div class="readOnlyContainer flex"><i class="fa-solid fa-industry"></i>
                                        <div class="twoLabel">
                                            <span class="textEllipsis headerTitle">Industry</span>
                                            <span class="textEllipsis projectIndustry"></span>
                                        </div>
                                    </div>
                                    <div class="readOnlyContainer flex"><i class="fa-solid fa-location-dot"></i>
                                        <div class="twoLabel">
                                            <span class="textEllipsis headerTitle">Country</span>
                                            <span class="textEllipsis projectLocation"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="doublefield">
                                    <div class="readOnlyContainer flex"><i class="fa-solid fa-clock"></i>
                                        <div class="twoLabel">
                                            <span class="textEllipsis headerTitle">Timezone</span>
                                            <span class="textEllipsis timeZone"></span>
                                        </div>
                                    </div>
                                    <div class="readOnlyContainer flex"><i class="fa-solid fa-calendar-days"></i>
                                        <div class="twoLabel">
                                            <span class="textEllipsis headerTitle">Project Duration</span>
                                            <span class="textEllipsis projectDuration"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="doublefield">
                                    <div class="readOnlyContainer flex"><i class="fa-solid fa-arrows-rotate"></i>
                                        <div class="twoLabel">
                                            <span class="textEllipsis headerTitle">Created By</span>
                                            <span class="textEllipsis projectCreatedBy"></span>
                                        </div>
                                    </div>
                                    <div class="readOnlyContainer flex"><i class="fa-solid fa-hourglass"></i>
                                        <div class="twoLabel">
                                            <span class="textEllipsis headerTitle">Last Update</span>
                                            <span class="textEllipsis projectUpdatedBy"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="page projectView finance">
                                <div class="tableHeader wizard">
                                    <span class="columnFirst">Contract Name</span>
                                    <span class="columnSecond noMargin">Contract Amount</span>
                                    <div class="columnSecond">
                                        <div class="searchContainer">
                                            <input id="searchContract" placeholder="Search Contract" onkeyup="searchContract(this)"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="tableBody" id="financeContractInfo">
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-container addNewUser" rel="addNewUser">
                <div class="page scrollable" data-page="1">
                    <div class="inputContent no-margintop" style="display:none;">
                        <div class="column-one single">
                            <label class="required">User Id</label>
                            <br>
                            <input class="disable" type="text" id="userId" name="userId">
                        </div>
                    </div>
                    <div class="inputContent twoColumn no-margintop">
                        <div class="column-one">
                            <label class="required">Email</label>
                            <br>
                            <input type="text" id="userEmail" required placeholder="example@domain.com" pattern="[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" >
                        </div>
                        <div class="column-two">
                            <label class="required">Mobile Phone</label>
                            <br>
                            <input type="text" id="userPhoneNumber" name="userPhoneNumber" required placeholder="0123456789">
                        </div>
                    </div>
                    <div class="inputContent twoColumn">
                        <div class="column-one">
                            <label class="required">First Name</label>
                            <br>
                            <input type="text" id="userFirstName" name="userFirstName" required placeholder="Enter your first name here" pattern="[A-Za-z]\S.*">
                        </div>
                        <div class="column-two">
                            <label class="required">Last Name</label>
                            <br>
                            <input type="text" id="userLastName" name="userLastName" required placeholder="Enter your last name here" pattern="[A-Za-z]\S.*">
                        </div>
                    </div>
                    <div class="inputContent">
                        <div class="column-one single">
                            <label>Designation</label>
                            <br>
                            <input type="text" id="userDesignation" name= "userDesignation" required placeholder = "Enter your designation here">
                        </div>
                    </div>
                    <div class="inputContent twoColumn">
                        <div class="column-one">
                            <div class="inputContent">
                                <div class="customCheckbox">
                                    <label class="container resetcheck labelTitle nowrap">Support User?
                                        <input type="checkbox" class="resetcheck" id="supportUser" name="" value="0"><span class="checkmark" for="supportUser"></span>
                                    </label>
                                </div>
                                <div class="label-tag">*This user will now be able to raise support request</div>
                            </div>
                        </div>
                    </div>
                    <div class="inputContent">
                        <div class="column-one">
                            <label class="required">Organization</label>
                            <br>
                            <select type="text" id="userOrg" class="" name="userOrg">
                                <option value="default">Default</option>
                            </select>
                        </div>
                        <div class="column-two flex addNewUser-new">
                            <div class="customCheckbox marginBottom">
                                <label class="container resetcheck labelTitle">New Organization?
                                    <input type="checkbox" class="resetcheck" id="addNewOrg" name="" value="default" onchange="newOrgCheckbox(this)"><span class="checkmark" for=""></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="inputContent newOrg">
                        <div class="column-one">
                            <label class="required">New Org ID</label>
                            <br>
                            <input type="text" id="userNewOrgId" name= "userNewOrgId" required placeholder = "Enter the Organization ID here" pattern="[A-Za-z0-9_]*">
                        </div>
                        <div class="column-two">
                            <label class="required">New Org Name</label>
                            <br>
                            <input  type="text" id="userNewOrgName" name = "userNewOrgName" required placeholder = "Enter the Organization Name here">
                        </div>
                    </div>
                    <div class="inputContent newOrg">
                        <div class="column-one">
                            <label>New Org Description</label>
                            <br>
                            <input  type="text" id="userNewOrgDesc" name = "userNewOrgDesc" placeholder = "Enter any description for the Organization here">
                        </div>
                        <div class="column-two">
                            <label class="required">New Org Type</label>
                            <br>
                            <select type="text" id="userNewOrgType" class="" name="userNewOrgType" style="text-transform: capitalize">
                                <option value="default">Default</option>';
                                foreach ($userNewOrgTypeArr as $userOrg) {
                                    if($userOrg){
                                        $userOrgName = ($userOrg == "DBC") ? "Design Built Contractor" : $userOrg;
                                        echo '<option value="'.$userOrg.'" style="text-transform: capitalize">'.$userOrgName.'</option>';
                                    }
                                }
                            echo '</select>
                        </div>
                    </div>
                    <div class="inputContent twoColumn">
                        <div class="column-one">
                            <label>Country</label>
                            <br>
                            <select type="text" id="userCountry" name="userCountry">
                                <option value="">Please Select...</option>';
                                foreach ($countryOptionArr as $country) {
                                    echo '<option value="'.$country.'">'.$country.'</option>';
                                }
                                echo '
                            </select>
                        </div>
                        <div class="column-two">
                            <label class="required">User Type</label>
                            <br>
                            <select type="text" id="userType" class="" name="">
                                <option value="user">User</option>
                                <option value="system_admin">System Admin</option>
                            </select>
                        </div>
                    </div>
                    <div class="inputContent addNewUser-edit">
                        <div class="customCheckbox">
                            <label class="container resetcheck labelTitle">Reset Password?
                                <input type="checkbox" class="resetcheck" id="resetPassCheck" name="" value="0" onchange="resetPassCheckbox(this)"><span class="checkmark" for="resetPassCheck"></span>
                            </label>
                        </div>
                    </div>
                    <div class="inputContent password">
                        <div class="column-one single">
                            <label class="required">Password</label>
                            <br>
                            <input onkeyup="onkeyupPassword(this)" data-currentkeyup="SysAdmin" placeholder="Enter your password here" required="" minlength="4" type="password" id="userPasswordSysAdmin" name="userPasswordSysAdmin" pattern=".{5,}" autocomplete="new-password" class="valid" aria-autocomplete="list">
                        </div>
                        <div class="password-showhide password-button">
                            <button type="button" class="password-show sysAdmin" rel="userPasswordSysAdmin" data-confirm="sysAdmin"><i class="fa-solid fa-eye"></i></button>
                            <button type="button" style="display:none" class="password-hide sysAdmin" rel="userPasswordSysAdmin" data-confirm="sysAdmin"><i class="fa-solid fa-eye-slash"></i></button>
                        </div>
                    </div>
                    <div class="inputContent password">
                        <div class="passindicator SysAdmin" style= "width: 100%">
                            <div id="passwordstrengthSysAdminContainer">
                                <div id="passwordstrengthSysAdmin"></div>
                            </div>
                            <span id="passwordstrengthTextSysAdmin"></span>
                        </div>
                    </div>
                    <div class="inputContent password marginBottom">
                        <div class="column-one single">
                            <label class="required">Confirm Password</label>
                            <br>
                            <input type="password" id="userConfirmPasswordSysAdmin" name="userConfirmPasswordSysAdmin" autocomplete="new-password">
                        </div>
                        <div class="confirm-password-showhide-adduser password-button">  
                            <button type="button" class="password-show-confirm sysAdmin" rel="userConfirmPasswordSysAdmin" data-confirm="sysAdmin"><i class="fa-solid fa-eye"></i></button>
                            <button type="button" style="display:none" class="password-hide-confirm sysAdmin" rel="userConfirmPasswordSysAdmin" data-confirm="sysAdmin"><i class="fa-solid fa-eye-slash"></i></button>
                        </div>
                    </div>
                </div>
                
                <div class="page twoColumn" data-page="2">
                    <div class="page-column left">
                        <div class="infoHeader-profile">
                            <label class="infoPicture" style="pointer-events: none">
                                <div class="infoProfilePic profilePic"><img src="../Images/defaultProfile.png"></div>
                            </label>
                        </div>
                        <div class="readOnlyContent">
                            <div class="readOnlyContainer userName">
                                <i class="fa-solid fa-user"></i>
                                <div class="twoLabel">
                                    <span class="textEllipsis headerTitle">User Name</span>
                                    <span class="textWrap"></span>
                                </div>
                            </div>
                            <div class="readOnlyContainer email">
                                <i class="fa-solid fa-envelope"></i>
                                <div class="twoLabel">
                                    <span class="textEllipsis headerTitle">User Email</span>
                                    <span class="textWrap"></span>
                                </div>
                            </div>
                            <div class="readOnlyContainer designation">
                                <i class="fa-solid fa-briefcase"></i>
                                <div class="twoLabel">
                                    <span class="textEllipsis headerTitle">User Designation</span>
                                    <span class="textWrap"></span>
                                </div>
                            </div>
                            <div class="readOnlyContainer phoneNumber">
                                <i class="fa-solid fa-phone"></i>
                                <div class="twoLabel">
                                    <span class="textEllipsis headerTitle">Mobile Phone</span>
                                    <span class="textWrap"></span>
                                </div>
                            </div>
                            <div class="readOnlyContainer org">
                                <i class="fa-solid fa-sitemap"></i>
                                <div class="twoLabel">
                                    <span class="textEllipsis headerTitle">Organization</span>
                                    <span class="textWrap"></span>
                                </div>
                            </div>
                            <div class="readOnlyContainer country">
                                <i class="fa-solid fa-earth-europe"></i>
                                <div class="twoLabel">
                                    <span class="textEllipsis headerTitle">Country</span>
                                    <span class="textWrap"></span>
                                </div>
                            </div>
                            <div class="readOnlyContainer lastUpdate">
                                <i class="fa-solid fa-arrows-rotate"></i>
                                <div class="twoLabel">
                                    <span class="textEllipsis headerTitle">Last Update</span>
                                    <span class="textWrap"></span>
                                </div>
                            </div>
                            <div class="readOnlyContainer createdBy">
                                <i class="fa-solid fa-pencil"></i>
                                <div class="twoLabel">
                                    <span class="textEllipsis headerTitle">Created By</span>
                                    <span class="textWrap"></span>
                                </div>
                            </div>
                            <div class="readOnlyContainer lastLogin">
                                <i class="fa-solid fa-clock"></i>
                                <div class="twoLabel">
                                    <span class="textEllipsis headerTitle">Last Login</span>
                                    <span class="textWrap"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="page-column right">
                        <div class="tableContent">
                            <span>Project(s)</span>
                            <div class="tablecontainer">
                                <div class="tableHeader system-admin fourColumn">
                                    <span class="columnMiddle">Project Name</span>
                                    <span class="columnMiddle">Role</span>
                                    <span class="columnMiddle">Added By</span>
                                    <span class="columnMiddle">Added Time</span>
                                </div>
                                <div class="tableBody" id="userProjectList">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary"  onclick="wizardNextPage(this)">Next</button>
                    <button class="editPage primary" onclick="wizardEditPage(this)">Edit</button>
                    <button class="savePage primary" onclick="onclickUserSaveButton()">Save</button>
                    <button class="restorePage primary" onclick="restoreUser()">Restore</button>
                    <button class="archivePage primary" onclick="archiveOrDeleteUser(this)">Archive</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage(this)">Cancel</button>
                </div>
            </div>

            <div class="modal-container addNewProject" rel="addNewProject"> 
                <div class="upper-container addNewProject justify-center">
                    '.$addNewProjectIndicatorHTML.'
                </div>
                
                <div class="page addNewProject" data-page="1">
                    <div class="inputContent">
                        <div class="column-two flex">
                            <div class="customCheckbox">
                                <label class="container resetcheck labelTitle">Overall Project
                                    <input type="checkbox" class="resetcheck" id="overallprojectCheck" name="" value="default" onclick="overallProjectCheckHandler()"><span class="checkmark" for=""></span>
                                </label>
                            </div>
                        </div>
                        <div class="column-two flex">
                            <div class="customCheckbox">
                                <label class="container resetcheck labelTitle">Package Specific Project
                                    <input type="checkbox" class="resetcheck" id="packagespecificCheck" name="" value="default" onclick="overallPackageCheckHandler ()"><span class="checkmark" for=""></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="inputContent" style="display: none;">
                        <div class="column-one single">
                            <label class="required" id="label-projectidnumber">Project Owner</label>
                            <br>
                            <input type="text" id="projectIdNumber" class="" name="projectIdNumber">
                        </div>
                    </div>

                    <div class="inputContent packageType" style="display: none">
                        <div class="column-one single">
                            <label class="required">Parent Project</label>
                            <br>
                            <select title = "Mandatory field" id="parentId" name="parentId" required onchange="updateIndustryTimezone(); refreshContractOrgList(); refreshConsultantOrgList(); '.$refreshUserListFunction.'">
                                <option>Please Select ...</option> ';
                                if($SYSTEM == 'OBYU'){
                                    $sql = "SELECT project_id_number, project_id, project_name, owner_org_id, industry, time_zone_value  from projects WHERE status !='archive' AND parent_project_id_number IS NULL ORDER BY project_id_number";
                                    $stmt = $CONN->fetchAll($sql);

                                    foreach ($stmt as $row) {
                                        echo "<option value='" . $row['project_id_number'] ."' industry  ='" . $row['industry'] ."'" . " timevalue = '" . $row['time_zone_value'] . "'" . " projectowner = '" . $row['owner_org_id'] . "'>" . $row['project_id'] . "/" . $row['project_name'] ."</option>";
                                    }
                                }else{
                                    $sql = "SELECT project_id_number, project_id, project_name, project_owner, project_type, region, industry, time_zone_value  from projects WHERE status !='archive' AND parent_project_id_number IS NULL ORDER BY project_id_number";
                                    $stmt = $CONN->fetchAll($sql);

                                    foreach ($stmt as $row) {
                                        echo "<option value='" . $row['project_id_number'] ."' industry  ='" . $row['industry'] ."'" . " timevalue = '" . $row['time_zone_value'] . "'" . " projectowner = '" . $row['project_owner'] . "'" . " projecttype = '" . $row['project_type'] . "'" . " region = '" . $row['region'] . "'>" . $row['project_id'] . "/" . $row['project_name'] ."</option>";
                                    }
                                }
                                    echo '
                            </select>
                        </div>
                    </div>

                    <div class="inputContent">
                        <div class="column-one single">
                            <label class="required" id="label-projectowner">Project Owner</label>
                            <br>
                            <select type="text" id="projectOwner" class="" name="projectOwner"';
                            if($SYSTEM == 'OBYU'){
                                echo' onchange = "refreshUserListBasedOnOrg(\'\', \'projectOwner\'); refreshContractOrgList(); refreshConsultantOrgList()">';
                                $sql = "SELECT orgID, orgName, Constructs FROM organization WHERE orgType = 'owner'";
                                $stmt = $CONN->fetchAll($sql);
                                echo '<option value="" disabled selected>Please select ...</option>';
                                foreach ($stmt as $row) {
                                    echo "<option value='" . $row['orgID'] ."' data  ='" . $row['Constructs'] ."'>" . $row['orgName'] ."</option>";
                                }
                            }else{
                                echo' onchange="OnchangeProjectOwner(this)">
                                <option value="" disabled selected>Please select ...</option>
                                <option value="JKR_SABAH">JKR SABAH</option>
                                <option value="JKR_SARAWAK">JKR SARAWAK</option>
                                <option value="SSLR2">SSLR2</option>';
                                if(!$PRODUCTION_FLAG){
                                    echo '<option value="UEM_EDGENTA">UEM EDGENTA</option>';
                                }
                            }
                            
                            echo'
                            </select>
                        </div>
                    </div>
                    
                    <div class="inputContent">
                        <div class="column-one single">
                            <label class="required"  id="label-projectid">Project ID</label>
                            <br>';
                            if($SYSTEM == 'KKR'){
                                echo'<input type="text" title = "Mandatory field" id="projectId" name="projectId" required placeholder="e.g. RI_v01" pattern="[A-Za-z0-9_]*">';
                            }else{
                                echo'<input type="text" title = "Mandatory field" id="projectId" name="projectId" required placeholder="e.g. RI_v01" pattern="[A-Za-z0-9_/()-]*">';
                            }
                            echo'
                        </div>
                    </div>

                    <div class="inputContent">
                        <div class="column-one single">
                            <label class="required"  id="label-projectname">Project Name</label>
                            <br>
                            <input type="text" title = "Mandatory field" id="projectName" name="projectName" required placeholder="e.g. Reveron Insights" pattern="\S.*">
                        </div>
                    </div>';

                    if($SYSTEM == 'KKR'){
                        echo'
                        <div class="inputContent packageType" style="display:none">
                            <div class="column-one single">
                                <label class="required" id="label-projectwpcid" > WPC ID</label>
                                <input type="text"  id="projectWpcId"  required placeholder="e.g. WPC01" pattern="[A-Z0-9]*" maxlength="5">
                            </div>
                        </div>';
                    }
                    echo'

                    <div class="inputContent projectPhase">
                        <div class="phaseType column-two S flex center">
                            <div class="customCheckbox">
                                <label class="container resetcheck labelTitle">Project Phase 1B
                                    <input type="checkbox" class="resetcheck" id="projectPhase" name="projectPhase" value="1B" onclick="onclickProjectPhase(this)"><span class="checkmark" for=""></span>
                                </label>
                            </div>
                        </div>
                        <div class="wpcAbbr column-two L flex center">
                            <label class="nowrap marginRight" id="label-projectwpcabbr" > WPC Abbreviation</label>
                            <input type="text"  id="projectWpcAbbr"  required placeholder="e.g. PAJ" pattern="[A-Z0-9]*" maxlength="5">
                        </div>
                    </div>

                    <div class="inputContent">
                        <div class="column-one single">
                            <label class="">Industry</label>
                            <br>
                            <select type="text" id="projectIndustry" class="" name="">
                                <option>Please Select...</option>
                                <option value="Building and Facilities">Building and Facilities</option>
                                <option value="Road">Road</option>
                                <option value="Water and Wastewater">Water and Wastewater</option>
                                <option value="Oil and Gas">Oil and Gas</option>
                                <option value="Others">Others...</option>
                            </select>
                        </div>
                    </div>
                    <div class="inputContent">
                        <div class="column-one single">
                            <label class="">Timezone</label>
                            <br>
                            <select type="text" id="projectTimezone" class="" name="">
                                <option> PleaseSelect...</option>
                                <option value="1" gmtAdjustment="GMT-12:00" useDaylightTime="0" adjuatmentValue="-12">(GMT-12:00) International Date Line West</option>
                                <option value="2" gmtAdjustment="GMT-11:00" useDaylightTime="0" adjuatmentValue="-11">(GMT-11:00) Midway Island, Samoa</option>
                                <option value="3" gmtAdjustment="GMT-10:00" useDaylightTime="0" adjuatmentValue="-10">(GMT-10:00) Hawaii</option>
                                <option value="4" gmtAdjustment="GMT-09:00" useDaylightTime="1" adjuatmentValue="-9">(GMT-09:00) Alaska</option>
                                <option value="5" gmtAdjustment="GMT-08:00" useDaylightTime="1" adjuatmentValue="-8">(GMT-08:00) Pacific Time (US & Canada)</option>
                                <option value="6" gmtAdjustment="GMT-08:00" useDaylightTime="1" adjuatmentValue="-8">(GMT-08:00) Tijuana, Baja California</option>
                                <option value="7" gmtAdjustment="GMT-07:00" useDaylightTime="0" adjuatmentValue="-7">(GMT-07:00) Arizona</option>
                                <option value="8" gmtAdjustment="GMT-07:00" useDaylightTime="1" adjuatmentValue="-7">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                                <option value="9" gmtAdjustment="GMT-07:00" useDaylightTime="1" adjuatmentValue="-7">(GMT-07:00) Mountain Time (US & Canada)</option>
                                <option value="10" gmtAdjustment="GMT-06:00" useDaylightTime="0" adjuatmentValue="-6">(GMT-06:00) Central America</option>
                                <option value="11" gmtAdjustment="GMT-06:00" useDaylightTime="1" adjuatmentValue="-6">(GMT-06:00) Central Time (US & Canada)</option>
                                <option value="12" gmtAdjustment="GMT-06:00" useDaylightTime="1" adjuatmentValue="-6">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
                                <option value="13" gmtAdjustment="GMT-06:00" useDaylightTime="0" adjuatmentValue="-6">(GMT-06:00) Saskatchewan</option>
                                <option value="14" gmtAdjustment="GMT-05:00" useDaylightTime="0" adjuatmentValue="-5">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
                                <option value="15" gmtAdjustment="GMT-05:00" useDaylightTime="1" adjuatmentValue="-5">(GMT-05:00) Eastern Time (US & Canada)</option>
                                <option value="16" gmtAdjustment="GMT-05:00" useDaylightTime="1" adjuatmentValue="-5">(GMT-05:00) Indiana (East)</option>
                                <option value="17" gmtAdjustment="GMT-04:00" useDaylightTime="1" adjuatmentValue="-4">(GMT-04:00) Atlantic Time (Canada)</option>
                                <option value="18" gmtAdjustment="GMT-04:00" useDaylightTime="0" adjuatmentValue="-4">(GMT-04:00) Caracas, La Paz</option>
                                <option value="19" gmtAdjustment="GMT-04:00" useDaylightTime="0" adjuatmentValue="-4">(GMT-04:00) Manaus</option>
                                <option value="20" gmtAdjustment="GMT-04:00" useDaylightTime="1" adjuatmentValue="-4">(GMT-04:00) Santiago</option>
                                <option value="21" gmtAdjustment="GMT-03:30" useDaylightTime="1" adjuatmentValue="-3.5">(GMT-03:30) Newfoundland</option>
                                <option value="22" gmtAdjustment="GMT-03:00" useDaylightTime="1" adjuatmentValue="-3">(GMT-03:00) Brasilia</option>
                                <option value="23" gmtAdjustment="GMT-03:00" useDaylightTime="0" adjuatmentValue="-3">(GMT-03:00) Buenos Aires, Georgetown</option>
                                <option value="24" gmtAdjustment="GMT-03:00" useDaylightTime="1" adjuatmentValue="-3">(GMT-03:00) Greenland</option>
                                <option value="25" gmtAdjustment="GMT-03:00" useDaylightTime="1" adjuatmentValue="-3">(GMT-03:00) Montevideo</option>
                                <option value="26" gmtAdjustment="GMT-02:00" useDaylightTime="1" adjuatmentValue="-2">(GMT-02:00) Mid-Atlantic</option>
                                <option value="27" gmtAdjustment="GMT-01:00" useDaylightTime="0" adjuatmentValue="-1">(GMT-01:00) Cape Verde Is.</option>
                                <option value="28" gmtAdjustment="GMT-01:00" useDaylightTime="1" adjuatmentValue="-1">(GMT-01:00) Azores</option>
                                <option value="29" gmtAdjustment="GMT+00:00" useDaylightTime="0" adjuatmentValue="0">(GMT+00:00) Casablanca, Monrovia, Reykjavik</option>
                                <option value="30" gmtAdjustment="GMT+00:00" useDaylightTime="1" adjuatmentValue="0">(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</option>
                                <option value="31" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                                <option value="32" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
                                <option value="33" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
                                <option value="34" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
                                <option value="35" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) West Central Africa</option>
                                <option value="36" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Amman</option>
                                <option value="37" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Athens, Bucharest, Istanbul</option>
                                <option value="38" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Beirut</option>
                                <option value="39" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Cairo</option>
                                <option value="40" gmtAdjustment="GMT+02:00" useDaylightTime="0" adjuatmentValue="2">(GMT+02:00) Harare, Pretoria</option>
                                <option value="41" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
                                <option value="42" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Jerusalem</option>
                                <option value="43" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Minsk</option>
                                <option value="44" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Windhoek</option>
                                <option value="45" gmtAdjustment="GMT+03:00" useDaylightTime="0" adjuatmentValue="3">(GMT+03:00) Kuwait, Riyadh, Baghdad</option>
                                <option value="46" gmtAdjustment="GMT+03:00" useDaylightTime="1" adjuatmentValue="3">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
                                <option value="47" gmtAdjustment="GMT+03:00" useDaylightTime="0" adjuatmentValue="3">(GMT+03:00) Nairobi</option>
                                <option value="48" gmtAdjustment="GMT+03:00" useDaylightTime="0" adjuatmentValue="3">(GMT+03:00) Tbilisi</option>
                                <option value="49" gmtAdjustment="GMT+03:30" useDaylightTime="1" adjuatmentValue="3.5">(GMT+03:30) Tehran</option>
                                <option value="50" gmtAdjustment="GMT+04:00" useDaylightTime="0" adjuatmentValue="4">(GMT+04:00) Abu Dhabi, Muscat</option>
                                <option value="51" gmtAdjustment="GMT+04:00" useDaylightTime="1" adjuatmentValue="4">(GMT+04:00) Baku</option>
                                <option value="52" gmtAdjustment="GMT+04:00" useDaylightTime="1" adjuatmentValue="4">(GMT+04:00) Yerevan</option>
                                <option value="53" gmtAdjustment="GMT+04:30" useDaylightTime="0" adjuatmentValue="4.5">(GMT+04:30) Kabul</option>
                                <option value="54" gmtAdjustment="GMT+05:00" useDaylightTime="1" adjuatmentValue="5">(GMT+05:00) Yekaterinburg</option>
                                <option value="55" gmtAdjustment="GMT+05:00" useDaylightTime="0" adjuatmentValue="5">(GMT+05:00) Islamabad, Karachi, Tashkent</option>
                                <option value="56" gmtAdjustment="GMT+05:30" useDaylightTime="0" adjuatmentValue="5.5">(GMT+05:30) Sri Jayawardenapura</option>
                                <option value="57" gmtAdjustment="GMT+05:30" useDaylightTime="0" adjuatmentValue="5.5">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                <option value="58" gmtAdjustment="GMT+05:45" useDaylightTime="0" adjuatmentValue="5.75">(GMT+05:45) Kathmandu</option>
                                <option value="59" gmtAdjustment="GMT+06:00" useDaylightTime="1" adjuatmentValue="6">(GMT+06:00) Almaty, Novosibirsk</option>
                                <option value="60" gmtAdjustment="GMT+06:00" useDaylightTime="0" adjuatmentValue="6">(GMT+06:00) Astana, Dhaka</option>
                                <option value="61" gmtAdjustment="GMT+06:30" useDaylightTime="0" adjuatmentValue="6.5">(GMT+06:30) Yangon (Rangoon)</option>
                                <option value="62" gmtAdjustment="GMT+07:00" useDaylightTime="0" adjuatmentValue="7">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                                <option value="63" gmtAdjustment="GMT+07:00" useDaylightTime="1" adjuatmentValue="7">(GMT+07:00) Krasnoyarsk</option>
                                <option value="64" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                                <option value="65" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Kuala Lumpur, Singapore</option>
                                <option value="66" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
                                <option value="67" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Perth</option>
                                <option value="68" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Taipei</option>
                                <option value="69" gmtAdjustment="GMT+09:00" useDaylightTime="0" adjuatmentValue="9">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
                                <option value="70" gmtAdjustment="GMT+09:00" useDaylightTime="0" adjuatmentValue="9">(GMT+09:00) Seoul</option>
                                <option value="71" gmtAdjustment="GMT+09:00" useDaylightTime="1" adjuatmentValue="9">(GMT+09:00) Yakutsk</option>
                                <option value="72" gmtAdjustment="GMT+09:30" useDaylightTime="0" adjuatmentValue="9.5">(GMT+09:30) Adelaide</option>
                                <option value="73" gmtAdjustment="GMT+09:30" useDaylightTime="0" adjuatmentValue="9.5">(GMT+09:30) Darwin</option>
                                <option value="74" gmtAdjustment="GMT+10:00" useDaylightTime="0" adjuatmentValue="10">(GMT+10:00) Brisbane</option>
                                <option value="75" gmtAdjustment="GMT+10:00" useDaylightTime="1" adjuatmentValue="10">(GMT+10:00) Canberra, Melbourne, Sydney</option>
                                <option value="76" gmtAdjustment="GMT+10:00" useDaylightTime="1" adjuatmentValue="10">(GMT+10:00) Hobart</option>
                                <option value="77" gmtAdjustment="GMT+10:00" useDaylightTime="0" adjuatmentValue="10">(GMT+10:00) Guam, Port Moresby</option>
                                <option value="78" gmtAdjustment="GMT+10:00" useDaylightTime="1" adjuatmentValue="10">(GMT+10:00) Vladivostok</option>
                                <option value="79" gmtAdjustment="GMT+11:00" useDaylightTime="1" adjuatmentValue="11">(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
                                <option value="80" gmtAdjustment="GMT+12:00" useDaylightTime="1" adjuatmentValue="12">(GMT+12:00) Auckland, Wellington</option>
                                <option value="81" gmtAdjustment="GMT+12:00" useDaylightTime="0" adjuatmentValue="12">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
                                <option value="82" gmtAdjustment="GMT+13:00" useDaylightTime="0" adjuatmentValue="13">(GMT+13:00) Nuku\'alofa</option>
                            </select>
                        </div>
                    </div>
                    <div class="inputContent">
                        <div class="column-one single">
                            <label class="">Location</label>
                            <br>
                            <input type="text" id="projectLocation" name="">
                        </div>
                    </div>
                    <div class="inputContent">
                        <div class="column-one flex single">
                            <label>Project Image</label>
                            <div class="imgContainer" style="display: none"><img id="projectimage" src="" alt="" /></div>
                            <div class="tool justifyBetween" style="">
                                <label id="" for="">Browse</label>
                                <input type="file" id="imgInp" name="imgInp" accept=".png, .jpeg, .jpg, .bmp">
                            </div>
                            <small class="">Only PNG, JPEG and JPG format which are smaller than 1MB is supported.</small>
                        </div>
                    </div>';
                    
                    if($SYSTEM == 'KKR'){
                        echo'
                            <div class="inputContent">
                                <div class="column-two flex">
                                    <div class="customCheckbox">
                                        <label class="container resetcheck labelTitle">Construct Project
                                            <input type="checkbox" class="resetcheck" id="constructProject" name="newProjCheck" value="default" onchange="newProjTypeCheckbox(this)" checked><span class="checkmark" for=""></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="column-two flex">
                                    <div class="customCheckbox">
                                        <label class="container resetcheck labelTitle">Asset Project
                                            <input type="checkbox" class="resetcheck" id="assetProject" name="newProjCheck" value="default" onchange="newProjTypeCheckbox(this)"><span class="checkmark" for=""></span>
                                        </label>
                                    </div>
                                </div>';
                                
                                if(!$PRODUCTION_FLAG){
                                    echo '
                                    <div class="column-two flex">
                                        <div class="customCheckbox">
                                            <label class="container resetcheck labelTitle">FM Project
                                                <input type="checkbox" class="resetcheck" id="fmProject" name="newProjCheck" value="default" onchange="newProjTypeCheckbox(this)"><span class="checkmark" for=""></span>
                                            </label>
                                        </div>
                                    </div>';
                                }
                            echo '    
                            </div>
                            
                            <div class="inputContent assetProject regionCont">
                                    <input type="text" id="projectRegionInput" name="" placeholder="Northern">
                                    <button class="button" onclick="addRegion()">Add Region</button>
                            </div>

                            <div class="inputContent marginBottom assetProject regionCont">
                                <div class="column-one single">
                                    <input type="text" id="projectRegion" name="" placeholder="Northern, Southern, Central" readonly>
                                </div>
                            </div>

                            <div class="inputContent marginBottom assetProject packageRegionCont">
                                <div class="column-one single">
                                    <label> Package Region</label>
                                    <select title ="Mandatory field" id="packageRegion" name="packageRegion" required >
                                        <option  disabled>Please Select ...</option> 
                                    </select>
                                </div>
                            </div>';
                    }
                    echo'
                </div>

                <div class="page addNewProject" data-page="2">
                    <div class="dropDownContainer" id="constructAppContainer">
                        <div class="dropDown-header">
                            <div class="oneLabel">
                                <span class="textEllipsis" id="projectTypeTitle">Construction App</span>
                            </div>
                            <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                        </div>
                        <div class="dropDown-body" style="display: block">
                            <div class="content-main">
                                <div class="content-sub">
                                    <div class="content-right"><span class="textWrap" id="projectTypePackageTitle">Construct Package</span></div>
                                    <div class="content-left">
                                        <select type="text" id="jogetPackage" class="" name="jogetPackage" onchange="OnChangePackageSelection()">
                                            <option value="default">Default</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="content-main" id="constructAppProcess">
                                '.$constructAppHTML.'
                            </div>
                            <div class="content-main" id="assetAppProcess" style="display: none">
                                '.$assetAppHTML.'
                            </div>
                        </div>
                    </div>

                    <div class="dropDownContainer" id="financeAppContainer">
                        <div class="dropDown-header">
                            <div class="oneLabel">
                                <span class="textEllipsis">Financial App</span>
                            </div>
                            <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                        </div>
                        <div class="dropDown-body" style="display: block">
                            <div class="content-main">
                                <div class="content-sub">
                                    <div class="content-right"><span class="textWrap">Finance Package </span></div>
                                    <div class="content-left">
                                        <select type="text" id="jogetFinancePackage" class="" name="" onchange="OnChangeFinancePackageSelection()">
                                            <option value="">Default</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="content-main">
                                <div class="content-sub">
                                    <div class="content-right"><span class="textWrap">Contract Particular</span></div>
                                    <div class="content-left">
                                        <input type="checkbox" class="resetcheck jogetPFS_App_list" id="app_CP" name="" value="" onclick="" disabled>
                                    </div>
                                </div>
                                <div class="content-sub content-sub-contract-level" style="display: none">
                                    <div class="content-right"><span class="textWrap">Contract Level </span></div>
                                    <div class="content-left">
                                        <select type="text" name="contract_level" id="contract_level">
                                            <option value="UPSTREAM">Upstream</option>
                                            <option value="DOWNSTREAM">Downstream</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="content-sub">
                                    <div class="content-right"><span class="textWrap">Interim Claim (IC)</span></div>
                                    <div class="content-left">
                                        <input type="checkbox" class="resetcheck jogetPFS_App_list" id="app_IC" name="" value="" onclick="" disabled>
                                    </div>
                                </div>
                                <div class="content-sub">
                                    <div class="content-right"><span class="textWrap">Variation Order (VO)</span></div>
                                    <div class="content-left">
                                        <input type="checkbox" class="resetcheck jogetPFS_App_list" id="app_VO" name="" value="" onclick="" disabled>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dropDownContainer" id="documentAppContainer">
                        <div class="dropDown-header">
                            <div class="oneLabel">
                                <span class="textEllipsis">Document App</span>
                            </div>
                            <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                        </div>
                        <div class="dropDown-body" style="display: block">
                            <div class="content-main">
                                <div class="content-sub">
                                    <div class="content-right"><span class="textWrap">Document Package</span></div>
                                    <div class="content-left">
                                        <select type="text" id="jogetDocPackage" class="" name="" onchange="OnChangeDocPackageSelection()">
                                            <option value="">Default</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="content-main">
                                <div class="content-sub">
                                    <div class="content-right"><span class="textWrap">Document Registration (DR)</span></div>
                                    <div class="content-left">
                                        <input type="checkbox" class="resetcheck jogetDoc_App_list" id="app_DR" name="" value="" onclick="" disabled>
                                    </div>
                                </div>
                                <div class="content-sub">
                                    <div class="content-right"><span class="textWrap">Correspondence (CORR)</span></div>
                                    <div class="content-left">
                                        <input type="checkbox" class="resetcheck jogetDoc_App_list" id="app_CORR" name="" value="" onclick="" disabled>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page addNewProject" data-page="3">
                    <div class="inputContent">
                        <div class="column-one">
                            <label class="">Project Start Date</label>
                            <br>
                            <input type="date" id="projectstartdate" name="projectstartdate">
                        </div>
                        <div class="column-two">
                            <label class="">Project End Date</label>
                            <br>
                            <input type="date" id="projectenddate" name="projectenddate" onchange="onchangeProjectOnDate()">
                        </div>
                    </div>
                    <div class="inputContent">
                        <div class="column-one single">
                            <label class="">Project Duration (days)</label>
                            <br>
                            <input type="number" id="projectduration" name="projectduration">
                        </div>
                    </div>';
                    if($SYSTEM == 'OBYU'){
                        echo '<div class="inputContent">
                        <div class="column-one single">
                            <label class="">Monthly Cut Off Days?</label>
                            <br>
                            <input type="number" id="projectcutoff" name="projectcutoff" value="25" min="1" max="31">
                        </div>
                    </div>';
                    }
                echo '</div>

                <div class="page addNewProject" data-page="4">
                    <div class="riContainer">
                        <div class="RIWindow">
                            <div id="RIContainer1" style="width: 100%; height:100%">
                            </div>
                        </div>
                    </div>
                    <div class="riCoordinateContainer">
                        <div class="instruction-container">
                            <span>Hold Shift + Left Click + <i class="fa-solid fa-computer-mouse"></i> to drag the rectangular.</span>
                            <div class="Header">Coordinate :</div>
                            <div class="content">
                                <div class="col1"><div>NW (Lat, Long)</div><div>SE (Lat, Long)</div></div>
                                <div class="col2"><div><span id="latit1"></span>,<span id="longit1"></span></div><div><span id="latit2"></span>,<span id="longit2"></div></div>
                                <div class="col3"><button onclick="OnClickClearMap()">Clear Map</button></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page addNewProject" data-page="5">
                    <div class="tableContent heightWizard">
                        <div class="headerContainer">
                            <span class="title font-default">User(s)</span>
                            <input class="searchContainer searchInput" id="temp1" placeholder="Search User" onkeyup="userProjectSearch(this)">
                        </div>
                        <div class="tablecontainer">
                            <div class="tableHeader system-admin fiveColumn">
                                <span class="columnSmall"><input type="checkbox" onchange="checkAllFormUsers(this)" id="toggleAllUser" data-tableclass="addusertable"></span>
                                <span class="columnMiddle">User Email</span>
                                <span class="columnMiddle">Name</span>
                                <span class="columnMiddle">Organisation</span>
                                <span class="columnMiddle">Country</span>
                                <span class="columnMiddle">Role</span>
                            </div>
                            <div class="tableBody" id="addUserTable">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page addNewProject" data-page="6">
                    <div style="display: flex; flex-direction: column; height: 100%">
                        <div class="tableContent heightWizard height50">
                            <div class="headerContainer">
                                <span class="title font-default">Contractor(s)</span>
                                <select id="contractorSelector" class="searchContainer noBackground" name="" multiple>
                                </select>
                            </div>
                            <div class="tablecontainer">
                                <div class="tableHeader system-admin fiveColumn">
                                    <span class="columnSmall"><input type="checkbox" onchange="checkAllFormContractorUsers(this)" id="toggleAllContractorUser"></span>
                                    <span class="columnMiddle">User Email</span>
                                    <span class="columnMiddle">Name</span>
                                    <span class="columnMiddle">Organisation</span>
                                    <span class="columnMiddle">Country</span>
                                    <span class="columnMiddle">Role</span>
                                </div>
                                <div class="tableBody">
                                    <div class="tableBody tableBodyFull" id="addContractorUserTableBody"></div>
                                </div>
                            </div>
                        </div>
                        <div class="tableContent heightWizard height50">
                            <div class="headerContainer">
                                <span class="title font-default">Consultant(s)</span>
                                <select id="consultantSelector" class="searchContainer noBackground" name="" multiple>
                                </select>
                            </div>
                            <div class="tablecontainer">
                                <div class="tableHeader system-admin fiveColumn">
                                    <span class="columnSmall"><input type="checkbox" onchange="checkAllFormConsultantUsers(this)" id="toggleAllConsultantUser"></span>
                                    <span class="columnMiddle">User Email</span>
                                    <span class="columnMiddle">Name</span>
                                    <span class="columnMiddle">Organisation</span>
                                    <span class="columnMiddle">Country</span>
                                    <span class="columnMiddle">Role</span>
                                </div>
                                <div class="tableBody">
                                    <div class="tableBody tableBodyFull" id="addConsultantUserTableBody"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                '.$addNewProjectPage7HTML.'

                <div class="page twoColumn addNewProject" data-page="'.$reviewPageIndex.'" id="newProjectDetails">
                    <div class="page-column left">
                        <div class="infoHeader-profile">
                            <label class="infoPicture" style="pointer-events: none">
                                <div class="infoProfilePic projectIcon"><img src="favicon.ico"></div>
                            </label>
                        </div>
                        <div class="readOnlyContent">
                            <div class="dropDownContainer">
                                <div class="dropDown-header">
                                    <div class="oneLabel">
                                        <span class="textEllipsis">Project Details</span>
                                    </div>
                                    <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                                </div>
                                <div class="dropDown-body" style="display:block">
                                    <div class="content-main">
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Project Name</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo projectName" id="projectnamedisplay"></span>
                                            </div>
                                        </div>
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Project ID</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo projectId" id="projectiddisplay"></span>
                                            </div>
                                        </div>
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Industry</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo projectIndustry" id="projectindustrydisplay"></span>
                                            </div>
                                        </div>
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Project Status</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo ProjectStatus" id="projectstatusdisplay">Active</span>
                                            </div>
                                        </div>
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Project Timezone</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo projectTimezoneText" id="projecttimezonedisplay"></span>
                                            </div>
                                        </div>
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Project Location</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo projectLocation" id="projectlocationdisplay"></span>
                                            </div>
                                        </div>
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Project Owner</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo projectOwner" id="projectownerdisplay"></span>
                                            </div>
                                        </div>';
                                        if($SYSTEM == 'KKR'){
                                            echo'
                                                <div class="content-sub" id="projectwpciddisplaycont" style="display: none">
                                                    <div class="content-right"><span class="textWrap">Project WPC ID</span></div>
                                                    <div class="content-left">
                                                        <span class="textWrap projectInfo projectWpcId" id="projectwpciddisplay"></span>
                                                    </div>
                                                </div>
                                                <div class="content-sub">
                                                    <div class="content-right"><span class="textWrap">Project Type</span></div>
                                                    <div class="content-left">
                                                        <span class="textWrap projectInfo projectType" id="projecttypedisplay"></span>
                                                    </div>
                                                </div>
                                                <div class="content-sub" id="projectregiondisplaycont" style="display: none">
                                                    <div class="content-right"><span class="textWrap">Project Region</span></div>
                                                    <div class="content-left">
                                                        <span class="textWrap projectInfo projectRegion" id="projectregiondisplay"></span>
                                                    </div>
                                                </div>';
                                        }
                                        echo'
                                        <div class="content-sub" id="projectphasedisplaycont" style="display: none">
                                            <div class="content-right"><span class="textWrap">Project Phase</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo  projectPhase" id="projectphasedisplay"></span>
                                            </div>
                                        </div>
                                        <div class="content-sub" id="projectwpcabbrdisplaycont" style="display: none">
                                            <div class="content-right"><span class="textWrap">WPC Abbrev</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo  projectWpcAbbr" id="projectwpcabbrdisplay"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropDownContainer">
                                <div class="dropDown-header">
                                    <div class="oneLabel">
                                        <span class="textEllipsis">Project Durations</span>
                                    </div>
                                    <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                                </div>
                                <div class="dropDown-body" style="display: block">
                                    <div class="content-main">
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Project Start Date</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo startDate" id="projectstartdatedisplay"></span>
                                            </div>
                                        </div>
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Project End Date</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo endDate" id="projectenddatedisplay"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="content-main">
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">Project Durations</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo duration" id="projectdurationdisplay"></span> Days
                                            </div>
                                        </div>';
                                        if($SYSTEM == 'OBYU'){
                                            echo '<div class="content-sub">
                                                    <div class="content-right"><span class="textWrap">Montly Cut Off (Days)</span></div>
                                                    <div class="content-left">
                                                        <span class="textWrap projectInfo cutoffday" id="projectcutoffdisplay"></span> Days
                                                    </div>
                                                </div>';
                                        }
                                    echo '</div>
                                </div>
                            </div>
                            <div class="dropDownContainer">
                                <div class="dropDown-header">
                                    <div class="oneLabel">
                                        <span class="textEllipsis">Project Coordinate</span>
                                    </div>
                                    <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                                </div>
                                <div class="dropDown-body" style="display: block">
                                    <div class="content-main">
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">North West (Lat, Long)</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo lat1" id="lat1"></span>, 
                                                <span class="textWrap projectInfo long1" id="long1"></span>
                                            </div>
                                        </div>
                                        <div class="content-sub">
                                            <div class="content-right"><span class="textWrap">South East (Lat, Long)</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo lat2" id="lat2"></span>, 
                                                <span class="textWrap projectInfo long2" id="long2"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropDownContainer" id="projectCreationContainer">
                                <div class="dropDown-header">
                                    <div class="oneLabel">
                                        <span class="textEllipsis">Project Creation</span>
                                    </div>
                                    <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                                </div>
                                <div class="dropDown-body" style="display: block">
                                    <div class="content-main">
                                        <div class="content-sub textAlignCenter">
                                            <div class="content-right"><span class="textWrap">Created By</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo createdBy"></span>, 
                                                <span class="textWrap projectInfo projectCreateTime"></span>
                                            </div>
                                        </div>
                                        <div class="content-sub textAlignCenter">
                                            <div class="content-right"><span class="textWrap">Last Update</span></div>
                                            <div class="content-left">
                                                <span class="textWrap projectInfo projectUpdateBy"></span>, 
                                                <span class="textWrap projectInfo projectUpdateTime"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="page-column right">
                        <div class="readOnlyContent no-profile-header">
                            <div class="dropDownContainer">
                                <div class="dropDown-header" id="applicationContainerID">
                                    <div class="oneLabel">
                                        <span class="textEllipsis">Application</span>
                                    </div>
                                    <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                                </div>
                                <div class="dropDown-body" style="display: block" id="appAssignContainerID">
                                    <div class="content-main table">
                                        <div class="content-sub fourColumn">
                                            <div class="content-section"><span class="textWrap paddingLeft"></span></div>
                                            <div class="content-section">
                                                <span class="textWrap" id="reviewAppTitle">Construct</span>
                                            </div>
                                            <div class="content-section">
                                                <span class="textWrap">Finance</span>
                                            </div>
                                            <div class="content-section">
                                                <span class="textWrap">Document</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="content-main table no-borderTop">
                                        <div class="content-sub fourColumn">
                                            <div class="content-section"><span class="textWrap paddingLeft">App</span></div>
                                            <div class="content-section borderTop" id="constructApp">
                                            </div>
                                            <div class="content-section borderTop" id="financeApp">
                                            </div>
                                            <div class="content-section borderTop" id="documentApp">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="content-main table">
                                        <div class="content-sub fourColumn">
                                            <div class="content-section content-width-one"><span class="textWrap paddingLeft">Process</span></div>
                                            <div class="content-section content-break" id="constructProccess"></div>
                                            <div class="content-section content-break content-width-two" id="financeProcess"></div>
                                            <div class="content-section content-break content-width-two" id="documentProcess"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropDownContainer">
                                <div class="dropDown-header">
                                    <div class="oneLabel">
                                        <span class="textEllipsis">Project Member(s)</span>
                                    </div>
                                    <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                                </div>
                                <div class="dropDown-body" style="display: block">
                                    <div class="tableContent">
                                        <div class="tablecontainer">
                                            <div class="tableHeader system-admin fourColumn" id="projectUserListHeader">
                                                <span class="columnMiddle">First Name</span>
                                                <span class="columnMiddle">Project Name</span>
                                                <span class="columnMiddle">System Role</span>
                                                <span class="columnMiddle">Group</span>
                                            </div>
                                            <div class="tableBody" id="projectUserList">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropDownContainer">
                                <div class="dropDown-header">
                                    <div class="oneLabel">
                                        <span class="textEllipsis">Project Area</span>
                                    </div>
                                    <i onclick="openDropDown(this)" class="fa-solid fa-minus opened dropDownList"></i>
                                </div>
                                <div class="dropDown-body" style="display: block">
                                    <div class="content-main table riContentContainer">
                                        <div class="content-sub riContainer" style="display: block; padding: unset">
                                            <div id="RIContainer2" style="height:100%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary" onclick="wizardNextPage(this)">Next</button>
                    <button class="editPage primary" onclick="wizardEditPage(this)">Edit</button>
                    <button class="savePage primary" onclick="onclickProjectSaveButton()">Save</button>
                    <button class="restorePage primary" onclick="onclickProjectRestoreButton()">Restore</button>
                    <button class="archivePage primary" onclick="OnClickProjectArchiveOrDeletePermanentButton(this)">Archive</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage(this)">Cancel</button>
                </div>
            </div>

            <div class="modal-container claimListUpload" rel="claimListUpload">
                <div data-page="1" class="page projectProcess">
                    <iframe class="bottom" id = "claimListUploadiFrame" src=""></iframe>
                </div>
            </div>

            <div class="modal-container manageAssetProj" rel="manageAssetProj">
                <div data-page="1" class="page projectList">
                    <div class="tableHeader wizard">
                        <span class="columnIndex"></span>
                        <span class="columnFirst">Project Name</span>
                        <span class="columnSecond">Last Update</span>
                        <div class="columnSecond">
                            <div class="searchContainer">
                                <input class="manageSearch" placeholder="Search Project" onkeyup="processSearchProject(this)"/>
                            </div>
                        </div>
                    </div>
                    <div class="tableBody">
                    '.$assetProcessPackageHTML.'
                    </div>
                </div>
                <div data-page="2" class="page projectProcess">
                    <div class="projectProcessSelect">
                    <div class="labelContainer"><span class="labelTitle labelWidth">Manage Asset Process</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption manageAssetOption" id="valueManageAsset1" onchange="manageAssetOnchange(this)">
                            </select>
                        </div>
                    </div>
                    <iframe class="bottom bottomContainer" id = "manageAssetIframe" src=""></iframe>
                </div>
                <div class="modal-footer">
                    <button class="backPage primary" onclick="wizardPrevPage(this)">Back</button>
                    <button class="nextPage primary"  onclick="wizardNextPage(this)">Next</button>
                    <button class="cancelPage secondary" onclick="wizardCancelPage(this)">Cancel</button>
                </div>
            </div>

            <div class="modal-container manageAsset" rel="manageAsset">
                <div data-page="1" class="page projectProcess">
                    <div class="projectProcessSelect">
                    <div class="labelContainer"><span class="labelTitle labelWidth">Manage Asset Process</span><span class="projectLabelName projectName projectPackageName"></span></div>
                        <div class="customOption">
                            <select type="text" class="selectOption manageAssetOption" id="valueManageAsset" onchange="manageAssetOnchange(this)">
                            </select>
                        </div>
                    </div>
                    <iframe class="bottom bottomContainer" id = "manageAssetIframe" src=""></iframe>
                </div>
            </div>
        </div>

        <div class="digitalContentModal">
            <button class="button" rel="digitalContentModal" onclick="closeDigitalModal(this)"><i class="fa-solid fa-xmark" style="color: white"></i></button>
            <div class="filterContainer">
                <select onchange="refreshDashboard()" id="filterYear" class="filter">';
                    foreach ($yearOptions as $year) {
                        echo '<option value="'.$year.'">'.$year.'</option>';
                    }
                    echo'
                </select>
                <select onchange="refreshDashboard()" id="filterMonth" class="filter">
                    <option value="Jan">January</option>
                    <option value="Feb">February</option>
                    <option value="Mar">March</option>
                    <option value="Apr">April</option>
                    <option value="May">May</option>
                    <option value="Jun">June</option>
                    <option value="Jul">July</option>
                    <option value="Aug">August</option>
                    <option value="Sep">September</option>
                    <option value="Oct">October</option>
                    <option value="Nov">November</option>
                    <option value="Dec">December</option>
                </select>
            </div>
            <div class="chartContainer">
                <div class="swiper-wrapper">';

                        if($_SESSION['user_org'] == 'KKR'){
                            if($projectManager && $_SESSION['proj_owner_swk'] == 1){
                                echo'<div class="swiper-slide sectionInfo" id="page-0">
                                    </div>';
                            }
                        }else{
                            if($projectManager && $owner == "JKR_SARAWAK"){
                                echo'<div class="swiper-slide sectionInfo" id="page-0">
                                    </div>';
                            }
                        }
                        echo' 
                    <div class="swiper-slide dashboardBody" id="page-1">
                        '.$layoutHTML.'
                    </div>';
                    if($SYSTEM == 'KKR'){
                        echo'
                        <div class="swiper-slide dashboardBody" id="page-2">
                            <button class="button maximize" rel="digitalContentModal" onclick="iframeFullScreen(this)" title="Fullscreen"><i class="fa-solid fa-expand fa-btn"></i></button>
                            <iframe class="layout twoRow iframeFullscreen" id="digRepIframe" style="width:calc(100% - 90px); left: 40px; cursor:default; border:none;" src = ""> 
                            </iframe>
                        </div>
                        <div class="swiper-slide dashboardBody" id="page-3">
                            <button class="button maximize" rel="digitalContentModal" onclick="iframeFullScreen(this)" title="Fullscreen"><i class="fa-solid fa-expand fa-btn"></i></button>
                            <iframe class="layout twoRow iframeFullscreen" id="digRepIframe2" style="width:calc(100% - 90px); left: 40px; cursor:default; border:none;" src = ""> 
                            </iframe>
                        </div>';
                    }
                    echo'
                </div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </div>

        <div class="pictureSlideModal active">
            <button class="button" rel="pictureSlideModal" onclick="closeDigitalModal(this)"><i class="fa-solid fa-xmark"></i></button>
            <div class="swiper imageContainer" style="display: flex;">
                <div class="swiper-button-prev2" onclick="prevImageModal()" style="opacity:0; display:flex; flex-direction:column; justify-content:center"><i class="fa-solid fa-chevron-left" style="color: var(--primary); cursor:pointer; font-size: xxx-large;"></i></div>
                <div class="swiper-wrapper" id = "imageTop">
                </div>
                <div class="swiper-button-next2" onclick="nextImageModal()" style="opacity:0; display:flex; flex-direction:column; justify-content:center"><i class="fa-solid fa-chevron-right" style="color: var(--primary); cursor:pointer; font-size: xxx-large;"></i></div>
            </div>
        </div>
    </div>

    <div id="ganttList" class="modal">
        <div class="modal-content">
            <span id="wizardClose" class ="closebuttonWizard" rel ="" onclick="wizardCancelPageGantt()">&times;</span>
            <span id="wizardMaximize" class ="maximizebutton" rel =""><img src="../Images/icons/form/maximize.png"></span>
            <div id="ganttHeader"><a>Gantt Chart</a></div>

            <div class="modal-container ganttList" style="display: block !important">
                <div class="ganttShow">
                    <div class="leftbar" id="scheduleDIV">
                        <div class="scheduleList">
                            <div class="selectcontainer">
                                <select id="scheduleType" onchange="changeSchedule()">';
                                    if ($SYSTEM == "KKR"){
                                        echo '<option>Baseline</option>';
                                    }
                            echo '<option>Weekly</option>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                </select>
                            </div>
                            <div id="scrollThisCont" class="scrollcontainer">
                                <ul id="scheduleListing">
                                </ul>
                            </div>
                        </div>

                        <div class="scheduleInfo">
                            <div class="flexContainer">
                            <div class="propcontainer">Schedule Properties</div>
                            <div class="buttonContainer adminGantt">
                                <button class="log" id="reviseschedule" style="display:none" onclick="reviseOnclick()">Revise</button>';
                                if($SYSTEM == 'OBYU'){
                                    echo'
                                    <button class="log" id="updateActualBtn" style="display:none">Update Actual</button>';
                                }
                                echo'
                            </div>
                            </div>
                            <div class="metadatacontainer">
                                <div class="doublefield">
                                    <div class="column1 first">
                                        Name
                                    </div>
                                    <div class="column2 first" title="Schedule name" id="scheduleName" >
                                    </div>
                                </div>
                                <div class="doublefield">
                                    <div class="column1">
                                        Version
                                    </div>
                                    <div class="column2" title="Schedule revision" id="scheduleRevision">
                                    </div>
                                </div>
                                <div class="doublefield">
                                    <div class="column1">
                                        Uploaded On
                                    </div>
                                    <div class="column2 title="Schedule upload date" id="scheduleUploadedDate"">
                                    </div>
                                </div>
                                <div class="doublefield">
                                    <div class="column1 last">
                                        Uploaded By
                                    </div>
                                    <div class="column2 last wordBreak" title="Schedule owner" id="scheduleOwner">
                                    </div>
                                </div>';

                                if($SYSTEM == 'OBYU'){
                                    echo '
                                    <div class="doublefield">
                                        <div class="column1 last">
                                            Physical Actual (%)
                                        </div>
                                        <div class="column2 last" title="Physical Actual (%)" id="physicalActTb">
                                        </div>
                                    </div>  
                                    <div class="doublefield">
                                        <div class="column1 last">
                                            Financial Actual (%)
                                        </div>
                                        <div class="column2 last" title="Financial Actual (%)" id="financialActTb">
                                        </div>
                                    </div> 
                                    ';
                                }

                            echo '    
                            </div>
                            <div class="filescontainer">
                                <ul id="revisionList">
                                    <li style="text-align: center;" onclick="viewRevisionSchedule(this)" title="Uploaded on Mon Jan 06 2020" data="3" value="Data/Projects/2/fasd.xml" class="">
                                        <div class="revinfo" title="More info here"></div>
                                        <a>Version 3</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="rightbar">
                        <div class="loadingcontainer-ganttChart" id = "loadingGanttChart" style="display:none">
                            <p id="loadingText">Loading...</p>
                        </div>
                        <!--<div id="gdiv"></div>-->
                        <iframe id="ganttView" style="width: 100%; height: 100%; border: unset"></iframe>
                        <div id="scheduleMessage" class="messagecontainer">
                            <p>No schedule found.</p>
                            <div class="adminGantt">
                                <p>Click to add your project Schedule.</p>
                                <button class ="log" id="newschedule" onclick="newScheduleGantt()">Add Schedule</button>';
                                if ($SYSTEM == 'OBYU'){
                                    echo'
                                    <div>
                                        <p>or</p>
                                        <button class ="log" id="newactual">Add/Update Actual Physical/Financial</button>
                                    </div>';
                                }
                                echo'
                            </div>
                        </div>
                        <div class="messagecontainer noProjectDate" style="display:none">
                            <p>Project Start date and End date is not specified.</p>
                            <p>Click the button below to add project Start and End date in Edit Project.</p>
                            <button class ="log editproject" onclick = "editProject()">Edit Project</button>
                        </div>

                        <div class="reviseContainer" style="display: none; width: 100%; height: 100%">
                            <div class="formcontainerMainBody" id="newScheduleContainer">';
                                if ($SYSTEM == 'OBYU'){
                                    $template_path = 'Templates/systemadmin/ConstructionSchedule_Sample.xml';
                                    if (file_exists($template_path)) {
                                        echo '<div>Schedule XML sample: <a href="'.$template_path.'" download>ConstructionSchedule_Sample.xml</a></div>';
                                    }
                                }
                                echo'
                                <label>Schedule Name</label>
                                <input type="text" id="schedulename" disabled>
                                <div class="doubleinput">
                                    <div class="column1">
                                        <Label>Schedule Type</Label><br>
                                        <input type="text" id="scheduletype" disabled>
                                    </div>
                                    <div class="column2">
                                        <label>File</label><br>
                                        <input type="file" name="xmlInp" id="xmlInp" accept=".xml">
                                    </div>
                                </div>
                                <div class="doubleinput">
                                    <div class="column1">
                                        <Label>Schedule Start Date</Label><br>
                                        <input type="date" id="scheduledatestart" disabled>
                                    </div>
                                    <div class="column2">
                                        <Label>Schedule End Date</Label><br>
                                        <input type="date" id="scheduledateend" disabled>
                                    </div>
                                </div>
                                <div class="revisioncontainer">
                                    <div class="doubleinput">
                                        <div class="column1">
                                            <label>Revision Number</label>
                                            <input type="text" id="revisionnumber" disabled>
                                        </div>
                                        <div class="column2">
                                            <label>Reason</label>
                                            <select id="revisionreason">';
                                                $sql = "SELECT * FROM RevReasonLookup";
                                                $stmt = sqlsrv_query($conn, $sql);
                                                if ($stmt === false) {
                                                    die(print_r(sqlsrv_errors(), true));
                                                }
                                                echo ' <option></option>';
                                                while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
                                                    echo ' <option value="' . $row['RevReasonID'] . '">' . $row['RevReasonDesc'] . '</option>';
                                                }
                                                echo'
                                            </select>
                                        </div>
                                    </div>
                                    <label>Remarks</label>
                                    <textarea id="revisionremarks"></textarea>
                                </div>
                            </div>
                            <div class="addscheduleFooter">
                                <div>
                                    <button id="saveSchedule" onclick="saveScheduleGantt()">Save</button>
                                    <button id="addschedulecancel" onclick="cancelScheduleGantt(this)">Close</button>
                                </div>
                            </div>';
                            
                                if ($SYSTEM == 'OBYU'){
                                echo'
                            <div class="formcontainerMainBody" id="physicalContainer" style="overflow-y:auto;">
                                    <h2>Physical</h2>
                                    <label>Overall (%)</label>
                                    <input type="number" id="physicalActualValue" min="1" max="100">
                                    <div class="sectionPhyActualContainer">
                                    </div>
                                    <h2>Financial</h2>
                                    <label>Overall (%)</label>
                                    <input type="number" id="financialActualValue" min="1" max="100">';
                                    if ($_SESSION['user_org'] == "KACC"){
                                        echo '<div class="sectionFinActualContainer"></div>';
                                    }
                                    echo'
                            </div>
                            <div class="addactualFooter">
                                <div>
                                    <button id="saveActual" onclick="saveActualValue()">Save</button>
                                    <button id="addactualcancel">Close</button>
                                </div>
                            </div>';
                                }
                                echo'
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mobileAppButton">
        <div class="mAppBtnContainer">
            <button><i class="fa-solid fa-earth-americas" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon);"></i>Insights</button>
            <button><i class="fa-solid fa-folder-open" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon);"></i>Document</button>
            <button><i class="fa-solid fa-coins" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon);"></i>Finance</button>
            <button><i class="fa-solid fa-gauge" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon);"></i>Dashboard</button>
            <button><i class="fa-solid fa-clipboard-list" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon);"></i>MyTask</button>
            <button><i class="fa-solid fa-user-tie" style="--fa-secondary-opacity: 0.6; --fa-primary-color: var(--icon); --fa-secondary-color: var(--icon);"></i>Admin</button>
            <button><i class="fa-solid fa-star" style="--fa-secondary-opacity: 1; --fa-primary-color: #dbdbdb; --fa-secondary-color: #dbdbdb; font-size:18px;"></i>Add as Favourite</button>
        </div>
    </div>

    <div id="bimModelList" class="modal">
        <div class="modal-content">
            <span id="wizardClose" class ="closebuttonWizard" rel ="" onclick="wizardCancelPageBimModel()">&times;</span>
            <span id="wizardMaximize" class ="maximizebutton" rel =""><img src="../Images/icons/form/maximize.png"></span>
            <div id="ganttHeader"><a id="bimModelHeader">Bim Models</a></div>

            <div class="modal-container" style="display: block !important">
                <div id = "datapreviewbimmodel" style="width: 100%;height: 300px; display:none;">
                </div>

               
                <div class="container-table">
                    <div id = "">
                        <div class="tableHeader summary fiveColumn">
                            <span class="M">Data Layer Name</span>
                            <span class="M">Data Type</span>
                            <span class="M">File name</span>
                            <span class="M">File Date</span>
                            <span class="M">Action</span>
                        </div>
                        <div class="tableBody summary" id="dataTable">
                        </div>

                        <div id="parkContainer">
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="print-me">
    </div>

    <div id="prodFlag" data-prodflag="'.$prodFlag.'"></div>

    <div class="loader '.$themeClass.' " style="display:none;" id="loaderHome">
        <div class="cube-wrapper">
            <div class="cube-folding">
                <span class="leaf1"></span>
                <span class="leaf2"></span>
                <span class="leaf3"></span>
                <span class="leaf4"></span>
            </div>
            <span class="loading" data-name="Loading">Working</span>
        </div>
    </div>
    
    <script src="../JS/DefineAreaExtent.js"></script>
    <script src="../JS/onClickFunctionv3.js"></script>
    <script src="../JS/v3.js"></script>
    <script src="../JS/onChangeFunctionv3.js"></script>
    <script src="../JS/jogetFunctionv3.js"></script>
    <script src="../JS/bootstrap.min.js"></script>
    <script src="../JS/contextLoader.min.js"></script>
    <script src= "../JS/CesiumFunctions.js"></script> 
    <script src= "../JS/insightv3.js"></script>                                  <!-- INSIGHT V3 -->
    <script src="../JS/uploader/resumablejs/resumable.js"></script>
    <script src = "../JS/uploader/videoUploaderv3.js"></script>
    <script src= "../JS/uploader/uploadv3.js"></script>
    <script src= "../JS/floatboxv3.js"></script>
    <script src= "../JS/Global.js"></script>
    <script src = "../JS/thematicv3.js"></script>
    <script src="../JS/markupToolsv3.js"></script> 
    <script src="../JS/schedulev3.js"></script>
    <script src="../JS/uploader/progressSummaryUploaderv3.js"></script>
    <script src="../JS/bulkImportConfigv3.js"></script>
    <script src="../JS/main.js"></script> <!-- Resource jQuery -->
    <script src="../JS/claimbimLinking.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js"></script> ';
    
    
    if(in_array($SYSTEM, ['KKR'])){
    echo
        '<script src = "../JS/asset/fwdAnalysis.js"></script> 
        <script src = "../JS/asset/mlpAnalysis.js"></script>';
    }
    echo    
    '<script src="../JS/dashboard/General/executiveManagement.js"></script>

    <script src = "../JS/swiper-bundle.min.js"></script>

    <script src="'.((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https' : 'http').'://code.highcharts.com/highcharts.js"></script>
    <script src = "../JS/dashboard/General/dashboard.js"></script>
</body> ';

?>
<script>
    var currMode = '<?php echo $_SESSION['theme_mode']; ?>';
    if (currMode == 'default'){
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            $("body").addClass("dark")
        }else{
            $("body").removeClass("dark")
        }
    }

    var prodFlag = '<?php echo $prodFlag; ?>';
    localStorage.inspectFlag = prodFlag;

    if(prodFlag == 'true'){
        document.addEventListener("contextmenu", function(event) {
            event.preventDefault();
        });
    
        document.addEventListener("keydown", function(event) {
            if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I") || (event.ctrlKey && event.shiftKey && event.key === "C") || (event.ctrlKey && event.shiftKey && event.key === "J")) {
                event.preventDefault();
            }
        });
    }

    // sample change this laterr
    const START_YEAR = 2019;
    // Get the current year dynamically
    const CURRENT_YEAR = new Date().getFullYear();
    const END_YEAR = CURRENT_YEAR; // Use the current year as the end year

    /**
     * Generates the <option> elements for the month/year range and appends
     * to the specified select element
     */
    function populateDateDropdown(selectElementId, placeholderText) {
        const selectElement = document.getElementById(selectElementId);

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.text = placeholderText;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        // 2. Loop through the years and months to create all options
        // The loop now goes up to the dynamically set END_YEAR (which is CURRENT_YEAR)
        for (let year = START_YEAR; year <= END_YEAR; year++) {

            // Determine the maximum month to loop up to
            // If it's the current year, only loop up to the current month.
            // Otherwise, loop through all 12 months.
            let maxMonth = 12;

            if (year === CURRENT_YEAR) {
                // Get the current month (0-indexed, so we add 1 for 1-12)
                maxMonth = new Date().getMonth() + 1;
            }

            for (let month = 1; month <= maxMonth; month++) {
                const monthString = String(month).padStart(2, '0');
                const dateValue = `${monthString}-${year}`;

                const option = document.createElement('option');
                option.value = dateValue;
                option.text = dateValue;

                selectElement.appendChild(option);
            }
        }
    }

    // Call the function for both dropdowns
    populateDateDropdown('from-date-js', 'Select a start month');
    populateDateDropdown('to-date-js', 'Select an end month');

</script>

<style type="text/css">
#print-chart-container {
    position: relative; /* REQUIRED: Anchor the overlay to this div */
}

/* 1. The Button Hover State */
#apply-filter:hover {
   /*  background-color: #172a4e !important; Changes button background */
    background: var(--primary);
    color: #ffffff !important;              /* Changes text color */
    border-color: #172a4e !important;
    cursor: pointer;
    transition: all 0.3s ease;             /* Makes the change smooth */
    
}

/* 2. The Icon Hover State (Targeting your custom class) */
#apply-filter:hover .printClassHehe {
    color: #f4f4f4ff !important; /* Changes icon color (if it's a font) */
    fill: #f4f4f4ff !important;  /* Changes icon color (if it's an SVG) */
    transition: all 0.3s ease;
    
}

#chart-loading-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 780px;
    height: 580px;
    transform: translate(-50%, -50%); /* Pulls the element back by half its width/height */
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* If using Font Awesome for the spinner */
.fa-spin {
    margin-right: 10px;
}
</style>
