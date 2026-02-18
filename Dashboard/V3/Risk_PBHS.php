<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('risk_pbhs', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">

        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script> 
    </head>
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout twoRow" id="lOne">
                <div class="rowOne M twoColumn">
                    <div class="columnOne SM twoRow">
                        <div class="rowOne M twoRow round">
                            <div class="rowOne-T roundT">RISK REGISTER</div>
                            <div class="rowTwo-T roundB flex">
                                <div class="infoContainer">
                                    <div class="head">Total</div>
                                    <span id="riskTtlCard">0</span>
                                </div>
                                <div class="infoContainerDiv">
                                    <div class="infoContainer">
                                        <div class="head">Close</div>
                                        <span id="riskCloseCard">0</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">Ongoing</div>
                                        <span id="riskOngoingCard">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M twoRow round">
                            <div class="rowOne-T roundT">Risk Trend Alert</div>
                            <div class="rowTwo-T roundB flex">
                                <div class="infoContainer">
                                    <div class="head">No. of Trend Alert</div>
                                    <span id="trendAlertTtl">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo ML twoRow round">
                        <div class="rowOne-T roundT">RISK CATEGORY</div>
                        <div class="rowTwo-T roundB dash-charts risk-charts" id="riskCategoryCharts"></div>
                    </div>
                </div>
                <div class="rowTwo M twoRow round">
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

    /* .highcharts-legend-box{
        display: none;
    } */

    /* .highcharts-legend{
        display: none;
    } */

    .highcharts-data-label-connector {
        display: none;
    }

    .highcharts-data-label{
        display: none;
    }
    .clickableCard {
        cursor:pointer;
    }
</style>