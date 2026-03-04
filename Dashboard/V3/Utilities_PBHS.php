<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('utilities_PBHS', false, 0);

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
                <div class="RowOne twoColumn">
                    <div class="columnOne SM twoRow">
                        <div class="rowOne L twoRow">
                            <div class="rowOne-T roundT">LIST OF REQUEST FOR INSPECTION (RFI)</div>
                            <div class="rowTwo-T roundB">
                                <div class="tableContainer scrollbar-inner">
                                    <table id ="ulttb"> 
                                        <thead>
                                            <th>Ref No</th>
                                            <th>Description of Work</th>
                                            <th>Date Inspection</th>
                                            <th>Time Inspection</th>
                                        </thead>
                                        <tbody id="rfiTBody"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo S round white flex">
                            <div class="tableContainer scrollbar-inner round">
                                <table id ="" class="tableWidth"> 
                                    <thead class="">
                                        <th class="">Types</th>
                                        <th class="">Current Cumulative</th>
                                        <th class="">Open</th>
                                        <th class="">Closed</th>
                                    </thead>
                                    <tbody id="tableURWOthers"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo ML threeRow round tableContainer scrollbar-inner">
                        <table id="" class="background"> 
                            <thead style="position: sticky; z-index: 100" class="procurment tableHeader">
                                <tr>
                                    <th rowspan="2" class="" scope="col" style="text-align:center; border: 1px solid white; border">UTILITY PROVIDER</th>
                                    <th colspan="3" class="" scope="colgroup" style="text-align:center;  border: 1px solid white">STATUS</th>
                                </tr>
                                <tr>
                                    <th class="secondRow " scope="col" style="text-align:center; border: 1px solid white">DESIGN</th>
                                    <th class="secondRow " scope="col" style="text-align:center; border: 1px solid white">APPOINTMENT OF CONTRACTORS</th>
                                    <th class="secondRow " scope="col" style="text-align:center; border: 1px solid white">UTILITY WORK PROGRESS</th>
                                </tr>
                            </thead>
                            <tbody id = "dataUtility">

                            </tbody>
                        </table>
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

    th:after,
    th:before {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
    }

    th:before {
        top: -1px;
        border-top: 1px solid white;
    }

    th:after {
    bottom: -1px;
    border-bottom: 2px solid white;
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
        background: var(--surface) !important;
        color: var(--on-surface);
    }

    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #dataUtility tr td{
        border: 1px solid var(--border-bottom);
        background: var(--surface);
    }

    .showLabel{
        font-size: 10px;
        display: none;
    }

    .highcharts-menu > li{
        list-style: none !important
    }
</style>