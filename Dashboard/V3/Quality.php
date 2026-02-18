<?php
// check if login or not here
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('quality', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
    <head>
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
    </head>
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout twoColumn" id="lOne" style="width: calc(100% - 10px);">
                <div class="columnOne S twoRow">
                    <div class="rowOne L twoRow">
                        <div class="rowOne M threeRow round background">
                            <div class="rowOne M flex">
                                <div class="infoContainer round">
                                    <div class="head purple">CURRENT CUMULATIVE METHOD STATEMENT</div>
                                    <span id="cumulMethodStatementCard">0</span>
                                </div>
                            </div>
                            <div class="rowTwo M twoColumn">
                                <div class="columnOne L flex">
                                    <div class="infoContainer round">
                                        <div class="head purple">UNDER REVIEW BY RET</div>
                                        <span id="underReviewRETCard">0</span>
                                    </div>
                                </div>
                                <div class="columnTwo L flex">
                                    <div class="infoContainer round">
                                        <div class="head purple">UNDER REVIEW BY PLPS</div>
                                        <span id="underReviewPLPSCard">0</span>
                                    </div>
                                </div>
                            </div>
                            <div class="rowThree M flex">
                                <div class="infoContainer round">
                                    <div class="head purple">CURRENT CUMULATIVE MATERIAL APPROVAL</div>
                                    <span id="currentCumulativeMaterialCard">0</span>
                                </div>
                            </div>
                        </div>

                        <div class="rowTwo M round" style="padding-top: 5px">
                            <div class="rowOne-T roundT" style="background: #0B364D;">REQUEST FOR INFORMATION</div>
                            <div class="rowTwo-T twoRow roundB">
                                <div class="rowOne ML flex">
                                    <div class="infoContainer round">
                                        <div class="head black">RFI SUBMITTED</div>
                                        <span id="RFISubmittedCard">0</span>
                                    </div>
                                    <div class="infoContainer round">
                                        <div class="head black">CUMMULATIVE SUBMITTED</div>
                                        <span id="cummulativeSubmittedCard">0</span>
                                    </div>
                                </div>
                                <div class="rowTwo SM infoContainerDiv">
                                    <div class="infoContainer round">
                                        <div class="head" style="background: #F0CB69;">REPLIED</div>
                                        <div class="body centerMiddle">
                                            <span id="repliedCard">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer round">
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
                        <div class="columnOne M twoRow round">
                            <div class="rowOne-T roundT">MS STATUS</div>
                            <div class="dash-charts rowTwo-T roundB" id="MSStatusCharts"></div> 
                        </div>
                        <div class="columnTwo M twoRow round">
                            <div class="rowOne-T roundT">MT STATUS</div>
                            <div class="dash-charts rowTwo-T roundB" id="MAStatusCharts"></div> 
                        </div>
                    </div>
                </div>
                <div class="columnTwo L twoColumn">
                    <div class="columnOne M twoRow flexColumn">
                        <div class="rowOne L twoRow fitContent">
                            <div class="rowOne M twoRow round tableCell">
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
                                        <div class="columnOne M flex">
                                            <div class="infoContainer round">
                                                <div class="head black">TOTAL MANPOWER</div>
                                                <span id="totalManPowerCard">0</span>
                                            </div>
                                        </div>
                                        <div class="columnTwo M flex">
                                            <div class="infoContainer round">
                                                <div class="head black">TOTAL MACHINERY</div>
                                                <span id="totalMachineryCard">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo M twoColumn round">
                                <div class="columnOne M twoRow heightSmall">
                                    <div class="rowOne M twoRow round">
                                        <div class="rowOne-T roundT">NCR QUALITY STATUS</div>
                                        <div class="dash-charts rowTwo-T roundB" id="NCRQualityStatus"></div> 
                                    </div>
                                    <div class="rowTwo M twoRow round">
                                        <div class="rowOne-T roundT">NOI QUALITY STATUS</div>
                                        <div class="dash-charts rowTwo-T roundB" id="QualityStatusCumulative"></div> 
                                    </div>
                                </div>
                                <div class="columnTwo M twoRow heightSmall">
                                    <div class="rowOne M twoRow round">
                                        <div class="rowOne-T roundT">NCR HSET STATUS</div>
                                        <div class="dash-charts rowTwo-T roundB" id="NCRHSETStatus"></div> 
                                    </div>
                                    <div class="rowTwo M twoRow round">
                                        <div class="rowOne-T roundT">NOI HSET STATUS</div>
                                        <div class="dash-charts rowTwo-T roundB" id="NOIHSETStatus"></div> 
                                    </div>
                                </div>  
                            </div> 
                        </div>
                        <div class="rowTwo S twoColumn round marginTop" style=" padding: 0 0 10px 0;">
                            <div class="columnOne M">
                                <div class="rowOne twoRow round" style="height: 100%">
                                    <div class="rowOne-T roundT">WIR QUALITY STATUS</div>
                                    <div class="rowTwo-T roundB" id="WIRQualityStatus"></div>
                                </div>
                            </div>
                            <div class="columnTwo M">
                                <div class="rowOne twoRow round" style="height: 100%">
                                    <div class="rowOne-T roundT">WIR HSET STATUS</div>
                                    <div class="rowTwo-T roundB" id="WIRHSETStatus"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M twoRow">
                        <div class="rowOne L twoRow tableCell">
                            <div class="rowOne M twoRow round">
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
                                    <div class="columnOne M">
                                        <div class="rowOne twoRow round" style="height: 100%">
                                            <div class="rowOne-T roundT">NEW MS SUBMISSION</div>
                                            <div class="dash-charts rowTwo-T roundB" id="newMSSubmissionChart"></div> 
                                        </div>
                                    </div>
                                    <div class="columnTwo M">
                                        <div class="rowOne twoRow round" style="height: 100%">
                                            <div class="rowOne-T roundT">NEW MT SUBMISSION</div>
                                            <div class="dash-charts rowTwo-T roundB" id="newMTSubmissionChart"></div> 
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo M twoColumn">
                                    <div class="columnOne M">
                                        <div class="rowOne twoRow round" style="height: 100%">
                                            <div class="rowOne-T roundT">NCR RECEIVED</div>
                                            <div class="dash-charts rowTwo-T roundB" id="NCRReceivedChart"></div>
                                        </div>
                                    </div>
                                    <div class="columnTwo M">
                                        <div class="rowOne twoRow round" style="height: 100%">
                                            <div class="rowOne-T roundT">NOI RECEIVED</div>
                                            <div class="dash-charts rowTwo-T roundB" id="NOIReceivedChart"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo S round">
                            <div class="rowOne-T roundT">AGEING FOR NCR, MS AND MA</div>
                            <div class="rowTwo-T roundB threeColumn">
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
    /*header changes*/
    h4 {
        font-size: 1.3em;
    }

    /*other fixes*/
    .dashboardBody .twoRow .rowTwo-T {
        /*background-color: unset!important;*/
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
        display: none
    }

    .clickableCard {
        cursor:pointer;
    }
</style>