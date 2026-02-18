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
if($showFilter){
    $html .=
            '<div class="sidebar">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Project</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard()">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" >'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Year</label><br>
                        <select onchange="" id = "yearFilter">
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
            </div>';
}
    $html .=
            '<div class="layout oneRow" id="lOne">
                <div class="rowOne twoColumn">
                    <div class="columnOne M twoColumn">
                        <div class="columnOne M60 oneRow">
                            <div class="rowOne twoColumn">
                                <div class="columnOne M twoRow shadow round">
                                    <div class="rowOne-T roundT">INCOMING CORRESPONDENCE</div>
                                    <div class="rowTwo-T twoRow roundB flex">
                                        <div class="infoContainer large">
                                            <div class="head">TOTAL LETTERS RECEIVED</div>
                                            <div class="body"  id="incTotal">0
                                            </div>
                                        </div>
                                        <div class="infoContainer large">
                                            <div class="head">CLIENTS</div>
                                            <div class="cor-cat-no-card">
                                                <div class="responded-text text-large" id="incClientResponded">0</div>
                                                <div class="total-card">Total: <span id="incClientTotal">0</div>
                                                <div class="pending-text text-large" id="incClientPending">0</div>
                                            </div>
                                            <div class="main-perc">
                                                <div id="respondPercent" class="barInner clients-perc" >
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer large">
                                            <div class="head">CONSULTANTS</div>
                                            <div class="cor-cat-no-card">
                                                <div class="responded-text text-large" id="incConsultantResponded">0</div>
                                                <div class="total-card">Total:  <span id="incConsultantTotal">0</div>
                                                <div class="pending-text text-large" id="incConsultantPending">0</div>
                                            </div>
                                            <div class="main-perc">
                                                <div id="respondPercent" class="barInner consultants-perc">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer large">
                                            <div class="head">SUB-CONTRACTORS</div>
                                            <div class="cor-cat-no-card">
                                                <div class="responded-text text-large" id="incContractorResponded">0</div>
                                                <div class="total-card">Total: <span id="incContractorTotal">0</div>
                                                <div class="pending-text text-large" id="incContractorPending">0</div>
                                            </div>
                                            <div class="main-perc">
                                                <div id="respondPercent" class="barInner contractors-perc">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer large">
                                            <div class="head">THIRD-PARTY</div>
                                            <div class="cor-cat-no-card">
                                                <div class="responded-text text-large" id="incThirdPartyResponded">0</div>
                                                <div class="total-card">Total: <span id="incThirdPartyTotal">0</div>
                                                <div class="pending-text text-large" id="incThirdPartyPending">0</div>
                                            </div>
                                            <div class="main-perc">
                                                <div id="respondPercent" class="barInner thirdparty-perc">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="columnTwo M twoRow shadow round">
                                    <div class="rowOne-T roundT">OUTGOING CORRESPONDENCE</div>
                                    <div class="rowTwo-T twoRow roundB flex">
                                        <div class="infoContainer large">
                                            <div class="head">TOTAL LETTERS RECEIVED</div>
                                            <div class="body" id="outTotal">0
                                            </div>
                                        </div>
                                        <div class="infoContainer large">
                                            <div class="head">CLIENTS</div>
                                            <div class="cor-cat-no-card">
                                                <div class="responded-text text-large" id="outClientResponded">0</div>
                                                <div class="total-card">Total: <span id="outClientTotal">0</div>
                                                <div class="pending-text text-large" id="outClientPending">0</div>
                                            </div>
                                            <div class="main-perc">
                                                <div id="" class="barInner out-clients-perc" >
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer large">
                                            <div class="head">CONSULTANTS</div>
                                            <div class="cor-cat-no-card">
                                                <div class="responded-text text-large" id="outConsultantResponded">0</div>
                                                <div class="total-card">Total:  <span id="outConsultantTotal">0</div>
                                                <div class="pending-text text-large" id="outConsultantPending">0</div>
                                            </div>
                                            <div class="main-perc">
                                                <div id="" class="barInner out-consultants-perc">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer large">
                                            <div class="head">SUB-CONTRACTORS</div>
                                            <div class="cor-cat-no-card">
                                                <div class="responded-text text-large" id="outContractorResponded">0</div>
                                                <div class="total-card">Total: <span id="outContractorTotal">0</div>
                                                <div class="pending-text text-large" id="outContractorPending">0</div>
                                            </div>
                                            <div class="main-perc">
                                                <div id="" class="barInner out-contractors-perc">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer large">
                                            <div class="head">THIRD-PARTY</div>
                                            <div class="cor-cat-no-card">
                                                <div class="responded-text text-large" id="outThirdPartyResponded">0</div>
                                                <div class="total-card">Total: <span id="outThirdPartyTotal">0</div>
                                                <div class="pending-text text-large" id="outThirdPartyPending">0</div>
                                            </div>
                                            <div class="main-perc">
                                                <div id="" class="barInner out-thirdparty-perc">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div class="columnTwo M40 twoRow">
                                <div class="rowOne XL twoRow">
                                    <div class="rowOne M twoRow round shadow">
                                    <div class="rowOne-T roundT">DOCUMENT ARCHIVING AND STORAGE</div>
                                    <div class="rowTwo-T roundB dash-resize" id="archStorageChart"></div>
                                </div>
                                <div class="rowTwo M flex round shadow" style="background: white !important;">
                                    <div class="infoContainer large">
                                        <div class="head">CUT OFF DATE</div>
                                        <div class="body">
                                            AS ON <div class="cutOffDateValue"><span id="cutOff-day">'.$dashObj->cutoffDay.'</span>&nbsp;<span id="cutOff-month">'.date("F", strtotime($dashObj->cutOffDate)).'</span>&nbsp;<span id="cutOff-year">'.date("Y", strtotime($dashObj->cutOffDate)).'</span></div>

                                        </div>
                                    </div>
                                    <div class="infoContainer large">
                                        <div class="head">RESPONDED CORRESPONDENCE</div>
                                        <div class="body" id = "respDoc">0</div>
                                    </div>
                                    <div class="infoContainer large">
                                        <div class="head">PENDING CORRESPONDENCE</div>
                                        <div class="body" id = "pendDoc">0</div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo XS" style="height: calc(10% - 5px)">
                                <div class="tableContainer legend respond-pending-legend round shadow">
                                    <table class="legend"> 
                                        <tbody>
                                            <tr>
                                                <td>Responded Correspondence</td>
                                                <td style="background-color:#7cb5ec;"></td>
                                            </tr>
                                            <tr>
                                                <td>Pending Correspondence</td>
                                                <td style="background-color:red;"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M twoRow round">
                        <div class="rowOne-T round">DRAWING STATISTICS</div>
                        <div class="rowTwo-T twoRow spacerTop transparent roundB">
                            <div class="rowOne M twoColumn round">
                                <div class="columnOne M twoRow shadow round">
                                    <div class="rowOne-T roundT">AS-BUILT DRAWING</div>
                                    <div class="rowTwo-T roundB dash-resize" id="asBuiltDrawingChart"></div>
                                </div>
                                <div class="columnTwo M twoRow shadow round">
                                    <div class="RowOne-T roundT">CONSTRUCTION DRAWING</div>
                                    <div class="rowTwo-T roundB dash-resize" id="constructDrawingChart"></div>
                                </div>
                            </div>
                            <div class="rowTwo M twoColumn round">
                                <div class="columnOne M twoRow shadow round">
                                    <div class="rowOne-T roundT">RED LINE MARK-UP</div>
                                    <div class="rowTwo-T roundB dash-resize" id="redLineDrawingChart"></div>
                                </div>
                                <div class="columnTwo M twoRow shadow round">
                                    <div class="rowOne-T roundT">SHOP DRAWING</div>
                                    <div class="rowTwo-T roundB dash-resize" id="shopDrawingChart"></div>
                                </div>
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
        font-size: .9rem;
    }

    /*for percentage bar*/
    .status-chart-div{
        height: 100%!important;
    }
    .pendingDoc > div {
        background-image: unset!important;
        background-color: red;
    }
    .main-perc {
        background-image: unset!important;
        background-color: red;
        height: 10px;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .respondDoc > div {
        background-image: unset!important;
        background-color: #7cb5ec;
    }
    .barInner{
        background-image: unset!important;
        background-color: #7cb5ec;
        height: 100%;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
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
    .pending-text {
        color: red;
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
        /*padding: 0px 15px 0px 15px;*/
    }
    .cutoff-text {
        text-align: center;
        font-size: 15px;
        padding-right: 0;
    }

    @media only screen and (max-width: 1366px){
        .cutoff-text {
        text-align: center;
        font-size: 12px;
        padding-right: 0;
        }
    }
    .corrByCatDiv{
        overflow-y: auto;
    }
    .corrTotalInfoDiv {
        height: 20.5%!important;
    }
    .showLabel{
        display: none
    }

    .clickableCard {
        cursor:pointer;
    }
</style>