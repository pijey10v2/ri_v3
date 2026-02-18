<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('quality');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$showHeader = true;
$showFilter = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
}
if (isset($_GET['noFilter']) && $_GET['noFilter'] == 1) {
    $showFilter = false;
}

$prefix = '';
if($_SESSION['ui_pref'] == "ri_v2"){
    $prefix = '../../../../../';
}

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">';
if($showFilter){
    $html .= '<link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->';
}else{
    $html .= '<link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/V3/dashboard.css"> ';
}
    $html .=
        '<link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/scrollBarCollapse.css">
        <script src="../../'.$dashObj->pathRel.'JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src ="../../'.$dashObj->pathRel.'JS/scrollBarCollapse.js"></script>      
    </head>
    <body class="pastelGreen '.$themeClass.'">';
if($showFilter){
    $html .=
        '<div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>';
}
if($showHeader){
    $html .=
        '<div class = "dashboardHeader green">
            <div class = "title">
                <h4>Safety, Health & Environment Dashboard</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ='.$prefix.''.$dashObj->projectInfo['icon_url'].'>
            </div>
        </div>';
}
    $html .=
        '<div class = "dashboardBody" style="'.(($showFilter) ? 'height: calc(100% - 135px)' : 'height: calc(100% - 10px)').'">';
if($showFilter){
    $html .=
            '<div class="sidebar" >
                <div class="filterContainer">
                    <div class="filter green" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Project</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard()">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" >'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter green">
                        <label>Year</label><br>
                        <select onchange="refreshDashboard()" id = "yearFilter">
                            <option value="all">---</option>';
                            foreach ($dashObj->yearOptions['overall'] as $year) {
                                $html .= '<option value="'.$year.'">'.$year.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter green">
                        <label>Month</label><br>
                        <select onchange="refreshDashboard()" id = "monthFilter" disabled>
                            <option value="all">---</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                </div>
            </div>';
}
    $html .=
            '<div class="layout oneRow" id="lOne">
                <div class="rowOne twoColumn main-div">
                    <div class="columnOne M twoColumn">
                        <div class = "columnOne M twoRow">
                            <div class = "rowOne-T roundT green">
                                NCR BY SOR
                            </div>
                            <div class = "rowTwo-T threeRow spacerTop transparent roundB">
                                <div class="rowOne M twoRow shadow round">
                                    <div class="rowOne-T roundT green">
                                        SAFETY & HEALTH
                                    </div>
                                    <div class="rowTwo-T twoColumn roundB">
                                        <div class="columnOne M flex">
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CURRENT NCR</div>
                                                <span id="ncrSafetyPrevMonthCard">0</span>
                                            </div>
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CUMULATIVE NCR</div>
                                                <span id="ncrSafetyCurrMonthCard">0</span>
                                            </div>
                                            <div class="infoContainerDiv">
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">OPEN</div>
                                                    <span id="ncrSafetyPendingCard">0</span>
                                                </div>
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">CLOSED</div>
                                                    <span id="ncrSafetyClosedCard">0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class="dash-charts dash-resize" id="cumNcrSafetyChart" style="border-bottom-right-radius: 10px;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo M twoRow shadow round">
                                    <div class="rowOne-T roundT green">
                                        ENVIRONMENTAL
                                    </div>
                                    <div class="rowTwo-T twoColumn roundB">
                                        <div class="columnOne M flex">
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CURRENT NCR</div>
                                                <span id="ncrEnviromentPrevMonthCard">0</span>
                                            </div>
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CUMULATIVE NCR</div>
                                                <span id="ncrEnviromentCurrMonthCard">0</span>
                                            </div>
                                            <div class="infoContainerDiv ">
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">OPEN</div>
                                                    <span id="ncrEnviromentPendingCard">0</span>
                                                </div>
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">CLOSED</div>
                                                    <span id="ncrEnviromentClosedCard">0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class="dash-charts dash-resize" id="cumNcrEnvChart" style="border-bottom-right-radius: 10px;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowThree M twoRow shadow round">
                                    <div class="rowOne-T roundT green">
                                        TRAFFIC MANAGEMENT
                                    </div>
                                    <div class="rowTwo-T twoColumn roundB">
                                        <div class="columnOne M flex">
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CURRENT NCR</div>
                                                <span id="ncrTrafficPrevMonthCard">0</span>
                                            </div>
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CUMULATIVE NCR</div>
                                                <span id="ncrTrafficCurrMonthCard">0</span>
                                            </div>
                                            <div class="infoContainerDiv">
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">OPEN</div>
                                                    <span id="ncrTrafficPendingCard">0</span>
                                                </div>
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">CLOSED</div>
                                                    <span id="ncrTrafficClosedCard">0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class="dash-charts dash-resize" id="cumNcrTrafficChart" style="border-bottom-right-radius: 10px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class = "columnTwo M twoRow">
                            <div class = "rowOne-T roundT green">
                                NCR TO SUBCON
                            </div>
                            <div class = "rowTwo-T threeRow spacerTop transparent roundB">
                                <div class="rowOne M twoRow shadow round">
                                    <div class="rowOne-T roundT green">
                                        SAFETY & HEALTH
                                    </div>
                                    <div class="rowTwo-T twoColumn roundB">
                                        <div class="columnOne M flex">
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CURRENT NCR</div>
                                                <span id="ncrSubConSafetyPrevMonthCard">0</span>
                                            </div>
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CUMULATIVE NCR</div>
                                                <span id="ncrSubConSafetyCurrMonthCard">0</span>
                                            </div>
                                            <div class="infoContainerDiv">
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">OPEN</div>
                                                    <span id="ncrSubConSafetyPendingCard">0</span>
                                                </div>
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">CLOSED</div>
                                                    <span id="ncrSubConSafetyClosedCard">0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class="dash-charts dash-resize" id="cumNcrSubConSafetyChart" style="border-bottom-right-radius: 10px;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo M twoRow shadow round">
                                    <div class="rowOne-T roundT green">
                                        ENVIRONMENTAL
                                    </div>
                                    <div class="rowTwo-T twoColumn roundB">
                                        <div class="columnOne M flex">
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CURRENT NCR</div>
                                                <span id="ncrSubConEnviromentPrevMonthCard">0</span>
                                            </div>
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CUMULATIVE NCR</div>
                                                <span id="ncrSubConEnviromentCurrMonthCard">0</span>
                                            </div>
                                            <div class="infoContainerDiv ">
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">OPEN</div>
                                                    <span id="ncrSubConEnviromentPendingCard">0</span>
                                                </div>
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">CLOSED</div>
                                                    <span id="ncrSubConEnviromentClosedCard">0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class="dash-charts dash-resize" id="cumNcrSubConEnvChart" style="border-bottom-right-radius: 10px;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowThree M twoRow shadow round">
                                    <div class="rowOne-T roundT green">
                                        TRAFFIC MANAGEMENT
                                    </div>
                                    <div class="rowTwo-T twoColumn roundB">
                                        <div class="columnOne M flex">
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CURRENT NCR</div>
                                                <span id="ncrSubConTrafficPrevMonthCard">0</span>
                                            </div>
                                            <div class="infoContainer pastelGreen">
                                                <div class="head green">CUMULATIVE NCR</div>
                                                <span id="ncrSubConTrafficCurrMonthCard">0</span>
                                            </div>
                                            <div class="infoContainerDiv">
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">OPEN</div>
                                                    <span id="ncrSubConTrafficPendingCard">0</span>
                                                </div>
                                                <div class="infoContainer pastelGreen">
                                                    <div class="head green">CLOSED</div>
                                                    <span id="ncrSubConTrafficClosedCard">0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class="dash-charts dash-resize" id="cumNcrSubConTrafficChart" style="border-bottom-right-radius: 10px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M threeRow">
                        <div class="rowOne M threeColumn">
                            <div class="columnOne M twoRow">
                                <div class="rowOne h50 twoRow shadow round">
                                    <div class="rowOne-T roundT green" title="">OVERALL MAN HOURS</div>
                                    <div class="rowTwo-T  infoContainerDiv roundB">
                                        <div class="infoContainer pastelGreen sheCenterContent">
                                            <div class="head green">W/O LTI</div>
                                            <div class="body centerMiddle">
                                                <span id="smhWOLti">0</span>
                                            </div>
                                        </div>
                                        <div class="infoContainer pastelGreen sheCenterContent">
                                            <div class="head green">WITH LTI</div>
                                            <div class="body centerMiddle">
                                                <span id="smhWLti">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo h50 twoRow shadow round">
                                    <div class="rowOne-T roundT green">INCIDENT/ ACCIDENT</div>
                                    <div class="rowTwo-T roundB infoContainerDiv ">
                                        <div class="infoContainer pastelGreen sheCenterContent">
                                            <div class="head fatalityHeader green" title="PUBLIC RELATED">PUBLIC</div>
                                            <div class="body centerMiddle">
                                                <span id="fatalityPublicTtl">0</span>
                                            </div>
                                        </div>
                                        <div class="infoContainer pastelGreen sheCenterContent">
                                            <div class="head fatalityHeader green" title="CONTRACTOR RELATED">CONTRACTOR</div>
                                            <div class="body centerMiddle">
                                                <span id="fatalityWpcTtl">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo M twoRow shadow round">
                                <div class="rowOne-T roundT green" title="TYPES OF PROPERTY DAMAGE CUMMULATIVE">TYPES OF PROPERTY DAMAGE CUMM.</div>
                                <div class="rowTwo-T roundB dash-resize" id="typeOfPropDamageChart"></div>
                            </div>
                            <div class="columnThree M twoRow shadow">
                                <div class="rowOne-T roundT green" title="INCIDENT BY CATEGORY">INCIDENT BY CATEGORY</div>
                                <div class="rowTwo-T tableContainer scrollbar-inner roundB" id = "dashboarditem">
                                    <table id ="incidentTb" class=""> 
                                        <thead>
                                            <th class="green">Cases</th>
                                            <th class="green">Current</th>
                                            <th class="green">Cumul</th>
                                        </thead>
                                        <tbody id="incidentTbBody">
                                        </tbody>
                                    </table>
                                </div>
                                </div> 
                        </div>
                        <div class="rowTwo M threeColumn">
                            <div class="columnOne M twoRow shadow round">
                                <div class="rowOne-T roundT green" title="HSET COMMITTE MEETING">HSET COMMITTE MEETING</div>
                                <div class="rowTwo-T roundB dash-resize" id="hsetCommMeetChart"></div>
                            </div>
                            <div class="columnTwo M twoRow shadow round">
                                <div class="rowOne-T roundT green" title="MASS TOOLBOX BRIEFING">MASS TOOLBOX BRIEFING</div>
                                <div class="rowTwo-T roundB dash-resize" id="massToolboxBriefChart"></div>
                            </div>
                            <div class="columnThree M twoRow shadow round">
                                <div class="rowOne-T roundT green" title="HSET WALKABOUT & INDUCTION">HSET WALKABOUT & INDUCTION</div>
                                <div class="rowTwo-T roundB dash-resize" id="hsetWalkaboutChart"></div>
                            </div> 
                        </div>
                        <div class="rowThree M twoRow shadow round">
                            <div class="rowOne-T roundT green">HSET ACTIVITY/PROGRAM</div>  
                            <div class="rowTwo-T roundB dash-resize" id="hsetActivityChart"></div>
                        </div>
                    </div>
                </div>
            </div>';
if($showFilter){
    $html .= 
            '<div class="minimizeButton active" id="minimizeButton">
                <div class="lines"></div>
                <div class="lines"></div>
            </div>';
}
    $html .=
        '</div>
    </body>
</html>
';
echo $html;

?>

<style type="text/css">
    /*header changes*/
    h4 {
        font-size: 1.3em;
    }
    .dashboardHeader{
        display: flex;
        justify-content: space-between;
    }

    .dashboardHeader .title {
        margin-left: 30px;
        width: calc(100% - 225px);
    }

    .dashboardHeader .title h3{
        text-align: unset;
        margin-bottom: 4px;
        line-height: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100% - 0px);
        white-space: nowrap;
        font-size: .9rem;
    }

    .dashboardBody .infoContainer:first-child {
        margin: 10px 5px;
    }
    .darkGreyDiv {
        background-color: #c4c4c4;;
    }

    .green{
        background-color: #053b02 !important;
    }

    .pastelGreen{
        background-color: #82a089 !important;
    }


    #incidentTbBody > tr > td {
     max-width: 100px;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
    }

    .cutOffDateInfoDiv {
        color: white;
        font-size: 14px;
        font-weight: bold;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        align-items: center;
    }
    .cutOffDateVal {
        margin-top: 5px;
    }
    .main-div{
        height: 100%;
    }
    .fatalityHeader {
        /*line-height:10px!important;*/
    }

    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .clickableCard {
        cursor:pointer;
    }
    .showLabel{
        display: none
    }
</style>