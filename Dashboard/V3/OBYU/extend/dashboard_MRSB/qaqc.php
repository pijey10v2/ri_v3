<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('qaqc');

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
            <h4>QUALITY ASSURANCE QUALITY CONTROL</h4>
            <h3>'.$dashObj->projectInfo['project_name'].'</h3>
        </div>
        <div class = "logo right">
            <img src ='.$prefix.''.$dashObj->projectInfo['icon_url'].'>
        </div>
    </div>';
}
    $html .= 
        '<div class ="dashboardBody">';
if($showFilter){
    $html .=
            '<div class = "sideBar">
                <div class = "filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select onchange="refreshDashboard()" id="wpcFilter">';
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
            '<div class ="layout oneRow">
                <div class="rowOne twoRow">
                    <div class="rowOne M twoColumn">
                        <div class="columnOne XL twoRow">
                            <div class="rowOne-T round shadow">NON-CONFORMANCE REPORT (NCR)</div>
                            <div class="rowTwo-T twoColumn spacerTop transparent roundB">
                                <div class="columnOne twoColumn" style="width: calc(44.5% - 5px)">
                                    <div class="columnOne M40 twoRow">
                                        <div class="rowOne L threeRow">
                                            <div class="rowOne M">
                                                <div class = "rowOne-T roundT shadow">PREVIOUS MONTH</div>
                                                <div class = "rowTwo-T roundB shadow centerMiddle textLarge dashbordCard" id="prevNCR">0</div>
                                            </div>
                                            <div class="rowTwo M">
                                                <div class = "rowOne-T roundT shadow">CURRENT MONTH</div>
                                                <div class = "rowTwo-T roundB shadow centerMiddle textLarge dashbordCard" id="currNCR">0</div>
                                            </div>
                                            <div class="rowThree M">
                                                <div class = "rowOne-T roundT shadow">CUMULATIVE</div>
                                                <div class = "rowTwo-T roundB shadow centerMiddle textLarge dashbordCard" id="cumulNCR">0</div>
                                            </div>
                                        </div>
                                        <div class="rowTwo S twoColumn" style="margin: 0 !important">
                                            <div class="columnOne M">
                                                <div class = "rowOne-T roundT shadow">PENDING</div>
                                                <div class = "rowTwo-T roundB shadow centerMiddle dashbordCard" id="pendNCR">0</div>
                                            </div>
                                            <div class="columnTwo M">
                                                <div class = "rowOne-T roundT shadow">CLOSED</div>
                                                <div class = "rowTwo-T roundB shadow centerMiddle dashbordCard" id="closeNCR">0</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="columnTwo M60">
                                        <div class = "rowOne-T roundT shadow">NCR CLASSIFICATION</div>
                                        <div class = "rowTwo-T roundB shadow dash-resize" id="ncrClassify"></div>
                                    </div>
                                </div>
                                <div class="columnTwo twoColumn" style="width: calc(55.5% - 5px)">
                                    <div class="columnOne M twoRow">
                                        <div class="rowOne-T roundT shadow">NCR WORK DISCIPLINE</div>
                                        <div class="rowTwo-T roundB shadow dash-resize" id="workDiscipline"></div>
                                    </div>
                                    <div class="columnTwo M twoRow">
                                        <div class="rowOne-T roundT shadow">NCR AGEING</div>
                                        <div class="rowTwo-T roundB shadow dash-resize" id="ncrAge"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnOne XS twoRow round shadow">
                            <div class="rowOne-T roundT shadow">CUMULATIVE RFI</div>
                            <div class="rowTwo-T roundB flex">
                                    <div class="infoContainer" id="">
                                        <div class="head">TOTAL SUBMITTED</div>
                                        <div class="body centerMiddle dashbordCard">
                                            <span id="cumulRFI">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer" id="">
                                        <div class="head">TOTAL OPEN</div>
                                        <div class="body centerMiddle dashbordCard">
                                            <span id="openRFI">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer" id="">
                                        <div class="head">TOTAL CLOSED</div>
                                        <div class="body centerMiddle dashbordCard">
                                            <span id="closeRFI">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div class="rowtwo M twoColumn">
                        <div class="columnOne M40 twoRow">
                            <div class="rowOne-T round shadow">NOTICE OF IMPROVEMENT (NOI)</div>
                            <div class="rowTwo-T twoColumn spacerTop transparent roundB">
                                <div class="columnOne M40 twoRow">
                                    <div class="rowOne L threeRow">
                                        <div class="rowOne M">
                                            <div class = "rowOne-T roundT shadow">PREVIOUS MONTH</div>
                                            <div class = "rowTwo-T roundB shadow centerMiddle textLarge dashbordCard" id="prevNOI">0</div>
                                        </div>
                                        <div class="rowTwo M">
                                            <div class = "rowOne-T roundT shadow">CURRENT MONTH</div>
                                            <div class = "rowTwo-T roundB shadow centerMiddle textLarge dashbordCard" id="currNOI">0</div>
                                        </div>
                                        <div class="rowThree M">
                                            <div class = "rowOne-T roundT shadow">CUMULATIVE</div>
                                            <div class = "rowTwo-T roundB shadow centerMiddle textLarge dashbordCard" id="cumulNOI">0</div>
                                        </div>
                                    </div>
                                    <div class="rowTwo S twoColumn" style="margin: 0 !important">
                                        <div class="columnOne M">
                                            <div class = "rowOne-T roundT shadow">PENDING</div>
                                            <div class = "rowTwo-T roundB shadow centerMiddle dashbordCard" id="pendNOI">0</div>
                                        </div>
                                        <div class="columnTwo M">
                                            <div class = "rowOne-T roundT shadow">CLOSED</div>
                                            <div class = "rowTwo-T roundB shadow centerMiddle dashbordCard" id="closeNOI">0</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="columnTwo M60">
                                    <div class = "rowOne-T roundT shadow">NOI CLASSIFICATION</div>
                                    <div class = "rowTwo-T roundB shadow dash-resize" id="noiClassify"></div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M60 oneColumn">
                            <div class="columnOne twoRow">
                                <div class="rowOne-T threeColumn round shadow codeHeader">
                                    <div class="columnOne w25" style="width: calc(25% - 5px) !important">CODE 1: APPROVED</div>
                                    <div class="columnTwo w50 flexColumn">
                                        <span class="lineHeight12">CODE 2: APPROVED &amp; REVIEW</span>
                                        <span class="lineHeight12 flexEvenly">
                                            <span class="legend14">&lt;14 Days</span>
                                            <span class="legend60">&lt;60 Days</span>
                                            <span class="legend100">&lt;100 Days</span>
                                            <span class="legend110">&gt;100 Days</span>
                                        </span>
                                    </div>
                                    <div class="columnThree w25">CODE 3: REJECTED</div>
                                </div>
                                <div class="rowTwo-T threeRow spacerTop transparent roundB">
                                    <div class="rowOne M marginTop">
                                        <div class = "rowOne-T roundT shadow">METHOD STATEMENT (MS)</div>
                                        <div class = "rowTwo-T roundB shadow gridContainer">
                                            <div class="infoContainer marginBox grid1">
                                                <div class="head">RECEIVED</div>
                                                <div class="body centerMiddle">
                                                    <span id="receivedMS">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid2">
                                                <div class="head">CUMULATIVE</div>
                                                <div class="body centerMiddle">
                                                    <span id="cumulMS">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid3">
                                                <div class="head" style= "font-size: 10px">UNDER REVIEW</div>
                                                <div class="body centerMiddle" id = "reviewMSBackground">
                                                    <span id="reviewMS">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid4">
                                                <div class="head">CODE 1</div>
                                                <div class="body centerMiddle">
                                                    <span id="code1MS">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid5">
                                                <div class="head">CODE 2</div>
                                                <div class="body centerMiddle" id = "reviewMSCode2Background">
                                                    <span id="code2MS">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid6">
                                                <div class="head">CODE 3</div>
                                                <div class="body centerMiddle">
                                                    <span id="code3MS">0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowTwo M marginTopBottom">
                                        <div class = "rowOne-T roundT shadow">MATERIAL SUBMISSION (MT)</div>
                                        <div class = "rowTwo-T roundB shadow gridContainer">
                                            <div class="infoContainer marginBox grid1">
                                                <div class="head">RECEIVED</div>
                                                <div class="body centerMiddle">
                                                    <span id="receivedMT">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid2">
                                                <div class="head">CUMULATIVE</div>
                                                <div class="body centerMiddle">
                                                    <span id="cumulMT">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid3">
                                                <div class="head" style= "font-size: 10px">UNDER REVIEW</div>
                                                <div class="body centerMiddle" id = "reviewMTBackground">
                                                    <span id="reviewMT">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid4">
                                                <div class="head">CODE 1</div>
                                                <div class="body centerMiddle">
                                                    <span id="code1MT">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid5">
                                                <div class="head">CODE 2</div>
                                                <div class="body centerMiddle" id = "reviewMTCode2Background">
                                                    <span id="code2MT">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid6">
                                                <div class="head">CODE 3</div>
                                                <div class="body centerMiddle">
                                                    <span id="code3MT">0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowThree M">
                                        <div class = "rowOne-T roundT shadow">WORK INSPECTION REQUEST (WIR)</div>
                                        <div class = "rowTwo-T roundB shadow gridContainer">
                                            <div class="infoContainer marginBox grid1">
                                                <div class="head">SUBMITTED</div>
                                                <div class="body centerMiddle">
                                                    <span id="submitWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid2">
                                                <div class="head">APPROVED</div>
                                                <div class="body centerMiddle">
                                                    <span id="approvedWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid3">
                                                <div class="head">UNAPPROVED</div>
                                                <div class="body centerMiddle">
                                                    <span id="unapprovedWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid4">
                                                <div class="head">CANCELLED</div>
                                                <div class="body centerMiddle">
                                                    <span id="cancelWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid5">
                                                <div class="head">PENDING</div>
                                                <div class="body centerMiddle">
                                                    <span id="pendWIR">0</span>
                                                </div>
                                            </div>
                                            <div class="infoContainer marginBox grid6">
                                                <div class="head">CLOSED</div>
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
    .rowTwo-XL> header{
        color: red;
    }
    .big{
        font-size: 15px !important;
    }
    .red{
        background: #FF0000 !important;
    }
    .Lblue{
        background: #09a1dd !important;
    }
    .blue2{
        background: #376ef0 !important;
    }
    .orange{
        background: #f1701a !important;
    }
    .yellow{
        background: #e6e20cfa !important;
        color: black !important;
    }
    .lightblue{
        background: #3399FF !important;
    }
    .green{
        background: rgb(114 195 97) !important;
    }
    .label{
        color: grey;
        font-weight: bold;
    }
    .num{
        text-align: center;
        font-size: 13px;
        font-weight:500px;
    }
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .filterBox{
        background: #002171;
        color: white;
        margin-bottom: 10px;
        border-radius: 5px;
        padding: 5px;
        line-height: 35px;
        text-align: center;
    }
    .filterLabel{
        font-size:2em
    }
    .marginBox{
        margin: 5px !important;
    }
    .textLarge{
        font-size:1.5em !important;
        /* font-weight:bold */
    }
    .dash-bold-text{
        font-weight:bold
    }
    .numberContainerText{
        font-size:9px !important;
    }
    .textLabel{
        font-size:2.5em
    }
    .codeHeader{
        background-color :#69b4ff !important;;
        font-size: 12px !important;
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
    .infoContainer > .body > span {
        cursor: pointer;
    }
    .dashbordCard{
        cursor:pointer;
    }
    .flexColumn {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .flexEvenly {
        display: flex;
        justify-content: space-evenly;
    }
    .w50 {
        width: calc(50% - 5px) !important;
    }
    .lineHeight12 {
        line-height: 12px !important;
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
    .showLabel{
        display: none
    }
</style>