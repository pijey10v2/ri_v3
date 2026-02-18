<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('document');

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
    </head>
    <body class='.$themeClass.'>';
if($showFilter){
    $html .=
        '<div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>';
}
if ($showHeader) {
$html .=        
        '<div class = "dashboardHeader">
            <div class = "title">
                <h4>DOCUMENT MANAGEMENT DASHBOARD</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ='.$prefix.''.$dashObj->projectInfo['icon_url'].'>
            </div>
        </div>';
}        
$html .=        
        '<div class = "dashboardBody">';
if ($showFilter){
    $html .= '
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard()">';
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
                </div>
            </div>';
}
    $html .=
            '<div class="layout oneRow" id="lOne">
                <div class="rowOne twoColumn main-div">
                    <div class="columnOne SM twoRow">
                        <div class="rowOne M twoRow shadow round">
                            <div class="rowOne-T roundT">INCOMING CORRESPONDENCE</div>
                            <div class="rowTwo-T twoColumn roundB">
                                <div class="columnOne M">
                                    <div class="tableContainer legend">
                                        <table class="legend"> 
                                            <tbody>
                                                <tr>
                                                    <td>Total</td>
                                                    <td width = "23px" id="corrIncTtlCard">0</td>
                                                </tr>
                                                <tr>
                                                    <td>For Info</td>
                                                    <td width = "23px" id="corrIncInfoCard">0</td>
                                                </tr>
                                                <tr>
                                                    <td>To Respond</td>
                                                    <td width = "23px" id="corrIncRespondCard">0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">For Info</div>
                                        <div class="cor-cat-no-card">
                                            <div class="responded-text text-large" id="corrIncInfoRespondedCard">0</div>
                                            <div class="total-card text-small">Total: <span id="corrIncInfoTotalCard">0</div>
                                            <div class="pending-text text-large" id="corrIncInfoPendingCard">0</div>
                                        </div>
                                        <div class="main-perc roundB">
                                            <div class="barInner incForInfo roundB">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">To Respond</div>
                                        <div class="cor-cat-no-card">
                                            <div class="responded-text text-large" id="corrIncRespondCardResponded">0</div>
                                            <div class="total-card text-small">Total: <span id="corrIncRespondTotalCard">0</div>
                                            <div class="pending-text text-large" id="corrIncRespondPendingCard">0</div>
                                        </div>
                                        <div class="main-perc roundB">
                                            <div class="barInner incToRespond roundB">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tableContainer legend respond-pending-legend">
                                        <table class="legend"> 
                                            <tbody>
                                                <tr>
                                                    <td>Responded</td>
                                                    <td style="background-color:#7cb5ec;"></td>
                                                </tr>
                                                <tr>
                                                    <td>Pending</td>
                                                    <td style="background-color:grey;"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="columnTwo M">
                                    <div class="dash-charts dash-resize" id="incCorrTypeChart" style="border-bottom-right-radius: 10px;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M twoRow shadow round">
                            <div class="rowOne-T roundT">OUTGOING CORRESPONDENCE</div>
                            <div class="rowTwo-T twoColumn roundB">
                                <div class="columnOne M">
                                    <div class="tableContainer legend">
                                        <table class="legend"> 
                                            <tbody>
                                                <tr>
                                                    <td>Total</td>
                                                    <td width = "23px" id="corrOutTtlCard">0</td>
                                                </tr>
                                                <tr>
                                                    <td>For Info</td>
                                                    <td width = "23px" id="corrOutInfoCard">0</td>
                                                </tr>
                                                <tr>
                                                    <td>To Respond</td>
                                                    <td width = "23px" id="corrOutRespondCard">0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">For Info</div>
                                        <div class="cor-cat-no-card">
                                            <div class="responded-text text-large" id="corrOutInfoRespondedCard">0</div>
                                            <div class="total-card text-small"><span style="color:#F7A35C;" id="corrOutInfoClosedCard">0</div>
                                            <div class="pending-text text-large" id="corrOutInfoPendingCard">0</div>
                                        </div>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">To Respond</div>
                                        <div class="cor-cat-no-card">
                                            <div class="responded-text text-large" id="corrOutRespondCardResponded">0</div>
                                            <div class="total-card text-small"><span style="color:#F7A35C;" id="corrOutRespondClosedCard">0</div>
                                            <div class="pending-text text-large" id="corrOutRespondPendingCard">0</div>
                                        </div>
                                    </div>
                                    <div class="tableContainer legend respond-pending-legend">
                                        <table class="legend"> 
                                            <tbody>
                                                <tr>
                                                    <td>Responded</td>
                                                    <td style="background-color:#7cb5ec;"></td>
                                                </tr>
                                                <tr>
                                                    <td>Pending</td>
                                                    <td style="background-color:grey;"></td>
                                                </tr>
                                                <tr>
                                                    <td>Closed</td>
                                                    <td style="background-color:#F7A35C;"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="columnTwo M">
                                    <div class="dash-charts dash-resize" id="outCorrTypeChart" style="border-bottom-right-radius: 10px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo ML twoRow">
                        <div class="rowOne M twoColumn tableCell">
                            <div class="columnOne twoColumn">
                                <div class="columnOne SM twoRow round shadow">
                                    <div class="rowOne-T roundT">STATISTICS</div>
                                    <div class="rowTwo-T oneColumn roundB">
                                        <div class="columnOne">
                                            <div class="infoContainer">
                                                <div class="head">TOTAL CORRESPONDENCE</div>
                                                <span id="corrTotalCard">0</span>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head">TOTAL DOCUMENT</div>
                                                <span id="docTotalCard">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="columnTwo ML twoRow round shadow">
                                    <div class="rowOne-T roundT">DOCUMENT TYPE</div>
                                    <div class="rowTwo-T roundB dash-resize" id="docTypeChart"></div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M threeColumn">
                            <div class="columnOne M twoRow round shadow">
                                <div class="rowOne-T roundT">DRAWING TYPE</div>
                                <div class="rowTwo-T roundB dash-resize" id="docDrawingTypeChart"></div>
                            </div>
                            <div class="columnTwo M twoRow round shadow">
                                <div class="rowOne-T roundT">DRAWING REVISION</div>
                                <div class="rowTwo-T roundB dash-resize" id="docDrawingRevChart"></div>
                            </div>
                            <div class="columnThree M twoRow round shadow">
                                <div class="rowOne-T roundT">DRAWING DISCIPLINE</div>
                                <div class="rowTwo-T roundB dash-resize" id="docDrawingDisChart"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>';
