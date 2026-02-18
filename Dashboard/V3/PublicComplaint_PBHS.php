<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('publicComplaint_PBHS', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
    </head>
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout oneRow round" id="lOne">
                <div class="rowOne twoRow">
                    <div class="rowOne-T roundT">PUBLIC COMPLAINT</div>
                    <div class="rowTwo-T twoColumn roundB">
                        <div class="columnOne SM flex" style="margin:5px 0 0 5px; height: auto;">
                            <div class="infoContainer">
                                <div class="head">Total Public Complaint</div>
                                <div class="centerMiddlePrint">
                                    <span id = "cardTtl">0</span>
                                </div>
                            </div>
                            <div class="infoContainer shadow">
                                <div class="head">Closed</div>
                                <div class="centerMiddlePrint">
                                    <span id = "cardClose">0</span>
                                </div>
                            </div>
                            <div class="infoContainer shadow">
                                <div class="head">Pending</div>
                                <div class="centerMiddlePrint">
                                    <span id = "cardPending">0</span>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo ML twoRow round" style="margin:5px 0 0 5px; height:calc(100% - 10px);">
                            <div class="rowOne-T roundT">PUBLIC COMPLAINT CATEGORY BY STATUS</div>
                            <div class="rowTwo-T roundB dash-charts risk-charts" id="pcStatusChart"></div>
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
</html>
';

echo $html;
?>

<style type="text/css">
    .white{
        background: white !important;
    }

    .centerMiddlePrint{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .showLabel{
        font-size: 10px;
        display: none;
    }

    .highcharts-menu > li{
        list-style: none !important
    }
    .clickableCard {
        cursor:pointer;
    }
</style>
