<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('risk');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../CSS/'.$theme.'/RVguiStyle.css">  
        <script src="../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class = "dashboardHeader">
            <div class = "logo">
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
            </div>
            <div class = "title">
                <h4>Risk Management</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter"  style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard();">';
                    // load work package options
                    foreach ($dashObj->WPCOptions as $key => $val) {
                        $html .= '<option value="'.$key.'">'.$val.'</option>';
                    }
    $html .=        '</select>
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
            </div>
            <div class="layout twoRow" id="lOne">
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
                    <div class="columnThree S round shadow flex" style="background: white;">
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
            <div class="minimizeButton active" id="minimizeButton">
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