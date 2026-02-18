<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('maintenanceProgress');
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
                <h4>MAINTENANCE PROGRESS</h4>
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
                        <label>Division</label><br>
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
                        <label>Routine Activity</label><br>
                        <select id="activityFilter" onchange="refreshDashboard()">
                            <option value="default">Default</option>
                            <option value="R01 : PAVEMENT">R01 : PAVEMENT</option>
                            <option value="R02 : ROAD SHOULDER">R02 : ROAD SHOULDER</option>
                            <option value="R03 : GRASS CUTTING">R03 : GRASS CUTTING</option>
                            <option value="R04 : MAINTENANCE OF ROAD FURNITURES">R04 : MAINTENANCE OF ROAD FURNITURES</option>
                            <option value="R05 : MAINTENANCE OF BRIDGES/CULVERT">R05 : MAINTENANCE OF BRIDGES/CULVERT</option>
                            <option value="R06: PAINTING OF ROAD MARKING">R06: PAINTING OF ROAD MARKING</option>
                            <option value="R07 : CLEANING OF DRAINS">R07 : CLEANING OF DRAINS</option>
                            <option value="B : ROUTINE INSPECTION">B : ROUTINE INSPECTION</option>
                        </select>
                    </div>
                    <div class="filter" style="">
                        <label>Asset Type</label><br>
                        <select id="assetTypeFilter" class="assetTypeFilter" onchange="refreshDashboard()">
                            <option value="default">Default</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout oneRow" id="lOne" style="">
                <div class="rowOne M twoColumn">
                    <div class="columnOne ML twoColumn">
                        <div class="columnOne M twoRow">
                            <div class="rowOne M twoRow">
                                <div class="rowOne-T roundT shadow">CYCLIC MAINTENANCE BY STATUS & MONTH</div>
                                <div class="rowTwo-T roundB shadow" id="cyclicBarChart">
                                </div>
                            </div>
                            <div class="rowTwo M twoRow">
                                <div class="rowOne-T roundT shadow">NON-CYCLIC MAINTENANCE BY STATUS & MONTH</div>
                                <div class="rowTwo-T roundB shadow" id="nonCyclicBarChart">
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoRow">
                            <div class="rowOne M twoRow">
                                <div class="rowOne-T roundT shadow">NCP</div>
                                <div class="rowTwo-T roundB shadow twoColumn">
                                    <div class="columnOne M" id="ncpPieChart"></div>
                                    <div class="columnTwo M" id="ncpStatusPieChart"></div>
                                </div>
                            </div>
                            <div class="rowTwo M twoRow">
                                <div class="rowOne-T roundT shadow">NCP BY ROUTINE MAINTENANCE</div>
                                <div class="rowTwo-T roundB shadow" id="ncpRoutineChart">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo SM twoRow">
                        <div class="rowOne M twoRow">
                            <div class="rowOne-T roundT shadow">AMOUNT CLAIMED</div>
                            <div class="rowTwo-T roundB shadow" id="chartAmtClaim">
                            </div>
                        </div>
                        <div class="rowTwo M twoRow round shadow flex" style="background: white">
                        <div class="infoContainer round shadow" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                                <div class="head">ROUTINE MAINTENANCE BUDGET AMOUNT</div>
                                <span class="" id="ttlBudget">RM 0</span>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">TOTAL ROUTINE MAINTENANCE AMOUNT CLAIMED</div>
                                <span class="" id="ttlRoutine">RM 0</span>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">TOTAL EMERGENCY AMOUNT CLAIMED</div>
                                <span class="" id="ttlEmergency">RM 0</span>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">TOTAL CLAIM AMOUNT</div>
                                <span id="ttlClaim">RM 0</span>
                            </div>
                            <div class="infoContainer round shadow" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                                <div class="head">REMANING AMOUNT</div>
                                <span class="ttlRemainAmt" id="ttlRemain">RM 0</span>
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
    .white{
        background: white !important;
    }
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .flexColumn{
        display: flex !important;
        justify-content: center;
        flex-direction: column;
    }
    .bottomIndicator{
        background: rgba(255, 255, 255, 0.8196078431) !important;
        border-radius: 0px 0px 8px 8px;
        color: black !important;
        font-weight: unset !important;
    }
    .bottomIndicator span{
        margin-right: 10px;
    }
    .condBlue:before{
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #0066ff;
    }
    .condYellow:before{
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #F4D03F;
    }
    .condRed:before{
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #E93232;
    }
    .condOrange:before{
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #e65c00;
    }
</style>
