<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('document');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$showHeader = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
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
if($showHeader){
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
if($showHeader){
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
if($showHeader){
    $html .= 
        '<div class="sidebar" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
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
            </div>
        </div>';
}
    $html .=
            '<div class="layout oneRow" id="lOne" '.(($dashObj->isWPC) ? 'style="width:98%;"' : '').'">
                <div class="rowOne-M twoColumn main-div">
                    <div class="columnOne M twoColumn">
                        <div class="columnOne M40 twoRow">
                            <div class="rowOne SM twoRow round shadow">
                                <div class="rowOne-T roundT">GENERAL INFO</div>
                                <div class="rowTwo-T flex roundB">
                                    <div class="infoContainer">
                                        <div class="head">Client</div>
                                        <span id="clientCard">N/A</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">SME</div>
                                        <span id="smeCard">N/A</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">Total Document</div>
                                        <span id="totalDocCard">0</span>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo ML twoRow shadow round">
                                <div class="rowOne-T roundT">DOCUMENT BY TYPE</div>
                                <div class="rowTwo-T roundB dash-resize" id="typeOfDocChart"></div>
                            </div>
                        </div>
                        <div class="columnTwo M60 twoRow">
                            <div class="rowOne XL twoColumn">
                                <div class="columnOne M twoRow round shadow">
                                    <div class="rowOne-T roundT">OUTGOING CORRESPONDENCE</div>
                                    <div class="rowTwo-T twoRow roundB">
                                        <div class="rowOne SM">
                                            <div class="tableContainer legend">
                                                <table class="legend"> 
                                                    <tbody>
                                                        <tr>
                                                            <td>For Information</td>
                                                            <td width = "23px" id="outForInfoCard">0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>For Comment/Revision</td>
                                                            <td width = "23px" id="outCommentRevCard">0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>For Approval</td>
                                                            <td width = "23px" id="outForApprovalCard">0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Others Request</td>
                                                            <td width = "23px" id="outOtherReqCard">0</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="rowTwo M flex">
                                            <div class="infoContainer">
                                                <div class="head">CLIENTS</div>
                                                <div class="cor-cat-no-card">
                                                    <div class="responded-text text-large" id="outPurposeClientRespondedCard">0</div>
                                                    <div class="total-card">Total: <span id="outPurposeClientTotalCard">0</div>
                                                    <div class="pending-text text-large" id="outPurposeClientPendingCard">0</div>
                                                </div>
                                                <div class="main-perc roundB">
                                                    <div id="respondPercent" class="barInner roundB outPurposeClientPerc">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head">CONSULTANTS</div>
                                                <div class="cor-cat-no-card">
                                                    <div class="responded-text text-large" id="outPurposeConsultantRespondedCard">0</div>
                                                    <div class="total-card">Total:  <span id="outPurposeConsultantTotalCard">0</div>
                                                    <div class="pending-text text-large" id="outPurposeConsultantPendingCard">0</div>
                                                </div>
                                                <div class="main-perc roundB">
                                                    <div id="respondPercent" class="barInner roundB outPurposeConsultantPerc">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head">SUB-CONTRACTORS</div>
                                                <div class="cor-cat-no-card">
                                                    <div class="responded-text text-large" id="outPurposeContractRespondedCard">0</div>
                                                    <div class="total-card">Total: <span id="outPurposeContractTotalCard">0</div>
                                                    <div class="pending-text text-large" id="outPurposeContractPendingCard">0</div>
                                                </div>
                                                <div class="main-perc roundB">
                                                    <div id="respondPercent" class="barInner roundB outPurposeContractPerc">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head">THIRD-PARTY</div>
                                                <div class="cor-cat-no-card">
                                                    <div class="responded-text text-large" id="outPurposeThirdRespondedCard">0</div>
                                                    <div class="total-card">Total: <span id="outPurposeThirdTotalCard">0</div>
                                                    <div class="pending-text text-large" id="outPurposeThirdPendingCard">0</div>
                                                </div>
                                                <div class="main-perc roundB">
                                                    <div id="respondPercent" class="barInner roundB outPurposeThirdPerc">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="columnTwo M twoRow round shadow">
                                    <div class="rowOne-T roundT">INCOMING CORRESPONDENCE</div>
                                    <div class="rowTwo-T twoRow roundB">
                                        <div class="rowOne SM">
                                            <div class="tableContainer legend">
                                                <table class="legend"> 
                                                    <tbody>
                                                        <tr>
                                                            <td>For Information</td>
                                                            <td width = "23px" id="incForInfoCard">0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>For Comment/Revision</td>
                                                            <td width = "23px" id="incCommentRevCard">0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>For Approval</td>
                                                            <td width = "23px" id="incForApprovalCard">0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Others Request</td>
                                                            <td width = "23px" id="incOtherReqCard">0</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="rowTwo M flex">
                                            <div class="infoContainer">
                                                <div class="head">CLIENTS</div>
                                                <div class="cor-cat-no-card">
                                                    <div class="responded-text text-large" id="incPurposeClientRespondedCard">0</div>
                                                    <div class="total-card">Total: <span id="incPurposeClientTotalCard">0</div>
                                                    <div class="pending-text text-large" id="incPurposeClientPendingCard">0</div>
                                                </div>
                                                <div class="main-perc roundB">
                                                    <div id="respondPercent" class="barInner roundB incPurposeClientPerc" >
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head">CONSULTANTS</div>
                                                <div class="cor-cat-no-card">
                                                    <div class="responded-text text-large" id="incPurposeConsultantRespondedCard">0</div>
                                                    <div class="total-card">Total:  <span id="incPurposeConsultantTotalCard">0</div>
                                                    <div class="pending-text text-large" id="incPurposeConsultantPendingCard">0</div>
                                                </div>
                                                <div class="main-perc roundB">
                                                    <div id="respondPercent" class="barInner roundB incPurposeConsultantPerc">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head">SUB-CONTRACTORS</div>
                                                <div class="cor-cat-no-card">
                                                    <div class="responded-text text-large" id="incPurposeContractRespondedCard">0</div>
                                                    <div class="total-card">Total: <span id="incPurposeContractTotalCard">0</div>
                                                    <div class="pending-text text-large" id="incPurposeContractPendingCard">0</div>
                                                </div>
                                                <div class="main-perc roundB">
                                                    <div id="respondPercent" class="barInner roundB incPurposeContractPerc">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head">THIRD-PARTY</div>
                                                <div class="cor-cat-no-card">
                                                    <div class="responded-text text-large" id="incPurposeThirdRespondedCard">0</div>
                                                    <div class="total-card">Total: <span id="incPurposeThirdTotalCard">0</div>
                                                    <div class="pending-text text-large" id="incPurposeThirdPendingCard">0</div>
                                                </div>
                                                <div class="main-perc roundB">
                                                    <div id="respondPercent" class="barInner roundB incPurposeThirdPerc">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo XS" style="height: calc(10% - 5px)">
                                <div class="tableContainer legend respond-pending-legend round shadow">
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
                        </div>
                    </div>
                    <div class="columnTwo M twoRow">
                        <div class="rowOne M twoRow round shadow">
                            <div class="rowOne-T roundT">INCOMING CORRESPONDENCE</div>
                            <div class="rowTwo-T twoColumn roundB">
                                <div class="columnOne M40">
                                    <div class="dash-charts dash-resize" id="incCorrTypeChart" style="border-bottom-left-radius: 10px;"></div>
                                </div>
                                <div class="columnTwo M60">
                                    <div class="tableContainer scrollbar-inner roundRightBottom" id = "dashboarditem">
                                        <table id ="outgoingCorrTb"> 
                                            <thead>
                                                <th>Subject</th>
                                                <th>Date</th>
                                                <th>Due Date</th>
                                                <th>Aging</th>
                                                <th>Overdue</th>
                                            </thead>
                                            <tbody id="incomingCorrTbBody">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M twoRow round shadow">
                            <div class="rowOne-T roundT">OUTGOING CORRESPONDENCE</div>
                            <div class="rowTwo-T twoColumn roundB">
                                <div class="columnOne M40">
                                    <div class="dash-charts dash-resize" id="outCorrTypeChart" style="border-bottom-left-radius: 10px;"></div>
                                </div>
                                <div class="columnTwo M60">
                                    <div class="tableContainer scrollbar-inner roundRightBottom" id = "dashboarditem">
                                        <table id ="outgoingCorrTb"> 
                                            <thead>
                                                <th>Subject</th>
                                                <th>Date</th>
                                                <th>Due Date</th>
                                                <th>Aging</th>
                                                <th>Overdue</th>
                                            </thead>
                                            <tbody id="outgoingCorrTbBody"> 
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>';
if($showHeader){
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
    body.blue{
        --primary: #003c8f;
        --on-primary: white;
        --surface: white;
        --on-surface: black;
    }

    body.dark_red{
        --primary: black;
        --on-primary: white;
        --surface: white;
        --on-surface: black;
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
        height: 100%;
        width: 0px;
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
    .dashboardBody .twoRow .rowTwo-T {
        /*background-color: unset!important;*/
    }
    .text-large {
        font-size: x-large;
    }
    .pending-text {
        color: grey;
    }
    .responded-text {
        color: #7cb5ec;
    }
    .cutoff-text {
        text-align: right;
        font-size: 15px;
        padding-right: 15px;
    }
    .overdueTd {
        width: 1%;
    }

    /*fix some css*/
    .dashboardBody .twoRow .rowOne-M {
        height: 47%!important;
    }

    .dashboardBody .twoRow .rowTwo-M {
        height: 47%!important;
    }

    .outgoingCardDiv {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .showLabel{
        display: none
    }

    .clickableCard {
        cursor:pointer;
    }
</style>
