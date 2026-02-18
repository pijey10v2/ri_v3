<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('publicComplaint');

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
                <h4>General Management</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
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
                        <label>Status</label><br>
                        <select onchange="refreshDashboard()" id = "statusFilter">
                            <option value="allstatus">---</option>
                            <option value="CLOSED">Close</option>
                            <option value="OPEN">Open</option>
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
                            <div class="head" style="font-weight: bold;">TOTAL PUBLIC COMPLAINT</div>
                            <div class="body centerMiddle">
                                <span id = "totalPBC">0</span>
                            </div>
                        </div>
                        <div class="infoContainer round shadow" style="background:white; margin:0 2.5px;">
                            <div class="head" style="font-weight: bold;">CLOSED</div>
                            <div class="body centerMiddle">
                                <span id = "totalPBCclose">0</span>
                            </div>
                        </div>
                        <div class="infoContainer round shadow" style="background:white; margin:0 0 0 2.5px;">
                            <div class="head" style="font-weight: bold;">OPEN</div>
                            <div class="body centerMiddle">
                                <span id = "totalPBCopen">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo XL twoRow round shadow">
                        <div class="rowOne-T roundT shadow">PUBLIC COMPLAINT TYPE</div>
                        <div class="rowTwo-T roundB dash-charts risk-charts" id="typePBC">

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
</style>
