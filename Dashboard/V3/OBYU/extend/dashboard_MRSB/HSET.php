<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('hset');

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
            <h4>HSET MANAGEMENT DASHBOARD</h4>
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
            '<div class = "layout oneRow">
                <div class = "rowOne twoColumn">
                    <div class = "columnOne L twoRow">
                        <div class = "rowOne M threeColumn" style = "padding: 0 7px 7px 0">
                            <div class = "columnOne M round shadow">
                                <div class = "rowOne-T roundT">HSET WALKABOUT</div>
                                <div class = "rowTwo-T roundB dash-resize" id="hseWalkabout"></div>
                            </div>
                            <div class = "columnTwo M round shadow">
                                <div class = "rowOne-T roundT">HSET COMMITTEE MEETING</div>
                                <div class = "rowTwo-T roundB dash-resize" id="hseCommitteeMeeting"></div>
                            </div>
                            <div class = "columnThree M round shadow">
                                <div class = "rowOne-T roundT">HSET INDUCTION + TOOLBOX MEETING</div>
                                <div class = "rowTwo-T roundB dash-resize" id="hseToolboxBriefing"></div>
                            </div>
                        </div>
                        <div class = "rowTwo M threeColumn" style = "padding: 0 7px 7px 0; margin-top: -3px">
                            <div class = "columnOne M round shadow">
                                <div class = "rowOne-T roundT">NCR AGEING</div>
                                <div class = "rowTwo-T roundB dash-resize" id="ncrAging"></div>
                            </div>
                            <div class = "columnTwo M round shadow">
                                <div class = "rowOne-T roundT">HSET NON-CONFORMANCE REPORT</div>
                                <div class = "rowTwo-T roundB dash-resize" id="hseNonConformanceReport"></div>
                            </div>
                            <div class = "columnThree M round shadow">
                                <div class = "rowOne-T roundT">TOTAL MAN-HOURS WORKS WITHOUT LTI</div>
                                <div class = "rowTwo-T roundB dash-resize" id="manHourWithoutLti"></div>
                            </div>
                        </div>
                    </div>
                    <div class = "columnTwo S twoRow">
                        <div class="rowOne S oneRow">
                            <div class = "rowOne round shadow">
                                <div class = "rowOne-T roundT">CUMULATIVE TOTAL MAN-HOURS WITHOUT LTI</div>
                                <div class = "rowTwo-T roundB centerMiddle" id="cumulLTI">0</div>
                            </div>
                        </div>
                        <div class="rowTwo L twoRow">
                            <div class = "rowOne M twoRow round shadow">
                                <div class = "rowOne-T roundT">OVERALL ACCIDENT/INCIDENT RECORD</div>
                                <div class = "rowTwo-T roundB dash-resize" id="overallAccidentRecord"></div>
                            </div>
                            <div class = "rowTwo M twoRow round shadow">

                                <div class = "rowOne-T roundT">TRAFFIC ACCIDENT BY LOCATION</div>
                                <div class = "rowTwo-T roundB" id="trafficAccidentLocation"></div>

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
        font-size: 20px !important;
    }

    .showLabel{
        display: none
    }
</style>