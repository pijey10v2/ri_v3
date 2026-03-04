<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('time');

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
                <h4>TIME MANAGEMENT DASHBOARD</h4>
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
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select onchange="refreshDashboard()" id="wpcFilter">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" >'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
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
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                </div>
            </div>';
}     
    $html .=
            '<div class="layout twoRow ls" id="lOne">
                <div class="rowOne M twoColumn">
                    <div class="columnOne SM round shadow">
                        <div class="rowOne-T roundT">WEATHER RECORDS</div>
                        <div class="rowTwo-T roundB dash-resize" id="sideDiaryWeatherCharts">
                        </div>
                    </div>
                    <div class="columnTwo ML shadow round">
                        <div class="tableContainer scrollbar-inner roundB" id = "dashboarditem">
                            <table id ="progressSummarytb"> 
                                <thead class="roundT">
                                    <th style="border-top-left-radius: 8px">Contractor</th>
                                    <th>Value (RM)</th>
                                    <th>Project Start Date</th>
                                    <th>Project End Date</th>
                                    <th>Total Duration (days)</th>
                                    <th>Elapsed Duration (days)</th>
                                    <th>Remaining Duration (days)</th>
                                    <th>Planned Progress (%)</th>
                                    <th style="border-top-right-radius: 8px">Actual Progress (%)</th>
                                </thead>
                                <tbody id="projectTBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M twoColumn">
                    <div class="columnOne M new-charts-left twoColumn">
                        <div class="columnOne M twoRow shadow round">
                            <div class="rowOne-T roundT">MANPOWER</div>
                            <div class="rowTwo-T roundB dash-resize" id="workerChart"></div>
                        </div>
                        <div class="columnTwo M twoRow shadow round">
                            <div class="rowOne-T roundT">PLANT & MACHINERIES</div>
                            <div class="rowTwo-T roundB dash-resize" id="machineryChart"></div>
                        </div>
                    </div>
                    <div class="columnTwo M twoColumn">
                        <div class="columnOne M twoRow shadow round">
                            <div class="rowOne-T roundT">PHYSICAL PROGRESS</div>
                            <div class="rowTwo-T roundB dash-resize" id="phyScurve"></div>
                        </div>
                        <div class="columnTwo M twoRow shadow round">
                            <div class="rowOne-T roundT">FINANCIAL PROGRESS</div>
                            <div class="rowTwo-T roundB dash-resize" id="finScurve"></div>
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
    .new-charts-left {
        display: flex;
        justify-content: space-around;
    }
    .dashboardBody .infoContainer:first-child {
        margin: 10px 5px;
    }
    .twoColumn {
        display: flex;
        justify-content: space-around;
    }
    .infoContainer {
        width: 40%;
    }
    h4 {
        font-size: 1.3em;
    }

    /*header changes*/
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
    }

    .twoInfoInline{
        display: flex;
        justify-content: space-around;
    }

    .infoContainer-L{
        width: 100%;
    }

    .dashboardBody .tableContainer{
        overflow-y: auto;
        height: 100%;
        overflow-x: hidden;
    }

    .dashboardBody .tableContainer td:hover {
        cursor: auto;
    }

    .contractInfoHead{
        text-align: left;
        margin-left: 5px;
    }
    .contractInfoDiv{
        cursor: default!important;
        background: unset!important;
    }
    .contractInfoTable{
        background: unset!important;
    }
    .contractInfoTable tr{
        background: unset!important;
    }
    .contractInfoHead {
        line-height: 20px;
    }
    .contractInfoTable {
        margin-left: 6px;
        margin-top: 5px;    
    }
    .dash-bold-text {
        font-weight: bold!important;
    }

    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .showLabel{
        display: none
    }
</style>