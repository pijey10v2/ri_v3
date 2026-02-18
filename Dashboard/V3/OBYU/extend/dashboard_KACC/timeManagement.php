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
                        <label>Project</label><br>
                        <select id="wpcFilter">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" >'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Section</label><br>
                        <select id="sectionFilter" onchange="refreshDashboard()">
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
                        <select onchange="refreshDashboard()" id = "monthFilter">
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
                    <div class="dashboardContainer round shadow contractContainer">
                        <div class="rowOne-T roundT">Contract Particular</div>
                        <div class="rowTwo-T tableContainer roundB">
                            <table class="contractInfoTable"> 
                                <tbody>
                                    <tr>
                                        <td>
                                            <span>Client :</span>
                                            <span id="contractClientCard" class="dash-bold-text">N/A</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>Contract Sum :</span>
                                            <span id="contractAmountCard" class="dash-bold-text">N/A</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>Letter of Award Date :</span>
                                            <span id="contractLADateCard" class="dash-bold-text">N/A</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>Date of Site Possession :</span>
                                            <span id="contractSPDateCard" class="dash-bold-text">N/A</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>Date of Completion :</span>
                                            <span id="contractCompDateCard" class="dash-bold-text">N/A</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>Revised Contract Duration :</span>
                                            <span id="contractDurationCard" class="dash-bold-text">N/A</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>Extension of Time (EOT) :</span>
                                            <span id="contractEOTCard" class="dash-bold-text">N/A</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>Revised Date of Completion :</span>
                                            <span id="contractRevisedDateCard" class="dash-bold-text">N/A</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id="monthlyAttachment" onclick="openMonthlyAttachment(this);" class="filter-btn">Monthly Attachment</div>
                </div>
            </div>';
}

