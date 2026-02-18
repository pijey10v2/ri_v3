<?php
// check if login or not here
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('quality');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '
<html>
    <head>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../CSS/'.$theme.'/RVguiStyle.css">
        <link rel="stylesheet" href="../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../CSS/scrollBarCollapse.css">
        <script src="../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../JS/scrollBarCollapse.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        </head>
    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class = "dashboardHeader" style="background: #0B364D;">
            <div class = "logo">
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
            </div>
            <div class = "title">
                <h4>QUALITY MANAGEMENT DASHBOARD</h4>
                <h3 style="text-align: center;">'.$dashObj->projectInfo['project_name'].'</h3>
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
                        <select id="wpcFilter">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" onclick="refreshDashboard()">'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Section</label><br>
                        <select id="sectionFilter" onchange="refreshDashboard()">
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
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout oneRow" id="lOne"> 
                <div class="threeColumn main-div">
                    <div class="columnOne M twoRow">
                        <div class="rowOne L twoRow">
                            <div class="rowOne M threeRow round shadow" style="background: white;">
                                <div class="rowOne M flex">
                                    <div class="infoContainer round shadow">
                                        <div class="head purple">CURRENT CUMULATIVE METHOD STATEMENT</div>
                                        <span id="cumulMethodStatementCard">0</span>
                                    </div>
                                </div>
                                <div class="rowTwo M twoColumn">
                                    <div class="columnOne L flex">
                                        <div class="infoContainer round shadow">
                                            <div class="head purple">UNDER REVIEW BY RET</div>
                                            <span id="underReviewRETCard">0</span>
                                        </div>
                                    </div>
                                    <div class="columnTwo L flex">
                                        <div class="infoContainer round shadow">
                                            <div class="head purple">UNDER REVIEW BY PLPS</div>
                                            <span id="underReviewPLPSCard">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowThree M flex">
                                    <div class="infoContainer round shadow">
                                        <div class="head purple">CURRENT CUMULATIVE MATERIAL APPROVAL</div>
                                        <span id="currentCumulativeMaterialCard">0</span>
                                    </div>
                                </div>
                            </div>

                            <div class="rowTwo M round shadow" style="padding-top: 5px">
                                <div class="rowOne-T roundT" style="background: #0B364D;">REQUEST FOR INFORMATION</div>
                                <div class="rowTwo-T twoRow roundB">
                                    <div class="rowOne ML flex">
                                        <div class="infoContainer round shadow">
                                            <div class="head black">RFI SUBMITTED</div>
                                            <span id="RFISubmittedCard">0</span>
                                        </div>
                                        <div class="infoContainer round shadow">
                                            <div class="head black">CUMMULATIVE SUBMITTED</div>
                                            <span id="cummulativeSubmittedCard">0</span>
                                        </div>
                                    </div>
                                    <div class="rowTwo SM infoContainerDiv">
                                        <div class="infoContainer round shadow">
                                            <div class="head" style="background: #F0CB69;">REPLIED</div>
                                            <div class="body centerMiddle">
                                                <span id="repliedCard">0</span>
                                            </div>
                                        </div>
                                        <div class="infoContainer round shadow">
                                            <div class="head" style="background: #DC5356;">REMAINING</div>
                                            <div class="body centerMiddle">
                                                <span id="remainingCard">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="rowTwo S twoColumn">
                            <div class="columnOne w50 twoRow round shadow">
                                <div class="rowOne-T roundT">MS STATUS</div>
                                <div class="dash-charts rowTwo-T roundB" id="MSStatusCharts"></div> 
                            </div>
                            <div class="columnTwo w50 twoRow round shadow">
                                <div class="rowOne-T roundT">MT STATUS</div>
                                <div class="dash-charts rowTwo-T roundB" id="MAStatusCharts"></div> 
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M twoRow">
                        <div class="rowOne L twoRow">
                            <div class="rowOne M twoRow round shadow">
                                <div class="rowOne-T roundT">SITE DIARY RECORD</div>
                                <div class="rowTwo-T roundB" id = "dashboarditem">
                                    <div class="rowOne ML tableContainer scrollbar-inner ">
                                        <table id ="SiteDiaryBody" class=""> 
                                            <thead>
                                                <th style="background: #0B364D;">List SDL</th>
                                                <th style="background: #0B364D;">No. of ManPower</th>
                                                <th style="background: #0B364D;">No. of Machinery</th>
                                            </thead>
                                            <tbody id="siteDiaryTBody">
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="rowTwo SM twoColumn">
                                        <div class="columnOne w50 flex">
                                            <div class="infoContainer round shadow">
                                                <div class="head black">TOTAL MANPOWER</div>
                                                <span id="totalManPowerCard">0</span>
                                            </div>
                                        </div>
                                        <div class="columnTwo w50 flex">
                                            <div class="infoContainer round shadow">
                                                <div class="head black">TOTAL MACHINERY</div>
                                                <span id="totalMachineryCard">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo M twoColumn round">
                                <div class="columnOne w50 twoRow">
                                    <div class="rowOne M twoRow round shadow">
                                        <div class="rowOne-T roundT">NCR QUALITY STATUS (CUMULATIVE)</div>
                                        <div class="dash-charts rowTwo-T roundB" id="NCRQualityStatus"></div> 
                                    </div>
                                    <div class="rowTwo M twoRow round shadow">
                                        <div class="rowOne-T roundT">NOI QUALITY STATUS (CUMULATIVE)</div>
                                        <div class="dash-charts rowTwo-T roundB" id="QualityStatusCumulative"></div> 
                                    </div>
                                </div>
                                <div class="columnTwo w50 twoRow">
                                    <div class="rowOne M twoRow round shadow">
                                        <div class="rowOne-T roundT">NCR HSET STATUS (CUMULATIVE)</div>
                                        <div class="dash-charts rowTwo-T roundB" id="NCRHSETStatus"></div> 
                                    </div>
                                    <div class="rowTwo M twoRow round shadow">
                                        <div class="rowOne-T roundT">NOI HSET STATUS (CUMULATIVE)</div>
                                        <div class="dash-charts rowTwo-T roundB" id="NOIHSETStatus"></div> 
                                    </div>
                                </div>  
                            </div> 
                        </div>
                        <div class="rowTwo S twoColumn round" style=" padding: 0 0 10px 0;">
                            <div class="columnOne w50">
                                <div class="rowOne twoRow round">
                                    <div class="rowOne-T roundT">WIR QUALITY STATUS</div>
                                    <div class="rowTwo-T shadow roundB" id="WIRQualityStatus"></div>
                                </div>
                            </div>
                            <div class="columnTwo w50">
                                <div class="rowOne twoRow round">
                                    <div class="rowOne-T roundT">WIR HSET STATUS</div>
                                    <div class="rowTwo-T shadow roundB" id="WIRHSETStatus"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnThree M twoRow">
                        <div class="rowOne L twoRow">
                            <div class="rowOne M twoRow round shadow">
                                <div class="rowOne-T roundT">CONTROLLED OF NON CONFORMITY (NCR) BY ACTIVITIES</div>
                                <div class="rowTwo-T tableContainer scrollbar-inner roundB" id = "dashboarditem">
                                    <table id ="NCRbyActivitiesBody" class=""> 
                                        <thead>
                                            <th style="background: #0B364D;">WORK DISCIPLINE</th>
                                            <th style="background: #0B364D;">RECEIVED</th>
                                            <th style="background: #0B364D;">OPEN</th>
                                            <th style="background: #0B364D;">CLOSED</th>
                                        </thead>
                                        <tbody id="ncrWdTbody">
                                        </tbody>
                                    </table>
                                </div>
                            </div> 
                            <div class="rowTwo M twoRow">
                                <div class="rowOne M twoColumn">
                                    <div class="columnOne w50">
                                        <div class="rowOne twoRow round">
                                            <div class="rowOne-T roundT">NEW MS SUBMISSION</div>
                                            <div class="dash-charts rowTwo-T shadow roundB" id="newMSSubmissionChart"></div> 
                                        </div>
                                    </div>
                                    <div class="columnTwo w50">
                                        <div class="rowOne twoRow round">
                                            <div class="rowOne-T roundT">NEW MT SUBMISSION</div>
                                            <div class="dash-charts rowTwo-T shadow roundB" id="newMTSubmissionChart"></div> 
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo M twoColumn">
                                    <div class="columnOne w50">
                                        <div class="rowOne twoRow round">
                                            <div class="rowOne-T roundT">NCR RECEIVED</div>
                                            <div class="dash-charts rowTwo-T shadow roundB" id="NCRReceivedChart"></div>
                                        </div>
                                    </div>
                                    <div class="columnTwo w50">
                                        <div class="rowOne twoRow round">
                                            <div class="rowOne-T roundT">NOI RECEIVED</div>
                                            <div class="dash-charts rowTwo-T shadow roundB" id="NOIReceivedChart"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo S round">
                            <div class="rowOne-T roundT">AGEING FOR NCR, MS AND MA</div>
                            <div class="rowTwo-T roundB threeColumn" style="background: white;">
                                <div class="columnOne M twoRow dash-charts" id="NCRChart" style="border-bottom-left-radius: 5px;">

                                </div>
                                <div class="columnTwo M twoRow dash-charts" id="methodStatementChart">

                                </div>
                                <div class="columnThree M twoRow dash-charts" id="matApprovalChart" style="border-bottom-right-radius: 5px;">

                                </div>
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
    /*header changes*/
    h4 {
        font-size: 1.3em;
    }

    /*other fixes*/
    .dashboardBody .twoRow .rowTwo-T {
        /*background-color: unset!important;*/
    }
    .cutOffDateInfoDiv {
        color: white;
        font-size: 14px;
        font-weight: bold;
        height: 100%;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        text-align: center;
    }
    .cutOffDateVal {
        margin-top: 5px;
    }

    .dashboardBody .layout .oneRow .rowTwo-L .twoColumn .columnOne-M .twoRow .rowOne-T .containerHeader{
        font-size: 100px;
        margin-left: 3000px;
    }

    .main-div {
        height: 100%;
    }

    .textLabel {
        margin-top: 10px;
        font-size: 25px;
        text-align: center;
    }
    
    .datalabel {
        font-size: 0.32em;
        padding-bottom: 5px;
    }
    .dash-charts-scurve {
        height: 60%!important;
    }

    .dashboardBody .threeRow .rowOne-XS {
        height: 15%;
    }

    .dashboardBody .threeRow .rowTwo-L {
        height: 40%;
    }
    .dashboardBody .threeRow .rowThree-L {
        height: 40%;
    }
    .corrStatusBarDiv {
        background-color: grey;
        height: 15px;
        width: 85%;
        display: inline-block;  
        margin: 5px;
        border-radius: 15px;
    }
    .corrStatusDiv {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .corrStatusPercDiv {
        background-color: blue;
        height: 15px;
        width: 0%;
        border-radius: 15px 0px 0px 15px;
    }
    .chartTitleSmall {
        font-size: 10px;
        text-align: center;
    }

    .manHourDiv {
        margin-top: 5px;
    }
    
    .containerHeaderCustLeft {
        width: calc(50%)!important;
        font-size: 0.9em!important;
        padding : 5px;
    }

    .containerHeaderCustRight {
        width: calc(50%)!important;
        font-size: 0.9em!important;
        padding : 5px;
        float: right;
        text-align: right;
    }

    .infoContainer-small {
        line-height: 15px!important;
    }

    .gauge-charts {
        height: 50%!important;
    }

    .safetyFatalityPropDamageChart {
        height: 50%!important;
    }

    .purple{
        background: #580776 !important;
        color: white ;
    }

    .black{
        background: black;
        color: white;
    }

    .yellow{
        background: #f0cb69 !important;
        color: white;
    }

    .red{
        background: #dc5356 !important;
        color: white;
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