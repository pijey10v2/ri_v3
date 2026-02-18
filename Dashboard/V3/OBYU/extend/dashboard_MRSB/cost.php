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
        '<div class = "dashboardHeader mainHeaderColor">
            <div class = "title">
                <h4>CONTRACT AND COST DASHBOARD</h4>
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
            '<div class="sidebar" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard()">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'">'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                </div>
            </div>';
}
    $html .=
            '<div class="layout oneRow" id="lOne" '.(($dashObj->isWPC) ? 'style="width:calc(100% - 10px);"' : '').'">
                <div class="rowOne M twoColumn">
                    <div class="columnOne S twoRow" id="overallCost" style="display:'.(($dashObj->isWPC) ? 'none' : '').'; width:'.(($dashObj->isWPC) ? '' : 'calc(100% - 10px)').'">
                        <div class="rowOne-T round shadow">OVERALL</div>
                        <div class="rowTwo-T transparent spacerTop threeColumn">
                            <div class="columnOne M twoRow">
                                <div class="rowOne M twoRow">
                                    <div class="rowOne-T roundT shadow">ORIGINAL CONTRACT SUM</div>
                                    <div class="rowTwo-T roundB shadow tableContainer scrollbar-inner">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center; border: 1px solid white">PACKAGE</th>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center;  border: 1px solid white">AMOUNT</th>
                                                </tr>
                                            </thead>
                                            <tbody id = "dataOriginalContract">
                                            </tbody>
                                            <thead style="position: sticky">
                                                <tr>
                                                    <th colspan="" class="lightbluePastel secondRowBottom" scope="colgroup" style="text-align:center; border: 1px solid white;">TOTAL</th>
                                                    <th id="originalOverall" class="lightBlueRedFont secondRowBottom" scope="colgroup" style="text-align:center;  border: 1px solid white">0</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                                <div class="rowTwo M twoRow">
                                    <div class="rowOne-T roundT shadow">VARIATION ORDER (VO)</div>
                                    <div class="rowTwo-T roundB shadow tableContainer scrollbar-inner">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center; border: 1px solid white">PACKAGE</th>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center; border: 1px solid white">NO. OF VO(s)</th>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center;  border: 1px solid white">TOTAL AMOUNT</th>
                                                </tr>
                                            </thead>
                                            <tbody id = "dataVO">
                                            </tbody>
                                            <thead style="position: sticky">
                                                <tr>
                                                    <th colspan="2" class="lightbluePastel secondRowBottom" scope="colgroup" style="text-align:center; border: 1px solid white;">TOTAL</th>
                                                    <th id="voOverall" class="lightBlueRedFont secondRowBottom" scope="colgroup" style="text-align:center;  border: 1px solid white">0</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo M twoRow">
                                <div class="rowOne M twoRow">
                                    <div class="rowOne-T roundT shadow">REVISED CONTRACT SUM</div>
                                    <div class="rowTwo-T roundB shadow tableContainer scrollbar-inner">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center; border: 1px solid white">PACKAGE</th>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center;  border: 1px solid white">AMOUNT</th>
                                                </tr>
                                            </thead>
                                            <tbody id = "dataRevisedAmount">
                                            </tbody>
                                            <thead style="position: sticky">
                                                <tr>
                                                    <th colspan="" class="lightbluePastel secondRowBottom" scope="colgroup" style="text-align:center; border: 1px solid white;">TOTAL</th>
                                                    <th id="revisedOverall" class="lightBlueRedFont secondRowBottom" scope="colgroup" style="text-align:center;  border: 1px solid white">0</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                                <div class="rowTwo M twoRow">
                                    <div class="rowOne-T roundT shadow">ADJUSTMENT TO CONTRACT SUM (ACS)</div>
                                    <div class="rowTwo-T roundB shadow tableContainer scrollbar-inner">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center; border: 1px solid white">PACKAGE</th>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center; border: 1px solid white">NO. OF ACS(s)</th>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center;  border: 1px solid white">AMOUNT</th>
                                                </tr>
                                            </thead>
                                            <tbody id = "dataACS">
                                            </tbody>
                                            <thead style="position: sticky">
                                                <tr>
                                                    <th colspan="2" class="lightbluePastel secondRowBottom" scope="colgroup" style="text-align:center; border: 1px solid white;">TOTAL</th>
                                                    <th id="acsOverall" class="lightBlueRedFont secondRowBottom" scope="colgroup" style="text-align:center;  border: 1px solid white">0</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="columnThree M twoRow centerMiddle">
                                <div class="tableM">
                                    <div class="rowOne-T roundT shadow">IPC</div>
                                    <div class="rowTwo-T roundB shadow tableContainer scrollbar-inner">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center; border: 1px solid white">PACKAGE</th>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center; border: 1px solid white">NO. OF IPC(s)</th>
                                                    <th colspan="" class="lightbluePastel" scope="colgroup" style="text-align:center;  border: 1px solid white">AMOUNT</th>
                                                </tr>
                                            </thead>
                                            <tbody id = "dataIPC">
                                            </tbody>
                                            <thead style="position: sticky">
                                                <tr>
                                                    <th colspan="2" class="lightbluePastel secondRowBottom" scope="colgroup" style="text-align:center; border: 1px solid white;">TOTAL</th>
                                                    <th id="ipcOverall" class="lightBlueRedFont secondRowBottom" scope="colgroup" style="text-align:center;  border: 1px solid white">0</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo L twoColumn" id="packageCost" style="display:'.(($dashObj->isWPC) ? '' : 'none').'; width:'.(($dashObj->isWPC) ? 'calc(100% - 10px)' : '').'; ">
                        <div class="columnOne ML twoRow">
                            <div class="rowOne ML twoRow">
                                <div class="rowOne w40 twoRow">
                                    <div class="rowOne-T round shadow darkGreen">INTERIM CERTIFIED PAYMENT</div>
                                    <div class="rowTwo-T threeColumn spacerTop transparent roundB">
                                        <div class="columnOne M flex">
                                            <div class="infoContainer">
                                                <div class="head darkGreen" title="CURRENT IPC NO">CURRENT IPC NO</div>
                                                <div class="body white shadow">
                                                    <span id="ipcNo" style="width: 100%">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head darkGreen" title="CURRENT IPC AMOUNT (RM)">CURRENT IPC AMOUNT (RM)</div>
                                                <div class="body white shadow">
                                                    <span id="currIPCAmount" style="width: 100%">0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnTwo M twoRow flex" style="">
                                            <div class="rowOne M flex">
                                                <div class="numberContainer numberContainerText darkGreen" style="margin: auto 20px !important">
                                                    <a class="textLabel" id="workDoneFrom">N/A</a>
                                                    <div class="datalabel">Work Done From (Date)</div>
                                                </div>
                                            </div>
                                            <div class="rowTwo M flex">
                                                <div class="numberContainer numberContainerText darkGreen" style="margin: auto 20px !important">
                                                    <a class="textLabel" id="workDoneTo">N/A</a>
                                                    <div class="datalabel">Work Done To (Date)</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnThree M flex">
                                            <div class="infoContainer">
                                                <div class="head darkGreen noWrapHead" title="TOTAL CUMULATIVE CERTIFIED PAYMENT (RM)">TOTAL CUMULATIVE CERTIFIED PAYMENT (RM)</div>
                                                <div class="body white shadow">
                                                    <span id="ttlCumultPayment" style="width: 100%">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head darkGreen noWrapHead" title="TOTAL CUMULATIVE AMOUNT PAID BY CLIENT (RM)">TOTAL CUMULATIVE AMOUNT PAID BY CLIENT (RM)</div>
                                                <div class="body white shadow">
                                                    <span id="ttlCumultPaymentbyClient" style="width: 100%">0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo w60 twoColumn">
                                    <div class="columnOne M">
                                        <div class = "rowOne-T roundT shadow mediumGreen">TOTAL CUMULATIVE CERTIFIED AMOUNT VS REVISED CONTRACT SUM (RM)</div>
                                        <div class = "rowTwo-T roundB shadow dash-resize" id="cumulativeCertifiedPaymentContractSum"></div>
                                    </div>
                                    <div class="columnTwo M">
                                        <div class = "rowOne-T roundT shadow mediumGreen">APPROVED VO VS ORIGINAL CONTRACT SUM (RM)</div>
                                        <div class = "rowTwo-T roundB shadow dash-resize" id="variationOrderNettContractSum"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo SM twoColumn">
                                <div class="columnOne M flex" style="">
                                    <div class="infoContainer" id="">
                                        <div class="head mediumGreen">REVISED COMPLETION DATE</div>
                                        <div class="body noWrap scrollbar-inner white shadow">
                                            <span id="revisedDate" style="width: 100%">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer" id="">
                                        <div class="head mediumGreen">APPROVED EOT (NO)</div>
                                        <div class="body noWrap scrollbar-inner white shadow">
                                            <span id="approvedEOTNo" style="width: 100%">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer" id="">
                                        <div class="head mediumGreen">APPROVED EOT (DAYS)</div>
                                        <div class="body noWrap scrollbar-inner white shadow">
                                            <span id="approvedEOTDays" style="width: 100%">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="columnTwo M twoRow">
                                    <div class="rowOne M">
                                        <div class = "rowOne-T roundT shadow mediumGreen" title="">REVISED CONTRACT SUM (RM)</div>
                                        <div class = "rowTwo-T roundB shadow centerMiddle textLabel" id="revisedContractSum">0</div>
                                    </div>
                                    <div class="rowTwo M">
                                        <div class = "rowOne-T roundT shadow mediumGreen" title="">LAD AMOUNT (RM)</div>
                                        <div class = "rowTwo-T roundB shadow centerMiddle textLabel" id="ladAmount">0</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnOne SM twoRow">
                            <div class="rowOne ML twoRow tableCell">
                                <div class="rowOne w40 round shadow">
                                    <div class="rowOne-T roundT lightGreen">CONTRACT DETAILS</div>
                                    <div class="rowTwo-T roundB">
                                        <div class="tableContainer scrollbar-inner roundB tableHeaderGroup" id = "dashboarditem">
                                            <table> 
                                                <tbody id = "contractDetails">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo w60 round shadow twoRow">
                                    <div class = "rowOne-T roundT tableContainer shadow mediumGreen" title="">
                                        <table> 
                                            <thead>
                                                <tr>
                                                    <th class="mediumGreen" style="width: 50%; height: 30px; font-size: 10px; text-align: center;">APPROVED VO (NO)</th>
                                                    <th class="mediumGreen" style="width: 50%; height: 30px;font-size: 10px; text-align: center;">APPROVED ACS (NO)</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                    <div class = "rowTwo-T roundB shadow twoColumn">
                                        <div class="columnOne M">
                                            <div class="tableContainer scrollbar-inner roundB tableHeaderGroup" id = "dashboarditem">
                                                <table class="tableCenter"> 
                                                    <tbody id = "approvedVONo">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class="tableContainer scrollbar-inner roundB tableHeaderGroup" id = "dashboarditem">
                                                <table>
                                                    <tbody id = "approvedACSNo">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo SM flex">
                                <div class="infoContainer" id="">
                                    <div title="APPROVED VO (RM)" class="head mediumGreen noWrapHead">APPROVED VO (RM)</div>
                                    <div class="body white shadow">
                                        <span id="approvedVOAmount">0</span>
                                    </div>
                                </div>
                                <div class="infoContainer" id="">
                                    <div title="APPROVED ACS (RM)" class="head noWrapHead mediumGreen">APPROVED ACS (RM)</div>
                                    <div class="body white shadow">
                                        <span id="approvedACSAmount">0</span>
                                    </div>
                                </div>
                                <div class="infoContainer" id="">
                                    <div title="RETENTION SUM (RM)" class="head mediumGreen noWrapHead">RETENTION SUM (RM)</div>
                                    <div class="body white shadow">
                                        <span id="retentionSum" style="width: 100%">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>';
