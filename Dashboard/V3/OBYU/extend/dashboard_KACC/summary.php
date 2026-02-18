<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('summary');

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
        // main header
        '<div class = "dashboardHeader">
            <div class = "title">
                <h4>SUMMARY DASHBOARD</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class="cutOffDateInfoDiv">
                <div class="cutOffDateTitle">AS AT</div>
                <div class="cutOffDateValue"><span id="cutOff-day">'.$dashObj->cutoffDay.'</span>&nbsp;<span id="cutOff-month">'.date("F", strtotime($dashObj->cutOffDate)).'</span>&nbsp;<span id="cutOff-year">'.date("Y", strtotime($dashObj->cutOffDate)).'</span></div>
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
                                    $key = 'overall';
                                    $val = '---';
                                }
                            }
                            $html .= '<option value="'.$key.'" onclick="refreshDashboard()">'.$val.'</option>';
                        }
                        $html .= '
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
        </div>';
}
    $html .= 
        '<div class="layout oneRow" id="lOne"> 
            <div class="rowOne twoRow">
                <div class="rowOne M twoColumn">
                    <div class="columnOne M60 twoRow">
                        <div class="rowOne-T round">PROGRESS</div>
                        <div class="rowTwo-T twoColumn spacerTop transparent">
                            <div class="columnOne M twoColumn">
                                <div class="columnOne M60 twoRow round shadow">
                                    <div class="rowOne-T roundT">PHYSICAL</div>
                                    <div class="rowTwo-T roundB dash-resize" id="phyScurve"></div>
                                </div>
                                <div class="columnTwo M40 twoRow">
                                    <div class="rowOne M twoRow round shadow">
                                        <div class="rowOne-T roundT" name="Planned Financial">PLANNED FINANCIAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="plannedFinancialGaugeCharts"></div>
                                    </div>
                                    <div class="rowTwo M twoRow round shadow">
                                        <div class="rowOne-T roundT" name="Planned Physical">PLANNED PHYSICAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="plannedPhysicalGaugeCharts"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo M twoColumn">
                                <div class="columnOne M40 twoRow">
                                    <div class="rowOne M twoRow round shadow">
                                        <div class="rowOne-T roundT" name="Actual Financial">ACTUAL FINANCIAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="actualFinancialGaugeCharts"></div>
                                    </div>
                                    <div class="rowTwo M twoRow round shadow">
                                        <div class="rowOne-T roundT" name="Actual Physical">ACTUAL PHYSICAL</div>
                                        <div class="rowTwo-T roundB dash-resize" id="actualPhysicalGaugeCharts"></div>
                                    </div>
                                </div>
                                <div class="columnTwo M60 twoRow round shadow">
                                    <div class="rowOne-T roundT">FINANCIAL</div>
                                    <div class="rowTwo-T roundB dash-resize" id="finScurve"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M40 twoRow round shadow">
                        <div class="rowOne-T roundT">COST</div>
                        <div class="rowTwo-T threeColumn roundB spacerTop">
                            <div class="columnOne M">
                                <div class="infoContainer">
                                    <div class="head">ORIGINAL CONTRACT</div>
                                    RM <span class="" id="origContractSumCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head"> VARIATION ORDER</div>
                                    RM <span class="" id="nettVariationSumCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">REVISED CONTRACT</div>
                                    RM <span class="" id="revisedContractSumCard">0</span>
                                </div>
                            </div>
                            <div class="columnTwo L">
                                <div class="dash-charts roundT dash-resize" id="costClaimPaymentChart"></div>
                            </div>
                            <div class="columnThree M">
                                <div class="infoContainer">
                                    <div class="head">CLAIM TO DATE (CUMULATIVE)</div>
                                    RM <span class="" id="claimCumulCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">PAYMENT RECEIVED (CUMULATIVE)</div>
                                    RM <span class="" id="cumulPaymentCard">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M twoColumn">
                    <div class="columnOne M40 twoColumn">
                        <div class="columnOne M twoRow shadow round">
                            <div class="rowOne-T roundT">CONTRACT PARTICULAR</div>
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
                        <div class="columnTwo M twoRow shadow round">
                            <div class="rowOne-T roundT">DOCUMENT</div>
                            <span id="document-cutOff-day" style="display:none">'.$dashObj->cutoffDay.'</span>
                            <div class="rowTwo-T twoRow roundB">
                                <div class="rowOne M twoColumn">
                                    <div class="columnOne M flex">
                                        <div class="numberContainer">
                                            <a class="dataNum1" id="incTotalCard">0</a>
                                            <div class="datalabel">Total Incoming</div>
                                        </div>
                                    </div>
                                    <div class="columnTwo M flex">
                                        <div class="numberContainerInvert">
                                            <a class="dataNum1" id="outTotalCard">0</a>
                                            <div class="datalabel">Total Outgoing</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo S corrStatusDiv"> 
                                    <div class="corrStatusBarDiv">
                                        <div class="corrStatusPercDiv"></div>
                                    </div>
                                    <div class="chartTitleSmall">Incoming Correspondence</div>
                                </div>
                            </div>
                        </div>                              
                    </div>
                    <div class="columnTwo M60 twoColumn round">
                        <div class="columnOne M60 twoRow">
                            <div class="rowOne-T round shadow">SAFETY</div>
                            <div class="rowTwo-T twoRow spacerTop transparent roundB">
                                <div class="rowOne M40 twoRow shadow round">
                                    <div class="rowOne-T roundT" title="">OVERALL MAN HOURS</div>
                                    <div class="rowTwo-T  infoContainerDiv roundB">
                                        <div class="infoContainer sheCenterContent">
                                            <div class="head">W/O LTI</div>
                                            <div class="body centerMiddle">
                                                <span id="smhWOLti">0</span>
                                            </div>
                                        </div>
                                        <div class="infoContainer sheCenterContent">
                                            <div class="head">WITH LTI</div>
                                            <div class="body centerMiddle">
                                                <span id="smhWLti">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo M60 twoColumn"> 
                                    <div class="columnOne M twoRow round shadow">
                                        <div class="rowOne-T roundT">FATALITY</div>
                                        <div class="rowTwo-T roundB dash-resize" id="fatalityChart"></div>
                                    </div>
                                    <div class="columnTwo M twoRow round shadow">
                                        <div class="rowOne-T roundT">TYPE OF PROPERTY DAMAGE</div>
                                        <div class="rowTwo-T roundB dash-resize" id="typeOfPropDamageChart"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M40 twoRow shadow round">
                            <div class="rowOne-T roundT">
                                QUALITY
                            </div>
                            <div class="rowTwo-T threeColumn roundB">
                                <div class="columnOne M twoRow">
                                    <div class="rowOne M flex">
                                        <div class="numberContainer first">
                                            <div class="dataNum">
                                                <a id="ncrTotal">
                                                    0
                                                </a>
                                                <div class="datalabel">
                                                    Total NCR
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowTwo M textlabelS">
                                        <a class="Closed">Closed: </a><a id="ncrClosed" class="data">0</a><br>
                                        <a class="Pending">Pending: </a><a id="ncrPending" class="data">0</a>
                                    </div>                            
                                </div>
                                <div class="columnTwo M twoRow">
                                    <div class="rowOne M flex">
                                        <div class="numberContainer middle">
                                            <div class="dataNum">
                                                <a id="msTotal">
                                                    0
                                                </a>
                                                <div class="datalabel">
                                                    Total MS
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowTwo M textlabelS">
                                        <a class="Closed">Closed: </a><a id="msClosed" class="data">0</a><br>
                                        <a class="Pending">Pending: </a><a id="msPending" class="data">0</a>
                                    </div>
                                </div>
                                <div class="columnThree M twoRow">
                                    <div class="rowOne M flex">
                                        <div class="numberContainer last">
                                            <div class="dataNum">
                                                <a id="maTotal">
                                                    0
                                                </a>
                                                <div class="datalabel">
                                                    Total MA
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowTwo M textlabelS">
                                        <a class="Closed">Closed: </a><a id="maClosed" class="data">0</a><br>
                                        <a class="Pending">Pending: </a><a id="maPending" class="data">0</a>
                                    </div>
                                </div>
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
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .clickableCard {
        cursor:pointer;
    }

    .showLabel{
        display: none
    }
</style>