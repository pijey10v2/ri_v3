<?php
// check if login or not here
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('Quality_PBHS', false, 0);

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
            <div class="layout oneRow" id="lOne"> 
                <div class="twoColumn main-div">
                    <div class="columnOne S twoRow">
                        <div class="rowOne L twoRow round">
                            <div class="rowOne M threeRow round background">
                                <div class="rowOne M flex">
                                    <div class="infoContainer round">
                                        <div class="head purple">CURRENT CUMULATIVE METHOD STATEMENT</div>
                                        <span id="cumulMethodStatementCard">0</span>
                                    </div>
                                </div>
                                <div class="rowTwo M flex">
                                    <div class="infoContainer round">
                                        <div class="head purple">METHOD STATEMENT UNDER REVIEW</div>
                                        <span id="reviewMethodStatementCard">0</span>
                                    </div>
                                </div>
                                <div class="rowThree M flex">
                                    <div class="infoContainer round">
                                        <div class="head purple">CURRENT CUMULATIVE MATERIAL ACCEPTANCE</div>
                                        <span id="currentCumulativeMaterialCard">0</span>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo M twoRow">
                                <div class="rowOne-T roundT" style="background: #0b364d">REQUEST FOR INFORMATION TECHNICAL (RFIT)</div>
                                <div class="rowTwo-T twoRow roundB">
                                    <div class="rowOne ML flex">
                                        <div class="infoContainer round">
                                            <div class="head black">RFIT SUBMITTED</div>
                                            <span id="RFISubmittedCard">0</span>
                                        </div>
                                        <div class="infoContainer round">
                                            <div class="head black">CUMULATIVE SUBMITTED</div>
                                            <span id="cummulativeSubmittedCard">0</span>
                                        </div>
                                    </div>
                                    <div class="rowTwo SM infoContainerDiv">
                                        <div class="infoContainer round">
                                            <div class="head" style="background: #F0CB69">REPLIED</div>
                                            <div class="body centerMiddle">
                                                <span id="repliedCard">0</span>
                                            </div>
                                        </div>
                                        <div class="infoContainer round">
                                            <div class="head" style="background: #DC5356">REMAINING</div>
                                            <div class="body centerMiddle">
                                                <span id="remainingCard">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo S twoRow round">
                            <div class="rowOne-T roundT">SITE DIARY (WEATHER)</div>
                            <div class="rowTwo-T roundB" id = "weatherSDL"></div>
                        </div>
                    </div>
                    <div class="columnTwo L twoColumn">
                        <div class="columnOne M oneRow">
                            <div class="rowOne twoRow">
                                <div class="rowOne SM twoColumn tableHeaderGroup">
                                    <div class="columnOne M60 twoRow round overflow-wrap">
                                        <div class="rowOne-T roundT">SITE DIARY RECORD</div>
                                        <div class="rowTwo-T roundB" id = "dashboarditem">
                                            <div class="rowOne ML tableContainer scrollbar-inner ">
                                                <table id ="SiteDiaryBody" class=""> 
                                                    <thead>
                                                        <th style="background: #0B364D ; font-size: 10px !important">List SDL</th>
                                                        <th style="background: #0B364D ; font-size: 10px !important">No. of ManPower</th>
                                                        <th style="background: #0B364D ; font-size: 10px !important">No. of Machinery</th>
                                                    </thead>
                                                    <tbody id="siteDiaryTBody">
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="rowTwo SM infoContainerDiv">
                                                    <div class="infoContainer round remargin">
                                                        <div class="head black fontSmall">TOTAL MANPOWER</div>
                                                        <div class="body centerMiddle">
                                                            <span id="totalManPowerCard" class="">0</span>
                                                        </div>
                                                    </div>
                                                    <div class="infoContainer round remargin">
                                                        <div class="head black fontSmall">TOTAL MACHINERY</div>
                                                        <div class="body centerMiddle">
                                                            <span id="totalMachineryCard" class="">0</span>
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="columnTwo M40 twoRow print-absolute">
                                        <div class="rowOne M twoRow round print-fit-content">
                                            <div class="rowOne-T roundT">MS STATUS</div>
                                            <div class="dash-charts rowTwo-T roundB" id="MSStatusCharts"></div> 
                                        </div>
                                        <div class="rowTwo M twoRow round print-fit-content">
                                            <div class="rowOne-T roundT">MA STATUS</div>
                                            <div class="dash-charts rowTwo-T roundB" id="MAStatusCharts"></div> 
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo ML twoRow round printML" style="position: relative">
                                    <div class="rowOne-T roundT">STATUS (CUMULATIVE)</div>
                                    <div class="rowTwo-T threeRow roundB">
                                        <div class="rowOne M twoColumn">    
                                            <div class="columnOne M" id="NCRQualityStatus">
                                            </div>
                                            <div class="columnTwo M"  id="NCRHSETStatus">
                                            </div>
                                        </div>
                                        <div class="rowTwo M twoColumn">
                                            <div class="columnOne M" id="QualityStatusCumulative">
                                            </div>
                                            <div class="columnTwo M"  id="NOIHSETStatus">
                                            </div>
                                        </div>
                                        <div class="rowThree M oneColumn roundB" id="RFIStatus">
                                        </div>
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
                                                <th style="background: #0B364D ;">WORK DISCIPLINE</th>
                                                <th style="background: #0B364D ;">RECEIVED</th>
                                                <th style="background: #0B364D ;">OPEN</th>
                                            </thead>
                                            <tbody id="ncrWdTbody">
                                            </tbody>
                                        </table>
                                    </div>
                                </div> 
                                <div class="rowTwo M twoRow" style="position: relative">
                                    <div class="rowOne M twoColumn" id="printD1">
                                        <div class="columnOne M">
                                            <div class="rowOne twoRow round">
                                                <div class="rowOne-T roundT">NEW MS SUBMISSION</div>
                                                <div class="dash-charts rowTwo-T roundB" id="newMSSubmissionChart"></div> 
                                            </div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class="rowOne twoRow round">
                                                <div class="rowOne-T roundT">NEW MA SUBMISSION</div>
                                                <div class="dash-charts rowTwo-T roundB" id="newMTSubmissionChart"></div> 
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowTwo M twoColumn">
                                        <div class="columnOne M">
                                            <div class="rowOne twoRow round">
                                                <div class="rowOne-T roundT">NCR RECEIVED</div>
                                                <div class="dash-charts rowTwo-T roundB" id="NCRReceivedChart"></div>
                                            </div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class="rowOne twoRow round">
                                                <div class="rowOne-T roundT">SM / NOI RECEIVED</div>
                                                <div class="dash-charts rowTwo-T roundB" id="NOIReceivedChart"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo S round">
                                <div class="rowOne-T roundT">AGEING FOR NCR, MS, MA AND RFIT</div>
                                <div class="rowTwo-T roundB fourColumn">
                                    <div class="columnOne M twoRow dash-charts" id="NCRChart" style="border-bottom-left-radius: 5px;">

                                    </div>
                                    <div class="columnTwo M twoRow dash-charts" id="methodStatementChart">

                                    </div>
                                    <div class="columnThree M twoRow dash-charts" id="matApprovalChart">

                                    </div>
                                    <div class="columnFour M twoRow dash-charts" id="rfitAgeChart"  style="border-bottom-right-radius: 5px;">

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
    .fontSmall{
        font-size: 10px !important;
    }
    .remargin{
        margin: 1px 5px !important;
        line-height: 22px !important
    }

    .showLabel{
        font-size: 10px;
        display: none;
    }

    .highcharts-menu > li{
        list-style: none !important
    }
    /* .highcharts-legend-box{
        display: none;
    }
    .highcharts-legend{
        display: none;
    } */
    .highcharts-data-label-connector {
        display: none;
    }
    .highcharts-data-label{
        display: none;
    }
    .highcharts-title{
        text-align: center !important
    }
    .highcharts-container.highcharts-container{
        z-index: auto !important; 
        /* overflow: visible!important; */
    }
    .clickableCard {
        cursor:pointer;
    }

    @media print{
        .print-absolute{
            position: absolute;
            top: 0px;
            width: 55%;
        }

        .print-fit-content{
            height: fit-content;
        }

        .printML{
            width: 435px !important;
        }
    }
</style>