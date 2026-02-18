<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('document', false, 0);

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
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
    </head>';
    $themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
    echo '
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout oneRow" id="lOne">
                <div class="rowOne twoRow">
                    <div class="rowOne M twoColumn">
                        <div class="columnOne M twoRow">
                            <div class="rowOne-T round">DOCUMENT</div>
                            <div class="rowTwo-T threeColumn transparent spacerTop">
                                <div class="columnOne ML round">
                                    <div class="rowOne-T roundT">DOCUMENT TYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="numOfDocumentByType"></div>
                                </div> 
                                <div class="columnTwo S round background">
                                    <div class="infoContainer round">
                                        <div class="rowOne-T roundT">TOTAL DOCUMENT</div>
                                        <span id="DocumentCard">0</span>
                                    </div>
                                </div>
                                <div class="columnThree ML twoRow round">
                                    <div class="rowOne-T roundT">DOCUMENT SUBTYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="typeOfdocument"></div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoRow">
                            <div class="rowOne-T round">DRAWING</div>
                            <div class="rowTwo-T twoColumn transparent spacerTop">
                                <div class="columnOne M twoRow round">
                                    <div class="rowOne-T roundT">DRAWING STATUS</div>
                                    <div class="dash-charts rowTwo-T roundB" id="drawingRevisionChart"></div>
                                </div>
                                <div class="columnTwo M twoRow round">
                                    <div class="rowOne-T roundT">DRAWING TYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="drawingTypeChart"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M twoRow">
                        <div class="rowOne-T round">CORRESPONDENCE</div>
                        <div class="rowTwo-T twoColumn transparent">
                            <div class="columnOne M twoColumn" style = "margin-top:10px; height:calc(100% - 10px)">
                                <div class = "columnOne M twoRow round">
                                    <div class="rowOne-T roundT">THIRD PARTY</div>
                                    <div class="dash-charts rowTwo-T roundB" id="corrTypeChart"></div>
                                </div>
                                <div class = "columnTwo M round flex background">
                                    <div class="infoContainer round">
                                        <div class="head black">TOTAL CORRESPONDENCE</div>
                                        <span id="CorrespondenceTotalCard">0</span>
                                    </div>          
                                    <div class="infoContainer round">
                                        <div class="head black">INCOMING THIRD PARTY</div>
                                        <span id="CorrespondenceIncCard">0</span>
                                    </div>
                                    <div class="infoContainer round">
                                        <div class="head black">OUTGOING THIRD PARTY</div>
                                        <span id="CorrespondenceOutCard">0</span>
                                    </div>
                                    <div class="infoContainer round">
                                        <div class="head black">INTERNAL</div>
                                        <span id="InternalInCard">0</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="columnTwo M twoRow round" style = "margin-top:10px; height:calc(100% - 10px)">
                                <div class = "rowOne-T round">CORRESPONDENCE STATUS</div>
                                <div class = "rowTwo-T roundB twoColumn transparent">
                                    <div class = "columnOne M twoRow round" style = "margin-top:10px; height:calc(100% - 10px)">
                                        <div class = "rowOne-T roundT">INTERNAL</div>
                                        <div class = "rowTwo-T roundB dash-charts" id="statusInternal">
                                        </div>
                                    </div>
                                    <div class = "columnTwo M twoRow round" style = "margin-top:10px; height:calc(100% - 10px)">
                                        <div class = "rowOne-T roundT">THIRD PARTY</div>
                                        <div class = "rowTwo-T roundB dash-charts" id="statusThird">
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
    }

    .white {
        background: white !important;
    }

    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .showLabel{
        font-size: 10px;
        display: none;
    }

    .clickableCard {
        cursor:pointer;
    }
</style>