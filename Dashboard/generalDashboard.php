<?php
// check if login or not here
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('general');

$modeTheme = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : '';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/blue/generaldashboard.css">                <!--     CSS for general CSS-->
        <link rel="stylesheet" href="../CSS/blue/RVguiStyle.css">  
        <link rel="stylesheet" href="../CSS/jquery.scrollbar.css">
        <script src="../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
        <script src="../JS/JsLibrary/jquery.scrollbar.js"></script>
    </head>
    <body class="'.$modeTheme.'">
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class = "dashboardBody">
            <div class="layout twoRow ls" id="">
                <div class="rowOne M twoColumn">
                    <div class="columnOne L twoRow round shadow">
                        <div class="rowOne-T roundT roundT">
                            <span>PROJECT</span>
                        </div>
                        <div class="rowTwo-T twoColumn roundB">
                            <div class="columnOne S twoRow">
                                <div class="rowOne ML" id="projectDuration"></div>
                                <div class="rowTwo SM twoColumn addPadding">
                                    <div class="columnOne M oneRow">
                                        <div class="rowOne alignSub">
                                            <div class="subData">
                                                <span style = "font-weight: bold">22/12/2021</span><br>
                                                <span class="subTitle">Start Date</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="columnTwo M oneRow">
                                        <div class="rowOne alignSub">
                                            <div class="subData">
                                                <span style = "font-weight: bold">21/12/2022</span><br>
                                                <span class="subTitle">End Date</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo L twoColumn">
                                <div class="columnOne M" id="phyScurve">
                                </div>
                                <div class="columnTwo M" id="finScurve">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo S twoRow round shadow">
                        <div class="rowOne-T roundT">CONTRACT</div>
                        <div class="rowTwo-T roundB">
                            <div class="tableContainer scrollbar-inner roundB" id = "dashboarditem">
                                <table> 
                                    <tbody id = "contractDetails">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M rowTwo round shadow">
                    <div class="rowOne-T roundT">DOCUMENT</div>
                    <div class="rowTwo-T twoColumn roundB">
                        <div class="columnOne L twoRow">
                            <div class="rowOne L threeColumn">
                                <div class="columnOne M">
                                </div>
                                <div class="columnTwo M">
                                </div>
                                <div class="columnThree M">
                                </div>
                            </div>
                            <div class="rowTwo S alignSub">
                                <div class="subData">
                                    <span class="mainTitle">TOTAL DOCUMENT</span>
                                    <span class="mainSubTitle">5</span>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo S twoRow">
                            <div class="rowOne L">
                            </div>
                            <div class="rowTwo S alignSub">
                                <div class="subData">
                                    <span class="mainTitle">TOTAL CORRESPONDENCE</span>
                                    <span class="mainSubTitle">7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="../JS/dashboard/dashboardv3.js"></script>
        <script src="../JS/v3.js"></script>

    </body>
</html>
';

echo $html;

?>
<style type="text/css">

    .alignSub{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .highcharts-data-labels.highcharts-solidgauge-series > .highcharts-data-label-hidden{
        opacity: 1 !important;
    }
</style>