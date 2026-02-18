<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('land_SSLR2', false, 0);

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
    </head>
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout twoRow" id="lOne">
                <div class="rowOne M twoRow">
                    <div class="rowOne-T round">LAND ENCUMBRANCES</div>
                    <div class="rowTwo-T transparent twoColumn">
                        <div class="columnOne L twoRow round Shadow" style="margin: 5px 5px 5px 0; height: calc(100% - 5px);">
                            <div class="rowOne-T roundT">DELIVERABLE</div>
                            <div class="rowTwo-T roundB" id = "land-deliverable">
                            </div>
                        </div>
                        <div class="columnTwo S round flex background" style="margin: 5px 0 5px 5px; height: calc(100% - 5px)">
                            <div class="infoContainer">
                                <div class="head">NO OF ENCUMBRANCE(QTY)</div>
                                <span id = "landTtlEncQty">0</span>
                            </div>
                            <div class="infoContainer">
                                <div class="head">TOTAL FOE %</div>
                                <span id = "landTotalFOECard">0</span>
                            </div>
                            <div class="infoContainer">
                                <div class="head">TOTAL ENCUMBRANCES %</div>
                                <span id = "landTotalEnCard">0</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M twoRow">
                    <div class="rowOne-T round">LAND ISSUE</div>
                    <div class="rowTwo-T transparent twoColumn">
                        <div class="columnOne L" style="margin: 5px 5px 5px 0; height: calc(100% - 10px)">
                            <div class="tableContainer round shadow">
                                <table id ="" style="background: transparent;">
                                    <thead style="background: transparent;">
                                        <tr style="baWckground: transparent;">
                                            <th style="border-top-left-radius: 5px;">WPC ID</th>
                                            <th>ISSUES</th>
                                            <th>DATE</th>
                                            <th>STATUS</th>
                                            <th>AGING(DAYS)</th>
                                            <th style="border-top-right-radius: 5px;">REMARKS</th>
                                        </tr>
                                    </thead>
                                    <tbody id="landTBody">
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="columnTwo S round flex background" style="margin: 5px 0 5px 5px; height: calc(100% - 5px)">
                            <div class="infoContainer">
                                <div class="head">TOTAL ISSUES</div>
                                <span id = "landTotalIssueCard">0</span>
                            </div>
                            <div class="infoContainer">
                                <div class="head">NEW</div>
                                <span id = "landTotalNewIssueCard">0</span>
                            </div>
                            <div class="infoContainer">
                                <div class="head">ONGOING</div>
                                <span id = "landTotalOngoingIssueCard">0</span>
                            </div>
                            <div class="infoContainer">
                                <div class="head">CLOSE</div>
                                <span id = "landClosedIssueCard">0</span>
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

    .white{
        background: #ffffff !important;
        color: black;
    }
    .showLabel{
        display: none
    }

</style>

<style media="print">
    #lOne{
        height: max-content;
    }
    .tableContainer{
        width: 875px !important
    }
</style>