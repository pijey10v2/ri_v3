<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('risk', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
    </head>
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout twoRow" id="lOne" '.(($dashObj->isWPC) ? 'style="width:98%;"' : '').'">
                <div class="rowOne M threeColumn">
                    <div class="columnOne M twoRow round shadow">
                        <div class="rowOne-T roundT">TIMELY COMPLETION PROBABILITY</div>
                        <div class="rowTwo-T roundB dash-charts risk-charts" id = "risk-timely-comp"></div>
                    </div>
                    <div class="columnTwo M twoRow round shadow">
                        <div class="rowOne-T roundT">OVERALL PROJECT SCHEDULE IMPACT UNCERTAINTY</div>
                        <div class="rowTwo-T roundB dash-charts risk-charts" id = "risk-schedule-impact"></div>
                    </div>
                    <div class="columnThree M twoRow round shadow">
                        <div class="rowOne-T roundT">PROBABILITY OF COMPLETING WITHIN SCHEDULE</div>
                        <div class="rowTwo-T roundB dash-charts risk-charts" id = "risk-prob-complete" ></div>
                    </div>
                </div>
                <div class="rowTwo M threeColumn">
                    <div class="columnOne ML twoRow round shadow">
                        <div class="rowOne-T roundT">CRITICAL RISK DRIVER</div>
                        <div class="rowTwo-T roundB" id = "risk-pdp-crit-risk"></div>
                    </div>
                    <div class="columnTwo ML twoRow round shadow">
                        <div class="rowOne-T roundT">OVERALL DURATION ANALYSIS</div>
                        <div class="rowTwo-T roundB" id = "risk-pdp-overall-dur"></div>
                    </div>
                    <div class="columnThree S round shadow flex background">
                        <div class="infoContainer">
                            <div class="head">DURATION REMAINING (MONTH)</div>
                            <div class="body">
                                <span id = "riskDurRemainCard">0</span>
                            </div>
                        </div>
                        <div class="infoContainer">
                            <div class="head">PROBABILITY COMPLETING (%)</div>
                            <div class="body">
                                <span id = "riskProbCompleteCard">0</span>
                            </div>
                        </div>
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
        display: none
    }
    .clickableCard {
        cursor:pointer;
    }
</style>