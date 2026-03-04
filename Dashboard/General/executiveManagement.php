<?php

require "../../login/include/_include.php";

include_once dirname(__DIR__).'\General\dashboard_executive.class.php';
$dashObj = new ExecDashboard();
$divisionHTML = $dashObj->getDivisionHTML();
$layoutHTML = $dashObj->drawDashboardLayout();

include_once dirname(__DIR__).'\..\BackEnd\class\jogetLink.class.php';
$constructLinkObj = new JogetLink();
$constructLinkObj->setToGlobalJSVariable();
global $CONN, $projectManager;

$projectManager = isset($_SESSION['digitalReporting_projectManager']) ? $_SESSION['digitalReporting_projectManager'] : $projectManager;

$owner = $dashObj->projectOwner;
$lastMonth = date('F Y', strtotime("first day of last month"));
$titleDigitalReporting = ($owner == "JKR_SABAH") ? '<b style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">Monthly Reporting as of '.$lastMonth.'</b> ' : '<b style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">Monthly Reporting</b> ';

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$yearOptions = array();
$currYear = date("Y");

$yr = $currYear;
for ($i=0; $i < 5 ; $i++) { 
    $yearOptions[] = $yr--; 
}

echo '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">    
        <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css"> 
        <link rel="stylesheet" href="../../CSS/swiper-bundle.css">
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <link rel="stylesheet" href="../../JS/JsLibrary/jquery-confirm.min.css">
        <link rel="stylesheet" href="../../JS/JsLibrary/jquery-ui.css"> 
        <link rel ="stylesheet" href ="../../CSS/tooltip1.css" type ="text/css" />
        <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>                <!--     JS for jquery-->
        <script src="../../JS/JsLibrary/jogetUtil.js" ></script>
        <script src="../../JS/JsLibrary/mixitup.min.js"></script>
        <script src="../../JS/fontawesome.js"></script>
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>
        <script src="../../JS/JsLibrary/jquery-ui.js"></script>
        <script src="../../JS/JsLibrary/jquery-confirm.min.js"></script>
        <script src = "../../JS/swiper-bundle.min.js"></script>
        <link rel="stylesheet" href="../../CSS/swiper-bundle.css">

    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class = "dashboardHeaderExec">
            <div class="navbar-menu" id="appsbar-menu" title="Menu Bar"><i class="fa-solid fa-grid"></i></div>
            <span class="title" style="display:flex; align-items: center; overflow: hidden">'.$titleDigitalReporting.'</span>
            <div class="filterContainer">
                <div class="btn-container">
                    <button class="sort-btn asc" data-sort="name:desc"><i class="fa-duotone fa-sort-up"></i> <span>Package Name</span></button>
                    <button class="sort-btn desc" data-sort="name:asc" style="display: none"><i class="fa-duotone fa-sort-down"></i> <span>Package Name</span></button>
                    <button class="sort-btn asc" data-sort="start-date:desc"><i class="fa-duotone fa-sort-up"></i> <span>Start Date</span></button>
                    <button class="sort-btn desc" data-sort="start-date:asc" style="display: none"><i class="fa-duotone fa-sort-down"></i> <span>Start Date</span></button>
                    <button class="sort-btn asc" data-sort="contract-amount:desc"><i class="fa-duotone fa-sort-up"></i> <span>Contract Amount</span></button>
                    <button class="sort-btn desc" data-sort="contract-amount:asc" style="display: none"><i class="fa-duotone fa-sort-down"></i> <span>Contract Amount</span></button>
                </div>
                
                <button class="btn filter-expand max"><i class="fa-regular fa-solid fa-arrows-to-line"></i></button>
                <input onkeyup ="homeSearchProject(this)" placeholder="Search...">
                <button class="filter-sort-btn" onclick="closeFilterList()"><i class="fa-sharp fa-solid fa-filter-list"></i></button>
            </div>
        </div>
        <div class="appsbar-exec">';
        echo (isset ($_SESSION['project_list'])&& ($_SESSION['project_list'])) ? '<div class="appscontainer-exec" style="display: block">':'<div class="appscontainer-exec" style="display: none">';
        echo'
                <div class="title">Project</div>
                <div class="projectcontainer-exec scrollbar-inner">
                    <div class="appsbutton-exec grid-one">
                        <button id="switchProject"><span class="img"><img src="../../Images/icons/appsbar/switchproject.ico"></span><span class="atag"><a>Switch Project</a></span></button>
                    </div>
                </div>
            </div>
            <div class="appscontainer-exec bottom">
                <div class="appsbutton-exec grid-one">
                    <button type = "submit" id="signOut" name="signOut" class="log-out" onclick = "digitalReportLogout()"><span class="img"><i class="fa-solid fa-door-open"></i></span><span class="atag"><a>Sign Out</a></span></button>
                </div>
            </div>
        </div>
        
        <div class = "dashboardBodyExec">
            '.$divisionHTML.'
        <div class="digitalContentModal">
            <button class="button" rel="digitalContentModal" onclick="closeDigitalModal(this)"><i class="fa-solid fa-xmark"></i></button>
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
                    if($projectManager && $owner == "JKR_SARAWAK"){
                        echo'<div class="swiper-slide sectionInfo" id="page-0">
                            </div>';
                    }
                    echo'   
                    <div class="swiper-slide dashboardBody" id="page-1">
                        <div class="layout twoRow" id="lOne" style="width:calc(100% - 85px); height:calc(100% - 40px); cursor: default; margin: 0 40px;"> 
                            '.$layoutHTML.'
                        </div>
                    </div>';
                    if($SYSTEM == 'KKR'){
                        echo'
                        <div class="swiper-slide dashboardBody" id="page-2">
                            <iframe class="layout twoRow" id="digRepIframe" style="width:calc(100% - 90px); left: 40px; cursor:default; border:none;" src = ""> 
                            </iframe>
                        </div>
                        <div class="swiper-slide dashboardBody" id="page-3">
                            <iframe class="layout twoRow" id="digRepIframe2" style="width:calc(100% - 90px); left: 40px; cursor:default; border:none;" src = ""> 
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
            <div class="swiper imageContainer">
                <div class="swiper-wrapper" id = "imageTop">
                </div>
                <div class="swiper-pagination2"></div>
                <div class="swiper-button-next2"></div>
                <div class="swiper-button-prev2"></div>
            </div>
        </div>

		<script src="'.((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https' : 'http').'://code.highcharts.com/highcharts.js"></script>
        <script src = "../../JS/dashboard/General/dashboard.js"></script>
        <script src ="../../JS/tooltip.js"></script>
    </body>
    <script src="../../JS/dashboard/General/executiveManagement.js"></script>
</html>
';
?>

<style type="text/css">
    body{
        background-color: #E5E5E5 !important;
    }
    .fontSize{
        font-size: 15px;
        text-align: center;
    }
    #viewImageJoget{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        overflow-y: auto;
    }
    #imageTop{
        cursor: grab;
    }
    .dashboardBody .twoRow .rowOne-T{
        width: 100% !important;
        background: #003c8f;
        height: 30px;
        line-height: 30px;
        color: white;
        text-align: center;
        overflow: hidden;
        font-size: 14px;
        font-weight: bold;
    }
    .dashboardBody .twoRow .rowTwo-T{
        font-size: 15px;
        width: 100% !important;
        background: rgba(255, 255, 255, 0.8196078431);
        height: calc(100% - 30px);
    }

    td{
        text-align: left;
        padding: 10px 5px;
        border: none;
        font-size: .75rem;
    }

    button:fullscreen{
        background: pink;
    }

    #fileProgress > tr > td >img{
        width: 18px;
    }

    .dashboardBody .infoContainer .head{
        color: white;
        line-height: 20px;
        font-size: 14px;
        padding: 5px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-weight: bold;
    }
    .white-bg{
        background-color: white !important;
    }
    .btn-full-screen{
        width: 2rem;
        font-size: 1rem;
        background-color: transparent;
        border: unset;
        position: absolute;
        right: 0px;
        top: 0.4rem;
        background: transparent;
        padding: 1px 6px;
    }
    .btn-full-screen:hover{
        cursor: pointer;
    }
    span.description{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .text-ellipsis{
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .body-height{
        height: 22px !important;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .no-data{
        color: #4572A7;
        align-items: center;
        justify-content: center;
        height: calc(100% - 10px);
        text-align: center;
        display: flex
    }

    .tabContainer{
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 0px;
        padding: 0 2px
    }
    .swiper-pagination-bullet {
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        color: #000;
        opacity: 1;
        background: rgba(0, 0, 0, 0.2);
    }

    .swiper-pagination-bullet-active {
        color: #fff;
        background: #007aff;
    }

    .gridColumn{
        width: calc(100% - 10px) !important;
        display: grid !important;
        overflow-y: auto !important;
        grid-template-rows: calc(80vh - 50px) !important;
    }

    .digitalContentModal .chartContainer .dashboardBody .twoRow .rowTwo-T {
        font-size: 15px;
        width: calc(100% - 20px) !important;
        height: calc(100% - 40px);
        overflow: auto;
        padding: 5px 10px;
    }

    #insert-nofile{
        width: 100%!important;
    }

    #fileProgressHead tr{
        background: #003c8f;
        color: white;
    }
</style>

<!-- <script>
    var username = "<?php echo $dashObj->email;?>";
	var password = "<?php echo $dashObj->password;?>";
	var jogetHost = "<?php echo $dashObj->jogetHost."jw";?>";
	$(document).ready(function(){
		var loginCallback = {
			success : function(response){
				if(response.username != "roleAnonymous" && response.username == username){
				}
                else{
                    $.confirm({
                        boxWidth: "30%",
                        useBootstrap: false,
                        title: "Fail Retrieve Data",
                        content: "Please try again, if persist please contact support",
                        buttons: {
                            Refresh: function () {
                                location.reload();
                                return;
                            },
                            Logout: function () {
                                $("#signOut").trigger("click")
                                return;
                            }
                        },
                    });
                }
			},
			error: function(response){
				$.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Fail Retrieve Data",
                    content: "Please try again, if persist please contact support",
                    buttons: {
                        Refresh: function () {
                            location.reload();
                            return;
                        },
                        Logout: function () {
                            $("#signOut").trigger("click")
                            return;
                        }
                    },
                });
            }
		};
        //log out of joget before login to sync with the RI session timeout
        async function logoutLogin(){
            await AssignmentManager.logout(jogetHost);
            AssignmentManager.login(jogetHost, username, password, loginCallback);
        }
        logoutLogin();
		// AssignmentManager.logout(jogetHost);
		// AssignmentManager.login(jogetHost, username, password, loginCallback);
		
	});
</script> -->