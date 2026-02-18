<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('document_PBHS', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$showHeader = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
}

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
    </head>';
        $themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
    echo '
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout oneRow" id="lOne">
                <div class="columnOne twoRow main-div">
                    <div class="rowOne M twoColumn">
                        <div class="columnOne M twoRow">
                            <div class="rowOne-T round" style="background: #3E3A4F;">DOCUMENT</div>
                            <div class="rowTwo-T threeColumn transparent spacerTop">
                                <div class="columnOne ML round shadow">
                                    <div class="rowOne-T roundT" style="background: #4C4C4C;">DOCUMENT TYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="numOfDocumentByType"></div>
                                </div> 
                                <div class="columnTwo SM round shadow background">
                                    <div class="infoContainer round shadow">
                                        <div class="rowOne-T roundT" style="background: #4C4C4C;">TOTAL DOCUMENT</div>
                                        <span id="DocumentCard">0</span>
                                    </div>
                                </div>
                                <div class="columnThree ML twoRow round shadow">
                                    <div class="rowOne-T roundT" style="background: #4C4C4C;">DOCUMENT SUBTYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="typeOfdocument"></div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoRow">
                            <div class="rowOne-T round" style="background: #3E3A4F;">DRAWING</div>
                            <div class="rowTwo-T twoColumn transparent spacerTop">
                                <div class="columnOne M twoRow round shadow">
                                    <div class="rowOne-T roundT"  style="background: #4C4C4C;">DRAWING STATUS</div>
                                    <div class="dash-charts rowTwo-T roundB" id="drawingRevisionChart"></div>
                                </div>
                                <div class="columnTwo M twoRow round shadow">
                                    <div class="rowOne-T roundT"  style="background: #4C4C4C;">DRAWING TYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="drawingTypeChart"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M twoRow">
                        <div class="rowOne-T round" style="background: #3E3A4F;">CORRESPONDENCE</div>
                        <div class="rowTwo-T twoColumn transparent">
                            <div class="columnOne M twoColumn" style = "margin-top:10px; height:calc(100% - 10px)">
                                <div class = "columnOne M twoRow round shadow">
                                    <div class="rowOne-T roundT"  style="background: #4C4C4C;">CORRESPONDENCE TYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="corrTypeChart"></div>
                                </div>
                                <div class = "columnTwo M round shadow flex background">
                                    <div class="infoContainer round shadow">
                                        <div class="head black" style="background: #E0DECC; color: black;">OVERALL TOTAL CORRESPONDENCE</div>
                                        <span id="CorrespondenceTotalCard">0</span>
                                    </div>          
                                    <div class="infoContainer round shadow">
                                        <div class="head black" style="background:#F0CB69">INCOMING</div>
                                        <span id="CorrespondenceIncCard">0</span>
                                    </div>
                                    <div class="infoContainer round shadow">
                                        <div class="head black" style="background: #4C4C4C">OUTGOING</div>
                                        <span id="CorrespondenceOutCard">0</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="columnTwo M twoRow round" style = "margin-top:10px; height:calc(100% - 10px)">
                                <div class = "rowOne-T round"  style="background: #4C4C4C;">CORRESPONDENCE STATUS</div>
                                <div class = "rowTwo-T roundB twoColumn transparent">
                                    <div class = "columnOne M twoRow round shadow" style = "margin-top:10px; height:calc(100% - 10px)">
                                        <div class = "rowOne-T roundT"  style="background: #4C4C4C;">INCOMING</div>
                                        <div class = "rowTwo-T roundB dash-charts" id="statusInCorr">
                                        </div>
                                    </div>
                                    <div class = "columnTwo M twoRow round shadow" style = "margin-top:10px; height:calc(100% - 10px)">
                                        <div class = "rowOne-T roundT"  style="background: #4C4C4C;">OUTGOING</div>
                                        <div class = "rowTwo-T roundB dash-charts" id="statusOutCorr">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="loader" style="display:none;">
            <div class="cube-wrapper">
                <div class="cube-folding">
                    <span class="leaf1"></span>
                    <span class="leaf2"></span>
                    <span class="leaf3"></span>
                    <span class="leaf4"></span>
                </div>
                <span class="loading" data-name="Loading">Working</span>
            </div>
        </div>
        <script src="../../JS/dashboard/dashboardv3.js"></script>
    </body>
</html>';

echo $html;

?>

<style type="text/css">
    .main-div {
        height: 100%;
        width: 100%;
    }

    .white {
        background: white !important;
    }

    .showLabel{
        font-size: 10px;
        display: none;
    }

    .highcharts-menu > li{
        list-style: none !important
    }

    .highcharts-data-label-connector {
        display: none;
    }

    .highcharts-data-label{
        display: none;
    }
    
    .clickableCard {
        cursor:pointer;
    }
</style>
