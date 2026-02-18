<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('document_SSLR2', false, 0);

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
                                        <b id="CorrespondenceTotalCard">0</b>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">THIRD PARTY</div>
                                        <div class="cor-cat-no-card">
                                            <div class="responded-text text-large" id="CorrThirdPartyOutCard"><span class="clickableCard outgoing-text" onclick="">0</span></div>
                                            <div class="total-card text-small">Total: <span id="CorrThirdPartyTotalCard"><span class="clickableCard" onclick="">0</span></span></div>
                                            <div class="pending-text text-large" id="CorrThirdPartyInCard"><span class="clickableCard incoming-text" onclick="">0</span></div>
                                        </div>
                                        <div class="main-perc roundB" style="opacity: 1;">
                                            <div class="barInner incForInfo roundB" style="width: 1.94175%;">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">INTERNAL</div>
                                        <div class="cor-cat-no-card">
                                            <div class="responded-text text-large" id="CorrInternalOutCard"><span class="clickableCard outgoing-text" onclick="">0</span></div>
                                            <div class="total-card text-small">Total: <span id="CorrInternalTotalCard"><span class="clickableCard" onclick="">0</span></span></div>
                                            <div class="pending-text text-large" id="CorrInternalInCard"><span class="clickableCard incoming-text" onclick="">0</span></div>
                                        </div>
                                    </div>
                                    <div class="tableContainer legend info-margin round">
                                        <table class="legend"> 
                                            <tbody>
                                                <tr>
                                                    <td>Incoming</td>
                                                    <td class="incoming"></td>
                                                </tr>
                                                <tr>
                                                    <td>Outgoing</td>
                                                    <td class="outgoing"></td>
                                                </tr>
                                            </tbody>
                                        </table>
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

    .cor-cat-no-card {
        display: flex;
        justify-content: space-between;
        padding: 0 5% 0 5%;
    }

    .info-margin{
        margin: auto 5px;
    }

    .incoming{
        background-color: var(--text-primary-light);
    }

    .incoming-text{
        color: var(--text-primary-light);
    }

    .outgoing{
        background-color: var(--notAvailable);
    }

    .outgoing-text{
        color: var(--notAvailable);
    }
</style>