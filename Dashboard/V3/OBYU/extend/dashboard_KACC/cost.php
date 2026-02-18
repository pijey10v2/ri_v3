<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('cost');

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
                <h4>COST MANAGEMENT DASHBOARD</h4>
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
                                if(!$dashObj->isWPC){
                                    if($key == 'overall'){
                                        $key = '---';
                                        $val = '---';
                                    }
                                }
                                $html .= '<option value="'.$key.'" onclick="refreshDashboard()">'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Section</label><br>
                        <select onchange="refreshDashboard()" id = "sectionFilter">
                        </select>
                    </div>
                </div>
            </div>';
}
    $html .=
            '<div class="layout oneRow" id="lOne">
                <div class="rowOne M threeColumn main-div">
                    <div class="columnOne SM twoRow">
                        <div class="rowOne SM twoRow shadow round">
                            <div class="rowOne-T roundT">CONTRACT PACTICULAR</div>
                            <div class="rowTwo-T roundB">
                                <div class="tableContainer scrollbar-inner roundB" id = "dashboarditem">
                                    <table> 
                                        <tbody>
                                            <tr>
                                                <td>Contract No.</td>
                                                <td id="contractNoCard">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Original Completion Date.</td>
                                                <td id="origCompDateCard">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Commencement Date</td>
                                                <td id="commencementDateCard">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Extension of Time (EOT)</td>
                                                <td id="extensionOfTimeCard">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Revised Completion Date</td>
                                                <td id="revisedCompletionDateCard">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Sub-Contract Value</td>
                                                <td id="subConVal">N/A</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo ML twoRow shadow round">
                            <div class="rowOne-T roundT">STATISTICS</div>
                            <div class="rowTwo-T flex roundB">
                                <div class="infoContainer">
                                    <div class="head">ORIGINAL CONTRACT SUM</div>
                                    RM <span id="origContractSumCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">NETT VARIATION SUM</div>
                                    RM <span id="nettVariationSumCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">REVISED CONTRACT SUM</div>
                                    RM <span id="revisedContractSumCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">TOTAL CUMULATIVE CLAIM TO DATE </div>
                                    RM <span id="claimCumulCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">TOTAL CUMULATIVE CLAIM CERTIFIED </div>
                                    RM <span id="claimCumulCertifiedCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">TOTAL CUMULATIVE PAYMENT RECEIVED</div>
                                    RM <span id="cumulPaymentCard">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo LL twoRow shadow round">
                        <div class="rowOne-T roundT">PAYMENT AND CLAIM</div>
                        <div class="rowTwo-T roundB dash-resize" id="costClaimPaymentChart"></div>
                    </div>
                    <div class="columnThree SM threeRow">
                        <div class="rowOne M twoRow shadow round">
                            <div class="rowOne-T roundT">LAD RISK</div>
                            <div class="rowTwo-T twoRow shadow roundB">
                                <div class="rowOne ML trafficChartContainer dash-resize">
                                    <div class="trafficChart trafficChart-green" title="Low Risk"></div>
                                    <div class="trafficChart trafficChart-yellow" title="Medium Risk"></div>
                                    <div class="trafficChart trafficChart-red" title="High Risk"></div>
                                </div>
                                <div class="rowTwo SM indexDec">
                                    <b> Planned Financial </b></span>: <span id="ladPlanPhyVal"></span> % ,
                                    <b> Actual Financial </b></span>: <span id="ladActPhyVal"></span> % ,
                                    <b> Difference </b></span>: <span id="ladDiffPhyVal"></span> % 
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M twoRow shadow round">
                            <div class="rowOne-T roundT">CASHFLOW HEALTH</div>
                            <div class="rowTwo-T twoRow roundB">
                                <div class="rowOne ML" id="cashflowHeathIndexChart"></div>
                                <div class="rowTwo SM indexDec">Ratio = Inflow - outflow <br/><b>Green</b>: >=1, <b>Yellow</b>: 0, <b>Red</b>: <= -1 </div>
                            </div>
                        </div>
                        <div class="rowThree M twoRow shadow round">
                            <div class="rowOne-T roundT">PAYMENT AGING</div>
                            <div class="rowTwo-T twoRow roundB">
                                <div class="rowOne ML" id="paymentAgingChart"></div>
                                <div class="rowTwo SM indexDec"><b>Green</b> :  <= 37 days, <b>Yellow</b> : 38 - 44 days, <b>Red</b> : >44 days</div>
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
        justify-content: center;
        flex-direction: column;
        text-align: center;
        align-items: center;
    }
    .cutOffDateVal {
        margin-top: 5px;
    }
    .trafficChart {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 100%;
      position: relative;
      height: 40px;
      width: 40px;
    }

    .trafficChartContainer {
        align-items: center;
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
    }

    .trafficChart-red {
        background-color: #c0392b;
        opacity: 0.1;
    }

    .trafficChart-yellow {
        background-color: #f1c40f;
        opacity: 0.1;
    }

    .trafficChart-green {
        background-color: #2ecc71;
        opacity: 0.1;
    }
    .ladDesc {
        font-size: 10px;
        text-align: center;
    }
    .ladDescLabel {
        display: inline-block;
        width: 35%;
    }

    .indexDec {
        text-align: center; 
    }
    .showLabel{
        display: none
    }
    .clickableCard {
        cursor:pointer;
    }
</style>