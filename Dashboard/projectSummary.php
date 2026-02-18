<?php
// check if login or not here
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('projectSummary');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$iconUrl = '';

if($dashObj->projectInfo['project_owner'] == "JKR_SABAH"){
    $iconUrl = "../Images/Logo_JKR_Sabah.png";
    $finlSchedule = "Financial Schedule Curve (%)";
    $finActual = "Financial Actual Curve (%)";
    $phySchedule = "Physical Schedule Curve (%)";
    $phyActual = "Physical Actual Curve (%)";
    
    $projectSummaryTableHTML = '                                
    <thead>
        <th>Month/Year</th>
        <th>'.$finlSchedule.'</th>
        <th>'.$finActual.'</th>
        <th>Financial Variance (%)</th>
        <th>'.$phySchedule.'</th>
        <th>'.$phyActual.'</th>
        <th>Physical Variance (%)</th>
    </thead>';

    $iconProj = '../Images/panborneo.png';
}
else{
    $iconUrl = "../Images/Logo_JKR.png";
    $finlSchedule = "Financial Scheduled Curve (%)";
    $finActual = "Financial Actual Curve (%)";
    $phySchedule = "Physical Scheduled Curve (%)";
    $phyActual = "Physical Actual Curve (%)";
    
    $projectSummaryTableHTML = '                                
    <thead>
        <th>Month/Year</th>
        <th>'.$finlSchedule.'</th>
        <th>'.$finActual.'</th>
        <th>'.$phySchedule.'</th>
        <th>'.$phyActual.'</th>
    </thead>';

    $iconProj = $dashObj->projectInfo['icon_url'];
}

$showHeader = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
}


$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../CSS/jquery.scrollbar.css">                   <!--     JS for jquery-->
        <script src="../JS/JsLibrary/jquery.scrollbar.js"></script>
    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>';
    if ($showHeader) {
        $html .= '        
            <div class = "dashboardHeader">
                <div class = "logo">
                    <img src ="'.$iconProj.'">
                </div>
                <div class = "title">
                    <h4>OPERATIONAL DASHBOARD</h4>
                    <h3 style="text-align: center;">'.$dashObj->projectInfo['project_name'].'</h3>
                </div>
                <div class = "logo right">
                    <img src ='.$iconUrl.'>
                </div>
            </div>';
    }
    $html .= ' 
        <div class = "dashboardBody"'; 
            if (!$showHeader){
                $html .= ' 
                    style="height: calc(100% - 25px) !important;"
                ';
            }
            $html .= '
        >
            <div class="sidebar" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard();">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                if ($key == 'overall') continue;
                                $html .= '<option value="'.$key.'">'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout twoRow ls inlineTable" id="lOne" '.(($dashObj->isWPC) ? 'style="width:98%;"' : '').'">
                <div class="rowOne M twoColumn">
                    <div class="columnOne S flex round shadow" style="background: white">
                        <div class="infoContainer shadow">
                            <div class="head">Project Duration</div>
                            <span id="projDur">'.(($dashObj->projectInfo['duration']) ? $dashObj->projectInfo['duration'] : '0').'</span> Day(s)
                        </div>
                        <div class="infoContainer shadow">
                            <div class="head">Time Elapse %</div>
                            <span id="timeElapse">'.$dashObj->projectInfo['percentElapse'].'</span><span> %</span>
                        </div>
                        <div class="infoContainer shadow">
                            <div class="head">Start Date</div>
                            <span id="startDateProj">'.(($dashObj->projectInfo['start_date']) ? date("j M Y", strtotime($dashObj->projectInfo['start_date'])) : 'N/A').'</span>
                        </div>
                        <div class="infoContainer shadow">
                            <div class="head">End Date</div>
                            <span id="endDateProj">'.(($dashObj->projectInfo['end_date']) ? date("j M Y", strtotime($dashObj->projectInfo['end_date'])) : 'N/A').'</span>
                        </div>
                    </div>
                    <div class="columnTwo L">
                        <div class="tableContainer scrollbar-inner round shadow" id = "dashboarditem">
                            <table id ="progressSummarytb"> 
                                '.$projectSummaryTableHTML.'
                                <tbody id="progressSummaryTBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M twoColumn positionRelative">
                    <div class="columnOne M twoRow round shadow">
                        <div class="rowOne-T roundT">FINANCIAL S-CURVE</div>
                        <div class="rowTwo-T roundB dash-charts hse-charts dash-reflow" id="finScurve"></div>
                    </div>
                    <div class="columnTwo M twoRow round shadow">
                        <div class="rowOne-T roundT">PHYSICAL S-CURVE</div>
                        <div class="rowTwo-T roundB dash-charts hse-charts" id="phyScurve"></div>
                    </div>
                </div>
            </div>
            <div class="minimizeButton active" id="minimizeButton" style="display:'.(($dashObj->isWPC) ? 'none' : 'inline-flex').';">
                <div class="lines"></div>
                <div class="lines"></div>
            </div>
        </div>
        <script src="../JS/dashboard/dashboard.js"></script>
    </body>
</html>
';

echo $html;

?>
<style type="text/css">

    .showLabel{
        font-size: 10px;
        display: none;
    }

    .highcharts-menu > li{
        list-style: none !important
    }
</style>
