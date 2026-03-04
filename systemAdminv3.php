<?php
if (session_status() == PHP_SESSION_NONE) session_start();
$showHeader = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
}
global $_SESSION, $SYSTEM;

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

include_once("BackEnd/class/jogetLink.class.php");
include_once('BackEnd/cesiumTokenFunctions.php');

$constructLinkObj = new JogetLink();
$constructLinkObj->setToGlobalJSVariable();

$ownerIdColumnHTML = '';
if($SYSTEM == 'OBYU'){
    $ownerIdColumnHTML = '<span class="columnMiddle">Owner ID</span>';
}

$mapBoxTokens = getCesiumTokenList();
$mapTilerTokens = getCesiumTokenList('mapTiler');

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="CSS/V3/dashboard.css">           <!--     CSS for dashboard CSS-->
        <link rel="stylesheet" href="CSS/V3/systemAdmin.css">           <!--     CSS for dashboard CSS-->
        <link rel="stylesheet" href="CSS/V3/Wizard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="JS/JsLibrary/jquery-confirm.min.css">
        <link rel="stylesheet" href="CSS/jquery.scrollbar.css">
        <script src="JS/JsLibrary/jquery-3.5.1.js"></script>          <!--     JS for jquery-->
        <script src="JS/JsLibrary/jquery.scrollbar.js"></script>
        <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/all.min.css">
        <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/fontawesome.min.css">
        <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/solid.min.css">
        <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/regular.min.css">
        <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/brands.min.css">

        <!-- <script type="text/javascript" src="JS/fontawesome.js"></script> -->
        <script src="JS/JsLibrary/jquery-confirm.min.js"></script>
		<script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </head>
    <body class='.$themeClass.'>
        <div id="dashboard-system-admin" class = "dashboardBody" style="display: block">
            <div class="layout oneRow" id="lOne">
                <div class="rowOne M twoColumn">
                    <div class="columnOne M twoRow">
                        <div class="rowOne M round background twoColumn">
                            <div class="columnOne SM">
                                <div class="contentContainer flex">
                                    <p class="menuTitle">User</p>
                                    <div class="labelContainer" id="activeUser" rel="main-active-user" onclick="closeAllMain(this), openDivSysAdmin(this)">
                                        <i class="fa-solid fa-user-check"></i>
                                        <div>Active User</div>
                                    </div>
                                    <div class="labelContainer" id="inactiveUser" rel="main-inactive-user" onclick="closeAllMain(this), openDivSysAdmin(this)">
                                        <i class="fa-solid fa-user-xmark"></i>
                                        <div>Inactive User</div>
                                    </div>
                                    <a class="labelContainer textDeco" href="Templates/systemadmin/Import User Template.csv" download="">
                                        <i class="fa-solid fa-file-import"></i>
                                        <div>Import User Template File</div>
                                    </a>
                                </div>
                            </div>
                            <div class="columnTwo ML">
                                <div class="contentContainer" id="userDataContainer">
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M round background twoColumn">
                                <div class="columnOne SM">
                                    <div class="notiContainer" id="warnHTML">
                                        <div class="notiLabel">
                                            <span class="notiSmallLabel"><i class="fa-solid fa-clock"></i><i class="fa-solid fa-circle small"></i>
                                                Duration
                                            </span>
                                            <span>11 Projects not set with project duration</span>
                                        </div>
                                        <div class="notiLabel">
                                            <span class="notiSmallLabel"><i class="fa-solid fa-question"></i><i class="fa-solid fa-circle small"></i>
                                                Missing
                                            </span>
                                            <span>11 Projects are missing</span>
                                        </div>
                                        <div class="notiLabel">
                                            <span class="notiSmallLabel"><i class="fa-solid fa-users"></i><i class="fa-solid fa-circle small"></i>
                                                User
                                            </span>
                                            <span>11 Projects with no user defined</span>
                                        </div>
                                        <div class="notiLabel">
                                            <span class="notiSmallLabel"><i class="fa-solid fa-gears"></i><i class="fa-solid fa-circle small"></i>
                                                Admin
                                            </span>
                                            <span>11 Projects has no admin</span>
                                        </div>
                                    </div>
                                <div class="contentContainer flex">
                                    <p class="menuTitle">Project <i id="notiMessage" class="fa-solid fa-exclamation alert"></i></p>
                                    <div class="labelContainer" id="activeProject" rel="main-active-project" onclick="closeAllMain(this), openDivSysAdmin(this)">
                                        <i class="fa-solid fa-file-circle-check"></i>
                                        <div>Active Projects</div>
                                    </div>
                                    <div class="labelContainer" id="archivedProject" rel="main-archived-project" onclick="closeAllMain(this), openDivSysAdmin(this)">
                                    <i class="fa-solid fa-file-lines"></i>
                                        <div>Archived Projects</div>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo ML">
                                <div class="contentContainer" id="projectDataContainer">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M twoRow">
                        <div class="rowOne M round background">
                            <div class="contentContainer flex">
                                <p class="menuTitle">Account</p>
                                <div class="flexColumn">
                                    <div class="flexRow">
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-user"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Name</span>
                                                <span class="textWrap" id="lic_accountName"></span>
                                            </div>
                                        </div>
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-fingerprint"s></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">ID</span>
                                                <span class="textWrap" id="lic_accountId"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flexRow">
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-address-book"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Contact Person Name</span>
                                                <span class="textWrap" id="lic_accountContact"></span>
                                            </div>
                                        </div>
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-envelope"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Contact Person Email</span>
                                                <span class="textWrap" id="lic_accountEmail"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flexRow">
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-phone"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Contact Person Number</span>
                                                <span class="textWrap" id="lic_accountNumber"></span>
                                            </div>
                                        </div>
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-briefcase"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Contact Person Position</span>
                                                <span class="textWrap" id="lic_accountPosition"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M round background marginTop">
                            <div class="contentContainer flex">
                                <p class="menuTitle">License</p>
                                <div class="flexColumn">
                                    <div class="flexRow">
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-file-contract"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">License Type</span>
                                                <span class="textEllipsis" id="lic_licenseType"></span>
                                            </div>
                                        </div>
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-globe"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Hosting Type</span>
                                                <span class="textEllipsis" id="lic_hostingType"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flexRow">
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-calendar-plus"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">License Start</span>
                                                <span class="textEllipsis" id="lic_licenseStart"></span>
                                            </div>
                                        </div>
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-hourglass-half"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">License Duration</span>
                                                <span class="textEllipsis" id="lic_licenseDuration"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flexRow">
                                        <div class="w50 labelContainer disabled">
                                            <i class="fa-solid fa-calendar-xmark"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">License End</span>
                                                <span class="textEllipsis" id="lic_licenseEnd"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="system-page">
            <div id="main-active-user">
                <div class="main-header margin-bottom">
                    <span class="titleLabel">Active Users</span>
                    <div class="searchTable">
                        <div class="details-container user-active"><span class="counter"></span> Selected User(s)</div>
                        <button class="circle user-active" title="Archived User" onclick="archiveUsers()"><i class="fa-solid fa-box-archive"></i></button>
                        <input type="text" id="" class="searchInput" rel="" placeholder="Search..." onkeyup = "searching(this)"> 
                    </div>
                </div>
                <div class="container-table">
                    <div class="table-content">
                        <div class="tableHeader system-admin fiveColumn">
                            <span class="columnSmall"><input class="utable-header user-active" type ="checkbox" data-page="user-active" data-table="utable" onchange ="onchangeButtonVisibility(this)"></span>
                            <span class="columnMiddle">Email</span>
                            <span class="columnMiddle">Name</span>
                            <span class="columnMiddle">Organisation</span>
                            <span class="columnMiddle">Country</span>
                            <span class="columnMiddle">User Type</span>
                            <span class="columnMiddle">Support User</span>
                        </div>
                        <div class="tableBody" id="userTableBody">
                        </div>
                    </div>
                </div>
            </div>
            <div id="main-inactive-user">
                <div class="main-header margin-bottom">
                    <span class="titleLabel">Inactive Users</span>
                    <div class="searchTable">
                        <div class="details-container user-inactive"><span class="counter"></span> Selected User(s)</div>
                        <button class="circle user-inactive" title="Recover User" onclick="recoverUsers()"><i class="fa-solid fa-recycle"></i></button>
                        <button class="circle user-inactive" title="Delete User" onclick="deleteUsers()"><i class="fa-solid fa-trash-can"></i></button>
                        <input type="text" id="" class="searchInput" rel="" placeholder="Search..." onkeyup = "searching(this)"> 
                    </div>
                </div>
                <div class="container-table">
                    <div class="table-content">
                        <div class="tableHeader system-admin fourColumn">
                            <span class="columnSmall"><input class="utable-header user-inactive" id="checkAllArchivedUsers" type ="checkbox" data-page="user-inactive" data-table="utable" onchange ="onchangeButtonVisibility(this)"></span>
                            <span class="columnMiddle">Email</span>
                            <span class="columnMiddle">Name</span>
                            <span class="columnMiddle">Organisation</span>
                            <span class="columnMiddle">Country</span>
                        </div>
                        <div class="tableBody" id="deleteUserTableBody">
                        </div>
                    </div>
                </div>
            </div>
            <div id="main-active-project">
                <div class="main-header">
                    <span class="titleLabel">Active Projects</span>
                    <div class="searchTable">
                        <div class="details-container project-active delete"><span class="counter">0</span> Selected Project(s)</div>
                        <button class="circle project-active delete" title="Archived Project" onclick="OnClickSysadminDeleteProject()"><i class="fa-solid fa-box-archive"></i></button>
                        <button class="circle project-active show" title="Show All Project" onclick="openDivSysAdmin(this)" rel="main-active-project"><i class="fa-solid fa-eye"></i></button>
                        <input type="text" id="" class="searchInput" rel="" placeholder="Search..." onkeyup = "searching(this)"> 
                    </div>
                </div>
                <div class="container-content">
                    <div class="container-table column-left">
                        <div class="table-title">Project(s)</div>
                        <div class="table-content">
                            <div class="tableHeader system-admin fiveColumn">
                                <span class="columnSmall"><input class="ptable-header project-active activeProjectTable" data-page="project-active" data-table="ptable" type="checkbox" id="checkAllProjects" onchange ="onchangeButtonVisibilityProject(this)"></span>
                                <span class="columnSmall"></span>
                                <span class="columnMiddle">Project ID</span>
                                <span class="columnMiddle">Project Name</span>
                                <span class="columnMiddle">Industry</span>
                                <span class="columnMiddle">Location</span>'
                                .$ownerIdColumnHTML.
                                '<span class="columnMiddle">Members</span>
                            </div>
                            <div class="tableBody tableBody-title" id="activeProjectTable">
                            </div>
                        </div>
                    </div>
                    <div class="container-table column-right">
                        <div class="table-title">Package(s)</div>
                        <div class="table-content">
                            <div class="tableHeader system-admin fiveColumn">
                                <span class="columnSmall"><input class="ptable-header project-active activePackageTable" data-page="project-active" data-table="ptable" type="checkbox" id="checkAllPackage" onchange="onchangeButtonVisibilityProject(this)"></span>
                                <span class="columnSmall"></span>
                                <span class="columnMiddle">Package ID</span>
                                <span class="columnMiddle">Package Name</span>
                                <span class="columnMiddle">Industry</span>
                                <span class="columnMiddle">Location</span>'
                                .$ownerIdColumnHTML.'
                                <span class="columnMiddle">Members</span>
                            </div>
                            <div class="tableBody tableBody-title" id="activePackageTable">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="main-archived-project">
                <div class="main-header">
                    <span class="titleLabel">Archived Projects</span>
                    <div class="searchTable">
                        <div class="details-container project-inactive delete"><span class="counter"></span> Selected Project(s)</div>
                        <button class="circle project-inactive delete" title="Recover Project" onclick="OnClickSysadminRecoverProjects()"><i class="fa-solid fa-recycle"></i></button>
                        <button class="circle project-inactive delete" title="Delete Project" onclick ="OnClickSysadminDeletePermanentProjects()"><i class="fa-solid fa-trash-can"></i></button>
                        <button class="circle project-inactive show" title="Show All Project" onclick ="openDivSysAdmin(this)" rel="main-archived-project"><i class="fa-solid fa-eye"></i></button>
                        <input type="text" id="" class="searchInput" rel="" placeholder="Search..." onkeyup = "searching(this)"> 
                    </div>
                </div>
                <div class="container-content">
                    <div class="container-table column-left">
                        <div class="table-title">Project(s)</div>
                        <div class="table-content">
                            <div class="tableHeader system-admin fiveColumn">
                                <span class="columnSmall"><input class="deleteptable-header project-inactive deleteProjectTableBody" data-page="project-inactive" data-table="deleteptable" type="checkbox" id="checkAllDeletedProjects" onchange ="onchangeButtonVisibilityProject(this)"></span>
                                <span class="columnSmall"></span>
                                <span class="columnMiddle">Project ID</span>
                                <span class="columnMiddle">Project Name</span>
                                <span class="columnMiddle">Industry</span>
                                <span class="columnMiddle">Location</span>'
                                .$ownerIdColumnHTML.'
                                <span class="columnMiddle">No. of Members</span>
                            </div>
                            <div class="tableBody tableBody-title" id="deleteProjectTableBody">
                            </div>
                        </div>
                    </div>

                    <div class="container-table column-right">
                        <div class="table-title">Package(s)</div>
                        <div class="table-content">
                            <div class="tableHeader system-admin fiveColumn">
                                <span class="columnSmall"><input class="deleteptable-header project-inactive deletePackageTableBody" data-page="project-inactive" data-table="deleteptable" type="checkbox" id="checkAllDeletedPackage" onchange ="onchangeButtonVisibilityProject(this)"></span>
                                <span class="columnSmall"></span>
                                <span class="columnMiddle">Package ID</span>
                                <span class="columnMiddle">Package Name</span>
                                <span class="columnMiddle">Industry</span>
                                <span class="columnMiddle">Location</span>'
                                .$ownerIdColumnHTML.'
                                <span class="columnMiddle">No. of Members</span>
                            </div>
                            <div class="tableBody tableBody-title" id="deletePackageTableBody">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="main-tokenmgmt-project">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div class="main-header">
                        <span class="titleLabel">Manage Tokens</span>
                    </div>      
                    <div style="display: flex; align-items: center;">
                        <button class="addTokenBtn" type="button" id="showTokenFormBtn" style="width: 120px; margin-bottom: 10px; height:30px; border: none; border-radius: 5px; background-color: #2f3e5a; color: white;">Create Token</button>
                    </div>
                </div>
                <div id="token-mgmt-table">
                    <div class="token-mgmt-container-content">
                        <div class="container-table">
                            <div class="main-header" style="background-color: #e1e2e1; padding-top: 10px; padding-left:12px; border-radius: 0px;">
                                <span class="titleLabel">MapBox</span>
                            </div>
                            <div class="token-table-content" id="mapBoxTbl" style="height:100%; min-height:35%; overflow-y: auto; overflow-x: hidden;">
                                <div class="tableHeader system-admin">
                                    <span class="radColumn" style="margin-top: auto; margin-bottom: auto;"></span>
                                    <span class="idColumn">ID</span>
                                    <span class="tokenColumn">Token</span>
                                    <span class="otherColumn">Type</span>
                                    <span class="otherColumn">Created By</span>
                                    <span class="otherColumn">Date Created</span>
                                    <span class="actionColumn"></span>
                                </div>
                                '.$mapBoxTokens.'
                            </div>
                            <div class="main-header" style="background-color: #e1e2e1; margin-top: 10px; padding:0px 12px; 0px 12px;">
                                <span class="titleLabel">MapTiler</span>
                            </div>
                            <div class="token-table-content" id="mapTilerTbl" style="height:100%; min-height:35%; overflow-y: auto; overflow-y: auto; overflow-x: hidden;">
                                <div class="tableHeader system-admin">
                                    <span class="radColumn" style="margin-top: auto; margin-bottom: auto;"></span>
                                    <span class="idColumn">ID</span>
                                    <span class="tokenColumn">Token</span>
                                    <span class="otherColumn">Type</span>
                                    <span class="otherColumn">Created By</span>
                                    <span class="otherColumn">Date Created</span>
                                    <span class="actionColumn"></span>
                                </div>
                                '.$mapTilerTokens.'
                            </div>
                        </div>
                    </div>
                </div>
                <div id="token-mgmt-form" style="display: none;">
                    <div class="token-mgmt-container-content" style="height:100%; border-radius: 10px;">
                        <div class="container-form" style="height: calc(100% - 20px); margin: 0px 10px;">
                            <h4  style="padding-top: 30px;">Create Cesium Token</h4>
                            <div class="token-mgmt-fields" style="display: flex; flex-direction: column; gap: 20px; height: 100%;">
                                <div class="input-group" style="display: flex; flex-direction: column; gap: 10px; max-width: 60%;">
                                    <label for="tokenType">Token Type</label>
                                    <select id="tokenType" onchange="onchangeTokenType(this)" style="padding: 5px; border-radius: 5px; border: 1px solid gray;">
                                        <option value="mapbox">Map Box</option>
                                        <option value="maptiler">Map Tiler</option>
                                    </select>
                                </div>
                                <div class="input-group" style="display: flex; flex-direction: column; gap: 10px; max-width: 60%;">
                                    <label for="tokenInput">Token</label>
                                    <textarea id="tokenInput" style="padding: 5px; border-radius: 5px; border: 1px solid gray; height: 80px; resize: none;"></textarea>
                                </div>
                                <div class="input-group" style="display: flex; flex-direction: column; gap: 10px; max-width: 60%;">
                                    <label for="tokenInput">Use Token?</label>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <input type="radio" class="useToken" name="useToken" value="yes">
                                        <label for="useTokenYes">Yes</label>
                                        <input type="radio" class="useToken" name="useToken" value="no" checked>
                                        <label for="useTokenNo">No</label>
                                    </div>
                                </div>
                                <div class="container-form-footer" style="display: flex; align-items: center; justify-content:end; gap: 8px; max-width: 60%;">
                                    <button class="addTokenBtn" type="button" id="createTokenBtn" style="margin-bottom: 10px; height:30px; border: none; border-radius: 5px; background-color: #2f3e5a; color: white;">Create</button>
                                    <button class="addTokenBtn" type="button" id="hideTokenFormBtn" style="margin-bottom: 10px; height:30px; border: none; border-radius: 5px; background-color: gray; color: white;">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="JS/sysadminv3.js"></script>
    </body>
</html>';

echo $html;

?>

<style type="text/css">
    .main-div {
        height: 100%;
    }

    .white {
        background: white !important;
    }

    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .marginTop{
        margin-top: 10px !important;
    }

    #showTokenFormBtn:hover {
        cursor: pointer;
    }
</style>