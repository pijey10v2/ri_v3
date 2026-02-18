<?php
// check if login or not here
include_once dirname(__DIR__).'/../dashboard.class.OBYU.php';
$dashObj = RiDashboard::load('stakeholder');

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
    <body class = "softBackground '.$themeClass.'">';
if($showFilter){
    $html .=
        '<div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>';
}
if ($showHeader) {
    $html .= 
    '<div class = "dashboardHeader softHeader">
        <div class = "title">
            <h4>STAKEHOLDER MANAGEMENT DASHBOARD</h4>
            <h3>'.$dashObj->projectInfo['project_name'].'</h3>
        </div>
        <img src="../../../../../Images/icons/form/refresh.png" width=20 height="20" onClick="window.location.reload()" />
        <div class = "lastUpdate">
            <div> As at  |  
                <div class="cutOffDateValue"><span id="cutOff-day">'.$dashObj->cutoffDay.'</span>&nbsp;<span id="cutOff-month">'.date("F", strtotime($dashObj->cutOffDate)).'</span>&nbsp;<span id="cutOff-year">'.date("Y", strtotime($dashObj->cutOffDate)).'</span></div>
            </div>
        </div>
        <div class = "logo right">
            <img src ='.$prefix.''.$dashObj->projectInfo['icon_url'].'>
        </div>
    </div>';
}
    $html .= 
        '<div class = "dashboardBody softBackground">';
if($showFilter){
    $html .=
            '<div class = "sideBar">
                <div class="filterContainer">
                    <div class="filter" id = "softTitle" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select onchange="refreshDashboard()" id="wpcFilter">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" >'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter" id = "softTitle">
                        <label>Year</label><br>
                        <select onchange="refreshDashboard()" id = "yearFilter">
                            <option value="all">---</option>';
                            foreach ($dashObj->yearOptions['overall'] as $year) {
                                $html .= '<option value="'.$year.'">'.$year.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter" id = "softTitle">
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
            '<div class = "layout oneRow">
                <div class="rowOne M twoRow">
                    <div class="rowOne M twoColumn heightFill">
                        <div class="columnOne S twoRow">
                            <div class="rowOne S round shadow twoRow" style="">
                                <div class = "rowOne-T roundT shadow" id = "softTitle">NUMBER OF EVENTS</div>
                                <div class = "rowTwo-T roundB shadow infoContainerDiv" id="softBackgroundCard">
                                    <div class="numberContainerText">
                                        <a class="textLabel" id="noEvent">0</a>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo L">
                                <div class = "rowOne-T roundT shadow" id = "softTitle">TYPE OF EVENTS</div>
                                <div class = "rowTwo-T roundB shadow dash-resize" id="typeEvents"></div>
                            </div>
                        </div>
                        <div class="columnTwo L twoRow">
                            <div class="rowOne M round shadow tableCell">
                                <div class="rowOne-T roundT" id = "softTitle">EVENT DETAILS</div>
                                <div class="rowTwo-T tableContainer scrollbar-inner roundB" id="softBackgroundCard">
                                    <table id ="" class=""> 
                                        <thead>
                                            <th class="softTh">Category</th>
                                            <th class="softTh">Type of Event</th>
                                            <th class="softTh">Location</th>
                                            <th class="softTh">Description</th>
                                            <th class="softTh">Status</th>
                                        </thead>
                                        <tbody id="eventTable" style: "text-align: center></tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="rowTwo M round shadow">
                                <div class="rowOne-T roundT" id = "softTitle">TYPE OF EVENTS</div>
                                <div class="rowTwo-T tableContainer scrollbar-inner roundB" id="eventType">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M twoColumn heightFill">
                        <div class="columnOne S twoRow">
                            <div class="rowOne S round shadow twoRow" style="">
                                <div class = "rowOne-T roundT shadow" id = "softTitle">NUMBER OF COMPLAINTS</div>
                                <div class = "rowTwo-T roundB shadow infoContainerDiv" id="softBackgroundCard">
                                    <div class="numberContainerText">
                                        <a class="textLabel" id="noComplaint">0</a>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo L">
                                <div class = "rowOne-T roundT shadow" id = "softTitle">CATEGORY OF COMPLAINTS</div>
                                <div class = "rowTwo-T roundB shadow dash-resize" id="categoryComplaint"></div>
                            </div>
                        </div>
                        <div class="columnTwo L twoRow">
                            <div class="rowOne M round shadow tableCell">
                                <div class="rowOne-T roundT" id = "softTitle">COMPLAINT DETAILS</div>
                                <div class="rowTwo-T tableContainer scrollbar-inner roundB" id="softBackgroundCard">
                                    <table id ="" class=""> 
                                        <thead>
                                            <th style = "text-align: center" class="softTh">Client Ref. No</th>
                                            <th style = "text-align: center" class="softTh">Complaint Ref. No</th>
                                            <th style = "text-align: center" class="softTh">Date</th>
                                            <th style = "text-align: center" class="softTh">Category of Complaint</th>
                                            <th class="softTh">Type of Complaint</th>
                                            <th style = "text-align: center" class="softTh">Status</th>
                                            <th style = "text-align: center" class="softTh">Resolution Time (Days)</th>
                                            <th style = "text-align: center" class="softTh">Non-Project Related</th>
                                        </thead>
                                        <tbody id="publicTable"></tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="rowTwo M round shadow">
                                <div class="rowOne-T roundT" id = "softTitle">CATEGORY OF COMPLAINTS</div>
                                <div class="rowTwo-T tableContainer scrollbar-inner roundB" id="pbcType">
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
    .softBackground{
        background-color: #efeadc !important;
    }
    #softBackgroundCard{
        background-color: #efeadc !important;
        overflow: hidden;
    }
    .softHeader{
        background: #c97148;
        color: white;
    }
    #softTitle{
        background: #d79373;
        color: white;
    }
    .softTh{
        background: #ffc6ab !important;
        color: black !important;
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
    .lastUpdate >img{
        height: 18px;
        margin-top: 12px;
        margin-right: 4px;
    }  
    .lastUpdate {
        height: 18px;
        margin-top: 12px;
        margin-right: 4px;
        color: white!important;
    }
    .numberContainerText{
        margin: auto 10px auto 10px !important;
    }
    .textLabel{
        font-size:13px;
    }
    .showLabel{
        display: none
    }
</style>