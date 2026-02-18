<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('HSE');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../CSS/scrollBarCollapse.css">
        <script src="../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../JS/scrollBarCollapse.js"></script>  
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
                <h4>HEALTH, SAFETY, ENVIRONMENT AND TRAFFIC</h4>
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
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout oneRow" id="lOne"> 
                <div class="columnOne threeRow main-div">
                    <div class="rowOne M twoColumn round"> 
                        <div class="columnOne ML twoRow round shadow">
                            <div class="rowOne-T roundT">
                                TOTAL MAN HOURS WITHOUT LTI (HRS)
                            </div>
                            <div class="dash-charts rowTwo-T roundB" id="TotalManHrsWOLTI"></div> 
                        </div>
                        <div class="columnTwo SM twoColumn round shadow" style="background:white;">
                            <div class="columnOne M flex">
                                <div class="infoContainer round shadow">
                                    <div class="head roundT">CUMULATIVE TOTAL MAN-HOURS WITHOUT LTI</div>
                                    <span id="CumulTotalManHrsWOLTI">0</span>
                                </div>
                                <div class="infoContainer round shadow">
                                    <div class="head roundT">TOTAL ACCIDENTS/INCIDENTS</div>
                                    <span id="AccidentAndIncidentForm">0</span>
                                </div>
                            </div>
                            <div class="columnTwo M flex">
                                <div class="infoContainer round shadow">
                                    <div class="head roundT">CUMULATIVE TOTAL MAN-HOURS WITH LTI</div>
                                    <span id="CumulTotalManHrsWithTI">0</span>
                                </div>
                                
                                <div class="infoContainer round shadow">
                                    <div class="head roundT">FATALITY</div>
                                    <span id="NumOfFatality">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M twoColumn round">
                        <div class="columnOne ML twoRow round shadow">
                            <div class="rowOne-T roundT">
                                HSET WALKABOUT AND INDUCTION
                            </div>
                            <div class="dash-charts rowTwo-T roundB" id="HSEWalkaboutAndInduction"></div> 
                        </div>
                        <div class="columnTwo SM twoRow round shadow">
                            <div class="rowOne-T roundT">
                                OVERALL ACCIDENT / INCIDENTS RECORD
                            </div>
                            <div class="dash-charts rowTwo-T roundB" id="OverallIncidentsAndAccidentsRecord"></div> 
                        </div>
                    </div>
                    <div class="rowThree M twoColumn round">   
                        <div class="columnOne M threeColumn" style="background: transparent; padding: 0 0 10px 0;">
                            <div class="columnOne M twoRow round shadow">
                                <div class="rowOne-T roundT">
                                    HSET COMMITTEE MEETING
                                </div>
                                <div class="dash-charts rowTwo-T roundB" id="HSECommitteeMeeting"></div> 
                            </div>
                            <div class="columnTwo M twoRow round shadow">
                                <div class="rowOne-T roundT">
                                    HSET TOOLBOX MEETING
                                </div>
                                <div class="dash-charts rowTwo-T roundB" id="HSEToolboxMeeting"></div> 
                            </div>
                            <div class="columnThree M twoRow round shadow">
                                <div class="rowOne-T roundT">
                                    HSET ACTIVE TRAFFIC DIVERSION
                                </div>
                                <div class="dash-charts rowTwo-T roundB" id="HSEActiveTrafficDiversion"></div> 
                            </div>
                        </div>
                        <div class="columnTwo M twoRow round shadow">
                            <div class="rowOne-T roundT">
                                HSET ACTIVITY / PROGRAM
                            </div>
                            <div class="dash-charts rowTwo-T roundB" id="HSEActivityProgram"></div> 
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
</html>';

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

    .highcharts-tooltip span {
        height:auto;
        width:140px;
        overflow:auto;
        white-space:normal !important;
    }
    .showLabel{
        font-size: 10px;
        display: none;
    }
</style>