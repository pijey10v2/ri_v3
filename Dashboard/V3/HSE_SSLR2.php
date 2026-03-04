<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('HSE_SSLR2', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
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
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout oneRow" id="lOne"> 
                <div class="columnOne threeRow main-div">
                    <div class="rowOne M twoColumn round"> 
                        <div class="columnOne ML twoRow round shadow">
                            <div class="rowOne-T roundT">
                                TOTAL MAN HOURS WITHOUT LTI (HRS)
                            </div>
                            <div class="dash-charts rowTwo-T roundB" id="TotalManHrsWOLTI"></div> 
                        </div>
                        <div class="columnTwo SM twoColumn round shadow background">
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
                                <div class="rowOne-T roundT fontSmall">
                                    HSET COMMITTEE MEETING
                                </div>
                                <div class="dash-charts rowTwo-T roundB" id="HSECommitteeMeeting"></div> 
                            </div>
                            <div class="columnTwo M twoRow round shadow">
                                <div class="rowOne-T roundT fontSmall">
                                    HSET TOOLBOX MEETING
                                </div>
                                <div class="dash-charts rowTwo-T roundB" id="HSEToolboxMeeting"></div> 
                            </div>
                            <div class="columnThree M twoRow round shadow">
                                <div class="rowOne-T roundT fontSmall">
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
        </div>
        <script src="../../JS/dashboard/dashboardv3.js"></script>
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
    .showLabel{
        display: none;
    }
    .clickableCard {
        cursor:pointer;
    }
    .fontSmall{
        font-size: 8px !important;
    }
</style>