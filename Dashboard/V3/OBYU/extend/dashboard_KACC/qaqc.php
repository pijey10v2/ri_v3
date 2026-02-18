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
                <h4>QUALITY</h4>
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
                <div class="rowOne M twoColumn main-div">
                    <div class="columnOne L twoColumn">
                        <div class="columnOne M40 twoRow">
                            <div class="rowOne M twoRow round shadow">
                                <div class="rowOne-T roundT">NCR BY SOR</div>
                                <div class="rowTwo-T twoRow roundB">
                                    <div class="rowOne M twoColumn">
                                        <div class="columnOne M twoRow flex">
                                            <div class="infoContainer">
                                                <div class="head lightblue">RECEIVED</div>
                                                <span id="bySorNcrReceived">0</span>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head green">CUMULATIVE</div>
                                                <span id="bySorNcrCumul">0</span>
                                            </div>
                                        </div>
                                        <div class="columnTwo M twoRow flex">
                                            <div class="infoContainer">
                                                <div class="head black" style="background-color: #002171">PENDING</div>
                                                <span id="bySorNcrPending">0</span>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head orange">CLOSED</div>
                                                <span id="bySorNcrClosed">0</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowTwo M">
                                        <div class="dash-charts roundB dash-resize" id="bySorStatusChart"></div>
                                    </div>
                                </div> 
                            </div>
                            <div class ="rowTwo M twoRow round shadow">   
                                <div class="rowOne-T roundT">NCR TO SUBCON</div>
                                <div class="rowTwo-T twoRow roundB">
                                    <div class="rowOne M twoColumn">
                                        <div class="columnOne M twoRow flex">
                                            <div class="infoContainer">
                                                <div class="head lightblue">RECEIVED</div>
                                                <span id="toSubConNcrReceived">0</span>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head green">CUMULATIVE</div>
                                                <span id="toSubConNcrCumul">0</span>
                                            </div>
                                        </div>
                                        <div class="columnTwo M twoRow flex">
                                            <div class="infoContainer">
                                                <div class="head black" style="background-color: #002171">PENDING</div>
                                                <span id="toSubConNcrPending">0</span>
                                            </div>
                                            <div class="infoContainer">
                                                <div class="head orange">CLOSED</div>
                                                <span id="toSubConNcrClosed">0</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowTwo M">
                                        <div class="dash-charts roundB dash-resize" id="toSubConStatusChart"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M60 twoRow">
                            <div class="rowOne M twoRow shadow round">
                                <div class="rowOne-T roundT">NCR BY SO REPRESENTATIVE BY CATEGORIES</div>
                                <div class="rowTwo-T twoRow roundB">
                                    <div class="rowOne M60">
                                        <div class="dash-charts dash-resize" id="bySorCatChart"></div>
                                    </div>
                                    <div class="rowTwo M40 infoContainerFlex">
                                        <div class="infoContainer">
                                            <div class="head blue2 centerMiddle">DEVIATION FROM SPEC & DRWG</div>
                                            <div class="twoColumn">
                                                <div class="columnOne M">
                                                    <a class="label">Total</a>
                                                </div>
                                                <div class="columnTwo XL">
                                                    <a class="num" id="document_frm_num_sor_card"> 
                                                        0
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer">
                                            <div class="head orange centerMiddle">
                                                DOCUMENT & DELIVERABLE
                                            </div>
                                            <div class="twoColumn">
                                                <div class="columnOne M">
                                                    <a class="label">Total</a>
                                                </div>
                                                <div class="columnTwo XL">
                                                    <a class="num" id="document_deliv_num_sor_card"> 
                                                        0
                                                    </a>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="infoContainer">
                                            <div class="head red centerMiddle">
                                                INSPECTION & TESTING
                                            </div>
                                            <div class="twoColumn">
                                            <div class="columnOne M">
                                                <a class="label">Total</a>
                                            </div>
                                            <div class="columnTwo XL">
                                                <a class="num" id="inspect_test_sor_card"> 
                                                    0
                                                </a>
                                            </div>
                                        </div>
                                        </div>
                                        <div class="infoContainer">
                                            <div class="head yellow centerMiddle">
                                                LAB & CALIBRATION
                                            </div>
                                            <div class="twoColumn">
                                                <div class="columnOne M">
                                                    <a class="label">Total</a>
                                                </div>
                                                <div class="columnTwo XL">
                                                    <a class="num" id="lab_colab_sor_card"> 
                                                        0
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer">
                                            <div class="head centerMiddle" style="background-color: #002171">
                                                MATERIAL MANAGEMENT
                                            </div>
                                            <div class="twoColumn">
                                                <div class="columnOne M">
                                                    <a class="label">Total</a>
                                                </div>
                                                <div class="columnTwo XL">
                                                    <a class="num" id="material_manage_sor_card"> 
                                                        0
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rowTwo M twoRow shadow round">
                                <div class="rowOne-T roundT">NCR TO SUBCONTRACTOR BY CATEGORIES</div>
                                <div class="rowTwo-T roundB">
                                    <div class="rowOne M60">
                                        <div class="dash-charts dash-resize" id="toSubConCatChart"></div>
                                    </div>
                                    <div class="rowTwo M40 infoContainerflex">
                                        <div class="infoContainer">
                                            <div class="head blue2 centerMiddle">
                                                DOCUMENT FROM
                                                SPEC & DRWG
                                            </div>
                                            <div class="twoColumn">
                                                <div class="columnOne M">
                                                    <a class="label">Total</a>
                                                </div>
                                                <div class="columnTwo XL">
                                                    <a class="num" id="document_frm_num_subcon_card"> 
                                                        0
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer">
                                            <div class="head orange centerMiddle">
                                                DOCUMENT & DELIVERABLE
                                            </div>
                                            <div class="twoColumn">
                                                <div class="columnOne M">
                                                    <a class="label">Total</a>
                                                </div>
                                                <div class="columnTwo XL">
                                                    <a class="num" id="document_deliv_num_subcon_card"> 
                                                        0
                                                    </a>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="infoContainer">
                                            <div class="head red centerMiddle">
                                                INSPECTION & TESTING
                                            </div>
                                            <div class="twoColumn">
                                                <div class="columnOne M">
                                                    <a class="label">Total</a>
                                                </div>
                                                <div class="columnTwo XL">
                                                    <a class="num" id="inspect_test_subcon_card"> 
                                                        0
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer">
                                            <div class="head yellow centerMiddle">
                                                LAB & CALIBRATION
                                            </div>
                                            <div class="twoColumn">
                                                <div class="columnOne M">
                                                    <a class="label">Total</a>
                                                </div>
                                                <div class="columnTwo XL">
                                                    <a class="num" id="lab_colab_subcon_card"> 
                                                        0
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="infoContainer">
                                            <div class="head centerMiddle" style="background-color: #002171">
                                                MATERIAL MANAGEMENT
                                            </div>
                                            <div class="twoColumn">
                                            <div class="columnOne M">
                                                <a class="label">Total</a>
                                            </div>
                                            <div class="columnTwo XL">
                                                <a class="num" id="material_manage_subcon_card"> 
                                                    0
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="columnTwo S twoRow">
                    <div class="rowOne M60 twoColumn">
                        <div class="columnOne M twoRow round shadow">
                            <div class="rowOne-T roundT">MS SUBMISSION</div>
                            <div class="rowTwo-T oneColumn roundB">
                                <div class="columnOne flex">
                                    <div class="infoContainer">
                                        <div class="head red">RECEIVED</div>
                                        <span id="msReceivedCard">0</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head red">CUMULATIVE</div>
                                        <span id="msCumulCard">0</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head red">UNDER REVIEW</div>
                                        <span id="msUnderReviewCard">0</span>
                                    </div>    
                                    <div class="infoContainer">
                                        <div class="head red">APPROVED</div>
                                        <span id="msApprovedCard">0</span>
                                    </div>   
                                    <div class="infoContainer">
                                        <div class="head red">REJECTED</div>
                                        <span id="msUnApprovedCard">0</span>
                                    </div>  
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoRow round shadow">
                            <div class="rowOne-T roundT">MT SUBMISSION</div>
                            <div class="rowTwo-T oneColumn roundB">
                                <div class="columnOne flex">
                                    <div class="infoContainer">
                                        <div class="head Lblue">RECEIVED</div>
                                        <span id="maReceivedCard">0</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head Lblue">CUMULATIVE</div>
                                        <span id="maCumulCard">0</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head Lblue">UNDER REVIEW</div>
                                        <span id="maUnderReviewCard">0</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head Lblue">APPROVED</div>
                                        <span id="maApprovedCard">0</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head Lblue">REJECTED</div>
                                        <span id="maUnApprovedCard">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M40 twoRow round shadow">
                        <div class="rowOne-T roundT">WIR SUBMISSION</div>
                        <div class="rowTwo-T twoColumn roundB">
                            <div class="columnOne M flex">
                                <div class="infoContainer">
                                    <div class="head red">SUBMITTED</div>
                                    <span id="wirSubmittedCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head red">REJECTED</div>
                                    <span id="wirUnapprovedCard">0</span>
                                </div>    
                                <div class="infoContainer">
                                    <div class="head red">CANCELLED</div>
                                    <span id="wirCancelledCard">0</span>
                                </div>                                
                            </div>
                            <div class="columnTwo M flex">
                                <div class="infoContainer">
                                    <div class="head red">APPROVED</div>
                                    <span id="wirApprovedCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head red">UNDER REVIEW</div>
                                    <span id="wirUnderReviewCard">0</span>
                                </div>    
                                <div class="infoContainer">
                                    <div class="head red">CLOSED</div>
                                    <span id="wirClosedCard">0</span>
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

    .dashboardHeader > img {
        margin: 12px;
        cursor: pointer;
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
        font-size: x-large;
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
        padding: 0px 15px 0px 15px;
    }
    .cutoff-text {
        text-align: right;
        font-size: 15px;
        padding-right: 15px;
    }
    .corrByCatDiv{
        overflow-y: auto;
    }
    .corrTotalInfoDiv {
        height: 20.5%!important;
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
    /* .rowOne .containerHeader{
        font-size: 100px;
    } */
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
    .ncrStatusCardDiv {
        height: 45%!important;
    }

    . {
        line-height: 20px!important;
    }
    .ncrStatusChart {
        margin-left: 10px;
        margin-right: 10px;
        width: 95%!important;
    }
    .ncrCatChart {
        margin-top: 10px;
    }
    .msMaDiv {
        height: 60%!important;
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