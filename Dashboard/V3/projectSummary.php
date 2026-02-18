<?php
// check if login or not here
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('projectSummary', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

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
else if($dashObj->projectInfo['project_owner'] == "SSLR2"){
    $finlSchedule = "Financial Plan Curve (%)";
    $finActual = "Financial Actual Curve (%)";
    $phySchedule = "Physical Plan Curve (%)";
    $phyActual = "Physical Actual Curve (%)";
    
    $projectSummaryTableHTML = '                                
    <thead>
        <th>Month/Year</th>
        <th>'.$finlSchedule.'</th>
        <th>'.$finActual.'</th>
        <th>'.$phySchedule.'</th>
        <th>'.$phyActual.'</th>
    </thead>';
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
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">              <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">                       <!--     JS for jquery-->
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
    </head>
    <body class='.$themeClass.'>';
    
    $html .= ' 
        <div class = "dashboardBody"'; 
            if (!$showHeader){
                $html .= ' 
                    style="height: calc(100% - 25px) !important;"
                ';
            }
            $html .= '
        >
            <div class="layout twoRow ls inlineTable" id="lOne">
                <div class="rowOne M twoColumn">
                    <div class="columnOne S flex round background">
                        <div class="infoContainer">
                            <div class="head">Project Duration</div>
                            <span id="projDur">'.(($dashObj->projectInfo['duration']) ? $dashObj->projectInfo['duration'] : '0').'</span> Day(s)
                        </div>
                        <div class="infoContainer">
                            <div class="head">Time Elapse %</div>
                            <span id="timeElapse">'.$dashObj->projectInfo['percentElapse'].'</span><span> %</span>
                        </div>
                        <div class="infoContainer">
                            <div class="head">Start Date</div>
                            <span id="startDateProj">'.(($dashObj->projectInfo['start_date']) ? date("j M Y", strtotime($dashObj->projectInfo['start_date'])) : 'N/A').'</span>
                        </div>
                        <div class="infoContainer">
                            <div class="head">End Date</div>
                            <span id="endDateProj">'.(($dashObj->projectInfo['end_date']) ? date("j M Y", strtotime($dashObj->projectInfo['end_date'])) : 'N/A').'</span>
                        </div>
                    </div>
                    <div class="columnTwo L">
                        <div class="tableContainer round background" id = "dashboarditem">
                            <table id ="progressSummarytb"> 
                                '.$projectSummaryTableHTML.'
                                <tbody id="progressSummaryTBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M twoColumn positionAbsolute">
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
        </div>
        <div class="loader" style="display:none;">
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
        <script src="../../JS/dashboard/dashboardv3.js"></script>
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