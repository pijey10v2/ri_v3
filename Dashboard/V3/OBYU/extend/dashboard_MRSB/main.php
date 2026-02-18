<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('main');

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
                <h4>MAIN SUMMARY DASHBOARD</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ='.$prefix.''.$dashObj->projectInfo['icon_url'].'>
            </div>
        </div>';
}
    $html .= 
        '<div class = "dashboardBody">';
if ($showFilter) {
    $html .=
            '<div class="sidebar">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" >'.$val.'</option>';
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
            '<div class="layout oneRow" id="lOne">
                <div class="rowOne M twoColumn">
                    <div class="columnOne M twoRow">
                        <div class="rowOne M twoColumn">
                            <div class="columnOne S">
                                <div class="rowOne-T round shadow hsetColor">HSET</div>
                                <div class="rowTwo-T twoRow spacerTop transparent roundB">
                                    <div class="rowOne M round shadow twoRow">
                                        <div class = "rowOne-T roundT shadow hsetColor">MANHOUR</div>
                                        <div class = "rowTwo-T roundB shadow infoContainerDiv" id="" style="overflow: hidden">
                                            <div class="numberContainerInvert middle numberContainerText">
                                                <a class="textLabel" id="cumulWork">0</a>
                                                <div class="blackColor">Total Manhour Without LTI</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo L twoColumn">
                                <div class="columnOne SM round shadow" style="flex: 1 1 auto; margin-right: unset" id="riskContainer">
                                    <div class="rowOne-T roundT riskColor">RISK</div>
                                    <div class="rowTwo-T roundB flex">
                                        <div class="infoContainer riskScoreBackground" id="">
                                            <div class="head riskColor">OPEN RISK</div>
                                            <div class="body" id="">
                                                <span id="riskOpen">0</span>
                                            </div>
                                        </div>
                                        <div class="infoContainer riskScoreBackground" id="">
                                            <div class="head riskColor">CLOSED RISK</div>
                                            <div class="body" id="">
                                                <span id="riskClosed">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="columnTwo ML twoRow packageContainer" style="display:'.(($dashObj->isWPC) ? '' : 'none').';">
                                    <div class="rowOne-T round shadow planningColor">PLANNING & SCHEDULING</div>
                                    <div class="rowTwo-T twoRow spacerTop transparent roundB">
                                        <div class="rowOne M">
                                            <div class="rowOne-T roundT planningColor">PHYSICAL</div>
                                            <div class="rowTwo-T tableContainer scrollbar-inner roundB shadow" id = "">
                                                <table id ="" class="planningColor">
                                                    <thead>
                                                        <th class="planningColor">CATEGORY</th>
                                                        <th class="planningColor">VALUES (%)</th>
                                                    </thead>
                                                    <tbody id = "phyMainTable">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="rowTwo M">
                                            <div class="rowOne-T roundT planningColor">FINANCIAL</div>
                                            <div class="rowTwo-T tableContainer scrollbar-inner roundB shadow" id = "">
                                                <table id ="" class="">
                                                    <thead>
                                                        <th class="planningColor">CATEGORY</th>
                                                        <th class="planningColor">VALUES (%)</th>
                                                    </thead>
                                                    <tbody id = "financeMainTable">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M twoColumn">
                            <div class="columnOne S">
                                <div class="rowOne-T round shadow stakeholderColor">STAKEHOLDER</div>
                                <div class="rowTwo-T twoRow shadow spacerTop transparent roundB" style="border-top-right-radius: 15px;">
                                    <div class="rowOne-T roundT stakeholderColor">COMPLAINTS</div>
                                    <div class="rowTwo-T roundB flex">
                                        <div class="infoContainer riskScoreBackground">
                                            <div class="head stakeholderColor">TOTAL</div>
                                            <div class="body">
                                                <span id="totalComplaint">0</span>
                                            </div>
                                        </div>
                                        <div class="infoContainer riskScoreBackground">
                                            <div class="head stakeholderColor">OPEN</div>
                                            <div class="body">
                                                <span id="openComplaint">0</span>
                                            </div>
                                        </div>
                                        <div class="infoContainer riskScoreBackground">
                                            <div class="head stakeholderColor">CLOSED</div>
                                            <div class="body">
                                                <span id="closedComplaint">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo L twoColumn">
                                <div class="columnOne ML" id="landContainer" style="margin-right:'.(($dashObj->isWPC) ? '' : 'unset').'; flex: 1 1 auto">
                                    <div class="rowOne-T round shadow landColor">LAND MANAGEMENT</div>
                                    <div class="rowTwo-T spacerTop transparent twoRow">
                                        <div class="rowTwo M twoRow">
                                            <div class="rowTwo-T tableContainer scrollbar-inner roundB shadow" id="">
                                                <table id="" class="landColor">
                                                    <thead>
                                                        <tr>
                                                            <th class="landColor" rowspan="2">DESCRIPTION</th>
                                                            <th class="landColor" colspan="2"><center>To Date</center></th>
                                                            <th class="landColor" colspan="2"><center>Balance</center></th>
                                                        </tr>
                                                        <tr>
                                                            <th class="landColor">km</th>
                                                            <th class="landColor">%</th>
                                                            <th class="landColor">km</th>
                                                            <th class="landColor">%</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="projSummLandAcq">
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="rowTwo M twoRow">
                                            <div class="rowOne-T roundT landColor">LAND MANAGEMENT REPORT - ISSUES</div>
                                            <div class="rowTwo-T tableContainer scrollbar-inner roundB shadow" id = "">
                                                <table id ="" class="landColor">
                                                    <thead>
                                                        <th class="landColor">DESCRIPTION</th>
                                                        <th class="landColor">NUMBER OF ISSUES</th>
                                                    </thead>
                                                    <tbody id = "">
                                                        <tr>
                                                            <td>Total Accumulative to Date</td>
                                                            <td id = "accumulIssue"></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total Resolved to Date</td>
                                                            <td id = "solveIssue"></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Balance Unresolved to Date</td>
                                                            <td id = "balIssue"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="columnTwo SM" id="timeContainer" style="display:'.(($dashObj->isWPC) ? '' : 'none').';">
                                    <div class="rowOne-T round shadow timeColor">TIME</div>
                                    <div class="rowTwo-T spacerTop transparent twoColumn">
                                        <div class="columnOne theme-bg shadow round flex" style="margin-right: unset; flex: 1 1 auto">
                                            <div class="infoContainer">
                                                <div class="head timeColor">ELAPSED</div>
                                                <div class="body">
                                                    <span id="elapseTime">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head timeColor">REMAINING</div>
                                                <div class="body">
                                                    <span id="remainingTime">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer transparent">
                                                <div class="stage">
                                                    <div class="circle" id = "SPITime">
                                                        <div class="shadow"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo M twoRow">
                        <div class="rowOne M twoColumn packageContainer" style="display:'.(($dashObj->isWPC) ? '' : 'none').';">
                            <div class="columnOne M twoRow round shadow" id="costContainer">
                                <div class="rowOne-T roundT costColor">COST</div>
                                <div class="rowTwo-T roundB">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table> 
                                            <tbody id = "costDetails">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo M round shadow" id="contractContainer">
                                <div class="rowOne-T roundT contractColor">CONTRACT DETAILS</div>
                                <div class="rowTwo-T roundB">
                                    <div class="tableContainer scrollbar-inner roundB" id = "">
                                        <table> 
                                            <tbody id = "contractDetails">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M twoRow" id="qualityContainer" style="height:'.(($dashObj->isWPC) ? '' : 'calc(100% - 5px)').';">
                            <div class="rowOne-T round shadow qualityColor">QUALITY</div>
                            <div class="rowTwo-T twoRow spacerTop transparent roundB">
                                <div class="rowOne M twoRow" id="qualityContainerChild-1" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                                    <div class="rowOne S threeColumn round shadow codeHeader qualityColor" style="margin-top: 5px;">
                                        <div class="columnOne flexRow" style="width: calc(25% - 5px) !important">CODE 1: APPROVED</div>
                                        <div class="columnTwo w50 flexColumn">
                                            <span class="lineHeight12">CODE 2: APPROVED &amp; REVIEW</span>
                                            <span class="lineHeight12 flexEvenly">
                                                <span class="legend14">&lt;14 Days</span>
                                                <span class="legend60">&lt;60 Days</span>
                                                <span class="legend100">&lt;100 Days</span>
                                                <span class="legend110">&gt;100 Days</span>
                                            </span>
                                        </div>
                                        <div class="columnThree flexRow" style="width: calc(25% - 5px) !important">CODE 3: REJECTED</div>
                                    </div>
                                    <div class="rowTwo L twoRow transparent roundB">
                                        <div class="rowOne M">
                                            <div class = "rowOne-T roundT shadow" style="background: #42747e !important">METHOD STATEMENT (MS)</div>
                                            <div class = "rowTwo-T roundB shadow gridContainer">
                                                <div class="infoContainer marginBox grid1">
                                                    <div class="head" style="background: #42747e !important">RECEIVED</div>
                                                    <div class="body centerMiddle">
                                                        <span id="receivedMS">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid2">
                                                    <div class="head" style="background: #42747e !important">CUMULATIVE</div>
                                                    <div class="body centerMiddle">
                                                        <span id="cumulMS">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid3">
                                                    <div class="head" style="background: #42747e !important; font-size: 10px">UNDER REVIEW</div>
                                                    <div class="body centerMiddle" id = "reviewMSBackground">
                                                        <span id="reviewMS">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid4">
                                                    <div class="head" style="background: #42747e !important">CODE 1</div>
                                                    <div class="body centerMiddle">
                                                        <span id="code1MS">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid5">
                                                    <div class="head" style="background: #42747e !important">CODE 2</div>
                                                    <div class="body centerMiddle" id = "reviewMSCode2Background">
                                                        <span id="code2MS">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid6">
                                                    <div class="head" style="background: #42747e !important">CODE 3</div>
                                                    <div class="body centerMiddle">
                                                        <span id="code3MS">0</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rowTwo M">
                                            <div class = "rowOne-T roundT shadow" style="background: #426f7e !important">MATERIAL SUBMISSION (MT)</div>
                                            <div class = "rowTwo-T roundB shadow gridContainer">
                                                <div class="infoContainer marginBox grid1">
                                                    <div class="head" style="background: #426f7e !important">RECEIVED</div>
                                                    <div class="body centerMiddle">
                                                        <span id="receivedMT">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid2">
                                                    <div class="head" style="background: #426f7e !important">CUMULATIVE</div>
                                                    <div class="body centerMiddle">
                                                        <span id="cumulMT">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid3">
                                                    <div class="head" style="background: #426f7e !important; font-size: 10px">UNDER REVIEW</div>
                                                    <div class="body centerMiddle" id = "reviewMTBackground">
                                                        <span id="reviewMT">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid4">
                                                    <div class="head" style="background: #426f7e !important">CODE 1</div>
                                                    <div class="body centerMiddle">
                                                        <span id="code1MT">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid5">
                                                    <div class="head" style="background: #426f7e !important">CODE 2</div>
                                                    <div class="body centerMiddle" id = "reviewMTCode2Background">
                                                        <span id="code2MT">0</span>
                                                    </div>
                                                </div>
                                                <div class="infoContainer marginBox grid6">
                                                    <div class="head" style="background: #426f7e !important">CODE 3</div>
                                                    <div class="body centerMiddle">
                                                        <span id="code3MT">0</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo M twoRow" id="qualityContainerChild-2" style="height:'.(($dashObj->isWPC) ? 'calc(100% - 5px)' : '').';">
                                    <div class="rowOne M60 threeColumn">
                                        <div class="columnOne M round shadow">
                                            <div class = "rowOne-T roundT" style="background: #426a7e !important">TOTAL NCR WITH STATUS</div>
                                            <div class = "rowTwo-T twoRow roundB" id="">
                                                <div class="rowOne M infoContainerDiv">
                                                    <div class="infoContainer" style="margin: 5px">
                                                    <div class="head" style="background: #426a7e !important">CUMULATIVE</div>
                                                        <div class="body centerMiddle">
                                                            <span id="cumulNCR">0</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="rowTwo M infoContainerDiv">
                                                    <div class="infoContainer" style="margin: 5px">
                                                    <div class="head" style="background: #426a7e !important">PENDING</div>
                                                        <div class="body centerMiddle">
                                                            <span id="pendNCR">0</span>
                                                        </div>
                                                    </div>
                                                    <div class="infoContainer" style="margin: 5px">
                                                    <div class="head" style="background: #426a7e !important">CLOSED</div>
                                                        <div class="body centerMiddle">
                                                            <span id="closeNCR">0</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnTwo M round shadow">
                                            <div class = "rowOne-T roundT" style="background: #42657e !important">TOTAL NOI WITH STATUS</div>
                                            <div class = "rowTwo-T twoRow roundB" id="">
                                                <div class="rowOne M infoContainerDiv">
                                                    <div class="infoContainer" style="margin: 5px">
                                                    <div class="head" style="background: #42657e !important">CUMULATIVE</div>
                                                        <div class="body centerMiddle">
                                                            <span id="cumulNOI">0</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="rowTwo M infoContainerDiv">
                                                    <div class="infoContainer" style="margin: 5px">
                                                    <div class="head" style="background: #42657e !important">PENDING</div>
                                                        <div class="body centerMiddle">
                                                            <span id="pendNOI">0</span>
                                                        </div>
                                                    </div>
                                                    <div class="infoContainer" style="margin: 5px">
                                                    <div class="head" style="background: #42657e !important">CLOSED</div>
                                                        <div class="body centerMiddle">
                                                            <span id="closeNOI">0</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columnThree M round shadow">
                                            <div class = "rowOne-T roundT" style="background: #42607e !important">TOTAL RFI WITH STATUS</div>
                                            <div class = "rowTwo-T twoRow roundB" id="">
                                                <div class="rowOne M infoContainerDiv">
                                                    <div class="infoContainer" style="margin: 5px">
                                                    <div class="head" style="background: #42607e !important">SUBMITTED</div>
                                                        <div class="body centerMiddle">
                                                            <span id="cumulRFI">0</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="rowTwo M infoContainerDiv">
                                                    <div class="infoContainer" style="margin: 5px">
                                                    <div class="head" style="background: #42607e !important">PENDING</div>
                                                        <div class="body centerMiddle">
                                                            <span id="openRFI">0</span>
                                                        </div>
                                                    </div>
                                                    <div class="infoContainer" style="margin: 5px">
                                                    <div class="head" style="background: #42607e !important">CLOSED</div>
                                                        <div class="body centerMiddle">
                                                            <span id="closeRFI">0</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowTwo M40">
                                        <div class = "rowOne-T roundT shadow" style="background: #425b7e !important">TOTAL WIR WITH STATUS</div>
                                        <div class = "rowTwo-T roundB shadow gridContainer">
                                            <div class="infoContainer marginBox grid1">
                                                <div class="head" style="background: #425b7e !important">SUBMITTED</div>
                                                <div class="body centerMiddle">
                                                    <span id="submitWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid2">
                                                <div class="head" style="background: #425b7e !important">APPROVED</div>
                                                <div class="body centerMiddle">
                                                    <span id="approvedWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid3">
                                                <div class="head" style="background: #425b7e !important">UNAPPROVED</div>
                                                <div class="body centerMiddle">
                                                    <span id="unapprovedWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid4">
                                                <div class="head" style="background: #425b7e !important">CANCELLED</div>
                                                <div class="body centerMiddle">
                                                    <span id="cancelWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid5">
                                                <div class="head" style="background: #425b7e !important">PENDING</div>
                                                <div class="body centerMiddle">
                                                    <span id="pendWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid6">
                                                <div class="head" style="background: #425b7e !important">CLOSED</div>
                                                <div class="body centerMiddle">
                                                    <span id="closedWIR">0</span>
                                                </div>
                                            </div>
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
    .gridContainer{
        display: grid;
        grid-template-columns: repeat(6, 1fr);
    }
    .grid1{
        grid-column: 1;
        overflow: hidden
    }
    .grid2{
        grid-column: 2;
        overflow: hidden
    }
    .grid3{
        grid-column: 3;
        overflow: hidden
    }
    .grid4{
        grid-column: 4;
        overflow: hidden
    }
    .grid5{
        grid-column: 5;
        overflow: hidden
    }
    .grid6{
        grid-column: 6;
        overflow: hidden
    }
    .hsetColor{
        background-color: #633974  !important;
    }
    .stakeholderColor{
        background-color: #117A65  !important;
    }
    .costColor{
        background-color: #D68910  !important;
    }
    .contractColor{
        background-color: #CB4335  !important;
    }
    .planningColor{
        background-color: #2471A3  !important;
    }
    .riskColor{
        background-color: #34495E  !important;
    }
    .qualityColor{
        background-color: #426a7e  !important;
    }
    .landColor{
        background-color: #b97a57 !important;
    }
    .timeColor{
        background-color: #DA70D6 !important;
    }
    .theme-bg{
        background-color: var(--surface) !important;
    }
    tbody#phyMainTable > tr > td {
        cursor:default;
    }

    tbody#financeMainTable > tr > td {
        cursor:default;
    }

    thead > tr > th{
        cursor:default;
    }
    .tableHeader{
        width: 33.33%;
        word-break: break-all;
    }

    .clickable {
        cursor:pointer!important;
    }
    .flexRow{
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
    .flexColumn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: white;
    }
    .flexEvenly {
        display: flex;
        justify-content: space-evenly;
    }
    .h45 {
        height: calc(45% - 5px) !important;
    }
    .h55{
        height: calc(55% - 5px) !important;
    }
    .w50 {
        width: calc(50% - 5px) !important;
    }
    .lineHeight12 {
        line-height: 15px !important;
    }
    .legend14:before {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #52BE80;
    }
    .legend60:before {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #F4D03F;
    }
    .legend100:before {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #FF7F50;
    }
    .legend110:before {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #E93232;
    }
    .marginTop {
        margin-top: 5px !important;
    }
    .marginTopBottom {
        margin: 11px 0px !important;
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
    .textLabel{
        font-size:2.2em;
        color: black
    }
    .blackColor{
        color: black  !important;
        font-size: 13px;
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
</style>