if ($showFilter) {
    $html .=
            '<div class="minimizeButton active" id="minimizeButton" '.(($dashObj->isWPC) ? 'style="display:none;"' : '').'">
                <div class="lines"></div>
                <div class="lines"></div>
            </div>';
}
    $html .=
        '</div>
    </div>
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
    .dashboardHeader > img {
        margin: 12px; 
        cursor: pointer;
    }
    .main-div {
        height: 100%;
    }
    .centerMiddle{
        display: flex !important;
        align-items: center;
        justify-content: center;
    }
    .tableM{
        width: 100%;
        height: calc(50% - 5px);
    }
    .numberContainerText{
        font-size:13px !important;
        margin: auto 10px auto 10px !important;
        padding: auto 5px auto 5px !important;
    }
    .textLabel{
        font-size:18px !important;
    }
    .textLabelOverall{
        font-size:1.5em;
    }
    .infoContainer > .body > span {
        cursor: pointer;
    }
    .noWrap{
        overflow-x: auto !important;
        white-space: nowrap;
        text-align: center
    }
    .noWrapHead{
        white-space: nowrap;
        overflow: hidden;
    }
    .gridContainer{
        display: grid;
        grid-template-rows: repeat(2, 1fr);
    }
    div > .head{
        cursor:default;
    }
    div > .rowOne-T{
        cursor:default;
    }
    .mainHeaderColor{
        background-color: #0e5d76 !important;
    }
    .darkGreen{
        background-color: #216869 !important;
    }
    .mediumGreen{
        background-color: #5da399 !important;
    }
    .lightGreen{
        background-color: #319d9f  !important;
    }
    .lightbluePastel{
        background: #BDD6EE !important;
        color: black !important;
    }
    .lightBlueRedFont{
        background: #BDD6EE !important;
        color: black;
    }
    .tableContainer th.secondRowBottom {
        bottom: 0px;
    }
    .white{
        background-color: white !important;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .w40{
        height: calc(40% - 5px) !important;
    }
    .w60{
        height: calc(60% - 5px) !important;
    }
    .tableCenter{
        text-align: center
    }
    .checkPositiveVal{
       color: black; 
    }
    .checkNegativeVal{
       color: red; 
    }
    .showLabel{
        display: none
    }
    .clickableCard {
        cursor:pointer;
    }
</style>