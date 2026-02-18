<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('risk_pbhs');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../CSS/'.$theme.'/RVguiStyle.css">
        <link rel="stylesheet" href="../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../CSS/scrollBarCollapse.css">
        <script src="../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../JS/scrollBarCollapse.js"></script> 
    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class = "dashboardHeader">
            <div class = "logo">
                <img src ="../Images/panborneo.png">
            </div>
            <div class = "title">
                <h4>Risk Management</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="../Images/Logo_JKR_Sabah.png">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter" '.(($dashObj->isWPC) ? 'style="display:none;"' : '').'">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard();">';
                    // load work package options
                    foreach ($dashObj->WPCOptions as $key => $val) {
                        $html .= '<option value="'.$key.'">'.$val.'</option>';
                    }
    $html .=        '</select>
                    </div>
                    <div class="filter">
                        <label>Category</label><br>
                        <select id="catFilter" onchange="refreshDashboard();">
                        </select>
                    </div>
                    <div class="filter">
                        <label>Risk Rating</label><br>
                        <select id="ratingFilter" onchange="refreshDashboard();">
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
            </div>
            <div class="layout twoRow" id="lOne">
                <div class="rowOne M twoColumn">
                    <div class="columnOne SM twoRow">
                        <div class="rowOne M twoRow round shadow">
                            <div class="rowOne-T roundT">RISK REGISTER</div>
                            <div class="rowTwo-T roundB flex">
                                <div class="infoContainer shadow">
                                    <div class="head">Total</div>
                                    <span id="riskTtlCard">0</span>
                                </div>
                                <div class="infoContainerDiv">
                                    <div class="infoContainer shadow">
                                        <div class="head">Close</div>
                                        <span id="riskCloseCard">0</span>
                                    </div>
                                    <div class="infoContainer shadow">
                                        <div class="head">Ongoing</div>
                                        <span id="riskOngoingCard">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M twoRow round shadow">
                            <div class="rowOne-T roundT">Risk Trend Alert</div>
                            <div class="rowTwo-T roundB flex">
                                <div class="infoContainer shadow">
                                    <div class="head">No. of Trend Alert</div>
                                    <span id="trendAlertTtl">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo ML twoRow round shadow">
                        <div class="rowOne-T roundT">RISK CATEGORY</div>
                        <div class="rowTwo-T roundB dash-charts risk-charts" id="riskCategoryCharts"></div>
                    </div>
                </div>
                <div class="rowTwo M oneColumn">
                    <div class="columnOne ML twoRow round shadow">
                        <div class="rowOne-T roundT">RISK LIST</div>
                        <div class="rowTwo-T roundB">
                            <div class="tableContainer scrollbar-inner roundB" id = "dashboarditem">
                                <table id ="progressSummarytb"> 
                                    <thead>
                                        <th>No</th>
                                        <th>Category</th>
                                        <th>Sub-Category</th>
                                        <th>Description</th>
                                        <th>Likelihood</th>
                                        <th>Impact</th>
                                        <th>Score</th>
                                        <th>Risk</th>
                                    </thead>
                                    <tbody id="riskTableData"></tbody>
                                </table>
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

<style type="text/css">

    .showLabel{
        font-size: 10px;
        display: none;
    }

    .highcharts-menu > li{
        list-style: none !important
    }

    .highcharts-data-label-connector {
        display: none;
    }

    .highcharts-data-label{
        display: none;
    }
</style>