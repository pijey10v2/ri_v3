<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('publicComplaint_PBHS');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../CSS/'.$theme.'/RVguiStyle.css">  
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
                <h4>General Management</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="../Images/Logo_JKR_Sabah.png">
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
                            $html .=
                        '</select>
                    </div>
                    <div class="filter">
                        <label>Status</label><br>
                        <select id="statusFilter" onchange="refreshDashboard()">
                            <option value="allStatus">---</option>
                            <option value="pending">Pending</option>
                            <option value="closed">Closed</option>
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
            <div class="layout oneRow round" id="lOne">
                <div class="rowOne twoRow">
                    <div class="rowOne-T roundT shadow">PUBLIC COMPLAINT</div>
                    <div class="rowTwo-T twoColumn roundB shadow">
                        <div class="columnOne SM flex" style="margin:5px 0 0 5px; height: auto;">
                            <div class="infoContainer shadow">
                                <div class="head">Total Public Complaint</div>
                                <div class="centerMiddlePrint">
                                    <span id = "cardTtl">0</span>
                                </div>
                            </div>
                            <div class="infoContainer shadow">
                                <div class="head">Closed</div>
                                <div class="centerMiddlePrint">
                                    <span id = "cardClose">0</span>
                                </div>
                            </div>
                            <div class="infoContainer shadow">
                                <div class="head">Pending</div>
                                <div class="centerMiddlePrint">
                                    <span id = "cardPending">0</span>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo ML twoRow round" style="margin:5px 0 0 5px; height:calc(100% - 10px);">
                            <div class="rowOne-T roundT">PUBLIC COMPLAINT CATEGORY BY STATUS</div>
                            <div class="rowTwo-T roundB dash-charts risk-charts" id="pcStatusChart"></div>
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
    .white{
        background: white !important;
    }

    .centerMiddlePrint{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .showLabel{
        font-size: 10px;
        display: none;
    }

    .highcharts-menu > li{
        list-style: none !important
    }
</style>
