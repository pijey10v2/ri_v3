<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('nod');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  

        <script src="https://code.highcharts.com/modules/heatmap.js"></script>
    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class = "dashboardHeader">
            <div class = "logo">
                <img src ="../'.$dashObj->projectInfo['icon_url'].'">
            </div>
            <div class = "title">
                <h4>NOD AND INSPECTION STATUS</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="../../Images/Logo_JKR.png">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter"  style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard()">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" onclick="refreshDashboard()">'.$val.'</option>';
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
                    <div class="filter" style="">
                        <label>Maintenance Type</label><br>
                        <select id="categoryFilter" onchange="refreshDashboard()">
                            <option value="default">Default</option>
                            <option value="Periodic">Periodic</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>
                    <div class="filter" style="">
                        <label>NOD</label><br>
                        <select id="statusFilter" onchange="refreshDashboard()">
                            <option value="default">Default</option>
                            <option value="Critical">Critical</option>
                            <option value="Serious">Serious</option>
                            <option value="Bad">Bad</option>
                            <option value="Mild">Mild</option>
                            <option value="Good">Good</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout oneRow" id="lOne" style="">
                <div class="rowOne M twoColumn">
                    <div class="columnOne S twoRow">
                        <div class="rowOne-T roundT shadow">YEAR TO DATE AMOUNT (RM)</div>
                        <div class="rowTwo-T roundB shadow flex">
                            <div class="infoContainer shadow">
                                <div class="head bold purple">TOTAL</div>
                                <span class="bold" id="ttlAmount">RM 0</span>
                            </div>
                            <div class="infoContainer small shadow">
                                <div class="head">CRITICAL</div>
                                <span id="critAmount">RM 0</span>
                            </div>
                            <div class="infoContainer small shadow">
                                <div class="head">SERIOUS</div>
                                <span id="serAmount">RM 0</span>
                            </div>
                            <div class="infoContainer small shadow">
                                <div class="head">BAD</div>
                                <span id="badAmount">RM 0</span>
                            </div>
                            <div class="infoContainer small shadow">
                                <div class="head">MILD</div>
                                <span id="mildAmount">RM 0</span>
                            </div>
                            <div class="infoContainer small shadow">
                                <div class="head">GOOD</div>
                                <span id="goodAmount">RM 0</span>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo L twoRow">
                        <div class="rowOne M">
                            <div class="rowOne-T roundT shadow">NOD DURATION</div>
                            <div class="rowTwo-T roundB shadow" id = "chartDuration"></div>
                        </div>
                        <div div id="nodPieChartContainer" class="rowTwo M twoRow">
                            <div class="rowOne-T roundT shadow">NOD QUANTITY STATUS</div>
                            <div class="rowTwo-T roundB shadow twoColumn">
                                <div class="columnOne SM flex">
                                    <div class="infoContainer shadow">
                                        <div class="head bold purple">TOTAL NOD</div>
                                        <span class="bold" id="ttlNod">0</span>
                                    </div>
                                </div>
                                <div class="columnTwo ML" id = "pieQuantityStatus">
                                </div>
                            </div>
                        </div>
                        <div div id="nodTableContainer" class="rowTwo M twoRow" style="display:none">
                            <div class="rowOne-T roundT shadow">NOD STATUS ON CHANGE</div>
                            <div class="rowTwo-T roundTB shadow tableContainer scrollbar-inner">
                                <table id ="" class=""> 
                                    <thead>
                                        <th style="background: #0B364D ;">Path Name</th>
                                        <th style="background: #0B364D ;">Path No.</th>
                                        <th style="background: #0B364D ;">Section From</th>
                                        <th style="background: #0B364D ;">Section To</th>
                                        <th style="background: #0B364D ;">Length (KM)</th>
                                        <th style="background: #0B364D ;">Work Location</th>
                                    </thead>
                                    <tbody id="statusTable">
                                    </tbody>
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

        <script src="../../JS/dashboard/dashboard.js"></script>
    </body>
</html>
';

echo $html;
?>

<style type="text/css">
    h4{
        text-align: center;
    }
    .purple{
        background: purple !important;
    }
    .small{
        margin: auto 15px !important;
    }
    .bold{
        font-weight: bold !important;
    }
    .infoContainer > div,span{
        cursor: default;
    }
</style>
