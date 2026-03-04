<?php
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('riskPackage');

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
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <script src="https://code.highcharts.com/highcharts-more.js"></script>
        <script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>';
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
                <h4>Risk Management Packages</h4>
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
            '<div class="sidebar">
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
                </div>
            </div>';
}
    $html .=
            '<div class="layout oneRow" id="lOne">
                <div class="rowOne M twoColumn">
                    <div class="columnOne M threeRow">
                        <div class="rowOne M twoRow round shadow">
                            <div class="rowOne-T roundT">PACKAGE ANALYSIS</div>
                            <div class="rowTwo-T tableContainer scrollbar-inner roundB" id = "">
                                <table id ="" class=""> 
                                    <thead>
                                        <th class="">Package</th>
                                        <th class="">Start Date</th>
                                        <th class="">Planned Completion Date</th>
                                        <th class="">Forecasted Completion Date</th>
                                        <th class="">Planned Progress</th>
                                        <th class="">Estimated Progress</th>
                                        <th class="">Variance</th>
                                    </thead>
                                    <tbody id="sectionTBody"></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="rowTwo M twoRow">
                            <div class = "rowOne-T roundT shadow" id = "probExceedComplete">PROBABILITY OF EXCEEDING DD/MM/YY TARGET COMPLETION DATE</div>
                            <div class = "rowTwo-T roundB shadow dash-resize" id="probabilityExceedingTargetData"></div>
                        </div>
                        <div class="rowThree M twoRow">
                            <div class = "rowOne-T roundT shadow">AREAS OF CONCERN - ACTIVITIES THAT MIGHT IMPACT COMPLETION DATE</div>
                            <div class = "rowTwo-T roundB shadow dash-resize" id="activitiesImpactDate"></div>
                        </div>
                    </div>
                    <div class="columnTwo M twoRow">
                        <div class="rowOne S twoRow">
                            <div class="rowOne-T roundT shadow">PACKAGE PERFORMANCE ANALYSIS</div>
                            <div class="rowTwo-T roundB shadow gridContainer" style="padding:5px 0;">
                                <div class="infoContainer grid1" id="">
                                    <div class="head" style="font-size: 0.8em">START<br>DATE</div>
                                    <div class="body">
                                        <span>'.date('d/m/y', strtotime($dashObj->projectInfo['start_date'])).'</span>
                                    </div>
                                </div>
                                <div class="infoContainer grid2" id="">
                                    <div class="head" style="font-size: 0.8em">PLANNED<br>COMPLETION DATE</div>
                                    <div class="body">
                                        <span id="planDate">N/A</span>
                                    </div>
                                </div>
                                <div class="infoContainer grid3" id="">
                                    <div class="head" style="font-size: 0.8em">FORECASTED<br>COMPLETION DATE</div>
                                    <div class="body">
                                        <span id="forecaseDate">N/A</span>
                                    </div>
                                </div>
                                <div class="infoContainer grid4" id="">
                                    <div class="head" style="font-size: 0.7em">PROBABILITY OF MEETING<br>TARGET COMPLETION DATE%</div>
                                    <div class="body">
                                        <span id="probTargetDate">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo L twoColumn" style="margin-top: 15px !important">
                            <div class="columnOne M twoRow">
                                <div class="rowOne M">
                                    <div class = "rowOne-T roundT shadow">OVERALL DURATION ANALYSIS</div>
                                    <div class = "rowTwo-T roundB shadow dash-resize" id="overallDurationAnalysis"></div>
                                </div>
                                <div class="rowTwo M">
                                    <div class = "rowOne-T roundT shadow">PLANNED PROGRESS</div>
                                    <div class = "rowTwo-T roundB shadow dash-resize" id="plannedProgress"></div>
                                </div>
                            </div>
                            <div class="columnTwo M twoRow">
                                <div class="rowOne M">
                                    <div class = "rowOne-T roundT shadow">VARIANCE</div>
                                    <div class = "rowTwo-T roundB shadow dash-resize" id="variance">
                                        
                                    </div>
                                </div>
                                <div class="rowTwo M">
                                    <div class = "rowOne-T roundT shadow">ACTUAL PROGRESS</div>
                                    <div class = "rowTwo-T roundB shadow dash-resize" id="actualProgress"></div>
                                </div>
                            </div>
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
    h4 {
        font-size: 1.3em;
    }
    body{
        cursor: default !important;
    }
    .gridContainer{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        overflow: auto;
    }
    .grid1{
        grid-column: 1;
        height: fit-content;
        margin: auto 5px !important;
    }
    .grid2{
        grid-column: 2;
        height: fit-content;
        margin: auto 5px !important;
    }
    .grid3{
        grid-column: 3;
        height: fit-content;
        margin: auto 5px !important;
    }
    .grid4{
        grid-column: 4;
        height: fit-content;
        margin: auto 5px !important;
    }
    .infoContainer > .body > span{
        cursor: default !important;
    }
    th{
        cursor: default !important;
    }
    .clickable{
        cursor: pointer;
    }
    .showLabel{
        display: none
    }
</style>