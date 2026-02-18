<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('PlanningManagement');

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
                <h4>Report Submission</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="../Images/Logo_JKR_Sabah.png">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard();">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'">'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Report Category</label><br>
                        <select onchange="refreshDashboard()" id = "categoryFilter">
                            <option value="allcategory">---</option>
                            <option value="JKR Overall Project Monthly Progress Report">JKR Overall Project Monthly Progress Report</option>
                            <option value="Monthly QAQC Report">Monthly QAQC Report</option>
                            <option value="PMC Overall Project Monthly Progress Report">PMC Overall Project Monthly Progress Report</option>
                            <option value="WPC Monthly Progress Report">WPC Monthly Progress Report</option>
                            <option value="WPC Weekly Progress Report">WPC Weekly Progress Report</option>
                        </select>
                    </div>
                    <div class="filter">
                        <label>Status</label><br>
                        <select onchange="refreshDashboard()" id = "statusFilter">
                            <option value="allstatus">---</option>
                            <option value="closed">Closed</option>
                            <option value="pending">Pending</option>
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
                    <div class="rowOne XS round infoContainerDiv">
                        <div class="infoContainer round shadow" style="background:white; margin:0 2.5px;">
                            <div class="head" style="font-weight: bold;">TOTAL REPORT</div>
                            <div class="body centerMiddle">
                                <span id = "totalReport">0</span>
                            </div>
                        </div>
                        <div class="infoContainer round shadow" style="background:white; margin:0 2.5px;">
                            <div class="head" style="font-weight: bold;">CLOSED</div>
                            <div class="body centerMiddle">
                                <span id = "totalReportclose">0</span>
                            </div>
                        </div>
                        <div class="infoContainer round shadow" style="background:white; margin:0 0 0 2.5px;">
                            <div class="head" style="font-weight: bold;">PENDING</div>
                            <div class="body centerMiddle">
                                <span id = "totalReportopen">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo XL twoRow round shadow">
                        <div class="rowOne-T roundT shadow">Report Category</div>
                        <div class="rowTwo-T roundB dash-charts risk-charts" id="categoryReport">

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
    .centerMiddle{
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