if($showFilter){
    $html .= 
            '<div class="minimizeButton active" id="minimizeButton">
                <div class="lines"></div>
                <div class="lines"></div>
            </div>';
}
    $html .=
        '</div>
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

    /*for percentage bar*/
    .status-chart-div{
        height: 100%!important;
    }
    .pendingDoc > div {
        background-image: unset!important;
        background-color: grey;
    }
    .main-perc {
        background-image: unset!important;
        background-color: grey;
        height: 10px;
    }
    .respondDoc > div {
        background-image: unset!important;
        background-color: #7cb5ec;
    }
    #respondPercent{
        background-image: unset!important;
        background-color: #7cb5ec;
    }
    .cor-cat-no-card{
        display: flex;
        justify-content: space-between;
        padding :0 5% 0 5%;
        /*height: 50%;*/
    }
    .main-div {
        height: 100%;
    }

    /*other fixes*/
    /*.dashboardBody .twoRow .rowTwo-T {
        background-color: unset!important;
    }*/
    .main-perc-hidden {
        background-color: unset!important;
    }
    .text-large {
        font-size: 2em;
    }
    .pending-text {
        color: grey;
    }
    .responded-text {
        color: #7cb5ec;
    }
    .corr-info-div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .respond-pending-legend{
        padding: 0px 5px 0px 5px;
    }
    .cutoff-text {
        text-align: right;
        font-size: 15px;
        padding-right: 15px;
    }
    .overdueTd {
        width: 1%;
    }
    .dashboardBody .respond-pending-legend td{
        font-size: 8.5px!important;
    }
    .dashboardBody .infoContainer {
        margin: 5px 5px!important;
    }
    .incCardDiv {
        height: 45%!important;
    }
    .incCardLegendDiv {
        height: 15%!important;
    }

    .main-perc {
        background-image: unset!important;
        background-color: grey;
        height: 10px;
    }
    .dashboardBody .infoContainer {
        /*margin: 5px 5px!important;*/
    }

    .barInner {

        background-image: unset!important;
        background-color: #7cb5ec;
        height: 100%;
        width: 0px;
    }

    .showLabel{
        display: none;
    }

    .clickableCard {
        cursor:pointer;
    }
</style>