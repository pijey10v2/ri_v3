<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('maintenanceProgress');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
$projectName = (isset($_SESSION['project_name'])) ? $_SESSION['project_name'] : '';
$fullName = 'Maintenance Progress';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">              <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  
    </head>
    <body class='.$themeClass.'>
        <h4 id="printHeader">'.$fullName.' - '.$projectName.'</h4>
        <div class = "dashboardBody">
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
                                    <div class="columnOne M twoRow">
                                        <div class="rowOne-T noBackground">NCP STATUS</div>
                                        <div class="rowTwo-T" id="ncpPieChart"></div>
                                    </div>
                                    <div class="columnTwo M twoRow">
                                        <div class="rowOne-T noBackground">NCP SATISFACTORY</div>
                                        <div class="rowTwo-T" id="ncpStatusPieChart"></div>
                                    </div>
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
                        <div class="rowTwo M twoRow round shadow flex white">
                            <div class="infoContainer round shadow" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                                <div class="head">ROUTINE MAINTENANCE BUDGET AMOUNT</div>
                                <span class="" id="ttlBudget"></span>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">TOTAL ROUTINE MAINTENANCE AMOUNT CLAIMED</div>
                                <span class="" id="ttlRoutine"></span>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">TOTAL EMERGENCY AMOUNT CLAIMED</div>
                                <span class="" id="ttlEmergency"></span>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">TOTAL CLAIM AMOUNT</div>
                                <span id="ttlClaim"></span>
                            </div>
                            <div class="infoContainer round shadow" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                                <div class="head">REMAINING AMOUNT</div>
                                <span class="ttlRemainAmt" id="ttlRemain"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="../../JS/dashboard/dashboardv3.js"></script>
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
        background: var(--surface) !important;
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
    .showLabel{
        display: none;
        word-wrap: break-word;
    }
    .noBackground{
        background-color: transparent !important;
        color: var(--on-surface) !important;
    }
    .clickableCard {
        cursor:pointer;
    }
    #printHeader{
        color: var(--on-surface);
        display: none;
    }
    @media print{
        #printHeader{
            display: block
        }
    }
</style>
