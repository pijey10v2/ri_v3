<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('land');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$showHeader = true;
$showFilter = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
}
if (isset($_GET['noFilter']) && $_GET['noFilter'] == 1) {
    $showFilter = false;
}

$prefix = '';
if($_SESSION['ui_pref'] == "ri_v2"){
    $prefix = '../../../../../';
    $themeClass = $theme;
}

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">';
if($showFilter){
    $html .= '<link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->';
}else{
    $html .= '<link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/V3/dashboard.css"> ';
}
    $html .=
    '<link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/scrollBarCollapse.css">
        <script src="../../'.$dashObj->pathRel.'JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src ="../../'.$dashObj->pathRel.'JS/scrollBarCollapse.js"></script> 
        <link rel="stylesheet" href="../../'.$dashObj->pathRel.'CSS/swiper-bundle.css">
        <script src = "../../'.$dashObj->pathRel.'JS/scrollBarCollapse.js"></script> 
        <script src = "../../'.$dashObj->pathRel.'JS/swiper-bundle.min.js"></script>
        <script src="../../'.$dashObj->pathRel.'JS/highchart/v11/accessibility.js"></script>
    </head>
    <body class='.$themeClass.'>';
if($showFilter){
    $html .=
        '<div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard" style="z-index:2">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>';
}
if ($showHeader) {
    $html .= 
        '<div class = "dashboardHeader">
            <div class = "title">
                <h4>LAND MANAGEMENT DASHBOARD</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ='.$prefix.''.$dashObj->projectInfo['icon_url'].'">
            </div>
        </div>';
}
    $html .= 
        '<div class = "dashboardBody">';
        if($showFilter){
            $html .=
            '<div class="sidebar">
                <div class="filterContainer">
                    <div class="filter">
                        <label>Year</label><br>
                        <select onchange="refreshDashboard()" id = "yearFilter">';
                            foreach ($dashObj->yearOptions['overall'] as $year) {
                                $html .= '<option value="'.$year.'">'.$year.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Month</label><br>
                        <select onchange="refreshDashboard()" id = "monthFilter">
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
            </div>';
        }
        $html .=
                '<div class="layout oneRow mySwiper" id="lOne" style="overflow:hidden;">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" id="page1">
                        <div class="oneRow" style="width:calc(100% - 60px); margin: 0 30px;">
                            <div class="rowOne M twoRow ">
                                <div class="rowOne M threeColumn">
                                    <div class="columnOne M twoRow">
                                        <div class="rowOne-T roundt">NCH OVERALL LAND DASHBOARD</div>
                                        <div class="rowTwo-T roundb twoRow flex id="" >
                                            <div class="rowOne flex" style="flex: 1 1 auto" id="overallChart"></div>
                                            <div class="rowTwo oneRow">
                                                <div class="rowOne tableContainer roundB shadow flex row">
                                                    <table id="overallTable">
                                                        <thead>
                                                            <tr>
                                                                <th rowspan="2">DESCRIPTION</th>
                                                                <th colspan="2"><center>To Date</center></th>
                                                                <th colspan="2"><center>Balance</center></th>
                                                            </tr>
                                                            <tr>
                                                                <th>km</th>
                                                                <th>%</th>
                                                                <th>km</th>
                                                                <th>%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="overallTBody">
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="columnTwo M twoRow">
                                        <div class="rowOne-T roundt">NCH LAWAS SECTION 01 LAND DASHBOARD </div>
                                        <div class="rowTwo-T roundb twoRow flex" id="">
                                            <div class="rowOne flex" style="flex: 1 1 auto" id="lawas01Chart"></div>
                                            <div class="rowTwo M oneRow">
                                                <div class="rowOne tableContainer roundB shadow flex row">
                                                    <table id="">
                                                        <thead>
                                                            <tr>
                                                                <th rowspan="2">DESCRIPTION</th>
                                                                <th colspan="2"><center>To Date</center></th>
                                                                <th colspan="2"><center>Balance</center></th>
                                                            </tr>
                                                            <tr>
                                                                <th>km</th>
                                                                <th>%</th>
                                                                <th>km</th>
                                                                <th>%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="lawas01TBody">
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="columnThree M twoRow">
                                        <div class="rowOne-T roundt">NCH LAWAS SECTION 02 LAND DASHBOARD </div>
                                        <div class="rowTwo-T roundb twoRow flex" id="">
                                            <div class="rowOne flex" style="flex: 1 1 auto" id="lawas02Chart"></div>
                                            <div class="rowTwo M oneRow">
                                                <div class="rowOne tableContainer roundB shadow flex row">
                                                    <table id="">
                                                        <thead>
                                                            <tr>
                                                                <th rowspan="2">DESCRIPTION</th>
                                                                <th colspan="2"><center>To Date</center></th>
                                                                <th colspan="2"><center>Balance</center></th>
                                                            </tr>
                                                            <tr>
                                                                <th>km</th>
                                                                <th>%</th>
                                                                <th>km</th>
                                                                <th>%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="lawas02TBody">
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo M threeColumn">
                                    <div class="columnOne M twoRow">
                                        <div class="rowOne-T roundt">NCH LIMBANG SECTION 01 LAND DASHBOARD </div>
                                        <div class="rowTwo-T roundb twoRow flex" id="">
                                            <div class="rowOne flex" style="flex: 1 1 auto" id="limbang01Chart"></div>
                                            <div class="rowTwo M oneRow">
                                                <div class="rowOne tableContainer roundB shadow flex row">
                                                    <table id="">
                                                        <thead>
                                                            <tr>
                                                                <th rowspan="2">DESCRIPTION</th>
                                                                <th colspan="2"><center>To Date</center></th>
                                                                <th colspan="2"><center>Balance</center></th>
                                                            </tr>
                                                            <tr>
                                                                <th>km</th>
                                                                <th>%</th>
                                                                <th>km</th>
                                                                <th>%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="limbang01TBody">
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="columnTwo M twoRow">
                                        <div class="rowOne-T roundt">NCH LIMBANG SECTION 02 LAND DASHBOARD </div>
                                        <div class="rowTwo-T roundb twoRow flex" id="">
                                            <div class="rowOne flex" style="flex: 1 1 auto" id="limbang02Chart"></div>
                                            <div class="rowTwo M oneRow">
                                                <div class="rowOne tableContainer roundB shadow flex row">
                                                    <table id="">
                                                        <thead>
                                                            <tr>
                                                                <th rowspan="2">DESCRIPTION</th>
                                                                <th colspan="2"><center>To Date</center></th>
                                                                <th colspan="2"><center>Balance</center></th>
                                                            </tr>
                                                            <tr>
                                                                <th>km</th>
                                                                <th>%</th>
                                                                <th>km</th>
                                                                <th>%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="limbang02TBody">
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="columnThree M twoRow">
                                        <div class="rowOne-T roundt">NCH LIMBANG SECTION 03 LAND DASHBOARD </div>
                                        <div class="rowTwo-T roundb twoRow flex" id="">
                                            <div class="rowOne flex" style="flex: 1 1 auto" id="limbang03Chart"></div>
                                            <div class="rowTwo M oneRow">
                                                <div class="rowOne tableContainer roundB shadow flex row">
                                                    <table id="">
                                                        <thead>
                                                            <tr>
                                                                <th rowspan="2">DESCRIPTION</th>
                                                                <th colspan="2"><center>To Date</center></th>
                                                                <th colspan="2"><center>Balance</center></th>
                                                            </tr>
                                                            <tr>
                                                                <th>km</th>
                                                                <th>%</th>
                                                                <th>km</th>
                                                                <th>%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="limbang03TBody">
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide" id="page2">
                        <div class="oneRow twoRow" style="width:calc(100% - 60px); margin: 0 30px; display:flex; flex-direction: column; height:100%;">
                            <div class="rowOne L twoRow" style="flex: 1 1 auto;">
                                <div class="rowOne-T roundt">LAND SUMMARY</div>
                                <div class="rowTwo-T roundb" id="landSynopsis" style="overflow-y: auto">
                                </div>
                            </div>
                            <div class="rowTwo S twoRow" style="height: fit-content;">
                                <div class="rowOne-T roundt">LAND DATABASE</div>
                                <div class="rowTwo-T roundb" style="overflow: auto">
                                    <table class="landDatabaseTable">
                                        <thead id = "landDatabaseHead">
                                        </thead>
                                        <tbody id = "landDatabaseBody">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide" id="page-3">
                        <div class="oneRow twoRow" style="width:calc(100% - 60px); margin: 0 30px;">
                            <div class="rowOne M twoRow">
                                <div class="rowOne-T roundt">LAND TIMELINE</div>
                                <div class="rowTwo-T roundb" style="overflow: auto">
                                    <table class="timelineTable">
                                        <thead id = "timelineHead">
                                        </thead>
                                        <tbody id = "timelineBody">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="rowOne M twoRow round shadow" id="lmrSectionTableHeight">
                                <div class="rowOne-T roundt">LAND MANAGEMENT REPORT - ISSUES</div>
                                <div class="rowTwo-T roundb" style="overflow: auto;">
                                    <table class="lmrSectionTable" style="height: 100%">
                                        <thead class="lmr">
                                            <tr class="firstTrLmr">
                                                <th rowspan="3" style="text-align: center;">SECTION</th>
                                                <th colspan="3" style="text-align: center;">PREVIOUS AS OF <span id="cutOff-day">'.$dashObj->cutoffDay.'</span>&nbsp;<span id="cutOff-month-prev-section"></span>&nbsp;<span id="cutOff-year-prev-section"></span></th>
                                                <th colspan="6" style="text-align: center;" class="currentCol">CURRENT AS OF <span id="cutOff-day">'.$dashObj->cutoffDay.'</span>&nbsp;<span id="cutOff-month-curr-section">'.date("F", strtotime($dashObj->cutOffDate)).'</span>&nbsp;<span id="cutOff-year-curr-section">'.date("Y", strtotime($dashObj->cutOffDate)).'</span></th>
                                            </tr>
                                            <tr class="secondTrLmr">
                                                <th style="text-align: center;">CUMULATIVE</th>
                                                <th style="text-align: center;">CUMULATIVE RESOLVED</th>
                                                <th style="text-align: center;">CUMULATIVE OPEN</th>
                                                <th style="text-align: center;" class="currentCol">NEW ISSUE</th>
                                                <th style="text-align: center;" class="currentCol">ISSUE RESOLVED</th>
                                                <th style="text-align: center;" class="currentCol">OPEN</th>
                                                <th style="text-align: center;" class="currentCol">CUMULATIVE</th>
                                                <th style="text-align: center;" class="currentCol">CUMULATIVE RESOLVED</th>
                                                <th style="text-align: center;" class="currentCol">CUMULATIVE OPEN</th>
                                            </tr>
                                        </thead>
                                        <tbody id = "lmrSectionTable">
                                        </tbody>
                                        <tfoot id = "lmrFootTable">
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide" id="page-4">
                        <div class="oneRow M twoRow round shadow" style="width:calc(100% - 60px); margin: 0 30px;">
                            <div class="rowOne-T roundt">LAND TRACKING</div>
                            <div class="rowTwo-T roundb landTracking" style="overflow: auto;">
                                <table class="landTrackingTable">
                                    <thead id = "landTrackHead">
                                    </thead>
                                    <tbody id = "landTrackingBody">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>';
        if($showFilter){
            $html .=
            '<div class="minimizeButton active show" id="minimizeButton">
                <div class="lines"></div>
                <div class="lines"></div>
            </div>';
        }
        $html .=
        '</div>
    </div>
    <!-- <script src="../../'.$dashObj->pathRel.'JS/fontawesome.js"></script> -->
    <link rel="stylesheet" href="../../../../../CSS/fontawesome7/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" href="../../../../../CSS/fontawesome7/fontawesome-free/css/fontawesome.min.css">
    <link rel="stylesheet" href="../../../../../CSS/fontawesome7/fontawesome-free/css/solid.min.css">
    <link rel="stylesheet" href="../../../../../CSS/fontawesome7/fontawesome-free/css/regular.min.css">
    <link rel="stylesheet" href="../../../../../CSS/fontawesome7/fontawesome-free/css/brands.min.css">

</body>
</html>
';

echo $html;

?>

<style type="text/css">
    body.blue{
        --primary-dimmer: #1565c0;
        --on-primary: white;
        --border-bottom: grey;
        --top: #f2f2f2;
        --surface: white;
        --on-surface: black;
        --thumb-track: #f1f1f1;
    }
 
    body.dark_red{
        --primary-dimmer: rgb(49,49,49);
        --on-primary: white;
        --border-bottom: grey;
        --top: #f2f2f2;
        --surface: white;
        --on-surface: black;
        --thumb-track: #f1f1f1;
    }
 
    /*header changes*/
    h4 {
        font-size: 1.3em;
    }
    .dashboardHeader{
        display: flex;
        justify-content: space-between;
    }
    .dashboardHeader .title {
        margin-left: 30px;
        width: calc(100% - 225px);
    }
 
    .dashboardHeader .title h3{
        text-align: unset;
        margin-bottom: 4px;
        line-height: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100% - 0px);
        white-space: nowrap;
    }
    .dashboardHeader > img {
        margin: 12px;
        cursor: pointer;
    }
    .main-div {
        height: 100%;
    }
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .numberContainerText{
        font-size: 12px !important;
        margin: auto 10px auto 10px !important;
        padding: auto 5px auto 5px !important;
        background-color: transparent !important;
    }
    .infoContainer > .body > span {
        cursor: pointer;
    }
    tbody#phyMainTable > tr > td {
        cursor:default;
    }
 
    tbody#financeMainTable > tr > td {
        cursor:default;
    }
 
    thead > tr:first-child{
        border-top: 2px solid var(--border-bottom);
    }
 
    thead > tr > th{
        cursor:default;
        position: sticky;
        top:0px;
        border-left: 2px solid var(--border-bottom);
        border-bottom: 2px solid var(--border-bottom);
        z-index: 10;
        background-color: var(--primary-dimmer);
        color: var(--on-primary);
    }
 
    .timelineTable thead tr:first-child th{
        border-top: 2px solid var(--border-bottom);
    }
 
    .landTrackingTable thead > tr > th{
        border: 1px solid black;
        padding: 8px;
    }
 
    tbody > tr > td > .indicator{
        border: 0px solid var(--border-bottom);
        bottom: 10px;
        color: black;
        text-align: center;
        padding: 3px;
        position: absolute;
        top: -10px;
    }
 
    tbody > tr:last-child > td{
        border-bottom: 0px;
    }
 
    tbody > tr > td > .indicator > .text{
        color: var(--on-surface);
        display: flex;
        justify-content: center;
    }
 
    tbody > tr > td > .indicator > .text > div{
        padding: 3px;
        width: fit-content;
        border: 1px solid var(--border-bottom);
        background: var(--surface);
    }
 
    tbody > tr > td > .indicator > i{
        margin: 10px 0;
        font-size: 1rem;
        text-align: center;
        color: red;
    }
 
    tbody > tr > td > .indicator.early{
        left: 0%;
    }
    tbody > tr > td > .indicator.mid{
        left: 0%;
        width: calc(100% - 6px);
    }
    tbody > tr > td > .indicator.late{
        left: 100%;
    }
 
    .indicator.early i, .indicator.early .text {
        position: relative;
        left: -50%;
    }
    .indicator.mid i, .indicator.mid .text {
        position: relative;
        left: 0px;
    }
    .indicator.late i, .indicator.late .text {
        position: relative;
        left: -55%;
    }
 
    tbody > tr > td > .indicator.fixed{
        text-align: right;
        left: unset;
    }
 
    tbody > tr > td > .indicator.fixed > .text{
        border: 1px solid black;
        padding: 5px;
        text-align: center;
    }
    tfoot > tr > th{
        cursor:default;
        position: sticky;
        top:0px;
        border-left: 2px solid var(--border-bottom);
        border-bottom: 2px solid var(--border-bottom);
        z-index: 1;
        background-color: var(--primary-dimmer);
        color: var(--on-primary);
        border-top: 3px solid #7d7c7c;
    }

    tfoot > tr > td{
        border-top: 3px solid #7d7c7c;
    }
    table{
        border-collapse: separate;
        border-spacing: 0;
        font-size: .8rem;
        background: inherit
    }
    table.timelineTable{
        position: relative;
        top:2px;
    }
    table.timelineTable > thead > tr > th:last-child{
        position: sticky;
        right:0px;
    }
    table.timelineTable > tbody > tr > td:last-child{
        position: sticky;
        right:0px;
    }
 
    table.timelineTable > tbody > tr:nth-of-type(even) > td{
        background: var(--top);
        color: var(--on-surface);
    }
 
    table.timelineTable > tbody > tr:nth-of-type(odd) > td{
        background: var(--surface);
        color: var(--on-surface)
    }
 
    tr:nth-of-type(odd){
        background: var(--surface);
        color: var(--on-surface);
    }
 
    tr:nth-of-type(even) {
        background: var(--top);
        color: var(--on-surface);
    }
    
    tbody th {
        position: -webkit-sticky; /* for Safari */
        position: sticky;
        left: 0;
    }
 
    .timelineTable tbody th, .lmrSectionTable tbody th, .lmrTypesTable tbody th {
        position: -webkit-sticky; /* for Safari */
        position: sticky;
        left: 0;
        border-left: 2px solid var(--border-bottom);
        border-bottom: 2px solid var(--border-bottom);
        background-color: var(--primary-dimmer);
        color: var(--on-primary);
    }
 
    .landTrackingTable tbody th {
        background: var(--thumb-track);
        color: var(--on-surface);
        border: 1px solid black;
        padding: 8px;
    }
 
    th::after {
        bottom: 0;
        border-bottom: 1px solid gray;
    }
 
    .landTrackingTable td{
        border: 1px solid black;
        padding: 8px;
    }
 
    .timelineTable td, .lmrSectionTable td, .lmrTypesTable td, .accumulativeIssueTable td{
        border-left: 2px solid var(--border-bottom);
        border-bottom: 2px solid var(--border-bottom);
    }
 
    .timelineTable td.indicatorData {
        border-left: 0px solid var(--border-bottom);
        position: relative;
        height: 84px;
    }
 
    .timelineTable tr td:last-child, .lmrSectionTable tr td:last-child, .lmrTypesTable tr td:last-child, .accumulativeIssueTable tr td:last-child{
        border-right: 2px solid var(--border-bottom);
    }
 
    td > i{
        margin-right: 10px;
        text-align: left;
        font-size: 1rem;
    }
 
    td > i.fa-caret-up{
        color: green;
    }
 
    td > i.fa-hyphen{
        color: #ff9a33;
    }
 
    td > i.fa-caret-down{
        color: red;
    }
 
    .textAlign{
        text-align: center;
    }
 
    #landSynopsis i{
        margin: 1.2rem 15px 0 10px;
        color: var(--on-surface);
    }
 
    #landSynopsis .paragraph{
        display:flex;
    }
 
    #landSynopsis p{
        font-size:1rem;
        margin-right: 5px;
        color: var(--on-surface);
    }
 
    .clickable {
        cursor:pointer!important;
    }
    .red{
        background: radial-gradient(circle at 9px 9px, #E93232, #a52020) !important;
    }
    .yellow{
        background: radial-gradient(circle at 9px 9px, #F4D03F, #d1b02a) !important;
    }
    .green{
        background: radial-gradient(circle at 9px 9px, #52BE80, #22874d) !important;
    }
    .landColor {
        background-color: var(--primary) !important;
    }
    .textLabel{
        font-size:2.2em;
        color: black
    }
    .blackColor{
        color: black  !important;
        font-size: 13px;
    }
    .showLabel{
        display: none;
    }
    .textUppercase{
        text-transform: uppercase;
    }
 
    @media screen and (max-width: 1366px){
        .textLabel{
            font-size:16px;
            color: black
        }
        .blackColor{
            color: black  !important;
            font-size: 9px;
        }
    }
 
    @media screen and (min-height: 723px){
        .textLabel{
            font-size:2.2em;
            color: black
        }
        .blackColor{
            color: black  !important;
            font-size: 13px;
        }
    }
 
    @media screen and (min-width: 1280p){
        .textLabel{
            font-size:3em;
            color: black
        }
        .blackColor{
            color: black  !important;
            font-size: 15px;
        }
    }
 
    @media print{
        table.lmrSectionTable, table.lmrTypesTable{
            font-size: 9px !important;
        }
    }

    .currentCol{
        filter: brightness(150%);
        font-weight: normal;
    }
</style>

<script>;

    setSecondThirdRow = () =>{
        let firstRowHeight
        let secondRowHeight

        firstRowHeight = $('.firstTr').height()
        secondRowHeight = $('.secondTr').height()

        firstRowHeightLmr = $('.firstTrLmr').height()
        secondRowHeightLmr = $('.secondTrLmr').height()

        firstRowHeightLmrType = $('.firstTrLmrType').height()

        $('.secondTrLmr th').css('top',`${firstRowHeightLmr + 1}px`)
        $('.thirdTrLmr th').css('top',`${firstRowHeightLmr + secondRowHeightLmr + 1}px`)
        $('.secondTrLmrType th').css('top',`${firstRowHeightLmrType + 1}px`)
        $('.secondTr th').css('top',`${firstRowHeight + 1}px`)
        $('.thirdTr th').css('top', `${firstRowHeight + secondRowHeight + 1}px`)
    }

    earlyMidLateArrow = () =>{
        let width
        let width1 = $('#timelineBody tr:first-child td:last-child').width()
        let width2 = $('#timelineBody tr:last-child td:last-child').width()

        if(width2 > width1){
            width = width2;
        }else{
            width = width1;
        }

        $('.indicator.fixed.early > i').css({'right': `${width}px`, 'position' : `relative`})
        $('.indicator.fixed.mid > i').css({'right': `${width/2}px`, 'position' : `relative`})
        $('.indicator.fixed.late > i').css({'right': `${0}px`, 'position' : `relative`})
        $('.indicator.fixed').css('left', `${-width/2}px`)        
    }

    $(document).ready(function(){

        var swiper = new Swiper(".mySwiper", {
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            }
        })

        setSecondThirdRow()
        earlyMidLateArrow()

        const dashboardList = document.querySelector('#page-2')
        const landTrackingList = document.querySelector('#landTrackingBody')
        const lmrList = document.querySelector('.secondTrLmr')
        
        const options = {
            attributes: true
        }

        function callback(mutationList, observer) {
            mutationList.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if(mutation.target.className == 'swiper-slide swiper-slide-active'){
                        if($('#page-2').hasClass("swiper-slide-active")){
                            $('.minimizeButton').removeClass("show")
                            if (localStorage.ui_pref == 'ri_v3'){
                                window.parent.$('.mainPage.myDashboard ').find('.yrFilter').css("display", "none")
                                window.parent.$('.mainPage.myDashboard ').find('.mthFilter').css("display", "none")
                            }else{
                                $('.filter').css("display", "none")
                                $('.sidebar').css('display','none')
                                $('.minimizeButton').css('display', 'none')
                                $('#lOne').css('width','99%')
                            }
                        }
                    }else{
                        if(!$('#page-2').hasClass("swiper-slide-active")){
                            if($('.minimizeButton').hasClass("show")){
                            }else{
                                $('.minimizeButton').addClass("show")
                                $('.minimizeButton').addClass("active")
                                if (localStorage.ui_pref == 'ri_v3'){
                                    window.parent.$('.mainPage.myDashboard').find('.yrFilter').css("display", "inline-block")
                                    window.parent.$('.mainPage.myDashboard').find('.mthFilter').css("display", "inline-block")
                                }else{
                                    $('.minimizeButton').css('display', 'flex')
                                    $('.minimizeButton').css('left', '20%')
                                    $('.filter').css("display", "block")
                                    $('.sidebar').css('display', 'block')
                                    $('#lOne').css('width','79%')
                                }
                            }
                        }
                    }
                }
                setSecondThirdRow()
                earlyMidLateArrow()
            })
            
        } 

        const observer = new MutationObserver(callback)
        observer.observe(dashboardList, options)
        observer.observe(landTrackingList, options)
        observer.observe(lmrList, options)

        var lmrSectionTableHeight = 0;
        var accumulativeTableHeight = 0;
        accumulativeTableHeight = $('#accumulativeTableHeight').height() + 10;


    })
    
</script>