if($showFilter){
    $html .=
            '<div class="layout twoRow ls" id="lOne">
                <div class="rowOne M twoColumn">
                    <div class="columnOne M twoColumn">
                        <div class="columnOne M twoRow round shadow">
                            <div class="rowOne-T roundT purple">WEATHER RECORDS</div>
                            <div class="rowTwo-T threeRow roundB">
                                <div class="rowOne M dash-resize" id="sideDiaryWeatherCharts"></div>
                                <div class="rowTwo M dash-resize" id="sideDiaryWeatherCharts2"></div>
                                <div class="rowThree M dash-resize" id="sideDiaryWeatherCharts3"></div>
                            </div>
                        </div>
                        <div class="columnTwo M twoRow">
                            <div class="rowOne M40 twoColumn">
                                <div class="columnOne M twoRow">
                                    <div class="rowOne M twoRow shadow round">
                                        <div class="rowOne-T roundT">DURATION</div>
                                        <div class="rowTwo-T roundB centerMiddle">
                                        <span id="projDur"></span>&nbsp; Day(s)
                                        </div>
                                    </div>
                                    <div class="rowTwo M twoRow shadow round">
                                        <div class="rowOne-T roundT">TIME ELAPSE %</div>
                                        <div class="rowTwo-T roundB centerMiddle">
                                        <span id="timeElapse"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="columnTwo M twoRow">
                                    <div class="rowOne M twoRow shadow round">
                                        <div class="rowOne-T roundT">START DATE</div>
                                        <div class="rowTwo-T roundB centerMiddle">
                                        <span id="startDateProj"></span>
                                        </div>
                                    </div>
                                    <div class="rowTwo M twoRow shadow round">
                                        <div class="rowOne-T roundT">CUT OFF DATE</div>
                                        <div class="rowTwo-T roundB centerMiddle">
                                            <span id="cutOff-day">'.date("j", strtotime($dashObj->cutOffDate)).'&nbsp;</span><span id="cutOff-month">'.date("M", strtotime($dashObj->cutOffDate)).'</span>&nbsp;<span id="cutOff-year">'.date("Y", strtotime($dashObj->cutOffDate)).'</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo M60 twoColumn">
                                <div class="columnOne M twoRow">
                                    <div class="rowOne M twoRow shadow round">
                                        <div class="rowOne-T roundT orange" name="Planned Financial" title="PLANNED FINANCIAL">PLANNED FINANCIAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="plannedFinancialGaugeCharts"></div>
                                    </div>
                                    <div class="rowTwo M twoRow shadow round"">
                                        <div class="rowOne-T roundT orange" name="Planned Physical" title="PLANNED PHYSICAL">PLANNED PHYSICAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="plannedPhysicalGaugeCharts"></div>
                                    </div>
                                </div>
                                <div class="columnTwo M twoRow">
                                    <div class="rowOne M twoRow shadow round">
                                        <div class="rowOne-T roundT green" name="Actual Financial" title="ACTUAL FINANCIAL">ACTUAL FINANCIAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="actualFinancialGaugeCharts"></div>
                                    </div>
                                    <div class="rowTwo M twoRow shadow round"">
                                        <div class="rowOne-T roundT green" name="Actual Physical" title="ACTUAL PHYSICAL">ACTUAL PHYSICAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="actualPhysicalGaugeCharts"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M shadow round">
                        <div class="tableContainer scrollbar-inner roundB" id = "dashboarditem">
                            <table id ="progressSummarytb"> 
                                <thead class="grey">
                                    <th style="border-top-left-radius:8px">Month</th>
                                    <th>Financial – Early(%)</th>
                                    <th class="lateInfoTh">Financial – Late(%)</th>
                                    <th>Financial Actual(%)</th>
                                    <th>Physical – Early(%)</th>
                                    <th class="lateInfoTh">Physical – Late(%)</th>
                                    <th style="border-top-right-radius:8px">Physical Actual(%)</th>
                                </thead>
                                <tbody id="progressSummaryTBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M twoColumn">
                    <div class="columnOne M new-charts-left twoColumn">
                        <div class="columnOne M twoRow shadow round">
                            <div class="rowOne-T roundT yellow">MANPOWER</div>
                            <div class="rowTwo-T roundB dash-resize" id="workerChart"></div>
                        </div>
                        <div class="columnTwo M twoRow shadow round">
                            <div class="rowOne-T roundT yellow">PLANT & MACHINERIES</div>
                            <div class="rowTwo-T roundB dash-resize" id="machineryChart"></div>
                        </div>
                    </div>
                    <div class="columnTwo M twoColumn">
                        <div class="columnOne M twoRow shadow round">
                            <div class="rowOne-T roundT lightBlue">PHYSICAL S-CURVE</div>
                            <div class="rowTwo-T roundB dash-resize" id="phyScurve"></div>
                        </div>
                        <div class="columnTwo M twoRow shadow round">
                            <div class="rowOne-T roundT lightBlue">FINANCIAL S-CURVE</div>
                            <div class="rowTwo-T roundB dash-resize" id="finScurve"></div>
                        </div>
                    </div>
                </div>
            </div>';
}else{
    $html .=
            '<div class="layout twoRow ls flexColumn" id="lOne">
                <div class="rowOne M twoColumn tableCell">
                    <div class="columnOne ML twoColumn">
                        <div class="columnOne M twoColumn">
                            <div class="columnOne M twoRow">
                                <div class="rowOne L round shadow heightFill100">
                                    <div class="rowOne-T roundT">CONTRACT PARTICULAR</div>
                                    <div class="rowTwo-T">
                                        <div class="tableContainer scrollbar-inner roundB">
                                            <table class="contractInfoTable"> 
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <span>Client :</span>
                                                            <span id="contractClientCard" class="dash-bold-text">N/A</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>Contract Sum :</span>
                                                            <span id="contractAmountCard" class="dash-bold-text">N/A</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>Letter of Award Date :</span>
                                                            <span id="contractLADateCard" class="dash-bold-text">N/A</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>Date of Site Possession :</span>
                                                            <span id="contractSPDateCard" class="dash-bold-text">N/A</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>Date of Completion :</span>
                                                            <span id="contractCompDateCard" class="dash-bold-text">N/A</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>Revised Contract Duration :</span>
                                                            <span id="contractDurationCard" class="dash-bold-text">N/A</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>Extension of Time (EOT) :</span>
                                                            <span id="contractEOTCard" class="dash-bold-text">N/A</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>Revised Date of Completion :</span>
                                                            <span id="contractRevisedDateCard" class="dash-bold-text">N/A</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div class="rowOne S round shadow displayNone" style="display: flex; justify-content: center;">
                                    <div id="monthlyAttachmentV3" onclick="openMonthlyAttachment(this);" class="monthly-btn">Monthly Attachment</div>
                                </div>
                            </div>
                            <div class="columnTwo M round shadow">
                                <div class="rowOne-T roundT purple">WEATHER RECORDS</div>
                                <div class="rowTwo-T threeRow roundB">
                                    <div class="rowOne M dash-resize" id="sideDiaryWeatherCharts"></div>
                                    <div class="rowTwo M dash-resize" id="sideDiaryWeatherCharts2"></div>
                                    <div class="rowThree M dash-resize" id="sideDiaryWeatherCharts3"></div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoRow">
                            <div class="rowOne M40 twoColumn">
                                <div class="columnOne M twoRow">
                                    <div class="rowOne M twoRow shadow round">
                                        <div class="rowOne-T roundT">DURATION</div>
                                        <div class="rowTwo-T roundB centerMiddle">
                                        <span id="projDur"></span>&nbsp; Day(s)
                                        </div>
                                    </div>
                                    <div class="rowTwo M twoRow shadow round">
                                        <div class="rowOne-T roundT">TIME ELAPSE %</div>
                                        <div class="rowTwo-T roundB centerMiddle">
                                        <span id="timeElapse"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="columnTwo M twoRow">
                                    <div class="rowOne M twoRow shadow round">
                                        <div class="rowOne-T roundT">START DATE</div>
                                        <div class="rowTwo-T roundB centerMiddle">
                                        <span id="startDateProj"></span>
                                        </div>
                                    </div>
                                    <div class="rowTwo M twoRow shadow round">
                                        <div class="rowOne-T roundT">CUT OFF DATE</div>
                                        <div class="rowTwo-T roundB centerMiddle">
                                            <span id="cutOff-day">'.date("j", strtotime($dashObj->cutOffDate)).'&nbsp;</span><span id="cutOff-month">'.date("M", strtotime($dashObj->cutOffDate)).'</span>&nbsp;<span id="cutOff-year">'.date("Y", strtotime($dashObj->cutOffDate)).'</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo M60 twoColumn">
                                <div class="columnOne M twoRow">
                                    <div class="rowOne M twoRow shadow round">
                                        <div class="rowOne-T roundT orange" name="Planned Financial" title="PLANNED FINANCIAL">PLANNED FINANCIAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="plannedFinancialGaugeCharts"></div>
                                    </div>
                                    <div class="rowTwo M twoRow shadow round"">
                                        <div class="rowOne-T roundT orange" name="Planned Physical" title="PLANNED PHYSICAL">PLANNED PHYSICAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="plannedPhysicalGaugeCharts"></div>
                                    </div>
                                </div>
                                <div class="columnTwo M twoRow">
                                    <div class="rowOne M twoRow shadow round">
                                        <div class="rowOne-T roundT green" name="Actual Financial" title="ACTUAL FINANCIAL">ACTUAL FINANCIAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="actualFinancialGaugeCharts"></div>
                                    </div>
                                    <div class="rowTwo M twoRow shadow round"">
                                        <div class="rowOne-T roundT green" name="Actual Physical" title="ACTUAL PHYSICAL">ACTUAL PHYSICAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="actualPhysicalGaugeCharts"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo SM shadow round widthFill">
                        <div class="tableContainer scrollbar-inner roundB tableHeaderGroup topRelativePrint" id = "dashboarditem">
                            <table id ="progressSummarytb"> 
                                <thead class="grey">
                                    <th style="border-top-left-radius:8px">Month</th>
                                    <th>Financial – Early(%)</th>
                                    <th class="lateInfoTh">Financial – Late(%)</th>
                                    <th>Financial Actual(%)</th>
                                    <th>Physical – Early(%)</th>
                                    <th class="lateInfoTh">Physical – Late(%)</th>
                                    <th style="border-top-right-radius:8px">Physical Actual(%)</th>
                                </thead>
                                <tbody id="progressSummaryTBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M twoColumn">
                    <div class="columnOne M new-charts-left twoColumn">
                        <div class="columnOne M twoRow shadow round">
                            <div class="rowOne-T roundT yellow">MANPOWER</div>
                            <div class="rowTwo-T roundB dash-resize" id="workerChart"></div>
                        </div>
                        <div class="columnTwo M twoRow shadow round">
                            <div class="rowOne-T roundT yellow">PLANT & MACHINERIES</div>
                            <div class="rowTwo-T roundB dash-resize" id="machineryChart"></div>
                        </div>
                    </div>
                    <div class="columnTwo M twoColumn">
                        <div class="columnOne M twoRow shadow round">
                            <div class="rowOne-T roundT lightBlue">PHYSICAL S-CURVE</div>
                            <div class="rowTwo-T roundB dash-resize" id="phyScurve"></div>
                        </div>
                        <div class="columnTwo M twoRow shadow round">
                            <div class="rowOne-T roundT lightBlue">FINANCIAL S-CURVE</div>
                            <div class="rowTwo-T roundB dash-resize" id="finScurve"></div>
                        </div>
                    </div>
                </div>
            </div>';
}

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
        font-size: .9rem;
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
    .orange{
        background: #f1701a !important;
    }
    .green{
        background: green !important;
    }
    .purple{
        background: #633974 !important;
    }
    .yellow{
        background: #F1C40F !important;
    }
    #progressSummarytb th{
        background: #34495E !important;
    }
    .lightBlue{
        background: #5DADE2 !important;
    }
    .filter-btn {
        margin-top : 15px;
        background-color: #002171; 
        color: white;
        padding: 10px 22px;
        text-align: center;
        border-radius : 8px;
        font-size: 12px;
        cursor : pointer;
    }
    .monthly-btn{
        margin : auto 0px;
        background-color: var(--primary); 
        color: white;
        padding: 10px 22px;
        text-align: center;
        border-radius : 8px;
        font-size: 12px;
        cursor : default;
        opacity: 0.5;
        width: 100%;
    }
    .showLabel{
        display: none
    }
    .clickableCard {
        cursor:pointer;
    }
    .textCard{
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .textCard div{
        font-size: 1.3rem;
        font-family: math;
        text-align: center;
    }
</style>