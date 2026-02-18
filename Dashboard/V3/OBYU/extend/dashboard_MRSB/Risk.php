<?php
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('risk');

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
        <script src="../../'.$dashObj->pathRel.'JS/highchart/v11/highcharts-more.js"></script>
        <script src="../../'.$dashObj->pathRel.'JS/highchart/v11/solid-gauge.js"></script>
    </head>
    <body class='.$themeClass.'>';
if($showFilter){
    $html .=
        '<div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>';
}
if($showHeader){
    $html .=
        '<div class = "dashboardHeader">
            <div class = "title">
                <h4>Risk Management</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ='.$prefix.''.$dashObj->projectInfo['icon_url'].'>
            </div>
        </div>';
}      
    $html .=
        '<div class = "dashboardBody">';
if($showFilter){
    $html .=
            '<div class="sidebar" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                <div class="filterContainer">
                    <div class="filter">
                        <label>Year</label><br>
                        <select onchange="refreshDashboard()" id = "yearFilter">
                            <option value="all">---</option>';
                            foreach ($dashObj->yearOptions['overall'] as $year) {
                                $html .= '<option value="'.$year.'">'.$year.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Month</label><br>
                        <select onchange="refreshDashboard()" id = "monthFilter" disabled>
                            <option value="all">---</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </div>
                </div>
            </div>';
}
    $html .=
            '<div class="layout oneRow" id="lOne">
                <div class="rowOne threeColumn">
                    <div class="columnOne ML twoRow">
                        <div class="rowOne M60">
                            <div class="rowOne-T round shadow">TOP 10 PROJECT RISK</div>
                            <div class="rowTwo-T twoColumn spacerTop transparent resizeChart" style="padding-top: 2px !important;">
                                <div class="columnOne L round shadow">
                                    <div class="rowOne-T roundT">PREVIOUS MONTH</div>
                                    <div class="rowTwo-T roundB" id = "risk-pdp-crit-risk-prev" >
                                    </div>
                                </div>
                                <div class="columnTwo L round shadow" style="margin-right: 0px !important">
                                    <div class="rowOne-T roundT">CURRENT MONTH</div>
                                    <div class="rowTwo-T roundB" id = "risk-pdp-crit-risk-curr" >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M40 round shadow">
                            <div class="rowOne-T roundT">PROBABILITY OF COMPLETION</div>
                            <div class="rowTwo-T roundB dash-charts risk-charts dash-resize" id = "risk-timely-comp"></div>
                        </div>
                    </div>
                    <div class="columnTwo S twoRow">
                        <div class="rowOne M threeRow">
                            <div class="rowOne M">
                            </div>
                            <div class="rowTwo M round">
                                <div class="rowOne-T roundT">ESTIMATE COMPLETION DATE</div>
                                <div class="rowTwo-T tableContainer tableContainerSize roundB shadow" id = "">
                                    <table id ="" class="">
                                        <thead>
                                            <th>Packages</th>
                                            <th>Date</th>
                                        </thead>
                                        <tbody id = "estPackage">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="rowThree M">
                            </div>
                        </div>
                        <div class="rowTwo M round shadow flex" style="background: white;">
                            <div class="infoContainer">
                                <div class="head">PLANNED PROGRESS (%)</div>
                                <div class="body" >
                                    <span id = "riskPlannedProgressCard" onClick="openConOpDashboard(this)">0</span>
                                </div>
                            </div>
                            <div class="infoContainer">
                                <div class="head">ACTUAL PROGRESS (%)</div>
                                <div class="body">
                                    <span id = "riskActualProgressCard" onClick="openConOpDashboard(this)">0</span>
                                </div>
                            </div>
                            <div class="infoContainer">
                                <div class="head">VARIANCE (%)</div>
                                <div class="body">
                                    <span id = "riskVarianceCard" onClick="openConOpDashboard(this)">0</span>
                                </div>
                            </div>
                            <div class="infoContainer riskScoreBackground">
                                <div class="head">RISK SCORE</div>
                                <div class="body" id="">
                                    <span id = "riskScoreCard" onClick="openConOpDashboard(this)">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnThree ML twoRow">
                        <div class="rowOne M round shadow">
                            <div class="rowOne-T roundT">PROBABILITY OF COMPLETING WITHIN SCHEDULE</div>
                            <div class="rowTwo-T roundB dash-charts risk-charts dash-resize" id = "risk-prob-complete" ></div>
                        </div>
                        <div class="rowTwo M round shadow">
                            <div class="rowOne-T roundT">OVERALL DURATION ANALYSIS</div>
                            <div class="rowTwo-T roundB dash-resize" id = "risk-pdp-overall-dur"></div>
                        </div>
                    </div>
                </div>
            </div>';
if($showFilter){
    $html .=
        '<div class="minimizeButton active" id="minimizeButton" style="display:'.(($dashObj->isWPC) ? 'none' : 'flex').';">
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
    h4 {
        font-size: 1.3em;
    }
    .tableContainerSize{
        height: auto !important;
    }
    .infoContainer > .body > span {
        cursor: pointer;
    }
    .showLabel{
        display: none
    }
</style>